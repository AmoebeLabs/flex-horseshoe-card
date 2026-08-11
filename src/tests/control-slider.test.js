import test from 'node:test';
import assert from 'node:assert/strict';
import ControlSlider from '../control-slider.js';

const createSlider = (overrides = {}) => {
  const slider = Object.create(ControlSlider.prototype);
  slider.config = {
    show: { item_variant: 'single', item_viz: 'linear', item_style: 'ha' },
    orientation: 'horizontal',
    width: 40,
    height: 10,
    svg: { xpos: 200, ypos: 200 },
    circular: {
      start_angle: -135,
      arc_degrees: 270,
      clockwise: true,
      radius: 12,
    },
    ...overrides,
  };
  slider.resolvedScale = { min: 0, max: 100, step: 0.5 };
  slider.activeValueIndex = 0;
  slider.sliderValues = slider.config.show.item_variant === 'range' ? [20, 80] : [50];
  slider.scheduleSliderRender = () => {};
  return slider;
};

test('snaps values to step and clamps at both scale bounds', () => {
  const slider = createSlider();

  assert.equal(slider.snapSliderValue(20.24), 20);
  assert.equal(slider.snapSliderValue(20.26), 20.5);
  assert.equal(slider.snapSliderValue(-10), 0);
  assert.equal(slider.snapSliderValue(120), 100);
});

test('maps horizontal and vertical SVG positions to the same scale', () => {
  const horizontal = createSlider();
  const vertical = createSlider({ orientation: 'vertical' });

  assert.equal(horizontal.svgPointToSliderValue({ x: 200, y: 200 }), 50);
  assert.equal(vertical.svgPointToSliderValue({ x: 200, y: 200 }), 50);
  assert.equal(horizontal.svgPointToSliderValue({ x: 120, y: 200 }), 0);
  assert.equal(vertical.svgPointToSliderValue({ x: 200, y: 180 }), 100);
});

test('maps points on a circular arc back to their slider values', () => {
  const slider = createSlider({ show: { item_variant: 'single', item_viz: 'circular', item_style: 'ha' } });
  const quarterPoint = slider.circularRatioToPoint(0.25, slider.getSliderGeometry().radius);
  const threeQuarterPoint = slider.circularRatioToPoint(0.75, slider.getSliderGeometry().radius);

  assert.equal(slider.svgPointToSliderValue(quarterPoint), 25);
  assert.equal(slider.svgPointToSliderValue(threeQuarterPoint), 75);
});

test('range thumbs stop at each other and never exchange roles', () => {
  const slider = createSlider({ show: { item_variant: 'range', item_viz: 'linear', item_style: 'ha' } });

  slider.activeValueIndex = 0;
  slider.applySliderPointerValue(90);
  assert.deepEqual(slider.sliderValues, [80, 80]);

  slider.sliderValues = [20, 80];
  slider.activeValueIndex = 1;
  slider.applySliderPointerValue(10);
  assert.deepEqual(slider.sliderValues, [20, 20]);
});

test('builds a complete path for a full circular arc', () => {
  const slider = createSlider({
    show: { item_variant: 'single', item_viz: 'circular', item_style: 'ha' },
    circular: {
      start_angle: 0,
      arc_degrees: 360,
      clockwise: true,
      radius: 12,
    },
  });

  assert.equal((slider.circularArcPath(0, 1).match(/ A /g) ?? []).length, 2);
});

test('constructs complete single and range configurations without runtime fallbacks', () => {
  const templates = { hasJavascriptTemplates: () => false };
  const card = {
    _calculateSvgCoordinatesInGroup: (config) => ({
      xpos: config.xpos,
      ypos: config.ypos,
    }),
  };
  const single = new ControlSlider(
    {
      id: 'single',
      entity_index: 0,
      xpos: 50,
      ypos: 50,
      value: { show: false },
    },
    0,
    templates,
    'card',
    card,
  );
  const range = new ControlSlider(
    {
      id: 'range',
      show: { item_variant: 'range', item_viz: 'linear', item_style: 'ha' },
      values: [{ entity_index: 0 }, { entity_index: 1 }],
      xpos: 50,
      ypos: 50,
      value: { show: false },
    },
    1,
    templates,
    'card',
    card,
  );
  const circular = new ControlSlider(
    {
      id: 'circular',
      entity_index: 0,
      xpos: 50,
      ypos: 50,
      show: { item_variant: 'single', item_viz: 'circular', item_style: 'ha' },
      value: { show: false },
    },
    2,
    templates,
    'card',
    card,
  );
  const wideCircularTrack = new ControlSlider(
    {
      id: 'wide-circular-track',
      entity_index: 0,
      xpos: 50,
      ypos: 50,
      show: { item_variant: 'single', item_viz: 'circular', item_style: 'ha' },
      circular: { track: { width: 8 } },
      value: { show: false },
    },
    3,
    templates,
    'card',
    card,
  );

  assert.deepEqual(single.config.values, [{ entity_index: 0, value: {} }]);
  assert.equal(single.config.value.position, 'top');
  assert.equal(range.config.values.length, 2);
  assert.deepEqual(range.config.values[0].value, {});
  assert.equal(circular.config.value.position, 'center');
  assert.equal(circular.config.circular.thumb.length, 2.5);
  assert.equal(wideCircularTrack.config.circular.thumb.length, 4);
});

test('keeps only the background track for non-numeric entity states', () => {
  const templates = { hasJavascriptTemplates: () => false };
  const card = {
    entities: [{
      state: 'unavailable',
      attributes: { min: 0, max: 100, step: 1 },
    }],
    resolvedEntityConfigs: [{}],
    _calculateSvgCoordinatesInGroup: (config) => ({
      xpos: config.xpos,
      ypos: config.ypos,
    }),
  };
  const slider = new ControlSlider(
    {
      id: 'availability',
      entity_index: 0,
      xpos: 50,
      ypos: 50,
      value: { show: false },
    },
    0,
    templates,
    'card',
    card,
  );

  slider.setState(card.entities[0], card.resolvedEntityConfigs[0]);
  assert.equal(slider.sliderAvailable, false);

  card.entities[0].state = '40';
  slider.setState(card.entities[0], card.resolvedEntityConfigs[0]);
  assert.equal(slider.sliderAvailable, true);
  assert.deepEqual(slider.sliderValues, [40]);
});

test('reads and updates a configured numeric entity attribute', () => {
  const templates = { hasJavascriptTemplates: () => false };
  const card = {
    entities: [{
      state: 'on',
      attributes: { brightness: 128 },
    }],
    resolvedEntityConfigs: [{ attribute: 'brightness' }],
    _calculateSvgCoordinatesInGroup: (config) => ({
      xpos: config.xpos,
      ypos: config.ypos,
    }),
  };
  const slider = new ControlSlider(
    {
      id: 'brightness',
      entity_index: 0,
      xpos: 50,
      ypos: 50,
      scale: { min: 0, max: 255, step: 1 },
      value: { show: false },
    },
    0,
    templates,
    'card',
    card,
  );

  slider.setState(card.entities[0], card.resolvedEntityConfigs[0]);
  assert.equal(slider.sliderAvailable, true);
  assert.deepEqual(slider.sliderValues, [128]);

  delete card.entities[0].attributes.brightness;
  slider.setState(card.entities[0], card.resolvedEntityConfigs[0]);
  assert.equal(slider.sliderAvailable, false);
});
