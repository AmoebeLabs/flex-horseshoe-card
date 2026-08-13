# Flexible Horseshoe Card - Performance User Timing Instrumentation

## Goal

Flexible Horseshoe Card runs inside Home Assistant together with Lit, frontend components, themes and other custom cards. A browser performance recording therefore does not make it obvious which script time belongs to FHS. This design adds optional per-card User Timing measures so FHS work can be identified in Microsoft Edge and Chromium-based browser profiles.

The instrumentation is intended for development and before/after comparisons. It must not alter configuration processing, state handling, rendering or interaction.

## Configuration

Enable measurements on only the card being investigated:

```yaml
type: custom:flex-horseshoe-card
dev:
  performance: true
entities:
  - entity: sensor.example
layout:
  states:
    - entity_index: 0
      xpos: 50
      ypos: 50
```

Every card already has a unique internal `cardId`. Measure names use that id:

```text
FHS:<cardId>:<phase>
```

This keeps entries from multiple measured cards separate. Without `dev.performance: true`, FHS does not read timers or create performance entries.

## Measures

| Phase | Boundary | Meaning |
| --- | --- | --- |
| `setConfig` | Entry to successful exit of `setConfig()` | Synchronous card template compilation, static config processing, normalization and tool construction |
| `setHass` | Entry to exit of `setHass()` | Complete synchronous Home Assistant update pass, including passes which return without rendering |
| `entities` | Entity capture through publication of evaluated entity configs | Entity lookup and dynamic entity-config evaluation |
| `groups` | Group change reset through optional `GroupManager` reconstruction | Dynamic group evaluation, comparison and dependent-group calculation |
| `card-styles` | Around card-style evaluation | Dynamic card-level style evaluation |
| `tools` | Around sparkline entity publication and every tool `setState()` call | Runtime tool state, normalization, geometry and graph calculations |
| `animations` | Around animation state matching and application | Dynamic animation evaluation and active animation-style updates |
| `render` | Entry to exit of `render()` | Construction of the Lit HTML/SVG template; it does not include Lit's later DOM commit |
| `updated` | Entry to exit of `updated()` | Tool post-render callbacks, text measurements and sparkline pointer-handler attachment |
| `lit-update` | Entry of `render()` through the end of `updated()` | Per-card Lit template construction and DOM commit without queueing before `render()` |
| `update-cycle` | Effective `setHass()` update through the end of `updated()` | End-to-end wall-clock latency including synchronous FHS work, global queueing, Lit microtask scheduling, template processing and DOM commit |

A `setHass` pass without an effective visual change produces a `setHass` measure but no `update-cycle`. If a tool requests one follow-up Lit update during `updated()`, that follow-up receives its own `update-cycle` measure.

The nested phase durations must not be added to `update-cycle` as independent costs: they are already contained within the outer cycle. Use `lit-update` for the card's own Lit work. Use `update-cycle` only for visible state-to-DOM latency because it can include time spent waiting behind Home Assistant and other cards.

## Microsoft Edge

1. Open the dashboard and let the selected card finish its initial loading.
2. Open Developer Tools and select **Performance**.
3. Start recording.
4. Trigger the operation being investigated, such as a state update or opening the view.
5. Stop recording.
6. Expand the **Timings** or **User Timing** track.
7. Find entries beginning with `FHS:`.
8. Select a measure to inspect its duration and zoom into the corresponding Main-thread work.

The card id is intentionally part of every name. When only one card has performance measurement enabled, every `FHS:` entry belongs to that card.

The entries can also be inspected from the console:

```js
performance
  .getEntriesByType('measure')
  .filter((entry) => entry.name.startsWith('FHS:'))
  .map((entry) => ({
    name: entry.name,
    duration: entry.duration,
  }));
```

For an aggregate overview by phase:

```js
const groups = {};

performance
  .getEntriesByType('measure')
  .filter((entry) => entry.name.startsWith('FHS:'))
  .forEach((entry) => {
    const phase = entry.name.split(':').at(-1);
    (groups[phase] ??= []).push(entry.duration);
  });

console.table(
  Object.entries(groups).map(([phase, values]) => ({
    phase,
    count: values.length,
    average: values.reduce((sum, value) => sum + value, 0) / values.length,
    min: Math.min(...values),
    max: Math.max(...values),
  })),
);
```

Clear existing FHS measures before a new test run:

```js
performance
  .getEntriesByType('measure')
  .filter((entry) => entry.name.startsWith('FHS:'))
  .forEach((entry) => performance.clearMeasures(entry.name));
```

## Comparing Before And After

Use the same card config, entities, browser, zoom level and interaction for both builds. Run one warm-up update first and then record multiple equivalent updates. Compare the median and spread rather than one isolated duration.

The recommended workflow for an optimization is:

1. Record the current build as the baseline.
2. Apply and build one performance change.
3. Repeat the same updates under the same conditions.
4. Compare `setHass`, its nested phases, `lit-update` and `update-cycle`.
5. Check the profile separately for garbage collection, because GC is not represented as an FHS microtask or phase.

The initial instrumentation deliberately keeps the existing `JSON.stringify` config comparisons. This provides the baseline needed to evaluate a later `fast-deep-equal` change.

## Instrumentation Boundaries

The first version measures card-level phases only. Measuring every tool type or individual item would create many User Timing entries, make the timeline difficult to read and add measurable instrumentation overhead.

The measures identify FHS boundaries but do not claim that all time inside `update-cycle` is direct FHS execution. That measure intentionally includes Lit scheduling and DOM work caused by the card. The synchronous nested measures show which part was executed directly by FHS.
