# String Color Stops

## Goal

Allow one reusable color-stop definition to describe state-based colors for
horseshoes, shapes, icons, lines, text, and other tools. The same definition
should work for numeric entity values and Home Assistant states such as `on`,
`off`, `low`, or `very_high`.

## Two Color-Stop Semantics

Numeric color stops keep their current value-based behavior:

```yaml
color_stops:
  colors:
    - value: 0
      color: blue
    - value: 10
      color: green
```

String color stops use exact state matching:

```yaml
color_stops:
  colors:
    - state: "off"
      rank: 0
      color: var(--secondary-text-color)
    - state: "on"
      rank: 1
      color: var(--state-icon-color)
```

The entry shape determines the semantics. A `value` entry uses numeric
comparison, interpolation, and ranges. A `state` entry uses an exact string
comparison. No separate `mode: numeric|string` is required.

Home Assistant entity states are received as strings. A state color stop must
therefore compare values as strings:

```js
String(entity.state) === String(stop.state);
```

This means `off` is matched as `off`, and a state such as `"1"` remains a
string when configured with `state`. It is never treated as a numeric range in
the string form.

## Horseshoe Behavior

For `stringstate_mode`, the string color-stop list becomes the single source
of truth for:

- state matching;
- state order and segment position through `rank` or list order;
- state color;
- optional per-state paint styles.

The user no longer needs to configure a second horseshoe `state_map`. At the
configuration boundary Flexible Horseshoe Card translates the public state order or rank into the
existing numeric runtime state-map contract, so downstream geometry and
rendering receive exactly the same shape as before.

The existing `horseshoe_labels` configuration remains responsible for label
presentation. It can keep state-specific label overrides and label styles,
but it does not define state values or colors.

## Shared Tool Behavior

The color resolver should return the complete active color-stop entry rather
than only a color. This allows the same state definition to provide optional
styles to every supported tool:

```yaml
- state: high
  rank: 2
  color: orange
  styles:
    opacity: 0.85
```

This would remove the current need for separate state-driven color handling in
icons and shapes. A fixed icon can change color from an `on`/`off` entity
without a state map. A state map or animation remains useful when the icon or
other visual content itself must change, not only its paint color.

## Responsibility Boundaries

The shared implementation should be split along the existing tool boundaries:

- `BaseTool` normalizes layout-item color stops and applies the selected color
  and optional stop styles to the tool paint properties.
- `ColorStops` or the shared entity resolver determines whether a stop uses
  numeric value logic or exact string-state matching.
- Shapes, icons, lines, rectangles, and text reuse this shared paint path.
- The horseshoe state layer translates string states and their ranks into the
  existing numeric runtime contract; horseshoe geometry remains unchanged.

This keeps state-based coloring consistent across tools without copying state
comparison or style-application logic into each shape renderer.

## Backward Compatibility

This is a development-stage redesign. Numeric `value` color stops remain
supported. The horseshoe string-state path can move from the current numeric
`state_map` arrangement to string color stops directly. General state-map
features used for non-color behavior, such as icon selection or label-specific
overrides, remain separate until their responsibilities are explicitly
replaced.

## Implementation Areas

1. Extend `ColorStops.normalize()` to preserve `state`, `rank`, and optional
   per-stop styles alongside numeric entries.
2. Update the shared entity color resolver to select numeric entries with
   numeric logic and string entries with exact equality.
3. Let horseshoe string-state geometry derive its internal state positions from
   the normalized string color stops.
4. Apply the complete active stop, including optional styles, through the
   shared tool paint path.
5. Add tests for `on`/`off`, arbitrary named states, numeric-looking strings,
   rank ordering, missing matches, and reuse by shapes and icons.

## Paint Style Resolution

A matching color stop may carry a styles block. The shared paint path applies
that block together with the resolved stop color, so the same state definition
can control opacity, stroke width, or an animation-related SVG style for icons,
shapes, lines, text, and other tools. Label text and label-specific presentation
remain owned by the label configuration.

Numeric stops retain numeric edge behavior: the color is calculated by the
selected color-stop mode, while the active source stop supplies any associated
styles. A missing exact string-state match produces no color-stop result; it
does not invent a fallback state.

## Verification Matrix

The regression tests cover:

- ordered string states with and without rank;
- exact matching of on, off, named states, and numeric-looking strings;
- complete active-stop preservation, including styles;
- numeric color-stop selection below, inside, and above the configured range;
- horseshoe string-state geometry derived from the color-stop order;
- existing numeric color-stop interpolation and attribute-based entity values.

This keeps color selection, paint styles, and horseshoe geometry testable at
their existing domain boundaries.
