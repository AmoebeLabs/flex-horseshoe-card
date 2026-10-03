import { buildTickValues } from './horseshoe-tickmarks.js';

/** Returns the label style relation of one mapped state. */
function getMappedStateRelation(index, currentIndex) {
  if (currentIndex < 0) return 'after';
  if (index < currentIndex) return 'before';
  if (index > currentIndex) return 'after';
  return 'current';
}

/** Returns the label configuration belonging to the active string-state mode. */
function getStringstateLabelConfig(config) {
  const mode = config.horseshoe_state.mode;
  return config.horseshoe_labels[mode];
}

/** Builds labels for the signed branch occupying an absolute horseshoe. */
function buildAbsoluteLabelStopItems(config, valueMapper, colorStops) {
  const labelsAt = config.show.labels_at;
  const magnitudeMax = valueMapper.getActiveMagnitudeMax();
  const activeColorStops = valueMapper.getActiveColorStops(colorStops.colors);
  const toLabelStop = (magnitude, role, extra = {}) => ({
    value: valueMapper.magnitudeToSourceValue(magnitude),
    text: String(magnitude),
    role,
    magnitude,
    ...extra,
  });
  let labelStops = [];

  if (labelsAt === 'minmax' || labelsAt === 'minmax0') {
    labelStops = [
      toLabelStop(0, 'min'),
      toLabelStop(magnitudeMax, 'max'),
    ];
  }

  if (labelsAt === 'colorstop' || labelsAt === 'colorstops' || labelsAt === 'both') {
    labelStops = [
      toLabelStop(0, 'min'),
      ...activeColorStops.map((stop) => ({
        value: Number(stop.value),
        text: stop.label ?? String(Math.abs(Number(stop.value))),
        role: 'colorstop',
        magnitude: Math.abs(Number(stop.value)),
        color: stop.color,
      })),
      toLabelStop(magnitudeMax, 'max'),
    ];
  }

  if (labelsAt === 'ticks_major' || labelsAt === 'both') {
    const ticksize = Number(config.horseshoe_tickmarks.ticks_major.ticksize);
    const tickLabels = buildTickValues(0, magnitudeMax, ticksize, 0).map((magnitude, index, values) => (
      toLabelStop(magnitude, index === 0 ? 'min' : index === values.length - 1 ? 'max' : 'tick-major')
    ));
    labelStops = labelsAt === 'both' ? [...labelStops, ...tickLabels] : tickLabels;
  }

  const uniqueStops = labelStops
    .sort((stopA, stopB) => stopA.magnitude - stopB.magnitude)
    .filter((stop, index, stops) => stops.findIndex((candidate) => candidate.magnitude === stop.magnitude) === index);
  const distanceMin = Number(config.horseshoe_labels.distance_min);
  const visibleStops = [];

  uniqueStops.forEach((stop) => {
    const previous = visibleStops[visibleStops.length - 1];
    if (!previous || distanceMin <= 0 || stop.magnitude - previous.magnitude >= distanceMin) visibleStops.push(stop);
  });

  if (visibleStops.length) {
    visibleStops[0].role = 'min';
    visibleStops[visibleStops.length - 1].role = 'max';
  }

  return visibleStops;
}

/**
 * Builds the configured labels in value space. Path placement is performed
 * later by path-elements using the same value mapper as the state and ticks.
 */
