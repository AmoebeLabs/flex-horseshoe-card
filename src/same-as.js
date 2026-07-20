import Merge from './merge.js';
import { DEFINITION_SHAPE_SECTIONS, VISIBLE_LAYOUT_SECTIONS } from './layout-sections.js';

/**
 * Compiles layout same_as declarations into normal layout item config.
 *
 * same_as is a config-time feature. After this class runs, render tools receive
 * concrete items without same_as, same_as_replace or same_as_d... fields.
 */
export default class SameAs {
  static STATIC_REF_MARKER = Symbol('fhs-static-ref');

  /**
   * Compiles same_as for every supported layout section in a card-like config.
   *
   * @param {object} config - Card or template config with a layout section.
   */
  static compile(config) {
    VISIBLE_LAYOUT_SECTIONS.forEach((section) => {
      const items = config.layout?.[section];

      if (!Array.isArray(items)) return;

      config.layout[section] = SameAs.compileItems(items);
    });

    SameAs.compileDefinitions(config.layout?.clips);
    SameAs.compileDefinitions(config.layout?.masks);
  }

  /**
   * Compiles same_as inside every supported shape section of clip/mask definitions.
   *
   * @param {object} definitions - layout.clips or layout.masks config.
   */
  static compileDefinitions(definitions) {
    if (!definitions) return;

    Object.values(definitions).forEach((definition) => {
      DEFINITION_SHAPE_SECTIONS.forEach((section) => {
        const items = definition[section];

        if (!Array.isArray(items)) return;

        definition[section] = SameAs.compileItems(items);
      });
    });
  }

  /**
   * Compiles same_as inside one layout section.
   *
   * same_as can only point to an item that has already appeared in the same
   * section. This preserves the existing top-to-bottom inheritance behavior.
   *
   * @param {Array<object>} items - Layout section items.
   * @returns {Array<object>} Items with same_as declarations expanded.
   */
  static compileItems(items) {
    const compiledItemsById = new Map();

    return items.map((item, index) => {
      let compiledItem;

      if (item.same_as === undefined) {
        compiledItem = item;
      } else {
        const base = compiledItemsById.get(String(item.same_as));

        if (!base) {
          throw new Error(`same_as '${item.same_as}' not found for item ${index}`);
        }

        const { same_as, same_as_replace = [], ...restOfFields } = item;
        const baseForMerge = { ...base };
        const replacePaths = [...same_as_replace];

        // A direct ref(...) inside a same_as override replaces that exact path before merging local fields.
        const collectRefReplacePaths = (value, path) => {
          if (value && typeof value === 'object' && value[SameAs.STATIC_REF_MARKER]) {
            replacePaths.push(path.join('.'));
            return;
          }

          if (value && typeof value === 'object' && !Array.isArray(value)) {
            Object.entries(value).forEach(([field, fieldValue]) => {
              collectRefReplacePaths(fieldValue, [...path, field]);
            });
          }
        };

        Object.entries(restOfFields).forEach(([field, value]) => {
          collectRefReplacePaths(value, [field]);
        });

        replacePaths.forEach((fieldPath) => {
          SameAs.deleteReplacePath(baseForMerge, fieldPath);
        });

        compiledItem = Merge.mergeDeep(baseForMerge, restOfFields);
        compiledItem = SameAs.applyDeltas(item, compiledItem, index);

        delete compiledItem.same_as;
        delete compiledItem.same_as_replace;

        Object.keys(compiledItem)
          .filter((key) => key.startsWith('same_as_d'))
          .forEach((key) => delete compiledItem[key]);
      }

      compiledItemsById.set(String(compiledItem.id), compiledItem);

      return compiledItem;
    });
  }

  /**
   * Applies same_as_d... numeric deltas after the base and override are merged.
   *
   * @param {object} item - Original item containing delta fields.
   * @param {object} compiledItem - Merged item that will receive the deltas.
   * @param {number} index - Item index used in error messages.
   * @returns {object} The same compiled item with deltas applied.
   */
  static applyDeltas(item, compiledItem, index) {
    Object.entries(item).forEach(([key, value]) => {
      if (!key.startsWith('same_as_d')) return;

      const targetKey = key.substring('same_as_d'.length);

      if (!targetKey) {
        throw new Error(`Invalid same_as delta field '${key}' for item ${index}`);
      }

      if (compiledItem[targetKey] === undefined) {
        throw new Error(`same_as delta '${key}' requires '${targetKey}' for item ${index}`);
      }

      if (!SameAs.isStaticNumber(compiledItem[targetKey])) {
        throw new Error(`same_as delta '${key}' requires numeric '${targetKey}' for item ${index}`);
      }

      if (!SameAs.isStaticNumber(value)) {
        throw new Error(`same_as delta '${key}' must be numeric for item ${index}`);
      }

      compiledItem[targetKey] += value;
    });

    return compiledItem;
  }

  /**
   * Deletes a same_as replacement path from the inherited base before the final merge.
   *
   * A plain field keeps the old same_as_replace behavior. Dot paths allow replacing
   * nested config such as color_stops.colors without removing color_stops.gap.
   * Parent objects are cloned while walking the path, so earlier compiled same_as
   * items remain unchanged.
   *
   * @param {object} baseForMerge - Inherited same_as base that will be merged afterward.
   * @param {string} fieldPath - Top-level field or dot path to remove from the base.
   */
  static deleteReplacePath(baseForMerge, fieldPath) {
    const path = String(fieldPath).split('.');
    let current = baseForMerge;

    // Walk to the parent object, cloning every level that is kept in the base.
    for (let index = 0; index < path.length - 1; index += 1) {
      const field = path[index];

      if (current[field] === undefined) return;

      current[field] = Array.isArray(current[field]) ? [...current[field]] : { ...current[field] };
      current = current[field];
    }

    delete current[path[path.length - 1]];
  }

  /**
   * Merges two keyed lists while preserving the old same_as keyed merge behavior.
   *
   * @param {Array<object>} baseList - Inherited list.
   * @param {Array<object>} overrideList - Override list.
   * @param {string} key - Field used to match items.
   * @returns {Array<object>} Merged list.
   */
  static mergeListByKey(baseList, overrideList, key) {
    const itemsByKey = new Map();

    baseList.forEach((item) => {
      itemsByKey.set(String(item[key]), item);
    });

    overrideList.forEach((item) => {
      const itemKey = String(item[key]);

      if (itemsByKey.has(itemKey)) {
        itemsByKey.set(itemKey, Merge.mergeDeep(itemsByKey.get(itemKey), item));
      } else {
        itemsByKey.set(itemKey, item);
      }
    });

    return [...itemsByKey.values()];
  }

  /**
   * Checks whether a value is a finite static number for same_as_d... math.
   *
   * @param {*} value - Value to test.
   * @returns {boolean} True when the value is a finite number.
   */
  static isStaticNumber(value) {
    return typeof value === 'number' && Number.isFinite(value);
  }
}
