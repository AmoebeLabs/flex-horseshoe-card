import { SVGInjector } from "@tanem/svg-injector";

/** Owns pending external SVG placeholders shared by icons and state markers. */
export default class ExternalSvgSources {
  /** Keeps each injection tied to its real target node and this card lifetime. */
  constructor(card) {
    this.card = card;
    this.requests = new Map();
    this.closed = false;
  }

  /** Supersedes injections started for the previous card configuration. */
  setConfig() {
    this.requests.clear();
  }

  /** Allows the next committed render to load its actual SVG placeholders. */
  connected() {
    this.closed = false;
  }

  /** Invalidates non-cancellable injector callbacks without touching live DOM. */
  disconnected() {
    this.closed = true;
    this.requests.clear();
  }

  /**
   * Loads on detached staging nodes, then publishes only into the original
   * current placeholder. The library's own DOM replacement is isolated from
   * Lit until this owner has accepted the result.
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
          // A retained detached parent can still have children. Test the real
          // target's membership, source and connection before committing it.
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

/** Runs the shared card source owner after an icon/marker render is committed. */
export function injectExternalSvgSources(card) {
  card.externalSvgSources.inject();
}
