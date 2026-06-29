---
template: main.html
title: Color Filters
description: Use color filters to transform rendered colors without CSS filters.
tags:
  - Color Filters
  - Colors
  - Styling
  - Themes
---

# Color filters

Color filters let the card transform colors before they are rendered.

They are useful when you want to reuse an existing layout or palette, but adjust its visual appearance. For example, you can make a card grayscale, apply a monochrome look, reduce saturation, adjust opacity, or create a duotone effect.

Unlike browser CSS filters, `color_filter` does not apply a visual filter on top of the rendered card. Instead, the card resolves the actual color first and then transforms that color into a normal RGB or RGBA value before rendering.

This means `color_filter` works on real color values such as `fill`, `stroke`, `color`, `stop-color`, and `flood-color`.

Below some examples. The first two cards have a slightly different configuration, but you can see that the second card has a grayscale filter.

Card 55 displays the original pollen colors, but has a gray filter on the scale of the horseshoe. The scale has a color stop defined to show segments, but I wanted the scale in this case to become gray to make the filled segments stand-out.

![](../../assets/screenshots/fhs-demo-card-55-kleenex-pollen-radar--dark.webp#only-light)
![](../../assets/screenshots/fhs-demo-card-55-kleenex-pollen-radar--dark.webp#only-dark)

```yaml linenums="1" hl_lines="6-9"
horseshoe_scale:
  min: 0
  max: 4
  width: 27
  linecap: butt
  color_filter:
    grayscale:
      min: 0.2
      max: 0.6
```

Card 54 has a grayscale and lightness filter active at the card level.


![](../../assets/screenshots/fhs-demo-card-54-kleenex-pollen-radar--dark.webp#only-light)
![](../../assets/screenshots/fhs-demo-card-54-kleenex-pollen-radar--dark.webp#only-dark)

```yaml linenums="1" hl_lines="2-6"
- type: custom:flex-horseshoe-card
  color_filter:
    grayscale: 0.6
    lightness:
      min: 0.2
      max: 1
```
!!! info "The color filters do not alter external images and svgs"


Card 53 is a different card, but also has a filter defined at the card level:
```yaml linenums="1" hl_lines="2-6"
- type: custom:flex-horseshoe-card
  color_filter:
    grayscale: 0.7
    lightness:
      min: 0.3
      max: 0.7
```
![](../../assets/screenshots/fhs-demo-card-53-kleenex-pollen-radar--dark.webp#only-light)
![](../../assets/screenshots/fhs-demo-card-53-kleenex-pollen-radar--dark.webp#only-dark)


And the last ones:

- On the left the original card
- On the right the same card but with a teal filter, except for the central arc background which keeps its own color


![](../../assets/screenshots/fhs-demo-card-20o-electricity--dark.webp#only-light){width=300}
![](../../assets/screenshots/fhs-demo-card-20o-electricity--dark.webp#only-dark){width=300}
![](../../assets/screenshots/fhs-demo-card-20t-electricity--dark.webp#only-light){width=300}
![](../../assets/screenshots/fhs-demo-card-20t-electricity--dark.webp#only-dark){width=300}

```yaml linenums="1" hl_lines="2-9 18-19"
- type: custom:flex-horseshoe-card
  color_filter:
    monochrome:
      color: teal
      amount: 0.8
    preserve_neutral: true
    lightness:
      min: 0.2
      max: 1

<...>
  layout:
    arcs:
      - xpos: 50
        ypos: 50
        radius: 30
        arc_degrees: 300
        color_filter:
          inherit: false
        styles:
          - fill: var(--disabled-text-color)
          - opacity: 0.3

```



## :material-horseshoe: Basic idea

A color filter is configured with `color_filter`.

```yaml linenums="1"
color_filter:
  grayscale: 1
```

This turns supported colors fully grayscale.

You can also use smaller values:

```yaml linenums="1"
color_filter:
  grayscale: 0.4
```

This mixes the original color with a grayscale version.

## :material-horseshoe: Supported color properties

Color filters are applied to concrete color properties used by the card.

Supported properties are:

| Property | Common use |
| :------- | :--------- |
| `fill` | SVG fills, text fills, icon fills, shape fills |
| `stroke` | Lines, outlines, strokes |
| `color` | General CSS color values |
| `stop-color` | Gradient color stops |
| `flood-color` | Filter or SVG flood colors where supported |

Color values such as `none`, `currentColor`, `inherit`, and `url(...)` are skipped because they are not concrete colors.

## :material-horseshoe: Where color filters can be used

`color_filter` follows the same general idea as styling: higher-level configuration can define a default, and lower-level configuration can override or extend it.

Color filters can be configured at several levels, depending on the item:

| Level | Purpose |
| :---- | :------ |
| Root card `color_filter` | Applies a default filter to the card |
| Group `color_filter` | Applies a filter to items placed in a group |
| Item or tool `color_filter` | Applies a filter to one layout item or visual part |
| Layer-specific `color_filter` | Applies a filter to a specific visual layer where supported |
| State or color-stop specific `color_filter` | Applies a filter after a specific state or color stop has selected a color |

The final filter is built from the active levels in order. Lower-level settings can refine or override higher-level settings.

## :material-horseshoe: Inheritance

By default, color filters cascade from higher levels to lower levels.

For example, a card-level filter can affect all items unless a lower level overrides it.

```yaml linenums="1"
color_filter:
  saturation: 0.5

layout:
  states:
    - entity_index: 0
      xpos: 50
      ypos: 50
```

In this example, the state item inherits the card-level saturation filter.

To stop inheriting filters from higher levels, use `inherit: false`.

```yaml linenums="1"
layout:
  groups:
    warning:
      color_filter:
        inherit: false
```

After `inherit: false`, only filters defined at that level and below remain active.

## :material-horseshoe: Global filters and property-specific filters

A color filter can apply to all supported color properties:

```yaml linenums="1"
color_filter:
  grayscale: 1
```

You can also target a specific property, such as only `fill` or only `stroke`.

```yaml linenums="1"
color_filter:
  fill:
    grayscale: 1

  stroke:
    saturation: 0.4
```

Global filter keys and property-specific filter keys are merged for each property. Property-specific settings win for that property.

For example:

```yaml linenums="1"
color_filter:
  saturation: 0.5

  fill:
    saturation: 1
```

Here, most supported color properties use `saturation: 0.5`, but `fill` uses `saturation: 1`.

## :material-horseshoe: Processing order

The filter order is fixed by the card.

Users do not configure the order.

The card processes colors in this order:

```text
source color
-> resolve CSS color or CSS variable to RGBA
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

This means a color is first resolved to a real color. Then the configured filters are applied. Finally, the transformed RGB or RGBA color is rendered.

## :material-horseshoe: Supported filters

The following filters are currently supported:

| Filter | Purpose |
| :----- | :------ |
| `grayscale` | Mixes a color toward grayscale or maps lightness to a grayscale range |
| `monochrome` | Maps colors to one color family |
| `duotone` | Maps colors between a dark and light endpoint color |
| `preserve_neutral` | Keeps black, white, and neutral gray unchanged for `monochrome` and `duotone` |
| `lightness` | Sets or maps OKLCH lightness |
| `brightness` | Multiplies OKLCH lightness |
| `contrast` | Moves RGB channels away from or toward middle gray |
| `saturation` | Multiplies OKLCH chroma |
| `opacity` | Multiplies the current alpha channel |

The following filters are not currently supported:

- `theme_monochrome`
- `theme_duotone`
- hue rotation
- tint
- invert
- sepia
- threshold


## :material-horseshoe: Grayscale

`grayscale` converts colors toward grayscale.

A value of `1` means full grayscale:

```yaml linenums="1"
color_filter:
  grayscale: 1
```

A value between `0` and `1` mixes the original color with the grayscale result:

```yaml linenums="1"
color_filter:
  grayscale: 0.4
```

You can also use a mapping object with `min` and `max`.

```yaml linenums="1"
color_filter:
  grayscale:
    min: 0.25
    max: 0.85
```

This maps the source lightness into the configured range and returns a grayscale color.

## :material-horseshoe: Lightness

`lightness` changes OKLCH lightness.

A numeric value sets an absolute lightness:

```yaml linenums="1"
color_filter:
  lightness: 0.7
```

You can also map the current lightness into a range:

```yaml linenums="1"
color_filter:
  lightness:
    min: 0.2
    max: 0.9
```

This keeps relative differences between colors, but limits them to the configured lightness range.

## :material-horseshoe: Monochrome

`monochrome` maps colors to one color family while preserving source lightness.

The simplest form uses a color name or color value:

```yaml linenums="1"
color_filter:
  monochrome: teal
```

The object form lets you control the amount.

```yaml linenums="1"
color_filter:
  monochrome:
    color: teal
    amount: 0.6
```

`amount: 1` means full monochrome. Lower values mix the monochrome result with the original color.

## :material-horseshoe: Duotone

`duotone` maps colors between two endpoint colors.

The source lightness is used as the mix position between the dark and light colors.

```yaml linenums="1"
color_filter:
  duotone:
    dark: '#1B4965'
    light: '#C2E7F0'
```

You can also add `amount`.

```yaml linenums="1"
color_filter:
  duotone:
    dark: '#1B4965'
    light: '#C2E7F0'
    amount: 0.7
```

`amount: 1` means full duotone. Lower values mix the duotone result with the original color.

## :material-horseshoe: Preserve neutral colors

`preserve_neutral` keeps black, white, and neutral gray unchanged for `monochrome` and `duotone`.

```yaml linenums="1"
color_filter:
  monochrome:
    color: teal
    amount: 1
  preserve_neutral: true
```

This is useful when you want to restyle a card, but keep text, dividers, and neutral backgrounds readable.

## :material-horseshoe: Brightness

`brightness` multiplies OKLCH lightness.

```yaml linenums="1"
color_filter:
  brightness: 1.1
```

Values above `1` make colors brighter. Values below `1` make colors darker.

## :material-horseshoe: Contrast

`contrast` moves RGB channels away from or toward middle gray.

```yaml linenums="1"
color_filter:
  contrast: 1.05
```

Values above `1` increase contrast. Values below `1` reduce contrast.

## :material-horseshoe: Saturation

`saturation` multiplies OKLCH chroma.

```yaml linenums="1"
color_filter:
  saturation: 0.8
```

Values below `1` reduce saturation. Values above `1` increase saturation.

## :material-horseshoe: Opacity

`opacity` multiplies the current alpha channel.

```yaml linenums="1"
color_filter:
  opacity: 0.7
```

This does not replace the original alpha value. It multiplies it.

For example, a color with `0.8` alpha and `opacity: 0.5` renders with `0.4` alpha.

## :material-horseshoe: Color filters and color stops

Color filters are separate from color stops.

Color stops choose a color based on a value. Color filters can then transform the selected color before it is rendered.

```yaml linenums="1"
layout:
  horseshoes:
    - entity_index: 0
      xpos: 50
      ypos: 50
      radius: 40
      color_stops:
        colors:
          0: green
          50: yellow
          100: red
      color_filter:
        saturation: 0.7
```

In this example, the color stop first chooses `green`, `yellow`, or `red`. After that, `color_filter` reduces the saturation of the selected color.

## :material-horseshoe: Theme-aware color stops and color filters

Theme-aware color stops are related, but separate from `color_filter`.

Color stops can define different values for Home Assistant light and dark mode:

```yaml linenums="1"
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

The active color stop mode is selected from the current Home Assistant theme mode. After that, a `color_filter` can still transform the resulting color during render.

```yaml linenums="1"
color_stops:
  modes:
    light:
      colors:
        0: green
        100: red
    dark:
      colors:
        0: '#4ade80'
        100: '#f87171'

color_filter:
  brightness: 0.95
```

Here, the color is selected from the active theme mode first. Then the brightness filter is applied.

## :material-horseshoe: Recipes

### Grayscale scale with colored state

Put the filter on the scale only:

```yaml linenums="1"
horseshoe_scale:
  color_filter:
    grayscale:
      min: 0.25
      max: 0.85
```

Do not put the same filter on `horseshoe_state` if the active state should keep the original color stop color.

### Monochrome card with neutral text preserved

Use a card-level monochrome filter and preserve neutral colors:

```yaml linenums="1"
color_filter:
  monochrome:
    color: teal
    amount: 0.8
  preserve_neutral: true
```

This gives the card a consistent color family while keeping neutral text and dividers readable.

### Fill only

Use a property-specific filter when only one color property should be transformed.

```yaml linenums="1"
color_filter:
  fill:
    duotone:
      dark: '#1B4965'
      light: '#C2E7F0'
      amount: 0.7
```

This applies the duotone filter only to `fill`.

### Stroke only

```yaml linenums="1"
color_filter:
  stroke:
    saturation: 0.4
```

This reduces saturation only for strokes.

### Disable inheritance for one group

```yaml linenums="1"
layout:
  groups:
    warning:
      color_filter:
        inherit: false
```

This prevents the group from inheriting color filters from higher levels.

### Apply a filter to one layout item

```yaml linenums="1"
layout:
  states:
    - entity_index: 0
      xpos: 50
      ypos: 50
      color_filter:
        brightness: 1.15
        saturation: 0.9
```

This affects only that state item.

## :material-horseshoe: Practical tips

Use card-level `color_filter` for broad visual changes, such as making a whole card monochrome or less saturated.

Use item-level `color_filter` when only one visual element should change.

Use property-specific filters when the fill and stroke should behave differently.

Use `inherit: false` when a group or item should not inherit a filter from the card or group above it.

Keep filters simple. A small number of well-placed filters is easier to understand than many filters spread across different levels.

Use color stops to choose colors based on values. Use color filters to transform the color after it has been chosen.

## :material-horseshoe: Troubleshooting

If a color does not change, check whether the value is a concrete color. Values such as `none`, `currentColor`, `inherit`, and `url(...)` are skipped.

If the result looks different than expected, remember that the processing order is fixed. For example, saturation is applied after brightness and contrast.

If too many elements are affected, check whether a card-level or group-level filter is being inherited.

If an item should ignore inherited filters, add:

```yaml linenums="1"
color_filter:
  inherit: false
```

If no `color_filter` is configured, colors are not changed.
