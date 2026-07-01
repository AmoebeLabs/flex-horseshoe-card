import { svg } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import BaseTool from './base-tool.js';

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
        <text @click=${(event) => this.handlePopup(event)}>
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
