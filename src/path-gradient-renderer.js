import { svg } from 'lit';

import Colors from './colors.js';
import { renderNormalizedPathBands } from './path-mask-renderer.js';

/**
 * Builds an adaptive sequence of locally linear gradient strokes along one
 * measured centerline. Full gradients keep a static 0..100 color distribution
 * while their visible dash range moves; current gradients redistribute the
 * complete color sequence over the active range.
 *
 * @param {PathGeometry} pathGeometry - Bound browser-measured path geometry.
 * @param {object} config - Complete normalized gradient, range, cap, and cost contract.
 * @returns {object} Gradient micro-ranges and the independently movable reveal range.
 */
export function buildAdaptivePathGradient(pathGeometry, config) {
  const domainStart = config.mode === 'full' ? 0 : config.range.start;
  const domainEnd = config.mode === 'full' ? 100 : config.range.end;
  const colorStops = { colors: config.colorStops.map((stop) => ({ value: stop.progress, color: stop.color })) };
  const anchors = [
    domainStart,
    ...config.colorStops.map((stop) => domainStart + (stop.progress / 100) * (domainEnd - domainStart)),
    domainEnd,
  ]
    .sort((progressA, progressB) => progressA - progressB)
    .filter((progress, index, values) => values.indexOf(progress) === index);
  const pendingIntervals = anchors.slice(0, -1).map((start, index) => ({ start, end: anchors[index + 1] })).reverse();
  const adaptiveIntervals = [];

  // Split by measured length before asking the browser for coordinates. Once
  // an interval is short enough, its two chord directions reveal local curve
  // change with one cached start/middle/end sample each. A true corner stops at
  // the configured visible minimum instead of subdividing toward zero forever.
  while (pendingIntervals.length) {
    const interval = pendingIntervals.pop();
    const midpoint = (interval.start + interval.end) / 2;
    const intervalLength = ((interval.end - interval.start) / 100) * pathGeometry.getTotalLength();
    const splitFitsDomBudget = adaptiveIntervals.length + pendingIntervals.length + 2 <= config.maxSegments;

    if (intervalLength > config.maxSegmentLength && splitFitsDomBudget) {
      pendingIntervals.push({ start: midpoint, end: interval.end });
      pendingIntervals.push({ start: interval.start, end: midpoint });
      continue;
    }

    const startPoint = pathGeometry.pointAtProgress(interval.start);
    const middlePoint = pathGeometry.pointAtProgress(midpoint);
    const endPoint = pathGeometry.pointAtProgress(interval.end);
    const firstChord = { x: middlePoint.x - startPoint.x, y: middlePoint.y - startPoint.y };
    const secondChord = { x: endPoint.x - middlePoint.x, y: endPoint.y - middlePoint.y };
    const firstChordLength = Math.hypot(firstChord.x, firstChord.y);
    const secondChordLength = Math.hypot(secondChord.x, secondChord.y);
    const chordDotProduct = (firstChord.x * secondChord.x + firstChord.y * secondChord.y) / (firstChordLength * secondChordLength);
    const chordAngle = Math.acos(Math.min(1, Math.max(-1, chordDotProduct))) * 180 / Math.PI;

    if (chordAngle > config.maxTangentAngle && intervalLength / 2 >= config.minSegmentLength && splitFitsDomBudget) {
      pendingIntervals.push({ start: midpoint, end: interval.end });
      pendingIntervals.push({ start: interval.start, end: midpoint });
      continue;
    }

    adaptiveIntervals.push(interval);
  }

  const ranges = adaptiveIntervals.map((interval, index) => {
    const gradientStartProgress = ((interval.start - domainStart) / (domainEnd - domainStart)) * 100;
    const gradientEndProgress = ((interval.end - domainStart) / (domainEnd - domainStart)) * 100;
    const startPoint = pathGeometry.pointAtProgress(interval.start);
    const endPoint = pathGeometry.pointAtProgress(interval.end);
    const overlapEnd = index === adaptiveIntervals.length - 1
      ? interval.end
      : Math.min(domainEnd, interval.end + (interval.end - interval.start) * config.overlap);
    const length = overlapEnd - interval.start;

    return {
      id: `gradient-${index}`,
      start: interval.start,
      end: overlapEnd,
      length,
      width: config.width,
      opacity: 1,
      startCap: index === 0 ? config.startCap : 'butt',
      endCap: index === adaptiveIntervals.length - 1 ? config.endCap : 'butt',
      dash: {
        array: [length, 100],
        offset: interval.start === 0 ? 0 : -interval.start,
      },
      gradient: {
        x1: startPoint.x,
        y1: startPoint.y,
        x2: endPoint.x,
        y2: endPoint.y,
        startColor: Colors.calculateStrokeColor(gradientStartProgress, colorStops, true),
        endColor: Colors.calculateStrokeColor(gradientEndProgress, colorStops, true),
      },
    };
  });
  const revealLength = config.range.end - config.range.start;

  return {
    mode: config.mode,
    ranges,
    revealRange: {
      id: 'gradient-reveal',
      start: config.range.start,
      end: config.range.end,
      startCap: config.startCap,
      endCap: config.endCap,
      dash: {
        array: [revealLength, 100],
        offset: config.range.start === 0 ? 0 : -config.range.start,
      },
    },
  };
}

