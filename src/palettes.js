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
    // console.log('Loading palettes', palettes);
    const entries = await Promise.all(
      Object.entries(palettes || {}).map(async ([name, url]) => {
        const palette = await this.load(url);
        return [name, palette];
      }),
    );

    return Object.fromEntries(entries);
  }

  static async loadAllV1(paletteConfigs) {
    const entries = await Promise.all(
      Object.entries(paletteConfigs).map(async ([name, url]) => {
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
      // 1. Zet de variabele (met streepjes)
      element.style.setProperty(`--${name}`, value);

      // 2. Vraag de berekende kleur op (VOEG HIER DE `--` TOE)
      const deKleur = window.getComputedStyle(element).getPropertyValue(`--${name}`).trim();

      // console.log(`Applied palette variable --${name}: ${deKleur}`);
    });
  }

  static applyAll(element, palettes, mode) {
    Object.entries(palettes).forEach(([, palette]) => {
      this.apply(element, palette, mode);
    });
  }
}
