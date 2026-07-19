---
template: main.html
title: Sparkline History Periods and Bins
description: Configure realtime, rolling-window, and calendar sparkline periods with durations, offsets, bins, aggregation, and live updates.
tags:
  - Section
  - Sparkline
  - History
---

# Sparkline history periods and bins

The period defines which time range a sparkline represents. Bins divide that range into regular intervals, and the selected aggregate function converts the states inside each bin into the value rendered by the graph.

Set `period.type` to the time range you want to show and configure its matching block.

## :material-horseshoe: Period types

| Type | History behavior | Range behavior |
| :--- | :--------------- | :------------- |
| `real_time` | Uses one current value without loading history. | Displays a single live state. |
| `rolling_window` | Loads recent history and appends current state updates. | Moves forward with the current time and current bin. |
| `calendar` with `offset: 0` | Loads the active calendar range and appends current state updates. | The axis represents the complete calendar range; graph data stops at the current bin. |
| `calendar` with a negative offset | Loads a closed historical calendar range. | Remains static until the calendar date changes or the card reconnects. |

## :material-horseshoe: Realtime

Realtime mode displays one current value and does not build a historical time series. Use it only with chart types that can represent a single live state.

```yaml linenums="1"
period:
  type: real_time
```

Use realtime when only the latest state matters. Use `rolling_window` or `calendar` for chart types that need a visible trend over time.

## :material-horseshoe: Rolling window

A rolling window always represents the most recent configured duration. Its bins are aligned to the configured bin interval, and the last bin is the current active bin.

```yaml linenums="1"
period:
  type: rolling_window
  rolling_window:
    duration:
      hour: 24
    bins:
      per_hour: 2
```

This example creates half-hour bins across the latest 24 hours. As time advances, old bins leave the range and a new current bin is added.

## :material-horseshoe: Calendar range

Calendar mode aligns the period to calendar boundaries instead of subtracting a duration directly from the current time.

```yaml linenums="1"
period:
  type: calendar
  calendar:
    period: day
    offset: 0
    duration:
      hour: 24
    bins:
      per_hour: 2
```

For the current day, the X-axis covers the complete day. The graph and its data bins stop at the current half-hour bin until later bins become active.

Set a negative offset to display a completed calendar period:

```yaml linenums="1"
period:
  type: calendar
  calendar:
    period: day
    offset: -1
    duration:
      hour: 24
    bins:
      per_hour: 2
```

Current entity states are not appended to a closed historical range. When the local date changes, the requested offset points to a different calendar day and the history is loaded again.

## :material-horseshoe: Duration

Duration determines how much time the graph shows. Hours are useful for compact daily and multi-day history graphs.

The range length and the number of bins do not change when the graph is made wider or narrower. Size controls the available display space; period and bins control the data shown.

## :material-horseshoe: Bins per hour

`bins.per_hour` determines the bin interval.

| `per_hour` | Bin duration |
| :--------- | :----------- |
| `1` | 60 minutes |
| `2` | 30 minutes |
| `4` | 15 minutes |
| `12` | 5 minutes |
| `30` | 2 minutes |

More bins preserve shorter peaks and dips but produce a denser graph. Fewer bins produce a calmer graph because more measurements contribute to each displayed value.

## :material-horseshoe: Aggregation

Configure averaging and value handling under `state_values`.

| Field | Default | Description |
| :---- | :------ | :---------- |
| `aggregate_func` | `avg` | Value calculated from the states in each bin. |
| `value_factor` | `0` | Optional value multiplier used by the graph. |
| `smoothing` | `true` | Smooths applicable line and area paths. |
| `logarithmic` | `false` | Uses a logarithmic Y scale for applicable charts. |

```yaml linenums="1"
sparkline:
  state_values:
    aggregate_func: avg
    smoothing: true
    logarithmic: false
```

The bin also retains minimum, average, and maximum statistics for the tooltip and derived FHS entities.

## :material-horseshoe: Empty and active bins

When no measurement has arrived in the current bin, its tooltip values remain empty. A line can visually continue from the previous point, but that visual continuation is not counted as a measurement.

Rolling-window graphs and current calendar graphs update automatically when Home Assistant supplies a new state. The graph, tooltip, and minimum, average, and maximum values then show the updated current bin.

## :material-horseshoe: Time zones and boundaries

Home Assistant stores history timestamps in UTC, but the graph displays dates and times in the local Home Assistant or browser time zone. Midnight therefore represents the local day transition.

Rolling-window bins follow the moving time range. Calendar bins follow the selected local day. For the current day, the X-axis already shows the complete day even though later parts do not contain data yet.

## :material-horseshoe: When history updates

History is loaded when the card opens. Current periods continue to update with new Home Assistant states and advance when a new bin begins.

A completed calendar period remains unchanged during the day. At the next local day transition, an offset such as `-1` refers to a new date and the graph loads that day. Returning to a view after it has been inactive also refreshes the graph when its requested period has changed.

## :material-horseshoe: Related documentation

- [Sparkline Graphs](sparklines-section.md)
- [Sparkline Cartesian Charts and Axes](sparkline-cartesian-charts.md)
- [Sparkline Specialized Charts](sparkline-specialized-charts.md)
