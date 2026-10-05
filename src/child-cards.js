import { html } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';

const PLACEMENT_FIELDS = ['xpos', 'ypos', 'width', 'height', 'zpos', 'embedded', 'frameless'];

/**
 * Creates and positions normal Lovelace child cards inside FHS.
 *
 * FHS positions each child and forwards HA data to it. Home Assistant's card
 * helpers create the child, which handles its own config, state and rendering.
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
    this.cardsConfig = [];
    this.creationNumber = 0;
    this.childrenNeedCreating = false;
    this.disconnectedFromCard = false;
    this.shellFrames = new Map();
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
    const creationNumber = ++this.creationNumber;
    this.cancelShellFrames();
    this.cardsConfig = cardsConfig;
    this.childrenNeedCreating = true;
    if (cardsConfig.length === 0) {
      const hadChildren = this.items.length > 0;
      this.items = [];
      this.childrenNeedCreating = false;
      if (hadChildren && !this.disconnectedFromCard) this.parentCard.requestUpdate();
      return;
    }
    if (this.disconnectedFromCard) return;

    try {
      const helpers = await window.loadCardHelpers();
      if (creationNumber !== this.creationNumber || this.disconnectedFromCard) return;

      // Create every child before showing the new list. If config changes while
      // HA helpers are loading, keep the old request from replacing the newer cards.
      const items = await Promise.all(
        cardsConfig.map(async (itemConfig, index) => {
          const childConfig = { ...itemConfig };

          PLACEMENT_FIELDS.forEach((field) => delete childConfig[field]);

          if (itemConfig.type === 'custom:flex-horseshoe-card' && itemConfig.embedded !== false) {
            childConfig.embedded = true;
          }

          const cardElement = await helpers.createCardElement(childConfig);

          if (creationNumber !== this.creationNumber || this.disconnectedFromCard) return;

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
      if (creationNumber !== this.creationNumber || this.disconnectedFromCard) return;
      this.items = items;
      this.childrenNeedCreating = false;
      if (this.parentCard._hass) this.setHass(this.parentCard._hass);
      this.parentCard.requestUpdate();
      await this.parentCard.updateComplete;
      if (creationNumber !== this.creationNumber || this.disconnectedFromCard) return;
      await this.removeChildCardShells(items, creationNumber);
    } catch (error) {
      if (creationNumber !== this.creationNumber || this.disconnectedFromCard) return;
      throw error;
    }
  }

  /** Cancels pending frameless-card retries and finishes their frame waits. */
  cancelShellFrames() {
    this.shellFrames.forEach((complete, frame) => {
      cancelAnimationFrame(frame);
      complete();
    });
    this.shellFrames.clear();
  }

  /** Reuses existing children or retries card creation interrupted by dashboard removal. */
  connected() {
    if (!this.disconnectedFromCard) return;
    this.disconnectedFromCard = false;
    if (this.childrenNeedCreating) {
      this.setConfig(this.cardsConfig).catch((error) => console.error('[FHC child cards]', error));
    } else {
      const items = this.items;
      const creationNumber = this.creationNumber;
      this.parentCard.updateComplete.then(() => {
        if (creationNumber !== this.creationNumber || this.disconnectedFromCard) return;
        return this.removeChildCardShells(items, creationNumber);
      }).catch((error) => console.error('[FHC child cards]', error));
    }
  }

  /** Stops pending card creation and frameless-shell work when FHS leaves the dashboard. */
  disconnected() {
    if (this.disconnectedFromCard) return;
    this.disconnectedFromCard = true;
    this.creationNumber += 1;
    this.cancelShellFrames();
  }

  /**
   * Forwards hass to every child card created by FHS.
   *
   * @param {object} hass - Home Assistant state object received by the parent.
   */
  setHass(hass) {
    if (this.disconnectedFromCard) return;
    this.items.forEach((item) => {
      item.card.hass = hass;
    });
  }

  /**
   * Removes native card shells after the current child DOM has rendered.
   *
   * @param {Array<object>} items - Accepted child list for this creation.
   * @param {number} creationNumber - Request number checked before changing child-card DOM.
   */
  async removeChildCardShells(items, creationNumber) {
    const findHaCard = (element) => {
      if (element.localName === 'ha-card') return element;

      const shadowHaCard = element.shadowRoot?.querySelector('ha-card');
      if (shadowHaCard) return shadowHaCard;

      const shadowChildHaCard = Array.from(element.shadowRoot?.children ?? []).map((child) => findHaCard(child)).find((haCard) => haCard);
      if (shadowChildHaCard) return shadowChildHaCard;

      return Array.from(element.children).map((child) => findHaCard(child)).find((haCard) => haCard);
    };

    await Promise.all(
      items.map(async (item) => {
        if (!item.frameless) return;

        if (item.card.updateComplete) {
          await item.card.updateComplete;
        }
        if (creationNumber !== this.creationNumber || this.disconnectedFromCard) return;

        // External cards can render their ha-card after they are connected. Try a
        // few frames so cards like markdown can finish their own first render.
        for (let attempt = 0; attempt < 5; attempt += 1) {
          await new Promise((complete) => {
            const frame = requestAnimationFrame(() => {
              this.shellFrames.delete(frame);
              complete();
            });
            this.shellFrames.set(frame, complete);
          });
          if (creationNumber !== this.creationNumber || this.disconnectedFromCard) return;
          const haCard = findHaCard(item.card);

          if (!haCard) continue;

          haCard.style.background = 'transparent';
          haCard.style.border = '0';
          haCard.style.boxShadow = 'none';
          haCard.style.padding = '0';

          return;
        }
      }),
    );
  }

  /**
   * Positions child cards in the parent's logical aspect-ratio space. Sorting
   * by zpos preserves explicit stacking while source order breaks equal layers.
   *
   * @returns {object} Lit HTML template for the child-card layer.
   */
  render() {
    const [aspectWidth, aspectHeight] = this.parentCard.cardLayout.aspectratio.split('/').map(Number);
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
