# Layout Visibility and Disabled Items

## Purpose

Layout items and groups need two different ways to remove visual content:

- `visibility: hidden` keeps a tool active but makes it invisible;
- `disabled: true` removes an unused layout item during configuration.

The distinction lets runtime controls show and hide complete parts of a card,
while card templates can avoid constructing tools that are not used at all.

## Visibility

`visibility` accepts `visible` or `hidden` and defaults to `visible`. It is a
normal runtime config field and may contain a JavaScript template.

A hidden tool:

- keeps receiving entity and Home Assistant updates;
- keeps evaluating templates, state maps, color stops and animations;
- remains available for geometry measurement and rectangle `fit`;
- remains available as a future TextTool `state`, `name` or `area` source;
- keeps fetching and processing history when it is a sparkline;
- remains in the SVG for `getBBox()`, but is invisible and receives no pointer
  interaction.

### Group cascade

Groups support the same visibility field. An item is visible only when its own
visibility and the visibility of every group in its parent chain are `visible`.
A child group or item cannot override a hidden ancestor.

Groups already evaluate their runtime config before tools. A group visibility
change therefore reaches every descendant in the same card update cycle.

### Dashboard tabs

A local FHS input or Home Assistant helper can select one visible group:

```yaml
entities:
  - entity: fhs_input_number.active_tab
    initial: 1

layout:
  groups:
    - id: tab-overview
      xpos: 50
      ypos: 50
      visibility: |
        [[[
          return Number(entities[0].state) === 1 ? 'visible' : 'hidden';
        ]]]

    - id: tab-history
      xpos: 50
      ypos: 50
      visibility: |
        [[[
          return Number(entities[0].state) === 2 ? 'visible' : 'hidden';
        ]]]

    - id: tab-details
      xpos: 50
      ypos: 50
      visibility: |
        [[[
          return Number(entities[0].state) === 3 ? 'visible' : 'hidden';
        ]]]
```

Rectangle actions can change the input and TextTools can label the controls.
The items assigned to the selected group appear together, while the hidden
groups remain current in the background.

Other applications include conditional detail panels, warning groups,
switching between sparkline presentations and compact or expanded layouts.

## Disabled items

`disabled` is a configuration-time boolean. It is intended for card and view
templates and does not change during runtime updates.

For layout items, configuration processing must resolve IDs, `same_as`, static
refs and `calc()` before filtering disabled items. For entities, template and
constant values are resolved first, then disabled entities are removed before
slots and flat entity indices are built.

A disabled layout item or entity is completely absent from the active card
configuration. It receives no lifecycle updates, history fetches, animations,
SVG output or runtime references. Entity slots are compacted after disabled
entities are removed.

Entity disabled templates may use finalized constants and must resolve to a
boolean or numeric/string 0/1. This makes template-controlled entity lists possible without turning
entity structure into a runtime state change:

~~~yaml
constants:
  rooms:
    - livingroom
    - study
  bedroom_disabled: |
    [[[ return constants.rooms.length < 3; ]]]

entities:
  - entity: sensor.livingroom_temperature
    slot: room_sensors
  - entity: sensor.study_temperature
  - entity: sensor.bedroom_temperature
    disabled: ref(bedroom_disabled)
~~~

`disabled: false` keeps the item or entity active. A disabled base definition
can therefore still be reused when a copy explicitly sets `disabled: false`.
`disabled` applies to layout items and entities, not groups or the complete
card. References to an item or entity that remains disabled are invalid.

## TextTool sources

Future compound TextTool parts can use invisible state, name and area tools as
fully active content sources:

```yaml
states:
  - id: room-temperature
    entity_index: 0
    visibility: hidden

texts:
  - id: summary
    text:
      - value: 'Temperature: '
      - type: state
        id: room-temperature
```

The source keeps its formatting, entity context, state map, color stops and
styles. Its coordinates, actions and visibility are not copied into TextTool.
This source-reference syntax remains part of the future TextTool compound
content work; visibility itself does not depend on that work.

## Tests

- Existing cards without either field render unchanged.
- Static and JavaScript item visibility work for every layout tool.
- Group visibility hides all direct and nested descendants.
- Hidden items remain measurable and do not receive pointer actions.
- Hidden sparklines continue processing history.
- Disabled items are absent before entity resolution and construction.
- A disabled `same_as` base can produce an enabled copy.
- Chromium and Safari return usable geometry for hidden SVG text.

