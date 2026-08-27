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
The card started with the horseshoe gauge shown in the second image below.

Horseshoes can have different sizes and radii, with detailed tick marks and labels.

![Flexible Horseshoe Examples Overview](../assets/screenshots/fhs-horseshoe-examples-overview.png)

More specialized horseshoes can also show non-numerical states, as in this Kleenex Pollen Radar example:

![Kleenex Pollen Radar card with horseshoe gauges for textual pollen states](../assets/screenshots/fhs-demo-card-55-kleenex-pollen-radar--dark.webp)

Sparkline graphs show current and historical values over time. [Several graph types](../tools/sparkline/sparkline-overview.md) are available.

![Awair study temperature history shown as a daily area chart](../assets/screenshots/fhs-demo-card-study-temperature-area-day--dark.webp)

The card also supports [`tap actions`](../interaction/interaction-overview.md) for interactions such as switching a light or opening more information about a value. [Predefined controls](../tools/controls/controls-overview.md) let people make choices or change values directly in the card.

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
