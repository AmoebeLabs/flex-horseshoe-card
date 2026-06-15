import ColorStops from './color-stops.js';
import { clamp } from './frontend_mods/common/number/clamp.ts';
import { SVG_VIEW_BOX } from './const.js';

/**
 * Default animation configuration copied into normalized runtime state.
 */
const DEFAULT_STATE_ANIMATION = {
  enabled: true,
  duration: 2500,
  easing: 'ease-out',
  debug: false,
};

/**
 * Normalizes style configuration arrays and objects into a single object.
 */
const toStyleDict = (styles) => {
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
};

/**
 * Applies the minimal base defaults needed before entity state is resolved.
 */
export function normalizeBaseConfig(config, index) {
  const entityIndex = config.entity_index ?? 0;

  return {
    entity_index: entityIndex,
    ...config,
    index,
    show: {
      horseshoe: true,
      horseshoe_style: 'fixed',
      labels_at: 'none',
      ...(config.show ?? {}),
    },
  };
}

/**
 * Normalizes linecap configuration to explicit start and end values.
 */
export function normalizeLinecap(linecap) {
  if (typeof linecap === 'string') {
    return {
      start: linecap,
      end: linecap,
    };
  }

  if (linecap && typeof linecap === 'object') {
    return {
      start: linecap.start ?? 'butt',
      end: linecap.end ?? 'butt',
    };
  }

  return {
    start: 'butt',
    end: 'butt',
  };
}

/**
 * Computes the normalized zero position for bidirectional scales.
 */
export function getZeroRatio(horseshoeScale) {
  const min = Number(horseshoeScale.min);
  const max = Number(horseshoeScale.max);

  if (min >= 0 || max <= 0) {
    return 0;
  }

  return clamp((0 - min) / (max - min), 0, 1);
}

/**
 * Builds the full normalized runtime configuration used by the v2 renderer.
 */
