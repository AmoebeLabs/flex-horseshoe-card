import { svg } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import BaseTool from './base-tool.js';
import Utils from './utils.js';

/**
 * Layout line tool that renders horizontal, vertical, and from-to SVG lines.
 */
export default class LineTool extends BaseTool {
  /**
   * Builds line tool instances from generic lines and legacy hlines/vlines config.
   *
   * @param {object} config - Full card configuration after static card-level normalization.
   * @param {object} templates - Template resolver shared with the card.
   * @param {string} cardId - Stable card id for generated SVG ids.
   * @param {LitElement} card - Parent card instance with shared render helpers.
   * @returns {Array<LineTool>} Configured line tools.
   */
  static setConfig(config, templates, cardId, card) {
    const lineConfigs = [
      ...(config.layout?.lines ?? []).map((lineConfig) => LineTool.normalizeLineConfig(lineConfig, 'lines')),
      ...(config.layout?.hlines ?? []).map((lineConfig) => LineTool.normalizeLineConfig(lineConfig, 'hlines')),
      ...(config.layout?.vlines ?? []).map((lineConfig) => LineTool.normalizeLineConfig(lineConfig, 'vlines')),
    ];

    return lineConfigs.map((lineConfig, index) => new LineTool(lineConfig, index, templates, cardId, card));
  }

  /**
   * Translates legacy hlines/vlines into the generic orientation model.
   *
   * @param {object} config - Line-like layout item config.
   * @param {string} section - Source layout section: lines, hlines, or vlines.
   * @returns {object} Generic line config with orientation and animation section.
   */
  static normalizeLineConfig(config, section) {
    let orientation = config.orientation ?? 'horizontal';

    if (section === 'hlines') {
      orientation = 'horizontal';
    }

    if (section === 'vlines') {
      orientation = 'vertical';
    }

    return {
      ...config,
      orientation,
      animation_section: section,
    };
  }

  /**
   * Stores static line config and precomputes SVG coordinates.
   *
   * @param {object} config - Static line item config.
   * @param {number} index - Line index across lines, hlines, and vlines.
   * @param {object} templates - Template resolver shared with the card.
   * @param {string} cardId - Stable card id for generated SVG ids.
   * @param {LitElement} card - Parent card instance with shared render helpers.
   */
  constructor(config, index, templates, cardId, card) {
    const lineConfig = {
      orientation: 'horizontal',
      length: 10,
      xpos: 50,
      ypos: 50,
      ...config,
    };

    super(lineConfig, index, templates, cardId, card, lineConfig.animation_section, lineConfig.animation_section, undefined);

    this.validateOrientation(this.config.orientation);
    this.config.svg = this.calculateSvgDimensions();
  }

  /**
   * Updates runtime entity context for this line.
   *
   * @param {object} entity - Home Assistant entity state object for this line.
   * @param {object} entityConfig - Entity configuration for this line.
   */
  setState(entity, entityConfig) {
    super.setState(entity, entityConfig);

    if (this.configChanged) {
      this.validateOrientation(this.config.orientation);
      this.config.svg = this.calculateSvgDimensions(this.config);
    }
  }

  /**
   * Validates the configured line orientation at config/runtime boundaries.
   *
   * @param {string} orientation - Line orientation from config.
   */
  validateOrientation(orientation) {
    if (!['horizontal', 'vertical', 'fromto'].includes(orientation)) {
      throw Error(`LineTool::validateOrientation - invalid orientation '${orientation}' [horizontal, vertical, fromto]`);
    }
  }

  /**
   * Converts line config coordinates to SVG x1/y1/x2/y2 values.
   *
   * @param {object} config - Static or runtime line config.
   * @returns {object} SVG line coordinates and center coordinate for group transforms.
   */
  calculateSvgDimensions(config = this.config) {
    if (config.orientation === 'fromto') {
      const startConfig = config.start ?? { xpos: config.x1, ypos: config.y1 };
      const endConfig = config.end ?? { xpos: config.x2, ypos: config.y2 };
      const start = this.card._calculateSvgCoordinatesInGroup({
        ...config,
        xpos: startConfig.xpos ?? startConfig.x,
        ypos: startConfig.ypos ?? startConfig.y,
      });
      const end = this.card._calculateSvgCoordinatesInGroup({
        ...config,
        xpos: endConfig.xpos ?? endConfig.x,
        ypos: endConfig.ypos ?? endConfig.y,
      });

      return {
        xpos: (start.xpos + end.xpos) / 2,
        ypos: (start.ypos + end.ypos) / 2,
        x1: start.xpos,
        y1: start.ypos,
        x2: end.xpos,
        y2: end.ypos,
      };
    }

    const svgDimensions = this.card._calculateSvgCoordinatesInGroup(config);
    const length = Utils.calculateSvgDimension(config.length);

    if (config.orientation === 'vertical') {
      return {
        ...svgDimensions,
        length,
        x1: svgDimensions.xpos,
        y1: svgDimensions.ypos - length / 2,
        x2: svgDimensions.xpos,
        y2: svgDimensions.ypos + length / 2,
      };
    }

    return {
      ...svgDimensions,
      length,
      x1: svgDimensions.xpos - length / 2,
      y1: svgDimensions.ypos,
      x2: svgDimensions.xpos + length / 2,
      y2: svgDimensions.ypos,
    };
  }

  /**
   * Renders one line layout item.
   *
   * @returns {TemplateResult} SVG template for the line.
   */
  render() {
    const lineStyles = {
      'stroke-linecap': 'round',
      stroke: 'var(--primary-text-color)',
      opacity: '1.0',
      'stroke-width': '2',
    };
    const styles = this.getStyles(lineStyles);

    this.applyColorStops(styles, 'stroke');

    return this.renderItemLayers(svg`
      <g
        transform="${this.getGroupScaleTransform()}"
        style="${this.getGroupScaleStyle()}"
      >
        <line
          @click=${(event) => this.handlePopup(event)}
          class="line-tool"
          x1="${this.config.svg.x1}"
          y1="${this.config.svg.y1}"
          x2="${this.config.svg.x2}"
          y2="${this.config.svg.y2}"
          style=${styleMap(this.getRenderStyles(styles))}
        ></line>
      </g>
    `);
  }
}
