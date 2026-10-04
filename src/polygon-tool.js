import { svg } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import BaseTool from './base-tool.js';
import { buildPolygonPathDefinition, calculatePolygonMaximumRadius } from './path-generators.js';
import Utils from './utils.js';

/**
 * Layout polygon tool that renders one complete polygon surface.
 */
export default class PolygonTool extends BaseTool {
  /** Validates evaluated polygon fields and completes the public top position.
   *
   * @param {object} config - Evaluated polygon item config.
   * @returns {object} Valid polygon item config with its resolved top position.
   */
  static translateConfig(config) {
    const sides = config.sides;
    const top = config.top ?? (sides % 2 === 0 ? 0.5 : 0);

    if (!Number.isInteger(sides) || sides < 3) {
      throw new Error('[polygons] sides must be an integer equal to or greater than 3');
    }
    if (config.width === undefined || config.height === undefined || config.width <= 0 || config.height <= 0) {
      throw new Error('[polygons] width and height must be greater than zero');
    }
    if (!Number.isFinite(config.radius) || config.radius < 0) throw new Error('[polygons] radius must be zero or greater');
    if (!Number.isFinite(top) || top < 0 || top > sides) {
      throw new Error(`[polygons] top must be a number from 0 through ${sides}`);
    }
    if (config.fill_mask !== 'auto' && (typeof config.fill_mask !== 'number' || config.fill_mask < 0)) {
      throw new Error('[polygons] fill_mask must be auto or a number equal to or greater than zero');
    }

    return { ...config, top };
  }

  /**
   * Captures polygon source and builds the path immediately for static config.
   * Dynamic sides and top are evaluated before the first path is calculated.
   *
   * @param {object} config - Static polygon item config.
   * @param {number} index - Polygon index inside layout.polygons.
   * @param {object} templates - Template resolver shared with the card.
   * @param {string} cardId - Stable card id for generated SVG ids.
   * @param {LitElement} card - Parent card instance with shared render helpers.
   */
  constructor(config, index, templates, cardId, card) {
    const polygonConfig = {
      fill_mask: 'auto',
      radius: 0,
      ...config,
    };

    super(
      polygonConfig,
      index,
      templates,
      cardId,
      card,
      'polygons',
      'polygons',
      undefined,
      { fill: true, stroke: false },
      PolygonTool.translateConfig,
    );

    this.geometry = {};
    if (!this.hasJavascript) this.geometry = this.calculatePolygonGeometry(this.config);
  }

  /** Updates polygon configuration and geometry before entity data is assigned. */
  updateRuntimeConfig() {
    super.updateRuntimeConfig();

    if (this.configurationChanged || this.groupChanged) this.geometry = this.calculatePolygonGeometry(this.config);
  }

  /**
   * Converts translated polygon config into canonical SVG and path geometry.
   *
   * @param {object} config - Static or evaluated runtime polygon config.
   * @returns {object} Polygon SVG center, path input, and generated path.
   */
  calculatePolygonGeometry(config) {
    const sides = config.sides;

    const center = this.card.cardLayout.calculateSvgCoordinatesInGroup(config);
    const pathInput = {
      type: 'polygon',
      cx: center.xpos,
      cy: center.ypos,
      sides,
      width: Utils.calculateSvgDimension(config.width),
      height: Utils.calculateSvgDimension(config.height),
      radius: Utils.calculateSvgDimension(config.radius),
      start: 0,
      end: sides,
      top: config.top,
      direction: 'clockwise',
    };
    if (pathInput.radius > calculatePolygonMaximumRadius(pathInput)) {
      throw new Error('[polygons] radius is too large for its width, height, and number of sides');
    }

    return {
      svg: center,
      pathInput,
      pathDefinition: buildPolygonPathDefinition(pathInput),
    };
  }

  /**
   * Renders one complete polygon layout item with independent fill and border layers.
   *
   * @returns {TemplateResult} SVG template for the polygon.
   */
  render() {
    // The first HA pass completes dynamic sides/top before a polygon can be drawn.
    if (this.hasJavascript && !this.runtimeConfigInitialized) return svg``;

    const polygonStyles = {
      fill: 'var(--primary-background-color)',
      stroke: 'none',
      'stroke-width': 0,
    };
    const styles = this.getStyles(polygonStyles);

    this.applyColorStops(styles);

    // Mask the fill at the inner half of the border. This keeps translucent
    // fill and stroke from blending while preserving the configured outline.
    const strokeWidth = Number(styles['stroke-width']);
    const fillMaskInset = this.config.fill_mask === 'auto' ? strokeWidth / 2 : this.config.fill_mask;
    // `top` can rotate the shape to any side position. A circle around the
    // configured dimensions gives the fill mask enough room for every angle.
    const maskRadius = Math.hypot(this.geometry.pathInput.width, this.geometry.pathInput.height) / 2;
    const minX = this.geometry.pathInput.cx - maskRadius;
    const maxX = this.geometry.pathInput.cx + maskRadius;
    const minY = this.geometry.pathInput.cy - maskRadius;
    const maxY = this.geometry.pathInput.cy + maskRadius;
    const maskId = `${this.cardId}-polygon-${this.index}-fill-mask`;
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
            x=${minX - strokeWidth}
            y=${minY - strokeWidth}
            width=${maxX - minX + strokeWidth * 2}
            height=${maxY - minY + strokeWidth * 2}
            style="mask-type:luminance"
          >
            <path
              d=${this.geometry.pathDefinition.d}
              fill="white"
              stroke="black"
              stroke-width=${fillMaskInset * 2}
            ></path>
          </mask>
        </defs>
        <path
          class="polygon-tool polygon-tool__fill"
          d=${this.geometry.pathDefinition.d}
          mask=${`url(#${maskId})`}
          style=${styleMap(this.getRenderStyles(fillStyles))}
        ></path>
        <path
          class="polygon-tool__border"
          d=${this.geometry.pathDefinition.d}
          style=${styleMap(this.getRenderStyles(borderStyles))}
        ></path>
      </g>
    `);
  }
}
