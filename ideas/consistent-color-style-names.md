# Consistent color style names

## Goal

Flexible Horseshoe Card currently uses some color style names for different visual results. In
particular, `colorstopgradient` can mean either one interpolated color or an
actual gradient, while `colorstop` can mean either one threshold color or a
complete set of hard color-stop segments.

The migration is deliberately split into two steps. Step 1 only renames public
configuration selectors and their existing code paths. It must not change any
color calculation, SVG geometry, animation, caching, or graph-engine behavior.
Step 2 adds the genuinely new gradient capabilities after the renamed existing
styles have been verified visually.

## Final color families

| Style                   | Visual result                                                               |
| ----------------------- | --------------------------------------------------------------------------- |
| `fixed`                 | One configured color                                                        |
| `autominmax`            | One automatically interpolated color between the minimum and maximum colors |
| `minmaxgradient`        | A continuous min/zero/max gradient over the active range                    |
| `colorstop`             | One hard color-stop color for the current value                             |
| `colorstopinterpolated` | One interpolated color for the current value                                |
| `colorstopsegments`     | Separate solid sections at the color-stop positions                         |
| `lineargradient`        | All configured colors distributed evenly over the rendered range            |
| `colorstopgradient`     | A continuous gradient using the numeric color-stop positions                |

Not every renderer supports every style. Individual SVG items use the
single-color styles. Full scale bands and tracks use the spatial segment and
gradient styles.

## Step 1: rename existing behavior

The following changes are configuration migrations only. The implementation
behind every renamed selector remains unchanged.

| Configuration context                 | Before                            | After                               | Behavior                                                 |
| ------------------------------------- | --------------------------------- | ----------------------------------- | -------------------------------------------------------- |
| Horseshoe state                       | `horseshoe_style: lineargradient` | `horseshoe_style: minmaxgradient`   | Existing active min/zero/max gradient                    |
| Horseshoe state                       | `horseshoe_style: autominmax`     | `horseshoe_style: autominmax`       | No migration; existing single interpolated min/max color |
| Layout items and multipart text       | `item_style: colorstopgradient`   | `item_style: colorstopinterpolated` | Existing single interpolated color                       |
| Layout item paint dictionary          | `colorstopgradient:`              | `colorstopinterpolated:`            | Existing fill/stroke selection                           |
| Tick colors                           | `color_mode: colorstopgradient`   | `color_mode: colorstopinterpolated` | Existing interpolated tick color                         |
| Horseshoe scale                       | `scale_style: colorstop`          | `scale_style: colorstopsegments`    | Existing hard scale sections                             |
| Horseshoe, tick, and label background | `*_background: colorstop`         | `*_background: colorstopsegments`   | Existing hard background sections                        |
| Bar/equalizer track                   | `item_style: colorstop`           | `item_style: colorstopsegments`     | Existing hard full-scale track                           |
| Bar/equalizer track paint dictionary  | `colorstop:`                      | `colorstopsegments:`                | Existing fill/stroke selection                           |

These configurations keep their existing names and behavior:

- `fixed`;
- one-value `colorstop` on layout items and horseshoe state;
- horseshoe `colorstopsegments`;
- genuine spatial `colorstopgradient` rendering;
- `sparkline.colorstops_transition: hard|smooth`.

The old `colorstop_gradient` layout-item alias is removed. Replace it with an
explicit `show.item_style` and matching paint dictionary.

### Layout item migration

```yaml
# Before
show:
  item_style: colorstopgradient
colorstopgradient:
  fill: true
  stroke: false

# After
show:
  item_style: colorstopinterpolated
colorstopinterpolated:
  fill: true
  stroke: false
```

### Horseshoe migration

```yaml
# Before: existing active gradient
show:
  horseshoe_style: lineargradient

# After: identical existing active gradient
show:
  horseshoe_style: minmaxgradient
```

```yaml
# Existing single interpolated state color remains unchanged
show:
  horseshoe_style: autominmax
```

### Full scale-band migration

```yaml
# Before
show:
  scale_style: colorstop
  horseshoe_background: colorstop
  tick_background: colorstop
  label_background: colorstop

# After
show:
  scale_style: colorstopsegments
  horseshoe_background: colorstopsegments
  tick_background: colorstopsegments
  label_background: colorstopsegments
```

