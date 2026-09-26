import assert from 'node:assert/strict';
import test from 'node:test';
import CardTheme from '../src/card-theme.js';
import ChildCards from '../src/child-cards.js';
import Palette from '../src/palettes.js';
import TextTool from '../src/text-tool.js';
import { HomeAssistantIconPath } from '../src/icon-source.js';

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

function responseFor(document) {
  return { ok: true, json: async () => document };
}

function paletteDocument(name) {
  return {
    ref: { base: name + '-base' },
    modes: { light: { color: name + '-light' }, dark: { color: name + '-dark' } },
  };
}

function nextTurn() {
  return new Promise((resolve) => setImmediate(resolve));
}

test('Palette shares concurrent success and keeps a failed request retryable', async () => {
  const originalFetch = globalThis.fetch;
  const urls = [
    'https://tests.invalid/palette-success',
    'https://tests.invalid/palette-network',
    'https://tests.invalid/palette-http',
    'https://tests.invalid/palette-json',
  ];
  try {
    const successRequest = deferred();
    let successFetches = 0;
    globalThis.fetch = () => {
      successFetches += 1;
      return successRequest.promise;
    };
    const firstSuccess = Palette.load(urls[0]);
    const sharedSuccess = Palette.load(urls[0]);
    assert.strictEqual(firstSuccess, sharedSuccess);
    assert.equal(successFetches, 1);
    const successfulDocument = paletteDocument('shared');
    successRequest.resolve(responseFor(successfulDocument));
    assert.strictEqual(await firstSuccess, successfulDocument);

    const failures = [
      {
        url: urls[1],
        message: 'network unavailable',
        fail(request) {
          request.reject(new Error(this.message));
        },
      },
      {
        url: urls[2],
        message: 'Could not load palette: ' + urls[2],
        fail(request) {
          request.resolve({ ok: false, json: async () => assert.fail('HTTP failure must not parse JSON') });
        },
      },
      {
        url: urls[3],
        message: 'invalid JSON',
        fail(request) {
          request.resolve({ ok: true, json: async () => { throw new Error(this.message); } });
        },
      },
    ];

    for (const failure of failures) {
      const requests = [];
      globalThis.fetch = () => {
        const request = deferred();
        requests.push(request);
        return request.promise;
      };

      const first = Palette.load(failure.url);
      const concurrent = Palette.load(failure.url);
      assert.strictEqual(first, concurrent);
      assert.equal(requests.length, 1);
      failure.fail(requests[0]);

      const results = await Promise.allSettled([first, concurrent]);
      assert.deepEqual(results.map((result) => result.status), ['rejected', 'rejected']);
      assert.equal(results[0].reason.message, failure.message);
      assert.equal(results[1].reason.message, failure.message);
      assert.equal(Palette.cache.has(failure.url), false);

      const recoveredDocument = paletteDocument(failure.url);
      const retry = Palette.load(failure.url);
      assert.equal(requests.length, 2);
      requests[1].resolve(responseFor(recoveredDocument));
      assert.strictEqual(await retry, recoveredDocument);
    }
  } finally {
    globalThis.fetch = originalFetch;
    urls.forEach((url) => Palette.cache.delete(url));
  }
});

test('Palette rejection only evicts the cache entry that issued it', async () => {
  const originalFetch = globalThis.fetch;
  const url = 'https://tests.invalid/palette-replaced-request';
  const oldRequest = deferred();
  const newRequest = deferred();
  const requests = [oldRequest, newRequest];
  globalThis.fetch = () => requests.shift().promise;

  try {
    const oldPromise = Palette.load(url);
    Palette.cache.delete(url);
    const currentPromise = Palette.load(url);

    oldRequest.reject(new Error('obsolete request'));
    await assert.rejects(oldPromise, /obsolete request/);
    assert.strictEqual(Palette.cache.get(url), currentPromise);

    const currentDocument = paletteDocument('current');
    newRequest.resolve(responseFor(currentDocument));
    assert.strictEqual(await currentPromise, currentDocument);
  } finally {
    globalThis.fetch = originalFetch;
    Palette.cache.delete(url);
  }
});

