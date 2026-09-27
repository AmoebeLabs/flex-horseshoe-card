import { converter, parse } from 'culori';

import { stateColorCss, stateColorBrightness } from './frontend_mods/common/entity/state_color.ts';
import { stateActive } from './frontend_mods/common/entity/state_active.ts';
import { computeDomain } from './frontend_mods/common/entity/compute_domain.ts';

import { CLIMATE_HVAC_ACTION_TO_MODE } from './frontend_mods/data/climate.ts';
/**
 * Converts configured colors using the card's current CSS scope. Matching
 * theme/mode/palette environments share numeric conversions; tools use those
 * results for state colors, interpolation, gradients and filters.
 */

export default class Colors {
  /** Retains shared conversions and the delivery order of HA theme sources. */
  static {
    Colors.colorCache = new Map();
    Colors.themeRevisions = new WeakMap();
    Colors.themeRevisionNumber = 0;
    Colors.unresolvedColor = false;
  }

  /**
   * Assigns a stable, increasing revision to each Home Assistant theme source.
   * CardTheme records the source when HA delivers it, so delayed work from an
   * older source keeps its earlier revision instead of looking like a refresh.
   *
   * @param {object} source - Home Assistant theme source object.
   * @returns {number} Stable revision for this source object.
   */
  static getThemeRevision(source) {
    let revision = Colors.themeRevisions.get(source);

    if (revision === undefined) {
      revision = Colors.themeRevisionNumber + 1;
      Colors.themeRevisionNumber = revision;
      Colors.themeRevisions.set(source, revision);
    }

    return revision;
  }

  /**
   * Returns the active conversion bucket shared by cards with the same theme
   * names and ordered palette URLs. Each key retains only paint metadata,
   * palette document references, and converted colors, never a card or DOM host.
   *
   * @param {object} colorContext - Prepared card theme and palette identity.
   * @returns {object|undefined} Active bucket, or undefined for stale theme work.
   */
  static getColorCache(colorContext) {
    const themeRevision = Colors.getThemeRevision(colorContext.themeSource);
    let colorBucket = Colors.colorCache.get(colorContext.cacheKey);

    if (!colorBucket) {
      colorBucket = {
        mode: colorContext.mode,
        themeRevision,
        paletteDocuments: colorContext.paletteSources.map((source) => source.palette),
        colors: new Map(),
      };
      Colors.colorCache.set(colorContext.cacheKey, colorBucket);
      return colorBucket;
    }

    // Older asynchronous work may still render, but must not replace the cache
    // already published for a newer HA theme source.
    if (themeRevision < colorBucket.themeRevision) return undefined;

    const paletteDocumentsChanged = colorContext.paletteSources.length !== colorBucket.paletteDocuments.length
      || colorContext.paletteSources.some((source, index) => source.palette !== colorBucket.paletteDocuments[index]);

    if (
      colorContext.mode !== colorBucket.mode
      || themeRevision !== colorBucket.themeRevision
      || paletteDocumentsChanged
    ) {
      // Cards with a matching context share one active mode/source/document set.
      // A context transition clears only that shared bucket, once.
      colorBucket.mode = colorContext.mode;
      colorBucket.themeRevision = themeRevision;
      colorBucket.paletteDocuments = colorContext.paletteSources.map((source) => source.palette);
      colorBucket.colors.clear();
    }

    return colorBucket;
  }

  /**
   * Maps a value between two color stops to a fraction, clipping values outside
   * that interval to its nearest end. Interpolation uses the fraction to blend
   * the two endpoint colors.
   *
   * @param {number} argStart - Lower color-stop value.
   * @param {number} argEnd - Upper color-stop value.
   * @param {number} argValue - Current numeric value.
   * @returns {number} Fraction from zero through one.
   */

  static calculateValueBetween(argStart, argEnd, argValue) {
    return (Math.min(Math.max(argValue, argStart), argEnd) - argStart) / (argEnd - argStart);
  }

  /**
   * Walks Home Assistant's shadow roots to the active Lovelace panel. The
   * panel is the secondary CSS-variable scope when a color is not defined on
   * the card itself.
   *
   * @returns {Element|null} Active Lovelace panel element.
   */
  static getLovelacePanel() {
    var root = window.document.querySelector('home-assistant');
    root = root && root.shadowRoot;
    root = root && root.querySelector('home-assistant-main');
    root = root && root.shadowRoot;
    root = root && root.querySelector('app-drawer-layout partial-panel-resolver, ha-drawer partial-panel-resolver');
    root = (root && root.shadowRoot) || root;
    root = root && root.querySelector('ha-panel-lovelace');
    if (root) {
      return root;
    }
    return null;
  }

