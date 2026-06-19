import { svg } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
// Future state formatting support will need these Home Assistant formatter helpers again.
// import { selectUnit } from '@formatjs/intl-utils';
// import { formatNumber, getDefaultFormatOptions } from './frontend_mods/common/number/format_number.ts';
// import { formatDate, formatDateMonth, formatDateMonthYear, formatDateShort, formatDateNumeric, formatDateWeekday, formatDateWeekdayDay, formatDateWeekdayShort } from './frontend_mods/common/datetime/format_date.ts';
// import { formatTime, formatTime24h, formatTimeWeekday, formatTimeWithSeconds } from './frontend_mods/common/datetime/format_time.ts';
// import { formatDateTime, formatDateTimeNumeric, formatDateTimeWithSeconds, formatShortDateTime, formatShortDateTimeWithYear } from './frontend_mods/common/datetime/format_date_time.ts';
// import { formatDuration } from './frontend_mods/common/datetime/format_duration.ts';
import ConfigHelper from './config-helper.js';
import BaseTool from './base-tool.js';
import Colors from './colors.js';
import { hs2rgb, rgb2hex, rgb2hsv, hsv2rgb } from './frontend_mods/common/color/convert-color.ts';
import { rgbw2rgb, rgbww2rgb, temperature2rgb } from './frontend_mods/common/color/convert-light-color.ts';

/**
 * Layout state tool that renders an entity state value and optional unit of measurement.
 */
export default class StateTool extends BaseTool {
  /**
   * Builds state tool instances from the already normalized layout config.
   *
   * @param {object} config - Full card configuration after static card-level normalization.
   * @param {object} templates - Template resolver shared with the card.
   * @param {string} cardId - Stable card id for generated SVG ids.
   * @param {LitElement} card - Parent card instance with shared render helpers.
   * @returns {Array<StateTool>} Configured state tools.
   */
  static setConfig(config, templates, cardId, card) {
    const states = config.layout?.states ?? [];

    return states.map((stateConfig, index) => new StateTool(stateConfig, index, templates, cardId, card));
  }

