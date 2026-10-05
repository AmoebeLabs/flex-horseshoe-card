/**
 * Keeps the rendered SVG path and its browser measurements for FHS Path-based
 * drawing. The path length is measured once per path shape and reused. Fixed
 * point/direction samples are also reused, while animation uses temporary samples
 * that are replaced when the animated Path position changes.
 */
export default class PathGeometry {
  /**
   * Starts without a rendered SVG path. After a path has been measured,
   * `requestRender` lets FHS render gradients and other shapes that need those
   * exact browser measurements.
   *
   * @param {Function} requestRender - Requests another card render after the SVG path has been measured.
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
   * Stores a new SVG path definition. When the path shape changed, wait until
   * Lit has rendered the new `<path>` before using browser measurements for it.
   *
   * @param {object} pathDefinition - SVG path definition containing the `d` value and geometry signature.
   * @returns {boolean} True when Lit must render and connect a new SVG path.
   */
  setPathDefinition(pathDefinition) {
    if (this.pathDefinition?.signature === pathDefinition.signature) {
      return false;
    }

    // Lit must render the changed path before it can be measured. If this exact
    // path shape was measured earlier, reuse those measurements after the new
    // SVG element has been connected.
    this.pathDefinition = pathDefinition;
    this.pathElement = undefined;
    this.activeMeasurement = this.measurementCache.get(pathDefinition.signature);
    this.sampleCache = this.activeMeasurement;
    this.bound = false;

    return true;
  }

  /**
   * Connects the current path definition to the SVG path rendered by Lit.
   * Measure its browser length the first time this path shape is seen, then
   * request another render so gradients and other path-based drawing can use it.
   *
   * @param {SVGPathElement} pathElement - Rendered invisible SVG path used for measurement.
   * @returns {boolean} True when this call connected the rendered SVG path.
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

  /** Forgets the rendered SVG element on disconnect, but keeps measurements that can be reused after reconnecting. */
  unbindPathElement() {
    this.endTemporarySampling();
    this.temporarySamples.points.clear();
    this.temporarySamples.tangents.clear();
    this.temporarySamplesKey = undefined;
    this.pathElement = undefined;
    this.bound = false;
  }

  /**
   * Returns whether the current SVG path has been rendered and connected.
   *
   * @returns {boolean} True when browser measurements for the current path can be used.
   */
  isReady() {
    return this.bound;
  }

  /**
   * Returns the SVG path definition currently used for measurement.
   *
   * @returns {object} Current path definition.
   */
  getPathDefinition() {
    return this.pathDefinition;
  }

  /**
   * Returns the browser-measured length of the current SVG path.
   *
   * @returns {number} Path length in SVG units.
   */
  getTotalLength() {
    return this.activeMeasurement.totalLength;
  }

  /**
   * Starts point and direction sampling for the current animated Path position.
   * Reuse samples while the position is unchanged. When it changes, discard the
   * previous frame's temporary samples so animation does not grow the cache forever.
   *
   * @param {string} sampleKey - Values that identify the current animated Path position.
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

  /** Switches point and direction lookup back to the cached measurements for the fixed Path. */
  endTemporarySampling() {
    this.sampleCache = this.activeMeasurement;
  }

