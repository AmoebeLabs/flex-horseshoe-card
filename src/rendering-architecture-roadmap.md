# Rendering Architecture Roadmap

This document captures the current cleanup and architecture direction discussed while migrating the horseshoe renderer to the new implementation.

## Goals

- Keep legacy user configs working.
- Move rendering logic out of `main.js` one concern at a time.
- Make rendering behavior easier to test and revert.
- Release a dev build after each PR so users can roll back to the previous working version.
- Avoid large mixed PRs that combine behavior changes, cleanup, and architecture changes.

## Current Horseshoe Direction

The new horseshoe implementation uses a layered pipeline:

- `horseshoe-state.js`: resolves runtime config and entity state.
- `horseshoe-geometry.js`: owns value-to-angle and coordinate mapping.
- `horseshoe-shapes.js`: builds path/item data from geometry.
- `horseshoe-renderer.js`: renders SVG from path/item data.
- `horseshoe-tickmarks.js`: builds tickmark paths and tick backgrounds.
- `horseshoe-labels.js`: renders labels and badges.
- `horseshoe-animator.js`: handles state value animation.
- `horseshoe-gauge.js`: orchestrates config, state, cache, and render order.

The key design rule is that render layers should not know about scale modes, spline, or bidirectional mapping. They receive coordinates/angles from `GaugeGeometry`.

This makes changes like `bar_mode`, `spline`, labels, tickmarks, backgrounds, and colorstop segments move together. If geometry is right, all layers are right. If geometry is wrong, all layers are consistently wrong and the bug is isolated.

## Legacy Horseshoe Compatibility

Legacy root-level horseshoe config must keep working. The old root-level fields should be converted into one new horseshoe config and merged with the layout horseshoe list.

Conceptually:

```js
const legacyConfig = HorseshoeGauge.getLegacyRootConfig(config);
const layoutConfigs = Array.isArray(config.layout?.horseshoes_v2) ? config.layout.horseshoes_v2 : [];

const horseshoes = [...(legacyConfig ? [legacyConfig] : []), ...layoutConfigs];
```

Later, when `horseshoes_v2` becomes the normal implementation, this should move to `layout.horseshoes`.

## PR Plan

Each PR should have one clear axis and should be followed by a dev build release.

1. Make the new horseshoe implementation accept both legacy root config and layout horseshoe config.
2. Remove the old legacy horseshoe render/state path from `main.js`.
3. Remove obsolete experimental `horseshoe-gauge-v2*.js` files.
4. Remove old `labels.js` if it is no longer referenced after legacy renderer removal.
5. Extract one simple item type from `main.js`, for example circles or hlines.
6. Repeat extraction for icons, states, names, areas, hlines, vlines, and circles.
7. Introduce default `zpos` handling once item rendering is modular.
8. Introduce sorted render order by `zpos`.
9. Introduce group-level rendering/transforms after z-ordering is stable.

Example dev build sequence:

```text
5.4.7-dev.9   horseshoe legacy root + layout through new renderer
5.4.7-dev.10  remove old horseshoe renderer
5.4.7-dev.11  remove obsolete v2 experiment files
5.4.7-dev.12  extract circles module
5.4.7-dev.13  zpos groundwork
```

## Main.js Cleanup Direction

`main.js` currently owns too many responsibilities:

- config pipeline
- entity/state resolving
- template resolving
- layout item rendering
- animations
- groups/transforms
- colors/colorstops per item
- click/popup handling
- SVG shell
- legacy horseshoe rendering

The target direction is for `main.js` to orchestrate modules rather than render every item type directly.

Example target shape:

```js
renderSvg() {
  return svg`
    ${this.renderItems.map((item) => item.render())}
  `;
}
```

Item modules can follow a common lifecycle:

```js
setConfig(config, templates, context);
setHass(hass, entities, resolvedEntityConfigs);
render();
```

## Zpos Direction

Once item types are modular, every renderable item can receive a `zpos`.

If `zpos` is not configured, the current hardcoded render order should be preserved through default values.

Example defaults:

```js
const DEFAULT_ZPOS = {
  circles: 10,
  horseshoes: 20,
  hlines: 30,
  vlines: 30,
  icons: 40,
  areas: 50,
  names: 60,
  states: 70,
};
```

Then render order can become data-driven:

```js
const renderItems = [...circles.items, ...horseshoes.items, ...icons.items, ...states.items, ...names.items, ...lines.items].sort((a, b) => a.zpos - b.zpos);
```

This makes circles, rectangles, icons, states, names, horseshoes, and other objects usable as layers. A circle can be a background behind text, a rectangle can sit behind a circle, and a horseshoe can be placed behind or in front of other items.

## Groups Direction

Every item can eventually belong to a group. Items without an explicit group can use an implicit `card` group.

Conceptually:

```yaml
groups:
  card:
    xpos: 50
    ypos: 50
    scale: 1
    rotate: 0
```

This preserves current behavior while making group transforms explicit.

Later, a custom group can own its transform:

```yaml
groups:
  power:
    xpos: 50
    ypos: 50
    scale: 1.2
    rotate: 0

states:
  - group: power
    xpos: 0
    ypos: 0
    zpos: 70

icons:
  - group: power
    xpos: 0
    ypos: -15
    zpos: 60
```

The SVG structure can then become:

```svg
<g id="group-card" transform="...">
  <g id="group-power" transform="...">
    ...items...
  </g>
</g>
```

Children only need local coordinates. Group position, scale, and rotation are handled once at the group level.

## Extra Horseshoe Ideas

These ideas are useful follow-up features, but each should stay in its own PR. They affect rendering behavior and need visual testing across normal, bidirectional, spline, and string-state horseshoes.

### String-State Modes And Levels

`stringstate_mode` shows one nominal string-state segment: only the current mapped state is highlighted.

`stringstate_level` shows ordered string-state levels: the current state plus all lower states are highlighted.

The segment role should always be calculated the same way: compare each entry index in `state_map.map` with the current mapped state index. That gives one stable relation for every state:

- `before`: lower states before the current state
- `current`: the current mapped state
- `after`: higher states after the current state

That segment role must be available consistently for both state paths and labels. The mode should only decide whether a segment is rendered/highlighted. Labels should use the same segment role data, so styling does not depend on a separate or duplicated interpretation of the current state.

Possible config direction:

```yaml
horseshoe_state:
  mode: stringstate_level
```

This is feasible and keeps nominal modes separate from ordered levels. For `stringstate_level`, the order should come from `state_map.map`, because that is already the configured level order. The implementation should still use the same segment geometry as string-state mode, so labels, backgrounds, color stops, and gaps keep matching. State path items and label items should both receive the same segment role.

Rendering then becomes mode-specific, while the test stays identical:

- `stringstate_mode`: render/highlight only `current`
- `stringstate_level`: render/highlight `before` and `current`; keep `after` unrendered or inactive

This keeps label styling predictable in every string-state mode, because labels can always test `before/current/after`.

### Label Contrast On Colored Segments

Labels placed on top of colored scale or state segments may need a light or dark text color depending on the segment color. This is a real readability issue, especially for string-state labels rendered directly on the horseshoe.

The safest and clearest option is explicit per-label-state styling. SVG cannot detect the actual background behind text, and even the intended background can be ambiguous: scale segment, active state segment, label background, horseshoe background, or another layer. Automatic contrast could only work in narrow cases where the label builder knows the exact segment color, so it should not be the first implementation.

Possible config direction:

```yaml
horseshoe_state:
  mode: stringstate_mode

horseshoe_labels:
  stringstate:
    segment_roles:
      current:
        styles:
          - font-weight: bold
    state_map:
      map:
        - state: low
        styles:
          - fill: black
        - state: high
        styles:
          - fill: white
```

This is feasible and useful. String-state label presentation belongs under `horseshoe_labels.stringstate`, because these options only apply when labels are driven by string-state state-map entries. It can still use the same `state_map.map` structure as icons. The first implementation should use `horseshoe_labels.stringstate.state_map.map` for explicit per-state label styles. Segment role styles can live under `horseshoe_labels.stringstate.segment_roles`, using the same `styles` key everywhere. A derived contrast option can be reconsidered later, but only for cases where the intended background segment is unambiguous. Rendering should only receive the final style.

### Light And Dark Color Stops

Color stops could support different colors for Home Assistant light and dark themes, similar to external palettes. This avoids forcing users to make every color a CSS variable when they want a different scale per theme.

Possible config direction:

```yaml
color_stops:
  mode: gradient
  gap: 3
  colors:
    - value: 0
      color: '#3388ff'
    - value: 1
      color: '#ffaa00'
  themes:
    light:
      - value: 0
        color: '#005fcc'
      - value: 1
        color: '#cc6600'
    dark:
      - value: 0
        color: '#66aaff'
      - value: 1
        color: '#ffcc66'
```

This is feasible, but it should be handled in color-stop normalization, not in renderers. Renderers should receive one resolved `colorStops` object. The selected theme can come from the Home Assistant theme state.

### Segmented Fixed Backgrounds

Some background layers are currently either one fixed arc or color-stop segments. A useful extra mode would draw fixed-color backgrounds using the same segment boundaries as `color_stops`, while still using one configured fill or stroke color.

This would make backgrounds visually line up with color-stop scales, string-state segments, labels, and tick backgrounds. It is especially useful when filters or shadows are applied to a grouped background.

Possible config direction:

```yaml
show:
  horseshoe_background: fixed_segments
horseshoe_background:
  color: rgba(255, 255, 255, 0.08)
```

This is feasible and consistent with the current path-building architecture. It belongs in the shared background/arc item builder, so horseshoe background, label background, and tick background can reuse the same behavior.

## Why This Matters

The new horseshoe work showed the practical benefit of central geometry and smaller modules:

- less repeated logic
- fewer places to fix the same bug
- less manual regression testing
- easier rollback per PR
- easier future features like `zpos` and group transforms

The goal is not only fewer lines of code. The goal is to make behavior local, predictable, and recoverable.
