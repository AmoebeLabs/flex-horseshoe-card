# ![](https://tweakers.net/ext/f/D4Fx1OKp6s7Hb21Wzq9JWCJb/full.png) Flexible Horseshoe Card
Info Flexible looks-like-a-horseshoe card for [Home Assistant](https://github.com/home-assistant/home-assistant) Lovelace UI.

**Version v5.x.x** now uses the latest Lit v3 and adds new features like state-based color stops, card styling with background colors and images, and JavaScript templates for dynamic styling. This makes it even easier to customize the appearance of the horseshoe card.

![](https://tweakers.net/ext/f/3jaSI26J9QxHJa8rTriXFNNO/full.png)


*The Lovelace view of the above examples is in the repository in the examples folder.
</br>So you can see how these layouts are done*
***

## Introduction
The Flexible Horseshoe Card can display data from entities and their attributes across sensor and other domains. It shows the current state and, for the primary entity, fills the horseshoe with a color based on the state value, the configured minimum and maximum values, color stops, and styling.

The main strength of this card is its flexibility. You can position each object exactly where you want it by using a layout specification for every object on the card.


| Feature | Description |
|---------|-------------|
| **Any number of entities** | For each entity, you can specify the attribute, unit, icon, name, area, and tap action.<br /><br />*There is currently no limit on the number of entities in this card. The examples use up to 3 entities, but you can use more.* |
| **Any number of circles, horizontal lines, and vertical lines** | Use circles and lines as dividers between values or as backgrounds for values. |
| **Card layout** | Each object can be positioned using relative coordinates on the card. |
| **Animations and dynamic behavior** | Define what happens when an entity changes state, such as changing color or running a CSS animation. Several predefined animations are available. |
| **Horseshoe coloring** | Color the horseshoe in several ways: from a single fixed color to a gradient based on color stops. |
| **Actions** | Define tap actions per entity, for example to switch a light on or off. ![](https://tweakers.net/ext/f/Hk2Lzz2VkPbDUvEQUubBXoJU/full.gif) |
| **Color stops** | New since v5.x: define color transitions based on the state of an entity. |
| **JavaScript templates** | New since v5.4.x: use JavaScript templates between `[[[` and `]]]` in the `styles` section to dynamically change formatting based on states. |
| **Card styling** | New since v5.4.x: add a `styles` section to the card to define custom card styling, such as colors, background images, and more. |

* * *
