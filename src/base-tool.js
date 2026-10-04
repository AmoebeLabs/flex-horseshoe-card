import { svg } from 'lit';
import ConfigHelper from './config-helper.js';
import ColorStops from './color-stops.js';
import ColorFilter from './color-filter.js';
import actionHandler from './action-handler.js';
import { DEFAULT_RENDER_INDEX, DEFAULT_ZPOS } from './const.js';

/**
 * Shared configuration and lifecycle for layout tools. Each tool keeps its
 * derived geometry and displayed content separate from the current config.
 * The injected Templates instance supplies the
 * persistent card-wide context shared by tools belonging to this card.
 */
export default class BaseTool {
  /**
   * Stores this tool's normalized config and references to its parent card context.
   *
   * @param {object} config - Static item config after card-level refs, calc, ids, and same_as handling.
   * @param {number} index - Item index inside its layout section.
   * @param {object} templates - Template resolver shared with the card.
   * @param {string} cardId - Stable card id for generated SVG ids.
   * @param {LitElement} card - Parent card instance with shared render helpers.
   * @param {string} animationSection - Animation bucket name for this tool type.
   * @param {string} zposSection - Layer bucket name for zpos defaults.
   * @param {number|undefined} defaultEntityIndex - Entity index selected by tools whose content is entity-bound by definition.
   * @param {object|undefined} colorStopPaintDefaults - Tool-specific fill and stroke defaults.
   * @param {Function|undefined} translateConfig - Pure tool-specific normalization after source capture/evaluation.
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

    // Preserve the template-visible source while geometry and paint change independently.
    this.sourceConfig = structuredClone(config);
    this.hasJavascript = templates.hasJavascriptTemplates(this.sourceConfig);
    // Static config can be translated immediately. Dynamic source stays intact
    // until the normal runtime pass evaluates it before translation and publication.
    this.translateConfig = translateConfig;
    this.config = translateConfig && !this.hasJavascript ? translateConfig(config) : config;
    this.zpos = Number(this.config.zpos) + Number(this.config.dzpos);
    this.renderIndex = (DEFAULT_RENDER_INDEX[zposSection] ?? 0) + index;
    this.entity_index = this.config.entity_index ?? defaultEntityIndex;
    this.defaultEntityIndex = defaultEntityIndex;
    this.colorStopPaintDefaults = colorStopPaintDefaults;

    this.runtime = { entity: undefined, entityConfig: undefined };
    this.configChanged = true;
    this.configurationChanged = true;
    this.groupChanged = false;
    this.themeModeChanged = false;
    // Static config already exists; this marks completion of the first runtime-config update.
    this.runtimeConfigInitialized = false;
    this.evaluatedConfigSignature = undefined;
  }

  /**
   * Updates the runtime configuration after main has published the current
   * Home Assistant template context and before entity data is assigned.
   */
  updateRuntimeConfig(sourceConfig = this.sourceConfig, templateOptions = { resolveKeys: true }, templateContext = sourceConfig) {
    const activeGroupId = this.config.group ?? this.sourceConfig.group ?? 'card';
    this.configurationChanged = !this.runtimeConfigInitialized;
    this.groupChanged = this.card.cardLayout.changedGroupIds.has(activeGroupId);
    this.themeModeChanged = this.card.cardTheme.modeChanged;
    // Consumers that depend on more than one category use this combined change signal.
    this.configChanged = this.configurationChanged || this.groupChanged || this.themeModeChanged;

    // Static tools retain their current config. JavaScript-backed tools evaluate
    // a new local config during the same hass updates as before.
    let newConfig = this.config;
    let evaluatedSourceConfig = sourceConfig;
    if (this.hasJavascript && (!this.runtimeConfigInitialized || this.card.evaluateJavascriptTemplates)) {
      const evaluatedConfig = this.templates.getJsTemplateOrValue(templateContext, sourceConfig, templateOptions);
      const evaluatedConfigSignature = JSON.stringify(evaluatedConfig);

      // Equivalent JS results skip translation; the same pass still handles group and theme changes.
      if (evaluatedConfigSignature !== this.evaluatedConfigSignature) {
        newConfig = evaluatedConfig;
        evaluatedSourceConfig = evaluatedConfig;
        this.evaluatedConfigSignature = evaluatedConfigSignature;
        this.configurationChanged = true;
        this.configChanged = true;
      }
    }

    // Reevaluate from source, not from last render's derived data. Static config
    // was translated at construction and needs no second translation on first hass.
    if (newConfig !== this.config && this.translateConfig) {
      newConfig = this.translateConfig(newConfig);
    }

    // Keep the authored definitions in config while publishing only their active mode to paint.
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

    // Entity-level color stops remain passive until the layout item selects a color-stop mode.
    if (this.configurationChanged && this.colorStopPaintDefaults
      && (newConfig.color_stops
        || ['colorstop', 'colorstopsegments', 'colorstopinterpolated'].includes(newConfig.show?.item_style))) {
      this.normalizeLayoutItemColorStopMode(newConfig);
    }

    // Multipart tools finish their own evaluation contexts and child bindings
    // here, so state processing always sees the complete current configuration.
    this.config = this.completeRuntimeConfig(newConfig, this.configurationChanged ? evaluatedSourceConfig : undefined);
    // Bind from the published config before state assignment. Multipart Text
    // reapplies its evaluated part binding after updating each inline source tool.
    if (this.configurationChanged) this.entity_index = this.config.entity_index ?? this.defaultEntityIndex;
    this.zpos = Number(this.config.zpos) + Number(this.config.dzpos);
    this.runtimeConfigInitialized = true;
  }

