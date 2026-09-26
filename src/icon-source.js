/**
 * Describes a configured icon source without making layout or rendering choices.
 *
 * @param {string} icon - Home Assistant icon name or CSS url(...) value.
 * @returns {{type: "ha-icon"|"svg-url"|"image-url", value: string}} Source type and normalized value.
 */
export function getIconSource(icon) {
  const urlMatch = icon.trim().match(/^url\(['"]?(.+?)['"]?\)$/i);

  if (!urlMatch) return { type: "ha-icon", value: icon };

  const url = urlMatch[1];
  return {
    type: url.endsWith(".svg") ? "svg-url" : "image-url",
    value: url,
  };
}

/**
 * Loads the SVG path exposed by Home Assistant's ha-icon component into the
 * existing card-wide icon cache. One loader instance owns one hidden ha-icon.
 */
export class HomeAssistantIconPath {
  /** Stores the source element id and current asynchronous request state. */
  constructor(card, sourceId, pathLoaded = () => card.requestUpdate(), measureBounds = false) {
    this.card = card;
    this.elementId = `icon-${sourceId}`;
    this.pathLoaded = pathLoaded;
    this.measureBounds = measureBounds;
    this.path = undefined;
    this.pendingIcon = undefined;
    this.pathRead = undefined;
    this.sourceClosed = false;
  }

  /** Releases the polling timer/frame belonging to the previous icon source. */
  stopReadingPath() {
    if (this.pathRead) {
      window.clearTimeout(this.pathRead.timer);
      window.cancelAnimationFrame(this.pathRead.frame);
      this.pathRead = undefined;
      this.pendingIcon = undefined;
    }
  }

  /** Lets the next render read the current source, reusing accepted cache data. */
  connected() {
    this.sourceClosed = false;
  }

  /** Stops polling and invalidates callbacks still waiting for the old render. */
  disconnected() {
    this.sourceClosed = true;
    this.stopReadingPath();
  }

  /**
   * Returns a cached path or starts reading it from the hidden ha-icon rendered
   * by the consumer. A source change cancels the previous polling loop.
   *
   * @param {string} icon - Home Assistant icon name.
   * @returns {string|undefined} SVG path data when available.
   */
  getPath(icon, rotation) {
    if (this.sourceClosed) return undefined;
    const measureRotatedBounds = this.measureBounds && rotation !== undefined;
    const boundsKey = `${icon}|${rotation}`;
    if (this.pendingIcon !== boundsKey) this.stopReadingPath();

    if (this.card.iconCache[icon] && (!measureRotatedBounds || this.card.iconBoundsCache[boundsKey])) {
      this.path = this.card.iconCache[icon];
      return this.path;
    }

    this.path = undefined;

    if (this.pendingIcon === boundsKey) return this.path;

    this.pendingIcon = boundsKey;
    const pathRead = { timer: undefined, frame: undefined };
    this.pathRead = pathRead;
    let attempts = 0;
    const maxAttempts = 40;
    const delay = 50;

    const readIconPath = () => {
      if (this.pathRead !== pathRead || this.sourceClosed) return;
      pathRead.timer = undefined;

      const iconElement = this.card.shadowRoot.getElementById(this.elementId);
      const iconSource = iconElement?.shadowRoot?.querySelector("*");
      const iconPath = iconSource?.path ?? this.card.iconCache[icon];
      const renderedPath = iconSource?.shadowRoot?.querySelector("path") ?? iconElement?.shadowRoot?.querySelector("path");
      let iconBounds;

      if (measureRotatedBounds && renderedPath) {
        const sourceBounds = renderedPath.getBBox();
        const sourceCenterX = sourceBounds.x + sourceBounds.width / 2;
        const sourceCenterY = sourceBounds.y + sourceBounds.height / 2;
        const pathLength = renderedPath.getTotalLength();
        const measurementSteps = Math.ceil(pathLength * 32);
        const rotationRadians = rotation * Math.PI / 180;
        const rotationCosine = Math.cos(rotationRadians);
        const rotationSine = Math.sin(rotationRadians);
        let minimumX = Infinity;
        let minimumY = Infinity;
        let maximumX = -Infinity;
        let maximumY = -Infinity;
        const correctedContour = [];

        // Rotate the visible path contour first and measure that corrected
        // shape. Empty corners from its original bbox never enter the result.
        for (let index = 0; index <= measurementSteps; index += 1) {
          const point = renderedPath.getPointAtLength(pathLength * index / measurementSteps);
          const centeredX = point.x - sourceCenterX;
          const centeredY = point.y - sourceCenterY;
          const rotatedX = centeredX * rotationCosine - centeredY * rotationSine;
          const rotatedY = centeredX * rotationSine + centeredY * rotationCosine;
          correctedContour.push({ x: rotatedX, y: rotatedY });
          minimumX = Math.min(minimumX, rotatedX);
          minimumY = Math.min(minimumY, rotatedY);
          maximumX = Math.max(maximumX, rotatedX);
          maximumY = Math.max(maximumY, rotatedY);
        }

        const tipTolerance = pathLength / measurementSteps;
        const tipContour = correctedContour.filter((point) => point.y <= minimumY + tipTolerance);
        const tipMinimumX = Math.min(...tipContour.map((point) => point.x));
        const tipMaximumX = Math.max(...tipContour.map((point) => point.x));

        iconBounds = {
          x: minimumX,
          y: minimumY,
          width: maximumX - minimumX,
          height: maximumY - minimumY,
          tipX: (tipMinimumX + tipMaximumX) / 2,
          sourceCenterX,
          sourceCenterY,
        };
      }

      if (iconPath && (!measureRotatedBounds || iconBounds)) {
        this.path = iconPath;
        this.card.iconCache[icon] = iconPath;
        if (measureRotatedBounds) this.card.iconBoundsCache[boundsKey] = iconBounds;
        this.pendingIcon = undefined;
        this.pathRead = undefined;
        this.pathLoaded();
        return;
      }

      attempts += 1;
      if (attempts >= maxAttempts) {
        this.pendingIcon = undefined;
        this.pathRead = undefined;
        return;
      }

      pathRead.timer = window.setTimeout(readIconPath, delay);
    };

    // Wait until the consumer's hidden ha-icon has entered the shadow DOM.
    const afterRender =
      this.card.updateComplete && typeof this.card.updateComplete.then === "function"
        ? this.card.updateComplete
        : new Promise((complete) => { pathRead.frame = window.requestAnimationFrame(complete); });

    afterRender.then(() => {
      if (this.pathRead !== pathRead || this.sourceClosed) return;
      pathRead.frame = undefined;
      pathRead.timer = window.setTimeout(readIconPath, 0);
    });
    return this.path;
  }

  /** Returns the measured visible bounds of a loaded Home Assistant icon. */
  getBounds(icon, rotation) {
    return this.card.iconBoundsCache[`${icon}|${rotation}`];
  }
}
