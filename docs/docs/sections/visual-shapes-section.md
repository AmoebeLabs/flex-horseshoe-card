---
template: main.html
title: Visual Shapes
description: Configure rectangles, circles, horizontal lines, and vertical lines as positioned and styled visual building blocks in card layouts.
tags:
- Rectangles
- Circles
- Horizontal Lines
- Vertical Lines
---

[line-tool support]: https://github.com/amoebelabs/swiss-army-knife-card/releases/

# Visual shapes: rectangles, lines, and circles

Visual shapes are simple SVG building blocks that help organize and enhance a card layout. Use them as separators, backgrounds, highlights, indicators, or decorative elements.

The card supports four shape sections:

| Shape           | Section      | Description                                                                        |
| :-------------- | :----------- | :--------------------------------------------------------------------------------- |
| Rectangle       | `rectangles` | A fixed rectangle or one that automatically fits another layout item               |
| Circle          | `circles`    | A circle positioned by its center point, using either `radius` or `radius_percent` |
| Horizontal line | `hlines`     | A horizontal line positioned by its center point and length                        |
| Vertical line   | `vlines`     | A vertical line positioned by its center point and length                          |

All four shapes use the same 100 × 100 card coordinate system. This makes it easy to align them with horseshoes, states, names, icons, and other layout elements.

## :material-horseshoe: Basic usage

A rectangle can use a fixed center position, width, and height. It can also use `fit` to follow the position and rendered size of a state, name, or area automatically. A fitted rectangle adjusts when the content, number formatting, font, or language changes.

A circle needs a center position and a radius. Define the radius in SVG units with `radius`, or use `radius_percent` to scale it relative to the card.

Horizontal and vertical lines both use a center position and a length. Their configuration is almost identical; only the section name changes. Horizontal lines belong in `hlines`, while vertical lines belong in `vlines`.

Shapes can also be connected to an entity through `entity_index`. This allows color stops and animations to respond to the state of that entity.

### Example definitions

