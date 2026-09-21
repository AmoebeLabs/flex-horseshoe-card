---
template: main.html
title: Animations
description: Change or animate card items when an entity reaches a configured state.
tags:
  - Interaction
  - Animations
  - CSS
---
# Animations

State-based animations apply styles to layout items when a configured entity reaches a specific state. The trigger is defined in the top-level `animations:` section; the target layout item is linked with `animation_id`.

This page shows the required YAML structure, the built-in animation names, and a complete state-based example.

## :material-horseshoe: Connect an animation to a layout item

Give the layout item an `animation_id`, then add a top-level `animations:` entry for the entity that triggers it:

```yaml linenums="1"
entities:  # Entities used by this example
  - entity: input_boolean.example

animations:
  entity.0:
    - state: "on"
      circles:
        - animation_id: warning-ring
          styles:
            - fill: var(--warning-color)
            - animation: pulse 1s ease-in-out both
            - transform-origin: center

layout:
  circles:
    - animation_id: warning-ring
      entity_index: 0
      xpos: 50
      ypos: 50
      radius_percent: 30
      styles:
        fill: var(--divider-color)
```

`entity.0` watches the first entry in `entities:`. When its state is `on`, the styles in `animations:` are applied to the circle with the same `animation_id`.

Do not put `animations:` inside a `layout` item.

The current state-animation target sections are `lines`, `hlines`, `vlines`, `circles`, `arcs`, `rectangles`, `polygons`, `icons`, `names`, `areas`, `states`, `texts`, and `controls`. Horseshoes and Sparklines are not targets of this `animations:` mechanism; use their own state/color configuration or a JavaScript template for dynamic behavior there.

For an `icons` target, you can also set `icon` in the matching animation target to change the displayed icon together with its styles.

## :material-horseshoe: Watch another configured entity

The number after `entity.` is the configured entity index. For example, `entity.1` watches the second entity:

```yaml linenums="1"
entities:  # Entities used by this example
  - entity: sensor.temperature
  - entity: binary_sensor.window

animations:
  entity.1:
    - state: "on"
      icons:
        - animation_id: window-icon
          styles:
            - animation: flash 1s ease-in-out 3

layout:
  icons:
    - animation_id: window-icon
      entity_index: 1
      xpos: 50
      ypos: 50
```

If an entity definition uses `attribute`, that selected attribute value is used for the state match.

## :material-horseshoe: Built-in animation names

The current card includes these animation names:

- `zoomOut`
- `bounce`
- `flash`
- `headShake`
- `heartBeat`
- `jello`
- `pulse`
- `rubberBand`
- `shake`
- `swing`
- `tada`
- `wobble`

Use the name in the CSS `animation` style, together with the duration and any timing/repetition settings you need. `zoomIn` is not one of the built-in names in the current version.

## :material-horseshoe: Change several item types from one state

One state entry can update several layout sections. Each target uses its own `animation_id`:

```yaml linenums="1"
entities:  # Entities used by this example
  - entity: light.living_room

animations:
  entity.0:
    - state: "on"
      circles:
        - animation_id: light-ring
          styles:
            - fill: var(--primary-color)
            - animation: pulse 1s ease-in-out both
      icons:
        - animation_id: light-icon
          styles:
            - fill: white
    - state: "off"
      circles:
        - animation_id: light-ring
          styles:
            - fill: var(--divider-color)
      icons:
        - animation_id: light-icon
          styles:
            - fill: var(--secondary-text-color)

layout:
  circles:
    - animation_id: light-ring
      entity_index: 0
      xpos: 50
      ypos: 50
      radius_percent: 30
  icons:
    - animation_id: light-icon
      entity_index: 0
      xpos: 50
      ypos: 50
```

## :material-horseshoe: Keep styles from the previous matching state

By default, a new matching animation target replaces the previous animation styles for that `animation_id`. Set `reuse: true` on an animation target when the new state should keep the previously applied animation styles and add its own styles.

```yaml linenums="1"
entities:  # Entities used by this example
  - entity: input_boolean.example

animations:
  entity.0:
    - state: "on"
      circles:
        - animation_id: status
          styles:
            - fill: var(--primary-color)
    - state: "off"
      circles:
        - animation_id: status
          reuse: true
          styles:
            - opacity: 0.4

layout:
  circles:
    - animation_id: status
      entity_index: 0
      xpos: 50
      ypos: 50
      radius_percent: 30
```

## :material-horseshoe: Use a dynamic style instead

When the result depends on a number, calculation, or several entities rather than one exact state, put the condition directly in a supported style:

```yaml linenums="1"
entities:  # Entities used by this example
  - entity: sensor.temperature

layout:
  states:
    - entity_index: 0
      xpos: 50
      ypos: 50
      styles:
        animation: |
          [[[
            return Number(state) > 30
              ? 'flash 1s ease-in-out 3'
              : 'none';
          ]]]
```

See [JavaScript templates](../dynamic/javascript-templates.md) for dynamic values.

## :material-horseshoe: Related

- [JavaScript templates](../dynamic/javascript-templates.md)
- [Styling](../appearance/styling.md)
- [Visibility](visibility.md)
