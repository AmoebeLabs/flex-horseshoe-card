import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import CardActions from '../src/card-actions.js';
import CardEntities from '../src/card-entities.js';
import CardTools from '../src/card-tools.js';
import ColorStops from '../src/color-stops.js';
import Merge from '../src/merge.js';
import SparklineGraphTool from '../src/sparkline-graph-tool.js';
import SparklineSeries from '../src/sparkline-series.js';
import Templates from '../src/templates.js';

/** Builds the real shared template context and minimum card services for Sparkline. */
function createSparklineFixture(source) {
  const hadWindow = Object.hasOwn(globalThis, 'window');
  const previousWindow = globalThis.window;
  globalThis.window = { matchMedia: () => ({ matches: false }) };
  const entities = [
    {
      entity_id: 'sensor.parent',
      state: '11',
      last_changed: '2026-10-03T12:00:00.000Z',
      attributes: {},
    },
    {
      entity_id: 'sensor.comparison',
      state: '22',
      last_changed: '2026-10-03T12:00:00.000Z',
      attributes: {},
    },
  ];
  const entityConfigs = [
    { entity: 'sensor.parent', attribute: undefined, color: '#1565c0', decimals: 1 },
    { entity: 'sensor.comparison', attribute: undefined, color: '#ef6c00', decimals: 1 },
  ];
  const cardConfig = {
    entities: [
      { entity: 'sensor.parent' },
      { entity: 'sensor.comparison' },
    ],
    constants: { seriesEvaluations: 0 },
    dev: { debug: false },
  };
  const hass = {
    states: {
      'sensor.parent': entities[0],
      'sensor.comparison': entities[1],
    },
    locale: { language: 'en', time_format: '24' },
    config: { time_zone: 'UTC' },
    user: {},
    formatEntityName(_entity, name) {
      return typeof name === 'string' ? name : 'sensor';
    },
    formatEntityAttributeName(_entity, attribute) {
      return attribute;
    },
    formatEntityAttributeValue(_entity, _attribute, value) {
      return String(value);
    },
    formatEntityState(_entity, value) {
      return String(value);
    },
  };
  const templates = new Templates(entities);
  templates.beginConfig(cardConfig);
  templates.setHass(hass);
  templates.detectJavascriptTemplates(source);

  const card = {
    config: cardConfig,
    evaluateJavascriptTemplates: true,
    dev: { debug: false, fakeData: false },
    entities,
    runtimeEntityConfigs: entityConfigs,
    _hass: hass,
    cardAnimations: { styles: { sparklines: [] } },
    cardLayout: {
      changedGroupIds: new Set(),
      calculateSvgCoordinatesInGroup(item) {
        return { xpos: item.xpos, ypos: item.ypos };
      },
      getGroupScaleTransform() {
        return '';
      },
      getGroupScaleStyle(_item, geometry) {
        return geometry;
      },
      groupManager: {
        getGroupChainForItem() {
          return [];
        },
        isItemVisible() {
          return true;
        },
      },
      masksClips: {
        applyGradientRefs(styles) {
          return styles;
        },
      },
    },
    cardTheme: {
      modeChanged: false,
      activeColorStopMode: 'light',
      getActiveColorStopMode() {
        return this.activeColorStopMode;
      },
      colorContext: { cacheReady: false },
    },
    requestUpdate() {},
    updateSparklineResult() {},
  };
  card.actions = new CardActions(card, {});
  card.actions.setHassAndEntities(hass, entityConfigs, entities);
  const cardTools = new CardTools(card, templates, 'architecture-card');
  card.cardTools = cardTools;
  const tool = new SparklineGraphTool(source, 0, templates, 'architecture-card', card);
  cardTools.sections.sparklines = [tool];

  return {
    card,
    cardConfig,
    cardTools,
    entities,
    entityConfigs,
    templates,
    tool,
    restoreWindow() {
      if (hadWindow) globalThis.window = previousWindow;
      else delete globalThis.window;
    },
  };
}

/** Returns one public Sparkline source with shared styles and a rolling period. */
function makeSparklineSource(series) {
  return {
    id: 'canonical-sparkline',
    entity_index: 0,
    xpos: 50,
    ypos: 50,
    width: 64,
    height: 32,
    period: {
      type: 'rolling_window',
      group_by: 'interval',
      rolling_window: {
        offset: 0,
        duration: { hour: 12 },
        bins: { per_hour: 2, density: 'medium' },
      },
    },
    sparkline: {
      show: {
        chart_type: 'line',
        item_style: 'colorstopgradient',
        legend: false,
      },
      line: {
        show: { minmax: true },
        styles: { stroke: '#1565c0', opacity: 0.7 },
      },
      area: { show: { minmax: true } },
      color_stops: {
        colors: [
          { value: 0, color: '#1565c0' },
          { value: 100, color: '#ef6c00' },
        ],
      },
    },
    series,
  };
}

