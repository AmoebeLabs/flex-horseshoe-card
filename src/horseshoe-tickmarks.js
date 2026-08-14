import Colors from './colors.js';
import ConfigHelper from './config-helper.js';
import { buildArcBackgroundItems, buildBandPath } from './horseshoe-shapes.js';

/**
 * Builds numeric tick values outward from the supplied anchor.
 * Normal scales anchor at min; bidirectional and absolute scales anchor at zero.
 */
function buildTickValues(min, max, ticksize, anchor) {
  const values = [anchor];

  for (let value = anchor - ticksize; value >= min - 1e-9; value -= ticksize) {
    values.push(Number(value.toFixed(10)));
  }

  for (let value = anchor + ticksize; value <= max + 1e-9; value += ticksize) {
    values.push(Number(value.toFixed(10)));
  }

  return values.sort((valueA, valueB) => valueA - valueB);
}

/**
 * Checks whether a value lands on the major tick interval.
 */
function isMajorTick(value, anchor, majorTicksize) {
  const ratio = (value - anchor) / majorTicksize;

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
 * Resolves the enabled tickmark layers from the new tickmarks setting.
 *
 * A boolean is the shorthand for both layers. An object allows major and
 * minor ticks to be controlled independently. The old show.ticks value is
 * only used when the new show.tickmarks setting is absent, preserving older
 * configurations without making the legacy key the primary API.
 */
function getTickmarkVisibility(runtimeConfig) {
  const configuredTickmarks = runtimeConfig?.show?.tickmarks;

  if (configuredTickmarks && typeof configuredTickmarks === 'object') {
    return {
      major: configuredTickmarks.major !== false,
      minor: configuredTickmarks.minor !== false,
    };
  }

  const enabled = configuredTickmarks ?? runtimeConfig?.show?.ticks;

  return {
    major: enabled,
    minor: enabled,
  };
}

function isTickmarksEnabled(runtimeConfig) {
  const visibility = getTickmarkVisibility(runtimeConfig);

  return visibility.major || visibility.minor;
}

function getTickColor(tickConfig, tickStyles, value, runtimeConfig) {
  const colorMode = tickConfig?.color_mode;

  if (colorMode === 'colorstop') {
    return Colors.calculateStrokeColor(value, runtimeConfig.colorstops, false);
  }

  if (colorMode === 'colorstopinterpolated') {
    return Colors.calculateStrokeColor(value, runtimeConfig.colorstops, true);
  }

  return tickConfig?.color ?? tickStyles.fill;
}

/**
 * Builds the optional fixed or color-stop tickmark background layer items.
 */
export function buildTickBackgroundItems(runtimeConfig, geometry) {
  if (!isTickmarksEnabled(runtimeConfig)) {
    return [];
  }

  const backgroundMode = runtimeConfig.show.tick_background ?? 'none';
  const tickmarks = runtimeConfig.horseshoe_tickmarks ?? {};
  const backgroundConfig = tickmarks.background ?? {};
  const majorTickConfig = tickmarks.ticks_major ?? {};
  const minorTickConfig = tickmarks.ticks_minor ?? {};
  const radius = geometry.radius + Number(backgroundConfig.offset ?? majorTickConfig.offset ?? minorTickConfig.offset ?? 0);
  const width = Number(backgroundConfig.width ?? majorTickConfig.width ?? minorTickConfig.width ?? 4);
  const gap = Number(backgroundConfig.gap ?? 0);

  return buildArcBackgroundItems(runtimeConfig, geometry, {
    mode: backgroundMode,
    config: backgroundConfig,
    radius,
    width,
    gap,
    keyPrefix: 'tick-background',
  });
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
          colorstops: runtimeConfig.colorstops,
        });
      }

      if (tickConfig.shape === 'circle') {
        const point = geometry.pointAt(angle, radius);

        return {
          key: `${layerName}-${index}`,
          shape: 'circle',
          x: point.x,
          y: point.y,
          radius: Number(tickConfig.radius ?? width / 2),
          value,
          thickness,
          startAngle: angle,
          endAngle: angle,
          styles: renderStyles,
          className: layerName === 'major' ? 'horseshoe__tick-major' : 'horseshoe__tick-minor',
        };
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
    .filter((item) => item.path || item.shape === 'circle');
}

/**
 * Builds all major and minor tick path items for the current scale.
 */
