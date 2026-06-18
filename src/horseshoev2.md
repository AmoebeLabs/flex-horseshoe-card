# Beoordeling `horseshoe-gauge-v2.js`

Dit document beoordeelt de nieuwe module `horseshoe-gauge-v2.js` en focust op:

- waarom de hoofdconstructor waarschijnlijk niet zichtbaar lijkt te draaien
- wat er functioneel mis is in de module
- hoe data-verwerking en rendering nu door elkaar lopen

## Kernconclusie

De voornaamste reden dat je geen logging uit `horseshoe-gauge-v2.js` ziet, is niet direct een fout in de constructor zelf, maar dat deze module op dit moment helemaal niet wordt geïmporteerd door de kaart.

- In [main.js](/workspaces/flex-horseshoe-card/src/main.js:47) wordt `HorseshoeGaugeV2` geïmporteerd uit `./horseshoe-gauge-v2d.js`.
- De instantie-opbouw loopt via [main.js](/workspaces/flex-horseshoe-card/src/main.js:2113).
- `setState()` wordt daarna aangeroepen via [main.js](/workspaces/flex-horseshoe-card/src/main.js:1070).

Dus: als jij logging in `horseshoe-gauge-v2.js` hebt gezet, maar `main.js` laadt nog `horseshoe-gauge-v2d.js`, dan zal de constructor in `horseshoe-gauge-v2.js` nooit uitgevoerd worden.

## Bevindingen

### 1. Verkeerde module wordt geladen

Hoogste prioriteit.

- [main.js](/workspaces/flex-horseshoe-card/src/main.js:47) importeert `./horseshoe-gauge-v2d.js`.
- Daardoor wordt de constructor in [horseshoe-gauge-v2.js](/workspaces/flex-horseshoe-card/src/horseshoe-gauge-v2.js:476) niet aangeroepen.

Gevolg:

- geen `console.log('constructor', ...)` uit `horseshoe-gauge-v2.js`
- geen `render in v2` uit deze nieuwe module
- alle runtime-observaties die jij nu doet, horen feitelijk bij `v2d`, niet bij `v2`

### 2. `setConfig()` bevat onbereikbare code

In [horseshoe-gauge-v2.js](/workspaces/flex-horseshoe-card/src/horseshoe-gauge-v2.js:293) staat:

- een eerste `return` op regel 296
- daarna nog een tweede `return` op regels 298-300

De tweede `return` wordt nooit bereikt. Daardoor draait deze filter ook nooit:

- `filter((horseshoe) => horseshoe.show?.horseshoe !== false)`

Gevolg:

- verborgen horseshoes worden niet weggefilterd
- de methode bevat restcode, wat debugging lastiger maakt

### 3. `renderState()` rendert nu alleen een hardcoded testpad

In [horseshoe-gauge-v2.js](/workspaces/flex-horseshoe-card/src/horseshoe-gauge-v2.js:613) zit een debug-stub:

- regels 638-646 returnen altijd een pad met:
  - vast `id="TEST-HORSESHOE-V2-PATH"`
  - `fill="red"`
  - `opacity="1"`
- de echte rendering op regels 648-657 is daardoor onbereikbaar

Gevolg:

- alle state-segmenten krijgen dezelfde testuitvoer
- unieke element-id's voor animatie en DOM-updates worden niet aangemaakt
- de animatielogica lager in het bestand kan haar doel-elementen niet betrouwbaar terugvinden

### 4. Animatie- en DOM-updatepad is strak gekoppeld aan rendering-output

De klasse doet nu tegelijk:

- config normalisatie
- state-resolutie
- geometrie-opbouw
- padberekening
- Lit-rendering
- directe DOM-mutatie voor animatie

Concreet:

- `setState()` bouwt runtime-config, haalt waarde op, doet state mapping en initialiseert scale/geometrie in [horseshoe-gauge-v2.js](/workspaces/flex-horseshoe-card/src/horseshoe-gauge-v2.js:506)
- render-methodes bouwen SVG output in [horseshoe-gauge-v2.js](/workspaces/flex-horseshoe-card/src/horseshoe-gauge-v2.js:564)
- animatie schrijft daarna rechtstreeks terug naar DOM nodes via `updateStatePathDom()` in [horseshoe-gauge-v2.js](/workspaces/flex-horseshoe-card/src/horseshoe-gauge-v2.js:1052)
- die methode zoekt elementen terug via `card.renderRoot` in [horseshoe-gauge-v2.js](/workspaces/flex-horseshoe-card/src/horseshoe-gauge-v2.js:1090)

