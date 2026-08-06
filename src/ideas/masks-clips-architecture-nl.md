# FHS – masks en clips

## Basisidee

- `clip` = harde grens (`<clipPath>`)
- `mask` = transparantie/fade (`<mask>`)
- `layout.clips` en `layout.masks` staan in SVG `<defs>`
- zichtbare items gebruiken alleen een naam

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

Intern:

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

### SVG id-scope

Clip- en mask-ids moeten per FHS kaartinstantie uniek zijn. Meerdere kaarten kunnen dezelfde configuratienaam gebruiken, dus het gegenereerde SVG id moet de card id bevatten.

Voorbeeld gegenereerde ids:

```text
fhs-${cardId}-clip-avatar-circle
fhs-${cardId}-mask-avatar-fade
```

Itemreferenties moeten dezelfde scoped ids gebruiken:

```svg
clip-path="url(#fhs-${cardId}-clip-avatar-circle)"
mask="url(#fhs-${cardId}-mask-avatar-fade)"
```

### SVG coordinate units

Clips en masks moeten dezelfde 0..200 user-space coordinaten gebruiken als de rest van de FHS SVG. Zet de units expliciet zodat browser SVG defaults de coordinaten niet anders interpreteren.

```svg
<clipPath id="fhs-${cardId}-clip-avatar-circle" clipPathUnits="userSpaceOnUse">
  ...
</clipPath>

<mask id="fhs-${cardId}-mask-avatar-fade" maskUnits="userSpaceOnUse">
  ...
</mask>
```

Gebruik op het item:

```svg
<g clip-path="url(#fhs-clip-avatar-circle)">
  <g mask="url(#fhs-mask-avatar-fade)">
    <image href="/local/images/bird.png" ... />
  </g>
</g>
```

---

## Waarom aparte secties?

Niet dit:

```yaml
defs:
  avatar:
    type: mask
```

Wel dit:

```yaml
layout:
  clips: {}
  masks: {}
```

Voordelen:

- geen extra `type` nodig
- duidelijk wat naar `<clipPath>` gaat
- duidelijk wat naar `<mask>` gaat
- dezelfde shape-secties kunnen worden hergebruikt
- makkelijker stap voor stap te implementeren

---

## Voorbeeld 1 – afbeelding rond maken met zachte rand

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

Resultaat:

- clip snijdt hard af op de cirkel
- mask maakt de rand zacht
- afbeelding kan nooit buiten de cirkel komen

---

## Voorbeeld 2 – kaart met ronde inkeping

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

Betekenis in het masker:

- witte rechthoek = zichtbaar
- zwarte cirkel = weggeknipt
- cirkel ligt half over de bovenrand
- daardoor ontstaat de inkeping

Let op:

- masker verandert de geometrie niet
- het knipt alleen pixels weg
- een stroke volgt dus niet automatisch de nieuwe contour

---

## Voorbeeld 3 – harde vorm plus zachte fade boven en onder

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

Resultaat:

- afbeelding heeft harde afgeronde hoeken
- boven en onder fade de afbeelding weg
- midden blijft volledig zichtbaar

---

## Voorbeeld 4 – meerdere vormen in één masker

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

Hier combineer je:

- een harde polygon-achtige clip
- een radial-gradient masker
- een extra witte cirkel als spotlight
- een rechthoek als basisdekking

---

## Voorbeeld 5 – horseshoe-achtige fade naar links en rechts

Dit is één masker, niet twee losse maskers.

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

Resultaat:

- afbeelding is alleen zichtbaar in de horseshoe-boog
- links en rechts fade de boog weg
- midden blijft volledig zichtbaar

Let op:

- dit vraagt dat horseshoes later ook als mask-bron kunnen renderen
- voor eerste implementatie kun je dit parkeren

---

## JavaScript – basis renderstructuur

### Defs renderen

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

### Clips renderen

```js
renderClips(clips) {
  return Object.entries(clips).map(([id, clip]) => html`
    <clipPath id=${`fhs-clip-${id}`}>
      ${this.renderShapeSections(clip)}
    </clipPath>
  `);
}
```

### Masks renderen

```js
renderMasks(masks) {
  return Object.entries(masks).map(([id, mask]) => html`
    <mask id=${`fhs-mask-${id}`}>
      ${this.renderShapeSections(mask)}
    </mask>
  `);
}
```

### Bestaande secties hergebruiken

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

Later eventueel:

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

## JavaScript – clip en mask op een item

Basis:

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

Als je geen lege attributen wilt renderen:

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

Gebruik:

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

## JavaScript – volgorde met filter later

Als filters later terugkomen, is dit meestal de beste volgorde:

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

Maar filter kun je voorlopig parkeren.

---

## Normalisatie

Aan zichtbare items:

```yaml
clip: avatar-circle
mask: avatar-fade
```

Interne genormaliseerde vorm:

```js
{
  clip: 'avatar-circle',
  mask: 'avatar-fade',
  styles: { ... }
}
```

Aan defs:

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

Belangrijk:

- geen defaults in renderlaag
- normalisatie bepaalt of secties bestaan
- renderlaag rendert wat al genormaliseerd is
