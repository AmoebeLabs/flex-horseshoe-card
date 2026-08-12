import Colors from './colors.js';
import Palette from './palettes.js';

/** Owns Home Assistant theme state, color mode and loaded palettes. */
export default class CardTheme {
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
    this.horseshoes = [];
  }

  /** Publishes the current horseshoes whose cached color paths depend on mode. */
  setHorseshoes(horseshoes) {
    this.horseshoes = horseshoes;
  }

  /** Returns the active light/dark color-stop mode. */
  getActiveColorStopMode() {
    if (this.hass?.themes?.darkMode !== undefined) return this.hass.themes.darkMode === true ? 'dark' : 'light';
    return this.darkMode ? 'dark' : 'light';
  }

  /** Applies a Home Assistant theme change and reports whether rendering changed. */
  updateHass(hass) {
    this.hass = hass;
    const themeName = hass.selectedTheme || hass.themes.theme || '';
    const themeDarkMode = hass.themes.darkMode === true;
    this.nameChanged = this.name !== themeName;
    this.modeChanged = this.darkMode !== themeDarkMode;

    if (!this.nameChanged && !this.modeChanged) return false;

    this.name = themeName;
    this.darkMode = themeDarkMode;
    Colors.colorCache = {};
    Palette.applyAll(this.element, this.palettes, this.getActiveColorStopMode());
    this.horseshoes.forEach((horseshoe) => horseshoe.clearPathItemCache());
    this.redrawGradients();
    return true;
  }

  /** Loads configured palettes and reapplies them using the current HA mode. */
  async loadPalettes(paletteConfig) {
    this.palettesLoaded = false;
    this.palettes = await Palette.loadAll(paletteConfig);
    Colors.setElement(this.element);
    Palette.applyAll(this.element, this.palettes, this.getActiveColorStopMode());
    Colors.colorCache = {};
    this.palettesLoaded = true;
    this.horseshoes.forEach((horseshoe) => horseshoe.clearPathItemCache());
    this.updateCard();
  }

  /** Clears the per-update mode marker after all runtime config was evaluated. */
  markModeHandled() {
    this.modeChanged = false;
  }
}