Gevolg:

- de klasse heeft meerdere verantwoordelijkheden
- unit-testen van data-logica wordt lastig omdat veel methodes impliciet UI-context verwachten
- rendering en animatie zijn kwetsbaar voor kleine templatewijzigingen

### 5. De nieuwe module wijkt functioneel af van `v2d`

De live gebruikte versie `horseshoe-gauge-v2d.js` heeft een iets andere constructor-/state-opbouw dan de nieuwe `v2`.

Voorbeeld:

- `main.js` gebruikt nu `v2d`
- `v2d` initialiseert `GaugeScale` met extra `bar_mode`-context
- `v2` doet dat in [horseshoe-gauge-v2.js](/workspaces/flex-horseshoe-card/src/horseshoe-gauge-v2.js:534) niet

Dat hoeft niet per se fout te zijn, maar het betekent wel dat gedrag vergelijken op logging alleen onvoldoende is. Je vergelijkt nu twee verschillende implementaties.

## Antwoord op je vraag over de constructor

Mijn beoordeling: de constructor in `horseshoe-gauge-v2.js` lijkt inhoudelijk wel correct aangeroepen te worden als de module echt gebruikt zou worden. Het ontbreken van logging wijst hier vooral op een laad-/importprobleem, niet op een defecte constructor.

De feitelijke keten is:

1. `main.js` importeert `horseshoe-gauge-v2d.js`
2. `main.js` roept `HorseshoeGaugeV2.setConfig(...)` aan
3. de constructor van `v2d` draait
4. jouw nieuwe `horseshoe-gauge-v2.js` blijft buiten beeld

## Scheiding data-verwerking en rendering

Je opmerking is terecht: die scheiding is nu onvoldoende scherp.

### Wat nu data-/domeinlogica is

Deze delen horen conceptueel los te staan van rendering:

- `normalizeBaseConfig()` in [horseshoe-gauge-v2.js](/workspaces/flex-horseshoe-card/src/horseshoe-gauge-v2.js:303)
- `normalizeRuntimeConfig()` in [horseshoe-gauge-v2.js](/workspaces/flex-horseshoe-card/src/horseshoe-gauge-v2.js:319)
- `getStateMapItem()` in [horseshoe-gauge-v2.js](/workspaces/flex-horseshoe-card/src/horseshoe-gauge-v2.js:550)
- `getStateArcs()` en varianten in [horseshoe-gauge-v2.js](/workspaces/flex-horseshoe-card/src/horseshoe-gauge-v2.js:731)
- `getLabelItems()` in [horseshoe-gauge-v2.js](/workspaces/flex-horseshoe-card/src/horseshoe-gauge-v2.js:905)

Deze methodes produceren in essentie view-model data:

- genormaliseerde config
- actuele waarde
- arc-definities
- label-definities

### Wat rendering hoort te zijn

Rendering zou beperkt moeten blijven tot:

- `render()`
- `renderScale()`
- `renderState()`
- `renderLabels()`

Dus: input is voorbereid view-model, output is alleen SVG/Lit template.

### Wat er nu tussendoor lekt

De animatielaag zit er nu middenin:

- `startValueAnimation()` in [horseshoe-gauge-v2.js](/workspaces/flex-horseshoe-card/src/horseshoe-gauge-v2.js:965)
- `updateValueAnimation()` in [horseshoe-gauge-v2.js](/workspaces/flex-horseshoe-card/src/horseshoe-gauge-v2.js:996)
- `updateStatePathDom()` in [horseshoe-gauge-v2.js](/workspaces/flex-horseshoe-card/src/horseshoe-gauge-v2.js:1052)
- `getStatePathElement()` in [horseshoe-gauge-v2.js](/workspaces/flex-horseshoe-card/src/horseshoe-gauge-v2.js:1090)

Dat is precies de vermenging die je wilt vermijden:

- domeinlogica levert pad-data
- rendering maakt elementen
- animatie hoort ofwel via Lit state te lopen, of in een aparte render adapter/animator

## Aanbevolen opsplitsing

Pragmatische indeling:

### 1. `horseshoe-v2-model`

Verantwoordelijk voor:

