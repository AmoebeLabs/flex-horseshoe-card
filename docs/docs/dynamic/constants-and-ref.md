---
template: main.html
title: Constants and ref()
description: Define a fixed value or configuration block once and reuse it throughout a card.
tags:
  - Dynamic configuration
  - Constants
  - Reuse
---

# Constants and ref()

Use `constants` when the same fixed value, style, color definition, or configuration block appears several times in one card. Insert it with `ref()`.

## :material-horseshoe: Reuse a style

```yaml linenums="1"
constants:
  divider_style:
    stroke: var(--divider-color)
    stroke-width: 1

layout:
  lines:
    - xpos: 50
      ypos: 40
      length: 80
      styles: ref(divider_style)

    - xpos: 50
      ypos: 60
      length: 80
      styles: ref(divider_style)
```

Changing `divider_style` updates both lines.

## :material-horseshoe: Reuse a value

```yaml linenums="1"
constants:
  gauge_radius: 38

layout:
  horseshoes:
    - radius: ref(gauge_radius)
```

## :material-horseshoe: Combine constants with calculations

Constants can make calculated layouts easier to read:

```yaml linenums="1"
constants:
  center_x: 50
  spacing: 12

layout:
  circles:
    - xpos: calc(center_x - spacing)
      ypos: 50
      radius: 3

    - xpos: calc(center_x + spacing)
      ypos: 50
      radius: 3
```

See [Calculations with calc()](calculations-with-calc.md).

## :material-horseshoe: Related

- [Reuse](../reuse/reuse-introduction.md)
- [Card templates](../card-templates/card-templates-overview.md)
