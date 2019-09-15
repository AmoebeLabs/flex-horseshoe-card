# TODO:
filter optie toevoegen die het css filternaam aangeeft. Dan wat standaard filters in de card doen, en de rest kan eventueel ook in de style | gedaan worden, dan kunnen mensen ook hun eigen custom css filter definieren en gebruiken.


# Flexible Horseshoe Card, named after it's look & feel
Flexible looks-like-a-horseshoe card for [Home Assistant](https://github.com/home-assistant/home-assistant) Lovelace UI
 
### You are looking at the first version of this card. It is not yet fully documented and tested

The card can display data from entities and attributes from the sensor domain. It displays the current state and for the primary entity it fills the horseshoe with a color depending on the min and max values of the state and the configured color stops and styling.

The main perk of this card is it's flexibility. It is able to position a number of things where YOU want it using a layout specification for each object you want on the card:

| Feature | Note        |
|---------|-------------|
| Any number of entities | *There is currently no limit imposed on the number of entities in this card. I'm using max. 3 entities in the examples, but there is no problem using more.* <br /><br />For each entity, the attribute, units, icon, name and area can be specified.
| Any number of circles, horizontal and vertical lines | To function as a divider between values or background for values.
| The layout of the card | YOu can specify each object with a relative position on the card |
| Animations, dynamic behaviour | You can specify what happens if an entity changes state like change color, or execute a CSS animation. There are predefined animations. |
| Several ways to color the horseshoe | From single, fixed color, to a gradient depending on a list of colorstops |

## Some examples

### Normal, flat UI
Cards in a standard vertical stack / horizontal stack - 2 cards per row - combination.

![](https://tweakers.net/ext/f/JRnq6D0rODy48SUOsUcFH1Bb/full.png)

Legend:
- (3), showing a single attribute from a darksky sensor, a unit (temperature), an area and horizontal line
- (4), showing three attributes from a darksky sensor (temperature, humidity and air pressure), units, two icons, a name and a horizontal line
- (5), showing trhee sensors from system monitoring (ram used, ram used percentage and ram free), extra free text below the sensor values ("in use" and "free"), a horizontal line and a vertical line.
- (6), same as (5), bit with different horizontal and vertical line and different fill style for the horseshoe.

All cards use different styling for filling the horseshoe with a color.

### Some extreme, industrial look, 3D UI
Using the same cards as above, but with a predefined set of filters applied.

Again, cards in a standard vertical stack / horizontal stack - 2 cards per row - combination.

![Another Example](https://tweakers.net/ext/f/xjuaTt3620GPgQyMnrrIIfth/full.png)
![](https://tweakers.net/ext/f/3wRqCSI3EXdysHVFAwYzqpWl/full.png)

### It scales, as it is based on SVG
Using a single card in a row. Card scales to maximum width of the vertical stack card. No changes required for text size, icons, lines and state & attribute values. All thanks to SVG.

![](https://tweakers.net/ext/f/JNXii52PVqvVIIKA8wWZjGla/full.png)

### Yes, you can interact with it. Switching lights is no problem
![](https://tweakers.net/ext/f/gnprFbnq3DoJC75CNu1KtxmR/full.png)

![](	https://tweakers.net/ext/f/ECM2VGPbYyO9kMjAmsqsCFFq/full.png)

And it can be animated too using predefined animations, or just your own!

![](https://tweakers.net/ext/f/Hk2Lzz2VkPbDUvEQUubBXoJU/full.gif)

## Install

### Install via HACS
Not yet supported. Will be in the future.

### Manual install

1. Download and copy `flex-horseshoe-card.js` from github into your `config/www` directory.

2. Add a reference to `flex-horseshoe-card.js` inside your `ui-lovelace.yaml` or at the top of the *raw config editor UI*.

  ```yaml
  resources:
  - url: /community_plugin/flex-horseshoe-card/flex-horseshoe-card.js
      type: module
  ```
## Using the card

The preferred method of using this card is by [`decluttering card`](https://github.com/custom-cards/decluttering-card) templates. You define the layout and default options in this template and use the template in your Lovelace config. This config stays clean this way: you only specify the entities, attributes, units and icons which are displayed according to the layout defined in the template.

### Options

#### Main Card options
| Name | Type | Default | Since | Description |
|------|------|---------|-------|-------------|
| type | string | **required** | v0.8.0 | `custom:flex-horseshoe-card`.
| entities | list | **required** | v0.8.0 | One or more sensor entities in a list. See [available entity options](#available-entity-options) for requirements.
| layout | list/map | **required** | v0.8.0 | You MUST of course specify where each item is positioned on the card. See [layout options](#layout-options) for requirements.
| animations | list/map | optional | v0.8.0 | You can specify animations / dynamic behaviour depending on the state of an entity. Circles, lines and icons can be controlled depedning on the state of a given entity. See [animation options](#animation-options) for requirements.
| show | list/map | optional | | v0.8.0 | Determines what is shown, like the scale and the horseshoe style. See [show options](#showr-options) for requirements.
| horseshoe_scale | map | **required** |v0.8.0 | Specifies the scale configuration, like min, max, width and color of the scale. See [horseshoe scale](#horseshoe-scale) for requirements.
| horseshoe_state | map | **required** |v0.8.0 | Specifies the horseshoe width, and fixed color. See [horseshoe state](#horseshoe-state) for requirements.
| horseshoe color_stops | list | optional | v0.8.0 | Set thresholds for horseshoe gradients and colormapping. See [color stops](#color-stops) for requirements.

#### Available entity options
| Name | Type | Default | Since | Description |
|------|------|---------|-------|-------------|
| attribute | string | optional | v0.8.0 | The attribute to be used for the entity.
| unit | string | optional | v0.8.0 | Overrides the entity or attribute unit to be displayed.
| decimals | number | optional | v0.8.0 | Specifies the decimals to format the entity or attribute value.
| name | string | optional | v0.8.0 | Name used for entity or attribute. Overwrites the `friendly_name` attribute.
| area | string | optional | v0.8.0 | Area used for entity or attribute.
| tap_action | list/map | optional | v0.8.0 | How to respond to a mouse-click or tap.  See [available tap actions](#available-tap-actions) for requirements.

#### Horseshoe scale options
| Name | Type | Default | Options | Since | Description |
|------|------|---------|---------|-------|-------------|
| scale_min | number | **required** || v0.8.0 | Minimum number of the scale / horseshoe
| scale_max | number | **required** || v0.8.0 | Maximum number of the scale / horseshoe
| scale_color | color | `var(--background-color)`|any # or var color| v0.8.0 | 
| scale_width | pixels | 6 |size in pixels| v0.8.0 | Width of scale

#### Horseshoe state options
| Name | Type | Default | Options | Since | Description |
|------|------|---------|---------|-------|-------------|
| horseshoe_color | color | **required** |any # or var() color| v0.8.0 | Color of shoe if `shoe_fill_style` = `fixed`
| horseshoe_width | pixels | optional |size in pixels| v0.8.0 | Width of shoe
| colorstops | list | **required** || v0.8.0 | List of colorstop value and colors. Colors can be specified using a standard hex #RRGGBB color or CSS variable (defined in the theme), ie something like var(--color)

#### Shoe fill styles
| Option | Requires | Since | Description
|--------|----------|-------|-------------|
| autominmax | `colorstop` list with at least 2 values | v0.8.0 | Autominmax uses the `min` and `max` values to calculate a gradient color using the first and last entry in the colorstop list depening on the value of the entity or attribute.
| fixed | `shoe_color` | Fills the shoe with a single color
| colorstop | `colorstop` list with at least 2 values | v0.8.0 | Fills the shoe with the colorstop color depending on the colorstop value and the value of the state
| colorstopgradient | `colorstop` list with at least 2 values | v0.8.0 | Same as `colorstop`, but a gradient is used between colorstops
| lineargradient | `colorstop` list with at least 2 values | v0.8.0 | Uses the first and last entry in the `colorstop` list to display a linear gradient. It always shows the full gradient from start to end color, independent of the states value.


#### Entities list
Providing options are optional, entities can be listed directly, see example below.

| Name | Type | Default | Since | Description |
|------|:----:|:-------:|-------|-------------|
| entity | string | **required** | v0.8.0 | Entity id of the sensor.

#### Attributes list
Attributes are optional, but if an attribute is given, the entitie must be listed too.

| Name | Type | Default | Since | Description |
|------|:----:|:-------:|-------|-------------|
| attribute | string | **required** | v0.8.0 | Attribute id of the sensor.


#### Available show options
All options are optional.

| Name | Default | Parameter | Description |
|------|:-------:|:---------:|-------------|
| scale | true | `true` / `false` | Display scale
| horseshoe_style | `autominmax` | `fixed` / `autominmax`/ `colorstop` / `colorstopgradient`/ `lineargradient`| v0.8.0 | Fill style. Most fill styles need the colorstop list to be specified. See [shoe fill style list](#shoe fill styles) for a description.

### Example usage

#### Card example 7
![Another Example](https://tweakers.net/ext/f/xjuaTt3620GPgQyMnrrIIfth/full.png)

Card example nr 7 is configured as follows:

```yaml
- type: 'custom:flex-horseshoe-card'
  entities:
    - sensor.disk_use
    - sensor.disk_use_percent
    - sensor.disk_free
  decimals:
    - 1
    - 1
    - 1
  icons:
    - mdi:harddisk
  names:
    - '7: Disk Usage'
  areas:
    - Hestia
  scaleTickSize: 50
  show:
    scale: true
  layout:
    icons:
      - index: 0
        xpos: 50
        ypos: 20
        size: 3
    hlines:
      - xpos: 50
        ypos: 48
        length: 80
        color: white
        opacity: 0.5
    dots:
      - xpos: 50
        ypos: 61
        radius: 3
        color: white
        opacity: 0.5
    states:
      - index: 0
        xpos: 50
        ypos: 40
        font_size: 3
        opacity: 0.9
      - index: 1
        xpos: 46
        ypos: 64
        align: end
        font_size: 1.7
      - index: 2
        xpos: 54
        ypos: 64
        align: start
        font_size: 1.7
    names:
      - index: 0
        xpos: 50
        ypos: 100
    areas:
      - index: 0
        xpos: 50
        ypos: 80
  fill: 'rgb(0,0,0,0.0)'
  min: 0
  max: 215
  stroke_color: 'var(--adc-gradient-color-01)'
  stroke_back: 'var(--primary-background-color)'
  area: hestia
  color_stops:
    0: 'var(--adc-gradient-color-01)'
    7800: 'var(--adc-gradient-color-10)'
  gradient: false
```
## Future plans / ideas
There are already plans / ideas to extend this card with other functionality like switch states and actions.

### Add switch state with color
This means adding switches to the currently supported sensor values.
This also means able to configure a color depending on the switch state of an entity or attribute.

Layout wise, these cards can already be made, but parts are fixed, like the orange circle and the "AAN (ON)" state.

![](/images/horseshoe-future-idea-1.png)

### Add button actions if 'switch' pressed.
See previous image.
Pressing the button should toggle a ligh switch or something like that.

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