  static buildState(inState, entityConfig, hass, stateObj) {
    // Keep undefined as state. Do NOT change this one!!
    if (typeof inState === 'undefined') return inState;
    // inState seems to be null when light is off!
    if (inState === null) return inState;

    // New in v2.5.1: Check for built-in state converters
    if (entityConfig.convert) {
      // Match converter with parameter between ()
      let splitted = entityConfig.convert.match(/(^\w+)\((\d+)\)/);
      let converter;
      let parameter;
      // If no parameters found, just the converter
      if (splitted === null) {
        converter = entityConfig.convert;
      } else if (splitted.length === 3) {
        // If parameter found, process...
        converter = splitted[1];
        parameter = Number(splitted[2]);
      }
      switch (converter) {
        case 'brightness_pct':
          inState = inState === 'undefined' ? 'undefined' : `${Math.round((inState / 255) * 100)}`;
          break;
        case 'multiply':
          inState = `${Math.round(inState * parameter)}`;
          break;
        case 'divide':
          inState = `${Math.round(inState / parameter)}`;
          break;
        case 'rgb_csv':
        case 'rgb_hex':
          // https://github.com/home-assistant/frontend/blob/1bf03f020e2b2523081d4f03580886b51e970c72/src/dialogs/more-info/components/lights/ha-favorite-color-button.ts#L39
          // https://github.com/home-assistant/frontend/blob/1bf03f020e2b2523081d4f03580886b51e970c72/src/common/color/convert-light-color.ts
          // private get _rgbColor(): [number, number, number] {
          //   if (this.color) {
          //     if ("hs_color" in this.color) {
          //       return hs2rgb([this.color.hs_color[0], this.color.hs_color[1] / 100]);
          //     }
          //     if ("color_temp_kelvin" in this.color) {
          //       return temperature2rgb(this.color.color_temp_kelvin);
          //     }
          //     if ("rgb_color" in this.color) {
          //       return this.color.rgb_color;
          //     }
          //     if ("rgbw_color" in this.color) {
          //       return rgbw2rgb(this.color.rgbw_color);
          //     }
          //     if ("rgbww_color" in this.color) {
          //       return rgbww2rgb(
          //         this.color.rgbww_color,
          //         this.stateObj?.attributes.min_color_temp_kelvin,
          //         this.stateObj?.attributes.max_color_temp_kelvin
          //       );
          //     }
          //   }
          //   return [255, 255, 255];
          // }
          if (entityConfig.attribute) {
            let entity = hass.states[entityConfig.entity];
            switch (entity.attributes.color_mode) {
              case 'unknown':
                break;
              case 'onoff':
                break;
              case 'brightness':
                break;
              case 'color_temp':
                if (entity.attributes.color_temp_kelvin) {
                  let rgb = temperature2rgb(entity.attributes.color_temp_kelvin);

                  const hsvColor = rgb2hsv(rgb);
                  // Modify the real rgb color for better contrast
                  if (hsvColor[1] < 0.4) {
                    // Special case for very light color (e.g: white)
                    if (hsvColor[1] < 0.1) {
                      hsvColor[2] = 225;
                    } else {
                      hsvColor[1] = 0.4;
                    }
                  }
                  rgb = hsv2rgb(hsvColor);

                  rgb[0] = Math.round(rgb[0]);
                  rgb[1] = Math.round(rgb[1]);
                  rgb[2] = Math.round(rgb[2]);
                  if (converter === 'rgb_csv') {
                    inState = `${rgb[0]},${rgb[1]},${rgb[2]}`;
                  } else {
                    inState = rgb2hex(rgb);
                  }
                } else {
                  if (converter === 'rgb_csv') {
                    inState = `${255},${255},${255}`;
                  } else {
                    inState = '#ffffff00';
                  }
                }
                break;
              case 'hs':
                {
                  let rgb = hs2rgb([entity.attributes.hs_color[0], entity.attributes.hs_color[1] / 100]);
                  rgb[0] = Math.round(rgb[0]);
                  rgb[1] = Math.round(rgb[1]);
                  rgb[2] = Math.round(rgb[2]);

                  if (converter === 'rgb_csv') {
                    inState = `${rgb[0]},${rgb[1]},${rgb[2]}`;
                  } else {
                    inState = rgb2hex(rgb);
                  }
                }
                break;
              case 'rgb':
                {
                  const hsvColor = rgb2hsv((stateObj?.attributes?.rgb_color ?? entity.attributes.rgb_color));
                  // Modify the real rgb color for better contrast
                  if (hsvColor[1] < 0.4) {
                    // Special case for very light color (e.g: white)
                    if (hsvColor[1] < 0.1) {
                      hsvColor[2] = 225;
                    } else {
                      hsvColor[1] = 0.4;
                    }
                  }
                  const rgbColor = hsv2rgb(hsvColor);
                  if (converter === 'rgb_csv') {
                    inState = rgbColor.toString();
                  } else {
                    inState = rgb2hex(rgbColor);
                  }
                }
                break;
              case 'rgbw':
                {
                  let rgb = rgbw2rgb(entity.attributes.rgbw_color);
                  rgb[0] = Math.round(rgb[0]);
                  rgb[1] = Math.round(rgb[1]);
                  rgb[2] = Math.round(rgb[2]);

                  if (converter === 'rgb_csv') {
                    inState = `${rgb[0]},${rgb[1]},${rgb[2]}`;
                  } else {
                    inState = rgb2hex(rgb);
                  }
                }
                break;
              case 'rgbww':
                {
                  let rgb = rgbww2rgb(entity.attributes.rgbww_color, entity.attributes?.min_color_temp_kelvin, entity.attributes?.max_color_temp_kelvin);
                  rgb[0] = Math.round(rgb[0]);
                  rgb[1] = Math.round(rgb[1]);
                  rgb[2] = Math.round(rgb[2]);

                  if (converter === 'rgb_csv') {
                    inState = `${rgb[0]},${rgb[1]},${rgb[2]}`;
                  } else {
                    inState = rgb2hex(rgb);
                  }
                }
                break;
              case 'white':
                break;
              case 'xy':
                if (entity.attributes.hs_color) {
                  let rgb = hs2rgb([entity.attributes.hs_color[0], entity.attributes.hs_color[1] / 100]);
                  // https://github.com/home-assistant/frontend/blob/8580d3f9bf59ffbcbe4187a0d7a58cc23d9822df/src/dialogs/more-info/components/lights/ha-more-info-light-brightness.ts#L76
                  // background slider has opacity of 0.2. Looks nice also, yes??
                  const hsvColor = rgb2hsv(rgb);
                  // Modify the real rgb color for better contrast
                  if (hsvColor[1] < 0.4) {
                    // Special case for very light color (e.g: white)
                    if (hsvColor[1] < 0.1) {
                      hsvColor[2] = 225;
                    } else {
                      hsvColor[1] = 0.4;
                    }
                  }
                  rgb = hsv2rgb(hsvColor);
                  rgb[0] = Math.round(rgb[0]);
                  rgb[1] = Math.round(rgb[1]);
                  rgb[2] = Math.round(rgb[2]);

                  if (converter === 'rgb_csv') {
                    inState = `${rgb[0]},${rgb[1]},${rgb[2]}`;
                  } else {
                    inState = rgb2hex(rgb);
                  }
                } else if (entity.attributes.color) {
                  // We should have h and s, including brightness...
                  let hsl = {};
                  hsl.l = entity.attributes.brightness;
                  hsl.h = entity.attributes.color.h || entity.attributes.color.hue;
                  hsl.s = entity.attributes.color.s || entity.attributes.color.saturation;
                  // Convert HSL value to RGB
                  // HERE
                  let { r, g, b } = Colors.hslToRgb(hsl);
                  if (converter === 'rgb_csv') {
                    inState = `${r},${g},${b}`;
                  } else {
                    const rHex = Colors.padZero(r.toString(16));
                    const gHex = Colors.padZero(g.toString(16));
                    const bHex = Colors.padZero(b.toString(16));
                    inState = `#${rHex}${gHex}${bHex}`;
                  }
                } else if (entity.attributes.xy_color) {
                }
                break;
              default:
                break;
            }
          }
          break;
        default:
          console.error(`Unknown converter [${converter}] specified for entity [${entityConfig.entity}]!`);
          break;
      }
    }
    if (typeof inState === 'undefined') {
      return undefined;
    }
    if (Number.isNaN(inState)) {
      return inState;
    }
    return inState.toString();
  }

