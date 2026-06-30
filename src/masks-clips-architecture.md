# FHS - Masks And Clips

## Basic Idea

- `clip` = hard boundary (`<clipPath>`)
- `mask` = transparency/fade (`<mask>`)
- `layout.clips` and `layout.masks` are rendered inside SVG `<defs>`
- visible items only reference a name

```yaml
layout:
  clips:
    avatar-circle:
      circles:
        - xpos: 100
          ypos: 100
          radius: 50

  masks:
    avatar-fade:
      circles:
        - xpos: 100
          ypos: 100
          radius: 50
          styles:
            fill: url(#fhs-gradient-avatar-fade)

  icons:
    - icon: url(/local/images/bird.png)
      xpos: 100
      ypos: 100
      width: 100
      height: 100
      clip: avatar-circle
      mask: avatar-fade
```

Internal SVG:

```svg
<defs>
  <clipPath id="fhs-clip-avatar-circle">
    <circle cx="100" cy="100" r="50" />
  </clipPath>

  <mask id="fhs-mask-avatar-fade">
    <circle cx="100" cy="100" r="50" fill="url(#fhs-gradient-avatar-fade)" />
  </mask>
</defs>
```

### SVG Id Scope

Clip and mask ids must be scoped per FHS card instance. Multiple cards can use the same config name, so the generated SVG id should include the card id.

Example generated ids:

```text
fhs-${cardId}-clip-avatar-circle
fhs-${cardId}-mask-avatar-fade
```

Item references must use the same scoped ids:

```svg
clip-path="url(#fhs-${cardId}-clip-avatar-circle)"
mask="url(#fhs-${cardId}-mask-avatar-fade)"
```

### SVG Coordinate Units

Clips and masks should use the same 0..200 user-space coordinate system as the rest of the FHS SVG. Set the units explicitly so browser SVG defaults cannot change the coordinate interpretation.

```svg
<clipPath id="fhs-${cardId}-clip-avatar-circle" clipPathUnits="userSpaceOnUse">
  ...
</clipPath>

<mask id="fhs-${cardId}-mask-avatar-fade" maskUnits="userSpaceOnUse">
  ...
</mask>
```

Use on the item:

```svg
<g clip-path="url(#fhs-clip-avatar-circle)">
  <g mask="url(#fhs-mask-avatar-fade)">
    <image href="/local/images/bird.png" ... />
  </g>
</g>
```

---

## Why Separate Sections?

Not this:

```yaml
defs:
  avatar:
    type: mask
```

Use this:

```yaml
layout:
  clips: {}
  masks: {}
```

Benefits:

- no extra `type` key is needed
- it is clear what becomes a `<clipPath>`
- it is clear what becomes a `<mask>`
- the same shape sections can be reused
- implementation can be done step by step

---

## Example 1 - Make An Image Circular With A Soft Edge

```yaml
layout:
  gradients:
    avatar-fade-gradient:
      type: radial
      cx: 100
      cy: 100
      r: 50
      stops:
        - offset: 0%
          color: white
          opacity: 1
        - offset: 75%
          color: white
          opacity: 1
        - offset: 100%
          color: black
          opacity: 1

  clips:
    avatar-circle:
      circles:
        - xpos: 100
          ypos: 100
          radius: 50

  masks:
    avatar-fade:
      circles:
        - xpos: 100
          ypos: 100
          radius: 50
          styles:
            fill: url(#fhs-gradient-avatar-fade-gradient)

  icons:
    - icon: url(/local/images/bird.png)
      xpos: 100
      ypos: 100
      width: 100
      height: 100
      clip: avatar-circle
      mask: avatar-fade
```

Result:

- the clip cuts hard at the circle boundary
- the mask softens the edge
- the image can never render outside the circle

---

## Example 2 - Card With A Round Notch

