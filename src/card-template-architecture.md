# Flexible Horseshoe Card - Card Templates

## Goal

Card templates should remove repeated YAML without introducing a second render model.

A template is reusable FHS configuration. After template expansion the card must look like a normal FHS config and continue through the existing pipeline:

```text
input config
-> card template expansion
-> ids
-> constants / ref / calc
-> same_as
-> groups
-> tools
-> render
```

That order matters. Templates should not know how horseshoes, states, icons, lines, rectangles or labels render. They only create ordinary config.

## Composition Direction

Keep the model simple:

```text
template = fills the config of the current card
cards    = creates and positions child cards
```

A card config is the same whether it is used directly in Lovelace or inside `cards[]`.

Root card:

```yaml
type: custom:flex-horseshoe-card
template: awair_tile
entities:
  - entity: sensor.awair_score
```

Child card inside another FHS card:

```yaml
type: custom:flex-horseshoe-card
cards:
  - type: custom:flex-horseshoe-card
    template: awair_tile
    xpos: 25
    ypos: 50
    width: 40
    height: 40
    entities:
      - entity: sensor.awair_score
```

The child card receives its own config and runs its own normal lifecycle. Its `template` is handled by that child card exactly the same way as a standalone card handles `template`.

The parent does not expand a child FHS card into its own root layout. The parent only creates and positions child cards.

The parent must not become a pass-through layer for child internals. It should not remap child entities, rewrite child layout sections, compile child `same_as`, or calculate child refs/calc values. The child card owns that work through its own `setConfig()` pipeline.

Every entry in `cards[]` uses the same placement fields:

```yaml
xpos:
ypos:
width:
height:
zpos:
```

Those fields belong to `cards[]` only. They do not belong to a normal root-level `template`, because a root-level template fills the current card and does not create a positioned child.

## Card Creation

`cards[]` always means create a child card.

The child card can be FHS or any other Lovelace card. The parent should use the Home Assistant card helper for all child cards:

```js
const helpers = await window.loadCardHelpers();
const cardElement = await helpers.createCardElement(childConfig);
cardElement.hass = hass;
```

This keeps FHS child cards and external child cards on the same architecture:

```text
parent cards[] item
-> child config
-> Home Assistant helper creates child card
-> parent positions child card wrapper
-> child card handles its own setConfig(), template, hass and render
```

For FHS child cards, the only extra thing the parent may add is an embedded/frameless flag in the child config before creating it, so the child does not render a second visible card shell.

## Template Scope

Templates should be usable where users naturally maintain reusable dashboard config. Preferred scopes:

```yaml
# Dashboard or view level when Home Assistant passes that config through.
fhs_templates: !include fhs_templates.yaml

# Card level fallback, always available because it is inside this card config.
type: custom:flex-horseshoe-card
fhs_templates: !include fhs_templates.yaml
```

The implementation should treat `fhs_templates` as a dictionary that is available before card template expansion starts. If Home Assistant does not expose dashboard/view-level custom keys to the card instance, then card-level `fhs_templates` remains the supported fallback.

No different template syntax should be introduced for different scopes. A template named `awair_tile` must look the same whether it came from dashboard, view or card config.

## Template Definition

Templates can live in an `fhs_templates` section:

```yaml
fhs_templates:
  awair_tile:
    constants:
      radius: 40
      state_y: 55
      name_y: 68

    color_stops: ref(awair_score_colorstops)

    layout:
      groups:
        tile:
          xpos: 50
          ypos: 50

      rectangles:
        - id: bg
          group: tile
          xpos: 50
          ypos: 50
          width: 42
          height: 42
          radius: 4

      horseshoes:
        - id: gauge
          group: tile
          entity_index: 0
          radius: calc(radius)

      states:
        - id: state
          group: tile
          entity_index: 0
          xpos: 50
          ypos: calc(state_y)

      names:
        - id: name
          group: tile
          entity_index: 0
          xpos: 50
          ypos: calc(name_y)
```