  /**
   * Selects the color stop containing the current value, or blends that stop
   * with its neighbour when interpolation is enabled. Values beyond the scale
   * use its endpoint colors.
   *
   * @param {number} state - Current value.
   * @param {object} colorStops - Ordered numeric stops and colors.
   * @param {boolean} gradient - Whether to interpolate between adjacent stops.
   * @param {object} colorContext - Card-owned CSS scope for conversion.
   * @returns {string|undefined} Selected or interpolated color.
   */
  static calculateStrokeColor(state, colorStops, gradient, colorContext) {
    const stops = colorStops?.colors ?? [];

    if (!stops.length) return undefined;

    const numericState = Number(state);

    if (!Number.isFinite(numericState)) {
      return stops[0].color;
    }

    if (numericState <= stops[0].value) {
      return stops[0].color;
    }

    const lastStop = stops[stops.length - 1];

    if (numericState >= lastStop.value) {
      return lastStop.color;
    }

    for (let i = 0; i < stops.length - 1; i += 1) {
      const startStop = stops[i];
      const endStop = stops[i + 1];

      if (numericState >= startStop.value && numericState < endStop.value) {
        if (!gradient) {
          return startStop.color;
        }

        const valueBetween = Colors.calculateValueBetween(startStop.value, endStop.value, numericState);

        return Colors.getGradientValue(startStop.color, endStop.color, valueBetween, colorContext);
      }
    }

    return lastStop.color;
  }

  /**
   * Resolves one CSS var() expression against the card and Lovelace scopes,
   * including a nested fallback after the top-level comma.
   *
   * @param {string} argColor - CSS variable expression.
   * @param {object} colorContext - Card-owned CSS scope for this conversion.
   * @returns {string} Resolved CSS color or configured fallback.
   */
  static getColorVariable(argColor, colorContext) {
    const varBody = argColor.slice(4, -1).trim();
    let varName = varBody;
    let fallback = '';
    let depth = 0;

    // CSS var fallback syntax uses a top-level comma: var(--name, fallback).
    for (let i = 0; i < varBody.length; i += 1) {
      const char = varBody[i];

      if (char === '(') {
        depth += 1;
      } else if (char === ')') {
        depth -= 1;
      } else if (char === ',' && depth === 0) {
        varName = varBody.slice(0, i).trim();
        fallback = varBody.slice(i + 1).trim();
        break;
      }
    }

    const color = getComputedStyle(colorContext.element).getPropertyValue(varName).trim();
    if (color) return color;

    if (!this.lovelace) {
      this.lovelace = Colors.getLovelacePanel();
    }

    const llColor = getComputedStyle(this.lovelace).getPropertyValue(varName).trim();
    if (llColor) return llColor;

    return fallback;
  }

  /**
   * Blends two configured CSS colors, including their alpha channels. Both
   * endpoints use the current shared conversion cache before interpolation.
   *
   * @param {string} argColorA - Start color.
   * @param {string} argColorB - End color.
   * @param {number} argValue - Fraction from the start to the end color.
   * @param {object} colorContext - Card-owned CSS scope for variable colors.
   * @returns {string|undefined} Interpolated eight-digit hex color.
   */

  static getGradientValue(argColorA, argColorB, argValue, colorContext) {
    const resultColorA = Colors.colorToRGBA(argColorA, colorContext);
    const resultColorB = Colors.colorToRGBA(argColorB, colorContext);

    if (!resultColorA || !resultColorB) {
      Colors.unresolvedColor = true;
      return undefined;
    }

    // Interpolate all four channels so translucent stops keep their meaning.

    const v1 = 1 - argValue;
    const v2 = argValue;
    const rDec = Math.floor(resultColorA[0] * v1 + resultColorB[0] * v2);
    const gDec = Math.floor(resultColorA[1] * v1 + resultColorB[1] * v2);
    const bDec = Math.floor(resultColorA[2] * v1 + resultColorB[2] * v2);
    const aDec = Math.floor(resultColorA[3] * v1 + resultColorB[3] * v2);

    // And convert full RRGGBBAA value to #hex.
    const rHex = Colors.padZero(rDec.toString(16));
    const gHex = Colors.padZero(gDec.toString(16));
    const bHex = Colors.padZero(bDec.toString(16));
    const aHex = Colors.padZero(aDec.toString(16));

    return `#${rHex}${gHex}${bHex}${aHex}`;
  }

  /**
   * Returns one two-character hexadecimal color channel.
   *
   * @param {string} argValue - Hexadecimal channel value.
   * @returns {string} Two-character channel value.
   */
  static padZero(argValue) {
    if (argValue.length < 2) {
      argValue = `0${argValue}`;
    }
    return argValue.substr(0, 2);
  }

