import Colors from './colors.js';
import { buildBandPath } from './horseshoe-shapes.js';

function toStyleDict(styles) {
  if (!styles) return {};

  if (Array.isArray(styles)) {
    return styles.reduce((result, item) => {
      if (item && typeof item === 'object') {
        return {
          ...result,
          ...item,
        };
      }

      return result;
    }, {});
  }

  if (typeof styles === 'object') {
    return styles;
  }

  return {};
}

function buildTickValues(min, max, ticksize) {
  const values = [];

  for (let value = min; value <= max + 1e-9; value += ticksize) {
    values.push(Number(value.toFixed(10)));
  }

  return values;
}

function isMajorTick(value, min, majorTicksize) {
  const ratio = (value - min) / majorTicksize;

  return Math.abs(ratio - Math.round(ratio)) < 1e-9;
}

function arcLengthToDegrees(lengthPx, radius) {
  return (Number(lengthPx) / (2 * Math.PI * radius)) * 360;
}

function degreesToArcLength(lengthDeg, radius) {
  return (Number(lengthDeg) / 360) * (2 * Math.PI * radius);
}

function getMinorTickThicknessLimit(runtimeConfig, geometry, tickConfig, angleGapDegrees, referenceGapDegrees) {
  const baseThickness = Number(tickConfig.thickness ?? 2);
  const taperEnabled = Boolean(runtimeConfig.horseshoe_scale?.spline?.minor_tick_taper);

  if (!taperEnabled) {
    return baseThickness;
  }

  const radius = geometry.radius + Number(tickConfig.offset ?? 0);

  if (!Number.isFinite(angleGapDegrees) || angleGapDegrees <= 0 || !Number.isFinite(radius) || radius <= 0) {
    return baseThickness;
  }

  const gapArcLength = degreesToArcLength(angleGapDegrees, radius);
  const referenceGapArcLength = degreesToArcLength(referenceGapDegrees ?? angleGapDegrees, radius);

  if (!Number.isFinite(referenceGapArcLength) || referenceGapArcLength <= 0) {
    return baseThickness;
  }

  const gapRatio = Math.max(0.05, Math.min(1, gapArcLength / referenceGapArcLength));
  const thickness = baseThickness * gapRatio;

  return thickness;
}

function getTickColor(tickConfig, value, runtimeConfig) {
  const colorMode = tickConfig?.color_mode;

  if (colorMode === 'colorstop') {
    return Colors.calculateStrokeColor(value, runtimeConfig.colorStops, false);
  }

  if (colorMode === 'colorstopgradient') {
    return Colors.calculateStrokeColor(value, runtimeConfig.colorStops, true);
  }

  return tickConfig?.color ?? runtimeConfig.horseshoe_scale.color;
}

function buildColorStopTickBackgroundItems(runtimeConfig, geometry, backgroundConfig, radius, width, gap) {
  const colorStops = Array.isArray(runtimeConfig.colorStops?.colors) ? runtimeConfig.colorStops.colors : [];

  if (!colorStops.length) {
    return [];
  }

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

  const backgroundItems = [];

  for (let i = 0; i < segmentPoints.length - 1; i += 1) {
    const pointA = segmentPoints[i];
    const pointB = segmentPoints[i + 1];
    const isFirst = i === 0;
    const isLast = i === segmentPoints.length - 2;
    const startAngle = geometry.valueToAngle(pointA.value);
    const endAngle = geometry.valueToAngle(pointB.value);
    const drawStartAngle = isFirst ? startAngle : startAngle + gap / 2;
    const drawEndAngle = isLast ? endAngle : endAngle - gap / 2;

    if (drawEndAngle > drawStartAngle) {
      backgroundItems.push({
        key: `tick-background-colorstop-${i}`,
        radius,
        width,
        color: pointA.color,
        startAngle: drawStartAngle,
        endAngle: drawEndAngle,
        lineCap: 'butt',
      });
    }
  }

  return backgroundItems;
}

