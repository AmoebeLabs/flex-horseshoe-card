---
template: main.html
title: Local input entities
description: Create boolean, number, and select values that exist only in Flexible Horseshoe Card, not in Home Assistant.
tags:
  - Controls
  - Flexible Horseshoe Card inputs
---
# Local input entities

Local input entities are values created and owned by the card. They are **not Home Assistant entities**: they are not added to Home Assistant's state machine and do not become helpers that automations, integrations, or other Home Assistant features can use.

The card can read local inputs like entity states and controls can change them. `scope` determines whether the value belongs to one card or can be shared by cards in the same Home Assistant client. A Home Assistant client can be a browser or the Companion App; the value still remains local to that client/device rather than being stored as a Home Assistant entity.

!!! info "The main purpose of these local input entities is there use with controls so you can make the card interactive."
    The interactive [Awair card](../../examples/demo-cards/demo-card-awair-many.md) is such an example of the possibilities with local controls

This page explains the three local input types, the required entity ID prefixes, their scope, and optional persistence.

## :material-horseshoe: Choose an input

A local input entity must use one of these three domains:

- `fhs_input_boolean.<name>` for an on/off value;
- `fhs_input_number.<name>` for a numeric value;
- `fhs_input_select.<name>` for one value from a list.

Define it in the normal `entities:` list, then choose the type that matches the value the card needs to remember.

| You need... | Input |
| --- | --- |
| On/off value | [Local input boolean](fhs-input-boolean.md) |
| Number with min/max/step | [Local input number](fhs-input-number.md) |
| One choice from a list | [Local input select](fhs-input-select.md) |

Examples include showing/hiding labels, choosing a chart type, or changing a local history duration.

## :material-horseshoe: Keep the value in one card

Use `scope: card` when every card should have its own value:

```yaml linenums="1"
entities:
  - entity: fhs_input_boolean.show_labels  # Create or use this local input
    initial: true  # Value used when this local input is created
    scope: card  # Keep this value inside this card
```

## :material-horseshoe: Share the value between cards

Use `scope: global` when several cards in the same Home Assistant client should use the same local value. The value is still not created in Home Assistant itself.

## :material-horseshoe: Keep the value after reloading

Use `persist: true` together with `scope: global` when this Home Assistant client should restore the value after a reload or reopen.

Persistence is local to that client/device. Another browser, app installation, or device keeps its own value.

## :material-horseshoe: Related

- [Interactive controls](controls-overview.md)
- [JavaScript templates](../../dynamic/javascript-templates.md)
- [Visibility](../../interaction/visibility.md)
