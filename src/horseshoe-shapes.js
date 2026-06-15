import Colors from './colors.js';

/**
 * Returns arrays unchanged so color stop and label builders can iterate predictably.
 *
 * @param {*} value - Value that may already be an array.
 * @returns {Array} The original array, or an empty array.
 */
const asArray = (value) => (Array.isArray(value) ? value : []);

/**
 * Builds closed SVG band paths for arcs with butt or round caps.
 */
class ArcPathBuilder {
  /**
   * Converts arc angles and band dimensions into a closed SVG path.
   *
   * @param {object} options - Path build options.
   * @param {GaugeGeometry} options.geometry - Geometry helper for point projection.
   * @param {object} options.arc - Arc angles, cap style, and visibility.
   * @param {object} options.band - Band radius and width.
   * @returns {string} SVG path data for the closed arc band.
   */
  static buildBandPath(options = {}) {
    const { geometry, arc = {}, band = {} } = options;

    if (!geometry || arc.visible === false) {
      return '';
    }

    const bandArc = {
      startAngle: 0,
      endAngle: 0,
      startCap: 'butt',
      endCap: 'butt',
      ...arc,
    };

    const arcBand = {
      radius: geometry.radius,
      width: 1,
      ...band,
    };

    const startAngle = Number(bandArc.startAngle);
    const endAngle = Number(bandArc.endAngle);
    const radius = Number(arcBand.radius);
    const width = Number(arcBand.width);

    if (!Number.isFinite(startAngle) || !Number.isFinite(endAngle) || !Number.isFinite(radius) || !Number.isFinite(width)) {
      return '';
    }

    if (endAngle === startAngle || width <= 0) {
      return '';
    }

    const innerRadius = radius - width / 2;
    const outerRadius = radius + width / 2;

    if (innerRadius <= 0 || outerRadius <= 0) {
      return '';
    }

    // Project both edges of the band so the path can close as a filled shape.
    const outerStart = geometry.pointAt(startAngle, outerRadius);
    const outerEnd = geometry.pointAt(endAngle, outerRadius);
    const innerEnd = geometry.pointAt(endAngle, innerRadius);
    const innerStart = geometry.pointAt(startAngle, innerRadius);

    const largeArc = Math.abs(endAngle - startAngle) > 180 ? 1 : 0;
    const sweep = endAngle > startAngle ? 1 : 0;
    const reverseSweep = sweep ? 0 : 1;
    const capRadius = width / 2;

    const parts = [];

    // Draw the outer arc, connect to the inner arc, then close back to the start.
    parts.push(`M ${outerStart.x} ${outerStart.y}`);
    parts.push(`A ${outerRadius} ${outerRadius} 0 ${largeArc} ${sweep} ${outerEnd.x} ${outerEnd.y}`);

    if (bandArc.endCap === 'round') {
      parts.push(`A ${capRadius} ${capRadius} 0 0 ${sweep} ${innerEnd.x} ${innerEnd.y}`);
    } else {
      parts.push(`L ${innerEnd.x} ${innerEnd.y}`);
    }

    parts.push(`A ${innerRadius} ${innerRadius} 0 ${largeArc} ${reverseSweep} ${innerStart.x} ${innerStart.y}`);

    if (bandArc.startCap === 'round') {
      parts.push(`A ${capRadius} ${capRadius} 0 0 ${sweep} ${outerStart.x} ${outerStart.y}`);
    } else {
      parts.push(`L ${outerStart.x} ${outerStart.y}`);
    }

    parts.push('Z');

    return parts.join(' ');
  }
}

/**
 * Builds scale arc segments from configured color stops and applies segment gaps.
 *
 * @param {object} runtimeConfig - Normalized horseshoe runtime configuration.
 * @param {GaugeGeometry} geometry - Geometry helper used to map values to angles.
 * @returns {Array<object>} Scale arc definitions for the renderer.
 */
