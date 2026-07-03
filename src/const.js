// Set sizes:
// If svg size is changed, change the font size accordingly.
// These two are related ;-) For font-size, 1em = 1%
const SCALE_DIMENSIONS = 1;
const SVG_DEFAULT_DIMENSIONS = 200 * SCALE_DIMENSIONS;
const SVG_DEFAULT_DIMENSIONS_HALF = SVG_DEFAULT_DIMENSIONS / 2;
const SVG_VIEW_BOX = SVG_DEFAULT_DIMENSIONS;
const FONT_SIZE = 12;

const DEFAULT_ZPOS = {
  arcs: 100,
  rectangles: 200,
  circles: 300,
  horseshoes: 400,
  horseshoes_v2: 400,
  lines: 500,
  hlines: 500,
  vlines: 500,
  icons: 600,
  sparklines: 650,
  areas: 700,
  names: 800,
  states: 900,
};

const DEFAULT_RENDER_INDEX = {
  arcs: 100000,
  rectangles: 200000,
  circles: 300000,
  horseshoes: 400000,
  horseshoes_v2: 400000,
  lines: 500000,
  hlines: 500000,
  vlines: 500000,
  icons: 600000,
  sparklines: 650000,
  areas: 700000,
  names: 800000,
  states: 900000,
};

// Round to nearest value
const round = (min, num, max) => (Math.abs(num - min) > Math.abs(max - num) ? max : min);

// Force angle between 0 and 360, or even more for angle comparisons!
const angle360 = (start, angle, end) => (start < 0 || end < 0 ? angle + 360 : angle);

// Size or range given by two values
const range = (value1, value2) => Math.abs(value1 - value2);

// const radianToDegrees = (radian) => (-radian / (Math.PI / 180));

export { SCALE_DIMENSIONS, SVG_DEFAULT_DIMENSIONS, SVG_DEFAULT_DIMENSIONS_HALF, SVG_VIEW_BOX, FONT_SIZE, DEFAULT_ZPOS, DEFAULT_RENDER_INDEX, round, angle360, range };
