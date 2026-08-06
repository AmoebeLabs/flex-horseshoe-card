import { converter, parse } from 'culori';

import { stateColorCss, stateColorBrightness } from './frontend_mods/common/entity/state_color.ts';
import { stateActive } from './frontend_mods/common/entity/state_active.ts';
import { computeDomain } from './frontend_mods/common/entity/compute_domain.ts';

import { CLIMATE_HVAC_ACTION_TO_MODE } from './frontend_mods/data/climate.ts';
/** Domains where the row should not act as a click target to open the more info dialog.

/** ***************************************************************************
 * Colors class
 *
 * Summary.
 *
 */

export default class Colors {
  /** *****************************************************************************
   * Colors::static properties()
   *
   * @description
   * Declares the static class properties.
   * Needs eslint parserOptions ecmaVersion: 2022
   *
   */
  static {
    Colors.colorCache = {};
    Colors.element = undefined;
    Colors.unresolvedColor = false;
  }

  /** *****************************************************************************
   * Colors::static _prefixKeys()
   *
   * @argument argColors - the colors to prefix with '--'
   *
   * @description
   * Prefixes all keys with '--' to make them CSS Variables.
   *
   */
  static _prefixKeys(argColors) {
    let prefixedColors = {};

    Object.keys(argColors).forEach((key) => {
      const prefixedKey = `--${key}`;
      const value = String(argColors[key]);
      prefixedColors[prefixedKey] = `${value}`;
    });
    return prefixedColors;
  }

  /** *****************************************************************************
   * Colors::static processTheme()
   *
   * @argument argTheme - the theme configuration to load
   *
   * @description
   * Loads and processes the theme to be used with dark and light modes.
   *
   * Theme mode is selected based on theme's darkMode boolean.
   */
  static processTheme(argTheme) {
    let combinedLight = {};
    let combinedDark = {};

    let themeLight = {};
    let themeDark = {};

    const { modes, ...themeBase } = argTheme;

    // Apply theme vars for the specific mode if available
    if (modes) {
      combinedDark = { ...themeBase, ...modes.dark };
      combinedLight = { ...themeBase, ...modes.light };
    }

    // Now we have the dark and light mode configuration, iterate over every definition
    // and add the CSS variable prefix '--' to the key (CSS Variable color name)
    themeLight = Colors._prefixKeys(combinedLight);
    themeDark = Colors._prefixKeys(combinedDark);

    // Return the light and dark mode theme parts
    return { themeLight, themeDark };
  }

  /** *****************************************************************************
   * Colors::static processPalette()
   *
   * @argument argPalette - the palette configuration to load
   *
   * @description
   * Loads the swatches defined for the palette and combines them into a single
   * palette with light (default) and dark modes.
   *
   * Palette mode is selected based on theme's darkMode boolean.
   */
  static processPalette(argPalette) {
    let combinedBase = {};
    let combinedLight = {};
    let combinedDark = {};

    let paletteLight = {};
    let paletteDark = {};

    // We are not interested in the individual swatches, so iterate directly over the values
    Object.values(argPalette).forEach((swatch) => {
      // Apply theme vars that are relevant for all modes (but extract the 'modes' section first)
      // See: https://www.freecodecamp.org/news/javascript-object-destructuring-spread-operator-rest-parameter/
      const { modes, ...swatchBase } = swatch;

      // Apply swatch vars for the specific mode if available
      combinedBase = { ...combinedBase, ...swatchBase };
      if (modes) {
        combinedDark = { ...combinedDark, ...swatchBase, ...modes.dark };
        combinedLight = { ...combinedLight, ...swatchBase, ...modes.light };
      }
    });

    // Now we have the dark and light mode configuration, iterate over every definition
    // and add the CSS variable prefix '--' to the key (CSS Variable color name)

    paletteLight = Colors._prefixKeys(combinedLight);
    paletteDark = Colors._prefixKeys(combinedDark);

    // Return the light and dark mode palettes
    return { paletteLight, paletteDark };
  }

  /** *****************************************************************************
   * Colors::setElement()
   *
   * Summary.
   * Sets the HTML element (the custom card) to work with getting colors
   *
   */

  static setElement(argElement) {
    Colors.element = argElement;
  }

  /** *****************************************************************************
   * card::_calculateColor()
   *
   * Summary.
   *
   * #TODO:
   * replace by TinyColor library? Is that possible/feasible??
   *
   */

