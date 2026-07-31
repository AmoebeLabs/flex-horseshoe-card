# Text Tool Architecture

## Purpose

The `layout.texts` section adds standalone headings, button labels and composed
SVG text. A text item does not require an entity and can contain multiple
independently styled parts on one or more lines.

Version 1 renders literal or JavaScript-generated text parts. The part model is
already prepared for future references to existing `names`, `areas` and
`states` items.

## Configuration shape

A scalar is shorthand for one text part:

```yaml
layout:
  texts:
    - id: title
      text: History
      xpos: 50
      ypos: 15
```

The multipart form uses a list:

```yaml
layout:
  texts:
    - id: history-selection
      xpos: 50
      ypos: 50
      styles:
        text-anchor: middle
        dominant-baseline: middle
      ellipsis: 20
      text:
        - value: History
          styles:
            fill: var(--secondary-text-color)
        - value: 7 days
          entity_index: 0
          new_line: true
          dy: 1.2
          animation_id: selected-duration
          styles:
            fill: var(--primary-text-color)
            font-weight: bold
```

The default part `type` is `text`. Writing `type: text` explicitly is optional.
Each part can define its own `entity_index`, JavaScript templates, `state_map`,
`color_stops`, `styles`, `animation_id`, `dx`, `dy` and `new_line`.

## SVG layout and styles

One outer SVG `<text>` owns the item position, transforms, actions and common
styles. Every part renders as a consecutive `<tspan>`:

- parts without `new_line` continue after the preceding part;
- `new_line: true` resets x to the text-item position and moves by `dy`;
- a new line defaults to `dy: 1.2` em;
- item styles are inherited by every part;
- part styles override the inherited styles for that part;
- `text-anchor` and `dominant-baseline` are normal SVG styles on the outer text
  item and therefore control the composed result.

The complete outer `<text>` bounding box is measured. Rectangle `fit` and
dimension references can therefore use `section: texts` with inline,
multiline and differently styled content.

## Runtime state, colors and animations

A text item defaults to no entity. Every part is evaluated separately with its
own effective `entity_index`, inherited from the outer text item when omitted.
This gives JavaScript templates, state maps and color stops the correct state
context.

A matching `state_map` entry may override the complete active part, including
its value, styles, color stops, positioning and animation id. Root styles are
applied first, followed by part styles, the part color-stop result and finally
styles from `animations.texts[animation_id]`.

The same animation bucket supports both complete text items and individual
parts. A part only looks up its `animation_id` and merges the resulting styles;
it does not become a separate tool instance.

## Ellipsis

SVG tspans do not provide usable CSS text overflow. FHS applies ellipsis before
rendering:

- item-level `ellipsis` is a character limit per visual line;
- every `new_line` part starts a new line budget;
- all part values on one line count toward the same limit;
- the part crossing the limit is shortened and receives `...`;
- later parts on that line are omitted;
- the next line starts with a fresh budget;
- an optional part-level `ellipsis` is applied before the line-level limit.

The part that receives `...` keeps its own styles, colors and animation.
Geometry measurement uses the final shortened text.

## Interaction

Standalone text defaults to action `none` and `pointer-events: none`. It does
not block a rectangle button underneath it. A non-`none` item-level tap, hold
or double-tap action enables pointer interaction for the complete text item.
Actions are not assigned to individual parts.

## Future referenced parts

Future compound parts identify both the source type and the source item id:

```yaml
text:
  - type: name
    id: room-name
  - value: ": "
  - type: state
    id: room-temperature
```

The `id` refers to an item inside `layout.names`, `layout.areas` or
`layout.states`. Before enabling these types, their content and UOM formatting
must move into shared entity-text resolvers used by both the existing tools and
TextTool. Source coordinates, actions and outer alignment are not copied into
the composed text.

A source item that should not appear separately can use `visibility: hidden`.
It remains fully active for state updates, formatting, colors and measurement,
while only the composed TextTool output is visible. `disabled: true` cannot be
used for a source because a disabled item has no runtime tool instance.

FHS icons remain separate layout items. SVG `<tspan>` cannot contain an FHS
icon path, image, injected SVG or `ha-icon`; mixed icon/text content would need
a separate layout and measurement engine. Icons and text can already be placed
together through a shared group.
