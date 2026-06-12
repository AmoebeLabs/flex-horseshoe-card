---
template: main.html
title: CSS Styling
description: Use the styles section to style the card and individual layout items with CSS.
tags:
  - CSS Styling
---

# CSS Styling

The Flexible Horseshoe Card is built with SVG and CSS. Most visual parts of the card can be styled through a `styles` section.

You can use `styles` in two main places:

- on the card itself, to style the card container
- on layout items, to style individual elements such as states, names, icons, circles, lines, and horseshoes

This makes it possible to keep a card simple, or to create a fully customized visual design that matches your Home Assistant dashboard.

## :material-horseshoe: Card-level styles

The card itself can have a `styles` section. Use this for styling the card container, such as the background, border, shadow, padding, or other CSS properties that affect the whole card.

For example, you can set a background color:

```yaml linenums="1"
- type: custom:flex-horseshoe-card
  styles:
    background: var(--card-background-color)
```

You can also use a background image:

```yaml linenums="1"
- type: custom:flex-horseshoe-card
  styles:
    background-image: url('/local/images/backgrounds/energy-card.png')
    background-size: cover
    background-position: center
```

Card-level styling is useful when you want the entire card to have a specific look, independent of the individual layout items inside it.

## :material-horseshoe: Item-level styles

Most layout items also support a `styles` section. These styles apply only to that specific item.

For example, a state value can be styled like this:

```yaml linenums="1"
states:
  - entity_index: 0
    xpos: 50
    ypos: 50
    styles:
      font-size: 2.5em
      font-weight: bold
      fill: var(--primary-text-color)
```

A line can be styled like this:

```yaml linenums="1"
hlines:
  - xpos: 50
    ypos: 65
    length: 80
    styles:
      stroke: var(--disabled-text-color)
      stroke-width: 2
      opacity: 0.7
```

A circle can be styled like this:

```yaml linenums="1"
circles:
  - xpos: 50
    ypos: 50
    radius: 30
    styles:
      fill: none
      stroke: var(--primary-color)
      stroke-width: 2
```

Item-level styles are useful when you want to control the appearance of a specific text, icon, line, circle, or horseshoe part.

## :material-horseshoe: CSS and SVG styling

Many card elements are rendered as SVG. This means SVG-related CSS properties are often used.

Common examples include:

| Property | Used for | Example |
| :------- | :------- | :------ |
| `fill` | Text, icons, and filled shapes | `fill: var(--primary-text-color)` |
| `stroke` | Lines and shape outlines | `stroke: var(--divider-color)` |
| `stroke-width` | Width of a line or outline | `stroke-width: 2` |
| `opacity` | Overall transparency | `opacity: 0.7` |
| `fill-opacity` | Fill transparency | `fill-opacity: 0.5` |
| `stroke-opacity` | Stroke transparency | `stroke-opacity: 0.5` |
| `font-size` | Text size | `font-size: 1.4em` |
| `font-weight` | Text weight | `font-weight: bold` |
| `text-anchor` | Text alignment in SVG | `text-anchor: middle` |
| `stroke-linecap` | Line endings | `stroke-linecap: round` |

Not every CSS property applies to every item. For example, `stroke` is useful for lines and outlines, while `fill` is usually used for text, icons, and filled shapes.

## :material-horseshoe: Home Assistant theme variables

You can use Home Assistant theme variables inside styles. This helps your card follow the active Home Assistant theme.

Examples:

```yaml linenums="1"
styles:
  fill: var(--primary-text-color)
  stroke: var(--divider-color)
  background: var(--card-background-color)
```

This is usually better than hardcoding colors, especially if your dashboard supports both light and dark mode.

## :material-horseshoe: Dynamic styles with JavaScript templates

Styles can also use JavaScript templates when you need dynamic behavior.

For example, the color of a state can depend on the entity value:

```yaml linenums="1"
states:
  - entity_index: 0
    xpos: 50
    ypos: 50
    styles:
      fill: |
        [[[
          const value = Number(state);
          return value >= 4
            ? 'var(--error-color)'
            : 'var(--primary-text-color)';
        ]]]
```

Use normal CSS for fixed styling. Use JavaScript templates only when the style needs to change based on entity state, attributes, or other dynamic values.

For more details, see the templating documentation.

## :material-horseshoe: Reusing styles

For larger cards, the same styles often appear in multiple places. Instead of repeating them, you can define shared styles in `constants` and reuse them with `ref()`.

```yaml linenums="1"
constants:
  dividerStyle:
    stroke: var(--disabled-text-color)
    stroke-width: 2
    opacity: 0.7

layout:
  hlines:
    - xpos: 50
      ypos: 65
      length: 80
      styles: ref(dividerStyle)
```

This keeps the YAML shorter and makes later changes easier.

For more details, see the reuse documentation.

## :material-horseshoe: Practical tips

Start with theme variables where possible. They make the card fit better with the rest of Home Assistant.

Use `em` for text sizes when you want the styling to scale naturally with the card.

Use `stroke`, `stroke-width`, and `stroke-linecap` for lines.

Use `fill` for text, icons, and filled shapes.

Use card-level `styles` for the overall card appearance, and item-level `styles` for individual elements.

Use JavaScript templates only when the style needs to be dynamic.
