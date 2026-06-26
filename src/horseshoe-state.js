import ColorStops from './color-stops.js';
import ConfigHelper from './config-helper.js';
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
 * Applies the minimal base defaults needed before entity state is resolved.
 */
export function normalizeBaseConfig(config, index, groupManager) {
  const entityIndex = config.entity_index ?? 0;
  const groupConfig = groupManager.getGroupForItem(config);

  return {
    entity_index: entityIndex,
    ...config,
    group_config: groupConfig,
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

const STRINGSTATE_RELATIONS = ['before', 'current', 'after'];

/**
 * Normalizes string-state label role and state-map style dictionaries.
 */
function normalizeStringstateLabelConfig(config) {
  if (!config) {
    return config;
  }

  const normalized = {
    ...config,
  };

  STRINGSTATE_RELATIONS.forEach((relation) => {
    if (normalized[relation]) {
      normalized[relation] = {
        ...normalized[relation],
        styles: ConfigHelper.toStyleDict(normalized[relation].styles),
      };
    }
  });

  if (normalized.state_map) {
    normalized.state_map = {
      ...normalized.state_map,
      map: (normalized.state_map.map ?? []).map((entry) => {
        const normalizedEntry = {
          ...entry,
          styles: ConfigHelper.toStyleDict(entry.styles),
        };

        STRINGSTATE_RELATIONS.forEach((relation) => {
          if (normalizedEntry[relation]) {
            normalizedEntry[relation] = {
              ...normalizedEntry[relation],
              styles: ConfigHelper.toStyleDict(normalizedEntry[relation].styles),
            };
          }
        });

        return normalizedEntry;
      }),
    };
  }

  return normalized;
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
export function normalizeRuntimeConfig(config, colorStopMode) {
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

  if ((horseshoeScale.type === 'splineorg' || horseshoeScale.type === 'spline') && !horseshoeScale.spline) {
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

  const horseshoeBackground = {
    ...(config.horseshoe_background ?? {}),
  };

  const horseshoeLabels = {
    offset: 12,
    ...(config.horseshoe_labels ?? {}),
  };

  const horseshoeTickmarks = {
    ...(config.horseshoe_tickmarks ?? {}),
  };

  const stateMap = config.state_map ?? horseshoeState.state_map;

  // Keep both color_stops and colorstops aliases on the runtime config for compatibility.
  const colorStopsConfig = config.color_stops ?? config.colorstops;
  const colorStops = ColorStops.ensureMinimumStops(ColorStops.normalize(colorStopsConfig, colorStopMode), horseshoeScale.max);
  const firstColorStop = colorStops.colors[0];
  const lastColorStop = colorStops.colors[colorStops.colors.length - 1];
  const colorStopsMinMax = ColorStops.normalize({
    [horseshoeScale.min]: firstColorStop.color,
    [horseshoeScale.max]: lastColorStop.color,
  }, colorStopMode);

  const radius = config.radius ?? 45;
  const tickmarksRadius = config.tickmarks_radius ?? 43;
  const arcDegrees = config.arc_degrees ?? 260;
  const barMode = config.bar_mode ?? 'normal';
  const symmetricalBidirectional = barMode === 'bidirectional' || barMode === 'bidirectional_symmetrical';
  const groupConfig = config.group_config;
  const groupCenterOffset = 50;
  const itemXpos = config.xpos ?? config.horseshoe_position?.xpos ?? config.horseshoe_position?.cx ?? 50;
  const itemYpos = config.yposc || (config.ypos ?? config.horseshoe_position?.ypos ?? config.horseshoe_position?.cy ?? 50);
  const xpos = groupConfig ? groupConfig.xpos + itemXpos - groupCenterOffset : itemXpos;
  const ypos = groupConfig ? groupConfig.ypos + itemYpos - groupCenterOffset : itemYpos;
  const groupSvg = groupConfig
    ? {
        xpos: (groupConfig.xpos / 100) * SVG_VIEW_BOX,
        ypos: (groupConfig.ypos / 100) * SVG_VIEW_BOX,
      }
    : undefined;

  return {
    ...config,

    show,
    group_config: groupConfig
      ? {
          ...groupConfig,
          svg: groupSvg,
        }
      : groupConfig,

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
    bar_mode: barMode,
    zero_ratio: config.zero_ratio ?? (symmetricalBidirectional ? 0.5 : getZeroRatio(horseshoeScale)),

    state_map: stateMap,

    color_stops: colorStopsConfig,
    colorstops: colorStopsConfig,
    colorStops,
    colorStopsMinMax,

    horseshoe_background: {
      ...horseshoeBackground,
      styles: {
        ...ConfigHelper.toStyleDict(horseshoeBackground.styles),
      },
    },

    horseshoe_scale: {
      ...horseshoeScale,
      linecap: normalizeLinecap(horseshoeScale.linecap),
      styles: {
        fill: horseshoeScale.color,
        ...ConfigHelper.toStyleDict(horseshoeScale.styles),
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
        ...ConfigHelper.toStyleDict(horseshoeState.styles),
      },
    },

    horseshoe_labels: {
      ...horseshoeLabels,
      stringstate_level: normalizeStringstateLabelConfig(horseshoeLabels.stringstate_level),
      stringstate_mode: normalizeStringstateLabelConfig(horseshoeLabels.stringstate_mode),
      background: {
        ...(horseshoeLabels.background ?? {}),
        styles: {
          ...ConfigHelper.toStyleDict(horseshoeLabels.background?.styles),
        },
      },
      badges: {
        ...(horseshoeLabels.badges ?? {}),
        styles: {
          ...ConfigHelper.toStyleDict(horseshoeLabels.badges?.styles),
        },
      },
      styles: {
        fill: 'var(--primary-text-color)',
        'font-size': '6px',
        ...ConfigHelper.toStyleDict(horseshoeLabels.styles),
      },
    },

    // Tickmark styles are normalized per sub-block so renderers can apply styleMap directly.
    horseshoe_tickmarks: {
      ...horseshoeTickmarks,
      background: {
        ...(horseshoeTickmarks.background ?? {}),
        styles: {
          ...ConfigHelper.toStyleDict(horseshoeTickmarks.background?.styles),
        },
      },
      ticks_major: horseshoeTickmarks.ticks_major
        ? {
            ...horseshoeTickmarks.ticks_major,
            styles: {
              ...ConfigHelper.toStyleDict(horseshoeTickmarks.ticks_major?.styles),
            },
          }
        : horseshoeTickmarks.ticks_major,
      ticks_minor: horseshoeTickmarks.ticks_minor
        ? {
            ...horseshoeTickmarks.ticks_minor,
            styles: {
              ...ConfigHelper.toStyleDict(horseshoeTickmarks.ticks_minor?.styles),
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
export function getGaugeStateData(config, templates, entityIndex, entity, entityConfig, colorStopMode) {
  const item = {
    entity_index: entityIndex,
  };

  // Resolve templates before normalization because template output may affect scale, styles, or state maps.
  const resolvedConfig = templates.getJsTemplateOrValue(item, config, {
    resolveKeys: true,
  });

  const runtimeConfig = normalizeRuntimeConfig(resolvedConfig, colorStopMode);

  let value = entity.state;

  if (entityConfig?.attribute && entity.attributes?.[entityConfig.attribute] !== undefined) {
    value = entity.attributes[entityConfig.attribute];
  }

  if (runtimeConfig.state_map?.type === 'rank_state') {
    // Step 1: keep the original numeric color stops as source data for raw value -> rank lookup.
    const sourceColorStops = runtimeConfig.colorStops;
    const numericValue = Number(value);
    let activeSourceStop = sourceColorStops.colors[sourceColorStops.colors.length - 1];

    // Step 2: translate the raw numeric entity value through the original color-stop thresholds.
    if (numericValue <= Number(sourceColorStops.colors[0].value)) {
      activeSourceStop = sourceColorStops.colors[0];
    } else if (numericValue >= Number(sourceColorStops.colors[sourceColorStops.colors.length - 1].value)) {
      activeSourceStop = sourceColorStops.colors[sourceColorStops.colors.length - 1];
    } else {
      for (let index = 0; index < sourceColorStops.colors.length - 1; index += 1) {
        const startColorStop = sourceColorStops.colors[index];
        const endColorStop = sourceColorStops.colors[index + 1];

        if (numericValue >= Number(startColorStop.value) && numericValue < Number(endColorStop.value)) {
          activeSourceStop = startColorStop;
          break;
        }
      }
    }

    // Step 3: collect one representative render color for every rank.
    const sourceColorByRank = new Map();

    sourceColorStops.colors.forEach((colorStop) => {
      const rankKey = String(colorStop.rank);

      if (!sourceColorByRank.has(rankKey)) {
        sourceColorByRank.set(rankKey, colorStop.color);
      }
    });

    // Step 4: convert rank->state entries into the value-space expected by existing string-state rendering.
    const rankedStateMap = {
      ...runtimeConfig.state_map,
      map: runtimeConfig.state_map.map.map((entry, index) => ({
        ...entry,
        value: index + 0.5,
        color: entry.color ?? sourceColorByRank.get(String(entry.rank)),
      })),
    };
    // Step 5: use the active rank from the source stop to find the derived string state.
    const mappedStateIndex = rankedStateMap.map.findIndex((entry) => String(entry.rank) === String(activeSourceStop.rank));
    const mappedState = {
      ...rankedStateMap.map[mappedStateIndex],
      color: activeSourceStop.color,
      source_value: value,
      source_color_stop: activeSourceStop,
    };
    // Step 6: build ranked render color stops so scale, state, labels, and backgrounds share one value-space.
    const rankedColorStops = {
      ...sourceColorStops,
      colors: rankedStateMap.map.map((entry, index) => ({
        value: index,
        color: entry.color,
        rank: entry.rank,
        state: entry.state,
      })),
    };
    // Step 7: switch this horseshoe runtime scale from numeric source values to ranked render values.
    const rankedScale = {
      ...runtimeConfig.horseshoe_scale,
      min: 0,
      max: rankedStateMap.map.length,
    };
    const firstColorStop = rankedColorStops.colors[0];
    const lastColorStop = rankedColorStops.colors[rankedColorStops.colors.length - 1];

    // Step 8: publish a normal runtime config; downstream shapes/renderers do not know about rank_state.
    runtimeConfig.sourceColorStops = sourceColorStops;
    runtimeConfig.colorStops = rankedColorStops;
    runtimeConfig.colorStopsMinMax = ColorStops.normalize({
      [rankedScale.min]: firstColorStop.color,
      [rankedScale.max]: lastColorStop.color,
    });
    runtimeConfig.horseshoe_scale = rankedScale;
    runtimeConfig.state_map = rankedStateMap;
    runtimeConfig.mapped_state = mappedState;

    return {
      runtimeConfig,
      rawState: entity.state,
      mappedState,
      value: Number(mappedState.value),
    };
  }

  // State maps may replace textual entity states before the gauge receives its numeric value.
  const mappedState = runtimeConfig.state_map
    ? getStateMapItem(runtimeConfig.state_map.map, entity.state, value)
    : undefined;
  const nextValue = Number(mappedState?.value ?? value);

  runtimeConfig.mapped_state = mappedState;

  return {
    runtimeConfig,
    rawState: entity.state,
    mappedState,
    value: nextValue,
  };
}
