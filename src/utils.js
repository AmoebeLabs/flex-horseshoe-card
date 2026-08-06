import { SVG_DEFAULT_DIMENSIONS, SVG_DEFAULT_DIMENSIONS_HALF } from './const';

/** ***************************************************************************
 * Utils class
 *
 * Summary.
 *
 */

export default class Utils {
  /**
   * Utils::calculateValueBetween()
   *
   * Summary.
   * Clips the val value between start and end, and returns the between value ;-)
   * Returned value is a fractional value between 0 and 1.
   *
   * Note 1:
   * At start, state values are set to 'null' to make sure it has no value!
   * If such a value is detected, return 0(%) as the relative value.
   * In normal cases, this happens to be the _valuePrev, so 0% is ok!!!!
   *
   * Note 2:
   * !xyz checks for "", null, undefined, false and number 0
   * An extra check for NaN guards the result of this function ;-)
   */

  static calculateValueBetween(argStart, argEnd, argVal) {
    // Check for valid argVal values and return 0 if invalid.
    if (isNaN(argVal)) return 0;
    if (!argVal) return 0;

    // Valid argVal value: calculate fraction between 0 and 1
    return (Math.min(Math.max(argVal, argStart), argEnd) - argStart) / (argEnd - argStart);
  }

  /**
   * Utils::calculateSvgCoordinate()
   *
   * Summary.
   * Calculate own (tool/tool) coordinates relative to centered toolset position.
   * Tool coordinates are %
   *
   * Group is 50,40. Say SVG is 200x200. Group is 100,80 within 200x200.
   * Tool is 10,50. 0.1 * 200 = 20 + (100 - 200/2) = 20 + 0.
   */
  static calculateSvgCoordinate(argOwn, argToolset) {
    return (argOwn / 100) * SVG_DEFAULT_DIMENSIONS + (argToolset - SVG_DEFAULT_DIMENSIONS_HALF);
  }

  /**
   * Utils::calculateSvgDimension()
   *
   * Summary.
   * Translate tool dimension like length or width to actual SVG dimension.
   */

  static calculateSvgDimension(argDimension) {
    return (argDimension / 100) * SVG_DEFAULT_DIMENSIONS;
  }

  static getLovelace() {
    let root = window.document.querySelector('home-assistant');
    root = root && root.shadowRoot;
    root = root && root.querySelector('home-assistant-main');
    root = root && root.shadowRoot;
    root = root && root.querySelector('app-drawer-layout partial-panel-resolver, ha-drawer partial-panel-resolver');
    root = (root && root.shadowRoot) || root;
    root = root && root.querySelector('ha-panel-lovelace');
    root = root && root.shadowRoot;
    root = root && root.querySelector('hui-root');
    if (root) {
      // console.log('getLoveLace, root', root, root.lovelace);
      const ll = root.lovelace;
      ll.current_view = root.___curView;
      return ll;
    }
    return null;
  }
}
