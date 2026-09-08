/**
 * Creates the shared stable definition consumed by browser geometry. The
 * generated path itself is the cache identity, so equivalent geometry reuses
 * one measurement regardless of which configuration produced it.
 *
 * @param {string} d - SVG centerline path data.
 * @param {boolean} closed - Whether the centerline returns to its start.
 * @returns {object} Stable path definition.
 */
function createPathDefinition(d, closed) {
  const definition = {
    d,
    closed,
    direction: 'forward',
  };

  return {
    ...definition,
    signature: JSON.stringify(definition),
  };
}

/**
 * Builds a circular or elliptical centerline from a start angle and signed
 * sweep. A complete ring uses two arcs because one SVG arc cannot return to its
 * own start point.
 *
 * @param {object} config - Normalized arc geometry.
 * @returns {object} Stable arc path definition.
 */
export function buildArcPathDefinition(config) {
  const startRadians = (config.startAngle * Math.PI) / 180;
  const endAngle = config.startAngle + config.arcDegrees;
  const endRadians = (endAngle * Math.PI) / 180;
  const startX = config.cx + config.radiusX * Math.cos(startRadians);
  const startY = config.cy + config.radiusY * Math.sin(startRadians);
  const endX = config.cx + config.radiusX * Math.cos(endRadians);
  const endY = config.cy + config.radiusY * Math.sin(endRadians);
  const sweepFlag = config.arcDegrees >= 0 ? 1 : 0;

  if (Math.abs(config.arcDegrees) === 360) {
    const middleRadians = ((config.startAngle + config.arcDegrees / 2) * Math.PI) / 180;
    const middleX = config.cx + config.radiusX * Math.cos(middleRadians);
    const middleY = config.cy + config.radiusY * Math.sin(middleRadians);
    const d = `M ${startX} ${startY} A ${config.radiusX} ${config.radiusY} 0 1 ${sweepFlag} ${middleX} ${middleY} A ${config.radiusX} ${config.radiusY} 0 1 ${sweepFlag} ${endX} ${endY} Z`;

    return createPathDefinition(d, true);
  }

  const largeArcFlag = Math.abs(config.arcDegrees) > 180 ? 1 : 0;
  const d = `M ${startX} ${startY} A ${config.radiusX} ${config.radiusY} 0 ${largeArcFlag} ${sweepFlag} ${endX} ${endY}`;

  return createPathDefinition(d, false);
}

/**
 * Builds a straight centerline between two configured points.
 *
 * @param {object} config - Normalized line geometry.
 * @returns {object} Stable line path definition.
 */
export function buildLinePathDefinition(config) {
  return createPathDefinition(`M ${config.x1} ${config.y1} L ${config.x2} ${config.y2}`, false);
}

/**
 * Calculates the final clockwise corner coordinates for a polygon.
 * `top` identifies the exact point along a side that must lie on the vertical
 * centerline above the polygon. Width and height scale the oriented base
 * polygon independently.
 *
 * @param {object} config - Validated polygon center, size, side count, and top position.
 * @returns {Array<{x: number, y: number}>} Clockwise polygon corners.
 */
export function calculatePolygonPoints(config) {
  // Start odd polygons at their top corner and even polygons at the corner
  // immediately left of their horizontal top side.
  const baseStartAngle = config.sides % 2 === 0
    ? -Math.PI / 2 - Math.PI / config.sides
    : -Math.PI / 2;
  const basePoints = [];

  for (let index = 0; index < config.sides; index += 1) {
    const angle = baseStartAngle + (index * Math.PI * 2) / config.sides;
    basePoints.push({ x: Math.cos(angle), y: Math.sin(angle) });
  }

  // Orient the configured side position toward twelve o'clock. This keeps
  // `top` tied to polygon sides instead of to an SVG rotation angle.
  const normalizedTop = config.top === config.sides ? 0 : config.top;
  const topSide = Math.floor(normalizedTop);
  const topFraction = normalizedTop - topSide;
  const topStart = basePoints[topSide];
  const topEnd = basePoints[(topSide + 1) % config.sides];
  const topX = topStart.x + (topEnd.x - topStart.x) * topFraction;
  const topY = topStart.y + (topEnd.y - topStart.y) * topFraction;
  const rotation = -Math.PI / 2 - Math.atan2(topY, topX);
  const orientedPoints = basePoints.map((point) => ({
    x: point.x * Math.cos(rotation) - point.y * Math.sin(rotation),
    y: point.x * Math.sin(rotation) + point.y * Math.cos(rotation),
  }));

  // Scale after orientation so width and height remain the configured outer
  // dimensions for every side count and every top position.
  const xValues = orientedPoints.map((point) => point.x);
  const yValues = orientedPoints.map((point) => point.y);
  const centerX = (Math.min(...xValues) + Math.max(...xValues)) / 2;
  const centerY = (Math.min(...yValues) + Math.max(...yValues)) / 2;
  const scaleX = config.width / (Math.max(...xValues) - Math.min(...xValues));
  const scaleY = config.height / (Math.max(...yValues) - Math.min(...yValues));

  return orientedPoints.map((point) => ({
    x: config.cx + (point.x - centerX) * scaleX,
    y: config.cy + (point.y - centerY) * scaleY,
  }));
}

