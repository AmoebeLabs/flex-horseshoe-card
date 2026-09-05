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
        points: new Map(),
        tangents: new Map(),
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

  /**
   * Returns a browser-measured coordinate at normalized path progress. The
   * normalized-to-actual conversion remains private to this geometry boundary.
   *
   * @param {number} progress - Position in normalized 0..100 path space.
   * @returns {object} Point with x and y coordinates in SVG user units.
   */
  pointAtProgress(progress) {
    if (!this.activeMeasurement.points.has(progress)) {
      const actualDistance = (progress / 100) * this.activeMeasurement.totalLength;
      const measuredPoint = this.pathElement.getPointAtLength(actualDistance);

      this.activeMeasurement.points.set(progress, {
        x: measuredPoint.x,
        y: measuredPoint.y,
      });
    }

    return this.activeMeasurement.points.get(progress);
  }

  /**
   * Returns the unit direction of path traversal at normalized progress. Open
   * endpoints use a one-sided sample, ordinary positions and corners use a
   * centered sample, and a closed seam samples across the end/start boundary.
   * An exact cusp follows its outgoing branch.
   *
   * @param {number} progress - Position in normalized 0..100 path space.
   * @returns {object} Unit tangent with x and y vector components.
   */
  tangentAtProgress(progress) {
    if (!this.activeMeasurement.tangents.has(progress)) {
      const totalLength = this.activeMeasurement.totalLength;
      const actualDistance = (progress / 100) * totalLength;
      const sampleDistance = Math.min(0.01, totalLength / 2);
      let beforeDistance;
      let afterDistance;

      if (this.pathDefinition.closed) {
        beforeDistance = (actualDistance - sampleDistance + totalLength) % totalLength;
        afterDistance = (actualDistance + sampleDistance) % totalLength;
      } else {
        beforeDistance = Math.max(0, actualDistance - sampleDistance);
        afterDistance = Math.min(totalLength, actualDistance + sampleDistance);
      }

      const before = this.pathElement.getPointAtLength(beforeDistance);
      const after = this.pathElement.getPointAtLength(afterDistance);
      let deltaX = after.x - before.x;
      let deltaY = after.y - before.y;
      let vectorLength = Math.hypot(deltaX, deltaY);
      const cuspThreshold = sampleDistance / 100;

      // Symmetrical samples coincide at an exact cusp. Select the outgoing
      // branch first, then the incoming branch at an open path endpoint.
      if (vectorLength < cuspThreshold) {
        const cusp = this.pathElement.getPointAtLength(actualDistance);
        const outgoingDistance = this.pathDefinition.closed
          ? (actualDistance + sampleDistance) % totalLength
          : Math.min(totalLength, actualDistance + sampleDistance);
        const outgoing = this.pathElement.getPointAtLength(outgoingDistance);
        deltaX = outgoing.x - cusp.x;
        deltaY = outgoing.y - cusp.y;
        vectorLength = Math.hypot(deltaX, deltaY);

        if (vectorLength < cuspThreshold) {
          const incomingDistance = this.pathDefinition.closed
            ? (actualDistance - sampleDistance + totalLength) % totalLength
            : Math.max(0, actualDistance - sampleDistance);
          const incoming = this.pathElement.getPointAtLength(incomingDistance);
          deltaX = cusp.x - incoming.x;
          deltaY = cusp.y - incoming.y;
          vectorLength = Math.hypot(deltaX, deltaY);
        }
      }

      this.activeMeasurement.tangents.set(progress, {
        x: deltaX / vectorLength,
        y: deltaY / vectorLength,
      });
    }

    return this.activeMeasurement.tangents.get(progress);
  }

  /**
   * Returns the unit normal on the requested visual side relative to path
   * traversal. SVG's downward y-axis is accounted for, and both sides are exact
   * opposites.
   *
   * @param {number} progress - Position in normalized 0..100 path space.
   * @param {'left'|'right'} side - Side relative to forward path traversal.
   * @returns {object} Unit normal with x and y vector components.
   */
  normalAtProgress(progress, side) {
    const tangent = this.tangentAtProgress(progress);

    return side === 'left'
      ? { x: tangent.y, y: -tangent.x }
      : { x: -tangent.y, y: tangent.x };
  }
}
