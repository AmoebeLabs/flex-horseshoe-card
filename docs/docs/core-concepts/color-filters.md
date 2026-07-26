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

Color filters transform colors before the card renders them.

They are useful when you want to reuse an existing layout or palette but change its overall appearance. For example, you can make a card grayscale, reduce saturation, adjust opacity, create a monochrome design, or apply a duotone effect.

Unlike browser CSS filters, `color_filter` does not place a visual effect over the rendered card. The card first resolves the configured color and then transforms it into a regular RGB or RGBA value before rendering.

This means `color_filter` works with concrete color properties such as `fill`, `stroke`, `color`, `stop-color`, and `flood-color`.

## :material-horseshoe: Examples

The following cards demonstrate several ways to apply color filters.

Card 55 keeps the original pollen colors for the active horseshoe state but applies a grayscale range to the horseshoe scale. The scale still uses color stops internally, while the filter converts the rendered scale colors to gray so the active segments stand out more clearly.

![](../assets/screenshots/fhs-demo-card-55-kleenex-pollen-radar--dark.webp#only-light)
![](../assets/screenshots/fhs-demo-card-55-kleenex-pollen-radar--dark.webp#only-dark)

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

Card 54 applies grayscale and lightness filters at the card level.

![](../assets/screenshots/fhs-demo-card-54-kleenex-pollen-radar--dark.webp#only-light)
![](../assets/screenshots/fhs-demo-card-54-kleenex-pollen-radar--dark.webp#only-dark)

```yaml linenums="1" hl_lines="2-6"
- type: custom:flex-horseshoe-card
  color_filter:
    grayscale: 0.6
    lightness:
      min: 0.2
      max: 1
```

!!! info
    Color filters do not affect external images or SVG files.

Card 53 uses a similar card-level filter with a different grayscale and lightness range:

```yaml linenums="1" hl_lines="2-6"
- type: custom:flex-horseshoe-card
  color_filter:
    grayscale: 0.7
    lightness:
      min: 0.3
      max: 0.7
```

![](../assets/screenshots/fhs-demo-card-53-kleenex-pollen-radar--dark.webp#only-light)
![](../assets/screenshots/fhs-demo-card-53-kleenex-pollen-radar--dark.webp#only-dark)

The final comparison shows:

- the original card on the left;
- the same card with a teal monochrome filter on the right.

The central arc background keeps its original color because inheritance is disabled for that item.

![](../assets/screenshots/fhs-demo-card-20o-electricity--dark.webp#only-light){width=300}
![](../assets/screenshots/fhs-demo-card-20o-electricity--dark.webp#only-dark){width=300}
![](../assets/screenshots/fhs-demo-card-20t-electricity--dark.webp#only-light){width=300}
![](../assets/screenshots/fhs-demo-card-20t-electricity--dark.webp#only-dark){width=300}

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

Configure a filter with `color_filter`.

```yaml linenums="1"
color_filter:
  grayscale: 1
```

This converts supported colors to full grayscale.

Smaller values preserve more of the original color:

```yaml linenums="1"
color_filter:
  grayscale: 0.4
```

This blends the source color with its grayscale equivalent.

## :material-horseshoe: Supported color properties

Color filters apply only to concrete color properties resolved by the card.

| Property | Common use |
| :------- | :--------- |
| `fill` | SVG fills, text, icons, and solid shapes |
| `stroke` | Lines, outlines, and strokes |
| `color` | General CSS color values |
| `stop-color` | Gradient color stops |
| `flood-color` | SVG flood colors where supported |

Values such as `none`, `currentColor`, `inherit`, and `url(...)` are skipped because they do not represent concrete colors that the card can transform directly.

## :material-horseshoe: Where color filters can be used

`color_filter` follows the same general inheritance model as styling. Higher levels can define defaults, while lower levels can extend or override them.

| Level | Purpose |
| :---- | :------ |
| Root card `color_filter` | Defines the default filter for the card. |
| Group `color_filter` | Applies a filter to items assigned to a group. |
| Item or tool `color_filter` | Applies a filter to one layout item or visual component. |
| Layer-specific `color_filter` | Applies a filter to a particular visual layer where supported. |
| State- or color-stop-specific `color_filter` | Transforms a color after a state or color stop selects it. |

The final filter is assembled from the active levels in order. Lower-level settings can refine or replace values inherited from higher levels.

## :material-horseshoe: Inheritance

Color filters cascade from higher levels to lower levels by default.

For example, a card-level filter affects all supported items unless a lower level changes or disables it.

```yaml linenums="1"
color_filter:
  saturation: 0.5

layout:
  states:
    - entity_index: 0
      xpos: 50
      ypos: 50
```

Here, the state item inherits the card-level saturation filter.

Use `inherit: false` to stop inheriting filters from higher levels:

```yaml linenums="1"
layout:
  groups:
    warning:
      color_filter:
        inherit: false
```

After `inherit: false`, only filters defined at that level or below remain active.

## :material-horseshoe: Global and property-specific filters

A filter can apply to all supported color properties:

```yaml linenums="1"
color_filter:
  grayscale: 1
```

You can also target an individual property, such as `fill` or `stroke`:

```yaml linenums="1"
color_filter:
  fill:
    grayscale: 1

  stroke:
    saturation: 0.4
```

For each property, the card combines global and property-specific settings. Property-specific values take precedence.

```yaml linenums="1"
color_filter:
  saturation: 0.5

  fill:
    saturation: 1
```

In this example, most supported color properties use `saturation: 0.5`, while `fill` uses `saturation: 1`.

## :material-horseshoe: Processing order

The processing order is fixed and cannot be rearranged in the configuration.

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

The card first resolves the source to a real color. It then applies the configured filters in this order and renders the final RGB or RGBA value.

## :material-horseshoe: Supported filters

The following filters are supported:

| Filter | Purpose |
| :----- | :------ |
| `grayscale` | Blends a color toward grayscale or maps lightness to a grayscale range. |
| `monochrome` | Maps colors to one color family. |
| `duotone` | Maps colors between dark and light endpoint colors. |
| `preserve_neutral` | Preserves black, white, and neutral gray when using `monochrome` or `duotone`. |
| `lightness` | Sets or maps OKLCH lightness. |
| `brightness` | Multiplies OKLCH lightness. |
| `contrast` | Moves RGB channels away from or toward middle gray. |
| `saturation` | Multiplies OKLCH chroma. |
| `opacity` | Multiplies the current alpha channel. |

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

A value of `1` produces full grayscale:

```yaml linenums="1"
color_filter:
  grayscale: 1
```

A value between `0` and `1` blends the original color with the grayscale result:

```yaml linenums="1"
color_filter:
  grayscale: 0.4
```

You can also map the source lightness to a grayscale range:

```yaml linenums="1"
color_filter:
  grayscale:
    min: 0.25
    max: 0.85
```

This preserves relative lightness differences while constraining the result to the configured range.

## :material-horseshoe: Lightness

`lightness` changes OKLCH lightness.

A numeric value sets an absolute lightness:

```yaml linenums="1"
color_filter:
  lightness: 0.7
```

A range maps the current lightness between `min` and `max`:

```yaml linenums="1"
color_filter:
  lightness:
    min: 0.2
    max: 0.9
```

This preserves relative differences between colors while keeping them within the configured range.

## :material-horseshoe: Monochrome

`monochrome` maps colors to one color family while preserving the source lightness.

The simplest form accepts a color:

```yaml linenums="1"
color_filter:
  monochrome: teal
```

The object form also lets you control the strength:

```yaml linenums="1"
color_filter:
  monochrome:
    color: teal
    amount: 0.6
```

An `amount` of `1` applies the full monochrome result. Lower values blend it with the original color.

## :material-horseshoe: Duotone

`duotone` maps colors between two endpoint colors.

The source lightness determines the mix position between the dark and light colors:

```yaml linenums="1"
color_filter:
  duotone:
    dark: '#1B4965'
    light: '#C2E7F0'
```

You can also control the strength with `amount`:

```yaml linenums="1"
color_filter:
  duotone:
    dark: '#1B4965'
    light: '#C2E7F0'
    amount: 0.7
```

An `amount` of `1` applies the full duotone result. Lower values blend it with the original color.

## :material-horseshoe: Preserve neutral colors

`preserve_neutral` keeps black, white, and neutral gray unchanged when using `monochrome` or `duotone`.

```yaml linenums="1"
color_filter:
  monochrome:
    color: teal
    amount: 1
  preserve_neutral: true
```

This is useful when restyling a card while keeping text, dividers, and neutral backgrounds readable.

## :material-horseshoe: Brightness

`brightness` multiplies OKLCH lightness.

```yaml linenums="1"
color_filter:
  brightness: 1.1
```

Values above `1` make colors brighter. Values below `1` make them darker.

## :material-horseshoe: Contrast

`contrast` moves RGB channels away from or toward middle gray.

```yaml linenums="1"
color_filter:
  contrast: 1.05
```

Values above `1` increase contrast. Values below `1` reduce it.

## :material-horseshoe: Saturation

`saturation` multiplies OKLCH chroma.

```yaml linenums="1"
color_filter:
  saturation: 0.8
```

Values below `1` reduce saturation. Values above `1` increase it.

## :material-horseshoe: Opacity

`opacity` multiplies the current alpha channel.

```yaml linenums="1"
color_filter:
  opacity: 0.7
```

It does not replace the existing alpha value. For example, a color with an alpha of `0.8` combined with `opacity: 0.5` renders with an alpha of `0.4`.

## :material-horseshoe: Color filters and color stops

Color stops and color filters perform different tasks.

Color stops select a color from a value. A color filter can then transform the selected color before rendering.

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

In this example, the color stop first selects `green`, `yellow`, or `red`. The filter then reduces the saturation of that selected color.

## :material-horseshoe: Theme-aware color stops and filters

Theme-aware color stops are related to `color_filter`, but they are configured separately.

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

The card first selects the active color-stop definition from the current Home Assistant theme mode. A `color_filter` can then transform the selected result:

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

Here, the active theme mode selects the color first, after which the brightness filter is applied.

## :material-horseshoe: Recipes

### Grayscale scale with a colored state

Apply the filter only to the scale:

```yaml linenums="1"
horseshoe_scale:
  color_filter:
    grayscale:
      min: 0.25
      max: 0.85
```

Do not apply the same filter to `horseshoe_state` when the active state should keep its original color-stop color.

### Monochrome card with neutral text preserved

Apply a card-level monochrome filter and preserve neutral colors:

```yaml linenums="1"
color_filter:
  monochrome:
    color: teal
    amount: 0.8
  preserve_neutral: true
```

This gives the card one consistent color family while keeping neutral text and dividers readable.

### Fill only

Use a property-specific filter when only one color property should change:

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

Use a card-level `color_filter` for broad visual changes, such as making the complete card monochrome or reducing saturation throughout the design.

Use an item-level `color_filter` when only one visual element should change.

Use property-specific filters when `fill` and `stroke` need different behavior.

Add `inherit: false` when a group or item should ignore filters inherited from the card or a parent group.

Keep filter chains simple. A small number of well-placed filters is easier to understand and maintain than many overlapping definitions.

Use color stops to select colors from values. Use color filters to transform those colors afterward.

## :material-horseshoe: Troubleshooting

When a color does not change, first check whether it resolves to a concrete color. Values such as `none`, `currentColor`, `inherit`, and `url(...)` are skipped.

When the result differs from what you expect, remember that the processing order is fixed. For example, saturation is applied after brightness and contrast.

When too many elements are affected, check whether they inherit a card-level or group-level filter.

To make an item ignore inherited filters, add:

```yaml linenums="1"
color_filter:
  inherit: false
```

When no `color_filter` is configured, the card renders the original colors unchanged.
