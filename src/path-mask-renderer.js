import { nothing, svg } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';

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
  // Safari flattens a round dash cap that ends exactly at the end of a curved
  // or multi-command path. Keep the cap stroke just inside the path; its native
  // round linecap still extends to the same visible endpoint over the body.
  // Use 0.001 normalized path unit, or half of a shorter range, so the inset
  // remains invisible and can never move beyond the range start.
  const endCapInset = Math.min(0.001, range.length / 2);
  // One normalized path unit gives Safari a real stroke segment to cap. For a
  // shorter range, stop before the inset so the complete dash stays in range.
  const capDashLength = Math.min(1, range.length - endCapInset);
  const caps = [
    { location: 'start', type: range.startCap, progress: range.start, dashOffset: -range.start },
    // End the cap dash at range.end - endCapInset instead of the Safari-problematic exact endpoint.
    { location: 'end', type: range.endCap, progress: range.end, dashOffset: -(range.end - endCapInset - capDashLength) },
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
        style=${styleMap({ transition: paint.transition })}
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
          stroke-dashoffset=${cap.dashOffset}
          style=${styleMap({ transition: paint.transition })}
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
              transition: range.transition,
            };

            return svg`
              <g
                class="${className}__border"
                data-path-range=${range.id}
                opacity=${range.opacity}
                mask="url(#${layerId}-${range.id}-border-mask)"
                style=${styleMap({ transition: range.transition })}
              >
                ${renderNormalizedPathStroke(pathDefinition, range, borderPaint, `${className}__border-stroke`)}
              </g>
            `;
          })}
        </g>
      ` : nothing}
      <g class="${className}__fills" opacity=${layer.fillOpacity}>
        ${ranges.map((range) => {
          const fillPaint = { color: range.color, width: range.width, transition: range.transition };

          return svg`
            <g
              class="${className}__fill"
              data-path-range=${range.id}
              opacity=${range.opacity}
              style=${styleMap({ transition: range.transition })}
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
