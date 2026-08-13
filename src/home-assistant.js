/** Owns the current Home Assistant object and connection-ready lifecycle. */
export default class HomeAssistant {
  /**
   * Creates the card's Home Assistant lifecycle state. The ready callback keeps
   * one stable function identity so websocket listeners can follow reconnects.
   *
   * @param {Function} notifyToolsConnected - Notifies tools after websocket readiness.
   */
  constructor(notifyToolsConnected) {
    this.hass = undefined;
    this.localeSignature = undefined;
    this.localeChanged = false;
    this.connection = undefined;
    this.connectedToDom = false;
    this.notifyToolsConnected = notifyToolsConnected;
    this.connectionReadyHandler = () => this.notifyToolsConnected();
  }

  /**
   * Stores the current hass object, records locale changes and moves the ready
   * listener to the active websocket connection.
   */
  setHass(hass) {
    const localeSignature = JSON.stringify(hass.locale);

    this.hass = hass;
    this.localeChanged = localeSignature !== this.localeSignature;
    this.localeSignature = localeSignature;

    if (this.connection !== hass.connection) {
      if (this.connection && this.connectedToDom) this.connection.removeEventListener('ready', this.connectionReadyHandler);
      this.connection = hass.connection;
      if (this.connectedToDom) this.connection.addEventListener('ready', this.connectionReadyHandler);
    }

  }

  /** Clears the locale marker after every context-dependent card domain ran. */
  markLocaleHandled() {
    this.localeChanged = false;
  }

  /**
   * Attaches one ready listener while the card is present in the DOM.
   *
   * Home Assistant emits ready after a websocket reconnect; CardTools then marks
   * history-backed tools for resynchronization on the next hass pass.
   */
  connected() {
    this.connectedToDom = true;
    if (this.connection) this.connection.addEventListener('ready', this.connectionReadyHandler);
  }

  /**
   * The ready subscription follows the card's DOM lifetime because only attached
   * cards need to resynchronize history and render the resulting update.
   */
  disconnected() {
    if (this.connection) this.connection.removeEventListener('ready', this.connectionReadyHandler);
    this.connectedToDom = false;
  }
}
