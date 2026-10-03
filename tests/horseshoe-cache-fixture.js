/** Loads real card owners for path-cache tests and before/after measurements. */
export async function loadHorseshoeCacheCard(page, bundle) {
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  await page.route('http://fhs.test/**', (route) => route.fulfill({
    contentType: 'text/html',
    body: '<body style="--primary-text-color:#222;--primary-background-color:white;--card-background-color:white"><div id="host" style="width:600px"></div></body>',
  }));
  await page.goto('http://fhs.test/horseshoe-cache');
  await page.evaluate(() => {
    // Home Assistant provides this secondary CSS-variable scope while an
    // external palette is pending. The fixture supplies its shadow-root boundary.
    const homeAssistant = document.createElement('home-assistant');
    const main = document.createElement('home-assistant-main');
    const drawer = document.createElement('ha-drawer');
    const resolver = document.createElement('partial-panel-resolver');
    const panel = document.createElement('ha-panel-lovelace');
    document.body.append(homeAssistant);
    homeAssistant.attachShadow({ mode: 'open' }).append(main);
    main.attachShadow({ mode: 'open' }).append(drawer);
    drawer.append(resolver);
    resolver.attachShadow({ mode: 'open' }).append(panel);
  });
  await page.addScriptTag({ type: 'module', content: bundle });
  await page.evaluate(async () => {
    await customElements.whenDefined('flex-horseshoe-card');
    const card = document.createElement('flex-horseshoe-card');
    card.lovelace = { config: {} };
    const state = {
      entity_id: 'sensor.load', state: '25',
      attributes: { friendly_name: 'Load', unit_of_measurement: '%' },
      last_changed: '2026-09-27T12:00:00Z', last_updated: '2026-09-27T12:00:00Z',
    };
    const hass = {
      states: { 'sensor.load': state }, connection: new EventTarget(),
      locale: { language: 'en', number_format: 'language', time_format: 'language' },
      config: { time_zone: 'UTC' }, themes: { darkMode: false, themes: {} },
      entities: {}, devices: {}, areas: {}, floors: {}, user: { name: 'Path cache' },
      formatEntityName: (entity) => entity.attributes.friendly_name,
      formatEntityState: (entity) => entity.state,
    };
    const paths = [
      { type: 'arc', radius: 20, arc_degrees: 270 },
      { type: 'rectangle', width: 25, height: 35, radius: 3 },
      { type: 'line', length: 24 },
    ];
    const horseshoes = paths.map((path, index) => ({
      id: `path-${index}`, entity_index: 0, xpos: 25 + index * 25, ypos: 50, path,
      horseshoe_scale: { min: 0, max: 100, width: 3 },
      horseshoe_state: { width: 4, animation: { enabled: true, duration: 120, easing: 'linear' } },
      horseshoe_marker: { attach_to: 'path', shape: 'circle', size: 3, offset: 3 },
      horseshoe_background: { width: 6, offset: 0 },
      horseshoe_tickmarks: { ticks_major: { ticksize: 25, width: 3, offset: 0 } },
      show: {
        horseshoe_style: index === 1 ? 'lineargradient' : 'colorstopgradient',
        scale_style: 'colorstopgradient', horseshoe_background: 'colorstopgradient',
        state_marker: true, labels_at: 'ticks_major', tickmarks: { major: true, minor: false },
      },
      color_stops: { colors: { 0: '#00aaff', 50: '#22cc44', 100: '#ff3300' } },
    }));
    const config = { type: 'custom:flex-horseshoe-card', entities: [{ entity: 'sensor.load' }], layout: { horseshoes } };
    card.setConfig(config);
    document.querySelector('#host').append(card);
    card.hass = hass;
    window.horseshoeCache = { card, hass, config };
  });
  await page.waitForFunction(() => window.horseshoeCache.card.cardTools.getBySection('horseshoes')
    .every((gauge) => gauge.geometry.pathGeometry.isReady() && gauge.paint.stateGradient && gauge.geometry.pathElements.labels.length > 0));
  await page.evaluate(async () => {
    await window.horseshoeCache.card.updateComplete;
    await new Promise((done) => requestAnimationFrame(done));
    await window.horseshoeCache.card.updateComplete;
  });
  return pageErrors;
}

/** Sends a changed sensor value through the public Home Assistant setter. */
export async function deliverHorseshoeState(page, value) {
  await page.evaluate((nextValue) => {
    const fixture = window.horseshoeCache;
    fixture.hass = {
      ...fixture.hass,
      states: { 'sensor.load': { ...fixture.hass.states['sensor.load'], state: String(nextValue) } },
    };
    fixture.card.hass = fixture.hass;
  }, value);
}
