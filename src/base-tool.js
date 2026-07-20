import { svg } from 'lit';
import ConfigHelper from './config-helper.js';
import ColorStops from './color-stops.js';
import ColorFilter from './color-filter.js';
import Templates from './templates.js';
import { DEFAULT_RENDER_INDEX, DEFAULT_ZPOS } from './const.js';

/**
 * Shared base for layout tools that receive static config from the card and resolve runtime state per hass update.
 */
export default class BaseTool {
  /**
   * Stores the normalized static item config and shared card context.
   *
   * @param {object} config - Static item config after card-level refs, calc, ids, and same_as handling.
   * @param {number} index - Item index inside its layout section.
   * @param {object} templates - Template resolver shared with the card.
   * @param {string} cardId - Stable card id for generated SVG ids.
   * @param {LitElement} card - Parent card instance with shared render helpers.
   * @param {string} animationSection - Animation bucket name for this tool type.
   * @param {string} zposSection - Layer bucket name for zpos defaults.
   * @param {number|undefined} defaultEntityIndex - Fallback entity index for entity-bound tools.
   */
  constructor(config, index, templates, cardId, card, animationSection, zposSection = animationSection, defaultEntityIndex = 0) {
    this.sourceConfig = config;
    this.hasJavascript = templates.hasJavascriptTemplates(this.sourceConfig);
    this.config = this.sourceConfig;
    this.id = config.id;
    this.index = index;
    this.templates = templates;
    this.cardId = cardId;
    this.card = card;
    this.animationSection = animationSection;
    this.zposSection = zposSection;
    this.defaultZpos = DEFAULT_ZPOS[zposSection] ?? 0;
    this.config.zpos ??= this.defaultZpos;
    this.config.dzpos ??= 0;
    this.zpos = Number(this.config.zpos) + Number(this.config.dzpos);
    this.renderIndex = (DEFAULT_RENDER_INDEX[zposSection] ?? 0) + index;
    this.entity_index = config.entity_index ?? defaultEntityIndex;

    this.entity = undefined;
    this.entityConfig = undefined;
    this.configChanged = true;
    this.activeConfigInitialized = false;
    this.activeConfigSignature = undefined;
  }

  /**
   * Updates the runtime entity context for this tool.
   *
   * @param {object} entity - Home Assistant entity state object for this tool.
   * @param {object} entityConfig - Entity configuration for this tool.
   */
  setState(entity, entityConfig) {
    this.entity = entity;
    this.entityConfig = entityConfig;
    const activeGroupId = this.config.group ?? this.sourceConfig.group ?? 'card';
    this.configChanged = !this.activeConfigInitialized || this.card.changedGroupIds.has(activeGroupId) || this.card.theme.modeChanged;

    // Static tools reuse their finalized config and never enter the recursive JavaScript evaluator.
    if (this.hasJavascript && (!this.activeConfigInitialized || this.card.evaluateJavascriptTemplates)) {
      const evaluatedConfig = Templates.getJsTemplateOrValue(this.sourceConfig, this.sourceConfig, {
        resolveKeys: true,
      });
      const evaluatedConfigSignature = JSON.stringify(evaluatedConfig);

      // Keep the current active object when JavaScript produced the same config. Tool-specific
      // normalization and geometry can use configChanged during their migration in later issues.
      if (evaluatedConfigSignature !== this.activeConfigSignature) {
        this.config = evaluatedConfig;
        this.activeConfigSignature = evaluatedConfigSignature;
        this.configChanged = true;
      }
    }

    // JavaScript may return the public color_stops shape, so normalize it after activating the complete item.
    if (this.configChanged && this.config.color_stops) {
      this.config.colorstops = ColorStops.normalize(this.config.color_stops, this.card.getActiveColorStopMode());
    }

    // Sparkline graph options keep their public color_stops inside the nested sparkline block.
    if (this.configChanged && this.config.sparkline?.color_stops) {
      this.config.sparkline.colorstops = ColorStops.normalize(this.config.sparkline.color_stops, this.card.getActiveColorStopMode());
    }

    this.zpos = Number(this.config.zpos) + Number(this.config.dzpos);
    this.activeConfigInitialized = true;
  }

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
    const itemStyleDict = ConfigHelper.toStyleDict(this.config.styles);
    const animationStyle = ConfigHelper.toStyleDict(this.card.animations?.[this.animationSection]?.[this.config.animation_id] ?? {});

    return {
      ...baseStyles,
      ...itemStyleDict,
      ...animationStyle,
    };
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
    const groupFilters = this.card.groupManager
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

    return this.card.masksClips.applyGradientRefs(filteredStyles);
  }

  /**
   * Applies a color stop result to the requested style property.
   *
   * @param {object} styles - Mutable style dictionary.
   * @param {string} property - Style property that receives the color stop value.
   */
  applyColorStops(styles, property) {
    const stopColor = this.card._getItemColorFromStops(this.config);

    if (stopColor) {
      styles[property] = stopColor;
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
   * Returns the SVG transform for the configured group and item flip settings.
   *
   * @returns {string} SVG transform value.
   */
  getGroupScaleTransform() {
    return this.card._getGroupScaleTransform(this.config);
  }

  /**
   * Returns the SVG style needed for group scale origin.
   *
   * @returns {string} SVG style value.
   */
  getGroupScaleStyle() {
    return this.card._getGroupScaleStyle(this.config);
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
        this.card.masksClips.getMaskUseIds(maskId, item, this.zposSection).forEach((svgMaskId) => {
          result = svg`<g mask="url(#${svgMaskId})">${result}</g>`;
        });
      });
    }

    if (item.clip) {
      result = svg`<g clip-path="url(#${this.card.masksClips.getClipUseId(item.clip, item, this.zposSection)})">${result}</g>`;
    }

    return result;
  }

  /**
   * Opens the configured entity popup using the card action handler.
   *
   * @param {Event} event - Click event.
   */
  handlePopup(event) {
    if (this.entity_index === undefined || this.entity_index === null) return;

    const entity = this.card.entities[this.entity_index];
    if (!entity) return;

    this.card.handlePopup(event, entity);
  }
}
