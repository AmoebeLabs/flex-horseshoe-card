import { svg } from 'lit';
import ConfigHelper from './config-helper.js';
import ColorStops from './color-stops.js';
import ColorFilter from './color-filter.js';
import actionHandler from './action-handler.js';
import { DEFAULT_RENDER_INDEX, DEFAULT_ZPOS } from './const.js';

/**
 * Gives layout tools the same JavaScript-config evaluation, HA entity binding,
 * style and action handling. Each tool calculates its own shape and content.
 */
export default class BaseTool {

  /**
   * Keeps the authored item config for JavaScript templates and connects the tool
   * to the card's entities, groups, animations and SVG identifiers.
   *
   * @param {object} config - Layout item after card templates, refs and calc expressions.
   * @param {number} index - Position within the tool's layout section.
   * @param {object} templates - This card's JavaScript template evaluator.
   * @param {string} cardId - Card identifier used to keep SVG ids distinct.
   * @param {LitElement} card - FHS card containing the tool.
   * @param {string} animationSection - Tool section whose animation styles apply.
   * @param {string} zposSection - Tool section supplying the default drawing order.
   * @param {number|undefined} defaultEntityIndex - Default entity for an entity-bound tool.
   * @param {object|undefined} colorStopPaintDefaults - Default fill/stroke switches for color-stop modes.
   * @param {Function|undefined} translateConfig - Tool-specific config completion after evaluation.
   */
  constructor(
    config,
    index,
    templates,
    cardId,
    card,
    animationSection,
    zposSection = animationSection,
    defaultEntityIndex = undefined,
    colorStopPaintDefaults = undefined,
    translateConfig = undefined,
  ) {
    this.id = config.id;
    this.index = index;
    this.templates = templates;
    this.cardId = cardId;
    this.card = card;
    this.animationSection = animationSection;
    this.zposSection = zposSection;
    this.defaultZpos = DEFAULT_ZPOS[zposSection] ?? 0;
    config.zpos ??= this.defaultZpos;
    config.dzpos ??= 0;

    // Keep [[[ ... ]]] intact for later HA updates. Static config can be completed
    // now; JavaScript values must be evaluated before tool-specific completion.
    this.sourceConfig = structuredClone(config);
    this.hasJavascript = templates.hasJavascriptTemplates(this.sourceConfig);

    this.translateConfig = translateConfig;
    this.config = translateConfig && !this.hasJavascript ? translateConfig(config) : config;
    this.zpos = Number(this.config.zpos) + Number(this.config.dzpos);
    this.renderIndex = (DEFAULT_RENDER_INDEX[zposSection] ?? 0) + index;
    this.entity_index = this.config.entity_index ?? defaultEntityIndex;
    this.defaultEntityIndex = defaultEntityIndex;
    this.colorStopPaintDefaults = colorStopPaintDefaults;

    this.runtime = { entity: undefined, entityConfig: undefined, effectiveStyles: undefined };
    this.configChanged = true;
    this.configurationChanged = true;
    this.groupChanged = false;
    this.themeModeChanged = false;

    this.runtimeConfigInitialized = false;
    this.evaluatedConfigSignature = undefined;
  }

