---
template: main.html
title: Generated YAML Card Catalog
description: Copy-pasteable Flexible Horseshoe Card YAML examples covering simple cards, horseshoes, layout tools, actions, templates, slots, compounds, sparklines, and interactive dashboards.
tags:
  - Examples
  - YAML
  - Templates
  - Sparklines
---

# Generated YAML card catalog

This catalog contains standalone YAML cards that demonstrate the Flexible Horseshoe Card from a small sensor tile to a complete interactive dashboard. The files are intended to be copied into Lovelace and adapted to the entity names in your Home Assistant installation.

The examples use realistic Home Assistant entities such as Awair sensors, DSMR power readings and FHS local input entities. A card only needs the entities used by that example; the larger examples combine several of these patterns.

## Start small

Use [the basic state card](https://github.com/AmoebeLabs/flex-horseshoe-card/blob/master/examples/generated/01-basic-state.yaml) when you only need one formatted value. [The icon, name and state card](https://github.com/AmoebeLabs/flex-horseshoe-card/blob/master/examples/generated/02-icon-name-state.yaml) adds the common sensor presentation, while [the fixed horseshoe](https://github.com/AmoebeLabs/flex-horseshoe-card/blob/master/examples/generated/03-fixed-horseshoe.yaml) introduces a gauge without dynamic colors.

The color behavior is demonstrated separately by [color stops](https://github.com/AmoebeLabs/flex-horseshoe-card/blob/master/examples/generated/04-colorstop-horseshoe.yaml), [a continuous color-stop gradient](https://github.com/AmoebeLabs/flex-horseshoe-card/blob/master/examples/generated/05-gradient-horseshoe.yaml), [a bidirectional horseshoe](https://github.com/AmoebeLabs/flex-horseshoe-card/blob/master/examples/generated/06-bidirectional-horseshoe.yaml), and [ticks with an explicit scale](https://github.com/AmoebeLabs/flex-horseshoe-card/blob/master/examples/generated/07-horseshoe-ticks.yaml).

## Build the layout

[The shapes example](https://github.com/AmoebeLabs/flex-horseshoe-card/blob/master/examples/generated/08-shapes-layout.yaml) combines rectangles, circles and lines. [The multipart text example](https://github.com/AmoebeLabs/flex-horseshoe-card/blob/master/examples/generated/09-multipart-text.yaml) combines name, area and state parts in one TextTool. [The overflow example](https://github.com/AmoebeLabs/flex-horseshoe-card/blob/master/examples/generated/10-text-overflow.yaml) shows wrapping and fitting text inside a defined area.

[The animation example](https://github.com/AmoebeLabs/flex-horseshoe-card/blob/master/examples/generated/11-animated-state.yaml) shows how an entity update can animate a layout item. Use the [actions and local controls guide](../core-concepts/actions-and-local-controls.md) when a rectangle or text item should act as a dashboard control.

## Reuse and interaction

[The action button](https://github.com/AmoebeLabs/flex-horseshoe-card/blob/master/examples/generated/12-action-button.yaml) is the smallest local-control example. [The duration selector](https://github.com/AmoebeLabs/flex-horseshoe-card/blob/master/examples/generated/13-duration-selector.yaml) expands the idea into several buttons that update one FHS input entity.

[The template card](https://github.com/AmoebeLabs/flex-horseshoe-card/blob/master/examples/generated/14-template-card.yaml) uses the reusable definition in [generated-templates.yaml](https://github.com/AmoebeLabs/flex-horseshoe-card/blob/master/examples/generated/generated-templates.yaml). [Named slots](https://github.com/AmoebeLabs/flex-horseshoe-card/blob/master/examples/generated/15-slot-entities.yaml) keep entity references readable when a card contains several entity families. [The optional room list](https://github.com/AmoebeLabs/flex-horseshoe-card/blob/master/examples/generated/16-optional-room-list.yaml) demonstrates config-time removal with `disabled`.

[The compound button](https://github.com/AmoebeLabs/flex-horseshoe-card/blob/master/examples/generated/17-compound-button.yaml) keeps a rectangle and its label together. [The visibility example](https://github.com/AmoebeLabs/flex-horseshoe-card/blob/master/examples/generated/18-group-visibility-tabs.yaml) uses groups as runtime tabs without removing their configuration.

## Sparkline examples

[Rolling-window history](https://github.com/AmoebeLabs/flex-horseshoe-card/blob/master/examples/generated/19-sparkline-history.yaml) is the normal starting point. [Calendar history](https://github.com/AmoebeLabs/flex-horseshoe-card/blob/master/examples/generated/20-sparkline-calendar.yaml) compares a complete period. [The real-time bar](https://github.com/AmoebeLabs/flex-horseshoe-card/blob/master/examples/generated/21-sparkline-realtime-bar.yaml) and [equalizer](https://github.com/AmoebeLabs/flex-horseshoe-card/blob/master/examples/generated/22-sparkline-equalizer.yaml) show compact live-value displays.

[The specialized sparkline](https://github.com/AmoebeLabs/flex-horseshoe-card/blob/master/examples/generated/23-sparkline-specialized.yaml) uses a radial barcode, while [the multiple-sparkline card](https://github.com/AmoebeLabs/flex-horseshoe-card/blob/master/examples/generated/24-multiple-sparklines.yaml) places two independent history graphs in one card. For a video-friendly interactive tour, [the radial barcode showcase](https://github.com/AmoebeLabs/flex-horseshoe-card/blob/master/examples/generated/26-radial-barcode-showcase.yaml) switches variants and visualizations with local FHS input entities and uses runtime visibility to show the relevant control row.

## Larger compositions

[The mask and clip example](https://github.com/AmoebeLabs/flex-horseshoe-card/blob/master/examples/generated/25-mask-and-clip.yaml) provides a starting point for shaped compositions. The complete Awair-style dashboard remains the reference for combining templates, slots, optional rooms, compounds, local controls, dynamic entity selection, color-stop templates and synchronized history controls.

The [catalog demo view](https://github.com/AmoebeLabs/flex-horseshoe-card/blob/master/examples/view-fhs-generated-card-catalog.yaml) contains representative cards that can be loaded together for visual testing. The individual YAML files are the canonical versions and are easier to copy into a dashboard.

## Generation rules

When creating another card, start with the smallest matching example and extend it only where the requested behavior needs more structure:

- Keep a single sensor card direct and readable; introduce a template when the structure will be reused.
- Use named entity slots when optional or dynamic entity lists would make numeric indices hard to maintain.
- Use `disabled` for configuration-time optional content and `visibility` for runtime switching.
- Use `same_as` for repeated geometry and compounds for a reusable group of related layout items.
- Use an FHS local entity for dashboard controls so buttons, text, state and sparklines use the same update path.
- Select the horseshoe or sparkline color style explicitly instead of relying on an accidental default.

