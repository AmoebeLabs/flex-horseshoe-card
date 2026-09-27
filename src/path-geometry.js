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
    this.sampleCache = undefined;
    this.temporarySamples = { points: new Map(), tangents: new Map() };
    this.temporarySamplesKey = undefined;
    this.currentGradientGeometryKey = undefined;
    this.currentGradientGeometry = undefined;
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
    this.sampleCache = this.activeMeasurement;
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
        gradientGeometryKey: undefined,
        gradientGeometry: undefined,
      };
      this.measurementCache.set(this.pathDefinition.signature, this.activeMeasurement);
    }

    this.bound = true;
    this.sampleCache = this.activeMeasurement;
    this.requestRender();

    return true;
  }

  /** Releases the DOM binding while retaining measurements for reconnect. */
  unbindPathElement() {
    this.endTemporarySampling();
    this.temporarySamples.points.clear();
    this.temporarySamples.tangents.clear();
    this.temporarySamplesKey = undefined;
    this.pathElement = undefined;
    this.bound = false;
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
   * Starts a moving-state drawing pass. Equal inputs reuse its latest samples;
   * a new position replaces those samples instead of accumulating old frames.
   * Transformed geometry uses this same owner and therefore shares these samples.
   *
   * @param {string} sampleKey - Effective progress and drawing-domain inputs.
   */
  beginTemporarySampling(sampleKey) {
    const key = JSON.stringify([this.pathDefinition.signature, sampleKey]);
    if (key !== this.temporarySamplesKey) {
      this.temporarySamples.points.clear();
      this.temporarySamples.tangents.clear();
      this.temporarySamplesKey = key;
    }
    this.sampleCache = this.temporarySamples;
  }

  /** Restores fixed-layer sampling while retaining only the latest moving pass. */
  endTemporarySampling() {
    this.sampleCache = this.activeMeasurement;
  }

  /**
   * Returns prepared adaptive gradient intervals and their endpoint coordinates.
   * Full-path layers share the same layout regardless of color, width or reveal.
   * A moving domain retains only its latest layout, rather than every frame.
   *
   * @param {object} config - Normalized domain and adaptive sampling settings.
   * @returns {object} Prepared domain and geometry-only gradient ranges.
   */
  getGradientGeometry(config) {
    const fullPath = config.mode === 'full';
    const domainStart = fullPath ? 0 : config.range.start;
    const domainEnd = fullPath ? 100 : config.range.end;
    const geometryKey = JSON.stringify([
      this.pathDefinition.signature, domainStart, domainEnd,
      config.maxSegmentLength, config.minSegmentLength,
      config.maxTangentAngle, config.maxSegments, config.overlap,
    ]);

    if (fullPath && geometryKey === this.activeMeasurement.gradientGeometryKey) {
      return this.activeMeasurement.gradientGeometry;
    }
    if (!fullPath && geometryKey === this.currentGradientGeometryKey) {
      return this.currentGradientGeometry;
    }

    // The adaptive split depends on the measured trajectory and drawing domain.
    // Paint and the full gradient's moving reveal reuse the resulting intervals.
    const pendingIntervals = [{ start: domainStart, end: domainEnd }];
    const adaptiveIntervals = [];
    const pathLength = this.getTotalLength();

    // Keep an arbitrarily long straight trajectory intact. Curves and corners
    // are divided until each local linear gradient follows the centerline closely
    // enough; color stops do not create additional SVG paths.
    while (pendingIntervals.length) {
      const interval = pendingIntervals.pop();
      const midpoint = (interval.start + interval.end) / 2;
      const intervalLength = ((interval.end - interval.start) / 100) * pathLength;
      const splitFitsDomBudget = adaptiveIntervals.length + pendingIntervals.length + 2 <= config.maxSegments;
      const startPoint = this.pointAtProgress(interval.start);
      const middlePoint = this.pointAtProgress(midpoint);
      const endPoint = this.pointAtProgress(interval.end);
      const firstChord = { x: middlePoint.x - startPoint.x, y: middlePoint.y - startPoint.y };
      const secondChord = { x: endPoint.x - middlePoint.x, y: endPoint.y - middlePoint.y };
      const firstChordLength = Math.hypot(firstChord.x, firstChord.y);
      const secondChordLength = Math.hypot(secondChord.x, secondChord.y);
      const chordDotProduct = (firstChord.x * secondChord.x + firstChord.y * secondChord.y) / (firstChordLength * secondChordLength);
      const chordAngle = Math.acos(Math.min(1, Math.max(-1, chordDotProduct))) * 180 / Math.PI;
      let longCurvedInterval = false;

      // Long intervals need two extra samples to distinguish a genuinely straight
      // trajectory from a curve whose start, middle, and end happen to align.
      if (intervalLength > config.maxSegmentLength) {
        const firstQuarterPoint = this.pointAtProgress((interval.start + midpoint) / 2);
        const thirdQuarterPoint = this.pointAtProgress((midpoint + interval.end) / 2);
        const chord = { x: endPoint.x - startPoint.x, y: endPoint.y - startPoint.y };
        const chordLength = Math.hypot(chord.x, chord.y);
        const straightTolerance = 0.001;
        const pathIsStraight = chordLength > 0 && [firstQuarterPoint, middlePoint, thirdQuarterPoint].every((point) => {
          const pointDelta = { x: point.x - startPoint.x, y: point.y - startPoint.y };
          const distanceFromChord = Math.abs(pointDelta.x * chord.y - pointDelta.y * chord.x) / chordLength;
          const positionAlongChord = (pointDelta.x * chord.x + pointDelta.y * chord.y) / (chordLength * chordLength);
          return distanceFromChord <= straightTolerance && positionAlongChord >= 0 && positionAlongChord <= 1;
        });
        longCurvedInterval = !pathIsStraight;
      }
      const directionChangeTooLarge = !Number.isFinite(chordAngle) || chordAngle > config.maxTangentAngle;

      if ((longCurvedInterval || directionChangeTooLarge) && intervalLength / 2 >= config.minSegmentLength && splitFitsDomBudget) {
        pendingIntervals.push({ start: midpoint, end: interval.end });
        pendingIntervals.push({ start: interval.start, end: midpoint });
        continue;
      }

      adaptiveIntervals.push(interval);
    }

    const overlapProgress = (config.overlap / pathLength) * 100;
    const ranges = adaptiveIntervals.map((interval, index) => {
      const startPoint = this.pointAtProgress(interval.start);
      const endPoint = this.pointAtProgress(interval.end);
      const end = index === adaptiveIntervals.length - 1
        ? interval.end
        : Math.min(domainEnd, interval.end + overlapProgress);

      return {
        start: interval.start,
        end,
        length: end - interval.start,
        gradientStartProgress: ((interval.start - domainStart) / (domainEnd - domainStart)) * 100,
        gradientEndProgress: ((interval.end - domainStart) / (domainEnd - domainStart)) * 100,
        colorEnd: interval.end,
        coordinates: { x1: startPoint.x, y1: startPoint.y, x2: endPoint.x, y2: endPoint.y },
      };
    });
    const geometry = { domainStart, domainEnd, ranges };

    if (fullPath) {
      this.activeMeasurement.gradientGeometryKey = geometryKey;
      this.activeMeasurement.gradientGeometry = geometry;
    } else {
      this.currentGradientGeometryKey = geometryKey;
      this.currentGradientGeometry = geometry;
    }
    return geometry;
  }

  /**
   * Returns a browser-measured coordinate at normalized path progress. The
   * normalized-to-actual conversion remains private to this geometry boundary.
   *
   * @param {number} progress - Position in normalized 0..100 path space.
   * @returns {object} Point with x and y coordinates in SVG user units.
   */
  pointAtProgress(progress) {
    if (!this.sampleCache.points.has(progress)) {
      const actualDistance = (progress / 100) * this.activeMeasurement.totalLength;
      const measuredPoint = this.pathElement.getPointAtLength(actualDistance);

      this.sampleCache.points.set(progress, {
        x: measuredPoint.x,
        y: measuredPoint.y,
      });
    }

    return this.sampleCache.points.get(progress);
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
    if (!this.sampleCache.tangents.has(progress)) {
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

      this.sampleCache.tangents.set(progress, {
        x: deltaX / vectorLength,
        y: deltaY / vectorLength,
      });
    }

    return this.sampleCache.tangents.get(progress);
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

/**
 * Presents measured path geometry in its final card coordinate system. Visual
 * path layers use the same affine matrix, while path elements consume the
 * transformed points and vectors directly and therefore inherit no SVG transform.
 */
export class TransformedPathGeometry {
  /** Stores one bound geometry and its complete affine transform contract. */
  constructor(pathGeometry, matrix) {
    this.pathGeometry = pathGeometry;
    this.matrix = matrix;
    this.transformedLength = undefined;
  }

  /** Returns the unchanged topology metadata of the measured centerline. */
  getPathDefinition() {
    return this.pathGeometry.getPathDefinition();
  }

  /**
   * Approximates final visual length after non-uniform scaling. Normalized path
   * progress remains owned by the original path; this length is used only to
   * convert physical label-guide lengths into a local progress interval.
   */
  getTotalLength() {
    if (this.transformedLength === undefined) {
      let previous = this.pointAtProgress(0);
      let length = 0;

      for (let progress = 0.5; progress <= 100; progress += 0.5) {
        const point = this.pointAtProgress(progress);
        length += Math.hypot(point.x - previous.x, point.y - previous.y);
        previous = point;
      }

      this.transformedLength = length;
    }

    return this.transformedLength;
  }

  /** Maps one measured point through the final affine card transform. */
  pointAtProgress(progress) {
    const point = this.pathGeometry.pointAtProgress(progress);

    return this.pointInCardCoordinates(point);
  }

  /** Maps a source path coordinate through the final affine card transform. */
  pointInCardCoordinates(point) {
    return {
      x: this.matrix.a * point.x + this.matrix.c * point.y + this.matrix.e,
      y: this.matrix.b * point.x + this.matrix.d * point.y + this.matrix.f,
    };
  }

  /** Maps and normalizes the path traversal vector without applying translation. */
  tangentAtProgress(progress) {
    const tangent = this.pathGeometry.tangentAtProgress(progress);
    const x = this.matrix.a * tangent.x + this.matrix.c * tangent.y;
    const y = this.matrix.b * tangent.x + this.matrix.d * tangent.y;
    const length = Math.hypot(x, y);

    return { x: x / length, y: y / length };
  }

  /**
   * Transforms the source-side normal so an offset path element follows the same
   * rotate/flip as its path position without transforming the element itself.
   */
  normalAtProgress(progress, side) {
    const normal = this.pathGeometry.normalAtProgress(progress, side);
    const x = this.matrix.a * normal.x + this.matrix.c * normal.y;
    const y = this.matrix.b * normal.x + this.matrix.d * normal.y;
    const length = Math.hypot(x, y);

    return { x: x / length, y: y / length };
  }
}

/**
 * Samples one measured centerline into a parallel path definition. Background
 * bands use this when their configured offset differs from the primary path;
 * the same point/normal contract works for every admitted path shape.
 *
 * @param {PathGeometry} pathGeometry - Bound source centerline.
 * @param {number} offset - Signed distance from the centerline in SVG units.
 * @param {'left'|'right'} side - Visual side relative to traversal.
 * @param {number} samples - Number of equal normalized intervals.
 * @returns {object} Stable sampled path definition.
 */
export function buildOffsetPathDefinition(pathGeometry, offset, side, samples) {
  const sourceDefinition = pathGeometry.getPathDefinition();
  const points = Array.from({ length: samples + 1 }, (_, index) => {
    const progress = index / samples * 100;
    const point = pathGeometry.pointAtProgress(progress);
    const normal = pathGeometry.normalAtProgress(progress, side);

    return {
      x: point.x + normal.x * offset,
      y: point.y + normal.y * offset,
    };
  });
  const d = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ')
    + (sourceDefinition.closed ? ' Z' : '');
  const definition = {
    d,
    closed: sourceDefinition.closed,
    direction: sourceDefinition.direction,
  };

  return {
    ...definition,
    signature: JSON.stringify(definition),
  };
}