  /**
   * Stores static state config and precomputes SVG coordinates.
   *
   * @param {object} config - Static state item config.
   * @param {number} index - State index inside layout.states.
   * @param {object} templates - Template resolver shared with the card.
   * @param {string} cardId - Stable card id for generated SVG ids.
   * @param {LitElement} card - Parent card instance with shared render helpers.
   */
  constructor(config, index, templates, cardId, card) {
    super(config, index, templates, cardId, card, 'states');

    this.config.svg = this.calculateSvgDimensions();
    this.runtimeConfig = this.config;
    this.state = '';
    this.uom = '';
  }

  /**
   * Updates runtime entity context and displayed state/UOM text.
   *
   * @param {object} entity - Home Assistant entity state object for this state.
   * @param {object} entityConfig - Entity configuration for this state.
   */
  setState(entity, entityConfig) {
    super.setState(entity, entityConfig);

    this.runtimeConfig.svg = this.calculateSvgDimensions(this.runtimeConfig);
    this.buildStateAndUom();
  }

  /**
   * Converts state config coordinates to SVG coordinates.
   *
   * @param {object} config - Static or runtime state config.
   * @returns {object} SVG coordinates.
   */
  calculateSvgDimensions(config = this.config) {
    return this.card._calculateSvgCoordinatesInGroup(config);
  }

  /**
   * Builds Home Assistant formatter parts for the current entity state.
   *
   * @returns {Array<object>} Formatter parts split into value and unit entries.
   */
  formatEntityStateParts() {
    const isAttribute = this.entityConfig.attribute !== undefined;
    const formatConfig = this.entityConfig.format || {};
    let rawValue = isAttribute ? this.entity.attributes[this.entityConfig.attribute] : this.entity.state;

    // raw_state_keep bypasses Home Assistant translation/formatting and returns the raw value directly.
    if (formatConfig.raw_state_keep === true) {
      if (formatConfig.raw_state_clean === true && typeof rawValue === 'string') {
        rawValue = rawValue.replace(/_/g, ' ');
      }

      return [{ type: 'value', value: rawValue }];
    }

    const parts = isAttribute
      ? this.card._hass.formatEntityAttributeValueToParts(this.entity, this.entityConfig.attribute)
      : this.card._hass.formatEntityStateToParts(this.entity, StateTool.buildState(this.entity.state, this.entityConfig, this.card._hass, this.entity));
    const isNumeric = !Number.isNaN(Number(rawValue)) && rawValue !== null && rawValue !== '';
    let formattedValue;

    if (isNumeric) {
      const activeLocale = formatConfig.locale || this.card._hass.locale?.language || this.card._hass.language || 'en-US';
      const haValuePart = parts.find((part) => part.type === 'value');
      let haDecimals;

      if (haValuePart && haValuePart.value !== undefined && haValuePart.value !== null) {
        const haValueStr = String(haValuePart.value);
        const decimalIndex = Math.max(haValueStr.lastIndexOf('.'), haValueStr.lastIndexOf(','));
        haDecimals = decimalIndex !== -1 ? haValueStr.length - decimalIndex - 1 : 0;
      }

      const maxDigits = formatConfig.decimals_max ?? (haDecimals !== undefined ? haDecimals : this.entityConfig.decimals !== undefined ? Number(this.entityConfig.decimals) : 2);
      let minDigits = formatConfig.decimals_min ?? (haDecimals !== undefined ? haDecimals : this.entityConfig.decimals !== undefined ? Number(this.entityConfig.decimals) : 0);

      if (minDigits > maxDigits) {
        minDigits = maxDigits;
      }

      try {
        formattedValue = new Intl.NumberFormat(activeLocale, {
          useGrouping: formatConfig.separator !== false,
          minimumFractionDigits: minDigits,
          maximumFractionDigits: maxDigits,
        }).format(Number(rawValue));
      } catch (error) {
        console.error('Error formatting numeric state inside parts:', error);
      }
    }

    return parts.map((part) => {
      if (part.type === 'value' && formattedValue !== undefined) {
        return { ...part, value: formattedValue };
      }

      if (part.type === 'unit' && this.entityConfig.unit !== undefined) {
        return { ...part, value: this.entityConfig.unit };
      }

      return part;
    });
  }

