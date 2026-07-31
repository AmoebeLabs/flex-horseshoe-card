import { svg } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import { ref } from 'lit/directives/ref.js';
import BaseTool from './base-tool.js';
import ColorStops from './color-stops.js';
import ConfigHelper from './config-helper.js';
import Merge from './merge.js';
import Templates from './templates.js';
import { FONT_SIZE, SVG_DEFAULT_DIMENSIONS } from './const.js';

/**
 * Standalone multipart SVG text tool.
 *
 * The public `text` value is normalized into independently evaluated parts.
 * This keeps literal text simple while preserving the rendering model needed
 * for future references to name, area and state items.
 */
export default class TextTool extends BaseTool {
  /**
   * Builds text tool instances from the normalized layout config.
   *
   * @param {object} config - Full normalized card configuration.
   * @param {object} templates - Shared template resolver.
   * @param {string} cardId - Stable card id for generated SVG ids.
   * @param {LitElement} card - Parent card instance.
   * @returns {Array<TextTool>} Configured text tools.
   */
  static setConfig(config, templates, cardId, card) {
    const texts = config.layout?.texts ?? [];

    return texts.map((textConfig, index) => new TextTool(textConfig, index, templates, cardId, card));
  }

  /**
   * Stores outer text config separately from its independently evaluated parts.
   *
   * @param {object} config - Static text item config.
   * @param {number} index - Text index inside layout.texts.
   * @param {object} templates - Shared template resolver.
   * @param {string} cardId - Stable card id for generated SVG ids.
   * @param {LitElement} card - Parent card instance.
   */
  constructor(config, index, templates, cardId, card) {
    const configuredParts = Array.isArray(config.text) ? config.text : [config.text];
    const sourceTextParts = configuredParts.map((part) => {
      const partConfig = typeof part === 'object' ? part : { value: part };

      return {
        type: 'text',
        ...(partConfig.new_line ? { dy: 1.2 } : {}),
        ...partConfig,
      };
    });
    const outerConfig = {
      tap_action: { action: 'none' },
      ...config,
    };

    delete outerConfig.text;
    super(outerConfig, index, templates, cardId, card, 'texts', 'texts', undefined);

    this.sourceTextParts = sourceTextParts;
    this.textPartsHaveJavascript = this.sourceTextParts.some((part) => Templates.hasJavascriptTemplates(part));
    this.activeTextParts = [];
    this.activeTextPartsSignature = undefined;
    this.textParts = [];
    this.config.svg = this.calculateSvgDimensions();
    this.setTextElement = (element) => {
      if (element) this.textElement = element;
    };
    this.textElementId = `${this.cardId}-text-${this.index}`;
    this.characterWidthFactor = 0.6;
    this.textFontSize = FONT_SIZE * (100 / SVG_DEFAULT_DIMENSIONS);
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
   * Evaluates every text part with its own effective entity context.
   */
  updateRuntimeConfig() {
    super.updateRuntimeConfig();

    if (this.configChanged) this.config.svg = this.calculateSvgDimensions(this.config);

    if (this.activeTextPartsSignature === undefined || this.configChanged || (this.textPartsHaveJavascript && this.card.evaluateJavascriptTemplates)) {
      const activeTextParts = this.sourceTextParts.map((sourcePart) => {
        const partContext = {
          ...sourcePart,
          entity_index: sourcePart.entity_index ?? this.config.entity_index,
        };
        const activePart = Templates.hasJavascriptTemplates(sourcePart)
          ? Templates.getJsTemplateOrValue(partContext, partContext, { resolveKeys: true })
          : partContext;

        if (activePart.color_stops) {
          activePart.colorstops = ColorStops.normalize(activePart.color_stops, this.card.getActiveColorStopMode());
        }

        return activePart;
      });
      const activeTextPartsSignature = JSON.stringify(activeTextParts);

      if (activeTextPartsSignature !== this.activeTextPartsSignature) {
        this.activeTextParts = activeTextParts;
        this.activeTextPartsSignature = activeTextPartsSignature;
        this.configChanged = true;
      }
    }
  }

  /**
   * Activates state-map overrides and applies part and line ellipsis before rendering.
   *
   * @param {object} entity - Optional entity selected by the outer text item.
   * @param {object} entityConfig - Optional outer entity configuration.
   */
  setState(entity, entityConfig) {
    super.setState(entity, entityConfig);

    const activeParts = this.activeTextParts.map((part) => {
      const partEntity = this.card.entities[part.entity_index];
      const stateMapEntries = part.state_map?.map;
      const stateMapPart = stateMapEntries
        ? stateMapEntries.find((entry) => String(entry.state) === String(partEntity.state)) ?? stateMapEntries.find((entry) => entry.state === 'default')
        : undefined;
      const activePart = stateMapPart ? Merge.mergeDeep(part, stateMapPart) : { ...part };

      if (activePart.color_stops) {
        activePart.colorstops = ColorStops.normalize(activePart.color_stops, this.card.getActiveColorStopMode());
      }

      activePart.value = this.textEllipsis(String(activePart.value), activePart.ellipsis);

      return activePart;
    });

    // The outer ellipsis limit applies independently to every visual line. The
    // part crossing the limit keeps its own style, color and animation config.
    let remainingCharacters = this.config.ellipsis;
    let lineIsFull = false;
    const textParts = [];

    activeParts.forEach((part) => {
      if (part.new_line) {
        remainingCharacters = this.config.ellipsis;
        lineIsFull = false;
      }

      if (lineIsFull) return;

      if (remainingCharacters && part.value.length > remainingCharacters) {
        textParts.push({
          ...part,
          value: this.textEllipsis(part.value, remainingCharacters),
        });
        remainingCharacters = 0;
        lineIsFull = true;
        return;
      }

      textParts.push(part);
      if (remainingCharacters) remainingCharacters -= part.value.length;
      if (remainingCharacters === 0 && this.config.ellipsis) lineIsFull = true;
    });

    this.textParts = textParts;

    const lineLengths = [0];
    this.textParts.forEach((part) => {
      if (part.new_line) lineLengths.push(0);
      lineLengths[lineLengths.length - 1] += part.value.length;
    });
    const outerStyles = this.getStyles({ 'font-size': '1em' });
    const measurementSignature = `${JSON.stringify(this.textParts)}|${JSON.stringify(outerStyles)}`;

    if (measurementSignature !== this.textMeasurementSignature) {
      this.textMeasurementSignature = measurementSignature;
      this.estimatedWidth = Math.max(...lineLengths) * this.textFontSize * this.characterWidthFactor;
      this.estimatedHeight = lineLengths.length * this.textFontSize * 1.2;
      this.hasExactMeasurement = false;
    }
  }

  /** @returns {number} Measured or estimated width in FHS coordinates. */
  getWidth() {
    return this.hasExactMeasurement ? this.measuredWidth : this.estimatedWidth;
  }

  /** @returns {number} Measured or estimated height in FHS coordinates. */
  getHeight() {
    return this.hasExactMeasurement ? this.measuredHeight : this.estimatedHeight;
  }

  /** @returns {number} Horizontal center of the complete rendered text. */
  getXpos() {
    return this.hasExactMeasurement ? this.measuredXpos : this.config.svg.xpos;
  }

  /** @returns {number} Vertical center of the complete rendered text. */
  getYpos() {
    return this.hasExactMeasurement ? this.measuredYpos : this.config.svg.ypos;
  }

  /** Measures the complete inline or multiline SVG text result. */
  updated() {
    const boundingBox = this.textElement.getBBox();
    const measuredWidth = boundingBox.width * (100 / SVG_DEFAULT_DIMENSIONS);
    const measuredHeight = boundingBox.height * (100 / SVG_DEFAULT_DIMENSIONS);
    const measuredXpos = boundingBox.x + boundingBox.width / 2;
    const measuredYpos = boundingBox.y + boundingBox.height / 2;

    this.textFontSize = Number.parseFloat(window.getComputedStyle(this.textElement.firstElementChild).fontSize) * (100 / SVG_DEFAULT_DIMENSIONS);

    const measurementChanged = !this.hasExactMeasurement || measuredWidth !== this.measuredWidth || measuredHeight !== this.measuredHeight || measuredXpos !== this.measuredXpos || measuredYpos !== this.measuredYpos;

    if (measurementChanged) {
      const characterCount = this.textParts.reduce((count, part) => count + part.value.length, 0);

      if (characterCount > 0) {
        const measuredFactor = measuredWidth / characterCount / this.textFontSize;

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

  /** @returns {object} SVG coordinates calculated through the normal group pipeline. */
  calculateSvgDimensions(config = this.config) {
    return this.card._calculateSvgCoordinatesInGroup(config);
  }

  /**
   * Renders every active part while preserving outer alignment and inheritance.
   *
   * @returns {TemplateResult} Complete SVG text item.
   */
  render() {
    const actionConfigs = [this.config.tap_action, this.config.hold_action, this.config.double_tap_action];
    const hasActiveAction = actionConfigs.some((actionConfig) => {
      if (!actionConfig) return false;
      const actions = actionConfig.actions ?? [actionConfig];

      return actions.some((action) => action.action !== 'none');
    });
    const textStyles = this.getStyles({
      'font-size': '1em',
      fill: 'var(--primary-text-color)',
      opacity: '1.0',
      'text-anchor': 'middle',
      'dominant-baseline': 'middle',
      'pointer-events': hasActiveAction ? 'auto' : 'none',
    });

    this.applyColorStops(textStyles, 'fill');

    return this.renderItemLayers(svg`
      <g
        transform="${this.getGroupScaleTransform()}"
        style="${this.getGroupScaleStyle()}"
      >
        <text
          ${ref(this.setTextElement)}
          id="${this.textElementId}"
          x="${this.config.svg.xpos}"
          y="${this.config.svg.ypos}"
          dominant-baseline="${textStyles['dominant-baseline']}"
          style=${styleMap(this.getRenderStyles(textStyles))}
          ${this.actionHandler()}
          @action=${(event) => this.handleAction(event)}
        >${this.textParts.map((part) => {
          const partStyles = ConfigHelper.toStyleDict(part.styles);
          const stopColor = this.card._getItemColorFromStops(part);
          const animationStyles = ConfigHelper.toStyleDict(this.card.animations.texts[part.animation_id] ?? {});

          if (stopColor) partStyles.fill = stopColor;

          const styles = {
            ...partStyles,
            ...animationStyles,
          };
          const dx = part.dx ?? 0;
          const dy = part.dy ?? 0;

          return part.new_line
            ? svg`<tspan
                class="text-tool__part"
                x="${this.config.svg.xpos}"
                dx="${dx}em"
                dy="${dy}em"
                dominant-baseline="${textStyles['dominant-baseline']}"
                style=${styleMap(this.getRenderStyles(styles))}
              >${part.value}</tspan>`
            : svg`<tspan
                class="text-tool__part"
                dx="${dx}em"
                dy="${dy}em"
                dominant-baseline="${textStyles['dominant-baseline']}"
                style=${styleMap(this.getRenderStyles(styles))}
              >${part.value}</tspan>`;
        })}</text>
      </g>
    `);
  }
}
