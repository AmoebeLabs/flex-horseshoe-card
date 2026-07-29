# Horseshoe Colorstop and Linear Gradient Arc Rendering

## Context

GitHub PR #317, "Fix #186: colorstopgradient renders smooth gradient following the arc", correctly identifies the problem reported in issue #186: `colorstopgradient` renders one solid color instead of a smooth gradient that follows the horseshoe.

## Root Cause

Before this change, `colorstop` and `colorstopgradient` used the same single state arc. `Colors.calculateStrokeColor()` calculated one interpolated color at the current value, after which the entire active arc received that color. This produced a solid horseshoe instead of the intended gradient from the scale start to the current value.

## Proposed Approach

PR #317 demonstrates the correct visual principle by approximating the curved gradient with multiple short SVG arcs. This implementation uses that approach as its foundation and integrates it with the existing FHS geometry, bidirectional modes, path caching, and direct DOM animation architecture.

The scope also applies the same curved-gradient technique to `lineargradient`. This restores its original value-dependent behavior and gives both gradient styles the same smooth rendering quality, while preserving their different meaning.

### Enhancements to PR #317

PR #317 establishes the core approach of drawing multiple short arcs to create a gradient that follows the horseshoe. The implementation builds on that approach with the following enhancements:

- Each micro-arc uses its own SVG `linearGradient` instead of one solid midpoint color. The gradient points from the centerline at the start of the arc to the centerline at its end, following the local direction of the horseshoe.
- The start and end colors are calculated for the exact values at each segment boundary. The end color of one segment therefore equals the start color of the next, producing a continuous gradient without separate color bands.
- Adjacent micro-arcs overlap by 50% of their angular span. The overlap continues with the shared boundary color and prevents visible sub-pixel antialiasing seams at normal and reduced browser zoom levels.
- Segment density is based on visible arc length instead of a fixed count of sixty. Short arcs use fewer segments, while large radii and longer arcs automatically receive enough segments to remain smooth.
- The complete `colorstopgradient` layer remains cacheable behind an active-state clip. State animation changes the visible range without rebuilding every gradient segment.
- The same local-gradient rendering technique is also applied to `lineargradient`, while preserving the different color behavior of that style.

## Required Behavior

`colorstopgradient` renders the configured color-stop scale as a smooth gradient that follows the horseshoe curve. The gradient is fixed to the complete scale rather than recalculated for the current value.

For a scale from `0` to `100` with blue at `0`, yellow at `50`, and red at `100`, the complete gradient always remains:

```text
0                 50                 100
blue  ->  yellow  ->  red
```

At value `50`, only the blue-to-yellow part is visible and the active endpoint is exactly yellow. No red from the inactive range may become visible. A state change only changes how much of the fixed gradient is exposed.

The horseshoe styles must behave as follows:

| Style               | Behavior                                                                                               |
| ------------------- | ------------------------------------------------------------------------------------------------------ |
| `fixed`             | Unchanged                                                                                              |
| `autominmax`        | Unchanged                                                                                              |
| `lineargradient`    | Smooth transition from its selected start color to its selected end color across the current horseshoe |
| `colorstop`         | One solid color selected for the current value                                                         |
| `colorstopsegments` | Existing discrete color-stop segments                                                                  |
| `colorstopgradient` | Smooth curved gradient clipped to the active value range                                               |

The short internal arcs used to approximate the curved gradient are an implementation detail of `colorstopgradient`. They do not change or reuse the public `colorstopsegments` behavior.

## Colorstopgradient Geometry

Build the complete `colorstopgradient` layer for the full configured scale. Its geometry and colors remain cacheable until the scale, color stops, horseshoe geometry, active theme, or evaluated runtime configuration changes.

Use the following values as stable gradient boundaries:

- scale minimum and maximum;
- every configured color-stop value inside the scale.

Convert every boundary through `geometry.valueToAngle()`. Never calculate angles directly from a linear percentage. This preserves identical geometry for:

- `linear` scales;
- `spline` scales;
- `splineorg` scales;
- normal bars;
- `bidirectional` bars;
- `bidirectional_symmetrical` bars;
- `bidirectional_linear` bars.

## Automatic Gradient Density

Color-stop values are mandatory boundaries, but they may be too far apart to produce a smooth gradient. Determine that from visible centerline arc length rather than value distance:

```text
arcLength = radius * abs(endAngle - startAngle) * PI / 180
```

Subdivide an interval evenly until every resulting micro-arc has a maximum centerline length of six SVG units. This makes density follow the actual rendered geometry. Compressed spline intervals receive fewer arcs and expanded intervals receive more. A short ten-degree arc therefore uses only a few paths instead of a fixed sixty.
A deliberately large radius also remains correct. With a radius of `5000` and an arc of `0.3` degrees, the centerline is approximately `26.2` SVG units long. Recursive subdivision therefore produces enough short paths to follow the visible curve, and the complete color-stop scale still runs across the visible arc.

