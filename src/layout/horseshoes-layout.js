// src/layout/layout-horseshoes.js

import Merge from '../merge';
import ColorStops from '../color-stops';

import { SVG_VIEW_BOX } from '../const.js';

const HORSESHOE_RADIUS_SIZE = 0.45 * SVG_VIEW_BOX;
const TICKMARKS_RADIUS_SIZE = 0.43 * SVG_VIEW_BOX;
const HORSESHOE_PATH_LENGTH = ((2 * 260) / 360) * Math.PI * HORSESHOE_RADIUS_SIZE;
const CIRCLE_PATH_LENGTH = 2 * Math.PI * HORSESHOE_RADIUS_SIZE;

const DEFAULT_HORSESHOE_SHOW = {
  horseshoe: true,
  scale_tickmarks: false,
  horseshoe_style: 'fixed',
};

const DEFAULT_HORSESHOE_POSITION = {
  xpos: 50,
  ypos: 50,
  horseshoe_radius: HORSESHOE_RADIUS_SIZE,
  tickmarks_radius: TICKMARKS_RADIUS_SIZE,
};

const DEFAULT_HORSESHOE_SCALE = {
  min: 0,
  max: 100,
  width: 6,
  color: 'var(--primary-background-color)',
};

const DEFAULT_HORSESHOE_STATE = {
  width: 12,
  color: 'var(--primary-color)',
};

export default class HorseshoesLayout {
  static setConfig(config, templates) {
    const horseshoeConfigs = HorseshoesLayout.getConfig(config);

    // console.log('[HorseshoesLayout setConfig] configs', horseshoeConfigs);

    return horseshoeConfigs.map((horseshoeConfig, index) => {
      try {
        // console.log('[HorseshoesLayout normalize start]', {
        //   index,
        //   horseshoeConfig,
        // });

        return HorseshoesLayout.normalizeConfig(horseshoeConfig, index, templates);
      } catch (error) {
        console.error('[HorseshoesLayout normalize error]', {
          index,
          horseshoeConfig,
          error,
          message: error?.message,
          stack: error?.stack,
        });

        throw error;
      }
    });
  }

  static getConfig(config) {
    const legacyConfig = HorseshoesLayout.getLegacyConfig(config);

    const rawHorseshoes = [...(legacyConfig ? [legacyConfig] : []), ...(Array.isArray(config.layout?.horseshoes) ? config.layout.horseshoes : [])];

    return rawHorseshoes
      .map((horseshoeConfig) =>
        // eslint-disable-next-line @stylistic/implicit-arrow-linebreak
        Merge.mergeDeep(
          {},
          {
            show: DEFAULT_HORSESHOE_SHOW,
            horseshoe_scale: DEFAULT_HORSESHOE_SCALE,
            horseshoe_state: DEFAULT_HORSESHOE_STATE,
            entity_index: 0,
          },
          horseshoeConfig,
        ),
      )
      .filter((horseshoeConfig) => horseshoeConfig.show?.horseshoe !== false);
  }

  static getLegacyConfig(config) {
    const legacyConfig = {};

    ['show', 'horseshoe_scale', 'horseshoe_state', 'color_stops', 'styles'].forEach((field) => {
      if (config[field] !== undefined) {
        legacyConfig[field] = config[field];
      }
    });

    return Object.keys(legacyConfig).length > 0 ? legacyConfig : undefined;
  }

  static normalize(colorStopsConfig) {
    if (!colorStopsConfig) {
      return { colors: [] };
    }

    // Already normalized
    if (ColorStops.isPlainObject(colorStopsConfig) && Array.isArray(colorStopsConfig.colors)) {
      return {
        ...colorStopsConfig,
        colors: colorStopsConfig.colors
          .map((entry) => ColorStops.normalizeColorEntry(entry))
          .filter(Boolean)
          .sort((a, b) => a.value - b.value),
      };
    }

    // Old FHC root-object shape:
    // color_stops:
    //   10: red
    //   15: green
    if (ColorStops.isPlainObject(colorStopsConfig)) {
      return {
        colors: Object.entries(colorStopsConfig)
          .map(([rawValue, color]) => ColorStops.normalizeColorPair(rawValue, color))
          .filter(Boolean)
          .sort((a, b) => a.value - b.value),
      };
    }

    // Array shape
    if (Array.isArray(colorStopsConfig)) {
      return {
        colors: colorStopsConfig
          .flatMap((entry) => ColorStops.normalizeColorArrayEntry(entry))
          .filter(Boolean)
          .sort((a, b) => a.value - b.value),
      };
    }

    return { colors: [] };
  }