/**
 * Calculates the largest circular corner radius that fits a polygon without
 * letting the rounded parts cross on any side.
 *
 * @param {object} config - Validated polygon center, dimensions, side count, and top position.
 * @returns {number} Largest valid corner radius in SVG units.
 */
export function calculatePolygonMaximumRadius(config) {
  const points = calculatePolygonPoints(config);

  // Every corner consumes part of both adjoining sides. The tangent factor
  // converts one unit of corner radius to that consumed side distance.
  const tangentFactors = points.map((point, index) => {
    const previous = points[(index - 1 + config.sides) % config.sides];
    const next = points[(index + 1) % config.sides];
    const previousLength = Math.hypot(previous.x - point.x, previous.y - point.y);
    const nextLength = Math.hypot(next.x - point.x, next.y - point.y);
    const previousUnitX = (previous.x - point.x) / previousLength;
    const previousUnitY = (previous.y - point.y) / previousLength;
    const nextUnitX = (next.x - point.x) / nextLength;
    const nextUnitY = (next.y - point.y) / nextLength;
    const interiorAngle = Math.acos(Math.max(-1, Math.min(1, previousUnitX * nextUnitX + previousUnitY * nextUnitY)));

    return 1 / Math.tan(interiorAngle / 2);
  });

  // The shortest remaining side allowance determines the largest radius that
  // can be used without two neighbouring rounded corners crossing.
  return Math.min(...points.map((point, index) => {
    const next = points[(index + 1) % config.sides];
    const sideLength = Math.hypot(next.x - point.x, next.y - point.y);
    return sideLength / (tangentFactors[index] + tangentFactors[(index + 1) % config.sides]);
  }));
}

/**
 * Builds one continuous rounded-polygon centerline between numeric side
 * positions. Integers lie halfway around corners, exactly as for rounded
 * rectangles. Decimals remain proportional over the rounded side range.
 *
 * @param {object} config - Validated polygon geometry and selected side range.
 * @returns {object} Stable polygon path definition.
 */
