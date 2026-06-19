import ConfigHelper from './config-helper.js';
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
   */
  constructor(config, index, templates, cardId, card, animationSection, zposSection = animationSection) {
    this.config = config;
    this.index = index;
    this.templates = templates;
    this.cardId = cardId;
    this.card = card;
    this.animationSection = animationSection;
    this.zposSection = zposSection;
    this.defaultZpos = DEFAULT_ZPOS[zposSection] ?? 0;
    this.config.zpos ??= this.defaultZpos;
    this.zpos = this.config.zpos;
    this.renderIndex = (DEFAULT_RENDER_INDEX[zposSection] ?? 0) + index;
    this.entity_index = config.entity_index ?? 0;

    this.entity = undefined;
    this.entityConfig = undefined;
    this.runtimeConfig = config;
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

    // setHass() triggers runtime evaluation; each tool owns how its static config becomes runtime config.
    this.runtimeConfig = Templates.getJsTemplateOrValue(this.config, this.config, {
      resolveKeys: true,
    });
    this.zpos = this.runtimeConfig.zpos ?? this.defaultZpos;
  }

  /**
   * Resolves configured styles and animation styles into one style object.
   *
   * @param {object} baseStyles - Tool-specific base styles.
   * @returns {object} Style dictionary ready for styleMap().
   */
  getStyles(baseStyles) {
    const itemStyleDict = ConfigHelper.toStyleDict(this.runtimeConfig.styles);
    const animationStyle = ConfigHelper.toStyleDict(this.card.animations?.[this.animationSection]?.[this.runtimeConfig.animation_id] ?? {});

    return {
      ...baseStyles,
      ...itemStyleDict,
      ...animationStyle,
    };
  }

  /**
   * Applies a color stop result to the requested style property.
   *
   * @param {object} styles - Mutable style dictionary.
   * @param {string} property - Style property that receives the color stop value.
   */
  applyColorStops(styles, property) {
    const stopColor = this.card._getItemColorFromStops(this.runtimeConfig);

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
    return this.card._getGroupScaleTransform(this.runtimeConfig);
  }

  /**
   * Returns the SVG style needed for group scale origin.
   *
   * @returns {string} SVG style value.
   */
  getGroupScaleStyle() {
    return this.card._getGroupScaleStyle(this.runtimeConfig);
  }

  /**
   * Opens the configured entity popup using the card action handler.
   *
   * @param {Event} event - Click event.
   */
  handlePopup(event) {
    this.card.handlePopup(event, this.card.entities[this.entity_index]);
  }
}