  /**
   * Splits the selected part of the Path into straight-enough sections for SVG
   * linear gradients and returns the start/end coordinates for each section.
   * A fixed full-Path gradient is cached; animation keeps only the current layout
   * instead of caching every frame.
   *
   * @param {object} config - Path range and limits used to divide curved sections.
   * @returns {object} Selected Path range and the calculated gradient sections.
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

    // The measured Path shape, selected range and subdivision limits determine
    // these sections. Changing colors can reuse the same gradient coordinates.
    const pendingIntervals = [{ start: domainStart, end: domainEnd }];
    const adaptiveIntervals = [];
    const pathLength = this.getTotalLength();

    // Keep a straight Path as one section even when it is long. Split curves
    // and corners until each SVG linear gradient follows the Path closely enough.
    // Color stops change gradient colors, not the number of SVG Path sections.
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

      // For a long section, sample two extra points as well. A curve can have
      // start, middle and end points that happen to lie on one straight line.
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
   * Returns the browser-measured x/y position at a 0..100 position on the Path.
   * Convert that percentage to the actual SVG path length here so callers can
   * work only with FHS's 0..100 Path scale.
   *
   * @param {number} progress - Position from 0 to 100 along the Path.
   * @returns {object} Measured x/y position in SVG units.
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
   * Returns the direction in which the Path travels at a 0..100 position.
   * Open ends sample only the available side, normal positions sample around
   * the requested point, and a closed Path samples across its end/start join.
   * At a sharp cusp, prefer the direction leaving the cusp.
   *
   * @param {number} progress - Position from 0 to 100 along the Path.
   * @returns {object} Normalized x/y direction vector.
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

      // At a sharp cusp, points sampled on both sides can be almost identical.
      // Use the outgoing Path direction first; at an open end, fall back to the
      // direction arriving at the cusp.
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
   * Returns a direction pointing left or right from the Path at a 0..100
   * position. The calculation accounts for SVG's downward y-axis.
   *
   * @param {number} progress - Position from 0 to 100 along the Path.
   * @param {'left'|'right'} side - Side relative to the forward Path direction.
   * @returns {object} Normalized x/y vector pointing away from the Path.
   */
  normalAtProgress(progress, side) {
    const tangent = this.tangentAtProgress(progress);

    return side === 'left'
      ? { x: tangent.y, y: -tangent.x }
      : { x: -tangent.y, y: tangent.x };
  }
}

/**
 * Applies the card's position, scale, rotation and flip matrix to measurements
 * from a Path. Callers receive final card coordinates directly, so SVG elements
 * using these points do not need the same transform again.
 */
export class TransformedPathGeometry {
  /** Stores the measured Path and the matrix that converts it to final card coordinates. */
  constructor(pathGeometry, matrix) {
    this.pathGeometry = pathGeometry;
    this.matrix = matrix;
    this.transformedLength = undefined;
  }

  /** Returns the original Path definition; transforming coordinates does not change whether the Path is open or closed. */
  getPathDefinition() {
    return this.pathGeometry.getPathDefinition();
  }

  /**
   * Estimates the Path length after the card transform, including non-uniform
   * scaling. FHS still uses the original 0..100 Path positions; this transformed
   * length is only needed when a label guide specifies a physical length.
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

  /** Returns one measured Path point after applying the card transform. */
  pointAtProgress(progress) {
    const point = this.pathGeometry.pointAtProgress(progress);

    return this.pointInCardCoordinates(point);
  }

  /** Applies the card transform to an x/y Path coordinate. */
  pointInCardCoordinates(point) {
    return {
      x: this.matrix.a * point.x + this.matrix.c * point.y + this.matrix.e,
      y: this.matrix.b * point.x + this.matrix.d * point.y + this.matrix.f,
    };
  }

  /** Applies card rotation/scale/flip to the Path direction and normalizes the result. */
  tangentAtProgress(progress) {
    const tangent = this.pathGeometry.tangentAtProgress(progress);
    const x = this.matrix.a * tangent.x + this.matrix.c * tangent.y;
    const y = this.matrix.b * tangent.x + this.matrix.d * tangent.y;
    const length = Math.hypot(x, y);

    return { x: x / length, y: y / length };
  }

  /**
   * Applies card rotation, scale and flip to the left/right direction beside
   * the Path. Translation is not used because this is a direction, not a position.
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
 * Builds a Path alongside an already measured Path by sampling points from
 * 0..100 and moving each point left or right by the configured offset. Path
 * background bands use this when they must run beside the main Path.
 *
 * @param {PathGeometry} pathGeometry - Measured Path used as the starting shape.
 * @param {number} offset - Distance in SVG units; positive uses the named side, negative uses its opposite.
 * @param {'left'|'right'} side - Side of the Path on which to place the new Path.
 * @param {number} samples - Number of equal 0..100 intervals used to build the new Path.
 * @returns {object} SVG path definition for the offset Path.
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
