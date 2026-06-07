

# :material-horseshoe: Layout section

##:material-horseshoe: Available layout options

The layout options determine where the objects are located on the card, and their initial appearance like font, font size, color, width, fill color, stroke color, etc.

| Name          |                  Type                   |   Default    | Since  | Description                                                                                                                                                                                                                                                                  |
| ------------- | :-------------------------------------: | :----------: | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Layout object | [layout object](#layout-object-options) | **required** | v0.8.0 | Entity objects:<ul><li>`states` for displaying a entity or attribute value</li><li>`names` for the name of the entity</li><li>`icons` for the entity icons</li></ul>Graphic objects:<ul><li>`circles` for circles</li><li>`hlines` and `vlines` for drawing lines.</li></ul> |

##:material-horseshoe: Layout object options

| Name                           |    Type    | Default        | Options                  | Since  | Description                                                                                                                                                                                                         |
| ------------------------------ | :--------: | -------------- | ------------------------ | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id                             |   number   | _not used yet_ |                          | v0.8.0 | Identifies the object.                                                                                                                                                                                              |
| xpos                           | percentage | **required**   | percentage 0..100        | v0.8.0 | Relative x-position in card. A value of 50 (%) places the object in the middle of the x-axis                                                                                                                        |
| ypos                           | percentage | **required**   | percentage 0..100        | v0.8.0 | Relative y-position in card. A value of 50 (%) places the object in the middle of the y-axis                                                                                                                        |
| length</br>_(lines only)_      | percentage | **required**   | percentage 0.100         | v0.8.0 | Relative length of a line. A value of 50 (%) means the line is half the size of the card's width                                                                                                                    |
| radius</br>_(circles only)_    |   pixels   | **required**   | > 1 / < 200              | v0.8.0 | Specifies the radius of the circle in pixels.                                                                                                                                                                       |
| icon*size</br> *(icons only)\_ |  em value  | **required**   | a value of 1 = 12px      | v0.8.0 | Specifies the size of the icon in em units. A calculation takes care of positioning the icon                                                                                                                        |
| align</br> _(icons only)_      |  position  | `middle`       | `start`/ `middle`/ `end` | v0.8.0 | Specifies the alignment of the icon relative to the xpos and ypos. Functions idential to the `text-anchor`css property. Used in positioning calculations for the icon.                                              |
| entity_index                   |   number   | **required**   | N/A                      | v0.8.0 | Refers to the 0-based index in the entity list which the layout is connected to                                                                                                                                     |
| animation_id                   |   number   | optional       | an Id                    | v0.8.0 | Identifies an animation in the animations section. It connects this layout object with dynamic behaviour                                                                                                            |
| styles                         |    list    | optional       | any valid css entry      | v0.8.0 | specify a list of css values to style the object. Must be terminated with a semicolon `;`.<br> Since v5.4.1 the `styles` section supports JavaScript templates for dynamic behaviour based on states or other logic |
| color_stops                    |    list    | optional       | N/A                      | v5.4.1 | specify a list of colors. The color of the object will change accordingly to the state of the entity                                                                                                                |

#### Example layout entry

The following layout is a part of card 5. For more complete examples, see the [examples section](#-examples-section)

![Another Example](https://tweakers.net/ext/f/xjuaTt3620GPgQyMnrrIIfth/full.png)

- xpos, ypos and length are **percentages**
- state layout 0 is connected to entity 0, ie the first entity in the entities section
- name layout 0 is also connected to entity 0

```yaml
layout:
  hlines:
    - id: 0
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
