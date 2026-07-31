import { svg } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import { ref } from 'lit/directives/ref.js';
import BaseTool from './base-tool.js';
import ColorStops from './color-stops.js';
import ConfigHelper from './config-helper.js';
import Merge from './merge.js';
import Templates from './templates.js';
import { FONT_SIZE, SVG_DEFAULT_DIMENSIONS } from './const.js';

const TEXT_SOURCE_SECTIONS = {
  name: 'names',
  area: 'areas',
  state: 'states',
};

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

    if (outerConfig.text_overflow?.mode === 'wrap' && outerConfig.text_overflow.wrap.dy === undefined) {
      outerConfig.text_overflow = {
        ...outerConfig.text_overflow,
        wrap: {
          dy: 1.2,
          ...outerConfig.text_overflow.wrap,
        },
      };
    }

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
    this.textFitScale = 1;
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

    // Static references are validated during construction. A hidden source is
    // still present here; a disabled or misspelled source is not.
    this.sourceTextParts.forEach((part) => {
      if (TEXT_SOURCE_SECTIONS[part.type]) this.getReferencedTextTool(part);
    });
  }

  /**
   * Finds the NameTool, AreaTool or StateTool selected by one referenced part.
   *
   * @param {object} part - Text part with source type and source item id.
   * @returns {BaseTool} Referenced source tool.
   */
  getReferencedTextTool(part) {
    const section = TEXT_SOURCE_SECTIONS[part.type];
    const sourceTool = this.card.getToolsBySection(section)
      .find((tool) => String(tool.id) === String(part.id));

    if (!sourceTool) {
      throw new Error(`[texts] ${part.type} source '${part.id}' not found for text '${this.id}'`);
    }

    return sourceTool;
  }

  /**
   * Evaluates every text part with its own effective entity context.
   */
  updateRuntimeConfig() {
    super.updateRuntimeConfig();

    if (this.configChanged) this.config.svg = this.calculateSvgDimensions(this.config);

    if (this.activeTextPartsSignature === undefined || this.configChanged || (this.textPartsHaveJavascript && this.card.evaluateJavascriptTemplates)) {
      const activeTextParts = this.sourceTextParts.map((sourcePart) => {
        const sourceTool = TEXT_SOURCE_SECTIONS[sourcePart.type]
          ? this.getReferencedTextTool(sourcePart)
          : undefined;
        const partContext = {
          ...sourcePart,
          entity_index: sourceTool
            ? sourceTool.entity_index
            : sourcePart.entity_index ?? this.config.entity_index,
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
   * Activates state-map overrides and applies wrapping and ellipsis before rendering.
   *
   * @param {object} entity - Optional entity selected by the outer text item.
   * @param {object} entityConfig - Optional outer entity configuration.
   */
  setState(entity, entityConfig) {
    super.setState(entity, entityConfig);

    const activeParts = this.activeTextParts.flatMap((part) => {
      const sourceTool = TEXT_SOURCE_SECTIONS[part.type]
        ? this.getReferencedTextTool(part)
        : undefined;
      const entityIndex = sourceTool ? sourceTool.entity_index : part.entity_index;
      const partEntity = this.card.entities[entityIndex];
      const stateMapEntries = part.state_map?.map;
      const stateMapPart = stateMapEntries
        ? stateMapEntries.find((entry) => String(entry.state) === String(partEntity.state)) ?? stateMapEntries.find((entry) => entry.state === 'default')
        : undefined;
      const activePart = stateMapPart ? Merge.mergeDeep(part, stateMapPart) : { ...part };

      if (activePart.color_stops) {
        activePart.colorstops = ColorStops.normalize(activePart.color_stops, this.card.getActiveColorStopMode());
      }

      if (sourceTool) {
        const sourceOptions = {
          includeStyles: activePart.source_styles !== false,
          styles: activePart.styles,
          uom: activePart.uom,
          show: activePart.show,
        };

        return sourceTool.getTextParts(sourceOptions).map((sourcePart, sourcePartIndex) => {
          const referencedPart = {
            ...sourcePart,
            entity_index: sourceTool.entity_index,
            animation_id: activePart.animation_id,
            colorstops: activePart.colorstops,
            ellipsis: activePart.ellipsis,
            source_reference: {
              type: activePart.type,
              id: activePart.id,
              part_index: sourcePartIndex,
              options: sourceOptions,
            },
          };

          // Positioning on the reference applies to its first generated part.
          // StateTool owns the relative positioning of a following UOM part.
          if (sourcePartIndex === 0) {
            if (activePart.new_line !== undefined) referencedPart.new_line = activePart.new_line;
            if (activePart.dx !== undefined) referencedPart.dx = activePart.dx;
            if (activePart.dy !== undefined) referencedPart.dy = activePart.dy;
          }

          referencedPart.value = this.textEllipsis(String(referencedPart.value), referencedPart.ellipsis);

          return referencedPart;
        });
      }

      activePart.value = this.textEllipsis(String(activePart.value), activePart.ellipsis);

      return [activePart];
    });

    // Wrap complete words while retaining the configuration of the part that
    // supplied every fragment. The first line remains at the configured ypos;
    // only automatically generated continuation lines receive a relative dy.
    const textOverflow = this.config.text_overflow;
    const wrapConfig = textOverflow?.wrap;
    let overflowParts = activeParts;

    if (textOverflow?.mode === 'wrap') {
      const wrappedParts = [];
      let lineCharacters = 0;
      let lineNumber = 1;
      let pendingSpaces = [];
      let maximumLinesReached = false;

      activeParts.forEach((part) => {
        if (maximumLinesReached) return;

        let suppressConfiguredNewLine = false;

        if (part.new_line) {
          pendingSpaces = [];

          if (wrapConfig.max_lines && lineNumber >= wrapConfig.max_lines) {
            // Feed text from an unavailable line into the current line so
            // the final-line truncation below can show that content remains.
            suppressConfiguredNewLine = true;
            pendingSpaces.push({ ...part, value: ' ' });
          } else {
            lineNumber += 1;
            lineCharacters = 0;
          }
        }

        let partPositionPending = true;
        const fragments = String(part.value).match(/\s+|\S+/g);

        fragments.forEach((fragment) => {
          if (maximumLinesReached) return;

          if (/^\s+$/.test(fragment)) {
            if (lineCharacters > 0) pendingSpaces.push({ ...part, value: fragment });
            return;
          }

          const pendingCharacters = pendingSpaces.reduce((total, spacePart) => total + spacePart.value.length, 0);
          const lineWouldOverflow = lineCharacters > 0
            && pendingCharacters > 0
            && lineCharacters + pendingCharacters + fragment.length > wrapConfig.characters;
          const canStartAnotherLine = !wrapConfig.max_lines || lineNumber < wrapConfig.max_lines;
          const startsAutomaticLine = lineWouldOverflow && canStartAnotherLine;
          const overflowsLastLine = (lineWouldOverflow && !canStartAnotherLine) || suppressConfiguredNewLine;
          const fragmentPart = {
            ...part,
            value: fragment,
          };

          if (startsAutomaticLine) {
            pendingSpaces = [];
            lineNumber += 1;
            lineCharacters = 0;
            fragmentPart.new_line = true;
            fragmentPart.dy = wrapConfig.dy;
            delete fragmentPart.dx;
          } else {
            if (lineCharacters === 0) pendingSpaces = [];

            pendingSpaces.forEach((spacePart) => {
              delete spacePart.new_line;
              delete spacePart.dx;
              delete spacePart.dy;
              wrappedParts.push(spacePart);
              lineCharacters += spacePart.value.length;
            });
            pendingSpaces = [];

            if (!partPositionPending || suppressConfiguredNewLine) {
              delete fragmentPart.new_line;
              delete fragmentPart.dx;
              delete fragmentPart.dy;
            }
          }

          wrappedParts.push(fragmentPart);
          lineCharacters += fragment.length;
          partPositionPending = false;

          if (overflowsLastLine) maximumLinesReached = true;
        });
      });

      if (maximumLinesReached) {
        let finalLineStart = 0;

        wrappedParts.forEach((wrappedPart, wrappedPartIndex) => {
          if (wrappedPart.new_line) finalLineStart = wrappedPartIndex;
        });

        const finalLineParts = wrappedParts.splice(finalLineStart);
        let remainingVisibleCharacters = wrapConfig.characters - 3;
        let ellipsisAdded = false;

        finalLineParts.forEach((finalLinePart) => {
          if (ellipsisAdded) return;

          if (finalLinePart.value.length <= remainingVisibleCharacters) {
            wrappedParts.push(finalLinePart);
            remainingVisibleCharacters -= finalLinePart.value.length;
            return;
          }

          wrappedParts.push({
            ...finalLinePart,
            value: `${finalLinePart.value.slice(0, remainingVisibleCharacters)}...`,
          });
          ellipsisAdded = true;
        });
      }

      overflowParts = wrappedParts;
    }

    // The outer ellipsis limit applies independently to every visual line.
    // Wrapping with max_lines has already shortened its final line above. The
    // crossing part keeps its complete presentation in either mode.
    const lineEllipsis = textOverflow?.mode === 'ellipsis'
      ? textOverflow.ellipsis.characters
      : textOverflow?.mode === 'wrap' && wrapConfig.max_lines
        ? wrapConfig.characters
        : this.config.ellipsis;
    let remainingCharacters = lineEllipsis;
    let lineIsFull = false;
    const textParts = [];

    overflowParts.forEach((part) => {
      if (part.new_line) {
        remainingCharacters = lineEllipsis;
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
      if (remainingCharacters === 0 && lineEllipsis) lineIsFull = true;
    });

    this.textParts = textParts;

    const lineLengths = [0];
    this.textParts.forEach((part) => {
      if (part.new_line) lineLengths.push(0);
      lineLengths[lineLengths.length - 1] += part.value.length;
    });
    const outerStyles = this.getStyles({ 'font-size': '1em' });
    const measurementSignature = `${JSON.stringify(this.textParts)}|${JSON.stringify(outerStyles)}|${JSON.stringify(textOverflow)}`;

    if (measurementSignature !== this.textMeasurementSignature) {
      this.textMeasurementSignature = measurementSignature;
      this.estimatedWidth = Math.max(...lineLengths) * this.textFontSize * this.characterWidthFactor;
      const lineSpacing = textOverflow?.mode === 'wrap' ? wrapConfig.dy : 1.2;
      this.estimatedHeight = this.textFontSize + ((lineLengths.length - 1) * this.textFontSize * lineSpacing);
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

  /** Measures the complete text and updates fit mode and dependent geometry. */
  updated() {
    // Measure without the fit transform. Restoring it synchronously keeps the
    // DOM unchanged while preventing the previous fit from affecting the next.
    const fitTransform = this.textElement.getAttribute('transform');

    this.textElement.removeAttribute('transform');
    const boundingBox = this.textElement.getBBox();
    this.textElement.setAttribute('transform', fitTransform);

    const dimensionFactor = 100 / SVG_DEFAULT_DIMENSIONS;
    const unscaledWidth = boundingBox.width * dimensionFactor;
    const unscaledHeight = boundingBox.height * dimensionFactor;
    const unscaledXpos = boundingBox.x + boundingBox.width / 2;
    const unscaledYpos = boundingBox.y + boundingBox.height / 2;
    const textOverflow = this.config.text_overflow;
    const fitConfig = textOverflow?.fit;
    const computedTextFontSize = Number.parseFloat(window.getComputedStyle(this.textElement).fontSize);
    let nextTextFitScale = 1;

    this.textFontSize = Number.parseFloat(window.getComputedStyle(this.textElement.firstElementChild).fontSize) * dimensionFactor;

    if (textOverflow?.mode === 'fit' && unscaledWidth > fitConfig.max_width) {
      nextTextFitScale = fitConfig.max_width / unscaledWidth;

      if (fitConfig.min_font_size !== undefined) {
        const parentFontSize = Number.parseFloat(window.getComputedStyle(this.textElement.parentElement).fontSize);
        const minimumFontSize = Number.parseFloat(fitConfig.min_font_size) * parentFontSize;
        const minimumTextFitScale = minimumFontSize / computedTextFontSize;

        nextTextFitScale = Math.min(1, Math.max(nextTextFitScale, minimumTextFitScale));
      }
    }

    const measuredWidth = unscaledWidth * nextTextFitScale;
    const measuredHeight = unscaledHeight * nextTextFitScale;
    const measuredXpos = this.config.svg.xpos + ((unscaledXpos - this.config.svg.xpos) * nextTextFitScale);
    const measuredYpos = this.config.svg.ypos + ((unscaledYpos - this.config.svg.ypos) * nextTextFitScale);
    const measurementTolerance = 0.0001;
    const fitScaleChanged = Math.abs(nextTextFitScale - this.textFitScale) > measurementTolerance;
    const measurementChanged = !this.hasExactMeasurement
      || Math.abs(measuredWidth - this.measuredWidth) > measurementTolerance
      || Math.abs(measuredHeight - this.measuredHeight) > measurementTolerance
      || Math.abs(measuredXpos - this.measuredXpos) > measurementTolerance
      || Math.abs(measuredYpos - this.measuredYpos) > measurementTolerance;

    if (fitScaleChanged || measurementChanged) {
      const characterCount = this.textParts.reduce((count, part) => count + part.value.length, 0);

      if (characterCount > 0) {
        const measuredFactor = unscaledWidth / characterCount / this.textFontSize;

        this.characterWidthFactor = this.characterWidthFactor * 0.8 + measuredFactor * 0.2;
      }
      this.textFitScale = nextTextFitScale;
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

    const fitTransform = this.config.text_overflow?.mode === 'fit'
      ? `translate(${this.config.svg.xpos} ${this.config.svg.ypos}) scale(${this.textFitScale}) translate(-${this.config.svg.xpos} -${this.config.svg.ypos})`
      : '';

    return this.renderItemLayers(svg`
      <g
        transform="${this.getGroupScaleTransform()}"
        style="${this.getGroupScaleStyle()}"
      >
        <text
          ${ref(this.setTextElement)}
          id="${this.textElementId}"
          transform="${fitTransform}"
          x="${this.config.svg.xpos}"
          y="${this.config.svg.ypos}"
          dominant-baseline="${textStyles['dominant-baseline']}"
          style=${styleMap(this.getRenderStyles(textStyles))}
          ${this.actionHandler()}
          @action=${(event) => this.handleAction(event)}
        >${this.textParts.map((part) => {
          let renderPart = part;

          // Source animations are resolved during render, after the animation
          // pipeline has activated the styles for this exact state update.
          if (part.source_reference) {
            const sourceTool = this.getReferencedTextTool(part.source_reference);
            const currentSourcePart = sourceTool
              .getTextParts(part.source_reference.options)[part.source_reference.part_index];

            renderPart = {
              ...part,
              styles: currentSourcePart.styles,
            };
          }

          const partStyles = ConfigHelper.toStyleDict(renderPart.styles);
          const stopColor = this.card._getItemColorFromStops(renderPart);
          const animationStyles = ConfigHelper.toStyleDict(this.card.animations.texts[renderPart.animation_id] ?? {});

          if (stopColor) partStyles.fill = stopColor;

          const styles = {
            ...partStyles,
            ...animationStyles,
          };
          const dx = renderPart.dx ?? 0;
          const dy = renderPart.dy ?? 0;

          return renderPart.new_line
            ? svg`<tspan
                class="text-tool__part"
                x="${this.config.svg.xpos}"
                dx="${dx}em"
                dy="${dy}em"
                dominant-baseline="${textStyles['dominant-baseline']}"
                style=${styleMap(this.getRenderStyles(styles))}
              >${renderPart.value}</tspan>`
            : svg`<tspan
                class="text-tool__part"
                dx="${dx}em"
                dy="${dy}em"
                dominant-baseline="${textStyles['dominant-baseline']}"
                style=${styleMap(this.getRenderStyles(styles))}
              >${renderPart.value}</tspan>`;
        })}</text>
      </g>
    `);
  }
}
