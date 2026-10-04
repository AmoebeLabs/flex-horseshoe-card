import assert from 'node:assert/strict';
import test from 'node:test';

import CardTheme from '../src/card-theme.js';
import Palette from '../src/palettes.js';

function paletteDocument() {
  return {
    ref: { 'fhs-plan20-reference': '#607d8b' },
    modes: {
      light: { 'fhs-plan20-mode': '#fafafa' },
      dark: { 'fhs-plan20-mode': '#212121' },
    },
  };
}

test('theme updates keep palette styles correct without reloading unchanged palettes', async () => {
  const originalFetch = globalThis.fetch;
  const paletteUrl = 'https://tests.invalid/plan20-support-palette.json';
  const properties = new Map();
  let styleWrites = 0;
  let fetches = 0;
  let redraws = 0;
  const host = {
    style: {
      setProperty(name, value) {
        styleWrites += 1;
        properties.set(name, value);
      },
      removeProperty(name) {
        styleWrites += 1;
        properties.delete(name);
      },
    },
  };
  const theme = new CardTheme(host, () => { redraws += 1; }, () => {});
  const hass = { themes: { theme: 'plan20-spring', darkMode: false, themes: {} } };

  Palette.cache.delete(paletteUrl);
  globalThis.fetch = async (url) => {
    assert.equal(url, paletteUrl);
    fetches += 1;
    return { ok: true, json: async () => paletteDocument() };
  };

  try {
    assert.equal(theme.updateHass(hass), true);
    await theme.loadPalettes({ active: paletteUrl });
    assert.equal(properties.get('--fhs-plan20-reference'), '#607d8b');
    assert.equal(properties.get('--fhs-plan20-mode'), '#fafafa');

    const writesAfterLoad = styleWrites;
    const redrawsAfterLoad = redraws;
    assert.equal(theme.updateHass(hass), false);
    assert.equal(styleWrites, writesAfterLoad);
    assert.equal(redraws, redrawsAfterLoad);
    assert.equal(fetches, 1);

    hass.themes.darkMode = true;
    assert.equal(theme.updateHass(hass), true);
    assert.equal(theme.getActiveColorStopMode(), 'dark');
    assert.equal(properties.get('--fhs-plan20-mode'), '#212121');
    assert.equal(theme.modeChanged, true);
    assert.equal(fetches, 1);

    theme.markModeHandled();
    assert.equal(theme.modeChanged, false);
    const writesAfterModeChange = styleWrites;
    const redrawsAfterModeChange = redraws;
    assert.equal(theme.updateHass(hass), false);
    assert.equal(styleWrites, writesAfterModeChange);
    assert.equal(redraws, redrawsAfterModeChange);
    assert.equal(fetches, 1);

    hass.themes.theme = 'plan20-winter';
    assert.equal(theme.updateHass(hass), true);
    assert.equal(redraws, redrawsAfterModeChange + 1);
    assert.equal(theme.getActiveColorStopMode(), 'dark');
    assert.equal(properties.get('--fhs-plan20-mode'), '#212121');
    assert.equal(fetches, 1);
  } finally {
    globalThis.fetch = originalFetch;
    Palette.cache.delete(paletteUrl);
  }
});
