export default class ConfigHelper {
  /**
   * Converts style config into a CSS property dictionary.
   *
   * Accepts CSS declaration strings, plain objects, arrays of either form, null,
   * and false. YAML arrays are merged in order, so later entries override earlier
   * declarations for the same property.
   *
   * @param {*} value Style config shape to normalize.
   * @returns {object} CSS property/value dictionary.
   */
  static toStyleDict(value) {
    return ConfigHelper.toDict(value, {
      stringToDict: ConfigHelper.cssStringToDict,
      mapValue: ConfigHelper.toStyleValue,
    });
  }

  /**
   * Normalizes mixed config input into a dictionary.
   *
   * Supports strings through `options.stringToDict`, plain objects through
   * `options.mapValue`, and YAML-style arrays of either shape. Array entries are
   * merged in order with last value wins; null and false are skipped by default.
   *
   * @param {*} value Config shape to normalize.
   * @param {{ stringToDict?: Function, mapValue?: Function, skipNull?: boolean, skipFalse?: boolean }} [options={}] Conversion options.
   * @returns {object} Normalized dictionary.
   */
  static toDict(value, options = {}) {
    const { stringToDict = ConfigHelper.stringToDefaultDict('default'), mapValue = (entryValue) => entryValue, skipNull = true, skipFalse = true } = options;

    const convert = (input) => {
      if (input == null && skipNull) return {};
      if (input === false && skipFalse) return {};

      if (Array.isArray(input)) {
        return input.reduce(
          (result, entry) => ({
            ...result,
            ...convert(entry),
          }),
          {},
        );
      }

      if (ConfigHelper.isPlainObject(input)) {
        return Object.fromEntries(
          Object.entries(input)
            .filter(([, entryValue]) => {
              if (entryValue == null && skipNull) return false;
              if (entryValue === false && skipFalse) return false;
              return true;
            })
            .map(([key, entryValue]) => [key, mapValue(entryValue, key)]),
        );
      }

      if (typeof input === 'string') {
        return stringToDict(input);
      }

      return {};
    };

    return convert(value);
  }

  /**
   * Normalizes one CSS style value.
   *
   * Preserves null and undefined, otherwise trims the value and removes trailing
   * semicolons so object and string style inputs produce matching values.
   *
   * @param {*} value CSS value to normalize.
   * @returns {*} Normalized string, null, or undefined.
   */
  static toStyleValue(value) {
    if (value === undefined || value === null) return value;

    return String(value).trim().replace(/;+$/, '');
  }

  /**
   * Parses CSS declaration text into a property dictionary.
   *
   * Accepts semicolon-separated declarations. Invalid declarations and entries
   * without both a property and value are ignored; duplicate properties use the
   * last parsed value.
   *
   * @param {*} cssText CSS declaration text.
   * @returns {object} CSS property/value dictionary.
   */
  static cssStringToDict(cssText) {
    return String(cssText)
      .split(';')
      .map((part) => part.trim())
      .filter(Boolean)
      .reduce((result, declaration) => {
        const colonIndex = declaration.indexOf(':');

        if (colonIndex <= 0) return result;

        const property = declaration.slice(0, colonIndex).trim();
        const value = declaration.slice(colonIndex + 1).trim();

        if (!property || !value) return result;

        return {
          ...result,
          [property]: value,
        };
      }, {});
  }

  /**
   * Creates a string converter that stores input under one default key.
   *
   * @param {string} [defaultKey='default'] Key used for converted string values.
   * @returns {Function} Converter returning a single-entry dictionary.
   */
  static stringToDefaultDict(defaultKey = 'default') {
    return (value) => ({
      [defaultKey]: String(value),
    });
  }

  /**
   * Evaluates and validates one config-time disabled value.
   *
   * @param {object} item Config item used as JavaScript template context.
   * @param {*} disabled Configured disabled value or JavaScript template.
   * @param {string} section Config path used in validation errors.
   * @param {object} templates Shared template evaluator.
   * @returns {boolean} Whether the config item is disabled.
   */
  static isDisabled(item, disabled, section, templates) {
    const resolvedDisabled = templates.hasJavascriptTemplates(disabled)
      ? templates.getJsTemplateOrValue(item, disabled)
      : disabled;

    if (![true, false, 0, 1, 'true', 'false', '1', '0'].includes(resolvedDisabled)) {
      throw new Error(`[${section}] disabled must resolve to true, false, 0 or 1`);
    }

    return resolvedDisabled === true || resolvedDisabled === 1 || resolvedDisabled === 'true' || resolvedDisabled === '1';
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
