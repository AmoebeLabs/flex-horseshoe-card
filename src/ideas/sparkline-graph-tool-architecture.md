# FHS Sparkline Graph Tool - Architecture and Implementation Notes

## Main Goal

The existing SAK implementation is the starting point.

**`sparkline-graph.js` should be reused as close to 1:1 as possible.**

This is not a redesign, optimization pass, or rewrite. The goal is to reuse the
working graph calculation code and fit it into the existing FHS tool model.

## Scope

The FHS sparkline tool is intentionally small.

Supported first display outcomes:

- line only
- area only
- line and area together

Prefer SAK-compatible naming for configuration. The visible outcome may be
"line and area together", but that does not require inventing a new graph type
if the existing SAK config can express it.

Out of scope for the first implementation:

- bar charts
- equalizer charts
- graded charts
- barcode charts
- radial barcode charts
- legends
- axes as a full charting subsystem
- multi-series charts
- tooltips as a first implementation step

This tool should add compact history context to FHS cards. It should not become
a replacement for Mini Graph Card or the full SAK graph tool.

This scope is a first delivery boundary only. It must not block later reuse of
the existing SAK graph modes. The implementation should keep SAK naming,
configuration concepts, and engine behavior where possible so later additions
such as bars, graded backgrounds, barcode, or radial barcode can be enabled
without changing the underlying model again.

## Do Not Redesign

During implementation, do not replace or redesign these parts:

- no canvas
- no chart library
- no new SVG architecture
- no new rendering pipeline
- no new entity pipeline
- no optimization because it "looks cleaner"
- no helper structures that replace existing working code
- no simplification of existing graph calculation logic
- no alternate mask/render approach

The starting point is:

**extend and adapt existing code only where FHS integration requires it.**

When a concept already exists in SAK, keep the SAK name unless there is a direct
conflict with established FHS naming. Do not invent a parallel FHS concept for
the same behavior.

## Reuse Strategy

### `sparkline-graph.js`

Reuse this file as a calculation engine.

Expected reusable responsibilities:

- group history samples into buckets
- normalize values
- calculate min/max bounds
- calculate graph coordinates
- calculate line paths
- calculate area paths
- calculate point lists
- calculate gradients where the existing code already does so

The current file also contains methods for bars, equalizer, graded, barcode, and
radial barcode output. Those methods can remain in the engine if that keeps the
file close to the SAK source, but the first FHS tool should not expose them.

Do not remove or rename unused engine methods just because the first FHS wrapper
does not call them. Keeping the engine complete makes future graph modes easier
to enable.

### `sparkline-graph-tool.js`

The SAK tool itself should not be ported 1:1.

Reason: the SAK tool is a full renderer and contains SAK-specific concepts:

- SAK classes and styles
- chart types that FHS will not expose
- tooltip handling
- barcode/equalizer/radial rendering
- SAK-specific entity and graph visibility handling
- SAK-specific color stop handling

For FHS, create a small tool wrapper that follows the same setup as the existing
FHS layout tools:

- extends `BaseTool`
- has a static `setConfig()`
- receives config through `layout.sparklines`
- uses existing FHS coordinate helpers
- uses existing FHS `styles` handling
- uses existing FHS `gradient(...)` references
- uses existing FHS mask/clip wrapping through `BaseTool.renderItemLayers()`
- participates in normal zpos ordering

The wrapper should call `SparklineGraph` for calculation and only render the
selected FHS display mode.

The wrapper should be thin. It may translate FHS layout position, zpos,
templates, masks/clips, and style dictionaries, but it should not reinterpret
graph semantics that already exist in SAK.

## Proposed YAML

```yaml
layout:
  gradients:
    temperature-history:
      type: linear
      x1: 0
      y1: 0
      x2: 0
      y2: 100
      stops:
        - offset: 0
          color: '#e53935'
        - offset: 50
          color: '#fdd835'
        - offset: 100
          color: '#1e88e5'

  sparklines:
    - entity_index: 0
      xpos: 50
      ypos: 78
      width: 70
      height: 18
      sparkline:
        show:
          chart_type: area
      history:
        period: today
        refresh_interval: 5min
      line:
        styles:
          - stroke: var(--primary-text-color)
          - stroke-width: 1.2
          - fill: none
      area:
        styles:
          - fill: gradient(temperature-history)
          - opacity: 0.35
```

## History

Default history behavior:

- period: today
- start: 00:00 local time
- end: now
- visual x-scale: 00:00 to 24:00
- default refresh interval: 5 minutes

This means:

- data is fetched only until now;
- the visual graph keeps the full day width;
- ticks do not shift during the day;
- the graph remains visually stable.

If `history` is omitted, the tool behaves as if this was configured:

```yaml
history:
  period: today
  refresh_interval: 5min
```

Implementation note: defaults belong in the config/constructor boundary, not in
the rendering path.

## Rendering Model

The FHS renderer should use the same SVG idea as SAK:

