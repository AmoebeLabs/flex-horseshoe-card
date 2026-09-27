import assert from 'node:assert/strict';
import test from 'node:test';

import CardTheme from '../src/card-theme.js';
import Palette from '../src/palettes.js';

function makeElement(localName, parentElement) {
  const properties = new Map();
  return {
    localName,
    parentElement,
    assignedSlot: null,
    style: {
      properties,
      setProperty(name, value) { properties.set(name, value); },
      removeProperty(name) { properties.delete(name); },
    },
    getRootNode() { return { host: undefined }; },
  };
}

function paletteDocument(name, variable) {
  return {
    ref: {},
    modes: {
      light: { [variable]: `${name}-light` },
      dark: { [variable]: `${name}-dark` },
    },
  };
}

function responseFor(document) {
  return { ok: true, json: async () => document };
}

function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return { promise, resolve, reject };
}

function restoreGlobal(name, value) {
  if (value === undefined) delete globalThis[name];
  else globalThis[name] = value;
}

test('CardTheme inherits view and global themes across nested card connection lifetimes', async () => {
  const originalMutationObserver = globalThis.MutationObserver;
  const originalFetch = globalThis.fetch;
  const paletteUrl = 'https://tests.invalid/card-theme-lifecycle-inherited.json';
  const documents = new Map([[paletteUrl, paletteDocument('inherited', 'fhs-inherited')]]);
  const observers = [];

  class ViewMutationObserver {
    constructor(callback) {
      this.callback = callback;
      this.disconnected = false;
      observers.push(this);
    }
    observe(target, options) {
      this.target = target;
      this.options = options;
    }
    disconnect() { this.disconnected = true; }
  }

  globalThis.MutationObserver = ViewMutationObserver;
  globalThis.fetch = async (url) => responseFor(documents.get(url));

  const view = makeElement('hui-view-container', null);
  view.theme = 'view-spring';
  const parentHost = makeElement('flex-horseshoe-card', view);
  const childHost = makeElement('flex-horseshoe-card', parentHost);
  const redraws = { parent: 0, child: 0 };
  const parentTheme = new CardTheme(parentHost, () => { redraws.parent += 1; }, () => {});
  const childTheme = new CardTheme(childHost, () => { redraws.child += 1; }, () => {});
  parentHost.cardTheme = parentTheme;

  try {
    parentTheme.connected();
    childTheme.connected();
    const sharedObserver = CardTheme.viewObservers.get(view).observer;
    assert.equal(observers.length, 1);
    assert.equal(CardTheme.viewObservers.get(view).themes.size, 2);
    assert.equal(sharedObserver.target, view);
    assert.deepEqual(sharedObserver.options, { attributes: true, attributeFilter: ['style'] });

    const themes = { theme: 'ha-global', darkMode: false, themes: {} };
    const hass = { themes };
    assert.equal(parentTheme.updateHass(hass), true);
    assert.equal(childTheme.updateHass(hass), true);
    await parentTheme.loadPalettes({ inherited: paletteUrl });
    await childTheme.loadPalettes({});

    assert.equal(parentTheme.colorContext.globalThemeName, 'ha-global');
    assert.equal(parentTheme.colorContext.viewThemeName, 'view-spring');
    assert.equal(childTheme.colorContext.globalThemeName, 'ha-global');
    assert.equal(childTheme.colorContext.viewThemeName, 'view-spring');
    assert.deepEqual(childTheme.colorContext.paletteSources, [{ url: paletteUrl, palette: documents.get(paletteUrl) }]);
    assert.equal(parentTheme.finishPaintUpdate(), true);
    assert.equal(childTheme.finishPaintUpdate(), true);

    // HA can recreate the outer hass object without changing the active theme source.
    const redrawCount = redraws.parent + redraws.child;
    assert.equal(parentTheme.updateHass({ ...hass }), false);
    assert.equal(childTheme.updateHass({ ...hass }), false);
    assert.equal(redraws.parent + redraws.child, redrawCount);

    // A view style change updates both nested cards through their shared observer.
    view.theme = 'view-winter';
    sharedObserver.callback();
    assert.equal(parentTheme.colorContext.viewThemeName, 'view-winter');
    assert.equal(childTheme.colorContext.viewThemeName, 'view-winter');
    assert.equal(parentTheme.colorContext.globalThemeName, 'ha-global');
    assert.equal(childTheme.colorContext.globalThemeName, 'ha-global');
    assert.ok(redraws.parent + redraws.child > redrawCount);

    // Disconnecting one card keeps the shared view observer alive for its parent.
    childTheme.disconnected();
    assert.equal(sharedObserver.disconnected, false);
    assert.equal(CardTheme.viewObservers.get(view).themes.size, 1);
    parentTheme.disconnected();
    assert.equal(sharedObserver.disconnected, true);
    assert.equal(CardTheme.viewObservers.get(view), undefined);

    // Reconnection rebuilds the same parent/view relationships with one observer.
    parentTheme.connected();
    childTheme.connected();
    const reconnected = CardTheme.viewObservers.get(view);
    assert.notStrictEqual(reconnected.observer, sharedObserver);
    assert.equal(reconnected.themes.size, 2);
    assert.strictEqual(childTheme.parentTheme, parentTheme);
    assert.equal(parentTheme.finishPaintUpdate(), true);
    assert.equal(childTheme.finishPaintUpdate(), true);

    childTheme.disconnected();
    parentTheme.disconnected();
    assert.equal(reconnected.observer.disconnected, true);
    assert.equal(CardTheme.viewObservers.get(view), undefined);
  } finally {
    childTheme.disconnected();
    parentTheme.disconnected();
    globalThis.fetch = originalFetch;
    restoreGlobal('MutationObserver', originalMutationObserver);
    Palette.cache.delete(paletteUrl);
  }
});