export function buildPolygonPathDefinition(config) {
  const points = calculatePolygonPoints(config);
  const line = (x1, y1, x2, y2) => ({
    type: 'line', x1, y1, x2, y2,
    length: Math.hypot(x2 - x1, y2 - y1),
  });
  // Replace every sharp corner with one circular arc. The midpoint divides
  // that arc between the preceding and following numbered sides, matching the
  // established rounded-rectangle position model.
  const corners = points.map((point, index) => {
    const previous = points[(index - 1 + config.sides) % config.sides];
    const next = points[(index + 1) % config.sides];
    const previousLength = Math.hypot(previous.x - point.x, previous.y - point.y);
    const nextLength = Math.hypot(next.x - point.x, next.y - point.y);
    const previousUnit = { x: (previous.x - point.x) / previousLength, y: (previous.y - point.y) / previousLength };
    const nextUnit = { x: (next.x - point.x) / nextLength, y: (next.y - point.y) / nextLength };
    const interiorAngle = Math.acos(Math.max(-1, Math.min(1, previousUnit.x * nextUnit.x + previousUnit.y * nextUnit.y)));
    const tangentDistance = config.radius / Math.tan(interiorAngle / 2);
    const bisectorLength = Math.hypot(previousUnit.x + nextUnit.x, previousUnit.y + nextUnit.y);
    const centerDistance = config.radius / Math.sin(interiorAngle / 2);
    const center = {
      x: point.x + ((previousUnit.x + nextUnit.x) / bisectorLength) * centerDistance,
      y: point.y + ((previousUnit.y + nextUnit.y) / bisectorLength) * centerDistance,
    };
    const incoming = { x: point.x + previousUnit.x * tangentDistance, y: point.y + previousUnit.y * tangentDistance };
    const outgoing = { x: point.x + nextUnit.x * tangentDistance, y: point.y + nextUnit.y * tangentDistance };
    const startAngle = Math.atan2(incoming.y - center.y, incoming.x - center.x);
    let endAngle = Math.atan2(outgoing.y - center.y, outgoing.x - center.x);

    if (endAngle <= startAngle) endAngle += Math.PI * 2;
    const middleAngle = (startAngle + endAngle) / 2;
    const middle = {
      x: center.x + config.radius * Math.cos(middleAngle),
      y: center.y + config.radius * Math.sin(middleAngle),
    };
    const arc = (arcStart, arcEnd, arcStartAngle, arcEndAngle) => ({
      type: 'arc',
      cx: center.x,
      cy: center.y,
      radius: config.radius,
      startAngle: arcStartAngle,
      endAngle: arcEndAngle,
      x1: arcStart.x,
      y1: arcStart.y,
      x2: arcEnd.x,
      y2: arcEnd.y,
      length: config.radius * (arcEndAngle - arcStartAngle),
    });

    return {
      incoming,
      middle,
      outgoing,
      firstHalf: arc(incoming, middle, startAngle, middleAngle),
      secondHalf: arc(middle, outgoing, middleAngle, endAngle),
    };
  });
  // One numbered side contains half its starting corner, the straight edge,
  // and half its ending corner. A full polygon is therefore still 0..sides.
  const sides = corners.map((corner, index) => {
    const nextCorner = corners[(index + 1) % config.sides];
    return [
      corner.secondHalf,
      line(corner.outgoing.x, corner.outgoing.y, nextCorner.incoming.x, nextCorner.incoming.y),
      nextCorner.firstHalf,
    ];
  });
  const pointOnSegment = (segment, progress) => {
    if (segment.type === 'line') {
      return {
        x: segment.x1 + (segment.x2 - segment.x1) * progress,
        y: segment.y1 + (segment.y2 - segment.y1) * progress,
      };
    }

    const angle = segment.startAngle + (segment.endAngle - segment.startAngle) * progress;
    return {
      x: segment.cx + segment.radius * Math.cos(angle),
      y: segment.cy + segment.radius * Math.sin(angle),
    };
  };
  // Decimal positions use traveled centerline distance, so 0.5 remains the
  // true halfway point even when rounded corners consume part of the side.
  const sidePoint = (side, fraction) => {
    const sideLength = sides[side].reduce((total, segment) => total + segment.length, 0);
    const distance = sideLength * fraction;
    let consumed = 0;

    for (const segment of sides[side]) {
      if (distance <= consumed + segment.length || segment === sides[side][sides[side].length - 1]) {
        const progress = segment.length === 0 ? 1 : (distance - consumed) / segment.length;
        return pointOnSegment(segment, progress);
      }
      consumed += segment.length;
    }
  };
  const pointAtPosition = (position) => {
    const wrappedPosition = ((position % config.sides) + config.sides) % config.sides;
    const side = Math.floor(wrappedPosition);
    return sidePoint(side, wrappedPosition - side);
  };

  // Corner rounding changes the traveled distance represented by a decimal
  // side position. Orient the completed rounded centerline so the configured
  // `top` position itself, rather than its former sharp-edge approximation,
  // lands exactly at twelve o'clock.
  const topPoint = pointAtPosition(config.top);
  const rotation = -Math.PI / 2 - Math.atan2(topPoint.y - config.cy, topPoint.x - config.cx);
  const rotatePoint = (point) => ({
    x: config.cx + (point.x - config.cx) * Math.cos(rotation) - (point.y - config.cy) * Math.sin(rotation),
    y: config.cy + (point.x - config.cx) * Math.sin(rotation) + (point.y - config.cy) * Math.cos(rotation),
  });

  // Append only the requested part of one numbered side. Reversing traversal
  // changes SVG sweep direction without changing the public side numbering.
  const appendSideRange = (commands, side, fromFraction, toFraction, direction) => {
    const segments = sides[side];
    const sideLength = segments.reduce((total, segment) => total + segment.length, 0);
    const rangeStart = sideLength * Math.min(fromFraction, toFraction);
    const rangeEnd = sideLength * Math.max(fromFraction, toFraction);
    const orderedSegments = direction === 'clockwise' ? segments : [...segments].reverse();
    let consumed = direction === 'clockwise' ? 0 : sideLength;

    orderedSegments.forEach((segment) => {
      const segmentStart = direction === 'clockwise' ? consumed : consumed - segment.length;
      const segmentEnd = direction === 'clockwise' ? consumed + segment.length : consumed;
      consumed += direction === 'clockwise' ? segment.length : -segment.length;
      const overlapStart = Math.max(rangeStart, segmentStart);
      const overlapEnd = Math.min(rangeEnd, segmentEnd);

      if (overlapEnd <= overlapStart || segment.length === 0) return;

      const forwardStart = (overlapStart - segmentStart) / segment.length;
      const forwardEnd = (overlapEnd - segmentStart) / segment.length;
      const targetProgress = direction === 'clockwise' ? forwardEnd : forwardStart;
      const target = rotatePoint(pointOnSegment(segment, targetProgress));

      if (segment.type === 'line') {
        commands.push(`L ${target.x} ${target.y}`);
      } else {
        commands.push(`A ${segment.radius} ${segment.radius} 0 0 ${direction === 'clockwise' ? 1 : 0} ${target.x} ${target.y}`);
      }
    });
  };
  const startPoint = rotatePoint(pointAtPosition(config.start));
  const commands = [`M ${startPoint.x} ${startPoint.y}`];
  const closed = Math.abs(config.end - config.start) === config.sides;

  if (config.start === config.end) return createPathDefinition(commands[0], false);

  // Walk side by side until the requested end is reached. Equal start/end is
  // intentionally empty; an exact difference of `sides` is the complete path.
  if (config.direction === 'clockwise') {
    const traversalEnd = closed
      ? config.start + config.sides
      : config.end < config.start ? config.end + config.sides : config.end;
    let position = config.start;

    while (position < traversalEnd) {
      const sideBase = Math.floor(position);
      const nextPosition = Math.min(traversalEnd, sideBase + 1);
      // A traversal can continue beyond the last numbered side. Wrap that
      // running position back to the corresponding polygon side.
      const polygonSide = ((sideBase % config.sides) + config.sides) % config.sides;
      appendSideRange(commands, polygonSide, position - sideBase, nextPosition - sideBase, 'clockwise');
      position = nextPosition;
    }
  } else {
    const traversalEnd = closed
      ? config.start - config.sides
      : config.end > config.start ? config.end - config.sides : config.end;
    let position = config.start;

    while (position > traversalEnd) {
      const startsAtCorner = Number.isInteger(position);
      const sideBase = startsAtCorner ? position - 1 : Math.floor(position);
      const nextPosition = Math.max(traversalEnd, sideBase);
      // Counterclockwise traversal reaches negative running positions. Wrap
      // those positions to the unchanged clockwise polygon numbering.
      const polygonSide = ((sideBase % config.sides) + config.sides) % config.sides;
      appendSideRange(commands, polygonSide, position - sideBase, nextPosition - sideBase, 'counterclockwise');
      position = nextPosition;
    }
  }

  if (closed) commands.push('Z');

  return createPathDefinition(commands.join(' '), closed);
}

