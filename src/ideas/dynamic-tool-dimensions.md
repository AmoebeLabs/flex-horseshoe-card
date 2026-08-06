# Dynamic Tool Dimensions

## Summary

Rectangles may derive their width and height from the rendered dimensions of a `state`, `name`, or `area` tool. Measurements remain in the normal FHS coordinate system.

## Configuration

A rectangle can fit the complete rendered geometry of a text item:

```yaml
fit:
  section: states
  item_id: current-state
```

- `section`: initially `states`, `names`, or `areas`.
- `item_id`: ID of the referenced tool.
- `padding.x` and `padding.y`: FHS coordinate units added on both horizontal or vertical sides; defaults are `1.5` and `0.5`.
- A fitted rectangle does not require `xpos`, `ypos`, `width`, or `height`.
- Numeric rectangle geometry remains unchanged and backward compatible.
- A dynamic `width` or `height` reference changes only that dimension and retains the configured rectangle position.

## Measurement Lifecycle

1. Text tools expose their current measured width and height.
2. Before an exact measurement exists, width is estimated using the configured font size and a factor of `0.6`.
3. State measurements include both the value and unit, including `top`, `bottom`, and `end` unit layouts.
4. A Lit `ref` binding follows the currently rendered SVG text node without repeated DOM queries.
5. `updated()` measures the complete rendered text node with `getBBox()`.
6. The SVG measurement is converted to FHS coordinates and cached on the text tool.
7. When text, unit, styles, or the rendered node change, the estimate is used for the first render and `updated()` replaces it with the exact measurement.
8. A correction render is requested only when the measured width or height actually changes. The following unchanged measurement stops the cycle.
9. The measured character-width factor is updated with `factor = factor * 0.8 + measuredFactor * 0.2`. This improves the estimate for subsequent content changes while the exact `getBBox()` result remains authoritative.

## Integration

- Tools expose their configured ID so references can be resolved consistently.
- `state`, `name`, and `area` tools are constructed and updated before dependent rectangles.
- The existing parent `updated()` lifecycle lets text tools measure their current Lit-bound SVG node after rendering.
- Rectangle fit calculation uses the referenced tool center, width, and height, adds the configured axis padding, and then uses the existing rectangle path and radius calculations.
- No observers, repeated selectors, extra defaults, or defensive fallbacks are introduced.
- Cross-group scale compensation is out of scope; referenced tools and rectangles use their local FHS dimensions.

## Test Scenarios

- Existing rectangles with numeric dimensions remain unchanged.
- Width follows changing state text such as `9`, `45.70`, and `1000.00`.
- State width includes a unit positioned at `end`.
- State height includes units positioned at `top` or `bottom`.
- Name and area changes resize their referenced rectangles.
- Width-only and height-only references work independently without changing rectangle position.
- Fit works without rectangle xpos, ypos, width, or height.
- Default fit padding applies `1.5` horizontally and `0.5` vertically; either value can be overridden independently.
- Initial render uses an estimate and settles after one exact correction.
- Later entity updates resize correctly without a render loop.
- Card resizing preserves the normal FHS scaling behavior.
- `npm run build` completes successfully.
