import ColorStops from './color-stops.js';
import { SVG_VIEW_BOX } from './const.js';

const DEFAULT_STATE_ANIMATION = {
  enabled: true,
  duration: 2500,
  easing: 'ease-out',
  debug: false,
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

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

export function getZeroRatio(horseshoeScale) {
  const min = Number(horseshoeScale.min);
  const max = Number(horseshoeScale.max);

  if (min >= 0 || max <= 0) {
    return 0;
  }

  return clamp((0 - min) / (max - min), 0, 1);
}

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

  const horseshoeScale = config.horseshoe_scale;

  if (horseshoeScale.min === undefined) {
    throw new Error('[V2] Missing horseshoe_scale.min');
  }

  if (horseshoeScale.max === undefined) {
    throw new Error('[V2] Missing horseshoe_scale.max');
  }

  if (!horseshoeScale.type) {
    throw new Error('[V2] Missing horseshoe_scale.type');
  }

  if (horseshoeScale.type === 'spline' && !horseshoeScale.spline) {
    throw new Error('[V2] Missing horseshoe_scale.spline');
  }

  const horseshoeScaleV2 = {
    min: 0,
    max: 100,
    width: 6,
    color: 'var(--primary-background-color)',
    linecap: 'round',
    type: 'linear',
    ...(config.horseshoe_scale ?? {}),
  };

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

  const colorStopsConfig = config.color_stops ?? config.colorstops;
  const colorStops = ColorStops.ensureMinimumStops(ColorStops.normalize(colorStopsConfig), horseshoeScaleV2.max);

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

    svg: {
      xpos: (xpos / 100) * SVG_VIEW_BOX,
      ypos: (ypos / 100) * SVG_VIEW_BOX,
      radius: (radius / 100) * SVG_VIEW_BOX,
      tickmarks_radius: (tickmarksRadius / 100) * SVG_VIEW_BOX,
    },

    start_angle: config.start_angle ?? 90 + (360 - arcDegrees) / 2,
    bar_mode: config.bar_mode ?? 'normal',
    zero_ratio: config.zero_ratio ?? getZeroRatio(horseshoeScaleV2),

    state_map: config.state_map ?? horseshoeState.state_map ?? [],

    color_stops: colorStopsConfig,
    colorstops: colorStopsConfig,
    colorStops,

    horseshoe_scale: {
      ...horseshoeScaleV2,
      linecap: normalizeLinecap(horseshoeScaleV2.linecap),
      styles: {
        fill: horseshoeScaleV2.color,
        ...toStyleDict(horseshoeScaleV2.styles),
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
      styles: {
        fill: 'var(--primary-text-color)',
        'font-size': '6px',
        ...toStyleDict(horseshoeLabels.styles),
      },
    },
  };
}

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

export function getGaugeStateData(config, templates, entityIndex, entity, entityConfig) {
  const item = {
    entity_index: entityIndex,
  };

  const resolvedConfig = templates.getJsTemplateOrValue(item, config, {
    resolveKeys: true,
  });

  const runtimeConfig = normalizeRuntimeConfig(resolvedConfig);

  let value = entity.state;

  if (entityConfig?.attribute && entity.attributes?.[entityConfig.attribute] !== undefined) {
    value = entity.attributes[entityConfig.attribute];
  }

  const mappedState = getStateMapItem(runtimeConfig.state_map, entity.state, value);
  const nextValue = Number(mappedState?.value ?? value);

  return {
    runtimeConfig,
    rawState: entity.state,
    mappedState,
    value: nextValue,
  };
}
