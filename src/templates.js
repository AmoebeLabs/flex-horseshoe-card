// templates.js

export default class Templates {
  static context = {};

  static setContext(context = {}) {
    Templates.context = context;
  }

  /**
   * Resolves JavaScript templates inside supported config values.
   *
   * Accepts primitives, strings, arrays, and plain objects. Arrays are resolved
   * entry-by-entry for YAML array style declarations, and object keys are also
   * resolved unless `options.resolveKeys` is false. Full-string `[[[ ... ]]]`
   * templates may return another supported shape, which is resolved again.
   *
   * @param {object} item Card item context exposed to templates.
   * @param {*} value Config value or nested config shape to resolve.
   * @param {{ resolveKeys?: boolean }} [options={}] Resolution options.
   * @returns {*} The resolved value, preserving null, undefined, and non-string primitives.
   */
  static getJsTemplateOrValue(item, value, options = {}) {
    const { resolveKeys = true } = options;

    if (value === undefined || value === null) return value;

    if (['number', 'boolean', 'bigint', 'symbol'].includes(typeof value)) {
      return value;
    }

    if (Array.isArray(value)) {
      return value.map((entry) => Templates.getJsTemplateOrValue(item, entry, options));
    }

    if (Templates.isPlainObject(value)) {
      return Object.fromEntries(
        Object.entries(value).map(([key, entryValue]) => {
          const resolvedKey = resolveKeys ? Templates.getJsTemplateOrValue(item, key, options) : key;

          const resolvedValue = Templates.getJsTemplateOrValue(item, entryValue, options);

          return [String(resolvedKey), resolvedValue];
        }),
      );
    }

    if (typeof value !== 'string') return value;

    const trimmedValue = value.trim();

    if (Templates.isJsTemplate(trimmedValue)) {
      const evaluatedValue = Templates.evaluateJsTemplate(item, Templates.extractJsTemplateCode(trimmedValue));

      return Templates.getJsTemplateOrValue(item, evaluatedValue, options);
    }

    return value;
  }

  /**
   * Resolves legacy JavaScript templates in config values.
   *
   * Accepts primitives, strings, arrays, and plain objects. Arrays are resolved
   * recursively for YAML array style declarations, while object keys are kept as
   * written. Full-string `[[[ ... ]]]` templates may return nested shapes or
   * another template string, which are resolved again.
   *
   * @param {object} item Card item context exposed to templates.
   * @param {*} value Config value or nested config shape to resolve.
   * @returns {*} The resolved value, preserving null, undefined, and non-string primitives.
   */
  static getJsTemplateOrValueV1(item, value) {
    // Keep undefined and null unchanged.
    if (value === undefined || value === null) return value;

    // Primitive non-string values cannot contain templates.
    if (['number', 'boolean', 'bigint', 'symbol'].includes(typeof value)) {
      return value;
    }

    // Resolve every item in an array.
    // This is used heavily by YAML styles arrays.
    if (Array.isArray(value)) {
      return value.map((entry) => Templates.getJsTemplateOrValue(item, entry));
    }

    // Resolve every value in an object without mutating the original config.
    if (Templates.isPlainObject(value)) {
      return Object.fromEntries(Object.entries(value).map(([key, entryValue]) => [key, Templates.getJsTemplateOrValue(item, entryValue)]));
    }

    // At this point only strings can contain template syntax.
    if (typeof value !== 'string') return value;

    const trimmedValue = value.trim();

    // JavaScript templates must occupy the full string and be wrapped in:
    // [[[ ... ]]]
    if (Templates.isJsTemplate(trimmedValue)) {
      const javascript = Templates.extractJsTemplateCode(trimmedValue);
      const evaluatedValue = Templates.evaluateJsTemplate(item, javascript);

      // Template output may itself be a dict, array, string, or nested template.
      return Templates.getJsTemplateOrValue(item, evaluatedValue);
    }

    // Plain string, no template.
    return value;
  }

  /**
   * Checks whether a value is a full JavaScript template string.
   *
   * @param {*} value Value to test.
   * @returns {boolean} True when the trimmed string starts with `[[[` and ends with `]]]`.
   */
  static isJsTemplate(value) {
    return typeof value === 'string' && value.trim().startsWith('[[[') && value.trim().endsWith(']]]');
  }

  /**
   * Extracts the JavaScript body from a full template string.
   *
   * @param {*} value Template-like value to trim and unwrap.
   * @returns {string} Inner JavaScript without the surrounding `[[[` and `]]]`.
   */
  static extractJsTemplateCode(value) {
    return String(value).trim().slice(3, -3).trim();
  }

  /**
   * Runs JavaScript template code with the current card and Home Assistant context.
   *
   * Exposes `hass`, `config`, `entity`, `entities`, `states`, `item`, and `user`
   * to the template. Errors are logged only when dev debug is enabled and return
   * `undefined`.
   *
   * @param {object} item Card item context used to pick the active entity.
   * @param {string} javascript JavaScript function body to evaluate.
   * @returns {*} Template return value, or undefined when evaluation fails.
   */
  static evaluateJsTemplate(item, javascript) {
    const { hass, config, entities = [] } = Templates.context;

    const entityIndex = Templates._getItemEntityIndex(item);
    const state = Templates._getTemplateState(item);
    const entity = entities?.[entityIndex];
    const states = hass?.states;
    const user = hass?.user;
    if (config?.dev?.debug) {
      console.log('Evaluating JavaScript template with context:', {
        hass,
        config,
        entity,
        entities,
        states,
        state,
        item,
        user,
      });
    }
    try {
      // eslint-disable-next-line no-new-func
      const fn = new Function(
        'hass',
        'config',
        'entity',
        'entities',
        'states',
        'state',
        'item',
        'user',
        `
          "use strict";
          ${javascript}
        `,
      );

      return fn(hass, config, entity, entities, states, state, item, user);
    } catch (error) {
      if (config?.dev?.debug) {
        console.error('[templates] JavaScript template error:', {
          error,
          item,
          javascript,
        });
      }

      return undefined;
    }
  }
  /** *****************************************************************************
   * Returns the state value that should be used for JavaScript templates.
   *
   * If the configured entity uses an attribute, that attribute value is returned.
   * Otherwise the normal entity state is returned.
   *
   * This allows templates to simply use `state`, regardless of whether the card
   * displays the entity state itself or one of its attributes.
   */

  static _getTemplateState(item = {}) {
    const entityIndex = Templates._getItemEntityIndex(item);
    const entityState = Templates.context.entities?.[entityIndex];
    const entityConfig = Templates.context.config?.entities?.[entityIndex] || {};

    // Entity may not be available yet during initial render or reload.
    if (!entityState) return undefined;

    const attribute = entityConfig.attribute;

    // If an attribute is configured and available, use that as template state.
    // The explicit !== undefined check keeps valid values like 0, false and ''
    // from being ignored.
    if (attribute && entityState.attributes && entityState.attributes[attribute] !== undefined) {
      return entityState.attributes[attribute];
    }

    // Fallback to the regular Home Assistant entity state.
    return entityState.state;
  }

  static _getItemEntityIndex(item = {}) {
    const entityIndex = Number(item.entity_index);
    return Number.isFinite(entityIndex) ? entityIndex : 0;
  }

  /**
   * Checks for plain object config shapes.
   *
   * @param {*} value Value to test.
   * @returns {boolean} True for non-null objects that are not arrays.
   */
  static isPlainObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }
}
