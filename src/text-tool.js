import { svg } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import { ref } from 'lit/directives/ref.js';
import BaseTool from './base-tool.js';
import ColorStops from './color-stops.js';
import ConfigHelper from './config-helper.js';
import Merge from './merge.js';
import NameTool from './name-tool.js';
import AreaTool from './area-tool.js';
import StateTool from './state-tool.js';
import { FONT_SIZE, SVG_DEFAULT_DIMENSIONS } from './const.js';

const TEXT_SOURCE_SECTIONS = {
  name: 'names',
  area: 'areas',
  state: 'states',
};

/**
 * Evaluates a Text item's config and text-part templates, reads inline or
 * referenced Name/Area/State values, applies overflow and fit settings, and
 * renders the resulting SVG text.
 */
export default class TextTool extends BaseTool {
  /**
   * Keeps each Text part's `id` and `entity_index` for JavaScript evaluation.
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
        ...(config.localize_tag !== undefined && !Array.isArray(config.text)
          ? { localize_tag: config.localize_tag }
          : {}),
        ...partConfig,
      };
    });
    const outerConfig = {
      tap_action: { action: 'none' },
      ...config,
    };

    if (outerConfig.text_overflow?.mode === 'wrap' || outerConfig.text_overflow?.mode === 'ellipsis') {
      const overflowModeConfig = outerConfig.text_overflow[outerConfig.text_overflow.mode];
      const hasCharacters = overflowModeConfig.characters !== undefined;
      const hasMaximumWidth = overflowModeConfig.max_width !== undefined;

      if (hasCharacters === hasMaximumWidth) {
        throw new Error(`[texts] text_overflow.${outerConfig.text_overflow.mode} requires exactly one of characters or max_width`);
      }
    }

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
    delete outerConfig.localize_tag;
    super(outerConfig, index, templates, cardId, card, 'texts', 'texts', undefined, { fill: true, stroke: false });

    // BaseTool checks JavaScript in the outer Text settings. Keep text parts in
    // sourceConfig too so TextTool can evaluate their templates with each part's
    // entity_index.
    this.sourceConfig = { ...this.sourceConfig, text: structuredClone(sourceTextParts) };
    this.textPartsHaveJavascript = this.sourceConfig.text.some((part) => this.templates.hasJavascriptTemplates(part));
    this.config.text = [];
    this.textConfigSignature = undefined;
    this.runtime.textParts = [];
    this.geometry = { svg: this.calculateSvgDimensions() };
    this.setTextElement = (element) => {
      if (element) this.textElement = element;
    };
    this.textElementId = `${this.cardId}-text-${this.index}`;
    this.geometry.textFitScale = 1;
    this.runtime.widthMeasurementParts = [];
    this.widthMeasurementElements = [];
    this.widthEllipsisElements = [];
    this.runtime.widthOverflowParts = [];
    this.geometry.widthOverflowSourceSignature = undefined;
    this.widthOverflowRevision = 0;
    this.geometry.widthOverflowMeasurementSignature = undefined;
    this.widthOverflowPending = false;
    this.widthMeasurementScheduled = false;
    this.widthMeasurement = undefined;
    this.textClosed = false;
    this.geometry.characterWidthFactor = 0.6;
    this.geometry.textFontSize = FONT_SIZE * (100 / SVG_DEFAULT_DIMENSIONS);
    this.geometry.estimatedWidth = 0;
    this.geometry.estimatedHeight = this.geometry.textFontSize;
    this.geometry.measuredWidth = 0;
    this.geometry.measuredHeight = 0;
    this.geometry.measuredXpos = this.geometry.svg.xpos;
    this.geometry.measuredYpos = this.geometry.svg.ypos;
    this.geometry.hasExactMeasurement = false;
    this.geometry.textMeasurementSignature = '';

    const inlineSourceToolClasses = {
      name: NameTool,
      area: AreaTool,
      state: StateTool,
    };
    this.inlineTextSourceTools = this.sourceConfig.text.map((part, partIndex) => {
      if (!TEXT_SOURCE_SECTIONS[part.type] || part.id !== undefined) return undefined;

      const SourceTool = inlineSourceToolClasses[part.type];
      const sourceConfig = Merge.mergeDeep(
        {
          id: `${this.id}-source-${partIndex}`,
          entity_index: part.entity_index ?? this.entity_index,
          xpos: 0,
          ypos: 0,
        },
        part,
      );

      return new SourceTool(sourceConfig, partIndex, this.templates, this.cardId, this.card);
    });

    // Static references are validated during construction. A hidden source is
    // still present here; a disabled or misspelled source is not.
    this.sourceConfig.text.forEach((part) => {
      if (TEXT_SOURCE_SECTIONS[part.type] && part.id !== undefined) this.getReferencedTextTool(part);
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
    const sourceTool = this.card.cardTools.getBySection(section)
      .find((tool) => String(tool.id) === String(part.id));

    if (!sourceTool) {
      throw new Error(`[texts] ${part.type} source '${part.id}' not found for text '${this.id}'`);
    }

    return sourceTool;
  }

  /** Returns either an inline entity source or an explicitly referenced layout source. */
  getTextSourceTool(part, partIndex) {
    if (part.inline_source_index !== undefined) {
      return this.inlineTextSourceTools[part.inline_source_index];
    }

    if (part.id === undefined) return this.inlineTextSourceTools[partIndex];

    return this.getReferencedTextTool(part);
  }