- config normaliseren
- entity/state omzetten naar een numerieke view-state
- arc- en label-definities produceren

Output bijvoorbeeld:

- `runtimeConfig`
- `value`
- `displayModel`
  - `scaleArcs`
  - `stateArcs`
  - `labels`

### 2. `horseshoe-v2-renderer`

Verantwoordelijk voor:

- Lit/SVG template genereren uit puur inputmodel
- geen entity parsing
- geen template resolving
- geen DOM query's

### 3. `horseshoe-v2-animator`

Verantwoordelijk voor:

- tween van `displayValue`
- eventueel opnieuw model laten berekenen
- zo min mogelijk directe kennis van config parsing

## Kort oordeel

De belangrijkste verklaring voor "constructor wordt niet aangeroepen" is dat `main.js` nog `horseshoe-gauge-v2d.js` gebruikt in plaats van `horseshoe-gauge-v2.js`.

Daarnaast bevat `horseshoe-gauge-v2.js` op dit moment nog duidelijke work-in-progress signalen:

- onbereikbare code in `setConfig()`
- een hardcoded test-return in `renderState()`
- sterke vermenging van data-opbouw, rendering en DOM-animatie

Als je wilt, kan ik in een volgende stap deze notities omzetten naar een concreet refactorvoorstel of direct een opgeschoonde `horseshoe-gauge-v2.js` maken.

## Architectuurschets: data, animator, renderer volledig los

Je uitgangspunt is correct:

- de berekenlaag rekent alles uit
- de renderer rendert alleen al berekende data
- de animator animeert alleen tussen waarden

Daarmee kun je later zonder renderer-impact:

- een andere schaalformule gebruiken
- een andere geometrie gebruiken
- andere puntberekeningen of spline-logica invoeren
- alternatieve segmentatie toevoegen

De renderer hoeft dan alleen nog een stabiel view-model te kennen.

## Gewenste lagen

### 1. Config/model-laag

Verantwoordelijkheden:

- basisconfig normaliseren
- templates resolven
- runtime-config opbouwen
- entity/state omzetten naar domeinwaarde
- state mapping toepassen

Input:

- ruwe kaartconfig
- entity
- entityConfig
- templates

Output:

- `runtimeConfig`
- `resolvedState`

Bijvoorbeeld:

```js
{
  rawState: "23.6",
  numericValue: 23.6,
  mappedState: null,
  displayText: "23.6",
}
```

Deze laag weet niets van SVG, DOM of Lit.

### 2. Geometry engine

Verantwoordelijkheden:

- waarde naar ratio vertalen
- ratio naar hoek vertalen
- hoek naar punt vertalen
- booggrenzen bepalen
- cap-correcties bepalen

Input:

- `runtimeConfig`
- `resolvedState`

Output:

- puur geometrische definities

Bijvoorbeeld:

```js
{
  center: { x: 100, y: 100 },
  radius: 90,
  startAngle: 140,
  endAngle: 400,
  zeroAngle: 270,
}
```

Ook deze laag weet niets van DOM of rendering.

### 3. Shape/model builder

Verantwoordelijkheden:

- scale-arcs opbouwen
- state-arcs opbouwen
- labelposities opbouwen
- kleuren kiezen
- linecaps/gaps verwerken

Dit is de laag die uit berekeningen een renderbaar view-model maakt.

Input:

- `runtimeConfig`
- `resolvedState`
- `geometryModel`
- eventueel `displayValue`

Output:

- stabiele renderdata

Bijvoorbeeld:

```js
{
  scalePaths: [
    {
      key: "scale",
      d: "...",
      fill: "var(--primary-background-color)",
      opacity: 1,
    }
  ],
  statePaths: [
    {
      key: "state-value",
      d: "...",
      fill: "#ff8800",
      opacity: 1,
    }
  ],
  labels: [
    {
      key: "min",
      text: "0",
      x: 12,
      y: 55,
      angle: 140,
    }
  ],
}
```

Hier zit dus de essentie van je opmerking:

- andere formules kunnen hier of in de geometry engine leven
- de renderer blijft identiek zolang het outputmodel hetzelfde blijft

### 4. Renderer

Verantwoordelijkheden:

- bestaande nodes opzetten
- initieel SVG renderen
- een stabiele mapping tussen `key` en DOM element maken

De renderer doet dus niet:

- geen waardeberekeningen
- geen state mapping
- geen hoekberekening
- geen kleurenlogica behalve wat in het model staat

De renderer leest alleen:

- `scalePaths`
- `statePaths`
- `labels`

De renderer schrijft:

- SVG markup

## Animator los van Lit

Als je Lit-overhead tijdens animatie wilt vermijden, dan is dit de goede vorm:

### Eerste render

Lit rendert eenmalig:

- alle scale paths
- alle state paths
- alle labels

Na die render cache je handles:

```js
{
  scalePaths: Map<key, SVGPathElement>,
  statePaths: Map<key, SVGPathElement>,
  labels: Map<key, SVGTextElement>,
}
```

### Tijdens animatie

De animator doet alleen:

1. bepaal `progress`
2. bereken `displayValue`
3. laat de shape/model builder nieuw view-model maken
4. schrijf alleen gewijzigde attributen naar bestaande nodes

Dus bijvoorbeeld:

- `path.setAttribute('d', next.d)`
- `path.setAttribute('fill', next.fill)`
- `path.setAttribute('opacity', next.opacity)`

Geen Lit render per frame.

## Belangrijke ontwerpregel

De animator mag geen SVG-formules kennen.

Dus niet:

- animator rekent zelf hoeken uit
- animator bouwt zelf padstrings

Wel:

- animator beheert alleen tijd en interpolatie
- builder/geometrie rekenen uit wat de nieuwe data is
- DOM adapter past de bestaande nodes aan

## Concreet modulevoorstel

Pragmatische indeling:

### `horseshoe-v2-state.js`

Doet:

- `normalizeBaseConfig`
- `normalizeRuntimeConfig`
- `resolveEntityValue`
- `resolveMappedState`

### `horseshoe-v2-geometry.js`

Doet:

- `toRatio`
- `ratioToAngle`
- `valueToAngle`
- `pointAt`
- boog- en radiuslogica

Later kun je hier alternatieve engines achter zetten:

- `linear`
- `spline`
- `log`
- custom curve

### `horseshoe-v2-shapes.js`

Doet:

- `buildScalePaths(model)`
- `buildStatePaths(model)`
- `buildLabels(model)`
- `buildBandPath(arc, geometry)`

Deze module levert complete renderdata terug.

### `horseshoe-v2-renderer.js`

Doet:

- initiële SVG/Lit render
- node handles registreren
- `applyRenderModel(renderModel)`

Belangrijk:

- geen berekeningen
- alleen DOM sync

### `horseshoe-v2-animator.js`

Doet:

- `start(fromValue, toValue, options)`
- `tick(timestamp)`
- easing
- cancel/restart gedrag

En roept per frame iets als:

```js
const renderModel = builder.build({
  runtimeConfig,
  resolvedState,
  geometryModel,
  displayValue,
});

renderer.applyRenderModel(renderModel);
```

## Wat dit oplost

### Renderer wordt dom en stabiel

Dat is goed.

De renderer hoeft alleen nog:

- data in DOM te zetten
- elementhandles te bewaren

Daardoor breekt renderer-code niet als je:

- nieuwe schaaltypes toevoegt
- bidirectional anders berekent
- labelplaatsing verandert
- splineformules herschrijft

### Testbaarheid wordt veel beter

Je kunt dan los testen:

- `value -> ratio`
- `ratio -> angle`
- `angle -> path`
- `state_map -> active segment`
- `displayValue -> statePaths`

zonder browser of Lit.

### Performance wordt voorspelbaarder

Je vermijdt:

- Lit diff per frame
- DOM zoekacties per frame
- renderlogica in de animator

Je houdt over:

- 1 berekening van nieuwe renderdata
- 1 directe update van bestaande SVG nodes

Dat is precies de juiste richting voor soepele animaties op iPhone.

## Praktische randvoorwaarde

Deze opzet werkt het best als het aantal DOM nodes tijdens animatie stabiel blijft.

Dus idealiter:

- `statePaths` heeft een vaste set keys
- renderer maakt die nodes eenmalig
- animator update alleen attributen

Als het aantal segmenten echt dynamisch wisselt, dan heb je twee opties:

- of toch een beperkte her-render op structurele veranderingen
- of vooraf alle mogelijke segmentnodes aanmaken en ongebruikte op `opacity=0` zetten

Voor soepelheid is de tweede aanpak vaak beter.

## Mijn voorkeursrichting voor deze kaart

