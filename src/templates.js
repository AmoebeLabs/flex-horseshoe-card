// templates.js

export default class Templates {
  static context = {};

  static javascriptTemplateFlags = new WeakMap();

  static javascriptFunctionCache = new Map();

  static setContext(context = {}) {
    Templates.context = context;
  }

  /**
   * Detects JavaScript templates in one finalized config component.
   *
   * This pass runs after ref(), calc() and same_as. Flags are stored outside the
   * user config, so no internal metadata can become a visible YAML/config key.
   * Arrays, object values and object keys are all included because templates may
   * return complete config shapes and color stops support dynamic keys.
   *
   * @param {*} value - Finalized entity, layout item, animation, card style or group config.
   * @returns {boolean} True when this value or one of its descendants contains JavaScript.
   */
  static detectJavascriptTemplates(value) {
    if (typeof value === 'string') return Templates.isJsTemplate(value);

    if (Array.isArray(value)) {
      let hasJavascript = false;

      value.forEach((entry) => {
        if (Templates.detectJavascriptTemplates(entry)) hasJavascript = true;
      });

      Templates.javascriptTemplateFlags.set(value, hasJavascript);

      return hasJavascript;
    }

    if (Templates.isPlainObject(value)) {
      let hasJavascript = false;

      Object.entries(value).forEach(([key, entryValue]) => {
        if (Templates.isJsTemplate(key)) hasJavascript = true;
        if (Templates.detectJavascriptTemplates(entryValue)) hasJavascript = true;
      });

      Templates.javascriptTemplateFlags.set(value, hasJavascript);

      return hasJavascript;
    }

    return false;
  }

  /**
   * Returns JavaScript metadata recorded for a finalized config component.
   *
   * @param {*} value - Previously scanned config component.
   * @returns {boolean} True when the component contains JavaScript.
   */
  static hasJavascriptTemplates(value) {
    if (typeof value === 'string') return Templates.isJsTemplate(value);
    if (value && typeof value === 'object') {
      if (!Templates.javascriptTemplateFlags.has(value)) Templates.detectJavascriptTemplates(value);

      return Templates.javascriptTemplateFlags.get(value) === true;
    }

    return false;
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
    return Templates._getJsTemplateOrValue(item, value, options, 0);
  }

  static _getJsTemplateOrValue(item, value, options = {}, depth = 0) {
    const { resolveKeys = true, maxDepth = 10 } = options;

    if (depth >= maxDepth) return value;

    if (value === undefined || value === null) return value;

    if (['number', 'boolean', 'bigint', 'symbol'].includes(typeof value)) {
      return value;
    }

    if (Array.isArray(value)) {
      return value.map((entry) => Templates._getJsTemplateOrValue(item, entry, options, depth));
    }

    if (Templates.isPlainObject(value)) {
      return Object.fromEntries(
        Object.entries(value).map(([key, entryValue]) => {
          const resolvedKey = resolveKeys ? Templates._getJsTemplateOrValue(item, key, options, depth) : key;

          const resolvedValue = Templates._getJsTemplateOrValue(item, entryValue, options, depth);

          return [String(resolvedKey), resolvedValue];
        }),
      );
    }

    if (typeof value !== 'string') return value;

    const trimmedValue = value.trim();

    if (!Templates.isJsTemplate(trimmedValue)) return value;

    const evaluatedValue = Templates.evaluateJsTemplate(item, Templates.extractJsTemplateCode(trimmedValue));

    return Templates._getJsTemplateOrValue(item, evaluatedValue, options, depth + 1);
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
   * Exposes `hass`, `config`, `entity`, `entities`, `states`, `constants`,
   * `item`, and `user` to the template. Errors are logged only when dev debug is enabled and return
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
    const constants = config?.constants ?? {};
    const user = hass?.user;
    if (config?.dev?.debug) {
      console.log('Evaluating JavaScript template with context:', {
        hass,
        config,
        entity,
        entities,
        states,
        state,
        constants,
        item,
        user,
      });
    }
    try {
      let fn = Templates.javascriptFunctionCache.get(javascript);

      if (!fn) {
        // eslint-disable-next-line no-new-func
        fn = new Function(
          'hass',
          'config',
          'entity',
          'entities',
          'states',
          'state',
          'constants',
          'item',
          'user',
          `
            "use strict";
            ${javascript}
          `,
        );
        Templates.javascriptFunctionCache.set(javascript, fn);
      }

      return fn(hass, config, entity, entities, states, state, constants, item, user);
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
    if (item.entity_index === undefined || item.entity_index === null) return undefined;

    const entityIndex = Number(item.entity_index);
    return Number.isFinite(entityIndex) ? entityIndex : undefined;
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
