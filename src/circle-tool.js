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

    super(circleConfig, index, templates, cardId, card, 'circles', 'circles', undefined);

    this.config.svg = this.calculateSvgDimensions();
    this.runtimeConfig = this.config;
  }

  /**
   * Updates runtime entity context for this circle.
   *
   * @param {object} entity - Home Assistant entity state object for this circle.
   * @param {object} entityConfig - Entity configuration for this circle.
   */
  setState(entity, entityConfig) {
    super.setState(entity, entityConfig);

    this.runtimeConfig.svg = this.calculateSvgDimensions(this.runtimeConfig);
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

    this.applyColorStops(styles, 'stroke');

    return svg`
      <g
        transform="${this.getGroupScaleTransform()}"
        style="${this.getGroupScaleStyle()}"
      >
        <circle
          @click=${(event) => this.handlePopup(event)}
          class="circle-tool"
          cx="${this.runtimeConfig.svg.xpos}"
          cy="${this.runtimeConfig.svg.ypos}"
          r="${this.runtimeConfig.svg.radius}"
          style=${styleMap(this.getRenderStyles(styles))}
        ></circle>
      </g>
    `;
  }
}