  static calculateColor(argState, argStops, argIsGradient) {
    const sortedStops = Object.keys(argStops)
      .map((n) => Number(n))
      .sort((a, b) => a - b);

    let start;
    let end;
    let val;
    const l = sortedStops.length;

    if (argState <= sortedStops[0]) {
      return argStops[sortedStops[0]];
    } else if (argState >= sortedStops[l - 1]) {
      return argStops[sortedStops[l - 1]];
    } else {
      for (let i = 0; i < l - 1; i++) {
        const s1 = sortedStops[i];
        const s2 = sortedStops[i + 1];
        if (argState >= s1 && argState < s2) {
          [start, end] = [argStops[s1], argStops[s2]];
          if (!argIsGradient) {
            return start;
          }
          val = Colors.calculateValueBetween(s1, s2, argState);
          break;
        }
      }
    }
    return Colors.getGradientValue(start, end, val);
  }

  /** *****************************************************************************
   * card::_calculateColor2()
   *
   * Summary.
   *
   * #TODO:
   * replace by TinyColor library? Is that possible/feasible??
   *
   */

  static calculateColor2(argState, argStops, argPart, argProperty, argIsGradient) {
    const sortedStops = Object.keys(argStops)
      .map((n) => Number(n))
      .sort((a, b) => a - b);

    let start;
    let end;
    let val;
    const l = sortedStops.length;

    if (argState <= sortedStops[0]) {
      return argStops[sortedStops[0]];
    } else if (argState >= sortedStops[l - 1]) {
      return argStops[sortedStops[l - 1]];
    } else {
      for (let i = 0; i < l - 1; i++) {
        const s1 = sortedStops[i];
        const s2 = sortedStops[i + 1];
        if (argState >= s1 && argState < s2) {
          // console.log('calculateColor2 ', argStops[s1], argStops[s2]);
          [start, end] = [argStops[s1].styles[argPart][argProperty], argStops[s2].styles[argPart][argProperty]];
          if (!argIsGradient) {
            return start;
          }
          val = Colors.calculateValueBetween(s1, s2, argState);
          break;
        }
      }
    }
    return Colors.getGradientValue(start, end, val);
  }

  /** *****************************************************************************
   * card::_calculateValueBetween()
   *
   * Summary.
   * Clips the argValue value between argStart and argEnd, and returns the between value ;-)
   *
   * Returns NaN if argValue is undefined
   *
   * NOTE: Rename to valueToPercentage ??
   */

  static calculateValueBetween(argStart, argEnd, argValue) {
    return (Math.min(Math.max(argValue, argStart), argEnd) - argStart) / (argEnd - argStart);
  }

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

  /** *****************************************************************************
   * _calculateStrokeColor()
   *
   * Summary.
   *
   */

