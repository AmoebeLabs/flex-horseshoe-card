# Compound Layout Items

## Goal

Large cards often define several layout items that together form one visual
control, such as a rectangle and text label for a button. Keeping those items
in separate `rectangles`, `texts`, and `icons` sections makes the relationship
hard to see and makes repeated controls cumbersome to maintain.

`layout.compounds` keeps related configuration together without introducing a
new rendered tool. A compound is expanded into the existing layout sections
during configuration processing. Groups, tools, rendering, actions and entity
updates continue to work exactly as they do for manually declared items.

## Configuration

```yaml
layout:
  compounds:
    - id: room-buttons
      group: room
      entity_index: 0

      rectangles:
        - id: livingroom--value-1
          xpos: 18
          ypos: 50
          width: 30
          height: 9
          radius: 2

      texts:
        - id: livingroom--value-1
          text: Livingroom
          xpos: 18
          ypos: 50
```

Properties on the compound are defaults for every child. A child may override
any inherited property. Positions are normal defaults and are not offsets; use
a group when several tools need a shared runtime position or visibility.

The generated children retain their normal tool types and receive namespaced
ids:

```text
room-buttons--livingroom--value-1
```

IDs only need to be unique within their target section. A rectangle and text
may therefore use the same local id.

## References

References inside the same compound may use a local child id. FHS adds the
compound id when the referenced child exists in the indicated section:

```yaml
rectangles:
  - id: background
    fit:
      section: texts
      item_id: livingroom--value-1
```

Normal layout sections use the complete generated id:

```yaml
rectangles:
  - id: external-background
    fit:
      section: texts
      item_id: room-buttons--livingroom--value-1
```

Local rewriting applies to `same_as`, `fit.item_id`, referenced `width` and
`height`, and TextTool references to a `name`, `area`, or `state`. Group,
animation, clip and mask names remain global and are never rewritten.

## Reuse

A compound may use `same_as` to inherit a previously declared compound. Child
lists are matched by section and local id, so one child can be overridden
without repeating all siblings. New children are appended. Compound-level and
matching child overrides support `same_as_replace` and `same_as_d...` using the
same rules as normal layout reuse.

Child-level `same_as` remains available. A short id references an earlier child
in the same compound section; a complete id can reference an earlier normal or
generated item in that section.

## Processing

1. Card templates are compiled and item ids are assigned.
2. Static `ref()` and `calc()` values are resolved.
3. Compound inheritance is compiled.
4. Shared defaults are applied and local ids and references are namespaced.
5. Generated children are appended to their normal layout sections.
6. `layout.compounds` is removed.
7. Existing `same_as`, disabled filtering, JavaScript detection, entity
   resolution and tool construction continue unchanged.

Generated ids that collide with an existing id in the same target section are
reported as configuration errors.