A template may contain the same reusable parts as a card:

```yaml
constants:
palettes:
color_stops:
color_filter:
styles:
layout:
```

The instance supplies the data and placement:

```yaml
cards:
  - template: awair_tile
    id: voc
    xpos: 75
    ypos: 50
    entities:
      - entity: sensor.awair_voc
    color_stops: ref(awair_voc_colorstops)
```

## Template Input

FHS must understand `template:` itself before the normal config pipeline continues.

`variables` stays, but only as template input. This matches how template systems normally work.

The old use of `variables` as a general JavaScript-template value store should disappear. Values that are fixed/reused inside the card move to `constants`.

Use `variables` for values supplied by the root template use or by a `cards[]` template instance. Use `constants` for fixed reusable values inside the template/card.

```yaml
fhs_templates:
  awair_tile:
    constants:
      label: VOC
      state_y: 55

    layout:
      names:
        - id: name
          text: calc(label)
          ypos: calc(state_y)
```

Instance override:

```yaml
cards:
  - template: awair_tile
    id: voc
    constants:
      label: VOC
```

Rule:

```text
constants = fixed reusable values owned by the template/card
variables = template input supplied by root template use or cards[] instance
```

## Card Instance Placement Uses Groups

A template instance should be positioned by an automatically created group.

Example:

```yaml
cards:
  - template: awair_tile
    id: voc
    xpos: 75
    ypos: 50
```

The template expander creates a group for this instance, for example:

```yaml
layout:
  groups:
    card_voc:
      xpos: 75
      ypos: 50
```

All layout items expanded from the template are placed under that group unless they already specify a more specific generated child group.

The normal group rule remains unchanged:

```text
50,50 is the local center
parent.x + child.x - 50 gives the effective x
parent.y + child.y - 50 gives the effective y
```

This keeps card placement consistent with the existing group tree. No separate card-position math is needed.

## Group Namespacing

Template groups must be namespaced per instance so multiple copies do not collide.

Template:

```yaml
layout:
  groups:
    tile:
      xpos: 50
      ypos: 50
```

Instance:

```yaml
cards:
  - template: awair_tile
    id: voc
```

Expanded group ids:

```yaml
layout:
  groups:
    card_voc:
      xpos: 75
      ypos: 50

    card_voc_tile:
      parent: card_voc
      xpos: 50
      ypos: 50
```

Expanded items that used `group: tile` become:

```yaml
group: card_voc_tile
```

Items without a group get:

```yaml
group: card_voc
```

That makes the complete template movable as one unit.

## Entity Index Mapping

Inside a template, `entity_index` is local to the template instance.

Template:

```yaml
layout:
  states:
    - id: state
      entity_index: 0
```

Instance:

```yaml
cards:
  - template: awair_tile
    id: voc
    entities:
      - entity: sensor.awair_voc
```

During expansion:

1. The instance entities are appended to the root `entities` list.
2. The template layout entity indexes are shifted by the append position.

So if the root already has 4 entities, template `entity_index: 0` becomes root `entity_index: 4`.

This keeps all tools unchanged. Tools still receive a normal global `entity_index` after expansion.

## Item Id Namespacing

Layout item ids must also be namespaced per instance so `same_as` stays local and predictable.

Template:

```yaml
layout:
  rectangles:
    - id: bg
    - id: fg
      same_as: bg
```

Instance id:

```yaml
id: voc
```

Expanded:

```yaml
layout:
  rectangles:
    - id: voc_bg
    - id: voc_fg
      same_as: voc_bg
```

The same rule applies to every layout section.

## same_as Belongs In Its Own Module

The current same_as logic is central config logic. It should move from `main.js` to a dedicated module, for example:

```text
same-as.js
```

Use clear function names. Avoid vague names such as `resolveSomething()`.

Suggested API:

```js
SameAs.applyToLayout(config);
SameAs.applyToItems(items);
SameAs.applyDeltas(item, mergedItem, index);
SameAs.deleteReplacePath(baseForMerge, fieldPath);
```

