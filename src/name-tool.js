import { svg } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import { ref } from 'lit/directives/ref.js';
import BaseTool from './base-tool.js';
import ConfigHelper from './config-helper.js';
import { FONT_SIZE, SVG_DEFAULT_DIMENSIONS } from './const.js';

/**
 * Layout name tool that renders the configured entity name text.
 */
export default class NameTool extends BaseTool {
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
    config.xpos = config.xpos ?? 0;
    config.ypos = config.ypos ?? 0;

    super(config, index, templates, cardId, card, 'names', 'names', 0, { fill: true, stroke: false });

    const svgDimensions = this.calculateSvgDimensions();
    const textFontSize = 1.5 * FONT_SIZE * (100 / SVG_DEFAULT_DIMENSIONS);
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
    this.runtime.name = '';
    this.setTextElement = (element) => {
      if (element) this.textElement = element;
    };
    this.textElementId = `${this.cardId}-name-${this.index}`;
  }

  /** Updates name configuration and geometry before entity data is assigned. */
  updateRuntimeConfig() {
    super.updateRuntimeConfig();

    if (this.configurationChanged || this.groupChanged) this.geometry.svg = this.calculateSvgDimensions(this.config);
  }

  /**
   * Updates runtime entity context and displayed name text.
   *
   * @param {object} entity - Home Assistant entity state object for this name.
   * @param {object} entityConfig - Entity configuration for this name.
   */
  setState(entity, entityConfig) {
    super.setState(entity, entityConfig);

    this.runtime.name = this.textEllipsis(this.buildName(), this.config.max_characters ?? this.config.ellipsis);

    this.updateTextMeasurement();
  }

  /** Estimates name geometry and invalidates exact bounds when text or paint changes. */
  updateTextMeasurement() {
    const styles = this.getStyles({ 'font-size': '1.5em' });
    const measurementSignature = `${this.runtime.name}|${JSON.stringify(styles)}`;

    if (measurementSignature !== this.geometry.textMeasurementSignature) {
      this.geometry.textMeasurementSignature = measurementSignature;
      this.geometry.estimatedWidth = this.runtime.name.length * this.geometry.textFontSize * this.geometry.characterWidthFactor;
      this.geometry.estimatedHeight = this.geometry.textFontSize;
      this.geometry.hasExactMeasurement = false;
    }
  }

  /** Publishes effective styles and updates measurement only when its signature changes. */
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
      if (this.runtime.name.length > 0) {
        const measuredFactor = measuredWidth / this.runtime.name.length / this.geometry.textFontSize;

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
   * Builds the entity name text for this tool.
   *
   * @returns {string} Name text.
   */
  buildName() {
    if (this.runtime.entity.label) {
      return this.card._hass.localize(`ui.components.statistics_charts.statistic_types.${this.runtime.entity.label}`) || this.runtime.entity.label;
    }

    if (this.runtime.entityConfig.name !== undefined) {
      return this.card._hass.formatEntityName(this.runtime.entity, this.runtime.entityConfig.name);
    }

    if (this.runtime.entityConfig.attribute !== undefined) {
      return this.card._hass.formatEntityAttributeName(this.runtime.entity, this.runtime.entityConfig.attribute);
    }

    return this.card._hass.formatEntityName(this.runtime.entity, { type: 'entity' });
  }

  /**
   * Returns the current name as a standard text part for standalone rendering
   * or composition by TextTool.
   *
   * @param {object} options - Source-style selection and final part overrides.
   * @returns {Array<object>} One name text part.
   */
  getTextParts(options) {
    let styles = {};

    if (options.includeStyles) {
      styles = this.getStyles({
        'font-size': '1.5em',
        color: 'var(--primary-text-color)',
        opacity: '1.0',
        'text-anchor': 'middle',
      });
      this.applyColorStops(styles);
    }

    return [{
      type: 'name',
      value: this.runtime.name,
      entity_index: this.entity_index,
      styles: {
        ...styles,
        ...ConfigHelper.toStyleDict(options.styles),
      },
    }];
  }

  /**
   * Renders one name layout item.
   *
   * @returns {TemplateResult} SVG template for the name.
   */
  render() {
    const [namePart] = this.getTextParts({
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
            class="entity__name"
            x="${this.geometry.svg.xpos}"
            y="${this.geometry.svg.ypos}"
            style=${styleMap(this.getRenderStyles(namePart.styles))}>
            ${namePart.value}</tspan>
        </text>
      </g>
    `);
  }
}
