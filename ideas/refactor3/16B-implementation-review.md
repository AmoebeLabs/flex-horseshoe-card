# Plan 16B Implementation Review

Date: 2026-10-02

Reviewed repository:

```text
AmoebeLabs/flex-horseshoe-card
```

Plan 16B baseline:

```text
91548f502e7c42f449b36d5563e7e9855070cf31
```

Implementation PR:

```text
#848 — refactor: unify BaseTool and TextTool configuration ownership (Plan 16B)
```

Implementation commit:

```text
bcf5cb7b53ed556e31c62bf2e737fb9e4fdd057c
```

Merged master commit:

```text
34471f74067a317d23b41e230393c5f60cd8aaf6
```

## Overall conclusion

The implementation follows the approved Plan 16B architecture.

Review result:

```text
BLOCKING: 0
REWORK:   0
ADAPT:    1
KEEP:     remaining implementation
```

No functional regression was found in the new Text configuration route, the
common runtime entity migration, geometry/runtime ownership, paint replacement,
or asynchronous text measurement lifecycle.

One small architectural cleanup remains around JavaScript metadata on
`TextTool.sourceConfig`.

---

# 1. ADAPT — Keep `sourceConfig` JavaScript metadata correct after Text parts are attached

## Finding

`BaseTool` captures and scans the outer Text configuration first:

```js
this.sourceConfig = structuredClone(config);
this.hasJavascript = templates.hasJavascriptTemplates(this.sourceConfig);
```

At that moment TextTool has deliberately removed `text` from the outer
configuration so Text-part JavaScript is not scheduled or evaluated by the
outer BaseTool route.

After `super(...)`, TextTool currently adds the prepared Text parts back by
mutating the same source object:

```js
this.sourceConfig.text = structuredClone(sourceTextParts);

this.textPartsHaveJavascript = this.sourceConfig.text.some(
  (part) => this.templates.hasJavascriptTemplates(part),
);
```

This correctly preserves the two evaluation schedules:

```text
this.hasJavascript
    outer TextTool JavaScript only

this.textPartsHaveJavascript
    Text-part JavaScript only
```

However, `Templates.hasJavascriptTemplates()` caches JavaScript metadata by
object identity in a `WeakMap`.

That means a TextTool with only part JavaScript can end up conceptually as:

```text
BaseTool scans sourceConfig without text
→ sourceConfig cached as hasJavascript = false

TextTool mutates the same sourceConfig object
→ sourceConfig.text now contains JavaScript

later:
templates.hasJavascriptTemplates(tool.sourceConfig)
→ cached false
```

The current Text execution still works because part scheduling uses
`textPartsHaveJavascript`.

The problem is narrower: the **complete canonical `sourceConfig` object carries
stale JavaScript metadata** if any generic caller later inspects it.

That is inconsistent with the meaning of the Templates cache, which describes a
finalized configuration object.

## Recommended change

Do not rescan or add another stored flag.

Instead, avoid mutating the already-scanned object identity after BaseTool has
captured its outer JavaScript metadata.

For example:

```js
const text = structuredClone(sourceTextParts);

this.sourceConfig = {
  ...this.sourceConfig,
  text,
};

this.textPartsHaveJavascript = text.some(
  (part) => this.templates.hasJavascriptTemplates(part),
);
```

This keeps the required semantics:

```text
this.hasJavascript
    remains the already-established outer scheduling signal

this.textPartsHaveJavascript
    remains the independent part scheduling signal

this.sourceConfig
    becomes the complete canonical source object
```

Because the final `sourceConfig` has a new object identity, a later generic
`hasJavascriptTemplates(sourceConfig)` call will scan the complete source and
correctly see part JavaScript.

## Required regression test

Add one focused case:

```text
outer JavaScript: false
part JavaScript:  true
```

and verify:

```js
tool.hasJavascript === false;
tool.textPartsHaveJavascript === true;
templates.hasJavascriptTemplates(tool.sourceConfig) === true;
```

Also retain the existing proof that outer evaluation does not receive or
recursively evaluate `sourceConfig.text`.

## Classification

```text
ADAPT
```

This is not a functional Text rendering defect and does not require changing the
approved two-phase evaluation architecture.

---

# 2. KEEP — BaseTool pre-publication completion boundary

The new BaseTool hook:

```js
completeRuntimeConfig(newConfig)
```

is correctly located in the runtime configuration route.

It is not dispatched virtually from the BaseTool constructor.

Ordinary tools retain the simple route:

```text
sourceConfig
→ optional evaluation
→ translation
→ completeRuntimeConfig()
→ this.config
```

TextTool uses the hook only because its parts require a second evaluation
context.

No second BaseTool evaluator has been copied into TextTool.

Classification:

```text
KEEP
```

---

# 3. KEEP — One Text source configuration and one current configuration

The previous persistent owners:

```text
sourceTextParts
activeTextParts
activeTextPartsSignature
```

are removed.

The new route is:

```text
sourceConfig.text
→ part evaluation
→ config.text
```

Displayed output is separate:

```text
runtime.textParts
```

There is no persistent `activeTextConfig`, `runtimeTextConfig`,
`outerSourceConfig`, or equivalent second general configuration object.

Classification:

```text
KEEP
```

---

# 4. KEEP — Outer and part JavaScript remain separate evaluation phases

TextTool creates a local outer projection:

```js
const outerSource = { ...this.sourceConfig };
delete outerSource.text;
```

and supplies that projection to the BaseTool runtime evaluator.

This prevents Text-part templates from being recursively evaluated with the
outer TextTool context.

Text parts are evaluated separately with their own effective:

```text
id
entity_index
inline source binding
item context
```