  /**
   * Builds the formatted state value and unit text using the card's Home Assistant formatter path.
   */
  buildStateAndUom() {
    const parts = this.formatEntityStateParts();
    let state = '';
    let unit = '';

    parts.forEach((part) => {
      if (part.type === 'unit') {
        unit += part.value;
      } else if (part.type === 'value') {
        state += part.value;
      }
    });

    this.state = state.trim();
    this.uom = this.buildUom(unit.trim());
  }

  /**
   * Builds the unit of measurement text for this state tool.
   *
   * @param {string} unit - Unit returned by Home Assistant formatter parts.
   * @returns {string} Unit text.
   */
  buildUom(unit) {
    return this.entityConfig.unit || unit || '';
  }

  /**
   * Builds the style object for the UOM tspan from state styles and optional uom styles.
   *
   * @param {object} stateStyles - Final state value styles.
   * @returns {object} Final UOM styles.
   */
  getUomStyles(stateStyles) {
    const uomStyles = {
      opacity: '0.7',
    };
    const uomConfig = this.runtimeConfig.uom ?? {};
    const itemUomStyleDict = ConfigHelper.toStyleDict(uomConfig.styles);
    const fsuomStr = stateStyles['font-size'];
    let fsuomValue = 0.5;
    let fsuomType = 'em';

    const fsuomMatch = String(fsuomStr)
      .trim()
      .match(/^(\d*\.?\d+)([a-z%]+)$/i);

    if (fsuomMatch) {
      fsuomValue = Number(fsuomMatch[1]) * 0.6;
      fsuomType = fsuomMatch[2];
    } else {
      console.error('Cannot determine font-size for state', fsuomStr);
    }

    return {
      ...stateStyles,
      ...uomStyles,

      'font-size': `${fsuomValue}${fsuomType}`,
      ...itemUomStyleDict,
    };
  }

  /**
   * Future state text formatting support preserved from the old main.js pipeline.
   *
   * Keep this block next to the active state renderer so date/time, duration,
   * localized text, and explicit number formatting can be restored without
   * searching through main.js again.
   */
  // formatStateString(inState, entityConfig) {
  //   const lang = this._hass.selectedLanguage || this._hass.language;
  //   let locale = {};
  //   locale.language = lang;

  //   if (
  //     [
  //       'relative',
  //       'total',
  //       'datetime',
  //       'datetime-short',
  //       'datetime-short_with-year',
  //       'datetime_seconds',
  //       'datetime-numeric',
  //       'date',
  //       'date_month',
  //       'date_month_year',
  //       'date-short',
  //       'date-numeric',
  //       'date_weekday',
  //       'date_weekday_day',
  //       'date_weekday-short',
  //       'time',
  //       'time-24h',
  //       'time-24h_date-short',
  //       'time_weekday',
  //       'time_seconds',
  //     ].includes(entityConfig.format)
  //   ) {
  //     const timestamp = new Date(inState);
  //     if (!(timestamp instanceof Date) || isNaN(timestamp.getTime())) {
  //       return inState;
  //     }

