# FHS Sparkline Graph -- Ontwerp en implementatierichtlijnen

## Hoofddoel

De bestaande implementatie uit SAK is het uitgangspunt.

**`sparkline-graph.js` moet zo veel mogelijk 1:1 worden overgenomen.**

Dit is **geen redesign**, **geen optimalisatie** en **geen
herschrijving**.

De bestaande architectuur blijft behouden.

Alleen functionaliteit toevoegen.

---

# Niet wijzigen

Tijdens de implementatie mogen de volgende zaken niet worden vervangen
of opnieuw ontworpen:

- geen canvas
- geen chart library
- geen andere SVG-architectuur
- geen nieuwe rendering pipeline
- geen nieuwe entity pipeline
- geen optimalisaties "omdat het mooier kan"
- geen helperstructuren die de bestaande code vervangen
- geen vereenvoudiging van bestaande logica
- geen andere mask/render-aanpak

Uitgangspunt:

**bestaande code uitbreiden.**

Niet vervangen.

---

# Hergebruik

## sparkline-graph.js

Zo veel mogelijk letterlijk overnemen.

Inclusief:

- historie ophalen
- normaliseren
- punten berekenen
- spline
- path
- gradient
- masker
- SVG-opbouw

---

## sparkline-graph-tool.js

Deze zal waarschijnlijk aangepast moeten worden.

Reden:

Nieuwe functionaliteit.

Dus alleen uitbreiden waar nodig.

---

# History

Standaard:

- vandaag
- van 00:00 tot nu

Visuele x-schaal:

- 00:00 tot 24:00

Dus:

- de data loopt tot nu;
- de grafiek blijft visueel de hele dag stabiel;
- ticks verschuiven niet.

Refresh interval:

- instelbaar;
- default: 5 minuten.

Voorbeeld:

```yaml
graph:
  entity: ...
  history:
    period: today
    refresh_interval: 5min
```

Als `history` niet wordt opgegeven:

```yaml
history:
  period: today
  refresh_interval: 5min
```

---

# Nieuwe functionaliteit

## Statistieken

Automatisch berekenen uit dezelfde dataset.

- minimum
- gemiddelde
- maximum

Geen aparte history-opvraag.

Geen tweede berekening.

---

## X-as

Toevoegen:

- major ticks
- minor ticks
- labels
- grid

Voor today:

- schaal = 00:00 → 24:00
- data = 00:00 → nu

Dus de grafiek verschuift nooit.

---

## Y-as

Toevoegen:

- major ticks
- labels
- grid

---

# Interactie

Toevoegen:

- pointer
- touch
- verticale indicator
- actief datapunt
- slang
- hover/detailpaneel

---

# Slang

Doel:

De slang volgt exact dezelfde grafiek.

Dus:

- geen tweede grafiek
- geen andere spline
- geen afwijkende berekening

De slang gebruikt dezelfde grafiekdata.

Eigenschappen:

- ronde uiteinden
- gradient behouden
- beweegt exact met de vinger
- geen vooraf gedefinieerde animatie
- pointer is de animatie

Het actieve venster is gebaseerd op de x-as (tijd), niet op padlengte.

---

# Hover informatie

Tijdens interactie tonen:

- tijd
- waarde

Voorkeur:

Onder de grafiek.

Daardoor:

- geen overlap
- rustig beeld
- luxe uitstraling

De kaart mag tijdelijk hoger worden.

---

# Statistieken als entities

Doel:

Minimum, gemiddelde en maximum moeten zich gedragen als gewone entities.

Niet speciaal renderen.

De bestaande functies moeten alles doen.

Dus dezelfde functies voor:

- entity
- icon
- name
- state
- secondary info
- styles
- colors
- layout

Geen aparte stats-renderer.

## Open ontwerpvraag

Worden min/avg/max:

- echte lokale entities?

of

- een kopie van bestaande entity-settings?

Omdat de statistieken feitelijk dezelfde eigenschappen hebben als een
normale entity.

Dit moet nog worden bepaald.

---

# Entity index

Nu:

Numerieke index.

Probleem:

Bij meerdere grafieken is de herkomst niet meer duidelijk.

Mogelijke oplossing:

De entity-index uitbreiden.

Bijvoorbeeld:

```text
graph.0.min
graph.0.avg
graph.0.max

graph.1.min
graph.1.avg
graph.1.max
```

Hierdoor blijft direct zichtbaar:

- welke grafiek
- welke statistiek

Open ontwerpkeuze.

---

# Implementatiefasen

1.  Sparkline 1:1 overnemen.
2.  History-defaults vastleggen.
3.  X-as.
4.  Y-as.
5.  Statistieken.
6.  Pointer/touch.
7.  Verticale indicator.
8.  Hover-paneel.
9.  Slang.
10. Styling.

---

# Architectuurregels

Deze implementatie moet de bestaande FHS-architectuur volgen.

Belangrijk:

- bestaande entity-structuur behouden;
- bestaande renderpipeline behouden;
- bestaande standaardfuncties blijven leidend;
- geen dubbele renderlogica;
- geen speciale codepaden voor statistieken;
- geen afwijkende behandeling van graph-entities;
- bestaande slider/pointer-aanpak hergebruiken voor interactie;
- bestaande sparkline-rendering hergebruiken voor de grafiek;
- alleen functionaliteit toevoegen.

Het doel is dat de nieuwe grafiek aanvoelt alsof deze altijd onderdeel
van FHS is geweest, en niet als een aparte implementatie.