export function buildTickBackgroundItems(runtimeConfig, geometry) {
  if (!runtimeConfig?.show?.ticks) {
    return [];
  }

  const backgroundMode = runtimeConfig.show.tick_background ?? 'none';

  if (backgroundMode === 'none') {
    return [];
  }

  const tickmarks = runtimeConfig.horseshoe_tickmarks ?? {};
  const backgroundConfig = tickmarks.background ?? {};
  const majorTickConfig = tickmarks.ticks_major ?? {};
  const minorTickConfig = tickmarks.ticks_minor ?? {};
  const radius = geometry.radius + Number(
    backgroundConfig.offset
      ?? majorTickConfig.offset
      ?? minorTickConfig.offset
      ?? 0,
  );
  const width = Number(
    backgroundConfig.width
      ?? majorTickConfig.width
      ?? minorTickConfig.width
      ?? 4,
  );
  const gap = Number(backgroundConfig.gap ?? 0);

  if (backgroundMode === 'colorstop') {
    return buildColorStopTickBackgroundItems(runtimeConfig, geometry, backgroundConfig, radius, width, gap);
  }

  if (backgroundMode === 'fixed') {
    return [
      {
        key: 'tick-background-fixed',
        radius,
        width,
        color: backgroundConfig.color,
        startAngle: geometry.startAngle,
        endAngle: geometry.endAngle,
        lineCap: 'round',
      },
    ];
  }

  return [];
}

function buildTickPathItemsForConfig(runtimeConfig, geometry, tickConfig, values, layerName) {
  if (!tickConfig || !values.length) {
    return [];
  }

  const tickStyles = toStyleDict(tickConfig.styles);
  const radius = geometry.radius + Number(tickConfig.offset ?? 0);
  const width = Number(tickConfig.width);

  if (!Number.isFinite(width) || width <= 0) {
    throw new Error(`[horseshoe-tickmarks] Missing or invalid ${layerName} tick width`);
  }
  const angleGaps = values.map((value, index) => {
    const currentAngle = geometry.valueToAngle(value);
    const previousAngle = index > 0 ? geometry.valueToAngle(values[index - 1]) : null;
    const nextAngle = index < values.length - 1 ? geometry.valueToAngle(values[index + 1]) : null;
    const previousGap = previousAngle !== null ? Math.abs(currentAngle - previousAngle) : Infinity;
    const nextGap = nextAngle !== null ? Math.abs(nextAngle - currentAngle) : Infinity;

    return Math.min(previousGap, nextGap);
  });
  const referenceGap = angleGaps.find((gap) => Number.isFinite(gap) && gap > 0) ?? 0;

  return values.map((value, index) => {
    const angle = geometry.valueToAngle(value);
    const thickness = layerName === 'minor'
      ? getMinorTickThicknessLimit(runtimeConfig, geometry, tickConfig, angleGaps[index], referenceGap)
      : Number(tickConfig.thickness ?? 2);
    const bandWidth = width;
    const tickDegrees = arcLengthToDegrees(thickness, radius);
    const startAngle = angle - tickDegrees / 2;
    const endAngle = angle + tickDegrees / 2;

    const path = buildBandPath(
      geometry,
      {
        key: `${layerName}-${index}`,
        startAngle,
        endAngle,
        startCap: 'butt',
        endCap: 'butt',
      },
      {
        radius,
        width: bandWidth,
      },
    );

    return {
      key: `${layerName}-${index}`,
      path,
      fill: tickStyles.fill ?? getTickColor(tickConfig, value, runtimeConfig),
      styles: tickStyles,
      className: layerName === 'major' ? 'horseshoe__tick-major' : 'horseshoe__tick-minor',
    };
  }).filter((item) => item.path);
}

export default function buildTickPathItems(runtimeConfig, geometry) {
  if (!runtimeConfig?.show?.ticks) {
    return [];
  }

  const tickmarks = runtimeConfig.horseshoe_tickmarks;

  if (!tickmarks?.ticks_major && !tickmarks?.ticks_minor) {
    return [];
  }

  const min = Number(runtimeConfig.horseshoe_scale.min);
  const max = Number(runtimeConfig.horseshoe_scale.max);

  const majorTickConfig = tickmarks.ticks_major;
  const minorTickConfig = tickmarks.ticks_minor;

  const majorTickSize = Number(majorTickConfig?.ticksize);
  const minorTickSize = Number(minorTickConfig?.ticksize);

  const majorValues = Number.isFinite(majorTickSize) && majorTickSize > 0
    ? buildTickValues(min, max, majorTickSize)
    : [];

  const minorValues = Number.isFinite(minorTickSize) && minorTickSize > 0
    ? buildTickValues(min, max, minorTickSize).filter((value) => (
      Number.isFinite(majorTickSize) && majorTickSize > 0
        ? !isMajorTick(value, min, majorTickSize)
        : true
    ))
    : [];

  const taperedMinorValues = minorValues;
  const minorTickPathItems = buildTickPathItemsForConfig(runtimeConfig, geometry, minorTickConfig, taperedMinorValues, 'minor');
  const majorTickPathItems = buildTickPathItemsForConfig(runtimeConfig, geometry, majorTickConfig, majorValues, 'major');

  return [
    ...minorTickPathItems,
    ...majorTickPathItems,
  ];
}