1. Use `SparklineGraph` to calculate the line and area paths.
2. Render a mask from the graph path.
3. Render a rectangle behind the mask.
4. Fill that rectangle with normal FHS styles or `gradient(...)`.

Line rendering:

```svg
<mask id="line-mask">
  <path d="..." stroke="white" fill="none" />
</mask>

<rect fill="gradient(...)" mask="url(#line-mask)" />
```

Area rendering:

```svg
<mask id="area-mask">
  <path d="..." fill="white" />
</mask>

<rect fill="gradient(...)" mask="url(#area-mask)" />
```

For a plain line, the tool can also render the path directly with normal stroke
styles. The mask approach is useful when the line itself needs a gradient fill.

## FHS Tool Requirements

The tool must fit the same architecture as existing FHS tools:

- config section: `layout.sparklines`
- class name: `SparklineTool` or `SparklineGraphTool`
- source file: `sparkline-tool.js` or `sparkline-graph-tool.js`
- base class: `BaseTool`
- zpos section: `sparklines`
- animation section: `sparklines`
- render output wrapped by `renderItemLayers()`
- render styles resolved through `getRenderStyles()`
- no custom style pipeline
- no custom gradient registry
- no custom mask/clip registry

The tool may have internal SVG ids for path masks. Those ids must include the
FHS `cardId` and item index to stay card-instance safe.

## Statistics As Derived Graph Entities

Statistics should be calculated from the same dataset:

- minimum
- average
- maximum

No second history request.
No second dataset.

The statistics are derived values from the graph's main entity. Their runtime
configuration should inherit from, or be derived from, the main entity config so
the user does not have to duplicate entity metadata. That includes normal entity
concepts such as name, icon, unit, decimals, color stops, derived state, and
future style behavior where that makes sense.

The important rule is that statistics should not need their own renderer. Once
they are available as runtime values, existing `state`, `name`, `icon`, style,
color, and template logic should be able to consume them just like normal
entities.

Access must be consistent with Home Assistant entity ids and existing FHS tool
config. The graph statistics are exposed as local entity-like objects with the
`fhs_sparkline` domain. There is no extra reference key and no extra dot hierarchy.

Every sparkline has an `id`. The generated graph entities use that id and the
statistic name in the object id:

```text
fhs_sparkline.<sparkline_id>_min
fhs_sparkline.<sparkline_id>_avg
fhs_sparkline.<sparkline_id>_max
```

Example:

```yaml
sparklines:
  - id: temperature_history
    entity_index: 0

states:
  - entity: fhs_sparkline.temperature_history_min
    xpos: 25
    ypos: 82
  - entity: fhs_sparkline.temperature_history_avg
    xpos: 50
    ypos: 82
  - entity: fhs_sparkline.temperature_history_max
    xpos: 75
    ypos: 82
```

This keeps rendering generic. Existing state/name/icon tools can keep using the
normal `entity` key. Entity resolving only needs to understand that `fhs_sparkline.*` is
a local FHS entity domain backed by graph statistics, not a Home Assistant
entity from `hass.states`.

The generated graph entities are runtime aliases, not static copied state
objects. The alias relation is known from config, but the final HA-like state
object must be rebuilt whenever FHS processes new `hass` data or refreshed graph
history.

Config-time alias metadata:

```js
localEntityAliases['fhs_sparkline.temperature_history_avg'] = {
  source_entity_index: 0,
  graph_id: 'temperature_history',
  statistic: 'avg',
};
```

Runtime state object creation:

```text
source_entity_index
-> config.entities[source_entity_index].entity
-> hass.states[source_entity_id]
-> copy current HA source state object
-> override entity_id with fhs_sparkline.<id>_<stat>
-> override state with current graph statistic value
-> optionally override friendly_name for min/avg/max
-> store in localStates[fhs_sparkline.<id>_<stat>]
-> expose through the normal internal entity_index pipeline
```

The copied source state object keeps the normal HA metadata alive:

- unit of measurement
- device class
- state class
- icon behavior
- attributes used by formatting
- future derived-state and color-stop behavior

Only the local entity id, statistic state value, and optional display name are
overridden. This is why graph statistics can use existing render code without
changes in the state/name/icon tools.

## Axes And Grid

Axes are useful, but they should not turn the tool into a full charting system.

Possible later additions:

- x-axis major ticks
- x-axis minor ticks
- x-axis labels
- y-axis major ticks
- y-axis labels
- grid lines

For `period: today`:

- x-scale = 00:00 to 24:00
- data = 00:00 to now

This keeps the visual position stable during the day.


## Pointer And Touch Reuse

`slider-pointer-example.js` contains the pointer/mouse/touch behavior that should
be reused for sparkline interaction where possible.

The following parts are especially relevant and should be copied as close to 1:1
as the FHS sparkline wrapper allows:

- `mouseEventToPoint(e)` using `createSVGPoint()` and `getScreenCTM().inverse()`
  to translate browser client coordinates to SVG coordinates;
- separate `touchstart` and `mousedown` start handlers;
- window-level `pointermove` and `pointerup` listeners during active interaction;
- `e.preventDefault()` while interacting;
- the Safari notes and event strategy, because replacing it with normal
  `pointerdown` broke dragging on Safari in the slider implementation;