/**
 * Builds one continuous rounded-rectangle centerline between numeric side
 * positions. Every integer lies halfway around a corner. Each side therefore
 * includes the second half of its starting corner and the first half of its
 * ending corner, and decimal positions remain proportional when size changes.
 *
 * @param {object} config - Validated rectangle center, dimensions, radii, and side range.
 * @returns {object} Stable rounded rectangle path definition.
 */
export function buildRectanglePathDefinition(config) {
  const sideCount = 4;
  // Convert center-based card dimensions to the four outer boundaries used by
  // the rounded side definitions below.
  const left = config.cx - config.width / 2;
  const top = config.cy - config.height / 2;
  const right = config.cx + config.width / 2;
  const bottom = config.cy + config.height / 2;
  const radii = [config.radiusTopLeft, config.radiusTopRight, config.radiusBottomRight, config.radiusBottomLeft];
  const arc = (cx, cy, radius, startAngle, endAngle) => ({
    type: 'arc', cx, cy, radius, startAngle, endAngle,
    length: radius * Math.abs(endAngle - startAngle) * Math.PI / 180,
  });
  const line = (x1, y1, x2, y2) => ({
    type: 'line', x1, y1, x2, y2,
    length: Math.hypot(x2 - x1, y2 - y1),
  });
  // Integers identify corner midpoints, not sharp corner coordinates. Each
  // numbered side therefore owns both its straight edge and two half-corners.
  const sides = [
    [
      arc(left + radii[0], top + radii[0], radii[0], 225, 270),
      line(left + radii[0], top, right - radii[1], top),
      arc(right - radii[1], top + radii[1], radii[1], 270, 315),
    ],
    [
      arc(right - radii[1], top + radii[1], radii[1], 315, 360),
      line(right, top + radii[1], right, bottom - radii[2]),
      arc(right - radii[2], bottom - radii[2], radii[2], 0, 45),
    ],
    [
      arc(right - radii[2], bottom - radii[2], radii[2], 45, 90),
      line(right - radii[2], bottom, left + radii[3], bottom),
      arc(left + radii[3], bottom - radii[3], radii[3], 90, 135),
    ],
    [
      arc(left + radii[3], bottom - radii[3], radii[3], 135, 180),
      line(left, bottom - radii[3], left, top + radii[0]),
      arc(left + radii[0], top + radii[0], radii[0], 180, 225),
    ],
  ];
  const pointOnSegment = (segment, progress) => {
    if (segment.type === 'line') {
      return {
        x: segment.x1 + (segment.x2 - segment.x1) * progress,
        y: segment.y1 + (segment.y2 - segment.y1) * progress,
      };
    }

    const angle = (segment.startAngle + (segment.endAngle - segment.startAngle) * progress) * Math.PI / 180;
    return {
      x: segment.cx + segment.radius * Math.cos(angle),
      y: segment.cy + segment.radius * Math.sin(angle),
    };
  };
  // Measure a decimal position over the complete rounded side. This prevents
  // corner radius changes from moving 0.5 away from the visual midpoint.
  const sidePoint = (side, fraction) => {
    const sideLength = sides[side].reduce((total, segment) => total + segment.length, 0);
    const distance = sideLength * fraction;
    let consumed = 0;

    for (const segment of sides[side]) {
      if (distance <= consumed + segment.length || segment === sides[side][sides[side].length - 1]) {
        const progress = segment.length === 0 ? 1 : (distance - consumed) / segment.length;
        return pointOnSegment(segment, progress);
      }
      consumed += segment.length;
    }
  };
  const pointAtPosition = (position) => {
    const wrappedPosition = ((position % sideCount) + sideCount) % sideCount;
    const side = Math.floor(wrappedPosition);
    return sidePoint(side, wrappedPosition - side);
  };

  // Rotate the generated centerline itself. Every later path layer and label
  // consumes these final coordinates and needs no compensating SVG transform.
  const topPoint = pointAtPosition(config.top);
  const rotation = -Math.PI / 2 - Math.atan2(topPoint.y - config.cy, topPoint.x - config.cx);
  const rotatePoint = (point) => ({
    x: config.cx + (point.x - config.cx) * Math.cos(rotation) - (point.y - config.cy) * Math.sin(rotation),
    y: config.cy + (point.x - config.cx) * Math.sin(rotation) + (point.y - config.cy) * Math.cos(rotation),
  });
  // Convert the selected fraction of one side to the required line and arc
  // commands, preserving the configured clockwise or counterclockwise route.
  const appendSideRange = (commands, side, fromFraction, toFraction, direction) => {
    const segments = sides[side];
    const sideLength = segments.reduce((total, segment) => total + segment.length, 0);
    const rangeStart = sideLength * Math.min(fromFraction, toFraction);
    const rangeEnd = sideLength * Math.max(fromFraction, toFraction);
    const orderedSegments = direction === 'clockwise' ? segments : [...segments].reverse();
    let consumed = direction === 'clockwise' ? 0 : sideLength;

    orderedSegments.forEach((segment) => {
      const segmentStart = direction === 'clockwise' ? consumed : consumed - segment.length;
      const segmentEnd = direction === 'clockwise' ? consumed + segment.length : consumed;
      consumed += direction === 'clockwise' ? segment.length : -segment.length;
      const overlapStart = Math.max(rangeStart, segmentStart);
      const overlapEnd = Math.min(rangeEnd, segmentEnd);

      if (overlapEnd <= overlapStart || segment.length === 0) return;

      const forwardStart = (overlapStart - segmentStart) / segment.length;
      const forwardEnd = (overlapEnd - segmentStart) / segment.length;
      const targetProgress = direction === 'clockwise' ? forwardEnd : forwardStart;
      const target = rotatePoint(pointOnSegment(segment, targetProgress));

      if (segment.type === 'line') {
        commands.push(`L ${target.x} ${target.y}`);
      } else {
        commands.push(`A ${segment.radius} ${segment.radius} 0 0 ${direction === 'clockwise' ? 1 : 0} ${target.x} ${target.y}`);
      }
    });
  };
  const startPoint = rotatePoint(pointAtPosition(config.start));
  const commands = [`M ${startPoint.x} ${startPoint.y}`];
  const closed = Math.abs(config.end - config.start) === sideCount;

  if (config.start === config.end) return createPathDefinition(commands[0], false);

  // Continue through numbered sides until the requested endpoint. An exact
  // range of four closes the rectangle; equal start/end remains empty.
  if (config.direction === 'clockwise') {
    const traversalEnd = closed
      ? config.start + sideCount
      : config.end < config.start ? config.end + sideCount : config.end;
    let position = config.start;

    while (position < traversalEnd) {
      const sideBase = Math.floor(position);
      const nextPosition = Math.min(traversalEnd, sideBase + 1);
      // A full traversal reaches `sideCount`, which is rectangle side 0.
      const rectangleSide = ((sideBase % sideCount) + sideCount) % sideCount;
      appendSideRange(commands, rectangleSide, position - sideBase, nextPosition - sideBase, 'clockwise');
      position = nextPosition;
    }
  } else {
    const traversalEnd = closed
      ? config.start - sideCount
      : config.end > config.start ? config.end - sideCount : config.end;
    let position = config.start;

    while (position > traversalEnd) {
      const startsAtCorner = Number.isInteger(position);
      const sideBase = startsAtCorner ? position - 1 : Math.floor(position);
      const nextPosition = Math.max(traversalEnd, sideBase);
      // Negative traversal positions wrap to the unchanged 0..3 numbering.
      const rectangleSide = ((sideBase % sideCount) + sideCount) % sideCount;
      appendSideRange(commands, rectangleSide, position - sideBase, nextPosition - sideBase, 'counterclockwise');
      position = nextPosition;
    }
  }

  if (closed) commands.push('Z');

  return createPathDefinition(commands.join(' '), closed);
}

