/**
 * Deep-merges configuration objects into a new object. Matching nested arrays
 * are concatenated.
 *
 * @param {...object} objects - Configuration layers to merge.
 * @returns {object} New object with merged key/value pairs.
 */
export default class Merge {
  /**
   * Merges nested configuration objects from left to right. Arrays are
   * concatenated when both layers provide an array at the same nested key.
   *
   * @param {...object} objects - Configuration layers in precedence order.
   * @returns {object} Merged configuration object.
   */
  static mergeDeep(...objects) {
    const isObject = (obj) => obj && typeof obj === 'object';
    return objects.reduce((prev, obj) => {
      Object.keys(obj).forEach((key) => {
        const pVal = prev[key];
        const oVal = obj[key];
        if (Array.isArray(pVal) && Array.isArray(oVal)) {
          /* eslint no-param-reassign: 0 */
          // Preserve array order and clone incoming object entries while concatenating.
          prev[key] = pVal.concat(...oVal.map((item) => (isObject(item) ? this.mergeDeep(Array.isArray(item) ? [] : {}, item) : item)));
        } else if (isObject(pVal) && isObject(oVal)) {
          prev[key] = this.mergeDeep(pVal, oVal);
        } else if (Array.isArray(oVal)) {
          prev[key] = oVal.map((item) => (isObject(item) ? this.mergeDeep(Array.isArray(item) ? [] : {}, item) : item));
        } else if (isObject(oVal)) {
          prev[key] = this.mergeDeep({}, oVal);
        } else {
          prev[key] = oVal;
        }
      });
      return prev;
    }, {});
  }
}
