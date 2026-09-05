/**
 * Converts the original scale_tickmarks shorthand at the configuration boundary.
 * Both horseshoe implementations consume the same normalized tickmark contract.
 */
export function applyLegacyScaleTickmarkConfig(horseshoeConfig) {
  if (horseshoeConfig.show?.scale_tickmarks !== true) return horseshoeConfig;

  const existingTickmarks = horseshoeConfig.horseshoe_tickmarks ?? {};

  if (existingTickmarks.ticks_major || existingTickmarks.ticks_minor) {
    return {
      ...horseshoeConfig,
      show: {
        ...horseshoeConfig.show,
        tickmarks: horseshoeConfig.show.tickmarks ?? horseshoeConfig.show.ticks ?? true,
      },
    };
  }

  const scale = horseshoeConfig.horseshoe_scale ?? {};
  const min = Number(scale.min ?? 0);
  const max = Number(scale.max ?? 100);
  const range = max - min;
  const ticksize = scale.ticksize ?? (range ? range / 10 : undefined);
  const radius = Number(horseshoeConfig.radius ?? 45);
  const tickmarksRadius = Number(horseshoeConfig.tickmarks_radius ?? 43);
  const tickWidth = Number(scale.width ?? 6);

  return {
    ...horseshoeConfig,
    show: {
      ...horseshoeConfig.show,
      tickmarks: true,
    },
    horseshoe_tickmarks: {
      ...existingTickmarks,
      ticks_major: {
        ticksize,
        shape: 'circle',
        radius: tickWidth / 2,
        width: tickWidth,
        thickness: tickWidth,
        offset: tickmarksRadius - radius,
        styles: [
          ...(Array.isArray(existingTickmarks.styles) ? existingTickmarks.styles : existingTickmarks.styles ? [existingTickmarks.styles] : []),
          { fill: scale.color ?? 'var(--primary-background-color)' },
        ],
      },
    },
  };
}

/**
 * Builds numeric tick values outward from the supplied anchor.
 * Normal scales anchor at min; bidirectional and absolute scales anchor at zero.
 */
export function buildTickValues(min, max, ticksize, anchor) {
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
 * Resolves the enabled tickmark layers from the new tickmarks setting.
 *
 * A boolean is the shorthand for both layers. An object allows major and
 * minor ticks to be controlled independently. The old show.ticks value is
 * only used when the new show.tickmarks setting is absent, preserving older
 * configurations without making the legacy key the primary API.
 */
export function getTickmarkVisibility(runtimeConfig) {
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