test('real Templates expose prepared Sparkline defaults through the outer item context', (context) => {
  const expression = '[[[ constants.seriesEvaluations += 1; return [{ id: "context", entity_index: 1, name: [item.width, item.period.type, item.period.calendar.duration.hour, item.sparkline.line.styles.stroke, entity.entity_id, state, entities[1].state].join("|") }]; ]]]';
  const source = {
    id: 'context-sparkline',
    entity_index: 0,
    sparkline: { show: { chart_type: 'line' } },
    series: expression,
  };
  const fixture = createSparklineFixture(source);
  const { cardConfig, tool } = fixture;
  context.after(() => {
    if (tool.sparklineHistory) tool.sparklineHistory.disconnected();
    fixture.restoreWindow();
  });

  tool.updateRuntimeConfig();

  assert.equal(cardConfig.constants.seriesEvaluations, 1);
  assert.equal(
    tool.config.series[0].name,
    '25|calendar|24|var(--primary-text-color)|sensor.parent|11|22',
  );
  assert.equal(tool.sourceConfig.series, expression);
  assert.equal(tool.sourceConfig.width, 25);
  assert.equal(tool.sourceConfig.period.type, 'calendar');
  assert.equal(tool.sourceConfig.period.calendar.duration.hour, 24);
  assert.equal(tool.sourceConfig.sparkline.line.styles.stroke, 'var(--primary-text-color)');
});

test('static and whole-value JavaScript series converge on canonical runtime entries', (context) => {
  const staticSeries = [
    {
      id: 'temperature',
      entity_index: 1,
      y_axis_id: 'secondary',
      name: 'canonical-sparkline:sensor.parent:11:22',
      color: '#e67e22',
      sparkline: {
        show: { chart_type: 'area', item_style: 'fixed' },
        line: {
          show: { item_style: 'colorstop' },
          styles: { stroke: '#e67e22' },
        },
      },
    },
    {
      id: 'humidity',
      entity_index: 0,
      y_axis_id: 'primary',
      name: 'canonical-sparkline:sensor.parent:11:22',
      sparkline: {
        show: { chart_type: 'dots', item_style: 'auto' },
      },
    },
  ];
  const expression = `[[[ constants.seriesEvaluations += 1; return [{ id: "temperature", entity_index: 1, y_axis_id: "secondary", name: item.id + ":" + entity.entity_id + ":" + state + ":" + entities[1].state, color: "#e67e22", sparkline: { show: { chart_type: "area", item_style: "fixed" }, line: { show: { item_style: '[[[ return entity.entity_id === "sensor.parent" ? "colorstop" : "auto"; ]]]' }, styles: { stroke: "#e67e22" } } } }, { id: "humidity", entity_index: 0, y_axis_id: "primary", name: item.id + ":" + entity.entity_id + ":" + state + ":" + entities[1].state, sparkline: { show: { chart_type: "dots", item_style: "auto" } } }]; ]]]`;
  const staticConfig = SparklineGraphTool.translateConfig(makeSparklineSource(staticSeries));
  assert.equal(staticConfig.sparkline.line_color.length, 13);
  const canonicalSeries = new SparklineSeries(staticConfig);
  const staticFixture = createSparklineFixture(makeSparklineSource(staticSeries));
  staticFixture.tool.updateRuntimeConfig();
  const fixture = createSparklineFixture(makeSparklineSource(expression));
  const {
    card,
    cardConfig,
    entities,
    entityConfigs,
    tool,
    restoreWindow,
  } = fixture;
  context.after(() => {
    if (tool.sparklineHistory) tool.sparklineHistory.disconnected();
    if (staticFixture.tool.sparklineHistory) staticFixture.tool.sparklineHistory.disconnected();
    restoreWindow();
    staticFixture.restoreWindow();
  });

  tool.updateRuntimeConfig();

  assert.equal(cardConfig.constants.seriesEvaluations, 1);
  assert.equal(tool.config.sparkline.line_color.length, 13);
  assert.deepEqual(tool.config.sparkline.line_color, staticConfig.sparkline.line_color);
  assert.equal(tool.sourceConfig.series, expression);
  assert.deepEqual(tool.config.series, staticFixture.tool.config.series);
  assert.deepEqual(
    tool.sparklineSeries.items.map((item) => [item.id, item.entity_index, item.y_axis_id]),
    [
      ['temperature', 1, 'secondary'],
      ['humidity', 0, 'primary'],
    ],
  );
  assert.strictEqual(canonicalSeries.primaryItem, canonicalSeries.items[0]);
  assert.strictEqual(tool.sparklineSeries.primaryItem, tool.sparklineSeries.items[0]);
  canonicalSeries.items.forEach((item, index) => {
    assert.strictEqual(item.config, staticConfig.series[index]);
    assert.strictEqual(tool.sparklineSeries.items[index].config, tool.config.series[index]);
    assert.equal(item.config.id, item.id);
    assert.equal(Object.hasOwn(item.config, 'series'), false);
  });

  const temperature = tool.config.series[0];
  assert.equal(temperature.sparkline.show.item_style, 'fixed');
  assert.equal(temperature.sparkline.line.show.item_style, 'colorstop');
  assert.equal(temperature.sparkline.line.minmax.show.item_style, 'fixed');
  assert.equal(temperature.sparkline.area.show.item_style, 'fixed');
  assert.equal(temperature.sparkline.area.minmax.show.item_style, 'fixed');
  assert.equal(temperature.sparkline.line.styles.stroke, '#e67e22');
  assert.equal(temperature.sparkline.line.styles.opacity, '0.7');
  assert.deepEqual(temperature.period, staticConfig.period);
  assert.deepEqual(temperature.sparkline.color_stops, staticConfig.sparkline.color_stops);
  assert.equal(tool.primaryGraph.input.sparkline.show.chart_type, 'area');
  assert.equal(tool.primaryGraph.config, undefined);

  tool.setEntities(entityConfigs, entities);
  assert.strictEqual(tool.sparklineSeries.items[0].entity, entities[1]);
  assert.strictEqual(tool.sparklineSeries.items[1].entity, entities[0]);
  assert.ok(tool.geometry.svg);
  assert.equal(Object.hasOwn(tool, 'svg'), false);
  assert.equal(Object.hasOwn(tool.config, 'svg'), false);

  const publishedConfig = tool.config;
  const seriesOwner = tool.sparklineSeries;
  const historyOwner = tool.sparklineHistory;
  const graph = tool.primaryGraph;
  const canonicalItemConfig = tool.sparklineSeries.primaryItem.config;
  const inheritedColorStops = tool.paint.colorStops;
  assert.deepEqual(tool.sparklineSeries.primaryItem.paint.colorStops, inheritedColorStops);
  tool.setState(entities[0], entityConfigs[0]);
  assert.strictEqual(tool.config, publishedConfig);

  tool.updateRuntimeConfig();

  assert.equal(cardConfig.constants.seriesEvaluations, 2);
  assert.strictEqual(tool.config, publishedConfig);
  assert.strictEqual(tool.sparklineSeries, seriesOwner);
  assert.strictEqual(tool.sparklineHistory, historyOwner);
  assert.strictEqual(tool.primaryGraph, graph);
  assert.strictEqual(tool.sparklineSeries.primaryItem.config, canonicalItemConfig);

  card.evaluateJavascriptTemplates = false;
  card.cardTheme.modeChanged = true;
  tool.updateRuntimeConfig();
  assert.deepEqual(tool.paint.colorStops, inheritedColorStops);
  assert.deepEqual(tool.sparklineSeries.primaryItem.paint.colorStops, tool.paint.colorStops);
  assert.strictEqual(tool.sparklineSeries.primaryItem.config, canonicalItemConfig);
});

