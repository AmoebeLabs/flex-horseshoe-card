# Flexible Horseshoe Card - Color Filter Architecture

## Goal

`color_filter` transforms real colors before render without relying on browser CSS filters. The implementation uses Culori and returns normal renderable RGB/RGBA colors.

The filter is applied late, after the normal style/color selection is known. It should behave like `styles`: config decides the cascade, render receives final style values.

## Current Scope

The current implementation lives in `color-filter.js`.

Supported color properties:

```text
fill
stroke
color
stop-color
flood-color
```

Supported filter keys:

```text
grayscale
monochrome
duotone
preserve_neutral
lightness
brightness
contrast
saturation
opacity
```

Not currently supported:

```text
theme_monochrome
theme_duotone
hue rotation
tint
invert
sepia
threshold
separate grayscale_map key
separate lightness_map key
```

`grayscale` and `lightness` already support both direct numeric values and `{ min, max }` mapping objects, so separate `*_map` keys are not needed.

## Cascade

`color_filter` uses an ordered cascade and is merged with `Merge.mergeDeep()`.

Current sources include:

```text
root card color_filter
active group color_filter entries
item/tool color_filter
layer-specific color_filter where supported
state/color-stop specific color_filter where supported
```

A filter can reset inherited filters with:

```yaml
color_filter:
  inherit: false
```

After `inherit: false`, only the filters defined at that level and below remain active.

## Property-Specific Filters

A filter can apply globally:

```yaml
color_filter:
  grayscale: 1
```

Or only to one color property:

```yaml
color_filter:
  fill:
    grayscale: 1

  stroke:
    saturation: 0.4
```

Global filter keys and property-specific filter keys are merged per property. Property-specific settings win for that property.

## Processing Order

The processing order is fixed in code:

```text
source color
-> resolve CSS color / CSS var to RGBA
-> grayscale
-> monochrome
-> duotone
-> lightness
-> brightness
-> contrast
-> saturation
-> opacity
-> RGB/RGBA for render
```

Users do not configure this order.

The filter skips these color values because they are not concrete colors:

```text
none
currentColor
inherit
url(...)
```

## Supported Filters

### grayscale

Numeric value mixes between original color and full grayscale.

```yaml
color_filter:
  grayscale: 1
```

```yaml
color_filter:
  grayscale: 0.4
```

Object value maps source lightness into a configured range and makes the result grayscale.

```yaml
color_filter:
  grayscale:
    min: 0.25
    max: 0.85
```

### lightness

Numeric value sets absolute OKLCH lightness.

```yaml
color_filter:
  lightness: 0.7
```

Object value maps current lightness into a configured range.

```yaml
color_filter:
  lightness:
    min: 0.2
    max: 0.9
```

### monochrome

String shorthand maps colors to one color family while preserving source lightness.

```yaml
color_filter:
  monochrome: teal
```

Object form adds `amount`. `amount: 1` means full monochrome; lower values mix with the original color.

```yaml
color_filter:
  monochrome:
    color: teal
    amount: 0.6
```

### duotone

Maps colors between two endpoint colors using source lightness as the mix position.

```yaml
color_filter:
  duotone:
    dark: '#1B4965'
    light: '#C2E7F0'
```

`amount` is supported here too.

```yaml
color_filter:
  duotone:
    dark: '#1B4965'
    light: '#C2E7F0'
    amount: 0.7
```

### preserve_neutral

Keeps black, white and neutral gray unchanged for `monochrome` and `duotone`.

```yaml
color_filter:
  monochrome:
    color: teal
    amount: 1
  preserve_neutral: true
```

This is useful for text, dividers and neutral backgrounds.

### brightness

Multiplies OKLCH lightness.

```yaml
color_filter:
  brightness: 1.1
```

### contrast

Moves RGB channels away from or toward middle gray.

```yaml
color_filter:
  contrast: 1.05
```

### saturation

Multiplies OKLCH chroma.

```yaml
color_filter:
  saturation: 0.8
```

### opacity

Multiplies the current alpha channel.

```yaml
color_filter:
  opacity: 0.7
```

## Theme-Aware Color Stops

This is related but separate from `color_filter`.

Extended color stop definitions can choose different colors for light/dark theme mode:

```yaml
color_stops:
  modes:
    light:
      colors:
        - value: 0
          color: green
        - value: 100
          color: red

    dark:
      colors:
        - value: 0
          color: red
        - value: 100
          color: green
```

Theme mode selection is based on Home Assistant dark mode. After the active color stop color is selected, a `color_filter` can still transform that resulting color during render.

## Recipes

### Grayscale Scale, Colored State

Put the filter on the scale only:

```yaml
horseshoe_scale:
  color_filter:
    grayscale:
      min: 0.25
      max: 0.85
```

Do not put the same filter on `horseshoe_state` if the active state should keep the original color stop color.

### Monochrome Card With Neutral Text Preserved

```yaml
color_filter:
  monochrome:
    color: teal
    amount: 0.8
  preserve_neutral: true
```

### Fill Only

```yaml
color_filter:
  fill:
    duotone:
      dark: '#1B4965'
      light: '#C2E7F0'
      amount: 0.7
```

### Disable Inheritance For One Group

```yaml
layout:
  groups:
    warning:
      color_filter:
        inherit: false
```

## Implementation Notes

- `color_filter` is config data, not a CSS `filter` string.
- Filters are applied to concrete color properties in style dictionaries.
- CSS variables are resolved through the existing color engine before Culori transforms are applied.
- If no filter is configured, colors must not change.
- Filter application belongs as late as possible, where the final render style is known.
- Template and palette loading should not be modified by the filter engine.
