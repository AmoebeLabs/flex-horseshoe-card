import { html } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';

const PLACEMENT_FIELDS = ['xpos', 'ypos', 'width', 'height', 'zpos', 'embedded', 'frameless'];

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

        if (itemConfig.type === 'custom:flex-horseshoe-card' && itemConfig.embedded !== false) {
          childConfig.embedded = true;
        }

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
          frameless: itemConfig.frameless !== false,
        };
      }),
    );
    this.parentCard.requestUpdate();
    this.parentCard.updateComplete.then(() => this.removeChildCardShells());
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
  async removeChildCardShells() {
    const findHaCard = (element) => {
      if (element.localName === 'ha-card') return element;

      const shadowHaCard = element.shadowRoot?.querySelector('ha-card');
      if (shadowHaCard) return shadowHaCard;

      const shadowChildHaCard = Array.from(element.shadowRoot?.children ?? []).map((child) => findHaCard(child)).find((haCard) => haCard);
      if (shadowChildHaCard) return shadowChildHaCard;

      return Array.from(element.children).map((child) => findHaCard(child)).find((haCard) => haCard);
    };

    await Promise.all(
      this.items.map(async (item) => {
        if (!item.frameless) return;

        if (item.card.updateComplete) {
          await item.card.updateComplete;
        }

        // External cards can render their ha-card after they are connected. Try a
        // few frames so cards like markdown can finish their own first render.
        await [1, 2, 3, 4, 5].reduce(async (previousAttempt) => {
          const haCardAlreadyFound = await previousAttempt;
          if (haCardAlreadyFound) return haCardAlreadyFound;

          await new Promise(requestAnimationFrame);
          const haCard = findHaCard(item.card);

          if (!haCard) return false;

          haCard.style.background = 'transparent';
          haCard.style.border = '0';
          haCard.style.boxShadow = 'none';
          haCard.style.padding = '0';

          return true;
        }, Promise.resolve(false));
      }),
    );
  }

  render() {
    const [aspectWidth, aspectHeight] = this.parentCard.aspectratio.split('/').map(Number);
    const logicalCardWidth = aspectWidth * 100;
    const logicalCardHeight = aspectHeight * 100;

    return html`
      <div class="fhs-child-card-layer">
        ${this.items
          .slice()
          .sort((firstItem, secondItem) => Number(firstItem.zpos ?? firstItem.index) - Number(secondItem.zpos ?? secondItem.index) || firstItem.index - secondItem.index)
          .map((item) => {
            // Convert the absolute FHS coordinates once to percentages of the
            // complete logical card. CSS handles every subsequent resize.
            const style = {
              left: `${((Number(item.xpos) - Number(item.width) / 2) / logicalCardWidth) * 100}%`,
              top: `${((Number(item.ypos) - Number(item.height) / 2) / logicalCardHeight) * 100}%`,
              width: `${(Number(item.width) / logicalCardWidth) * 100}%`,
              height: `${(Number(item.height) / logicalCardHeight) * 100}%`,
              'z-index': String(item.zpos ?? item.index),
            };

            return html`<div
              class="fhs-child-card ${item.frameless ? 'fhs-child-card--frameless' : ''}"
              style=${styleMap(style)}
            >
              ${item.card}
            </div>`;
          })}
      </div>
    `;
  }
}
