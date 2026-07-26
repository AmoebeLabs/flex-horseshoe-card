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

The period defines the time range shown by a sparkline. Bins divide that range into equal intervals and determine how much detail the graph preserves. The aggregate function then chooses whether each interval displays its average, minimum, maximum, or another supported value.

Set `period.type` to the range you want to display, then configure the corresponding settings block.

## :material-horseshoe: Period types

| Type                              | Use                                         | What you see                                                                            |
| :-------------------------------- | :------------------------------------------ | :-------------------------------------------------------------------------------------- |
| `real_time`                       | Display only the latest value.              | A single live state without a timeline.                                                 |
| `rolling_window`                  | Follow the most recent configured duration. | The full range moves forward with the current time.                                     |
| `calendar` with `offset: 0`       | Follow the active calendar period.          | The axis covers the full period, while values continue up to the current interval.      |
| `calendar` with a negative offset | Display a completed calendar period.        | The selected historical period remains unchanged until the local calendar date changes. |

## :material-horseshoe: Realtime

Realtime mode displays only the latest value and does not include a timeline. Use it with chart types that can represent a single live state.

```yaml linenums="1"
period:
  type: real_time
```

Choose realtime when only the current state matters. Use `rolling_window` or `calendar` for charts that need to show a trend over time.

## :material-horseshoe: Rolling window

A rolling window always covers the most recent configured duration. Its bins align with the selected interval, and the final bin represents the current active interval.

```yaml linenums="1"
period:
  type: rolling_window
  rolling_window:
    duration:
      hour: 24
    bins:
      per_hour: 2
```

This example creates half-hour bins across the latest 24 hours. As time moves forward, older bins leave the range and a new current bin is added.

## :material-horseshoe: Calendar range

Calendar mode follows calendar boundaries, such as local midnight at the start of a day.

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

For the current day, the X-axis spans the full 24-hour period. Values continue to appear up to the current half-hour interval as the day progresses.

Use a negative offset to display a completed calendar period:

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

A completed calendar period remains unchanged throughout the day. When the local date changes, the same offset points to the next corresponding historical period.

## :material-horseshoe: Duration

Duration determines how much time the graph covers. Hours work well for compact daily and multi-day history graphs.

Changing the graph’s width or height does not affect the selected range or number of bins. The card size controls how much display space is available, while the period and bins determine which data appears.

## :material-horseshoe: Bins per hour

`bins.per_hour` determines the length of each time interval.

| `per_hour` | Bin duration |
| :--------- | :----------- |
| `1`        | 60 minutes   |
| `2`        | 30 minutes   |
| `4`        | 15 minutes   |
| `12`       | 5 minutes    |
| `30`       | 2 minutes    |

Using more bins preserves shorter peaks and dips, but also creates a denser graph. Using fewer bins produces a calmer view because more measurements are combined into each displayed value.

### State bands and bins

The `state_bands` chart uses the actual times at which the entity changed state. Its segments are therefore independent of the configured number of bins.

`state_bands.update_interval` determines how often the end of an unchanged current state advances toward the current time.

## :material-horseshoe: Aggregation

Configure aggregation and value handling under `state_values`.

| Field            | Default | Description                                              |
| :--------------- | :------ | :------------------------------------------------------- |
| `aggregate_func` | `avg`   | Chooses which value is displayed for each time interval. |
| `value_factor`   | `0`     | Applies an optional multiplier to the displayed values.  |
| `smoothing`      | `true`  | Uses smooth connections for line and area charts.        |
| `logarithmic`    | `false` | Uses a logarithmic Y-axis for supported chart types.     |

```yaml linenums="1"
sparkline:
  state_values:
    aggregate_func: avg
    smoothing: true
    logarithmic: false
```

The tooltip and derived FHS entities use the minimum, average, and maximum values from the selected time interval.

## :material-horseshoe: Empty and active bins

A time interval without measurements has no minimum, average, or maximum tooltip values, even when the line itself appears continuous.

Rolling-window graphs and current calendar graphs update automatically when Home Assistant provides a new state. The graph, tooltip, and minimum, average, and maximum values then reflect the updated current interval.

## :material-horseshoe: Time zones and boundaries

Dates and times follow the local Home Assistant or browser time zone. Midnight therefore marks the transition to the next local day.

A rolling window follows a continuously moving time range. A calendar graph follows the selected local calendar period. For the current day, the X-axis already spans the full day, even though later intervals do not yet contain data.

## :material-horseshoe: When history updates

When the card opens, the graph loads the selected period. Current periods continue to update as Home Assistant provides new states and advance whenever a new time interval begins.

A completed calendar period remains unchanged during the day. At the next local day transition, an offset such as `-1` points to a different date, and the graph updates to show that period.

Returning to a view after it has been inactive also refreshes the graph when the requested period has changed.

## :material-horseshoe: Related documentation

* [Sparkline Graphs](sparklines-section.md)
* [Sparkline Cartesian Charts and Axes](sparkline-cartesian-charts.md)
* [Sparkline Specialized Charts](sparkline-specialized-charts.md)
