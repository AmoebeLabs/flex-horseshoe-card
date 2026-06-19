import { svg } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import BaseTool from './base-tool.js';

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
    this.runtimeConfig = this.config;
    this.name = '';
  }

  /**
   * Updates runtime entity context and displayed name text.
   *
   * @param {object} entity - Home Assistant entity state object for this name.
   * @param {object} entityConfig - Entity configuration for this name.
   */
  setState(entity, entityConfig) {
    super.setState(entity, entityConfig);

    this.runtimeConfig.svg = this.calculateSvgDimensions(this.runtimeConfig);
    this.name = this.textEllipsis(this.buildName(), this.runtimeConfig.max_characters ?? this.runtimeConfig.ellipsis);
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
    return this.entityConfig.name ?? this.entity.attributes.friendly_name ?? this.entity?.entity_id ?? '?';
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

    return svg`
      <g
        transform="${this.getGroupScaleTransform()}"
        style="${this.getGroupScaleStyle()}"
      >
        <text @click=${(event) => this.handlePopup(event)}>
          <tspan
            class="entity__name"
            x="${this.runtimeConfig.svg.xpos}"
            y="${this.runtimeConfig.svg.ypos}"
            style=${styleMap(styles)}>
            ${this.name}</tspan>
        </text>
      </g>
    `;
  }
}
