# Flexible Horseshoe Card Input Boolean

## Doel

Voeg een lokale Flexible Horseshoe Card-entity toe die hetzelfde model gebruikt als Home
Assistant's `input_boolean`. Hiermee kunnen dashboardinstellingen zoals
axis, labels, grid, visibility en andere boolean-opties lokaal worden bediend.

## Publieke configuratie

```yaml
entities:
  - entity: fhs_input_boolean.show_labels
    initial: true
    scope: global
    persist: true
```

`initial` accepteert optioneel een YAML-boolean: `true` of `false`. Als `initial` ontbreekt, start de entity als `off`, net als een HA `input_boolean` zonder opgegeven initial value.

De runtime-state is HA-compatibel:

- `on`
- `off`

Daarom gebruiken JavaScript-templates bijvoorbeeld:

```yaml
return state === 'on';
```

Ondersteunde entity-opties zijn `name`, `icon`, `scope`, `persist`, `slot` en
`disabled`. Numerieke opties zoals `unit` en decimalen zijn niet van toepassing.

## Services

De lokale services volgen Home Assistant:

- `fhs_input_boolean.turn_on`
- `fhs_input_boolean.turn_off`
- `fhs_input_boolean.toggle`

Voorbeeld:

```yaml
tap_action:
  action: perform-action
  perform_action: fhs_input_boolean.toggle
  target:
    entity_id: fhs_input_boolean.show_labels
```

`action: toggle` werkt ook rechtstreeks wanneer het geselecteerde entity een
lokale `fhs_input_boolean` is. Legacy `call-service` blijft ondersteund.

## Architectuur

- De boolean-implementatie blijft naast de bestaande number-inputlogica.
- Bestaande `fhs_input_number`-maps, events, opslag en services blijven intact.
- Booleans krijgen een eigen globale map, window-event en localStorage-prefix.
- `scope: card` werkt alleen binnen de kaart.
- `scope: global` synchroniseert kaarten via het window-event.
- `persist: true` is alleen toegestaan voor globale booleans.
- Elke update gebruikt de bestaande entity-updatepipeline, zodat templates,
  styles, visibility, groups, compounds, animaties en sparklines automatisch
  opnieuw reageren.
- Een lokale boolean krijgt standaard `mdi:toggle-switch` wanneer geen eigen
  icoon is ingesteld.

## Impact en compatibiliteit

De wijziging blijft beperkt tot de lokale Flexible Horseshoe Card-inputlaag, configuratievalidatie,
action-routing en documentatie. De graph engine, entity slots, layout-tools en
bestaande number-inputfunctionaliteit hoeven inhoudelijk niet te wijzigen.

Normale Home Assistant `input_boolean`-entities blijven gewone externe
entities; alleen het domein `fhs_input_boolean` wordt lokaal afgehandeld.

## Verificatie

- `initial: true` resulteert in state `on`.
- `initial: false` resulteert in state `off`.
- `turn_on`, `turn_off` en `toggle` werken voor card-scoped en globale inputs.
- Globale inputs synchroniseren tussen kaarten.
- Persistence herstelt de state na een volledige browserrefresh.
- Templates, styles, visibility, compounds en slots kunnen op `on`/`off`
  reageren.
- `npm run build` blijft succesvol.
- Bestaande `fhs_input_number`-kaarten blijven ongewijzigd werken.
