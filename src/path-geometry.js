/**
 * Owns the bind, measure, cache, and invalidation lifecycle for one active SVG
 * centerline. Path generators provide the definition; later geometry features
 * consume the bound element and its cached browser measurement.
 */
export default class PathGeometry {
  /**
   * Creates an initially unbound geometry lifecycle.
   *
   * @param {Function} requestRender - Requests the controlled render that reveals geometry-dependent layers.
   */
  constructor(requestRender) {
    this.requestRender = requestRender;
    this.measurementCache = new Map();
    this.pathDefinition = undefined;
    this.pathElement = undefined;
    this.activeMeasurement = undefined;
    this.bound = false;
  }

  /**
   * Activates a centerline definition and invalidates the current DOM binding
   * only when its geometry signature changes.
   *
   * @param {object} pathDefinition - Stable centerline definition with d and signature fields.
   * @returns {boolean} True when a new DOM binding is required.
   */
  setPathDefinition(pathDefinition) {
    if (this.pathDefinition?.signature === pathDefinition.signature) {
      return false;
    }

    // A different path must first be committed to the DOM. A previous measurement
    // for the same signature can be reused after that new element binding.
    this.pathDefinition = pathDefinition;
    this.pathElement = undefined;
    this.activeMeasurement = this.measurementCache.get(pathDefinition.signature);
    this.bound = false;

    return true;
  }

  /**
   * Binds the active definition to its rendered SVGPathElement and measures an
   * unseen signature exactly once. The requested render is the only transition
   * that makes geometry-dependent output eligible for display.
   *
   * @param {SVGPathElement} pathElement - Rendered invisible master path.
   * @returns {boolean} True when the binding completed during this call.
   */
  bindPathElement(pathElement) {
    if (this.bound && this.pathElement === pathElement) {
      return false;
    }

    this.pathElement = pathElement;

    if (!this.activeMeasurement) {
      this.activeMeasurement = {
        totalLength: pathElement.getTotalLength(),
      };
      this.measurementCache.set(this.pathDefinition.signature, this.activeMeasurement);
    }

    this.bound = true;
    this.requestRender();

    return true;
  }

  /**
   * Reports whether consumers may display output that depends on browser geometry.
   *
   * @returns {boolean} True after the active rendered path has been bound.
   */
  isReady() {
    return this.bound;
  }

  /**
   * Returns the active stable centerline definition.
   *
   * @returns {object} Active path definition.
   */
  getPathDefinition() {
    return this.pathDefinition;
  }

  /**
   * Returns the cached browser length in SVG user units.
   *
   * @returns {number} Actual centerline length.
   */
  getTotalLength() {
    return this.activeMeasurement.totalLength;
  }

  /**
   * Returns the currently bound SVG geometry element for later point sampling.
   *
   * @returns {SVGPathElement} Active rendered master path.
   */
  getPathElement() {
    return this.pathElement;
  }
}