- `requestAnimationFrame` driven visual updates while the pointer is active;
- explicit cleanup of move/up listeners when interaction ends.

The sparkline should not invent a new browser-event strategy. If the slider
pattern works across Safari, touch, and mouse, the sparkline interaction should
reuse that pattern and only replace the value conversion step.

For the sparkline, the equivalent conversion flow is:

```text
mouse/touch event
-> SVG point via mouseEventToPoint(e)
-> clamp x to graph draw area
-> convert x to time index/window
-> find active sample or active sample range
-> update vertical indicator, active point, detail text, and snake window
```

This keeps pointer behavior shared while allowing the graph-specific logic to
stay inside the sparkline tool.

## Interaction

Interaction is a later phase.

Possible additions:

- pointer/touch tracking
- vertical indicator
- active data point
- hover/detail panel
- snake overlay

### Snake Overlay

The snake is the active highlighted part of the same graph under pointer or
touch interaction. It should behave like a small moving graph segment that
exactly follows the spline around the active time.

Desired behavior:

- the normal graph remains visible;
- when the user hovers, touches, or drags over the graph, a highlighted spline
  segment appears around the active x-position;
- the segment follows the pointer/finger continuously;
- the finger may move outside the graph and outside the card after interaction
  starts;
- the calculated graph x/time value is clamped to the graph bounds, but pointer
  movement itself is not restricted;
- the segment uses the same graph data and the same spline logic as the normal
  graph;
- the segment has rounded ends;
- the pointer movement is the animation.

The snake must not be implemented as a visible rectangular window, fade window,
or path-length dash effect. The graph is gradient/background through a mask, not
a directly rendered colored stroke. The snake should follow that same model.

Conceptually:

```text
normal line:
  full spline path -> white line mask -> gradient/background visible

snake:
  spline subpath around active time -> white line mask -> gradient/highlight visible
```

The hard part is preserving the exact spline. If the snake path is calculated
from only the visible points inside the time window, the curve can bend
differently at the edges. The segment calculation must therefore reuse the same
control-point logic as the full path, with neighboring points outside the active
window available for spline context.

Possible engine-level API:

```js
Graph.getPathSegmentByTime(startTime, endTime)
Graph.getPathSegmentByX(x1, x2)
```

The implementation should prefer an engine-level segment method over rebuilding
the spline in the FHS renderer. The renderer should receive a ready SVG path for
the snake mask, just as it receives the normal full path.

Example configuration direction:

```yaml
interaction:
  snake:
    window: 15min
```

The window is time/x-axis based. For example, `15min` means the snake displays
the same spline segment around the active pointer time, not a fixed SVG path
length.

## Validation Of Current Possibilities

Current state after reviewing the supplied SAK files:

- `sparkline-graph.js` is usable as the main calculation engine.
- It is not purely line/area internally; it also contains methods for other SAK
  graph types.
- That is acceptable if the file is copied as an engine and only line/area APIs
  are called by FHS.
- `sparkline-graph-tool.js` is not suitable as a direct FHS tool because it
  contains the full SAK rendering layer and many chart types that are out of
  scope.
- The useful rendering pattern from the SAK tool is the mask-backed SVG approach
  for line and area coloring.
- FHS should provide its own wrapper so the tool behaves like all other FHS
  layout tools.

Minimum useful engine calls for the first FHS implementation:

- `new SparklineGraph(...)`
- `Graph.update(history)`
- `Graph.getPath()`
- `Graph.getArea(path)`
- `Graph.getPoints()` only if active point interaction is added later

Naming note:

Prefer existing SAK names such as `sparkline.show.chart_type` over newly
invented names such as `sparkline_type` when that does not conflict with FHS.
The first FHS wrapper may support only `line`, `area`, and the combined
line-area rendering, but the config shape should stay close to the SAK graph
tool so future modes do not require another breaking redesign.

## Implementation Phases

1. Copy or import `sparkline-graph.js` as the calculation engine.
2. Add a small FHS `SparklineGraphTool` wrapper for `layout.sparklines`.
3. Support SAK-compatible `sparkline.show.chart_type` values for `line` and `area`, with line+area rendering controlled by the existing SAK-style line/area visibility settings.
4. Fetch today history and feed it into the engine.
5. Render line and area with FHS styles and gradients.
6. Add statistics from the same dataset.
7. Add x/y ticks and grid if still needed.
8. Add pointer/touch interaction.
9. Add snake overlay.

## Architecture Rules

The implementation must follow the existing FHS architecture:

- keep the existing entity structure;
- keep the existing render pipeline;
- keep existing layout tools as the model;
- do not add duplicate render logic for statistics;
- do not add special graph-only entity handling unless that is the explicit
  feature being implemented;
- reuse FHS masks/clips/gradients;
- only add functionality needed for the sparkline tool.

The finished tool should feel like a normal FHS layout tool, not like an
embedded SAK card.
