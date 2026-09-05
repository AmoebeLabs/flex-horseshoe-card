import { nothing, svg } from 'lit';

/**
 * Renders one normalized range as a butt-ended centerline plus independently
 * selected round caps. Group opacity is applied after the overlapping base and
 * cap strokes have been composed, so a transparent cap never becomes darker.
 *
 * @param {object} pathDefinition - Stable generated centerline definition.
 * @param {object} range - Normalized range, dash placement, and endpoint caps.
 * @param {object} paint - Complete stroke color and width.
 * @param {string} className - CSS class namespace for the rendered stroke.
 * @returns {TemplateResult} One composed normalized path stroke.
 */
export function renderNormalizedPathStroke(pathDefinition, range, paint, className) {
  const capDashLength = 0.001;
  const caps = [
    { location: 'start', type: range.startCap, progress: range.start },
    { location: 'end', type: range.endCap, progress: range.end },
  ];

  return svg`
    <g class=${className}>
      <path
        class="${className}__body"
        d=${pathDefinition.d}
        pathLength="100"
        fill="none"
        stroke=${paint.color}
        stroke-width=${paint.width}
        stroke-linecap="butt"
        stroke-dasharray=${range.dash.array.join(' ')}
        stroke-dashoffset=${range.dash.offset}
      ></path>
      ${caps.map((cap) => cap.type === 'round' ? svg`
        <path
          class="${className}__cap ${className}__cap--${cap.location}"
          d=${pathDefinition.d}
          pathLength="100"
          fill="none"
          stroke=${paint.color}
          stroke-width=${paint.width}
          stroke-linecap="round"
          stroke-dasharray="${capDashLength} 200"
          stroke-dashoffset=${-(cap.progress - capDashLength / 2)}
        ></path>
      ` : nothing)}
    </g>
  `;
}

/**
 * Renders a path band with independent fill and border styling. The border is
 * drawn wider than the fill and its center is removed with a luminance mask;
 * a transparent fill therefore reveals the real underlying card instead of
 * the border stroke.
 *
 * @param {object} pathDefinition - Stable generated centerline definition.
 * @param {Array<object>} ranges - Complete normalized ranges for one visual layer.
 * @param {object} layer - Shared fill, border, and composite opacity configuration.
 * @param {string} layerId - Stable DOM namespace for masks and rendered paths.
 * @param {string} className - CSS class namespace for the rendered bands.
 * @returns {TemplateResult} Independently composited border and fill collections.
 */
export function renderNormalizedPathBands(pathDefinition, ranges, layer, layerId, className) {
  return svg`
    <g class=${className} opacity=${layer.opacity}>
      ${layer.border.width > 0 ? svg`
        <defs>
          ${ranges.map((range) => {
            const borderWidth = range.width + layer.border.width * 2;
            const outerMaskPaint = { color: 'white', width: borderWidth };
            const innerMaskPaint = { color: 'black', width: range.width };

            return svg`
              <mask
                id="${layerId}-${range.id}-border-mask"
                class="${className}__border-mask"
                maskUnits="userSpaceOnUse"
                maskContentUnits="userSpaceOnUse"
                x="-100%"
                y="-100%"
                width="300%"
                height="300%"
                style="mask-type:luminance"
              >
                ${renderNormalizedPathStroke(pathDefinition, range, outerMaskPaint, `${className}__mask-outer`)}
                ${renderNormalizedPathStroke(pathDefinition, range, innerMaskPaint, `${className}__mask-inner`)}
              </mask>
            `;
          })}
        </defs>
        <g class="${className}__borders" opacity=${layer.strokeOpacity}>
          ${ranges.map((range) => {
            const borderPaint = {
              color: layer.border.color,
              width: range.width + layer.border.width * 2,
            };

            return svg`
              <g
                class="${className}__border"
                data-path-range=${range.id}
                opacity=${range.opacity}
                mask="url(#${layerId}-${range.id}-border-mask)"
              >
                ${renderNormalizedPathStroke(pathDefinition, range, borderPaint, `${className}__border-stroke`)}
              </g>
            `;
          })}
        </g>
      ` : nothing}
      <g class="${className}__fills" opacity=${layer.fillOpacity}>
        ${ranges.map((range) => {
          const fillPaint = { color: range.color, width: range.width };

          return svg`
            <g
              class="${className}__fill"
              data-path-range=${range.id}
              opacity=${range.opacity}
            >
              ${renderNormalizedPathStroke(pathDefinition, range, fillPaint, `${className}__fill-stroke`)}
            </g>
          `;
        })}
      </g>
    </g>
  `;
}

export default renderNormalizedPathBands;
