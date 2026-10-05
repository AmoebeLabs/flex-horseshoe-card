import ColorStops from "./color-stops.js";
import ConfigHelper from "./config-helper.js";
import Templates from "./templates.js";
import { clamp } from "./frontend_mods/common/number/clamp.ts";

/**
 * Default timing and easing used by Horseshoe state animations.
 */
const DEFAULT_STATE_ANIMATION = {
  enabled: true,
  duration: 2500,
  easing: "ease-out",
  debug: false,
};

/**
 * Adds a default entity index, bar mode and display settings before a Horseshoe receives its HA entity.
 */
export function normalizeBaseConfig(config) {
  return {
    entity_index: config.entity_index ?? 0,
    bar_mode: "normal",
    ...config,
    show: Templates.isJsTemplate(config.show) ? config.show : {
      horseshoe: true,
      horseshoe_style: "fixed",
      labels_at: "none",
      state_progress: true,
      state_marker: false,
      ...(config.show ?? {}),
    },
  };
}

/**
 * Normalizes linecap configuration to explicit start and end values.
 */
export function normalizeLinecap(linecap) {
  if (typeof linecap === "string") {
    return {
      start: linecap,
      end: linecap,
    };
  }

  if (linecap && typeof linecap === "object") {
    return {
      start: linecap.start ?? "butt",
      end: linecap.end ?? "butt",
    };
  }

  return {
    start: "butt",
    end: "butt",
  };
}

const STRINGSTATE_RELATIONS = ["before", "current", "after"];

/**
 * Normalizes styles for the before, current and after labels in string-state modes.
 */
function normalizeStringstateLabelConfig(config) {
  const normalized = {
    state_map: {
      map: [],
    },
    before: {
      styles: {},
    },
    current: {
      styles: {},
    },
    after: {
      styles: {},
    },
    ...(config ?? {}),
  };

  STRINGSTATE_RELATIONS.forEach((relation) => {
    if (normalized[relation]) {
      normalized[relation] = {
        ...normalized[relation],
        styles: ConfigHelper.toStyleDict(normalized[relation].styles),
      };
    }
  });

  normalized.state_map = {
    ...normalized.state_map,
    map: normalized.state_map.map.map((entry) => {
      const normalizedEntry = {
        ...entry,
        styles: ConfigHelper.toStyleDict(entry.styles),
      };

      STRINGSTATE_RELATIONS.forEach((relation) => {
        normalizedEntry[relation] = {
          ...(normalizedEntry[relation] ?? {}),
          styles: ConfigHelper.toStyleDict(normalizedEntry[relation]?.styles),
        };
      });

      return normalizedEntry;
    }),
  };

  return normalized;
}

/**
 * Returns where value zero falls between the configured Horseshoe scale bounds.
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
 * Completes the Horseshoe config after JavaScript evaluation by filling scale,
 * state, marker, label and tickmark settings used to draw the gauge.
 */
