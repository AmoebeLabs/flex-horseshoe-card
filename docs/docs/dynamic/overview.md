---
template: main.html
title: Dynamic configuration
description: Reuse values, calculate layout dimensions, and respond to entity states in Flexible Horseshoe Card YAML.
tags:
  - Dynamic configuration
  - Templates
---

# Dynamic configuration

Most cards can start with normal YAML. Use dynamic configuration when several settings should share one value, positions should be calculated, or the card should respond to changing entity states.

## :material-horseshoe: Choose the simplest option

| You want to | Use |
| --- | --- |
| Reuse a fixed value or configuration block | `constants` and `ref()` |
| Calculate a position, size, or spacing value | `calc()` |
| Change a value when an entity changes | [JavaScript templates](javascript-templates.md) |
| Reuse a complete tool definition | [`same_as`](../reuse/reuse-introduction.md) |
| Reuse a complete card design | [Card templates](../card-templates/card-templates-overview.md) |

Start with normal YAML and add only the feature needed for the result.