### Sparkline track migration

```yaml
# Before
background:
  show:
    item_style: colorstop
  colorstop:
    fill: true
    stroke: false

# After
background:
  show:
    item_style: colorstopsegments
  colorstopsegments:
    fill: true
    stroke: false
```

After implementing step 1, build and lint Flexible Horseshoe Card. Update test card configurations
using this table and verify that their output is visually identical before any
new style is introduced.

## Step 2: add new spatial gradients

Step 2 starts only after step 1 has been verified.

- Extend `autominmax` with the same min/zero/max dual-mode color selection used by `minmaxgradient`.
- Add a new horseshoe `lineargradient` that distributes all configured colors
  evenly over the active horseshoe. Numeric color-stop positions are ignored.
- Recalculate its paths and local SVG gradients for every state and animated
  display-value update.
- Preserve zero as the shared start for bidirectional gradient modes and use the
  relevant negative or positive color sequence on each side.
- Keep `colorstopgradient` fixed to numeric scale positions and reveal it with
  the existing active-state clip.
- Support `none`, `fixed`, `colorstopsegments`, `lineargradient`, and
  `colorstopgradient` on full horseshoe scale/background bands and static
  bar/equalizer tracks.
- Keep `SparklineGraph` unchanged. The graph tool continues to supply concrete
  colors, threshold lists, and gradient offsets.

### Step 2 implementation

The active `minmaxgradient` and `lineargradient` styles share the existing
adaptive horseshoe path pool. Every short arc receives a local SVG linear
gradient in the direction of that arc. Adjacent arcs overlap by 50% to prevent
anti-aliasing gaps without introducing flat midpoint-color bands.

Their color sources remain deliberately different:

- `minmaxgradient` interpolates between the effective minimum, zero, and maximum
  colors;
- `lineargradient` distributes all applicable colors over normalized `0..1`
  positions on the active arc and ignores numeric stop values;
- `colorstopgradient` retains numeric stop values, scale mapping, and spline
  mapping, and reveals the cached full gradient through the state clip.

A spline therefore still changes the active endpoint of `lineargradient`, but
not its internal color distribution. The same spline changes both geometry and
color positions for `colorstopgradient`.

Full horseshoe scale and background bands use the same static path and local
gradient builder. Bar tracks generate concrete, evenly spaced SVG stops for
`lineargradient`; equalizer tracks sample the same normalized color sequence by
bucket index. Numeric and logarithmic graph mapping remains exclusive to
`colorstopgradient`. No color-style knowledge is added to `SparklineGraph`.

Real-time bar and equalizer graphs pass the default color-stop scale to the
engine as generic `y_axis.lower_bound` and `y_axis.upper_bound` values. Bounds
are applied before axis geometry is built, so foreground geometry, tracks,
grid, ticks, and labels share one fixed range. Other numerical graphs can use
the same paired bounds; omitting both retains the automatic data range.

## Sparkline hard and smooth transitions

`sparkline.colorstops_transition` remains a transition policy because one
setting intentionally produces different representations for different graph
elements:

| Renderer                                 | `hard`                | `smooth`                          |
| ---------------------------------------- | --------------------- | --------------------------------- |
| Individual dot, bar, or equalizer bucket | One `colorstop` color | One `colorstopinterpolated` color |
| Gradient over a complete scale           | `colorstopsegments`   | `colorstopgradient`               |

This translation belongs to `sparkline-graph-tool.js`. The graph engine only
receives normalized colors and offsets and does not need color-style knowledge.

## Verification

- Run `npm run build` and `npm run lint` after each step.
- Verify step 1 with the same states before and after the YAML migration.
- Cover normal, bidirectional, spline, and 360-degree horseshoes.
- Cover fill and stroke coloring on shapes, entities, text parts, and ticks.
- Cover real-time and historical bar/equalizer tracks with both `hard` and
  `smooth` sparkline transitions.
- Verify in step 2 that `lineargradient` follows the active range while
  `colorstopgradient` remains anchored to numeric scale positions.