function buildColorStopScaleArcs(runtimeConfig, geometry) {
  const colorStops = asArray(runtimeConfig.colorStops?.colors);
  const gap = Number(runtimeConfig.colorStops?.gap ?? 0);
  const scaleArcs = [];

  if (!colorStops.length) {
    return [
      {
        key: 'scale',
        startAngle: geometry.startAngle,
        endAngle: geometry.endAngle,
        startCap: runtimeConfig.horseshoe_scale.linecap.start,
        endCap: runtimeConfig.horseshoe_scale.linecap.end,
        color: runtimeConfig.horseshoe_scale.color,
      },
    ];
  }

  // Add synthetic min/max points so the first and last color spans cover the full scale.
  const scalePoints = [
    {
      value: Number(runtimeConfig.horseshoe_scale.min),
      color: colorStops[0].color,
    },
    ...colorStops.map((stop) => ({
      value: Number(stop.value),
      color: stop.color,
    })),
    {
      value: Number(runtimeConfig.horseshoe_scale.max),
      color: colorStops[colorStops.length - 1].color,
    },
  ];

  for (let i = 0; i < scalePoints.length - 1; i += 1) {
    const pointA = scalePoints[i];
    const pointB = scalePoints[i + 1];

    const colorStopStartAngle = geometry.valueToAngle(pointA.value);
    const colorStopEndAngle = geometry.valueToAngle(pointB.value);
    const isFirst = i === 0;
    const isLast = i === scalePoints.length - 2;

    // Keep the outer scale caps intact while applying half-gaps between internal segments.
    const drawStartAngle = isFirst ? colorStopStartAngle : colorStopStartAngle + gap / 2;
    const drawEndAngle = isLast ? colorStopEndAngle : colorStopEndAngle - gap / 2;
    const visible = drawEndAngle > drawStartAngle;

    scaleArcs.push({
      key: `scale-colorstop-${i}`,
      startAngle: visible ? drawStartAngle : 0,
      endAngle: visible ? drawEndAngle : 0,
      startCap: 'butt',
      endCap: 'butt',
      color: pointA.color,
      value: pointA.value,
      visible,
    });
  }

  // Restore the configured caps on the visible edge segments after internal gaps are applied.
  const visibleScaleArcs = scaleArcs.filter((arc) => arc.visible !== false);

  if (visibleScaleArcs.length) {
    visibleScaleArcs[0].startCap = runtimeConfig.horseshoe_scale.linecap.start;
    visibleScaleArcs[visibleScaleArcs.length - 1].endCap = runtimeConfig.horseshoe_scale.linecap.end;
  }

  return scaleArcs;
}

/**
 * Builds the visible scale arcs for the selected scale display mode.
 *
 * @param {object} runtimeConfig - Normalized horseshoe runtime configuration.
 * @param {GaugeGeometry} geometry - Geometry helper for scale angles.
 * @returns {Array<object>} Scale arc definitions.
 */
export function buildScaleArcs(runtimeConfig, geometry) {
  const scaleMode = runtimeConfig.show?.scale_style ?? 'fixed';

  if (scaleMode === 'none') {
    return [];
  }

  if (scaleMode === 'colorstop') {
    return buildColorStopScaleArcs(runtimeConfig, geometry);
  }

  return [
    {
      key: 'scale',
      startAngle: geometry.startAngle,
      endAngle: geometry.endAngle,
      startCap: runtimeConfig.horseshoe_scale.linecap.start,
      endCap: runtimeConfig.horseshoe_scale.linecap.end,
      color: runtimeConfig.horseshoe_scale.color,
    },
  ];
}

/**
 * Builds state arc segments clipped to the active value range and color stops.
 *
 * @param {object} runtimeConfig - Normalized horseshoe runtime configuration.
 * @param {GaugeGeometry} geometry - Geometry helper used to map color stop values.
 * @param {number} fromAngle - Start angle of the active state range.
 * @param {number} toAngle - End angle of the active state range.
 * @returns {Array<object>} State arc definitions for color stop segments.
 */