  /**
   * Evaluates changed JavaScript config before the tool receives its HA entity.
   * Group movement and light/dark changes are tracked separately so geometry and
   * colors can change even when JavaScript returns the same config.
   *
   * @param {object} sourceConfig - Authored fields to evaluate for this tool.
   * @param {object} templateOptions - Options controlling JavaScript key evaluation.
   * @param {object} templateContext - Item/entity context exposed to the templates.
   */
  updateRuntimeConfig(sourceConfig = this.sourceConfig, templateOptions = { resolveKeys: true }, templateContext = sourceConfig) {
    const activeGroupId = this.config.group ?? this.sourceConfig.group ?? 'card';
    this.configurationChanged = !this.runtimeConfigInitialized;
    this.groupChanged = this.card.cardLayout.changedGroupIds.has(activeGroupId);
    this.themeModeChanged = this.card.cardTheme.modeChanged;

    this.configChanged = this.configurationChanged || this.groupChanged || this.themeModeChanged;

    let newConfig = this.config;
    let evaluatedSourceConfig = sourceConfig;
    if (this.hasJavascript && (!this.runtimeConfigInitialized || this.card.evaluateJavascriptTemplates)) {
      const evaluatedConfig = this.templates.getJsTemplateOrValue(templateContext, sourceConfig, templateOptions);
      const evaluatedConfigSignature = JSON.stringify(evaluatedConfig);

      // Equal template values reuse the completed config rather than normalizing it again.
      if (evaluatedConfigSignature !== this.evaluatedConfigSignature) {
        newConfig = evaluatedConfig;
        evaluatedSourceConfig = evaluatedConfig;
        this.evaluatedConfigSignature = evaluatedConfigSignature;
        this.configurationChanged = true;
        this.configChanged = true;
      }
    }

    if (newConfig !== this.config && this.translateConfig) {
      newConfig = this.translateConfig(newConfig);
    }

    // Select the light/dark color list without replacing the authored mode lists.
    // Sparkline stores its palette inside sparkline; Horseshoe also accepts colorstops.
    if (this.configurationChanged || this.themeModeChanged) {
      let colorStopsDefinition = newConfig.color_stops;
      const hasSparklinePalette = newConfig.sparkline !== undefined;

      if (newConfig.sparkline?.color_stops !== undefined) {
        colorStopsDefinition = newConfig.sparkline.color_stops;
      } else if (newConfig.sparkline?.colorstops !== undefined) {
        colorStopsDefinition = newConfig.sparkline.colorstops;
      } else if (this.animationSection === 'horseshoes' && colorStopsDefinition === undefined) {
        colorStopsDefinition = newConfig.colorstops;
      }

      if (colorStopsDefinition !== undefined || hasSparklinePalette || this.animationSection === 'horseshoes') {
        this.paint ??= {};
        this.paint.colorStops = ColorStops.normalize(colorStopsDefinition, this.card.cardTheme.getActiveColorStopMode());
      } else if (this.configurationChanged && this.paint?.colorStops !== undefined) {
        delete this.paint.colorStops;
        if (Object.keys(this.paint).length === 0) delete this.paint;
      }
    }

    if (this.configurationChanged && this.colorStopPaintDefaults
      && (newConfig.color_stops
        || ['colorstop', 'colorstopsegments', 'colorstopinterpolated'].includes(newConfig.show?.item_style))) {
      this.normalizeLayoutItemColorStopMode(newConfig);
    }

    // Text evaluates its parts with their individual entity contexts here. Finish
    // those parts and inline entity bindings before setState() reads the config.
    this.config = this.completeRuntimeConfig(newConfig, this.configurationChanged ? evaluatedSourceConfig : undefined);

    if (this.configurationChanged) this.entity_index = this.config.entity_index ?? this.defaultEntityIndex;
    this.zpos = Number(this.config.zpos) + Number(this.config.dzpos);
    this.runtimeConfigInitialized = true;
  }

  /** Lets Text finish its parts before storing the config used for state and rendering. */
  completeRuntimeConfig(newConfig, evaluatedSourceConfig) {
    return newConfig;
  }

  /**
   * Completes the fill/stroke switches for the configured color-stop modes. A tool's
   * defaults decide whether a selected color paints its fill, stroke or both.
   */
  normalizeLayoutItemColorStopMode(item, paintDefaults = this.colorStopPaintDefaults) {
    item.show ??= {};
    item.show.item_style ??= 'colorstop';

    if (!['colorstop', 'colorstopsegments', 'colorstopinterpolated'].includes(item.show.item_style)) return;

    item.colorstop = {
      ...paintDefaults,
      ...item.colorstop,
    };
    item.colorstopinterpolated = {
      ...paintDefaults,
      ...item.colorstopinterpolated,
    };
    item.colorstopsegments = {
      ...paintDefaults,
      ...item.colorstopsegments,
    };

    ['colorstop', 'colorstopsegments', 'colorstopinterpolated'].forEach((mode) => {
      if (typeof item[mode].fill !== 'boolean' || typeof item[mode].stroke !== 'boolean') {
        throw new Error(`[${this.animationSection}] ${mode}.fill and ${mode}.stroke must be boolean`);
      }
    });
  }

  /** Stores the selected HA entity and its card config for formatting and coloring. */
  setState(entity, entityConfig) {
    this.runtime.entity = entity;
    this.runtime.entityConfig = entityConfig;
  }

  /**
   * Selects this tool's entity_index from the card's current entities. Items
   * without an entity use their static content; multipart tools select their own parts.
   */
  setEntities(entityConfigs, entities) {
    if (this.entity_index === undefined) {
      this.setStaticState();
      return;
    }

    const entityConfig = entityConfigs[this.entity_index];
    const entity = entities[this.entity_index];
    if (entity && entityConfig) this.setState(entity, entityConfig);
  }

  /** Refreshes an item whose content comes from config rather than an HA entity. */
  setStaticState() {}

  /** Called when this card first has Home Assistant data for the tool. */
  hassAvailable() {}

  /** Starts tool work when the card enters the dashboard DOM. */
  connected() {}

  /** Stops tool timers and listeners when the card leaves the dashboard DOM. */
  disconnected() {}

  /** Called once after the tool's initial SVG has been rendered. */
  firstUpdated() {}

  /** Lets tools measure rendered SVG and attach listeners after each card render. */
  updated() {}

  /** Lets tools refresh data after the Home Assistant websocket reconnects. */
  hassConnected() {}

  /** Returns whether the tool needs work even when the configured HA entities are unchanged. */
  requiresHassUpdate() {
    return false;
  }

  /** Combines tool defaults, configured or parent-selected styles, then animation styles. */
  getStyles(baseStyles) {
    const itemStyleDict = ConfigHelper.toStyleDict(this.runtime.effectiveStyles ?? this.config.styles);
    const animationStyle = ConfigHelper.toStyleDict(this.card.cardAnimations.styles[this.animationSection]?.[this.config.animation_id] ?? {});

    return {
      ...baseStyles,
      ...itemStyleDict,
      ...animationStyle,
    };
  }

