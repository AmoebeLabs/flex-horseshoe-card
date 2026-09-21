---
template: main.html
title: Icon
description: Display Home Assistant icons, MDI icons, and SVG or image files in a Flexible Horseshoe Card.
tags:
  - Icon
  - Entity
  - Card tools
---
# Icon

The Icon tool adds a visual symbol to a card. It can use the icon Home Assistant already knows for an entity, another MDI icon, or an external SVG/image, and it can also change with the entity state.

This page shows how to choose the icon source, size and align it, rotate it, change it by state, and apply fixed or value-based colors.

## :material-horseshoe: Show the entity icon

Use the Icon tool when the Home Assistant entity icon provides a compact visual identity for the item.

```yaml linenums="1"
entities:
  - entity: sensor.living_room_temperature  # Home Assistant entity used by this card

layout:
  icons:
    - entity_index: 0  # Use the first entity configured above
      xpos: 50  # Horizontal position; 50 = center of the card
      ypos: 50  # Vertical position; 50 = center of the card
```

## :material-horseshoe: Choose another icon

Override the icon when the Home Assistant default does not represent the purpose of this card clearly enough.

```yaml linenums="1"
entities:
  - entity: sensor.example_1  # Entity used by this example

layout:
  icons:
    - entity_index: 0  # Use entity 0 from entities: (0 = first entity)
      xpos: 50  # Horizontal position; 50 = center of the card
      ypos: 50  # Vertical position; 50 = center of the card
      icon: mdi:thermometer  # Icon shown to the user
```
The entity definition can also override the icon when every Icon tool using that entity should use the same icon.

## :material-horseshoe: Use an image or SVG

For a Home Assistant/MDI icon, set `icon` to its icon name, for example `mdi:thermometer`. For an external SVG or image, use CSS-style `url(...)` syntax. A URL ending in `.svg` is loaded as SVG; other URLs are shown as images.

```yaml linenums="1"
layout:
  icons:
    - xpos: 50  # Horizontal position; 50 = center of the card
      ypos: 50  # Vertical position; 50 = center of the card
      icon: url(/local/icons/temperature.svg)  # External SVG shown by this Icon tool
      icon_size_percent: 18  # Geometric icon size on the card's 100-unit scale
```

Keep the source in the same Icon tool so its size, position, and alignment remain together.

## :material-horseshoe: Change size and position

Adjust size and position when the icon needs to fit the surrounding text, gauge, or control.

```yaml linenums="1"
entities:
  - entity: sensor.example_1  # Entity used by this example

layout:
  icons:
    - entity_index: 0  # Use entity 0 from entities: (0 = first entity)
      xpos: 50  # Horizontal position; 50 = center of the card
      ypos: 35  # Vertical position; 50 = center of the card
      icon_size: 4
```
`align` controls where the icon is anchored around its position: `center` centers it on the configured position, `start` anchors its start side there, and `end` anchors its end side there.

## :material-horseshoe: Rotate the icon

Rotate an icon when direction itself carries meaning, such as an arrow or orientation indicator.

```yaml linenums="1"
entities:
  - entity: sensor.example_1  # Entity used by this example

layout:
  icons:
    - entity_index: 0  # Use entity 0 from entities: (0 = first entity)
      xpos: 50  # Horizontal position; 50 = center of the card
      ypos: 50  # Vertical position; 50 = center of the card
      rotate: 90  # Rotate the result by 90°
```
## :material-horseshoe: Change the icon by state

Use `state_map` when different entity states should use different icons. This keeps the state-to-icon choices together with the Icon tool.

## :material-horseshoe: Change the icon color

Use `styles` for a fixed appearance or `color_stops` when the color should follow the entity value/state.

## :material-horseshoe: Configuration options


`Required` applies to the specific form described by that table: **Yes** means you need the field for that form; **No** means you can leave it out. `Not set` means the card adds no explicit value when the option is omitted.

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `xpos`, `ypos` | number | Yes | — | Position of the icon. |
| `entity_index` | entity index | No | `0` for an entity-derived icon; otherwise Not set | Chooses the entity whose icon and state are used. If you do not configure `icon` or `state_map`, omitting this field uses the first configured entity. |
| `icon` | string | No | Entity icon | Home Assistant/MDI icon name such as `mdi:thermometer`, or an external SVG/image in `url(...)` form. |
| `size` | number | No | `2` | Font-based icon-size multiplier used when neither `icon_size` nor `icon_size_percent` is set. |
| `icon_size` | number | No | Not set | Font-based icon-size multiplier. It overrides `size`. |
| `icon_size_percent` | number | No | Not set | Geometric icon size on the card's 100-unit scale. It overrides both `icon_size` and `size`. |
| `align` | `start`, `center`, `end` | No | `center` | Anchors the icon by its start side, center, or end side. |
| `rotate` | number | No | `0` | Rotation in degrees. |
| `state_map` | mapping | No | Not set | Changes icon from entity state. |
| `styles` | mapping | No | Default icon style | Icon appearance. |
| `color_stops` | mapping | No | Not set | Changes color from entity value/state. |

## :material-horseshoe: Related

- [Entities](../../card-basics/entities.md)
- [State](entity-state-tool.md)
- [Color stops](../../appearance/color-stops.md)
- [JavaScript templates](../../dynamic/javascript-templates.md)
