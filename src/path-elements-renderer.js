import { nothing, svg } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';

/**
 * Renders final tickmark, label, badge, and marker coordinates without deriving geometry.
 * Badge layers precede labels, while markers remain independently styleable
 * above the static scale annotations.
 *
 * @param {object} elements - Positioned tickmarks, labels, badges, and markers.
 * @param {string} pathItemId - Stable DOM namespace for label guide paths.
 * @returns {TemplateResult} Tick, badge, label, and marker SVG layers.
 */
export function renderPathElements(elements, pathItemId) {
  return svg`
    <g class="path-tick-label-badge-marker" pointer-events="none">
      <g class="path-tickmarks">
        ${elements.ticks.map((tick) => tick.shape === 'circle' ? svg`
          <circle
            class="path-tickmark path-tickmark--${tick.layer}"
            data-path-item-id=${tick.id}
            cx=${tick.x1}
            cy=${tick.y1}
            r=${tick.radius}
            style=${styleMap(tick.styles)}
          ></circle>
        ` : svg`
          <line
            class="path-tickmark path-tickmark--${tick.layer}"
            data-path-item-id=${tick.id}
            x1=${tick.x1}
            y1=${tick.y1}
            x2=${tick.x2}
            y2=${tick.y2}
            style=${styleMap(tick.styles)}
          ></line>
        `)}
      </g>

      <g class="path-label-badges">
        ${elements.labels.map((label) => !label.badge.visible ? nothing : label.badge.shape === 'circle' ? svg`
          <circle
            class="path-label-badge"
            data-path-item-id=${label.id}
            cx=${label.badge.x}
            cy=${label.badge.y}
            r=${label.badge.radius}
            style=${styleMap(label.badge.styles)}
          ></circle>
        ` : svg`
          <rect
            class="path-label-badge"
            data-path-item-id=${label.id}
            x=${label.badge.x - label.badge.width / 2}
            y=${label.badge.y - label.badge.height / 2}
            width=${label.badge.width}
            height=${label.badge.height}
            rx=${label.badge.radius}
            ry=${label.badge.radius}
            transform="rotate(${label.badge.rotation} ${label.badge.x} ${label.badge.y})"
            style=${styleMap(label.badge.styles)}
          ></rect>
        `)}
      </g>

      <g class="path-labels">
        ${elements.labels.map((label, index) => label.orientation === 'path' ? svg`
          <path
            id="${pathItemId}-label-guide-${index}"
            class="path-label-guide"
            d=${label.guidePath}
            fill="none"
            stroke="none"
          ></path>
          <text class="path-label" data-path-item-id=${label.id} style=${styleMap(label.styles)}>
            <textPath
              href="#${pathItemId}-label-guide-${index}"
              startOffset="${label.guideStartOffset}%"
              text-anchor="middle"
            >${label.text}</textPath>
          </text>
        ` : svg`
          <text
            class="path-label"
            data-path-item-id=${label.id}
            x=${label.x}
            y=${label.y}
            text-anchor="middle"
            dominant-baseline="central"
            style=${styleMap(label.styles)}
          >${label.text}</text>
        `)}
      </g>

      <g class="path-markers">
        ${elements.markers.map((marker) => marker.shape === 'circle' ? svg`
          <circle
            class="path-marker"
            data-path-item-id=${marker.id}
            cx=${marker.x}
            cy=${marker.y}
            r=${marker.radius}
            style=${styleMap(marker.styles)}
          ></circle>
        ` : svg`
          <polygon
            class="path-marker"
            data-path-item-id=${marker.id}
            points=${marker.points.map((point) => `${point.x},${point.y}`).join(' ')}
            data-rotation=${marker.rotation}
            style=${styleMap(marker.styles)}
          ></polygon>
        `)}
      </g>
    </g>
  `;
}

export default renderPathElements;