  /**
   * Completes context-dependent fields before the runtime route publishes config.
   * Constructors use the explicit pure translator instead of this runtime hook.
   *
   * @param {object} newConfig - Evaluated and translated configuration.
   * @param {object|undefined} evaluatedSourceConfig - Local pre-translation source published with this config, or undefined when config is unchanged.
   * @returns {object} Complete current configuration.
   */
  completeRuntimeConfig(newConfig, evaluatedSourceConfig) {
    return newConfig;
  }

  /**
   * Normalizes the public layout-item color-stop selector at the runtime-config boundary.
   *
   * Both single-color paint dictionaries are completed here so renderers only consume final config.
   *
   * @param {object} item - Layout item or multipart text item with normalized color stops.
   * @param {object} paintDefaults - Semantic fill and stroke defaults for this tool.
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

  /**
   * Stores the runtime entity data for this tool after its active configuration
   * has been prepared by updateRuntimeConfig().
   *
   * @param {object} entity - Home Assistant entity state object for this tool.
   * @param {object} entityConfig - Entity configuration for this tool.
   */
  setState(entity, entityConfig) {
    this.runtime.entity = entity;
    this.runtime.entityConfig = entityConfig;
  }

  /**
   * Receives all card entities through the common tool lifecycle. Ordinary
   * tools select their configured entity_index; composite tools can override
   * this method and bind their own child items.
   *
   * @param {Array<object>} entityConfigs - Active entity configurations.
   * @param {Array<object>} entities - Current Home Assistant entity states.
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

  /** Activates configuration that does not depend on an entity state. */
  setStaticState() {}

  /** Called once when Home Assistant context first becomes available to this tool. */
  hassAvailable() {}

  /** Called when the parent card is attached to the DOM. */
  connected() {}

  /** Called when the parent card is removed from the DOM. */
  disconnected() {}

  /** Called after the parent card's first Lit update. */
  firstUpdated() {}

  /** Called after every completed Lit update of the parent card. */
  updated() {}

  /** Called after the Home Assistant websocket reconnects. */
  hassConnected() {}

  /**
   * Reports whether this tool requires the next Home Assistant state pass.
   *
   * @returns {boolean} True when setHass must update this tool.
   */
  requiresHassUpdate() {
    return false;
  }


  /**
   * Resolves configured styles and animation styles into one style object.
   *
   * @param {object} baseStyles - Tool-specific base styles.
   * @returns {object} Style dictionary ready for styleMap().
   */
  getStyles(baseStyles) {
    const itemStyleDict = ConfigHelper.toStyleDict(this.paint?.styles ?? this.config.styles);
    const animationStyle = ConfigHelper.toStyleDict(this.card.cardAnimations.styles[this.animationSection]?.[this.config.animation_id] ?? {});

    return {
      ...baseStyles,
      ...itemStyleDict,
      ...animationStyle,
    };
  }

  /**
   * Publishes the complete effective child style map after the parent's existing
   * style merge. It replaces configured styles at the child render boundary;
   * this is not a partial override. The child still applies its own state-map,
   * color-stop and animation layers afterwards. Passing undefined restores the
   * configured styles.
   *
   * @param {object|undefined} styles - Complete parent-resolved styles, or undefined to clear them.
   */
  setPaintStyles(styles) {
    this.paint ??= {};
    if (styles === undefined) delete this.paint.styles;
    else this.paint.styles = styles;
  }

  /**
   * Builds the color-filter cascade for this tool in visual context order.
   *
   * This only exposes the configured filters; renderers decide when to apply them.
   *
   * @param {Array<object>} extraFilters - Extra filters such as layer or segment filters.
   * @returns {Array<object>} Ordered color_filter configs.
   */
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