/**
 * Builds a smooth wave between two points. Every configured wave consists of
 * two cubic half-waves; matching control vectors keep the joins tangent-continuous.
 *
 * @param {object} config - Normalized wave geometry.
 * @returns {object} Stable wave path definition.
 */
export function buildWavePathDefinition(config) {
  // Derive one perpendicular direction from the configured baseline. All wave
  // amplitudes use this direction, so rotating the wave does not alter shape.
  const deltaX = config.x2 - config.x1;
  const deltaY = config.y2 - config.y1;
  const baselineLength = Math.hypot(deltaX, deltaY);
  const normalX = -deltaY / baselineLength;
  const normalY = deltaX / baselineLength;
  const halfWaveCount = config.waves * 2;
  const commands = [`M ${config.x1} ${config.y1}`];

  // Two cubic halves make one complete wave. Alternating the control direction
  // creates crests and troughs while shared endpoints keep joins smooth.
  for (let index = 0; index < halfWaveCount; index += 1) {
    const startProgress = index / halfWaveCount;
    const endProgress = (index + 1) / halfWaveCount;
    const controlOneProgress = startProgress + (endProgress - startProgress) / 3;
    const controlTwoProgress = startProgress + ((endProgress - startProgress) * 2) / 3;
    const signedControlAmplitude = (index % 2 === 0 ? config.amplitude : -config.amplitude) * (4 / 3);
    const controlOneX = config.x1 + deltaX * controlOneProgress + normalX * signedControlAmplitude;
    const controlOneY = config.y1 + deltaY * controlOneProgress + normalY * signedControlAmplitude;
    const controlTwoX = config.x1 + deltaX * controlTwoProgress + normalX * signedControlAmplitude;
    const controlTwoY = config.y1 + deltaY * controlTwoProgress + normalY * signedControlAmplitude;
    const endX = config.x1 + deltaX * endProgress;
    const endY = config.y1 + deltaY * endProgress;

    commands.push(`C ${controlOneX} ${controlOneY} ${controlTwoX} ${controlTwoY} ${endX} ${endY}`);
  }

  return createPathDefinition(commands.join(' '), false);
}

