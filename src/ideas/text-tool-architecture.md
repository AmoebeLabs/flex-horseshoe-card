# Text Tool Architecture

## Purpose

The `layout.texts` section adds standalone headings, button labels and composed
SVG text. A text item does not require an entity and can contain multiple
independently styled parts on one or more lines.

TextTool renders literal or JavaScript-generated parts and can compose the
standard text parts delivered by existing `names`, `areas`, and `states`
items.

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

## Text overflow and wrapping

TextTool also accepts a structured overflow configuration:

```yaml
text_overflow:
  mode: wrap
  wrap:
    characters: 40
    max_lines: 3
    dy: 1.4
```

Wrapping is deliberately limited to TextTool because its multipart renderer
already produces independent SVG tspans. NameTool, AreaTool, StateTool and
horseshoe labels retain their existing single-line behavior.

Wrapping uses spaces as break points and never divides a word. Each generated
fragment remains a normal text part and therefore retains its styles, color
stops, source reference and animation id. The first line keeps the configured
`ypos`; every automatic continuation resets to the text xpos and moves down by
`dy`. The complete block is not vertically re-centered when lines are added.

When `max_lines` is configured, the final available line reserves three
characters for `...` when content remains. Without `max_lines`, all text
is shown over as many lines as needed. `mode: ellipsis` provides the structured
equivalent of the existing numeric `ellipsis` setting, which remains supported
for existing configurations. Each mode owns its settings in a matching
`wrap`, `ellipsis`, or `fit` dictionary, allowing every dictionary to remain
configured while a JavaScript template changes only `mode`.

Fit mode is the third exclusive overflow strategy:

```yaml
text_overflow:
  mode: fit
  fit:
    max_width: 40
    min_font_size: 0.7em
```

After rendering, TextTool measures its unscaled bounding box and calculates one
uniform reduction from the widest line. The transform uses the first-line xpos
and ypos as its origin, preserving that anchor while scaling every line, part,
relative font size, and line offset together. Fit never enlarges, wraps, or
truncates text. An optional `min_font_size` in em limits the reduction; if the
minimum is reached, the rendered text may remain wider than `max_width`.

The calculated fit is retained between updates. A content, style, or width
change requests one correction render only when the required fit changes. The
published TextTool geometry includes the fit transform, allowing rectangle
`fit` to follow the final width, height, and center on that correction render.

### Shared width measurement

Both `wrap` and `ellipsis` may use `max_width` instead of `characters`:

```yaml
text_overflow:
  mode: wrap
  wrap:
    max_width: 40
    max_lines: 3
    dy: 1.4
```

```yaml
text_overflow:
  mode: ellipsis
  ellipsis:
    max_width: 40
```

Exactly one of `characters` and `max_width` is configured for the selected
mode. Character mode performs its layout before rendering. Width mode renders
one invisible measurement copy containing the same word, whitespace, source,
style, color, and animation parts as the visible text. SVG text APIs provide
the actual width of every fragment and of `...` in the style of each part.

One shared measurement signature contains the source parts, active overflow
configuration, and measured fragment widths. A changed signature calculates
one new result and requests one correction render. An unchanged signature does
not request another render. This prevents the measured output from becoming
input to its own next calculation and avoids the fit-style render loop.

Width-based wrap adds complete measured words to a line until the next word no
longer fits. Explicit `new_line` remains a hard boundary, words are never split,
and the first automatically generated line starts below the unchanged first
line by `dy`. If `max_lines` is reached, the shared width ellipsis calculation
finishes the final line.

Width-based ellipsis processes every explicit visual line independently. It
keeps complete parts while they fit, uses SVG substring measurement inside the
crossing part, reserves the measured width of `...` in that part's own style,
and omits all later content on the line. Generated fragments retain their
source references, styles, color stops, and animation ids.

The invisible measurement copy remains available after the correction render.
A dynamic text, font, source style, or animation change therefore invalidates
the measured signature and recalculates the visible result. Rectangle `fit`
continues to consume only the final visible TextTool geometry.

## Interaction

Standalone text defaults to action `none` and `pointer-events: none`. It does
not block a rectangle button underneath it. A non-`none` item-level tap, hold
or double-tap action enables pointer interaction for the complete text item.
Actions are not assigned to individual parts.

## Referenced parts

Compound parts identify both the source type and the source item id:

```yaml
text:
  - type: name
    id: room-name
  - value: ": "
  - type: state
    id: room-temperature
```

The `id` refers to an item inside `layout.names`, `layout.areas` or
`layout.states`. NameTool and AreaTool each deliver one standard part.
StateTool delivers a value part and, when enabled, a UOM part. Their standalone
renderers and TextTool therefore use the same formatted content and style
construction.

Referenced parts use source styles, color stops, and active animations by
default. `source_styles: false` keeps the source content and UOM structure but
uses TextTool presentation. Explicit part styles override source presentation;
explicit `uom.styles` override the derived UOM styles.

Source coordinates, groups, actions, visibility, clips, masks, and outer
alignment are not copied into the composed text. A hidden source remains fully
usable. A disabled source has no tool instance and is rejected as an unknown
reference during TextTool construction.

All entity text tools complete runtime configuration and state formatting
before Lit rendering. TextTool can therefore consume current source parts
independently of final `zpos`. Source parts are read again during render so an
animation activated in the current update cycle is included without delaying
the displayed text by one frame.

A source item that should not appear separately can use `visibility: hidden`.
It remains fully active for state updates, formatting, colors and measurement,
while only the composed TextTool output is visible. `disabled: true` cannot be
used for a source because a disabled item has no runtime tool instance.

FHS icons remain separate layout items. SVG `<tspan>` cannot contain an FHS
icon path, image, injected SVG or `ha-icon`; mixed icon/text content would need
a separate layout and measurement engine. Icons and text can already be placed
together through a shared group.