export function translateHorseshoeConfig(config, colorStopMode) {
  const normalizedStops = { gap: 0, ...ColorStops.normalize(config.color_stops, colorStopMode) };
  const show = {
    horseshoe: true,
    horseshoe_style: "fixed",
    scale_style: "fixed",
    labels_at: "none",
    state_progress: true,
    state_marker: false,
    ...(config.show ?? {}),
  };

  if (!config.horseshoe_scale) {
    throw new Error("[V2] Missing horseshoe_scale");
  }

  // Use the selected color-stop scale for missing bounds; explicit Horseshoe scale values take priority.
  const defaultColorStopScale = normalizedStops.scales.default ?? {};
  const horseshoeScale = {
    min: defaultColorStopScale.min ?? 0,
    max: defaultColorStopScale.max ?? 100,
    width: 6,
    color: "var(--primary-background-color)",
    linecap: "round",
    type: "linear",
    ...(config.horseshoe_scale ?? {}),
  };

  if (horseshoeScale.min === undefined) {
    throw new Error("[V2] Missing horseshoe_scale.min");
  }

  if (horseshoeScale.max === undefined) {
    throw new Error("[V2] Missing horseshoe_scale.max");
  }

  if (!horseshoeScale.type) {
    throw new Error("[V2] Missing horseshoe_scale.type");
  }

  if (
    (horseshoeScale.type === "splineorg" || horseshoeScale.type === "spline") &&
    !horseshoeScale.spline
  ) {
    throw new Error("[V2] Missing horseshoe_scale.spline");
  }

  const horseshoeState = {
    width: 12,
    color: "var(--primary-color)",
    linecap: "round",
    mode: "value",
    segment_gap: normalizedStops.gap,
    animation: DEFAULT_STATE_ANIMATION,
    ...(config.horseshoe_state ?? {}),
  };

  // A path-attached marker defaults to a circle. A marker attached to the center needs an icon.
  const markerSource = config.horseshoe_marker ?? {};
  const markerAttachTo = markerSource.attach_to ?? "path";
  const horseshoeMarker = {
    attach_to: markerAttachTo,
    shape:
      markerAttachTo === "path" && markerSource.icon === undefined
        ? (markerSource.shape ?? "circle")
        : markerSource.shape,
    icon: markerSource.icon,
    rotate: markerSource.rotate ?? 0,
    offset: markerSource.offset ?? 0,
    size:
      markerAttachTo === "path"
        ? (markerSource.size ?? horseshoeState.width)
        : markerSource.size,
    aspectratio: markerSource.aspectratio ?? 1,
    start_offset: markerSource.start_offset ?? 0,
    end_offset: markerSource.end_offset ?? 0,
    styles: ConfigHelper.toStyleDict(markerSource.styles),
  };

  if (!["path", "center"].includes(horseshoeMarker.attach_to)) {
    throw new Error(
      `[horseshoes] horseshoe_marker.attach_to '${horseshoeMarker.attach_to}' is invalid [path, center]`,
    );
  }

  if (
    horseshoeMarker.shape !== undefined &&
    !["circle", "triangle"].includes(horseshoeMarker.shape)
  ) {
    throw new Error(
      `[horseshoes] horseshoe_marker.shape '${horseshoeMarker.shape}' is invalid [circle, triangle]`,
    );
  }

  if (
    markerSource.icon !== undefined &&
    (typeof markerSource.icon !== "string" || markerSource.icon.trim() === "")
  ) {
    throw new Error("[horseshoes] horseshoe_marker.icon must be a non-empty string");
  }

  if (markerSource.icon !== undefined && markerSource.shape !== undefined) {
    throw new Error("[horseshoes] horseshoe_marker accepts either icon or shape, not both");
  }

  if (horseshoeMarker.attach_to === "center" && horseshoeMarker.icon === undefined) {
    throw new Error("[horseshoes] center-attached horseshoe_marker requires icon");
  }

  if (
    horseshoeMarker.attach_to === "path" &&
    (!Number.isFinite(Number(horseshoeMarker.size)) || Number(horseshoeMarker.size) <= 0)
  ) {
    throw new Error("[horseshoes] path-attached horseshoe_marker.size must be greater than zero");
  }

  if (!Number.isFinite(Number(horseshoeMarker.aspectratio)) || Number(horseshoeMarker.aspectratio) <= 0) {
    throw new Error("[horseshoes] horseshoe_marker.aspectratio must be greater than zero");
  }

  ["rotate", "offset", "start_offset", "end_offset"].forEach((field) => {
    if (!Number.isFinite(Number(horseshoeMarker[field]))) {
      throw new Error(`[horseshoes] horseshoe_marker.${field} must be a number`);
    }
  });

  if (horseshoeState.mode === "stringstate_mode" || horseshoeState.mode === "stringstate_level") {
    horseshoeState.styles = {
      transition: "fill 600ms ease, opacity 600ms ease, filter 600ms ease",
      ...ConfigHelper.toStyleDict(horseshoeState.styles),
    };
  }

  const horseshoeBackground = {
    ...(config.horseshoe_background ?? {}),
  };

  const horseshoeLabels = {
    offset: 12,
    distance_min: 0,
    ellipsis: 0,
    ...(config.horseshoe_labels ?? {}),
  };

  const horseshoeTickmarks = {
    ...(config.horseshoe_tickmarks ?? {}),
  };

  const stateMap = config.state_map ?? horseshoeState.state_map ?? { map: [] };

  const colorStops = ColorStops.ensureMinimumStops(
    normalizedStops,
    horseshoeScale.max,
  );

  const radius = config.radius ?? 45;
  const tickmarksRadius = config.tickmarks_radius ?? 43;
  // The path generator draws a 360-degree Horseshoe as a full circle using two SVG arc commands.
  const arcDegrees = config.arc_degrees ?? 260;
  const barMode = config.bar_mode ?? "normal";
  const supportedBarModes = [
    "normal",
    "bidirectional",
    "bidirectional_symmetrical",
    "bidirectional_linear",
    "absolute",
  ];

  if (!supportedBarModes.includes(barMode)) {
    throw new Error(
      `[V2] Invalid bar_mode '${barMode}' [${supportedBarModes.join(", ")}]`,
    );
  }

  // Absolute bars use the physical arc start as zero. A 0..max scale shares
  // one magnitude range, while a negative min gives each sign its own range.
  if (barMode === "absolute") {
    if (Number(horseshoeScale.min) > 0 || Number(horseshoeScale.max) <= 0) {
      throw new Error(
        "[V2] absolute bar_mode requires horseshoe_scale.min <= 0 and horseshoe_scale.max > 0",
      );
    }

    if (config.zero_ratio !== undefined) {
      throw new Error("[V2] absolute bar_mode does not support zero_ratio");
    }
  }

  const bidirectionalGradient =
    ["autominmax", "minmaxgradient", "lineargradient"].includes(
      show.horseshoe_style,
    ) &&
    (barMode === "bidirectional" ||
      barMode === "bidirectional_symmetrical" ||
      barMode === "bidirectional_linear" ||
      barMode === "absolute");

  if (
    bidirectionalGradient &&
    (horseshoeScale.min < 0 || barMode === "absolute") &&
    !colorStops.colors.some((colorStop) => Number(colorStop.value) < 0)
  ) {
    throw new Error(
      `[V2] ${show.horseshoe_style} with ${barMode} requires a color_stop below 0`,
    );
  }

  if (
    bidirectionalGradient &&
    horseshoeScale.max > 0 &&
    !colorStops.colors.some((colorStop) => Number(colorStop.value) > 0)
  ) {
    throw new Error(
      `[V2] ${show.horseshoe_style} with ${barMode} requires a color_stop above 0`,
    );
  }

  const symmetricalBidirectional =
    barMode === "bidirectional" || barMode === "bidirectional_symmetrical";
  const itemXpos =
    config.xpos ??
    config.horseshoe_position?.xpos ??
    config.horseshoe_position?.cx ??
    50;
  const itemYpos =
    config.yposc ||
    (config.ypos ??
      config.horseshoe_position?.ypos ??
      config.horseshoe_position?.cy ??
      50);
  return {
    ...config,

    show,
    xpos: itemXpos,
    ypos: itemYpos,
    radius,
    tickmarks_radius: tickmarksRadius,
    arc_degrees: arcDegrees,

    start_angle: config.start_angle ?? 90 + (360 - arcDegrees) / 2,
    bar_mode: barMode,
    zero_ratio:
      config.zero_ratio ??
      (symmetricalBidirectional ? 0.5 : getZeroRatio(horseshoeScale)),

    state_map: stateMap,

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
        opacity: 1,
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
        opacity: 1,
        fill: horseshoeState.color,
        ...ConfigHelper.toStyleDict(horseshoeState.styles),
      },
    },

    horseshoe_marker: horseshoeMarker,
    rotate: config.rotate ?? 0,
    flip: config.flip ?? "none",

    horseshoe_labels: {
      ...horseshoeLabels,
      stringstate_level: normalizeStringstateLabelConfig(
        horseshoeLabels.stringstate_level,
      ),
      stringstate_mode: normalizeStringstateLabelConfig(
        horseshoeLabels.stringstate_mode,
      ),
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
        fill: "var(--primary-text-color)",
        "font-size": "6px",
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
              ...ConfigHelper.toStyleDict(
                horseshoeTickmarks.ticks_major?.styles,
              ),
            },
          }
        : horseshoeTickmarks.ticks_major,
      ticks_minor: horseshoeTickmarks.ticks_minor
        ? {
            ...horseshoeTickmarks.ticks_minor,
            styles: {
              ...ConfigHelper.toStyleDict(
                horseshoeTickmarks.ticks_minor?.styles,
              ),
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
 * Reads the configured HA entity state or attribute and returns its numeric
 * Horseshoe value, matching state-map row and scale. Rank-state mapping gives
 * each rank one scale slot while keeping configured scale bounds and map colors.
 */
export function getGaugeStateData(config, entity, entityConfig, colorStops) {
  let value = entity.state;

  if (
    entityConfig?.attribute &&
    entity.attributes?.[entityConfig.attribute] !== undefined
  ) {
    value = entity.attributes[entityConfig.attribute];
  }

  const stringColorStops = colorStops.colors.filter(
    (colorStop) => colorStop.state !== undefined,
  );

  if (stringColorStops.length) {
    // Give HA state color stops numeric Horseshoe values so state bands and labels can use them.
    const orderedStops = stringColorStops.some(
      (colorStop) => colorStop.rank !== undefined,
    )
      ? [...stringColorStops].sort((a, b) => Number(a.rank) - Number(b.rank))
      : stringColorStops;
    const stateMap = {
      map: orderedStops.map(({ color, styles, ...state }, index) => ({ ...state, value: index })),
    };
    const mappedState = stateMap.map.find(
      (entry) => String(entry.state) === String(value),
    );
    return {
      stateMap,
      scale: config.horseshoe_scale,
      rawState: entity.state,
      mappedState,
      value: Number(mappedState.value),
    };
  }

  if (config.state_map?.type === "rank_state") {
    // Find the color-stop rank selected by the HA numeric value before placing its state-map label.
    const sourceColorStops = colorStops;
    const numericValue = Number(value);
    let activeSourceStop =
      sourceColorStops.colors[sourceColorStops.colors.length - 1];

    if (numericValue <= Number(sourceColorStops.colors[0].value)) {
      activeSourceStop = sourceColorStops.colors[0];
    } else if (
      numericValue >=
      Number(sourceColorStops.colors[sourceColorStops.colors.length - 1].value)
    ) {
      activeSourceStop =
        sourceColorStops.colors[sourceColorStops.colors.length - 1];
    } else {
      for (
        let index = 0;
        index < sourceColorStops.colors.length - 1;
        index += 1
      ) {
        const startColorStop = sourceColorStops.colors[index];
        const endColorStop = sourceColorStops.colors[index + 1];

        if (
          numericValue >= Number(startColorStop.value) &&
          numericValue < Number(endColorStop.value)
        ) {
          activeSourceStop = startColorStop;
          break;
        }
      }
    }

    // Half-step values center rank labels in their state bands. Keep configured map colors separate from palette colors.
    const rankedStateMap = {
      ...config.state_map,
      map: config.state_map.map.map((entry, index) => ({
        ...entry,
        value: index + 0.5,
      })),
    };
    // Keep the HA value beside the selected rank's Horseshoe value.
    const mappedStateIndex = rankedStateMap.map.findIndex(
      (entry) => String(entry.rank) === String(activeSourceStop.rank),
    );
    const mappedState = {
      ...rankedStateMap.map[mappedStateIndex],
      source_value: value,
    };
    // Give each configured rank one slot on the Horseshoe scale.
    const rankedScale = {
      ...config.horseshoe_scale,
      min: 0,
      max: rankedStateMap.map.length,
    };
    return {
      stateMap: rankedStateMap,
      scale: rankedScale,
      rawState: entity.state,
      mappedState,
      value: Number(mappedState.value),
    };
  }

  // Use the matching state-map value when an HA state or configured attribute maps to a numeric value.
  const mappedState = config.state_map
    ? getStateMapItem(config.state_map.map, entity.state, value)
    : undefined;
  const nextValue = Number(mappedState?.value ?? value);

  return {
    stateMap: config.state_map,
    scale: config.horseshoe_scale,
    rawState: entity.state,
    mappedState,
    value: nextValue,
  };
}

/**
 * Converts HA state color stops to numeric Horseshoe values and adds palette
 * colors for rank-state rows. Configured state-map colors take priority over
 * colors supplied by matching color stops.
 */
export function buildGaugeColorStops(config, runtime, sourceStops) {
  let colorStops = sourceStops;
  const stringStops = sourceStops.colors.filter((stop) => stop.state !== undefined);
  if (stringStops.length) {
    const orderedStops = stringStops.some((stop) => stop.rank !== undefined)
      ? [...stringStops].sort((a, b) => Number(a.rank) - Number(b.rank))
      : stringStops;
    colorStops = {
      ...sourceStops,
      colors: orderedStops.map((stop, index) => ({ ...stop, value: index })),
    };
  } else if (config.state_map.type === "rank_state") {
    const sourceColorByRank = new Map();
    sourceStops.colors.forEach((stop) => {
      const rank = String(stop.rank);
      if (!sourceColorByRank.has(rank)) sourceColorByRank.set(rank, stop.color);
    });
    colorStops = {
      ...sourceStops,
      colors: runtime.stateMap.map.map((entry, index) => ({
        value: index,
        color: entry.color ?? sourceColorByRank.get(String(entry.rank)),
        rank: entry.rank,
        state: entry.state,
      })),
    };
  }

  colorStops = ColorStops.ensureMinimumStops(colorStops, runtime.scale.max);
  const minMax = colorStops.colors.length
    ? ColorStops.normalize({
        [runtime.scale.min]: colorStops.colors[0].color,
        [runtime.scale.max]: colorStops.colors[colorStops.colors.length - 1].color,
      })
    : ColorStops.normalize();
  return { colorStops, minMax };
}
