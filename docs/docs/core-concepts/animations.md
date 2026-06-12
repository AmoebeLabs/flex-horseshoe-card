---
template: main.html
title: Animations
description: Use state-based animations, CSS animations, and dynamic styling in the Flexible Horseshoe Card.
tags:
  - Animations
  - CSS
  - Templates
---

# Animations

The Flexible Horseshoe Card supports animation and dynamic visual behavior in several ways.

Some animations are configured in the card's `animations` section. These are state-based animations: when an entity or attribute changes to a configured state, the card applies styles or animations to specific layout items.

The card can also use normal CSS animations. You can use the built-in animation names, define your own `@keyframes`, or use JavaScript templates in `styles` to change animation behavior dynamically.

This means there are several related concepts:

| Concept | Where it is configured | Used for |
| :------ | :--------------------- | :------- |
| State-based animations | `animations:` | Apply styles or animations when an entity reaches a specific state |
| CSS animation styles | `styles:` | Run CSS animations on a card or layout item |
| JavaScript templates | `styles:`, `entities`, and other supported fields | Change styles, icons, names, or other values using dynamic logic |
| Custom keyframes | card-level CSS / style block | Define your own animation behavior |

## :material-horseshoe: State-based animations vs JavaScript templates

The card supports more than one way to create dynamic visual behavior.

Use the `animations` section when you want to react to simple entity states such as `on`, `off`, `home`, `not_home`, or another fixed state value. This works well for applying predefined CSS animations, changing icon colors, or applying a known set of styles when a state matches.

Use JavaScript templates when the logic is more dynamic. Templates are better suited for numeric thresholds, multiple conditions, calculated values, dynamic icons, dynamic colors, or styles that depend on several entities.

Both approaches can change visual behavior. The difference is mainly how the condition is defined.

| Need | Recommended method |
| :--- | :----------------- |
| React to a fixed state such as `on` or `off` | Use the `animations` section |
| Apply a predefined animation to a layout item | Use the `animations` section or a templated `styles` entry |
| Change an icon based on state | Use JavaScript templates in `entities.icon`, or the `animations` section for simple state changes |
| Change a style based on a numeric threshold | Use JavaScript templates |
| Use several entity states in one condition | Use JavaScript templates |
| Reuse the same dynamic logic in multiple places | Use JavaScript templates with `variables` |
| Keep simple state-to-style rules grouped in one place | Use the `animations` section |

The two approaches are not competing features. They are different tools for different levels of logic.

## :material-horseshoe: State-based animations

The `animations` section is optional. Use it when a layout item should change when an entity reaches a specific state.

A state-based animation has three parts:

1. the entity that triggers the animation
2. the state that should match
3. the layout items that should receive new styles

Example structure:

```yaml
animations:
  entity.1:
    - state: 'on'
      circles:
        - animation_id: 10
          styles:
            - fill: var(--theme-gradient-color-08)
            - animation: jello 1s ease-in-out both
```

In this example, `entity.1` refers to the second entity in the `entities` list. When that entity is `on`, the card applies the styles to the circle that has `animation_id: 10`.

!!! info "Animation targets use animation_id"
    The `animations` section does not target layout items by `id`.

    It targets layout items by `animation_id`. The same `animation_id` must be present on the layout item you want to animate.

## :material-horseshoe: Animation trigger options

| Name | Type | Required | Description |
| :--- | :--: | :------: | :---------- |
| `entity.<index>` | string | :material-check: | Entity index that triggers the animation. For example, `entity.1` refers to the second entity in the `entities` list |
| `state` | string | :material-check: | Entity state that activates this animation block, such as `on` or `off` |
| `circles` | list | :material-close: | Circle animation targets |
| `hlines` | list | :material-close: | Horizontal line animation targets |
| `vlines` | list | :material-close: | Vertical line animation targets |
| `icons` | list | :material-close: | Icon animation targets |

If the entity definition uses an `attribute`, the attribute value is used for the animation trigger.

## :material-horseshoe: Animation target options

The animation target defines which layout item should change and which styles should be applied.