Do not add a public density setting. The user selects a gradient style and FHS determines the required drawing density automatically. A configurable override can be considered later only if visual testing demonstrates a real need.

Each micro-arc receives its own `linearGradient` in `userSpaceOnUse`. The gradient runs from the centerline point at the arc start to the centerline point at the arc end. Its stops use the exact interpolated colors at `startValue` and `endValue`. Because each arc is short, its chord closely follows the local curve while the joined gradients remain continuous.

Adjacent micro-arcs overlap by half of the local micro-arc span. The overlap uses the padded endpoint color of the local gradient, which matches the start color of the next gradient and hides sub-pixel antialiasing seams without creating a color band.

## Active State Clipping

Render the complete gradient as a static path layer and expose it through one dynamic active-state clip:

- normal mode clips from the scale minimum to the current value;
- bidirectional modes clip between zero and the current value;
- positive and negative values use the existing state geometry and zero mapping;
- the clip value always passes through `geometry.valueToAngle()`.

The gradient micro-arcs do not move during state animation. The existing animator updates only the clip path through direct DOM manipulation. Do not request a Lit render for animation frames.

The active clip uses the configured state start and end linecaps through the same closed band-path builder as the other horseshoe state styles. No separate circles or cap elements are rendered.

## Lineargradient Extension

The stable `v5.4.7` horseshoe recalculated the `lineargradient` stop offset from the normalized current value. During the v2 renderer migration that calculation became a hardcoded `0%`, so the gradient stopped adapting to short active arcs.

Restore the original active-range behavior with the same local-gradient drawing technique used for `colorstopgradient`. Unlike `colorstopgradient`, this gradient is not fixed to scale values. Its complete start-to-end color transition is distributed between the start and end of the current horseshoe whenever the value changes.

In normal mode, use the first and last configured color stops. Intermediate stops do not affect `lineargradient`; they remain available to the other color-stop styles.

For bidirectional modes, split the configured color-stop range at zero. The negative side runs from the first negative endpoint color to the color at zero; the positive side runs from the color at zero to the last positive endpoint color. An explicit zero stop supplies that shared color. Without one, calculate it through the existing smooth color-stop interpolation between the surrounding stops. A scale extending below or above zero must contain at least one color stop on that respective side; reject the configuration clearly when such an anchor is missing.

Use an adaptive number of visible micro-arcs based on the active centerline length. Keep a stable maximum path and gradient pool based on the complete configured arc so animation frames can update existing DOM nodes without a Lit render, even when the adaptive visible segment count changes. Every visible micro-arc receives its current geometry and relative start/end colors; unused pool entries render an empty path.

Apply the same six-unit maximum centerline length and fifty-percent overlap. Update path geometry, local gradient coordinates, local gradient colors, and group-level state styles directly during value animation. This restores correct behavior for small values while making the gradient follow normal, full-circle, spline, and bidirectional arc geometry accurately.

## Renderer Integration

Use a dedicated full-scale `colorstopgradient` path builder alongside the existing state and scale path builders. Cache its path definitions through the horseshoe path-item cache. Pass the cached gradient items to the state renderer only when `show.horseshoe_style` is `colorstopgradient`.

The renderer creates:

1. a clip definition containing the current active state band with its configured linecaps;
2. the cached full-scale micro-arcs and their local SVG gradients inside a styled group using that clip.

For `colorstopgradient`, the direct state DOM updater changes only the clip path. For `lineargradient`, it updates the existing path and gradient pool because its complete transition follows the current horseshoe. Other horseshoe styles continue through their existing state-path rendering and animation flow.

JavaScript-generated color stops, scale changes, and theme changes pass through runtime configuration and cache invalidation. They rebuild the cached `colorstopgradient` layer. Ordinary entity state changes only update its active clip. `lineargradient` reuses its stable DOM pool and updates that pool directly when its active range changes.

## Verification

Verify the implementation visually and through the existing build on representative configurations:

- 10-degree, 260-degree, and 359.999-degree arcs;
- values at minimum, maximum, zero, between stops, and exactly on every color stop;
- normal and all three bidirectional modes with positive and negative values;
- linear, spline, and splineorg scales;
- identical gradient geometry with major ticks, minor ticks, or no ticks;
- butt and round start/end caps;
- increasing and decreasing state animations;
- CSS-variable colors, palette changes, theme changes, and JavaScript-generated color stops;
- multiple horseshoes on one card to confirm unique clip identifiers;
- absence of visible seams between micro-arcs;
- no Lit render during animation frames;
- no behavioral changes to `colorstop`, `colorstopsegments`, `fixed`, or string-state modes; restored active-range behavior for `lineargradient`.

Run `npm run build` after implementation and compare the visual result with the intent demonstrated by PR #317.
