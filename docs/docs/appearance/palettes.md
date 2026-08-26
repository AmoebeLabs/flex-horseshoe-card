---
template: main.html
title: External Palettes
description: Load reusable color palettes from external JSON files and provide separate colors for Home Assistant light and dark modes.
tags:
  - Themes
  - Palettes
  - Colors
---
# External palettes

External palettes store reusable color variables in a separate JSON file that the Flexible Horseshoe Card can load.

They are useful when several cards share the same color system or when large color definitions would make the card YAML difficult to read. A palette can also provide separate values for Home Assistant light and dark modes, allowing the card to adapt automatically to the active theme.

## :material-horseshoe: Basic usage

Define external palettes in the top-level `palettes` section of the card configuration.

Each entry contains:

- a palette name;
- the path to its JSON file.

```yaml linenums="1"
palettes:
  rainbow: /local/palettes/rainbow-palette-new.json
```

In this example:

| Part | Meaning |
| :--- | :------ |
| `rainbow` | The name used to identify the palette. |
| `/local/palettes/rainbow-palette-new.json` | The location of the external JSON file. |

The browser loads the palette file separately. Once available, its variables can be used throughout the card configuration.

!!! info "Palette loading and browser cache"
    A palette may take a moment to load the first time it is used or after a hard refresh.

    Until loading is complete, colors that depend on the palette may temporarily fall back to black or another default value. The configured colors appear as soon as the palette becomes available.

## :material-horseshoe: Palette file structure

An external palette contains two main sections:

| Section | Purpose |
| :------ | :------ |
| `ref` | Stores the base color references. |
| `modes` | Maps palette variables to values for light and dark mode. |

This structure follows the same general idea as Home Assistant theme variables: define the base values once, then select suitable values for each display mode.

```json linenums="1"
{
  "ref": {
    "fhs-ref-rainbow-red50": "#de3730ff",
    "fhs-ref-rainbow-red70": "#ff897dff",
    "fhs-ref-rainbow-blue50": "#0075e1ff",
    "fhs-ref-rainbow-blue70": "#73aaffff"
  },
  "modes": {
    "light": {
      "fhs-sys-rainbow-red": "var(--fhs-ref-rainbow-red50)",
      "fhs-sys-rainbow-blue": "var(--fhs-ref-rainbow-blue50)"
    },
    "dark": {
      "fhs-sys-rainbow-red": "var(--fhs-ref-rainbow-red70)",
      "fhs-sys-rainbow-blue": "var(--fhs-ref-rainbow-blue70)"
    }
  }
}
```

The `ref` section contains the actual color values. The `modes` section defines which references the card should use in light and dark mode.

## :material-horseshoe: Material Design 3 palette format

The palette structure is based on the Material Design 3 tonal palette concept.

Each color is represented by a range of tonal values, typically numbered from `0` to `100`. Lower values are darker, while higher values are lighter.

| Token | Meaning |
| :---- | :------ |
| `fhs-ref-rainbow-red0` | Darkest red tone. |
| `fhs-ref-rainbow-red50` | Mid-range red tone. |
| `fhs-ref-rainbow-red90` | Very light red tone. |
| `fhs-ref-rainbow-red100` | Lightest red tone. |

The `ref` section stores these tonal values. The `modes` section then selects which tone should be used for each display mode.

For example, a light theme might use `red50`, while a dark theme uses `red70`. The card YAML can continue using the same system variable, while the palette chooses the appropriate underlying color.

## :material-horseshoe: Creating your own palette

You can create an external palette with a dedicated palette generator, a design tool, or an AI assistant.

Palette generators are useful when you need precise Material Design 3 tonal output from one or more seed colors. An AI assistant can help produce the required JSON structure, consistent variable names, and separate mappings for light and dark mode.

A useful prompt should specify:

- the base or seed colors;
- the palette name or naming prefix;
- whether light and dark mode mappings are required;
- the expected `ref` and `modes` structure;
- the required tone steps, such as `0`, `10`, `20`, `30`, `40`, `50`, `60`, `70`, `80`, `90`, `95`, `99`, and `100`.

Example prompt:

```text
Create a Material Design 3 style tonal palette as JSON for the Flexible Horseshoe Card.

Use the prefix fhs-ref-energy and create tonal values from 0 to 100 for green, yellow, orange, and red.

Add a modes section with light and dark mappings using fhs-sys-energy-green, fhs-sys-energy-yellow, fhs-sys-energy-orange, and fhs-sys-energy-red.

Use this structure:
{
  "ref": {},
  "modes": {
    "light": {},
    "dark": {}
  }
}
```