// Both authored arrays and evaluated arrays must preserve the legacy partial-override merge.
for (const javascriptSeries of [false, true]) {
  test('legacy explicit colorstops inherit normalized parent paint and retain canonical identity (' + (javascriptSeries ? 'JavaScript' : 'static') + ')', (context) => {
    const rawSeries = [
      { id: 'partial', entity_index: 0, sparkline: { colorstops: { gap: 3 } } },
      {
        id: 'colors',
        entity_index: 1,
        sparkline: { colorstops: { colors: [{ value: 150, color: '#ab47bc' }] } },
      },
    ];
    const expression = '[[[ constants.seriesEvaluations += 1; return constants.legacySeries; ]]]';
    const source = makeSparklineSource(javascriptSeries ? expression : rawSeries);
    source.sparkline.color_stops.scales = { default: { min: 0, max: 100 } };
    source.sparkline.color_stops.modes = {
      light: [{ value: 0, color: '#1565c0' }, { value: 100, color: '#ef6c00' }],
      dark: [{ value: 0, color: '#90caf9' }, { value: 100, color: '#ffcc80' }],
    };
    const fixture = createSparklineFixture(source);
    const { card, cardConfig, tool, restoreWindow } = fixture;
    cardConfig.constants.legacySeries = structuredClone(rawSeries);
    context.after(() => {
      if (tool.sparklineHistory) tool.sparklineHistory.disconnected();
      restoreWindow();
    });

    tool.updateRuntimeConfig();

    const publishedConfig = tool.config;
    const canonicalEntries = [...tool.config.series];
    const runtimeItems = [...tool.sparklineSeries.items];
    const graphs = runtimeItems.map((item) => item.graph);
    const parentColorStops = tool.paint.colorStops;
    assert.equal(cardConfig.constants.seriesEvaluations, javascriptSeries ? 1 : 0);
    rawSeries.forEach((rawEntry, index) => {
      assert.deepEqual(
        runtimeItems[index].paint.colorStops,
        Merge.mergeDeep(ColorStops.normalize(source.sparkline.color_stops, 'light'), rawEntry.sparkline.colorstops),
      );
      assert.deepEqual(runtimeItems[index].paint.colorStopsOverride, rawEntry.sparkline.colorstops);
      assert.strictEqual(runtimeItems[index].config, canonicalEntries[index]);
    });

    // Repeated modes must recompose only the paint override, without accumulating colors.
    card.evaluateJavascriptTemplates = false;
    for (const mode of ['light', 'dark', 'light']) {
      card.cardTheme.activeColorStopMode = mode;
      card.cardTheme.modeChanged = true;
      tool.updateRuntimeConfig();

      const normalizedParent = ColorStops.normalize(source.sparkline.color_stops, mode);
      assert.deepEqual(tool.paint.colorStops, normalizedParent);
      assert.notStrictEqual(tool.paint.colorStops, parentColorStops);
      assert.strictEqual(tool.config, publishedConfig);
      rawSeries.forEach((rawEntry, index) => {
        const item = tool.sparklineSeries.items[index];
        assert.deepEqual(
          item.paint.colorStops,
          Merge.mergeDeep(normalizedParent, rawEntry.sparkline.colorstops),
        );
        assert.deepEqual(item.paint.colorStopsOverride, rawEntry.sparkline.colorstops);
        assert.strictEqual(tool.config.series[index], canonicalEntries[index]);
        assert.strictEqual(item, runtimeItems[index]);
        assert.strictEqual(item.config, canonicalEntries[index]);
        assert.strictEqual(item.graph, graphs[index]);
      });
      assert.equal(cardConfig.constants.seriesEvaluations, javascriptSeries ? 1 : 0);
    }
    assert.deepEqual(tool.sourceConfig.series, javascriptSeries ? expression : rawSeries);

    if (javascriptSeries) {
      const changedSeries = [
        { id: 'partial', entity_index: 0, sparkline: { colorstops: {} } },
        {
          id: 'colors',
          entity_index: 1,
          sparkline: { colorstops: { colors: [{ value: 200, color: '#00897b' }] } },
        },
      ];
      cardConfig.constants.legacySeries = changedSeries;
      card.evaluateJavascriptTemplates = true;
      card.cardTheme.modeChanged = false;
      tool.updateRuntimeConfig();

      const changedConfig = tool.config;
      const changedEntries = [...changedConfig.series];
      assert.notStrictEqual(changedConfig, publishedConfig);
      assert.equal(cardConfig.constants.seriesEvaluations, 2);
      changedSeries.forEach((rawEntry, index) => {
        assert.deepEqual(
          runtimeItems[index].paint.colorStops,
          Merge.mergeDeep(ColorStops.normalize(source.sparkline.color_stops, 'light'), rawEntry.sparkline.colorstops),
        );
        assert.deepEqual(runtimeItems[index].paint.colorStopsOverride, rawEntry.sparkline.colorstops);
        assert.strictEqual(tool.sparklineSeries.items[index], runtimeItems[index]);
        assert.strictEqual(runtimeItems[index].config, changedEntries[index]);
      });
      card.evaluateJavascriptTemplates = false;
      for (const mode of ['light', 'dark', 'light']) {
        card.cardTheme.activeColorStopMode = mode;
        card.cardTheme.modeChanged = true;
        tool.updateRuntimeConfig();

        const normalizedParent = ColorStops.normalize(source.sparkline.color_stops, mode);
        changedSeries.forEach((rawEntry, index) => {
          const item = tool.sparklineSeries.items[index];
          assert.deepEqual(
            item.paint.colorStops,
            Merge.mergeDeep(normalizedParent, rawEntry.sparkline.colorstops),
          );
          assert.deepEqual(item.paint.colorStopsOverride, rawEntry.sparkline.colorstops);
          assert.strictEqual(tool.config, changedConfig);
          assert.strictEqual(item, runtimeItems[index]);
          assert.strictEqual(item.config, changedEntries[index]);
          assert.strictEqual(item.config, tool.config.series[index]);
          assert.strictEqual(item.graph, graphs[index]);
        });
        assert.equal(Object.hasOwn(tool.sparklineSeries.items[0].paint.colorStops, 'gap'), false);
        assert.equal(cardConfig.constants.seriesEvaluations, 2);
      }
    }
  });
}

