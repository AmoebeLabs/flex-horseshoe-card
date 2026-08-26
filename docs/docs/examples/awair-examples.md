---
template: main.html
title: Awair examples
description: Explore an interactive air-quality card with selectable rooms, sensors, and history periods.
tags:
  - Examples
  - Awair
  - Controls
---

# Awair examples

The interactive Awair card combines current air-quality values, a horseshoe, and history in one view. Select a room, measurement, and history duration directly on the card.

{{ loop_video(
  "fhs-demo-card-awair-selectable--dark.mp4",
  "Interactive Awair card",
  "Select a room and sensor to view its current value and history with the Flexible Horseshoe Card.",
  "fhs-demo-card-awair-selectable--dark.png",
  "2026-08-15",
  "PT0M30S",
  "720px") }}

## :material-horseshoe: What this example demonstrates

- select controls with text, icons, values, and status indicators;
- browser-local inputs for the active room, sensor, and duration;
- one sparkline that follows the selected measurement;
- entity slots for readable dynamic configuration;
- reusable colors and layout definitions.

The card follows Awair entity naming conventions. Supply the room names used by your Awair integration.

[Explore the complete Awair card](demo-cards/demo-card-awair-many.md).