  //     // if (!EntityStateTool.testTimeDate) {
  //     //   EntityStateTool.testTimeDate = true;
  //     //   console.log('datetime', formatDateTime(timestamp, locale));
  //     //   console.log('datetime-numeric', formatDateTimeNumeric(timestamp, locale));
  //     //   console.log('date', formatDate(timestamp, locale));
  //     //   console.log('date_month', formatDateMonth(timestamp, locale));
  //     //   console.log('date_month_year', formatDateMonthYear(timestamp, locale));
  //     //   console.log('date-short', formatDateShort(timestamp, locale));
  //     //   console.log('date-numeric', formatDateNumeric(timestamp, locale));
  //     //   console.log('date_weekday', formatDateWeekday(timestamp, locale));
  //     //   console.log('date_weekday-short', formatDateWeekdayShort(timestamp, locale));
  //     //   console.log('date_weekday_day', formatDateWeekdayDay(timestamp, locale));
  //     //   console.log('time', formatTime(timestamp, locale));
  //     //   console.log('time-24h', formatTime24h(timestamp, locale));
  //     //   console.log('time_weekday', formatTimeWeekday(timestamp, locale));
  //     //   console.log('time_seconds', formatTimeWithSeconds(timestamp, locale));
  //     // }

  //     let retValue;
  //     // return date/time according to formatting...
  //     switch (entityConfig.format) {
  //       case 'relative':
  //         // eslint-disable-next-line no-case-declarations
  //         const diff = selectUnit(timestamp, new Date());
  //         retValue = new Intl.RelativeTimeFormat(lang, { numeric: 'auto' }).format(diff.value, diff.unit);
  //         break;
  //       case 'total':
  //       case 'precision':
  //         retValue = 'Not Yet Supported';
  //         break;
  //       case 'datetime':
  //         retValue = formatDateTime(timestamp, locale);
  //         break;
  //       case 'datetime-short':
  //         retValue = formatShortDateTime(timestamp, locale);
  //         break;
  //       case 'datetime-short_with-year':
  //         retValue = formatShortDateTimeWithYear(timestamp, locale);
  //         break;
  //       case 'datetime_seconds':
  //         retValue = formatDateTimeWithSeconds(timestamp, locale);
  //         break;
  //       case 'datetime-numeric':
  //         retValue = formatDateTimeNumeric(timestamp, locale);
  //         break;
  //       case 'date':
  //         retValue = formatDate(timestamp, locale);
  //         // retValue = new Intl.DateTimeFormat(lang, { year: 'numeric', month: 'numeric', day: 'numeric' }).format(timestamp);
  //         break;
  //       case 'date_month':
  //         retValue = formatDateMonth(timestamp, locale);
  //         break;
  //       case 'date_month_year':
  //         retValue = formatDateMonthYear(timestamp, locale);
  //         break;
  //       case 'date-short':
  //         retValue = formatDateShort(timestamp, locale);
  //         break;
  //       case 'date-numeric':
  //         retValue = formatDateNumeric(timestamp, locale);
  //         break;
  //       case 'date_weekday':
  //         retValue = formatDateWeekday(timestamp, locale);
  //         break;
  //       case 'date_weekday-short':
  //         retValue = formatDateWeekdayShort(timestamp, locale);
  //         break;
  //       case 'date_weekday_day':
  //         retValue = formatDateWeekdayDay(timestamp, locale);
  //         break;
  //       case 'time':
  //         retValue = formatTime(timestamp, locale);
  //         // retValue = new Intl.DateTimeFormat(lang, { hour: 'numeric', minute: 'numeric', second: 'numeric' }).format(timestamp);
  //         break;
  //       case 'time-24h':
  //         retValue = formatTime24h(timestamp);
  //         break;
  //       case 'time-24h_date-short':
  //         // eslint-disable-next-line no-case-declarations
  //         const diff2 = selectUnit(timestamp, new Date());
  //         if (['second', 'minute', 'hour'].includes(diff2.unit)) {
  //           retValue = formatTime24h(timestamp);
  //         } else {
  //           retValue = formatDateShort(timestamp, locale);
  //         }
  //         break;
  //       case 'time_weekday':
  //         retValue = formatTimeWeekday(timestamp, locale);
  //         break;
  //       case 'time_seconds':
  //         retValue = formatTimeWithSeconds(timestamp, locale);
  //         break;
  //       default:
  //     }
  //     return retValue;
  //   }

