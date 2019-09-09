# Flexible Horseshoe Card, named after it's look & feel
Flexible looks-like-a-horseshoe card for [Home Assistant](https://github.com/home-assistant/home-assistant) Lovelace UI

The card can display data from entities and attributes from the sensor domain. It displays the current state and for the primary entity it fills the horseshoe with a color depending on the min and max values of the state.

![Example](	https://tweakers.net/ext/f/JRnq6D0rODy48SUOsUcFH1Bb/full.png)

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
