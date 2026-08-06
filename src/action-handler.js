import { noChange } from 'lit';
import { directive, Directive } from 'lit/directive.js';

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
 */
function bindActionHandler(element, options) {
  if (element.fhsActionHandler) {
    element.fhsActionHandler.options = options;
    return;
  }

  const state = {
    options,
    holdTimer: undefined,
    doubleTapTimer: undefined,
    held: false,
    pointerId: undefined,
    startX: 0,
    startY: 0,
  };

  const dispatchAction = (action) => {
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
    state.held = false;
    state.pointerId = undefined;
  };

  element.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;

    event.stopPropagation();
    state.pointerId = event.pointerId;
    state.startX = event.clientX;
    state.startY = event.clientY;
    state.held = false;

    if (state.options.hasHold) {
      state.holdTimer = window.setTimeout(() => {
        state.held = true;
      }, HOLD_TIME);
    }
  });

  element.addEventListener('pointermove', (event) => {
    if (event.pointerId !== state.pointerId) return;

    const movedX = Math.abs(event.clientX - state.startX);
    const movedY = Math.abs(event.clientY - state.startY);

    if (movedX > MOVE_TOLERANCE || movedY > MOVE_TOLERANCE) cancelGesture();
  });

  element.addEventListener('pointercancel', cancelGesture);

  element.addEventListener('pointerup', (event) => {
    if (event.pointerId !== state.pointerId) return;

    event.preventDefault();
    event.stopPropagation();
    window.clearTimeout(state.holdTimer);
    state.holdTimer = undefined;
    state.pointerId = undefined;

    if (state.options.hasHold && state.held) {
      state.held = false;
      dispatchAction('hold');
      return;
    }

    if (state.options.hasDoubleClick) {
      if (state.doubleTapTimer !== undefined) {
        window.clearTimeout(state.doubleTapTimer);
        state.doubleTapTimer = undefined;
        dispatchAction('double_tap');
      } else {
        state.doubleTapTimer = window.setTimeout(() => {
          state.doubleTapTimer = undefined;
          if (state.options.hasTap) dispatchAction('tap');
        }, DOUBLE_TAP_TIME);
      }
      return;
    }

    if (state.options.hasTap) dispatchAction('tap');
  });

  element.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
  });

  element.addEventListener('contextmenu', (event) => {
    if (!state.options.hasHold) return;

    event.preventDefault();
    event.stopPropagation();
  });

  element.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;

    event.preventDefault();
    event.stopPropagation();
    dispatchAction('tap');
  });

  element.fhsActionHandler = state;
}

/** Lit attribute directive that keeps gesture options current across renders. */
const actionHandler = directive(
  class extends Directive {
    update(part, [options]) {
      bindActionHandler(part.element, options);
      return noChange;
    }

    render() {}
  },
);

export default actionHandler;