  //   if (isNaN(parseFloat(inState)) || !isFinite(inState)) {
  //     return inState;
  //   }
  //   if (entityConfig.format === 'brightness' || entityConfig.format === 'brightness_pct') {
  //     return `${Math.round((inState / 255) * 100)} %`;
  //   }
  //   if (entityConfig.format === 'duration') {
  //     return formatDuration(inState, 's');
  //   }
  // }

  // _buildStateText(stateObj, entityConfig = {}) {
  //   if (!stateObj) return '';

  //   const entityId = stateObj.entity_id;
  //   const entity = this._hass.entities?.[entityId];
  //   const entity2 = this._hass.states?.[entityId];
  //   const domain = computeDomain(entityId);

  //   let inState = entityConfig.attribute ? stateObj.attributes?.[entityConfig.attribute] : stateObj.state;
  //   inState = this._buildState(inState, entityConfig);
  //   if (this.dev.debug) {
  //     console.log('In _buildStateText, entityId, buildState', entityId, inState);
  //   }
  //   if ([undefined, 'undefined'].includes(inState)) {
  //     return '';
  //   }

  //   if (entityConfig.format !== undefined && typeof inState !== 'undefined') {
  //     inState = this.formatStateString(inState, entityConfig);
  //   }

  //   const localeTag = entityConfig.locale_tag ? `${entityConfig.locale_tag}${String(inState).toLowerCase()}` : undefined;

  //   if (inState && isNaN(inState) && (!entityConfig.secondary_info || entityConfig.attribute)) {
  //     inState =
  //       (localeTag && this._hass.localize(localeTag)) ||
  //       (entity?.translation_key && this._hass.localize(`component.${entity.platform}.entity.${domain}.${entity.translation_key}.state.${inState}`)) ||
  //       (entity2?.attributes?.device_class && this._hass.localize(`component.${domain}.entity_component.${entity2.attributes.device_class}.state.${inState}`)) ||
  //       this._hass.localize(`component.${domain}.entity_component._.state.${inState}`) ||
  //       inState;

  //     inState = this.textEllipsis?.(inState, this.config?.show?.ellipsis) ?? inState;
  //   }

  //   if (['undefined', 'unknown', 'unavailable', '-ua-'].includes(inState)) {
  //     inState = this._hass.localize(`state.default.${inState}`);
  //   }

  //   if (!isNaN(inState)) {
  //     let options = {};
  //     options = getDefaultFormatOptions(inState, options);

  //     if (entityConfig.decimals !== undefined) {
  //       options.maximumFractionDigits = options.maximumFractionDigits === 0 ? 0 : Number(entityConfig.decimals);
  //       // options.minimumFractionDigits = options.maximumFractionDigits;
  //       options.minimumFractionDigits = 0;
  //     }

  //     inState = formatNumber(inState, this._hass.locale, options);
  //     if (this.dev.debug) {
  //       console.log('In _buildStateText, entityId, formatNumber', entityId, inState);
  //     }

  //     // inState = formatNumber(inState, this._hass.locale);
  //   }

  //   return inState;
  // }

  /**
   * Renders one state layout item.
   *
   * @returns {TemplateResult} SVG template for the state.
   */
  render() {
    const stateStyles = {
      'font-size': '1em',
      color: 'var(--primary-text-color)',
      opacity: '1.0',
      'text-anchor': 'middle',
    };
    const styles = this.getStyles(stateStyles);

    this.applyColorStops(styles, 'fill');

    const uomStyle = this.getUomStyles(styles);
    const dx = this.runtimeConfig.dx ? this.runtimeConfig.dx : '0';
    const dy = this.runtimeConfig.dy ? this.runtimeConfig.dy : '0';
    const uomConfig = this.runtimeConfig.uom ?? {};
    const uomDx = uomConfig.dx ?? '0.1';
    const uomDy = uomConfig.dy ?? '-0.45';

    return svg`
      <g
        transform="${this.getGroupScaleTransform()}"
        style="${this.getGroupScaleStyle()}"
      >
        <text @click=${(event) => this.handlePopup(event)}>
          <tspan
            class="state__value"
            x="${this.runtimeConfig.svg.xpos}"
            y="${this.runtimeConfig.svg.ypos}"
            dx="${dx}em"
            dy="${dy}em"
            style=${styleMap(styles)}
          >${this.state}</tspan><tspan
            class="state__uom"
            dx="${uomDx}em"
            dy="${uomDy}em"
            style=${styleMap(uomStyle)}
          >${this.uom}</tspan>
        </text>
      </g>
    `;
  }
}
