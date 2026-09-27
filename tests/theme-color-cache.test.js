import test from 'node:test';
import assert from 'node:assert/strict';
import CardTheme from '../src/card-theme.js';
import Colors from '../src/colors.js';

let themeSequence = 0;

function nextThemeName(label) {
  themeSequence += 1;
  return `theme-color-cache-${label}-${themeSequence}`;
}

function primaryColorExpression(themeName) {
  return `var(--primary-color-${themeName})`;
}

function makeHost(variables) {
  return { variables };
}

function makeColorContext(element, globalThemeName, viewThemeName, mode, themeSource, paletteSources, cacheReady) {
  return {
    element,
    globalThemeName,
    viewThemeName,
    mode,
    themeSource,
    paletteSources,
    cacheKey: JSON.stringify([globalThemeName, viewThemeName, paletteSources.map((source) => source.url)]),
    cacheReady,
  };
}

function withComputedStyleBoundary(run) {
  const previousGetComputedStyle = globalThis.getComputedStyle;
  const hadGetComputedStyle = Object.hasOwn(globalThis, 'getComputedStyle');
  const previousWindow = globalThis.window;
  const hadWindow = Object.hasOwn(globalThis, 'window');
  const previousLovelace = Colors.lovelace;
  const previousUnresolvedColor = Colors.unresolvedColor;
  const reads = new Map();

  Colors.lovelace = null;
  Colors.unresolvedColor = false;
  globalThis.getComputedStyle = (element) => {
    reads.set(element, (reads.get(element) ?? 0) + 1);
    return {
      getPropertyValue: (name) =>
        element?.variables?.[name] ??
        element?.variables?.['--primary-color'] ??
        element?.variables?.['--fhs-primary-color'] ??
        '',
    };
  };
  globalThis.window = { document: { querySelector: () => null } };

  try {
    return run({ readsFor: (element) => reads.get(element) ?? 0 });
  } finally {
    if (hadGetComputedStyle) globalThis.getComputedStyle = previousGetComputedStyle;
    else delete globalThis.getComputedStyle;

    if (hadWindow) globalThis.window = previousWindow;
    else delete globalThis.window;

    Colors.lovelace = previousLovelace;
    Colors.unresolvedColor = previousUnresolvedColor;
  }
}

test('cards with the same theme context share CSS variable conversion', () => {
  withComputedStyleBoundary(({ readsFor }) => {
    const themeName = nextThemeName('shared');
    const expression = primaryColorExpression(themeName);
    const themes = { theme: themeName, darkMode: false };
    const hostA = makeHost({ '--primary-color': '#e53935' });
    const hostB = makeHost({ '--primary-color': '#e53935' });
    const contextA = makeColorContext(hostA, themeName, null, 'light', themes, [], true);
    const contextB = makeColorContext(hostB, themeName, null, 'light', themes, [], true);

    assert.deepEqual(Colors.colorToRGBA(expression, contextA), [229, 57, 53, 255]);
    assert.deepEqual(Colors.colorToRGBA(expression, contextB), [229, 57, 53, 255]);
    assert.equal(readsFor(hostA) + readsFor(hostB), 1);
  });
});

test('global and view theme names keep inherited CSS scopes separate', () => {
  withComputedStyleBoundary(({ readsFor }) => {
    const globalThemeName = nextThemeName('global');
    const otherGlobalThemeName = nextThemeName('other-global');
    const expression = primaryColorExpression(globalThemeName);
    const themes = { theme: globalThemeName, darkMode: false };
    const otherThemes = { theme: otherGlobalThemeName, darkMode: false };
    const globalHost = makeHost({ '--primary-color': '#e53935' });
    const viewHost = makeHost({ '--primary-color': '#1e88e5' });
    const otherGlobalHost = makeHost({ '--primary-color': '#43a047' });
    const globalContext = makeColorContext(globalHost, globalThemeName, null, 'light', themes, [], true);
    const viewContext = makeColorContext(viewHost, globalThemeName, 'office', 'light', themes, [], true);
    const otherGlobalContext = makeColorContext(otherGlobalHost, otherGlobalThemeName, null, 'light', otherThemes, [], true);

    assert.deepEqual(Colors.colorToRGBA(expression, globalContext), [229, 57, 53, 255]);
    assert.deepEqual(Colors.colorToRGBA(expression, viewContext), [30, 136, 229, 255]);
    assert.deepEqual(Colors.colorToRGBA(expression, otherGlobalContext), [67, 160, 71, 255]);
    assert.equal(readsFor(globalHost), 1);
    assert.equal(readsFor(viewHost), 1);
    assert.equal(readsFor(otherGlobalHost), 1);
  });
});