/**
 * Builds an Archimedean spiral from configured inner to outer radius. Sampled
 * points are joined as one Catmull-Rom-derived cubic spline so the browser sees
 * a smooth centerline instead of a chain of tangent-breaking line segments.
 *
 * @param {object} config - Normalized spiral center, radii, sweep, and point count.
 * @returns {object} Stable spiral path definition.
 */
export function buildSpiralPathDefinition(config) {
  const points = [];

  // Sample the configured sweep while increasing radius linearly from the
  // inner to the outer value users supplied.
  for (let index = 0; index <= config.points; index += 1) {
    const progress = index / config.points;
    const radius = config.radiusInner + (config.radiusOuter - config.radiusInner) * progress;
    const angle = ((config.startAngle + config.degrees * progress) * Math.PI) / 180;

    points.push({
      x: config.cx + radius * Math.cos(angle),
      y: config.cy + radius * Math.sin(angle),
    });
  }

  const commands = [`M ${points[0].x} ${points[0].y}`];

  // Convert neighbouring samples to cubic controls. The resulting SVG remains
  // one smooth path for state length, gradients, segments, ticks, and labels.
  for (let index = 0; index < points.length - 1; index += 1) {
    const previous = points[Math.max(0, index - 1)];
    const current = points[index];
    const next = points[index + 1];
    const following = points[Math.min(points.length - 1, index + 2)];
    const controlOneX = current.x + (next.x - previous.x) / 6;
    const controlOneY = current.y + (next.y - previous.y) / 6;
    const controlTwoX = next.x - (following.x - current.x) / 6;
    const controlTwoY = next.y - (following.y - current.y) / 6;

    commands.push(`C ${controlOneX} ${controlOneY} ${controlTwoX} ${controlTwoY} ${next.x} ${next.y}`);
  }

  return createPathDefinition(commands.join(' '), false);
}

