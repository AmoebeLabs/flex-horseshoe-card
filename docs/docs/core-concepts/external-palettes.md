---
template: main.html
title: External Palettes
description: Load external JSON color palettes with light and dark mode support.
tags:
  - Themes
  - Palettes
  - Colors
---

# External palettes

External palettes let you define reusable color variables in a separate JSON file and load them into the Flexible Horseshoe Card.

This is useful when you want a consistent color system across multiple cards, or when you want to keep large color definitions out of your card YAML. A palette can also define different colors for light and dark mode, so your card can adapt to the active Home Assistant theme.

## :material-horseshoe: Basic usage

A palette is defined in the top-level `palettes` section of the card configuration.

Each palette has:

- a name
- a path to a JSON palette file

Example:

```yaml
palettes:
  rainbow: /local/palettes/rainbow-palette-new.json
```

In this example:

| Part | Meaning |
| :--- | :------ |
| `rainbow` | The palette name |
| `/local/palettes/rainbow-palette-new.json` | The location of the JSON palette file |

The palette file is loaded by the browser. After it has been loaded, the variables from the palette can be used in the card configuration.

!!! info "Palette loading and browser cache"
    External palettes are loaded separately by the browser. The first time a palette is used, or when it is not yet available in the browser cache, loading can take a short moment.

    During that time, colors that depend on the palette may temporarily fall back to black or another default value. Once the palette has loaded, the configured colors are applied.

    This usually only affects the first load or a hard refresh.

## :material-horseshoe: Palette file structure

An external palette is a JSON file with two main parts:

| Section | Purpose |
| :------ | :------ |
| `ref` | Defines the base color references |
| `modes` | Defines which colors are used in light and dark mode |

The structure follows the same idea as Home Assistant theme variables: base values are defined once, and mode-specific variables refer to those values.

A simplified palette looks like this:

```json
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

The `ref` section contains the actual color values. The `modes` section defines the variables that should be used by the card in light and dark mode.


## :material-horseshoe: Material Design 3 palette format

The palette structure is based on the Material Design 3 tonal palette idea.

In a Material Design 3 palette, each color is available in a range of tonal values, usually named from `0` to `100`. Lower values are darker, higher values are lighter. For example:

| Token | Meaning |
| :---- | :------ |
| `fhs-ref-rainbow-red0` | Darkest red tone |
| `fhs-ref-rainbow-red50` | Mid-range red tone |
| `fhs-ref-rainbow-red90` | Very light red tone |
| `fhs-ref-rainbow-red100` | Lightest red tone |

The `ref` section stores these tonal values. The `modes` section then chooses which tone should be used for light and dark mode.

For example, a light theme may use `red50`, while a dark theme may use `red70`. Your card YAML can keep using the same variable name, while the palette decides which actual color fits the active mode.

## :material-horseshoe: Creating your own palette

You can create an external palette in different ways.

Previously, tonal palettes like this were usually created with dedicated palette generators or design tools. Those tools are still useful, especially when you want exact Material Design 3 output from a seed color.

You can also create a palette with an AI assistant, such as ChatGPT. This can be helpful when you want a palette in the correct JSON structure, with consistent variable names and separate light and dark mode mappings.

A good prompt should include:

- the base colors or seed colors you want to use
- the palette name or naming prefix
- whether you want light and dark mode mappings
- the expected JSON structure with `ref` and `modes`
- the tone steps you want, such as `0`, `10`, `20`, `30`, `40`, `50`, `60`, `70`, `80`, `90`, `95`, `99`, and `100`

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
    AI-generated palettes are a good starting point, but always review the result visually. Check that the colors have enough contrast in both light and dark mode and that the generated variable names match the names used in your card YAML.


## :material-horseshoe: Using palette colors

After the palette is loaded, its variables can be used in card configuration just like other CSS variables.

For example:

```yaml
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

You can also use palette variables in styles:

```yaml
styles:
  - stroke: var(--fhs-sys-rainbow-blue)
  - fill: var(--fhs-sys-rainbow-green)
```

This keeps the card YAML readable while the actual color system stays in the external palette file.

## :material-horseshoe: Light and dark mode

The `modes` section allows a palette to define different values for light and dark mode.

Example:

```json
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

In light mode, `--fhs-sys-rainbow-red` uses `--fhs-ref-rainbow-red50`.

In dark mode, the same variable uses `--fhs-ref-rainbow-red70`.

This means your YAML can keep using the same variable name:

```yaml
stroke: var(--fhs-sys-rainbow-red)
```

The actual color changes automatically with the active mode.

## :material-horseshoe: Example palette

The following example shows the structure of a rainbow palette with reference colors and light/dark mode mappings.

```json
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

External palettes are useful when:

- multiple cards should use the same color system
- the list of colors is too large to keep inside the card YAML
- you want different colors for light and dark mode
- you want to create a custom look or branding for your dashboard
- you want to reuse color variables in several places

For small one-off cards, inline color stops may be simpler. For larger dashboards or reusable themes, external palettes keep the configuration cleaner and easier to maintain.
