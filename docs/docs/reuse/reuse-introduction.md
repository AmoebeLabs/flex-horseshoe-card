---
template: main.html
title: Reuse
description: Reduce repeated Flexible Horseshoe Card YAML with same_as, constants, ref(), calc(), and card templates.
tags:
  - Reuse
  - YAML
---

# Reuse

Reuse keeps repeated card layouts short and makes shared changes easier.

## :material-horseshoe: Choose a reuse feature

| Repetition | Use |
| --- | --- |
| Another tool is mostly the same | [`same_as`](reuse-with-same_as.md) |
| Several fields use one fixed value or block | [`constants` and `ref()`](../dynamic/constants-and-ref.md) |
| Positions or sizes follow a calculation | [`calc()`](../dynamic/calculations-with-calc.md) |
| Several cards share one design | [Card templates](../card-templates/card-templates-overview.md) |

## :material-horseshoe: Reuse a tool

```yaml linenums="1"
layout:
  circles:
    - id: left-status
      xpos: 35
      ypos: 50
      radius: 4
      styles:
        fill: var(--primary-color)

    - id: right-status
      same_as: left-status
      xpos: 65
```

The second circle keeps the first circle's size and styles while choosing its own position.

## :material-horseshoe: Reuse a shared style

```yaml linenums="1"
constants:
  status_style:
    fill: var(--primary-color)
    stroke: var(--divider-color)
    stroke-width: 1

layout:
  circles:
    - xpos: 35
      ypos: 50
      radius: 4
      styles: ref(status_style)

    - xpos: 65
      ypos: 50
      radius: 4
      styles: ref(status_style)
```

## :material-horseshoe: Related

- [Reusing items with same_as](reuse-with-same_as.md)
- [Constants and ref()](../dynamic/constants-and-ref.md)
- [Calculations with calc()](../dynamic/calculations-with-calc.md)
- [Card templates](../card-templates/card-templates-overview.md)
