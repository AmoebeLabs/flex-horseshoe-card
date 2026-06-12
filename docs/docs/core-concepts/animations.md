---
template: main.html
title: Animations
description: Brrrrrr.
tags:
  - Animations
---

##:material-horseshoe: Available animation options

Animations are optional, and are driven by state changes of a given entity or attribute.

| Name                           |  Type  |   Default    | Since  | Description                                                                                                                                                                                   |
| ------------------------------ | :----: | :----------: | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| entity.<x>                     | string | **required** | v0.8.0 | Entity index (zero based) which triggers the animation. In the form of entity.1 for the SECOND entity in the entity list. If an attribute is specified, the attribute triggers the animation. |
| state                          | string | **required** | v0.8.0 | specifies the state like 'on', or 'off' the animation is meant for                                                                                                                            |
| circles, hlines, vlines, icons |  list  | **required** | v0.8.0 | list of objects with animations                                                                                                                                                               |

##:material-horseshoe: Available circle, hline, vline, icon animation styles

| Name         |        Type         |   Default    | Since  | Description                                                                                                                                                                                                                                                                                                                                         |
| ------------ | :-----------------: | :----------: | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| animation_id |       number        | **required** | v0.8.0 | the unique (for this card) animation_id. Is also referred to by the layout.                                                                                                                                                                                                                                                                         |
| styles       | css properties list | **required** | v0.8.0 | list of pure css styles for this object. **MUST** contain a ';' at the end of the line!                                                                                                                                                                                                                                                             |
| reuse        |       boolean       |   `false`    | v0.8.0 | Default the previous animation style is cleared. By setting reuse to `true`, the previous animation style is preserved by the new animation. This can be handy if this animation starts where the previous animation left off. <br/>For instance a color: the 'on' state sets the circle to orange. The 'off' state keeps the color, but zooms out. |
| icon         |       string        |   `false`    | v5.4.4 | Name of Icon to change.                                                                                                                                                                                                                                                                                                                             |

##:material-horseshoe: Predefined animations

| Name       |   Type    | Since  | Example definition in the styles section of the animation                                         |
| ---------- | :-------: | ------ | ------------------------------------------------------------------------------------------------- |
| bounce     | attention | v0.8.0 | `styles:`<br/>`- animation: bounce 1s ease-in-out both;`<br/>`- transform-origin: center bottom;` |
| flash      | attention | v0.8.0 | `styles:`<br/>`- animation: flash 1s ease-in-out both;`<br/>`- transform-origin: center;`         |
| headShake  | attention | v0.8.0 | `styles:`<br/>`- animation: headShake 1s ease-in-out both;`<br/>`- transform-origin: center;`     |
| heartBeat  | attention | v0.8.0 | `styles:`<br/>`- animation: heartBeat 1.3s ease-in-out both;`<br/>`- transform-origin: center;`   |
| jello      | attention | v0.8.0 | `styles:`<br/>`- animation: jello 1s ease-in-out both;`<br/>`- transform-origin: center;`         |
| pulse      | attention | v0.8.0 | `styles:`<br/>`- animation: pulse 1s ease-in-out both;`<br/>`- transform-origin: center;`         |
| rubberBand | attention | v0.8.0 | `styles:`<br/>`- animation: rubberBand 1s ease-in-out both;`<br/>`- transform-origin: center;`    |
| shake      | attention | v0.8.0 | `styles:`<br/>`- animation: shake 1s ease-in-out both;`<br/>`- transform-origin: center;`         |
| swing      | attention | v0.8.0 | `styles:`<br/>`- animation: swing 1s ease-in-out both;`<br/>`- transform-origin: top center;`     |
| tada       | attention | v0.8.0 | `styles:`<br/>`- animation: tada 1s ease-in-out both;`<br/>`- transform-origin: center;`          |
| wobble     | attention | v0.8.0 | `styles:`<br/>`- animation: wobble 1s ease-in-out both;`<br/>`- transform-origin: center;`        |
| zoomOut    |  zooming  | v0.8.0 | `styles:`<br/>`- animation: zoomOut 1s ease-out both;`</br>`- transform-origin: center;`          |
| zoomIn     |  zooming  | v0.8.0 | `styles:`<br/>`- animation: zoomIn 1s ease-out both;`</br>`- transform-origin: center;`           |

#### Example of animation for card 11:

![](https://tweakers.net/ext/f/Hk2Lzz2VkPbDUvEQUubBXoJU/full.gif)

```yaml
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

##:material-horseshoe: User defined animations

You can define your own animations too.
Pick a unique name, add the animation to the style: section of the card, and off you go.
Example Card 12, the bulb named "OPTO" has such a user defined animation: you see something running around if the light is switched on.

There are at least a few great places for example animations:

- [CSS animations for beginners](https://thoughtbot.com/blog/css-animation-for-beginners)
- [Animate.css](https://daneden.github.io/animate.css/), where the predefined animations come from!
- The interactive site from Ana Travis, [Animista](http://animista.net/). A great site for creating all sorts of animations.

#### Example of Card 12

```yaml
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

##:material-horseshoe: Card Styling section

As of v5.4.1

You can styule the (background) of the card using CSS styles.
<br>The first example shows how to add an image, and center it.

```yaml
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

The second example shows the combination of card style and JavaScript templating.
<br>The background color is changed - in this case - depending on the state of entity_index 0.

```yaml
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