test('CardEntities publishes primary and named statistics from whole-value JavaScript series without evaluating the source again', (context) => {
  const expression = '[[[ constants.seriesEvaluations += 1; return [{ id: "comparison_room", entity_index: constants.comparisonSource, name: entity.entity_id }, { id: "parent_room", entity_index: 0 }, { id: "parent_room_bin", entity_index: 0 }]; ]]]';
  const source = makeSparklineSource(expression);
  source.period = { type: 'real_time' };
  const fixture = createSparklineFixture(source);
  const { card, cardConfig, cardTools, entities, templates, tool, restoreWindow } = fixture;
  cardConfig.constants.comparisonSource = 1;
  context.after(() => {
    if (tool.sparklineHistory) tool.sparklineHistory.disconnected();
    restoreWindow();
  });

  entities[0].attributes = { reading: 11, friendly_name: 'Parent power', unit_of_measurement: 'W', device_class: 'power' };
  entities[1].attributes = { reading: 22, friendly_name: 'Comparison temperature', unit_of_measurement: 'C', device_class: 'temperature' };
  const parentStops = { modes: { light: { 0: '#1565c0' }, dark: { 0: '#90caf9' } } };
  const comparisonStops = { modes: { light: { 0: '#ef6c00' }, dark: { 0: '#ffcc80' } } };
  const derivedStops = { modes: { light: { 0: '#6a1b9a' }, dark: { 0: '#ce93d8' } } };
  cardConfig.entities = [
    { entity: 'sensor.parent', attribute: 'reading', name: 'Configured parent name', decimals: 1, color: '#1565c0', color_stops: parentStops },
    { entity: 'sensor.comparison', attribute: 'reading', name: 'Configured comparison name', decimals: 2, color: '#ef6c00', color_stops: comparisonStops },
    { entity: 'fhs_sparkline.canonical-sparkline_avg' },
    { entity: 'fhs_sparkline.canonical-sparkline_comparison_room_avg' },
    { entity: 'fhs_sparkline.canonical-sparkline_comparison_room_min', color_stops: derivedStops },
    { entity: 'fhs_sparkline.canonical-sparkline_parent_room_max' },
    { entity: 'fhs_sparkline.canonical-sparkline_comparison_room_bin_duration' },
    { entity: 'fhs_sparkline.canonical-sparkline_bin_duration' },
    { entity: 'fhs_sparkline.canonical-sparkline_comparison_room_duration' },
    { entity: 'fhs_sparkline.canonical-sparkline_parent_room_bin_duration' },
  ];
  cardConfig.layout = { sparklines: [source] };
  const cardEntities = new CardEntities(templates, card.cardTheme);
  card.cardEntities = cardEntities;

  const resolvedConfigs = cardEntities.buildRuntimeEntityConfigs(cardConfig, true);
  card.runtimeEntityConfigs = resolvedConfigs;
  assert.equal(resolvedConfigs.length, cardConfig.entities.length);
  assert.equal(cardConfig.constants.seriesEvaluations, 0);
  assert.equal(resolvedConfigs[6].sparkline_series_id, 'comparison_room');
  assert.equal(resolvedConfigs[6].sparkline_entity_type, 'bin_duration');
  assert.equal(resolvedConfigs[7].sparkline_series_id, undefined);
  assert.equal(resolvedConfigs[7].sparkline_entity_type, 'bin_duration');
  assert.equal(resolvedConfigs[8].sparkline_series_id, 'comparison_room');
  assert.equal(resolvedConfigs[8].sparkline_entity_type, 'duration');
  assert.equal(tool.sourceConfig.series, expression);
  resolvedConfigs.slice(2).forEach((entry) => {
    assert.equal(entry.local, true);
    assert.equal(entry.decimals, undefined);
    assert.equal(entry.color, undefined);
    assert.equal(entry.attribute, undefined);
    assert.equal(entry.name, undefined);
  });

  cardTools.updateSparklineRuntimeConfig();
  assert.equal(cardConfig.constants.seriesEvaluations, 1);
  assert.equal(tool.config.series[0].name, 'sensor.parent');
  cardTools.setSparklineEntityStates(resolvedConfigs, entities);
  const changedIndexes = cardEntities.updateSparklineEntities(resolvedConfigs, entities, [tool]);

  assert.deepEqual(changedIndexes, [2, 3, 4, 5, 6, 7, 8, 9]);
  assert.deepEqual(entities.slice(2, 6).map((entity) => entity.state), ['22.00', '22.00', '22', '11']);
  assert.deepEqual(entities.slice(6).map((entity) => entity.state), ['unavailable', 'unavailable', 'unavailable', 'unavailable']);
  assert.deepEqual(resolvedConfigs.slice(2).map((entry) => entry.source_entity_index), [1, 1, 1, 0, 1, 1, 1, 0]);
  assert.deepEqual(resolvedConfigs.slice(2).map((entry) => entry.decimals), [2, 2, 2, 1, 2, 2, 2, 1]);
  assert.equal(resolvedConfigs[9].sparkline_series_id, 'parent_room_bin');
  assert.equal(resolvedConfigs[9].sparkline_entity_type, 'duration');
  assert.deepEqual(resolvedConfigs.slice(2, 6).map((entry) => entry.color), ['#ef6c00', '#ef6c00', '#ef6c00', '#1565c0']);
  resolvedConfigs.slice(2).forEach((entry) => {
    assert.equal(entry.attribute, undefined);
    assert.equal(entry.name, undefined);
  });
  assert.deepEqual(entities.slice(2, 6).map((entity) => entity.attributes.source_entity_id), [
    'sensor.comparison', 'sensor.comparison', 'sensor.comparison', 'sensor.parent',
  ]);
  assert.deepEqual(entities.slice(2, 6).map((entity) => entity.attributes.unit_of_measurement), ['C', 'C', 'C', 'W']);
  assert.deepEqual(entities.slice(6).map((entity) => entity.attributes.unit_of_measurement), ['h', 'h', 'h', 'h']);
  assert.deepEqual(entities.slice(2, 6).map((entity) => entity.attributes.device_class), [
    'temperature', 'temperature', 'temperature', 'power',
  ]);
  assert.deepEqual(entities.slice(2, 6).map((entity) => entity.attributes.friendly_name), [
    'Comparison temperature', 'Comparison temperature', 'Comparison temperature', 'Parent power',
  ]);
  assert.deepEqual(entities.slice(2, 6).map((entity) => entity.attributes.sparkline_series_id), [
    undefined, 'comparison_room', 'comparison_room', 'parent_room',
  ]);
  assert.equal(cardConfig.constants.seriesEvaluations, 1);
  const paletteSources = [1, 1, 4, 0, 1, 1, 1, 0];
  paletteSources.forEach((sourceIndex, index) => {
    assert.strictEqual(cardEntities.paint.colorStops[index + 2], cardEntities.paint.colorStops[sourceIndex]);
  });
  assert.deepEqual(cardEntities.paint.colorStops[4], ColorStops.normalize(derivedStops, 'light'));

  // The ordinary presentation phase rebuilds entity config after publication.
  // It must use published series binding, without evaluating the series again.
  const presentationConfigs = cardEntities.buildRuntimeEntityConfigs(cardConfig, true, [tool]);
  assert.deepEqual(presentationConfigs.slice(2).map((entry) => entry.source_entity_index), [1, 1, 1, 0, 1, 1, 1, 0]);
  paletteSources.forEach((sourceIndex, index) => {
    assert.strictEqual(cardEntities.paint.colorStops[index + 2], cardEntities.paint.colorStops[sourceIndex]);
  });
  assert.deepEqual(cardEntities.paint.colorStops[4], ColorStops.normalize(derivedStops, 'light'));
  const publishedEntities = entities.slice(2);
  assert.deepEqual(cardEntities.updateSparklineEntities(presentationConfigs, entities, [tool]), []);
  publishedEntities.forEach((entity, index) => assert.strictEqual(entities[index + 2], entity));
  assert.equal(cardConfig.constants.seriesEvaluations, 1);

  for (const mode of ['dark', 'light']) {
    card.cardTheme.activeColorStopMode = mode;
    const sourceConfigs = cardEntities.buildRuntimeEntityConfigs(cardConfig, true);
    cardEntities.updateSparklineEntities(sourceConfigs, entities, [tool]);
    paletteSources.forEach((sourceIndex, index) => {
      assert.strictEqual(cardEntities.paint.colorStops[index + 2], cardEntities.paint.colorStops[sourceIndex]);
    });
    const rebuiltConfigs = cardEntities.buildRuntimeEntityConfigs(cardConfig, true, [tool]);
    assert.deepEqual(rebuiltConfigs.slice(2).map((entry) => entry.source_entity_index), [1, 1, 1, 0, 1, 1, 1, 0]);
    paletteSources.forEach((sourceIndex, index) => {
      assert.strictEqual(cardEntities.paint.colorStops[index + 2], cardEntities.paint.colorStops[sourceIndex]);
    });
    assert.deepEqual(cardEntities.paint.colorStops[4], ColorStops.normalize(derivedStops, mode));
    assert.equal(cardConfig.constants.seriesEvaluations, 1);
  }

  // A later source update may move the same named series to another entity.
  // Rebinding must follow current producer output, not the previous palette.
  for (const sourceIndex of [0, 1]) {
    cardConfig.constants.comparisonSource = sourceIndex;
    const sourceConfigs = cardEntities.buildRuntimeEntityConfigs(cardConfig, true);
    card.runtimeEntityConfigs = sourceConfigs;
    const evaluations = cardConfig.constants.seriesEvaluations;
    cardTools.updateSparklineRuntimeConfig();
    cardTools.setSparklineEntityStates(sourceConfigs, entities);
    cardEntities.updateSparklineEntities(sourceConfigs, entities, [tool]);
    assert.equal(sourceConfigs[2].source_entity_index, sourceIndex);
    assert.equal(sourceConfigs[3].source_entity_index, sourceIndex);
    assert.strictEqual(cardEntities.paint.colorStops[2], cardEntities.paint.colorStops[sourceIndex]);
    assert.strictEqual(cardEntities.paint.colorStops[3], cardEntities.paint.colorStops[sourceIndex]);
    const rebuiltConfigs = cardEntities.buildRuntimeEntityConfigs(cardConfig, true, [tool]);
    assert.equal(rebuiltConfigs[2].source_entity_index, sourceIndex);
    assert.equal(rebuiltConfigs[3].source_entity_index, sourceIndex);
    assert.strictEqual(cardEntities.paint.colorStops[2], cardEntities.paint.colorStops[sourceIndex]);
    assert.strictEqual(cardEntities.paint.colorStops[3], cardEntities.paint.colorStops[sourceIndex]);
    assert.deepEqual(cardEntities.paint.colorStops[4], ColorStops.normalize(derivedStops, 'light'));
    assert.equal(cardConfig.constants.seriesEvaluations, evaluations + 1);
  }
});

