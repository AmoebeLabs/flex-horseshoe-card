/** Owns the current Home Assistant object and connection-ready lifecycle. */
export default class HomeAssistant {
  constructor(notifyToolsConnected) {
    this.hass = undefined;
    this.connection = undefined;
    this.connectedToDom = false;
    this.notifyToolsConnected = notifyToolsConnected;
    this.connectionReadyHandler = () => this.notifyToolsConnected();
  }

  /** Stores HA and moves the ready listener when the connection changes. */
  setHass(hass) {
    this.hass = hass;
    if (this.connection === hass.connection) return;
    if (this.connection && this.connectedToDom) this.connection.removeEventListener('ready', this.connectionReadyHandler);
    this.connection = hass.connection;
    if (this.connectedToDom) this.connection.addEventListener('ready', this.connectionReadyHandler);
  }

  /** Attaches the connection listener when the card enters the DOM. */
  connected() {
    this.connectedToDom = true;
    if (this.connection) this.connection.addEventListener('ready', this.connectionReadyHandler);
  }

  /** Detaches the connection listener when the card leaves the DOM. */
  disconnected() {
    if (this.connection) this.connection.removeEventListener('ready', this.connectionReadyHandler);
    this.connectedToDom = false;
  }
}
