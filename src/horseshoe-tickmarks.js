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
  const radius = geometry.radius + Number(backgroundConfig.offset ?? majorTickConfig.offset ?? minorTickConfig.offset ?? 0);
  const width = Number(backgroundConfig.width ?? majorTickConfig.width ?? minorTickConfig.width ?? 4);
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

function buildTickPathItemsForConfig(runtimeConfig, geometry, tickConfig, values, layerName, minorThicknessByValue) {
  if (!tickConfig || !values.length) {
    return [];
  }

  const tickStyles = toStyleDict(tickConfig.styles);
  const renderStyles = {
    ...tickStyles,
    'stroke-width': tickStyles['stroke-width'] ?? 0,
  };
  const radius = geometry.radius + Number(tickConfig.offset ?? 0);
  const width = Number(tickConfig.width);

  if (!Number.isFinite(width) || width <= 0) {
    throw new Error(`[horseshoe-tickmarks] Missing or invalid ${layerName} tick width`);
  }
  const configuredThickness = Number(tickConfig.thickness);

  return values
    .map((value, index) => {
      const angle = geometry.valueToAngle(value);
      const thickness = layerName === 'minor' && minorThicknessByValue?.has(value)
        ? Math.min(configuredThickness, minorThicknessByValue.get(value))
        : configuredThickness;

      if (layerName === 'minor' && (runtimeConfig.debug_ticks || runtimeConfig.dev?.debug_ticks)) {
        console.log('[horseshoe-tickmarks] minor thickness', {
          value,
          configuredThickness,
          maxThickness: minorThicknessByValue?.get(value),
          finalThickness: thickness,
          limited: minorThicknessByValue?.has(value) && thickness !== configuredThickness,
        });
      }
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
        value,
        thickness,
        startAngle,
        endAngle,
        fill: tickStyles.fill ?? getTickColor(tickConfig, value, runtimeConfig),
        styles: renderStyles,
        className: layerName === 'major' ? 'horseshoe__tick-major' : 'horseshoe__tick-minor',
      };
    })
    .filter((item) => item.path);
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

  const majorValues = Number.isFinite(majorTickSize) && majorTickSize > 0 ? buildTickValues(min, max, majorTickSize) : [];

  const minorValues =
    Number.isFinite(minorTickSize) && minorTickSize > 0
      ? buildTickValues(min, max, minorTickSize).filter((value) => (Number.isFinite(majorTickSize) && majorTickSize > 0 ? !isMajorTick(value, min, majorTickSize) : true))
      : [];

  const minorThicknessByValue = new Map();

  if ((runtimeConfig.horseshoe_scale.type === 'spline' || runtimeConfig.horseshoe_scale.type === 'spline2') && majorValues.length > 1 && minorValues.length) {
    const minorRadius = geometry.radius + Number(minorTickConfig.offset ?? 0);
    const majorThickness = Number(majorTickConfig.thickness);
    const majorGapDegreesByInterval = majorValues.slice(0, -1).map((value, index) => Math.abs(geometry.valueToAngle(majorValues[index + 1]) - geometry.valueToAngle(value)));
    const referenceMajorGapDegrees = majorGapDegreesByInterval[1] ?? majorGapDegreesByInterval[0];

    for (let index = 0; index < majorValues.length - 1; index += 1) {
      const majorStartValue = majorValues[index];
      const majorEndValue = majorValues[index + 1];
      const minorValuesBetweenMajorTicks = minorValues.filter((value) => value > majorStartValue && value < majorEndValue);

      if (minorValuesBetweenMajorTicks.length) {
        const majorGapDegrees = Math.abs(geometry.valueToAngle(majorEndValue) - geometry.valueToAngle(majorStartValue));
        const majorGapArcLength = degreesToArcLength(majorGapDegrees, minorRadius);
        const availableMinorArcLength = Math.max(0, majorGapArcLength - majorThickness);
        const minorSlotsBetweenMajorTicks = Math.abs(majorEndValue - majorStartValue) / minorTickSize;
        const intervalRatio = Math.min(1, majorGapDegrees / referenceMajorGapDegrees);
        const maxMinorThickness = Math.min(availableMinorArcLength / minorSlotsBetweenMajorTicks, Number(minorTickConfig.thickness) * intervalRatio);

        if (runtimeConfig.debug_ticks || runtimeConfig.dev?.debug_ticks) {
          console.log('[horseshoe-tickmarks] spline minor interval', {
            scaleType: runtimeConfig.horseshoe_scale.type,
            majorStartValue,
            majorEndValue,
            minorValues: minorValuesBetweenMajorTicks,
            majorGapDegrees,
            referenceMajorGapDegrees,
            intervalRatio,
            minorRadius,
            majorGapArcLength,
            majorThickness,
            availableMinorArcLength,
            minorTickSize,
            minorSlotsBetweenMajorTicks,
            configuredMinorThickness: Number(minorTickConfig.thickness),
            maxMinorThickness,
          });
        }

        minorValuesBetweenMajorTicks.forEach((value) => {
          minorThicknessByValue.set(value, maxMinorThickness);
        });
      }
    }
  }

  const minorTickPathItems = buildTickPathItemsForConfig(runtimeConfig, geometry, minorTickConfig, minorValues, 'minor', minorThicknessByValue);
  const majorTickPathItems = buildTickPathItemsForConfig(runtimeConfig, geometry, majorTickConfig, majorValues, 'major');

  return [...minorTickPathItems, ...majorTickPathItems];
}
