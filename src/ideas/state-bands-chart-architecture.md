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
      - state: low
        value: 1
      - state: high
        value: 2

  state_bands:
    row_spacing: 1
    styles:
      opacity: 1
```

The chart supports `calendar` and `rolling_window`. It uses the existing `color_stops`, `colorstops_transition`, `y_axis.labels.styles`, and `sparkline.animate` configuration. `real_time` and `state_map.type: rank_state` are outside the first implementation.

## History And Segment Geometry

The tool maps every raw history state through `state_map` before numeric graph processing. It keeps the raw state, mapped value, and timestamp available for segment construction.

The Home Assistant history request already includes the state active at the requested start time because FHS does not send `skip_initial_state`. An older returned state is clipped to the exact visible range start. If Home Assistant has no state from before the first returned transition, the unknown interval remains empty; the first state is never extended backwards without supporting data.

Consecutive records with the same mapped state form one segment. A segment ends at the next state transition. The last state continues to the current data end for an active period or to the range end for a closed calendar period. Segment geometry is clipped to the existing X-axis range.

For an active period, the current Home Assistant state is added from its real `last_changed` timestamp. Current state data is never appended to a closed calendar period with an offset. While history is loading, rows, translated labels, and axes may render without bands.

The graph engine exposes a `getStateBands(...)` method consistent with `getBars()` and `getGrades()`. It returns row and segment geometry, including row label position, band position and height, segment X position and width, mapped value, raw state, start time, and end time. The engine also exposes categorical Y geometry for row labels and optional row grid lines. Existing numeric axis geometry remains untouched.

## Rendering And Interaction

The tool determines the rendered Y-label font height and passes the required vertical dimensions to the engine. Each row reserves vertical space for the label above its band. Bands retain the complete X-axis width.

State labels use the same Home Assistant translation behavior as horseshoe state maps. State bands use the existing color-stop calculation and runtime style processing. For this chart, Y labels default to `text-anchor: start` and `dominant-baseline: hanging` while still accepting `y_axis.labels.styles`.

Pointer handling reuses the existing central pointer handlers and animation-frame processing. No listeners are attached to individual bands, and pointer events do not trigger Lit rendering. Pointer X selects the state segment active at that time; pointer Y is not needed. The tooltip is positioned at the segment center and displays the translated state, localized start time, localized end time, and duration. Unknown and future intervals have no tooltip. This chart has no vertical indicator and no hover dimming or highlighting.

When `sparkline.animate` is enabled, bands grow horizontally from their start position on their initial history render. Existing bands do not restart their animation on normal state updates. A newly inserted segment may animate once.

## Compatibility And Verification

Existing generated `fhs_*` statistics remain available and use mapped numeric values. No existing chart type receives state-band branches unless its `chart_type` is explicitly `state_bands`.

Verification must cover calendar and rolling periods, active and closed ranges, initial states before and after the visible start, repeated states, current state transitions, translated labels, hard and smooth color stops, varying row counts and font sizes, desktop and Safari touch tooltips, one-time animation, and regressions across all existing chart types.