  /**
   * Uses a complete style selection from a Control or containing Text item in
   * place of this tool's configured styles. Passing undefined restores those
   * styles; the tool can still apply its own state_map, color stops and animations.
   */
  setEffectiveStyles(styles) {
    this.runtime.effectiveStyles = styles;
  }

  /** Orders color filters from the card through enclosing groups to this tool and its layers. */
  getColorFilterCascade(extraFilters = []) {
    const groupFilters = this.card.cardLayout.groupManager
      .getGroupChainForItem(this.config)
      .map((group) => group.color_filter);

    return [
      this.card.config.color_filter,
      ...groupFilters,
      this.config.color_filter,
      ...extraFilters,
    ];
  }

  /** Applies color filters and turns named gradients into this card's SVG references. */
  getRenderStyles(styles, extraFilters = []) {
    const filteredStyles = ColorFilter.applyToStyles(styles, this.getColorFilterCascade(extraFilters), this.card);

    return this.card.cardLayout.masksClips.applyGradientRefs(filteredStyles);
  }

  /**
   * Adds the selected color-stop styles and colors to an SVG item. The configured
   * mode controls fill and stroke separately; Text can supply another property
   * name when its visible color is stored somewhere other than fill.
   */
  applyColorStops(styles, item = this.config, fillProperties = ['fill'], explicitColorStops) {
    if (!['colorstop', 'colorstopsegments', 'colorstopinterpolated'].includes(item.show?.item_style)) return;

    // A Text part uses its own palette or its entity's palette. This keeps a part
    // bound to another entity from taking the containing Text's colors.
    const configuredColorStops = explicitColorStops ?? (item === this.config ? this.paint?.colorStops : undefined);
    const colorStops = configuredColorStops ?? this.card.cardEntities.paint.colorStops[item.entity_index];
    const activeStop = this.card.cardEntities.getItemColorStop(item, colorStops, this.card.config, this.card.entities);

    if (activeStop) {
      const paintMode = item[item.show.item_style];
      Object.assign(styles, ConfigHelper.toStyleDict(activeStop.styles));

      if (paintMode.fill) {
        fillProperties.forEach((property) => {
          styles[property] = activeStop.color;
        });
      }
      if (paintMode.stroke) styles.stroke = activeStop.color;
    }
  }

  /** Replaces the trailing text with '...' when the configured character limit is exceeded. */
  textEllipsis(text, ellipsis) {
    if (ellipsis && ellipsis < text.length) {
      return text.slice(0, ellipsis - 1).concat('...');
    }

    return text;
  }

  /** Converts card-percentage coordinates into SVG coordinates in the configured group. */
  calculateSvgDimensions(config = this.config) {
    return this.card.cardLayout.calculateSvgCoordinatesInGroup(config);
  }

  /** Returns the group scale and item flip transforms for this tool's SVG. */
  getGroupScaleTransform(item = this.config) {
    return this.card.cardLayout.getGroupScaleTransform(item);
  }

  /** Places the SVG transform origin at the tool center or the scaled group center. */
  getGroupScaleStyle(item = this.config) {

    return this.card.cardLayout.getGroupScaleStyle(item, this.geometry ? this.geometry.svg : item.svg);
  }

  /** Applies the configured masks, clip and group visibility to the tool's SVG content. */
  renderItemLayers(content, item = this.config) {
    let result = content;

    if (item.mask) {
      const maskIds = Array.isArray(item.mask) ? item.mask : [item.mask];

      // Apply masks one after another so only the area allowed by every mask remains.
      maskIds.forEach((maskId) => {
        this.card.cardLayout.masksClips.getMaskUseIds(maskId, item, this.zposSection).forEach((svgMaskId) => {
          result = svg`<g mask="url(#${svgMaskId})">${result}</g>`;
        });
      });
    }

    if (item.clip) {
      result = svg`<g clip-path="url(#${this.card.cardLayout.masksClips.getClipUseId(item.clip, item, this.zposSection)})">${result}</g>`;
    }

    // Keep hidden Text measurable and hidden graphs up to date, while hiding all
    // their SVG content and preventing clicks on any nested item.
    if (!this.card.cardLayout.groupManager.isItemVisible(item)) {
      result = svg`
        <g
          class="fhs-layout-item--hidden"
          visibility="hidden"
          opacity="0"
          pointer-events="none"
          aria-hidden="true"
        >${result}</g>
      `;
    }

    return result;
  }

  /** Connects this item's tap, hold and double-tap settings to the gesture handler. */
  actionHandler() {
    return actionHandler(this.card.actions.getActionHandlerOptions(this.config, this.entity_index));
  }

  /** Runs the gesture action for this exact layout item and its selected entity. */
  handleAction(event) {
    this.card.actions.handleAction(event, this.config, this.entity_index);
  }
}
