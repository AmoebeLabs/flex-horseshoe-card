---
template: main.html
title: Animations
description: Configure state-driven and CSS animations, animation triggers, and dynamic styles for Flexible Horseshoe Card elements.
tags:
  - Animations
  - CSS
  - Templates
---
# Animations

The Flexible Horseshoe Card supports several forms of animation and dynamic visual behavior.

State-based animations are configured in the card’s `animations` section. When an entity or attribute reaches a configured state, the card applies styles or animations to selected layout items.

The card can also use standard CSS animations. You can use built-in animation names, define custom `@keyframes`, or add JavaScript templates to `styles` when the animation should change dynamically.

These options serve different purposes:

| Concept | Where it is configured | Used for |
| :------ | :--------------------- | :------- |
| State-based animations | `animations:` | Applies styles or animations when an entity reaches a specific state. |
| CSS animation styles | `styles:` | Runs CSS animations on the card or a layout item. |
| JavaScript templates | `styles:`, `entities`, and other supported fields | Changes styles, icons, names, or other values with dynamic logic. |
| Custom keyframes | Card-level CSS or style block | Defines custom animation behavior. |

## :material-horseshoe: State-based animations and JavaScript templates

The card offers more than one way to create dynamic visual behavior.

Use the `animations` section for simple state matching, such as `on`, `off`, `home`, `not_home`, or another fixed state. This works well for applying predefined CSS animations, changing icon colors, or applying a known set of styles when a state matches.

Use JavaScript templates for more complex logic. Templates are better suited to numeric thresholds, calculated values, multiple conditions, dynamic icons, dynamic colors, or logic that depends on several entities.

| Need | Recommended method |
| :--- | :----------------- |
| React to a fixed state such as `on` or `off` | Use the `animations` section. |
| Apply a predefined animation to a layout item | Use the `animations` section or a templated `styles` entry. |
| Change an icon based on state | Use JavaScript in `entities.icon`, or the `animations` section for simple state changes. |
| Change a style based on a numeric threshold | Use JavaScript templates. |
| Combine several entity states in one condition | Use JavaScript templates. |
| Reuse the same dynamic logic in several places | Use JavaScript templates with `variables`. |
| Keep simple state-to-style rules together | Use the `animations` section. |

These approaches are complementary. Choose the one that best matches the complexity of the condition.

## :material-horseshoe: State-based animations

The `animations` section is optional. Use it when a layout item should change after an entity reaches a specific state.

A state-based animation has three parts:

1. the entity that triggers the animation;
2. the state that must match;
3. the layout items that receive the new styles.

```yaml linenums="1"
animations:
  entity.1:
    - state: 'on'
      circles:
        - animation_id: 10
          styles:
            - fill: var(--theme-gradient-color-08)
            - animation: jello 1s ease-in-out both
```

In this example, `entity.1` refers to the second entity in the `entities` list. When that entity is `on`, the card applies the styles to the circle with `animation_id: 10`.

!!! info "Animation targets use animation_id"
    The `animations` section does not target layout items by `id`.

    It uses `animation_id`. The same `animation_id` must be present on the layout item you want to animate.

## :material-horseshoe: Animation trigger options

| Name | Type | Required | Description |
| :--- | :--: | :------: | :---------- |
| `entity.<index>` | string | :material-check: | Entity index that triggers the animation. For example, `entity.1` refers to the second entity in the `entities` list. |
| `state` | string | :material-check: | Entity state that activates the animation block, such as `on` or `off`. |
| `circles` | list | :material-close: | Circle animation targets. |
| `hlines` | list | :material-close: | Horizontal line animation targets. |
| `vlines` | list | :material-close: | Vertical line animation targets. |
| `icons` | list | :material-close: | Icon animation targets. |

When the entity definition uses an `attribute`, the attribute value becomes the animation trigger.

## :material-horseshoe: Animation target options

An animation target identifies the layout item to update and the styles to apply.

| Name | Type | Required | Description |
| :--- | :--: | :------: | :---------- |
| `animation_id` | number | :material-check: | Matches the `animation_id` on a layout item. |
| `styles` | list | :material-check: | CSS styles applied to the target item. |
| `reuse` | boolean | :material-close: | When `true`, preserves the previous animation styles and adds the new styles. |
| `icon` | string | :material-close: | Icon name applied when animating an icon. |

By default, the previous animation style is cleared before the new one is applied. Use `reuse: true` when the next state should build on the previous animation styles.

For example, an `on` state can set a circle color, while the `off` state preserves that color and only adds a zoom-out animation.

