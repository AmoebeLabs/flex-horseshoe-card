---
template: main.html
title: Dynamic configuration
description: Reuse values, calculate layout dimensions, and respond to entity states in Flexible Horseshoe Card YAML.
tags:
  - Dynamic configuration
  - Templates
---
# Dynamic configuration

Most card configuration can stay as normal fixed YAML. Dynamic configuration is only needed when a value must be calculated, reused, or changed from live Home Assistant data while the card is running.

This page is a short guide to the available methods and points you to JavaScript templates, Reuse, or card templates depending on what you want to change.

## :material-horseshoe: Change a value when an entity changes

Use a [JavaScript template](javascript-templates.md) when a label, style, position, visibility setting, chart type, or another supported value should respond to a state or attribute.

## :material-horseshoe: Reuse a fixed value or block

Use [Reuse](../reuse/reuse-introduction.md) for fixed shared values, copied items, calculated positions, and complete card templates. Those values do not need JavaScript simply because they are reused.

## :material-horseshoe: Related

- [JavaScript templates](javascript-templates.md)
- [Reuse](../reuse/reuse-introduction.md)
- [Visibility](../interaction/visibility.md)