test('CardTheme publishes only palette B in either completion order', async () => {
  const originalFetch = globalThis.fetch;

  try {
    for (const completionOrder of [['A', 'B'], ['B', 'A']]) {
      const urls = {
        A: 'https://tests.invalid/theme-' + completionOrder.join('') + '-A',
        B: 'https://tests.invalid/theme-' + completionOrder.join('') + '-B',
      };
      const requests = new Map();
      globalThis.fetch = (url) => {
        const request = deferred();
        requests.set(url, request);
        return request.promise;
      };
      const properties = new Map();
      let updates = 0;
      const theme = new CardTheme(
        { style: { setProperty: (name, value) => properties.set(name, value) } },
        () => {},
        () => { updates += 1; },
      );
      const loadA = theme.loadPalettes({ active: urls.A });
      const loadB = theme.loadPalettes({ active: urls.B });

      for (const name of completionOrder) {
        requests.get(urls[name]).resolve(responseFor(paletteDocument(name)));
        await (name === 'A' ? loadA : loadB);
      }

      assert.equal(theme.palettes.active.ref.base, 'B-base');
      assert.equal(properties.get('--color'), 'B-light');
      assert.equal(properties.get('--base'), 'B-base');
      assert.equal(theme.palettesLoaded, true);
      assert.equal(updates, 1);
      Object.values(urls).forEach((url) => Palette.cache.delete(url));
    }
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('CardTheme removal supersedes a load and reconnect retries interrupted work once', async () => {
  const originalFetch = globalThis.fetch;
  const removedUrl = 'https://tests.invalid/theme-removed';
  const reconnectUrl = 'https://tests.invalid/theme-reconnect';
  const properties = new Map();
  const host = { style: { setProperty: (name, value) => properties.set(name, value) } };
  let updates = 0;
  const theme = new CardTheme(host, () => {}, () => { updates += 1; });
  const removedRequest = deferred();
  const reconnectRequests = [deferred(), deferred()];
  let reconnectFetches = 0;

  try {
    globalThis.fetch = (url) => {
      if (url === removedUrl) return removedRequest.promise;
      reconnectFetches += 1;
      return reconnectRequests[reconnectFetches - 1].promise;
    };

    const removedLoad = theme.loadPalettes({ active: removedUrl });
    await theme.loadPalettes({});
    removedRequest.resolve(responseFor(paletteDocument('removed')));
    await removedLoad;
    assert.deepEqual(theme.palettes, {});
    assert.equal(properties.has('--color'), false);
    assert.equal(updates, 0);

    const interruptedLoad = theme.loadPalettes({ active: reconnectUrl });
    theme.disconnected();
    reconnectRequests[0].reject(new Error('offline while disconnected'));
    await interruptedLoad;
    assert.equal(theme.palettesLoaded, false);
    assert.equal(theme.palettesNeedLoading, true);

    theme.connected();
    assert.equal(reconnectFetches, 2);
    reconnectRequests[1].resolve(responseFor(paletteDocument('reconnected')));
    await nextTurn();
    assert.equal(theme.palettes.active.ref.base, 'reconnected-base');
    assert.equal(properties.get('--color'), 'reconnected-light');
    assert.equal(theme.palettesLoaded, true);
    assert.equal(theme.palettesNeedLoading, false);
    assert.equal(updates, 1);
  } finally {
    globalThis.fetch = originalFetch;
    Palette.cache.delete(removedUrl);
    Palette.cache.delete(reconnectUrl);
  }
});

test('ChildCards publishes only B when pending A and B creations resolve in either order', async () => {
  const originalWindow = globalThis.window;

  try {
    for (const completionOrder of [['A', 'B'], ['B', 'A']]) {
      const cardA = { localName: 'card-a', children: [], updateComplete: Promise.resolve() };
      const cardB = { localName: 'card-b', children: [], updateComplete: Promise.resolve() };
      const cards = new Map([['card-a', cardA], ['card-b', cardB]]);
      const creations = new Map();
      let updates = 0;
      const parent = {
        _hass: { states: {} },
        updateComplete: Promise.resolve(),
        requestUpdate() { updates += 1; },
      };
      globalThis.window = {
        loadCardHelpers: async () => ({
          createCardElement(config) {
            const creation = deferred();
            creations.set(config.type, creation);
            return creation.promise;
          },
        }),
      };

      const children = new ChildCards(parent);
      const createA = children.setConfig([{ type: 'card-a', frameless: false }]);
      await nextTurn();
      assert.equal(creations.size, 1);
      const createB = children.setConfig([{ type: 'card-b', frameless: false }]);
      await nextTurn();
      assert.equal(creations.size, 2);

      const completions = { A: createA, B: createB };
      const cardsByName = { A: cardA, B: cardB };
      for (const name of completionOrder) {
        creations.get(cardsByName[name].localName).resolve(cardsByName[name]);
        await completions[name];
      }

      assert.equal(children.items.length, 1);
      assert.strictEqual(children.items[0].card, cardB);
      assert.equal(cardA.hass, undefined);
      assert.equal(cardB.hass, parent._hass);
      assert.equal(updates, 1);
    }
  } finally {
    restoreGlobal('window', originalWindow);
  }
});

test('ChildCards keeps the latest creation and ignores a cancelled frameless frame', async () => {
  const originalWindow = globalThis.window;
  const originalRequestAnimationFrame = globalThis.requestAnimationFrame;
  const originalCancelAnimationFrame = globalThis.cancelAnimationFrame;
  const frames = new Map();
  const cancelled = [];
  let nextFrame = 1;
  globalThis.requestAnimationFrame = (callback) => {
    const frame = nextFrame++;
    frames.set(frame, callback);
    return frame;
  };
  globalThis.cancelAnimationFrame = (frame) => cancelled.push(frame);

  try {
    const firstHaCard = { style: { background: 'red', border: '1px solid', boxShadow: 'shadow', padding: '4px' } };
    const firstCard = {
      localName: 'test-child',
      shadowRoot: { querySelector: () => firstHaCard },
      children: [],
      updateComplete: Promise.resolve(),
    };
    const currentCard = { localName: 'current-child', children: [], updateComplete: Promise.resolve() };
    const cardsByType = new Map([['first-child', firstCard], ['current-child', currentCard]]);
    let parentUpdates = 0;
    const parent = {
      _hass: { states: {} },
      updateComplete: Promise.resolve(),
      requestUpdate() { parentUpdates += 1; },
    };
    globalThis.window = {
      loadCardHelpers: async () => ({
        createCardElement: async (config) => cardsByType.get(config.type),
      }),
    };

    const children = new ChildCards(parent);
    const firstCreation = children.setConfig([{ type: 'first-child', frameless: true, xpos: 20, ypos: 30, width: 10, height: 10 }]);
    await nextTurn();
    assert.equal(frames.size, 1);
    const obsoleteFrame = frames.keys().next().value;

    await children.setConfig([{ type: 'current-child', frameless: false, xpos: 40, ypos: 50, width: 20, height: 20 }]);
    await firstCreation;
    assert.deepEqual(cancelled, [obsoleteFrame]);
    assert.strictEqual(children.items[0].card, currentCard);
    assert.equal(currentCard.hass, parent._hass);

    frames.get(obsoleteFrame)(0);
    await nextTurn();
    assert.equal(firstHaCard.style.background, 'red');
    assert.equal(firstHaCard.style.border, '1px solid');
    assert.equal(firstHaCard.style.boxShadow, 'shadow');
    assert.equal(firstHaCard.style.padding, '4px');
    assert.equal(parentUpdates, 2);
  } finally {
    restoreGlobal('window', originalWindow);
    restoreGlobal('requestAnimationFrame', originalRequestAnimationFrame);
    restoreGlobal('cancelAnimationFrame', originalCancelAnimationFrame);
  }
});

test('ChildCards resumes the accepted config after disconnect without publishing the old helper result', async () => {
  const originalWindow = globalThis.window;
  const helperRequests = [];
  let parentUpdates = 0;
  const parent = {
    _hass: { states: {} },
    updateComplete: Promise.resolve(),
    requestUpdate() { parentUpdates += 1; },
  };
  globalThis.window = {
    loadCardHelpers: () => {
      const request = deferred();
      helperRequests.push(request);
      return request.promise;
    },
  };

  try {
    const children = new ChildCards(parent);
    const oldCreation = children.setConfig([{ type: 'old-child', frameless: false }]);
    children.disconnected();
    children.connected();
    assert.equal(helperRequests.length, 2);

    const oldCard = { localName: 'old-child', children: [], updateComplete: Promise.resolve() };
    const currentCard = { localName: 'current-child', children: [], updateComplete: Promise.resolve() };
    helperRequests[0].resolve({ createCardElement: async () => oldCard });
    helperRequests[1].resolve({ createCardElement: async () => currentCard });
    await oldCreation;
    await nextTurn();

    assert.strictEqual(children.items[0].card, currentCard);
    assert.equal(children.items[0].card.hass, parent._hass);
    assert.equal(children.childrenNeedCreating, false);
    assert.equal(parentUpdates, 1);
  } finally {
    restoreGlobal('window', originalWindow);
  }
});

test('Home Assistant icon polling cancels obsolete work and retries on reconnect', async () => {
  const originalWindow = globalThis.window;
  const timers = new Map();
  const clearedTimers = new Set();
  let nextTimer = 1;
  let updateComplete = deferred();
  let loaded = 0;
  const iconSource = { path: undefined, shadowRoot: { querySelector: () => undefined } };
  const iconElement = { shadowRoot: { querySelector: () => iconSource } };
  const card = {
    iconCache: {},
    iconBoundsCache: {},
    get updateComplete() { return updateComplete.promise; },
    shadowRoot: { getElementById: () => iconElement },
  };
  globalThis.window = {
    setTimeout(callback) {
      const timer = nextTimer++;
      timers.set(timer, callback);
      return timer;
    },
    clearTimeout(timer) {
      clearedTimers.add(timer);
    },
    requestAnimationFrame: () => 1,
    cancelAnimationFrame() {},
  };

  try {
    const source = new HomeAssistantIconPath(card, 'poll', () => { loaded += 1; });
    assert.equal(source.getPath('mdi:poll-test'), undefined);
    updateComplete.resolve();
    await nextTurn();
    const initialTimer = [...timers.keys()].at(-1);
    timers.get(initialTimer)();
    const retryTimer = [...timers.keys()].at(-1);
    assert.notEqual(retryTimer, initialTimer);

    source.disconnected();
    assert.equal(clearedTimers.has(retryTimer), true);
    iconSource.path = 'M0 0h24v24z';
    timers.get(retryTimer)();
    assert.equal(card.iconCache['mdi:poll-test'], undefined);

    source.connected();
    updateComplete = { promise: Promise.resolve() };
    assert.equal(source.getPath('mdi:poll-test'), undefined);
    await nextTurn();
    const reconnectTimer = [...timers.keys()].at(-1);
    timers.get(reconnectTimer)();

    assert.equal(card.iconCache['mdi:poll-test'], 'M0 0h24v24z');
    assert.equal(source.path, 'M0 0h24v24z');
    assert.equal(loaded, 1);
  } finally {
    restoreGlobal('window', originalWindow);
  }
});

test('TextTool discards measurements after element replacement or disconnect and measures again on reconnect', async () => {
  const originalWindow = globalThis.window;
  const originalDocument = globalThis.document;
  const frames = new Map();
  let nextFrame = 1;
  let updates = 0;
  let fontsReady = deferred();
  globalThis.window = {
    requestAnimationFrame(callback) {
      const frame = nextFrame++;
      frames.set(frame, callback);
      return frame;
    },
    cancelAnimationFrame() {},
  };
  globalThis.document = { fonts: { get ready() { return fontsReady.promise; } } };

  try {
    const card = {
      cardLayout: { calculateSvgCoordinatesInGroup: () => ({ xpos: 100, ypos: 100 }) },
      cardTheme: { modeChanged: false, getActiveColorStopMode: () => 'light' },
      cardAnimations: { styles: { texts: {} } },
      requestUpdate() { updates += 1; },
    };
    const templates = { hasJavascriptTemplates: () => false };
    const tool = new TextTool(
      {
        id: 'async-text',
        xpos: 50,
        ypos: 50,
        width: 80,
        height: 20,
        text: 'overflow text',
        text_overflow: { mode: 'ellipsis', ellipsis: { max_width: 100 } },
      },
      0,
      templates,
      'test-card',
      card,
    );

    const oldPart = { value: 'obsolete' };
    tool.textElement = { id: 'old-text' };
    tool.widthMeasurementParts = [oldPart];
    tool.widthMeasurementElements = [{ getComputedTextLength: () => 5 }];
    tool.widthEllipsisElements = [{ getComputedTextLength: () => 2 }];
    tool.widthOverflowPending = true;
    tool.updated();
    const oldMeasurement = tool.widthMeasurement;

    const currentPart = { value: 'current' };
    tool.textElement = { id: 'current-text' };
    tool.widthMeasurementParts = [currentPart];
    tool.widthMeasurementElements = [{ getComputedTextLength: () => 10 }];
    tool.widthEllipsisElements = [{ getComputedTextLength: () => 3 }];
    tool.updated();
    assert.notStrictEqual(tool.widthMeasurement, oldMeasurement);

    fontsReady.resolve();
    await nextTurn();
    assert.equal(frames.size, 1);

    const advanceFrame = async () => {
      const [frame, callback] = frames.entries().next().value;
      frames.delete(frame);
      callback(0);
      await nextTurn();
    };
    await advanceFrame();
    await advanceFrame();
    assert.equal(tool.widthOverflowParts[0].value, 'current');
    assert.equal(tool.widthOverflowPending, false);
    assert.equal(updates, 1);

    fontsReady = deferred();
    const disconnectedPart = { value: 'disconnected' };
    tool.widthMeasurementParts = [disconnectedPart];
    tool.widthMeasurementElements = [{ getComputedTextLength: () => 12 }];
    tool.widthEllipsisElements = [{ getComputedTextLength: () => 3 }];
    tool.widthOverflowPending = true;
    tool.updated();
    tool.disconnected();
    fontsReady.resolve();
    await nextTurn();
    assert.equal(frames.size, 0);
    assert.equal(updates, 1);

    tool.connected();
    fontsReady = { promise: Promise.resolve() };
    const reconnectedPart = { value: 'reconnected' };
    tool.widthMeasurementParts = [reconnectedPart];
    tool.widthMeasurementElements = [{ getComputedTextLength: () => 14 }];
    tool.widthEllipsisElements = [{ getComputedTextLength: () => 4 }];
    tool.widthOverflowPending = true;
    tool.updated();
    await nextTurn();
    assert.equal(frames.size, 1);
    await advanceFrame();
    await advanceFrame();
    assert.equal(tool.widthOverflowParts[0].value, 'reconnected');
    assert.equal(updates, 2);
  } finally {
    restoreGlobal('window', originalWindow);
    restoreGlobal('document', originalDocument);
  }
});
