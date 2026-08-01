# Layout Item Color-Stop Modes

## Goal

Use one consistent color-stop model for shapes, text, and entity layout items.

This plan concerns selecting one runtime color from `color_stops`. Actual SVG
gradients across an object remain covered separately by
`gradient-runtime-color-architecture.md`.

## Current Situation

The current implementation chooses both the color calculation and SVG paint
property differently per tool:

- states and TextTool use `fill`;
- names and areas use `stroke`;
- rectangles and arcs use `fill`;
- circles and lines use `stroke`;
- icons historically used `fill` and CSS `color`;
- `colorstop_gradient: true` enables color interpolation for ordinary layout
  items, despite its name suggesting a visible gradient across the item;
- sparklines use `colorstops_transition: hard|smooth`;
- horseshoes use their dedicated `show.horseshoe_style` modes.

The original `colorstop_gradient` field was introduced with the first generic
layout-item color-stop support and is present in stable releases from `v5.4.1`
through `v5.4.7`. It must therefore remain supported.

## User Model

Follow the SAK model. `show.style` selects the color mode, while a root
dictionary with the same name defines which SVG paint properties receive the
calculated runtime color:

```yaml
show:
  style: colorstopgradient

colorstop:
  fill: true
  stroke: false

colorstopgradient:
  fill: true
  stroke: true

color_stops:
  colors:
    0: green
    50: orange
    100: red
```

Supported modes:

| Mode | Result |
| --- | --- |
| `colorstop` | Selects the matching hard color stop for the current value. |
| `colorstopgradient` | Interpolates one color between the adjacent color stops. |

`colorstopgradient` still produces one runtime color for an ordinary layout
item. It does not draw a spatial gradient over the item itself.

`fill` and `stroke` are independent. Both may be enabled. A reusable template
can define both mode dictionaries up front and switch only `show.style`,
including through a JavaScript template.

## Compatibility And Defaults

Normalize all legacy and implicit forms in the configuration or constructor
layer before runtime rendering:

- `colorstop_gradient: false` maps to `show.style: colorstop`;
- `colorstop_gradient: true` maps to `show.style: colorstopgradient`;
- an explicit `show.style` takes precedence over `colorstop_gradient`;
- an item with `color_stops` but without either field uses `colorstop`;
- new documentation only presents the mode-based configuration;
- the stable `colorstop_gradient` alias remains accepted without a warning.

When the selected mode dictionary does not override `fill` or `stroke`, use
semantic defaults:

| Layout item | Default target |
| --- | --- |
| states, names, areas, texts | `fill` |
| icons | logical `fill` |
| rectangles and arcs | `fill` |
| circles and lines | `stroke` |

For icons, logical `fill` updates SVG `fill` and CSS `color` where the icon
renderer requires both properties. Correct names and areas from the current
accidental `stroke` behavior to normal text `fill`.

## Runtime Integration

- Keep `Colors.calculateStrokeColor()` as the shared hard/smooth runtime color
  calculation.
- Replace renderer-specific `applyColorStops(styles, property)` calls with one
  mode-driven application to `fill`, `stroke`, or both.
- Apply the same model to outer TextTool configuration and individual multipart
  text parts.
- Evaluate JavaScript-generated `show.style` and mode dictionaries through the
  existing source/active runtime-config lifecycle.
- Leave horseshoe-specific `show.horseshoe_style` and sparkline
  `colorstops_transition` behavior unchanged.
- Keep runtime colors available to the separate reusable SVG-gradient design,
  where `color: color_stop` means the final color selected by this mode.

## Documentation

Update the user documentation for color stops, visual shapes, entities, and
TextTool with:

- the two layout-item modes;
- independent `fill` and `stroke` examples;
- a filled circle and a rectangle using both paint properties;
- a template that defines both mode dictionaries and switches `show.style`;
- a clear distinction between an interpolated runtime color and an actual SVG
  gradient across an item.

Do not document implementation details or present `colorstop_gradient` as the
preferred syntax.

## Verification

Verify hard and smooth colors at, between, below, and above configured stops for:

- rectangle `fill`, `stroke`, and both;
- filled, outlined, and combined circles;
- lines and arcs;
- states, names, areas, TextTool, and multipart text;
- normal MDI icons and external SVG icons;
- JavaScript switching between preconfigured modes;
- card templates defining both mode dictionaries;
- legacy `colorstop_gradient` configurations from stable releases.

Run `npm run build` and confirm that horseshoe gradients, sparkline transitions,
and existing discrete color-stop configurations remain unchanged.
