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
 * Builds a closed rectangular centerline with independent corner radii. The
 * start side changes only the path origin; direction controls traversal order.
 *
 * @param {object} config - Normalized rectangle geometry.
 * @returns {object} Stable rectangle path definition.
 */
export function buildRectanglePathDefinition(config) {
  const left = config.x;
  const top = config.y;
  const right = config.x + config.width;
  const bottom = config.y + config.height;
  const centerX = config.x + config.width / 2;
  const centerY = config.y + config.height / 2;
  const startPoints = {
    top: `${centerX} ${top}`,
    right: `${right} ${centerY}`,
    bottom: `${centerX} ${bottom}`,
    left: `${left} ${centerY}`,
  };
  const sideOrder = ['top', 'right', 'bottom', 'left'];
  const clockwiseSections = {
    top: `L ${right - config.radiusTopRight} ${top} Q ${right} ${top} ${right} ${top + config.radiusTopRight} L ${right} ${centerY}`,
    right: `L ${right} ${bottom - config.radiusBottomRight} Q ${right} ${bottom} ${right - config.radiusBottomRight} ${bottom} L ${centerX} ${bottom}`,
    bottom: `L ${left + config.radiusBottomLeft} ${bottom} Q ${left} ${bottom} ${left} ${bottom - config.radiusBottomLeft} L ${left} ${centerY}`,
    left: `L ${left} ${top + config.radiusTopLeft} Q ${left} ${top} ${left + config.radiusTopLeft} ${top} L ${centerX} ${top}`,
  };
  const counterClockwiseSections = {
    top: `L ${left + config.radiusTopLeft} ${top} Q ${left} ${top} ${left} ${top + config.radiusTopLeft} L ${left} ${centerY}`,
    left: `L ${left} ${bottom - config.radiusBottomLeft} Q ${left} ${bottom} ${left + config.radiusBottomLeft} ${bottom} L ${centerX} ${bottom}`,
    bottom: `L ${right - config.radiusBottomRight} ${bottom} Q ${right} ${bottom} ${right} ${bottom - config.radiusBottomRight} L ${right} ${centerY}`,
    right: `L ${right} ${top + config.radiusTopRight} Q ${right} ${top} ${right - config.radiusTopRight} ${top} L ${centerX} ${top}`,
  };
  const startIndex = sideOrder.indexOf(config.start);
  const orderedSides = config.direction === 'clockwise'
    ? [...sideOrder.slice(startIndex), ...sideOrder.slice(0, startIndex)]
    : [...sideOrder.slice(0, startIndex + 1).reverse(), ...sideOrder.slice(startIndex + 1).reverse()];
  const sections = config.direction === 'clockwise' ? clockwiseSections : counterClockwiseSections;
  const d = `M ${startPoints[config.start]} ${orderedSides.map((side) => sections[side]).join(' ')} Z`;

  return createPathDefinition(d, true);
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
    case 'wave':
      return buildWavePathDefinition(config);
    case 'spiral':
      return buildSpiralPathDefinition(config);
    case 'infinity':
      return buildInfinityPathDefinition(config);
  }
}
