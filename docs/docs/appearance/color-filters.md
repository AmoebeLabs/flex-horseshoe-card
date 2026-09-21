---
template: main.html
title: Color Filters
description: Transform resolved card colors with reusable filters while preserving state-based color selection and inheritance.
tags:
  - Color Filters
  - Colors
  - Styling
  - Themes
---
# Color filters

A color filter changes a color after the card has already selected it. This is useful when you want to make existing colors lighter, darker, less saturated, monochrome, or otherwise adjust them without redefining every color.

This page shows where color filters can be used, what each filter does, and how to apply a filter to the whole card or only one item.

## :material-horseshoe: Make colors grayscale

Use grayscale when the same visual should keep its light/dark differences but lose its color information.

```yaml linenums="1"
type: custom:flex-horseshoe-card  # Card root; this filter applies at card level
color_filter:
  grayscale:
    min: 0.25  # Value at the start of the scale
    max: 0.85  # Value at the end of the scale
```
A filter can be applied to the complete card, a group, one item, or a supported part such as a Horseshoe scale.

## :material-horseshoe: Make colors lighter or darker

Use brightness adjustment when a selected color is correct but needs more or less visual emphasis.

```yaml linenums="1"
type: custom:flex-horseshoe-card  # Card root; this filter applies at card level
color_filter:
  brightness: 1.15  # Increase or reduce brightness of the selected color
```
Use a value below `1` to darken and above `1` to brighten.

## :material-horseshoe: Change saturation

Use saturation when a color should become more vivid or more muted without choosing a different base color.

```yaml linenums="1"
type: custom:flex-horseshoe-card  # Card root; this filter applies at card level
color_filter:
  saturation: 0.5  # Increase or reduce color saturation
```
Lower values reduce color intensity.

## :material-horseshoe: Make the card monochrome

Use monochrome when several source colors should be reduced to one consistent hue.

```yaml linenums="1"
type: custom:flex-horseshoe-card  # Card root; this filter applies at card level
color_filter:
  monochrome:
    color: teal
    amount: 0.8  # Strength of this color effect
  preserve_neutral: true  # Keep neutral colors unchanged
```
`preserve_neutral` keeps neutral text and dividers from being recolored with the rest of the card.

## :material-horseshoe: Use two tones

Use two-tone filtering when a visual should be reduced to two controlled color families instead of its original colors.

```yaml linenums="1"
type: custom:flex-horseshoe-card  # Card root; this filter applies at card level
color_filter:
  duotone:
    dark: "#1B4965"
    light: "#C2E7F0"
    amount: 0.7  # Strength of this color effect
```
## :material-horseshoe: Change only fill or stroke

Filter only the fill:

```yaml linenums="1"
type: custom:flex-horseshoe-card  # Card root; this filter applies at card level
color_filter:
  fill:
    brightness: 1.15  # Increase or reduce brightness of the selected color
```
Or only the stroke:

```yaml linenums="1"
type: custom:flex-horseshoe-card  # Card root; this filter applies at card level
color_filter:
  stroke:
    saturation: 0.4  # Increase or reduce color saturation
```
## :material-horseshoe: Apply a filter to one item

Apply a filter locally when only one visible item should change and the rest of the card must keep its normal colors.

```yaml linenums="1"
entities:
  - entity: sensor.example_1  # Entity used by this example

layout:
  states:
    - entity_index: 0  # Use entity 0 from entities: (0 = first entity)
      xpos: 50  # Horizontal position; 50 = center of the card
      ypos: 50  # Vertical position; 50 = center of the card
      color_filter:
        brightness: 1.15  # Increase or reduce brightness of the selected color
        saturation: 0.9  # Increase or reduce color saturation
```
## :material-horseshoe: Keep one item unchanged

When a parent filter should not affect one group or item:

```yaml linenums="1"
entities:
  - entity: sensor.example  # Entity used by this example

layout:
  states:
    - entity_index: 0  # Use the first entity configured above
      xpos: 50  # Horizontal center of the item
      ypos: 50  # Vertical center of the item
      color_filter:
        inherit: false  # Ignore color filters inherited from the card or group
```
## :material-horseshoe: Combine color stops and filters

Color stops choose the color first. A color filter can then adjust that selected color. This lets one value-based color system be reused with a different visual treatment.

When several filter fields are set together, they are applied in this order: `grayscale`, `monochrome`, `duotone`, `lightness`, `brightness`, `contrast`, `saturation`, then `opacity`. Property-specific filters such as `fill:` use the same order.

## :material-horseshoe: Available filters

Use these fields directly inside `color_filter:`. When a field is omitted, that adjustment is not applied.

| Filter | Values | Default | Visible effect |
| --- | --- | --- | --- |
| `grayscale` | number `0`–`1`, or `{min, max}` | Not set | A number mixes the original color toward grayscale: `0` leaves it unchanged and `1` removes all color. `{min, max}` makes it fully grayscale and remaps the original light/dark range into the configured `0`–`1` lightness range. |
| `lightness` | number `0`–`1`, or `{min, max}` | Not set | A number sets the resulting lightness directly; `{min, max}` remaps the original light/dark range into that interval. |
| `monochrome` | CSS color, or `{color, amount}` | Not set | Moves every affected color toward one chosen color while retaining its light/dark difference. `amount: 0` leaves the source color unchanged; `1` applies the full monochrome result. |
| `duotone` | `{dark, light, amount}` | Not set | Maps darker source colors toward `dark` and lighter source colors toward `light`. `amount` runs from `0` to `1` and defaults to `1`. |
| `brightness` | number | Not set | Multiplies lightness: `1` leaves it unchanged, values below `1` darken it, and values above `1` brighten it. |
| `contrast` | number | Not set | Multiplies contrast around middle gray: `1` leaves it unchanged, values below `1` reduce contrast, and values above `1` increase it. |
| `saturation` | number | Not set | Multiplies color intensity: `1` leaves it unchanged, `0` removes saturation, and values above `1` increase it. |
| `opacity` | number | Not set | Multiplies the existing opacity: `1` leaves it unchanged, `0` makes it transparent, and intermediate values make it partly transparent. |
| `preserve_neutral` | boolean | `false` | With `monochrome` or `duotone`, `true` leaves black, white, and neutral gray colors unchanged. |
| `inherit` | boolean | inherited | `false` discards filters inherited from the card or parent group before applying this local filter. |

The same filter fields can be nested under `fill`, `stroke`, `color`, `stop-color`, or `flood-color` when only that color property should change. A property-specific setting overrides the same filter inherited from the surrounding `color_filter` block for that property.

## :material-horseshoe: Troubleshooting

If a filter affects too much, check whether it is applied to the card or a parent group. Use `inherit: false` on an item that should ignore a parent filter.

Values such as `none`, `currentColor`, `inherit`, and `url(...)` are not normal resolved colors and may not be transformed.

## :material-horseshoe: Related

- [Color stops](color-stops.md)
- [Styling](styling.md)
- [Palettes](palettes.md)
