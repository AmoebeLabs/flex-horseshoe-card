export default class Templates {
  static javascriptTemplateFlags = new WeakMap();

  static javascriptFunctionCache = new Map();

  /**
   * Creates the JavaScript template context for one FHS card.
   *
   * Templates read the current HA object, Lovelace config, entity values, and
   * named entity_slots here. The shared entities array keeps its identity while
   * HA and FHS entity values change.
   *
   * @param {Array<object>} entities - Shared array of HA and FHS entity values used by card tools and templates.
   */
  constructor(entities) {
    this.context = {
      hass: undefined,
      config: undefined,
      entities,
      entity_slots: undefined,
    };
  }

  /**
   * Starts a new Lovelace config and clears named entity_slots from the previous
   * card config.
   */
  beginConfig(config) {
    this.context.config = config;
    this.context.entity_slots = undefined;
  }

  /** Stores the final named entity slots after disabled entries have been removed. */
  setEntitySlots(entitySlots) {
    this.context.entity_slots = entitySlots;
  }

  /**
   * Stores the latest HA object before the card evaluates templates for this update.
   */
  setHass(hass) {
    this.context.hass = hass;
  }

  /** Records whether this config value contains [[[ ... ]]] JavaScript templates. */
  detectJavascriptTemplates(value) {
    return Templates.detectJavascriptTemplates(value);
  }

  /** Returns whether this config value contains [[[ ... ]]] JavaScript templates. */
  hasJavascriptTemplates(value) {
    return Templates.hasJavascriptTemplates(value);
  }

  /** Evaluates a tool's [[[ ... ]]] config using the current HA data and entity values. */
  getJsTemplateOrValue(item, value, options = {}) {
    return this._getJsTemplateOrValue(item, value, options, 0, []);
  }

  /**
   * Scans a finalized FHS config value and its object keys for [[[ ... ]]] JavaScript.
   *
   * This runs after FHS expands ref(), calc(), and same_as(), so templates those
   * features add are included. Array entries, object values, and keys are scanned
   * because templates can return config shapes and color stops can have dynamic keys.
   * Keep the scan flags outside the Lovelace config so it gains no internal fields.
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
   * Returns whether a previously scanned config value contains JavaScript.
   *
   * @param {*} value - Config value previously passed to detectJavascriptTemplates.
   * @returns {boolean} True when this value contains JavaScript.
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
   * Evaluates JavaScript templates inside supported config values.
   *
   * Evaluates strings inside arrays and objects, including object keys when
   * `options.resolveKeys` is true. A full-string `[[[ ... ]]]` template can return
   * another array, object, or template string, which is evaluated the same way.
   *
   * @param {object} item - Tool or nested item exposed to its templates.
   * @param {*} value - Config value or nested config shape to evaluate.
   * @param {{ resolveKeys?: boolean }} [options={}] - Whether to evaluate object keys as well as values.
   * @returns {*} Config value with its [[[ ... ]]] templates evaluated.
   */

  _getJsTemplateOrValue(item, value, options, depth, path) {
    const { resolveKeys = true, maxDepth = 10 } = options;

    // Control leaves templates in nested Text, Icon, Name, Area, State, and value
    // items for each generated tool to evaluate with that item's entity context.
    // Other FHS templates are evaluated recursively here.
    if (options.preserve?.(path)) return value;

    if (depth >= maxDepth) return value;

    if (value === undefined || value === null) return value;

    if (['number', 'boolean', 'bigint', 'symbol'].includes(typeof value)) {
      return value;
    }

    if (Array.isArray(value)) {
      return value.map((entry, index) => this._getJsTemplateOrValue(item, entry, options, depth, options.preserve ? [...path, index] : path));
    }

    if (Templates.isPlainObject(value)) {
      return Object.fromEntries(
        Object.entries(value).map(([key, entryValue]) => {
          const resolvedKey = resolveKeys ? this._getJsTemplateOrValue(item, key, options, depth, options.preserve ? [...path, '$key'] : path) : key;

          const resolvedValue = this._getJsTemplateOrValue(item, entryValue, options, depth, options.preserve ? [...path, String(resolvedKey)] : path);

          return [String(resolvedKey), resolvedValue];
        }),
      );
    }

    if (typeof value !== 'string') return value;

    const trimmedValue = value.trim();

    if (!Templates.isJsTemplate(trimmedValue)) return value;

    const evaluatedValue = this.evaluateJsTemplate(item, Templates.extractJsTemplateCode(trimmedValue));

    return this._getJsTemplateOrValue(item, evaluatedValue, options, depth + 1, path);
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
   * @param {*} value - Full `[[[ ... ]]]` template string.
   * @returns {string} JavaScript body enclosed by the template markers.
   */
  static extractJsTemplateCode(value) {
    return String(value).trim().slice(3, -3).trim();
  }

  /**
   * Runs an FHS JavaScript template with current Home Assistant data and card config.
   *
   * Exposes `hass`, `config`, `entity`, `entities`, `states`, `state`, `constants`,
   * `entity_slots`, `item`, and `user`. Errors are logged only when dev debug is
   * enabled, and an evaluation error returns `undefined`.
   *
   * @param {object} item - Tool or nested item whose entity_index selects `entity` and `state`.
   * @param {string} javascript - JavaScript function body to evaluate.
   * @returns {*} Template value, or undefined when evaluation fails.
   */
  evaluateJsTemplate(item, javascript) {
    const {
      hass, config, entities, entity_slots,
    } = this.context;

    const entityIndex = Templates._getItemEntityIndex(item);
    const state = this._getTemplateState(item);
    const entity = entities[entityIndex];
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
        entity_slots,
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
          'entity_slots',
          'item',
          'user',
          `
            "use strict";
            ${javascript}
          `,
        );
        Templates.javascriptFunctionCache.set(javascript, fn);
      }

      return fn(hass, config, entity, entities, states, state, constants, entity_slots, item, user);
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
   * A configured attribute supplies the template state. Entity configurations
   * using their primary state supply the Home Assistant entity state.
   *
   * This allows templates to simply use `state`, regardless of whether the card
   * displays the entity state itself or one of its attributes.
   */

  _getTemplateState(item = {}) {
    const entityIndex = Templates._getItemEntityIndex(item);
    const entityState = this.context.entities[entityIndex];
    const entityConfig = this.context.config.entities[entityIndex];

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

  /**
   * Extracts the numeric entity index used to evaluate an item's templates.
   *
   * @param {object} item - Tool or nested visual configuration.
   * @returns {number|undefined} Numeric entity index.
   */
  static _getItemEntityIndex(item = {}) {
    if (item.entity_index === undefined || item.entity_index === null) return undefined;

    const entityIndex = Number(item.entity_index);
    return Number.isFinite(entityIndex) ? entityIndex : undefined;
  }

  /**
   * Checks whether a value is an object other than an array.
   *
   * @param {*} value Value to test.
   * @returns {boolean} True for non-null objects that are not arrays.
   */
  static isPlainObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }
}
