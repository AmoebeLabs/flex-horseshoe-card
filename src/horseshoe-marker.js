import { svg } from "lit";
import { styleMap } from "lit/directives/style-map.js";

import { getIconSource, HomeAssistantIconPath } from "./icon-source.js";
import { buildPathElements } from "./path-elements.js";

/**
 * Renders the current horseshoe state as one marker on measured path geometry.
 * The gauge supplies final coordinates and already calculated state appearance;
 * this renderer never interprets entity values or individual path shapes.
 */
export default class HorseshoeStateMarker {
  /** Creates one reusable Home Assistant icon source for this horseshoe item. */
  constructor(card, markerId, pathLoaded) {
    this.card = card;
    this.markerId = markerId;
    this.haIconPath = new HomeAssistantIconPath(card, `${markerId}-source`, pathLoaded);
  }

  /**
   * Places and renders the configured marker at normalized state progress.
   * Path geometry supplies the same tangent and normal used by static markers.
   *
   * @param {TransformedPathGeometry} pathGeometry - Bound path in final card coordinates.
   * @param {object} pathConfig - Normalized path geometry including the arc center.
   * @param {object} markerConfig - Normalized path marker configuration.
   * @param {number} progress - Current animated position in 0..100 path space.
   * @param {object} stateStyles - Calculated horseshoe state appearance.
   * @returns {TemplateResult} Marker SVG or its hidden source loader.
   */
  render(pathGeometry, pathConfig, markerConfig, progress, stateStyles) {
    let marker;
    let iconSize;
    let rotation;

    if (markerConfig.attach_to === "path") {
      marker = buildPathElements(pathGeometry, {
        ticks: [],
        labels: [],
        markers: [
          {
            id: this.markerId,
            progress,
            side: "left",
            offset: Number(markerConfig.offset),
            direction: "forward",
            shape: markerConfig.shape,
            radius: Number(markerConfig.size) / 2,
            length: Number(markerConfig.size),
            width: Number(markerConfig.size),
            styles: stateStyles,
          },
        ],
      }).markers[0];
      iconSize = Number(markerConfig.size);
      rotation = marker.rotation + Number(markerConfig.rotate);
    } else {
      const center = pathGeometry.pointInCardCoordinates({ x: pathConfig.cx, y: pathConfig.cy });
      const statePoint = pathGeometry.pointAtProgress(progress);
      const deltaX = statePoint.x - center.x;
      const deltaY = statePoint.y - center.y;
      const centerToStateLength = Math.hypot(deltaX, deltaY);
      const directionX = deltaX / centerToStateLength;
      const directionY = deltaY / centerToStateLength;
      const markerStartX = center.x + directionX * Number(markerConfig.start_offset);
      const markerStartY = center.y + directionY * Number(markerConfig.start_offset);
      const markerEndX = statePoint.x - directionX * Number(markerConfig.end_offset);
      const markerEndY = statePoint.y - directionY * Number(markerConfig.end_offset);

      // The source keeps its aspect ratio while its forward axis spans the
      // configured center-to-state interval.
      iconSize = Math.hypot(markerEndX - markerStartX, markerEndY - markerStartY);
      marker = {
        x: (markerStartX + markerEndX) / 2,
        y: (markerStartY + markerEndY) / 2,
      };
      rotation = Math.atan2(directionY, directionX) * 180 / Math.PI + Number(markerConfig.rotate);
    }

    if (markerConfig.shape === "circle") {
      return svg`
        <circle
          class="horseshoe__state-marker horseshoe__state-marker--circle"
          cx=${marker.x}
          cy=${marker.y}
          r=${marker.radius}
          style=${styleMap(stateStyles)}
          pointer-events="none"
        ></circle>
      `;
    }

    if (markerConfig.shape === "triangle") {
      return svg`
        <polygon
          class="horseshoe__state-marker horseshoe__state-marker--triangle"
          points=${marker.points.map((point) => `${point.x},${point.y}`).join(" ")}
          transform="rotate(${Number(markerConfig.rotate)} ${marker.x} ${marker.y})"
          style=${styleMap(stateStyles)}
          pointer-events="none"
        ></polygon>
      `;
    }

    const iconSource = getIconSource(markerConfig.icon);

    if (iconSource.type === "image-url") {
      return svg`
        <image
          class="horseshoe__state-marker horseshoe__state-marker--image"
          href=${iconSource.value}
          x=${marker.x - iconSize / 2}
          y=${marker.y - iconSize / 2}
          width=${iconSize}
          height=${iconSize}
          preserveAspectRatio="xMidYMid meet"
          transform="rotate(${rotation} ${marker.x} ${marker.y})"
          style=${styleMap(stateStyles)}
          pointer-events="none"
        ></image>
      `;
    }

    if (iconSource.type === "svg-url") {
      if (!this.card.svgUrlCache[iconSource.value]) {
        return svg`
          <svg
            class="icon-svg-url hidden"
            data-src=${iconSource.value}
            viewBox="0 0 24 24"
            width="0"
            height="0"
          >
            <image href=${iconSource.value} width="24" height="24"></image>
          </svg>
        `;
      }

      const svgNode = this.card.svgUrlCache[iconSource.value].cloneNode(true);
      svgNode.classList.remove("hidden");

      return svg`
        <g
          class="horseshoe__state-marker horseshoe__state-marker--svg"
          transform="translate(${marker.x} ${marker.y}) rotate(${rotation}) scale(${iconSize / 24}) translate(-12 -12)"
          style=${styleMap(stateStyles)}
          pointer-events="none"
        >${svgNode}</g>
      `;
    }

    const iconPath = this.haIconPath.getPath(iconSource.value);

    if (!iconPath) {
      return svg`
        <foreignObject
          width="0"
          height="0"
          x=${marker.x}
          y=${marker.y}
          overflow="hidden"
          style="opacity:0;pointer-events:none"
        >
          <body>
            <div xmlns="http://www.w3.org/1999/xhtml" style="color:transparent;fill:transparent">
              <ha-icon .icon=${iconSource.value} id=${this.haIconPath.elementId}></ha-icon>
            </div>
          </body>
        </foreignObject>
      `;
    }

    return svg`
      <g
        class="horseshoe__state-marker horseshoe__state-marker--ha-icon"
        transform="translate(${marker.x} ${marker.y}) rotate(${rotation}) scale(${iconSize / 24}) translate(-12 -12)"
        style=${styleMap(stateStyles)}
        pointer-events="none"
      >
        <path d=${iconPath}></path>
      </g>
    `;
  }
}