export default function buildTickPathItems(runtimeConfig, geometry) {
  if (!isTickmarksEnabled(runtimeConfig)) {
    return [];
  }

  const tickmarks = runtimeConfig.horseshoe_tickmarks;
  const visibility = getTickmarkVisibility(runtimeConfig);

  if (!tickmarks?.ticks_major && !tickmarks?.ticks_minor) {
    return [];
  }

  const absolute = runtimeConfig.bar_mode === 'absolute';
  const bidirectional = runtimeConfig.bar_mode === 'bidirectional' || runtimeConfig.bar_mode === 'bidirectional_symmetrical' || runtimeConfig.bar_mode === 'bidirectional_linear';
  const min = absolute ? 0 : Number(runtimeConfig.horseshoe_scale.min);
  const max = absolute ? geometry.getActiveMagnitudeMax() : Number(runtimeConfig.horseshoe_scale.max);
  const tickAnchor = absolute || bidirectional ? 0 : min;
  const toSourceValue = (value) => absolute ? geometry.magnitudeToSourceValue(value) : value;
  const majorTickConfig = visibility.major ? tickmarks.ticks_major : undefined;
  const minorTickConfig = visibility.minor ? tickmarks.ticks_minor : undefined;
  const majorTickSize = Number(majorTickConfig?.ticksize);
  const minorTickSize = Number(minorTickConfig?.ticksize);
  const majorMagnitudes = Number.isFinite(majorTickSize) && majorTickSize > 0
    ? buildTickValues(min, max, majorTickSize, tickAnchor)
    : [];
  const minorMagnitudes = Number.isFinite(minorTickSize) && minorTickSize > 0
    ? buildTickValues(min, max, minorTickSize, tickAnchor)
      .filter((value) => (Number.isFinite(majorTickSize) && majorTickSize > 0 ? !isMajorTick(value, tickAnchor, majorTickSize) : true))
    : [];
  const majorValues = majorMagnitudes.map(toSourceValue);
  const minorValues = minorMagnitudes.map(toSourceValue);
  const minorThicknessByValue = new Map();

  // Spline scales can compress value ranges. Thickness is calculated in the
  // visible magnitude domain and stored against the corresponding signed value.
  if ((runtimeConfig.horseshoe_scale.type === 'splineorg' || runtimeConfig.horseshoe_scale.type === 'spline') && majorMagnitudes.length > 1 && minorMagnitudes.length) {
    const minorRadius = geometry.radius + Number(minorTickConfig.offset ?? 0);
    const majorThickness = Number(majorTickConfig.thickness);
    const majorGapDegreesByInterval = majorMagnitudes.slice(0, -1).map((magnitude, index) => (
      Math.abs(geometry.valueToAngle(toSourceValue(majorMagnitudes[index + 1])) - geometry.valueToAngle(toSourceValue(magnitude)))
    ));
    const referenceMajorGapDegrees = majorGapDegreesByInterval[1] ?? majorGapDegreesByInterval[0];

    for (let index = 0; index < majorMagnitudes.length - 1; index += 1) {
      const majorStartMagnitude = majorMagnitudes[index];
      const majorEndMagnitude = majorMagnitudes[index + 1];
      const minorMagnitudesBetweenMajorTicks = minorMagnitudes.filter((magnitude) => magnitude > majorStartMagnitude && magnitude < majorEndMagnitude);

      if (minorMagnitudesBetweenMajorTicks.length) {
        const majorGapDegrees = Math.abs(
          geometry.valueToAngle(toSourceValue(majorEndMagnitude)) - geometry.valueToAngle(toSourceValue(majorStartMagnitude)),
        );
        const majorGapArcLength = degreesToArcLength(majorGapDegrees, minorRadius);
        const availableMinorArcLength = Math.max(0, majorGapArcLength - majorThickness);
        const minorSlotsBetweenMajorTicks = (majorEndMagnitude - majorStartMagnitude) / minorTickSize;
        const intervalRatio = Math.min(1, majorGapDegrees / referenceMajorGapDegrees);
        const maxMinorThickness = Math.min(
          availableMinorArcLength / minorSlotsBetweenMajorTicks,
          Number(minorTickConfig.thickness) * intervalRatio,
        );

        if (runtimeConfig.debug_ticks || runtimeConfig.dev?.debug_ticks) {
          console.log('[horseshoe-tickmarks] spline minor interval', {
            scaleType: runtimeConfig.horseshoe_scale.type,
            majorStartMagnitude,
            majorEndMagnitude,
            minorMagnitudes: minorMagnitudesBetweenMajorTicks,
            majorGapDegrees,
            referenceMajorGapDegrees,
            intervalRatio,
            maxMinorThickness,
          });
        }

        minorMagnitudesBetweenMajorTicks.forEach((magnitude) => {
          minorThicknessByValue.set(toSourceValue(magnitude), maxMinorThickness);
        });
      }
    }
  }

  const minorTickPathItems = buildTickPathItemsForConfig(
    runtimeConfig,
    geometry,
    minorTickConfig,
    minorValues,
    'minor',
    minorThicknessByValue,
  );
  const majorTickPathItems = buildTickPathItemsForConfig(
    runtimeConfig,
    geometry,
    majorTickConfig,
    majorValues,
    'major',
  );

  return [...minorTickPathItems, ...majorTickPathItems];
}
