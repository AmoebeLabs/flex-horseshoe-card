---
template: main.html
title: Introduction to the Flexible Horseshoe Card
description: Create compact Home Assistant cards with horseshoes, entity values, history graphs, controls, and reusable layouts.
tags:
  - Introduction
---
# Introduction to the Flexible Horseshoe Card

Flexible Horseshoe Card is a Home Assistant dashboard card for building compact visual cards from the pieces you need. A card can combine current values, names, icons, shapes, Horseshoe gauges, history graphs, and interactive controls in one layout.

This introduction shows how those pieces fit together and where to start when you want to build your first card.

## :material-horseshoe: What you can build

Use Flexible Horseshoe Card when you want to:

- show one or more Home Assistant entities;
- show a value on a Horseshoe gauge;
- show history as a Sparkline graph;
- combine values, icons, text, and shapes in one card;
- add buttons, toggles, selectors, number controls, or sliders;
- reuse the same design for other entities.

The [Examples](../examples/overview.md) show complete cards built from these pieces.

## :material-horseshoe: Place things where you want them

Every visible item has its own position. A normal square card uses a `0` to `100` coordinate system, with `50, 50` in the center.

You can place items individually or put related items in a group and move them together.

See [Positioning and sizing](../card-basics/positioning-and-sizing.md) and [Groups](../card-basics/groups.md).

## :material-horseshoe: Use Home Assistant information

Add Home Assistant entities under `entities:`. The card can use their state, name, area, icon, unit, precision, and localization.

You normally only override those values when this card should show something differently.

See [Entities](../card-basics/entities.md).

## :material-horseshoe: Reuse a design

When several cards or items use the same design, you do not have to repeat the complete YAML. The card can reuse an item, shared settings, or a complete card template.

See [Reuse](../reuse/reuse-introduction.md).

## :material-horseshoe: Start here

1. [Install Flexible Horseshoe Card](installation.md).
2. [Create your first card](your-first-card.md).
3. Use [Card tools](../tools/tools-overview.md) to add the information or control you need.