test('cards with the same palette URL and document share palette color conversion', () => {
  withComputedStyleBoundary(({ readsFor }) => {
    const themeName = nextThemeName('palette-shared');
    const expression = primaryColorExpression(themeName);
    const themes = { theme: themeName, darkMode: false };
    const palette = { ref: { 'primary-color': '#8e24aa' } };
    const paletteSourcesA = [{ url: '/local/palette.json', palette }];
    const paletteSourcesB = [{ url: '/local/palette.json', palette }];
    const hostA = makeHost({ '--primary-color': '#8e24aa' });
    const hostB = makeHost({ '--primary-color': '#8e24aa' });
    const contextA = makeColorContext(hostA, themeName, null, 'light', themes, paletteSourcesA, true);
    const contextB = makeColorContext(hostB, themeName, null, 'light', themes, paletteSourcesB, true);

    assert.deepEqual(Colors.colorToRGBA(expression, contextA), [142, 36, 170, 255]);
    assert.deepEqual(Colors.colorToRGBA(expression, contextB), [142, 36, 170, 255]);
    assert.equal(readsFor(hostA) + readsFor(hostB), 1);

    const replacementPalette = { ref: { 'primary-color': '#43a047' } };
    const hostWithReplacement = makeHost({ '--primary-color': '#43a047' });
    const replacementContext = makeColorContext(
      hostWithReplacement,
      themeName,
      null,
      'light',
      themes,
      [{ url: '/local/palette.json', palette: replacementPalette }],
      true,
    );

    assert.deepEqual(Colors.colorToRGBA(expression, replacementContext), [67, 160, 71, 255]);
    assert.equal(readsFor(hostWithReplacement), 1);
  });
});

test('a palette value does not replace the CSS fallback for a card without that palette', () => {
  withComputedStyleBoundary(() => {
    const themeName = nextThemeName('palette-fallback');
    const expression = primaryColorExpression(themeName);
    const themes = { theme: themeName, darkMode: false };
    const plainHost = makeHost({});
    const paletteHost = makeHost({ '--fhs-primary-color': '#1e88e5' });
    const palette = { ref: { 'fhs-primary-color': '#1e88e5' } };
    const plainContext = makeColorContext(plainHost, themeName, null, 'light', themes, [], true);
    const paletteContext = makeColorContext(
      paletteHost,
      themeName,
      null,
      'light',
      themes,
      [{ url: '/local/blue-palette.json', palette }],
      true,
    );

    assert.deepEqual(
      Colors.colorToRGBA(expression.replace(')', ', #e53935)'), plainContext),
      [229, 57, 53, 255],
    );
    assert.deepEqual(
      Colors.colorToRGBA(expression.replace(')', ', #e53935)'), paletteContext),
      [30, 136, 229, 255],
    );
  });
});

test('light-dark-light transitions invalidate one shared mode cache per transition', () => {
  withComputedStyleBoundary(({ readsFor }) => {
    const themeName = nextThemeName('mode-cycle');
    const expression = primaryColorExpression(themeName);
    const hostA = makeHost({ '--primary-color': '#e53935' });
    const hostB = makeHost({ '--primary-color': '#e53935' });
    const themes = { theme: themeName, darkMode: false };
    const lightA = makeColorContext(hostA, themeName, null, 'light', themes, [], true);
    const lightB = makeColorContext(hostB, themeName, null, 'light', themes, [], true);

    assert.deepEqual(Colors.colorToRGBA(expression, lightA), [229, 57, 53, 255]);
    assert.deepEqual(Colors.colorToRGBA(expression, lightB), [229, 57, 53, 255]);
    assert.equal(readsFor(hostA) + readsFor(hostB), 1);

    hostA.variables['--primary-color'] = '#1e88e5';
    hostB.variables['--primary-color'] = '#1e88e5';
    const darkA = makeColorContext(hostA, themeName, null, 'dark', themes, [], true);
    const darkB = makeColorContext(hostB, themeName, null, 'dark', themes, [], true);

    assert.deepEqual(Colors.colorToRGBA(expression, darkA), [30, 136, 229, 255]);
    assert.deepEqual(Colors.colorToRGBA(expression, darkB), [30, 136, 229, 255]);
    assert.equal(readsFor(hostA) + readsFor(hostB), 2);

    hostA.variables['--primary-color'] = '#e53935';
    hostB.variables['--primary-color'] = '#e53935';
    const lightAgainA = makeColorContext(hostA, themeName, null, 'light', themes, [], true);
    const lightAgainB = makeColorContext(hostB, themeName, null, 'light', themes, [], true);

    assert.deepEqual(Colors.colorToRGBA(expression, lightAgainA), [229, 57, 53, 255]);
    assert.deepEqual(Colors.colorToRGBA(expression, lightAgainB), [229, 57, 53, 255]);
    assert.equal(readsFor(hostA) + readsFor(hostB), 3);
  });
});

