# Runtime Color Gradients

## Goal

Allow reusable `layout.gradients` to use the runtime color of the item that applies the gradient.

This keeps gradient usage consistent for arcs, rectangles, circles, lines, icons, and future shapes:

```yaml
styles:
  fill: gradient(soft-fill)
```

The gradient definition stays reusable and centralized, while each item can still provide its own runtime color through `color_stops`, future `colorstop_gradient`, or a generic state mapping.

## User Model

A gradient remains a normal `layout.gradients` entry:

```yaml
layout:
  gradients:
    soft-fill:
      type: linear
      x1: 0
      y1: 0
      x2: 100
      y2: 100
      stops:
        - offset: 0
          color: color_stop
        - offset: 100
          color: var(--primary-background-color)
          opacity: 0
```

A shape uses it through normal styles:

```yaml
layout:
  arcs:
    - id: upperhalf_0
      entity_index: 0
      color_stops:
        colors:
          - value: 0
            color: green
          - value: 1
            color: yellow
          - value: 2
            color: red
      styles:
        fill: gradient(soft-fill)
```

The special value `color_stop` means: use the runtime color resolved for this item.

## Why This Is Consistent

- `layout.gradients` remains the single place for gradient definitions.
- `styles.fill: gradient(name)` remains the single way to apply a gradient.
- The same gradient can be reused by arcs, rectangles, circles, and other tools.
- The item remains responsible for its own runtime color.
- The gradient does not introduce a second color-stop or state-map system.

## Runtime Flow

1. The item resolves its normal render styles.
2. The item resolves its runtime color from `color_stops`.
3. Later, if supported, this same runtime color can come from `colorstop_gradient` or generic `state_map` support.
4. If a style uses `gradient(name)`, the renderer checks whether that gradient contains `color: color_stop`.
5. If not, the existing static gradient id can be used.
6. If yes, the renderer creates an item-scoped gradient id.
7. The item-scoped gradient copies the original gradient geometry and stops.
8. Each `color: color_stop` stop is replaced by the resolved runtime item color.
9. The style is rendered as `fill: url(#item-scoped-gradient-id)` or `stroke: url(#item-scoped-gradient-id)`.

## Scope

This should be implemented in a separate PR/branch.

It should not be part of the masks/clips PR, because it affects generic gradient rendering for visible layout tools.

## Future Compatibility

When generic string-state mapping or `colorstop_gradient` support is added to shapes, this design still works:

```yaml
color: color_stop
```

continues to mean: use the final runtime color for this item.

The gradient definition does not need to know whether that color came from numeric `color_stops`, a text-state map, or a future gradient color-stop calculation.
