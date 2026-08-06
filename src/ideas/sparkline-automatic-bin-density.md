# Automatic Sparkline Bin Density

## Problem

The useful number of sparkline bins depends on the displayed duration, graph
width, and chart type. A fixed `bins.per_hour` works for one duration but
becomes too dense or too coarse when a JavaScript template or local FHS input
changes that duration.

Users should not have to calculate and update `bins.per_hour` for every
duration themselves. FHS can select a logical time interval while still
allowing an explicitly configured value to take precedence.

## Public configuration

Automatic bin selection becomes the default:

```yaml
period:
  type: rolling_window
  rolling_window:
    duration:
      hour: 24
    bins:
      per_hour: auto
      density: medium
```

Defaults:

- `bins.per_hour: auto`;
- `bins.density: medium`.

Available density values are `low`, `medium`, and `high`. Density affects
only automatic selection. Any numeric `bins.per_hour` remains unchanged and
ignores `density`, including values outside the automatic option list.

## Layering

The public and runtime tool config must retain `per_hour: auto`. This allows a
new value to be calculated whenever a template changes the duration, width,
chart type, or density.

`SparklineGraphTool.buildGraphConfig()` creates the graph-engine config and
replaces `auto` in that clone with one numeric `per_hour` value.
`SparklineGraph` therefore continues to receive only validated numbers and
does not gain knowledge of automatic config, density profiles, or FHS layout
width.

The calculation uses the configured FHS sparkline `width`. It does not use
physical browser pixels, the converted SVG width, the remaining draw area,
axis margins, labels, or device scale.

## Automatic calculation

The automatic choices represent logical time intervals:

| Bins per hour | Bin duration |
| :------------ | :----------- |
| `1 / 24` | 24 hours |
| `1 / 12` | 12 hours |
| `0.125` | 8 hours |
| `1 / 6` | 6 hours |
| `0.25` | 4 hours |
| `0.5` | 2 hours |
| `1` | 1 hour |
| `2` | 30 minutes |
| `3` | 20 minutes |
| `4` | 15 minutes |
| `6` | 10 minutes |
| `12` | 5 minutes |

Each chart type receives a width-units-per-bin target:

| Chart type | Width units per bin |
| :--------- | ------------------: |
| `line`, `area` | 1 |
| `dots`, `bar`, `barcode`, `equalizer`, `graded` | 2 |
| `radial_barcode` | 5.6 |

Density adjusts that target:

| Density | Factor |
| :------ | -----: |
| `low` | 2 |
| `medium` | 1 |
| `high` | 0.5 |

For cartesian graphs, available width is the configured graph width. A radial
barcode treats that width as its diameter and uses `Math.PI * width` as its
available circumference.

```js
calculateBinsPerHour(
  binsPerHour,
  durationHours,
  graphWidth,
  graphType,
  binDensity,
) {
  if (binsPerHour !== 'auto') {
    return binsPerHour;
  }

  const binsPerHourOptions = [
    1 / 24,
    1 / 12,
    0.125,
    1 / 6,
    0.25,
    0.5,
    1,
    2,
    3,
    4,
    6,
    12,
  ];

  const widthUnitsPerBinByGraphType = {
    line: 1,
    area: 1,
    dots: 2,
    bar: 2,
    barcode: 2,
    equalizer: 2,
    graded: 2,
    radial_barcode: 5.6,
  };

  const densityFactor = {
    low: 2,
    medium: 1,
    high: 0.5,
  };

  const availableWidth =
    graphType === 'radial_barcode'
      ? Math.PI * graphWidth
      : graphWidth;
  const widthUnitsPerBin =
    widthUnitsPerBinByGraphType[graphType]
    * densityFactor[binDensity];
  const maximumBinsPerHour =
    availableWidth
    / widthUnitsPerBin
    / durationHours;

  return binsPerHourOptions.findLast(
    (option) => option <= maximumBinsPerHour,
  ) ?? binsPerHourOptions[0];
}
```

The implementation may use a backward loop instead of `findLast` when needed
for the project's browser target. The result must remain identical.

## Period and chart behavior

The calculation applies to `rolling_window` and `calendar` periods. A
duration change rebuilds the graph config with a newly calculated numeric bin
resolution. The existing history lifecycle remains responsible for fetching a
new time range; the graph engine rebuckets the resulting series normally.

`real_time` has no timeline and ignores bins. `state_bands` uses exact state
transition times and remains independent of bins. Its internal graph-engine
config receives the existing neutral numeric value rather than `auto`.

For `width: 90`, `density: medium`, and a line or area chart, expected
results include:

| Duration | Bins per hour |
| :------- | ------------: |
| 12 hours | 6 |
| 24 hours | 3 |
| 48 hours | 1 |
| 168 hours | 0.5 |

## Documentation impact

The user documentation must explain automatic mode, the three density values,
and manual precedence. The current statement that graph width does not affect
the number of bins remains true only for a manually configured
`bins.per_hour`.

Automatic selection stops at 12 bins per hour. Users can still configure finer
manual values such as `30` for two-minute bins.

## Acceptance tests

- Omitted `bins.per_hour` resolves as `auto` with `medium` density.
- Numeric `bins.per_hour` values remain unchanged for every chart type.
- Dynamic durations recalculate bins without replacing `auto` in the tool's
  runtime config.
- `low`, `medium`, and `high` select the expected neighboring logical
  interval.
- Cartesian chart types use configured width; radial barcode uses its
  circumference.
- Rolling-window and calendar graphs retain correct history, x-axis snapping,
  bin timers, aggregation, and tooltips.
- Real-time and state-band charts retain their current behavior.
- Existing cards with explicit bin values remain visually unchanged.
- Lint and bundle generation pass with `npm run build`.
