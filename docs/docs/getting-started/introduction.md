---
template: main.html
title: Introduction to the Flexible Horseshoe Card
description: Learn how the Flexible Horseshoe Card combines flexible layouts, entity data, styling, animations, templates, and reusable YAML in Home Assistant.
tags:
- Introduction
---

# Introduction to the Flexible Horseshoe Card

The Flexible Horseshoe Card is a highly configurable Lovelace card for Home Assistant. It turns entity states and attributes into compact, visual dashboard cards that you can arrange and style in detail.

At its core, the card can display one or more horseshoe gauges that fill according to an entity state. Each gauge can use fixed colors, color stops, or gradients based on its configured value range. Around the gauge, you can add names, states, icons, labels, circles, horizontal and vertical lines, areas, and other visual elements.

The goal is simple: give you precise control over how Home Assistant data appears on your dashboard.

## :material-horseshoe: Why use this card?

Many Home Assistant cards are quick to configure but offer only limited control over layout. The Flexible Horseshoe Card takes a different approach by letting you decide which elements appear and where they are placed.

You can build a simple card with one gauge and one value, or create a more detailed dashboard component with multiple entities, grouped values, icons, separators, dynamic styling, animations, and reusable configuration.

This makes the card suitable for many types of dashboards, including:

* energy consumption and production
* battery levels
* temperature and humidity
* device or room status
* network and system monitoring
* sensor dashboards
* any entity that benefits from a visual gauge

## :material-horseshoe: What can you add to a card?

A card can contain much more than a single horseshoe. Available elements and features include:

* entities and attributes
* one or more horseshoe gauges
* states, names, icons, and areas
* circles, horizontal lines, and vertical lines
* color stops and gradients
* custom CSS and SVG styles
* animations and state-based behavior
* JavaScript templates
* reusable YAML with `same_as`, `constants`, `ref()`, and `calc()`

Each item can be positioned independently. For more complex layouts, related elements can also be placed in groups so they can move, scale, or rotate together.

## :material-horseshoe: Flexible layout

Layout flexibility is one of the card’s main strengths.

Instead of choosing from a fixed set of predefined designs, you control the position and appearance of each item. You decide where a state value appears, where an icon belongs, how large a horseshoe should be, where labels are placed, and how separators or decorative shapes are drawn.

This makes it possible to create cards that follow your dashboard design rather than adapting your dashboard to a fixed card layout.

## :material-horseshoe: Styling and color behavior

The card supports several approaches to styling.

You can apply a single fixed color, use value-based color stops, or create smooth gradients across a range. Color stops are not limited to horseshoes; they can also affect icons, lines, circles, names, states, areas, and other supported elements.

The card works with Home Assistant themes and can also load external JSON palettes, including separate light and dark mode colors.

## :material-horseshoe: Dynamic cards with templates

Normal YAML is often enough for fixed layouts. When the card needs to react to entity states, JavaScript templates can provide dynamic behavior.

Templates can change styles, icons, colors, entity settings, and other configuration values at runtime. This allows the card to respond visually as entity values change.

For example, a template can:

* replace an icon
* apply a CSS animation
* highlight a value
* change a color or style
* adjust an element based on the current entity state

## :material-horseshoe: Less YAML for larger cards

Complex cards can quickly grow into long configurations. Repeated horseshoes, lines, labels, icons, states, and shared styles can all add significant duplication.

The card includes several static reuse features to keep larger configurations manageable:

* use `same_as` to reuse an earlier item
* use `same_as_d...` to apply a numeric offset
* use `constants` for shared values and configuration fragments
* use `ref()` to insert a constant elsewhere
* use `calc()` to calculate static positions, sizes, and spacing

These features reduce repeated YAML and make broad changes easier and safer to apply.

## :material-horseshoe: Home Assistant integration

The Flexible Horseshoe Card is designed specifically for Home Assistant.

It can use entity names, units, icons, areas, attributes, localization, state colors, actions, and theme variables. Default Home Assistant values can be kept where they fit, or overridden in the card configuration when more control is needed.

## :material-horseshoe: Backwards compatibility

The refreshed horseshoe implementation remains compatible with the original horseshoe YAML configuration. Existing cards should continue to work without changes.

Custom CSS or card-mod rules that target the previous internal HTML or SVG structure may need to be updated.

## :material-horseshoe: Where to go next

Start with the installation guide, then explore the basic examples and the feature pages that match the card you want to build:

* [Installation](installation.md)
* [Entity Definitions](../core-concepts/entity-definitions.md)
* [Horseshoe Gauges](../sections/horseshoes-section.md)
* [Layout Overview](../sections/layout-overview.md)
* [Color Stops](../core-concepts/color-stops.md)
* [CSS Styling](../core-concepts/css-styling.md)
* [Templating](../core-concepts/templating.md)
* [Reuse](../reuse/reuse-introduction.md)
* [Examples](../examples/overview.md)