function buildColorStopStateArcs(runtimeConfig, geometry, fromAngle, toAngle) {
  const colorStops = asArray(runtimeConfig.colorStops?.colors);
  const gap = Number(runtimeConfig.colorStops?.gap ?? 0);
  const stateArcs = [];

  if (colorStops.length < 2) {
    return [
      {
        key: 'state-value',
        startAngle: fromAngle,
        endAngle: toAngle,
        startCap: runtimeConfig.horseshoe_state.linecap.start,
        endCap: runtimeConfig.horseshoe_state.linecap.end,
      },
    ];
  }

  for (let i = 0; i < colorStops.length - 1; i += 1) {
    const stopA = colorStops[i];
    const stopB = colorStops[i + 1];

    const colorStopStartAngle = geometry.valueToAngle(stopA.value);
    const colorStopEndAngle = geometry.valueToAngle(stopB.value);

    // Clip each color segment to the active state range before applying the configured gap.
    const drawStartAngle = Math.max(colorStopStartAngle, fromAngle) + gap / 2;
    const drawEndAngle = Math.min(colorStopEndAngle, toAngle) - gap / 2;
    const visible = drawEndAngle > drawStartAngle;

    stateArcs.push({
      key: `colorstop-${i}`,
      startAngle: visible ? drawStartAngle : 0,
      endAngle: visible ? drawEndAngle : 0,
      startCap: 'butt',
      endCap: 'butt',
      color: stopA.color,
      value: stopA.value,
      label: stopA.label,
      visible,
    });
  }

  // Restore the state linecaps only on the visible ends of the clipped state range.
  const visibleStateArcs = stateArcs.filter((arc) => arc.visible !== false);

  if (visibleStateArcs.length) {
    visibleStateArcs[0].startCap = runtimeConfig.horseshoe_state.linecap.start;
    visibleStateArcs[visibleStateArcs.length - 1].endCap = runtimeConfig.horseshoe_state.linecap.end;
  }

  return stateArcs;
}

/**
 * Selects the state arc color strategy and returns the arc definitions for it.
 *
 * @param {object} runtimeConfig - Normalized horseshoe runtime configuration.
 * @param {GaugeGeometry} geometry - Geometry helper for state angles.
 * @param {number} value - Current numeric state value.
 * @param {object} arcRange - Start and end angle limits for the state arc.
 * @returns {Array<object>} State arc definitions.
 */
function buildColorAwareStateArcs(runtimeConfig, geometry, value, arcRange) {
  const strokeStyle = runtimeConfig.show?.horseshoe_style;

  const fromAngle = Number(arcRange.fromAngle ?? geometry.startAngle);
  const toAngle = Number(arcRange.toAngle ?? geometry.startAngle);

  if (strokeStyle === 'colorstopsegments') {
    return buildColorStopStateArcs(runtimeConfig, geometry, fromAngle, toAngle);
  }

  if (strokeStyle === 'autominmax') {
    return [
      {
        key: 'state-value',
        startAngle: fromAngle,
        endAngle: toAngle,
        startCap: runtimeConfig.horseshoe_state.linecap.start,
        endCap: runtimeConfig.horseshoe_state.linecap.end,
        color: Colors.calculateStrokeColor(value, runtimeConfig.colorStopsMinMax, true),
      },
    ];
  }

  if (strokeStyle === 'colorstop' || strokeStyle === 'colorstopgradient') {
    return [
      {
        key: 'state-value',
        startAngle: fromAngle,
        endAngle: toAngle,
        startCap: runtimeConfig.horseshoe_state.linecap.start,
        endCap: runtimeConfig.horseshoe_state.linecap.end,
        color: Colors.calculateStrokeColor(value, runtimeConfig.colorStops, strokeStyle === 'colorstopgradient'),
      },
    ];
  }

  return [
    {
      key: 'state-value',
      startAngle: fromAngle,
      endAngle: toAngle,
      startCap: runtimeConfig.horseshoe_state.linecap.start,
      endCap: runtimeConfig.horseshoe_state.linecap.end,
    },
  ];
}

/**
 * Builds the normal unidirectional state arc from the scale start to the value.
 *
 * @param {object} runtimeConfig - Normalized horseshoe runtime configuration.
 * @param {GaugeGeometry} geometry - Geometry helper for value-to-angle mapping.
 * @param {number} value - Current numeric state value.
 * @returns {Array<object>} State arc definitions.
 */
function buildNormalStateArcs(runtimeConfig, geometry, value) {
  return buildColorAwareStateArcs(runtimeConfig, geometry, value, {
    fromAngle: geometry.startAngle,
    toAngle: geometry.valueToAngle(value),
  });
}

/**
 * Builds the bidirectional state arc between zero and the current value.
 *
 * @param {object} runtimeConfig - Normalized horseshoe runtime configuration.
 * @param {GaugeGeometry} geometry - Geometry helper containing the zero angle.
 * @param {number} value - Current numeric state value.
 * @returns {Array<object>} State arc definitions.
 */