Voor deze module zou ik kiezen voor:

1. `Lit` alleen voor eerste structuur/render
2. daarna `cached DOM handles`
3. animatie via `requestAnimationFrame`
4. shape-berekening volledig buiten renderer
5. geometry engine verwisselbaar maken

Dat sluit exact aan op je doel:

- andere formules mogelijk
- renderer blijft onaangetast
- animatie blijft soepel
- geen Lit-overhead per frame

## Kort ontwerpprincipe

Samengevat:

- state resolver bepaalt `wat` de waarde is
- geometry engine bepaalt `waar` iets ligt
- shape builder bepaalt `hoe` het pad eruit ziet
- renderer tekent alleen
- animator bepaalt alleen `wanneer` iets verandert

Dat is de scheiding die hier het meest toekomstvast is.

## Concreet refactorplan

Doel:

- de huidige `horseshoe-gauge-v2.js` opsplitsen zonder gedrag onnodig tegelijk te veranderen
- eerst structuur repareren
- daarna animatiepad stabiliseren
- daarna pas uitbreiden of optimaliseren

De volgorde hieronder is bewust risicogestuurd.

## Fase 1: basis corrigeren

Doel: eerst de module echt in gebruik krijgen en debug-restanten verwijderen.

Stappen:

1. Laat `main.js` importeren uit `horseshoe-gauge-v2.js` in plaats van `horseshoe-gauge-v2d.js`.
2. Verwijder de onbereikbare tweede `return` in `setConfig()`.
3. Herstel `renderState()` zodat de echte state paths weer renderen.
4. Verwijder tijdelijke `console.log()`-regels of zet ze achter een debug-flag.

Acceptatie:

- constructor van `horseshoe-gauge-v2.js` draait aantoonbaar
- `setConfig()` filtert weer correct
- `renderState()` gebruikt unieke path ids/keys
- de huidige kaart rendert weer zonder testpad

## Fase 2: pure domeinlaag uit de klasse halen

Doel: alles wat geen rendering is uit `HorseshoeGaugeV2` losmaken.

Nieuwe module:

- `horseshoe-v2-state.js`

Verplaats uit de klasse:

- `normalizeBaseConfig()`
- `normalizeRuntimeConfig()`
- `normalizeLinecap()`
- `getZeroRatio()`
- state-resolutie uit `setState()`
- `getStateMapItem()`

Voorgestelde API:

```js
export function normalizeBaseConfig(config, index) {}
export function normalizeRuntimeConfig(config) {}
export function resolveGaugeState({ config, entity, entityConfig, templates, entityIndex }) {}
```

`resolveGaugeState()` levert bijvoorbeeld terug:

```js
{
  runtimeConfig,
  rawState,
  mappedState,
  value,
}
```

Acceptatie:

- `HorseshoeGaugeV2` hoeft geen config-normalisatie meer te kennen
- state-resolutie is los testbaar

## Fase 3: geometry engine isoleren

Doel: alle waarde/hoek/punt-logica verwisselbaar maken.

Nieuwe module:

- `horseshoe-v2-geometry.js`

Deze module bevat:

- `GaugeScale`
- `GaugeGeometry`
- eventuele helpers voor ratio/angle/point

Belangrijk:

- publieke API moet puur data-in/data-uit blijven
- geen DOM, geen Lit, geen kleurkeuze

Optioneel meteen voorbereiden op meerdere strategies:

```js
createGeometryEngine({ scaleType, runtimeConfig })
```

waar intern later gekozen kan worden tussen:

- linear
- spline
- custom

Acceptatie:

- huidige lineaire en spline-berekeningen blijven werken
- renderer weet niets van de formule

## Fase 4: rendermodel introduceren

Doel: een stabiele tussenlaag maken tussen berekening en rendering.

Nieuwe module:

- `horseshoe-v2-shapes.js`

Deze module bouwt een rendermodel:

```js
{
  scalePaths: [],
  statePaths: [],
  labels: [],
}
```

Verplaats uit de klasse:

- `getScaleArcs()`
- `getStatePathItems()`
- `getStateArcs()`
- `getNormalStateArcs()`
- `getBidirectionalStateArcs()`
- `getColorAwareStateArcs()`
- `getColorStopStateArcs()`
- `getMappedStateArcs()`
- `getLabelItems()`
- `getLabelItem()`
- `ArcPathBuilder`

