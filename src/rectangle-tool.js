import { svg } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import BaseTool from './base-tool.js';
import Utils from './utils.js';

/**
 * Layout rectangle tool that renders rounded SVG path surfaces.
 */
export default class RectangleTool extends BaseTool {
  /**
   * Builds rectangle tool instances from the already normalized layout config.
   *
   * @param {object} config - Full card configuration after static card-level normalization.
   * @param {object} templates - Template resolver shared with the card.
   * @param {string} cardId - Stable card id for generated SVG ids.
   * @param {LitElement} card - Parent card instance with shared render helpers.
   * @returns {Array<RectangleTool>} Configured rectangle tools.
   */
  static setConfig(config, templates, cardId, card) {
    const rectangles = config.layout?.rectangles ?? [];

    return rectangles.map((rectangleConfig, index) => new RectangleTool(rectangleConfig, index, templates, cardId, card));
  }

  /**
   * Stores static rectangle config and precomputes SVG dimensions.
   *
   * @param {object} config - Static rectangle item config.
   * @param {number} index - Rectangle index inside layout.rectangles.
   * @param {object} templates - Template resolver shared with the card.
   * @param {string} cardId - Stable card id for generated SVG ids.
   * @param {LitElement} card - Parent card instance with shared render helpers.
   */
  constructor(config, index, templates, cardId, card) {
    const rectangleConfig = {
      radius: 0,
      ...config,
    };

    // Referenced width and height use optional padding around the measured item.
    if (typeof rectangleConfig.width === 'object') {
      rectangleConfig.width = {
        padding: 0,
        ...rectangleConfig.width,
      };
    }
    if (typeof rectangleConfig.height === 'object') {
      rectangleConfig.height = {
        padding: 0,
        ...rectangleConfig.height,
      };
    }
    if (rectangleConfig.fit) {
      rectangleConfig.fit = {
        ...rectangleConfig.fit,
        padding: {
          x: 1.5,
          y: 0.5,
          ...rectangleConfig.fit.padding,
        },
      };
    }

    super(rectangleConfig, index, templates, cardId, card, 'rectangles', 'rectangles', undefined);

    this.config.svg = this.calculateSvgDimensions();
    this.runtimeConfig = this.config;
  }

  /**
   * Updates runtime entity context for this rectangle.
   *
   * @param {object} entity - Home Assistant entity state object for this rectangle.
   * @param {object} entityConfig - Entity configuration for this rectangle.
   */
  setState(entity, entityConfig) {
    super.setState(entity, entityConfig);

    this.runtimeConfig.svg = this.calculateSvgDimensions(this.runtimeConfig);
  }

  /**
   * Converts rectangle config dimensions to SVG coordinates and corner radii.
   *
   * @returns {object} SVG dimensions and path-ready corner radii.
   */
  calculateSvgDimensions(config = this.config) {
    let svgDimensions;
    let width;
    let height;

    // fit replaces all four rectangle geometry fields with the measured text geometry.
    if (config.fit) {
      const itemGeometry = this.card.getItemGeometry(config.fit);

      svgDimensions = {
        xpos: itemGeometry.xpos,
        ypos: itemGeometry.ypos,
      };
      width = Utils.calculateSvgDimension(itemGeometry.width + config.fit.padding.x * 2);
      height = Utils.calculateSvgDimension(itemGeometry.height + config.fit.padding.y * 2);
    } else {
      svgDimensions = this.card._calculateSvgCoordinatesInGroup(config);
      width = Utils.calculateSvgDimension(this.card.getItemWidth(config.width));
      height = Utils.calculateSvgDimension(this.card.getItemHeight(config.height));
    }

    const radiusConfig = typeof config.radius === 'object' ? config.radius : { all: config.radius };
    const maxRadius = Math.min(height, width) / 2;

    // Radius config values are still in card dimensions here. Convert once, after the fallback is chosen.
    const calculateRadius = (value) => Math.min(maxRadius, Math.max(0, Utils.calculateSvgDimension(value)));

    // The path uses either the measured fit center or the configured rectangle center.
    svgDimensions.width = width;
    svgDimensions.height = height;
    svgDimensions.x = svgDimensions.xpos - width / 2;
    svgDimensions.y = svgDimensions.ypos - height / 2;

    // Corner-specific values follow the reference tool: exact corner, then side, then axis, then all.
    svgDimensions.radiusTopLeft = calculateRadius(radiusConfig.top_left ?? radiusConfig.left ?? radiusConfig.top ?? radiusConfig.all);
    svgDimensions.radiusTopRight = calculateRadius(radiusConfig.top_right ?? radiusConfig.right ?? radiusConfig.top ?? radiusConfig.all);
    svgDimensions.radiusBottomLeft = calculateRadius(radiusConfig.bottom_left ?? radiusConfig.left ?? radiusConfig.bottom ?? radiusConfig.all);
    svgDimensions.radiusBottomRight = calculateRadius(radiusConfig.bottom_right ?? radiusConfig.right ?? radiusConfig.bottom ?? radiusConfig.all);

    return svgDimensions;
  }

  /**
   * Builds the SVG path for this rectangle with independently rounded corners.
   *
   * @returns {string} SVG path data for the rounded rectangle.
   */
  buildRoundedRectanglePath() {
    const dimensions = this.runtimeConfig.svg;

    return `
      M ${dimensions.x + dimensions.radiusTopLeft} ${dimensions.y}
      h ${dimensions.width - dimensions.radiusTopLeft - dimensions.radiusTopRight}
      q ${dimensions.radiusTopRight} 0 ${dimensions.radiusTopRight} ${dimensions.radiusTopRight}
      v ${dimensions.height - dimensions.radiusTopRight - dimensions.radiusBottomRight}
      q 0 ${dimensions.radiusBottomRight} -${dimensions.radiusBottomRight} ${dimensions.radiusBottomRight}
      h -${dimensions.width - dimensions.radiusBottomRight - dimensions.radiusBottomLeft}
      q -${dimensions.radiusBottomLeft} 0 -${dimensions.radiusBottomLeft} -${dimensions.radiusBottomLeft}
      v -${dimensions.height - dimensions.radiusBottomLeft - dimensions.radiusTopLeft}
      q 0 -${dimensions.radiusTopLeft} ${dimensions.radiusTopLeft} -${dimensions.radiusTopLeft}
      Z
    `;
  }

  /**
   * Renders one rectangle layout item.
   *
   * @returns {TemplateResult} SVG template for the rectangle.
   */
  render() {
    // Text dimensions become exact after the preceding render. Recalculate the
    // path here so the correction render immediately uses the measured size.
    this.runtimeConfig.svg = this.calculateSvgDimensions(this.runtimeConfig);

    const rectangleStyles = {
      fill: 'var(--primary-background-color)',
      stroke: 'none',
      'stroke-width': 0,
    };
    const styles = this.getStyles(rectangleStyles);

    this.applyColorStops(styles, 'fill');

    return this.renderItemLayers(svg`
      <g
        transform="${this.getGroupScaleTransform()}"
        style="${this.getGroupScaleStyle()}"
      >
        <path
          @click=${(event) => this.handlePopup(event)}
          class="rectangle-tool"
          d="${this.buildRoundedRectanglePath()}"
          style=${styleMap(this.getRenderStyles(styles))}
        ></path>
      </g>
    `);
  }
}
