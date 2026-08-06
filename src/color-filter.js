import { converter, formatRgb } from 'culori';
import ConfigHelper from './config-helper.js';
import Colors from './colors.js';
import Merge from './merge.js';

const COLOR_PROPERTIES = ['fill', 'stroke', 'color', 'stop-color', 'flood-color'];
const FILTER_KEYS = ['grayscale', 'monochrome', 'duotone', 'preserve_neutral', 'lightness', 'brightness', 'contrast', 'saturation', 'opacity'];
const toRgb = converter('rgb');
const toOklch = converter('oklch');

/**
 * Central color-filter engine for styles and color stops.
 *
 * The renderer still receives normal CSS colors. This module resolves the active
 * cascade, transforms real colors with Culori, and returns renderable RGB/RGBA.
 */
export default class ColorFilter {
  /**
   * Merges root, group, item, color-stop, and state filters in visual cascade order.
   *
   * @param {Array<object>} filters - Ordered color_filter configs.
   * @returns {object} One merged filter config.
   */
  static mergeFilters(filters) {
    let mergedFilter = {};

    filters.forEach((filterConfig) => {
      if (!filterConfig) return;
      const resolvedFilter = ConfigHelper.toDict(filterConfig, {
        skipFalse: false,
      });

      const { inherit, ...filter } = resolvedFilter;
      if (inherit === false) {
        mergedFilter = {};
      }

      mergedFilter = Merge.mergeDeep(mergedFilter, filter);
    });

    return mergedFilter;
  }

  /**
   * Applies the relevant filter to every supported color property in a style dict.
   *
   * @param {object} styles - Style dictionary before render.
   * @param {object|Array<object>} colorFilter - Merged filter or ordered cascade.
   * @param {LitElement} card - Card element used to resolve CSS variables.
   * @returns {object} Style dictionary with transformed color properties.
   */
  static applyToStyles(styles, colorFilter, card) {
    const mergedFilter = Array.isArray(colorFilter) ? ColorFilter.mergeFilters(colorFilter) : colorFilter;

    if (!ColorFilter.hasAnyFilter(mergedFilter)) {
      return styles;
    }

    const nextStyles = { ...styles };

    COLOR_PROPERTIES.forEach((property) => {
      if (nextStyles[property] === undefined) return;

      const propertyFilter = ColorFilter.getFilterForProperty(mergedFilter, property);

      if (ColorFilter.hasFilter(propertyFilter)) {
        nextStyles[property] = ColorFilter.applyToColor(nextStyles[property], propertyFilter, card);
      }
    });

    return nextStyles;
  }

  /**
   * Extracts global and property-specific filter settings for one CSS color property.
   *
   * @param {object} colorFilter - Merged color_filter config.
   * @param {string} property - CSS property being transformed.
   * @returns {object} Filter settings for this property.
   */
  static getFilterForProperty(colorFilter, property) {
    const propertyFilter = colorFilter[property] && typeof colorFilter[property] === 'object' ? colorFilter[property] : {};
    const globalFilter = Object.fromEntries(Object.entries(colorFilter).filter(([key]) => FILTER_KEYS.includes(key)));

    return {
      ...globalFilter,
      ...propertyFilter,
    };
  }

  /**
   * Returns true when a merged filter contains at least one active transform.
   *
   * @param {object} filter - Merged color_filter config.
   * @returns {boolean} Whether any transform should run.
   */
  static hasAnyFilter(filter) {
    return FILTER_KEYS.some((key) => filter?.[key] !== undefined) || COLOR_PROPERTIES.some((property) => ColorFilter.hasFilter(ColorFilter.getFilterForProperty(filter ?? {}, property)));
  }

  /**
   * Returns true when a property filter contains at least one active transform.
   *
   * @param {object} filter - Property-level filter config.
   * @returns {boolean} Whether a transform should run.
   */
  static hasFilter(filter) {
    return FILTER_KEYS.some((key) => filter[key] !== undefined);
  }