/**
 * Moves the reveal over a previously built full-path gradient without sampling
 * geometry or rebuilding its adaptive color ranges.
 *
 * @param {object} gradient - Existing full-path adaptive gradient.
 * @param {object} range - New normalized visible start and end progress.
 * @returns {object} The same gradient object with its reveal range updated.
 */
export function setFullPathGradientRevealRange(gradient, range) {
  const revealLength = range.end - range.start;

  gradient.revealRange.start = range.start;
  gradient.revealRange.end = range.end;
  gradient.revealRange.dash.array = [revealLength, 100];
  gradient.revealRange.dash.offset = range.start === 0 ? 0 : -range.start;

  return gradient;
}

/**
 * Renders adaptive gradient ranges through the same generic band, border, cap,
 * and transparency pipeline as solid ranges. Full gradients are clipped by a
 * normalized dash intersections so state-only updates do not rebuild colors
 * and self-intersections never reveal a different path position.
 *
 * @param {object} pathDefinition - Stable generated centerline definition.
 * @param {object} gradient - Result from buildAdaptivePathGradient().
 * @param {object} layer - Shared fill, border, and composite opacity configuration.
 * @param {string} layerId - Stable DOM namespace for gradient definitions.
 * @param {string} className - CSS class namespace for the rendered gradient.
 * @returns {TemplateResult} Generic path gradient bands.
 */
export function renderAdaptivePathGradient(pathDefinition, gradient, layer, layerId, className) {
  const visibleRanges = gradient.ranges
    .map((range) => {
      const start = Math.max(range.start, gradient.revealRange.start);
      const end = Math.min(range.end, gradient.revealRange.end);
      const length = end - start;

      return {
        ...range,
        start,
        end,
        length,
        color: `url(#${layerId}-${range.id})`,
        dash: {
          array: [length, 100],
          offset: start === 0 ? 0 : -start,
        },
      };
    })
    .filter((range) => range.end > range.start)
    .map((range, index, ranges) => ({
      ...range,
      startCap: index === 0 ? gradient.revealRange.startCap : 'butt',
      endCap: index === ranges.length - 1 ? gradient.revealRange.endCap : 'butt',
    }));

  return svg`
    <g class=${className}>
      <defs>
        ${gradient.ranges.map((range) => svg`
          <linearGradient
            id="${layerId}-${range.id}"
            gradientUnits="userSpaceOnUse"
            x1=${range.gradient.x1}
            y1=${range.gradient.y1}
            x2=${range.gradient.x2}
            y2=${range.gradient.y2}
          >
            <stop offset="0%" stop-color=${range.gradient.startColor}></stop>
            <stop offset="100%" stop-color=${range.gradient.endColor}></stop>
          </linearGradient>
        `)}
      </defs>
      <g class="${className}__bands">
        ${renderNormalizedPathBands(pathDefinition, visibleRanges, layer, `${layerId}-bands`, `${className}__band`)}
      </g>
    </g>
  `;
}

export default renderAdaptivePathGradient;