Belangrijk ontwerpprincipe:

- de output bevat complete renderbare records
- renderer hoeft geen domeinlogica meer uit te voeren

Voorbeeld outputrecord:

```js
{
  key: "state-value",
  d: "...",
  fill: "#ff8800",
  opacity: "1",
}
```

Acceptatie:

- alle zichtbare SVG data komt uit één rendermodel
- renderer hoeft geen booglogica meer te kennen

## Fase 5: renderer dun maken

Doel: `HorseshoeGaugeV2` terugbrengen tot orchestratie plus lichte render.

Nieuwe module:

- `horseshoe-v2-renderer.js`

Verantwoordelijkheden:

- initieel SVG fragment opbouwen uit rendermodel
- een `registerHandles(root)` stap uitvoeren
- `applyRenderModel(renderModel)` uitvoeren

Voorgestelde API:

```js
renderer.render(renderModel)
renderer.registerHandles(root)
renderer.applyRenderModel(renderModel)
```

Belangrijk:

- `render()` is voor initiële structuur
- `applyRenderModel()` is voor directe DOM updates zonder Lit rerender

Acceptatie:

- renderer kent alleen keys en attributen
- renderer doet geen state mapping, geen hoekberekening, geen colors logic

## Fase 6: animator volledig losmaken

Doel: animatie alleen tijdgestuurd maken.

Nieuwe module:

- `horseshoe-v2-animator.js`

Verplaats uit de klasse:

- `getStateAnimationConfig()`
- `startValueAnimation()`
- `updateValueAnimation()`
- `getAnimationProgress()`

Voorgestelde API:

```js
animator.start({
  fromValue,
  toValue,
  duration,
  easing,
  onUpdate,
  onComplete,
})
```

Waarbij:

- `onUpdate(displayValue)` door de hoofdklasse wordt afgehandeld
- de hoofdklasse dan nieuw rendermodel laat bouwen
- renderer alleen DOM-attributen bijwerkt

Belangrijk:

- animator kent geen SVG
- animator kent geen DOM
- animator kent alleen tijd, easing en callbacks

Acceptatie:

- animatie kan los getest worden
- animatie kan later ook voor andere gauges worden hergebruikt

## Fase 7: DOM handles stabiel maken

Doel: geen DOM queries tijdens elke frame.

Aanpak:

1. eerste render maakt alle benodigde path nodes met stabiele ids/keys
2. na render worden references gecachet
3. `applyRenderModel()` gebruikt alleen gecachte handles

Voorgestelde cache:

```js
{
  scalePaths: new Map(),
  statePaths: new Map(),
  labels: new Map(),
}
```

Belangrijke regel:

- alleen opnieuw queryen als een handle ontbreekt of node vervangen is

Acceptatie:

- per frame geen `querySelector`
- alleen attribuutupdates op bestaande nodes

## Fase 8: structurele node-stabiliteit

Doel: animatie soepel houden door het aantal nodes stabiel te houden.

Aanpak:

- gebruik vaste keys voor scale/state/label records
- laat renderer die set nodes eenmalig opbouwen
- zet ongebruikte items op lege `d` of `opacity=0`

Dat is vooral nuttig voor:

- `colorstopsegments`
- mapped states
- bidirectional varianten

Acceptatie:

- animatie wisselt zoveel mogelijk alleen attributen
- geen structurele DOM churn tijdens normale waarde-updates

## Fase 9: hoofdklasse versimpelen

Einddoel voor `HorseshoeGaugeV2`:

- config/state orchestration
- rendermodel opvragen
- renderer en animator aansturen

Dus ongeveer:

```js
class HorseshoeGaugeV2 {
  constructor(...) {}

  setState(entity, entityConfig) {
    this.stateModel = resolveGaugeState(...);
    this.geometryModel = createGeometryModel(...);
    this.renderModel = buildRenderModel(...);
  }

  render() {
    return this.renderer.render(this.renderModel);
  }

  syncHandles(root) {
    this.renderer.registerHandles(root);
  }

  animateTo(nextValue) {
    this.animator.start({
      fromValue: this.displayValue,
      toValue: nextValue,
      onUpdate: (displayValue) => {
        const renderModel = buildRenderModel(...displayValue...);
        this.renderer.applyRenderModel(renderModel);
      },
    });
  }
}
```

## Testplan per fase