  /**
   * Applies the resolved color-filter cascade to a final style dictionary.
   *
   * This helper is intentionally not wired into renderers yet; it exists so the
   * final render step can be tested explicitly before any broad integration.
   *
   * @param {object} styles - Final render style dictionary.
   * @param {Array<object>} extraFilters - Extra filters such as layer or segment filters.
   * @returns {object} Render style dictionary with filtered color properties.
   */
  getRenderStyles(styles, extraFilters = []) {
    const filteredStyles = ColorFilter.applyToStyles(styles, this.getColorFilterCascade(extraFilters), this.card);

    return this.card.cardLayout.masksClips.applyGradientRefs(filteredStyles);
  }

  /**
   * Applies the selected color-stop result to the configured SVG paint properties.
   *
   * @param {object} styles - Mutable style dictionary.
   * @param {object} item - Runtime item containing the normalized mode dictionaries.
   * @param {Array<string>} fillProperties - Renderer properties representing logical fill.
   */
  applyColorStops(styles, item = this.config, fillProperties = ['fill'], explicitColorStops) {
    if (!['colorstop', 'colorstopsegments', 'colorstopinterpolated'].includes(item.show?.item_style)) return;

    // Multipart items use their explicit palette or entity fallback; the outer
    // Text palette is not an implicit palette for an independently bound part.
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

  /**
   * Applies the existing SVG text ellipsis behavior used by text layout tools.
   *
   * @param {string} text - Text to shorten.
   * @param {number} ellipsis - Maximum character count.
   * @returns {string} Original or shortened text.
   */
  textEllipsis(text, ellipsis) {
    if (ellipsis && ellipsis < text.length) {
      return text.slice(0, ellipsis - 1).concat('...');
    }

    return text;
  }

  /**
   * Converts item coordinates to SVG coordinates within the item's group.
   *
   * @param {object} config - Static or runtime item config.
   * @returns {object} SVG coordinates.
   */
  calculateSvgDimensions(config = this.config) {
    return this.card.cardLayout.calculateSvgCoordinatesInGroup(config);
  }

  /**
   * Returns the SVG transform for the configured group and item flip settings.
   *
   * @param {object} [item=this.config] - Runtime item config.
   * @returns {string} SVG transform value.
   */
  getGroupScaleTransform(item = this.config) {
    return this.card.cardLayout.getGroupScaleTransform(item);
  }

  /**
   * Returns the SVG style needed for group scale origin.
   *
   * @param {object} [item=this.config] - Runtime item config.
   * @returns {string} SVG style value.
   */
  getGroupScaleStyle(item = this.config) {
    // Migrated tools pass their geometry explicitly. The remaining families
    // retain their existing SVG storage until their own migration plans.
    return this.card.cardLayout.getGroupScaleStyle(item, this.geometry ? this.geometry.svg : item.svg);
  }

  /**
   * Wraps this tool's rendered SVG content in configured clip and mask layers.
   *
   * The actual scoped ids live in MasksClips. Tools only know the user-facing
   * `clip` and `mask` names from their runtime config.
   *
   * @param {TemplateResult} content - Rendered SVG content for this tool.
   * @param {object} item - Runtime config that may contain clip/mask names.
   * @returns {TemplateResult} Wrapped or unchanged SVG content.
   */
  renderItemLayers(content, item = this.config) {
    let result = content;

    if (item.mask) {
      const maskIds = Array.isArray(item.mask) ? item.mask : [item.mask];

      // Multiple masks must be nested, not painted into one SVG mask. Nesting makes
      // each mask constrain the previous result, which is the useful combined effect.
      maskIds.forEach((maskId) => {
        this.card.cardLayout.masksClips.getMaskUseIds(maskId, item, this.zposSection).forEach((svgMaskId) => {
          result = svg`<g mask="url(#${svgMaskId})">${result}</g>`;
        });
      });
    }

    if (item.clip) {
      result = svg`<g clip-path="url(#${this.card.cardLayout.masksClips.getClipUseId(item.clip, item, this.zposSection)})">${result}</g>`;
    }

    // Hidden tools remain in the SVG and in every normal lifecycle phase. This
    // preserves text measurement, fit references, history and runtime state,
    // while the outer layer guarantees no visible or pointer-active descendant.
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

  /** Returns the shared gesture directive configured for this layout item. */
  actionHandler() {
    return actionHandler(this.card.actions.getActionHandlerOptions(this.config, this.entity_index));
  }

  /**
   * Routes a normalized gesture together with this exact item and entity index.
   *
   * @param {CustomEvent} event - Gesture event from the shared action handler.
   */
  handleAction(event) {
    this.card.actions.handleAction(event, this.config, this.entity_index);
  }
}
