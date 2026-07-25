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

The period selects the time range shown by a sparkline. Bins control the level of detail by dividing that range into equal time intervals. The aggregate function determines whether each interval shows its average, minimum, maximum, or another supported value.

Set `period.type` to the time range you want to show and configure its matching block.

## :material-horseshoe: Period types

| Type | Use | What you see |
| :--- | :-- | :----------- |
| `real_time` | Show only the latest value. | A single live state without a timeline. |
| `rolling_window` | Follow the most recent configured duration. | The complete range moves forward with the current time. |
| `calendar` with `offset: 0` | Follow the active calendar period. | The axis shows the complete period and values continue up to the current time interval. |
| `calendar` with a negative offset | Show a completed calendar period. | The selected historical period remains unchanged until the calendar date changes. |

## :material-horseshoe: Realtime

Realtime mode shows only the latest value and has no timeline. Use it only with chart types that can represent a single live state.

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

Calendar mode starts and ends at calendar boundaries, such as local midnight for a day.

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

For the current day, the X-axis covers the complete day. Values continue up to the current half-hour interval as the day progresses.

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

A completed calendar period remains unchanged during the day. When the local date changes, the same offset selects the next corresponding calendar period.

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

### State bands and bins

The `state_bands` chart shows the actual times at which the entity changed state. Its segments are therefore not affected by the configured number of bins.

`state_bands.update_interval` controls how often the end of an unchanged current state advances towards the current time.

## :material-horseshoe: Aggregation

Configure averaging and value handling under `state_values`.

| Field | Default | Description |
| :---- | :------ | :---------- |
| `aggregate_func` | `avg` | Selects the value shown for each time interval. |
| `value_factor` | `0` | Optional value multiplier used by the graph. |
| `smoothing` | `true` | Uses smooth connections for line and area charts. |
| `logarithmic` | `false` | Uses a logarithmic Y scale for applicable charts. |

```yaml linenums="1"
sparkline:
  state_values:
    aggregate_func: avg
    smoothing: true
    logarithmic: false
```

The tooltip and derived FHS entities use the minimum, average, and maximum values from the selected time interval.

## :material-horseshoe: Empty and active bins

An interval without measurements has no minimum, average, or maximum tooltip values, even when the line appears continuous.

Rolling-window graphs and current calendar graphs update automatically when Home Assistant supplies a new state. The graph, tooltip, and minimum, average, and maximum values then show the updated current time interval.

## :material-horseshoe: Time zones and boundaries

Dates and times follow the local Home Assistant or browser time zone. Midnight therefore represents the local day transition.

A rolling window follows the moving time range. A calendar graph follows the selected local day. For the current day, the X-axis already shows the complete day even though later parts do not contain data yet.

## :material-horseshoe: When history updates

When the card opens, the graph shows the selected period. Current periods continue to update with new Home Assistant states and advance when a new time interval begins.

A completed calendar period remains unchanged during the day. At the next local day transition, an offset such as `-1` refers to a new date and the graph shows that day. Returning to a view after it has been inactive also refreshes the graph when its requested period has changed.

## :material-horseshoe: Related documentation

- [Sparkline Graphs](sparklines-section.md)
- [Sparkline Cartesian Charts and Axes](sparkline-cartesian-charts.md)
- [Sparkline Specialized Charts](sparkline-specialized-charts.md)
