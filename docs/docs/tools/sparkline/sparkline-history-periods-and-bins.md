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

Every Sparkline first needs a history period: the span of time whose data should be shown. The card can follow a moving window, a calendar period such as today or yesterday, or a single realtime value. It then groups that history into intervals so the graph keeps the right amount of detail.

This page shows how to choose the period, move it backward in time, change the amount of detail, choose how values are combined, and understand when the history updates.

## :material-horseshoe: Show the latest 24 hours

Use a rolling window when the graph should always end at the present and keep the same amount of recent history visible.

```yaml linenums="1"
entities:
  - entity: sensor.temperature  # Entity whose history is graphed

layout:
  sparklines:
    - xpos: 50  # Horizontal center of the graph
      ypos: 50  # Vertical center of the graph
      width: 80  # Graph width in card coordinates
      height: 35  # Graph height in card coordinates
      entity_index: 0  # Use the first entity configured above
      period:
        type: rolling_window  # Always show the latest moving time range
        rolling_window:
          duration:
            hour: 24  # Show 24 hours of history
          bins:
            per_hour: auto  # Let the card choose a readable time interval automatically
            density: medium  # Choose low, medium, or high detail when intervals are automatic
```
A rolling window always follows the latest configured duration.

## :material-horseshoe: Show today

Use a calendar day when the graph should stay aligned to local midnight-to-midnight boundaries instead of sliding continuously.

```yaml linenums="1"
entities:
  - entity: sensor.temperature  # Entity whose history is graphed

layout:
  sparklines:
    - xpos: 50  # Horizontal center of the graph
      ypos: 50  # Vertical center of the graph
      width: 80  # Graph width in card coordinates
      height: 35  # Graph height in card coordinates
      entity_index: 0  # Use the first entity configured above
      period:
        type: calendar  # Follow a calendar period such as today or yesterday
        calendar:
          period: day  # Use one calendar day as the period
          offset: 0  # Use the current calendar period
          duration:
            hour: 24  # Show 24 hours of history
          bins:
            per_hour: auto  # Let the card choose a readable time interval automatically
            density: medium  # Choose low, medium, or high detail when intervals are automatic
```
The X-axis covers the complete local calendar day. Values fill in up to the current interval.

## :material-horseshoe: Show yesterday

Use a negative calendar offset when the graph should show a completed earlier period rather than the current day.

```yaml linenums="1"
entities:
  - entity: sensor.temperature  # Entity whose history is graphed

layout:
  sparklines:
    - xpos: 50  # Horizontal center of the graph
      ypos: 50  # Vertical center of the graph
      width: 80  # Graph width in card coordinates
      height: 35  # Graph height in card coordinates
      entity_index: 0  # Use the first entity configured above
      period:
        type: calendar  # Follow a calendar period such as today or yesterday
        calendar:
          period: day  # Use one calendar day as the period
          offset: -1  # Move back 1 calendar period(s); -1 = previous period
          duration:
            hour: 24  # Show 24 hours of history
          bins:
            per_hour: auto  # Let the card choose a readable time interval automatically
            density: medium  # Choose low, medium, or high detail when intervals are automatic
```
Use more negative offsets for earlier completed calendar periods.

## :material-horseshoe: Show another moving duration

Change the duration inside `rolling_window`:

```yaml linenums="1"
entities:
  - entity: sensor.temperature  # Entity whose history is graphed

layout:
  sparklines:
    - xpos: 50  # Horizontal center of the graph
      ypos: 50  # Vertical center of the graph
      width: 80  # Graph width in card coordinates
      height: 35  # Graph height in card coordinates
      entity_index: 0  # Use the first entity configured above
      period:
        type: rolling_window  # Always show the latest moving time range
        rolling_window:
          duration:
            hour: 6  # Show 6 hours of history
          bins:
            per_hour: auto  # Let the card choose a readable time interval automatically
            density: medium  # Choose low, medium, or high detail when intervals are automatic
```
Changing graph width or height does not change the selected history period.

## :material-horseshoe: Show only the current value

Use realtime mode when the selected chart type should represent only the current state:

```yaml linenums="1"
entities:
  - entity: sensor.temperature  # Entity whose history is graphed

layout:
  sparklines:
    - xpos: 50  # Horizontal center of the graph
      ypos: 50  # Vertical center of the graph
      width: 80  # Graph width in card coordinates
      height: 35  # Graph height in card coordinates
      entity_index: 0  # Use the first entity configured above
      period:
        type: real_time  # Use only the current value; no history timeline
```
## :material-horseshoe: Show more or less detail

For normal use, keep automatic bins and change `density`:

```yaml linenums="1"
entities:
  - entity: sensor.temperature  # Entity whose history is graphed

layout:
  sparklines:
    - xpos: 50  # Horizontal center of the graph
      ypos: 50  # Vertical center of the graph
      width: 80  # Graph width in card coordinates
      height: 35  # Graph height in card coordinates
      entity_index: 0  # Use the first entity configured above
      period:
        type: rolling_window
        rolling_window:
          duration:
            hour: 24
          bins:
            per_hour: auto  # Let the card choose a readable time interval automatically
            density: high  # Choose low, medium, or high detail when intervals are automatic
```
Use:

- `low` for fewer displayed intervals;
- `medium` for the normal balance;
- `high` for more detail.

Set `per_hour` to a number only when you deliberately need an exact interval.

| `per_hour` | Interval |
| ---: | --- |
| `0.0416667` | 24 hours |
| `0.0833333` | 12 hours |
| `0.125` | 8 hours |
| `0.1666667` | 6 hours |
| `0.25` | 4 hours |
| `0.5` | 2 hours |
| `1` | 60 minutes |
| `2` | 30 minutes |
| `3` | 20 minutes |
| `4` | 15 minutes |
| `6` | 10 minutes |
| `12` | 5 minutes |

## :material-horseshoe: Choose what each interval represents

Use `aggregate_func` to choose which value from each interval is drawn:

```yaml linenums="1"
entities:
  - entity: sensor.temperature  # Entity whose history is graphed

layout:
  sparklines:
    - xpos: 50  # Horizontal center of the graph
      ypos: 50  # Vertical center of the graph
      width: 80  # Graph width in card coordinates
      height: 35  # Graph height in card coordinates
      entity_index: 0  # Use the first entity configured above
      sparkline:
        state_values:
          aggregate_func: avg  # Use the avg value from each time interval
```
The available aggregation values are:

- `avg` — arithmetic mean of all values in the interval.
- `median` — middle value of the interval after sorting its values.
- `max` — highest value in the interval.
- `min` — lowest value in the interval.
- `first` — first value in the interval.
- `last` — last value in the interval.
- `sum` — sum of all values in the interval.
- `delta` — highest value minus lowest value in the interval.
- `diff` — last value minus first value in the interval.

Use `smoothing` when a line or area should flow smoothly between intervals instead of connecting them with straight segments.

Use `logarithmic` when very large values make smaller values almost disappear in the graph. It compresses the value range so both small and large changes remain easier to see.

## :material-horseshoe: Keep short peaks visible

Use more bins when short changes should remain visible. Use fewer bins when you want a calmer overall trend. The aggregation function then decides which value represents every displayed interval.

## :material-horseshoe: State bands use actual state changes

`state_bands` uses the real times at which the entity changed state rather than creating visual segments from the configured number of bins. Its `update_interval` controls how often an ongoing current state extends toward the current time.

## :material-horseshoe: When the graph updates

Current rolling and calendar periods update as new Home Assistant states arrive and as time moves into a new interval. Completed calendar periods remain unchanged until the selected calendar offset points to another date.

Dates and boundaries use the local Home Assistant/browser time zone.

## :material-horseshoe: Configuration options


`Required` applies to the specific form described by that table: **Yes** means you need the field for that form; **No** means you can leave it out. `Not set` means the card adds no explicit value when the option is omitted.

| Option | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `period.type` | `real_time`, `rolling_window`, `calendar` | No | `calendar` | `real_time` uses only the current value; `rolling_window` uses a moving duration; `calendar` aligns the graph to local calendar-day boundaries. |
| `period.calendar.period` | `day` | No | `day` | Uses local midnight-to-midnight day boundaries for calendar history. |
| `period.calendar.offset` | number | No | `0` | Selects a calendar day relative to today: `0` is today, `-1` yesterday, `-2` two days ago. |
| `period.calendar.duration.hour` | number | No | `24` | Calendar history duration in hours. A calendar day is at least 24 hours; use multiples of 24 for several days. |
| `period.calendar.bins.per_hour` | number / `auto` | No | `auto` | Exact or automatic number of displayed intervals per hour for calendar history. |
| `period.calendar.bins.density` | `low`, `medium`, `high` | No | `medium` | With automatic bins, `low` uses fewer intervals, `medium` the normal balance, and `high` more intervals/detail. |
| `period.rolling_window.offset` | number | No | `0` | Shifts the moving window by whole days: `0` ends now, `-1` shifts it one day earlier. |
| `period.rolling_window.duration.hour` | number | No | `24` | Length of the moving history window in hours. |
| `period.rolling_window.bins.per_hour` | number / `auto` | No | `auto` | Exact or automatic number of displayed intervals per hour for rolling history. |
| `period.rolling_window.bins.density` | `low`, `medium`, `high` | No | `medium` | With automatic bins, `low` uses fewer intervals, `medium` the normal balance, and `high` more intervals/detail. |
| `sparkline.state_values.aggregate_func` | `avg`, `median`, `max`, `min`, `first`, `last`, `sum`, `delta`, `diff` | No | `avg` | Chooses which value from every time interval is drawn. The meanings of all values are listed above. |
| `sparkline.state_values.smoothing` | boolean | No | `true` | Uses smooth connections between intervals; set it to `false` when straight connections show changes more clearly. |
| `sparkline.state_values.logarithmic` | boolean | No | `false` | Compresses a wide value range so smaller values remain visible next to much larger values. |

## :material-horseshoe: Related documentation

- [Sparkline overview](sparkline-overview.md)
- [Multiple series](multiple-series.md)
- [Axes and grid](axes-and-grid.md)