## :material-horseshoe: Predefined animations

The card includes several predefined CSS animation names. Use them with the CSS `animation` property inside a `styles` entry.

| Name | Type | Example |
| :--- | :--- | :------ |
| `bounce` | attention | `animation: bounce 1s ease-in-out both` |
| `flash` | attention | `animation: flash 1s ease-in-out both` |
| `headShake` | attention | `animation: headShake 1s ease-in-out both` |
| `heartBeat` | attention | `animation: heartBeat 1.3s ease-in-out both` |
| `jello` | attention | `animation: jello 1s ease-in-out both` |
| `pulse` | attention | `animation: pulse 1s ease-in-out both` |
| `rubberBand` | attention | `animation: rubberBand 1s ease-in-out both` |
| `shake` | attention | `animation: shake 1s ease-in-out both` |
| `swing` | attention | `animation: swing 1s ease-in-out both` |
| `tada` | attention | `animation: tada 1s ease-in-out both` |
| `wobble` | attention | `animation: wobble 1s ease-in-out both` |
| `zoomOut` | zooming | `animation: zoomOut 1s ease-out both` |
| `zoomIn` | zooming | `animation: zoomIn 1s ease-out both` |

Many animations also benefit from a suitable `transform-origin`:

```yaml linenums="1"
styles:
  - animation: jello 1s ease-in-out both
  - transform-origin: center
```

## :material-horseshoe: Example: state-based animation

The following example animates a circle and changes an icon color when the second entity changes state.

```yaml title="State-based animation" linenums="1"
- type: 'custom:flex-horseshoe-card'
  entities:
    - entity: sensor.memory_use_percent
    - entity: light.1st_floor_hall_light
  animations:
    entity.1:
      - state: 'on'
        circles:
          - animation_id: 10
            styles:
              - fill: var(--theme-gradient-color-08)
              - opacity: 0.9
              - animation: jello 1s ease-in-out both
              - transform-origin: center
        icons:
          - animation_id: 0
            styles:
              - fill: black;
      - state: 'off'
        circles:
          - animation_id: 10
            reuse: true
            styles:
              - transform-origin: center
              - animation: zoomOut 1s ease-out both
        icons:
          - animation_id: 0
            styles:
              - fill: var(--primary-text-color)
  layout:
    icons:
      - id: 0
        animation_id: 0
        xpos: 50
        ypos: 55
        entity_index: 1
        icon_size: 3.5
        styles:
          - color: white
    circles:
      - id: 0
        animation_id: 0
        xpos: 50
        ypos: 50
        radius: 35
        styles:
          - fill: var(--primary-background-color)
      - id: 1
        animation_id: 10
        xpos: 50
        ypos: 50
        radius: 30
        entity_index: 1
        styles:
          - fill: var(--primary-background-color)
```

In this example:

- `entity.1` watches the second entity;
- `state: 'on'` applies a fill color and starts the `jello` animation;
- `state: 'off'` starts `zoomOut`;
- `animation_id: 10` connects the animation block to the second circle;
- `animation_id: 0` connects the icon animation to the icon layout item.

## :material-horseshoe: Dynamic animations with JavaScript templates

JavaScript templates can also control animation behavior.

Use them when the animation depends on a numeric value, threshold, calculated result, or logic that is more complex than a fixed state match.

For example, an item can flash when its entity value exceeds a threshold:

```yaml title="Dynamic animation style" linenums="1"
horseshoes:
  - entity_index: 0
    xpos: 50
    ypos: 50
    radius: 40
    horseshoe_state:
      width: 12
      styles:
        - animation: |
            [[[
              const value = Number(state);
              return value >= 0.3
                ? 'flash 1s ease-in-out 3'
                : 'none';
            ]]]
```

Templates can also be stored in `variables` and reused:

```yaml title="Reusable animation template" linenums="1"
variables:
  flashAnimation: |
    [[[
      const value = Number(state);
      return value >= 0.3
        ? 'flash 1s ease-in-out 3'
        : 'none';
    ]]]

layout:
  horseshoes:
    - entity_index: 0
      horseshoe_state:
        width: 12
        styles:
          - animation: |
              [[[ return variables['flashAnimation']; ]]]
```

For template syntax and available variables, see the templating page.

## :material-horseshoe: Dynamic icons with JavaScript templates

Entity icons can also change dynamically. This is usually configured in the `entities` section with a JavaScript template.

