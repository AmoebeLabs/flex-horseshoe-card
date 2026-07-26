---
template: main.html
title: Pollen Radar Card Examples
description: Explore several pollen radar cards that visualize tree, grass, and weed levels with horseshoes, icons, state maps, and reusable YAML.
hideno:
  toc
tags:
- Design
- Demo Card
- Kleenex Pollen Card
---

<!-- GT/GL -->

# Pollen Radar card examples

## :material-horseshoe: Visualization

These examples show several ways to display tree, grass, and weed pollen levels with horseshoes, mapped states, external SVG icons, and reusable YAML.

![](../../assets/screenshots/fhs-demo-card-34-kleenex-pollen-radar--dark.webp#only-light){width="300"}
![](../../assets/screenshots/fhs-demo-card-34-kleenex-pollen-radar--dark.webp#only-dark){width="300"}

| Description                                                            | Aspect ratio |
| :--------------------------------------------------------------------- | :----------- |
| Displays pollen information from the Kleenex Pollen Radar integration. | `1/1`        |

### Demonstrated functionality

| Feature           | Demonstrated use                                                                    |
| :---------------- | :---------------------------------------------------------------------------------- |
| `same_as`         | Reuses horizontal lines with different positions and lengths.                       |
| `same_as`         | Reuses horseshoes with colored scales and a large radius to create horizontal bars. |
| `same_as_replace` | Replaces inherited icon state maps on reused items.                                 |
| `ref()`           | Inserts shared icon state maps defined under `constants`.                           |
| `calc()`          | Calculates positions, offsets, dimensions, and radii.                               |
| Icons             | Uses state maps and external SVG files for tree, grass, and weed illustrations.     |
| Horseshoes        | Combines mapped states with color stops.                                            |

## :material-horseshoe: More visualizations

The following variations were created for version [:octicons-tag-24: 5.4.7-dev.12][github-releases].

### Card 55

Card 55 uses three horseshoes to display the current pollen level for trees, grass, and weeds.

* Pollen values appear as ordered levels.
* Labels are placed directly on the horseshoe states.
* The active state uses bold text.
* Two arc shapes create a background for each external SVG icon and label.

![](../../assets/screenshots/fhs-demo-card-55-kleenex-pollen-radar--dark.webp#only-light)
![](../../assets/screenshots/fhs-demo-card-55-kleenex-pollen-radar--dark.webp#only-dark)

### Card 54

Card 54 is a variation of card 55. It applies a grayscale color filter to reduce the intensity of the horseshoe colors.

!!! info
Color filters do not affect external images or SVG files.

![](../../assets/screenshots/fhs-demo-card-54-kleenex-pollen-radar--dark.webp#only-light)
![](../../assets/screenshots/fhs-demo-card-54-kleenex-pollen-radar--dark.webp#only-dark)

### Card 53

Card 53 uses a more traditional horseshoe layout.

* Labels appear separately around the horseshoe.
* A grayscale color filter softens the displayed colors.

![](../../assets/screenshots/fhs-demo-card-53-kleenex-pollen-radar--dark.webp#only-light)
![](../../assets/screenshots/fhs-demo-card-53-kleenex-pollen-radar--dark.webp#only-dark)

### Card 52

Card 52 displays the pollen level as a single mutually exclusive state. Only the currently active state is shown.

![](../../assets/screenshots/fhs-demo-card-52-kleenex-pollen-radar--dark.webp#only-light)
![](../../assets/screenshots/fhs-demo-card-52-kleenex-pollen-radar--dark.webp#only-dark)

## :material-horseshoe: Required integration and files

These examples require:

* The Kleenex Pollen Radar custom integration, available through HACS.
* External SVG files stored in `www/images/kleenex`.

Add the following SVG variants:

* `/local/images/kleenex/pollen_tree_low.svg`
* `/local/images/kleenex/pollen_tree_moderate.svg`
* `/local/images/kleenex/pollen_tree_high.svg`
* `/local/images/kleenex/pollen_tree_very_high.svg`
* `/local/images/kleenex/pollen_grass_low.svg`
* `/local/images/kleenex/pollen_grass_moderate.svg`
* `/local/images/kleenex/pollen_grass_high.svg`
* `/local/images/kleenex/pollen_grass_very_high.svg`
* `/local/images/kleenex/pollen_weed_low.svg`
* `/local/images/kleenex/pollen_weed_moderate.svg`
* `/local/images/kleenex/pollen_weed_high.svg`
* `/local/images/kleenex/pollen_weed_very_high.svg`

!!! warning
The Kleenex integration does not translate the `very_high` state. Override this label in the horseshoe label configuration when a translated or more readable label is needed.

!!! info
The images and colors used by these cards are adapted from Isabella Alström’s pollen illustrations.

## :material-horseshoe: Interaction

| Part                      | Behavior                                                                                 |
| :------------------------ | :--------------------------------------------------------------------------------------- |
| Entity-connected elements | Clicking or tapping an element opens the Home Assistant **More info** dialog by default. |

## :material-horseshoe: YAML card definitions

### Card 34

![](../../assets/screenshots/fhs-demo-card-34-kleenex-pollen-radar--dark.webp){width="300"}

This configuration was created for version [:octicons-tag-24: 5.4.7][github-releases].

??? info "YAML definition for card #34"

````
```yaml linenums="1" hl_lines="1"
        - type: custom:flex-horseshoe-card
          # Entities Section
          entities:
            - entity: sensor.kleenex_pollen_radar_zoefdehaas_bomen_niveau
              area: ':34:'
              name: 'Trees'
            - entity: sensor.kleenex_pollen_radar_zoefdehaas_gras_niveau
              name: 'Grass'
              area: 'Kleenex Pollen'
            - entity: sensor.kleenex_pollen_radar_zoefdehaas_kruiden_niveau
              name: 'Weed'

          # Constants Section
          constants:
            radius0: 5000
            xpos0: 15
            dxPos1: 35
            dxPos2: 35
            pollen_tree_map:
              map:
                - state: 'low'
                  icon: url(/local/images/kleenex/pollen_tree_low.svg)
                - state: 'moderate'
                  icon: url(/local/images/kleenex/pollen_tree_moderate.svg)
                - state: 'high'
                  icon: url(/local/images/kleenex/pollen_tree_high.svg)
                - state: 'very_high'
                  icon: url(/local/images/kleenex/pollen_tree_very_high.svg)
            pollen_grass_map:
              map:
                - state: 'low'
                  icon: url(/local/images/kleenex/pollen_grass_low.svg)
                - state: 'moderate'
                  icon: url(/local/images/kleenex/pollen_grass_moderate.svg)
                - state: 'high'
                  icon: url(/local/images/kleenex/pollen_grass_high.svg)
                - state: 'very_high'
                  icon: url(/local/images/kleenex/pollen_grass_very_high.svg)
          layout:
            areas:
              - entity_index: 0
                xpos: 0
                ypos: 100
                styles:
                  - font-size: 0.75em
                  - text-transform: none     
                  - text-anchor: start                       
              - entity_index: 1
                xpos: 50
                ypos: 12
                styles:
                  - font-size: 1.7em
                  - text-transform: none     
            icons:
              - entity_index: 0
                xpos: calc(xpos0)
                ypos: 70
                icon_size: 4.5
                state_map:
                  ref(pollen_tree_map)

              - entity_index: 1
                same_as: 0
                same_as_dxpos: calc(dxPos1)
                same_as_replace:
                  - state_map
                state_map:
                  ref(pollen_grass_map)

              - entity_index: 2
                same_as: 1
                same_as_dxpos: calc(dxPos2)
                same_as_replace:
                  - state_map
                state_map:
                  map:
                    - state: 'low'
                      icon: url(/local/images/kleenex/pollen_weed_low.svg)
                    - state: 'moderate'
                      icon: url(/local/images/kleenex/pollen_weed_moderate.svg)
                    - state: 'high'
                      icon: url(/local/images/kleenex/pollen_weed_high.svg)
                    - state: 'very_high'
                      icon: url(/local/images/kleenex/pollen_weed_very_high.svg)

            # hlines section
            hlines:
              - xpos: 50
                ypos: 15
                length: 80
                styles:
                  - stroke: var(--disabled-text-color);
              - same_as: 0
                same_as_dypos: 3        # Shift 3 downwards
                same_as_dlength: 7.5    # increase length by 7.5
              - same_as: 1
                same_as_dypos: 3        # Shift 3 downwards
                same_as_dlength: 7.5    # increase length by 7.5

            # States section
            states:
              - entity_index: 0
                xpos: calc(xpos0)
                ypos: 90
                styles:
                  - font-size: 1.0em
              - entity_index: 1
                same_as: 0
                same_as_dxpos: calc(dxPos1)
              - entity_index: 2
                same_as: 1
                same_as_dxpos: calc(dxPos2)

            # Names section
            names:
              - entity_index: 0
                xpos: calc(xpos0)
                ypos: 45
                styles:
                  - font-size: 1.0em
                  - text-transform: none     
              - entity_index: 1
                same_as: 0
                same_as_dxpos: calc(dxPos1)
              - entity_index: 2
                same_as: 1
                same_as_dxpos: calc(dxPos2)

            # Horseshoes section
            horseshoes:
                # This horseshoe looks like a horizontal progress bar!
                # Use a big radius (5000) and extremely small arc (0.3)
              - entity_index: 0
                xpos: calc(xpos0)
                ypos: calc(-radius0 + xpos0 + 15)
                radius: calc(radius0)
                tickmarks_radius: calc(radius0)
                arc_degrees: .3
                flip: y
              
                show:
                  horseshoe: true
                  scale_tickmarks: false
                  horseshoe_style: colorstop
                  scale_style: colorstop
                  labels_at: none
                  ticks: false
                  label_badges: false
                  label_background: none
                # 
                horseshoe_scale:
                  min: 0
                  max: 4
                  width: 6
                  color: gray
                  gap: 0
                  styles:
                    - opacity: 0.6;
                #
                horseshoe_tickmarks:
                  ticks_major:
                    ticksize: 1
                    color_mode: colorstop
                    width: 12
                    offset: -3
                    thickness: 3
                    styles:
                      - stroke: var(--primary-text-color);
                      - fill: var(--primary-text-color);
                      - opacity: 0.7;
                #
                horseshoe_labels:
                  distance_min: 0.3
                  ticksize_min: 0.3
                  orientation: horizontal
                  offset: -34
                  badges:
                    radius: 6
                    color: var(--card-background-color)
                    border_color: var(--divider-color)
                    padding: 0
                    height: 10    # 12 is same as font-size of 1em    
                  styles:
                    - font-size: 0.7em
                #
                horseshoe_state:
                  width: 12
                  state_map:
                    map:
                      - state: 'low'
                        value: 0.99
                      - state: 'moderate'
                        value: 1.99
                      - state: 'high'
                        value: 2.99
                      - state: 'very_high'
                        value: 3.99
                  styles:
                    - stroke-linecap: butt
                #
                color_stops:
                  gap: 0.01 # Needs very small gap as arc is 0.3 degrees
                  colors:
                    0: '#838383'
                    1: '#fcc449'
                    2: '#ed8003'
                    3: 'red'

              # The full `same_as` functionality at its best:
              # repeated horseshoe takes only a few lines of YAML
              #
              # Saving around 60-70 lines of YAML per horseshoe config!
              - entity_index: 1
                same_as: 0
                same_as_dxpos: calc(dxPos1)
                show:
                  labels_at: none
              - entity_index: 2
                same_as: 1
                same_as_dxpos: calc(dxPos2)
```
````

### Card 55

![](../../assets/screenshots/fhs-demo-card-55-kleenex-pollen-radar--dark.webp)

This configuration was created for version [:octicons-tag-24: 5.4.7-dev.12][github-releases].

??? info "YAML definition for card #55"

````
```yaml linenums="1" hl_lines="1"
- type: custom:flex-horseshoe-card
  entities:
    - entity: sensor.kleenex_pollen_radar_zoefdehaas_bomen_niveau
    # - entity: input_select.fake_pollen_trees
      area: ':55v2:'
      name: 'Trees'
    - entity: sensor.kleenex_pollen_radar_zoefdehaas_gras_niveau
      name: 'Grass'
      area: 'Kleenex Pollen'
    - entity: sensor.kleenex_pollen_radar_zoefdehaas_kruiden_niveau
      name: 'Weed'

  aspectratio: 3/1.2
  constants:
    radius0: 38 #36
    xpos0: 50
    dxPos1: 100
    dxPos2: 100
    arcsUpperArcDegrees: 210
    pollen_tree_map:
      map:
        - state: 'low'
          value: 0
          icon: url(/local/images/kleenex/pollen_tree_low.svg)
        - state: 'moderate'
          value: 1
          icon: url(/local/images/kleenex/pollen_tree_moderate.svg)
        - state: 'high'
          value: 2
          icon: url(/local/images/kleenex/pollen_tree_high.svg)
        - state: 'very_high'
          value: 3
          icon: url(/local/images/kleenex/pollen_tree_very_high.svg)
    pollen_grass_map:
      map:
        - state: 'low'
          value: 0
          icon: url(/local/images/kleenex/pollen_grass_low.svg)
        - state: 'moderate'
          value: 1
          icon: url(/local/images/kleenex/pollen_grass_moderate.svg)
        - state: 'high'
          value: 2
          icon: url(/local/images/kleenex/pollen_grass_high.svg)
        - state: 'very_high'
          value: 3
          icon: url(/local/images/kleenex/pollen_grass_very_high.svg)

  layout:
    arcs:
      - id: upperhalf_0
        xpos: calc(xpos0)
        ypos: 70
        radius: calc(radius0 - 10)
        arc_degrees: calc(arcsUpperArcDegrees)
        styles:
          fill: var(--disabled-text-color)
          fill-opacity: 0.3
          stroke-opacity: 0.3
          stroke-width: 1
          stroke: gray
      - id: upperhalf_1
        same_as: upperhalf_0
        same_as_dxpos: calc(dxPos1)
      - same_as: upperhalf_1
        same_as_dxpos: calc(dxPos2)

      - id: lowerhalf_0
        xpos: calc(xpos0)
        ypos: 70
        radius: calc(radius0 - 10)
        arc_degrees: calc(360 - arcsUpperArcDegrees - 10)
        flip: y
        styles:
          stroke-opacity: 0.3
          stroke-width: 1
          stroke: gray
      - id: lowerhalf_1
        same_as: lowerhalf_0
        same_as_dxpos: calc(dxPos1)
      - same_as: lowerhalf_1
        same_as_dxpos: calc(dxPos2)
    areas:
      - entity_index: 0
        xpos: 0
        ypos: 120
        styles:
          - font-size: 0.75em
          - text-transform: none     
          - text-anchor: start                       
      - entity_index: 1
        xpos: 150
        ypos: 10
        styles:
          - font-size: 1.7em
          - text-transform: none     
    icons:
      - entity_index: 0
        xpos: calc(xpos0)
        yposc: 60
        size: 4.5
        state_map:
          ref(pollen_tree_map)

      - entity_index: 1
        xpos: calc(xpos0)
        same_as: 0
        same_as_dxpos: calc(dxPos1)
        same_as_replace:
          - state_map
        state_map:
          ref(pollen_grass_map)

      - entity_index: 2
        same_as: 1
        same_as_dxpos: calc(dxPos2)
        same_as_replace:
          - state_map
        state_map:
          map:
            - state: 'low'
              value: 0
              icon: url(/local/images/kleenex/pollen_weed_low.svg)
            - state: 'moderate'
              value: 1
              icon: url(/local/images/kleenex/pollen_weed_moderate.svg)
            - state: 'high'
              value: 2
              icon: url(/local/images/kleenex/pollen_weed_high.svg)
            - state: 'very_high'
              value: 3
              icon: url(/local/images/kleenex/pollen_weed_very_high.svg)
    hlines:
      - xpos: 150
        ypos: 15
        length: 80
        styles:
          - stroke: var(--disabled-text-color);

    names:
      - entity_index: 0
        xpos: calc(xpos0)
        ypos: 90
        styles:
          - font-size: 1.5em
          - text-transform: none     
      - entity_index: 1
        same_as: 0
        same_as_dxpos: calc(dxPos1)
      - entity_index: 2
        same_as: 1
        same_as_dxpos: calc(dxPos2)

    horseshoes:
      - entity_index: 0
        debug_state_map: false
        xpos: calc(xpos0)
        ypos: 70
        radius: calc(radius0)
        tickmarks_radius: calc(radius0)
        arc_degrees: 360
        flip: both
        
        show:
          horseshoe: true
          scale_tickmarks: false
          horseshoe_style: colorstop
          scale_style: colorstop
          labels_at: stringstate
          ticks: false
          label_badges: false
          label_background: none
        # 
        horseshoe_scale:
          min: 0
          max: 4
          width: 27 #25
          gap: 0
          linecap: butt
          color_filter:
            grayscale:
              min: 0.2
              max: 0.6
        
          styles:
            opacity: 0.3
        #
        horseshoe_tickmarks:
          ticks_major:
            ticksize: 1
            color_mode: colorstop
            width: 12
            offset: -9
            thickness: 3
            styles:
              - stroke: var(--primary-text-color)
              - fill: var(--primary-text-color)
              - opacity: 0.7
        #
        horseshoe_labels:
          debug_labels: true
          distance_min: 0.3
          ticksize_min: 0.3
          orientation: arc
          offset: 0
          stringstate_level:
              before:
                styles:
                  - fill: var(--primary-background-color)
                  - opacity: 0.6
              current:
                styles:
                  - fill: var(--primary-background-color)
                  - font-weight: bold
              after:
                styles:
                  - opacity: 0.35
              state_map:
                map:
                  - state: very_high
                    label: Very High #Zeer Hoog
                    current:
                      styles:
                        - fill: var(--primary-text-color)
          styles:
            - font-size: 1.2em
            - opacity: 1
            - color: var(--primary-text-color)
            - font-weight: normal
        #
        horseshoe_state:
          mode: stringstate_level
          debug_state_map: false
          width: 27
          linecap: butt
          state_map:
            map:
              - state: 'low'
                value: 0.99
              - state: 'moderate'
                value: 1.99
              - state: 'high'
                value: 2.99
              - state: 'very_high'
                value: 3.99
          styles:
            - stroke-linecap: butt
        #
        color_stops:
          gap: 2
          colors:
            0: '#838383'
            1: '#fcc449'
            2: '#ed8003'
            3: '#e73f10'

      - entity_index: 1
        same_as: 0
        same_as_dxpos: calc(dxPos1)
      - entity_index: 2
        same_as: 1
        same_as_dxpos: calc(dxPos2)
```
````

## :material-horseshoe: Related documentation

* Configure threshold colors and gradients with [Color Stops](../../core-concepts/color-stops.md).
* Transform palette colors for alternate card designs with [Color Filters](../../core-concepts/color-filters.md).
* Configure state arcs and mapped states with [Horseshoe Gauges](../../sections/horseshoes-section.md).
* Reduce repeated definitions with the [Reuse Reference](../../reuse/reuse-reference.md).

<!-- Image references -->

<!--- Internal References... --->

[Swiss Army Knife Tutorial 02]: ../tutorials/10-step-tutorial-02-intro.md
[Swiss Army Knife Javascript Snippets]: ../basics/templates/javascript-snippets.md

<!--- External References... --->

[ham3-d06-url]: https://material3-themes-manual.amoebelabs.com/examples/material3-example-theme-d06-tealblue/
[github-releases]: https://github.com/amoebelabs/swiss-army-knife-card/releases/