  /**
   * Resolves one CSS color and applies the fixed color transformation order.
   *
   * @param {string} color - CSS color value.
   * @param {object} filter - Property-level filter config.
   * @param {LitElement} card - Card element used to resolve CSS variables.
   * @returns {string} Renderable RGB/RGBA color.
   */
  static applyToColor(color, filter, card) {
    const colorText = String(color).trim();

    if (colorText === 'none' || colorText === 'currentColor' || colorText === 'inherit' || colorText.startsWith('url(')) {
      return color;
    }

    Colors.setElement(card);
    const rgba = Colors.colorToRGBA(colorText);

    if (!rgba) {
      return color;
    }

    let rgbColor = {
      mode: 'rgb',
      r: rgba[0] / 255,
      g: rgba[1] / 255,
      b: rgba[2] / 255,
      alpha: rgba[3] / 255,
    };

    // Remap phase: convert the source color into a new color family while keeping visual lightness.
    if (filter.grayscale !== undefined) {
      rgbColor = ColorFilter.applyGrayscale(rgbColor, filter.grayscale);
    }

    if (filter.monochrome !== undefined) {
      rgbColor = ColorFilter.applyMonochrome(rgbColor, filter, card);
    }

    if (filter.duotone !== undefined) {
      rgbColor = ColorFilter.applyDuotone(rgbColor, filter, card);
    }

    if (filter.lightness !== undefined) {
      rgbColor = ColorFilter.applyLightness(rgbColor, filter.lightness);
    }

    // Adjustment phase: modify the already-remapped color in a fixed, predictable order.
    if (filter.brightness !== undefined) {
      rgbColor = ColorFilter.applyBrightness(rgbColor, Number(filter.brightness));
    }

    if (filter.contrast !== undefined) {
      rgbColor = ColorFilter.applyContrast(rgbColor, Number(filter.contrast));
    }

    if (filter.saturation !== undefined) {
      rgbColor = ColorFilter.applySaturation(rgbColor, Number(filter.saturation));
    }

    if (filter.opacity !== undefined) {
      rgbColor = {
        ...rgbColor,
        alpha: ColorFilter.clamp((rgbColor.alpha ?? 1) * Number(filter.opacity), 0, 1),
      };
    }

    return formatRgb(toRgb(rgbColor));
  }

  /**
   * Converts a color to grayscale.
   *
   * A numeric grayscale value mixes between original color and full grayscale.
   * An object value maps source lightness into the configured min/max range.
   *
   * @param {object} rgbColor - Culori RGB color.
   * @param {number|object} grayscale - Grayscale amount or lightness map.
   * @returns {object} Grayscale RGB color.
   */
  static applyGrayscale(rgbColor, grayscale) {
    const oklchColor = toOklch(rgbColor);
    const grayscaleIsMap = typeof grayscale === 'object';
    const grayscaleAmount = grayscaleIsMap ? 1 : Number(grayscale);
    const mappedLightness = grayscaleIsMap ? Number(grayscale.min) + oklchColor.l * (Number(grayscale.max) - Number(grayscale.min)) : oklchColor.l;
    const targetColor = {
      ...oklchColor,
      l: ColorFilter.clamp(mappedLightness, 0, 1),
      c: 0,
    };
    const grayscaleColor = toRgb(targetColor);

    return ColorFilter.mixRgb(rgbColor, grayscaleColor, ColorFilter.clamp(grayscaleAmount, 0, 1));
  }

  /**
   * Sets or maps OKLCH lightness.
   *
   * A numeric value sets absolute lightness. An object value maps the current
   * lightness into the configured min/max range.
   *
   * @param {object} rgbColor - Culori RGB color.
   * @param {number|object} lightness - Absolute lightness or min/max map.
   * @returns {object} Lightness-adjusted RGB color.
   */
  static applyLightness(rgbColor, lightness) {
    const oklchColor = toOklch(rgbColor);
    const lightnessIsMap = typeof lightness === 'object';
    const mappedLightness = lightnessIsMap ? Number(lightness.min) + oklchColor.l * (Number(lightness.max) - Number(lightness.min)) : Number(lightness);

    return toRgb({
      ...oklchColor,
      l: ColorFilter.clamp(mappedLightness, 0, 1),
    });
  }

  /**
   * Maps a color onto one hue while preserving source lightness.
   *
   * @param {object} rgbColor - Culori RGB color.
   * @param {string} monochromeColor - Target color family.
   * @param {LitElement} card - Card element used to resolve CSS variables.
   * @returns {object} Monochrome RGB color.
   */
  static applyMonochrome(rgbColor, filter, card) {
    const sourceOklch = toOklch(rgbColor);

    if (filter.preserve_neutral && ColorFilter.isNeutralOklch(sourceOklch)) {
      return rgbColor;
    }

    const monochrome = ColorFilter.normalizeMonochromeFilter(filter.monochrome);
    const target = ColorFilter.resolveColor(monochrome.color, card);
    const targetOklch = toOklch(target);
    const monochromeColor = toRgb({
      ...targetOklch,
      l: sourceOklch.l,
      alpha: rgbColor.alpha,
    });

    return ColorFilter.mixRgb(rgbColor, monochromeColor, monochrome.amount);
  }

  /**
   * Maps a color between two configured colors using source lightness as the position.
   *
   * @param {object} rgbColor - Culori RGB color.
   * @param {object} duotone - Dark and light endpoint colors.
   * @param {LitElement} card - Card element used to resolve CSS variables.
   * @returns {object} Duotone RGB color.
   */
  static applyDuotone(rgbColor, filter, card) {
    const sourceOklch = toOklch(rgbColor);

    if (filter.preserve_neutral && ColorFilter.isNeutralOklch(sourceOklch)) {
      return rgbColor;
    }

    const duotone = ColorFilter.normalizeDuotoneFilter(filter.duotone);
    const darkColor = ColorFilter.resolveColor(duotone.dark, card);
    const lightColor = ColorFilter.resolveColor(duotone.light, card);
    const duotoneColor = ColorFilter.mixRgb(darkColor, lightColor, sourceOklch.l);

    return ColorFilter.mixRgb(rgbColor, duotoneColor, duotone.amount);
  }

