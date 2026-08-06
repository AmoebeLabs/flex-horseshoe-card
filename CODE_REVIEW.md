# Flex Horseshoe Card Code Review

Scope: Lit v3 compatibility, rendering performance, memory leaks, async timing, SVG injection stability, eslint, and JavaScript template safety.

## Findings

### High: Imported template helper runs without card context

- Location: `src/main.js:1519`, `src/main.js:2024`, `src/main.js:2133`, `src/main.js:2240`, `src/templates.js:4`, `src/templates.js:64`
- Impact: JavaScript templates used by areas, horizontal lines, vertical lines, and circles cannot reliably access `hass`, `config`, `entities`, `states`, `entity`, or `user`. `Templates.context` is static, but `Templates.setContext(...)` is never called. This means templates in these render paths either evaluate with undefined runtime data or silently return `undefined`.
- Why it matters: Other sections still use the instance `_mergeStyles()` path, which passes richer runtime values. The same template can work for states/icons/names and fail for circles/lines/areas, making behavior configuration-dependent and hard to diagnose.
- Recommendation: Use one template execution path. Prefer an instance-scoped evaluator that receives the current card state and remove the unused static global context, or set/clear context immediately before evaluating with clear ownership.

### High: JavaScript templates execute with full frontend privileges

- Location: `src/templates.js:78`, `src/main.js:2735`
- Impact: Dashboard YAML can execute arbitrary JavaScript via `new Function`. The current code passes powerful objects (`hass`, `states`, `config`, entity objects, user info) and does not sandbox access to globals such as `window`, `document`, `localStorage`, or network APIs.
- Why it matters: This is expected for some Home Assistant custom-card ecosystems, but it is not safe for untrusted dashboards or shared configs. It also allows templates to mutate card config/entities during render.
- Recommendation: Document templates as trusted-code execution. If safer execution is desired, restrict templates to declarative expressions or a small allowlisted helper API. At minimum, freeze or clone runtime objects passed to templates and avoid exposing the full `hass` object unless required.

### High: Icon path polling can retain detached cards and request updates after disconnect

- Location: `src/main.js:1799`, `src/main.js:1827`, `src/main.js:1839`, `src/main.js:1191`
- Impact: `_renderIcon()` schedules repeated `setTimeout()` callbacks from inside render. `disconnectedCallback()` does not clear pending timers or mark the element as disposed. A removed card can stay retained by closures for up to 40 attempts per icon and can call `requestUpdate()` after it is detached.
- Why it matters: Dashboards with frequent navigation/reload or many icon cards can accumulate delayed work and retained card instances. The side effect also makes render timing less deterministic.
- Recommendation: Move icon path reads to `updated()` or a dedicated async controller, store timer IDs per icon, and clear them in `disconnectedCallback()`. Guard callbacks with `this.isConnected`.

### Medium: Icon SVG extraction is brittle against Home Assistant internals

- Location: `src/main.js:1870`, `src/main.js:1910`
- Impact: The card renders a hidden `<ha-icon>`, reaches into its shadow root, and reads `querySelector('*')?.path`. This depends on private implementation details of Home Assistant icon components. If HA changes the shadow DOM shape or property name, icons silently disappear after the retry window.
- SVG injection stability note: The final `<path d="${iconSvg}">` binding is not raw HTML injection, so Lit will not parse attacker-controlled markup as elements. The stability risk is mainly invalid or unavailable path data, not direct DOM injection.
- Recommendation: Prefer an official icon path resolver if available in the HA frontend environment, or isolate this adapter behind one function with explicit fallback rendering and diagnostics when extraction fails.

### Medium: Rendering does expensive template/style work on every entity update