function buildBidirectionalStateArcs(runtimeConfig, geometry, value) {
  const valueAngle = geometry.valueToAngle(value);
  const zeroAngle = geometry.zeroAngle;

  return buildColorAwareStateArcs(runtimeConfig, geometry, value, {
    fromAngle: Math.min(zeroAngle, valueAngle),
    toAngle: Math.max(zeroAngle, valueAngle),
  });
}

/**
 * Builds one segment per mapped state and marks the active segment.
 *
 * @param {object} runtimeConfig - Normalized horseshoe runtime configuration.
 * @param {GaugeGeometry} geometry - Geometry helper that provides the arc size.
 * @param {number} value - Current mapped numeric state value.
 * @returns {Array<object>} Segment arc definitions.
 */
function buildMappedStateArcs(runtimeConfig, geometry, value) {
  const stateMap = runtimeConfig.state_map.map;
  const gap = runtimeConfig.horseshoe_state.segment_gap;
  const count = stateMap.length;

  if (!count) {
    return [];
  }

  // State-map mode divides the full arc into equal visual slots.
  const step = geometry.arcDegrees / count;

  return stateMap.map((item, index) => {
    const active = Number(item.value) === Number(value);

    return {
      key: `mapped-state-${index}`,
      startAngle: geometry.startAngle + index * step + gap / 2,
      endAngle: geometry.startAngle + (index + 1) * step - gap / 2,
      startCap: index === 0 ? runtimeConfig.horseshoe_state.linecap.start : 'butt',
      endCap: index === count - 1 ? runtimeConfig.horseshoe_state.linecap.end : 'butt',
      active,
      value: item.value,
      label: item.label ?? String(item.state),
    };
  });
}

/**
 * Chooses the state arc builder for segment, bidirectional, or normal mode.
 *
 * @param {object} runtimeConfig - Normalized horseshoe runtime configuration.
 * @param {GaugeGeometry} geometry - Geometry helper for arc calculations.
 * @param {number} value - Current numeric state value.
 * @returns {Array<object>} State arc definitions.
 */
function buildStateArcs(runtimeConfig, geometry, value) {
  if (runtimeConfig.horseshoe_state.mode === 'segment') {
    return buildMappedStateArcs(runtimeConfig, geometry, value);
  }

  if (runtimeConfig.bar_mode === 'bidirectional') {
    return buildBidirectionalStateArcs(runtimeConfig, geometry, value);
  }

  return buildNormalStateArcs(runtimeConfig, geometry, value);
}

/**
 * Converts state arc definitions into renderable SVG path items.
 *
 * @param {object} runtimeConfig - Normalized horseshoe runtime configuration.
 * @param {GaugeGeometry} geometry - Geometry helper used by the path builder.
 * @param {number} value - Current numeric state value.
 * @returns {Array<object>} Renderable state path items.
 */
export function buildStatePathItems(runtimeConfig, geometry, value) {
  const stateArcs = buildStateArcs(runtimeConfig, geometry, value);

  const stateBand = {
    radius: geometry.radius,
    width: runtimeConfig.horseshoe_state.width,
  };

  return stateArcs.map((arc, index) => ({
    key: arc.key ?? `state-arc-${index}`,
    arc,
    path: ArcPathBuilder.buildBandPath({
      geometry,
      arc,
      band: stateBand,
    }),
  }));
}

/**
 * Converts scale arc definitions into renderable SVG path items.
 *
 * @param {object} runtimeConfig - Normalized horseshoe runtime configuration.
 * @param {GaugeGeometry} geometry - Geometry helper used by the path builder.
 * @returns {Array<object>} Renderable scale path items.
 */
export function buildScalePathItems(runtimeConfig, geometry) {
  const scaleArcs = buildScaleArcs(runtimeConfig, geometry);

  const scaleBand = {
    radius: geometry.radius,
    width: runtimeConfig.horseshoe_scale.width,
  };

  return scaleArcs.map((arc, index) => ({
    key: arc.key ?? `scale-arc-${index}`,
    arc,
    path: ArcPathBuilder.buildBandPath({
      geometry,
      arc,
      band: scaleBand,
    }),
  }));
}

/**
 * Resolves one label stop to its value, angle, radius, and SVG coordinates.
 *
 * @param {object} runtimeConfig - Normalized horseshoe runtime configuration.
 * @param {GaugeGeometry} geometry - Geometry helper for angle and point projection.
 * @param {GaugeScale} scale - Scale mapper used to position the label value.
 * @param {object} labelConfig - Label stop metadata.
 * @returns {object} Positioned label item for the renderer.
 */
