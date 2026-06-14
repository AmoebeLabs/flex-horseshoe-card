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

    const drawStartAngle = colorStopStartAngle + gap / 2;
    const drawEndAngle = colorStopEndAngle - gap / 2;
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

export function buildLabelItems(runtimeConfig, geometry, scale) {
  if (runtimeConfig.show.labels_at === 'minmax') {
    return [
      buildLabelItem(runtimeConfig, geometry, scale, {
        value: runtimeConfig.horseshoe_scale.min,
        text: String(runtimeConfig.horseshoe_scale.min),
        role: 'min',
      }),
      buildLabelItem(runtimeConfig, geometry, scale, {
        value: runtimeConfig.horseshoe_scale.max,
        text: String(runtimeConfig.horseshoe_scale.max),
        role: 'max',
      }),
    ];
  }

  if (runtimeConfig.show.labels_at === 'colorstops') {
    return asArray(runtimeConfig.colorStops?.colors).map((stop) => (
      buildLabelItem(runtimeConfig, geometry, scale, {
        value: stop.value,
        text: stop.label ?? String(stop.value),
        role: 'colorstop',
        color: stop.color,
      })
    ));
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
