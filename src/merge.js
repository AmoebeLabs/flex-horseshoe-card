/**
 * Performs a deep merge of objects and returns new object. Does not modify
 * objects (immutable) and merges arrays via concatenation and filtering.
 *
 * @param {...object} objects - Objects to merge
 * @returns {object} New object with merged key/values
 */
export default class Merge {
  static mergeDeep(...objects) {
    const isObject = (obj) => obj && typeof obj === 'object';
    return objects.reduce((prev, obj) => {
      Object.keys(obj).forEach((key) => {
        const pVal = prev[key];
        const oVal = obj[key];
        if (Array.isArray(pVal) && Array.isArray(oVal)) {
          /* eslint no-param-reassign: 0 */
          // Only if pVal is empty???

          // #TODO:
          // Should check for .id to match both arrays ?!?!?!?!
          // Only concat if no ID or match found, otherwise mergeDeep ??
          //
          // concatenate and then reduce/merge the array based on id's if present??
          //
          prev[key] = pVal.concat(...oVal);
        } else if (isObject(pVal) && isObject(oVal)) {
          prev[key] = this.mergeDeep(pVal, oVal);
        } else {
          prev[key] = oVal;
        }
      });
      return prev;
    }, {});
  }
}
