/**
 * Describes a configured icon source without making layout or rendering choices.
 *
 * @param {string} icon - Home Assistant icon name or CSS url(...) value.
 * @returns {{type: "ha-icon"|"svg-url"|"image-url", value: string}} Source type and normalized value.
 */
export function getIconSource(icon) {
  const urlMatch = icon.trim().match(/^url\(['"]?(.+?)['"]?\)$/i);

  if (!urlMatch) return { type: "ha-icon", value: icon };

  const url = urlMatch[1];
  return {
    type: url.endsWith(".svg") ? "svg-url" : "image-url",
    value: url,
  };
}

/**
 * Loads the SVG path exposed by Home Assistant's ha-icon component into the
 * existing card-wide icon cache. One loader instance owns one hidden ha-icon.
 */
export class HomeAssistantIconPath {
  /** Stores the source element id and current asynchronous request state. */
  constructor(card, sourceId, pathLoaded = () => card.requestUpdate()) {
    this.card = card;
    this.elementId = `icon-${sourceId}`;
    this.pathLoaded = pathLoaded;
    this.path = undefined;
    this.pendingIcon = undefined;
  }

  /**
   * Returns a cached path or starts reading it from the hidden ha-icon rendered
   * by the consumer. A source change cancels the previous polling loop.
   *
   * @param {string} icon - Home Assistant icon name.
   * @returns {string|undefined} SVG path data when available.
   */
  getPath(icon) {
    if (this.card.iconCache[icon]) {
      this.path = this.card.iconCache[icon];
      return this.path;
    }

    this.path = undefined;

    if (this.pendingIcon === icon) return this.path;

    this.pendingIcon = icon;
    let attempts = 0;
    const maxAttempts = 40;
    const delay = 50;

    const readIconPath = () => {
      if (this.pendingIcon !== icon) return;

      const iconElement = this.card.shadowRoot.getElementById(this.elementId);
      const iconPath = iconElement?.shadowRoot?.querySelector("*")?.path;

      if (iconPath) {
        this.path = iconPath;
        this.card.iconCache[icon] = iconPath;
        this.pendingIcon = undefined;
        this.pathLoaded();
        return;
      }

      attempts += 1;
      if (attempts >= maxAttempts) {
        this.pendingIcon = undefined;
        return;
      }

      window.setTimeout(readIconPath, delay);
    };

    // Wait until the consumer's hidden ha-icon has entered the shadow DOM.
    const afterRender =
      this.card.updateComplete && typeof this.card.updateComplete.then === "function"
        ? this.card.updateComplete
        : new Promise((complete) => window.requestAnimationFrame(complete));

    afterRender.then(() => window.setTimeout(readIconPath, 0));
    return this.path;
  }
}
