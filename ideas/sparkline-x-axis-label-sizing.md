# Locale-Aware Sparkline X-Axis Label Sizing

## Main Goal

Make automatic x-axis tick selection account for the labels produced by the
active Home Assistant locale and time format.

The current calculation implicitly reserves space for a fixed short label.
That works for labels such as `21 jul` and `12:12`, but not for every locale.
For example, a 12-hour time may be formatted as `11:21 PM`. A short month name
is also locale-dependent and is not guaranteed to contain exactly three
characters.

The existing Home Assistant date and time formatters remain the single source
of truth for visible labels. Do not duplicate their formatting with manually
constructed strings.

## Required Behavior

Before calculating automatic x-axis intervals, determine the longest possible
label for the active Home Assistant locale and time format:

- Format one representative two-digit day for all twelve months with
  `formatDateVeryShort()`.
- Format all twenty-four hours with two-digit minutes using `formatTime()`.
- Compare every resulting string and retain the greatest non-whitespace character count.

Testing every month is required because `month: 'short'` does not guarantee a
fixed three-character result. Testing every hour ensures that 12-hour formats
include both AM and PM and a two-digit displayed hour such as `11:21 PM`.

Cache the resulting character count per Home Assistant locale and time format.
Sensor state updates must not repeat the complete sample calculation while the
formatting settings remain unchanged.

## Tool And Engine Responsibilities

`SparklineGraphTool` owns locale-aware formatting. It calculates the maximum
label character count with the existing Home Assistant formatters and adds the
result to the internal graph configuration.

`SparklineGraph` remains independent of Home Assistant formatting. It consumes
the supplied character count while calculating the available number of x-axis
labels:

```text
approxLabelWidth = (maxLabelLength / 5) * (1 * fontWidthPixels + FONT_SIZE)
```

The existing average character-width estimate remains in use. This change does
not introduce SVG, DOM, or canvas text measurement into the graph engine.

## Width Formula Comparison

With the default x-axis label settings, the values used by the calculation are:

```text
FONT_SIZE = 12
x-axis font size = 0.5em
fontWidthPixels = 0.5 * 12 * 0.45 = 2.7px
```

Three formulas were considered:

```text
Compatible:     (maxLabelLength / 5) * (fontWidthPixels + FONT_SIZE)
Characters:     maxLabelLength * fontWidthPixels
With 12px pad:  maxLabelLength * fontWidthPixels + FONT_SIZE
```

Their resulting estimated widths are:

| Label length | Compatible | Characters | With 12px pad |
| ---: | ---: | ---: | ---: |
| 5 | 14.70px | 13.50px | 25.50px |
| 6 | 17.64px | 16.20px | 28.20px |
| 7 | 20.58px | 18.90px | 30.90px |
| 8 | 23.52px | 21.60px | 33.60px |
| 9 | 26.46px | 24.30px | 36.30px |
| 10 | 29.40px | 27.00px | 39.00px |

For these defaults, the compatible formula is equivalent to approximately
`maxLabelLength * 2.94`. The characters-only formula uses
`maxLabelLength * 2.7`. Across the relevant short labels, the compatible
formula therefore reserves approximately 1 to 2 pixels more than the pure
character estimate.

The fixed `12px` padding variant is substantially wider and can unnecessarily
move an otherwise fitting one-hour axis to two-hour intervals. The compatible
formula is retained because a five-character label produces exactly the same
width as before, while longer localized labels receive proportionally more
space.

## Unchanged Behavior

This change must not alter:

- the text returned by `formatDateVeryShort()` or `formatTime()`
- x-axis tick timestamps or positions
- grid alignment
- graph bucket alignment
- calendar and rolling-window range calculations
- y-axis geometry

Only the number of x-axis labels that can fit automatically may change.

## Verification

Build the project with `npm run build` and verify:

- English with 12-hour time, including a label such as `11:21 PM`
- English with 24-hour time
- Dutch with 24-hour time
- short date labels from months with different localized lengths
- rolling-window graphs without overlapping x-axis labels
- calendar graphs without overlapping x-axis labels
- unchanged alignment between ticks, grid lines, buckets, and graph points

