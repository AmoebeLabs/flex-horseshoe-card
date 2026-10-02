/**
 * Returns effective geometry for a text tool, using its SVG measurement when available.
 *
 * @param {object} tool - Name, area, state, or standalone text tool.
 * @returns {{xpos: number, ypos: number, width: number, height: number}} Text geometry.
 */
export default function getTextToolGeometry(tool) {
  const { geometry } = tool;
  const { svg } = geometry;

  if (geometry.hasExactMeasurement) {
    return {
      xpos: geometry.measuredXpos,
      ypos: geometry.measuredYpos,
      width: geometry.measuredWidth,
      height: geometry.measuredHeight,
    };
  }

  return {
    xpos: svg.xpos,
    ypos: svg.ypos,
    width: geometry.estimatedWidth,
    height: geometry.estimatedHeight,
  };
}
