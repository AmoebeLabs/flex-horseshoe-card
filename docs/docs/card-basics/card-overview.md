---
template: main.html
title: Card overview
description: Understand the main parts of a Flexible Horseshoe Card configuration.
tags:
  - Card basics
  - Layout
---
# Card overview

Every card has two basic jobs: choose the Home Assistant information it can use, and describe what should be shown on the card. Those two parts are configured with `entities:` and `layout:`.

This page introduces that basic card structure, shows how tools select an entity, and points to the main tool groups you can add to a layout.

## :material-horseshoe: Basic card structure

A card combines its data sources under `entities` with the visible items under `layout`.

```yaml linenums="1"
type: custom:flex-horseshoe-card

entities:
  - entity: sensor.living_room_temperature  # Home Assistant entity used by this card

layout:
  icons:
    - entity_index: 0  # Use the first entity configured above
      xpos: 50  # Horizontal position; 50 = center of the card
      ypos: 35  # Vertical position; 50 = center of the card

  states:
    - entity_index: 0  # Use the first entity configured above
      xpos: 50  # Horizontal position; 50 = center of the card
      ypos: 55  # Vertical position; 50 = center of the card
```

`entities:` contains the Home Assistant entities and local values used by the card.

`layout:` contains everything that appears on the card.

## :material-horseshoe: Add the information you need

A card can use one or many entities:

```yaml linenums="1"
entities:
  - entity: sensor.living_room_temperature  # Home Assistant entity used by this card
  - entity: sensor.living_room_humidity  # Home Assistant entity used by this card
```

Use `entity_index` to choose which entity an item uses:

```yaml linenums="1"
entities:
  - entity: sensor.temperature_1  # First entity: entity_index 0
  - entity: sensor.humidity_1  # Second entity: entity_index 1

layout:
  states:
    - entity_index: 0  # Use the first entity configured above
      xpos: 35  # Horizontal position; 50 = center of the card
      ypos: 50  # Vertical position; 50 = center of the card

    - entity_index: 1  # Use the second entity configured above
      xpos: 65  # Horizontal position; 50 = center of the card
      ypos: 50  # Vertical position; 50 = center of the card
```
See [Entities](entities.md) for attributes, formatting, names, icons, units, and other entity settings.

## :material-horseshoe: Add something to the card

Choose the tool that matches what you want to show or control:

| You want to... | Use |
| --- | --- |
| Show a current value, name, area, or icon | [Entity information](../tools/tools-overview.md#entity-information) |
| Show a value on a gauge | [Horseshoe](../tools/horseshoe/horseshoe-overview.md) |
| Show history | [Sparkline](../tools/sparkline/sparkline-overview.md) |
| Add a background, border, separator, or other shape | [Shapes](../tools/shapes/shapes-overview.md) |
| Change a value or run an action | [Controls](../tools/controls/controls-overview.md) |

## :material-horseshoe: Change the card shape

A square card is the normal starting point. Use `layout.aspectratio` when the card should be wider or taller:

```yaml linenums="1"
layout:
  aspectratio: 1.5/1  # Make the card 1.5 times wider than it is high
```

See [Positioning and sizing](positioning-and-sizing.md) for the card coordinate system and aspect ratio.

## :material-horseshoe: Place another card inside the card

Use root-level `cards:` to position normal Lovelace cards inside the Flexible Horseshoe Card. The child keeps its own normal card configuration; add `xpos`, `ypos`, `width`, and `height` only to tell the parent where that child should appear.

```yaml linenums="1"
type: custom:flex-horseshoe-card
layout:
  aspectratio: 1/1  # Keep the parent card square

cards:
  - type: markdown  # Normal Lovelace card used as a child
    xpos: 50  # Horizontal centre of the child
    ypos: 25  # Vertical centre of the child
    width: 80  # Space reserved for the child
    height: 20  # Space reserved for the child
    content: |
      ## Child card
```

`zpos` changes the stacking order; when omitted, child cards keep their list order. `frameless` defaults to `true`, which removes the child's normal card background, border, and shadow where the card exposes them; set `frameless: false` to keep that shell.

A child whose `type` is `custom:flex-horseshoe-card` is put in embedded mode by default. Set `embedded: false` on that child when it should keep its normal standalone-card behavior. Other child-card fields are passed to that card as normal Lovelace configuration.

## :material-horseshoe: Child card placement reference

These fields belong to each item under root `cards:`. They position the child; they are not passed to the child card itself.

`Required` applies to the specific form described by that table: **Yes** means you need the field for that form; **No** means you can leave it out. `Not set` means the card adds no explicit value when the option is omitted.

| Option | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `xpos` | number | Yes | — | Horizontal centre of the child in the parent's logical coordinate space. |
| `ypos` | number | Yes | — | Vertical centre of the child in the parent's logical coordinate space. |
| `width` | number | Yes | — | Width reserved for the child. |
| `height` | number | Yes | — | Height reserved for the child. |
| `zpos` | number | No | List position | Stacking order. Larger values appear above smaller values; equal values keep list order. |
| `frameless` | boolean | No | `true` | `true` removes the normal child-card shell where possible; `false` keeps it. |
| `embedded` | boolean | No | `true` for Flexible Horseshoe Card children | Controls embedded mode for a child Flexible Horseshoe Card; set `false` to keep its standalone behavior. |

## :material-horseshoe: Related

- [Your first card](../getting-started/your-first-card.md)
- [Entities](entities.md)
- [Positioning and sizing](positioning-and-sizing.md)
- [Groups](groups.md)
- [Card tools](../tools/tools-overview.md)
