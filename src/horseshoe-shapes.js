import Colors from './colors.js';

const asArray = (value) => (Array.isArray(value) ? value : []);

class ArcPathBuilder {
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

    const outerStart = geometry.pointAt(startAngle, outerRadius);
    const outerEnd = geometry.pointAt(endAngle, outerRadius);
    const innerEnd = geometry.pointAt(endAngle, innerRadius);
    const innerStart = geometry.pointAt(startAngle, innerRadius);

    const largeArc = Math.abs(endAngle - startAngle) > 180 ? 1 : 0;
    const sweep = endAngle > startAngle ? 1 : 0;
    const reverseSweep = sweep ? 0 : 1;
    const capRadius = width / 2;

    const parts = [];

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

function buildColorStopScaleArcs(runtimeConfig, geometry) {
  const colorStops = asArray(runtimeConfig.colorStops?.colors);
  const gap = Number(runtimeConfig.colorStops?.gap ?? 0);
  const scaleArcs = [];

  if (colorStops.length < 2) {
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

  for (let i = 0; i < colorStops.length - 1; i += 1) {
    const stopA = colorStops[i];
    const stopB = colorStops[i + 1];

    const colorStopStartAngle = geometry.valueToAngle(stopA.value);
    const colorStopEndAngle = geometry.valueToAngle(stopB.value);
    const isFirst = i === 0;
    const isLast = i === colorStops.length - 2;

    const drawStartAngle = isFirst ? colorStopStartAngle : colorStopStartAngle + gap / 2;
    const drawEndAngle = isLast ? colorStopEndAngle : colorStopEndAngle - gap / 2;
    const visible = drawEndAngle > drawStartAngle;

    scaleArcs.push({
      key: `scale-colorstop-${i}`,
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

  const visibleScaleArcs = scaleArcs.filter((arc) => arc.visible !== false);

  if (visibleScaleArcs.length) {
    visibleScaleArcs[0].startCap = runtimeConfig.horseshoe_scale.linecap.start;
    visibleScaleArcs[visibleScaleArcs.length - 1].endCap = runtimeConfig.horseshoe_scale.linecap.end;
  }

  return scaleArcs;
}

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

  const visibleStateArcs = stateArcs.filter((arc) => arc.visible !== false);

  if (visibleStateArcs.length) {
    visibleStateArcs[0].startCap = runtimeConfig.horseshoe_state.linecap.start;
    visibleStateArcs[visibleStateArcs.length - 1].endCap = runtimeConfig.horseshoe_state.linecap.end;
  }

  return stateArcs;
}

function buildColorAwareStateArcs(runtimeConfig, geometry, value, arcRange) {
  const strokeStyle = runtimeConfig.show?.horseshoe_style;

  const fromAngle = Number(arcRange.fromAngle ?? geometry.startAngle);
  const toAngle = Number(arcRange.toAngle ?? geometry.startAngle);

  if (strokeStyle === 'colorstopsegments') {
    return buildColorStopStateArcs(runtimeConfig, geometry, fromAngle, toAngle);
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

function buildNormalStateArcs(runtimeConfig, geometry, value) {
  return buildColorAwareStateArcs(
    runtimeConfig,
    geometry,
    value,
    {
      fromAngle: geometry.startAngle,
      toAngle: geometry.valueToAngle(value),
    },
  );
}

function buildBidirectionalStateArcs(runtimeConfig, geometry, value) {
  const valueAngle = geometry.valueToAngle(value);
  const zeroAngle = geometry.zeroAngle;

  return buildColorAwareStateArcs(
    runtimeConfig,
    geometry,
    value,
    {
      fromAngle: Math.min(zeroAngle, valueAngle),
      toAngle: Math.max(zeroAngle, valueAngle),
    },
  );
}

function buildMappedStateArcs(runtimeConfig, geometry, value) {
  const stateMap = runtimeConfig.state_map;
  const gap = runtimeConfig.horseshoe_state.segment_gap;
  const count = stateMap.length;

  if (!count) {
    return [];
  }

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

function buildStateArcs(runtimeConfig, geometry, value) {
  if (runtimeConfig.horseshoe_state.mode === 'segment') {
    return buildMappedStateArcs(runtimeConfig, geometry, value);
  }

  if (runtimeConfig.bar_mode === 'bidirectional') {
    return buildBidirectionalStateArcs(runtimeConfig, geometry, value);
  }

  return buildNormalStateArcs(runtimeConfig, geometry, value);
}

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

function buildTickValues(min, max, ticksize) {
  const values = [];

  for (let value = min; value <= max + 1e-9; value += ticksize) {
    values.push(Number(value.toFixed(10)));
  }

  return values;
}

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
    const tickLabels = Number.isFinite(ticksize) && ticksize > 0
      ? buildTickValues(min, max, ticksize).map((value) => ({
          value,
          text: String(value),
          role: 'tick-major',
        }))
      : [];

    labelStops = [...colorStopLabels, ...tickLabels];
  }

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

  if (visibleStops.length) {
    visibleStops[0].role = 'min';
    visibleStops[visibleStops.length - 1].role = 'max';
  }

  return visibleStops;
}

export function buildLabelItems(runtimeConfig, geometry, scale) {
  return buildLabelStopItems(runtimeConfig).map((labelStop) => buildLabelItem(runtimeConfig, geometry, scale, labelStop));
}

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

export function buildBandPath(geometry, arc, band) {
  return ArcPathBuilder.buildBandPath({
    geometry,
    arc,
    band,
  });
}
