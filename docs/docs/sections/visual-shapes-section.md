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

# Visual Shapes: rectangles, lines, and circles

Visual shapes are simple SVG-based building blocks that help structure a card visually. They can be used as separators, backgrounds, highlights, indicators, or decorative elements.

The card supports four shape sections:

| Shape | Section | Description |
| :---- | :------ | :---------- |
| Rectangle | `rectangles` | A fixed rectangle or a rectangle that automatically fits another layout item |
| Circle | `circles` | A circle positioned by its center point, with either `radius` or `radius_percent` |
| Horizontal line | `hlines` | A horizontal line positioned by its center point and length |
| Vertical line | `vlines` | A vertical line positioned by its center point and length |

All four shapes use the same 100x100 card coordinate system. This makes them easy to align with horseshoes, states, names, icons, and other layout items.

## :material-horseshoe: Basic usage

A rectangle can use a fixed center position, width, and height. It can also use `fit` to automatically follow the position and rendered size of a state, name, or area. A fitted rectangle adjusts when the content, number formatting, font, or language changes.

A circle needs a center position and a radius. The radius can be defined in pixels with `radius`, or as a percentage with `radius_percent`.

A horizontal or vertical line needs a center position and a length. The configuration is almost the same for both line types. The only difference is the section: horizontal lines are defined in `hlines`, while vertical lines are defined in `vlines`.