  /**
   * Converts a configured CSS color to cached RGBA channel values. CSS
   * variables use the supplied card scope before browser parsing handles
   * modern CSS colors for gradient interpolation.
   *
   * @param {string} argColor - CSS color value to convert.
   * @param {object} colorContext - Card-owned CSS scope for this conversion.
   * @returns {Array<number>} Red, green, blue, and alpha channel values.
   */
  static colorToRGBA(argColor, colorContext) {
    if (argColor == null) return [0, 0, 0, 0];

    const colorBucket = colorContext.cacheReady ? Colors.getColorCache(colorContext) : undefined;
    const colorCache = colorBucket?.colors;
    const retColor = colorCache?.get(argColor);
    if (retColor) return retColor;

    let theColor = argColor;
    const isCssVar = argColor.substr(0, 3).valueOf() === 'var';

    if (isCssVar) {
      theColor = argColor;

      for (let i = 0; i < 10 && theColor.trim().startsWith('var('); i += 1) {
        theColor = Colors.getColorVariable(theColor.trim(), colorContext);

        // Palette variables can be requested before Palette.applyAll() has written them.
        // Do not let canvas convert an unresolved variable to black and then cache that.
        if (!theColor) {
          Colors.unresolvedColor = true;
          if (colorContext.element?.dev?.debug_colors) {
            console.log('[horseshoe-colors] unresolved css var', { argColor });
          }
          return undefined;
        }
      }
      // console.log('getting colorToRGBA ', argColor, theColor);
    }

    let parsedColor = parse(theColor);

    if (!parsedColor) {
      const resolver = window.document.createElement('span');
      const sentinel = 'rgb(1, 2, 3)';

      // Let the browser reduce modern CSS color functions to a computed rgb() value.
      resolver.style.color = sentinel;
      resolver.style.color = theColor;
      colorContext.element.appendChild(resolver);
      const computedColor = window.getComputedStyle(resolver).color;
      resolver.remove();

      if (computedColor !== sentinel) {
        parsedColor = parse(computedColor);
      }

      if (!parsedColor) {
        Colors.unresolvedColor = true;
        if (colorContext.element?.dev?.debug_colors) {
          console.log('[horseshoe-colors] unparseable color', { argColor, resolvedColor: theColor, computedColor });
        }
        return undefined;
      }
    }

    const rgbColor = converter('rgb')(parsedColor);
    const outColor = [
      Math.round(Math.min(Math.max(rgbColor.r, 0), 1) * 255),
      Math.round(Math.min(Math.max(rgbColor.g, 0), 1) * 255),
      Math.round(Math.min(Math.max(rgbColor.b, 0), 1) * 255),
      Math.round((rgbColor.alpha ?? 1) * 255),
    ];

    if (colorCache) colorCache.set(argColor, outColor);

    return outColor;
  }

  /**
   * Converts an HSL object with degree/percentage channels to RGB 0..255.
   *
   * @param {object} hsl - Hue, saturation and lightness channels.
   * @returns {object} Red, green and blue channels.
   */
  static hslToRgb(hsl) {
    const h = hsl.h / 360;
    const s = hsl.s / 100;
    const l = hsl.l / 100;

    let r;
    let g;
    let b;

    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      function hue2rgb(p, q, t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      }

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;

      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    r *= 255;
    g *= 255;
    b *= 255;

    return { r, g, b };
  }

  // @2026.05.16
  // 1:1 copy of _computeColor() function in the Home Assistant repository
  // https://github.com/home-assistant/frontend/blob/dev/src/panels/lovelace/cards/hui-entity-card.ts
  /**
   * Derives the Home Assistant state color used by light, climate and other
   * state-aware entity icons.
   *
   * @param {object} entity - Home Assistant state object.
   * @returns {string|undefined} CSS color for the entity state.
   */
  static computeColor(entity) {
    if (entity.attributes?.hvac_action) {
      const hvacAction = entity.attributes.hvac_action;

      if (hvacAction in CLIMATE_HVAC_ACTION_TO_MODE) {
        return stateColorCss(entity, CLIMATE_HVAC_ACTION_TO_MODE[hvacAction]);
      }

      return undefined;
    }

    if (entity.attributes?.rgb_color) {
      return `rgb(${entity.attributes.rgb_color.join(',')})`;
    }

    const iconColor = stateColorCss(entity);

    if (iconColor) {
      return iconColor;
    }

    return undefined;
  }

  /**
   * Builds icon styles from Home Assistant state color and brightness rules.
   *
   * @param {object} entity - Home Assistant state object.
   * @returns {object} CSS style dictionary for IconTool.
   */
  static getHaEntityIconStyle(entity) {
    const color = Colors.computeColor(entity);
    const filter = stateColorBrightness(entity);

    return {
      color: color ?? 'var(--state-icon-color)',
      fill: 'currentColor',
      ...(filter ? { filter } : {}),
    };
  }
} // END OF CLASS