  static normalizeConfig(horseshoeConfig, index, templates) {
    const entityIndex = horseshoeConfig.entity_index ?? 0;

    const show = horseshoeConfig.show;
    const horseshoeScale = horseshoeConfig.horseshoe_scale;
    const horseshoeState = horseshoeConfig.horseshoe_state;

    const xpos = horseshoeConfig.xpos ?? horseshoeConfig.horseshoe_position?.xpos ?? horseshoeConfig.horseshoe_position?.cx ?? DEFAULT_HORSESHOE_POSITION.xpos ?? DEFAULT_HORSESHOE_POSITION.cx ?? 50;

    const ypos = horseshoeConfig.ypos ?? horseshoeConfig.horseshoe_position?.ypos ?? horseshoeConfig.horseshoe_position?.cy ?? DEFAULT_HORSESHOE_POSITION.ypos ?? DEFAULT_HORSESHOE_POSITION.cy ?? 50;

    if (horseshoeScale.min == null || horseshoeScale.max == null) {
      throw Error(`No horseshoe min/max for scale defined for horseshoe ${index}`);
    }

    const colorStopsConfig = horseshoeConfig.color_stops;

    let colorStops;
    let colorStopsMinMax;
    let color0;
    let color1;

    if (colorStopsConfig != null) {
      const resolvedColorStops = templates.getJsTemplateOrValue({ entity_index: entityIndex }, colorStopsConfig, { resolveKeys: true });

      colorStops = ColorStops.ensureMinimumStops(ColorStops.normalize(resolvedColorStops), horseshoeScale.max);

      const colorStopColors = colorStops.colors;

      if (Array.isArray(colorStopColors) && colorStopColors.length >= 2) {
        const firstStop = colorStopColors[0];
        const lastStop = colorStopColors[colorStopColors.length - 1];

        if (firstStop?.color != null && lastStop?.color != null) {
          if (horseshoeState.color == null) {
            horseshoeState.color = firstStop.color;
          }

          colorStopsMinMax = ColorStops.normalize({
            [horseshoeScale.min]: firstStop.color,
            [horseshoeScale.max]: lastStop.color,
          });
          // colorStopsMinMax = {
          //   [horseshoeScale.min]: firstStop.color,
          //   [horseshoeScale.max]: lastStop.color,
          // };
          color0 = firstStop.color;
          color1 = lastStop.color;
          // console.log('normalizeConfig, colorStopsMinMax = ', colorStopsMinMax, 'color0/color1 = ', color0, color1);
        }
      }
    }

    const radius = horseshoeConfig.radius ?? 45;
    const tickmarksRadius = horseshoeConfig.tickmarks_radius ?? 43;
    const arcDegrees = horseshoeConfig.arc_degrees ?? 260;

    const radiusSize = (radius / 100) * SVG_VIEW_BOX;
    const tickmarksRadiusSize = (tickmarksRadius / 100) * SVG_VIEW_BOX;

    const horseshoePathLength = ((2 * arcDegrees) / 360) * Math.PI * radiusSize;
    const circlePathLength = 2 * Math.PI * radiusSize;

    return {
      ...horseshoeConfig,

      entity_index: entityIndex,

      show,
      fill: horseshoeConfig.fill ?? 'rgba(0, 0, 0, 0)',

      xpos,
      ypos,

      bar_mode: horseshoeConfig.bar_mode ?? 'normal',

      horseshoe_scale: horseshoeScale,
      horseshoe_state: horseshoeState,

      radius,
      tickmarks_radius: tickmarksRadius,
      arc_degrees: arcDegrees,

      radiusSize,
      tickmarksRadiusSize,
      horseshoePathLength,
      circlePathLength,

      color_stops: colorStopsConfig,
      colorStops,
      colorStopsMinMax,
      color0,
      color1,
      angleCoords: {
        x1: '0%',
        y1: '0%',
        x2: '100%',
        y2: '0%',
      },

      color1_offset: '0%',
    };
  }
}
