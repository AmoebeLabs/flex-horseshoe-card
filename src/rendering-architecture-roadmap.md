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

This makes changes like `bar_mode`, `spline`, `spline2`, labels, tickmarks, backgrounds, and colorstop segments move together. If geometry is right, all layers are right. If geometry is wrong, all layers are consistently wrong and the bug is isolated.

## Legacy Horseshoe Compatibility

Legacy root-level horseshoe config must keep working. The old root-level fields should be converted into one new horseshoe config and merged with the layout horseshoe list.

Conceptually:

```js
const legacyConfig = HorseshoeGauge.getLegacyRootConfig(config);
const layoutConfigs = Array.isArray(config.layout?.horseshoes_v2)
  ? config.layout.horseshoes_v2
  : [];

const horseshoes = [
  ...(legacyConfig ? [legacyConfig] : []),
  ...layoutConfigs,
];
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
setConfig(config, templates, context)
setHass(hass, entities, resolvedEntityConfigs)
render()
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
const renderItems = [
  ...circles.items,
  ...horseshoes.items,
  ...icons.items,
  ...states.items,
  ...names.items,
  ...lines.items,
].sort((a, b) => a.zpos - b.zpos);
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

## Why This Matters

The new horseshoe work showed the practical benefit of central geometry and smaller modules:

- less repeated logic
- fewer places to fix the same bug
- less manual regression testing
- easier rollback per PR
- easier future features like `zpos` and group transforms

The goal is not only fewer lines of code. The goal is to make behavior local, predictable, and recoverable.
