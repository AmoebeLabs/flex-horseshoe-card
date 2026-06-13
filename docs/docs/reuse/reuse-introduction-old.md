---
template: main.html
title: Reuse
description: Reuse
tags:
  - Reuse
---

# Less YAML with Reuse

Flexible Horseshoe Card configurations can become large when a card contains multiple layout items, repeated styles, repeated color stops, or carefully positioned elements.

## :material-horseshoe: The more items, the more YAML
A common pattern is that many items are almost the same. Only one or two fields are different, such as `xpos`, `ypos`, `radius`, `length`, the `entity_index` or a small style override. Or, with repeated items: there is a repeated delta in the position.


Now check the next example, with its three horizontal, equally spaced lines.

![](../assets/screenshots/fhs-demo-card-30a-electricity--dark.png)

Without some form of reuse, this usually leads to repeated YAML and repeatedly changing xpos/ypos while designing the card until it is right:

=== "Standard YAML configuration"
    ```yaml linenums="1" hl_lines="2 9 16"
    hlines:
      - xpos: 50
        ypos: 64
        length: 85
        styles:
          stroke: var(--disabled-text-color)
          stroke-width: 2

      - xpos: 50
        ypos: 75 # 11 lower than previous hline
        length: 85
        styles:
          stroke: var(--disabled-text-color)
          stroke-width: 2

      - xpos: 50
        ypos: 86 # 11 lower than previous hline
        length: 85
        styles:
          stroke: var(--disabled-text-color)
          stroke-width: 2
    ```

Using YAML anchors can limit the amount of YAML significantly in this case:

=== "Using YAML anchors"
    ```yaml linenums="1" hl_lines="2"
    hlines:
      - &hline_base
        xpos: 50
        ypos: 64
        length: 85
        styles:
          stroke: var(--disabled-text-color)
          stroke-width: 2

      - <<: *hline_base
        ypos: 75

      - <<: *hline_base
        ypos: 86
    ```

This works, but:

- It does not solve repeated patterns, as YAML can't do calculations
- Not many people use it because of the syntax and the fact that the anchor must be unique in the whole YAML file. In other words: hard to maintain.
  <br><br>It also leads to YAML duplicate key errors because the Home Assistant YAML loader does not like that:
``` linenums="1"
Logger: annotatedyaml.constructors
Source: util/yaml/loader.py:65
First occurred: May 21, 2026 at 6:43:48 PM (39520 occurrences)
Last logged: 3:28:56 PM

YAML file /config/lovelace/views/whatever.yaml contains duplicate key "ypos". Check lines 41 and 312
...
```

##:material-horseshoe: Enter the world of "same_as"

### The goal
- The goal is to make repeated configuration shorter, clearer, and easier to maintain.
- Instead of repeating full YAML blocks, you can define common parts once and reuse them.
- You also can do calculations, and define deltas on any numbered value

This makes the external configuration compact, while the card still converts it into a complete internal configuration before rendering.

So let's examine the same simple configuration with `same_as` functionality!

- Using `same_as` to duplicate any previous item in the section
- Using `calc()` to shift down each line with a defined constant
- Either using automatic id numbering, or named id's to reference an item within the section

=== "With reuse \#1"
    ```yaml linenums="1" hl_lines="2 9 16 19"
    # Define constants to be used in the card
    constants:
      lineStep: 11                   # Height between lines
      defaultLineStyle:
        stroke: var(--disabled-text-color)
        stroke-width: 2

    hlines:
      - xpos: 50                      # Using auto-ID, so id = 0
        ypos: 64
        length: 85
        styles:
          - ref(defaultLineStyle)
          - opacity: 0.8

      - same_as: 0                    # Same as hline 0
        same_as_dypos: calc(1 * lineStep)

      - same_as: 0                    # Same as hline 0
        same_as_dypos: calc(2 * lineStep)
    ```
=== "With reuse \#2"
    ```yaml linenums="1" hl_lines="2 9 16 19"
    # Define constants to be used in the card
    constants:
      lineStep: 11                   # Height between lines
      defaultLineStyle:
        stroke: var(--disabled-text-color)
        stroke-width: 2

    hlines:
      - id: first                     # Using named IDs
        xpos: 50
        ypos: 64
        length: 85
        styles:
          - ref(defaultLineStyle)
          - opacity: 0.8

      - id: second
        same_as: first                # Same as hline first
        same_as_dypos: calc(lineStep) # Shift down

      - id: third
        same_as: second               # Same as hline second
        same_as_dypos: calc(lineStep) # Shift down
    ```