/**
 * Builds a closed figure-eight centerline. Four cubic sections preserve the
 * tangent through both outer turns, the center crossing, and the closing seam.
 *
 * @param {object} config - Normalized infinity center and horizontal/vertical radii.
 * @returns {object} Stable self-intersecting path definition.
 */
export function buildInfinityPathDefinition(config) {
  // Four cubic sections make both loops and return through the center crossing.
  // Keeping it one closed path lets every generic path layer use it unchanged.
  const halfControlX = config.radiusX / 2;
  const d = [
    `M ${config.cx} ${config.cy}`,
    `C ${config.cx + halfControlX} ${config.cy - config.radiusY} ${config.cx + config.radiusX} ${config.cy - config.radiusY} ${config.cx + config.radiusX} ${config.cy}`,
    `C ${config.cx + config.radiusX} ${config.cy + config.radiusY} ${config.cx + halfControlX} ${config.cy + config.radiusY} ${config.cx} ${config.cy}`,
    `C ${config.cx - halfControlX} ${config.cy - config.radiusY} ${config.cx - config.radiusX} ${config.cy - config.radiusY} ${config.cx - config.radiusX} ${config.cy}`,
    `C ${config.cx - config.radiusX} ${config.cy + config.radiusY} ${config.cx - halfControlX} ${config.cy + config.radiusY} ${config.cx} ${config.cy}`,
    'Z',
  ].join(' ');

  return createPathDefinition(d, true);
}

/**
 * Dispatches normalized shape configuration to its centerline generator.
 *
 * @param {object} config - Normalized path geometry with a supported type.
 * @returns {object} Stable path definition.
 */
export function buildPathDefinition(config) {
  switch (config.type) {
    case 'arc':
      return buildArcPathDefinition(config);
    case 'line':
      return buildLinePathDefinition(config);
    case 'rectangle':
      return buildRectanglePathDefinition(config);
    case 'polygon':
      return buildPolygonPathDefinition(config);
    case 'wave':
      return buildWavePathDefinition(config);
    case 'spiral':
      return buildSpiralPathDefinition(config);
    case 'infinity':
      return buildInfinityPathDefinition(config);
  }
}
