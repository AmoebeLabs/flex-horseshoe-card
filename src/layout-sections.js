/**
 * Central registry for visible layout item sections.
 *
 * Every config-time pass that handles normal rendered layout items must use
 * this list so sections cannot silently miss ids, same_as, entity resolution,
 * JavaScript metadata, color stops, clips or masks.
 */
export const VISIBLE_LAYOUT_SECTIONS = Object.freeze([
  'horseshoes',
  'horseshoes_v2',
  'horseshoes_v3',
  'states',
  'texts',
  'names',
  'areas',
  'circles',
  'arcs',
  'rectangles',
  'lines',
  'hlines',
  'vlines',
  'icons',
  'sparklines',
  'controls',
]);

/** Shape sections supported inside static SVG clip and mask definitions. */
export const DEFINITION_SHAPE_SECTIONS = Object.freeze(['rectangles', 'circles', 'arcs']);