This matches the approved Plan 16B rule:

```text
two evaluation phases are valid;
two persistent configuration owners are not
```

Classification:

```text
KEEP
```

---

# 5. KEEP — Inline source binding moved out of `setState()`

The implementation preserves the required order:

```text
outer evaluation
→ inline source-tool config update
→ part evaluation
→ evaluated entity-index binding
→ complete config.text
→ publish this.config
→ setState()
```

`setState()` now consumes the completed binding instead of assigning:

```js
sourceTool.entity_index
sourceTool.config.entity_index
```

during runtime state processing.

The focused Text lifecycle tests cover the initial and successive binding order.

Classification:

```text
KEEP
```

---

# 6. KEEP — Common entity context moved to `runtime`

BaseTool now initializes:

```js
this.runtime = {
  entity: undefined,
  entityConfig: undefined,
};
```

and `setState()` publishes:

```js
this.runtime.entity
this.runtime.entityConfig
```

Name, Area, State and Icon extend that common runtime object instead of replacing
it.

Controls, Horseshoe and Sparkline mechanical consumers were updated without
introducing compatibility getters or duplicate old/new entity fields.

Sparkline series-item:

```text
item.entity
item.entityConfig
```

remains separate domain data as planned.

Horseshoe's:

```text
runtimeConfig
activeItemConfig
```

also remains intentionally staged until Plan 19.

Classification:

```text
KEEP
```

---

# 7. KEEP — Text runtime and geometry ownership

Text runtime output now lives under:

```text
runtime.textParts
runtime.widthMeasurementParts
runtime.widthOverflowParts
```

Derived Text geometry now lives under:

```text
geometry.svg
geometry.textFitScale
geometry.characterWidthFactor
geometry.textFontSize
geometry.estimatedWidth
geometry.estimatedHeight
geometry.measuredWidth
geometry.measuredHeight
geometry.measuredXpos
geometry.measuredYpos
geometry.hasExactMeasurement
geometry.textMeasurementSignature
geometry.widthOverflowSourceSignature
geometry.widthOverflowMeasurementSignature
```

DOM references, animation-frame jobs, revisions, pending state and connection
state remain explicit lifecycle fields rather than being forced into geometry or
a generic cache/state wrapper.

Classification:

```text
KEEP
```

---

# 8. KEEP — Text geometry compatibility branch removed

`text-tool-geometry.js` now consumes canonical:

```js
tool.geometry
```

directly.

The old TextTool direct-field/config.svg compatibility path is gone.

The accessor remains useful for CardTools consumers that need estimated versus
exact text bounds.

Classification:

```text
KEEP
```

---

# 9. KEEP — Complete parent-paint replacement semantics

The Plan 15B/#841 contract remains intact:

```text
config.styles
    configured child styles

paint.styles
    complete parent-resolved replacement

paint.styles ?? config.styles
    input to the normal style cascade
```

TextTool's `setPaintStyles()` delegates to BaseTool and only adds measurement
invalidation.

Configured styles are not merged back into a parent replacement map.

Classification:

```text
KEEP
```

---

# 10. KEEP — Effective style measurement

Text measurement signatures now use rendered/effective Text-part styles rather
than only configured outer styles.

This covers font-metric changes caused by:

```text
outer paint
part styles
source styles
state/source presentation
color-stop result
animation styles
```

before color filtering.

The browser coverage verifies that:

- changing outer parent paint remeasures Text with unchanged displayed text;
- referenced source font changes remeasure Text with unchanged displayed text;
- Rectangle fit follows the corrected exact geometry;
- repeating the same effective paint does not continually restart width
  measurement.

Classification:

```text
KEEP
```

---

# 11. KEEP — Async Text measurement lifecycle

The implementation retains the established lifecycle ownership and algorithms:

```text
widthOverflowRevision
widthMeasurementScheduled
widthMeasurement
widthOverflowPending
textClosed
DOM measurement arrays
font settling
stale-result rejection
disconnect/reconnect handling
previous exact geometry while replacement measurement is pending
```

Wrap, ellipsis and fit calculations were not redesigned as part of the ownership
migration.

Classification:

```text
KEEP
```

---

# 12. KEEP — Color-stop staging remains bounded

Plan 16B does not perform the shared active color-stop owner cutover.

Existing storage and algorithms remain in place for compatibility with Controls,
Sparkline and Horseshoe.

No duplicate long-lived:

```text
config.colorstops
+
paint.colorStops
```

architecture was introduced.

The atomic cutover remains deferred to Plan 19.

Classification:

```text
KEEP
```

---

# 13. Verification reviewed

PR #848 records:

```text
522 Node tests passed
full lint passed
Rollup passed
50 affected browser cases:
  Chromium 18
  WebKit   18
  Firefox  14
user visual review: no deviation
```

The implementation review did not rely on those results alone.

The following source boundaries were independently inspected:

```text
BaseTool source/current publication
Text outer versus part evaluation
inline source configuration/binding
setState responsibilities
runtime entity migration
Text runtime/geometry ownership
text-tool-geometry compatibility removal
parent paint replacement
effective Text measurement
async width measurement lifecycle
Sparkline/Horseshoe staging
```

No additional concrete defect was found.

---

# 14. Final status

```text
BLOCKING: 0
REWORK:   0
ADAPT:    1
KEEP:     remaining implementation
```

The one remaining ADAPT is deliberately small:

> avoid mutating the already JavaScript-scanned `sourceConfig` object when
> Text parts are attached, so the final canonical source has correct Templates
> JavaScript metadata.

After that correction and its focused regression test, Plan 16B can be
considered fully closed from this implementation review.
