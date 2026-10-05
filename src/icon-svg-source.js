import { SVGInjector } from "@tanem/svg-injector";

/** Loads external SVG files used by Icons and state markers in this card. */
export default class ExternalSvgSources {
  /** Starts request tracking for the SVG placeholders rendered by this card. */
  constructor(card) {
    this.card = card;
    this.requests = new Map();
    this.closed = false;
  }

  /** Forgets pending SVG loads when a new card config replaces their placeholders. */
  clearPendingRequests() {
    this.requests.clear();
  }

  /** Allows external SVG loading again after the card reconnects. */
  connected() {
    this.closed = false;
  }

  /** Ignores unfinished SVG loads after the card disconnects. */
  disconnected() {
    this.closed = true;
    this.requests.clear();
  }

  /**
   * Loads each external SVG in a detached element first. Replace the matching
   * placeholder in the card only when it still exists and still points to the
   * same URL. This prevents an older async load from replacing a newer Icon or
   * state marker after Lit has rendered again.
   */
  inject() {
    if (this.closed) return;
    const elements = this.card.shadowRoot.querySelectorAll("svg.icon-svg-url[data-src]:not(.injected-svg)");
    elements.forEach((element) => {
      if (this.requests.has(element)) return;
      const url = element.dataset.src;
      const staging = document.createElement("div");
      const placeholder = element.cloneNode(true);
      staging.appendChild(placeholder);
      const request = { url, staging };
      this.requests.set(element, request);

      SVGInjector(placeholder, {
        beforeEach(svgNode) {
          svgNode.removeAttribute("height");
          svgNode.removeAttribute("width");
        },
        afterEach: (error, injectedSvg) => {
          if (this.requests.get(element) !== request) return;
          this.requests.delete(element);
          // The detached loading element can still exist after Lit has replaced the
          // real placeholder. Only use this result when the original placeholder is
          // still inside this card and still requests the same SVG URL.
          if (this.closed || !element.isConnected || !this.card.shadowRoot.contains(element) || element.dataset.src !== url) return;
          if (error) {
            console.error('[FHC SVG icon]', url, error);
            return;
          }
          this.card.svgUrlCache[url] = injectedSvg.cloneNode(true);
          element.replaceWith(injectedSvg);
          this.card.requestUpdate();
        },
        cacheRequests: false,
        evalScripts: "once",
        httpRequestWithCredentials: false,
        renumerateIRIElements: false,
      });
    });
  }
}

/** Loads external SVG files after Lit has rendered their Icon or state-marker placeholders. */
export function injectExternalSvgSources(card) {
  card.externalSvgSources.inject();
}
