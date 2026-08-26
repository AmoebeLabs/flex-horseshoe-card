---
template: main.html
title: Browser-local inputs
description: Store card-specific boolean, select, and numeric values directly in Flexible Horseshoe Card.
tags:
  - Controls
  - FHS inputs
---

# Browser-local inputs

Browser-local inputs store values that control how FHS cards look or behave. Use them for choices such as a chart type, visible layer, selected room, history period, or scale value.

These inputs belong to the current browser. Choose a Home Assistant helper instead when automations, other dashboards, or other devices must share the value.

## :material-horseshoe: Choose an input

| Input | Stores | Common control |
| --- | --- | --- |
| [`fhs_input_boolean`](fhs-input-boolean.md) | `on` or `off` | Toggle |
| [`fhs_input_select`](fhs-input-select.md) | One value from a named option list | Select |
| [`fhs_input_number`](fhs-input-number.md) | A number within a configured range | Number or slider |

Define an FHS input in the card `entities` list and connect a control through `entity_index`.

## :material-horseshoe: Keep or share the value

| Setting | Use |
| --- | --- |
| `scope: card` | Gives each card instance its own value. |
| `scope: global` | Shares the value between FHS cards in the current browser. |
| `persist: true` | Restores a global value after reloading the page. |

Every card that uses a shared input includes that input in its own `entities` list.

## :material-horseshoe: Related

- [Interactive controls](controls-overview.md)
- [JavaScript templates](../../dynamic/javascript-templates.md)
- [Entities](../../card-basics/entities.md)
