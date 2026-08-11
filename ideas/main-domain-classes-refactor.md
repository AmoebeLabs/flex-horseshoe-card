# Refactor main.js into focused domain classes

## Goal

Reduce `main.js` to the FlexHorseshoeCard Lit shell and an explicit lifecycle
chain. Public YAML and normal visible behavior remain compatible. Timing,
multi-card template state, and decimal formatting errors exposed by the current
architecture are corrected as part of the refactor.

There will be no broad CardContext service locator and no collection of generic
Manager classes. Stable domain classes own their state and behavior, and receive
their dependencies explicitly.

## Domain classes

- `HomeAssistant`: current HA instance, connection lifecycle, entity lookup,
  localization, events, and service calls.
- `CardConfig`: complete configuration compilation and validation, including
  templates, constants, `ref()`, `calc()`, disabled items, slots, entity
  addresses, and actions.
- `CardEntities`: configured entities, evaluated entity configs, current entity
  state, and derived sparkline statistic entities.
- `CardInputEntities`: local `fhs_input_number` and `fhs_input_boolean`
  state, scope, persistence, events, and services.
- `CardTheme`: HA theme state, palettes, active colors, and related caches.
- `CardLayout`: viewBox, aspect ratio, groups, geometry, masks, clips, and SVG
  definitions.
- `CardAnimations`: animation selection and active animation styles.
- `CardActions`: action validation, precedence, targets, gesture actions, card
  taps, and slider actions. `action-handler.js` remains the pointer gesture
  recognizer.
- `CardTools`: tool construction, collections, entity assignment, HA and Lit
  lifecycle forwarding, lookup, geometry, z-position sorting, and SVG rendering.
- `CardStyles`: the Lit CSS currently embedded in `main.js`.

JavaScript template evaluation becomes card-specific. Compiled JavaScript
functions may remain cached globally, but current HA, config, entity, and slot
data must never be shared between cards.

## main.js lifecycle

`main.js` keeps:

- `FlexHorseshoeCard extends LitElement`
- constructor and creation of the domain classes
- `static styles`
- `setConfig()`
- `set hass()`
- connected and disconnected callbacks
- `render()`
- `firstUpdated()` and `updated()`
- `getCardSize()`
- custom-element registration

The lifecycle methods show the domain calls in execution order. They contain no
configuration compiler, entity engine, action executor, or tool implementation.
CardTools forwards Lit and HA lifecycle calls to every tool, and each tool owns
its own part of that chain.

Method names describe the concrete operation. Generic verbs such as
`resolve`, `process`, `prepare`, and `handle` are not used. Examples:

- `evaluateEntityConfigTemplates()`
- `replaceLayoutEntityIdsWithIndexes()`
- `convertEntityIndexesToSlotAddresses()`
- `replaceSlotAddressesWithEntityIndexes()`
- `buildSparklineStatisticEntities()`
- `assignEntityToTool()`
- `executeGestureAction()`
- `executeCardTapAction()`

## Tests and required behavior

Move tests from `src/tests` to repository-root `tests`. Add `npm test`, lint
the test files with Biome, and run tests as the first part of `npm run build`.
The test loader applies the same `__DEV__`, `__DEMO__`, and
`__BACKWARDS_COMPAT__` constants as Rollup.

Keep all existing test scenarios and add regression coverage for:

- HA precision as the decimal-formatting baseline.
- `entity.decimals` as a fixed precision override.
- `format.decimals_min` and `format.decimals_max` as the most specific
  overrides.
- Dutch locale and trailing zero output: `10.22 -> 10,22`,
  `10.20 -> 10,2` with HA precision one, and `10.20 -> 10,20` with
  `decimals: 2`.
- Final StateTool text parts, not only intermediate numbers.
- Independent JavaScript template data for two simultaneous cards.
- Theme state being current before dynamic configuration evaluation.
- Full CardConfig compilation order.
- CardActions precedence and HA/FHS execution.
- CardInputEntities scope, persistence, and events.
- CardTools lifecycle forwarding, entity assignment, and z-position order.

## Implementation order

1. Move and repair the test suite; add the local build test gate.
2. Add decimal regression tests and correct final state formatting.
3. Extract CardStyles and HomeAssistant.
4. Make JavaScript templates card-specific and extract CardConfig.
5. Extract CardInputEntities, CardEntities, and CardTheme.
6. Extract CardLayout and CardAnimations.
7. Extract CardActions.
8. Extract CardTools and replace tool-to-card coupling with explicit
   dependencies.
9. Reduce main.js to the Lit shell and remove obsolete forwarding code.

Tests and the complete build must pass after every implementation stage. Finish
with manual checks of the control, horseshoe, cartesian, radial, Awair, and child
card showcases in Home Assistant.