The current behavior should move there unchanged:

- same section lookup by previous item id;
- `same_as_replace`;
- dot-path replacement;
- implicit full replacement for direct `ref(...)` values;
- `same_as_d...` numeric deltas;
- cleanup of `same_as`, `same_as_replace` and delta fields.

This allows card templates to use the same code when needed:

```js
SameAs.applyToTemplate(templateConfig);
SameAs.applyToLayout(cardConfig);
```

No duplicate same_as implementation should be added for templates.

## Template Expansion Module

Template expansion should also live outside `main.js`.

Suggested file:

```text
card-templates.js
```

Suggested API:

```js
CardTemplates.expand(config);
```

That function performs the whole template expansion step before the normal config pipeline continues.

Linear flow inside `CardTemplates.expand(config)`:

1. Read `config.fhs_templates`.
2. Read `config.cards`.
3. For each card instance, copy the selected template.
4. Merge template config with instance config, where the instance wins.
5. Append instance entities to root `entities` and remember the entity index offset.
6. Namespace layout group ids and item ids with the instance id.
7. Shift `entity_index` values by the entity offset.
8. Create the instance root group from `xpos`, `ypos`, `scale`, `rotate` and `flip` when supported by groups.
9. Append the expanded layout sections to the root layout sections.
10. Merge reusable sections such as constants, palettes, color stops, styles and filters into the root config.
11. Remove `cards` from the final config or keep it only for debug; tools should not see it.

After this step, the rest of the card should not know templates existed.

## Merge Rules

Template expansion is not the same as `same_as`.

Template merge is card-level config merge:

```text
template config + instance config = instance card config
```

The instance wins.

Lists in layout sections should not be merged by index. They are concatenated after namespacing.

Reusable dictionaries are merged by key:

```yaml
constants:
palettes:
color_stops:
styles:
color_filter:
```

Direct `ref(...)` replacement remains handled by the existing ref/same_as behavior later in the pipeline. Do not duplicate that logic in the template module.

## Processing Order

The final FHS `setConfig()` order should become:

```text
clone config
CardTemplates.compile(config)
assign layout ids
build constants
replace static refs
calculate static values
SameAs.compile(config)
template context setup
entity config processing
normal tool setup
```

The current implementation already has most of this order. The new work is to compile the current card's `template` before ids, refs, calc and same_as. A child FHS card created through `cards[]` runs this same `setConfig()` flow for itself.

That keeps templates able to contain:

```yaml
same_as:
ref(...)
calc(...)
```

without adding special behavior.

## Compatibility

This is allowed to be a breaking change during dev releases. The old generic JavaScript-oriented `variables` behavior should be removed. `variables` becomes template input only. Fixed/reused values should use `constants`.

Existing cards without `cards` and without `template` should continue to work as long as they do not depend on old non-template `variables`.

Existing layout sections continue to be the source of truth.

Template support only adds a preprocessing step that produces those same layout sections.

## Child Card Hosting

Child card hosting belongs under the top-level `cards` section, not under a separate `child_cards` name. Every entry is a child card config plus placement.

```yaml
cards:
  - type: custom:swiss-army-knife-card
    xpos: 50
    ypos: 50
    width: 80
    height: 40
    template: graph_small
    entities:
      - entity: sensor.energy_today
```

FHS should create external cards through the Home Assistant card helper, the same basic route Home Assistant uses for stack cards. FHS then forwards `hass` and positions the created card in a hard wrapper `div`.

The wrapper is an absolutely positioned box inside the parent card. The same 0..100 coordinate model can be used:

```text
left   = xpos - width / 2
top    = ypos - height / 2
width  = width
height = height
z-index = zpos
```

So external card placement does not need SVG math. It is a normal positioned HTML layer over the FHS card.

The parent can still use the same placement vocabulary:

```yaml
xpos:
ypos:
width:
height:
zpos:
```

