# Multiple Sparkline Series and Period Offsets

## Goal

Allow one sparkline to display multiple entities or comparative periods while
keeping the existing single-series configuration fully compatible.

## Configuration

The existing configuration remains valid:

```yaml
entity_index: 0
```

An optional `series:` list adds multiple series:

```yaml
series:
  - id: today
    entity_index: 0
    color: '#42a5f5'

  - id: yesterday
    entity_index: 0
    color: '#9e9e9e'
    period:
      calendar:
        offset: -1
```

The global sparkline configuration remains the shared default. A series only
overrides fields that differ, such as `chart_type`, `color`, `y_axis`, or its
period offset. The global `period` remains the default x-axis period and bin
definition.

## History and Offset Handling

The history fetcher must calculate an effective period for each series. A
series with `offset: 0` keeps its timestamps unchanged. Only a series with a
non-zero offset is normalized to the active reference period before it reaches
the graph engine.

For example, yesterday's `14:00` is supplied to the graph as today's `14:00`.
The graph therefore receives all series on one shared reference x-axis and does
not need to know which calendar period produced the data.

Calendar offsets must use the existing calendar/timezone resolver rather than
subtracting a fixed 24-hour duration. Daylight-saving changes can make a
calendar day 23 or 25 hours long. Rolling-window offsets use the corresponding
relative window boundaries.

## Original and Plot Timestamps

Offset normalization must add a plot timestamp rather than overwrite the
original history timestamp. A normalized point can therefore contain both:

```js
{
  last_changed: "2026-08-15T14:00:00Z", // Original source timestamp
  plot_time: "2026-08-16T14:00:00Z",    // Shared reference-axis position
  state: 24.3,
}
```

The graph uses `plot_time` for the shared x-axis. Tooltips use
`last_changed`, allowing comparative series to show the real date and time of
the source measurement. This supports comparisons such as today versus
yesterday, two days ago, or the same calendar day one week earlier.
## Update Strategy

The period offset also determines how a series is updated. A series showing a
completed historical period, such as yesterday or the same weekday last week,
is static after its history has been fetched. It does not need a recurring
history request.

The current period remains live and receives new points through the normal
entity-update path. Other series can therefore be appended or refreshed only
when their source entity changes. A new history fetch is needed when the card
is rebuilt or when a calendar boundary changes the meaning of the requested
period, not on a periodic timer for every series.

## Series Rendering

Each series inherits the global sparkline settings and may override its own:

- chart type: `line`, `area`, `bar`, or `dots`;
- fixed series color;
- line, area, bar, or dot styling;
- y-axis assignment;
- label and legend text.

One fixed color per series is preferred for recognition and legend display.
Value-based color stops remain suitable for single-series visualizations, but
should not be used as the identity color of a multi-series legend item.

## Y-Axis Models

Keep the number of visible axes limited:

- one shared y-axis when series use the same unit and scale;
- a left and right y-axis when two different units or ranges must coexist;
- optional independent hidden scales when each series should fill the plot area
  independently without drawing its own axis, labels, or grid.

Each visible axis calculates its own bounds and ticks from the series assigned
to it. Independent hidden scales are for showing individual trends and should
not imply that vertical positions are directly comparable.

## Derived Entities

Statistics entities need a stable series-specific name. For example:

```text
fhs_sparkline.climate_today_min
fhs_sparkline.climate_today_avg
fhs_sparkline.climate_today_max
fhs_sparkline.climate_yesterday_min
fhs_sparkline.climate_yesterday_avg
fhs_sparkline.climate_yesterday_max
```

The existing single-series names remain unchanged for backward compatibility.

## Required Engine Changes

The graph engine must move from one source object to a list of series objects.
Each series needs its own source entity, history data, bins, statistics, color,
and effective y-axis mapping. The shared x-axis, period defaults, tooltip, and
legend then operate on that normalized series collection.

The current indexed `line_color` handling is a useful starting point for fixed
per-series colors, but history fetching, statistics, y-axis calculation, and
derived entity publishing are still single-series concerns.
