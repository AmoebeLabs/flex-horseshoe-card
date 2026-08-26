---
template: main.html
title: Introduction to the Flexible Horseshoe Card
description: Create compact Home Assistant cards with horseshoes, entity values, history graphs, shapes, controls, and reusable YAML.
tags:
  - Introduction
---

# Introduction to the Flexible Horseshoe Card

The Flexible Horseshoe Card turns Home Assistant entities into compact visual dashboard cards. Start with a horseshoe gauge, then add the values, icons, history, controls, and styling needed for your dashboard.

<!-- Add a representative card gallery here. -->

## :material-horseshoe: What you can create

Use FHS for cards such as:

- temperature, humidity, and air-quality gauges;
- electricity consumption and production;
- battery and device status;
- room and system summaries;
- compact history graphs;
- interactive cards with selectors, toggles, and sliders.

A card can be simple or combine several entities and visual tools.

## :material-horseshoe: Build the layout you need

Every tool has its own position and size. A card can contain:

- horseshoe gauges;
- entity states, names, areas, and icons;
- lines, circles, arcs, rectangles, and text;
- line, area, dots, bar, barcode, and other history charts;
- buttons, toggles, selects, number controls, and sliders.

Use groups to move related tools together.

## :material-horseshoe: Use Home Assistant data

FHS uses Home Assistant entity names, units, precision, icons, areas, locale, themes, and actions. Start with the entity's existing values and override only what needs to look different in this card.

## :material-horseshoe: Add colors and behavior

Use fixed styles for a quiet card or add:

- value- and state-based color stops;
- light and dark palettes;
- visibility rules;
- animations;
- tap, hold, and double-tap actions.

## :material-horseshoe: Keep larger cards manageable

For repeated layouts:

- reuse a tool with `same_as`;
- store shared values under `constants`;
- insert shared values with `ref()`;
- calculate positions and dimensions with `calc()`;
- define a card template for designs used several times.

## :material-horseshoe: Start here

1. [Install the card](installation.md).
2. [Build your first horseshoe](your-first-card.md).
3. [Choose card tools](../tools/tools-overview.md).
4. Explore the [examples](../examples/overview.md).