test('parent JavaScript selector inheritance matches static series without per-series reevaluation', (context) => {
  const series = [
    { id: 'primary', entity_index: 0 },
    { id: 'comparison', entity_index: 1 },
  ];
  const staticSource = makeSparklineSource(series);
  staticSource.sparkline.show.item_style = 'fixed';
  const staticConfig = SparklineGraphTool.translateConfig(staticSource);

  const selectorExpression = '[[[ constants.seriesEvaluations += 1; return "fixed"; ]]]';
  const dynamicSource = makeSparklineSource(series);
  dynamicSource.sparkline.show.item_style = selectorExpression;
  const fixture = createSparklineFixture(dynamicSource);
  const { cardConfig, tool, restoreWindow } = fixture;
  context.after(() => {
    if (tool.sparklineHistory) tool.sparklineHistory.disconnected();
    restoreWindow();
  });

  const inheritedSelectorPaths = [
    ['show', 'item_style'],
    ['line', 'show', 'item_style'],
    ['line', 'minmax', 'show', 'item_style'],
    ['area', 'show', 'item_style'],
    ['area', 'minmax', 'show', 'item_style'],
  ];
  inheritedSelectorPaths.forEach((path) => {
    assert.equal(path.reduce((value, key) => value[key], tool.sourceConfig.sparkline), selectorExpression);
  });

  tool.updateRuntimeConfig();

  assert.equal(cardConfig.constants.seriesEvaluations, inheritedSelectorPaths.length);
  assert.deepEqual(
    tool.config.series.map((entry) => inheritedSelectorPaths.map((path) => (
      path.reduce((value, key) => value[key], entry.sparkline)
    ))),
    staticConfig.series.map((entry) => inheritedSelectorPaths.map((path) => (
      path.reduce((value, key) => value[key], entry.sparkline)
    ))),
  );
  assert.deepEqual(
    tool.config.series.map((entry) => entry.sparkline.show.item_style),
    ['fixed', 'fixed'],
  );
});

