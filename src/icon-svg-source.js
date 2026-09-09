import { SVGInjector } from "@tanem/svg-injector";

/**
 * Replaces pending external SVG placeholders and stores their source nodes in
 * the card cache. IconTool and state markers can then position independent
 * clones without issuing another request.
 *
 * @param {LitElement} card - Card containing placeholders and shared source caches.
 */
export function injectExternalSvgSources(card) {
  const elements = card.shadowRoot.querySelectorAll(
    "svg.icon-svg-url[data-src]:not(.injected-svg)",
  );

  if (!elements.length) return;

  SVGInjector(elements, {
    /** Source dimensions must not override the dimensions chosen by the consumer. */
    beforeEach(svgNode) {
      svgNode.removeAttribute("height");
      svgNode.removeAttribute("width");
    },

    afterEach(err, injectedSvg) {
      if (err || !injectedSvg) return;

      const url = injectedSvg.dataset.src;
      if (!url) return;

      card.svgUrlCache[url] = injectedSvg.cloneNode(true);
    },

    afterAll() {
      card.requestUpdate();
    },

    cacheRequests: false,
    evalScripts: "once",
    httpRequestWithCredentials: false,
    renumerateIRIElements: false,
  });
}
