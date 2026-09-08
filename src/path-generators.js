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
 * Calculates the final clockwise corner coordinates for a regular polygon.
 * `top` identifies the exact point along a side that must lie on the vertical
 * centerline above the polygon. Width and height scale the oriented base
 * polygon independently; radius keeps the regular polygon proportions.
 *
 * @param {object} config - Validated polygon center, size, side count, and top position.
 * @returns {Array<{x: number, y: number}>} Clockwise polygon corners.
 */
export function calculatePolygonPoints(config) {
  const baseStartAngle = config.sides % 2 === 0
    ? -Math.PI / 2 - Math.PI / config.sides
    : -Math.PI / 2;
  const basePoints = [];

  for (let index = 0; index < config.sides; index += 1) {
    const angle = baseStartAngle + (index * Math.PI * 2) / config.sides;
    basePoints.push({ x: Math.cos(angle), y: Math.sin(angle) });
  }

  // A side position is linear along the actual edge. Rotate that exact point
  // to twelve o'clock rather than approximating it as an angular fraction.
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

  if (config.radius !== undefined) {
    return orientedPoints.map((point) => ({
      x: config.cx + point.x * config.radius,
      y: config.cy + point.y * config.radius,
    }));
  }

  const xValues = orientedPoints.map((point) => point.x);
  const yValues = orientedPoints.map((point) => point.y);
  const scaleX = config.width / (Math.max(...xValues) - Math.min(...xValues));
  const scaleY = config.height / (Math.max(...yValues) - Math.min(...yValues));

  return orientedPoints.map((point) => ({
    x: config.cx + point.x * scaleX,
    y: config.cy + point.y * scaleY,
  }));
}

/**
 * Builds one continuous regular-polygon centerline between numeric side
 * positions. Integers identify corners and decimals identify positions along
 * the following side. Direction changes traversal without changing numbering.
 *
 * @param {object} config - Validated polygon geometry and selected side range.
 * @returns {object} Stable polygon path definition.
 */
export function buildPolygonPathDefinition(config) {
  const points = calculatePolygonPoints(config);
  const pointAtPosition = (position) => {
    const wrappedPosition = ((position % config.sides) + config.sides) % config.sides;
    const side = Math.floor(wrappedPosition);
    const fraction = wrappedPosition - side;
    const sideStart = points[side];
    const sideEnd = points[(side + 1) % config.sides];

    return {
      x: sideStart.x + (sideEnd.x - sideStart.x) * fraction,
      y: sideStart.y + (sideEnd.y - sideStart.y) * fraction,
    };
  };
  const startPoint = pointAtPosition(config.start);
  const commands = [`M ${startPoint.x} ${startPoint.y}`];
  const closed = Math.abs(config.end - config.start) === config.sides;

  if (config.start === config.end) return createPathDefinition(commands[0], false);

  if (config.direction === 'clockwise') {
    const traversalEnd = closed
      ? config.start + config.sides
      : config.end < config.start ? config.end + config.sides : config.end;

    for (let position = Math.floor(config.start) + 1; position < traversalEnd; position += 1) {
      const point = pointAtPosition(position);
      commands.push(`L ${point.x} ${point.y}`);
    }

    const endPoint = pointAtPosition(traversalEnd);
    commands.push(`L ${endPoint.x} ${endPoint.y}`);
  } else {
    const traversalEnd = closed
      ? config.start - config.sides
      : config.end > config.start ? config.end - config.sides : config.end;

    for (let position = Math.ceil(config.start) - 1; position > traversalEnd; position -= 1) {
      const point = pointAtPosition(position);
      commands.push(`L ${point.x} ${point.y}`);
    }

    const endPoint = pointAtPosition(traversalEnd);
    commands.push(`L ${endPoint.x} ${endPoint.y}`);
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
    const wrappedPosition = ((position % 4) + 4) % 4;
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
  const closed = Math.abs(config.end - config.start) === 4;

  if (config.start === config.end) return createPathDefinition(commands[0], false);

  if (config.direction === 'clockwise') {
    const traversalEnd = closed
      ? config.start + 4
      : config.end < config.start ? config.end + 4 : config.end;
    let position = config.start;

    while (position < traversalEnd) {
      const sideBase = Math.floor(position);
      const nextPosition = Math.min(traversalEnd, sideBase + 1);
      appendSideRange(commands, ((sideBase % 4) + 4) % 4, position - sideBase, nextPosition - sideBase, 'clockwise');
      position = nextPosition;
    }
  } else {
    const traversalEnd = closed
      ? config.start - 4
      : config.end > config.start ? config.end - 4 : config.end;
    let position = config.start;

    while (position > traversalEnd) {
      const startsAtCorner = Number.isInteger(position);
      const sideBase = startsAtCorner ? position - 1 : Math.floor(position);
      const nextPosition = Math.max(traversalEnd, sideBase);
      appendSideRange(commands, ((sideBase % 4) + 4) % 4, position - sideBase, nextPosition - sideBase, 'counterclockwise');
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
  const deltaX = config.x2 - config.x1;
  const deltaY = config.y2 - config.y1;
  const baselineLength = Math.hypot(deltaX, deltaY);
  const normalX = -deltaY / baselineLength;
  const normalY = deltaX / baselineLength;
  const halfWaveCount = config.waves * 2;
  const commands = [`M ${config.x1} ${config.y1}`];

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
