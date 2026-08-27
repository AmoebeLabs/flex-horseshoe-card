---
template: main.html
title: JavaScript templates
description: Change Flexible Horseshoe Card values and styles from Home Assistant entity states.
tags:
  - Dynamic configuration
  - JavaScript
  - Templates
---

# JavaScript templates

Use a JavaScript template when a configured value should respond to an entity state, attribute, user, locale, or another value available to the card.

You do not need JavaScript templates for fixed layouts. Use normal YAML, `ref()`, or `calc()` when the value does not change at runtime.

## :material-horseshoe: Change a style from the current state

```yaml linenums="1"
styles:
  fill: |
    [[[
      return state === 'on'
        ? 'var(--primary-color)'
        : 'var(--disabled-text-color)';
    ]]]
```

A template is enclosed by `[[[` and `]]]` and returns the value used by that YAML field.

## :material-horseshoe: Read another card entity

```yaml linenums="1"
visibility: |
  [[[
    return entities[entity_slots.show_details[0]].state === 'on'
      ? 'visible'
      : 'hidden';
  ]]]
```

Slots keep the expression readable when the entity list changes.

## :material-horseshoe: Read a Home Assistant entity

```yaml linenums="1"
text: |
  [[[
    return states['sensor.outdoor_temperature'].state;
  ]]]
```

Include entities used by the template in the card `entities` list so their state changes update the card.

## :material-horseshoe: Available values

| Value | What it gives you |
| --- | --- |
| `state` | State or selected attribute of the entity connected to the current item |
| `entity` | Complete connected entity |
| `entities` | Entities listed by the card |
| `entity_slots` | Entity indexes grouped by slot |
| `states` | Home Assistant entity states |
| `hass` | Home Assistant frontend values |
| `constants` | Card constants |
| `item` | Current configured item |
| `user` | Current Home Assistant user |

## :material-horseshoe: Keep templates readable

Use a few linear statements and return the configured value. Put repeated templates in `constants` and insert them with `ref()`.

## :material-horseshoe: Related

- [Constants and ref()](constants-and-ref.md)
- [Visibility](../interaction/visibility.md)
- [Animations](../interaction/animations.md)
- [Template variables](../card-templates/template-variables.md)
