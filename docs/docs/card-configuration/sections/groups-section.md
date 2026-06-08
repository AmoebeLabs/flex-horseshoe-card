---
template: main.html
title: Groups Section
description: Groups. 
tags:
  - Groups
  - Section
---

## :material-horseshoe: Groups

Sometimes it would be very nice if items can be grouped together, so you can place them together as a single element.

Welcome to Groups!

Items from different sections can be grouped together using a named group.

```yaml linenums="1" hl_lines="2 3 6 9"
          layout:
            groups:
              L1:
                xpos: 65
                ypos: 45
              L2:
                xpos: 65
                ypos: 56
              L3:
                xpos: 65
                ypos: 67

```
```yaml linenums="1" hl_lines="1 5 11 14"
            names:
              - entity_index: 1
                xpos: 47
                ypos: 50
                group: L1
                styles:
                  - text-anchor: end
                  - font-size: 1.2em                  
              - entity_index: 2
                same_as: 1
                group: L2
              - entity_index: 3
                same_as: 1
                group: L3
```

```yaml linenums="1" hl_lines="1 4 10 12"
            circles:
              - xpos: 50
                ypos: 47
                group: L1
                radius: 2
                styles:
                  - fill: var(--primary-text-color)
                  - opacity: 0.5
              - same_as: 0
                group: L2
              - same_as: 0
                group: L3
```

```yaml linenums="1" hl_lines="1 5 11 14"
            states:
              - entity_index: 1
                xpos: 53
                ypos: 50
                group: L1
                styles:
                  - text-anchor: start
                  - font-size: 1.2em
              - entity_index: 2
                same_as: 1
                group: L2
              - entity_index: 3
                same_as: 1
                group: L3
```
