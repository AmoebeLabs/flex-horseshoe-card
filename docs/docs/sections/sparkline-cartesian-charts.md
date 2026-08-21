---
template: main.html
title: Sparkline Cartesian Charts and Axes
description: Configure line, area, min-max, bar, and point graphs with automatic X and Y axes, grids, tick marks, labels, and tooltips.
tags:
- Section
- Sparkline
- Chart
---

# Sparkline Cartesian charts and automatic axes

Line, area, dots, and bar charts display time along the horizontal axis and sensor values along the vertical axis. Start by choosing the history period and number of bins, then select how those bins should appear. The card automatically determines suitable scales, grid lines, tick marks, and labels based on the graph size and the values currently in view.

The X-axis follows the selected history period:

* A rolling window moves forward with the available bins.
* A current calendar period covers the full calendar range while the graph fills up to the current bin.
* Local midnight appears as a date, while other ticks use an appropriate local time format.

Move the pointer or a finger across a supported chart to inspect the nearest time interval. The tooltip shows the date or time together with the formatted minimum, average, and maximum values.

## :material-horseshoe: Line chart

### Basic usage

A line chart connects sensor values over time. It is well suited to showing trends while keeping changes in direction easy to recognize.

```yaml linenums="1"
sparkline:
  state_values:
    aggregate_func: avg
    smoothing: true
  show:
    chart_type: line
    line: true
```

Enable points to mark the individual values along the line:

```yaml linenums="1"
sparkline:
  show:
    chart_type: line
    line: true
    points: true
```

### Configuration fields

| Field                         |     Required     | Description                                              |
| :---------------------------- | :--------------: | :------------------------------------------------------- |
| `show.chart_type`             | :material-check: | Use `line` to display a line chart.                      |
| `show.line`                   | :material-close: | Shows or hides the line.                                 |
| `show.points`                 | :material-close: | Adds a point for each displayed time interval.           |
| `state_values.aggregate_func` | :material-close: | Chooses which value is displayed for each time interval. |
| `state_values.smoothing`      | :material-close: | Uses smooth or straight connections between values.      |
| `line.show_dots`              | :material-close: | Adds dots through the line configuration.                |
| `line.line_width`             | :material-close: | Controls the width of the line.                          |
| `line.styles`                 | :material-close: | Applies SVG styles to the line.                          |

### Styling

Use `line.styles` to adjust the appearance of the line:

```yaml linenums="1"
line:
  styles:
    - fill: none
    - stroke: var(--primary-color)
    - stroke-width: 1
    - stroke-linecap: round
    - stroke-linejoin: round
```

Point size and appearance can be adjusted with the applicable point or dot settings.

### Period support

| `real_time` | `rolling_window` | `calendar` |
| :-: | :-: | :-: |
| :material-close: | :material-check: | :material-check: |

### Axes, grid, labels, and tooltip

| Display element       | Support         |
| :-------------------- | :-------------- |
| X-axis                | Yes, automatic. |
| Y-axis                | Yes, automatic. |
| Grid                  | X and Y.        |
| Tick marks            | X and Y.        |
| Labels                | X and Y.        |
| Tooltip and indicator | Yes.            |

## :material-horseshoe: Area chart

### Basic usage

An area chart displays sensor history as a filled graph. Use it when the size and direction of changes should stand out more clearly than they would with a line alone.

|                                                        Area Day Chart                                                        |                                                   Area Week Chart with min/max values                                                   |
| :--------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------------: |
| ![Flexible Horseshoe Card - Sparkline Area Chart](../assets/screenshots/fhs-demo-card-study-temperature-area-day--dark.webp) | ![Flexible Horseshoe Card - Sparkline Area Min/Max Chart](../assets/screenshots/fhs-demo-card-study-temperature-area-minmax--dark.webp) |

```yaml linenums="1"
sparkline:
  state_values:
    aggregate_func: avg
    smoothing: true
  show:
    chart_type: area
    line: true
    area: true
    fill: fade
```

Line and area charts can also display the lowest and highest values for each time interval. The automatic Y-axis expands as needed to keep the full visible range inside the graph.

### Configuration fields

