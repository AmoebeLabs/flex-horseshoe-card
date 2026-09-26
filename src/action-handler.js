import { noChange } from 'lit';
import { directive } from 'lit/directive.js';
import { AsyncDirective } from 'lit/async-directive.js';

const DOUBLE_TAP_TIME = 250;
const HOLD_TIME = 500;
const MOVE_TOLERANCE = 8;

/**
 * Binds Home Assistant-style tap, hold, and double-tap gestures to one element.
 *
 * The timing and delayed single-tap behavior follow Home Assistant's Lovelace
 * action handler. Pointer events keep mouse and touch on one linear path, while
 * the click listener only suppresses the browser's follow-up click event.
 *
 * @param {Element} element - SVG or HTML element that owns the interaction.
 * @param {object} options - Enabled gestures for the current runtime config.
 * @returns {object} Gesture owner with stable listeners and explicit cleanup.
 */
function bindActionHandler(element, options) {
  const interactive = options.hasTap || options.hasHold || options.hasDoubleClick;
  element.style.cursor = interactive ? 'pointer' : 'default';
  if (element.fhsActionHandler) {
    const state = element.fhsActionHandler;
    const previous = state.options;
    if (previous.hasTap !== options.hasTap || previous.hasHold !== options.hasHold
      || previous.hasDoubleClick !== options.hasDoubleClick) state.cancelPendingActions();
    state.options = options;
    if (!state.connected) {
      state.connected = true;
      Object.entries(state.listeners).forEach(([event, listener]) => element.addEventListener(event, listener));
    }
    return state;
  }

  const state = {
    options,
    holdTimer: undefined,
    doubleTapTimer: undefined,
    held: false,
    pointerId: undefined,
    startX: 0,
    startY: 0,
    connected: true,
    holdAction: undefined,
    tapAction: undefined,
    listeners: {},
  };

  const dispatchAction = (action) => {
    if (!state.connected || !element.isConnected || element.fhsActionHandler !== state) return;
    element.dispatchEvent(
      new CustomEvent('action', {
        bubbles: true,
        composed: true,
        detail: { action },
      }),
    );
  };

  const cancelGesture = () => {
    window.clearTimeout(state.holdTimer);
    state.holdTimer = undefined;
    state.holdAction = undefined;
    state.held = false;
    state.pointerId = undefined;
  };

  state.cancelPendingActions = () => {
    cancelGesture();
    window.clearTimeout(state.doubleTapTimer);
    state.doubleTapTimer = undefined;
    state.tapAction = undefined;
  };

  // Cleanup invalidates timer identities as well as removing listeners. A
  // callback already queued before cancellation stays inert after reconnect.
  state.disconnect = () => {
    state.connected = false;
    state.cancelPendingActions();
    Object.entries(state.listeners).forEach(([event, listener]) => element.removeEventListener(event, listener));
  };

  state.listeners.pointerdown = (event) => {
    if (event.button !== 0) return;

    event.stopPropagation();
    cancelGesture();
    state.pointerId = event.pointerId;
    state.startX = event.clientX;
    state.startY = event.clientY;
    state.held = false;

    if (state.options.hasHold) {
      const holdAction = {};
      state.holdAction = holdAction;
      state.holdTimer = window.setTimeout(() => {
        if (state.holdAction !== holdAction || !state.connected) return;
        state.holdTimer = undefined;
        state.holdAction = undefined;
        state.held = true;
        dispatchAction('hold');
      }, HOLD_TIME);
    }
  };

  state.listeners.pointermove = (event) => {
    if (event.pointerId !== state.pointerId) return;

    const movedX = Math.abs(event.clientX - state.startX);
    const movedY = Math.abs(event.clientY - state.startY);

    if (movedX > MOVE_TOLERANCE || movedY > MOVE_TOLERANCE) cancelGesture();
  };

  state.listeners.pointercancel = cancelGesture;

  state.listeners.pointerup = (event) => {
    if (event.pointerId !== state.pointerId) return;

    event.preventDefault();
    event.stopPropagation();
    window.clearTimeout(state.holdTimer);
    state.holdTimer = undefined;
    state.holdAction = undefined;
    state.pointerId = undefined;

    if (state.options.hasHold && state.held) {
      state.held = false;
      return;
    }

    if (state.options.hasDoubleClick) {
      if (state.doubleTapTimer !== undefined) {
        window.clearTimeout(state.doubleTapTimer);
        state.doubleTapTimer = undefined;
        state.tapAction = undefined;
        dispatchAction('double_tap');
      } else {
        const tapAction = {};
        state.tapAction = tapAction;
        state.doubleTapTimer = window.setTimeout(() => {
          if (state.tapAction !== tapAction || !state.connected) return;
          state.doubleTapTimer = undefined;
          state.tapAction = undefined;
          if (state.options.hasTap) dispatchAction('tap');
        }, DOUBLE_TAP_TIME);
      }
      return;
    }

    if (state.options.hasTap) dispatchAction('tap');
  };

  state.listeners.click = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  state.listeners.contextmenu = (event) => {
    if (!state.options.hasHold) return;

    event.preventDefault();
    event.stopPropagation();
  };

  state.listeners.keydown = (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;

    event.preventDefault();
    event.stopPropagation();
    dispatchAction('tap');
  };

  element.fhsActionHandler = state;
  Object.entries(state.listeners).forEach(([event, listener]) => element.addEventListener(event, listener));
  return state;
}

/** Keeps gesture options and listener lifetime tied to the Lit target element. */
const actionHandler = directive(
  class extends AsyncDirective {
    /** Remembers the concrete target so disconnection releases its resources. */
    constructor(partInfo) {
      super(partInfo);
      this.element = undefined;
      this.options = undefined;
      this.state = undefined;
    }

    /**
     * Binds the directive's current gesture flags to the target element and
     * keeps Lit from writing an attribute value.
     *
     * @param {object} part - Lit attribute part containing the target element.
     * @param {Array<object>} values - Current action-handler options.
     * @returns {symbol} Lit noChange sentinel.
     */
    update(part, [options]) {
      if (this.element !== part.element && this.state) this.state.disconnect();
      this.element = part.element;
      this.options = options;
      if (this.isConnected) this.state = bindActionHandler(this.element, options);
      return noChange;
    }

    /** Cancels delayed gestures and removes listeners when Lit removes the part. */
    disconnected() {
      if (this.state) this.state.disconnect();
    }

    /** Reattaches the same listeners once, using the latest runtime options. */
    reconnected() {
      this.state = bindActionHandler(this.element, this.options);
    }

    /** Produces no attribute value because update() owns the element listeners. */
    render() {}
  },
);

export default actionHandler;
