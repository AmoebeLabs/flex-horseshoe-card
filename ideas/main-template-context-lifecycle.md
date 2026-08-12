# Main.js template context lifecycle

## Goal

Keep `main.js` focused on the visible card lifecycle while every card owns one
persistent JavaScript-template context. Tools keep their own config and runtime
state and read card-wide values through that card-specific Templates instance.

## Implementation

1. Remove the static mutable `Templates.context` API.
2. Create `Templates` with the card-owned entities array and retain both object
   identities for the complete card lifecycle.
3. Publish only actual lifecycle changes:
   - `beginConfig(config)` starts a new config and clears obsolete entity slots.
   - `setEntitySlots(entitySlots)` publishes slots after disabled entities are removed.
   - `setHass(hass)` publishes each Home Assistant update once.
4. Keep static template detection and compiled-function caches because they do
   not contain card state.
5. Remove complete context resets from `setHass()`, `setConfig()` and the
   asynchronous sparkline statistics path.
6. Mutate card runtime defaults into the compiled config at the configuration
   boundary so the context never loses its config reference.
7. Keep the config pipeline explicit in `main.js`: root templates, static
   values, controls, disabled entities, slots, compounds, same_as, validation,
   runtime entities, flat indexes and tool construction.
8. Add concise JSDoc and small config examples around slot/address and animation
   conversions; remove dead and historical comments from `main.js`.
9. Treat asynchronous sparkline statistics as local entity updates. The
   sparkline publishes its `fhs_sparkline.*` states and enters the normal
   `setHass()` pipeline with the current hass object.
10. Keep local entity changes separate from Home Assistant context changes.
    Runtime config activation still precedes every state assignment, while
    JavaScript config evaluation only runs for entity, locale or theme context
    changes.
11. Keep defaults at their owning configuration boundary. In particular,
    `bar_mode` and horseshoe `show` defaults belong to HorseshoeGauge and
    must never be added to every card config.

## Regression coverage

- Two simultaneous cards retain independent template values.
- Config, slots and hass updates preserve one context object.
- Starting another config clears slots from the previous config.
- Async sparkline statistics reuse the existing card context.
- Runtime defaults preserve the compiled config object identity.
- Card runtime defaults do not create a legacy root horseshoe.
- Legacy root horseshoe `show` values remain part of an explicitly detected
  legacy horseshoe.
- Named entity addresses and animation slot targets still flatten correctly.
- Run `npm test` and `npm run build`; visually verify the control and Awair
  showcases in Home Assistant because rendering combinations remain visual tests.

## Constraints

- No YAML or visual behavior changes are intended.
- Missing config is handled only at the configuration boundary.
- Runtime domains receive complete data and do not invent defaults or fallbacks.

## Verification

- All 55 automated tests pass.
- Biome lint passes.
- Rollup builds `dist/flex-horseshoe-card.js`.
- Home Assistant language changes update existing cards.
- Light/dark theme changes update existing cards.
- Existing FHS cards, including cards without horseshoes, render normally after
  removing horseshoe defaults from card-level configuration.
