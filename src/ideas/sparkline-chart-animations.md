# Sparkline Chart Animation Architecture

## Goal

Use the existing `sparkline.animate` flag to provide predictable introductory animations for bar, equalizer, line, area, dots, and barcode charts. The generic card `animations:` section remains unrelated.

Animations must begin only when the first definitive dataset is available. Existing SVG animation nodes must remain in the DOM so ordinary Home Assistant state updates do not restart the complete graph.

## Animation Baseline

After every `SparklineGraph.update()`, calculate the SVG y-coordinate for value zero with the graph engine's existing y-coordinate calculation. Clamp that coordinate to `Graph.drawArea`:

- A positive-only scale uses the bottom edge.
- A negative-only scale uses the top edge.
- A scale crossing zero uses the exact zero coordinate.

This single coordinate is the vertical animation baseline for bars, equalizer, line, area, min/max areas, and dots. When a graph crosses zero, positive values grow upward and negative values grow downward at the same time.

## Chart Behavior

### Bar

Animate both the mask rectangles and visible rectangles. Animate `height` from zero to the final height while `y` moves from the bar's own baseline to its final position. This prevents full-height bars from extending below the x-axis during animation.

### Equalizer

Animate each level vertically from the shared baseline to its final y-coordinate. Keep the existing mask and background rendering intact.

### Line and Area

Keep all existing paths, masks, gradients, and background rectangles. Place the visible masked output layers for line, area, and min/max together inside nested SVG transform groups:

1. Translate the group to the shared baseline.
2. Animate a vertical scale from `scale(1 0)` to `scale(1 1)`.
3. Translate the output layers back by the baseline coordinate.

The existing masks remain unchanged and the three visible layers share one transform. A mixed positive/negative graph therefore grows in both directions from zero.

### Dots

Animate each circle's `cy` from the shared baseline to its calculated point y-coordinate. Keep `cx` and `r` unchanged so circles remain round. Apply this to standalone dots and dots rendered with line or area charts.

### Barcode

Restore the example behavior by animating each barcode rectangle's `x` from `Graph.drawArea.x` to its final x-coordinate. Keep the transparent tooltip hit area static.

## Lifecycle

Render SVG animation elements only when `sparkline.animate` is enabled and definitive data exists:

- `real_time`: the first calculated series is definitive.
- History-backed modes: wait until `historySeries` has been fetched.

Lit reuses existing SVG nodes, so normal state updates alter geometry without replaying the introductory animation. A genuinely new calendar bar, dot, equalizer level, or barcode segment may animate when its DOM node is inserted. Updating an existing line or area path does not replay the entire path animation.

## Timing

- Bar, equalizer, line, area, min/max, and dots: `2s`.
- Barcode: `3s`.
- Use `calcMode='spline'`, `keyTimes='0; 1'`, and `keySplines='0.215 0.61 0.355 1'`.
- Use `fill='remove'`, `restart='whenNotActive'`, and `repeatCount='1'`.

## Compatibility

No public configuration is added:

```yaml
sparkline:
  animate: true
```

Do not modify grid, axes, labels, tooltip handling, hit areas, radial barcode, graded charts, or the generic `animations:` section.

## Verification

Test initial rendering and subsequent state updates for:

- Positive-only, negative-only, and zero-crossing line and area charts.
- Line and area with min/max enabled.
- Standalone dots, line with dots, and area with dots.
- Bar and equalizer regression behavior.
- Barcode movement from left to final position.
- Rolling window, current calendar, historical calendar, and real-time periods.
- A new calendar bin without replaying the complete existing graph.
- Chrome and Safari/iPhone.
- `sparkline.animate: false`.
- `npm run build`.
