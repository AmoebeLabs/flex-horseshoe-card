import { svg } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import { ref } from 'lit/directives/ref.js';
import BaseTool from './base-tool.js';
import { FONT_SIZE, SVG_DEFAULT_DIMENSIONS } from './const.js';

/**
 * Layout area tool that renders the configured entity area text.
 */
export default class AreaTool extends BaseTool {
  /**
   * Builds area tool instances from the already normalized layout config.
   *
   * @param {object} config - Full card configuration after static card-level normalization.
   * @param {object} templates - Template resolver shared with the card.
   * @param {string} cardId - Stable card id for generated SVG ids.
   * @param {LitElement} card - Parent card instance with shared render helpers.
   * @returns {Array<AreaTool>} Configured area tools.
   */
  static setConfig(config, templates, cardId, card) {
    const areas = config.layout?.areas ?? [];

    return areas.map((areaConfig, index) => new AreaTool(areaConfig, index, templates, cardId, card));
  }

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
    super(config, index, templates, cardId, card, 'areas');

    this.config.svg = this.calculateSvgDimensions();
    this.runtimeConfig = this.config;
    this.area = '';
    this.setTextElement = (element) => {
      if (element) this.textElement = element;
    };
    this.textElementId = `${this.cardId}-area-${this.index}`;
    this.characterWidthFactor = 0.6;
    this.textFontSize = FONT_SIZE * (100 / SVG_DEFAULT_DIMENSIONS);
    this.estimatedWidth = 0;
    this.estimatedHeight = this.textFontSize;
    this.measuredWidth = 0;
    this.measuredHeight = 0;
    this.measuredXpos = this.runtimeConfig.svg.xpos;
    this.measuredYpos = this.runtimeConfig.svg.ypos;
    this.hasExactMeasurement = false;
    this.textMeasurementSignature = '';
  }

  /**
   * Updates runtime entity context and displayed area text.
   *
   * @param {object} entity - Home Assistant entity state object for this area.
   * @param {object} entityConfig - Entity configuration for this area.
   */
  setState(entity, entityConfig) {
    super.setState(entity, entityConfig);

    this.runtimeConfig.svg = this.calculateSvgDimensions(this.runtimeConfig);
    this.area = this.textEllipsis(this.buildArea(), this.runtimeConfig.max_characters ?? this.runtimeConfig.ellipsis);

    // Keep the first render close to the final size. updated() replaces this
    // estimate with the actual SVG bounding box after the text is painted.
    const styles = this.getStyles({ 'font-size': '1em' });
    const measurementSignature = `${this.area}|${JSON.stringify(styles)}`;

    if (measurementSignature !== this.textMeasurementSignature) {
      this.textMeasurementSignature = measurementSignature;
      this.estimatedWidth = this.area.length * this.textFontSize * this.characterWidthFactor;
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
    return this.hasExactMeasurement ? this.measuredXpos : this.runtimeConfig.svg.xpos;
  }

  /**
   * Returns the vertical center of the rendered text bounding box.
   *
   * @returns {number} Vertical center in SVG coordinates.
   */
  getYpos() {
    return this.hasExactMeasurement ? this.measuredYpos : this.runtimeConfig.svg.ypos;
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
      if (this.area.length > 0) {
        const measuredFactor = measuredWidth / this.area.length / this.textFontSize;

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
   * Converts area config coordinates to SVG coordinates.
   *
   * @param {object} config - Static or runtime area config.
   * @returns {object} SVG coordinates.
   */
  calculateSvgDimensions(config = this.config) {
    return this.card._calculateSvgCoordinatesInGroup(config);
  }

  /**
   * Builds the entity area text for this tool.
   *
   * @returns {string} Area text.
   */
  buildArea() {
    if (this.entityConfig.area) {
      return this.entityConfig.area;
    }

    if (!this.card._hass || !this.card._hass.areas) return '';

    // First check whether the entity itself has a direct area assignment.
    const entityRegistry = this.card._hass.entities && this.card._hass.entities[this.entityConfig.entity];
    let areaId = entityRegistry ? entityRegistry.area_id : null;

    // If not, follow the device relation and use the device area assignment.
    if (!areaId && entityRegistry && entityRegistry.device_id && this.card._hass.devices) {
      const device = this.card._hass.devices[entityRegistry.device_id];
      areaId = device ? device.area_id : null;
    }

    if (areaId) {
      const area = this.card._hass.areas[areaId];
      return area ? area.name : '';
    }

    return '?';
  }

  /**
   * Renders one area layout item.
   *
   * @returns {TemplateResult} SVG template for the area.
   */
  render() {
    const areaStyles = {
      'font-size': '1em',
      color: 'var(--primary-text-color)',
      opacity: '1.0',
      'text-anchor': 'middle',
    };
    const styles = this.getStyles(areaStyles);

    this.applyColorStops(styles, 'stroke');

    return this.renderItemLayers(svg`
      <g
        transform="${this.getGroupScaleTransform()}"
        style="${this.getGroupScaleStyle()}"
      >
        <text ${ref(this.setTextElement)} id="${this.textElementId}" @click=${(event) => this.handlePopup(event)}>
          <tspan
            class="entity__area"
            x="${this.runtimeConfig.svg.xpos}"
            y="${this.runtimeConfig.svg.ypos}"
            style=${styleMap(this.getRenderStyles(styles))}>
            ${this.area}</tspan>
        </text>
      </g>
    `);
  }
}
