---
template: main.html
title: Introduction to the Flexible Horseshoe Card
description: Introduction to the Flexible Horseshoe Card for Home Assistant.
tags:
  - Introduction
---

# Introduction to the Flexible Horseshoe Card

The Flexible Horseshoe Card is a highly configurable Lovelace card for Home Assistant. It can display data from entities and attributes and turn that data into visual, compact, and fully customized dashboard cards.

At its core, the card shows one or more horseshoes that fill based on an entity state. The fill can use fixed colors, color stops, or gradients, depending on the configured minimum and maximum values. Around that horseshoe, you can add names, states, icons, labels, circles, horizontal and vertical lines, areas, and other visual elements.

The goal of the card is simple: give you full control over how your data is displayed.

## :material-horseshoe: Why use this card?

Many Home Assistant cards are easy to configure, but limited in layout. The Flexible Horseshoe Card takes a different approach. It gives you a layout system where you decide what appears on the card and where it should be placed.

You can create a simple card with one horseshoe and one value, or build a more advanced dashboard element with multiple entities, grouped values, icons, separators, dynamic styling, animations, and reusable configuration blocks.

This makes the card useful for many types of dashboards, such as:

- energy monitoring
- battery status
- solar production
- temperature and humidity
- device or room status
- network, system, or sensor dashboards
- any other entity where a visual gauge makes sense

## :material-horseshoe: What can you add to a card?

A card can contain much more than a single horseshoe. You can add as many layout items as you need, including:

- entities and attributes
- one or more horseshoes
- states, names, icons, and areas
- circles, horizontal lines, and vertical lines
- color stops and gradients
- custom styles
- animations and dynamic behavior
- JavaScript templates
- reusable YAML with `same_as`, `constants`, `ref()`, and `calc()`

Each item can be positioned individually on the card. For larger layouts, items can also be placed in groups, so related elements can be moved, scaled, or rotated together.

## :material-horseshoe: Flexible layout

The main strength of the Flexible Horseshoe Card is its layout flexibility.

Instead of choosing from a fixed set of predefined layouts, you define the position and appearance of each item yourself. This means you can decide exactly where a state value appears, where an icon should be placed, how large a horseshoe should be, where labels should go, and how visual separators should be drawn.

This gives you the freedom to create cards that match your own dashboard style instead of adapting your dashboard to a fixed card layout.

## :material-horseshoe: Styling and color behavior

The card supports several ways to style visual elements.

You can use a single fixed color, define color stops based on the entity value, or use gradients for smoother transitions. Color stops can be used not only for horseshoes, but also for other layout items such as icons, lines, circles, names, states, and areas.

The card also works well with Home Assistant themes and can use external JSON palettes, including light and dark mode variants.

## :material-horseshoe: Dynamic cards with templates

For static layouts, normal YAML is often enough. When you need behavior that changes based on entity states, you can use JavaScript templates.

Templates can be used to dynamically change styles, icons, colors, entity settings, and other parts of the card configuration. This makes it possible to create cards that react visually when values change.

For example, you can change an icon, apply a CSS animation, highlight a value, or adjust styling based on the current state of an entity.

## :material-horseshoe: Less YAML for larger cards

Advanced cards can grow quickly. A layout with multiple horseshoes, repeated lines, grouped labels, icons, states, and shared styles can easily become a lot of YAML.

To make larger cards easier to maintain, the card includes static reuse features:

- use `same_as` to reuse similar items
- use `same_as_d...` to apply numeric offsets
- use `constants` for shared values or style blocks
- use `ref()` to copy constants into the configuration
- use `calc()` to calculate static positions and sizes

These features help reduce repeated YAML and make later changes faster and safer.

## :material-horseshoe: Home Assistant integration

The Flexible Horseshoe Card is built for Home Assistant. It can use entity names, units, icons, areas, attributes, localization, state colors, actions, and theme variables.

You can keep the default Home Assistant values where they make sense, or override them in the card configuration when you need more control.

## :material-horseshoe: Backwards compatibility

The refreshed horseshoe implementation remains compatible with the original horseshoe YAML configuration. Existing cards should continue to work without changes.

CSS or card-mod customizations that target the previous internal HTML or SVG structure may need adjustment.

## :material-horseshoe: Where to go next

If you are new to the card, start with the installation guide and then explore the basic examples.

Once you understand the structure, the feature pages explain the main building blocks in more detail:

- entities
- horseshoes
- layout sections
- color stops
- styling
- templating
- reuse
- examples