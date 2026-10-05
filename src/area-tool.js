import { svg } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import { ref } from 'lit/directives/ref.js';
import BaseTool from './base-tool.js';
import ConfigHelper from './config-helper.js';
import { FONT_SIZE, SVG_DEFAULT_DIMENSIONS } from './const.js';

/**
 * Layout area tool that renders the configured entity area text.
 */
export default class AreaTool extends BaseTool {
  /**
   * Stores static area config and precomputes SVG coordinates.
   *
   * @param {object} config - Static area item config.
   * @param {number} index - Area index inside layout.areas.
   * @param {object} templates - Template resolver shared with the card.
   * @param {string} cardId - Stable card id for generated SVG ids.
   * @param {LitElement} card - Parent card instance with shared render helpers.
   */
  constructor(config, index, templates, cardId, card) {
    config.xpos = config.xpos ?? 0;
    config.ypos = config.ypos ?? 0;

    super(config, index, templates, cardId, card, 'areas', 'areas', 0, { fill: true, stroke: false });

    const svgDimensions = this.calculateSvgDimensions();
    const textFontSize = FONT_SIZE * (100 / SVG_DEFAULT_DIMENSIONS);
    this.geometry = {
      svg: svgDimensions,
      characterWidthFactor: 0.6,
      textFontSize,
      estimatedWidth: 0,
      estimatedHeight: textFontSize,
      measuredWidth: 0,
      measuredHeight: 0,
      measuredXpos: svgDimensions.xpos,
      measuredYpos: svgDimensions.ypos,
      hasExactMeasurement: false,
      textMeasurementSignature: '',
    };
    this.runtime.area = '';
    this.setTextElement = (element) => {
      if (element) this.textElement = element;
    };
    this.textElementId = `${this.cardId}-area-${this.index}`;
  }

  /** Updates area configuration and geometry before entity data is assigned. */
  updateRuntimeConfig() {
    super.updateRuntimeConfig();

    if (this.configurationChanged || this.groupChanged) this.geometry.svg = this.calculateSvgDimensions(this.config);
  }

  /**
   * Updates runtime entity context and displayed area text.
   *
   * @param {object} entity - Home Assistant entity state object for this area.
   * @param {object} entityConfig - Entity configuration for this area.
   */
  setState(entity, entityConfig) {
    super.setState(entity, entityConfig);

    this.runtime.area = this.textEllipsis(this.buildArea(), this.config.max_characters ?? this.config.ellipsis);

    this.updateTextMeasurement();
  }

  /** Refreshes the estimated Area bounds when its text or styles change. */
  updateTextMeasurement() {
    const styles = this.getStyles({ 'font-size': '1em' });
    const measurementSignature = `${this.runtime.area}|${JSON.stringify(styles)}`;

    if (measurementSignature !== this.geometry.textMeasurementSignature) {
      this.geometry.textMeasurementSignature = measurementSignature;
      this.geometry.estimatedWidth = this.runtime.area.length * this.geometry.textFontSize * this.geometry.characterWidthFactor;
      this.geometry.estimatedHeight = this.geometry.textFontSize;
      this.geometry.hasExactMeasurement = false;
    }
  }

  /** Applies the supplied styles and refreshes Area measurement inputs. */
  setEffectiveStyles(styles) {
    super.setEffectiveStyles(styles);
    this.updateTextMeasurement();
  }


  /**
   * Measures the actual rendered text and requests one geometry correction render.
   */
  updated() {
    const boundingBox = this.textElement.getBBox();
    const measuredWidth = boundingBox.width * (100 / SVG_DEFAULT_DIMENSIONS);
    const measuredHeight = boundingBox.height * (100 / SVG_DEFAULT_DIMENSIONS);
    const measuredXpos = boundingBox.x + boundingBox.width / 2;
    const measuredYpos = boundingBox.y + boundingBox.height / 2;

    // The cached tspan exposes the real browser-resolved font-size for the next estimate.
    this.geometry.textFontSize = Number.parseFloat(window.getComputedStyle(this.textElement.firstElementChild).fontSize) * (100 / SVG_DEFAULT_DIMENSIONS);

    const measurementChanged =
      !this.geometry.hasExactMeasurement ||
      measuredWidth !== this.geometry.measuredWidth ||
      measuredHeight !== this.geometry.measuredHeight ||
      measuredXpos !== this.geometry.measuredXpos ||
      measuredYpos !== this.geometry.measuredYpos;

    if (measurementChanged) {
      if (this.runtime.area.length > 0) {
        const measuredFactor = measuredWidth / this.runtime.area.length / this.geometry.textFontSize;

        this.geometry.characterWidthFactor = this.geometry.characterWidthFactor * 0.8 + measuredFactor * 0.2;
      }
      this.geometry.measuredWidth = measuredWidth;
      this.geometry.measuredHeight = measuredHeight;
      this.geometry.measuredXpos = measuredXpos;
      this.geometry.measuredYpos = measuredYpos;
      this.geometry.hasExactMeasurement = true;
      this.card.requestUpdate();
    }
  }

  /**
   * Builds the entity area text for this tool.
   *
   * @returns {string} Area text.
   */
  buildArea() {
    if (this.runtime.entityConfig.area !== undefined) {
      return this.card._hass.formatEntityName(this.runtime.entity, this.runtime.entityConfig.area);
    }

    return this.card._hass.formatEntityName(this.runtime.entity, { type: 'area' });
  }

  /**
   * Returns the current area as a standard text part for standalone rendering
   * or composition by TextTool.
   *
   * @param {object} options - Whether to include Area styles and any Text-part style overrides.
   * @returns {Array<object>} One area text part.
   */
  getTextParts(options) {
    let styles = {};

    if (options.includeStyles) {
      styles = this.getStyles({
        'font-size': '1em',
        color: 'var(--primary-text-color)',
        opacity: '1.0',
        'text-anchor': 'middle',
      });
      this.applyColorStops(styles);
    }

    return [{
      type: 'area',
      value: this.runtime.area,
      entity_index: this.entity_index,
      styles: {
        ...styles,
        ...ConfigHelper.toStyleDict(options.styles),
      },
    }];
  }

  /**
   * Renders one area layout item.
   *
   * @returns {TemplateResult} SVG template for the area.
   */
  render() {
    const [areaPart] = this.getTextParts({
      includeStyles: true,
      styles: {},
    });

    return this.renderItemLayers(svg`
      <g
        transform="${this.getGroupScaleTransform()}"
        style="${this.getGroupScaleStyle()}"
      >
        <text ${ref(this.setTextElement)} id="${this.textElementId}" ${this.actionHandler()}
          @action=${(event) => this.handleAction(event)}>
          <tspan
            class="entity__area"
            x="${this.geometry.svg.xpos}"
            y="${this.geometry.svg.ypos}"
            style=${styleMap(this.getRenderStyles(areaPart.styles))}>
            ${areaPart.value}</tspan>
        </text>
      </g>
    `);
  }
}
