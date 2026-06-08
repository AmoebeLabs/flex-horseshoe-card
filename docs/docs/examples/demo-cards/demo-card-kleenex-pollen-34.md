---
template: main.html
title: "Functional Cards: Tomorrow Pollen Card"
description: "Example of functional card, Tomorrow Pollen Card"
hideno:
  toc
tags:
  - Design
  - Demo Card
  - Kleenex Pollen Card
---
<!-- GT/GL -->
##:material-horseshoe: Visualization

![](/assets/screenshots/fhs-demo-card-34-kleenex-pollen-radar--dark.webp#only-light){width="300"}
![](/assets/screenshots/fhs-demo-card-34-kleenex-pollen-radar--dark.webp#only-dark){width="300"}

| Description| Aspect Ratio|
|-|-|
| A card that shows the pollen status from Kleenex Pollen Radar | 1/1 |

| FHS | Demonstrated Functionality |
|-|-|
| `same_as` | Repeated horizontal lines with dy and dlength |
| `same_as` | Repeated horseshoes with colored scale and large radius to look horizontal|
| `same_as` | Icon state maps using the replace functionality of `same_as` to replace the state map |
| `ref()`   | Some of the Icon state maps are defined as constants, and used via the `ref()` function |
| `calc()`  | Extensive use of the `calc()` function to calculate positions and radiuses |
| Icon | Icon with state map and external SVG files to display the trees/grass and weed pictures.|
| Horseshoes | Horseshoes with state map and color stop. |

##:material-horseshoe: Integrations
This demo card requires:

- The Kleenex Pollen Radar custom integration available through HACS.
- Some SVG files from Github to be put in the `www/images/kleenex` folder"
    - /local/images/kleenex/pollen_tree_low.svg, moderate, high and very_high
    - /local/images/kleenex/pollen_grass_low.svg, moderate, high and very_high
    - /local/images/kleenex/pollen_weed_low.svg, moderate, high and very_high



!!! info "Images and colors used for this card are adapted versions from Isabella Alströms pollen images"

##:material-horseshoe: Interaction

| Part | Description|
|-|-|
| Card | All tools connected to an entity do show by default the "more-info" dialog once clicked |

##:material-horseshoe: YAML Card Definition
[:octicons-tag-24: 5.4.7][github-releases]
```yaml  linenums="1" hl_lines="1"
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

<!-- Image references -->

<!--- Internal References... --->
[Swiss Army Knife Tutorial 02]: ../tutorials/10-step-tutorial-02-intro.md
[Swiss Army Knife Javascript Snippets]: ../basics/templates/javascript-snippets.md

<!--- External References... --->
[ham3-d06-url]: https://material3-themes-manual.amoebelabs.com/examples/material3-example-theme-d06-tealblue/
[github-releases]: https://github.com/amoebelabs/swiss-army-knife-card/releases/