test('dynamic Sparkline stays inert before publication and initializes from CardTools lifecycle state', (context) => {
  const expression = '[[[ constants.seriesEvaluations += 1; return [{ id: "temperature", entity_index: 1 }, { id: "humidity", entity_index: 0 }]; ]]]';
  const source = {
    id: 'first-publication',
    entity_index: 0,
    period: { real_time: true },
    sparkline: {
      show: { chart_type: 'line', legend: true },
    },
    series: expression,
  };
  const fixture = createSparklineFixture(source);
  const {
    card,
    cardTools,
    entities,
    entityConfigs,
    tool,
    restoreWindow,
  } = fixture;
  context.after(() => {
    if (tool.sparklineHistory) tool.sparklineHistory.disconnected();
    restoreWindow();
  });

  assert.equal(tool.sparklineSeries, undefined);
  assert.equal(tool.sparklineHistory, undefined);
  assert.equal(tool.requiresHassUpdate(), true);
  assert.equal(tool.hasPresentationChanged(), false);
  assert.equal(tool.renderSvg().strings.join(''), '');
  assert.equal(tool.render().strings.join(''), '');

  card.shadowRoot = {
    getElementById() {
      throw new Error('pointer DOM accessed before first config publication');
    },
  };
  cardTools.connected();
  cardTools.firstUpdated(new Map());
  cardTools.updatePalettePaint();
  cardTools.updateSparklinePresentation();
  cardTools.hassAvailable();
  assert.equal(tool.legendTextTools.length, 0);
  cardTools.disconnected();
  assert.equal(cardTools.connectedToCard, false);

  tool.updateRuntimeConfig();

  assert.equal(card.config.constants.seriesEvaluations, 1);
  assert.ok(tool.sparklineSeries instanceof SparklineSeries);
  assert.ok(tool.sparklineHistory);
  assert.equal(tool.sparklineHistory.connectedToCard, false);
  assert.deepEqual(tool.sparklineSeries.items.map((item) => item.id), ['temperature', 'humidity']);
  assert.ok(tool.primaryGraph.input);
  assert.equal(Object.hasOwn(tool.config, 'svg'), false);
  assert.equal(Object.hasOwn(tool, 'svg'), false);

  tool.setEntities(entityConfigs, entities);
  assert.strictEqual(tool.sparklineSeries.items[0].entity, entities[1]);
  assert.strictEqual(tool.sparklineSeries.items[1].entity, entities[0]);
  cardTools.connected();
  assert.equal(tool.sparklineHistory.connectedToCard, true);
  assert.equal(tool.requiresHassUpdate(), tool.sparklineHistory.requiresHassUpdate());
});

