/** Tracks HA locale, entity formatters, registries, and websocket readiness for this card. */
export default class HomeAssistant {
  /**
   * Stores HA change flags and one stable ready callback so it can be removed
   * from the old websocket and attached to the current one after reconnect.
   *
   * @param {Function} notifyToolsConnected - Notifies tools after websocket readiness.
   */
  constructor(notifyToolsConnected) {
    this.localeSignature = undefined;
    this.localeChanged = false;
    this.entityDisplayContext = undefined;
    this.entityDisplayChanged = false;
    this.connection = undefined;
    this.connectedToDom = false;
    this.notifyToolsConnected = notifyToolsConnected;
    this.connectionReadyHandler = () => this.notifyToolsConnected();
  }

  /**
   * Tracks locale and entity-formatting changes and follows the current websocket.
   */
  setHass(hass) {
    const localeSignature = JSON.stringify(hass.locale);

    this.localeChanged = localeSignature !== this.localeSignature;
    this.localeSignature = localeSignature;

    // Text shown for HA entities can change when the locale, formatters, entity,
    // device, area, or floor registries change. Compare these references so FHS
    // refreshes formatted names, attribute labels, states, and values.
    const entityDisplayContext = [
      hass.formatEntityName,
      hass.formatEntityAttributeName,
      hass.formatEntityState,
      hass.formatEntityStateToParts,
      hass.formatEntityAttributeValue,
      hass.formatEntityAttributeValueToParts,
      hass.entities,
      hass.devices,
      hass.areas,
      hass.floors,
    ];
    this.entityDisplayChanged = this.entityDisplayContext === undefined
      || entityDisplayContext.some((value, index) => value !== this.entityDisplayContext[index]);
    this.entityDisplayContext = entityDisplayContext;

    if (this.connection !== hass.connection) {
      if (this.connection && this.connectedToDom) this.connection.removeEventListener('ready', this.connectionReadyHandler);
      this.connection = hass.connection;
      if (this.connectedToDom) this.connection.addEventListener('ready', this.connectionReadyHandler);
    }

  }

  /** Clears the locale flag after FHS refreshes labels and values with the current HA locale. */
  markLocaleHandled() {
    this.localeChanged = false;
  }

  /** Clears the formatter flag after FHS refreshes HA entity names, attribute labels, and values. */
  markEntityDisplayHandled() {
    this.entityDisplayChanged = false;
  }

  /**
   * Attaches one ready listener while the card is present in the DOM.
   *
   * Home Assistant emits ready after a websocket reconnect; CardTools then tells
   * Sparkline History to request updated rows on the next HA update.
   */
  connected() {
    this.connectedToDom = true;
    if (this.connection) this.connection.addEventListener('ready', this.connectionReadyHandler);
  }

  /**
   * Removes the HA ready listener when the card leaves the DOM. Reconnection
   * attaches it again so Sparkline History can refresh its rows.
   */
  disconnected() {
    if (this.connection) this.connection.removeEventListener('ready', this.connectionReadyHandler);
    this.connectedToDom = false;
  }
}