| Field                         |     Required     | Description                                              |
| :---------------------------- | :--------------: | :------------------------------------------------------- |
| `show.chart_type`             | :material-check: | Use `area` to display an area chart.                     |
| `show.line`                   | :material-close: | Shows the line above the filled area.                    |
| `show.area`                   | :material-close: | Shows or hides the filled area.                          |
| `show.fill`                   | :material-close: | Chooses the fill behavior, including `fade`.             |
| `show.points`                 | :material-close: | Adds a point for each displayed time interval.           |
| `state_values.aggregate_func` | :material-close: | Chooses which value is displayed for each time interval. |
| `state_values.smoothing`      | :material-close: | Uses smooth or straight connections between values.      |
| `area.show_dots`              | :material-close: | Adds dots through the area configuration.                |
| `area.styles`                 | :material-close: | Applies SVG styles to the area.                          |

### Styling

Use `area.styles` to control the fill color and opacity:

```yaml linenums="1"
area:
  styles:
    - fill: var(--primary-color)
    - opacity: 0.25
```

`fill: fade` adds a vertical opacity transition. When the Y range crosses zero, the positive and negative areas are handled separately.

### Period support

| `real_time` | `rolling_window` | `calendar` |
| :-: | :-: | :-: |
| :material-close: | :material-check: | :material-check: |

### Axes, grid, labels, and tooltip

| Display element       | Support         |
| :-------------------- | :-------------- |
| X-axis                | Yes, automatic. |
| Y-axis                | Yes, automatic. |
| Grid                  | X and Y.        |
| Tick marks            | X and Y.        |
| Labels                | X and Y.        |
| Tooltip and indicator | Yes.            |

## :material-horseshoe: Dots chart

### Basic usage

A dots chart displays each value as a separate point. It is useful for spotting changes and outliers without connecting the values with a line.

|                                                            Dots chart                                                            |
| :------------------------------------------------------------------------------------------------------------------------------: |
| ![Flexible Horseshoe Card - Sparkline Dots Chart](../assets/screenshots/fhs-demo-card-dots-study-humidity--dark.webp){width=300} |

```yaml linenums="1"
sparkline:
  state_values:
    aggregate_func: avg
  show:
    chart_type: dots
```

Use `show.points` when points should be added to a line or area chart instead of shown as a standalone dots chart.

### Configuration fields

| Field                         |     Required     | Description                                                       |
| :---------------------------- | :--------------: | :---------------------------------------------------------------- |
| `show.chart_type`             | :material-check: | Use `dots` to display a standalone dots chart.                    |
| `state_values.aggregate_func` | :material-close: | Chooses which value is displayed for each time interval.          |
| `line_color`                  | :material-close: | Defines the dot color when no entity color or color stop applies. |
| `color_stops`                 | :material-close: | Defines value-based colors for the dots.                          |

### Styling

Use `line_color` for a fixed color, or configure `color_stops` to color each dot according to its value.

### Period support

| `real_time` | `rolling_window` | `calendar` |
| :-: | :-: | :-: |
| :material-close: | :material-check: | :material-check: |

### Axes, grid, labels, and tooltip

| Display element       | Support         |
| :-------------------- | :-------------- |
| X-axis                | Yes, automatic. |
| Y-axis                | Yes, automatic. |
| Grid                  | X and Y.        |
| Tick marks            | X and Y.        |
| Labels                | X and Y.        |
| Tooltip and indicator | Yes.            |

## :material-horseshoe: Bar chart

### Basic usage

A bar chart displays sensor values as separate vertical bars. A larger number of time intervals produces narrower bars, while fewer intervals result in wider bars.

|                                                             Bar chart                                                             |
| :-------------------------------------------------------------------------------------------------------------------------------: |
| ![Flexible Horseshoe Card - Sparkline Bar Chart](../assets/screenshots/fhs-demo-card-study-temperature-bar--dark.webp){width=300} |

```yaml linenums="1"
sparkline:
  state_values:
    aggregate_func: avg
  show:
    chart_type: bar
  bar:
    column_spacing: 1
```

When the selected history contains negative values, bars can extend both above and below zero.

### Configuration fields