Belangrijk: pas implementeren in kleine stappen, en per stap verifiëren.

### Testgroep A: functioneel

- constructor draait
- horseshoe wordt zichtbaar
- `show.horseshoe = false` filtert correct
- min/max labels werken
- colorstop labels werken
- bidirectional werkt
- mapped state segments werken

### Testgroep B: animatie

- eerste render zonder animatie werkt
- waarde-update animeert vloeiend
- tweede update tijdens lopende animatie onderbreekt netjes
- disabled animation springt direct naar eindwaarde
- geen visuele knippering

### Testgroep C: performance

- tijdens animatie geen Lit full rerender per frame
- tijdens animatie geen continue DOM queries
- iPhone/Safari blijft vloeiend

### Testgroep D: regressie

- lineair schaaltype blijft correct
- spline schaaltype blijft correct
- kleurkeuze blijft correct
- bestaande configuraties blijven renderen

## Implementatievolgorde die ik zou aanhouden

Dit is mijn voorkeursvolgorde voor de daadwerkelijke codewijzigingen:

1. `main.js` terugzetten op de juiste v2-module
2. debug-restanten in `horseshoe-gauge-v2.js` opruimen
3. state/config helpers extraheren
4. geometry loszetten
5. rendermodel-builder maken
6. renderer abstraheren
7. animator abstraheren
8. handle cache invoeren
9. tests/verificatie op gedrag en performance

## Praktisch advies voor de implementatie

Niet alles in één grote sprong doen.

De veiligste aanpak is:

1. eerst bestaande v2 werkend krijgen
2. daarna pure functies extraheren zonder gedrag te wijzigen
3. pas daarna renderer/animator scheiden

Zo blijft steeds duidelijk of een regressie uit:

- berekening
- rendering
- animatie

komt.

## Vertaling: huidige methods naar nieuwe plek

Hieronder staat concreet wat ik bedoel met "pure functies extraheren".

Regel:

- als iets alleen input omzet naar output, hoort het naar een pure functie
- als iets SVG markup maakt, hoort het bij renderer
- als iets tijd/easing beheert, hoort het bij animator
- als iets alleen samenwerking tussen modules regelt, mag het in `HorseshoeGaugeV2` blijven

## Tabel

| Huidige method / code | Nieuwe plek | Waarom |
| --- | --- | --- |
| `normalizeBaseConfig()` | pure functie in `horseshoe-v2-state.js` | Alleen config in, genormaliseerde config uit |
| `normalizeRuntimeConfig()` | pure functie in `horseshoe-v2-state.js` | Alleen configtransformatie, geen DOM |
| `normalizeLinecap()` | pure functie in `horseshoe-v2-state.js` | Deterministische helper |
| `getZeroRatio()` | pure functie in `horseshoe-v2-state.js` of `horseshoe-v2-geometry.js` | Rekent alleen ratio uit |
| `getStateMapItem()` | pure functie in `horseshoe-v2-state.js` | Pure lookup in `state_map` |
| waarde-ophaalstuk uit `setState()` | pure functie in `horseshoe-v2-state.js` | Alleen entity/config naar waarde vertalen |
| `GaugeScale` | `horseshoe-v2-geometry.js` | Rekenkern voor waarde naar ratio |
| `GaugeGeometry` | `horseshoe-v2-geometry.js` | Rekenkern voor hoek/punt/arc |
| `ArcPathBuilder` | `horseshoe-v2-shapes.js` | Bouwt paddata uit geometry en arc-data |
| `getScaleArcs()` | pure functie in `horseshoe-v2-shapes.js` | Levert alleen arc-definities |
| `getStateArcs()` | pure functie in `horseshoe-v2-shapes.js` | Kieslogica voor state-arcs |
| `getNormalStateArcs()` | pure functie in `horseshoe-v2-shapes.js` | Alleen value naar arc-range |
| `getBidirectionalStateArcs()` | pure functie in `horseshoe-v2-shapes.js` | Alleen value/zero naar arc-range |
| `getColorAwareStateArcs()` | pure functie in `horseshoe-v2-shapes.js` | Alleen kleursegmentlogica |
| `getColorStopStateArcs()` | pure functie in `horseshoe-v2-shapes.js` | Alleen stopsegmentberekening |
| `getMappedStateArcs()` | pure functie in `horseshoe-v2-shapes.js` | Alleen segmentverdeling |
| `getStatePathItems()` | pure functie in `horseshoe-v2-shapes.js` | Arc-data naar renderdata |
| `getLabelItems()` | pure functie in `horseshoe-v2-shapes.js` | Labeldata opbouwen |
| `getLabelItem()` | pure functie in `horseshoe-v2-shapes.js` | Enkele labelpositie berekenen |
| `render()` | renderer of dunne wrapper in hoofdklasse | Alleen output genereren |
| `renderScale()` | `horseshoe-v2-renderer.js` | Render-only |
| `renderState()` | `horseshoe-v2-renderer.js` | Render-only |
| `renderLabels()` | `horseshoe-v2-renderer.js` | Render-only |
| `getStateAnimationConfig()` | `horseshoe-v2-animator.js` | Hoort bij animatie-instellingen |
| `startValueAnimation()` | `horseshoe-v2-animator.js` | Start tijdgestuurde interpolatie |
| `updateValueAnimation()` | `horseshoe-v2-animator.js` | Frame-tick logica |
| `getAnimationProgress()` | `horseshoe-v2-animator.js` | Easing helper |
| `updateStatePathDom()` | `horseshoe-v2-renderer.js` | DOM sync, geen domeinlogica |
| `getStatePathElement()` | `horseshoe-v2-renderer.js` | DOM handle management |
| `getStatePathElementId()` | `horseshoe-v2-renderer.js` of shared ids helper | Render/DOM-identiteit |
| constructor | `HorseshoeGaugeV2` | Orchestratie en objectleven |
| `setConfig()` | `HorseshoeGaugeV2` of kleine factory helper | Instantieopbouw |
| `setState()` | `HorseshoeGaugeV2` | Orchestratie tussen state/geometrie/renderer/animator |

