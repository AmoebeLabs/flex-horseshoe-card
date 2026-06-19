// Set sizes:
// If svg size is changed, change the font size accordingly.
// These two are related ;-) For font-size, 1em = 1%
const SCALE_DIMENSIONS = 1;
const SVG_DEFAULT_DIMENSIONS = 200 * SCALE_DIMENSIONS;
const SVG_DEFAULT_DIMENSIONS_HALF = SVG_DEFAULT_DIMENSIONS / 2;
const SVG_VIEW_BOX = SVG_DEFAULT_DIMENSIONS;
const FONT_SIZE = 12;

const DEFAULT_ZPOS = {
  rectangles: 100,
  circles: 200,
  horseshoes: 300,
  horseshoes_v2: 300,
  lines: 400,
  hlines: 400,
  vlines: 400,
  icons: 500,
  areas: 600,
  names: 700,
  states: 800,
};

const DEFAULT_RENDER_INDEX = {
  rectangles: 100000,
  circles: 200000,
  horseshoes: 300000,
  horseshoes_v2: 300000,
  lines: 400000,
  hlines: 400000,
  vlines: 400000,
  icons: 500000,
  areas: 600000,
  names: 700000,
  states: 800000,
};

// Round to nearest value
const round = (min, num, max) => (Math.abs(num - min) > Math.abs(max - num) ? max : min);

// Force angle between 0 and 360, or even more for angle comparisons!
const angle360 = (start, angle, end) => (start < 0 || end < 0 ? angle + 360 : angle);

// Size or range given by two values
const range = (value1, value2) => Math.abs(value1 - value2);

// const radianToDegrees = (radian) => (-radian / (Math.PI / 180));

export { SCALE_DIMENSIONS, SVG_DEFAULT_DIMENSIONS, SVG_DEFAULT_DIMENSIONS_HALF, SVG_VIEW_BOX, FONT_SIZE, DEFAULT_ZPOS, DEFAULT_RENDER_INDEX, round, angle360, range };