  /**
   * Sends outer Text settings through BaseTool; each part uses its own id and entity_index.
   */
  updateRuntimeConfig() {
    const outerSource = { ...this.sourceConfig };
    delete outerSource.text;
    super.updateRuntimeConfig(outerSource);

    if (this.configurationChanged || this.groupChanged) this.geometry.svg = this.calculateSvgDimensions(this.config);
  }

  /**
   * Updates inline Name/Area/State tools, then evaluates each Text part with its
   * own id and HA entity. A part's evaluated entity_index is used by the next
   * setState() pass.
   *
   * @param {object} newConfig - Outer Text settings after their JavaScript is evaluated.
   * @returns {object} Text config containing the current evaluated parts.
   */
  completeRuntimeConfig(newConfig) {
    this.inlineTextSourceTools.filter((sourceTool) => sourceTool !== undefined)
      .forEach((sourceTool) => sourceTool.updateRuntimeConfig());

    let text = this.config.text;
    if (this.textConfigSignature === undefined || this.configChanged || (this.textPartsHaveJavascript && this.card.evaluateJavascriptTemplates)) {
      const activeTextParts = this.sourceConfig.text.map((sourcePart, sourcePartIndex) => {
        const sourceTool = TEXT_SOURCE_SECTIONS[sourcePart.type]
          ? this.getTextSourceTool(sourcePart, sourcePartIndex)
          : undefined;
        const partContext = {
          ...sourcePart,
          // A part without an id uses the Text item's id. Name, Area and State
          // parts use their source tool's entity_index; other parts use their
          // own entity_index or the containing Text entity.
          id: sourcePart.id ?? newConfig.id,
          inline_source_index: sourcePart.id === undefined && sourceTool ? sourcePartIndex : undefined,
          entity_index: sourceTool
            ? sourceTool.entity_index
            : sourcePart.entity_index ?? newConfig.entity_index,
        };
        const activePart = this.templates.hasJavascriptTemplates(sourcePart)
          ? this.templates.getJsTemplateOrValue(partContext, partContext, { resolveKeys: true })
          : partContext;

        if (activePart.color_stops
          || ['colorstop', 'colorstopinterpolated'].includes(activePart.show?.item_style)) {
          this.normalizeLayoutItemColorStopMode(activePart);
        }

        return activePart;
      });
      const activeTextPartsSignature = JSON.stringify(activeTextParts);

      if (activeTextPartsSignature !== this.textConfigSignature) {
        text = activeTextParts;
        this.textConfigSignature = activeTextPartsSignature;
        this.configChanged = true;
      }
    }

    // Inline children update their own config before part evaluation. Reapply
    // the resulting Text binding here, including when the parts are unchanged.
    text.forEach((part) => {
      if (part.inline_source_index !== undefined) {
        const sourceTool = this.inlineTextSourceTools[part.inline_source_index];
        sourceTool.entity_index = part.entity_index;
        sourceTool.config.entity_index = part.entity_index;
      }
    });
    return newConfig === this.config && text === this.config.text
      ? newConfig
      : { ...newConfig, text };
  }