export function normalizeRuntimeConfig(config) {
  const show = {
    horseshoe: true,
    horseshoe_style: 'fixed',
    labels_at: 'none',
    ...(config.show ?? {}),
  };

  if (!config.horseshoe_scale) {
    throw new Error('[V2] Missing horseshoe_scale');
  }

  // Scale defaults are merged before validation so downstream geometry always has core fields.
  const horseshoeScale = {
    min: 0,
    max: 100,
    width: 6,
    color: 'var(--primary-background-color)',
    linecap: 'round',
    type: 'linear',
    ...(config.horseshoe_scale ?? {}),
  };

  // const horseshoeScale = config.horseshoe_scale;

  if (horseshoeScale.min === undefined) {
    throw new Error('[V2] Missing horseshoe_scale.min');
  }

  if (horseshoeScale.max === undefined) {
    throw new Error('[V2] Missing horseshoe_scale.max');
  }

  if (!horseshoeScale.type) {
    throw new Error('[V2] Missing horseshoe_scale.type');
  }

  if ((horseshoeScale.type === 'spline' || horseshoeScale.type === 'spline2') && !horseshoeScale.spline) {
    throw new Error('[V2] Missing horseshoe_scale.spline');
  }

  const horseshoeState = {
    width: 12,
    color: 'var(--primary-color)',
    linecap: 'round',
    mode: 'value',
    segment_gap: 2,
    animation: DEFAULT_STATE_ANIMATION,
    ...(config.horseshoe_state ?? {}),
  };

  const horseshoeLabels = {
    offset: 12,
    ...(config.horseshoe_labels ?? {}),
  };

  const horseshoeTickmarks = {
    ...(config.horseshoe_tickmarks ?? {}),
  };

  // Keep both color_stops and colorstops aliases on the runtime config for compatibility.
  const colorStopsConfig = config.color_stops ?? config.colorstops;
  const colorStops = ColorStops.ensureMinimumStops(ColorStops.normalize(colorStopsConfig), horseshoeScale.max);

  const radius = config.radius ?? 45;
  const tickmarksRadius = config.tickmarks_radius ?? 43;
  const arcDegrees = config.arc_degrees ?? 260;
  const xpos = config.xpos ?? 50;
  const ypos = config.ypos ?? 50;

  return {
    ...config,

    show,

    xpos,
    ypos,
    radius,
    tickmarks_radius: tickmarksRadius,
    arc_degrees: arcDegrees,

    // Store percent-based layout values and SVG-viewbox values side by side.
    svg: {
      xpos: (xpos / 100) * SVG_VIEW_BOX,
      ypos: (ypos / 100) * SVG_VIEW_BOX,
      radius: (radius / 100) * SVG_VIEW_BOX,
      tickmarks_radius: (tickmarksRadius / 100) * SVG_VIEW_BOX,
    },

    start_angle: config.start_angle ?? 90 + (360 - arcDegrees) / 2,
    bar_mode: config.bar_mode ?? 'normal',
    zero_ratio: config.zero_ratio ?? getZeroRatio(horseshoeScale),

    state_map: config.state_map ?? horseshoeState.state_map ?? [],

    color_stops: colorStopsConfig,
    colorstops: colorStopsConfig,
    colorStops,

    horseshoe_scale: {
      ...horseshoeScale,
      linecap: normalizeLinecap(horseshoeScale.linecap),
      styles: {
        fill: horseshoeScale.color,
        ...toStyleDict(horseshoeScale.styles),
      },
    },

    horseshoe_state: {
      ...horseshoeState,
      animation: {
        ...DEFAULT_STATE_ANIMATION,
        ...(horseshoeState.animation ?? {}),
      },
      linecap: normalizeLinecap(horseshoeState.linecap),
      styles: {
        fill: horseshoeState.color,
        ...toStyleDict(horseshoeState.styles),
      },
    },

    horseshoe_labels: {
      ...horseshoeLabels,
      background: {
        ...(horseshoeLabels.background ?? {}),
        styles: {
          ...toStyleDict(horseshoeLabels.background?.styles),
        },
      },
      badges: {
        ...(horseshoeLabels.badges ?? {}),
        styles: {
          ...toStyleDict(horseshoeLabels.badges?.styles),
        },
      },
      styles: {
        fill: 'var(--primary-text-color)',
        'font-size': '6px',
        ...toStyleDict(horseshoeLabels.styles),
      },
    },

    // Tickmark styles are normalized per sub-block so renderers can apply styleMap directly.
    horseshoe_tickmarks: {
      ...horseshoeTickmarks,
      background: {
        ...(horseshoeTickmarks.background ?? {}),
        styles: {
          ...toStyleDict(horseshoeTickmarks.background?.styles),
        },
      },
      ticks_major: horseshoeTickmarks.ticks_major
        ? {
            ...horseshoeTickmarks.ticks_major,
            styles: {
              ...toStyleDict(horseshoeTickmarks.ticks_major?.styles),
            },
          }
        : horseshoeTickmarks.ticks_major,
      ticks_minor: horseshoeTickmarks.ticks_minor
        ? {
            ...horseshoeTickmarks.ticks_minor,
            styles: {
              ...toStyleDict(horseshoeTickmarks.ticks_minor?.styles),
            },
          }
        : horseshoeTickmarks.ticks_minor,
    },
  };
}

/**
 * Finds a state-map entry matching either raw state or mapped numeric value.
 */
export function getStateMapItem(stateMap, rawState, value) {
  return stateMap.find((item) => {
    if (item.state !== undefined) {
      return String(item.state) === String(rawState);
    }

    if (item.value !== undefined) {
      return String(item.value) === String(value);
    }

    return false;
  });
}

/**
 * Resolves templates, entity attributes, state mapping, and numeric gauge value.
 */
export function getGaugeStateData(config, templates, entityIndex, entity, entityConfig) {
  const item = {
    entity_index: entityIndex,
  };

  // Resolve templates before normalization because template output may affect scale, styles, or state maps.
  const resolvedConfig = templates.getJsTemplateOrValue(item, config, {
    resolveKeys: true,
  });

  const runtimeConfig = normalizeRuntimeConfig(resolvedConfig);

  let value = entity.state;

  if (entityConfig?.attribute && entity.attributes?.[entityConfig.attribute] !== undefined) {
    value = entity.attributes[entityConfig.attribute];
  }

  // State maps may replace the raw entity value before the gauge receives its numeric state.
  const mappedState = getStateMapItem(runtimeConfig.state_map, entity.state, value);
  const nextValue = Number(mappedState?.value ?? value);

  return {
    runtimeConfig,
    rawState: entity.state,
    mappedState,
    value: nextValue,
  };
}