```yaml title="Dynamic entity icon" linenums="1"
entities:
  - entity: sensor.dsmr_reading_electricity_currently_delivered
    icon: |
      [[[
        const value = Number(state);
        return value >= 0.4
          ? 'mdi:flash'
          : 'mdi:flash-off';
      ]]]
```

Use this approach when the icon depends on a value or on logic that is easier to express in JavaScript.

For simple fixed states, the `animations` section can also change icon styling, such as its fill color.

## :material-horseshoe: Custom CSS animations

You can define your own CSS animations with standard `@keyframes`.

Choose a unique animation name, define the matching keyframes, and use that name in a `styles` entry.

The following example defines a custom `stroke` animation and applies it to a circle:

```yaml title="Custom CSS animation" linenums="1"
- type: 'custom:flex-horseshoe-card'
  entities:
    - entity: sensor.memory_use_percent
    - entity: light.1st_floor_hall_light
    - entity: light.gledopto

  animations:
    entity.2:
      - state: 'on'
        circles:
          - animation_id: 3
            styles:
              - fill: var(--theme-gradient-color-03);
              - stroke-width: 2;
              - stroke: var(--primary-background-color);
              - opacity: 0.9;
              - stroke-dasharray: 94;
              - stroke-dashoffset: 1000;
              - animation: stroke 2s ease-out forwards;

        icons:
          - animation_id: 1
            styles:
              - fill: black;

      - state: 'off'
        circles:
          - animation_id: 3
            styles:
              - fill: var(--primary-background-color);
              - opacity: 0.7;
        icons:
          - animation_id: 1
            styles:
              - fill: var(--primary-text-color);
  # The @keyframes stroke runs the stroke animation for the second lightbulb, entity light.gledopto
  style: |
    ha-card {
      box-shadow: var(--theme-card-box-shadow);
    }
    @keyframes stroke { to { stroke-dashoffset: 0; } }
```

!!! tip "Custom animations are normal CSS"
    Custom animations use standard CSS `@keyframes`.

    This allows you to create your own effects whenever the relevant CSS properties can be applied to the target SVG or card element.

## :material-horseshoe: Card-level styling and animations

Animations can be combined with the card’s top-level `styles` section.

Use card-level `styles` for backgrounds, images, transitions, and other properties that affect the card container itself.

```yaml title="Card background image" linenums="1"
- type: 'custom:flex-horseshoe-card'
  entities:
    - entity: sensor.memory_use_percent
    - entity: light.1st_floor_hall_light

  styles:
    - background-color: rgba(20, 20, 20, 0.05);
    - background-image: url('/local/images/backgrounds/pollen-background-hd-3x1.png');
    - background-size: cover;
    - background-position: center;
    - background-repeat: no-repeat;
    - overflow: hidden;
```

## :material-horseshoe: Dynamic card styles

The top-level `styles` section can also contain JavaScript templates. Use them when a card-level style should respond to an entity state.

The following example changes the card background color based on the state of the first entity:

```yaml title="Dynamic card background" linenums="1"
- type: 'custom:flex-horseshoe-card'
  entities:
    - entity: sensor.memory_use_percent
    - entity: light.1st_floor_hall_light

  styles:
    - background-color: |
        [[[
          const value = Number(state);
          return value >= 5
            ? 'var(--error-color);'
            : 'var(--primary-text-color);';
        ]]]
    - transition: background-color 1s ease-in-out;
```

JavaScript templates are evaluated dynamically and can respond during card updates.

For more information about template syntax, variables, and reusable template values, see the templating page.

## :material-horseshoe: Choosing the right method

| Need | Recommended method |
| :--- | :----------------- |
| Change styles when an entity is `on`, `off`, or another fixed state | Use the `animations` section. |
| Run a built-in animation such as `jello`, `flash`, or `zoomIn` | Use `animation:` in `styles`, directly or through the `animations` section. |
| Create custom animation behavior | Define custom `@keyframes`. |
| Change styles based on numeric thresholds or complex logic | Use JavaScript templates in `styles`. |
| Change an icon with dynamic logic | Use JavaScript templates in `entities.icon`. |
| Change an icon for a simple fixed state | Use the `animations` section or a JavaScript template. |
| Reuse the same dynamic animation logic | Use JavaScript templates with `variables`. |
| Style the card background or container | Use top-level `styles`. |
| Style a layout item | Use the item’s own `styles` section. |

## :material-horseshoe: External animation resources

The predefined animations are based on common CSS animation patterns. These resources can help when creating custom effects:

- [CSS animations for beginners](https://thoughtbot.com/blog/css-animation-for-beginners)
- [Animate.css](https://animate.style/)
- [Animista](https://animista.net/)