function buildLabelItem(runtimeConfig, geometry, scale, labelConfig = {}) {
  const value = Number(labelConfig.value);
  const ratio = scale.toRatio(value);
  const angle = geometry.ratioToAngle(ratio);
  const radius = geometry.radius + Number(runtimeConfig.horseshoe_labels.offset ?? runtimeConfig.horseshoe_state.width + 2);
  const point = geometry.pointAt(angle, radius);

  return {
    ...labelConfig,
    value,
    text: labelConfig.text ?? String(value),
    role: labelConfig.role ?? 'label',
    angle,
    radius,
    x: point.x,
    y: point.y,
  };
}

/**
 * Builds numeric tick values from min to max using the configured tick size.
 *
 * @param {number} min - First scale value.
 * @param {number} max - Last scale value.
 * @param {number} ticksize - Distance between generated tick values.
 * @returns {Array<number>} Numeric tick values.
 */
function buildTickValues(min, max, ticksize) {
  const values = [];

  for (let value = min; value <= max + 1e-9; value += ticksize) {
    values.push(Number(value.toFixed(10)));
  }

  return values;
}

/**
 * Builds and filters label stops for min/max, color stops, major ticks, or both.
 *
 * @param {object} runtimeConfig - Normalized horseshoe runtime configuration.
 * @returns {Array<object>} Label stop definitions before positioning.
 */
function buildLabelStopItems(runtimeConfig) {
  const labelsAt = runtimeConfig.show.labels_at ?? 'none';
  const min = Number(runtimeConfig.horseshoe_scale.min);
  const max = Number(runtimeConfig.horseshoe_scale.max);
  const colorStops = asArray(runtimeConfig.colorStops?.colors);
  let labelStops = [];

  if (labelsAt === 'minmax') {
    labelStops = [
      { value: min, text: String(min), role: 'min' },
      { value: max, text: String(max), role: 'max' },
    ];
  }

  if (labelsAt === 'colorstop' || labelsAt === 'colorstops') {
    labelStops = [
      { value: min, text: String(min), role: 'min' },
      ...colorStops.map((stop) => ({
        value: stop.value,
        text: stop.label ?? String(stop.value),
        role: 'colorstop',
        color: stop.color,
      })),
      { value: max, text: String(max), role: 'max' },
    ];
  }

  if (labelsAt === 'ticks_major') {
    const ticksize = Number(runtimeConfig.horseshoe_tickmarks?.ticks_major?.ticksize);

    if (Number.isFinite(ticksize) && ticksize > 0) {
      labelStops = buildTickValues(min, max, ticksize).map((value, index, values) => ({
        value,
        text: String(value),
        role: index === 0 ? 'min' : index === values.length - 1 ? 'max' : 'tick-major',
      }));
    }
  }

  if (labelsAt === 'both') {
    const colorStopLabels = colorStops.length
      ? [
          { value: min, text: String(min), role: 'min' },
          ...colorStops.map((stop) => ({
            value: stop.value,
            text: stop.label ?? String(stop.value),
            role: 'colorstop',
            color: stop.color,
          })),
          { value: max, text: String(max), role: 'max' },
        ]
      : [];

    const ticksize = Number(runtimeConfig.horseshoe_tickmarks?.ticks_major?.ticksize);
    const tickLabels =
      Number.isFinite(ticksize) && ticksize > 0
        ? buildTickValues(min, max, ticksize).map((value) => ({
            value,
            text: String(value),
            role: 'tick-major',
          }))
        : [];

    labelStops = [...colorStopLabels, ...tickLabels];
  }

  // Normalize label stops into sorted, in-range, unique values before applying spacing.
  const validStops = labelStops
    .filter((stop) => {
      const value = Number(stop.value);
      return Number.isFinite(value) && value >= min && value <= max;
    })
    .sort((a, b) => Number(a.value) - Number(b.value))
    .filter((stop, index, array) => {
      const value = Number(stop.value);
      return array.findIndex((item) => Number(item.value) === value) === index;
    });

  const distanceMin = Number(runtimeConfig.horseshoe_labels.distance_min ?? 0);
  const visibleStops = [];

  // distance_min suppresses labels that would be too close in value-space.
  validStops.forEach((stop) => {
    const value = Number(stop.value);

    if (distanceMin <= 0) {
      visibleStops.push(stop);
      return;
    }

    const previous = visibleStops[visibleStops.length - 1];

    if (!previous || Math.abs(value - Number(previous.value)) >= distanceMin) {
      visibleStops.push(stop);
    }
  });

  // The first and last visible labels behave as scale boundary labels after filtering.
  if (visibleStops.length) {
    visibleStops[0].role = 'min';
    visibleStops[visibleStops.length - 1].role = 'max';
  }

  return visibleStops;
}

