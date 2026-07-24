# State Bands Chart Architecture

## Goal

Add `state_bands` as a separate historical sparkline chart type for textual Home Assistant states. Existing chart types, their bin processing, axis geometry, rendering, tooltip behavior, and public configuration remain unchanged.

Each `state_map` entry receives its own horizontal row. A state period is rendered as a horizontal band between its start and end time. Rows are ordered by numeric `state_map.value`, with the lowest value at the bottom. The translated state label is rendered above the band and aligned to the left inside the normal graph area. No separate label column or external Y-label margin is introduced.

## Public Configuration

```yaml
sparkline:
  show:
    chart_type: state_bands
    labels:
      x: true
      y: true

  state_map:
    type: state_value
    map:
      - state: very_low
        value: 0
        label: Very low
      - state: low
        value: 1
      - state: high
        value: 2

  state_bands:
    radius: 0.5
    styles:
      stroke-width: 0
      opacity: 1
    background:
      padding: 0.75
      connection_width: 0.375
      styles:
        opacity: 0.3
```

The chart supports `calendar` and `rolling_window`. It uses the existing `color_stops`, `y_axis.labels.styles`, and `sparkline.animate` configuration. State bands always select categorical color stops without smooth foreground interpolation. `real_time` and `state_map.type: rank_state` are outside the first implementation.

## History And Segment Geometry

The tool maps every raw history state through `state_map` before numeric graph processing. It keeps the raw state, mapped value, and timestamp available for segment construction.

The Home Assistant history request already includes the state active at the requested start time because FHS does not send `skip_initial_state`. An older returned state is clipped to the exact visible range start. If Home Assistant has no state from before the first returned transition, the unknown interval remains empty; the first state is never extended backwards without supporting data.

Consecutive records with the same mapped state form one segment. A segment ends at the next state transition. The last state continues to the current data end for an active period or to the range end for a closed calendar period. Segment geometry is clipped to the existing X-axis range.

For an active period, the current Home Assistant state is added from its real `last_changed` timestamp. Current state data is never appended to a closed calendar period with an offset. While history is loading, rows, translated labels, and axes may render without bands.

If the source entity still has the same `last_changed` timestamp, no additional history row is appended. The active segment is extended by advancing its calculated data end instead. This prevents duplicate states from creating redundant transitions while keeping the visible current state up to date.

The graph engine exposes a `getStateBands(...)` method consistent with `getBars()` and `getGrades()`. It returns row and segment geometry, including row label position, band position and height, segment X position and width, mapped value, raw state, start time, and end time. The engine also exposes categorical Y geometry for row labels and optional row grid lines. Existing numeric axis geometry remains untouched.

## Rendering And Interaction

The engine divides the graph height evenly across all mapped states. From top to bottom, every row uses 10% top margin, 25% label, 15% middle margin, 40% band, and 10% bottom margin. The label font size is automatically set to 25% of the row height, so users do not need to tune it. Bands retain the complete X-axis width and use a configurable radius with a default of 0.5.

The categorical Y geometry exposes horizontal grid lines at the boundaries between rows. These separators use the normal Y-grid styles and never run through a label or band.

State labels use the same Home Assistant translation behavior as horseshoe state maps. An optional `label` on an individual `state_map` entry overrides the translated state text. State bands use the existing color-stop calculation and runtime style processing. For this chart, Y labels default to `text-anchor: start` and `dominant-baseline: hanging` while still accepting `y_axis.labels.styles`.

The visual flow behind the foreground segments follows the existing mask and background-layer architecture. The graph engine exposes transition geometry only where consecutive known states meet. A separate mask combines expanded rounded segment rectangles with rounded vertical transition lines. A vertical gradient, colored at the center of every state row, is rendered through that mask as an independent background layer. The existing foreground segment rendering remains unchanged.

Pointer handling reuses the existing central pointer handlers and animation-frame processing. No listeners are attached to individual bands, and pointer events do not trigger Lit rendering. Pointer X selects the state segment active at that time; pointer Y is not needed. The vertical indicator is positioned at the segment center. The tooltip remains at the standard fixed distance above the pointer and displays the translated state, localized start time, localized end time, and duration. Unknown and future intervals have no tooltip. This chart has no hover dimming or highlighting.

When `sparkline.animate` is enabled, bands grow horizontally from their start position on their initial history render. Existing bands do not restart their animation on normal state updates. A newly inserted segment may animate once.

## Compatibility And Verification

Existing generated `fhs_*` statistics remain available and use mapped numeric values. No existing chart type receives state-band branches unless its `chart_type` is explicitly `state_bands`.

Verification must cover calendar and rolling periods, active and closed ranges, initial states before and after the visible start, repeated states, current state transitions, translated labels, hard and smooth color stops, varying row counts and font sizes, desktop and Safari touch tooltips, one-time animation, and regressions across all existing chart types.
