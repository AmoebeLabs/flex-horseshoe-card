# Tool Home Assistant, Configuration, and Data Lifecycle

## Purpose

FHS tools use separate phases for Home Assistant availability, runtime configuration, entity data, and DOM updates. `main.js` owns the order so configuration processing is not hidden inside `setState()`.

## Lifecycle contract

| Hook | Meaning |
| --- | --- |
| `connected()` | The parent card is attached to the DOM. |
| `hassAvailable()` | A usable `hass` object has become available to this tool for the first time. |
| `updateRuntimeConfig()` | The active configuration is evaluated and normalized for the current relevant update. |
| `setState()` | Entity data is assigned and converted into display data. |
| `hassConnected()` | The Home Assistant connection reports `ready`, normally after reconnecting. |
| `firstUpdated()` | The first Lit DOM update has completed. |
| `updated()` | A Lit DOM update has completed. |
| `disconnected()` | The parent card is removed from the DOM. |

## Main orchestration

`main.js` owns lifecycle dispatch. Tool methods do not invoke another lifecycle phase implicitly.

When `_hass` changes from `undefined` to the first Home Assistant object, all existing tools receive one `hassAvailable()` call. When `setConfig()` creates replacement tools while `_hass` already exists, those new instances receive the same one-time call after construction.

A relevant Home Assistant update uses explicit configuration and data phases:

1. Set the template context and evaluate card entities, groups, styles, and theme inputs.
2. Call `updateRuntimeConfig()` once for every sparkline tool.
3. Call `setState()` once for every sparkline tool and publish its local min/avg/max entities.
4. Call `updateRuntimeConfig()` once for every remaining tool so templates can use the current local sparkline entities.
5. Call `setState()` once for every remaining tool.

Async sparkline-history updates use the same order for the downstream tools: update their runtime configuration once and then assign their entity data once.

The websocket `ready` listener remains responsible only for `hassConnected()`.

## Responsibilities

`BaseTool.updateRuntimeConfig()` evaluates marked JavaScript configuration, compares the resulting active configuration, normalizes public `color_stops`, and updates shared config fields such as `zpos`. Existing `configChanged`, `activeConfigInitialized`, and `evaluateJavascriptTemplates` controls prevent unnecessary evaluation and geometry work.

Concrete tools extend this phase only for configuration-derived geometry or normalized structures. Lines, icons, circles, arcs, and rectangles require no separate `setState()` implementation because their entity assignment is completely handled by `BaseTool.setState()`.

`BaseTool.setState()` stores only the entity and entity configuration. Name, area, state, horseshoe, and sparkline tools extend it for actual text, mapped state, statistics, series, and display calculations.

`hassAvailable()` remains a one-time lifecycle hook for initialization that genuinely requires an existing Home Assistant context. It is not called from the entity-state helper and does not perform runtime configuration or data processing.

## Verification scenarios

1. Construct a card before `hass` exists: no `hassAvailable()` call occurs.
2. Assign the first `hass`: each existing tool receives one `hassAvailable()` call.
3. Process a relevant entity update: every affected tool receives one runtime-config pass followed by one data pass.
4. Process an irrelevant Home Assistant update: neither tool phase runs.
5. Rebuild tools while `hass` exists: only the new instances receive `hassAvailable()`.
6. Update sparkline history asynchronously: downstream tool config is evaluated before downstream entity data.
7. Change a JavaScript-driven style: runtime config changes and the corresponding geometry or style is recalculated.
8. Keep JavaScript output unchanged: the active config object and config-derived geometry are reused.
9. Dispatch websocket `ready`: `hassConnected()` runs without repeating `hassAvailable()`.
10. Complete Lit updates: `firstUpdated()` runs once and `updated()` continues normally.
