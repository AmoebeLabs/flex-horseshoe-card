---
template: main.html
title: Card templates
description: Reuse complete Flexible Horseshoe Card designs and shared configuration across a dashboard.
tags:
  - Card templates
  - Reuse
---

# Card templates

Card templates let you define a card design once and use it with different entities, labels, scales, or other values.

Use a template when several cards share the same structure. Use [`same_as`](../reuse/reuse-with-same_as.md) when repetition only occurs inside one card.

## :material-horseshoe: Template catalogs

FHS reads two Lovelace template catalogs:

| Catalog | Use |
| --- | --- |
| `fhs_sys_templates` | Templates supplied and maintained with your FHS setup |
| `fhs_user_templates` | Your own templates and overrides |

A user template with the same name takes priority over a system template.

Templates can be available to one view or to the complete dashboard.

## :material-horseshoe: Continue

- [Using card templates](using-card-templates.md)
- [Template variables](template-variables.md)
- [JavaScript templates](../dynamic/javascript-templates.md)