  static calculateStrokeColor(state, colorStops, gradient) {
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

        return Colors.getGradientValue(startStop.color, endStop.color, valueBetween);
      }
    }

    return lastStop.color;
  }

  /** *****************************************************************************
   * card::_getColorVariable()
   *
   * Summary.
   * Get value of CSS color variable, specified as var(--color-value)
   * These variables are defined in the Lovelace element so it appears...
   *
   */

  // Stap 1: Haal de tekstuele waarde op van je eigen kaart (inline stijl)
  // Dit geeft de string terug: "var(--primary-color)"
  static resolveColorVariable(argColor) {
    const rawValue = this.element.style.getPropertyValue(argColor).trim();
    // console.log('rawValue for ', argColor, ':', rawValue);
    let returnedColor = rawValue;
    // Stap 2: Check of het een 'var()' verwijzing is en extraheer de naam
    if (rawValue.startsWith('var(')) {
      // Haal "--primary-color" uit de string "var(--primary-color)"
      const innerVar = rawValue.replace(/^var\((--.*?)\)$/, '$1').trim();

      // Stap 3: Resolve die globale variabele via de document.body
      const resolvedColor = window.getComputedStyle(document.body).getPropertyValue(innerVar).trim();
      returnedColor = resolvedColor;
      // console.log('De echte kleur is:', resolvedColor); // Output: #3498db of rgb(...)
    } else {
      // Als er geen var() in stond, maar direct een kleur (bijv. "red" of "#fff")
      // console.log('De echte kleur is:', rawValue);
    }
    return returnedColor;
  }

  static getColorVariable(argColor) {
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

    const color = getComputedStyle(Colors.element).getPropertyValue(varName).trim();
    // console.log('getColorVariable - ', argColor, varName, color, Colors.element);
    if (color) return color;

    if (!this.lovelace) {
      this.lovelace = Colors.getLovelacePanel();
    }

    const llColor = getComputedStyle(this.lovelace).getPropertyValue(varName).trim();
    // console.log('getColorVariable - ll', argColor, varName, color, llColor, Colors.element);
    if (llColor) return llColor;

    return fallback;
  }

  static getLovelaceColorVariable(argColor) {
    const newColor = argColor.substr(4, argColor.length - 5);

    if (!this.lovelace) {
      this.lovelace = Colors.getLovelacePanel();
    } else {
    }

    const returnColor = window.getComputedStyle(this.lovelace).getPropertyValue(newColor);
    return returnColor;
  }

  /** *****************************************************************************
   * card::_getGradientValue()
   *
   * Summary.
   * Get gradient value of color as a result of a color_stop.
   * An RGBA value is calculated, so transparency is possible...
   *
   * The colors (colorA and colorB) can be specified as:
   * - a css variable, var(--color-value)
   * - a hex value, #fff or #ffffff
   * - an rgb() or rgba() value
   * - a hsl() or hsla() value
   * - a named css color value, such as white.
   *
   */

  static getGradientValue(argColorA, argColorB, argValue) {
    const resultColorA = Colors.colorToRGBA(argColorA);
    const resultColorB = Colors.colorToRGBA(argColorB);

    if (!resultColorA || !resultColorB) {
      Colors.unresolvedColor = true;
      return undefined;
    }

    // We have a rgba() color array from cache or canvas.
    // Calculate color in between, and return #hex value as a result.
    //

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

  static padZero(argValue) {
    if (argValue.length < 2) {
      argValue = `0${argValue}`;
    }
    return argValue.substr(0, 2);
  }

  /** *****************************************************************************
   * card::_colorToRGBA()
   *
   * Summary.
   * Get RGBA color value of argColor.
   *
   * The argColor can be specified as:
   * - a css variable, var(--color-value)
   * - a hex value, #fff or #ffffff
   * - an rgb() or rgba() value
   * - a hsl() or hsla() value
   * - a named css color value, such as white.
   *
   */

  static resolveColorVariableV0(argColor) {
    let color = argColor;

    while (typeof color === 'string' && color.trim().startsWith('var(')) {
      color = Colors.getColorVariable(color).trim();
      console.log('resolving color variable ', argColor, ', to: ', color, '...');
    }

    return color;
  }

  static colorToRGBAChat(argColor) {
    if (argColor == null) return [0, 0, 0, 0];

    const retColor = Colors.colorCache[argColor];
    if (retColor) return retColor;

    let theColor = argColor;

    if (typeof theColor === 'string' && theColor.trim().startsWith('var(')) {
      theColor = Colors.resolveColorVariable(theColor);
    }

    const canvas = window.document.createElement('canvas');

    canvas.width = canvas.height = 1;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = theColor;
    ctx.fillRect(0, 0, 1, 1);

    const outColor = [...ctx.getImageData(0, 0, 1, 1).data];

    Colors.colorCache[argColor] = outColor;

    return outColor;
  }

  static colorToRGBA(argColor) {
    if (argColor == null) return [0, 0, 0, 0];

    // return color if found in colorCache...
    const retColor = Colors.colorCache[argColor];
    if (retColor) return retColor;

    let theColor = argColor;
    const isCssVar = argColor.substr(0, 3).valueOf() === 'var';

    if (isCssVar) {
      theColor = argColor;

      for (let i = 0; i < 10 && theColor.trim().startsWith('var('); i += 1) {
        theColor = Colors.getColorVariable(theColor.trim());

        // Palette variables can be requested before Palette.applyAll() has written them.
        // Do not let canvas convert an unresolved variable to black and then cache that.
        if (!theColor) {
          Colors.unresolvedColor = true;
          if (Colors.element?.dev?.debug_colors) {
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
      Colors.element.appendChild(resolver);
      const computedColor = window.getComputedStyle(resolver).color;
      resolver.remove();

      if (computedColor !== sentinel) {
        parsedColor = parse(computedColor);
      }

      if (!parsedColor) {
        Colors.unresolvedColor = true;
        if (Colors.element?.dev?.debug_colors) {
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

    Colors.colorCache[argColor] = outColor;

    return outColor;
  }

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