export function buildLabelStopItems(config, runtime, paint) {
  const labelsAt = config.show.labels_at;
  const valueMapper = runtime.valueMapper;

  if (config.bar_mode === 'absolute' && labelsAt !== 'segment' && labelsAt !== 'stringstate') {
    return buildAbsoluteLabelStopItems(config, valueMapper, paint.colorStops);
  }

  const min = runtime.scale.min;
  const max = runtime.scale.max;
  const colorStops = paint.colorStops.colors;
  let labelStops = [];

  if (labelsAt === 'minmax') {
    labelStops = [
      { value: min, text: String(min), role: 'min' },
      { value: max, text: String(max), role: 'max' },
    ];
  }

  if (labelsAt === 'minmax0') {
    labelStops = [
      { value: min, text: String(min), role: 'min' },
      { value: 0, text: '0', role: 'zero' },
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
    const ticksize = Number(config.horseshoe_tickmarks.ticks_major.ticksize);
    const bidirectional = config.bar_mode === 'bidirectional' || config.bar_mode === 'bidirectional_symmetrical' || config.bar_mode === 'bidirectional_linear';
    const tickAnchor = bidirectional ? 0 : min;
    labelStops = buildTickValues(min, max, ticksize, tickAnchor).map((value, index, values) => ({
      value,
      text: String(value),
      role: index === 0 ? 'min' : index === values.length - 1 ? 'max' : 'tick-major',
    }));
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
    const ticksize = Number(config.horseshoe_tickmarks.ticks_major.ticksize);
    const bidirectional = config.bar_mode === 'bidirectional' || config.bar_mode === 'bidirectional_symmetrical' || config.bar_mode === 'bidirectional_linear';
    const tickAnchor = bidirectional ? 0 : min;
    const tickLabels = buildTickValues(min, max, ticksize, tickAnchor).map((value) => ({
      value,
      text: String(value),
      role: 'tick-major',
    }));
    labelStops = [...colorStopLabels, ...tickLabels];
  }

  if (labelsAt === 'segment' || labelsAt === 'stringstate') {
    const stateMap = runtime.stateMap.map;
    const currentIndex = stateMap.findIndex((item) => Number(item.value) === Number(runtime.mappedState.value));
    const stringstateMode = config.horseshoe_state.mode === 'stringstate_mode' || config.horseshoe_state.mode === 'stringstate_level';
    const stringstateLabels = stringstateMode ? getStringstateLabelConfig(config) : undefined;

    labelStops = stateMap.map((item, index) => {
      const relation = getMappedStateRelation(index, currentIndex);
      const labelStateEntry = stringstateMode
        ? stringstateLabels.state_map.map.find((entry) => String(entry.state) === String(item.state))
        : undefined;

      return {
        value: stringstateMode ? index + 0.5 : item.value,
        startValue: index,
        endValue: index + 1,
        text: labelStateEntry?.label ?? item.display_label ?? String(item.state ?? item.value),
        role: 'segment',
        relation,
        styles: {
          ...(stringstateMode ? stringstateLabels[relation].styles : {}),
          ...(stringstateMode && labelStateEntry ? labelStateEntry.styles : {}),
          ...(stringstateMode && labelStateEntry ? labelStateEntry[relation].styles : {}),
        },
      };
    });
  }

  const bidirectional = config.bar_mode === 'bidirectional' || config.bar_mode === 'bidirectional_symmetrical' || config.bar_mode === 'bidirectional_linear';
  const validStops = labelStops
    .filter((stop) => {
      const value = Number(stop.value);
      return Number.isFinite(value) && ((value >= min && value <= max) || (bidirectional && value === 0));
    })
    .sort((stopA, stopB) => Number(stopA.value) - Number(stopB.value))
    .filter((stop, index, stops) => stops.findIndex((candidate) => Number(candidate.value) === Number(stop.value)) === index);
  const distanceMin = Number(config.horseshoe_labels.distance_min);
  const visibleStops = [];

  validStops.forEach((stop) => {
    const previous = visibleStops[visibleStops.length - 1];
    if (!previous || distanceMin <= 0 || Math.abs(Number(stop.value) - Number(previous.value)) >= distanceMin) visibleStops.push(stop);
  });

  if (visibleStops.length) {
    visibleStops[0].role = 'min';
    visibleStops[visibleStops.length - 1].role = 'max';
  }

  return visibleStops;
}

/** Truncates label text when a character limit is configured. */
export function applyEllipsis(text, ellipsis) {
  const maxLength = Number(ellipsis);
  if (maxLength <= 0 || text.length <= maxLength) return text;
  if (maxLength === 1) return '…';
  return `${text.slice(0, maxLength - 1)}…`;
}
