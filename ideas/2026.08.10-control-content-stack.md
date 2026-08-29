# Control Content Stack Architecture

## Status

Implemented after commit `94284da`. This document defines the public model, implementation boundaries, and completed implementation sequence. It intentionally avoids a global anchor, grid, or cross-tool positioning system.

## Motivation

Controls currently place icon and text with control-specific geometry. Additional visual context, such as the permanent Awair status lines, must be configured as separate layout tools with manually calculated positions. That creates duplicated geometry and brittle alignment.

The visual item belongs to the button or select segment that presents it. It should therefore inherit that parent's position, available space, entity context, selected state, and press animation.

## Ownership Model

```text
button
└── content
    ├── icon
    ├── state
    └── line/circle/horseshoe/sparkline

select
└── option/segment
    ├── icon
    ├── state
    └── line/circle/horseshoe/sparkline
```

A select has two intentionally separate entity contexts:

- `select.entity_index` controls which option is selected and receives the select action.
- `option_map[].entity_index` provides the visual state for that segment.

Every visual content item inherits `option_map[].entity_index`. An item may explicitly override `entity_index` for exceptional cases. A button's content items inherit the button entity in the same way.

## Public Configuration

Existing icon/text content remains supported. The explicit `items` list is opt-in.

```yaml
content:
  mode: content_vertical
  content_vertical:
    padding:
      x: 0.5
      y: 1
    gap: 0.5
    items:
      - id: icon
        type: icon
        size: 40

      - id: value
        type: state

      - id: status
        type: line
        length: 3.5
        margin:
          top: 0.5

option_map:
  - value: 0
    entity_index: room_sensors[0]
    content:
      status:
        show:
          item_style: colorstopinterpolated
        color_stops:
          template:
            name: fhs_colorstops_awair_score
```

The shared item definitions determine layout and default visual configuration. `option_map[].content` contains option-specific overrides keyed by item id. The inherited segment entity means icon, state, and line do not repeat the same `entity_index`.

## Layout Semantics

- `content.padding` reserves space at the outer edge of the segment or button.
- `content.gap` inserts the same distance between adjacent items.
- Explicit items receive equal cells on the configured horizontal or vertical main axis.
- `margin.top/right/bottom/left` refines one item's position within its cell.
- Every tool is centered at `50,50` inside its own cell; the stack translates that local center to final card coordinates.
- Users position items through container padding, gap, and item margin rather than `xpos` or `ypos`.
- Numeric and `x`/`y` margin shorthands are normalized at the configuration boundary.
- Margins do not collapse; adjacent margins and the container gap are additive.
- Margin affects layout. It is not a visual transform or offset.
- Tool-specific dimensions such as line length, circle radius, horseshoe radius, and sparkline width/height remain explicit.
- No post-render measurement or second layout pass is introduced.

The legacy icon/text shorthand keeps its current geometry so existing controls do not move. Only explicit `items` use the equal-cell stack.

## Supported Visual Items

Initial supported types:

- `icon`
- `text`, including multipart `state`, `name`, and `area` sources
- `state`
- `name`
- `area`
- `line`
- `circle`
- compact `horseshoe`
- compact `sparkline`

Content is visualization only. Controls, buttons, sliders, or other interactive children are not valid content items.

## Read-only Contract

The parent control remains the only interactive object:

- child tap, hold, and double-tap actions are forced to `none`;
- child pointer events are disabled;
- select or button hit areas remain authoritative;
- haptics and press animations remain owned by the parent;
- child visualizations render before the parent hit area;
- sparkline tooltips and pointer handlers cannot receive events through the pointer-transparent content parent.

## Styling

Existing button active/inactive and select selected/unselected styling remains active for icon and text content. Additional visual tools use their own state, styles, color stops, and animation configuration by default. This keeps permanent status lines visible independently of which select option is active.

A button with `tap_action: { action: none }` can therefore act as a read-only visual container while retaining ordinary button layout and styling.

Item-specific selected/unselected visual overrides are not part of the first implementation. They can be added later without changing the content hierarchy.

## Lifecycle

A shared `ControlContent` object owns the visual child tools. It forwards:

- `updateRuntimeConfig()`;
- entity-state assignment;
- `hassAvailable()`;
- `connected()` and `disconnected()`;
- `hassConnected()`;
- `requiresHassUpdate()`;
- `firstUpdated()` and `updated()`.

Child ids are namespaced by card, control, select option, and content item. This prevents duplicate SVG ids for gradients, horseshoes, and sparklines.

A button creates one `ControlContent`. A select creates one `ControlContent` for every option and gives it the option's segment bounds and inherited entity.

## Compact Horseshoe Limits

A content horseshoe is intended as a simple microvisualization. The supported contract excludes layouts that require automatic external-bound measurement, including labels, badges, or other deliberately protruding parts. Radius and configured styles determine its size. If it does not fit, the user adjusts the control, content, or horseshoe dimensions.

## Compact Sparkline Limits

A content sparkline is a microvisualization with explicit width and height. It has no axes, labels, tooltip, or interaction in the content context. It may still use the normal history engine and lifecycle.

Multiple historical sparklines are allowed. Their history requests and timers have a cost; this is a documented user choice rather than an artificial runtime restriction.

## Awair Conversion

The Awair sensor select becomes the first complete example:

- remove the six external status lines;
- assign each option one `entity_index`;
- let icon, state, and status line inherit that entity;
- define line once as the third shared content item;
- keep each option's color-stop template as its content override;
- align the three visual rows with content padding, gap, and line margin only.

## Implementation Plan

1. Specify and validate explicit content `items`, unique item ids, supported visual types, margin normalization, and segment-parent inheritance.
2. Implement shared read-only `ControlContent` layout with horizontal/vertical equal cells, padding, gap, and per-item margins.
3. Preserve the existing icon/text shorthand and activate the new stack only when `items` is configured.
4. Integrate one `ControlContent` into a button and one per option segment into a select.
5. Route select state through the control entity and child visual state through `option_map[].entity_index` inheritance.
6. Add child adapters for icon/text, line/circle, compact horseshoe, and compact sparkline.
7. Preserve existing active/inactive and selected/unselected icon/text styling while leaving additional visual tools state-driven.
8. Forward runtime, Home Assistant, DOM, reconnect, and post-render lifecycle methods to every child.
9. Suppress child actions, pointer handlers, and tooltips while preserving the parent's hit area and press animation.
10. Convert the Awair sensor selector from external lines to segment-owned content.
11. Add focused tests for horizontal and vertical geometry, padding, gap, asymmetric margins, entity inheritance, item overrides, selected styling, lifecycle forwarding, and read-only behavior.
12. Run existing Node tests and `npm run build`.
13. Verify the Awair example visually in Chrome and Safari/iOS.
14. Document the public schema, inheritance rules, supported visual tools, sizing responsibility, compact horseshoe limits, and sparkline performance consideration.

## Implementation Order

The work is split into bounded stages:

1. Content schema and stack foundation.
2. Button and select integration with icon, text, line, and circle.
3. Awair conversion and visual verification.
4. Compact horseshoe adapter.
5. Compact sparkline adapter and history lifecycle.
6. Tests, build, documentation, and cross-browser verification.
