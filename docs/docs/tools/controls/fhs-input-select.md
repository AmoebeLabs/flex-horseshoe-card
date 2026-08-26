---
template: main.html
title: FHS input select
description: Store one browser-local value chosen from a named list of options.
tags:
  - Controls
  - FHS inputs
  - Select
---

# FHS input select

Use `fhs_input_select` for a named choice such as a room, sensor, chart type, display style, or history period.

## :material-horseshoe: Add a select input

```yaml linenums="1"
entities:
  - entity: fhs_input_select.chart_type
    options:
      - line
      - area
      - bar
      - dots
    initial: line
    scope: card
```

Connect it to a select control:

```yaml linenums="1"
layout:
  controls:
    - id: chart-type
      type: select
      entity_index: 0
      xpos: 50
      ypos: 85
      width: 90
      height: 12
```

The visible options come directly from the input, so no `option_map` is needed unless you want different labels, icons, or segment content.

## :material-horseshoe: Use the selected value

A JavaScript template can use the state directly:

```yaml linenums="1"
chart_type: |
  [[[
    return entities[0].state;
  ]]]
```

## :material-horseshoe: Select an option with an action

```yaml linenums="1"
tap_action:
  action: perform-action
  perform_action: fhs_input_select.select_option
  target:
    entity_id: fhs_input_select.chart_type
  data:
    option: area
```

Quote YAML words such as `on`, `off`, `yes`, and `no` when they must remain option strings.

## :material-horseshoe: Related

- [Select control](select-tool.md)
- [JavaScript templates](../../dynamic/javascript-templates.md)
- [Browser-local inputs](browser-local-inputs.md)
