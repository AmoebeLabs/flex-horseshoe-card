# Flexible Horseshoe Card, named after it's look & feel
Flexible looks-like-a-horseshoe card for [Home Assistant](https://github.com/home-assistant/home-assistant) Lovelace UI

### You are looking at the first version of this card. It is not yet fully documented and tested

The card can display data from entities and attributes from the sensor domain. It displays the current state and for the primary entity it fills the horseshoe with a color depending on the min and max values of the state and the configured color stops and styling.

The main perk of this card is it's flexibility. It is able to position a number of things where YOU want it:

| Feature | Note        |
|---------|-------------|
| Any number of entities | *There is currently no limit imposed on the number of entities in this card. I'm using max. 3 entities in the examples, but there is no problem using more.*
| Any number of attributes | Attributes are linked to an entity via their index in the lists.
| List of units | To override the unit defined by the entity/attribute. Linked via index in list.
| Any number of Icons | Icons are currently NOT linked to the entity or attribute, you just specify a list of icons.
| Any number of names and area's | These are treated as text strings, which can be placed anywhere on the card
| Any number of dots, horizontal and vertical lines | To function as a divider between values.

## Some examples

### Normal, flat UI
Cards in a standard vertical stack / horizontal stack - 2 cards per row - combination.

![](https://tweakers.net/ext/f/JRnq6D0rODy48SUOsUcFH1Bb/full.png)

Legend:
- (3), showing a single attribute from a darksky sensor, a unit (temperature), an area and horizontal line
- (4), showing three attributes from a darksky sensor (temperature, humidity and air pressure), units, two icons, a name and a horizontal line
- (5), showing trhee sensors from system monitoring (ram used, ram used percentage and ram free), extra free text below the sensor values ("in use" and "free"), a horizontal line and a vertical line.
- (6), same as (5), bit with different horizontal and vertical line.

All cards use different styling for filling the horseshoe with a color.

### Some extreme, industrial look, 3D UI
Using the same cards as above, but with different styling.

Again, cards in a standard vertical stack / horizontal stack - 2 cards per row - combination.

![Another Example](https://tweakers.net/ext/f/xjuaTt3620GPgQyMnrrIIfth/full.png)
![](https://tweakers.net/ext/f/3wRqCSI3EXdysHVFAwYzqpWl/full.png)

### It scales, as it is based on SVG
Using a single card in a row. Card scales to maximum width of the vertical stack card. No changes required for text size, icons, lines and state & attribute values. All thanks to SVG.

![](https://tweakers.net/ext/f/JNXii52PVqvVIIKA8wWZjGla/full.png)

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

The preferred method of using this card is by decluttering card templates. You define the layout and default options in this template and use the template in your Lovelace config. This config stays clean this way: you only specify the entities, attributes, units and icons which are displayed according to the layout defined in the template.

### Options

#### Main Card options
| Name | Type | Default | Since | Description |
|------|------|---------|-------|-------------|
| type | string | **required** | v1.0.0 | `custom:flex-horseshoe-card`.
| entities | list | **required** | v1.0.0 | One or more sensor entities in a list
| attributes | list | optional | v1.0.0 | One or more sensor attributes in a list, see [attibutes list](#attibutes-list) for requirements.
| units | list | optional | v1.0.0 | Overrides the entity or attribute unit to be displayed. The position in the list is the index that points to the entity or attribute. 
| decimals | list | optional | v1.0.0 | Specifies the decimals to format the entity or attribute value. The position in the list is the index that points to the entity or attribute. 
| names | list | optional | v1.0.0 | List of names to be displayed. No relation with entity or attribute friendly name.
| areas | list | optional | v1.0.0 | List of areas to be displayed. No relation with entity or attribute area.
| color_stops | list | optional | v1.0.0 | Set thresholds for horseshoe gradients and colormapping.
| decimals | list | optional | v1.0.0 | Specify the exact number of decimals to show for states.

#### Horseshoe Card options
| Name | Type | Default | Options | Since | Description |
|------|------|---------|---------|-------|-------------|
| min | number | **required** || v1.0.0 | Minimum number of the scale / horseshoe
| max | number | **required** || v1.0.0 | Maximum number of the scale / horseshoe
| scale_color | color | `var(--background-color)`|any # or var color| v1.0.0 | 
| scale_width | pixels | 6 |size in pixels| v1.0.0 | Width of scale
| shoe_color | color | **required** |any # or var() color| v1.0.0 | Color of shoe if `shoe_fill_style` = `fixed`
| shoe_width | pixels | optional |size in pixels| v1.0.0 | Width of shoe
| shoe_fill_style | string | `autominmax` | `fixed` / `autominmax`/ `colorstop` / `colorstopgradient`/ `lineargradient`| v1.0.0 | Fill style. Most fill styles need the colorstop list to be specified.
| colorstops | list | **required** || v1.0.0 | List of colorstop value and colors. Colors can be specified using a standard hex #RRGGBB color or CSS variable (defined in the theme), ie something like var(--color)

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
