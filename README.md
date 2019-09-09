# Flexible Horseshoe Card, named after it's look & feel
Flexible looks-like-a-horseshoe card for [Home Assistant](https://github.com/home-assistant/home-assistant) Lovelace UI

### You are looking at the first version of this card. It is not yet fully documented and tested

The card can display data from entities and attributes from the sensor domain. It displays the current state and for the primary entity it fills the horseshoe with a color depending on the min and max values of the state.

The main perk of this card is it's flexibility. It is able to position a number of things where YOU want it:
- Any number of entities.

  *There is currently no limit imposed on the number of entities in this card. I'm using max. 3 entities in the examples, but there is no problem using more.*
- Any number of atributes (linked to an entity via their index in the lists).
- Any number of Units

  *Units are currently NOT linked to the entity or attribute, you just specify a list of units.*
- Any number of Icons

  *Icons are currently NOT linked to the entity or attribute, you just specify a list of icons.*
- Any number of names and area's.

  *These are just strings, which can be placed anywhere on the card*
- Any number of dots, horizontal and vertical lines

  To function as a divider between values.

## Some examples

### Normal, flat UI
![](https://tweakers.net/ext/f/JRnq6D0rODy48SUOsUcFH1Bb/full.png)

Legend:
- (3), showing a single attribute from a darksky sensor, a unit (temperature), an area and horizontal line
- (4), showing three attributes from a darksky sensor (temperature, humidity and air pressure), units, two icons, a name and a horizontal line
- (5), showing trhee sensors from system monitoring (ram used, ram used percentage and ram free), extra free text below the sensor values ("in use" and "free"), a horizontal line and a vertical line.
- (6), same as (5), bit with different horizontal and vertical line.

All cards use different styling for filling the horseshoe with a color.

### Some extreme, industrial look, 3D UI
Using the same cards as above, but with different styling.

![Another Example](	https://tweakers.net/ext/f/xjuaTt3620GPgQyMnrrIIfth/full.png)
![](https://tweakers.net/ext/f/3wRqCSI3EXdysHVFAwYzqpWl/full.png)

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

### Options

#### Card options
| Name | Type | Default | Since | Description |
|------|------|---------|-------|-------------|
| type | string | **required** | v1.0.0 | `custom:flex-horseshoe-card`.
| entities | list | **required** | v1.0.0 | One or more sensor entities in a list
| attributes | list | optional | v1.0.0 | One or more sensor attributes in a list, see [attibutes list](#attibutes-list) for requirements.
| units | list | optional | v1.0.0 | Specify the units to be displayed. The index points to the entity or attribute.
| color_stops | list | optional | v1.0.0 | Set thresholds for horseshoe gradients and colormapping.
| decimals | list | optional | v1.0.0 | Specify the exact number of decimals to show for states.

#### Entities list
Providing options are optional, entities can be listed directly, see example below.

| Name | Type | Default | Since | Description |
|------|:----:|:-------:|-------|-------------|
| entity | string | **required** | v1.0.0 | Entity id of the sensor.

#### Attributes list
Attributes are optional, but if an attribute is given, the entitie must be listed too.

| Name | Type | Default | Since | Description |
|------|:----:|:-------:|-------|-------------|
| attribute | string | **required** | v1.0.0 | Attribute id of the sensor.


#### Available show options
All options are optional.

| Name | Default | Parameter | Description |
|------|:-------:|:---------:|-------------|
| scale | true | `true` / `false` | Display scale

### Example usage

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