!!! tip "Review generated palettes"
    Treat AI-generated palettes as a starting point. Review them visually, verify sufficient contrast in both modes, and confirm that every generated variable name matches the name used in the card YAML.

## :material-horseshoe: Using palette colors

After loading the palette, use its variables like other CSS custom properties.

```yaml linenums="1"
color_stops:
  mode: gradient
  colors:
    0: var(--fhs-sys-rainbow-blue)
    1: var(--fhs-sys-rainbow-green)
    2: var(--fhs-sys-rainbow-yellow)
    3: var(--fhs-sys-rainbow-orange)
    4: var(--fhs-sys-rainbow-red)
    5: var(--fhs-sys-rainbow-purple)
```

Palette variables can also be used in styles:

```yaml linenums="1"
styles:
  - stroke: var(--fhs-sys-rainbow-blue)
  - fill: var(--fhs-sys-rainbow-green)
```

This keeps the card YAML readable while the external file manages the underlying color system.

## :material-horseshoe: Light and dark mode

The `modes` section can assign different references to the same system variable for light and dark mode.

```json linenums="1"
{
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

In light mode, `--fhs-sys-rainbow-red` resolves to `--fhs-ref-rainbow-red50`. In dark mode, it resolves to `--fhs-ref-rainbow-red70`.

The card configuration can therefore keep using one variable:

```yaml linenums="1"
stroke: var(--fhs-sys-rainbow-red)
```

The displayed color changes automatically with the active mode.

## :material-horseshoe: Example palette

The following rainbow palette includes tonal reference colors and separate mappings for light and dark mode.

```json linenums="1"
{
  "ref": {
    "fhs-ref-rainbow-red0": "#000000ff",
    "fhs-ref-rainbow-red10": "#410002ff",
    "fhs-ref-rainbow-red20": "#690005ff",
    "fhs-ref-rainbow-red30": "#93000aff",
    "fhs-ref-rainbow-red40": "#ba1a1aff",
    "fhs-ref-rainbow-red50": "#de3730ff",
    "fhs-ref-rainbow-red60": "#ff5449ff",
    "fhs-ref-rainbow-red70": "#ff897dff",
    "fhs-ref-rainbow-red80": "#ffb4abff",
    "fhs-ref-rainbow-red90": "#ffdad6ff",
    "fhs-ref-rainbow-red95": "#ffedeaff",
    "fhs-ref-rainbow-red99": "#fffbffff",
    "fhs-ref-rainbow-red100": "#ffffffff",

    "fhs-ref-rainbow-orange0": "#000000ff",
    "fhs-ref-rainbow-orange10": "#330300ff",
    "fhs-ref-rainbow-orange20": "#5c0b00ff",
    "fhs-ref-rainbow-orange30": "#851c06ff",
    "fhs-ref-rainbow-orange40": "#a84a00ff",
    "fhs-ref-rainbow-orange50": "#c45100ff",
    "fhs-ref-rainbow-orange60": "#e66a12ff",
    "fhs-ref-rainbow-orange70": "#ff8833ff",
    "fhs-ref-rainbow-orange80": "#ffaa66ff",
    "fhs-ref-rainbow-orange90": "#ffdcc2ff",
    "fhs-ref-rainbow-orange95": "#ffefe0ff",
    "fhs-ref-rainbow-orange99": "#fffbf7ff",
    "fhs-ref-rainbow-orange100": "#ffffffff",

    "fhs-ref-rainbow-yellow0": "#000000ff",
    "fhs-ref-rainbow-yellow10": "#341f00ff",
    "fhs-ref-rainbow-yellow20": "#5b3700ff",
    "fhs-ref-rainbow-yellow30": "#7d5200ff",
    "fhs-ref-rainbow-yellow40": "#9c6f00ff",
    "fhs-ref-rainbow-yellow50": "#bc8b00ff",
    "fhs-ref-rainbow-yellow60": "#d9a800ff",
    "fhs-ref-rainbow-yellow70": "#f2c500ff",
    "fhs-ref-rainbow-yellow80": "#ffde4dff",
    "fhs-ref-rainbow-yellow90": "#fff29eff",
    "fhs-ref-rainbow-yellow95": "#fff9cfff",
    "fhs-ref-rainbow-yellow99": "#fffdf0ff",
    "fhs-ref-rainbow-yellow100": "#ffffffff",

    "fhs-ref-rainbow-green0": "#000000ff",
    "fhs-ref-rainbow-green10": "#00210bff",
    "fhs-ref-rainbow-green20": "#003918ff",
    "fhs-ref-rainbow-green30": "#005227ff",
    "fhs-ref-rainbow-green40": "#006d36ff",
    "fhs-ref-rainbow-green50": "#008947ff",
    "fhs-ref-rainbow-green60": "#00a65aff",
    "fhs-ref-rainbow-green70": "#2fc371ff",
    "fhs-ref-rainbow-green80": "#53e089ff",
    "fhs-ref-rainbow-green90": "#73fca3ff",
    "fhs-ref-rainbow-green95": "#c2ffd0ff",
    "fhs-ref-rainbow-green99": "#f7fff5ff",
    "fhs-ref-rainbow-green100": "#ffffffff",

    "fhs-ref-rainbow-blue0": "#000000ff",
    "fhs-ref-rainbow-blue10": "#001b3fff",
    "fhs-ref-rainbow-blue20": "#003063ff",
    "fhs-ref-rainbow-blue30": "#00468bff",
    "fhs-ref-rainbow-blue40": "#005db5ff",
    "fhs-ref-rainbow-blue50": "#0075e1ff",
    "fhs-ref-rainbow-blue60": "#3c8fffff",
    "fhs-ref-rainbow-blue70": "#73aaffff",
    "fhs-ref-rainbow-blue80": "#a8c7ffff",
    "fhs-ref-rainbow-blue90": "#d6e3ffff",
    "fhs-ref-rainbow-blue95": "#ecf0ffff",
    "fhs-ref-rainbow-blue99": "#fefbffff",
    "fhs-ref-rainbow-blue100": "#ffffffff",

    "fhs-ref-rainbow-purple0": "#000000ff",
    "fhs-ref-rainbow-purple10": "#2b0052ff",
    "fhs-ref-rainbow-purple20": "#47007fff",
    "fhs-ref-rainbow-purple30": "#6500adff",
    "fhs-ref-rainbow-purple40": "#7f2bcaff",
    "fhs-ref-rainbow-purple50": "#9b46e7ff",
    "fhs-ref-rainbow-purple60": "#b762ffff",
    "fhs-ref-rainbow-purple70": "#cc8affff",
    "fhs-ref-rainbow-purple80": "#deb5ffff",
    "fhs-ref-rainbow-purple90": "#f0dbffff",
    "fhs-ref-rainbow-purple95": "#f9edffff",
    "fhs-ref-rainbow-purple99": "#fffbffff",
    "fhs-ref-rainbow-purple100": "#ffffffff"
  },
  "modes": {
    "light": {
      "fhs-sys-rainbow-red": "var(--fhs-ref-rainbow-red50)",
      "fhs-sys-rainbow-orange": "var(--fhs-ref-rainbow-orange60)",
      "fhs-sys-rainbow-yellow": "var(--fhs-ref-rainbow-yellow60)",
      "fhs-sys-rainbow-green": "var(--fhs-ref-rainbow-green50)",
      "fhs-sys-rainbow-blue": "var(--fhs-ref-rainbow-blue50)",
      "fhs-sys-rainbow-purple": "var(--fhs-ref-rainbow-purple50)"
    },
    "dark": {
      "fhs-sys-rainbow-red": "var(--fhs-ref-rainbow-red70)",
      "fhs-sys-rainbow-orange": "var(--fhs-ref-rainbow-orange70)",
      "fhs-sys-rainbow-yellow": "var(--fhs-ref-rainbow-yellow70)",
      "fhs-sys-rainbow-green": "var(--fhs-ref-rainbow-green70)",
      "fhs-sys-rainbow-blue": "var(--fhs-ref-rainbow-blue70)",
      "fhs-sys-rainbow-purple": "var(--fhs-ref-rainbow-purple70)"
    }
  }
}
```

## :material-horseshoe: When to use external palettes

External palettes are a good choice when:

- multiple cards share the same color system;
- the color definitions are too large to keep in the card YAML;
- light and dark mode require different values;
- the dashboard uses a custom visual identity;
- the same color variables are reused in several places.

For a small, one-off card, inline color stops may be simpler. For larger dashboards and reusable designs, external palettes keep the configuration cleaner and easier to maintain.
