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

Use icons to show an entity visually or add standalone icons and images anywhere on the card.

FHS can use a Home Assistant entity icon, a configured MDI icon, or an SVG, PNG, JPG, or other supported image.

<!-- Icon examples image -->

## :material-horseshoe: Basic use

Add icons under `layout.icons`:

=== "Entity icon"

    ```yaml linenums="1"
    entities:
      - entity: light.living_room

    layout:
      icons:
        - id: light-icon
          entity_index: 0
          xpos: 50
          ypos: 50
          icon_size: 3
    ```

    Without an explicit `icon`, FHS uses the icon of the selected Home Assistant entity.

=== "MDI icon"

    ```yaml linenums="1"
    layout:
      icons:
        - id: menu-icon
          icon: mdi:dots-vertical
          xpos: 50
          ypos: 50
          icon_size: 3
    ```

    A configured icon does not require an entity.

## :material-horseshoe: Choose the icon

Set `icon` when you want to use a specific icon instead of the Home Assistant entity icon:

```yaml linenums="1"
layout:
  icons:
    - icon: mdi:thermometer
      xpos: 50
      ypos: 50
      icon_size: 3
```

You can also configure an icon on the entity:

```yaml linenums="1"
entities:
  - entity: sensor.living_room_temperature
    icon: mdi:home-thermometer
```

An `icon` configured directly on the Icon tool takes priority over the entity icon.

## :material-horseshoe: SVG and image files

Use `url(...)` to display an SVG or image instead of an MDI icon.

=== "SVG"
    ```yaml linenums="1"
    layout:
      icons:
        - icon: url(/local/icons/weather.svg)
          xpos: 50
          ypos: 50
          icon_size: 4
    ```

=== "PNG"

    ```yaml linenums="1"
    layout:
      icons:
        - icon: url(/local/images/weather.png)
          xpos: 50
          ypos: 50
          icon_size: 4
    ```

=== "JPG"

    ```yaml linenums="1"
    layout:
      icons:
        - icon: url(/local/images/background.jpg)
          xpos: 50
          ypos: 50
          icon_size: 4
    ```

The URL can also point to an external image:

```yaml linenums="1"
layout:
  icons:
    - icon: url(https://example.com/images/weather.png)
      xpos: 50
      ypos: 50
      icon_size: 4
```

This makes the Icon tool useful for both Home Assistant icons and custom graphics.

## :material-horseshoe: Size and position

Position an icon with `xpos` and `ypos`.

Use `icon_size` for the regular relative icon size:

```yaml linenums="1"
layout:
  icons:
    - icon: mdi:fan
      xpos: 50
      ypos: 50
      icon_size: 4
```

Use `icon_size_percent` when the icon should scale relative to the card:

```yaml linenums="1"
layout:
  icons:
    - icon: mdi:fan
      xpos: 50
      ypos: 50
      icon_size_percent: 20
```

See [Positioning and sizing](../../card-basics/positioning-and-sizing.md) for more about the card coordinate system.

## :material-horseshoe: Alignment

Use `align` to control how the icon is positioned around `xpos`:

=== "Start"

    ```yaml linenums="1"
    - icon: mdi:thermometer
      xpos: 20
      ypos: 50
      icon_size: 3
      align: start
    ```

=== "Center"
    ```yaml linenums="1"
    - icon: mdi:thermometer
      xpos: 50
      ypos: 50
      icon_size: 3
      align: center
    ```

=== "End"

    ```yaml linenums="1"
    - icon: mdi:thermometer
      xpos: 80
      ypos: 50
      icon_size: 3
      align: end
    ```

## Rotate an icon

Use `rotate` to rotate the icon:

```yaml linenums="1"
layout:
  icons:
    - icon: mdi:arrow-up
      xpos: 50
      ypos: 50
      icon_size: 3
      rotate: 90
```

## :material-horseshoe: Change the icon by state

Use `state_map` when different entity states should display different icons:

```yaml linenums="1"
entities:
  - entity: light.living_room

layout:
  icons:
    - entity_index: 0
      xpos: 50
      ypos: 50
      icon_size: 4

      state_map:
        map:
          - state: "on"
            icon: mdi:lightbulb-on

          - state: "off"
            icon: mdi:lightbulb-off
```

A `default` entry can provide a fallback when no other state matches:

```yaml linenums="1"
state_map:
  map:
    - state: "on"
      icon: mdi:lightbulb-on

    - state: "off"
      icon: mdi:lightbulb-off

    - state: default
      icon: mdi:lightbulb-question
```

## :material-horseshoe: Icon appearance

Use `styles` to change the appearance of an icon:

```yaml linenums="1"
layout:
  icons:
    - icon: mdi:fan
      xpos: 50
      ypos: 50
      icon_size: 4
      styles:
        fill: var(--primary-color)
        opacity: 0.8
```

See [Styling](../../appearance/styling.md) for the complete styling guide.

## :material-horseshoe: Color from an entity

When an icon is connected to an entity, color stops can change its color from the entity state:

```yaml linenums="1"
layout:
  icons:
    - entity_index: 0
      xpos: 50
      ypos: 50
      icon_size: 4

      show:
        item_style: colorstop

      color_stops:
        colors:
          0: green
          50: orange
          100: red
```

See [Color stops](../../appearance/color-stops.md) for ranges, gradients, palettes, and interpolation.

## Configuration

| Field               | Required | Default            | Description                             |
| ------------------- | :------: | ------------------ | --------------------------------------- |
| `xpos`              |    Yes   |                    | Horizontal icon position                |
| `ypos`              |    Yes   |                    | Vertical icon position                  |
| `entity_index`      |    No    | Not set            | Entity whose icon and state can be used |
| `icon`              |    No    | Entity icon        | MDI icon or `url(...)` SVG/image        |
| `icon_size`         |    No    |                    | Relative icon size                      |
| `icon_size_percent` |    No    | Not set            | Icon size relative to the card          |
| `align`             |    No    | `center`           | `start`, `center`, or `end`             |
| `rotate`            |    No    | `0`                | Icon rotation in degrees                |
| `state_map`         |    No    | Not set            | Selects an icon based on entity state   |
| `styles`            |    No    | Default icon style | SVG and CSS styling                     |
| `color_stops`       |    No    | Not set            | Colors the icon from the entity state   |

## :material-horseshoe: Related

* [State](entity-state-tool.md)
* [Name](entity-name-tool.md)
* [Area](entity-area-tool.md)
* [Entities](../../card-basics/entities.md)
* [Positioning and sizing](../../card-basics/positioning-and-sizing.md)
* [Styling](../../appearance/styling.md)
* [Color stops](../../appearance/color-stops.md)
* [Color filters](../../appearance/color-filters.md)
* [Actions](../../interaction/actions.md)
* [Animations](../../interaction/animations.md)
* [Reusing items with same_as](../../reuse/reuse-with-same_as.md)