For all child cards, placement becomes wrapper CSS. Same user-facing fields, same positioning semantics.

## External Card Creation

Child cards should be created with the Home Assistant card helper. Do not manually guess custom element names from `type`.

Implementation direction:

```js
const helpers = await window.loadCardHelpers();
const cardElement = await helpers.createCardElement(childConfig);
cardElement.hass = hass;
```

The created element is placed inside the positioned wrapper. On every parent `hass` update, FHS forwards the new `hass` object to each child card.

## External Card Shell

Child cards should support a frameless mode controlled by FHS.

Default for child cards inside FHS should be frameless unless explicitly disabled. The wrapper can expose a class such as:

```html
<div class="fhs-child-card fhs-child-card--frameless">
  <hui-card-or-custom-card></hui-card-or-custom-card>
</div>
```

After the helper-created card has rendered, FHS can look for the visible `ha-card` shell in the child card render tree and neutralize it. This is the same practical problem stack-like cards deal with: the child card exists as a real card, but the parent wants composition without another card box.

The frameless styling should remove the visible shell when reachable:

```css
background: transparent;
border: 0;
box-shadow: none;
padding: 0;
```

This is best-effort for external cards. Some cards hide their `ha-card` deeper in shadow DOM or do not use `ha-card`. In that case FHS still positions the card, but cannot guarantee the shell can be removed.

FHS child cards can support this more cleanly because FHS can pass an embedded/frameless flag into its own config before `setConfig()`.

# Implementation Plan

## Step 1 - Move same_as To same-as.js

Goal: no behavior change.

Create:

```text
same-as.js
```

Move the current same_as logic out of `main.js` into one class:

```js
export default class SameAs {
  static compile(config) {}
  static compileItems(items) {}
  static applyDeltas(item, resolvedItem, index) {}
  static deleteReplacePath(baseForMerge, fieldPath) {}
  static mergeListByKey(baseList, overrideList, key) {}
}
```

Keep all current behavior exactly the same:

- item lookup by previous `id` inside the same layout section;
- `same_as`;
- `same_as_replace`;
- dot-path replacement;
- implicit full replacement for direct `ref(...)` values;
- `same_as_d...` numeric deltas;
- cleanup of `same_as`, `same_as_replace` and delta fields;
- same layout sections as today.

`main.js` should only call:

```js
SameAs.compile(config);
```

Build and test existing cards. Nothing should visually change.

## Step 2 - Rename Config Compile Functions

Goal: clearer names, no behavior change.

Rename vague functions in `main.js`:

```text
_resolveStaticRefs      -> _replaceStaticRefs
_resolveStaticRef       -> _replaceStaticRef
_evaluateStaticConfig   -> _calculateStaticValues
_evaluateStaticCalc     -> _calculateStaticCalc
_evaluateConstants      -> _buildConstants
```

Do not change behavior. Only names and comments.

The setConfig pipeline should read like what it does:

```js
const calcConstants = this._buildConstants(config);
this._replaceStaticRefs(config, config.constants);
this._calculateStaticValues(config, calcConstants);
SameAs.compile(config);
```

Build and test existing cards again.

## Step 3 - Add Root Template Support

Goal: support `template:` for the current card.

Create:

```text
card-templates.js
```

Add one class:

```js
export default class CardTemplates {
  static compile(config) {}
}
```

Rules:

- `template` fills the config of the current card;
- no child cards are created in this step;
- no position fields are involved;
- `variables` is template input;
- `constants` are fixed/reusable values;
- user/card config wins over template config;
- output is normal FHS config.

Pipeline:

```js
config = JSON.parse(JSON.stringify(config));
CardTemplates.compile(config);
this._assignSectionIds(config);
const calcConstants = this._buildConstants(config);
this._replaceStaticRefs(config, config.constants);
this._calculateStaticValues(config, calcConstants);
SameAs.compile(config);
```

Template lookup order:

1. card config `fhs_templates`;
2. dashboard/view templates if Home Assistant exposes them to the card;
3. otherwise no magic fallback.

