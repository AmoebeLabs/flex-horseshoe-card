/**
 * Returns the SVG center and size used by a Name, Area, State or Text item.
 * After the browser measures its rendered text, use that measured center and
 * size. Before then, use the configured SVG position and estimated text size.
 *
 * @param {object} tool - NameTool, AreaTool, StateTool or TextTool.
 * @returns {{xpos: number, ypos: number, width: number, height: number}} Text center and size in SVG units.
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
