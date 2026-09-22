---
template: main.html
title: Visibility
description: Show, hide, or disable Flexible Horseshoe Card tools and controls.
tags:
  - Interaction
  - Visibility
---
# Visibility

Visibility controls whether an item is shown, hidden, or unavailable. It can be fixed in the configuration or changed from an entity state, which makes it possible to reveal information only when it is relevant.

This page shows how to hide an item, change visibility from a state, make a control visibly unavailable, remove a configured item with `disabled`, and show or hide a complete group together.

## :material-horseshoe: Visibility values

Normal layout items use two fixed visibility values. The default is `visible`:

- `visible` — the item is shown.
- `hidden` — the item is not shown.

Controls also accept `unavailable`. It keeps the control visible with its unavailable appearance instead of making it usable.

A JavaScript template can return the same values when visibility should depend on card data.

## :material-horseshoe: Hide an item

A fixed visibility value can hide an item without removing its configuration:

```yaml linenums="1"
layout:
  rectangles:
    - xpos: 50  # Horizontal position; 50 = center of the card
      ypos: 50  # Vertical position; 50 = center of the card
      width: 40  # Width in card coordinates
      height: 20  # Height in card coordinates
      visibility: hidden
```

## :material-horseshoe: Show an item only for a matching state

This Rectangle is shown only while the selected entity reports `heating`:

```yaml linenums="1"
entities:
  - entity: sensor.heating_state  # Home Assistant entity used by this card

layout:
  rectangles:
    - entity_index: 0  # Use the first entity configured above
      xpos: 50  # Horizontal position; 50 = center of the card
      ypos: 50  # Vertical position; 50 = center of the card
      width: 40  # Width in card coordinates
      height: 20  # Height in card coordinates

      visibility: |
        [[[
          return state === 'heating' ? 'visible' : 'hidden';
        ]]]
```

## :material-horseshoe: Keep a control visible but unavailable

Use `visibility: unavailable` when a control should remain visible but must not accept input. The control uses its unavailable appearance and its tap, hold, and double-tap actions are blocked. A JavaScript template can return `unavailable` when this should follow the current state.

```yaml linenums="1"
entities:
  - entity: sensor.example_status  # Entity used to decide whether the control is available

layout:
  controls:
    - type: button  # Create a button control
      entity_index: 0  # Use entity 0 from entities: (0 = first entity)
      xpos: 50  # Horizontal position; 50 = center of the card
      ypos: 50  # Vertical position; 50 = center of the card
      width: 36  # Width of the complete control
      height: 12  # Height of the complete control
      visibility: |
        [[[
          return state === 'unavailable' ? 'unavailable' : 'visible';
        ]]]
```

## :material-horseshoe: Remove an item from the configured card

Use `disabled: true` when an entity or layout item should not be included in the configured card at all. This is different from `visibility: hidden`: a hidden item still exists but is not shown, while a disabled item is left out when the card configuration is built.

```yaml linenums="1"
layout:
  rectangles:
    - xpos: 50  # Horizontal position; 50 = center of the card
      ypos: 50  # Vertical position; 50 = center of the card
      width: 40  # Width in card coordinates
      height: 20  # Height in card coordinates
      disabled: true  # Do not include this Rectangle in the configured card
```

`disabled` accepts `true`/`false`, `1`/`0`, and equivalent values produced by supported configuration expressions. It is a configuration-time choice; use `visibility` when showing or hiding an existing item should change while the card is running.
## :material-horseshoe: Show or hide a complete group

Put related items in a group when they should appear and disappear together:

```yaml linenums="1"
entities:
  - entity: input_boolean.example_1  # Entity used by the interaction example

layout:
  groups:
    - id: history  # Name this item so it can be referenced later
      xpos: 50  # Horizontal position; 50 = center of the card
      ypos: 60  # Vertical position; 50 = center of the card
      visibility: |
        [[[
          return entities[0].state === 'on'
            ? 'visible'
            : 'hidden';
        ]]]
```
## :material-horseshoe: Related

- [Groups](../card-basics/groups.md)
- [JavaScript templates](../dynamic/javascript-templates.md)
- [Interactive controls](../tools/controls/controls-overview.md)
