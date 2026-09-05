/**
 * Places ticks, labels, badges, and directional markers around one measured
 * centerline. Every coordinate is derived from normalized progress plus the
 * browser-measured point, tangent, and normal contract; no path shape is known
 * or reconstructed here. Rotation and flips have already been applied to that
 * geometry. Features receive final coordinates so labels never inherit a path
 * transform and therefore remain readable.
 *
 * @param {PathGeometry} pathGeometry - Bound browser-measured path geometry.
 * @param {object} config - Complete normalized feature layout configuration.
 * @returns {object} Final renderer-ready feature coordinates and guide paths.
 */
export function buildPathFeatureLayout(pathGeometry, config) {
  const pathDefinition = pathGeometry.getPathDefinition();
  const pathLength = pathGeometry.getTotalLength();

  // A closed path has one physical seam. Progress 100 is normalized to zero,
  // then later duplicates at that position are removed in declaration order.
  const normalizedTicks = config.ticks
    .map((tick) => ({ ...tick, progress: pathDefinition.closed && tick.progress === 100 ? 0 : tick.progress }))
    .filter((tick, index, ticks) => !pathDefinition.closed || tick.progress !== 0 || ticks.findIndex((candidate) => candidate.progress === 0) === index);
  const ticks = normalizedTicks.map((tick) => {
    const point = pathGeometry.pointAtProgress(tick.progress);
    const normal = pathGeometry.normalAtProgress(tick.progress, tick.side);
    const x1 = point.x + normal.x * tick.offset;
    const y1 = point.y + normal.y * tick.offset;

    return {
      ...tick,
      x1,
      y1,
      x2: x1 + normal.x * tick.length,
      y2: y1 + normal.y * tick.length,
    };
  });

  const normalizedLabels = config.labels
    .map((label) => ({ ...label, progress: pathDefinition.closed && label.progress === 100 ? 0 : label.progress }))
    .filter((label, index, labels) => !pathDefinition.closed || label.progress !== 0 || labels.findIndex((candidate) => candidate.progress === 0) === index);
  const labels = normalizedLabels.map((label) => {
    const point = pathGeometry.pointAtProgress(label.progress);
    const tangent = pathGeometry.tangentAtProgress(label.progress);
    const normal = pathGeometry.normalAtProgress(label.progress, label.side);
    const x = point.x + normal.x * label.offset;
    const y = point.y + normal.y * label.offset;
    const tangentRotation = Math.atan2(tangent.y, tangent.x) * 180 / Math.PI;
    let guidePath = '';
    let guideStartOffset = 50;

    if (label.orientation === 'path') {
      const halfProgressLength = (label.length / pathLength) * 50;
      const guideStart = label.progress - halfProgressLength;
      const guideEnd = label.progress + halfProgressLength;
      const guidePoints = Array.from({ length: label.samples }, (_, sampleIndex) => {
        const unwrappedProgress = guideStart + (sampleIndex / (label.samples - 1)) * (guideEnd - guideStart);
        const sampleProgress = pathDefinition.closed ? (unwrappedProgress + 100) % 100 : Math.min(100, Math.max(0, unwrappedProgress));
        const pathPoint = pathGeometry.pointAtProgress(sampleProgress);
        const sampleTangent = pathGeometry.tangentAtProgress(sampleProgress);
        const sampleNormal = pathGeometry.normalAtProgress(sampleProgress, label.side);
        const extensionLength = pathDefinition.closed ? 0 : (unwrappedProgress - sampleProgress) / 100 * pathLength;
        const samplePoint = {
          x: pathPoint.x + sampleTangent.x * extensionLength,
          y: pathPoint.y + sampleTangent.y * extensionLength,
        };

        return {
          x: samplePoint.x + sampleNormal.x * label.offset,
          y: samplePoint.y + sampleNormal.y * label.offset,
        };
      });
      const reverseGuide = tangent.x < 0;
      const orderedGuidePoints = reverseGuide ? [...guidePoints].reverse() : guidePoints;

      guidePath = orderedGuidePoints.map((guidePoint, index) => `${index === 0 ? 'M' : 'L'} ${guidePoint.x} ${guidePoint.y}`).join(' ');
      guideStartOffset = 50;
    }

    return {
      ...label,
      x,
      y,
      tangentRotation,
      guidePath,
      guideStartOffset,
      badge: {
        ...label.badge,
        x,
        y,
        rotation: label.orientation === 'path' ? tangentRotation : 0,
      },
    };
  });

  const normalizedMarkers = config.markers
    .map((marker) => ({ ...marker, progress: pathDefinition.closed && marker.progress === 100 ? 0 : marker.progress }))
    .filter((marker, index, markers) => !pathDefinition.closed || marker.progress !== 0 || markers.findIndex((candidate) => candidate.progress === 0) === index);
  const markers = normalizedMarkers.map((marker) => {
    const point = pathGeometry.pointAtProgress(marker.progress);
    const pathTangent = pathGeometry.tangentAtProgress(marker.progress);
    const normal = pathGeometry.normalAtProgress(marker.progress, marker.side);
    const direction = marker.direction === 'forward' ? 1 : -1;
    const tangent = { x: pathTangent.x * direction, y: pathTangent.y * direction };
    const x = point.x + normal.x * marker.offset;
    const y = point.y + normal.y * marker.offset;
    const nose = { x: x + tangent.x * marker.length / 2, y: y + tangent.y * marker.length / 2 };
    const tail = { x: x - tangent.x * marker.length / 2, y: y - tangent.y * marker.length / 2 };

    return {
      ...marker,
      x,
      y,
      rotation: Math.atan2(tangent.y, tangent.x) * 180 / Math.PI,
      points: [
        nose,
        { x: tail.x + normal.x * marker.width / 2, y: tail.y + normal.y * marker.width / 2 },
        { x: tail.x - normal.x * marker.width / 2, y: tail.y - normal.y * marker.width / 2 },
      ],
    };
  });

  return { ticks, labels, markers };
}

export default buildPathFeatureLayout;