## Wat expliciet pure functies zijn

Dit zijn de stukken die ik als eerste als pure functies zie:

### Config/state

- `normalizeBaseConfig(config, index)`
- `normalizeRuntimeConfig(config)`
- `normalizeLinecap(linecap)`
- `getZeroRatio(horseshoeScale)`
- `getStateMapItem(stateMap, rawState, value)`
- `resolveGaugeValue(entity, entityConfig)`
- `resolveGaugeState({ config, entity, entityConfig, templates, entityIndex })`

### Shapes/labels

- `getScaleArcs({ runtimeConfig, geometry })`
- `getStateArcs({ runtimeConfig, geometry, value, displayValue })`
- `getStatePathItems({ runtimeConfig, geometry, stateArcs })`
- `getLabelItems({ runtimeConfig, geometry, scale })`
- `getLabelItem({ runtimeConfig, geometry, scale, labelConfig })`
- `buildBandPath({ geometry, arc, band })`

## Wat expliciet geen pure functie is

Deze stukken hebben bijwerkingen of lifecycle, dus die zijn niet puur:

- constructor
- `render()`
- `renderScale()`
- `renderState()`
- `renderLabels()`
- `startValueAnimation()`
- `updateValueAnimation()`
- `updateStatePathDom()`
- `getStatePathElement()`

## Eenvoudig voorbeeld

Huidige stijl:

```js
setState(entity, entityConfig) {
  const resolvedConfig = this.templates.getJsTemplateOrValue(...);
  this.runtimeConfig = HorseshoeGaugeV2.normalizeRuntimeConfig(resolvedConfig);
  const mappedState = this.getStateMapItem(entity.state, value);
  this.value = Number(mappedState?.value ?? value);
}
```

Nieuwe stijl:

```js
const stateModel = resolveGaugeState({
  config: this.config,
  entity,
  entityConfig,
  templates: this.templates,
  entityIndex: this.entity_index,
});

this.runtimeConfig = stateModel.runtimeConfig;
this.rawState = stateModel.rawState;
this.mappedState = stateModel.mappedState;
this.value = stateModel.value;
```

Dus:

- de berekening verhuist naar pure functies
- de klasse houdt alleen de resultaten vast

## Waarom dit belangrijk is voor fase 1

Voor fase 1 veranderen we dit nog niet allemaal.

Maar deze tabel voorkomt dat we straks tijdens implementatie gaan twijfelen:

- wat blijft in de klasse
- wat verhuist naar state
- wat verhuist naar renderer
- wat verhuist naar animator

Daarmee kunnen we na fase 1 gecontroleerd door naar fase 2.
