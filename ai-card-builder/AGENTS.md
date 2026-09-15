# Flexible Horseshoe Card — AI card builder

This directory contains the authoritative machine-readable authoring contract for Flexible Horseshoe Card (FHS).

## Version selection

Always use the highest numeric version for which both files exist in this directory:

- `fhs.schema.vN.json`
- `fhs.authoring.vN.json`

The schema and authoring file must use the same version number. If v9 and v10 are both present, use v10. Only use an older version when the user explicitly requests that version.

## Source of truth

When creating, modifying, reviewing, or explaining FHS YAML:

1. Use the matching `fhs.schema.vN.json` as the authoritative public syntax and structure contract.
2. Use schema `description` fields to understand the meaning of fields.
3. Use top-level `x-fhs-relationships` to understand functional dependencies: inheritance, activation, overrides, fallbacks, references, providers, and effects.
4. Use `fhs.authoring.vN.json` for preferred authoring patterns where several valid public forms exist.
5. Treat runtime/design behavior explicitly described by these files as authoritative for authoring.

A field being structurally valid does not mean it has an effect by itself. Evaluate the relevant relationships before generating or changing YAML.

## Do not mix card syntaxes

Do not infer FHS syntax from other Home Assistant cards or from examples that conflict with the supplied FHS contract. In particular, do not mix in syntax from Swiss Army Knife Card, Mushroom, button-card, gauge cards, or unrelated custom cards.

Do not invent fields, nesting, modes, or relationships. If requested behavior cannot be derived from the supplied FHS schema, descriptions, authoring metadata, or relationships, say that it is not established by the supplied FHS definition.

## Existing FHS cards

When the user supplies an existing FHS card:

- preserve valid working configuration unless the requested change requires changing it;
- make the smallest coherent change that satisfies the request;
- preserve existing entities, item ids, templates, groups, positions, styles, and reuse patterns where possible;
- extend the existing structure instead of rebuilding the whole card in a different style;
- use the existing card as context for its visual language and layout, while the schema remains the authority for what is valid.

## Reuse and inheritance

Resolve the relationship graph before duplicating configuration. Prefer existing FHS reuse mechanisms and inherited configuration when applicable, including templates, constants, `same_as`, `ref()`, and `calc()`.

Entity-level configuration can intentionally supply behavior to multiple layout items. For example, a color-stop-aware item may consume entity-level `color_stops` through `entity_index` when its corresponding `show` mode activates color-stop rendering. Do not copy shared configuration locally unless an override is actually wanted.

When a reusable color-stop model also defines its numeric domain, prefer the explicit reusable form with `color_stops.scales.default` and `colors`. Compact color-stop mappings/lists remain valid when accepted by the schema.

## YAML output

Generate plain Home Assistant YAML. Do not use YAML anchors or aliases unless the user explicitly requests them.

Prefer current, non-deprecated public fields. Do not replace valid FHS reuse syntax with a different mechanism merely because another form is also possible.

## Explanations

When useful, explain why a generated change is correct by identifying the relevant FHS field or relationship. This is especially useful for interactions such as activation, inheritance, fallback, or override behavior.

Distinguish between:

- FHS-defined behavior;
- FHS defaults and fallbacks;
- authoring choices such as positions, spacing, dimensions, and visual balance.

A reasonable visual choice may be useful without being a rule imposed by the schema.
