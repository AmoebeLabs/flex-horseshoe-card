import { svg } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import BaseTool from './base-tool.js';
import Utils from './utils.js';

/**
 * Layout circle tool that renders SVG circle shapes.
 */
export default class CircleTool extends BaseTool {
  /**
   * Builds circle tool instances from the already normalized layout config.
   *
   * @param {object} config - Full card configuration after static card-level normalization.
   * @param {object} templates - Template resolver shared with the card.
   * @param {string} cardId - Stable card id for generated SVG ids.
   * @param {LitElement} card - Parent card instance with shared render helpers.
   * @returns {Array<CircleTool>} Configured circle tools.
   */
  static setConfig(config, templates, cardId, card) {
    const circles = config.layout?.circles ?? [];

    return circles.map((circleConfig, index) => new CircleTool(circleConfig, index, templates, cardId, card));
  }

  /**
   * Stores static circle config and precomputes SVG dimensions.
   *
   * @param {object} config - Static circle item config.
   * @param {number} index - Circle index inside layout.circles.
   * @param {object} templates - Template resolver shared with the card.
   * @param {string} cardId - Stable card id for generated SVG ids.
   * @param {LitElement} card - Parent card instance with shared render helpers.
   */
  constructor(config, index, templates, cardId, card) {
    const circleConfig = {
      radius: 0,
      ...config,
    };

    super(circleConfig, index, templates, cardId, card, 'circles', 'circles', undefined, { fill: false, stroke: true });

    this.config.svg = this.calculateSvgDimensions();
  }

  /** Updates circle configuration and geometry before entity data is assigned. */
  updateRuntimeConfig() {
    super.updateRuntimeConfig();

    if (this.configChanged) this.config.svg = this.calculateSvgDimensions(this.config);
  }

  /**
   * Converts circle config coordinates to SVG center and radius values.
   *
   * @param {object} config - Static or runtime circle config.
   * @returns {object} SVG circle dimensions.
   */
  calculateSvgDimensions(config = this.config) {
    const svgDimensions = this.card._calculateSvgCoordinatesInGroup(config);

    // Keep legacy radius behavior. Use radius_percent when the radius must follow the card percentage scale.
    svgDimensions.radius = config.radius_percent !== undefined
      ? Utils.calculateSvgDimension(config.radius_percent)
      : config.radius;

    return svgDimensions;
  }

  /**
   * Renders one circle layout item.
   *
   * @returns {TemplateResult} SVG template for the circle.
   */
  render() {
    const circleStyles = {};
    const styles = this.getStyles(circleStyles);

    this.applyColorStops(styles);

    return this.renderItemLayers(svg`
      <g
        transform="${this.getGroupScaleTransform()}"
        style="${this.getGroupScaleStyle()}"
      >
        <circle
          ${this.actionHandler()}
          @action=${(event) => this.handleAction(event)}
          class="circle-tool"
          cx="${this.config.svg.xpos}"
          cy="${this.config.svg.ypos}"
          r="${this.config.svg.radius}"
          style=${styleMap(this.getRenderStyles(styles))}
        ></circle>
      </g>
    `);
  }
}
