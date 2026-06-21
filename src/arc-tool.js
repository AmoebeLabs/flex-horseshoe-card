import { svg } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import BaseTool from './base-tool.js';
import Utils from './utils.js';

/**
 * Layout arc tool that renders a closed chord arc shape matching horseshoe geometry.
 */
export default class ArcTool extends BaseTool {
  /**
   * Builds arc tool instances from the already normalized layout config.
   *
   * @param {object} config - Full card configuration after static card-level normalization.
   * @param {object} templates - Template resolver shared with the card.
   * @param {string} cardId - Stable card id for generated SVG ids.
   * @param {LitElement} card - Parent card instance with shared render helpers.
   * @returns {Array<ArcTool>} Configured arc tools.
   */
  static setConfig(config, templates, cardId, card) {
    const arcs = config.layout?.arcs ?? [];

    return arcs.map((arcConfig, index) => new ArcTool(arcConfig, index, templates, cardId, card));
  }

  /**
   * Stores static arc config and precomputes SVG dimensions.
   *
   * @param {object} config - Static arc item config.
   * @param {number} index - Arc index inside layout.arcs.
   * @param {object} templates - Template resolver shared with the card.
   * @param {string} cardId - Stable card id for generated SVG ids.
   * @param {LitElement} card - Parent card instance with shared render helpers.
   */
  constructor(config, index, templates, cardId, card) {
    const arcConfig = {
      xpos: 50,
      ypos: 50,
      radius: 45,
      arc_degrees: 260,
      rotate: 0,
      flip: 'none',
      ...config,
    };

    super(arcConfig, index, templates, cardId, card, 'arcs', 'arcs', undefined);

    this.config.svg = this.calculateSvgDimensions();
    this.runtimeConfig = this.config;
  }

  /**
   * Updates runtime entity context for this arc.
   *
   * @param {object} entity - Home Assistant entity state object for this arc.
   * @param {object} entityConfig - Entity configuration for this arc.
   */
  setState(entity, entityConfig) {
    super.setState(entity, entityConfig);

    this.runtimeConfig.svg = this.calculateSvgDimensions(this.runtimeConfig);
  }

  /**
   * Converts arc config to SVG center, radius, angles, and end points.
   *
   * @param {object} config - Static or runtime arc config.
   * @returns {object} SVG arc dimensions.
   */
  calculateSvgDimensions(config = this.config) {
    const svgDimensions = this.card._calculateSvgCoordinatesInGroup(config);
    const radius = Utils.calculateSvgDimension(config.radius);
    const arcDegrees = Number(config.arc_degrees);
    const rotate = Number(config.rotate);
    const startAngle = 90 + (360 - arcDegrees) / 2 + rotate;
    const endAngle = startAngle + arcDegrees;
    const startRadians = (startAngle * Math.PI) / 180;
    const endRadians = (endAngle * Math.PI) / 180;

    // SVG y grows downward; this matches the horseshoe angle convention.
    svgDimensions.radius = radius;
    svgDimensions.arcDegrees = arcDegrees;
    svgDimensions.largeArcFlag = Math.abs(arcDegrees) > 180 ? 1 : 0;
    svgDimensions.sweepFlag = arcDegrees >= 0 ? 1 : 0;
    svgDimensions.startX = svgDimensions.xpos + radius * Math.cos(startRadians);
    svgDimensions.startY = svgDimensions.ypos + radius * Math.sin(startRadians);
    svgDimensions.endX = svgDimensions.xpos + radius * Math.cos(endRadians);
    svgDimensions.endY = svgDimensions.ypos + radius * Math.sin(endRadians);

    return svgDimensions;
  }

  /**
   * Builds the closed chord arc path: curved outer edge, straight line back to the start.
   *
   * @returns {string} SVG path data for this arc.
   */
  buildArcPath() {
    const dimensions = this.runtimeConfig.svg;

    if (Math.abs(dimensions.arcDegrees) >= 360) {
      return `
        M ${dimensions.xpos - dimensions.radius} ${dimensions.ypos}
        A ${dimensions.radius} ${dimensions.radius} 0 1 1 ${dimensions.xpos + dimensions.radius} ${dimensions.ypos}
        A ${dimensions.radius} ${dimensions.radius} 0 1 1 ${dimensions.xpos - dimensions.radius} ${dimensions.ypos}
        Z
      `;
    }

    return `
      M ${dimensions.startX} ${dimensions.startY}
      A ${dimensions.radius} ${dimensions.radius} 0 ${dimensions.largeArcFlag} ${dimensions.sweepFlag} ${dimensions.endX} ${dimensions.endY}
      Z
    `;
  }

  /**
   * Renders one arc layout item.
   *
   * @returns {TemplateResult} SVG template for the arc.
   */
  render() {
    const arcStyles = {
      fill: 'var(--primary-background-color)',
      stroke: 'none',
      'stroke-width': 0,
    };
    const styles = this.getStyles(arcStyles);

    this.applyColorStops(styles, 'fill');

    return svg`
      <g
        transform="${this.getGroupScaleTransform()}"
        style="${this.getGroupScaleStyle()}"
      >
        <path
          @click=${(event) => this.handlePopup(event)}
          class="arc-tool"
          d="${this.buildArcPath()}"
          style=${styleMap(styles)}
        ></path>
      </g>
    `;
  }
}
