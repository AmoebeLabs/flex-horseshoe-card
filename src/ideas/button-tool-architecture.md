# ButtonTool and Controls Architecture

## Goal

FHS controls provide reusable interactive buttons without requiring a rectangle,
text and icon item for every control. The first control is a standalone
`ControlTool` in `layout.controls`; it is not a compound and does not replace
existing layout sections.

## Modes

A control uses `type: button`, `toggle`, `select`, `number` and `slider`.

- `button` uses the existing tap default for its entity.
- `toggle` uses Home Assistant or FHS boolean toggle behavior.
- `select` maps the active `states[].value` to `input_select.select_option`
  or `fhs_input_number.set_value`.
- `number` renders minus, value and plus content and uses the existing
  input_number increment/decrement services.
- `slider` renders a single-value or dual-range control with a linear or
  circular visualization and performs `set_value` actions while dragging or
  when the interaction finishes.

FHS needs to be extended with a fhs_input_select service!

Explicit item, entity and card actions keep their existing precedence over mode
defaults.

## Rendering

ControlTool owns the background, track, indicator, content and optional label.
The shared `viz` configuration can be overridden per mode, so toggle, select
and number controls do not inherit an inappropriate visual shape.

Content supports icon, text, icon plus text horizontally or vertically, and
separate number-control content for minus, value and plus. Text content is
rendered through the existing TextTool pipeline, including fit, ellipsis, wrap,
styles, animation styles and text measurement.

Select indicators use the state-list index and animate their SVG translation.
Toggle indicators use the current on/off state. Number controls use the existing
FHS entity settings for min, max and step.

## Integration

`controls` is a normal visible layout section. It participates in entity
resolution, slots, groups, compounds, visibility, z-position sorting, runtime
JavaScript updates, animations and the common action handler. Existing cards do
not need to change and existing rectangle/text button configurations remain
supported.

## Styling contract and documentation

The public documentation must contain a dedicated Controls reference. It must
show the complete configuration hierarchy instead of listing isolated CSS
properties. Every example must use the same configuration merge order as the
runtime: control defaults, selected `item_viz`, and finally the item config.

The reference needs a styling matrix for the common control layers and the
mode-specific layers:

- common: geometry, orientation, label, content, icon, text, actions, haptics,
  animation, visibility and disabled state;
- toggle: track, thumb, on/off state styles and the `ha`, `ios` and
  `industrial` visualizations;
- select: background, segments, separator, button or line indicator,
  selected/unselected content and indicator animation;
- number: minus button, value, plus button, horizontal/vertical orientation,
  text/icon content and press feedback;
- button: background, button or line visualization, active/inactive content,
  press feedback and tap/hold/double-tap actions;
- slider: background track, active track, thumb, value text, single/range,
  linear/circular geometry, transition, update mode and unavailable state.

The slider examples must include a Home Assistant light. Its `brightness`
attribute drives the value and `light.turn_on` receives the changed value. The
default active-track color must visibly follow the current HA entity color via
`Colors.computeColor(entity)` and `--fhs-slider-active-color`. A second example
must override `ha.active.styles.fill`, so users can see that explicit item
styling takes precedence over the automatic light color.

The examples must also include a dual HVAC range slider, a select with dynamic
`option_map`, a number control using increment/decrement, and toggle/button
examples with labels, icons and haptic actions. Each example must be complete
YAML that can be copied into a card or template without reconstructing omitted
configuration.

## YAML config.

```yaml
controls:
  - type: toggle
    xpos: 50
    ypos: 50
    toggle:
      orientation: horizontal # vertical --> use rotate? Or switch x,y due to icon
      track:
        width: 16
        height: 7
        radius: 3.5 # height / 2 for nice round pill
      thumb:
        width: 9
        height: 9
        radius: 4.5 # height / 2 for nice round pill
        offset: 4.5 # default position in middle: meaning NO data
      content:
        mode: content_icon # or content_none
        content_icon:
          icon:
            # whatever an icon needs under this part to apply to default icon config
            # icon itself. state map. whatever is needed.
      animation: # local, or inserted into animations section with animation_id and so?
        duration: 250
        easing: ease-out
        on:
          track:
            styles:
              fill: 'var(--switch-checked-track-color)'
              pointer-events: auto
          thumb:
            fill: 'var(--switch-checked-button-color)'
            transform: 'translateX(4.5em)' # must be calculated in config
            pointer-events: auto

        off:
          styles:
            track:
              fill: 'var(--switch-checked-track-color)'
              pointer-events: auto
            thumb:
              fill: 'var(--switch-checked-button-color)'
              transform: 'translateX(4.5em)' # must be calculated in config
              pointer-events: auto

  - type: select
    xpos: 50
    ypos: 50
    select:
      orientation: horizontal # vertical
      background:
        width: 34
        height: 11
        radius: 5
      track: # Track is invisible. Is for calculating segments per select item
        width: 32
        height: 10
      # In HA you can:
      # - input_select.set_options to set the options below into the entity
      # - input_select.select_option to select the option (clicked)
      option_map:
        - value: 'off'
          icon: mdi:fan-off
          text: 'Off'
        - value: low
          icon: mdi:fan-speed-1
          text: Low
        - value: medium
          icon: mdi:fan-speed-2
          text: Medium
        - value: high
          icon: mdi:fan-speed-3
          text: High
      content:
        mode: content_horizontal
        content_horizontal:
          padding: 1
          gap: 5 # between icon and text
          icon:
            # whatever an icon needs under this part to apply to default icon config
            # icon itself. state map. whatever is needed.
            # xpos and ypos are calculated based on mode
          text:
            text_overflow:
              mode: fit
              fit:
                max_width: 15
      show:
        item_viz: viz_button # possibly later viz_line, viz_dot
      viz_button:
        selected:
          icon:
            styles:
              fill: ...
          text:
            styles:
              fill: ...
        unselected:
          icon:
            styles:
              fill: ...
          text:
            styles:
              fill: ...
        background:
        track:
        indicator:
          padding: 2 # space between calculated height/width and actual size
          radius: 2
          styles:
            fill: 'var(--switch-checked-track-color)'
        animation:
          duration: 250 # for all. select/unselect/indicator. so all change the same speed
          easing: ease-out

  - type: number
    xpos: 50
    ypos: 50
    height: 10
    width: 30
    number:
      orientation: horizontal
      background:
      content:
        mode: content_horizontal
        content_horizontal:
          minus:
            mode: content_text # content_icon
            content_text:
              text: '-'
            content_icon:
              icon:
                icon: mdi-arrow-down
                icon_size: 1

          value:
            text_overflow:
              mode: fit
              fit:
                max_width: 15
          plus:
            mode: content_text # content_icon
            content_text:
              text: '+'
            content_icon:
              icon:
                icon: mdi-arrow-up
                icon_size: 1

  - type: button
    xpos: 50
    ypos: 50
    width: 20
    height: 10
    button:
      orientation: horizontal
      background:
        styles:
      content:
        mode: content_horizontal
        content_horizontal:
          icon:
            # whatever an icon needs under this part to apply to default icon config
            # icon itself. state map. whatever is needed.
          text:
            text_overflow:
              mode: fit
              fit:
                max_width: auto # calculates number that fits into space. padding, icon...
      show:
        button_viz: viz_button #viz_line viz_dot
```