  /**
   * Applies matching state_map values and prepares the resulting text for wrapping and ellipsis.
   *
   * @param {object} entity - Optional entity selected by the outer text item.
   * @param {object} entityConfig - Optional outer entity configuration.
   */
  setState(entity, entityConfig) {
    super.setState(entity, entityConfig);

    const activeParts = this.config.text.flatMap((part, partIndex) => {
      const sourceTool = TEXT_SOURCE_SECTIONS[part.type]
        ? this.getTextSourceTool(part, partIndex)
        : undefined;
      if (part.inline_source_index !== undefined) {
        sourceTool.setState(
          this.card.entities[part.entity_index],
          this.card.runtimeEntityConfigs[part.entity_index],
        );
      }
      const entityIndex = sourceTool ? sourceTool.entity_index : part.entity_index;
      const partEntity = this.card.entities[entityIndex];
      const stateMapEntries = part.state_map?.map;
      const stateMapPart = stateMapEntries
        ? stateMapEntries.find((entry) => String(entry.state) === String(partEntity.state)) ?? stateMapEntries.find((entry) => entry.state === 'default')
        : undefined;
      const activePart = stateMapPart ? Merge.mergeDeep(part, stateMapPart) : { ...part };

      // Resolve HA localization before applying ellipsis, wrapping, fitting and
      // browser text measurement.
      if (activePart.localize_tag !== undefined) {
        activePart.value = this.card._hass.localize(activePart.localize_tag);
      }

      const partColorStops = activePart.color_stops;
      if (partColorStops !== undefined) {
        activePart.paint = {
          colorStops: ColorStops.normalize(partColorStops, this.card.cardTheme.getActiveColorStopMode()),
        };
        delete activePart.color_stops;
      }
      if (partColorStops !== undefined
        || ['colorstop', 'colorstopinterpolated'].includes(activePart.show?.item_style)) {
        this.normalizeLayoutItemColorStopMode(activePart);
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
            paint: activePart.paint,
            show: activePart.show,
            colorstop: activePart.colorstop,
            colorstopinterpolated: activePart.colorstopinterpolated,
            ellipsis: activePart.ellipsis,
            source_reference: {
              type: activePart.type,
              id: activePart.id,
              inline_source_index: activePart.inline_source_index,
              part_index: sourcePartIndex,
              options: sourceOptions,
            },
          };

          // Apply Text-part positioning to the first generated part. StateTool
          // positions a following unit relative to the state value.
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

    // Character-based overflow is calculated immediately. Width-based overflow
    // first exposes styled word and whitespace tokens to the SVG measurement pass.
    const textOverflow = this.config.text_overflow;
    const wrapConfig = textOverflow?.wrap;
    const ellipsisConfig = textOverflow?.ellipsis;
    const selectedOverflowConfig = textOverflow?.mode === 'wrap' ? wrapConfig : ellipsisConfig;
    const usesMeasuredWidth = (textOverflow?.mode === 'wrap' || textOverflow?.mode === 'ellipsis')
      && selectedOverflowConfig.max_width !== undefined;
    let overflowParts = activeParts;
    let lineEllipsis;

    if (usesMeasuredWidth) {
      const widthMeasurementParts = [];

      activeParts.forEach((part) => {
        let firstFragment = true;

        Array.from(String(part.value).matchAll(/\s+|\S+/g), (match) => match[0]).forEach((fragment) => {
          const fragmentPart = {
            ...part,
            value: fragment,
          };

          if (!firstFragment) {
            delete fragmentPart.new_line;
            delete fragmentPart.dx;
            delete fragmentPart.dy;
          }

          widthMeasurementParts.push(fragmentPart);
          firstFragment = false;
        });
      });

      this.runtime.widthMeasurementParts = widthMeasurementParts;
      overflowParts = this.runtime.widthOverflowParts;
    } else {
      this.stopWidthMeasurement();
      this.widthOverflowRevision += 1;
      this.runtime.widthMeasurementParts = [];
      this.runtime.widthOverflowParts = [];
      this.geometry.widthOverflowSourceSignature = undefined;
      this.geometry.widthOverflowMeasurementSignature = undefined;
      this.widthOverflowPending = false;

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
          const fragments = Array.from(String(part.value).matchAll(/\s+|\S+/g), (match) => match[0]);

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

      lineEllipsis = textOverflow?.mode === 'ellipsis'
        ? ellipsisConfig.characters
        : textOverflow?.mode === 'wrap' && wrapConfig.max_lines
          ? wrapConfig.characters
          : this.config.ellipsis;
    }

    // Character ellipsis applies independently to every explicit or generated
    // line. Width mode has already produced its final parts in updated().
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

    this.runtime.textParts = textParts;
    this.updateTextMeasurement();
  }

  /**
   * Recalculates Text bounds when visible parts, outer styles, animations or
   * overflow settings change. A parent Control's selected styles and styles from
   * Name, Area or State parts can change font metrics without changing the text.
   */
  updateTextMeasurement() {
    const textOverflow = this.config.text_overflow;
    const outerStyles = this.getStyles({ 'font-size': '1em' });
    this.applyColorStops(outerStyles);

    // Include styles from inline or referenced Name/Area/State tools, state_map,
    // color stops, Text parts and animations. Card and group filters change SVG
    // paint; font styles determine the browser's text-width measurements.
    const measurementParts = this.getRenderedTextParts(this.runtime.widthMeasurementParts, false);
    const selectedOverflowConfig = textOverflow?.mode === 'wrap' ? textOverflow.wrap : textOverflow?.ellipsis;
    if ((textOverflow?.mode === 'wrap' || textOverflow?.mode === 'ellipsis')
      && selectedOverflowConfig.max_width !== undefined) {
      const sourceSignature = JSON.stringify([measurementParts, outerStyles, textOverflow]);
      if (sourceSignature !== this.geometry.widthOverflowSourceSignature) {
        this.stopWidthMeasurement();
        this.widthMeasurementElements = new Array(measurementParts.length);
        this.widthEllipsisElements = new Array(measurementParts.length);
        this.geometry.widthOverflowSourceSignature = sourceSignature;
        this.widthOverflowRevision += 1;
        this.geometry.widthOverflowMeasurementSignature = undefined;
        this.widthOverflowPending = true;
      }
    }

    const lineLengths = [0];
    this.runtime.textParts.forEach((part) => {
      if (part.new_line) lineLengths.push(0);
      lineLengths[lineLengths.length - 1] += part.value.length;
    });
    const renderedParts = this.getRenderedTextParts(this.runtime.textParts, false);
    const measurementSignature = JSON.stringify([renderedParts, outerStyles, textOverflow]);

    if (measurementSignature !== this.geometry.textMeasurementSignature) {
      this.geometry.textMeasurementSignature = measurementSignature;
      this.geometry.estimatedWidth = Math.max(...lineLengths) * this.geometry.textFontSize * this.geometry.characterWidthFactor;
      const lineSpacing = textOverflow?.mode === 'wrap' ? textOverflow.wrap.dy : 1.2;
      this.geometry.estimatedHeight = this.geometry.textFontSize + ((lineLengths.length - 1) * this.geometry.textFontSize * lineSpacing);

      // Keep the last browser-measured bounds while this Text waits for its new
      // measurement. Before the first measurement, layout uses the estimate above.
    }
  }

  /** Applies styles selected by the parent Control or Select option and refreshes Text measurement inputs. */
  setEffectiveStyles(styles) {
    super.setEffectiveStyles(styles);
    this.updateTextMeasurement();
  }

  /**
   * Builds width-based ellipsis or wrap output from one shared SVG measurement.
   *
   * @param {Array<number>} measuredWidths - Width of every source token in card dimensions.
   * @param {Array<number>} ellipsisWidths - Width of three dots in every token's own style.
   * @returns {Array<object>} Final visible text parts.
   */
  calculateTextPartsForMeasuredWidth(measuredWidths, ellipsisWidths) {
    const textOverflow = this.config.text_overflow;
    const selectedConfig = textOverflow.mode === 'wrap' ? textOverflow.wrap : textOverflow.ellipsis;
    const dimensionFactor = 100 / SVG_DEFAULT_DIMENSIONS;
    const records = this.runtime.widthMeasurementParts.map((part, index) => ({
      part,
      index,
      width: measuredWidths[index],
      ellipsisWidth: ellipsisWidths[index],
      characters: [...String(part.value)],
      element: this.widthMeasurementElements[index],
    }));

    // The same exact substring calculation serves direct ellipsis and the
    // final line produced when width-based wrapping reaches max_lines.
    const shortenLineToWidth = (lineRecords, forceEllipsis) => {
      const completeWidth = lineRecords.reduce((total, record) => total + record.width, 0);

      if (!forceEllipsis && completeWidth <= selectedConfig.max_width) {
        return lineRecords.map((record) => record.part);
      }

      const totalCharacters = lineRecords.reduce((total, record) => total + record.characters.length, 0);
      let lowerBound = 0;
      let upperBound = totalCharacters;
      let visibleCharacters = 0;

      while (lowerBound <= upperBound) {
        const characterCount = Math.floor((lowerBound + upperBound) / 2);
        let remainingCharacters = characterCount;
        let candidateWidth = 0;
        let ellipsisRecord = lineRecords[0];

        lineRecords.some((record) => {
          ellipsisRecord = record;

          if (remainingCharacters >= record.characters.length) {
            candidateWidth += record.width;
            remainingCharacters -= record.characters.length;
            return false;
          }

          candidateWidth += record.element.getSubStringLength(0, remainingCharacters) * dimensionFactor;
          remainingCharacters = 0;
          return true;
        });

        candidateWidth += ellipsisRecord.ellipsisWidth;

        if (candidateWidth <= selectedConfig.max_width) {
          visibleCharacters = characterCount;
          lowerBound = characterCount + 1;
        } else {
          upperBound = characterCount - 1;
        }
      }

      const shortenedParts = [];
      let remainingCharacters = visibleCharacters;
      let ellipsisAdded = false;

      lineRecords.forEach((record) => {
        if (ellipsisAdded) return;

        if (remainingCharacters >= record.characters.length) {
          shortenedParts.push(record.part);
          remainingCharacters -= record.characters.length;
          return;
        }

        shortenedParts.push({
          ...record.part,
          value: record.characters.slice(0, remainingCharacters).join('').concat('...'),
        });
        ellipsisAdded = true;
      });

      if (!ellipsisAdded) {
        const finalPart = shortenedParts.pop();

        shortenedParts.push({
          ...finalPart,
          value: String(finalPart.value).concat('...'),
        });
      }

      return shortenedParts;
    };

    if (textOverflow.mode === 'ellipsis') {
      const ellipsisParts = [];
      let lineRecords = [];

      records.forEach((record) => {
        if (record.part.new_line && lineRecords.length > 0) {
          ellipsisParts.push(...shortenLineToWidth(lineRecords, false));
          lineRecords = [];
        }

        lineRecords.push(record);
      });

      ellipsisParts.push(...shortenLineToWidth(lineRecords, false));
      return ellipsisParts;
    }

    const wrappedRecords = [];
    let lineWidth = 0;
    let lineNumber = 1;
    let pendingSpaces = [];
    let maximumLinesReached = false;

    for (let recordIndex = 0; recordIndex < records.length; recordIndex += 1) {
      const record = records[recordIndex];

      if (record.part.new_line) {
        pendingSpaces = [];

        if (selectedConfig.max_lines && lineNumber >= selectedConfig.max_lines) {
          maximumLinesReached = true;
          break;
        }

        lineNumber += 1;
        lineWidth = 0;
      }

      if (/^\s+$/.test(record.part.value)) {
        if (lineWidth > 0) pendingSpaces.push(record);
      } else {
        const pendingWidth = pendingSpaces.reduce((total, spaceRecord) => total + spaceRecord.width, 0);
        const lineWouldOverflow = lineWidth > 0
          && lineWidth + pendingWidth + record.width > selectedConfig.max_width;

        if (lineWouldOverflow) {
          if (selectedConfig.max_lines && lineNumber >= selectedConfig.max_lines) {
            maximumLinesReached = true;
            break;
          }

          const wrappedPart = {
            ...record.part,
            new_line: true,
            dy: selectedConfig.dy,
          };

          delete wrappedPart.dx;
          wrappedRecords.push({ ...record, part: wrappedPart });
          pendingSpaces = [];
          lineNumber += 1;
          lineWidth = record.width;
        } else {
          pendingSpaces.forEach((spaceRecord) => {
            const spacePart = { ...spaceRecord.part };

            delete spacePart.new_line;
            delete spacePart.dx;
            delete spacePart.dy;
            wrappedRecords.push({ ...spaceRecord, part: spacePart });
            lineWidth += spaceRecord.width;
          });
          pendingSpaces = [];
          wrappedRecords.push(record);
          lineWidth += record.width;
        }
      }
    }

    if (maximumLinesReached) {
      let finalLineStart = 0;

      wrappedRecords.forEach((record, recordIndex) => {
        if (record.part.new_line) finalLineStart = recordIndex;
      });

      const finalLineRecords = wrappedRecords.splice(finalLineStart);
      const finalLineParts = shortenLineToWidth(finalLineRecords, true);

      return [...wrappedRecords.map((record) => record.part), ...finalLineParts];
    }

    return wrappedRecords.map((record) => record.part);
  }

  /** Builds literal text parts that do not read an entity state. */
  setStaticState() {
    this.setState(undefined, undefined);
  }

  /** Cancels browser width measurement scheduled for an earlier Text render. */
  stopWidthMeasurement() {
    const measurement = this.widthMeasurement;
    if (measurement) {
      this.widthMeasurement = undefined;
      window.cancelAnimationFrame(measurement.frame);
      if (measurement.completeFrame) measurement.completeFrame();
      this.widthMeasurementScheduled = false;
    }
  }

  /** Allows measurement against the DOM committed after reconnection. */
  connected() {
    this.textClosed = false;
  }

  /** Keeps accepted text while cancelling work tied to the removed DOM. */
  disconnected() {
    this.textClosed = true;
    this.stopWidthMeasurement();
  }

  /** Measures the complete text and updates fit mode and dependent geometry. */
  updated() {
    if (this.textClosed) return;
    const activeMeasurement = this.widthMeasurement;
    if (activeMeasurement && (activeMeasurement.textElement !== this.textElement
      || activeMeasurement.elements.some((element, index) => element !== this.widthMeasurementElements[index])
      || activeMeasurement.ellipsisElements.some((element, index) => element !== this.widthEllipsisElements[index]))) {
      this.stopWidthMeasurement();
    }
    if (this.runtime.widthMeasurementParts.length > 0 && this.widthOverflowPending) {
      if (!this.widthMeasurementScheduled) {
        this.widthMeasurementScheduled = true;
        const measurement = {
          revision: this.widthOverflowRevision,
          textElement: this.textElement,
          elements: this.widthMeasurementElements.slice(),
          ellipsisElements: this.widthEllipsisElements.slice(),
          frame: undefined,
          completeFrame: undefined,
        };
        this.widthMeasurement = measurement;

        document.fonts.ready.then(async () => {
          if (this.widthMeasurement !== measurement || this.textClosed) return;
          const dimensionFactor = 100 / SVG_DEFAULT_DIMENSIONS;
          let measuredWidths;
          let ellipsisWidths;
          let previousFrameSignature;

          // SVG layout may trail Lit's updated callback. Wait for at most five
          // frames and stop as soon as two usable measurements are identical.
          for (let frameAttempt = 0; frameAttempt < 5; frameAttempt += 1) {
            // eslint-disable-next-line no-await-in-loop -- SVG layout must settle frame by frame.
            await new Promise((complete) => {
              measurement.completeFrame = complete;
              measurement.frame = window.requestAnimationFrame(complete);
            });

            // Lit can replace the measurement tspans while fonts load. Only the
            // measurement for the current Text render may update its visible lines.
            if (this.widthMeasurement !== measurement || this.textClosed) return;
            measurement.frame = undefined;
            measurement.completeFrame = undefined;

            measuredWidths = measurement.elements.map((element) => Number((element.getComputedTextLength() * dimensionFactor).toFixed(4)));
            ellipsisWidths = measurement.ellipsisElements.map((element) => Number((element.getComputedTextLength() * dimensionFactor).toFixed(4)));
            const currentFrameSignature = `${JSON.stringify(measuredWidths)}|${JSON.stringify(ellipsisWidths)}`;
            const hasMeasuredText = measuredWidths.some((width) => width > 0);

            if (hasMeasuredText && currentFrameSignature === previousFrameSignature) break;

            previousFrameSignature = currentFrameSignature;
          }

          if (this.widthMeasurement === measurement && measurement.revision === this.widthOverflowRevision && !this.textClosed) {
            this.widthMeasurement = undefined;
            this.widthMeasurementScheduled = false;
            this.runtime.widthOverflowParts = this.calculateTextPartsForMeasuredWidth(measuredWidths, ellipsisWidths);
            this.runtime.textParts = this.runtime.widthOverflowParts;
            this.geometry.widthOverflowMeasurementSignature = `${this.geometry.widthOverflowSourceSignature}|${JSON.stringify(measuredWidths)}|${JSON.stringify(ellipsisWidths)}`;
            this.widthOverflowPending = false;
            this.card.requestUpdate();
          }
        }).catch((error) => {
          if (this.widthMeasurement !== measurement || this.textClosed) return;
          this.stopWidthMeasurement();
          console.error('[FHC text measurement]', this.textElementId, error);
        });
      }

      return;
    }

    if (this.runtime.widthMeasurementParts.length > 0) {
      const dimensionFactor = 100 / SVG_DEFAULT_DIMENSIONS;
      const measuredWidths = this.widthMeasurementElements.map((element) => Number((element.getComputedTextLength() * dimensionFactor).toFixed(4)));
      const ellipsisWidths = this.widthEllipsisElements.map((element) => Number((element.getComputedTextLength() * dimensionFactor).toFixed(4)));
      const widthOverflowMeasurementSignature = `${this.geometry.widthOverflowSourceSignature}|${JSON.stringify(measuredWidths)}|${JSON.stringify(ellipsisWidths)}`;

      if (widthOverflowMeasurementSignature !== this.geometry.widthOverflowMeasurementSignature) {
        this.runtime.widthOverflowParts = this.calculateTextPartsForMeasuredWidth(measuredWidths, ellipsisWidths);
        this.runtime.textParts = this.runtime.widthOverflowParts;
        this.geometry.widthOverflowMeasurementSignature = widthOverflowMeasurementSignature;
        this.card.requestUpdate();
        return;
      }
    }

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

    this.geometry.textFontSize = Number.parseFloat(window.getComputedStyle(this.textElement.firstElementChild).fontSize) * dimensionFactor;

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
    const measuredXpos = this.geometry.svg.xpos + ((unscaledXpos - this.geometry.svg.xpos) * nextTextFitScale);
    const measuredYpos = this.geometry.svg.ypos + ((unscaledYpos - this.geometry.svg.ypos) * nextTextFitScale);
    const measurementTolerance = 0.0001;
    const fitScaleChanged = Math.abs(nextTextFitScale - this.geometry.textFitScale) > measurementTolerance;
    const measurementChanged = !this.geometry.hasExactMeasurement
      || Math.abs(measuredWidth - this.geometry.measuredWidth) > measurementTolerance
      || Math.abs(measuredHeight - this.geometry.measuredHeight) > measurementTolerance
      || Math.abs(measuredXpos - this.geometry.measuredXpos) > measurementTolerance
      || Math.abs(measuredYpos - this.geometry.measuredYpos) > measurementTolerance;

    if (fitScaleChanged || measurementChanged) {
      const characterCount = this.runtime.textParts.reduce((count, part) => count + part.value.length, 0);

      if (characterCount > 0) {
        const measuredFactor = unscaledWidth / characterCount / this.geometry.textFontSize;

        this.geometry.characterWidthFactor = this.geometry.characterWidthFactor * 0.8 + measuredFactor * 0.2;
      }
      this.geometry.textFitScale = nextTextFitScale;
      this.geometry.measuredWidth = measuredWidth;
      this.geometry.measuredHeight = measuredHeight;
      this.geometry.measuredXpos = measuredXpos;
      this.geometry.measuredYpos = measuredYpos;
      this.geometry.hasExactMeasurement = true;
      this.card.requestUpdate();
    }
  }

  /**
   * Applies styles from inline or referenced Name/Area/State tools, Text parts,
   * animations and color stops to the SVG tspans. Rendering and measurement use
   * the same text styles so font changes are noticed even when text is equal.
   *
   * @param {Array<object>} parts - Visible or measurement text parts.
   * @param {boolean} filterPaint - Whether to apply configured color filters and gradient references before SVG rendering.
   * @returns {Array<object>} Text parts with their SVG styles.
   */
  getRenderedTextParts(parts, filterPaint) {
    return parts.map((part) => {
      let renderPart = part;

      // Read referenced tools' animation styles during rendering, after the
      // current animation has selected the styles for this state update.
      if (part.source_reference) {
        const sourceTool = this.getTextSourceTool(
          part.source_reference,
          part.source_reference.inline_source_index,
        );
        const currentSourcePart = sourceTool
          .getTextParts(part.source_reference.options)[part.source_reference.part_index];

        renderPart = {
          ...part,
          styles: currentSourcePart.styles,
        };
      }

      const partStyles = ConfigHelper.toStyleDict(renderPart.styles);
      const animationStyles = ConfigHelper.toStyleDict(this.card.cardAnimations.styles.texts[renderPart.animation_id] ?? {});

      this.applyColorStops(partStyles, renderPart, ['fill'], renderPart.paint?.colorStops);
      const styles = { ...partStyles, ...animationStyles };

      return {
        ...renderPart,
        renderStyles: filterPaint ? this.getRenderStyles(styles) : styles,
      };
    });
  }


  /** Renders visible and measurement text using the same final part styles. */
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
    this.applyColorStops(textStyles);
    const fitTransform = this.config.text_overflow?.mode === 'fit'
      ? `translate(${this.geometry.svg.xpos} ${this.geometry.svg.ypos}) scale(${this.geometry.textFitScale}) translate(-${this.geometry.svg.xpos} -${this.geometry.svg.ypos})`
      : '';
    const visibleRenderParts = this.getRenderedTextParts(this.runtime.textParts, true);
    const measurementRenderParts = this.getRenderedTextParts(this.runtime.widthMeasurementParts, true);
    const measurementTextStyles = {
      ...textStyles,
      opacity: '0',
      'pointer-events': 'none',
      'white-space': 'pre',
    };

    return this.renderItemLayers(svg`
      <g
        transform="${this.getGroupScaleTransform()}"
        style="${this.getGroupScaleStyle()}"
      >
        <text
          ${ref(this.setTextElement)}
          id="${this.textElementId}"
          transform="${fitTransform}"
          x="${this.geometry.svg.xpos}"
          y="${this.geometry.svg.ypos}"
          dominant-baseline="${textStyles['dominant-baseline']}"
          style=${styleMap(this.getRenderStyles(textStyles))}
          ${this.actionHandler()}
          @action=${(event) => this.handleAction(event)}
          visibility="${this.widthOverflowPending && this.runtime.widthOverflowParts.length === 0 ? 'hidden' : 'visible'}"
        >${visibleRenderParts.map((renderPart) => {
          const dx = renderPart.dx ?? 0;
          const dy = renderPart.dy ?? 0;

          return renderPart.new_line
            ? svg`<tspan
                class="text-tool__part"
                x="${this.geometry.svg.xpos}"
                dx="${dx}em"
                dy="${dy}em"
                dominant-baseline="${textStyles['dominant-baseline']}"
                style=${styleMap(renderPart.renderStyles)}
              >${renderPart.value}</tspan>`
            : svg`<tspan
                class="text-tool__part"
                dx="${dx}em"
                dy="${dy}em"
                dominant-baseline="${textStyles['dominant-baseline']}"
                style=${styleMap(renderPart.renderStyles)}
              >${renderPart.value}</tspan>`;
        })}</text>
        ${measurementRenderParts.length > 0 ? svg`
          <text
            class="text-tool__measurement"
            x="${this.geometry.svg.xpos}"
            y="${this.geometry.svg.ypos}"
            pointer-events="none"
            aria-hidden="true"
            style=${styleMap(this.getRenderStyles(measurementTextStyles))}
          >${measurementRenderParts.map((renderPart, partIndex) => svg`
            <tspan
              ${ref((element) => { if (element) this.widthMeasurementElements[partIndex] = element; })}
              style=${styleMap(renderPart.renderStyles)}
            >${renderPart.value}</tspan>
            <tspan
              ${ref((element) => { if (element) this.widthEllipsisElements[partIndex] = element; })}
              style=${styleMap(renderPart.renderStyles)}
            >...</tspan>
          `)}</text>
        ` : ''}
      </g>
    `);
  }
}