test('radial render composes enabled axes for line, area, dots and implicit radial barcode', () => {
  [
    ['radial', 'line'],
    ['radial', 'area'],
    ['radial', 'dots'],
    ['radial_barcode', 'sunburst'],
  ].forEach(([chartType, chartVariant]) => {
    const source = makeSparklineSource(undefined);
    source.id = 'render-' + chartType + '-' + chartVariant;
    delete source.series;
    source.period = { type: 'real_time' };
    source.sparkline.show = {
      ...source.sparkline.show,
      chart_type: chartType,
      chart_variant: chartVariant,
      axis: { x: true, y: true },
      grid: { x: true, y: true },
      tickmarks: { x: true, y: true },
      labels: { x: true, y: true },
    };

    const fixture = createSparklineFixture(source);
    const { tool, entities, entityConfigs, restoreWindow } = fixture;
    try {
      tool.updateRuntimeConfig();
      tool.setEntities(entityConfigs, entities);

      assert.equal(Object.hasOwn(tool.sourceConfig, 'series'), false);
      assert.equal(tool.config.series[0].id, 'default');
      assert.ok(tool.geometry.axisGraphs.primary.input);
      assert.doesNotThrow(() => tool.renderSvg());
    } finally {
      if (tool.sparklineHistory) tool.sparklineHistory.disconnected();
      restoreWindow();
    }
  });
});

