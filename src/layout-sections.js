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
  'states',
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
]);

/** Shape sections supported inside static SVG clip and mask definitions. */
export const DEFINITION_SHAPE_SECTIONS = Object.freeze(['rectangles', 'circles', 'arcs']);

/** Visible item sections normalized by the common item color-stop path. */
export const ITEM_COLOR_STOP_SECTIONS = Object.freeze(
  [...VISIBLE_LAYOUT_SECTIONS],
);
