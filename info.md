# ![](https://tweakers.net/ext/f/D4Fx1OKp6s7Hb21Wzq9JWCJb/full.png) Flexible Horseshoe Card, named after it's look & feel
Flexible looks-like-a-horseshoe card for [Home Assistant](https://github.com/home-assistant/home-assistant) Lovelace UI

![](https://tweakers.net/ext/f/3jaSI26J9QxHJa8rTriXFNNO/full.png)

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
| **Actions** | Handle click actions per entity to for instance switch a light on/off |

* * *