  /**
   * Multiplies OKLCH lightness.
   *
   * @param {object} rgbColor - Culori RGB color.
   * @param {number} amount - Brightness multiplier.
   * @returns {object} Brightness-adjusted RGB color.
   */
  static applyBrightness(rgbColor, amount) {
    const oklchColor = toOklch(rgbColor);

    return toRgb({
      ...oklchColor,
      l: ColorFilter.clamp(oklchColor.l * amount, 0, 1),
    });
  }

  /**
   * Moves RGB channels away from or toward middle gray.
   *
   * @param {object} rgbColor - Culori RGB color.
   * @param {number} amount - Contrast multiplier.
   * @returns {object} Contrast-adjusted RGB color.
   */
  static applyContrast(rgbColor, amount) {
    return {
      ...rgbColor,
      r: ColorFilter.clamp((rgbColor.r - 0.5) * amount + 0.5, 0, 1),
      g: ColorFilter.clamp((rgbColor.g - 0.5) * amount + 0.5, 0, 1),
      b: ColorFilter.clamp((rgbColor.b - 0.5) * amount + 0.5, 0, 1),
    };
  }

  /**
   * Multiplies OKLCH chroma to adjust saturation.
   *
   * @param {object} rgbColor - Culori RGB color.
   * @param {number} amount - Saturation multiplier.
   * @returns {object} Saturation-adjusted RGB color.
   */
  static applySaturation(rgbColor, amount) {
    const oklchColor = toOklch(rgbColor);

    return toRgb({
      ...oklchColor,
      c: Math.max(0, oklchColor.c * amount),
    });
  }

  /**
   * Normalizes monochrome shorthand and amount configuration.
   *
   * @param {string|object} monochrome - Color string or { color, amount } config.
   * @returns {object} Normalized monochrome config.
   */
  static normalizeMonochromeFilter(monochrome) {
    return typeof monochrome === 'object'
      ? {
          color: monochrome.color,
          amount: monochrome.amount ?? 1,
        }
      : {
          color: monochrome,
          amount: 1,
        };
  }

  /**
   * Normalizes duotone amount configuration.
   *
   * @param {object} duotone - Duotone filter config.
   * @returns {object} Normalized duotone config.
   */
  static normalizeDuotoneFilter(duotone) {
    return {
      ...duotone,
      amount: duotone.amount ?? 1,
    };
  }

  /**
   * Returns true for black, white, and neutral gray colors in OKLCH space.
   *
   * @param {object} oklchColor - Culori OKLCH color.
   * @returns {boolean} Whether the color should stay neutral.
   */
  static isNeutralOklch(oklchColor) {
    return oklchColor.l <= 0.005 || oklchColor.l >= 0.995 || Math.abs(oklchColor.c ?? 0) <= 0.0005;
    // return oklchColor.l <= 0.001 || oklchColor.l >= 0.999 || Math.abs(oklchColor.c ?? 0) <= 0.0001;
  }

  /**
   * Resolves any supported CSS color to Culori RGB.
   *
   * @param {string} color - CSS color value.
   * @param {LitElement} card - Card element used to resolve CSS variables.
   * @returns {object} Culori RGB color.
   */
  static resolveColor(color, card) {
    Colors.setElement(card);
    const rgba = Colors.colorToRGBA(String(color));

    return {
      mode: 'rgb',
      r: rgba[0] / 255,
      g: rgba[1] / 255,
      b: rgba[2] / 255,
      alpha: rgba[3] / 255,
    };
  }

  /**
   * Linearly mixes two RGB colors.
   *
   * @param {object} colorA - First RGB color.
   * @param {object} colorB - Second RGB color.
   * @param {number} amount - Mix position from 0 to 1.
   * @returns {object} Mixed RGB color.
   */
  static mixRgb(colorA, colorB, amount) {
    const ratio = ColorFilter.clamp(amount, 0, 1);

    return {
      mode: 'rgb',
      r: ColorFilter.clamp(colorA.r + (colorB.r - colorA.r) * ratio, 0, 1),
      g: ColorFilter.clamp(colorA.g + (colorB.g - colorA.g) * ratio, 0, 1),
      b: ColorFilter.clamp(colorA.b + (colorB.b - colorA.b) * ratio, 0, 1),
      alpha: ColorFilter.clamp((colorA.alpha ?? 1) + ((colorB.alpha ?? 1) - (colorA.alpha ?? 1)) * ratio, 0, 1),
    };
  }

  /**
   * Clamps a number to a configured range.
   *
   * @param {number} value - Number to clamp.
   * @param {number} min - Minimum value.
   * @param {number} max - Maximum value.
   * @returns {number} Clamped number.
   */
  static clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }
}
