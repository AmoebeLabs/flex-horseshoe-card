import Colors from './colors.js';
import Palette from './palettes.js';

/** Owns Home Assistant theme state, color mode and loaded palettes. */
export default class CardTheme {
  static viewObservers = new WeakMap();
  /**
   * Stores the card host and callbacks used to repaint after theme or palette
   * changes. CSS inheritance and palette availability determine shared reuse.
   */
  constructor(element, redrawGradients, updateCard) {
    this.element = element;
    this.redrawGradients = redrawGradients;
    this.updateCard = updateCard;
    this.hass = undefined;
    this.name = undefined;
    this.nameChanged = false;
    this.modeChanged = false;
    this.darkMode = false;
    this.palettes = {};
    this.palettesLoaded = false;
    this.paletteConfig = {};
    this.paletteLoadNumber = 0;
    this.palettesNeedLoading = false;
    this.disconnectedFromCard = false;
    this.connectedToCard = false;
    this.hasTheme = false;
    this.viewElement = undefined;
    this.parentTheme = undefined;
    this.childThemes = new Set();
    this.ownPaletteSources = [];
    this.paletteVariables = new Set();
    // Every color consumer receives the host whose inherited CSS it must read.
    // Theme/cache metadata is filled before these conversions become reusable.
    this.colorContext = {
      element,
      globalThemeName: '',
      viewThemeName: null,
      mode: 'light',
      themeSource: undefined,
      paletteSources: [],
      cacheKey: JSON.stringify(['', null, []]),
      cacheReady: false,
    };
  }

  /** Returns the active light/dark color-stop mode. */
  getActiveColorStopMode() {
    return this.colorContext.mode;
  }

  /** Applies a Home Assistant theme change and reports whether rendering changed. */
  updateHass(hass) {
    this.hass = hass;
    this.hasTheme = true;
    // HA forwards the global hass unchanged into themed views. Keep both names:
    // a partial view theme still inherits variables from the global selection.
    const globalThemeName = hass.themes.theme;
    const viewThemeName = this.viewElement ? (this.viewElement.theme ?? null) : null;
    const themeDarkMode = hass.themes.darkMode === true;
    this.nameChanged = this.colorContext.globalThemeName !== globalThemeName || this.colorContext.viewThemeName !== viewThemeName;
    this.modeChanged = this.darkMode !== themeDarkMode;
    const themeSourceChanged = this.colorContext.themeSource !== hass.themes;

    if (!this.nameChanged && !this.modeChanged && !themeSourceChanged) return false;

    this.name = viewThemeName ?? globalThemeName;
    this.darkMode = themeDarkMode;
    this.colorContext.globalThemeName = globalThemeName;
    this.colorContext.viewThemeName = viewThemeName;
    this.colorContext.mode = themeDarkMode ? 'dark' : 'light';
    this.colorContext.themeSource = hass.themes;
    Colors.getThemeRevision(hass.themes);
    this.applyPalettes();
    this.redrawGradients();
    return true;
  }

  /**
   * Applies this card's palette variables and publishes the sources inherited by
   * its nested cards. Removed keys fall back to the surrounding CSS environment.
   */
  applyPalettes() {
    this.colorContext.cacheReady = false;
    this.paletteVariables = Palette.applyAll(this.element, this.palettes, this.colorContext.mode, this.paletteVariables);
    this.colorContext.paletteSources = this.parentTheme
      ? [...this.parentTheme.colorContext.paletteSources, ...this.ownPaletteSources]
      : this.ownPaletteSources;
    this.colorContext.cacheKey = JSON.stringify([
      this.colorContext.globalThemeName,
      this.colorContext.viewThemeName,
      this.colorContext.paletteSources.map((source) => source.url),
    ]);
    // A child inherits these CSS variables without receiving a new hass object.
    this.childThemes.forEach((theme) => {
      theme.applyPalettes();
      theme.redrawGradients();
    });
  }

  /** Makes conversions reusable only after current CSS and palettes are present. */
  finishPaintUpdate() {
    if (!this.connectedToCard || !this.hasTheme || !this.palettesLoaded) return false;
    this.colorContext.cacheReady = true;
    return true;
  }

