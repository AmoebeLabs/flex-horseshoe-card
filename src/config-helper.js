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
   * Converts class config into a class-name dictionary.
   *
   * Accepts whitespace-separated class strings, plain objects, arrays of either
   * form, null, and false. YAML arrays are merged in order with last value wins.
   *
   * @param {*} value Class config shape to normalize.
   * @returns {object} Dictionary keyed by class name with boolean values.
   */
  static toClassDict(value) {
    return ConfigHelper.toDict(value, {
      stringToDict: ConfigHelper.classStringToDict,
      mapValue: Boolean,
    });
  }

  /**
   * Converts icon config into a dictionary keyed by icon slot.
   *
   * Accepts strings, plain objects, arrays of either form, null, and false.
   * Strings are stored under the `default` key, and array entries merge in order
   * with later entries overriding earlier keys.
   *
   * @param {*} value Icon config shape to normalize.
   * @returns {object} Icon slot/value dictionary.
   */
  static toIconDict(value) {
    return ConfigHelper.toDict(value, {
      stringToDict: ConfigHelper.stringToDefaultDict('default'),
      mapValue: String,
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
   * Converts color stop config into a dictionary.
   *
   * Accepts `key: value` strings, plain objects, arrays of either form, null, and
   * false. YAML arrays merge in order with later stops overriding earlier keys.
   *
   * @param {*} value Color stop config shape to normalize.
   * @returns {object} Color stop dictionary.
   */
  static toColorStopDict(value) {
    return ConfigHelper.toDict(value, {
      stringToDict: ConfigHelper.keyValueStringToDict,
      mapValue: String,
    });
  }

  /**
   * Parses one `key: value` string into a dictionary.
   *
   * Uses the first colon as the separator, returns an empty dictionary for
   * missing keys or values, and preserves additional colons in the value.
   *
   * @param {*} value Key/value text.
   * @returns {object} Single-entry dictionary or an empty dictionary.
   */
  static keyValueStringToDict(value) {
    const text = String(value).trim();
    const colonIndex = text.indexOf(':');

    if (colonIndex <= 0) return {};

    const key = text.slice(0, colonIndex).trim();
    const dictValue = text.slice(colonIndex + 1).trim();

    if (!key || !dictValue) return {};

    return {
      [key]: dictValue,
    };
  }

  /**
   * Parses whitespace-separated class text into a class dictionary.
   *
   * @param {*} classText Class text to split.
   * @returns {object} Dictionary keyed by class name with true values.
   */
  static classStringToDict(classText) {
    return String(classText)
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .reduce(
        (result, className) => ({
          ...result,
          [className]: true,
        }),
        {},
      );
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
   * Requires a config field to be an array when present.
   *
   * Null and undefined are treated as an empty array; any non-array value throws
   * with the provided field name.
   *
   * @param {*} value Value to validate.
   * @param {string} [fieldName='value'] Field name used in the error message.
   * @returns {Array} The original array or an empty array.
   * @throws {Error} When the value is present but not an array.
   */
  static requireArray(value, fieldName = 'value') {
    if (value == null) return [];

    if (!Array.isArray(value)) {
      throw new Error(`[config-helper] "${fieldName}" must be an array.`);
    }

    return value;
  }

  /**
   * Wraps a single value in an array.
   *
   * @param {*} value Value to normalize.
   * @returns {Array} Empty array for nullish input, the original array, or a one-item array.
   */
  static ensureArray(value) {
    if (value == null) return [];
    return Array.isArray(value) ? value : [value];
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
