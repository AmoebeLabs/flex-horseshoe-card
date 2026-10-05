import { svg } from 'lit';

import Colors from './colors.js';
import { renderNormalizedPathBands } from './path-mask-renderer.js';

/**
 * Colors a Horseshoe Path with short SVG linear gradients that follow its
 * curves. Full gradients keep colors at fixed 0..100 positions as progress
 * moves; current gradients spread all configured colors over the visible range.
 *
 * @param {PathGeometry} pathGeometry - Bound browser-measured path geometry.
 * @param {object} config - Gradient colors, visible range, caps and curve subdivision limits.
 * @param {object} colorContext - This card's theme and inherited CSS used to interpolate colors.
 * @returns {object} Colored gradient sections and the visible progress range.
 */
export function buildAdaptivePathGradient(pathGeometry, config, colorContext) {
  const geometry = pathGeometry.getGradientGeometry(config);
  const { domainStart, domainEnd } = geometry;
  const colorStops = { colors: config.colorStops.map((stop) => ({ value: stop.progress, color: stop.color })) };
  const positionedColorStops = config.colorStops.map((stop) => ({
    progress: domainStart + (stop.progress / 100) * (domainEnd - domainStart),
    color: stop.color,
  }));

  // Apply colors and band appearance to prepared coordinates. Shared scale,
  // background and state layers do not repeat the adaptive geometry calculation.
  const ranges = geometry.ranges.map((interval, index) => {
    const gradientStops = [
      { offset: 0, color: Colors.calculateStrokeColor(interval.gradientStartProgress, colorStops, true, colorContext) },
      ...positionedColorStops
        .filter((stop) => stop.progress > interval.start && stop.progress < interval.colorEnd)
        .map((stop) => ({
          offset: ((stop.progress - interval.start) / (interval.colorEnd - interval.start)) * 100,
          color: stop.color,
        })),
      { offset: 100, color: Colors.calculateStrokeColor(interval.gradientEndProgress, colorStops, true, colorContext) },
    ];

    return {
      id: `gradient-${index}`,
      start: interval.start,
      end: interval.end,
      length: interval.length,
      width: config.width,
      opacity: 1,
      startCap: index === 0 ? config.startCap : 'butt',
      endCap: index === geometry.ranges.length - 1 ? config.endCap : 'butt',
      dash: {
        array: [interval.length, 100],
        offset: interval.start === 0 ? 0 : -interval.start,
      },
      gradient: { ...interval.coordinates, stops: gradientStops },
    };
  });
  const revealLength = config.range.end - config.range.start;

  return {
    mode: config.mode,
    geometry,
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
 * Draws the visible gradient sections with their fill, border and end caps.
 * Limit each section to the visible 0..100 progress range. At a crossing, this
 * keeps another part of the Path hidden even when it occupies the same x/y point.
 *
 * @param {object} pathDefinition - Stable generated centerline definition.
 * @param {object} gradient - Result from buildAdaptivePathGradient().
 * @param {object} layer - Shared fill, border, and composite opacity configuration.
 * @param {string} layerId - Stable DOM namespace for gradient definitions.
 * @param {string} className - CSS class namespace for the rendered gradient.
 * @returns {TemplateResult} SVG gradients and their visible Path bands.
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
            ${range.gradient.stops.map((stop) => svg`
              <stop offset="${stop.offset}%" stop-color=${stop.color}></stop>
            `)}
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