  /** Loads configured palettes and reapplies them using the current HA mode. */
  async loadPalettes(paletteConfig) {
    this.paletteConfig = paletteConfig;
    const loadNumber = ++this.paletteLoadNumber;
    this.palettesNeedLoading = true;
    this.palettesLoaded = false;
    this.colorContext.cacheReady = false;

    // An empty selection also supersedes a pending load. A connected card with
    // an existing HA context needs its paint completion after a live YAML edit.
    if (Object.keys(paletteConfig).length === 0) {
      const removedPalette = this.ownPaletteSources.length > 0;
      this.palettes = {};
      this.ownPaletteSources = [];
      this.palettesLoaded = true;
      this.palettesNeedLoading = false;
      this.applyPalettes();
      if (removedPalette || (this.connectedToCard && this.hasTheme)) this.updateCard();
      return;
    }
    if (this.disconnectedFromCard) return;

    let palettes;
    try {
      palettes = await Palette.loadAll(paletteConfig);
    } catch (error) {
      if (loadNumber !== this.paletteLoadNumber || this.disconnectedFromCard) return;
      // The caller reports the active failure; a later call/reconnect can retry.
      throw error;
    }
    if (loadNumber !== this.paletteLoadNumber || this.disconnectedFromCard) return;

    this.palettes = palettes;
    this.ownPaletteSources = Object.entries(paletteConfig).map(([name, url]) => ({ url, palette: palettes[name] }));
    this.applyPalettes();
    this.palettesLoaded = true;
    this.palettesNeedLoading = false;
    this.updateCard();
  }

  /** Resumes only the current palette configuration interrupted by disconnect. */
  connected() {
    if (this.connectedToCard) return;
    const retryPalettes = this.disconnectedFromCard && this.palettesNeedLoading;
    this.connectedToCard = true;
    this.disconnectedFromCard = false;
    // Theme inheritance follows the composed DOM, including slotted cards and
    // shadow hosts. Inspect ancestry once per connection, not per conversion.
    let node = this.element;
    while (node) {
      if (node !== this.element && node.localName === 'flex-horseshoe-card' && !this.parentTheme) this.parentTheme = node.cardTheme;
      if (node.localName === 'hui-view-container') {
        this.viewElement = node;
        break;
      }
      if (node.assignedSlot) node = node.assignedSlot;
      else if (node.parentElement) node = node.parentElement;
      else node = node.getRootNode().host;
    }
    if (this.parentTheme) this.parentTheme.childThemes.add(this);
    if (this.viewElement) {
      let subscription = CardTheme.viewObservers.get(this.viewElement);
      if (!subscription) {
        subscription = { themes: new Set(), observer: undefined };
        subscription.observer = new MutationObserver(() => {
          subscription.themes.forEach((theme) => {
            if (!theme.hasTheme) return;
            theme.colorContext.cacheReady = false;
            if (!theme.updateHass(theme.hass)) theme.redrawGradients();
          });
        });
        subscription.observer.observe(this.viewElement, { attributes: true, attributeFilter: ['style'] });
        CardTheme.viewObservers.set(this.viewElement, subscription);
      }
      subscription.themes.add(this);
    }
    if (this.hasTheme) {
      if (!this.updateHass(this.hass)) {
        this.applyPalettes();
        this.redrawGradients();
      }
    }
    if (retryPalettes) {
      this.loadPalettes(this.paletteConfig).catch((error) => console.error('[FHC palettes]', error));
    }
  }

  /** Invalidates pending publication while retaining successful shared sources. */
  disconnected() {
    if (this.disconnectedFromCard) return;
    this.disconnectedFromCard = true;
    this.connectedToCard = false;
    this.colorContext.cacheReady = false;
    this.paletteLoadNumber += 1;
    if (this.viewElement) {
      const subscription = CardTheme.viewObservers.get(this.viewElement);
      subscription.themes.delete(this);
      if (subscription.themes.size === 0) {
        subscription.observer.disconnect();
        CardTheme.viewObservers.delete(this.viewElement);
      }
      this.viewElement = undefined;
    }
    if (this.parentTheme) {
      this.parentTheme.childThemes.delete(this);
      this.parentTheme = undefined;
    }
  }

  /** Clears the per-update mode marker after all runtime config was evaluated. */
  markModeHandled() {
    this.modeChanged = false;
  }
}