The benefit becomes even larger for larger section items.

A simple line may only contain a few fields, but a horseshoe can contain many nested settings: scale, state, tickmarks, labels, show options, colors, widths, min/max values, and styles.

When multiple horseshoes share the same visual setup, `same_as` allows one base horseshoe to define the common structure. The other horseshoes only need to override what is different, such as `entity_index`, `color_stops`, `min`, or `max`.

The horseshoe in the above example is about 60 lines of YAML.

Even if you take a mini horseshoe, the power of the `same_as` and `ref` functionality becomes clearly visible.

!!! Info "Groups built on the foundation of `same_as` to group and position a group of items"
    This makes it possible to define an identical set of items (names, states, etc) and position them as you wish as a group of items. The only difference being the `entity_index`...

```yaml linenums="1" hl_lines="2 16 25"
horseshoes:
  - id: base
    group: base              # Group will position the horseshoe (and more)
    radius: 45
    horseshoe_scale:
      min: 0
      max: 100
      width: 6
    horseshoe_state:
      width: 8
    show:
      horseshoe: true
      ticks: true
    color_stops: ref(defaultColorStops)

  - id: power
    group: power             # Group will position the horseshoe (and more)
    same_as: base
    entity_index: 1
    color_stops: ref(powerColorStops)
    horseshoe_scale:
      min: 0
      max: 5000

  - id: temperature
    group: temperature       # Group will position the horseshoe (and more)
    same_as: base
    entity_index: 2
    color_stops: ref(temperatureColorStops)
    horseshoe_scale:
      min: -10
      max: 40
```

!!! Success "The larger the repeated item, the more useful reuse becomes."


##:material-horseshoe: Main ideas

| Feature        | Purpose                                              |
| :------------- | :--------------------------------------------------- |
| `same_as`      | Reuse another item from the same section             |
| `same_as_d...` | Reuse an item and apply a numeric offset             |
| `calc()`       | Use static calculations in numeric fields            |
| `constants`    | Define reusable static values or config fragments    |
| `ref()`        | Copy a value from `constants` into the configuration |

These features are processed during card setup.

They are not runtime rendering tricks. By the time the card renders, the configuration has already been expanded into normal values.

##:material-horseshoe: Why this helps with less YAML and easier maintenance

Reuse is useful when a card layout contains patterns.

Examples:

* multiple lines with the same length and style
* multiple circles with the same center but different radius
* repeated icon positions around a shared center point
* shared color stops
* shared styles
* spacing based on a fixed step size
* layout values derived from one shared parameter

For example, instead of manually calculating positions:

```yaml
icons:
  - xpos: 46
    ypos: 50

  - xpos: 54
    ypos: 50
```

you can keep the intent visible:

```yaml
constants:
  centerX: 50
  iconOffset: 4

icons:
  - xpos: calc(centerX - iconOffset)
    ypos: 50

  - xpos: calc(centerX + iconOffset)
    ypos: 50
```

Now the configuration explains itself.

The icons are positioned around `centerX`, with an offset of `4`.

If the center changes later, only one value has to be changed.

##:material-horseshoe: Static first, render simple

The reuse system follows a simple principle:

1. The user writes compact YAML.
2. The card expands and calculates static values during setup.
3. The renderer receives complete configuration.

This keeps the render code simple.

The renderer does not need to know whether a value originally came from `same_as`, `calc()`, `constants`, or `ref()`. It only receives the final resolved value.

##:material-horseshoe: When to use reuse

Use reuse when it makes the layout easier to understand.

Good use cases:

* repeated items
* shared styles
* shared color stops
* repeated spacing
* derived positions
* one base item with small variations

Avoid reuse when it makes the configuration harder to read than writing the value directly.

For one-off values, plain YAML is often clearer.

##:material-horseshoe: Related pages

This section introduces the idea of reducing YAML through reuse.

The following pages describe the individual features in more detail:

* **Reuse of Section Items**
  Explains `same_as` and `same_as_d...`.

* **Reuse with `calc()` and `ref()`**
  Explains static calculations, constants, and references.

* **Combining the two**
  Shows how these features can be used together in practical card layouts.
