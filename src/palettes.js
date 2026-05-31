export default class Palette {
  static cache = new Map();

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

  static async loadAll(palettes = {}) {
    const entries = await Promise.all(
      Object.entries(palettes || {}).map(async ([name, url]) => {
        const palette = await this.load(url);
        return [name, palette];
      }),
    );

    return Object.fromEntries(entries);
  }

  static apply(element, palette, mode) {
    Object.entries(palette.ref).forEach(([name, value]) => {
      element.style.setProperty(`--${name}`, value);
    });

    Object.entries(palette.modes[mode]).forEach(([name, value]) => {
      // Add CSS VAR prefix to name
      element.style.setProperty(`--${name}`, value);

      // Fetch as test
      // const deKleur = window.getComputedStyle(element).getPropertyValue(`--${name}`).trim();
    });
  }

  static applyAll(element, palettes, mode) {
    Object.entries(palettes).forEach(([, palette]) => {
      this.apply(element, palette, mode);
    });
  }
}