| Name | Type | Required | Description |
| :--- | :--: | :------: | :---------- |
| `animation_id` | number | :material-check: | Matches the `animation_id` on a layout item |
| `styles` | list | :material-check: | CSS styles to apply to the target item |
| `reuse` | boolean | :material-close: | When `true`, the previous animation style is preserved and the new styles are added |
| `icon` | string | :material-close: | Icon name to apply when animating an icon |

By default, the previous animation style is cleared before the new one is applied. Use `reuse: true` when the next animation should build on the previous one.

For example, an `on` state can set a circle color, and the `off` state can keep that color while only playing a zoom-out animation.

## :material-horseshoe: Predefined animations

The card includes several predefined CSS animation names. These can be used in a `styles` entry with the CSS `animation` property.

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

Many animations also need a useful `transform-origin`, for example:

```yaml
styles:
  - animation: jello 1s ease-in-out both
  - transform-origin: center
```

## :material-horseshoe: Example: state-based animation

The example below animates a circle and changes an icon color when the second entity changes state.

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

- `entity.1` watches the second entity.
- `state: 'on'` applies a fill color and runs the `jello` animation.
- `state: 'off'` runs `zoomOut`.
- `animation_id: 10` connects the animation target to the second circle.
- `animation_id: 0` connects the icon animation to the icon layout item.

## :material-horseshoe: Dynamic animation with JavaScript templates

JavaScript templates can also create dynamic animation behavior.

This is useful when the animation depends on a number, a threshold, or more complex logic than a simple `on` or `off` state.

For example, an item can start flashing when the entity value is above a threshold:

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

Templates can also be placed in `variables` and reused in multiple places:

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

For more details about template syntax and available variables, see the templating page.

## :material-horseshoe: Dynamic icons with JavaScript templates

Icons can also be dynamic. This is usually done in the `entities` section with a JavaScript template.

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

Use this approach when the icon should be calculated from a value or from logic that is easier to express in JavaScript.

For simple fixed states, the `animations` section can also change icon styling, such as fill color.

## :material-horseshoe: Custom CSS animations

You can also define your own CSS animations.

Choose a unique animation name, add a matching `@keyframes` definition, and use that animation name in a `styles` entry.

The example below defines a custom `stroke` animation and uses it on a circle.

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

    This makes it possible to create your own effects, as long as the CSS properties can be applied to the target SVG or card element.

## :material-horseshoe: Card-level styling and animations

Animations can also be combined with the top-level `styles` section of the card.

Use card-level `styles` for the card background, background image, transitions, and other styles that apply to the card itself.

Example with a background image:

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

The top-level `styles` section can also use JavaScript templates. This is useful when a card-level style should change dynamically based on an entity state.

The example below changes the card background color based on the state of the first entity.

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

JavaScript templates are dynamic. They can react to entity states during card updates.

For more details about template syntax, variables, and reusable template values, see the templating page.

## :material-horseshoe: When to use which method

| Need | Recommended method |
| :--- | :----------------- |
| Change styles when an entity is `on`, `off`, or another fixed state | Use the `animations` section |
| Run a built-in CSS animation such as `jello`, `flash`, or `zoomIn` | Use `animation:` in `styles`, either directly or through the `animations` section |
| Create your own animation behavior | Define custom `@keyframes` |
| Change styles based on numeric thresholds or more complex logic | Use JavaScript templates in `styles` |
| Change an icon based on dynamic logic | Use JavaScript templates in `entities.icon` |
| Change an icon for a simple fixed state | Use the `animations` section or a JavaScript template |
| Reuse the same dynamic animation logic | Use JavaScript templates with `variables` |
| Style the card background or card container | Use top-level `styles` |
| Style a layout item | Use the item's own `styles` section |

## :material-horseshoe: External animation resources

The predefined animations are based on common CSS animation patterns. These resources can help when creating your own animations:

- [CSS animations for beginners](https://thoughtbot.com/blog/css-animation-for-beginners)
- [Animate.css](https://animate.style/)
- [Animista](https://animista.net/)