| Field                         |     Required     | Description                                              |
| :---------------------------- | :--------------: | :------------------------------------------------------- |
| `show.chart_type`             | :material-check: | Use `bar` to display a bar chart.                        |
| `state_values.aggregate_func` | :material-close: | Chooses which value is displayed for each time interval. |
| `bar.column_spacing`          | :material-close: | Controls the space between adjacent bars.                |
| `bar.styles`                  | :material-close: | Applies SVG styles to the bars.                          |

### Styling

Bar colors can come from the configured line colors, the entity color, or color stops. Use `bar.styles` to further adjust their appearance.

### Period support

| `real_time` | `rolling_window` | `calendar` |
| :-: | :-: | :-: |
| :material-close: | :material-check: | :material-check: |

### Axes, grid, labels, and tooltip

| Display element       | Support         |
| :-------------------- | :-------------- |
| X-axis                | Yes, automatic. |
| Y-axis                | Yes, automatic. |
| Grid                  | X and Y.        |
| Tick marks            | X and Y.        |
| Labels                | X and Y.        |
| Tooltip and indicator | Yes.            |

## :material-horseshoe: Multiple series and legends

Use `series:` when one sparkline should compare multiple entities or chart types. Each series gets one color marker and one label in the declaration order.

Enable the legend through the sparkline visibility settings. The legend is a separate sibling area, so it reduces the graph area instead of covering the graph:

```yaml linenums="1"
sparklines:
  - id: climate-comparison
    entity_index: 0
    width: 88
    height: 78
    sparkline:
      show:
        chart_type: line
        legend: true
      legend:
        position: top
        rows: 2
        gap: 1
    series:
      - id: livingroom
        entity_index: 0
        color: var(--primary-color)
      - id: bedroom
        entity_index: 1
        color: var(--accent-color)
```

The legend position determines its layout direction:

| Position | Layout | Reserved dimension |
| :------- | :----- | :----------------- |
| `top` | Horizontal | Automatic from `rows`, font size and line height |
| `bottom` | Horizontal | Automatic from `rows`, font size and line height |
| `left` | Vertical | `legend.width` |
| `right` | Vertical | `legend.width` |

`legend.gap` reserves the space between the legend and graph. Use `legend.marker_size` and `legend.styles` to adjust the marker and label appearance. Use `legend.rows` to split a horizontal legend across multiple rows. The default is one row. The legend height is calculated from the row count, the active label font size and line height. Markers are constrained to that row height. Each label keeps that font size; `TextTool` applies width-based ellipsis inside its calculated slot.
Each series inherits the parent `sparkline` configuration. Override a line inside the series with `series[].sparkline.line`, keeping `show`, `line`, `area`, `dots`, and `bar` under the same `sparkline` hierarchy.

All series use the same X-axis and graph area. A multi-series tooltip shows one row per series, using the same declaration order and colors as the legend.

## :material-horseshoe: Showing the grid, axes, tick marks, and labels

Use `show` to choose which automatically calculated display elements are visible:

```yaml linenums="1"
sparkline:
  show:
    grid:
      x: true
      y: true
    axis:
      x: true
      y: true
    tickmarks:
      x: true
      y: true
    labels:
      x: true
      y: true
```

!!! warning "The chart only allows configs which are supported"
    Some charts don't support x or y-axis, so won't show that, even when enabled
    
Grid divisions, tick positions, and label placement adjust automatically to the chart. Existing configurations that use a boolean value, such as `axis: true`, continue to display both supported axes.

## :material-horseshoe: Logarithmic Y-axis

Set `state_values.logarithmic: true` when the meaningful variation in your data spans several orders of magnitude. This changes only the vertical value scale; the horizontal time scale remains the same.

Logarithmic mode works best with a suitable value range. Check the result with the intended sensor before using it as a default across a dashboard.

## :material-horseshoe: Tooltip styling

Configure the tooltip appearance under `tooltip.styles`:

```yaml linenums="1"
sparkline:
  tooltip:
    styles:
      - font-size: 0.65em
```

## :material-horseshoe: Related documentation

* [Sparkline Graphs](sparklines-section.md)
* [Sparkline History Periods and Bins](sparkline-history-periods.md)
* [Sparkline Specialized Charts](sparkline-specialized-charts.md)
* [CSS Styling](../core-concepts/css-styling.md)