- Location: `src/main.js:1205`, `src/main.js:1466`, `src/main.js:1519`, `src/main.js:1639`, `src/main.js:1773`, `src/main.js:2024`, `src/main.js:2133`, `src/main.js:2240`, `src/main.js:2851`
- Impact: Styles are merged, stringified, and template-evaluated during render. JavaScript templates compile a new `Function` each evaluation. For dashboards with many cards/items and frequent entity updates, this creates avoidable CPU and garbage collection pressure.
- Recommendation: Cache compiled template functions by template source and cache static style normalization in `setConfig()`. Recompute only the state-dependent portion when the referenced entity changes.

### Medium: Manual inline style string construction is inconsistent and fragile

- Location: `src/main.js:1481`, `src/main.js:1655`, `src/main.js:1681`, `src/main.js:1787`, `src/main.js:2890`
- Impact: Several render paths build `style` attributes with `JSON.stringify(...).replace(...)`, while newer paths use `styleMap()`. Manual construction can produce malformed CSS when values contain quotes, commas, semicolons, or CSS functions. It also makes template-provided style behavior inconsistent across item types.
- Recommendation: Convert all style bindings to object bindings with `styleMap()` and normalize values without trailing semicolons.

### Medium: Missing or unavailable first entity can crash later updates

- Location: `src/main.js:803`, `src/main.js:856`, `src/main.js:858`, `src/main.js:1211`, `src/main.js:2375`
- Impact: The `hass` setter skips unavailable entities, but later assumes `this.entities[0]` exists when any tracked entity changes. A missing first entity with another changed entity can throw. The card click handler also assumes a valid first entity.
- Recommendation: Guard all first-entity access and render an empty/error state until required entities exist. Use explicit `!== undefined` checks for attribute values so valid falsy values such as `0` are not skipped.

### Low: Lit v3 compatibility is mostly OK, but render has side effects

- Location: `src/main.js:1205`, `src/main.js:1748`
- Impact: The Lit v3 import style is correct (`LitElement`, `html`, `css`, `svg` from `lit`), and the custom `hass` setter can work because Home Assistant assigns it directly. The main compatibility concern is behavioral: `_renderIcon()` schedules asynchronous work during render, which conflicts with Lit's expectation that render is a pure description of DOM.
- Recommendation: Keep async DOM probing outside render. Declaring reactive properties is optional here, but a declared `hass`/`config` contract would make update behavior clearer.

### Low: Stale caches can survive config/theme changes

- Location: `src/main.js:93`, `src/main.js:98`, `src/main.js:1126`, `src/main.js:2641`
- Impact: `colorCache` caches resolved CSS variables, so theme changes can leave gradient colors stale. `iconCache` and icon IDs are not reset when icon layout changes except for assigning IDs for current layout indexes.
- Recommendation: Clear color cache when theme-dependent inputs change, or avoid caching CSS variable resolutions. Reset icon-related arrays in `setConfig()` when layout icons change.

### Low: Dead/obsolete code adds async hazards and review noise

- Location: `src/main.js:1916`, `src/main.js:1942`, `src/main.js:1946`, `src/main.js:1952`, `src/main.js:1966`, `src/main.js:2790`
- Impact: `_scheduleIconPathRead()` appears unused and references `this._card`, which is not initialized in the active card class. The older instance template methods duplicate `src/templates.js`. Dead paths hide real ownership of async/template behavior and can become accidental bug sources.
- Recommendation: Remove obsolete implementations after consolidating template and icon handling.

### Low: ESLint currently passes, but important rules are disabled

- Location: `eslint.config.mjs:77`, `eslint.config.mjs:83`, `eslint.config.mjs:88`
- Impact: `npm run lint` passes, but rules that would catch current risks are disabled or downgraded, including `no-new-func`, `no-unused-vars`, `no-use-before-define`, and several complexity/style rules. This allows dead code and unsafe template execution to remain invisible to CI.
- Recommendation: Keep intentional exceptions local with comments and re-enable broad rules where practical. In particular, make `no-unused-vars` an error after removing obsolete code.

## Verification

- Ran `npm run lint`: passed with no reported errors or warnings.
- Did not run the Rollup build because it writes `dist/flex-horseshoe-card.js`, and this review was requested without modifying implementation/build outputs.