=== "Rectangle"
    A fixed rectangle uses its own position and dimensions:

    ```yaml title="Fixed rectangle" linenums="1"
    - xpos: 50
      ypos: 50
      width: 40
      height: 12
      radius: 2
      styles:
        fill: var(--primary-color)
        opacity: 0.3

    A fitted rectangle takes its position and dimensions from another layout item. The referenced item must have an `id`:

    ```yaml title="Rectangle fitted to a state" linenums="1"
    states:
      - id: current-state
        entity_index: 0
        xpos: 50
        ypos: 50

    rectangles:
      - fit:
          section: states
          item_id: current-state
        radius: 2
        styles:
          fill: var(--primary-color)
          opacity: 0.3
    ```

=== "Circle"
    A circle can use a fixed radius in SVG units:

    ```yaml title="Circle with fixed radius" linenums="1" hl_lines="1"
    - xpos: 50                  # Horizontal center position
      ypos: 50                  # Vertical center position
      radius: 25                # Radius in SVG units
      styles:
        stroke-width: 2         # Outline width
    ```

    Use `radius_percent` when the circle should scale relative to the card. Connecting it to an entity also allows its color to respond to the entity state:

    ```yaml title="Circle with percentage radius" linenums="1" hl_lines="1"
    - xpos: 50                  # Horizontal center position
      ypos: 50                  # Vertical center position
      radius_percent: 25        # Radius as a percentage of the card scale
      entity_index: 0           # Connects to entity 0
      styles:
        stroke-width: 2         # Outline width
      color_stops:              # Changes the circle color based on the entity state
        colors:
          0: 'blue'
          0.1: 'green'
          0.4: 'yellow'
          1: 'orange'
          3: 'red'
          5: 'purple'
    ```

=== "Horizontal Line"
    A horizontal line uses a center position and a length:

    ```yaml title="Horizontal line" linenums="1" hl_lines="1 7"
    - xpos: 50                  # Horizontal center position
      ypos: 50                  # Vertical center position
      length: 25                # Line length
      entity_index: 0           # Connects to entity 0
      styles:
        stroke-width: 2         # Line width
    ```

    Add color stops when the line color should respond to the connected entity:

    ```yaml title="Horizontal line with color stops" linenums="1" hl_lines="1 7"
    - xpos: 50                  # Horizontal center position
      ypos: 50                  # Vertical center position
      length: 25                # Line length
      entity_index: 0           # Connects to entity 0
      styles:
        stroke-width: 2         # Line width
      color_stops:              # Changes the line color based on the entity state
        colors:
          0: 'blue'
          0.1: 'green'
          0.4: 'yellow'
          1: 'orange'
          3: 'red'
          5: 'purple'
    ```

=== "Vertical Line"
    A vertical line uses the same fields as a horizontal line:

    ```yaml title="Vertical line" linenums="1" hl_lines="1 7"
    - xpos: 50                  # Horizontal center position
      ypos: 50                  # Vertical center position
      length: 25                # Line length
      entity_index: 0           # Connects to entity 0
      styles:
        stroke-width: 2         # Line width
    ```

    Color stops work in the same way:

    ```yaml title="Vertical line with color stops" linenums="1" hl_lines="1 7"
    - xpos: 50                  # Horizontal center position
      ypos: 50                  # Vertical center position
      length: 25                # Line length
      entity_index: 0           # Connects to entity 0
      styles:
        stroke-width: 2         # Line width
      color_stops:              # Changes the line color based on the entity state
        colors:
          0: 'blue'
          0.1: 'green'
          0.4: 'yellow'
          1: 'orange'
          3: 'red'
          5: 'purple'
    ```

## :material-horseshoe: Configuration fields

The required fields depend on the shape type. Rectangles use either fixed dimensions or `fit`, circles need a radius, and lines use a length.

=== "Rectangle"
    | Field | Required | Default | Description |
    | :---- | :------: | :------ | :---------- |
    | `xpos` | Fixed only | | Horizontal position of the rectangle center |
    | `ypos` | Fixed only | | Vertical position of the rectangle center |
    | `width` | Fixed only | | Width of the rectangle |
    | `height` | Fixed only | | Height of the rectangle |
    | `fit.section` | Fit only | | Section that contains the referenced item: `states`, `names`, or `areas` |
    | `fit.item_id` | Fit only | | `id` of the referenced item |
    | `fit.padding.x` | :material-close: | `1.5` | Horizontal padding around the measured item |
    | `fit.padding.y` | :material-close: | `0.5` | Vertical padding around the measured item |
    | `radius` | :material-close: | `0` | Corner radius |
    | `entity_index` | :material-close: | Not set | Index of the connected entity in the `entities` section |
    | `styles` | :material-close: | `fill: var(--primary-background-color); stroke: none; stroke-width: 0` | CSS and SVG style definitions |
    | `color_stops` | :material-close: | Not set | Uses the connected entity state to determine the fill color |

    !!! note
        Use either `xpos`, `ypos`, `width`, and `height`, or use `fit`. A fitted rectangle takes all four geometry values from the referenced item.

=== "Circle"
    | Field | Required | Default | Description |
    | :---- | :------: | :------ | :---------- |
    | `xpos` | :material-check: | | Horizontal position on the 100 × 100 card canvas |
    | `ypos` | :material-check: | | Vertical position on the 100 × 100 card canvas |
    | `radius` | One required | `0` | Circle radius in SVG units |
    | `radius_percent` | One required | Not set | Circle radius based on the card percentage scale |
    | `entity_index` | :material-close: | Not set | Index of the connected entity in the `entities` section |
    | `styles` | :material-close: | `{}` | CSS and SVG style definitions |
    | `color_stops` | :material-close: | Not set | Uses the connected entity state to determine the shape color |

    !!! note
        Use either `radius` or `radius_percent`.

=== "Horizontal Line"
    | Field | Required | Default | Description |
    | :---- | :------: | :------ | :---------- |
    | `xpos` | :material-close: | `50` | Horizontal position on the 100 × 100 card canvas |
    | `ypos` | :material-close: | `50` | Vertical position on the 100 × 100 card canvas |
    | `length` | :material-close: | `10` | Length of the horizontal line |
    | `entity_index` | :material-close: | Not set | Index of the connected entity in the `entities` section |
    | `styles` | :material-close: | `stroke: var(--primary-text-color); stroke-width: 2; opacity: 1; stroke-linecap: round` | CSS and SVG style definitions |
    | `color_stops` | :material-close: | Not set | Uses the connected entity state to determine the line color |

=== "Vertical Line"
    | Field | Required | Default | Description |
    | :---- | :------: | :------ | :---------- |
    | `xpos` | :material-close: | `50` | Horizontal position on the 100 × 100 card canvas |
    | `ypos` | :material-close: | `50` | Vertical position on the 100 × 100 card canvas |
    | `length` | :material-close: | `10` | Length of the vertical line |
    | `entity_index` | :material-close: | Not set | Index of the connected entity in the `entities` section |
    | `styles` | :material-close: | `stroke: var(--primary-text-color); stroke-width: 2; opacity: 1; stroke-linecap: round` | CSS and SVG style definitions |
    | `color_stops` | :material-close: | Not set | Uses the connected entity state to determine the line color |

### Shared fields

The following fields are available for rectangles, circles, horizontal lines, and vertical lines.

| Field      |     Required     | Default | Description                                                                                   |
| :--------- | :--------------: | :------ | :-------------------------------------------------------------------------------------------- |
| `id`       | :material-close: | Not set | Optional identifier that must be unique within the section and can be referenced by `same_as` |
| `group`    | :material-close: | `card`  | Assigns the visual shape to a group                                                           |
| `same_as*` | :material-close: | Not set | Reuses another item from the same section. See the `same_as` documentation.                   |

## :material-horseshoe: Styling

Visual shapes are rendered as SVG elements and can therefore be styled with CSS and SVG properties under `styles`.

| Method   |      Support     | Description                       |
| :------- | :--------------: | :-------------------------------- |
| `styles` | :material-check: | Applies inline SVG and CSS styles |

### Common style properties

=== "Rectangle"
    | Property | What it does | Example |
    | :------- | :----------- | :------ |
    | `fill` | Defines the fill color | `fill: red` |
    | `stroke` | Defines the outline color | `stroke: blue` |
    | `stroke-width` | Controls the outline width | `stroke-width: 1em` |
    | `opacity` | Controls the opacity of the entire rectangle | `opacity: 0.7` |
    | `fill-opacity` | Controls the opacity of the fill | `fill-opacity: 0.5` |
    | `stroke-opacity` | Controls the opacity of the outline | `stroke-opacity: 0.5` |

=== "Circle"
    | Property | What it does | Example |
    | :------- | :----------- | :------ |
    | `fill` | Defines the fill color | `fill: red` |
    | `stroke` | Defines the outline color | `stroke: blue` |
    | `stroke-width` | Controls the outline width | `stroke-width: 2em` |
    | `opacity` | Controls the opacity of the entire circle | `opacity: 0.7` |
    | `fill-opacity` | Controls the opacity of the fill | `fill-opacity: 0.5` |
    | `stroke-opacity` | Controls the opacity of the outline | `stroke-opacity: 0.5` |

=== "Horizontal Line"
    | Property | What it does | Example |
    | :------- | :----------- | :------ |
    | `stroke` | Defines the line color | `stroke: red` |
    | `stroke-width` | Controls the line width | `stroke-width: 2em` |
    | `opacity` | Controls the line opacity | `opacity: 0.7` |
    | `stroke-linecap` | Chooses the line ending | `round`, `butt`, or `square` |

=== "Vertical Line"
    | Property | What it does | Example |
    | :------- | :----------- | :------ |
    | `stroke` | Defines the line color | `stroke: red` |
    | `stroke-width` | Controls the line width | `stroke-width: 2em` |
    | `opacity` | Controls the line opacity | `opacity: 0.7` |
    | `stroke-linecap` | Chooses the line ending | `round`, `butt`, or `square` |

--8<-- "docs/sections/default-haptics.md"

## :material-horseshoe: Color stops and animations

Visual shapes can use color stops and animations when connected to an entity.

| Method        |      Support     | Description                                    |
| :------------ | :--------------: | :--------------------------------------------- |
| `color_stops` | :material-check: | Uses state values to determine the shape color |
| `animations`  | :material-check: | Applies state-based class or style changes     |

!!! info
Animations require the visual shape to be connected to an entity through `entity_index`.
