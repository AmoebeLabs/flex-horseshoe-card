import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { expect, test } from '@playwright/test';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { rollup } from 'rollup';
import ts from 'typescript';

const litImports = {
  lit: '/node_modules/lit/index.js',
  'lit/': '/node_modules/lit/',
  'lit-html': '/node_modules/lit-html/lit-html.js',
  'lit-html/': '/node_modules/lit-html/',
  'lit-element/': '/node_modules/lit-element/',
  '@lit/reactive-element': '/node_modules/@lit/reactive-element/reactive-element.js',
  '@lit/reactive-element/': '/node_modules/@lit/reactive-element/',
};

function fixturePage(script, imports = litImports) {
  return `<!doctype html>
    <div id="fixture"></div>
    <script type="importmap">${JSON.stringify({ imports })}</script>
    <script type="module">${script}</script>`;
}

async function serveFixture(page, fixturePath, body, assetHandler = async () => false) {
  await page.route('http://fhs.test/**', async (route) => {
    const pathname = new URL(route.request().url()).pathname;
    if (pathname === fixturePath) {
      await route.fulfill({ contentType: 'text/html', body });
      return;
    }
    if (await assetHandler(route, pathname)) return;

    const source = await readFile(resolve(process.cwd(), `.${pathname}`), 'utf8');
    await route.fulfill({ contentType: 'text/javascript', body: source });
  });
  await page.goto(`http://fhs.test${fixturePath}`);
}

async function bundleSourceEntry(entry) {
  const bundle = await rollup({
    input: resolve(process.cwd(), entry),
    external: (id) => id === 'lit' || id.startsWith('lit/'),
    plugins: [
      nodeResolve({ browser: true, extensions: ['.mjs', '.js', '.json', '.ts'] }),
      commonjs(),
      {
        name: 'browser-test-typescript',
        transform(source, id) {
          if (!id.endsWith('.ts')) return null;
          return ts.transpileModule(source, {
            compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
          }).outputText;
        },
      },
    ],
  });
  try {
    const generated = await bundle.generate({ format: 'es' });
    return generated.output.find((output) => output.type === 'chunk').code;
  } finally {
    await bundle.close();
  }
}

function deferred() {
  let resolvePromise;
  const promise = new Promise((resolve) => { resolvePromise = resolve; });
  return { promise, resolve: resolvePromise };
}

