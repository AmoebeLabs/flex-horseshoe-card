---
template: main.html
title: JavaScript templates
description: Use JavaScript templates to change Flexible Horseshoe Card values, labels, colors, and styles from Home Assistant entity states and attributes.
tags:
  - Dynamic configuration
  - JavaScript
  - Templates
---
# JavaScript templates

A JavaScript template lets a supported card setting change while the card is running. It can use the current entity, another card entity, or another Home Assistant state to calculate text, colors, visibility, sizes, positions, and other dynamic values.

This page shows the basic template syntax, the values available inside a template, and the simplest ways to read current card and Home Assistant data.

## :material-horseshoe: Change something from the current entity state

This color changes with the state of the entity used by the item:

```yaml linenums="1"
entities:
  - entity: input_boolean.example  # Entity used by this example

layout:
  states:
    - entity_index: 0  # Use the first entity configured above
      xpos: 50  # Horizontal center of the item
      ypos: 50  # Vertical center of the item
      # Return a different fill color for the current entity state.
      styles:
        fill: |
          [[[
            return state === 'on'
              ? 'var(--primary-color)'
              : 'var(--disabled-text-color)';
          ]]]
```
The value returned by the template becomes the value of that YAML setting.

## :material-horseshoe: Use another entity from the same card

Slots keep the reference readable:

```yaml linenums="1"
entities:
  - entity: input_boolean.example  # Entity used by this example

layout:
  states:
    - entity_index: 0  # Use the first entity configured above
      xpos: 50  # Horizontal center of the item
      ypos: 50  # Vertical center of the item
      # Show this item only when the selected card entity is on.
      visibility: |
        [[[
          return entities[1].state === 'on'
            ? 'visible'
            : 'hidden';
        ]]]
```
## :material-horseshoe: Read another Home Assistant entity

Read another entity when a dynamic value depends on Home Assistant data that is not the item’s own selected entity.

```yaml linenums="1"
layout:
  texts:
    - xpos: 50  # Horizontal center of the text
      ypos: 50  # Vertical center of the text
      # Use another Home Assistant entity as the displayed text.
      text: |
        [[[
          return states['sensor.outdoor_temperature'].state;
        ]]]
```
Include entities that should trigger card updates in the card's `entities` list.

## :material-horseshoe: Calculate a value from a state

Use a JavaScript calculation when the displayed/configured value must be derived from the current state instead of copied directly.

```yaml linenums="1"
entities:
  - entity: sensor.temperature  # Entity whose history is graphed

layout:
  sparklines:
    - xpos: 50  # Horizontal center of the graph
      ypos: 50  # Vertical center of the graph
      width: 80  # Graph width in card coordinates
      height: 35  # Graph height in card coordinates
      entity_index: 0  # Use the first entity configured above
      # Let a card entity decide how many hours of history are shown.
      period:
        rolling_window:
          duration:
            hour: |
              [[[
                return Number(entities[0].state) * 24;
              ]]]
```
Use this when a card setting should follow a number selected or reported by an entity.

## :material-horseshoe: Available values

These values are available inside a JavaScript template so the calculation can use the current card and Home Assistant context.

| Value | What it contains |
| --- | --- |
| `state` | State/selected attribute of the entity used by the current item |
| `entity` | Complete current entity |
| `entities` | Entities listed by the card |
| `states` | Home Assistant entity states |
| `hass` | Current Home Assistant object |
| `config` | Complete current card configuration |
| `constants` | Values from the card's `constants:` block |
| `entity_slots` | Named entity-slot indexes for the current card |
| `item` | Current configured item |
| `user` | Current Home Assistant user |

## :material-horseshoe: Keep templates readable

Keep the calculation short and return one value. If the value never changes after the card is created, use normal YAML, [Reuse](../reuse/reuse-introduction.md), or `calc()` instead.

## :material-horseshoe: Related

- [Dynamic configuration](overview.md)
- [Visibility](../interaction/visibility.md)
- [Animations](../interaction/animations.md)
- [Template variables](../card-templates/template-variables.md)