test('CardTheme replaces and removes palette variables and retries an interrupted load after reconnect', async () => {
  const originalMutationObserver = globalThis.MutationObserver;
  const originalFetch = globalThis.fetch;
  const firstUrl = 'https://tests.invalid/card-theme-lifecycle-first.json';
  const replacementUrl = 'https://tests.invalid/card-theme-lifecycle-replacement.json';
  const reconnectUrl = 'https://tests.invalid/card-theme-lifecycle-reconnect.json';
  const interruptedRequest = deferred();
  const resumedRequest = deferred();
  const resumedPaletteApplied = deferred();
  let reconnectFetches = 0;
  const host = makeElement('flex-horseshoe-card', null);
  const updates = [];
  const theme = new CardTheme(host, () => {}, () => {
    updates.push('palette');
    if (reconnectFetches > 1) resumedPaletteApplied.resolve();
  });

  globalThis.MutationObserver = class {
    observe() {}
    disconnect() {}
  };
  globalThis.fetch = async (url) => {
    if (url === firstUrl) return responseFor(paletteDocument('first', 'fhs-first'));
    if (url === replacementUrl) return responseFor(paletteDocument('replacement', 'fhs-replacement'));
    if (url === reconnectUrl) {
      reconnectFetches += 1;
      return (reconnectFetches === 1 ? interruptedRequest : resumedRequest).promise;
    }
    assert.fail(`Unexpected palette request: ${url}`);
  };

  try {
    theme.connected();
    theme.updateHass({ themes: { theme: 'ha-theme', darkMode: false, themes: {} } });

    await theme.loadPalettes({ active: firstUrl });
    assert.equal(host.style.properties.get('--fhs-first'), 'first-light');
    assert.equal(theme.colorContext.paletteSources[0].url, firstUrl);

    await theme.loadPalettes({ active: replacementUrl });
    assert.equal(host.style.properties.has('--fhs-first'), false);
    assert.equal(host.style.properties.get('--fhs-replacement'), 'replacement-light');
    assert.equal(theme.colorContext.paletteSources[0].url, replacementUrl);

    await theme.loadPalettes({});
    assert.equal(host.style.properties.has('--fhs-replacement'), false);
    assert.deepEqual(theme.colorContext.paletteSources, []);

    const interruptedLoad = theme.loadPalettes({ active: reconnectUrl });
    theme.disconnected();
    interruptedRequest.reject(new Error('palette server unavailable while detached'));
    await interruptedLoad;
    assert.equal(theme.palettesLoaded, false);
    assert.equal(theme.palettesNeedLoading, true);
    assert.equal(host.style.properties.has('--fhs-reconnect'), false);

    theme.connected();
    assert.equal(reconnectFetches, 2);
    resumedRequest.resolve(responseFor(paletteDocument('reconnected', 'fhs-reconnect')));
    await resumedPaletteApplied.promise;
    assert.equal(theme.palettesLoaded, true);
    assert.equal(theme.palettesNeedLoading, false);
    assert.equal(host.style.properties.get('--fhs-reconnect'), 'reconnected-light');
    assert.equal(theme.colorContext.paletteSources[0].url, reconnectUrl);
    assert.equal(updates.length, 4);
    assert.equal(theme.finishPaintUpdate(), true);

    theme.disconnected();
    assert.equal(theme.colorContext.cacheReady, false);
    assert.equal(theme.connectedToCard, false);
  } finally {
    theme.disconnected();
    globalThis.fetch = originalFetch;
    restoreGlobal('MutationObserver', originalMutationObserver);
    [firstUrl, replacementUrl, reconnectUrl].forEach((url) => Palette.cache.delete(url));
  }
});

test('palette-free live reload schedules paint completion even when the source stays empty', async () => {
  const host = makeElement('flex-horseshoe-card', null);
  const completionResults = [];
  let updateCardCalls = 0;
  let theme;
  theme = new CardTheme(host, () => {}, () => {
    updateCardCalls += 1;
    completionResults.push(theme.finishPaintUpdate());
  });

  theme.connected();
  theme.updateHass({ themes: { theme: 'ha-theme', darkMode: false, themes: {} } });
  assert.equal(theme.finishPaintUpdate(), false);

  await theme.loadPalettes({});
  assert.equal(updateCardCalls, 1);
  assert.deepEqual(completionResults, [true]);
  assert.equal(theme.colorContext.cacheReady, true);
  assert.deepEqual(theme.colorContext.paletteSources, []);

  // A second live replacement still needs a final paint pass with unchanged empty sources.
  await theme.loadPalettes({});
  assert.equal(updateCardCalls, 2);
  assert.deepEqual(completionResults, [true, true]);
  assert.equal(theme.colorContext.cacheReady, true);
  assert.deepEqual(theme.colorContext.paletteSources, []);

  theme.disconnected();
});
