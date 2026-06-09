---
template: main.html
title: YAML Card Structure
description: Each Swiss Army Knife custom card follows the same structure to define the card, toolsets and tools to create the visualization you want.
tags:
  - YAML
  - Structure
  - Card
---

##:material-horseshoe: The Flexible Horseshoe Card YAML  structure
The main aspects of a FHS Card are shown below using highlighted lines.

!!! Info "This is the new structure, were the Horseshoe has gotten it's own section in the layout"
```yaml linenums="1" hl_lines="4 6 21 23 31 33 36 46 48 50 52 54 56 58 60"
  # Define the type of the card to use.
  #
  # -----
- type: 'custom:flex-horseshoe-card'
  # Define the entities
  entities:
    - <list of entities>

  #
  # Define aspect ratio and size of card.
  # - In this case the card is square and has a size of 100x100
  # - A 2/1 ratio would have a size of 200x100
  # - etc.
  #
  # Odd values like 1/0.05 are also possible. Size is 100x5
  # This is used for instance to just draw a line/separator
  #
  # Specification:
  # - aspectratio (string)
  # -----
  aspectratio: 1/1

  styles:
    <styles dict or list for the card itself>

  animations:
    <animation dict per entity>
  #
  # ***** card/layout section *****
  #
  # Specification:
  # - layout (map)
  # -----
  layout:

    constants:    # Constants definitions
      <constant dicts>

    groups:       # Group definitions
      <group dicts>

    # ***** card/layout/sections *****
    #
    # Overall sections of the card.
    #
    # Specification:
    #   sections: (dict)
    # -----
    areas:        # Entity Areas
      - <list of ...>
    circles:      # Circles
      - <list of ...>
    horseshoes:   # Horse shoes
      - <list of ...>
    icons:        # Icons
      - <list of ...>
    hlines:       # Horizontal ines
      - <list of ...>
    names:        # Entity names
      - <list of ...>
    states:       # Entity states
      - <list of ...>
    vlines:       # Vertical lines
      - <list of ...>
      
            
```