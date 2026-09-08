import { svg } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import BaseTool from './base-tool.js';
import { buildPolygonPathDefinition, calculatePolygonMaximumRadius } from './path-generators.js';
import Utils from './utils.js';

/**
 * Layout polygon tool that renders one complete polygon surface.
 */
export default class PolygonTool extends BaseTool {
  /**
   * Builds polygon tool instances from the already normalized layout config.
   *
   * @param {object} config - Full card configuration after static card-level normalization.
   * @param {object} templates - Template resolver shared with the card.
   * @param {string} cardId - Stable card id for generated SVG ids.
   * @param {LitElement} card - Parent card instance with shared render helpers.
   * @returns {Array<PolygonTool>} Configured polygon tools.
   */
  static setConfig(config, templates, cardId, card) {
    const polygons = config.layout?.polygons ?? [];

    return polygons.map((polygonConfig, index) => new PolygonTool(polygonConfig, index, templates, cardId, card));
  }

  /**
   * Validates the public polygon shape and builds its complete SVG path.
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

    super(polygonConfig, index, templates, cardId, card, 'polygons', 'polygons', undefined, { fill: true, stroke: false });

    this.setPolygonPathDefinition(this.config);
  }

  /** Updates polygon configuration and geometry before entity data is assigned. */
  updateRuntimeConfig() {
    super.updateRuntimeConfig();

    if (this.configChanged) this.setPolygonPathDefinition(this.config);
  }

  /**
   * Validates polygon sizing and converts it to the shared path-generator config.
   *
   * @param {object} config - Static or evaluated runtime polygon config.
   */
  setPolygonPathDefinition(config) {
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

    const center = this.card.cardLayout.calculateSvgCoordinatesInGroup(config);
    config.svg = center;
    this.pathConfig = {
      type: 'polygon',
      cx: center.xpos,
      cy: center.ypos,
      sides,
      width: Utils.calculateSvgDimension(config.width),
      height: Utils.calculateSvgDimension(config.height),
      radius: Utils.calculateSvgDimension(config.radius),
      start: 0,
      end: sides,
      top,
      direction: 'clockwise',
    };
    if (this.pathConfig.radius > calculatePolygonMaximumRadius(this.pathConfig)) {
      throw new Error('[polygons] radius is too large for its width, height, and number of sides');
    }
    this.pathDefinition = buildPolygonPathDefinition(this.pathConfig);
  }

  /**
   * Renders one complete polygon layout item with independent fill and border layers.
   *
   * @returns {TemplateResult} SVG template for the polygon.
   */
  render() {
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
    const maskRadius = Math.hypot(this.pathConfig.width, this.pathConfig.height) / 2;
    const minX = this.pathConfig.cx - maskRadius;
    const maxX = this.pathConfig.cx + maskRadius;
    const minY = this.pathConfig.cy - maskRadius;
    const maxY = this.pathConfig.cy + maskRadius;
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
              d=${this.pathDefinition.d}
              fill="white"
              stroke="black"
              stroke-width=${fillMaskInset * 2}
            ></path>
          </mask>
        </defs>
        <path
          class="polygon-tool polygon-tool__fill"
          d=${this.pathDefinition.d}
          mask=${`url(#${maskId})`}
          style=${styleMap(this.getRenderStyles(fillStyles))}
        ></path>
        <path
          class="polygon-tool__border"
          d=${this.pathDefinition.d}
          style=${styleMap(this.getRenderStyles(borderStyles))}
        ></path>
      </g>
    `);
  }
}