test('a changed HA theme source refreshes colors even when its name stays the same', () => {
  withComputedStyleBoundary(({ readsFor }) => {
    const themeName = nextThemeName('theme-source');
    const expression = primaryColorExpression(themeName);
    const host = makeHost({ '--primary-color': '#e53935' });
    const firstThemes = { theme: themeName, darkMode: false };
    const firstContext = makeColorContext(host, themeName, null, 'light', firstThemes, [], true);

    assert.deepEqual(Colors.colorToRGBA(expression, firstContext), [229, 57, 53, 255]);

    host.variables['--primary-color'] = '#1e88e5';
    const updatedThemes = { theme: themeName, darkMode: false };
    const updatedContext = makeColorContext(host, themeName, null, 'light', updatedThemes, [], true);

    assert.deepEqual(Colors.colorToRGBA(expression, updatedContext), [30, 136, 229, 255]);
    assert.equal(readsFor(host), 2);
  });
});

test('delayed conversion from an older theme source leaves the current shared colors intact', () => {
  withComputedStyleBoundary(({ readsFor }) => {
    const themeName = nextThemeName('delayed-source');
    const expression = primaryColorExpression(themeName);
    const oldHost = makeHost({ '--primary-color': '#e53935' });
    const currentHost = makeHost({ '--primary-color': '#1e88e5' });
    const oldThemes = { theme: themeName, darkMode: false };
    const currentThemes = { theme: themeName, darkMode: false };
    const oldContext = makeColorContext(oldHost, themeName, null, 'light', oldThemes, [], true);
    const currentContext = makeColorContext(currentHost, themeName, null, 'light', currentThemes, [], true);

    // HA receipt establishes source order before delayed paint starts converting.
    Colors.getThemeRevision(oldThemes);
    Colors.getThemeRevision(currentThemes);
    assert.deepEqual(Colors.colorToRGBA(expression, currentContext), [30, 136, 229, 255]);
    assert.deepEqual(Colors.colorToRGBA(expression, oldContext), [229, 57, 53, 255]);
    assert.deepEqual(Colors.colorToRGBA(expression, currentContext), [30, 136, 229, 255]);
    assert.equal(readsFor(oldHost), 1);
    assert.equal(readsFor(currentHost), 1);
  });
});

test('pending and unresolved colors do not poison later conversions', () => {
  withComputedStyleBoundary(({ readsFor }) => {
    const themeName = nextThemeName('pending');
    const expression = primaryColorExpression(themeName);
    const themes = { theme: themeName, darkMode: false };
    const pendingHost = makeHost({ '--primary-color': '#e53935' });
    const readyHost = makeHost({ '--primary-color': '#1e88e5' });
    const pendingContext = makeColorContext(pendingHost, themeName, null, 'light', themes, [], false);
    const readyContext = makeColorContext(readyHost, themeName, null, 'light', themes, [], true);

    assert.deepEqual(Colors.colorToRGBA(expression, pendingContext), [229, 57, 53, 255]);
    assert.deepEqual(Colors.colorToRGBA(expression, readyContext), [30, 136, 229, 255]);
    assert.equal(readsFor(pendingHost), 1);
    assert.equal(readsFor(readyHost), 1);

    const unresolvedName = nextThemeName('unresolved');
    const unresolvedExpression = primaryColorExpression(unresolvedName);
    const unresolvedThemes = { theme: unresolvedName, darkMode: false };
    const unresolvedHost = makeHost({});
    const unresolvedContext = makeColorContext(
      unresolvedHost,
      unresolvedName,
      null,
      'light',
      unresolvedThemes,
      [],
      true,
    );

    assert.equal(Colors.colorToRGBA(unresolvedExpression, unresolvedContext), undefined);
    unresolvedHost.variables['--primary-color'] = '#43a047';
    assert.deepEqual(Colors.colorToRGBA(unresolvedExpression, unresolvedContext), [67, 160, 71, 255]);
    assert.equal(readsFor(unresolvedHost), 2);
  });
});

test('CardTheme uses the active HA theme when picker settings are recreated', () => {
  const activeThemeName = nextThemeName('active');
  const themes = { theme: activeThemeName, darkMode: false };
  let redraws = 0;
  const cardTheme = new CardTheme(
    { style: { setProperty: () => {} } },
    () => {
      redraws += 1;
    },
    () => {},
  );

  assert.equal(cardTheme.updateHass({ selectedTheme: { theme: 'picker-theme' }, themes }), true);
  assert.equal(cardTheme.colorContext.globalThemeName, activeThemeName);
  assert.equal(cardTheme.colorContext.themeSource, themes);
  assert.equal(cardTheme.updateHass({ selectedTheme: { theme: 'new-picker-object' }, themes }), false);
  assert.equal(cardTheme.colorContext.globalThemeName, activeThemeName);
  assert.equal(redraws, 1);
});
