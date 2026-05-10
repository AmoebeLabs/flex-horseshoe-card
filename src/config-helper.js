export default class ConfigHelper {
  static toStyleDict(value) {
    return ConfigHelper.toDict(value, {
      stringToDict: ConfigHelper.cssStringToDict,
      mapValue: ConfigHelper.toStyleValue,
    });
  }

  static toClassDict(value) {
    return ConfigHelper.toDict(value, {
      stringToDict: ConfigHelper.classStringToDict,
      mapValue: Boolean,
    });
  }

  static toIconDict(value) {
    return ConfigHelper.toDict(value, {
      stringToDict: ConfigHelper.stringToDefaultDict('default'),
      mapValue: String,
    });
  }

  static toDict(value, options = {}) {
    const {
      stringToDict = ConfigHelper.stringToDefaultDict('default'),
      mapValue = (entryValue) => entryValue,
      skipNull = true,
      skipFalse = true,
    } = options;

    const convert = (input) => {
      if (input == null && skipNull) return {};
      if (input === false && skipFalse) return {};

      if (Array.isArray(input)) {
        return input.reduce((result, entry) => ({
          ...result,
          ...convert(entry),
        }), {});
      }

      if (ConfigHelper.isPlainObject(input)) {
        return Object.fromEntries(
          Object.entries(input)
            .filter(([, entryValue]) => {
              if (entryValue == null && skipNull) return false;
              if (entryValue === false && skipFalse) return false;
              return true;
            })
            .map(([key, entryValue]) => [
              key,
              mapValue(entryValue, key),
            ]),
        );
      }

      if (typeof input === 'string') {
        return stringToDict(input);
      }

      return {};
    };

    return convert(value);
  }

  static toStyleValue(value) {
  if (value === undefined || value === null) return value;

  return String(value)
    .trim()
    .replace(/;+$/, '');
  }

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

  static toColorStopDict(value) {
    return ConfigHelper.toDict(value, {
      stringToDict: ConfigHelper.keyValueStringToDict,
      mapValue: String,
    });
  }

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

  static classStringToDict(classText) {
    return String(classText)
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .reduce((result, className) => ({
        ...result,
        [className]: true,
      }), {});
  }

  static stringToDefaultDict(defaultKey = 'default') {
    return (value) => ({
      [defaultKey]: String(value),
    });
  }

  static requireArray(value, fieldName = 'value') {
    if (value == null) return [];

    if (!Array.isArray(value)) {
      throw new Error(`[config-helper] "${fieldName}" must be an array.`);
    }

    return value;
  }

  static ensureArray(value) {
    if (value == null) return [];
    return Array.isArray(value) ? value : [value];
  }

  static isPlainObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }
}
