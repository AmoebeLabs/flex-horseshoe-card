import { svg } from 'lit';

/**
 * Renders one path centerline as a background track and normalized painted
 * ranges. Every visible layer reuses the same complete path definition;
 * pathLength="100" makes range placement independent from actual path length.
 *
 * @param {object} pathDefinition - Stable generated centerline definition.
 * @param {object} background - Normalized background stroke configuration.
 * @param {Array<object>} paintedRanges - Normalized ranges from buildPaintedRanges().
 * @param {string} pathId - Stable DOM namespace for this rendered path.
 * @returns {TemplateResult} Generic SVG path layers.
 */
export function renderPathStrokeLayers(pathDefinition, background, paintedRanges, pathId) {
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

      <path
        id="${pathId}-background"
        class="path-stroke-renderer__background"
        d=${pathDefinition.d}
        pathLength="100"
        fill="none"
        stroke=${background.color}
        stroke-width=${background.width}
        stroke-opacity=${background.opacity}
        stroke-linecap=${background.linecap}
        pointer-events="none"
      ></path>

      <g class="path-stroke-renderer__ranges" pointer-events="none">
        ${paintedRanges.map((range) => {
          // Mixed endpoint caps require the mask layer added in #577. Until
          // then, a mixed range stays geometrically exact with butt endpoints.
          const linecap = range.startCap === range.endCap ? range.startCap : 'butt';

          return svg`
            <path
              id="${pathId}-range-${range.id}"
              class="path-stroke-renderer__range"
              data-path-range=${range.id}
              d=${pathDefinition.d}
              pathLength="100"
              fill="none"
              stroke=${range.color}
              stroke-width=${range.width}
              stroke-opacity=${range.opacity}
              stroke-linecap=${linecap}
              stroke-dasharray=${range.dash.array.join(' ')}
              stroke-dashoffset=${range.dash.offset}
            ></path>
          `;
        })}
      </g>
    </g>
  `;
}

export default renderPathStrokeLayers;