```yaml
layout:
  masks:
    card-notch:
      rectangles:
        - xpos: 0
          ypos: 0
          width: 200
          height: 120
          radius: 16
          styles:
            fill: white

      circles:
        - xpos: 100
          ypos: 0
          radius: 20
          styles:
            fill: black

  rectangles:
    - xpos: 0
      ypos: 0
      width: 200
      height: 120
      radius: 16
      mask: card-notch
      styles:
        fill: var(--ha-card-background)
```

Meaning inside the mask:

- white rectangle = visible
- black circle = removed
- circle is half over the top edge
- that creates the notch

Note:

- a mask does not change geometry
- it only removes pixels
- a stroke therefore does not automatically follow the new contour

---

## Example 3 - Hard Shape With Soft Fade At Top And Bottom

```yaml
layout:
  gradients:
    fade-top-bottom:
      type: linear
      x1: 0
      y1: 0
      x2: 0
      y2: 1
      stops:
        - offset: 0%
          color: black
          opacity: 1
        - offset: 15%
          color: white
          opacity: 1
        - offset: 85%
          color: white
          opacity: 1
        - offset: 100%
          color: black
          opacity: 1

  clips:
    rounded-window:
      rectangles:
        - xpos: 20
          ypos: 30
          width: 160
          height: 90
          radius: 18

  masks:
    window-fade:
      rectangles:
        - xpos: 20
          ypos: 30
          width: 160
          height: 90
          radius: 18
          styles:
            fill: url(#fhs-gradient-fade-top-bottom)

  icons:
    - icon: url(/local/images/map-background.jpg)
      xpos: 20
      ypos: 30
      width: 160
      height: 90
      clip: rounded-window
      mask: window-fade
      styles:
        opacity: 0.85
```

Result:

- image has hard rounded corners
- top and bottom fade away
- center remains fully visible

---

## Example 4 - Multiple Shapes In One Mask

```yaml
layout:
  gradients:
    vignette:
      type: radial
      cx: 100
      cy: 70
      r: 100
      stops:
        - offset: 0%
          color: white
          opacity: 1
        - offset: 70%
          color: white
          opacity: 1
        - offset: 100%
          color: black
          opacity: 1

  clips:
    city-frame:
      paths:
        - d: M20 20 H180 L165 120 H35 L20 105 Z

  masks:
    city-vignette:
      rectangles:
        - xpos: 20
          ypos: 20
          width: 160
          height: 100
          styles:
            fill: url(#fhs-gradient-vignette)

      circles:
        - xpos: 100
          ypos: 70
          radius: 35
          styles:
            fill: white

      rectangles:
        - xpos: 20
          ypos: 20
          width: 160
          height: 100
          styles:
            fill: rgba(255, 255, 255, 0.5)

  icons:
    - icon: url(/local/images/city.jpg)
      xpos: 20
      ypos: 20
      width: 160
      height: 100
      clip: city-frame
      mask: city-vignette
```

This combines:

- a hard polygon-like clip
- a radial-gradient mask
- an extra white circle as spotlight
- a rectangle as base coverage

---

## Example 5 - Horseshoe-Like Fade To Left And Right

This is one mask, not two separate masks.

```yaml
layout:
  gradients:
    fade-left-right:
      type: linear
      x1: 0
      y1: 0
      x2: 1
      y2: 0
      stops:
        - offset: 0%
          color: black
          opacity: 1
        - offset: 20%
          color: white
          opacity: 1
        - offset: 80%
          color: white
          opacity: 1
        - offset: 100%
          color: black
          opacity: 1

  masks:
    hs-fade-both:
      horseshoes:
        - xpos: 100
          ypos: 100
          radius: 60
          arc_degrees: 270
          start_angle: -135
          end_angle: 135
          horseshoe_state:
            width: 14
            styles:
              stroke: url(#fhs-gradient-fade-left-right)

  icons:
    - icon: url(/local/images/energy-texture.jpg)
      xpos: 25
      ypos: 25
      width: 150
      height: 150
      mask: hs-fade-both
```

Result:

- image is only visible in the horseshoe arc
- left and right side of the arc fade away
- center remains fully visible

Note:

- this requires horseshoes to render as mask sources later
- this can be postponed for the first implementation

