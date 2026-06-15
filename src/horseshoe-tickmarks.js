import Colors from './colors.js';
import ConfigHelper from './config-helper.js';
import { buildBandPath } from './horseshoe-shapes.js';

/**
 * Builds numeric tick values from min to max using the configured tick size.
 */
function buildTickValues(min, max, ticksize) {
  const values = [];

  for (let value = min; value <= max + 1e-9; value += ticksize) {
    values.push(Number(value.toFixed(10)));
  }

  return values;
}

/**
 * Checks whether a value lands on the major tick interval.
 */
function isMajorTick(value, min, majorTicksize) {
  const ratio = (value - min) / majorTicksize;

  return Math.abs(ratio - Math.round(ratio)) < 1e-9;
}

/**
 * Converts a physical arc length to degrees at a given radius.
 */
function arcLengthToDegrees(lengthPx, radius) {
  return (Number(lengthPx) / (2 * Math.PI * radius)) * 360;
}

/**
 * Converts arc degrees to physical length at a given radius.
 */
function degreesToArcLength(lengthDeg, radius) {
  return (Number(lengthDeg) / 360) * (2 * Math.PI * radius);
}

/**
 * Resolves the fill color for one tick based on fixed or color-stop mode.
 */
function getTickColor(tickConfig, tickStyles, value, runtimeConfig) {
  const colorMode = tickConfig?.color_mode;

  if (colorMode === 'colorstop') {
    return Colors.calculateStrokeColor(value, runtimeConfig.colorStops, false);
  }

  if (colorMode === 'colorstopgradient') {
    return Colors.calculateStrokeColor(value, runtimeConfig.colorStops, true);
  }

  return tickConfig?.color ?? tickStyles.fill;
}

/**
 * Builds tick background segments from configured color stops.
 */
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

/**
 * Builds the optional fixed or color-stop tickmark background layer items.
 */
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

/**
 * Builds renderable tick path items for either major or minor ticks.
 */
function buildTickPathItemsForConfig(runtimeConfig, geometry, tickConfig, values, layerName, minorThicknessByValue) {
  if (!tickConfig || !values.length) {
    return [];
  }

  const tickStyles = ConfigHelper.toStyleDict(tickConfig.styles);
  // Tickmarks are filled paths; default stroke width is neutralized unless configured explicitly.
  const baseRenderStyles = {
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
      // Minor ticks may receive a spline-specific maximum thickness for the local major interval.
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
      // Thickness is stored as arc length and converted to angular span for the band path.
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

      const tickFill = getTickColor(tickConfig, tickStyles, value, runtimeConfig);
      const renderStyles = {
        ...baseRenderStyles,
        fill: tickFill ?? tickStyles.fill,
      };

      if (tickFill === undefined && runtimeConfig.dev?.debug_colors) {
        console.log('[horseshoe-tickmarks] unresolved tick fill', {
          layerName,
          value,
          colorMode: tickConfig.color_mode,
          colorStops: runtimeConfig.colorStops,
        });
      }

      return {
        key: `${layerName}-${index}`,
        path,
        value,
        thickness,
        startAngle,
        endAngle,
        styles: renderStyles,
        className: layerName === 'major' ? 'horseshoe__tick-major' : 'horseshoe__tick-minor',
      };
    })
    .filter((item) => item.path);
}

/**
 * Builds all major and minor tick path items for the current scale.
 */
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

  // spline/spline2 can compress value ranges; this map stores per-minor maximum thickness.
  const minorThicknessByValue = new Map();

  if ((runtimeConfig.horseshoe_scale.type === 'spline' || runtimeConfig.horseshoe_scale.type === 'spline2') && majorValues.length > 1 && minorValues.length) {
    const minorRadius = geometry.radius + Number(minorTickConfig.offset ?? 0);
    const majorThickness = Number(majorTickConfig.thickness);
    // Use an early non-start interval as the visual reference for relative spline compression.
    const majorGapDegreesByInterval = majorValues.slice(0, -1).map((value, index) => Math.abs(geometry.valueToAngle(majorValues[index + 1]) - geometry.valueToAngle(value)));
    const referenceMajorGapDegrees = majorGapDegreesByInterval[1] ?? majorGapDegreesByInterval[0];

    for (let index = 0; index < majorValues.length - 1; index += 1) {
      const majorStartValue = majorValues[index];
      const majorEndValue = majorValues[index + 1];
      const minorValuesBetweenMajorTicks = minorValues.filter((value) => value > majorStartValue && value < majorEndValue);

      if (minorValuesBetweenMajorTicks.length) {
        const majorGapDegrees = Math.abs(geometry.valueToAngle(majorEndValue) - geometry.valueToAngle(majorStartValue));
        const majorGapArcLength = degreesToArcLength(majorGapDegrees, minorRadius);
        // Remove the major tick thickness before dividing the remaining interval into minor slots.
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
