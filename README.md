# ![](https://tweakers.net/ext/f/D4Fx1OKp6s7Hb21Wzq9JWCJb/full.png) Flexible Horseshoe Card, named after it's look & feel
Flexible looks-like-a-horseshoe card for [Home Assistant](https://github.com/home-assistant/home-assistant) Lovelace UI

![](https://tweakers.net/ext/f/IdGw6UgY96oDFQykpdHDb36C/full.png)

### You are looking at the first version of this card. It is not yet fully documented and tested
* * *

## Introduction
The flexible horseshoe card can display data from entities and attributes from the sensor domain. It displays the current state and for the primary entity it fills the horseshoe with a color depending on the min and max values of the state and the configured color stops and styling.

The main perk of this card is it's flexibility. It is able to position a number of things where YOU want it using a layout specification for each object you want on the card:

| Feature | Description        |
|---------|-------------|
| **Any** number of **entities** |For each entity, the attribute, units, icon, name, area and tap action can be specified.<br /><br /> *There is currently no limit imposed on the number of entities in this card. I'm using max. 3 entities in the examples, but there is no problem using more.* 
| **Any** number of **circles**, **horizontal** and **vertical** **lines** | To function as a divider between values or background for values.
| The **layout** of the card | You can specify each object with a relative position on the card |
| **Animations**, dynamic behaviour | You can specify what happens if an entity changes state like change color, or execute a CSS animation. There are predefined animations. |
| Several ways to **color** the **horseshoe** | From single, fixed color, to a gradient depending on a list of colorstops |

* * *
# ![](https://tweakers.net/ext/f/D4Fx1OKp6s7Hb21Wzq9JWCJb/full.png) Table of contents
- [Some examples](#some-examples)
- [Install](#install)
- [Using the card](#using-the-card)
- [Card Options](#card-options)
  - [Horseshoe Section](#horseshoe-section)
  - [Layout Section](#layout-section)
  - [Animations Section](#animations-section)
  - [Show Section](#show-section)
  - [Examples](#example-section)
- [End notes](#end-notes)
***

# ![](https://tweakers.net/ext/f/D4Fx1OKp6s7Hb21Wzq9JWCJb/full.png) Some examples

## Normal, flat UI
Cards in a standard vertical stack / horizontal stack - 2 cards per row - combination.

![](https://tweakers.net/ext/f/JRnq6D0rODy48SUOsUcFH1Bb/full.png)

Legend:
- (3), showing a single attribute from a darksky sensor, a unit (temperature), an area and horizontal line
- (4), showing three attributes from a darksky sensor (temperature, humidity and air pressure), units, two icons, a name and a horizontal line
- (5), showing trhee sensors from system monitoring (ram used, ram used percentage and ram free), extra free text below the sensor values ("in use" and "free"), a horizontal line and a vertical line.
- (6), same as (5), bit with different horizontal and vertical line and different fill style for the horseshoe.

All cards use different styling for filling the horseshoe with a color.

## Some extreme, industrial look, 3D UI
Using the same cards as above, but with a predefined set of filters applied.

Again, cards in a standard vertical stack / horizontal stack - 2 cards per row - combination.

![Another Example](https://tweakers.net/ext/f/xjuaTt3620GPgQyMnrrIIfth/full.png)
![](https://tweakers.net/ext/f/3wRqCSI3EXdysHVFAwYzqpWl/full.png)

## It scales, as it is based on SVG
Using a single card in a row. Card scales to maximum width of the vertical stack card. No changes required for text size, icons, lines and state & attribute values. All thanks to SVG.

![](https://tweakers.net/ext/f/JNXii52PVqvVIIKA8wWZjGla/full.png)

## Yes, you can interact with it. Switching lights is no problem
For each entity a `tap_action` can be defined. The default is the known show-more info dialog. This can be changed in executing a service for instance.

And it can be animated too using predefined animations, or just your own!

![](https://tweakers.net/ext/f/Hk2Lzz2VkPbDUvEQUubBXoJU/full.gif)

# ![](https://tweakers.net/ext/f/D4Fx1OKp6s7Hb21Wzq9JWCJb/full.png) Install

## Install via HACS
Not yet supported. Will be in the future.

## Manual install

1. Download and copy `flex-horseshoe-card.js` from github into your `config/www` directory.

2. Add a reference to `flex-horseshoe-card.js` inside your `ui-lovelace.yaml` or at the top of the *raw config editor UI*.

  ```yaml
  resources:
  - url: /community_plugin/flex-horseshoe-card/flex-horseshoe-card.js
      type: module
  ```
# ![](https://tweakers.net/ext/f/D4Fx1OKp6s7Hb21Wzq9JWCJb/full.png) Using the card

The preferred method of using this card is by [`decluttering card`](https://github.com/custom-cards/decluttering-card) templates. You define the layout and default options in this template and use the template in your Lovelace config. This config stays clean this way: you only specify the entities, attributes, units and icons which are displayed according to the layout defined in the template.

The advice will become obvious once you scroll throught the list of card options :smile:

# ![](https://tweakers.net/ext/f/D4Fx1OKp6s7Hb21Wzq9JWCJb/full.png) Card Options

## Main Card options
| Name | Type | Default | Since | Description |
|------|------|---------|-------|-------------|
| type | string | **required** | v0.8.0 | `custom:flex-horseshoe-card`.
| entities | list | **required** | v0.8.0 | One or more sensor entities in a list. See [available entity options](#available-entity-options) for requirements.
| layout | list/map | **required** | v0.8.0 | You MUST of course specify where each item is positioned on the card. See [available layout options](#available-layout-options) for requirements.
| animations | list/map | optional | v0.8.0 | You can specify animations / dynamic behaviour depending on the state of an entity. Circles, lines and icons can be controlled depending on the state of a given entity. See [available animation options](#available-animation-options) for requirements.
| show | list/map | optional | v0.8.0 | Determines what is shown, like the scale and the horseshoe style. See [availableshow options](#available-show-options) for requirements.
| horseshoe_scale | map | **required** |v0.8.0 | Specifies the scale configuration, like min, max, width and color of the scale. See [horseshoe scale](#horseshoe-scale) for requirements.
| horseshoe_state | map | **required** |v0.8.0 | Specifies the horseshoe width, and fixed color. See [horseshoe state](#horseshoe-state) for requirements.
| horseshoe color_stops | list | **required** | v0.8.0 | Set thresholds for horseshoe gradients and colormapping. See [color stops](#color-stops) for requirements.

## Available entity options
| Name | Type | Default | Since | Description |
|------|------|---------|-------|-------------|
| attribute | string | optional | v0.8.0 | The attribute to be used for the entity.
| unit | string | optional | v0.8.0 | Specifies the entity or attribute unit to be displayed.
| decimals | number | optional | v0.8.0 | Specifies the decimals to format the entity or attribute value.
| name | string | optional | v0.8.0 | Name used for entity or attribute. Overwrites the `friendly_name` attribute.
| area | string | optional | v0.8.0 | Area used for entity or attribute.
| tap_action | list/map | optional | v0.8.0 | How to respond to a mouse-click or tap.  See [available tap actions](#available-tap-actions) for requirements.

#### Example 1, displaying an entity:
```yaml
entities:
  - entity: sensor.memory_use_percent
    decimals: 0
    icon: mdi:memory
    name: '5: RAM Usage'
    area: Hestia
```

#### Example 2, displaying an attribute:
```yaml
entities:
  - entity: weather.dark_sky
    attribute: temperature
    units: '°C'
    icon: mdi:temperature
    decimals: 1
    name: 'Temperature'
```
#### Example 3: a light switch:
```yaml
entities:
  - entity: light.1st_floor_hall_light
    name: 'hall'
    icon: mdi:lightbulb
    tap_action:
      action: call-service
      service: light.toggle
      service_data: { "entity_id" : "light.1st_floor_hall_light" }
```

# ![](https://tweakers.net/ext/f/D4Fx1OKp6s7Hb21Wzq9JWCJb/full.png) Horseshoe section

## Horseshoe scale options
| Name | Type | Default | Options | Since | Description |
|------|------|---------|---------|-------|-------------|
| min | number | **required** | | v0.8.0 | Minimum number of the scale / horseshoe
| max | number | **required** | | v0.8.0 | Maximum number of the scale / horseshoe
| color | color | `var(--background-color)`|any # or var color| v0.8.0 | Color of the scale and tickmarks, if enabled
| width | pixels | 6 |size in pixels| v0.8.0 | Width of scale

#### Example:
```yaml
horseshoe_scale:
  min: 0
  max: 100
  width: 6
  color: 'var(--primary-background-color)'
```
## Horseshoe state options
| Name | Type | Default | Options | Since | Description |
|------|------|---------|---------|-------|-------------|
| horseshoe_color | color | **required** |any # or var() color| v0.8.0 | Color of horseshoe if `shoe_fill_style` = `fixed`
| horseshoe_width | pixels | optional |size in pixels| v0.8.0 | Width of shoe
| colorstops | list | **required** | | v0.8.0 | List of colorstop value and colors. Colors can be specified using a standard hex #RRGGBB color or CSS variable (defined in the theme), ie something like var(--color)

#### Example:
```yaml
horseshoe_state:
  width: 12
  color: 'var(--theme-gradient-color-01)'
```
## Horseshoe fill styles
| Option | Requires | Since | Description
|--------|----------|-------|-------------|
| autominmax | `colorstop` list with at least 2 values | v0.8.0 | Autominmax uses the `min` and `max` values to calculate a gradient color using the first and last entry in the colorstop list depening on the value of the entity or attribute.
| fixed | `shoe_color` | v0.8.0 | Fills the shoe with a single color
| colorstop | `colorstop` list with at least 2 values | v0.8.0 | Fills the shoe with the colorstop color depending on the colorstop value and the value of the state
| colorstopgradient | `colorstop` list with at least 2 values | v0.8.0 | Same as `colorstop`, but a gradient is used between colorstops
| lineargradient | `colorstop` list with at least 2 values | v0.8.0 | Uses the first and last entry in the `colorstop` list to display a linear gradient. It always shows the full gradient from start to end color, independent of the states value.

#### The fill style is set in the show section of the card:
```yaml
show:
  horseshoe_style: 'lineargradient'
```
# ![](https://tweakers.net/ext/f/D4Fx1OKp6s7Hb21Wzq9JWCJb/full.png) Layout section

## Available layout options
The layout options determine where the objects are located on the card, and their initial appearance like font, font size, color, width, fill color, stroke color, etc.

| Name | Type | Default | Since | Description |
|------|:----:|:-------:|-------|-------------|
| Layout object | layout | **required** | v0.8.0 | Can be `states` for displaying a entity or attribute value.<br/>`names` for the name of the entity.<br/>`icons` for the entity icons.<br/>`circles` for circles.<br/>`hlines` and `vlines` for drawing lines.

#### Example layout entry
The following layout is a part of card 5 (hline, vline, state(28%) and name (5: RAM USAGE):

![Another Example](https://tweakers.net/ext/f/xjuaTt3620GPgQyMnrrIIfth/full.png)

- xpos, ypos and length are **percentages**
- both the hline and vline respond to the same animation (have id 0), ie state.
- state layout 0 is connected to entity 0, ie the first entity in the entities section
- name layout 0 is also connected to entity 0

```yaml
layout:
  hlines:
    - id: 0
      animation_id: 0
      xpos: 50
      ypos: 38
      length: 40
      styles:
        - stroke: var(--theme-gradient-color-01);
        - stroke-width: 5;
        - opacity: 0.9;
        - stroke-linecap: round;
  vlines:
    - id: 0
      animation_id: 0
      xpos: 50
      ypos: 56
      length: 20
      styles:
        - stroke: white;
        - opacity: 0.5;
        - stroke-width: 2;
        - stroke-linecap: round;
  states:
    - id: 0
      entity_index: 0
      xpos: 50
      ypos: 30
      styles:
        - font-size: 3em;
        - opacity: 0.9;
  names:
    - id: 0
      entity_index: 0
      xpos: 50
      ypos: 100
      styles:
        - font-size: 1.2em;

```

# ![](https://tweakers.net/ext/f/D4Fx1OKp6s7Hb21Wzq9JWCJb/full.png) Animations section
## Available animation options
Animations are optional, and are driven by state changes of a given entity or attributge.

| Name | Type | Default | Since | Description |
|------|:----:|:-------:|-------|-------------|
| entity.<x> | string | **required** | v0.8.0 | Entity index (zero based) which triggers the animation. In the form of entity.1 for the SECOND entity in the entity list. If an attribute is specified, the attribute triggers the animation.
| state | string | **required** | v0.8.0 | specifies the state like 'on', or 'off' the animation is meant for
| circles, hlines, vlines, icons | list| **required** | v0.8.0 | list of objects with animations

## Available circle, hline, vline, icon animation styles
| Name | Type | Default | Since | Description |
|------|:----:|:-------:|-------|-------------|
| animation_id | number | **required** | v0.8.0 | the unique (for this card) animation_id. Is also referred to by the layout.
| styles | list | **required** | v0.8.0 | list of pure css styles for this object. **MUST** contain a ';' at the end of the line!
| reuse | boolean | `false` | v0.8.0 | Default the previous animation style is cleared. By setting reuse to `true`, the previous animation style is preserved by the new animation. This can be handy if this animation starts where the previous animation left off. <br/>For instance a color: the 'on' state sets the circle to orange. The 'off' state keeps the color, but zooms out.

## Predefined animations
| Name | Type | Since | Example definition in the styles section of the animation |
|------|:----:|-------|-------------|
| bounce | attention | v0.8.0 | `styles:`<br/>`- animation: bounce 1s ease-in-out both;`<br/>`- transform-origin: center bottom;`
| flash | attention | v0.8.0 | `styles:`<br/>`- animation: flash 1s ease-in-out both;`<br/>`- transform-origin: center;`
| headShake | attention | v0.8.0 | `styles:`<br/>`- animation: headShake 1s ease-in-out both;`<br/>`- transform-origin: center;`
| heartBeat | attention | v0.8.0 | `styles:`<br/>`- animation: heartBeat 1.3s ease-in-out both;`<br/>`- transform-origin: center;`
| jello | attention | v0.8.0 | `styles:`<br/>`- animation: jello 1s ease-in-out both;`<br/>`- transform-origin: center;`
| pulse | attention | v0.8.0 | `styles:`<br/>`- animation: pulse 1s ease-in-out both;`<br/>`- transform-origin: center;`
| rubberBand | attention | v0.8.0 | `styles:`<br/>`- animation: rubberBand 1s ease-in-out both;`<br/>`- transform-origin: center;`
| shake| attention | v0.8.0 | `styles:`<br/>`- animation: shake 1s ease-in-out both;`<br/>`- transform-origin: center;`
| swing | attention | v0.8.0 | `styles:`<br/>`- animation: swing 1s ease-in-out both;`<br/>`- transform-origin: top center;`
| tada | attention | v0.8.0 | `styles:`<br/>`- animation: tada 1s ease-in-out both;`<br/>`- transform-origin: center;`
| wobble | attention | v0.8.0 | `styles:`<br/>`- animation: wobble 1s ease-in-out both;`<br/>`- transform-origin: center;`
| zoomOut | zooming | v0.8.0 | `styles:`<br/>`- animation: zoomOut 1s ease-out both;`</br>`- transform-origin: center;`
| zoomIn | zooming | v0.8.0 | `styles:`<br/>`- animation: zoomIn 1s ease-out both;`</br>`- transform-origin: center;`

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
              - fill: var(--theme-gradient-color-08);
              - opacity: 0.9;
              - animation: jello 1s ease-in-out both;
              - transform-origin: center;
        icons:
          - animation_id: 0
            styles:
              - fill: black;
      - state: 'off'
        circles:
          - animation_id: 10
            reuse: true
            styles:
              - transform-origin: center;
              - animation: zoomOut 1s ease-out both;
        icons:
          - animation_id: 0
            styles:
              - fill: var(--primary-text-color);
```

# ![](https://tweakers.net/ext/f/D4Fx1OKp6s7Hb21Wzq9JWCJb/full.png) Show section

## Available show options
All options are optional.

| Name | Default | Parameter | Since |Description |
|------|:-------:|:---------:|-------|-------------|
| scale_tickmarks | true | `true` / `false` |  v0.8.0 |Display scale
| horseshoe_style | `autominmax` | `fixed` / `autominmax`/ `colorstop` / `colorstopgradient`/ `lineargradient`| v0.8.0 | Fill style. Most fill styles need the colorstop list to be specified. See [shoe fill style list](#shoe fill styles) for a description.


# ![](https://tweakers.net/ext/f/D4Fx1OKp6s7Hb21Wzq9JWCJb/full.png) Examples section

## Card example 5
![Another Example](https://tweakers.net/ext/f/xjuaTt3620GPgQyMnrrIIfth/full.png)

Card example nr  is configured as follows:

```yaml
- type: 'custom:flex-horseshoe-card'
  entities:
    - entity: sensor.memory_use_percent
      decimals: 0
      icon: mdi:memory
      name: '5: RAM Usage'
      area: Hestia
    - entity: sensor.memory_use
      decimals: 0
      name: '(In Use)'
    - entity: weather.dark_sky
      attribute: temperature
      decimals: 1
      name: '(temp)'
    - entity: light.1st_floor_hall_light              
      name: 'hall'
  animations:
    entity.3:
      - state: 'on'
        vlines:
          - animation_id: 0
            styles:
              - stroke: red;
              - opacity: 0.9;
              - stroke-width: 5;
              - stroke-dasharray: 7;
              - animation: dash 5s linear;
        hlines:
          - animation_id: 0
            styles:
              - stroke: var(--theme-gradient-color-01);
              - opacity: 0.9;
      - state: 'off'
        vlines:
          - animation_id: 0
            styles:
              - stroke: blue;
              - opacity: 0.9;
        hlines:
          - animation_id: 0
            styles:
              - stroke: var(--primary-background-color);
              - opacity: 0.9;
  card_filter: card--dropshadow-heavy--sepia90
  show:
    scale_tickmarks: true
  layout:
    hlines:
      - animation_id: 0
        xpos: 50
        ypos: 38
        length: 40
        styles:
          - stroke: var(--theme-gradient-color-01);
          - stroke-width: 5;
          - opacity: 0.9;
          - stroke-linecap: round;
        color: 'var(--theme-gradient-color-01)'
        width: 5
        opacity: 0.9
    vlines:
      - animation_id: 0
        xpos: 50
        ypos: 56
        length: 20
        styles:
          - stroke: white;
          - opacity: 0.5;
          - stroke-width: 2;
          - stroke-linecap: round;
        color: white
        opacity: 0.5
    states:
      - id: 0
        entity_index: 0
        xpos: 50
        ypos: 30
        uom_font_size: 1.8
        styles:
          - font-size: 3em;
          - opacity: 0.9;
      - id: 1
        entity_index: 1
        xpos: 46
        ypos: 54
        uom_font_size: 0.9
        styles:
          - font-size: 1.5em;
          - text-anchor: end;
      - id: 2
        entity_index: 2
        xpos: 54
        ypos: 54
        uom_font_size: 0.9
        styles:
          - font-size: 1.5em;
          - text-anchor: start;
    names:
      - id: 0
        entity_index: 0
        xpos: 50
        ypos: 100
        styles:
          - font-size: 1.2em;
      - id: 1
        entity_index: 1
        xpos: 46
        ypos: 62
        styles:
          - font-size: 0.8em;
          - text-anchor: end;
          - opacity: 0.7;
      - id: 2
        entity_index: 2
        xpos: 54
        ypos: 62
        styles:
          - font-size: 0.8em;
          - text-anchor: start;
          - opacity: 0.7;
    areas:
      - id: 0
        entity_index: 0
        xpos: 50
        ypos: 85
        styles:
          - font-size: 1.2em;
  horseshoe_state:
    color:  'var(--theme-gradient-color-01)'
  horseshoe_scale:
    min: 0
    max: 100
    color: 'var(--primary-background-color)'
    width: 6
  color_stops:
    0: 'var(--theme-gradient-color-01)'
    10: 'var(--theme-gradient-color-02)'
    20: 'var(--theme-gradient-color-03)'
    30: 'var(--theme-gradient-color-04)'
    40: 'var(--theme-gradient-color-05)'
    50: 'var(--theme-gradient-color-06)'
    60: 'var(--theme-gradient-color-07)'
    70: 'var(--theme-gradient-color-08)'
    80: 'var(--theme-gradient-color-09)'
    90: 'var(--theme-gradient-color-10)'
  style: |
    ha-card {
      box-shadow: var(--theme-card-box-shadow);
    }
```
# ![](https://tweakers.net/ext/f/D4Fx1OKp6s7Hb21Wzq9JWCJb/full.png) End notes

## License
This project is under the MIT license.

## Credits

The making of this card wouldn't be possible without an incredible number of resources I used to find solutions for the things I wanted to do with this card. Credits in random order:
- The Home Assitant dev site with a simple example of creating a lit-element card
- Implementation examples from the community like the mini-graph-card, button-card and gauge-card
- The greatest site for CSS, [css-tricks](https://css-tricks.com/)
- The back-to-school site for HTML, CSS and Javascript: [w3schools](https://www.w3schools.com/)
- Stackoverflow for so many solutions for specific problems
- [Codepen](https://codepen.io/) for so many, many, many small CSS, SVG and HTML examples for things I didn't now how they worked
- [jsfiddle](https://jsfiddle.net/) for so many, many, many small CSS, SVG and HTML examples for things I didn't now how they worked
- [designschack](https://designshack.net) for all sorts of inspirations & designs
- [pinterest](https://nl.pinterest.com/) for color palettes and more
