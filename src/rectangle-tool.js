import { svg } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import BaseTool from './base-tool.js';
import Utils from './utils.js';

/**
 * Layout rectangle tool that renders rounded SVG path surfaces.
 */
export default class RectangleTool extends BaseTool {
  /**
   * Stores rectangle config and builds SVG dimensions immediately when the
   * config is static. JavaScript values are evaluated before dimensions are built.
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
      fill_mask: 'auto',
      ...config,
    };

    // A referenced Name, Area, State or Text item can include padding around its current bounds.
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

    super(
      rectangleConfig,
      index,
      templates,
      cardId,
      card,
      'rectangles',
      'rectangles',
      undefined,
      { fill: true, stroke: false },
      RectangleTool.translateConfig,
    );

    this.geometry = {};
    if (!this.hasJavascript) this.geometry.svg = this.calculateSvgDimensions(this.config);
  }

  /** Validates the evaluated public fill-mask setting before rendering.
   *
   * @param {object} config - Evaluated rectangle item config.
   * @returns {object} Valid rectangle item config.
   */
  static translateConfig(config) {
    if (config.fill_mask !== 'auto'
      && (typeof config.fill_mask !== 'number' || config.fill_mask < 0)) {
      throw new Error('[rectangles] fill_mask must be auto or a number equal to or greater than zero');
    }

    return config;
  }

  /** Updates rectangle configuration and geometry before entity data is assigned. */
  updateRuntimeConfig() {
    super.updateRuntimeConfig();

    if (this.configurationChanged || this.groupChanged) this.geometry.svg = this.calculateSvgDimensions(this.config);
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

    // Use the referenced text item's current position and size, then add the configured fit padding.
    if (config.fit) {
      const itemGeometry = this.card.cardTools.getItemGeometry(config.fit);

      svgDimensions = {
        xpos: itemGeometry.xpos,
        ypos: itemGeometry.ypos,
      };
      width = Utils.calculateSvgDimension(itemGeometry.width + config.fit.padding.x * 2);
      height = Utils.calculateSvgDimension(itemGeometry.height + config.fit.padding.y * 2);
    } else {
      svgDimensions = this.card.cardLayout.calculateSvgCoordinatesInGroup(config);
      width = Utils.calculateSvgDimension(this.card.cardTools.getItemWidth(config.width));
      height = Utils.calculateSvgDimension(this.card.cardTools.getItemHeight(config.height));
    }

    const radiusConfig = typeof config.radius === 'object' ? config.radius : { all: config.radius };
    const maxRadius = Math.min(height, width) / 2;

    // Choose each corner's configured fallback before converting its radius to SVG units.
    const calculateRadius = (value) => Math.min(maxRadius, Math.max(0, Utils.calculateSvgDimension(value)));

    // Center the SVG path on the referenced text bounds or the configured rectangle position.
    svgDimensions.width = width;
    svgDimensions.height = height;
    svgDimensions.x = svgDimensions.xpos - width / 2;
    svgDimensions.y = svgDimensions.ypos - height / 2;

    // For each corner, use its own radius first, then the side, top/bottom, and all-corners radius.
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
    const dimensions = this.geometry.svg;

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
    // FHS evaluates JavaScript rectangle settings with current HA data before drawing its SVG path.
    if (this.hasJavascript && !this.runtimeConfigInitialized) return svg``;

    // After a referenced text item renders, use its browser-measured bounds on this rectangle render.
    this.geometry.svg = this.calculateSvgDimensions(this.config);

    const rectangleStyles = {
      fill: 'var(--primary-background-color)',
      stroke: 'none',
      'stroke-width': 0,
    };
    const styles = this.getStyles(rectangleStyles);

    this.applyColorStops(styles);

    // Draw the border on the full rectangle path and inset the fill with the
    // mask. A wider mask leaves more of the card background between the layers.
    const path = this.buildRoundedRectanglePath();
    const strokeWidth = Number(styles['stroke-width']);
    const fillMaskInset = this.config.fill_mask === 'auto'
      ? strokeWidth / 2
      : this.config.fill_mask;
    const maskId = `${this.cardId}-rectangle-${this.index}-fill-mask`;
    const fillStyles = {
      ...styles,
      stroke: 'none',
      'stroke-width': 0,
      'stroke-opacity': 0,
    };
    const borderStyles = {
      ...styles,
      fill: 'none',
      'fill-opacity': 0,
    };

    return this.renderItemLayers(svg`
      <g
        transform="${this.getGroupScaleTransform()}"
        style="${this.getGroupScaleStyle()}"
        ${this.actionHandler()}
        @action=${(event) => this.handleAction(event)}
      >
        <defs>
          <mask
            id=${maskId}
            maskUnits="userSpaceOnUse"
            maskContentUnits="userSpaceOnUse"
            x=${this.geometry.svg.x - strokeWidth}
            y=${this.geometry.svg.y - strokeWidth}
            width=${this.geometry.svg.width + strokeWidth * 2}
            height=${this.geometry.svg.height + strokeWidth * 2}
            style="mask-type:luminance"
          >
            <path
              d=${path}
              fill="white"
              stroke="black"
              stroke-width=${fillMaskInset * 2}
            ></path>
          </mask>
        </defs>
        <path
          class="rectangle-tool rectangle-tool__fill"
          d=${path}
          mask=${`url(#${maskId})`}
          style=${styleMap(this.getRenderStyles(fillStyles))}
        ></path>
        <path
          class="rectangle-tool__border"
          d=${path}
          style=${styleMap(this.getRenderStyles(borderStyles))}
        ></path>
      </g>
    `);
  }
}