/**
 * Builds positioned label items from the configured label stop source.
 *
 * @param {object} runtimeConfig - Normalized horseshoe runtime configuration.
 * @param {GaugeGeometry} geometry - Geometry helper for label positions.
 * @param {GaugeScale} scale - Scale mapper used to position labels.
 * @returns {Array<object>} Positioned label items.
 */
export function buildLabelItems(runtimeConfig, geometry, scale) {
  return buildLabelStopItems(runtimeConfig).map((labelStop) => buildLabelItem(runtimeConfig, geometry, scale, labelStop));
}

/**
 * Builds fixed or color-stop label background arc items.
 *
 * @param {object} runtimeConfig - Normalized horseshoe runtime configuration.
 * @param {GaugeGeometry} geometry - Geometry helper for background arcs.
 * @returns {Array<object>} Label background arc items.
 */
export function buildLabelBackgroundItems(runtimeConfig, geometry) {
  const backgroundMode = runtimeConfig.show.label_background ?? 'none';

  if (backgroundMode === 'none') {
    return [];
  }

  const backgroundConfig = runtimeConfig.horseshoe_labels.background ?? {};
  const radius = geometry.radius + Number(runtimeConfig.horseshoe_labels.offset ?? runtimeConfig.horseshoe_state.width + 2);
  const width = Number(backgroundConfig.width ?? 6);
  const gap = Number(backgroundConfig.gap ?? 0);

  if (backgroundMode === 'colorstop') {
    const colorStops = asArray(runtimeConfig.colorStops?.colors);

    if (colorStops.length < 1) {
      return [];
    }

    const colorSegments = [];
    // Add synthetic min/max points so label backgrounds cover the full configured scale.
    const segmentPoints = [
      {
        value: runtimeConfig.horseshoe_scale.min,
        color: colorStops[0].color,
      },
      ...colorStops.map((stop) => ({
        value: Number(stop.value),
        color: stop.color,
      })),
      {
        value: runtimeConfig.horseshoe_scale.max,
        color: colorStops[colorStops.length - 1].color,
      },
    ];

    for (let i = 0; i < segmentPoints.length - 1; i += 1) {
      const pointA = segmentPoints[i];
      const pointB = segmentPoints[i + 1];
      const startAngle = geometry.valueToAngle(pointA.value);
      const endAngle = geometry.valueToAngle(pointB.value);
      const isFirst = i === 0;
      const isLast = i === segmentPoints.length - 2;
      // Preserve the outside caps while applying gaps only between internal background segments.
      const drawStartAngle = isFirst ? startAngle : startAngle + gap / 2;
      const drawEndAngle = isLast ? endAngle : endAngle - gap / 2;

      if (drawEndAngle > drawStartAngle) {
        colorSegments.push({
          key: `label-background-colorstop-${i}`,
          startAngle: drawStartAngle,
          endAngle: drawEndAngle,
          radius,
          width,
          color: pointA.color,
          lineCap: 'butt',
        });
      }
    }

    return colorSegments;
  }

  if (backgroundMode === 'fixed') {
    return [
      {
        key: 'label-background-fixed',
        startAngle: geometry.startAngle,
        endAngle: geometry.endAngle,
        radius,
        width,
        color: backgroundConfig.color,
        lineCap: 'round',
      },
    ];
  }

  return [];
}

/**
 * Public wrapper for building a closed SVG band path.
 *
 * @param {GaugeGeometry} geometry - Geometry helper used by the path builder.
 * @param {object} arc - Arc angles, cap style, and visibility.
 * @param {object} band - Band radius and width.
 * @returns {string} SVG path data for the closed arc band.
 */
export function buildBandPath(geometry, arc, band) {
  return ArcPathBuilder.buildBandPath({
    geometry,
    arc,
    band,
  });
}
