---
template: main.html
title: CSS Styling
description: Style the card container and individual layout elements with CSS and SVG properties in their `styles` sections.
tags:
  - CSS Styling
---
# CSS styling

The Flexible Horseshoe Card uses SVG and CSS for most of its visual elements. You can style both the card container and individual layout items through their `styles` sections.

There are two main levels of styling:

- card-level styles, which affect the card container;
- item-level styles, which affect individual elements such as states, names, icons, circles, lines, and horseshoes.

This lets you keep the default appearance or create a custom design that matches the rest of your Home Assistant dashboard.

## :material-horseshoe: Card-level styles

Add a `styles` section to the card configuration to control the appearance of the card container. Typical uses include backgrounds, borders, shadows, padding, and other CSS properties that apply to the complete card.

For example, you can set the card background:

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

Use card-level styles when the complete card needs a specific visual treatment, independent of the elements inside it.

## :material-horseshoe: Item-level styles

Most layout items also support their own `styles` section. These properties apply only to that specific item.

For example, you can style a state value like this:

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

A horizontal line can use stroke-related properties:

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

A circle can combine fill and stroke properties:

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

Item-level styling gives you precise control over the appearance of individual text elements, icons, lines, circles, and horseshoe components.

## :material-horseshoe: CSS and SVG properties

Many card elements are rendered as SVG. As a result, SVG presentation properties are commonly used alongside standard CSS.

| Property | Used for | Example |
| :------- | :------- | :------ |
| `fill` | Text, icons, and filled shapes | `fill: var(--primary-text-color)` |
| `stroke` | Lines and shape outlines | `stroke: var(--divider-color)` |
| `stroke-width` | Line or outline thickness | `stroke-width: 2` |
| `opacity` | Overall transparency | `opacity: 0.7` |
| `fill-opacity` | Fill transparency | `fill-opacity: 0.5` |
| `stroke-opacity` | Stroke transparency | `stroke-opacity: 0.5` |
| `font-size` | Text size | `font-size: 1.4em` |
| `font-weight` | Text weight | `font-weight: bold` |
| `text-anchor` | SVG text alignment | `text-anchor: middle` |
| `stroke-linecap` | Shape of line endings | `stroke-linecap: round` |

Not every property applies to every element. Use `stroke` for lines and outlines, while `fill` is generally more appropriate for text, icons, and solid shapes.

## :material-horseshoe: Home Assistant theme variables

Styles can use Home Assistant theme variables, allowing the card to follow the active theme automatically.

```yaml linenums="1"
styles:
  fill: var(--primary-text-color)
  stroke: var(--divider-color)
  background: var(--card-background-color)
```

Theme variables are usually preferable to hardcoded colors, especially on dashboards that support both light and dark mode.

## :material-horseshoe: Dynamic styles with JavaScript templates

Use JavaScript templates when a style needs to change dynamically.

For example, the color of a state can depend on its current value:

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

Use regular CSS for fixed styling. Add a JavaScript template only when the result depends on an entity state, attribute, or another runtime value.

For more information, see the templating documentation.

## :material-horseshoe: Reusing styles

Larger cards often repeat the same style definitions. Store shared styles in `constants` and insert them with `ref()` instead of duplicating the same YAML.

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

This reduces repetition and makes future style changes easier to apply consistently.

For more information, see the reuse documentation.

## :material-horseshoe: Practical tips

Start with Home Assistant theme variables whenever possible. They help the card remain consistent with the active dashboard theme.

Use `em` for text sizes when the typography should scale naturally with the card.

For lines and outlines, use properties such as `stroke`, `stroke-width`, and `stroke-linecap`. For text, icons, and solid shapes, use `fill`.

Apply card-level `styles` to the overall container and item-level `styles` to individual elements.

Use JavaScript templates only when a style must respond to dynamic data.
