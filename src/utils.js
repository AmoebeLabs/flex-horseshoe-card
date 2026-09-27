import { SVG_DEFAULT_DIMENSIONS } from './const.js';

/**
 * Shared value/dimension calculations and access to the active Lovelace view.
 */

export default class Utils {
  /**
   * Maps a state value to a clipped fraction of its configured scale. The
   * existing initial/zero-value behavior supplies a zero fraction until a
   * nonzero numeric state is available.
   *
   * @param {number} argStart - Scale start.
   * @param {number} argEnd - Scale end.
   * @param {number} argVal - State value.
   * @returns {number} Fraction from zero through one.
   */

  static calculateValueBetween(argStart, argEnd, argVal) {
    if (isNaN(argVal)) return 0;
    if (!argVal) return 0;

    return (Math.min(Math.max(argVal, argStart), argEnd) - argStart) / (argEnd - argStart);
  }

  /**
   * Converts a dimension in card percentage units into the shared SVG scale.
   *
   * @param {number} argDimension - Configured dimension.
   * @returns {number} Dimension in SVG units.
   */

  static calculateSvgDimension(argDimension) {
    return (argDimension / 100) * SVG_DEFAULT_DIMENSIONS;
  }

  /**
   * Calculates the horizontal inset required to keep an item inside a rounded rectangle.
   * The nearest vertical edge selects the corner arc intersected by the item.
   */
  static calculateRoundedRectHorizontalInset(radius, rectangleTop, rectangleBottom, itemTop, itemBottom) {
    const edgeDistance = Math.min(itemTop - rectangleTop, rectangleBottom - itemBottom);
    if (edgeDistance >= radius) return 0;

    return radius - Math.sqrt(radius ** 2 - (radius - edgeDistance) ** 2);
  }

  /**
   * Returns the active Lovelace configuration and synchronizes its current
   * view index with hui-root's runtime selection.
   *
   * @returns {object|null} Active Lovelace configuration.
   */
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
      const ll = root.lovelace;
      ll.current_view = root.___curView;
      return ll;
    }
    return null;
  }
}