---

## JavaScript - Basic Render Structure

### Render Defs

```js
renderDefs() {
  return html`
    <defs>
      ${this.renderGradients(this._layout.gradients)}
      ${this.renderClips(this._layout.clips)}
      ${this.renderMasks(this._layout.masks)}
    </defs>
  `;
}
```

### Render Clips

```js
renderClips(clips) {
  return Object.entries(clips).map(([id, clip]) => html`
    <clipPath id=${`fhs-clip-${id}`}>
      ${this.renderShapeSections(clip)}
    </clipPath>
  `);
}
```

### Render Masks

```js
renderMasks(masks) {
  return Object.entries(masks).map(([id, mask]) => html`
    <mask id=${`fhs-mask-${id}`}>
      ${this.renderShapeSections(mask)}
    </mask>
  `);
}
```

### Reuse Existing Sections

```js
renderShapeSections(config) {
  return html`
    ${this.renderRectangles(config.rectangles)}
    ${this.renderCircles(config.circles)}
    ${this.renderLines(config.lines)}
    ${this.renderPaths(config.paths)}
  `;
}
```

Possible later version:

```js
renderShapeSections(config) {
  return html`
    ${this.renderRectangles(config.rectangles)}
    ${this.renderCircles(config.circles)}
    ${this.renderLines(config.lines)}
    ${this.renderPaths(config.paths)}
    ${this.renderHorseshoes(config.horseshoes)}
  `;
}
```

---

## JavaScript - Clip And Mask On An Item

Basic version:

```js
renderMaskedItem(item, content) {
  const clip = item.clip && `url(#fhs-clip-${item.clip})`;
  const mask = item.mask && `url(#fhs-mask-${item.mask})`;

  return html`
    <g clip-path=${clip}>
      <g mask=${mask}>
        ${content}
      </g>
    </g>
  `;
}
```

Without rendering empty attributes:

```js
renderItemLayers(item, content) {
  let result = content;

  if (item.mask) {
    result = html`<g mask=${`url(#fhs-mask-${item.mask})`}>${result}</g>`;
  }

  if (item.clip) {
    result = html`<g clip-path=${`url(#fhs-clip-${item.clip})`}>${result}</g>`;
  }

  return result;
}
```

Use:

```js
renderIcon(item) {
  const content = html`
    <image
      href=${item.iconUrl}
      x=${item.x}
      y=${item.y}
      width=${item.width}
      height=${item.height}
      style=${styleMap(item.styles)}
    />
  `;

  return this.renderItemLayers(item, content);
}
```

---

## JavaScript - Order With Filter Later

If filters are added later, this is usually the best order:

```svg
<g filter="url(#shadow)">
  <g clip-path="url(#clip)">
    <g mask="url(#mask)">
      ...shape...
    </g>
  </g>
</g>
```

In JavaScript:

```js
renderItemLayers(item, content) {
  let result = content;

  if (item.mask) {
    result = html`<g mask=${`url(#fhs-mask-${item.mask})`}>${result}</g>`;
  }

  if (item.clip) {
    result = html`<g clip-path=${`url(#fhs-clip-${item.clip})`}>${result}</g>`;
  }

  if (item.filter) {
    result = html`<g filter=${`url(#fhs-filter-${item.filter})`}>${result}</g>`;
  }

  return result;
}
```

Filter support can be postponed for now.

---

## Normalization

On visible items:

```yaml
clip: avatar-circle
mask: avatar-fade
```

Internal normalized shape:

```js
{
  clip: 'avatar-circle',
  mask: 'avatar-fade',
  styles: { ... }
}
```

On defs:

```yaml
layout:
  clips:
    name:
      circles: []
      rectangles: []
      paths: []

  masks:
    name:
      circles: []
      rectangles: []
      paths: []
```

Important:

- no defaults in the render layer
- normalization decides whether sections exist
- render layer renders already-normalized config
- `clips` and `masks` reuse the existing shape section structure, so templates and `same_as` can follow the same config pipeline