Build and test:

```yaml
type: custom:flex-horseshoe-card
template: awair_full
entities:
  - entity: sensor.awair_score
```

This should behave exactly as if the template YAML had been pasted into the card.

## Step 4 - Add cards[] Child Card Creation

Goal: `cards[]` creates and positions normal Lovelace cards.

Create:

```text
child-cards.js
```

Add one class:

```js
export default class ChildCards {
  static setConfig(card, cardsConfig) {}
  static setHass(hass) {}
  static render() {}
}
```

Rules:

- every `cards[]` item is a normal card config plus placement fields;
- parent removes only placement fields from the config passed to Home Assistant;
- parent does not compile child `template`;
- parent does not remap child `entities`;
- parent does not touch child `layout`, `same_as`, `ref`, `calc`, color stops or filters;
- child card owns its own `setConfig()`, `hass` and render.

Placement fields:

```yaml
xpos:
ypos:
width:
height:
zpos:
```

No `position:` dict.

Child creation:

```js
const helpers = await window.loadCardHelpers();
const cardElement = await helpers.createCardElement(childConfig);
cardElement.hass = hass;
```

Wrapper behavior:

```text
left   = xpos - width / 2
top    = ypos - height / 2
width  = width
height = height
z-index = zpos or stable array order
```

The wrapper is an absolute `div` inside the parent card container. Values are percentages of that container.

Layering:

- without `zpos`: order in `cards[]`, later cards on top;
- with `zpos`: sort by `zpos`;
- equal `zpos`: keep original array order.

Build and test with:

```yaml
cards:
  - type: custom:flex-horseshoe-card
    template: awair_tile
    xpos: 25
    ypos: 50
    width: 40
    height: 40
    entities:
      - entity: sensor.awair_score

  - type: markdown
    xpos: 75
    ypos: 50
    width: 40
    height: 20
    content: test
```

## Step 5 - Frameless Child Card Shell

Goal: child cards can visually merge into the parent card.

Default child card mode should be frameless unless explicitly disabled.

The parent wrapper can mark child cards:

```html
<div class="fhs-child-card fhs-child-card--frameless">
```

After the helper-created card renders, try to neutralize the visible `ha-card` shell:

```css
background: transparent;
border: 0;
box-shadow: none;
padding: 0;
```

This is best-effort for external cards. FHS child cards can handle this better by receiving an embedded/frameless flag in their own config.

Build and test with FHS child cards, markdown cards and SAK cards.

## Step 6 - Documentation And Examples

Goal: make the user model obvious.

Document these rules first:

```text
template = config for this card
cards[]  = create and position cards
```

Examples should show:

- standalone FHS card with `template`;
- FHS card containing multiple FHS child cards;
- FHS card containing an external markdown card;
- FHS card containing SAK;
- `xpos/ypos/width/height/zpos` on `cards[]` only;
- `variables` as template input;
- `constants` as fixed/reusable values.

## Child Card Lifecycle

Home Assistant sets `hass` on the parent FHS card because that card is part of the Lovelace view tree.

Child cards created inside FHS are created by FHS, so Home Assistant does not directly manage those child card instances. FHS must therefore forward the normal card property:

```js
childCard.hass = hass;
```

That is the only normal runtime handoff.

FHS should not call Lit lifecycle methods on child cards:

```js
// Do not do this.
childCard.updated();
childCard.requestUpdate();
childCard.performUpdate();
childCard.render();
```

Lit and the child card handle their own lifecycle after the child card is in the DOM and receives `hass`.

The flow is:

```text
Home Assistant -> parent FHS.hass
parent FHS     -> childCard.hass
child card     -> own update/render lifecycle
```

When FHS needs to remove the child `ha-card` shell, it may wait for the child render to finish if the child exposes Lit's `updateComplete`:

```js
await childCard.updateComplete;
```

That wait is only for DOM inspection/styling after render. It is not lifecycle control.