test('implicit barcode and state-band inputs are not treated as explicit series restrictions', () => {
  ['barcode', 'state_bands'].forEach((chartType) => {
    const translated = SparklineGraphTool.translateConfig({
      id: 'implicit-' + chartType,
      entity_index: 0,
      period: { real_time: true },
      sparkline: { show: { chart_type: chartType } },
    });
    const series = new SparklineSeries(translated);

    assert.equal(translated.series.length, 1);
    assert.equal(translated.series[0].id, 'default');
    assert.equal(series.primaryItem.id, 'default');
    assert.strictEqual(series.primaryItem.config, translated.series[0]);
  });

  ['barcode', 'state_bands'].forEach((chartType) => {
    assert.throws(
      () => SparklineGraphTool.translateConfig({
        id: 'explicit-' + chartType,
        entity_index: 0,
        period: { real_time: true },
        sparkline: { show: { chart_type: chartType } },
        series: [{ id: 'explicit', entity_index: 0 }],
      }),
      /chart_type must be line, area, dots, bar or radial/,
    );
  });
});

test('whole-value JavaScript raw period overrides are rejected before Series construction', (context) => {
  const expression = '[[[ constants.seriesEvaluations += 1; return [{ id: "invalid-period", entity_index: 1, period: { calendar: { offset: 1 } } }]; ]]]';
  const fixture = createSparklineFixture(makeSparklineSource(expression));
  const { cardConfig, tool, restoreWindow } = fixture;
  context.after(() => {
    if (tool.sparklineHistory) tool.sparklineHistory.disconnected();
    restoreWindow();
  });

  assert.throws(
    () => tool.updateRuntimeConfig(),
    /period may only override rolling_window\.offset/,
  );
  assert.equal(cardConfig.constants.seriesEvaluations, 1);
  assert.equal(tool.sparklineSeries, undefined);
});

test('graded numeric ranges stay with GraphTool geometry', (context) => {
  const colors = [
    { value: 0, color: '#66bb6a' },
    { value: 50, color: '#f9a825' },
    { value: 100, color: '#d32f2f' },
  ];
  const source = {
    id: 'graded-ownership',
    entity_index: 0,
    period: { real_time: true },
    sparkline: {
      show: { chart_type: 'graded', chart_variant: 'rank_order' },
      color_stops: { colors },
    },
  };
  const fixture = createSparklineFixture(source);
  const { tool, restoreWindow } = fixture;
  context.after(() => {
    if (tool.sparklineHistory) tool.sparklineHistory.disconnected();
    restoreWindow();
  });

  tool.updateRuntimeConfig();

  assert.equal(tool.runtime.periodDurationAvailable, true);
  assert.deepEqual(tool.geometry.gradeValues, [0, 50, 100]);
  assert.deepEqual(
    tool.geometry.gradeRanks.map((rank) => [rank.rank, rank.value, rank.rangeMin, rank.rangeMax]),
    [
      [0, [0], [0], [50]],
      [1, [50], [50], [100]],
      [2, [100], [100], [Infinity]],
    ],
  );
  assert.strictEqual(tool.primaryGraph.gradeValues, tool.geometry.gradeValues);
  assert.strictEqual(tool.primaryGraph.gradeRanks, tool.geometry.gradeRanks);
  assert.equal(Object.hasOwn(tool, 'gradeValues'), false);
  assert.equal(Object.hasOwn(tool, 'gradeRanks'), false);
});

test('generated Sparkline schema accepts series arrays and whole-value JavaScript', () => {
  const schema = JSON.parse(readFileSync(
    new URL('../ai-card-builder/config-schema/generated/fhs.schema.json', import.meta.url),
    'utf8',
  ));
  const layoutSparkline = schema.$defs['layout.sparkline'];
  const seriesProperties = layoutSparkline.anyOf.flatMap((variant) => {
    const branches = [variant, ...(variant.allOf ?? [])];
    return branches.map((branch) => branch.properties?.series).filter(Boolean);
  });
  const seriesSchema = seriesProperties.find((property) => property.anyOf?.some((branch) => branch.type === 'array'));

  assert.ok(seriesSchema);
  assert.ok(seriesSchema.anyOf.some((branch) => (
    branch.type === 'array'
    && branch.items.$ref === '#/$defs/layout.sparklineSeries'
  )));
  assert.ok(seriesSchema.anyOf.some((branch) => branch.$ref === '#/$defs/common.javascript'));
});
