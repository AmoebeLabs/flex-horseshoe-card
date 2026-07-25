# X-Axis Calendar Grid Alignment

## Problem

The automatic X-axis currently selects a suitable tick interval based on the available graph width, label width, and visible duration. That interval selection is useful and should remain unchanged.

The problem is the phase of the resulting ticks. Some paths start the tick sequence at the first visible bin or at the exact beginning of the visible range. In a rolling window this can produce labels such as `11:04`, `13:04`, and `15:04`. A 12-hour interval can similarly produce `05:00` and `17:00` every day, so no tick reaches local midnight and no date label appears.

Bins define valid data positions. They must not define the clock phase of the X-axis.

## Required Behavior

Keep the existing automatic interval selection. After selecting the interval, align the tick sequence to a local calendar grid anchored at local `00:00`.

Examples:

| Selected interval | Calendar-grid ticks |
| --- | --- |
| 1 hour | `00:00`, `01:00`, `02:00`, ... |
| 2 hours | `00:00`, `02:00`, `04:00`, ... |
| 4 hours | `00:00`, `04:00`, `08:00`, ... |
| 6 hours | `00:00`, `06:00`, `12:00`, `18:00` |
| 12 hours | `00:00`, `12:00` |
| 24 hours | local `00:00` on each applicable day |

The local-day anchor also applies when the visible range does not contain midnight. For a range starting at `05:17` with a two-hour interval, the first visible tick is `06:00`, because that tick belongs to the sequence calculated from local `00:00`.

Sub-hour intervals use the same principle. They are aligned from a natural local hour boundary instead of from the current time or first visible bin.

## Bin Compatibility

Every rendered tick must also correspond to a valid bin boundary. The selected label interval therefore needs to be compatible with the configured bin duration.

For two-minute bins:

- `11:05` is not a valid tick.
- `11:10` is a valid tick.
- Every whole hour is a valid tick.

If the initially selected nice interval is not compatible with the bin duration, choose the next suitable nice interval that is compatible. Do not shift the complete tick sequence to the timestamp of the first bin.

## Label Formatting

Tick geometry determines the timestamp first. Formatting is applied afterwards:

- A tick at local `00:00` is formatted as a date.
- Other ticks are formatted as local times.
- Minute-based labels are used only when the visible duration and available width require a sub-hour interval.
- Long ranges must not show arbitrary minute offsets merely because the first visible bin has that offset.

This produces the same clock-oriented behavior users expect from Home Assistant graphs while retaining exact alignment between labels, grid lines, and valid graph bins.

## Architecture

The generic X-axis owns this behavior for every time-based chart type, including `line`, `area`, `bar`, `dots`, `equalizer`, `barcode`, and `state_bands`.

The processing order is:

1. Determine the visible time range.
2. Select the automatic interval from duration, graph width, and formatted label width.
3. Adjust the interval when necessary so it is compatible with the bin duration.
4. Anchor the tick sequence to local `00:00` or a natural local sub-hour boundary.
5. Select the first anchored tick at or after the visible range start.
6. Generate the remaining ticks with the selected interval.
7. Convert every tick timestamp to an X coordinate using the shared graph geometry.
8. Format local midnight as a date and all other ticks as times.

Chart renderers consume the generated ticks. They must not independently calculate, shift, or reformat X-axis timestamps.

## Verification

Verification must cover:

- Calendar and rolling-window periods.
- Bin densities including 1, 2, 4, 6, 12, and 30 bins per hour.
- Sub-hour, hourly, multi-hour, daily, and multi-day label intervals.
- Windows that begin exactly on and between natural tick boundaries.
- Local midnight and daylight-saving-time transitions.
- Locales using 12-hour and 24-hour time formats.
- Exact alignment between ticks, grid lines, tooltips, and graph bins.
- No regression in automatic interval density or endpoint label containment.