test('external SVG publication stays with the current connected placeholder', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  const oldStarted = deferred();
  const oldRelease = deferred();
  const oldFinished = deferred();
  const reconnectRequestStarted = deferred();
  const reconnectOldRelease = deferred();
  const reconnectOldFinished = deferred();
  const reconnectCurrentFinished = deferred();
  let disconnectRequestCount = 0;

  const script = `
    import ExternalSvgSources from '/browser/icon-svg-source.bundle.js';
    const ns = 'http://www.w3.org/2000/svg';
    class SvgOwnerHost extends HTMLElement {
      constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.svgUrlCache = {};
        this.source = '/old.svg';
        this.externalSvgSources = new ExternalSvgSources(this);
      }
      requestUpdate() {}
      renderPlaceholder() {
        const placeholder = document.createElementNS(ns, 'svg');
        placeholder.classList.add('icon-svg-url');
        placeholder.dataset.src = this.source;
        placeholder.setAttribute('viewBox', '0 0 10 10');
        this.shadowRoot.replaceChildren(placeholder);
      }
      connectedCallback() {
        this.externalSvgSources.connected();
        this.renderPlaceholder();
        this.externalSvgSources.inject();
      }
      disconnectedCallback() { this.externalSvgSources.disconnected(); }
      setSource(source) {
        this.externalSvgSources.setConfig();
        this.source = source;
        this.renderPlaceholder();
        this.externalSvgSources.inject();
      }
    }
    customElements.define('svg-owner-host', SvgOwnerHost);
    const host = document.createElement('svg-owner-host');
    document.querySelector('#fixture').append(host);
    window.svgOwnerHost = host;
  `;
  const assetHandler = async (route, pathname) => {
    if (pathname === '/old.svg') {
      oldStarted.resolve();
      await oldRelease.promise;
      await route.fulfill({ contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><path id="old-result" d="M0 0h1v1z"/></svg>' });
      oldFinished.resolve();
      return true;
    }
    if (pathname === '/disconnect.svg') {
      disconnectRequestCount += 1;
      if (disconnectRequestCount === 1) {
        reconnectRequestStarted.resolve();
        await reconnectOldRelease.promise;
        await route.fulfill({ contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><path id="late-disconnect-result" d="M0 0h1v1z"/></svg>' });
        reconnectOldFinished.resolve();
      } else {
        await route.fulfill({ contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><path id="reconnected-result" d="M0 0h1v1z"/></svg>' });
        reconnectCurrentFinished.resolve();
      }
      return true;
    }
    if (pathname === '/current.svg') {
      await route.fulfill({ contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10" width="10" height="10"><path id="current-result" d="M1 1h8v8z"/></svg>' });
      return true;
    }
    return false;
  };

  const iconSvgBundle = await bundleSourceEntry('src/icon-svg-source.js');
  const pageAssetHandler = async (route, pathname) => {
    if (pathname === '/browser/icon-svg-source.bundle.js') {
      await route.fulfill({ contentType: 'text/javascript', body: iconSvgBundle });
      return true;
    }
    return assetHandler(route, pathname);
  };
  await serveFixture(page, '/svg-owner-fixture', fixturePage(script), pageAssetHandler);
  await oldStarted.promise;
  const staging = await page.evaluate(() => {
    const host = window.svgOwnerHost;
    const target = host.shadowRoot.querySelector('svg.icon-svg-url');
    const request = host.externalSvgSources.requests.get(target);
    return {
      targetConnected: target.isConnected,
      targetInShadowRoot: host.shadowRoot.contains(target),
      stagingConnected: request.staging.isConnected,
      stagedPlaceholderConnected: request.staging.firstElementChild.isConnected,
      stagedSource: request.staging.firstElementChild.dataset.src,
    };
  });
  expect(staging).toEqual({
    targetConnected: true,
    targetInShadowRoot: true,
    stagingConnected: false,
    stagedPlaceholderConnected: false,
    stagedSource: '/old.svg',
  });

  await page.evaluate(() => window.svgOwnerHost.setSource('/current.svg'));
  await page.waitForFunction(() => window.svgOwnerHost.svgUrlCache['/current.svg'] !== undefined);
  const beforeOldCompletion = await page.evaluate(() => {
    const host = window.svgOwnerHost;
    const svg = host.shadowRoot.querySelector('svg.injected-svg');
    const cached = host.svgUrlCache['/current.svg'];
    return {
      svg: svg?.outerHTML,
      cacheHasPath: Boolean(cached.querySelector('#current-result')),
      cachedWidth: cached.getAttribute('width'),
      cachedHeight: cached.getAttribute('height'),
    };
  });
  expect(beforeOldCompletion.svg).toContain('current-result');
  expect(beforeOldCompletion.cacheHasPath).toBe(true);
  expect(beforeOldCompletion.cachedWidth).toBeNull();
  expect(beforeOldCompletion.cachedHeight).toBeNull();

  oldRelease.resolve();
  await oldFinished.promise;
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  const afterOldCompletion = await page.evaluate(() => ({
    cacheHasOld: window.svgOwnerHost.svgUrlCache['/old.svg'] !== undefined,
    currentPathStillPresent: Boolean(window.svgOwnerHost.shadowRoot.querySelector('#current-result')),
    currentSource: window.svgOwnerHost.shadowRoot.querySelector('svg.injected-svg path')?.id,
  }));
  expect(afterOldCompletion).toEqual({
    cacheHasOld: false,
    currentPathStillPresent: true,
    currentSource: 'current-result',
  });

  await page.evaluate(() => window.svgOwnerHost.setSource('/disconnect.svg'));
  await reconnectRequestStarted.promise;
  await page.evaluate(() => {
    window.svgOwnerHost.remove();
    window.detachedSvgTarget = window.svgOwnerHost.shadowRoot.querySelector('svg.icon-svg-url');
  });
  expect(await page.evaluate(() => window.svgOwnerHost.externalSvgSources.closed)).toBe(true);
  await page.evaluate(() => document.querySelector('#fixture').append(window.svgOwnerHost));
  await reconnectCurrentFinished.promise;
  await page.waitForFunction(() => window.svgOwnerHost.svgUrlCache['/disconnect.svg']?.querySelector('#reconnected-result'));
  const currentAfterReconnect = await page.evaluate(() => ({
    path: window.svgOwnerHost.shadowRoot.querySelector('#reconnected-result')?.id,
    stalePath: window.svgOwnerHost.shadowRoot.querySelector('#late-disconnect-result') !== null,
    detachedTargetParent: window.detachedSvgTarget.parentNode,
    closed: window.svgOwnerHost.externalSvgSources.closed,
  }));
  expect(currentAfterReconnect).toEqual({
    path: 'reconnected-result', stalePath: false, detachedTargetParent: null, closed: false,
  });
  reconnectOldRelease.resolve();
  await reconnectOldFinished.promise;
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  const afterReconnectOldCompletion = await page.evaluate(() => {
    const host = window.svgOwnerHost;
    return {
      cachedPath: host.svgUrlCache['/disconnect.svg'].querySelector('path')?.id,
      currentPath: host.shadowRoot.querySelector('svg.injected-svg path')?.id,
      stalePath: host.shadowRoot.querySelector('#late-disconnect-result') !== null,
      detachedTargetParent: window.detachedSvgTarget.parentNode,
    };
  });
  expect(afterReconnectOldCompletion).toEqual({
    cachedPath: 'reconnected-result',
    currentPath: 'reconnected-result',
    stalePath: false,
    detachedTargetParent: null,
  });
  expect(pageErrors).toEqual([]);
});

test('TextTool drops stale font measurements and resumes current SVG text on reconnect', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  const script = `
    import { LitElement, svg } from 'lit';
    import TextTool from '/browser/text-tool.bundle.js';
    let nextFrame = 1;
    const pendingFrames = new Map();
    const allFrames = new Map();
    const cancelledFrames = [];
    window.requestAnimationFrame = (callback) => {
      const id = nextFrame++;
      pendingFrames.set(id, callback);
      allFrames.set(id, callback);
      return id;
    };
    window.cancelAnimationFrame = (id) => {
      cancelledFrames.push(id);
      pendingFrames.delete(id);
    };
    window.textRaf = { pendingFrames, allFrames, cancelledFrames };
    window.textValue = 'OBSOLETE phrase';
    const templates = {
      hasJavascriptTemplates(value) { return JSON.stringify(value).includes('[[[ current_text ]]]'); },
      getJsTemplateOrValue(value) { return { ...value, value: window.textValue }; },
    };
    class TextMeasureHost extends LitElement {
      constructor() {
        super();
        this.card = {
          config: {}, entities: [], resolvedEntityConfigs: [], evaluateJavascriptTemplates: true,
          cardTheme: { modeChanged: false, getActiveColorStopMode: () => 'light' },
          cardAnimations: { styles: { texts: {} } },
          actions: { getActionHandlerOptions: () => ({ hasTap: false, hasHold: false, hasDoubleClick: false }), handleAction() {} },
          cardEntities: {},
          cardLayout: {
            changedGroupIds: new Set(),
            calculateSvgCoordinatesInGroup: (config) => ({ xpos: config.xpos, ypos: config.ypos }),
            getGroupScaleTransform: () => '', getGroupScaleStyle: () => '',
            groupManager: { isItemVisible: () => true, getGroupChainForItem: () => [] },
            masksClips: { applyGradientRefs: (styles) => styles },
          },
          requestUpdate: () => this.requestUpdate(),
        };
        this.tool = new TextTool({
          id: 'async-text', xpos: 50, ypos: 50, text: '[[[ current_text ]]]',
          text_overflow: { mode: 'ellipsis', ellipsis: { max_width: 100 } },
          styles: { 'font-size': '12px', 'font-family': 'Arial' },
        }, 0, templates, 'text-fixture', this.card);
        this.tool.updateRuntimeConfig();
        this.tool.setStaticState();
      }
      connectedCallback() {
        super.connectedCallback();
        this.tool.connected();
        this.requestUpdate();
      }
      disconnectedCallback() {
        this.tool.disconnected();
        super.disconnectedCallback();
      }
      render() { return svg\`<svg viewBox="0 0 100 100" width="400" height="400">\${this.tool.render()}</svg>\`; }
      updated() { this.tool.updated(); }
      async changeText(value) {
        window.textValue = value;
        this.tool.activeTextPartsSignature = undefined;
        this.tool.updateRuntimeConfig();
        this.tool.setStaticState();
        this.requestUpdate();
        await this.updateComplete;
      }
    }
    customElements.define('text-measure-host', TextMeasureHost);
    const host = document.createElement('text-measure-host');
    document.querySelector('#fixture').append(host);
    window.textMeasureHost = host;
    window.flushFrame = (id, cancelled = false) => {
      const callback = allFrames.get(id);
      pendingFrames.delete(id);
      if (!cancelled) allFrames.delete(id);
      callback(performance.now());
    };
  `;
  const textToolBundle = await bundleSourceEntry('src/text-tool.js');
  const bundleHandler = async (route, pathname) => {
    if (pathname !== '/browser/text-tool.bundle.js') return false;
    await route.fulfill({ contentType: 'text/javascript', body: textToolBundle });
    return true;
  };
  await serveFixture(page, '/text-measure-fixture', fixturePage(script), bundleHandler);

  await page.waitForFunction(() => window.textMeasureHost.tool.widthMeasurement?.frame !== undefined);
  const obsoleteFrame = await page.evaluate(() => window.textMeasureHost.tool.widthMeasurement.frame);
  await page.evaluate((id) => window.flushFrame(id), obsoleteFrame);
  const obsoleteContinuationFrame = await page.waitForFunction((firstFrame) => {
    const measurement = window.textMeasureHost.tool.widthMeasurement;
    return measurement?.frame && measurement.frame !== firstFrame ? measurement.frame : false;
  }, obsoleteFrame).then((handle) => handle.jsonValue());
  await page.evaluate(() => window.textMeasureHost.changeText('CURRENT phrase'));
  await page.evaluate((id) => window.flushFrame(id, true), obsoleteContinuationFrame);
  const pendingAfterChange = await page.evaluate(() => ({
    text: window.textMeasureHost.tool.textParts.map((part) => part.value).join(''),
    pending: window.textMeasureHost.tool.widthOverflowPending,
    sourceIsCurrent: window.textMeasureHost.tool.widthOverflowSourceSignature.includes('CURRENT'),
  }));
  expect(pendingAfterChange.text).not.toContain('OBSOLETE');
  expect(pendingAfterChange.pending).toBe(true);
  expect(pendingAfterChange.sourceIsCurrent).toBe(true);

  for (let frame = 0; frame < 5; frame += 1) {
    const frameId = await page.waitForFunction(() => {
      const measurement = window.textMeasureHost.tool.widthMeasurement;
      return measurement?.frame;
    }).then((handle) => handle.jsonValue());
    await page.evaluate((id) => window.flushFrame(id), frameId);
    if (await page.evaluate(() => !window.textMeasureHost.tool.widthOverflowPending)) break;
  }
  const currentText = await page.evaluate(() => ({
    text: window.textMeasureHost.tool.textElement.textContent,
    fontStatus: document.fonts.status,
    measurement: window.textMeasureHost.tool.widthOverflowMeasurementSignature,
  }));
  expect(currentText.text).toContain('CURRENT');
  expect(currentText.text).not.toContain('OBSOLETE');
  expect(currentText.fontStatus).toBe('loaded');
  expect(currentText.measurement).toContain('CURRENT');
  expect(currentText.measurement).toContain('phrase');

  await page.evaluate(() => window.textMeasureHost.changeText('RECONNECTED phrase'));
  await page.waitForFunction(() => window.textMeasureHost.tool.widthMeasurement?.frame !== undefined);
  const disconnectedFrame = await page.evaluate(() => window.textMeasureHost.tool.widthMeasurement.frame);
  await page.evaluate(() => window.textMeasureHost.remove());
  await page.evaluate((id) => window.flushFrame(id, true), disconnectedFrame);
  expect(await page.evaluate(() => ({
    closed: window.textMeasureHost.tool.textClosed,
    pending: window.textMeasureHost.tool.widthOverflowPending,
    scheduled: window.textMeasureHost.tool.widthMeasurementScheduled,
  }))).toEqual({ closed: true, pending: true, scheduled: false });

  await page.evaluate(() => document.querySelector('#fixture').append(window.textMeasureHost));
  await page.waitForFunction(() => window.textMeasureHost.tool.widthMeasurement?.frame !== undefined);
  for (let frame = 0; frame < 5; frame += 1) {
    const frameId = await page.waitForFunction(() => window.textMeasureHost.tool.widthMeasurement?.frame).then((handle) => handle.jsonValue());
    await page.evaluate((id) => window.flushFrame(id), frameId);
    if (await page.evaluate(() => !window.textMeasureHost.tool.widthOverflowPending)) break;
  }
  const reconnected = await page.evaluate(() => ({
    closed: window.textMeasureHost.tool.textClosed,
    pending: window.textMeasureHost.tool.widthOverflowPending,
    text: window.textMeasureHost.tool.textElement.textContent,
    measurement: window.textMeasureHost.tool.widthOverflowMeasurementSignature,
    activeFrames: window.textRaf.pendingFrames.size,
  }));
  expect(reconnected.closed).toBe(false);
  expect(reconnected.pending).toBe(false);
  expect(reconnected.text).toContain('RECONNECTED');
  expect(reconnected.measurement).toContain('RECONNECTED');
  expect(reconnected.measurement).toContain('phrase');
  expect(reconnected.activeFrames).toBe(0);
  expect(pageErrors).toEqual([]);
});

test('real card gradient RAF stays owned across same-turn disconnect and reconnect', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  const script = `
    import '/dist/flex-horseshoe-card.js';
    await customElements.whenDefined('flex-horseshoe-card');
    const card = document.createElement('flex-horseshoe-card');
    card.setConfig({
      type: 'custom:flex-horseshoe-card',
      entities: [],
      layout: { aspectratio: '1/1' },
    });
    document.querySelector('#fixture').append(card);
    await card.updateComplete;

    const pending = new Map();
    const callbacks = new Map();
    const cancelled = [];
    let nextFrame = 1;
    window.requestAnimationFrame = (callback) => {
      const frame = nextFrame++;
      pending.set(frame, callback);
      callbacks.set(frame, callback);
      return frame;
    };
    window.cancelAnimationFrame = (frame) => {
      cancelled.push(frame);
      pending.delete(frame);
    };
    const nativeRequestUpdate = card.requestUpdate.bind(card);
    let requestUpdateCount = 0;
    card.requestUpdate = (...args) => {
      requestUpdateCount += 1;
      return nativeRequestUpdate(...args);
    };
    window.gradientHarness = {
      card, pending, callbacks, cancelled,
      get requestUpdateCount() { return requestUpdateCount; },
      resetRequestUpdateCount() { requestUpdateCount = 0; },
      run(frame, allowCancelled = false) {
        const callback = callbacks.get(frame);
        pending.delete(frame);
        if (!allowCancelled) callbacks.delete(frame);
        callback(performance.now());
      },
    };
    card._updateGradientsAfterRender();
    window.gradientHarness.oldUpdate = card.gradientUpdate;
  `;
  await serveFixture(page, '/card-gradient-fixture', fixturePage(script));
  await page.waitForFunction(() => window.gradientHarness.card.gradientUpdate?.frame !== undefined);
  const oldFrame = await page.evaluate(() => window.gradientHarness.card.gradientUpdate.frame);

  await page.evaluate(() => {
    const card = window.gradientHarness.card;
    const fixture = document.querySelector('#fixture');
    fixture.removeChild(card);
    fixture.append(card);
  });
  await page.waitForFunction(() => {
    const harness = window.gradientHarness;
    return harness.card.gradientUpdate
      && harness.card.gradientUpdate !== harness.oldUpdate
      && harness.card.gradientUpdate.frame !== undefined;
  });
  const currentFrame = await page.evaluate(() => {
    const harness = window.gradientHarness;
    harness.currentUpdate = harness.card.gradientUpdate;
    harness.resetRequestUpdateCount();
    return harness.currentUpdate.frame;
  });
  expect(await page.evaluate((frame) => window.gradientHarness.cancelled.includes(frame), oldFrame)).toBe(true);

  const afterStaleFrame = await page.evaluate(async (frame) => {
    const harness = window.gradientHarness;
    harness.run(frame, true);
    await Promise.resolve();
    return {
      sameCurrentUpdate: harness.card.gradientUpdate === harness.currentUpdate,
      currentFramePending: harness.pending.has(harness.currentUpdate.frame),
      gradientsNeedUpdate: harness.card.gradientsNeedUpdate,
      requestUpdateCount: harness.requestUpdateCount,
      connected: harness.card.isConnected,
      gradientsClosed: harness.card.gradientsClosed,
    };
  }, oldFrame);
  expect(afterStaleFrame).toEqual({
    sameCurrentUpdate: true,
    currentFramePending: true,
    gradientsNeedUpdate: true,
    requestUpdateCount: 0,
    connected: true,
    gradientsClosed: false,
  });

  await page.evaluate((frame) => window.gradientHarness.run(frame), currentFrame);
  await page.waitForFunction(() => window.gradientHarness.card.gradientUpdate === undefined
    && window.gradientHarness.card.gradientsNeedUpdate === false);
  expect(await page.evaluate(() => window.gradientHarness.requestUpdateCount)).toBe(1);
  expect(pageErrors).toEqual([]);
});

test('Lit actionHandler cancels removed gestures and rebinds once after reconnect', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  const script = `
    import { LitElement, html } from 'lit';
    import actionHandler from '/src/action-handler.js';
    const active = new Map();
    const cleared = new Map();
    let nextTimer = 1;
    window.setTimeout = (callback, delay) => {
      const id = nextTimer++;
      active.set(id, { callback, delay });
      return id;
    };
    window.clearTimeout = (id) => {
      if (active.has(id)) cleared.set(id, active.get(id));
      active.delete(id);
    };
    class GestureHost extends LitElement {
      static properties = { showTarget: { type: Boolean }, options: { attribute: false } };
      constructor() {
        super();
        this.showTarget = true;
        this.options = { hasTap: true, hasHold: true, hasDoubleClick: false };
        this.actions = [];
        this.addEventListener('action', (event) => this.actions.push(event.detail.action));
      }
      render() {
        return html\`\${this.showTarget ? html\`<button id="target" \${actionHandler(this.options)}></button>\` : ''}\`;
      }
    }
    customElements.define('gesture-host', GestureHost);
    const host = document.createElement('gesture-host');
    document.querySelector('#fixture').append(host);
    await host.updateComplete;
    window.gestureHost = host;
    window.timerHarness = {
      active, cleared,
      run(id) { const timer = active.get(id); active.delete(id); timer.callback(); },
      runCleared(id) { cleared.get(id).callback(); },
    };
  `;
  await serveFixture(page, '/action-handler-fixture', fixturePage(script));
  await page.waitForFunction(() => window.gestureHost?.shadowRoot.querySelector('#target'));

  const holdTimer = await page.evaluate(() => {
    const target = window.gestureHost.shadowRoot.querySelector('#target');
    target.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, button: 0, pointerId: 1 }));
    return [...window.timerHarness.active.keys()][0];
  });
  await page.evaluate(async () => {
    window.gestureHost.showTarget = false;
    window.gestureHost.requestUpdate();
    await window.gestureHost.updateComplete;
  });
  await page.evaluate((id) => window.timerHarness.runCleared(id), holdTimer);
  expect(await page.evaluate(() => window.gestureHost.actions)).toEqual([]);

  await page.evaluate(async () => {
    window.gestureHost.showTarget = true;
    window.gestureHost.options = { hasTap: true, hasHold: false, hasDoubleClick: true };
    window.gestureHost.requestUpdate();
    await window.gestureHost.updateComplete;
  });
  const delayedTap = await page.evaluate(() => {
    const host = window.gestureHost;
    const target = host.shadowRoot.querySelector('#target');
    target.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, button: 0, pointerId: 2 }));
    target.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, button: 0, pointerId: 2 }));
    return [...window.timerHarness.active.keys()][0];
  });
  await page.evaluate(() => window.gestureHost.remove());
  await page.evaluate((id) => window.timerHarness.runCleared(id), delayedTap);
  expect(await page.evaluate(() => window.gestureHost.actions)).toEqual([]);

  await page.evaluate(() => document.querySelector('#fixture').append(window.gestureHost));
  await page.waitForFunction(() => window.gestureHost.isConnected && window.gestureHost.shadowRoot.querySelector('#target'));
  const retainedTap = await page.evaluate(async () => {
    const host = window.gestureHost;
    const target = host.shadowRoot.querySelector('#target');
    target.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, button: 0, pointerId: 3 }));
    target.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, button: 0, pointerId: 3 }));
    const id = [...window.timerHarness.active.keys()][0];
    host.options = { ...host.options };
    host.requestUpdate();
    await host.updateComplete;
    return { id, stillActive: window.timerHarness.active.has(id) };
  });
  expect(retainedTap.stillActive).toBe(true);
  await page.evaluate((id) => window.timerHarness.run(id), retainedTap.id);
  expect(await page.evaluate(() => window.gestureHost.actions)).toEqual(['tap']);

  const invalidatedTap = await page.evaluate(async () => {
    const host = window.gestureHost;
    const target = host.shadowRoot.querySelector('#target');
    target.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, button: 0, pointerId: 4 }));
    target.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, button: 0, pointerId: 4 }));
    const id = [...window.timerHarness.active.keys()][0];
    host.options = { hasTap: true, hasHold: false, hasDoubleClick: false };
    host.requestUpdate();
    await host.updateComplete;
    return id;
  });
  await page.evaluate((id) => window.timerHarness.runCleared(id), invalidatedTap);
  const actionCountBeforeImmediateTap = await page.evaluate(() => window.gestureHost.actions.length);
  await page.evaluate(() => {
    const target = window.gestureHost.shadowRoot.querySelector('#target');
    target.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, button: 0, pointerId: 5 }));
    target.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, button: 0, pointerId: 5 }));
  });
  expect(await page.evaluate(() => window.gestureHost.actions)).toEqual(['tap', 'tap']);
  expect(actionCountBeforeImmediateTap).toBe(1);
  expect(pageErrors).toEqual([]);
});
