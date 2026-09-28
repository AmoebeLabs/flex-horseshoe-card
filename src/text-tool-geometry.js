/**
 * Returns effective geometry for a text tool, using its SVG measurement when available.
 *
 * @param {object} tool - Name, area, state, or standalone text tool.
 * @returns {{xpos: number, ypos: number, width: number, height: number}} Text geometry.
 */
export default function getTextToolGeometry(tool) {
  if (tool.hasExactMeasurement) {
    return {
      xpos: tool.measuredXpos,
      ypos: tool.measuredYpos,
      width: tool.measuredWidth,
      height: tool.measuredHeight,
    };
  }

  return {
    xpos: tool.config.svg.xpos,
    ypos: tool.config.svg.ypos,
    width: tool.estimatedWidth,
    height: tool.estimatedHeight,
  };
}
