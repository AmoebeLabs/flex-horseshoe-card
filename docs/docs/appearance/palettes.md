---
template: main.html
title: External Palettes
description: Create reusable Flexible Horseshoe Card color palettes in external JSON files, with separate colors for Home Assistant light and dark themes.
tags:
  - Themes
  - Palettes
  - Colors
---
# External palettes

An external palette stores named colors outside the card YAML so the same color system can be reused by many cards. A palette can also provide different values for Home Assistant light and dark mode while the card keeps using the same color names.

This page shows how to load a palette, how its JSON file is structured, and how to use its colors in the card.

## :material-horseshoe: Load a palette

Load a palette when named theme colors should be available throughout the card without repeating individual color values.

```yaml linenums="1"
palettes:
  rainbow: /local/palettes/rainbow-palette-new.json  # Load this palette as "rainbow"
```

`rainbow` is the name used by the card. The second value is the path to the JSON file.

!!! info "Palette loading and browser cache"
    A palette may take a moment to load the first time it is used or after a hard refresh. Palette-dependent colors appear as soon as the file becomes available.

## :material-horseshoe: Use a palette color

After loading the file, use its CSS variables like other colors:

```yaml linenums="1"
layout:
  rectangles:
    - xpos: 50  # Horizontal center of the Rectangle
      ypos: 50  # Vertical center of the Rectangle
      width: 50  # Rectangle width in card coordinates
      height: 24  # Rectangle height in card coordinates
      styles:
        stroke: var(--fhs-sys-rainbow-blue)  # Border or line color
        fill: var(--fhs-sys-rainbow-green)  # Fill color of this item
```
They can also be used in color stops:

```yaml linenums="1"
entities:
  - entity: sensor.temperature  # Entity used by this example

layout:
  rectangles:
    - xpos: 50  # Horizontal center of the Rectangle
      ypos: 50  # Vertical center of the Rectangle
      width: 50  # Rectangle width in card coordinates
      height: 24  # Rectangle height in card coordinates
      entity_index: 0  # Use the first entity configured above
      # Use reusable palette colors as the value scale.
      color_stops:
        colors:
          0: var(--fhs-sys-rainbow-blue)
          50: var(--fhs-sys-rainbow-yellow)
          100: var(--fhs-sys-rainbow-red)
```
## :material-horseshoe: Use different colors for light and dark mode

The palette file can map the same variable to different color references:

```json linenums="1"
{
  "ref": {
    "fhs-ref-rainbow-red50": "#de3730ff",
    "fhs-ref-rainbow-red70": "#ff897dff"
  },
  "modes": {
    "light": {
      "fhs-sys-rainbow-red": "var(--fhs-ref-rainbow-red50)"
    },
    "dark": {
      "fhs-sys-rainbow-red": "var(--fhs-ref-rainbow-red70)"
    }
  }
}
```

The card keeps using `var(--fhs-sys-rainbow-red)`; the active mode chooses the actual color.

## :material-horseshoe: Create your own palette

A palette contains:

- `ref` for the actual color values;
- `modes.light` for light-mode mappings;
- `modes.dark` for dark-mode mappings.

Write the palette keys without the CSS `--` prefix. For example, define `fhs-sys-rainbow-red` in the JSON and use it in card YAML as `var(--fhs-sys-rainbow-red)`.

Keep variable names consistent so the same names can be used throughout your cards.

## :material-horseshoe: Use Material Design tonal colors

A palette can contain tonal values from dark to light, commonly named from `0` to `100`. The light and dark mappings then choose a suitable tone without changing the variable used by the card.

## :material-horseshoe: Related

- [Color stops](color-stops.md)
- [Styling](styling.md)
- [Color filters](color-filters.md)