Shapes can also be connected to an entity by using `entity_index`. This allows color stops and animations to react to the state of that entity.

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
    ```

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

    ```yaml title="Basic Circle 1" linenums="1" hl_lines="1"
    - xpos: 50                  # xpos=50 is center position
      ypos: 50                  # ypos=50 is center position
      radius: 25                # radius (in pixels) of circle
      styles:
        stroke-width: 2         # Set stroke width using CSS attribute
    ```
    ```yaml title="Basic Circle 2" linenums="1" hl_lines="1"
    - xpos: 50                  # xpos=50 is center position
      ypos: 50                  # ypos=50 is center position
      radius_percent: 25        # radius (in %) of circle
      entity_index: 0           # connects to entity 0 in the entity definitions
      styles:
        stroke-width: 2         # Set stroke width using CSS attribute
      color_stop:               # Use of color stop: color of circle depends on state
        colors:
          0: 'blue'
          0.1: 'green'
          0.4: 'yellow'
          1: 'orange'
          3: 'red'
          5: 'purple'
    ```

=== "Horizontal Line"

    ```yaml title="Horizontal / Vertical config" linenums="1" hl_lines="1 7"
    - xpos: 50                  # xpos=50 is center position
      ypos: 50                  # ypos=50 is center position
      length: 25                # length of line.
      entity_index: 0           # connect to state of entity 0
      styles:
        stroke-width: 2         # Set stroke width using CSS attribute
    ```

    ```yaml title="Horizontal / Vertical config" linenums="1" hl_lines="1 7"
    - xpos: 50                  # xpos=50 is center position
      ypos: 50                  # ypos=50 is center position
      length: 25                # length of line.
      entity_index: 0           # connect to state of entity 0
      styles:
        stroke-width: 2         # Set stroke width using CSS attribute
      color_stop:               # Use of color stop: color of circle depends on state
        colors:
          0: 'blue'
          0.1: 'green'
          0.4: 'yellow'
          1: 'orange'
          3: 'red'
          5: 'purple'
    ```

=== "Vertical Line"

    ```yaml title="Horizontal / Vertical config" linenums="1" hl_lines="1 7"
    - xpos: 50                  # xpos=50 is center position
      ypos: 50                  # ypos=50 is center position
      length: 25                # length of line.
      entity_index: 0           # connect to state of entity 0
      styles:
        stroke-width: 2         # Set stroke width using CSS attribute
    ```

    ```yaml title="Horizontal / Vertical config" linenums="1" hl_lines="1 7"
    - xpos: 50                  # xpos=50 is center position
      ypos: 50                  # ypos=50 is center position
      length: 25                # length of line.
      entity_index: 0           # connect to state of entity 0
      styles:
        stroke-width: 2         # Set stroke width using CSS attribute
      color_stop:               # Use of color stop: color of circle depends on state
        colors:
          0: 'blue'
          0.1: 'green'
          0.4: 'yellow'
          1: 'orange'
          3: 'red'
          5: 'purple'
    ```

## :material-horseshoe: Configuration fields

The required fields depend on the shape type. Rectangles use fixed dimensions or `fit`, circles use a radius, and lines use a length.

=== "Rectangle"

    | Field | Required | Description |
    | :---- | :------: | :---------- |
    | `xpos` | Fixed only | X position of the rectangle center |
    | `ypos` | Fixed only | Y position of the rectangle center |
    | `width` | Fixed only | Rectangle width |
    | `height` | Fixed only | Rectangle height |
    | `fit.section` | Fit only | Section containing the referenced item: `states`, `names`, or `areas` |
    | `fit.item_id` | Fit only | `id` of the referenced item |
    | `fit.padding.x` | :material-close: | Horizontal padding around the measured item. Default: `1.5` |
    | `fit.padding.y` | :material-close: | Vertical padding around the measured item. Default: `0.5` |
    | `radius` | :material-close: | Corner radius. Default: `0` |
    | `entity_index` | :material-close: | Index in the `entities` section |
    | `styles` | :material-close: | CSS style definitions |
    | `color_stops` | :material-close: | Color stops used to set the fill color based on the entity state |

    !!! note
        Use either `xpos`, `ypos`, `width`, and `height`, or use `fit`. A fitted rectangle obtains all four geometry values from the referenced item.

=== "Circle"

    | Field | Required | Description |
    | :---- | :------: | :---------- |
    | `xpos` | :material-check: | X position on the 100x100 card canvas |
    | `ypos` | :material-check: | Y position on the 100x100 card canvas |
    | `radius` | :material-check: | Circle radius in pixels |
    | `radius_percent` | :material-check: | Circle radius as a percentage |
    | `entity_index` | :material-close: | Index in the `entities` section |
    | `styles` | :material-close: | CSS style definitions |
    | `color_stop` | :material-close: | Color stop used to set the shape color based on the entity state |

    !!! note
        Use either `radius` or `radius_percent`.

=== "Horizontal Line"

    | Field | Required | Description |
    | :---- | :------: | :---------- |
    | `xpos` | :material-check: | X position on the 100x100 card canvas |
    | `ypos` | :material-check: | Y position on the 100x100 card canvas |
    | `length` | :material-check: | Length of the horizontal line |
    | `entity_index` | :material-close: | Index in the `entities` section |
    | `styles` | :material-close: | CSS style definitions |
    | `color_stop` | :material-close: | Color stop used to set the line color based on the entity state |

=== "Vertical Line"

    | Field | Required | Description |
    | :---- | :------: | :---------- |
    | `xpos` | :material-check: | X position on the 100x100 card canvas |
    | `ypos` | :material-check: | Y position on the 100x100 card canvas |
    | `length` | :material-check: | Length of the vertical line |
    | `entity_index` | :material-close: | Index in the `entities` section |
    | `styles` | :material-close: | CSS style definitions |
    | `color_stop` | :material-close: | Color stop used to set the line color based on the entity state |

### Shared fields

These fields can be used with rectangles, circles, horizontal lines, and vertical lines.

| Field | Required | Description |
| :---- | :------: | :---------- |
| `id` | :material-close: | Optional unique id within the section, used by `same_as` |
| `group` | :material-close: | Group this visual shape belongs to |
| `same_as*` | :material-close: | Reuse another item from the same section. See the `same_as` documentation |

## :material-horseshoe: Styling

Visual shapes are SVG elements, so they can be styled with CSS properties in the `styles` section.

| Method | Support | Description |
| :----- | :-----: | :---------- |
| `styles` | :material-check: | Inline SVG and CSS styles |

### Popular style properties

=== "Rectangle"

    | Property | What it does | Example |
    | :------- | :----------- | :------ |
    | `fill` | Sets the fill color | `fill: red` |
    | `stroke` | Sets the outline color | `stroke: blue` |
    | `stroke-width` | Sets the outline width | `stroke-width: 1em` |
    | `opacity` | Sets the opacity of the complete rectangle | `opacity: 0.7` |
    | `fill-opacity` | Sets the opacity of the fill | `fill-opacity: 0.5` |
    | `stroke-opacity` | Sets the opacity of the outline | `stroke-opacity: 0.5` |

=== "Circle"

    | Property | What it does | Example |
    | :------- | :----------- | :------ |
    | `fill` | Sets the fill color | `fill: red` |
    | `stroke` | Sets the outline color | `stroke: blue` |
    | `stroke-width` | Sets the outline width | `stroke-width: 2em` |
    | `opacity` | Sets the opacity of the full circle | `opacity: 0.7` |
    | `fill-opacity` | Sets the opacity of the fill | `fill-opacity: 0.5` |
    | `stroke-opacity` | Sets the opacity of the outline | `stroke-opacity: 0.5` |

=== "Horizontal Line"

    | Property | What it does | Example |
    | :------- | :----------- | :------ |
    | `stroke` | Sets the line color | `stroke: red` |
    | `stroke-width` | Sets the line width | `stroke-width: 2em` |
    | `opacity` | Sets the line opacity | `opacity: 0.7` |
    | `stroke-linecap` | Sets the line ending | `round`, `butt`, or `square` |

=== "Vertical Line"

    | Property | What it does | Example |
    | :------- | :----------- | :------ |
    | `stroke` | Sets the line color | `stroke: red` |
    | `stroke-width` | Sets the line width | `stroke-width: 2em` |
    | `opacity` | Sets the line opacity | `opacity: 0.7` |
    | `stroke-linecap` | Sets the line ending | `round`, `butt`, or `square` |

--8<-- "docs/tools/default-haptics.md"

## :material-horseshoe: Color stops and animations

Visual shapes can use color stops and animations when they are connected to an entity.

| Method | Support | Description |
| :----- | :-----: | :---------- |
| `color_stops` | :material-check: | List of state values used to set the shape color |
| `animations` | :material-check: | State-based animations using class or style changes |

!!! info
    Animations require the visual shape to be connected to an entity with `entity_index`.
