import { svg } from 'lit';

import { renderNormalizedPathBands } from './path-mask-renderer.js';

/**
 * Renders one path centerline as a background track and normalized painted
 * ranges. Every visible layer reuses the same complete path definition;
 * pathLength="100" makes range placement independent from actual path length.
 *
 * @param {object} pathDefinition - Stable generated centerline definition.
 * @param {object} background - Normalized background stroke configuration.
 * @param {object} foreground - Shared foreground opacity and border configuration.
 * @param {Array<object>} paintedRanges - Normalized ranges from buildPaintedRanges().
 * @param {string} pathId - Stable DOM namespace for this rendered path.
 * @returns {TemplateResult} Generic SVG path layers.
 */
export function renderPathStrokeLayers(pathDefinition, background, foreground, paintedRanges, pathId) {
  const backgroundRange = {
    id: 'background',
    start: 0,
    end: 100,
    color: background.color,
    width: background.width,
    opacity: 1,
    startCap: background.startCap,
    endCap: background.endCap,
    dash: { array: [100, 100], offset: 0 },
  };

  return svg`
    <g class="path-stroke-renderer" data-path-signature=${pathDefinition.signature}>
      <path
        id="${pathId}-master"
        class="path-stroke-renderer__master"
        data-path-master=${pathId}
        d=${pathDefinition.d}
        pathLength="100"
        fill="none"
        stroke="transparent"
        stroke-width="0"
        visibility="hidden"
        pointer-events="none"
      ></path>

      <g id="${pathId}-background" class="path-stroke-renderer__background" pointer-events="none">
        ${renderNormalizedPathBands(
          pathDefinition,
          [backgroundRange],
          background,
          `${pathId}-background`,
          'path-stroke-renderer__background-band',
        )}
      </g>

      <g class="path-stroke-renderer__ranges" pointer-events="none">
        ${renderNormalizedPathBands(
          pathDefinition,
          paintedRanges,
          foreground,
          `${pathId}-ranges`,
          'path-stroke-renderer__range-band',
        )}
      </g>
    </g>
  `;
}

export default renderPathStrokeLayers;
