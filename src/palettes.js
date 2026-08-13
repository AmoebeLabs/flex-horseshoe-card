export default class Palette {
  static cache = new Map();

  /**
   * Loads and caches one external palette JSON document by URL.
   *
   * @param {string} url - Palette resource URL.
   * @returns {Promise<object>} Shared palette request.
   */
  static load(url) {
    if (this.cache.has(url)) {
      return this.cache.get(url);
    }

    const promise = fetch(url).then(async (response) => {
      if (!response.ok) {
        throw new Error(`Could not load palette: ${url}`);
      }

      return response.json();
    });

    this.cache.set(url, promise);
    return promise;
  }

  /**
   * Loads every named palette before exposing the complete name/value map.
   *
   * @param {object} palettes - Palette names mapped to resource URLs.
   * @returns {Promise<object>} Loaded palettes by name.
   */
  static async loadAll(palettes = {}) {
    const entries = await Promise.all(
      Object.entries(palettes || {}).map(async ([name, url]) => {
        const palette = await this.load(url);
        return [name, palette];
      }),
    );

    return Object.fromEntries(entries);
  }

  /**
   * Writes base references followed by the active light/dark mode variables
   * onto the card host.
   *
   * @param {Element} element - Card host receiving CSS variables.
   * @param {object} palette - Loaded palette document.
   * @param {string} mode - Active palette mode.
   */
  static apply(element, palette, mode) {
    Object.entries(palette.ref).forEach(([name, value]) => {
      element.style.setProperty(`--${name}`, value);
    });

    Object.entries(palette.modes[mode]).forEach(([name, value]) => {
      // Palette keys omit the CSS custom-property prefix used on the host.
      element.style.setProperty(`--${name}`, value);
    });
  }

  /**
   * Applies all loaded palettes in declaration order.
   *
   * @param {Element} element - Card host receiving CSS variables.
   * @param {object} palettes - Loaded palettes by name.
   * @param {string} mode - Active palette mode.
   */
  static applyAll(element, palettes, mode) {
    Object.entries(palettes).forEach(([, palette]) => {
      this.apply(element, palette, mode);
    });
  }
}
