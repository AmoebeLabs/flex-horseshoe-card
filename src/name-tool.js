import { svg } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import { ref } from 'lit/directives/ref.js';
import BaseTool from './base-tool.js';
import { FONT_SIZE, SVG_DEFAULT_DIMENSIONS } from './const.js';

/**
 * Layout name tool that renders the configured entity name text.
 */
export default class NameTool extends BaseTool {
  /**
   * Builds name tool instances from the already normalized layout config.
   *
   * @param {object} config - Full card configuration after static card-level normalization.
   * @param {object} templates - Template resolver shared with the card.
   * @param {string} cardId - Stable card id for generated SVG ids.
   * @param {LitElement} card - Parent card instance with shared render helpers.
   * @returns {Array<NameTool>} Configured name tools.
   */
  static setConfig(config, templates, cardId, card) {
    const names = config.layout?.names ?? [];

    return names.map((nameConfig, index) => new NameTool(nameConfig, index, templates, cardId, card));
  }

  /**
   * Stores static name config and precomputes SVG coordinates.
   *
   * @param {object} config - Static name item config.
   * @param {number} index - Name index inside layout.names.
   * @param {object} templates - Template resolver shared with the card.
   * @param {string} cardId - Stable card id for generated SVG ids.
   * @param {LitElement} card - Parent card instance with shared render helpers.
   */
  constructor(config, index, templates, cardId, card) {
    super(config, index, templates, cardId, card, 'names');

    this.config.svg = this.calculateSvgDimensions();
    this.name = '';
    this.setTextElement = (element) => {
      if (element) this.textElement = element;
    };
    this.textElementId = `${this.cardId}-name-${this.index}`;
    this.characterWidthFactor = 0.6;
    this.textFontSize = 1.5 * FONT_SIZE * (100 / SVG_DEFAULT_DIMENSIONS);
    this.estimatedWidth = 0;
    this.estimatedHeight = this.textFontSize;
    this.measuredWidth = 0;
    this.measuredHeight = 0;
    this.measuredXpos = this.config.svg.xpos;
    this.measuredYpos = this.config.svg.ypos;
    this.hasExactMeasurement = false;
    this.textMeasurementSignature = '';
  }

  /**
   * Updates runtime entity context and displayed name text.
   *
   * @param {object} entity - Home Assistant entity state object for this name.
   * @param {object} entityConfig - Entity configuration for this name.
   */
  setState(entity, entityConfig) {
    super.setState(entity, entityConfig);

    if (this.configChanged) this.config.svg = this.calculateSvgDimensions(this.config);
    this.name = this.textEllipsis(this.buildName(), this.config.max_characters ?? this.config.ellipsis);

    // Keep the first render close to the final size. updated() replaces this
    // estimate with the actual SVG bounding box after the text is painted.
    const styles = this.getStyles({ 'font-size': '1.5em' });
    const measurementSignature = `${this.name}|${JSON.stringify(styles)}`;

    if (measurementSignature !== this.textMeasurementSignature) {
      this.textMeasurementSignature = measurementSignature;
      this.estimatedWidth = this.name.length * this.textFontSize * this.characterWidthFactor;
      this.estimatedHeight = this.textFontSize;
      this.hasExactMeasurement = false;
    }
  }

  /**
   * Returns the rendered width, or the learned estimate before the next SVG measurement.
   *
   * @returns {number} Width in FHS coordinates.
   */
  getWidth() {
    return this.hasExactMeasurement ? this.measuredWidth : this.estimatedWidth;
  }

  /**
   * Returns the rendered height, or the font-based estimate before measurement.
   *
   * @returns {number} Height in FHS coordinates.
   */
  getHeight() {
    return this.hasExactMeasurement ? this.measuredHeight : this.estimatedHeight;
  }

  /**
   * Returns the horizontal center of the rendered text bounding box.
   *
   * @returns {number} Horizontal center in SVG coordinates.
   */
  getXpos() {
    return this.hasExactMeasurement ? this.measuredXpos : this.config.svg.xpos;
  }

  /**
   * Returns the vertical center of the rendered text bounding box.
   *
   * @returns {number} Vertical center in SVG coordinates.
   */
  getYpos() {
    return this.hasExactMeasurement ? this.measuredYpos : this.config.svg.ypos;
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
    this.textFontSize = Number.parseFloat(window.getComputedStyle(this.textElement.firstElementChild).fontSize) * (100 / SVG_DEFAULT_DIMENSIONS);

    const measurementChanged = !this.hasExactMeasurement || measuredWidth !== this.measuredWidth || measuredHeight !== this.measuredHeight || measuredXpos !== this.measuredXpos || measuredYpos !== this.measuredYpos;

    if (measurementChanged) {
      if (this.name.length > 0) {
        const measuredFactor = measuredWidth / this.name.length / this.textFontSize;

        this.characterWidthFactor = this.characterWidthFactor * 0.8 + measuredFactor * 0.2;
      }
      this.measuredWidth = measuredWidth;
      this.measuredHeight = measuredHeight;
      this.measuredXpos = measuredXpos;
      this.measuredYpos = measuredYpos;
      this.hasExactMeasurement = true;
      this.card.requestUpdate();
    }
  }

  /**
   * Converts name config coordinates to SVG coordinates.
   *
   * @param {object} config - Static or runtime name config.
   * @returns {object} SVG coordinates.
   */
  calculateSvgDimensions(config = this.config) {
    return this.card._calculateSvgCoordinatesInGroup(config);
  }

  /**
   * Builds the entity name text for this tool.
   *
   * @returns {string} Name text.
   */
  buildName() {
    if (this.entity.label) {
      return this.card._hass.localize(`ui.components.statistics_charts.statistic_types.${this.entity.label}`) || this.entity.label;
    }

    return this.entityConfig.name ?? this.entity.name ?? this.entity.attributes.friendly_name ?? this.entity?.entity_id ?? '?';
  }

  /**
   * Renders one name layout item.
   *
   * @returns {TemplateResult} SVG template for the name.
   */
  render() {
    const nameStyles = {
      'font-size': '1.5em',
      color: 'var(--primary-text-color)',
      opacity: '1.0',
      'text-anchor': 'middle',
    };
    const styles = this.getStyles(nameStyles);

    this.applyColorStops(styles, 'stroke');

    return this.renderItemLayers(svg`
      <g
        transform="${this.getGroupScaleTransform()}"
        style="${this.getGroupScaleStyle()}"
      >
        <text ${ref(this.setTextElement)} id="${this.textElementId}" @click=${(event) => this.handlePopup(event)}>
          <tspan
            class="entity__name"
            x="${this.config.svg.xpos}"
            y="${this.config.svg.ypos}"
            style=${styleMap(this.getRenderStyles(styles))}>
            ${this.name}</tspan>
        </text>
      </g>
    `);
  }
}
