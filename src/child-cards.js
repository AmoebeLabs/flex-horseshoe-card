import { html } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';

const PLACEMENT_FIELDS = ['xpos', 'ypos', 'width', 'height', 'zpos'];

/**
 * Creates and positions normal Lovelace child cards inside FHS.
 *
 * The parent only owns the wrapper and the hass handoff. Each child remains a
 * normal card created by Home Assistant helpers and handles its own config,
 * template, state and Lit lifecycle.
 */
export default class ChildCards {
  /**
   * Stores the parent card and the current created child card list.
   *
   * @param {object} parentCard - FHS parent card instance.
   */
  constructor(parentCard) {
    this.parentCard = parentCard;
    this.items = [];
  }

  /**
   * Creates child cards from cards[] config.
   *
   * Placement fields stay on the parent wrapper. The remaining config is passed
   * unchanged to Home Assistant's card helper, so every child card behaves like
   * the same card would behave directly in Lovelace.
   *
   * @param {Array<object>} cardsConfig - cards[] config from FHS.
   */
  async setConfig(cardsConfig) {
    const helpers = await window.loadCardHelpers();

    this.items = await Promise.all(
      cardsConfig.map(async (itemConfig, index) => {
        const childConfig = { ...itemConfig };

        PLACEMENT_FIELDS.forEach((field) => delete childConfig[field]);

        const cardElement = await helpers.createCardElement(childConfig);

        if (this.parentCard._hass) {
          cardElement.hass = this.parentCard._hass;
        }

        return {
          card: cardElement,
          index,
          xpos: itemConfig.xpos,
          ypos: itemConfig.ypos,
          width: itemConfig.width,
          height: itemConfig.height,
          zpos: itemConfig.zpos,
        };
      }),
    );
    this.parentCard.requestUpdate();
  }

  /**
   * Forwards hass to every child card created by FHS.
   *
   * @param {object} hass - Home Assistant state object received by the parent.
   */
  setHass(hass) {
    this.items.forEach((item) => {
      item.card.hass = hass;
    });
  }

  /**
   * Renders positioned wrappers containing the already-created child card nodes.
   *
   * Lit renders the wrapper DOM. It does not call the child card render function;
   * the child card updates itself after it receives hass.
   *
   * @returns {TemplateResult} Child card layer template.
   */
  render() {
    return html`
      <div class="fhs-child-card-layer">
        ${this.items
          .slice()
          .sort((firstItem, secondItem) => Number(firstItem.zpos ?? firstItem.index) - Number(secondItem.zpos ?? secondItem.index) || firstItem.index - secondItem.index)
          .map((item) => {
            const style = {
              left: `${Number(item.xpos) - Number(item.width) / 2}%`,
              top: `${Number(item.ypos) - Number(item.height) / 2}%`,
              width: `${Number(item.width)}%`,
              height: `${Number(item.height)}%`,
              'z-index': String(item.zpos ?? item.index),
            };

            return html`<div class="fhs-child-card" style=${styleMap(style)}>${item.card}</div>`;
          })}
      </div>
    `;
  }
}
