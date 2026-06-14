/*
 *
 * Card      : flex-horseshoe-card.js
 * Project   : Home Assistant
 * Repository: https://github.com/AmoebeLabs/
 *
 * Author    : Mars @ AmoebeLabs.com
 *
 * License   : MIT
 *
 * -----
 * Description:
 *   The Flexible Horseshoe Card.
 *
 * Refs:
 *   - https://github.com/AmoebeLabs/flex-horseshoe-card
 *
 *******************************************************************************
 */

import { LitElement, html, css, svg } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import { selectUnit } from '@formatjs/intl-utils';
import { SVGInjector } from '@tanem/svg-injector';
import ConfigHelper from './config-helper.js';
import Templates from './templates.js';
import ColorStops from './color-stops.js';
import { stateIconName } from './frontend_mods/common/entity/state_icon_name.js';
import { formatNumber, getDefaultFormatOptions } from './frontend_mods/common/number/format_number.ts';

import { formatDate, formatDateMonth, formatDateMonthYear, formatDateShort, formatDateNumeric, formatDateWeekday, formatDateWeekdayDay, formatDateWeekdayShort } from './frontend_mods/common/datetime/format_date.ts';
import { formatTime, formatTime24h, formatTimeWeekday, formatTimeWithSeconds } from './frontend_mods/common/datetime/format_time.ts';
import { formatDateTime, formatDateTimeNumeric, formatDateTimeWithSeconds, formatShortDateTime, formatShortDateTimeWithYear } from './frontend_mods/common/datetime/format_date_time.ts';
import { formatDuration } from './frontend_mods/common/datetime/format_duration.ts';
import { computeDomain } from './frontend_mods/common/entity/compute_domain.ts';
import { computeEntityUnitDisplay } from './frontend_mods/common/entity/compute_entity_unit_display.ts';
import { entityIcon, attributeIcon } from './frontend_mods/data/icons.ts';
import { hs2rgb, rgb2hex, rgb2hsv, hsv2rgb } from './frontend_mods/common/color/convert-color.ts';
import { rgbw2rgb, rgbww2rgb, temperature2rgb } from './frontend_mods/common/color/convert-light-color.ts';
import { computeStateDomain } from './frontend_mods/common/entity/compute_state_domain.ts';
import Colors from './colors.js';
import Utils from './utils.js';
import Merge from './merge.js';
import FIXED_WEATHER_ATTRIBUTE_ICONS_NAME from './weather-icons-name.ts';
import { FONT_SIZE, SVG_VIEW_BOX, SVG_DEFAULT_DIMENSIONS, SVG_DEFAULT_DIMENSIONS_HALF } from './const.js';
import HorseshoesLayout from './layout/horseshoes-layout.js';
import HorseshoeGauge from './horseshoe-gauge.js';
import Label from './labels.js';
import { version } from '../package.json';
import Palette from './palettes.js';

console.info(`%c FLEX-HORSESHOE-CARD %c Version ${version} `, 'color: white; font-weight: bold; background: darkgreen', 'color: darkgreen; font-weight: bold; background: white');

const DEFAULT_TAP_ACTION = {
  action: 'more-info',
};

const DEFAULT_SHOW = {
  horseshoe: true,
  scale_tickmarks: false,
  horseshoe_style: 'fixed',
  scale_style: 'fixed',
};

// ++ Class ++++++++++

class FlexHorseshoeCard extends LitElement {
  constructor() {
    super();

    Colors.setElement(this);
    this.palettesLoaded = false;

    // Get cardId for unique SVG gradient Id
    this.cardId = Math.random().toString(36).substr(2, 9);
    this._hass = undefined;
    this.entities = [];
    this.entitiesStr = [];
    this.attributesStr = [];
    this.viewBoxSize = SVG_VIEW_BOX;
    this.viewBox = { width: SVG_VIEW_BOX, height: SVG_VIEW_BOX };
    this.colorStops = {};
    this.animations = {};
    this.animations.vlines = {};
    this.animations.hlines = {};
    this.animations.circles = {};
    this.animations.icons = {};
    this.animations.iconsIcon = {};
    this.animations.names = {};
    this.animations.areas = {};
    this.animations.states = {};
    this.resolvedEntityConfigs = [];
    this.colorCache = {};
    this.isAndroid = false;
    this.isSafari = false;
    this.iOS = false;

    this.resolvedVariables = {};
    this.iconCache = {};
    this.iconsSvg = [];
    this.pendingIconPath = [];
    this.iconsId = [];

    this.svgUrlCache ||= {};

    // Theme mode support
    this.theme = {};
    // Did not check for theme loading yet!
    this.theme.checked = false;
    this.theme.isLoaded = false;
    this.theme.modeChanged = false;
    this.theme.darkMode = false;
    this.theme.light = {};
    this.theme.dark = {};
    this.palettes = {};

    // Determines if horseshoe has full range, or is split in right/left from the top middle
    this.bar_mode = 'normal'; // default

    this.dev = {
      debug: false,
    };
    // http://jsfiddle.net/jlubean/dL5cLjxt/
    // this.isSafari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);
    // this.iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    // 2020.11.16
    // See: https://javascriptio.com/view/10924/detect-if-device-is-ios
    // After iOS 13 you should detect iOS devices like this, since iPad will not be detected as iOS devices
    // by old ways (due to new "desktop" options, enabled by default)

    this.isAndroid = !!window.navigator.userAgent.match(/Android/);
    if (!this.isAndroid) {
      const ua = window.navigator.userAgent || '';
      const uaLower = ua.toLowerCase();
      const platform = window.navigator.platform || '';

      const isIOS = (/iPad|iPhone|iPod/.test(ua) || (platform === 'MacIntel' && window.navigator.maxTouchPoints > 1)) && !window.MSStream;

      // Detect real Safari:
      // Safari normally has "Version/17.4 ... Safari/605.1.15".
      // Chrome uses this as strings "Safari/537.36", but doesn't have "Version/x ... Safari".
      const safariVersionMatch = ua.match(/Version\/(\d+)(?:\.[\d.]+)?.*Safari/i);
      const realSafariMajorVersion = safariVersionMatch ? Number(safariVersionMatch[1]) : undefined;

      // Home Assistant iOS companion app
      // The iOS app does not use a standard agent string...
      // See: https://github.com/home-assistant/iOS/blob/master/Sources/Shared/API/HAAPI.swift
      // It contains strings like "like Safari" and "OS 14_2", and "iOS 14.2.0"
      const haOsLikeSafariMatch = uaLower.match(/\bos\s+(\d+)(?:[._]\d+)*.*like safari/);
      const haIosVersionMatch = uaLower.match(/\bios\s+(\d+)(?:[._]\d+)*/);

      const haAppMajorVersion = haIosVersionMatch ? Number(haIosVersionMatch[1]) : haOsLikeSafariMatch ? Number(haOsLikeSafariMatch[1]) : undefined;

      const isRealSafari = Number.isFinite(realSafariMajorVersion);
      const isHomeAssistantLikeSafari = Number.isFinite(haAppMajorVersion) && uaLower.includes('like safari');

      const safariMajorVersion = isRealSafari ? realSafariMajorVersion : isHomeAssistantLikeSafari ? haAppMajorVersion : undefined;

      this.iOS = isIOS;

      // Now, tell me if this is Safari...
      this.isSafari = Number.isFinite(safariMajorVersion);

      this.safariMajorVersion = safariMajorVersion;
      this.isHomeAssistantLikeSafari = isHomeAssistantLikeSafari;
      this.isRealSafari = isRealSafari;

      this.isSafari14 = this.isSafari && safariMajorVersion === 14;
      this.isSafari15 = this.isSafari && safariMajorVersion === 15;
      this.isSafari16 = this.isSafari && safariMajorVersion === 16;
      this.isSafari17 = this.isSafari && safariMajorVersion === 17;
      this.isSafari18 = this.isSafari && safariMajorVersion === 18;
      this.isSafari26 = this.isSafari && safariMajorVersion === 26;
      this.isSafari27 = this.isSafari && safariMajorVersion === 27;
      this.isSafari28 = this.isSafari && safariMajorVersion === 28;
      this.isSafari29 = this.isSafari && safariMajorVersion === 29;
      this.isSafari30 = this.isSafari && safariMajorVersion === 30;

      this.isSafariGte16 = this.isSafari && safariMajorVersion >= 16;

      if (this.dev?.debug) {
        console.log('browser detection', {
          ua,
          isAndroid: this.isAndroid,
          isIOS: this.iOS,
          isSafari: this.isSafari,
          isRealSafari: this.isRealSafari,
          isHomeAssistantLikeSafari: this.isHomeAssistantLikeSafari,
          safariMajorVersion: this.safariMajorVersion,
          isSafariGte16: this.isSafariGte16,
        });
      }

      // console.log('style test 1', ConfigHelper.toStyleDict([{ 'font-size': '2.8em;' }, { 'text-anchor': 'start;' }, { opacity: '0.7;' }]));

      // console.log('style test 2', ConfigHelper.toStyleDict(['font-size: 2.8em;', 'text-anchor: start;', 'opacity: 0.7;']));

      // console.log('style test 3', ConfigHelper.toStyleDict(['font-size: 2.8em', 'text-anchor: start', 'opacity: 0.7']));

      // console.log(
      //   'style test 4',
      //   ConfigHelper.toStyleDict({
      //     'font-size': '2.8em;',
      //     'text-anchor': 'start;',
      //     opacity: '0.7;',
      //   }),
      // );

      // console.log(
      //   'style test 5',
      //   ConfigHelper.toStyleDict({
      //     'font-size': '2.8em',
      //     'text-anchor': 'start',
      //     opacity: 0.7,
      //   }),
      // );

      // console.log('style test 6', ConfigHelper.toStyleDict('font-size: 2.8em; text-anchor: start; opacity: 0.7;'));

      // console.log(
      //   'style test 7',
      //   ConfigHelper.toStyleDict([
      //     `[[[
      //     return { 'font-size': '2.8em' };
      //   ]]]`,
      //     'text-anchor: start;',
      //     'opacity: 0.7;',
      //   ]),
      // );

      // const rawStyles = [
      //   `[[[
      //   return { 'font-size': '2.8em' };
      // ]]]`,
      //   'text-anchor: start;',
      //   'opacity: 0.7;',
      // ];
      // const item = {
      //   entity_index: 0,
      // };
      // const resolvedStyles = Templates.getJsTemplateOrValue(item, rawStyles);
      // const itemStyleDict = ConfigHelper.toStyleDict(resolvedStyles);

      // console.log('style test 8 - resolvedStyles', resolvedStyles);
      // console.log('style test 8 - itemStyleDict', itemStyleDict);
      // if (this.config?.dev?.debug) {
      //   ColorStops._testColorStopsNormalizer();
      // }

      // Resolve entities. Note that entities can be defined as a string, and can contain templates, so we resolve them here once and for all, and store the result in this.entities. This is used by the rest of the code to get the entities to work with.
      this.resolvedEntityConfigs = this._resolveEntityConfigs(this.config);
    }
  }

  /** *****************************************************************************
   * Summary.
   *  Implements the properties method
   *
   */
  /*
  static get properties() {
    return {
    hass: {},
    config: {},
        states: [],
        statesStr: [],

    dashArray: String,
        color1_offset: String,
        color0: String,
        color1: String,
        angleCoords: Object
    }
  }
  */
  /** *****************************************************************************
   * styles()
   *
   * Summary.
   *  Returns the static CSS styles for the lit-element
   *
   * Note:
   *  - The BEM (http://getbem.com/naming/) naming style for CSS is used
   *    Of course, if no mistakes are made ;-)
   *
   */
  static get styles() {
    return css`
      :host {
        cursor: pointer;
      }

      @media (print), (prefers-reduced-motion: reduce) {
        .animated {
          animation-duration: 1ms !important;
          transition-duration: 1ms !important;
          animation-iteration-count: 1 !important;
        }
      }

      @keyframes zoomOut {
        from {
          opacity: 1;
        }

        50% {
          opacity: 0;
          transform: scale3d(0.3, 0.3, 0.3);
        }

        to {
          opacity: 0;
        }
      }

      @keyframes bounce {
        from,
        20%,
        53%,
        80%,
        to {
          animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
          transform: translate3d(0, 0, 0);
        }

        40%,
        43% {
          animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
          transform: translate3d(0, -30px, 0);
        }

        70% {
          animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
          transform: translate3d(0, -15px, 0);
        }

        90% {
          transform: translate3d(0, -4px, 0);
        }
      }

      @keyframes flash {
        from,
        50%,
        to {
          opacity: 1;
        }

        25%,
        75% {
          opacity: 0;
        }
      }

      @keyframes headShake {
        0% {
          transform: translateX(0);
        }

        6.5% {
          transform: translateX(-6px) rotateY(-9deg);
        }

        18.5% {
          transform: translateX(5px) rotateY(7deg);
        }

        31.5% {
          transform: translateX(-3px) rotateY(-5deg);
        }

        43.5% {
          transform: translateX(2px) rotateY(3deg);
        }

        50% {
          transform: translateX(0);
        }
      }

      @keyframes heartBeat {
        0% {
          transform: scale(1);
        }

        14% {
          transform: scale(1.3);
        }

        28% {
          transform: scale(1);
        }

        42% {
          transform: scale(1.3);
        }

        70% {
          transform: scale(1);
        }
      }

      @keyframes jello {
        from,
        11.1%,
        to {
          transform: translate3d(0, 0, 0);
        }

        22.2% {
          transform: skewX(-12.5deg) skewY(-12.5deg);
        }

        33.3% {
          transform: skewX(6.25deg) skewY(6.25deg);
        }

        44.4% {
          transform: skewX(-3.125deg) skewY(-3.125deg);
        }

        55.5% {
          transform: skewX(1.5625deg) skewY(1.5625deg);
        }

        66.6% {
          transform: skewX(-0.78125deg) skewY(-0.78125deg);
        }

        77.7% {
          transform: skewX(0.390625deg) skewY(0.390625deg);
        }

        88.8% {
          transform: skewX(-0.1953125deg) skewY(-0.1953125deg);
        }
      }

      @keyframes pulse {
        from {
          transform: scale3d(1, 1, 1);
        }

        50% {
          transform: scale3d(1.05, 1.05, 1.05);
        }

        to {
          transform: scale3d(1, 1, 1);
        }
      }

      @keyframes rubberBand {
        from {
          transform: scale3d(1, 1, 1);
        }

        30% {
          transform: scale3d(1.25, 0.75, 1);
        }

        40% {
          transform: scale3d(0.75, 1.25, 1);
        }

        50% {
          transform: scale3d(1.15, 0.85, 1);
        }

        65% {
          transform: scale3d(0.95, 1.05, 1);
        }

        75% {
          transform: scale3d(1.05, 0.95, 1);
        }

        to {
          transform: scale3d(1, 1, 1);
        }
      }

      @keyframes shake {
        from,
        to {
          transform: translate3d(0, 0, 0);
        }

        10%,
        30%,
        50%,
        70%,
        90% {
          transform: translate3d(-10px, 0, 0);
        }

        20%,
        40%,
        60%,
        80% {
          transform: translate3d(10px, 0, 0);
        }
      }

      @keyframes swing {
        20% {
          transform: rotate3d(0, 0, 1, 15deg);
        }

        40% {
          transform: rotate3d(0, 0, 1, -10deg);
        }

        60% {
          transform: rotate3d(0, 0, 1, 5deg);
        }

        80% {
          transform: rotate3d(0, 0, 1, -5deg);
        }

        to {
          transform: rotate3d(0, 0, 1, 0deg);
        }
      }

      @keyframes tada {
        from {
          transform: scale3d(1, 1, 1);
        }
        10%,
        20% {
          transform: scale3d(0.9, 0.9, 0.9) rotate3d(0, 0, 1, -3deg);
        }
        30%,
        50%,
        70%,
        90% {
          transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg);
        }
        40%,
        60%,
        80% {
          transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg);
        }
        to {
          transform: scale3d(1, 1, 1);
        }
      }

      @keyframes wobble {
        from {
          transform: translate3d(0, 0, 0);
        }
        15% {
          transform: translate3d(-25%, 0, 0) rotate3d(0, 0, 1, -5deg);
        }
        30% {
          transform: translate3d(20%, 0, 0) rotate3d(0, 0, 1, 3deg);
        }
        45% {
          transform: translate3d(-15%, 0, 0) rotate3d(0, 0, 1, -3deg);
        }
        60% {
          transform: translate3d(10%, 0, 0) rotate3d(0, 0, 1, 2deg);
        }
        75% {
          transform: translate3d(-5%, 0, 0) rotate3d(0, 0, 1, -1deg);
        }
        to {
          transform: translate3d(0, 0, 0);
        }
      }

      @media screen and (min-width: 467px) {
        :host {
          font-size: 12px;
        }
      }
      @media screen and (max-width: 466px) {
        :host {
          font-size: 12px;
        }
      }

      :host ha-card {
        padding: 5px 5px 5px 5px;
      }

      .container {
        position: relative;
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      .labelContainer {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 65%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-end;
      }

      .ellipsis {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }

      .state {
        position: relative;
        display: flex;
        flex-wrap: wrap;
        max-width: 100%;
        min-width: 0px;
      }

      #label {
        display: flex;
        line-height: 1;
      }

      #label.bold {
        font-weight: bold;
      }

      #label,
      #name {
        margin: 3% 0;
      }

      .text {
        font-size: 100%;
      }

      #name {
        font-size: 80%;
        font-weight: 300;
      }

      .unit {
        font-size: 65%;
        font-weight: normal;
        opacity: 0.6;
        line-height: 2em;
        vertical-align: bottom;
        margin-left: 0.25rem;
      }

      .entity__area {
        position: absolute;
        top: 70%;
        font-size: 120%;
        opacity: 0.6;
        display: flex;
        line-height: 1;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 20%;
        flex-direction: column;
      }

      .nam {
        alignment-baseline: central;
        fill: var(--primary-text-color);
      }

      .state__uom {
        font-size: 20px;
        opacity: 0.7;
        margin: 0;
        fill: var(--primary-text-color);
      }

      .state__value {
        font-size: 3em;
        opacity: 1;
        fill: var(--primary-text-color);
        text-anchor: middle;
      }
      .entity__name {
        text-anchor: middle;
        overflow: hidden;
        opacity: 0.8;
        fill: var(--primary-text-color);
        font-size: 1.5em;
        text-transform: uppercase;
        letter-spacing: 0.1em;
      }

      .entity__area {
        font-size: 12px;
        opacity: 0.7;
        overflow: hidden;
        fill: var(--primary-text-color);
        text-anchor: middle;
        text-transform: uppercase;
        letter-spacing: 0.1em;
      }

      .shadow {
        font-size: 30px;
        font-weight: 700;
        text-anchor: middle;
      }

      .card--dropshadow-5 {
        filter: drop-shadow(0 1px 0 #ccc) drop-shadow(0 2px 0 #c9c9c9) drop-shadow(0 3px 0 #bbb) drop-shadow(0 4px 0 #b9b9b9) drop-shadow(0 5px 0 #aaa) drop-shadow(0 6px 1px rgba(0, 0, 0, 0.1))
          drop-shadow(0 0 5px rgba(0, 0, 0, 0.1)) drop-shadow(0 1px 3px rgba(0, 0, 0, 0.3)) drop-shadow(0 3px 5px rgba(0, 0, 0, 0.2)) drop-shadow(0 5px 10px rgba(0, 0, 0, 0.25))
          drop-shadow(0 10px 10px rgba(0, 0, 0, 0.2)) drop-shadow(0 20px 20px rgba(0, 0, 0, 0.15));
      }
      .card--dropshadow-medium--opaque--sepia90 {
        filter: drop-shadow(0em 0.05em 0px #b2a98f22) drop-shadow(0em 0.07em 0px #b2a98f55) drop-shadow(0em 0.1em 0px #b2a98f88) drop-shadow(0px 0.6em 0.9em rgba(0, 0, 0, 0.15))
          drop-shadow(0px 1.2em 0.15em rgba(0, 0, 0, 0.1)) drop-shadow(0px 2.4em 2.5em rgba(0, 0, 0, 0.1)) sepia(90%);
      }

      .card--dropshadow-heavy--sepia90 {
        filter: drop-shadow(0em 0.05em 0px #b2a98f22) drop-shadow(0em 0.07em 0px #b2a98f55) drop-shadow(0em 0.1em 0px #b2a98f88) drop-shadow(0px 0.3em 0.45em rgba(0, 0, 0, 0.5))
          drop-shadow(0px 0.6em 0.07em rgba(0, 0, 0, 0.3)) drop-shadow(0px 1.2em 1.25em rgba(0, 0, 0, 1)) drop-shadow(0px 1.8em 1.6em rgba(0, 0, 0, 0.1)) drop-shadow(0px 2.4em 2em rgba(0, 0, 0, 0.1))
          drop-shadow(0px 3em 2.5em rgba(0, 0, 0, 0.1)) sepia(90%);
      }

      .card--dropshadow-heavy {
        filter: drop-shadow(0em 0.05em 0px #b2a98f22) drop-shadow(0em 0.07em 0px #b2a98f55) drop-shadow(0em 0.1em 0px #b2a98f88) drop-shadow(0px 0.3em 0.45em rgba(0, 0, 0, 0.5))
          drop-shadow(0px 0.6em 0.07em rgba(0, 0, 0, 0.3)) drop-shadow(0px 1.2em 1.25em rgba(0, 0, 0, 1)) drop-shadow(0px 1.8em 1.6em rgba(0, 0, 0, 0.1)) drop-shadow(0px 2.4em 2em rgba(0, 0, 0, 0.1))
          drop-shadow(0px 3em 2.5em rgba(0, 0, 0, 0.1));
      }

      .card--dropshadow-medium--sepia90 {
        filter: drop-shadow(0em 0.05em 0px #b2a98f) drop-shadow(0em 0.15em 0px #b2a98f) drop-shadow(0em 0.15em 0px #b2a98f) drop-shadow(0px 0.6em 0.9em rgba(0, 0, 0, 0.15))
          drop-shadow(0px 1.2em 0.15em rgba(0, 0, 0, 0.1)) drop-shadow(0px 2.4em 2.5em rgba(0, 0, 0, 0.1)) sepia(90%);
      }

      .card--dropshadow-medium {
        filter: drop-shadow(0em 0.05em 0px #b2a98f) drop-shadow(0em 0.15em 0px #b2a98f) drop-shadow(0em 0.15em 0px #b2a98f) drop-shadow(0px 0.6em 0.9em rgba(0, 0, 0, 0.15))
          drop-shadow(0px 1.2em 0.15em rgba(0, 0, 0, 0.1)) drop-shadow(0px 2.4em 2.5em rgba(0, 0, 0, 0.1));
      }

      .card--dropshadow-light--sepia90 {
        filter: drop-shadow(0px 0.1em 0px #b2a98f) drop-shadow(0.1em 0.5em 0.2em rgba(0, 0, 0, 0.5)) sepia(90%);
      }

      .card--dropshadow-light {
        filter: drop-shadow(0px 0.1em 0px #b2a98f) drop-shadow(0.1em 0.5em 0.2em rgba(0, 0, 0, 0.5));
      }

      .card--dropshadow-down-and-distant {
        filter: drop-shadow(0px 0.05em 0px #b2a98f) drop-shadow(0px 14px 10px rgba(0, 0, 0, 0.15)) drop-shadow(0px 24px 2px rgba(0, 0, 0, 0.1)) drop-shadow(0px 34px 30px rgba(0, 0, 0, 0.1));
      }
      .card--filter-none {
      }

      .horseshoe__svg__group {
        /*
          * Was transform: translateY(15%).
          * After fixing SVG viewBox/namespace parsing, this offset became visible
          * and moved the horseshoe down.
          * A nice 6 year old bug ;-)
          */
      }

      .line__horizontal {
        stroke: var(--primary-text-color);
        opacity: 0.3;
        stroke-width: 2;
      }

      .line__vertical {
        stroke: var(--primary-text-color);
        opacity: 0.3;
        stroke-width: 2;
      }

      .svg__dot {
        fill: var(--primary-text-color);
        opacity: 0.5;
        align-self: center;
        transform-origin: 50% 50%;
      }

      .icon {
        align: center;
      }
    `;
  }

  _resolveEntityConfigs(config) {
    if (config?.dev?.debug) {
      console.log('resolving entity config for', config?.entities);
    }
    return (
      config?.entities?.map((entityConfig, index) => {
        const item = {
          entity_index: index,
        };

        return Templates.getJsTemplateOrValue(item, entityConfig);
      }) ?? []
    );
  }
  /** *****************************************************************************
   * hass()
   *
   * Summary.
   *  Updates hass data for the card
   *
   */

  _buildMyIcon(stateObj, entityConfig, stateMapConfig, entityAnimation) {
    if (!stateObj || !entityConfig) {
      return undefined;
    }

    if (entityAnimation) {
      return entityAnimation;
    }

    if (stateMapConfig?.icon) {
      return stateMapConfig.icon;
    }

    if (entityConfig.icon) {
      return entityConfig.icon;
    }

    const entityId = entityConfig.entity;
    const attribute = entityConfig.attribute;
    const attributeValue = attribute ? stateObj.attributes?.[attribute] : undefined;
    const domain = stateObj.entity_id?.split('.')[0];

    if (stateObj.attributes?.icon && !attribute) {
      return stateObj.attributes.icon;
    }

    // Sync weather attribute fallback
    if (attribute && domain === 'weather') {
      const weatherIcon = FIXED_WEATHER_ATTRIBUTE_ICONS_NAME[attribute];

      if (weatherIcon) {
        return weatherIcon;
      }
    }

    this.entitiesIcon ??= {};
    this.entitiesIconKey ??= {};
    this.entitiesIconPending ??= {};

    const iconId = attribute ? `${entityId}|attribute:${attribute}` : `${entityId}|state`;

    const key = attribute
      ? [entityId, 'attribute', attribute, attributeValue ?? '', domain ?? '', stateObj.attributes?.device_class ?? '', stateObj.attributes?.icon ?? ''].join('|')
      : [entityId, 'state', stateObj.state ?? '', domain ?? '', stateObj.attributes?.device_class ?? '', stateObj.attributes?.icon ?? ''].join('|');

    if (this.entitiesIconKey[iconId] === key) {
      return this.entitiesIcon[iconId];
    }

    this.entitiesIconKey[iconId] = key;

    if (!this.entitiesIconPending[iconId]) {
      this.entitiesIconPending[iconId] = true;

      const iconPromise = attribute
        ? attributeIcon(this._hass, stateObj, attribute, attributeValue !== undefined ? String(attributeValue) : undefined)
        : entityIcon(this._hass.entities, this._hass.config, this._hass.connection, stateObj);

      iconPromise
        .then((icon) => {
          if (this.entitiesIconKey[iconId] !== key) {
            return;
          }

          if (!icon) {
            return;
          }

          if (this.entitiesIcon[iconId] !== icon) {
            this.entitiesIcon[iconId] = icon;
            this.requestUpdate();
          }
        })
        .catch((err) => {
          console.error(attribute ? '_buildMyIcon attributeIcon failed' : '_buildMyIcon entityIcon failed', entityId, attribute ?? '', err);
        })
        .finally(() => {
          this.entitiesIconPending[iconId] = false;
        });
    }

    return this.entitiesIcon[iconId];
  }

  _formatEntityStateParts(stateObj, entityConfig) {
    const isAttribute = entityConfig.attribute !== undefined;
    const formatConfig = entityConfig.format || {}; // Fallback to empty dict if not defined

    // 1. Fetch the absolute raw value from state or attribute
    let rawValue = isAttribute ? stateObj.attributes[entityConfig.attribute] : stateObj.state;

    // 2. Handle absolute raw state bypass (raw_state_keep)
    // When raw_state_keep is true, 'raw is raw' and we skip all formatting/translations immediately
    if (formatConfig.raw_state_keep === true) {
      if (formatConfig.raw_state_clean === true && typeof rawValue === 'string') {
        rawValue = rawValue.replace(/_/g, ' ');
      }
      return [{ type: 'value', value: rawValue }];
    }

    // 3. Fallback to standard Home Assistant frontend parts splitting
    const parts = isAttribute ? this._hass.formatEntityAttributeValueToParts(stateObj, entityConfig.attribute) : this._hass.formatEntityStateToParts(stateObj, this._buildState(stateObj.state, entityConfig));

    // 4. Determine if the value is numeric
    const isNumeric = !Number.isNaN(Number(rawValue)) && rawValue !== null && rawValue !== '';

    // 5. Advanced number formatting (separator, decimals_min, decimals_max)
    // Text-based states naturally skip this block and keep their HA translations intact
    let formattedValue;
    if (isNumeric) {
      const activeLocale = formatConfig.locale || this._hass.locale?.language || this._hass.language || 'en-US';

      // Find the pre-formatted value that Home Assistant generated
      const haValuePart = parts.find((part) => part.type === 'value');
      let haDecimals; // Fixed: declared cleanly without undefined for ESLint (no-undef-init)

      // Convert to string safely to ensure lastIndexOf never crashes on pure numbers
      if (haValuePart && haValuePart.value !== undefined && haValuePart.value !== null) {
        const haValueStr = String(haValuePart.value);
        const decimalIndex = Math.max(haValueStr.lastIndexOf('.'), haValueStr.lastIndexOf(','));
        if (decimalIndex !== -1) {
          haDecimals = haValueStr.length - decimalIndex - 1;
        } else {
          haDecimals = 0;
        }
      }

      // Calculate maximum digits first (highest user priority, fallback to HA decimals, fallback to 2)
      const maxDigits = formatConfig.decimals_max ?? (haDecimals !== undefined ? haDecimals : entityConfig.decimals !== undefined ? Number(entityConfig.decimals) : 2);

      // Calculate minimum digits (highest user priority, fallback to HA decimals, fallback to 0)
      let minDigits = formatConfig.decimals_min ?? (haDecimals !== undefined ? haDecimals : entityConfig.decimals !== undefined ? Number(entityConfig.decimals) : 0);

      // Fixed: minDigits can NEVER be larger than maxDigits.
      // If the user limits max to 1, the minimum pulls down to 1 as well.
      if (minDigits > maxDigits) {
        minDigits = maxDigits;
      }

      const numberOptions = {
        // Disables the browser's thousands grouping when separator is set to false
        useGrouping: formatConfig.separator !== false,
        minimumFractionDigits: minDigits,
        maximumFractionDigits: maxDigits,
      };

      try {
        formattedValue = new Intl.NumberFormat(activeLocale, numberOptions).format(Number(rawValue));
      } catch (error) {
        console.error('Error formatting numeric state inside parts:', error);
      }
    }

    // 6. Map everything back to the SVG-ready parts array
    return parts.map((part) => {
      if (part.type === 'value' && formattedValue !== undefined) {
        return { ...part, value: formattedValue };
      }

      if (part.type === 'unit' && entityConfig.unit !== undefined) {
        return { ...part, value: entityConfig.unit };
      }

      return part;
    });
  }

  themeIsDarkMode() {
    return this.theme.darkMode === true;
  }

  themeIsLightMode() {
    return this.theme.darkMode === false;
  }

  set hass(hass) {
    this.setHass(hass);
  }

  setHass(hass, forceUpdate = false) {
    this._hass = hass;

    Templates.setContext({
      hass: this._hass,
      config: this.config,
      entities: this.entities,
      horseshoes: this.horseshoes,
    });

    let entityHasChanged = forceUpdate;
    let themeModeHasChanged = false;

    const themeName = hass.selectedTheme || hass.themes.theme || '';
    const themeDarkMode = hass.themes.darkMode === true;

    this.theme.nameChanged = this.theme.name !== themeName;
    this.theme.modeChanged = this.theme.darkMode !== themeDarkMode;

    if (this.theme.nameChanged || this.theme.modeChanged) {
      this.theme.name = themeName;
      this.theme.darkMode = themeDarkMode;
      Colors.colorCache = {};
      const mode = this.hass?.themes?.darkMode ? 'dark' : 'light';
      Palette.applyAll(this, this.palettes, mode);
    }

    this.resolvedEntityConfigs = this._resolveEntityConfigs(this.config);

    this.resolvedEntityConfigs.forEach((entityConfig, index) => {
      const entity = hass.states[entityConfig.entity];

      if (!entity) {
        return;
      }

      this.entities[index] = entity;

      const newStateStr = this._buildState(entity.state, entityConfig);

      // testing
      const stateObj = entity;
      const domain = computeStateDomain(stateObj);

      if (newStateStr !== this.entitiesStr[index]) {
        this.entitiesStr[index] = newStateStr;
        entityHasChanged = true;
      }

      // eslint-disable-next-line prefer-object-has-own
      if (entityConfig.attribute && Object.prototype.hasOwnProperty.call(entity.attributes, entityConfig.attribute)) {
        const newAttributeStr = this._buildState(entity.attributes[entityConfig.attribute], entityConfig);

        if (newAttributeStr !== this.attributesStr[index]) {
          this.attributesStr[index] = newAttributeStr;
          entityHasChanged = true;
        }
      }
    });

    if (!entityHasChanged) {
      return;
    }

    this.resolvedEntityConfigs = this._resolveEntityConfigs(this.config);

    this.horseshoeGauges = this.horseshoeGauges.map((horseshoe) => {
      const entityIndex = horseshoe.entity_index ?? 0;
      const entityConfig = this.resolvedEntityConfigs[entityIndex];
      const entity = this.entities[entityIndex];

      if (!entity || !entityConfig) {
        return horseshoe;
      }

      horseshoe.setState(entity, entityConfig);

      return horseshoe;
    });

    this.horseshoes = this.horseshoes.map((horseshoe, index) => {
      const entityIndex = horseshoe.entity_index ?? 0;
      const entityConfig = this.resolvedEntityConfigs[entityIndex];
      const entity = this.entities[entityIndex];

      if (!entity || !entityConfig) {
        return horseshoe;
      }

      let state = entity.state;

      if (entityConfig.attribute && entity.attributes[entityConfig.attribute] !== undefined) {
        state = entity.attributes[entityConfig.attribute];
      }

      // Do state mapping here?
      const smItem = this._getStateMapItem(horseshoe.horseshoe_state, entity);
      if (smItem) {
        // console.log('State map item found for horseshoe', index, ':', smItem);
        state = smItem.value;
      }
      const horseshoeScale = Templates.getJsTemplateOrValue({ entity_index: entityIndex }, horseshoe.horseshoe_scale);

      const min = horseshoeScale?.min ?? 0;
      const max = horseshoeScale?.max ?? 100;
      const barMode = horseshoe.bar_mode || 'normal';

      let dashArray;
      let dashOffset;
      let bidirectionalNegative = false;

      if (barMode === 'bidirectional') {
        if (this?.dev?.debug_bidirectional) {
          console.log('<debug_bidirectional> Set hass: Card ', this.cardId, 'bidirectional aset as barmode');
        }
        const totalLength = horseshoe.horseshoePathLength;
        let value = Number(state);
        if (this?.dev?.debug_invert_state) {
          value = -Number(state);
        }
        if (value >= 0) {
          if (this?.dev?.debug_bidirectional) {
            console.log('<debug_bidirectional> Set hass: Card ', this.cardId, 'Postive state: ', value);
          }
          const positiveLength = Math.min(Colors.calculateValueBetween(0, max, value), 1) * (totalLength / 2);

          dashArray = `${positiveLength} ${horseshoe.circlePathLength - positiveLength}`;
          dashOffset = undefined;
          bidirectionalNegative = false;
        } else {
          if (this?.dev?.debug_bidirectional) {
            console.log('<debug_bidirectional> Set hass: Card ', this.cardId, 'Negative state: ', value);
          }
          const negativeLength = (1 - Math.min(Colors.calculateValueBetween(min, 0, value), 1)) * (totalLength / 2);

          dashArray = `${negativeLength} ${horseshoe.circlePathLength - negativeLength}`;
          dashOffset = `${-(horseshoe.circlePathLength - negativeLength)}`;
          bidirectionalNegative = true;
        }
      } else {
        const value = Math.min(Colors.calculateValueBetween(min, max, state), 1);
        const score = value * horseshoe.horseshoePathLength;
        const total = 10 * horseshoe.radiusSize;

        dashArray = `${score} ${total}`;
        dashOffset = undefined;
        bidirectionalNegative = false;
      }

      const value = Math.min(Colors.calculateValueBetween(min, max, state), 1);
      const strokeStyle = horseshoe.show.horseshoe_style;

      let color0 = horseshoe.color0;
      let color1 = horseshoe.color1;
      let color1Offset = horseshoe.color1_offset;
      let angleCoords = horseshoe.angleCoords;
      let strokeColor = horseshoe.stroke_color;

      if (strokeStyle === 'fixed') {
        strokeColor = horseshoe.horseshoe_state.color;
        color0 = horseshoe.horseshoe_state.color;
        color1 = horseshoe.horseshoe_state.color;
        color1Offset = '0%';
      } else if (strokeStyle === 'autominmax') {
        const stroke = Colors.calculateStrokeColor(state, horseshoe.colorStopsMinMax, true);
        color0 = stroke;
        color1 = stroke;
        color1Offset = '0%';
      } else if (strokeStyle === 'colorstop' || strokeStyle === 'colorstopgradient') {
        const stroke = Colors.calculateStrokeColor(state, horseshoe.colorStops, strokeStyle === 'colorstopgradient');

        color0 = stroke;
        color1 = stroke;
        color1Offset = '0%';
      } else if (strokeStyle === 'lineargradient') {
        angleCoords = {
          x1: '0%',
          y1: '0%',
          x2: '100%',
          y2: '0%',
        };

        color1Offset = `${Math.round((1 - value) * 100)}%`;
      }

      return {
        ...horseshoe,

        horseshoe_scale: {
          ...horseshoe.horseshoe_scale,
          ...horseshoeScale,
        },

        dashArray,
        dashOffset,
        bidirectional_negative: bidirectionalNegative,

        stroke_color: strokeColor,
        color0,
        color1,
        color1_offset: color1Offset,
        angleCoords,
      };
    });

    // If horseshoe defined. Use first (legacy) to fill the default variables to use for rendering. Backwards compatibility for now...
    if (this.horseshoes.length > 0) {
      const defaultHorseshoe = this.horseshoes[0];

      this.dashArray = defaultHorseshoe.dashArray;
      this.dashOffset = defaultHorseshoe.dashOffset;
      this.bidirectional_negative = defaultHorseshoe.bidirectional_negative;

      this.stroke_color = defaultHorseshoe.stroke_color;
      this.color0 = defaultHorseshoe.color0;
      this.color1 = defaultHorseshoe.color1;
      this.color1_offset = defaultHorseshoe.color1_offset;
      this.angleCoords = defaultHorseshoe.angleCoords;
    }

    if (this.config.animations) {
      Object.keys(this.config.animations).map((animation) => {
        const entityIndex = animation.substr(Number(animation.indexOf('.') + 1));

        this.config.animations[animation].map((item) => {
          if (this.entities[entityIndex].state.toLowerCase() !== item.state.toLowerCase()) {
            return false;
          }

          if (item.vlines) {
            item.vlines.forEach((item2) => this._updateAnimationStyles('vlines', item2));
          }

          if (item.hlines) {
            item.hlines.forEach((item2) => this._updateAnimationStyles('hlines', item2));
          }

          if (item.circles) {
            item.circles.forEach((item2) => this._updateAnimationStyles('circles', item2));
          }

          if (item.icons) {
            item.icons.forEach((item2) => {
              const animationId = item2.animation_id;

              if (!this.animations.icons[animationId] || !item2.reuse) {
                this.animations.icons[animationId] = {};
                this.animations.iconsIcon[animationId] = {};
              }

              const resolvedStyles = Templates.getJsTemplateOrValue(item2, item2.styles);
              const animationStyleDict = ConfigHelper.toStyleDict(resolvedStyles);

              this.animations.icons[animationId] = {
                ...this.animations.icons[animationId],
                ...animationStyleDict,
              };

              this.animations.iconsIcon[animationId] = Templates.getJsTemplateOrValue(item2, item2.icon);
            });
          }

          if (item.states) {
            item.states.forEach((item2) => this._updateAnimationStyles('states', item2));
          }

          return true;
        });

        return true;
      });
    }

    Templates.setContext({
      hass: this._hass,
      config: this.config,
      entities: this.entities,
      horseshoes: this.horseshoes,
    });

    // An update has been requested to recalculate / redraw the tools, so reset theme mode changed
    this.theme.modeChanged = false;

    this.requestUpdate();
  }

  _updateAnimationStyles(section, item) {
    const animationId = item.animation_id;

    if (animationId === undefined || animationId === null) return;

    const resolvedStyles = Templates.getJsTemplateOrValue(item, item.styles);
    const styleDict = ConfigHelper.toStyleDict(resolvedStyles);

    this.animations[section][animationId] = {
      ...(item.reuse ? (this.animations[section][animationId] ?? {}) : {}),
      ...styleDict,
    };
  }

  _prepareItemColorStops(config) {
    const layoutSections = ['states', 'names', 'areas', 'circles', 'hlines', 'vlines', 'icons', 'horseshoes'];

    layoutSections.forEach((section) => {
      const items = config.layout?.[section];

      if (!Array.isArray(items)) return;

      items.forEach((item) => {
        if (!item.color_stops) return;

        const resolvedColorStops = Templates.getJsTemplateOrValue(item, item.color_stops, { resolveKeys: true });

        item._colorStops = ColorStops.normalize(resolvedColorStops);
      });
    });
  }

  _calculateSvgCoordinatesInGroup(item) {
    const svg = {
      xpos: Utils.calculateSvgDimension(item.xpos),
      ypos: Utils.calculateSvgDimension(item.yposc || item.ypos),
    };

    const group = this.config.layout?.groups?.[item.group];

    if (!item.group || !group) return svg;

    const halfPercent = (SVG_DEFAULT_DIMENSIONS_HALF / SVG_DEFAULT_DIMENSIONS) * 100;

    return {
      xpos: Utils.calculateSvgDimension(group.xpos + item.xpos - halfPercent),
      ypos: Utils.calculateSvgDimension(group.ypos + (item.yposc || item.ypos) - halfPercent),
    };
  }

  _computeGroupDimensions(config) {
    const groups = config.layout?.groups;

    if (!groups) return;

    Object.entries(groups).forEach(([groupName, group]) => {
      group.svg = {
        xpos: Utils.calculateSvgDimension(group.xpos),
        ypos: Utils.calculateSvgDimension(group.ypos),
      };
    });
  }

  _computeSvgDimensions(config) {
    const layout = config.layout;

    if (layout?.names) {
      layout.names.forEach((item) => {
        // item.svg = {
        //   xpos: Utils.calculateSvgDimension(item.xpos),
        //   ypos: Utils.calculateSvgDimension(item.ypos),
        // };
        item.svg = this._calculateSvgCoordinatesInGroup(item);
      });
    }

    if (layout?.states) {
      layout.states.forEach((item) => {
        item.svg = this._calculateSvgCoordinatesInGroup(item);
      });
    }

    if (layout?.areas) {
      layout.areas.forEach((item) => {
        item.svg = this._calculateSvgCoordinatesInGroup(item);
      });
    }

    if (layout?.icons) {
      layout.icons.forEach((item) => {
        item.svg = this._calculateSvgCoordinatesInGroup(item);
      });
    }

    if (layout?.hlines) {
      layout.hlines.forEach((item) => {
        item.svg = this._calculateSvgCoordinatesInGroup(item);
        item.svg.length = Utils.calculateSvgDimension(item.length);
      });
    }

    if (layout?.vlines) {
      layout.vlines.forEach((item) => {
        item.svg = this._calculateSvgCoordinatesInGroup(item);
        item.svg.length = Utils.calculateSvgDimension(item.length);
      });
    }

    if (layout?.circles) {
      layout.circles.forEach((item) => {
        item.svg = this._calculateSvgCoordinatesInGroup(item);
        // item.svg.radius = Utils.calculateSvgDimension(item.radius);
        item.svg.radius = item.radius;
      });
    }

    if (this?.horseshoes) {
      this.horseshoes.forEach((item) => {
        item.svg = this._calculateSvgCoordinatesInGroup(item);
        item.svg.radius = Utils.calculateSvgDimension(item.radius);
        item.svg.tickmarksRadius = Utils.calculateSvgDimension(item.tickmarks_radius);
        item.svg.rotateX = item.svg.xpos;
        item.svg.rotateY = item.svg.ypos;
      });
    }
  }

  /** *****************************************************************************
   * setConfig()
   *
   * Summary.
   *  Sets/Updates the card configuration. Rarely called if the doc is right
   *
   */

  _isStaticCalc(value) {
    return typeof value === 'string' && value.startsWith('calc(') && value.endsWith(')');
  }

  _evaluateStaticCalc(value, constants = {}) {
    const expression = value.slice(5, -1).trim();

    if (!/^[0-9+\-*/().,\sA-Za-z_]+$/.test(expression)) {
      throw new Error(`Invalid static calc expression '${value}'`);
    }

    const calcScope = {
      ...constants,
      sin: Math.sin,
      cos: Math.cos,
      tan: Math.tan,
      abs: Math.abs,
      round: Math.round,
      floor: Math.floor,
      ceil: Math.ceil,
      min: Math.min,
      max: Math.max,
      sqrt: Math.sqrt,
      PI: Math.PI,
    };

    // eslint-disable-next-line no-new-func
    const result = Function(...Object.keys(calcScope), `"use strict"; return (${expression});`)(...Object.values(calcScope));

    if (!this._isStaticNumber(result)) {
      throw new Error(`Static calc expression '${value}' did not return a finite number`);
    }

    return result;
  }

  _evaluateStaticCalcV2(value) {
    const expression = value.slice(5, -1).trim();

    if (!/^[0-9+\-*/().,\sA-Za-z_]+$/.test(expression)) {
      throw new Error(`Invalid static calc expression '${value}'`);
    }

    const calcFns = {
      sin: Math.sin,
      cos: Math.cos,
      tan: Math.tan,
      abs: Math.abs,
      round: Math.round,
      floor: Math.floor,
      ceil: Math.ceil,
      min: Math.min,
      max: Math.max,
      sqrt: Math.sqrt,
      PI: Math.PI,
    };

    // eslint-disable-next-line no-new-func
    const result = Function(...Object.keys(calcFns), `"use strict"; return (${expression});`)(...Object.values(calcFns));

    if (typeof result !== 'number' || !Number.isFinite(result)) {
      throw new Error(`Static calc expression '${value}' did not return a finite number`);
    }

    return result;
  }

  _evaluateStaticCalcV1(value) {
    const expression = value.slice(5, -1).trim();

    if (!/^[0-9+\-*/().\s]+$/.test(expression)) {
      throw new Error(`Invalid static calc expression '${value}'`);
    }

    // eslint-disable-next-line no-new-func
    const result = Function(`"use strict"; return (${expression});`)();

    if (typeof result !== 'number' || !Number.isFinite(result)) {
      throw new Error(`Static calc expression '${value}' did not return a number`);
    }

    return result;
  }

  _evaluateStaticConfigV1(config) {
    if (this._isStaticCalc(config)) {
      return this._evaluateStaticCalc(config);
    }

    if (Array.isArray(config)) {
      return config.map((item) => this._evaluateStaticConfig(item));
    }

    if (config && typeof config === 'object') {
      Object.entries(config).forEach(([key, value]) => {
        config[key] = this._evaluateStaticConfig(value);
      });

      return config;
    }

    return config;
  }

  _isStaticNumber(value) {
    return typeof value === 'number' && Number.isFinite(value);
  }

  _getStateMapItem(item, entityState) {
    const entries = item?.state_map?.map;
    if (!entries) return undefined;

    const state = entityState?.state;

    return entries.find((entry) => entry.state === state) ?? entries.find((entry) => entry.state === 'default');
  }

  _applySameAsDeltas(item, resolvedItem, index) {
    Object.entries(item).forEach(([key, value]) => {
      if (!key.startsWith('same_as_d')) return;

      const targetKey = key.substring('same_as_d'.length);

      if (!targetKey) {
        throw new Error(`Invalid same_as delta field '${key}' for item ${index}`);
      }

      if (resolvedItem[targetKey] === undefined) {
        throw new Error(`same_as delta '${key}' requires '${targetKey}' for item ${index}`);
      }

      if (!this._isStaticNumber(resolvedItem[targetKey])) {
        throw new Error(`same_as delta '${key}' requires numeric '${targetKey}' for item ${index}`);
      }

      if (!this._isStaticNumber(value)) {
        throw new Error(`same_as delta '${key}' must be numeric for item ${index}`);
      }

      resolvedItem[targetKey] += value;
    });

    return resolvedItem;
  }

  _applySameAsDeltasV1(item, resolvedItem) {
    Object.entries(item).forEach(([key, value]) => {
      if (!key.startsWith('same_as_d')) return;

      const targetKey = key.substring('same_as_d'.length);

      if (resolvedItem[targetKey] === undefined) {
        throw new Error(`same_as delta '${key}' requires '${targetKey}'`);
      }

      resolvedItem[targetKey] = Number(resolvedItem[targetKey]) + Number(value);
    });

    return resolvedItem;
  }

  // eslint-disable-next-line default-param-last
  _mergeSameAsItem(base, override, mergeMode = 'merge', mergeKey) {
    const merged = Merge.mergeDeep(base, override);

    Object.entries(override).forEach(([field, value]) => {
      const fieldMergeMode = value?.same_as_merge ?? mergeMode;
      const fieldMergeKey = value?.same_as_key ?? mergeKey;

      if (fieldMergeMode === 'replace') {
        const { same_as_merge, same_as_key, ...cleanValue } = value;
        merged[field] = cleanValue;
        return;
      }

      if (fieldMergeMode === 'keyed') {
        if (!fieldMergeKey) {
          throw new Error(`same_as_key is required when same_as_merge is keyed for field '${field}'`);
        }

        const { same_as_merge, same_as_key, ...cleanValue } = value;

        merged[field] = Merge.mergeDeep(base[field] ?? {}, cleanValue);

        Object.entries(cleanValue).forEach(([subField, subValue]) => {
          if (!Array.isArray(base[field]?.[subField]) || !Array.isArray(subValue)) return;

          merged[field][subField] = this._mergeListByKey(base[field][subField], subValue, fieldMergeKey);
        });
      }
    });

    return merged;
  }

  _mergeSameAsKeyed(base, override, mergeKey) {
    const merged = Merge.mergeDeep(base, override);

    if (!mergeKey) {
      throw new Error('same_as_key is required when same_as_merge is keyed');
    }

    Object.keys(override).forEach((field) => {
      if (!Array.isArray(base[field]) || !Array.isArray(override[field])) return;

      merged[field] = this._mergeListByKey(base[field], override[field], mergeKey);
    });

    return merged;
  }

  _mergeListByKey(baseList, overrideList, key) {
    const itemsByKey = new Map();

    baseList.forEach((item) => {
      itemsByKey.set(String(item[key]), item);
    });

    overrideList.forEach((item) => {
      const itemKey = String(item[key]);

      if (itemsByKey.has(itemKey)) {
        itemsByKey.set(itemKey, Merge.mergeDeep(itemsByKey.get(itemKey), item));
      } else {
        itemsByKey.set(itemKey, item);
      }
    });

    return [...itemsByKey.values()];
  }

  _resolveSameAsItems(items) {
    const resolvedItemsById = new Map();

    return items.map((item, index) => {
      let resolvedItem;

      if (item.same_as === undefined) {
        resolvedItem = item;
      } else {
        const base = resolvedItemsById.get(String(item.same_as));

        if (!base) {
          throw new Error(`same_as '${item.same_as}' not found for item ${index}`);
        }

        const { same_as, same_as_replace = [], ...restOfFields } = item;

        const baseForMerge = { ...base };

        same_as_replace.forEach((field) => {
          delete baseForMerge[field];
        });

        resolvedItem = Merge.mergeDeep(baseForMerge, restOfFields);
        resolvedItem = this._applySameAsDeltas(item, resolvedItem);

        delete resolvedItem.same_as;
        delete resolvedItem.same_as_replace;

        Object.keys(resolvedItem)
          .filter((key) => key.startsWith('same_as_d'))
          .forEach((key) => delete resolvedItem[key]);
      }

      resolvedItemsById.set(String(resolvedItem.id), resolvedItem);

      return resolvedItem;
    });
  }

  _resolveSameAsItemsV7(items) {
    const resolvedItemsById = new Map();

    return items.map((item, index) => {
      let resolvedItem;

      if (item.same_as === undefined) {
        resolvedItem = item;
      } else {
        const base = resolvedItemsById.get(String(item.same_as));

        if (!base) {
          throw new Error(`same_as '${item.same_as}' not found for item ${index}`);
        }

        const { same_as, same_as_replace = [], ...restOfFields } = item;

        resolvedItem = Merge.mergeDeep(base, restOfFields);

        same_as_replace.forEach((field) => {
          // eslint-disable-next-line prefer-object-has-own
          if (Object.prototype.hasOwnProperty.call(restOfFields, field)) {
            resolvedItem[field] = restOfFields[field];
          }
        });

        resolvedItem = this._applySameAsDeltas(item, resolvedItem);

        delete resolvedItem.same_as;
        delete resolvedItem.same_as_replace;

        Object.keys(resolvedItem)
          .filter((key) => key.startsWith('same_as_d'))
          .forEach((key) => delete resolvedItem[key]);
      }

      resolvedItemsById.set(String(resolvedItem.id), resolvedItem);

      return resolvedItem;
    });
  }

  _resolveSameAsItemsV6(items) {
    const resolvedItemsById = new Map();

    return items.map((item, index) => {
      let resolvedItem;

      if (item.same_as === undefined) {
        resolvedItem = item;
      } else {
        const base = resolvedItemsById.get(String(item.same_as));

        if (!base) {
          throw new Error(`same_as '${item.same_as}' not found for item ${index}`);
        }

        const { same_as, same_as_merge = 'merge', same_as_key, ...restOfFields } = item;

        resolvedItem = this._mergeSameAsItem(base, restOfFields, same_as_merge, same_as_key);
        resolvedItem = this._applySameAsDeltas(item, resolvedItem);

        delete resolvedItem.same_as;
        Object.keys(resolvedItem)
          .filter((key) => key.startsWith('same_as_d'))
          .forEach((key) => delete resolvedItem[key]);
      }

      resolvedItemsById.set(String(resolvedItem.id), resolvedItem);

      return resolvedItem;
    });
  }

  _resolveSameAsItemsV5(items) {
    const resolvedItemsById = new Map();

    return items.map((item, index) => {
      let resolvedItem;

      if (item.same_as === undefined) {
        resolvedItem = item;
      } else {
        const base = resolvedItemsById.get(String(item.same_as));

        if (!base) {
          throw new Error(`same_as '${item.same_as}' not found for item ${index}`);
        }

        const { same_as, ...restOfFields } = item;

        resolvedItem = Merge.mergeDeep(base, restOfFields);
        resolvedItem = this._applySameAsDeltas(item, resolvedItem);

        delete resolvedItem.same_as;
        Object.keys(resolvedItem)
          .filter((key) => key.startsWith('same_as_d'))
          .forEach((key) => delete resolvedItem[key]);
      }

      resolvedItemsById.set(String(resolvedItem.id), resolvedItem);

      return resolvedItem;
    });
  }

  _resolveSameAsItemsV4(items) {
    const resolvedItemsById = new Map();

    return items.map((item, index) => {
      let resolvedItem;

      if (item.same_as === undefined) {
        resolvedItem = item;
      } else {
        const base = resolvedItemsById.get(String(item.same_as));

        if (!base) {
          throw new Error(`same_as '${item.same_as}' not found for item ${index}`);
        }

        const { same_as, same_as_dxpos, same_as_dypos, same_as_dlength, same_as_dradius, ...restOfFields } = item;
        resolvedItem = Merge.mergeDeep(base, restOfFields);

        if (same_as_dxpos !== undefined) {
          resolvedItem.xpos = Number(resolvedItem.xpos) + Number(same_as_dxpos);
        }

        if (same_as_dypos !== undefined) {
          resolvedItem.ypos = Number(resolvedItem.ypos) + Number(same_as_dypos);
        }

        if (same_as_dlength !== undefined) {
          resolvedItem.length = Number(resolvedItem.length) + Number(same_as_dlength);
        }

        if (same_as_dradius !== undefined) {
          resolvedItem.radius = Number(resolvedItem.radius) + Number(same_as_dradius);
        }
      }

      resolvedItemsById.set(String(resolvedItem.id), resolvedItem);

      return resolvedItem;
    });
  }

  _resolveSameAsItemsV3(items) {
    const itemsById = new Map(items.map((item) => [String(item.id), item]));

    return items.map((item, index) => {
      if (item.same_as === undefined) return item;

      const base = itemsById.get(String(item.same_as));

      if (!base) {
        throw new Error(`same_as '${item.same_as}' not found for item ${index}`);
      }

      const { same_as, same_as_dxpos, same_as_dypos, ...restOfFields } = item;

      const mergedItem = Merge.mergeDeep(base, restOfFields);

      if (same_as_dxpos !== undefined) {
        if (mergedItem.xpos === undefined) {
          throw new Error(`same_as_dxpos requires xpos for item ${index}`);
        }

        mergedItem.xpos += same_as_dxpos;
      }

      if (same_as_dypos !== undefined) {
        if (mergedItem.ypos === undefined) {
          throw new Error(`same_as_dypos requires ypos for item ${index}`);
        }

        mergedItem.ypos += same_as_dypos;
      }

      return mergedItem;
    });
  }

  _resolveSameAsItemsV2(items) {
    const itemsById = new Map(items.map((item) => [String(item.id), item]));

    return items.map((item, index) => {
      if (item.same_as === undefined) return item;

      const base = itemsById.get(String(item.same_as));

      if (!base) {
        throw new Error(`same_as '${item.same_as}' not found for item ${index}`);
      }

      const { same_as, ...restOfFields } = item;

      return Merge.mergeDeep(base, restOfFields);
    });
  }

  _resolveSameAsItemsV1(items) {
    return items.map((item, index, array) => {
      if (item.same_as === undefined) return item;

      const base = array[item.same_as];

      if (!base) {
        throw new Error(`same_as '${item.same_as}' not found for item ${index}`);
      }

      const { same_as, ...restOfFields } = item;

      return Merge.mergeDeep(base, restOfFields);
    });
  }

  _resolveSectionSameAs(config) {
    const layoutSections = ['horseshoes', 'states', 'names', 'areas', 'circles', 'hlines', 'vlines', 'icons'];

    layoutSections.forEach((section) => {
      const items = config.layout?.[section];

      if (!Array.isArray(items)) return;

      config.layout[section] = this._resolveSameAsItems(items);
    });
  }

  _assignIdItems(items) {
    return items.map((item, index) => ({
      ...item,
      id: String(item.id ?? index),
    }));
  }

  _assignSectionIds(config) {
    const layoutSections = ['horseshoes', 'states', 'names', 'areas', 'circles', 'hlines', 'vlines', 'icons'];

    layoutSections.forEach((section) => {
      const items = config.layout?.[section];

      if (!Array.isArray(items)) return;

      config.layout[section] = this._assignIdItems(items);
    });
  }

  _isStaticRef(value) {
    return typeof value === 'string' && value.startsWith('ref(') && value.endsWith(')');
  }

  _cloneStaticValue(value) {
    if (value && typeof value === 'object') {
      return Merge.mergeDeep(Array.isArray(value) ? [] : {}, value);
    }

    return value;
  }

  _evaluateConstants(config) {
    const constants = config.constants;

    if (!constants || typeof constants !== 'object') {
      return {};
    }

    const calcConstants = {};

    Object.entries(constants).forEach(([key, value]) => {
      constants[key] = this._evaluateStaticConfig(value, calcConstants);

      if (this._isStaticNumber(constants[key])) {
        calcConstants[key] = constants[key];
      }
    });

    return calcConstants;
  }

  _resolveStaticRef(value, constants) {
    if (!this._isStaticRef(value)) return value;

    const refName = value.slice(4, -1).trim();

    if (!(refName in constants)) {
      throw new Error(`Static ref '${refName}' not found`);
    }

    return this._cloneStaticValue(constants[refName]);
  }

  _resolveStaticRefs(value, constants = {}) {
    if (this._isStaticRef(value)) {
      return this._resolveStaticRef(value, constants);
    }

    if (Array.isArray(value)) {
      return value.map((item) => this._resolveStaticRefs(item, constants));
    }

    if (value && typeof value === 'object') {
      Object.entries(value).forEach(([key, itemValue]) => {
        value[key] = this._resolveStaticRefs(itemValue, constants);
      });

      return value;
    }

    return value;
  }

  _evaluateStaticConfig(value, constants = {}) {
    if (this._isStaticCalc(value)) {
      return this._evaluateStaticCalc(value, constants);
    }

    if (Array.isArray(value)) {
      return value.map((item) => this._evaluateStaticConfig(item, constants));
    }

    if (value && typeof value === 'object') {
      Object.entries(value).forEach(([key, itemValue]) => {
        value[key] = this._evaluateStaticConfig(itemValue, constants);
      });

      return value;
    }

    return value;
  }

  setConfig(config) {
    try {
      config = JSON.parse(JSON.stringify(config));
      this.dev = { ...config.dev };

      if (!config.entities) {
        throw Error('No entities defined');
      }

      if (!config.layout) {
        throw Error('No layout defined');
      }
      if (config?.palettes) {
        Palette.loadAll(config?.palettes).then((palettes) => {
          this.palettes = palettes;
          const mode = this.hass?.themes?.darkMode ? 'dark' : 'light';
          Colors.setElement(this);
          Palette.applyAll(this, palettes, mode);
          if (!this.palettesLoaded) {
            Colors.colorCache = {};
            Object.keys(Colors.colorCache)
              .filter((key) => key.startsWith('var('))
              .forEach((key) => delete Colors.colorCache[key]);
            this.palettesLoaded = true;
            this.setHass(this._hass, true);
          }
          this.requestUpdate();
        });
      }

      this._assignSectionIds(config);

      const calcConstants = this._evaluateConstants(config);

      this._resolveStaticRefs(config, config.constants);
      this._evaluateStaticConfig(config, calcConstants);

      this._resolveSectionSameAs(config);

      // this._assignSectionIds(config);
      // this._evaulateConstants(config);
      // this._resolveStaticRefs(config);
      // this._evaluateStaticConfig(config);
      // this._resolveSectionSameAs(config);

      Templates.setContext({
        hass: this._hass,
        config,
        entities: this.entities,
        horseshoes: this.horseshoes,
      });

      const resolvedEntitiesConfig = this._resolveEntityConfigs(config);

      if (resolvedEntitiesConfig) {
        const newdomain = computeDomain(resolvedEntitiesConfig[0].entity);

        if (newdomain !== 'sensor') {
          if (resolvedEntitiesConfig[0].attribute && !isNaN(resolvedEntitiesConfig[0].attribute)) {
            throw Error('First entity or attribute must be a numbered sensorvalue, but is NOT');
          }
        }
      }

      resolvedEntitiesConfig.forEach((entityValue) => {
        if (!entityValue.tap_action) {
          entityValue.tap_action = { ...DEFAULT_TAP_ACTION };
        }
      });

      const newConfig = {
        texts: [],
        card_filter: 'card--filter-none',
        bar_mode: config.bar_mode || 'normal',
        ...config,
        show: {
          ...DEFAULT_SHOW,
          ...config.show,
        },
        // horseshoe_position: {
        //   ...DEFAULT_HORSESHOE_POSITION,
        //   ...config?.horseshoe_position,
        // },
        // horseshoe_scale: {
        //   ...DEFAULT_HORSESHOE_SCALE,
        //   ...config.horseshoe_scale,
        // },
        // horseshoe_state: {
        //   ...DEFAULT_HORSESHOE_STATE,
        //   ...config.horseshoe_state,
        // },
      };

      this.horseshoes = HorseshoesLayout.setConfig(config, Templates);
      this.horseshoeGauges = HorseshoeGauge.setConfig(config, Templates, this.cardId, this);
      const defaultHorseshoe = this.horseshoes?.[0];

      if (defaultHorseshoe) {
        this.colorStops = defaultHorseshoe.colorStops;
        this.colorStopsMinMax = defaultHorseshoe.colorStopsMinMax;
        this.color0 = defaultHorseshoe.color0;
        this.color1 = defaultHorseshoe.color1;
        this.angleCoords = defaultHorseshoe.angleCoords;
        this.color1_offset = defaultHorseshoe.color1_offset;
      }

      this._prepareItemColorStops(newConfig);

      this.config = newConfig;
      this.bar_mode = newConfig.bar_mode || 'normal';

      if (this.config.layout?.icons) {
        this.config.layout.icons.forEach((iconConfig, index) => {
          this.iconsId[index] = Math.random().toString(36).substr(2, 9);
        });
      }

      // Get aspectratio. This can be defined at card level or layout level
      this.aspectratio = (this.config.layout.aspectratio || this.config.aspectratio || '1/1').trim();

      const ar = this.aspectratio.split('/');
      if (!this.viewBox) this.viewBox = {};
      this.viewBox.width = ar[0] * SVG_DEFAULT_DIMENSIONS;
      this.viewBox.height = ar[1] * SVG_DEFAULT_DIMENSIONS;

      this._computeGroupDimensions(this.config);
      this._computeSvgDimensions(this.config);

      Templates.setContext({
        hass: this._hass,
        config: this.config,
        entities: this.entities,
        horseshoes: this.horseshoes,
      });
    } catch (error) {
      console.error('[FHC setConfig] CONFIG ERROR', {
        error,
        message: error?.message,
        stack: error?.stack,
        rawConfig: config,
        horseshoes: this.horseshoes,
      });

      throw error;
    }
  }

  _getItemStateValue(item = {}) {
    const entityIndex = item.entity_index ?? 0;
    const entity = this.entities?.[entityIndex];
    const entityConfig = this.config?.entities?.[entityIndex];

    if (!entity) return undefined;

    const attribute = entityConfig?.attribute;

    if (attribute && entity.attributes && entity.attributes[attribute] !== undefined) {
      return entity.attributes[attribute];
    }

    return entity.state;
  }

  _getItemColorFromStops(item = {}) {
    if (!item._colorStops) return undefined;

    const rawState = this._getItemStateValue(item);
    const stateNumber = Number(rawState);

    if (!Number.isFinite(stateNumber)) {
      return undefined;
    }

    return Colors.calculateStrokeColor(stateNumber, item._colorStops, item.colorstop_gradient === true);
  }

  /** *****************************************************************************
   * connectedCallback()
   *
   * Summary.
   *
   */
  connectedCallback() {
    super.connectedCallback();
  }

  /** *****************************************************************************
   * disconnectedCallback()
   *
   * Summary.
   *
   */
  disconnectedCallback() {
    super.disconnectedCallback();
  }

  /** *****************************************************************************
   * render()
   *
   * Summary.
   * Renders the complete SVG based card according to the specified layout in which
   * the user can specify name, area, entities, lines and dots.
   * The horseshoe is rendered on the full card. This one can be moved a bit via CSS.
   *
   */

  render({ config } = this) {
    // console.log('render', this.cardId);

    const item = {
      entity_index: 0,
    };

    const resolvedStyles = Templates.getJsTemplateOrValue(item, config?.styles);
    const cardStyle = ConfigHelper.toStyleDict(resolvedStyles);

    return html`
      <ha-card @click=${(e) => this.handlePopup(e, this.entities[0])} style=${styleMap(cardStyle)}>
        <div class="container" id="container">${this._renderSvg()}</div>

        <svg style="width:0;height:0;position:absolute;" aria-hidden="true" focusable="false">
          ${this.horseshoes?.map(
            (horseshoe, index) => svg`
              <linearGradient
                gradientTransform="rotate(0)"
                id="horseshoe__gradient-${this.cardId}-${index}"
                x1="${horseshoe.angleCoords.x1}"
                y1="${horseshoe.angleCoords.y1}"
                x2="${horseshoe.angleCoords.x2}"
                y2="${horseshoe.angleCoords.y2}"
              >
                <stop offset="${horseshoe.color1_offset}" stop-color="${horseshoe.color1}" style="transition: stop-color 1s ease;"></stop>
                <stop offset="100%" stop-color="${horseshoe.color0}" style="transition: stop-color 1s ease;"></stop>
              </linearGradient>
            `,
          ) ?? ''}
        </svg>
      </ha-card>
    `;
  }

  /** *****************************************************************************
   * renderTickMarks()
   *
   * Summary.
   * Renders the tick marks on the scale.
   *
   */

  _renderOriginalTickMarks(horseshoe, horseshoeIndex) {
    if (horseshoe.show?.scale_tickmarks === false) {
      return svg``;
    }

    const scale = horseshoe.horseshoe_scale;

    const min = Number(scale.min);
    const max = Number(scale.max);
    const range = max - min;

    if (!range) {
      return svg``;
    }
    const item = {
      entity_index: horseshoe.entity_index,
    };
    const DEFAULT_HORSESHOE_TICKMARKS_STYLE = {};
    const resolvedTickmarksStyles = Templates.getJsTemplateOrValue(item, horseshoe?.horseshoe_tickmarks?.styles);
    const tickmarksUserStyle = ConfigHelper.toStyleDict(resolvedTickmarksStyles);
    // const centerX = (horseshoe.xpos ?? 50) * 2;
    // const centerY = (horseshoe.ypos ?? 50) * 2;
    const centerX = horseshoe.svg.xpos;
    const centerY = horseshoe.svg.ypos;

    const protectedTickmarksStyle = {
      // We protect these styles as they are needed to properly display the tickmarks, and avoid user errors breaking the card.
      transformOrigin: `${centerX}px ${centerY}px`,
    };
    if (horseshoe?.horseshoe_tickmarks?.fill !== undefined) {
      protectedTickmarksStyle.fill = horseshoe.horseshoe_tickmarks.fill;
    }
    const stroke = scale.color || 'var(--primary-background-color)';
    protectedTickmarksStyle.fill = stroke;
    const tickmarksStyle = {
      ...DEFAULT_HORSESHOE_TICKMARKS_STYLE,
      ...tickmarksUserStyle,
      ...protectedTickmarksStyle,
    };
    const tickSize = scale.ticksize || range / 10;
    const fullScale = horseshoe.arc_degrees || 260;

    const tickRadius = scale.width ? scale.width / 2 : 6 / 2;

    const remainder = min % tickSize;
    const startTickValue = min + (remainder === 0 ? 0 : tickSize - remainder);

    if (startTickValue > max) {
      return svg``;
    }

    const tickCount = Math.floor((max - startTickValue) / tickSize) + 1;

    const scaleItems = Array.from({ length: tickCount }, (_, index) => {
      const tickValue = startTickValue + index * tickSize;
      const valuePosition = (tickValue - min) / range;

      /*
       * Angle convention:
       * fullScale 260 => from +130deg to -130deg.
       * This matches the horseshoe arc without hardcoded -230 magic.
       */
      const angleDegrees = fullScale / 2 - valuePosition * fullScale;
      const angle = (angleDegrees * Math.PI) / 180;

      return svg`
      <circle
        cx="${centerX - Math.sin(angle) * horseshoe.tickmarksRadiusSize}"
        cy="${centerY - Math.cos(angle) * horseshoe.tickmarksRadiusSize}"
        r="${tickRadius}"
        style=${styleMap(tickmarksStyle)}>
      </circle>
    `;
    });

    return svg`${scaleItems}`;
  }

  /** *****************************************************************************
   * _renderSvg()
   *
   * Summary.
   * Renders the SVG
   *
   * NTS:
   * If height and width given for svg it equals the viewbox. The card is not scaled
   * anymore to the full dimensions of the card given by hass/lovelace.
   * Card or svg is also placed default at start of viewport (not box), and can be
   * placed at start, center or end of viewport (Use align-self to center it).
   *
   * 1.  If height and width are ommitted, the ha-card/viewport is forced to the x/y
   *     aspect ratio of the viewbox, ie 1:1. EXACTLY WHAT WE WANT!
   * 2.  If height and width are set to 100%, the viewport (or ha-card) forces the
   *     aspect-ratio on the svg. Although GetCardSize is set to 4, it seems the
   *     height is forced to 150px, so part of the viewbox/svg is not shown or
   *     out of proportion!
   * 3.  Setting the height/width also to 200/200 (same as viewbox), the horseshoe is
   *     displayed correctly, but doesn't scale to the max space of the ha-card/viewport.
   *     It also is displayed at the start of the viewport. For a large horizontal
   *     card this is ok, but in other cases, the center position would be better...
   *      - use align-self: center on the svg ...or...
   *      - use align-items: center on the parent container of the svg.
   *
   */
  _renderSvg() {
    // For some reason, using a var/const for the viewboxsize doesn't work.
    // Even if the Chrome inspector shows 200 200. So hardcode for now!
    // const { viewBoxSize, } = this;
    //    console.log('Rendering SVG!!!!!!!!!!');
    const cardFilter = this.config.card_filter ? this.config.card_filter : 'card--filter-none';

    return svg`
        <svg xmlns="http://www/w3.org/2000/svg" xmlns:xlink="http://www/w3.org/1999/xlink"
            class="${cardFilter}"
          viewBox='0 0 ${this.viewBox.width} ${this.viewBox.height}'>
            <g id="circles" class="circles">
              ${this._renderCircles()}
            </g>
          ${this._renderHorseShoes()}
${this._renderHorseshoeGauges()}          
            <g id="datagroup" class="datagroup">
              ${this._renderHorizontalLines()}
              ${this._renderVerticalLines()}
              ${this._renderIcons()}
              ${this._renderEntityAreas()}
              ${this._renderEntityNames()}
              ${this._renderEntityStates()}
            </g>
        </svg>
      `;
  }

  /** *****************************************************************************
   * _renderHorseShoe()
   *
   * Summary.
   * Renders the horseshoe group.
   *
   * Description.
   * The horseshoes are rendered in a viewbox of 200x200 (SVG_VIEW_BOX).
   * Both are centered with a radius of 45%, ie 200*0.45 = 90.
   *
   * The foreground horseshoe is always rendered as a gradient with two colors.
   *
   * The horseshoes are rotated 220 degrees and are 2 * 26/36 * Math.PI * r in size
   * There you get your value of 408.4070449 ;-)
   */

  _renderHorseshoeGauges() {
    return svg`
    ${this.horseshoeGauges?.map((horseshoe) => horseshoe.render()) ?? svg``}
  `;
  }

  _renderHorseShoes() {
    return svg`
    ${this.horseshoes?.map((horseshoe, index) => this._renderHorseShoe(horseshoe, index)) ?? svg``}
  `;
  }

  _renderHorseShoe(horseshoe, index) {
    if (horseshoe.show?.horseshoe === false) {
      return svg``;
    }

    const cx = horseshoe.svg.xpos;
    const cy = horseshoe.svg.ypos;

    const rotateX = horseshoe.svg.rotateX;
    const rotateY = horseshoe.svg.rotateY;

    const barMode = horseshoe.bar_mode || 'normal';
    // const radius = `${horseshoe.radius}%`;
    const radius = `${horseshoe.svg.radius}px`;

    const scaleStroke = horseshoe.horseshoe_scale.color || '#000000';
    const scaleStrokeWidth = horseshoe.horseshoe_scale.width || 6;
    const stateStrokeWidth = horseshoe.horseshoe_state.width || 12;

    const arcDegrees = horseshoe.arc_degrees ?? 260;
    const startRotation = -90 - arcDegrees / 2;
    const scaleDashArray = `${horseshoe.horseshoePathLength},${horseshoe.circlePathLength}`;
    // const scaleDashArray = `${horseshoe.horseshoePathLength},180`;
    const gradientId = `horseshoe__gradient-${this.cardId}-${index}`;

    // Get stale styles
    const item = {
      entity_index: horseshoe.entity_index,
    };
    const resolvedScaleStyles = Templates.getJsTemplateOrValue(item, horseshoe.horseshoe_scale?.styles);
    const scaleUserStyle = ConfigHelper.toStyleDict(resolvedScaleStyles);
    const protectedScaleStyle = {
      stroke: scaleStroke,
      strokeWidth: scaleStrokeWidth,
      strokeDasharray: scaleDashArray,
      strokeLinecap: 'round',
    };
    const DEFAULT_HORSESHOE_SCALE_STYLE = {
      fill: 'none',
      'stroke-linecap': 'round',
    };
    if (horseshoe.horseshoe_scale?.fill !== undefined) {
      protectedScaleStyle.fill = horseshoe.horseshoe_scale.fill;
    }
    const scaleStyle = {
      ...DEFAULT_HORSESHOE_SCALE_STYLE,
      ...scaleUserStyle,
      ...protectedScaleStyle,
    };

    // Get state styles
    const DEFAULT_HORSESHOE_STATE_STYLE = {
      fill: 'none',
      transition: 'all 2.5s ease-out',
      strokeLinecap: 'round',
    };
    const resolvedStateStyles = Templates.getJsTemplateOrValue(item, horseshoe.horseshoe_state?.styles);
    const stateUserStyle = ConfigHelper.toStyleDict(resolvedStateStyles);
    const protectedStateStyle = {
      stroke: `url('#${gradientId}')`,
      strokeDasharray: horseshoe.dashArray,
      strokeDashoffset: horseshoe.dashOffset,
      strokeWidth: stateStrokeWidth,
    };
    if (horseshoe.horseshoe_state?.fill !== undefined) {
      protectedStateStyle.fill = horseshoe.horseshoe_state.fill;
    }
    const stateStyle = {
      ...DEFAULT_HORSESHOE_STATE_STYLE,
      ...stateUserStyle,
      ...protectedStateStyle,
    };

    // const objectRotate = horseshoe.rotate ? `rotate(${horseshoe.rotate} ${rotateX} ${rotateY})` : '';
    const objectRotate = horseshoe.rotate ? `rotate(${horseshoe.rotate})` : '';

    const stopStyle = {};

    if (scaleStyle.opacity !== undefined) {
      stopStyle.opacity = scaleStyle.opacity;
    }

    if (scaleStyle.animation !== undefined) {
      stopStyle.animation = scaleStyle.animation;
    }

    const resolvedLabelBackgroundStyles = Templates.getJsTemplateOrValue(item, horseshoe.horseshoe_labels?.background?.styles);
    const backgroundLabelUserStyle = ConfigHelper.toStyleDict(resolvedLabelBackgroundStyles);
    const backgroundLabelProtectedStyle = {
      // fill: horseshoe.horseshoe_labels?.background?.color || 'var(--primary-background-color)',
    };
    const labelBackgroundStyle = {
      ...backgroundLabelProtectedStyle,
      ...backgroundLabelUserStyle,
    };
    const resolvedLabelBadgeStyles = Templates.getJsTemplateOrValue(item, horseshoe.horseshoe_labels?.badges?.styles);
    const badgeLabelUserStyle = ConfigHelper.toStyleDict(resolvedLabelBadgeStyles);
    const badgeLabelProtectedStyle = {
      // fill: horseshoe.horseshoe_labels?.badges?.color || 'var(--primary-background-color)',
    };
    const labelBadgeStyle = {
      ...badgeLabelProtectedStyle,
      ...badgeLabelUserStyle,
    };

    const resolvedLabelStyles = Templates.getJsTemplateOrValue(item, horseshoe.horseshoe_labels?.styles);
    const labelUserStyle = ConfigHelper.toStyleDict(resolvedLabelStyles);
    const labelProtectedStyle = {
      // fill: horseshoe.horseshoe_labels?.color || 'var(--primary-background-color)',
    };
    const labelStyle = {
      ...labelProtectedStyle,
      ...labelUserStyle,
    };

    const resolvedTickmarksMajorStyles = Templates.getJsTemplateOrValue(item, horseshoe.horseshoe_tickmarks?.ticks_major?.styles);
    const tickmarksMajorUserStyle = ConfigHelper.toStyleDict(resolvedTickmarksMajorStyles);
    const protectedTickmarksMajorStyle = {
      // fill: horseshoe.horseshoe_tickmarks?.ticks_major?.color || 'var(--primary-background-color)',
    };
    const tickmarksMajorStyle = {
      ...protectedTickmarksMajorStyle,
      ...tickmarksMajorUserStyle,
    };
    const resolvedTickmarksMinorStyles = Templates.getJsTemplateOrValue(item, horseshoe.horseshoe_tickmarks?.ticks_minor?.styles);
    const tickmarksMinorUserStyle = ConfigHelper.toStyleDict(resolvedTickmarksMinorStyles);
    const protectedTickmarksMinorStyle = {
      // fill: horseshoe.horseshoe_tickmarks?.ticks_minor?.color || 'var(--primary-background-color)',
    };
    const tickmarksMinorStyle = {
      ...protectedTickmarksMinorStyle,
      ...tickmarksMinorUserStyle,
    };

    const isBidirectional = barMode === 'bidirectional';
    const stateRotation = isBidirectional ? -90 : startRotation;
    if (this?.dev?.debug_bidirectional) {
      console.log('<debug_bidirectional> Render Horseshoe: Card ', this.cardId, 'barMode: ', barMode);
    }
    return svg`
      <g id="horseshoe__svg__group-${index}" class="horseshoe__svg__group"
        transform="${objectRotate} ${this._getGroupScaleTransform(horseshoe)}"
        style="${this._getGroupScaleStyle(horseshoe)}"
      >
        <g style=${styleMap(stopStyle)}>
          ${this._renderHorseshoeScale(horseshoe, index)}
        </g>

        <g style=${styleMap(labelBackgroundStyle)}>
          ${this._renderHorseshoeLabelBackground(horseshoe, index)}
        </g>

        <g>
          <circle id="horseshoe__state__value-${index}" class="horseshoe__state__value"
            cx="${cx}px" cy="${cy}px" r="${radius}"
            transform="rotate(${stateRotation} ${rotateX} ${rotateY})"
            style=${styleMap(stateStyle)} />
          ${this._renderOriginalTickMarks(horseshoe, index)}
        </g>

        <g style=${styleMap(tickmarksMinorStyle)}>
          ${this._renderHorseshoeTicks(horseshoe, index, 'ticks_minor')}
        </g>

        <g style=${styleMap(tickmarksMajorStyle)}>
          ${this._renderHorseshoeTicks(horseshoe, index, 'ticks_major')}
        </g>

        <g style=${styleMap(labelBadgeStyle)}>
          ${this._renderHorseshoeLabelBadges(horseshoe, index)}
        </g>

        <g style=${styleMap(labelStyle)}>
          ${this._renderHorseshoeLabels(horseshoe, index, objectRotate)}
        </g>
      </g>
    `;
  }

  /** *****************************************************************************
   * _renderEntityNames()
   *
   * Summary.
   * Renders the given name to the card. If name not given a space is rendered.
   * The location of the name is specified in the layout.
   *
   */

  _renderEntityName(item) {
    const ENTITY_NAME_STYLES = {
      'font-size': '1.5em',
      color: 'var(--primary-text-color)',
      opacity: '1.0',
      'text-anchor': 'middle',
    };

    const entityIndex = item.entity_index ?? 0;

    const resolvedStyles = Templates.getJsTemplateOrValue(item, item.styles);
    const itemStyleDict = ConfigHelper.toStyleDict(resolvedStyles);

    const configStyle = {
      ...ENTITY_NAME_STYLES,
      ...itemStyleDict,
    };

    const animationStyle = this.animations?.names?.[item.animation_id] ?? {};

    const stateStyle = {
      ...animationStyle,
    };

    const stopColor = this._getItemColorFromStops(item);
    if (stopColor) {
      stateStyle.stroke = stopColor;
    }

    const styles = {
      ...configStyle,
      ...stateStyle,
    };

    // const name = this._buildName(this.entities[item.entity_index], this.resolvedEntityConfigs[item.entity_index]);
    const name = this.textEllipsis(this._buildName(this.entities[item.entity_index], this.resolvedEntityConfigs[item.entity_index]), item?.max_characters ?? item?.ellipsis);

    return svg`
      <g
          transform="${this._getGroupScaleTransform(item)}"
          style="${this._getGroupScaleStyle(item)}"
          >
          <text
            @click=${(e) => this.handlePopup(e, this.entities[entityIndex])}
            >
              <tspan
                class="entity__name"
                x="${item.svg.xpos}"
                y="${item.svg.ypos}"
                style=${styleMap(styles)}>
                ${name}</tspan>
          </text>
          </g>
        `;
  }

  _renderEntityNames() {
    const { layout } = this.config;

    if (!layout?.names) return svg``;

    const svgItems = layout.names.map((item) => this._renderEntityName(item));

    return svg`${svgItems}`;
  }

  /** *****************************************************************************
   * _renderEntityAreas()
   *
   * Summary.
   * Renders the given area to the card. If area not given a space is rendered.
   * The location of the area is specified in the layout.
   *
   */

  _renderEntityArea(item) {
    const AREA_STYLES = {
      'font-size': '1em',
      color: 'var(--primary-text-color)',
      opacity: '1.0',
      'text-anchor': 'middle',
    };

    const entityIndex = item.entity_index ?? 0;

    const resolvedStyles = Templates.getJsTemplateOrValue(item, item.styles);
    const itemStyleDict = ConfigHelper.toStyleDict(resolvedStyles);

    const configStyle = {
      ...AREA_STYLES,
      ...itemStyleDict,
    };

    const animationStyle = ConfigHelper.toStyleDict(this.animations?.areas?.[item.animation_id] ?? {});

    const stateStyle = {
      ...animationStyle,
    };

    const stopColor = this._getItemColorFromStops(item);
    if (stopColor) {
      stateStyle.stroke = stopColor;
    }

    const styles = {
      ...configStyle,
      ...stateStyle,
    };

    const area = this.textEllipsis(this._buildArea(this.entities[item.entity_index], this.resolvedEntityConfigs[item.entity_index]), item?.max_characters ?? item?.ellipsis);

    return svg`
      <g
        transform="${this._getGroupScaleTransform(item)}"
        style="${this._getGroupScaleStyle(item)}"
        >
        <text
          @click=${(e) => this.handlePopup(e, this.entities[entityIndex])}
          >
            <tspan
              class="entity__area"
              x="${item.svg.xpos}"
              y="${item.svg.ypos}"
              style=${styleMap(styles)}>
              ${area}</tspan>
        </text>
      </g>
      `;
  }

  _renderEntityAreas() {
    const { layout } = this.config;

    if (!layout?.areas) return svg``;

    const svgItems = layout.areas.map((item) => this._renderEntityArea(item));

    return svg`${svgItems}`;
  }

  /** *****************************************************************************
   * _renderEntityState()
   *
   * Summary.
   * Renders the entity or attribute state of a single item.
   *
   */
  _getGroupScaleTransform(item) {
    const group = item?.group ? this.config?.layout?.groups?.[item.group] : undefined;

    if (!group?.scale && !item?.flip) return '';

    const scaleX = group?.scale?.x ?? group?.scale ?? 1;
    const scaleY = group?.scale?.y ?? group?.scale ?? 1;

    const flipX = item?.flip === 'x' || item?.flip === 'both' ? -1 : 1;
    const flipY = item?.flip === 'y' || item?.flip === 'both' ? -1 : 1;

    return `scale(${scaleX * flipX}, ${scaleY * flipY})`;
  }

  _getGroupScaleStyle(item) {
    const group = item?.group ? this.config?.layout?.groups?.[item.group] : undefined;

    if (!group?.scale || !group.svg) return `transform-origin:${item.svg.xpos}px ${item.svg.ypos}px; transform-box:view-box;`;

    return `transform-origin:${group.svg.xpos}px ${group.svg.ypos}px; transform-box:view-box;`;
  }

  _renderEntityState(item) {
    if (!item) return svg``;

    const entityIndex = item.entity_index ?? 0;

    // compute x,y or dx,dy positions. Spec center if not specified.
    const x = item.svg.xpos ?? SVG_DEFAULT_DIMENSIONS_HALF;
    const y = item.svg.ypos ?? SVG_DEFAULT_DIMENSIONS_HALF;

    const dx = item.dx ? item.dx : '0';
    const dy = item.dy ? item.dy : '0';

    const STATE_STYLES = {
      'font-size': '1em',
      color: 'var(--primary-text-color)',
      opacity: '1.0',
      'text-anchor': 'middle',
    };

    const UOM_STYLES = {
      opacity: '0.7',
    };

    // Config styles for the main state value.
    const resolvedStyles = Templates.getJsTemplateOrValue(item, item.styles);
    const itemStyleDict = ConfigHelper.toStyleDict(resolvedStyles);

    // Config styles for the UOM. These are optional and override the implicit UOM styles.
    const uomConfig = item.uom ?? {};

    const resolvedUomStyles = Templates.getJsTemplateOrValue(item, uomConfig.styles);
    const itemUomStyleDict = ConfigHelper.toStyleDict(resolvedUomStyles);

    const uomDx = uomConfig.dx ?? '0.1';
    const uomDy = uomConfig.dy ?? '-0.45';

    // Runtime animation styles. Animation styles win over normal state styles.
    let stateStyle = {};
    if (this.animations?.states?.[item.animation_id]) {
      stateStyle = {
        ...this.animations.states[item.animation_id],
      };
    }

    const stopColor = this._getItemColorFromStops(item);
    if (stopColor) {
      stateStyle.fill = stopColor;
    }

    // Runtime styles overwrite statically configured styles.
    const configStyle = {
      ...STATE_STYLES,
      ...itemStyleDict,
      ...stateStyle,
    };

    // Keep old implicit UOM behavior:
    // UOM font-size is derived from the final state font-size.
    const fsuomStr = configStyle['font-size'];
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

    const fsuomStyle = {
      'font-size': `${fsuomValue}${fsuomType}`,
    };

    // Order matters:
    // 1. Start from state style.
    // 2. Apply old default UOM overrides.
    // 3. Apply old implicit computed UOM font-size.
    // 4. Let explicit styles_uom override all of that.
    const uomStyle = {
      ...configStyle,
      ...UOM_STYLES,
      ...fsuomStyle,
      ...itemUomStyleDict,
    };

    const entity = this.entities[entityIndex];
    const entityConfig = this.resolvedEntityConfigs[entityIndex] ?? {};

    const parts = this._formatEntityStateParts(entity, entityConfig);
    let state = '';
    let unit = '';

    parts.forEach((part) => {
      if (part.type === 'unit') {
        unit += part.value;
      } else {
        if (part.type === 'value') {
          state += part.value;
        }
      }
    });

    state = state.trim();
    unit = unit.trim();
    const uom = this._buildUom(entity, entityConfig, unit);

    return svg`
      <g
        transform="${this._getGroupScaleTransform(item)}"
        style="${this._getGroupScaleStyle(item)}"
        >
        <text @click=${(e) => this.handlePopup(e, this.entities[entityIndex])}>
          <tspan
            class="state__value"
            x="${x}"
            y="${y}"
            dx="${dx}em"
            dy="${dy}em"
            style=${styleMap(configStyle)}
          >${state}</tspan><tspan
            class="state__uom"
            dx="${uomDx}em"
            dy="${uomDy}em"
            style=${styleMap(uomStyle)}
          >${uom}</tspan>
        </text>
      </g>
    `;
  }

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

  /** *****************************************************************************
   * _renderStates()
   *
   * Summary.
   * Renders the states.
   *
   */

  _renderEntityStates() {
    const { layout } = this.config;

    if (!layout) return;
    if (!layout.states) return;

    const svgItems = layout.states.map(
      (item) => svg`
            ${this._renderEntityState(item)}
          `,
    );

    return svg`${svgItems}`;
  }

  /** *****************************************************************************
   * _renderIcon()
   *
   * Summary.
   * Renders a single icon.
   *
   */
  // ROMMEL VAN

  updated(changedProperties) {
    super.updated?.(changedProperties);

    this._injectSvgUrlIcons();
  }

  _isSvgUrl(url) {
    return url.endsWith('.svg');
  }

  _isSvgUrlV1(url) {
    return /\.svg(?:[?#].*)?$/i.test(url);
  }

  _isUrlIcon(icon) {
    return typeof icon === 'string' && /^url\(['"]?.+['"]?\)$/i.test(icon.trim());
  }

  _renderCachedSvgUrlIcon(item, entityIndex, url, configStyle, iconPixels, cx, cy, adjust) {
    const svgNode = this.svgUrlCache[url].cloneNode(true);

    const rotate = item.rotate ?? 0;

    const x1 = cx - iconPixels * adjust;
    // const y1 = cy - iconPixels * 0.5 - iconPixels * 0.25;
    const y1 = cy - iconPixels * 0.5 - (item.yposc ? 0 : iconPixels * 0.25);

    const scale = iconPixels / 24;

    const iconCx = x1 + 12 * scale;
    const iconCy = y1 + 12 * scale;

    svgNode.classList.remove('hidden');

    return svg`
    <g
      transform="${this._getGroupScaleTransform(item)}"
      style="${this._getGroupScaleStyle(item)}"
    >
      <g
        class="icon-position"
        transform="translate(${iconCx} ${iconCy})"
        @click=${(e) => this.handlePopup(e, this.entities[item.entity_index])}
      >
        <rect
          x="${-iconPixels / 2}"
          y="${-iconPixels / 2}"
          height="${iconPixels}px"
          width="${iconPixels}px"
          stroke-width="0px"
          fill="rgba(0,0,0,0)"
        ></rect>

        <g class="icon-style-animation" style="${styleMap(configStyle)}">
          <g class="icon-rotate" transform="rotate(${rotate})">
            <svg
              x="${-iconPixels / 2}"
              y="${-iconPixels / 2}"
              width="${iconPixels}"
              height="${iconPixels}"
              viewBox="0 0 24 24"
              overflow="visible"
            >
              ${svgNode}
            </svg>
          </g>
        </g>
      </g>
    </g>
  `;
  }

  _renderCachedSvgUrlIconV1(item, entityIndex, url, configStyle, iconPixels, cx, cy, adjust) {
    const rotate = item.rotate ?? 0;

    const x1 = cx - iconPixels * adjust;
    // const y1 = cy - iconPixels * 0.5 - iconPixels * 0.25;
    const y1 = cy - iconPixels * 0.5 - (item.yposc ? 0 : iconPixels * 0.25);

    const scale = iconPixels / 24;

    const iconCx = x1 + 12 * scale;
    const iconCy = y1 + 12 * scale;

    const svgNode = this.svgUrlCache[url].cloneNode(true);
    svgNode.classList.remove('hidden');

    return svg`
    <g
      transform="${this._getGroupScaleTransform(item)}"
      style="${this._getGroupScaleStyle(item)}"
    >
      <g class="icon-position" transform="translate(${iconCx} ${iconCy})">
        <g class="icon-style-animation" style="${styleMap(configStyle)}">
          <g class="icon-rotate" transform="rotate(${rotate})">
            <g class="icon-scale" transform="scale(${scale})">
              <g class="icon-center" transform="translate(-12 -12)">
                ${svgNode}
              </g>
            </g>
          </g>
        </g>
      </g>
    </g>
  `;
  }

  _getUrlFromCssUrl(value) {
    return value
      .trim()
      .replace(/^url\(['"]?/i, '')
      .replace(/['"]?\)$/, '');
  }

  _renderSvgUrlPlaceholder(item, url, iconPixels, cx, cy, adjust) {
    const rotate = item.rotate ?? 0;

    const x1 = cx - iconPixels * adjust;
    // const y1 = cy - iconPixels * 0.5 - iconPixels * 0.25;
    const y1 = cy - iconPixels * 0.5 - (item.yposc ? 0 : iconPixels * 0.25);

    const scale = iconPixels / 24;

    const iconCx = x1 + 12 * scale;
    const iconCy = y1 + 12 * scale;

    return svg`
    <g
      transform="${this._getGroupScaleTransform(item)}"
      style="${this._getGroupScaleStyle(item)}"
    >
      <g class="icon-position" transform="translate(${iconCx} ${iconCy})">
        <g class="icon-rotate" transform="rotate(${rotate})">
          <g class="icon-scale" transform="scale(${scale})">
            <g class="icon-center" transform="translate(-12 -12)">
              <svg
                class="icon-svg-url hidden"
                data-src="${url}"
                viewBox="0 0 24 24"
                width="24"
                height="24"
              >
                <image
                  href="${url}"
                  width="24"
                  height="24"
                />
              </svg>
            </g>
          </g>
        </g>
      </g>
    </g>
  `;
  }

  _injectSvgUrlIcons() {
    const elements = this.shadowRoot.querySelectorAll('svg.icon-svg-url[data-src]:not(.injected-svg)');

    if (!elements.length) return;

    SVGInjector(elements, {
      beforeEach(svgNode) {
        svgNode.removeAttribute('height');
        svgNode.removeAttribute('width');
      },

      afterEach: (err, injectedSvg) => {
        if (err || !injectedSvg) return;

        const url = injectedSvg.dataset.src;
        if (!url) return;

        this.svgUrlCache[url] = injectedSvg.cloneNode(true);
      },

      afterAll: () => {
        this.requestUpdate();
      },

      cacheRequests: false,
      evalScripts: 'once',
      httpRequestWithCredentials: false,
      renumerateIRIElements: false,
    });
  }

  _renderSvgUrlIcon(item, entityIndex, url, configStyle, iconPixels, cx, cy, adjust) {
    if (this.svgUrlCache[url]) {
      return this._renderCachedSvgUrlIcon(item, entityIndex, url, configStyle, iconPixels, cx, cy, adjust);
    }

    return this._renderSvgUrlPlaceholder(item, url, iconPixels, cx, cy, adjust);
  }

  _renderImageUrlIcon(item, entityIndex, url, configStyle, iconPixels, cx, cy, adjust) {
    const rotate = item.rotate ?? 0;

    const x1 = cx - iconPixels * adjust;
    // const y1 = cy - iconPixels * 0.5 - iconPixels * 0.25;
    const y1 = cy - iconPixels * 0.5 - (item.yposc ? 0 : iconPixels * 0.25);

    const scale = iconPixels / 24;

    const iconCx = x1 + 12 * scale;
    const iconCy = y1 + 12 * scale;

    return svg`
    <g
      transform="${this._getGroupScaleTransform(item)}"
      style="${this._getGroupScaleStyle(item)}"
    >
      <g
        class="icon-position"
        transform="translate(${iconCx} ${iconCy})"
        @click=${(e) => this.handlePopup(e, this.entities[item.entity_index])}
      >
        <rect
          x="${-iconPixels / 2}"
          y="${-iconPixels / 2}"
          height="${iconPixels}px"
          width="${iconPixels}px"
          stroke-width="0px"
          fill="rgba(0,0,0,0)"
        ></rect>

        <g class="icon-style-animation" style="${styleMap(configStyle)}">
          <g class="icon-rotate" transform="rotate(${rotate})">
            <g class="icon-scale" transform="scale(${scale})">
              <g class="icon-center" transform="translate(-12 -12)">
                <image
                  href="${url}"
                  width="24"
                  height="24"
                  preserveAspectRatio="xMidYMid meet"
                />
              </g>
            </g>
          </g>
        </g>
      </g>
    </g>
  `;
  }

  // -------------------------------------- ROMMEL VAN

  computeEntityColor(entityState) {
    // 1. Fallback: If no data present or is unavailable. Get neurral state icon color
    if (!entityState || entityState.state === 'off' || entityState.state === 'unavailable' || entityState.state === 'unknown') {
      return 'var(--state-icon-color)';
    }

    const state = entityState.state;

    // Might be a weird fix, but it works
    if (!isNaN(state) || state.endsWith('W') || state.endsWith('kWh') || state.endsWith('V')) {
      return 'var(--state-icon-color)';
    }

    const domain = entityState.entity_id.split('.')[0];
    const deviceClass = entityState.attributes.device_class;

    // Neutral color for sensors
    if (domain === 'sensor') {
      return 'var(--state-icon-color)';
    }

    // 3. Get colors

    // A: Color lights (RGB)
    if (domain === 'light' && entityState.attributes.rgb_color && state === 'on') {
      const [r, g, b] = entityState.attributes.rgb_color;
      return `rgb(${r}, ${g}, ${b})`;
    }

    // B: Binary sensors
    if (domain === 'binary_sensor' && deviceClass && state === 'on') {
      return `var(--state-binary_sensor-${deviceClass}-on-color, var(--state-icon-active-color))`;
    }

    // C: Climate stuff
    if (domain === 'climate') {
      return `var(--state-climate-${state}-color, var(--state-icon-active-color))`;
    }

    // D: Default on/off devices
    if (state === 'on') {
      return `var(--state-${domain}-active-color, var(--state-${domain}-color, var(--state-icon-active-color)))`;
    }

    // The rest of the stuff
    return 'var(--state-icon-color)';
  }

  _renderIcon(item, index) {
    if (!item) return;

    item.entity = item.entity ? item.entity : 0;

    this.iconCache ||= {};
    this.iconsSvg ||= [];
    this.pendingIconPath ||= [];

    // const iconSize = item.icon_size ? item.icon_size : 2;
    const iconSize = item.icon_size ? item.icon_size : item.size ? item.size : 2;
    const iconPixels = iconSize * FONT_SIZE;

    // Fix xpos/ypos = 0
    // const x = (item.xpos ?? 50) / 100;
    // const y = (item.ypos ?? 50) / 100;

    // const cx = x * SVG_VIEW_BOX;
    // const cy = y * SVG_VIEW_BOX;

    const cx = item.svg.xpos;
    const cy = item.svg.ypos;
    const align = item.align ? item.align : 'center';
    const adjust = align === 'center' ? 0.5 : align === 'start' ? -1 : 1;

    let xpx = cx - iconPixels * adjust;
    let ypx = cy - iconPixels * adjust;
    let foIconPixels = iconPixels;
    const entityIndex = item.entity_index ?? 0;

    const entityState = this.entities[entityIndex];
    // const entityColor = this.computeEntityColor(entityState);

    const smItem = this._getStateMapItem(item, entityState);

    if (smItem) {
      item = Merge.mergeDeep(item, smItem);
    }

    // new new new new
    const haStyle = Colors.getHaEntityIconStyle(entityState);
    const DEFAULT_ICON_COLOR = {};
    DEFAULT_ICON_COLOR.fill = haStyle.fill;
    DEFAULT_ICON_COLOR.color = haStyle.color;
    DEFAULT_ICON_COLOR.filter = haStyle.filter;

    // Config styles from icon itself.
    const resolvedStyles = Templates.getJsTemplateOrValue(item, item.styles);
    let configStyle = ConfigHelper.toStyleDict(resolvedStyles);

    // Runtime animation styles.
    const stateStyle = this.animations?.icons?.[item.animation_id] ?? {};

    const stopColor = this._getItemColorFromStops(item);
    if (stopColor) {
      configStyle.fill = stopColor;
      configStyle.color = stopColor;
    }

    // Runtime animation styles overwrite static/config styles.
    configStyle = {
      ...DEFAULT_ICON_COLOR,
      ...configStyle,
      ...stateStyle,
    };

    const haIcon = this._buildMyIcon(this.entities[entityIndex], this.resolvedEntityConfigs[entityIndex], smItem, this.animations?.iconsIcon?.[item.animation_id]);
    const icon = haIcon;

    // if (this._isUrlIcon(icon)) {
    //   const url = this._getUrlFromCssUrl(icon);

    //   return this._renderImageUrlIcon(item, entityIndex, url, configStyle, iconPixels, cx, cy, adjust);
    // }

    if (this._isUrlIcon(icon)) {
      const url = this._getUrlFromCssUrl(icon);

      if (this._isSvgUrl(url)) {
        return this._renderSvgUrlIcon(item, entityIndex, url, configStyle, iconPixels, cx, cy, adjust);
      }

      return this._renderImageUrlIcon(item, entityIndex, url, configStyle, iconPixels, cx, cy, adjust);
    }

    if (this.iconCache[icon]) {
      this.iconsSvg[index] = this.iconCache[icon];
    } else {
      this.iconsSvg[index] = undefined;

      if (this.pendingIconPath[index] !== icon) {
        this.pendingIconPath[index] = icon;

        let attempts = 0;
        const maxAttempts = 40;
        const delay = 50;

        const readIconPath = () => {
          if (this.pendingIconPath[index] !== icon) return;

          const iconSvg = this._getRenderedHaIconPath(index);

          if (iconSvg) {
            this.iconsSvg[index] = iconSvg;
            this.iconCache[icon] = iconSvg;
            this.pendingIconPath[index] = undefined;

            this.requestUpdate();
            return;
          }

          attempts += 1;

          if (attempts >= maxAttempts) {
            this.pendingIconPath[index] = undefined;
            return;
          }

          window.setTimeout(readIconPath, delay);
        };

        const afterRender =
          this?.updateComplete && typeof this.updateComplete.then === 'function'
            ? this.updateComplete
            : this.updateComplete && typeof this.updateComplete.then === 'function'
              ? this.updateComplete
              : // eslint-disable-next-line no-promise-executor-return
                new Promise((resolve) => window.requestAnimationFrame(resolve));

        afterRender.then(() => {
          window.setTimeout(readIconPath, 0);
        });
      }
    }

    const iconSvg = this.iconsSvg[index];

    if (iconSvg) {
      const x1 = cx - iconPixels * adjust;
      const y1 = cy - iconPixels * 0.5 - (item.yposc ? 0 : iconPixels * 0.25);

      const scale = iconPixels / 24;
      const rotate = item.rotate ?? 0;

      const iconCx = x1 + 12 * scale;
      const iconCy = y1 + 12 * scale;

      configStyle['transform-origin'] ??= '0 0';

      return svg`
      <g
        transform="${this._getGroupScaleTransform(item)}"
        style="${this._getGroupScaleStyle(item)}"
        >
        <g
          id="icon-rendered-${this.iconsId[index]}"
          class="icon-position"
          transform="translate(${iconCx} ${iconCy})"
          @click=${(e) => this.handlePopup(e, this.entities[item.entity_index])}
        >
          <rect
            x="${-iconPixels / 2}"
            y="${-iconPixels / 2}"
            height="${iconPixels}px"
            width="${iconPixels}px"
            stroke-width="0px"
            fill="rgba(0,0,0,0)"
          ></rect>

          <g class="icon-style-animation" style="${styleMap(configStyle)}">
            <g class="icon-rotate" transform="rotate(${rotate})">
              <g class="icon-scale" transform="scale(${scale})">
                <g class="icon-center" transform="translate(-12 -12)">
                  <path d="${iconSvg}"></path>
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>
      `;
    }

    return svg`
    <foreignObject
      width="0px"
      height="0px"
      x="${xpx}"
      y="${ypx}"
      overflow="hidden"
    >
      <body>
        <div
          xmlns="http://www.w3.org/1999/xhtml"
          class="div__icon hover"
          style="
            line-height: ${foIconPixels}px;
            position: relative;
            border-style: solid;
            border-width: 0px;
            border-color: rgba(0,0,0,0);
            fill: rgba(0,0,0,0);
            color: rgba(0,0,0,0);
          "
        >
          <ha-icon
            .icon=${icon}
            id="icon-${this.iconsId[index]}"
          ></ha-icon>
        </div>
      </body>
    </foreignObject>
  `;
  }

  _getRenderedHaIconPath(index) {
    const iconElement = this.shadowRoot.getElementById(`icon-${this.iconsId[index]}`);

    return iconElement?.shadowRoot?.querySelector('*')?.path;
  }

  _scheduleIconPathRead(icon, index) {
    if (!icon) return;

    if (this.iconCache[icon]) {
      this.iconsSvg[index] = this.iconCache[icon];
      return;
    }

    if (this.pendingIconPath[index] === icon) {
      return;
    }

    this.pendingIconPath[index] = icon;

    let attempts = 0;
    const maxAttempts = 40;
    const delay = 50;

    const readIconPath = () => {
      if (this.pendingIconPath[index] !== icon) {
        return;
      }

      if (this.iconCache[icon]) {
        this.iconsSvg[index] = this.iconCache[icon];
        this.pendingIconPath[index] = undefined;
        this.requestUpdate();
        return;
      }

      const iconSvg = this._getRenderedHaIconPath();

      if (iconSvg) {
        this.iconsSvg[index] = iconSvg;
        this.iconCache[icon] = iconSvg;
        this.pendingIconPath[index] = undefined;
        this.requestUpdate();
        return;
      }

      attempts += 1;

      if (attempts >= maxAttempts) {
        this.pendingIconPath[index] = undefined;
        return;
      }

      this._iconPathTimer = window.setTimeout(readIconPath, delay);
    };

    const afterRender =
      this.updateComplete && typeof this.updateComplete.then === 'function'
        ? this.updateComplete
        : new Promise((resolve) => {
            window.requestAnimationFrame(resolve);
          });

    afterRender.then(() => {
      this._iconPathTimer = window.setTimeout(readIconPath, 0);
    });
  }

  /** *****************************************************************************
   * _renderIcons()
   *
   * Summary.
   * Renders all the icons in the list.
   *
   */

  _renderIcons() {
    const { layout } = this.config;

    if (!layout) return;
    if (!layout.icons) return;

    const svgItems = layout.icons.map(
      (item, index) => svg`
            ${this._renderIcon(item, index)}
          `,
    );

    return svg`${svgItems}`;
  }

  /** *****************************************************************************
   * _renderHorizontalLines()
   *
   * Summary.
   * Renders the specified lines in the grid.
   *
   */

  _renderHorizontalLine(item) {
    const HLINES_STYLES = {
      'stroke-linecap': 'round',
      stroke: 'var(--primary-text-color)',
      opacity: '1.0',
      'stroke-width': '2',
    };

    const entityIndex = item.entity_index ?? 0;

    const resolvedStyles = Templates.getJsTemplateOrValue(item, item.styles);
    const itemStyleDict = ConfigHelper.toStyleDict(resolvedStyles);

    const configStyle = {
      ...HLINES_STYLES,
      ...itemStyleDict,
    };

    const animationStyle = ConfigHelper.toStyleDict(this.animations?.hlines?.[item.animation_id] ?? {});

    const stateStyle = {
      ...animationStyle,
    };

    const stopColor = this._getItemColorFromStops(item);
    if (stopColor) {
      stateStyle.stroke = stopColor;
    }

    const styles = {
      ...configStyle,
      ...stateStyle,
    };

    return svg`
      <g
        transform="${this._getGroupScaleTransform(item)}"
        style="${this._getGroupScaleStyle(item)}"
        >
        <line
          @click=${(e) => this.handlePopup(e, this.entities[entityIndex])}
          class="line__horizontal"
          x1="${item.svg.xpos - item.svg.length / 2}"
          y1="${item.svg.ypos}"
          x2="${item.svg.xpos + item.svg.length / 2}"
          y2="${item.svg.ypos}"
          style=${styleMap(styles)}
        ></line>
      </g>
  `;
  }

  _renderHorizontalLines() {
    const { layout } = this.config;

    if (!layout?.hlines) return svg``;

    const svgItems = layout.hlines.map((item) => this._renderHorizontalLine(item));

    return svg`${svgItems}`;
  }

  /** *****************************************************************************
   * _renderVerticalLines()
   *
   * Summary.
   * Renders the specified lines in the grid.
   *
   */

  _renderVerticalLine(item) {
    const VLINES_STYLES = {
      'stroke-linecap': 'round',
      stroke: 'var(--primary-text-color)',
      opacity: '1.0',
      'stroke-width': '2',
    };

    const entityIndex = item.entity_index ?? 0;

    const resolvedStyles = Templates.getJsTemplateOrValue(item, item.styles);
    const itemStyleDict = ConfigHelper.toStyleDict(resolvedStyles);

    const configStyle = {
      ...VLINES_STYLES,
      ...itemStyleDict,
    };

    const animationStyle = ConfigHelper.toStyleDict(this.animations?.vlines?.[item.animation_id] ?? {});

    const stateStyle = {
      ...animationStyle,
    };

    const stopColor = this._getItemColorFromStops(item);
    if (stopColor) {
      stateStyle.stroke = stopColor;
    }

    const styles = {
      ...configStyle,
      ...stateStyle,
    };

    return svg`
      <g
        transform="${this._getGroupScaleTransform(item)}"
        style="${this._getGroupScaleStyle(item)}"
        >
        <line
          @click=${(e) => this.handlePopup(e, this.entities[entityIndex])}
          class="line__vertical"
          x1="${item.svg.xpos}"
          y1="${item.svg.ypos - item.svg.length / 2}"
          x2="${item.svg.xpos}"
          y2="${item.svg.ypos + item.svg.length / 2}"
          style=${styleMap(styles)}
        ></line>
      </g>
    `;
  }

  _renderVerticalLines() {
    const { layout } = this.config;

    if (!layout?.vlines) return svg``;

    const svgItems = layout.vlines.map((item) => this._renderVerticalLine(item));

    return svg`${svgItems}`;
  }

  /** *****************************************************************************
   * _renderCircles()
   *
   * Summary.
   * Renders the specified circles in the grid.
   *
   */

  _renderCircle(item) {
    const CIRCLES_STYLES = {};

    const entityIndex = item.entity_index ?? 0;

    const resolvedStyles = Templates.getJsTemplateOrValue(item, item.styles);
    const itemStyleDict = ConfigHelper.toStyleDict(resolvedStyles);

    const configStyle = {
      ...CIRCLES_STYLES,
      ...itemStyleDict,
    };

    const animationStyle = ConfigHelper.toStyleDict(this.animations?.circles?.[item.animation_id] ?? {});

    const stateStyle = {
      ...animationStyle,
    };

    const stopColor = this._getItemColorFromStops(item);
    if (stopColor) {
      stateStyle.stroke = stopColor;
    }

    const styles = {
      ...configStyle,
      ...stateStyle,
    };

    return svg`
      <g
        transform="${this._getGroupScaleTransform(item)}"
        style="${this._getGroupScaleStyle(item)}"
        >
        <circle
          @click=${(e) => this.handlePopup(e, this.entities[entityIndex])}
          class="svg__dot"
          cx="${item.svg.xpos}"
          cy="${item.svg.ypos}"
          r="${item.svg.radius}"
          style=${styleMap(styles)}
        ></circle>
      </g>
    `;
  }

  _renderCircles() {
    const { layout } = this.config;

    if (!layout?.circles) return svg``;

    const svgItems = layout.circles.map((item) => this._renderCircle(item));

    return svg`${svgItems}`;
  }

  /** *****************************************************************************
   * _handleClick()
   *
   * Summary.
   * Processes the mouse click of the user and dispatches the event to the
   * configure handler.
   * At this moment, only 'more-info' is used!
   *
   * Credits:
   *  All credits to the mini-graph-card for this function.
   *
   */

  _handleClick(node, hass, config, actionConfig, entityId) {
    let e;
    // eslint-disable-next-line default-case
    switch (actionConfig.action) {
      case 'more-info': {
        e = new Event('hass-more-info', { composed: true });
        e.detail = { entityId };
        node.dispatchEvent(e);
        break;
      }
      case 'navigate': {
        if (!actionConfig.navigation_path) return;
        window.history.pushState(null, '', actionConfig.navigation_path);
        e = new Event('location-changed', { composed: true });
        e.detail = { replace: false };
        window.dispatchEvent(e);
        break;
      }
      case 'call-service': {
        if (!actionConfig.service) return;
        const [domain, service] = actionConfig.service.split('.', 2);
        const serviceData = { ...actionConfig.service_data };
        hass.callService(domain, service, serviceData);
        break;
      }
      // Support for browser_mod pop ups.
      case 'fire-dom-event': {
        e = new Event('ll-custom', { composed: true, bubbles: true });
        e.detail = actionConfig;
        node.dispatchEvent(e);
        break;
      }
    }
  }

  /** *****************************************************************************
   * handlePopup()
   *
   * Summary.
   * Handles the first part of mouse click processing.
   * It stops propagation to the parent and processes the event.
   *
   * The action can be configured per entity. Look-up the entity, and handle the click
   * event for further processing.
   *
   * Credits:
   *  Almost all credits to the mini-graph-card for this function.
   *
   */

  handlePopup(e, entity) {
    e.stopPropagation();

    const entityConfig = this.resolvedEntityConfigs.find((element) => element.entity === entity.entity_id);

    const actionConfig = entityConfig?.tap_action ?? this.config?.tap_action ?? { action: 'more-info' };

    this._handleClick(this, this._hass, this.config, actionConfig, entity.entity_id);
  }

  /** *****************************************************************************
   * Summary.
   * Very simple form of ellipsis, which is not supported by SVG.
   * Cutoff text at number of characters and add '...'.
   * This does NOT take into account the actual width of a character!
   *
   */
  textEllipsis(argText, argEllipsis) {
    if (argEllipsis && argEllipsis < argText.length) {
      return argText.slice(0, argEllipsis - 1).concat('...');
    } else {
      return argText;
    }
  }

  /** *****************************************************************************
   * _buildArea()
   *
   * Summary.
   * Builds the Area string.
   *
   */

  _buildArea(entityState, entityConfig) {
    if (entityConfig.area) {
      return entityConfig.area;
    }
    if (!this._hass || !this._hass.areas) return '';

    // 1. Haal de live-registratie van de entiteit op
    const entityRegistry = this._hass.entities && this._hass.entities[entityConfig.entity];
    // 2. Kijk of de entiteit DIRECT een area_id heeft gekregen
    let areaId = entityRegistry ? entityRegistry.area_id : null;

    // 3. Als de entiteit geen directe ruimte heeft, kijk dan of hij via een device gekoppeld is
    if (!areaId && entityRegistry && entityRegistry.device_id && this._hass.devices) {
      const device = this._hass.devices[entityRegistry.device_id];
      areaId = device ? device.area_id : null;
    }

    // 4. Zoek de area-naam op in het register met de gevonden areaId
    if (areaId) {
      const area = this._hass.areas[areaId];
      return area ? area.name : '';
    }
    return '?';
  }

  /** *****************************************************************************
   * _buildName()
   *
   * Summary.
   * Builds the Name string.
   *
   */

  _buildName(entityState, entityConfig) {
    return entityConfig.name ?? entityState.attributes.friendly_name ?? entityState?.entity_id ?? '?';
  }

  /** *****************************************************************************
   * _buildIcon()
   *
   * Summary.
   * Builds the Icon specification name.
   *
   */
  _buildIcon(entityState, entityConfig, entityAnimation) {
    return (
      entityAnimation || entityConfig?.icon || entityState?.attributes?.icon || stateIconName(entityState) // From modified HA files
    );
  }

  /** *****************************************************************************
   * _buildUom()
   *
   * Summary.
   * Builds the Unit of Measurement string.
   *
   */

  _buildUom(entityState, entityConfig, unit) {
    return entityConfig.unit || unit || '';
  }

  /** *****************************************************************************
   * card::_buildStateString()
   *
   * Summary.
   * Builds the State string.
   * If state is not a number, the state is returned AS IS, otherwise the state
   * is converted if specified before it is returned as a string
   *
   * IMPORTANT NOTE:
   * - do NOT replace isNaN() by Number.isNaN(). They are INCOMPATIBLE !!!!!!!!!
   */

  _buildState(inState, entityConfig) {
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
            let entity = this._hass.states[entityConfig.entity];
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
                  const hsvColor = rgb2hsv(this.stateObj.attributes.rgb_color);
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

  /** *****************************************************************************
   * _computeState()
   *
   * Summary.
   *
   */

  // _computeState(inState, dec) {
  //   if (isNaN(inState)) return inState;

  //   const state = Number(inState);

  //   if (dec === undefined || Number.isNaN(dec) || Number.isNaN(state)) return Math.round(state * 100) / 100;

  //   const x = 10 ** dec;
  //   return (Math.round(state * x) / x).toFixed(dec);
  // }

  _computeEntity(entityId) {
    return entityId.substr(entityId.indexOf('.') + 1);
  }

  _renderHorseshoeTicks(horseshoe, horseshoeIndex, tickType) {
    if (!horseshoe?.show?.ticks) {
      return svg``;
    }

    const tickmarks = horseshoe.horseshoe_tickmarks;

    if (!tickmarks?.ticks_major && !tickmarks?.ticks_minor) {
      return svg``;
    }

    const min = Number(horseshoe.horseshoe_scale.min);
    const max = Number(horseshoe.horseshoe_scale.max);

    const cx = horseshoe.svg.xpos;
    const cy = horseshoe.svg.ypos;

    const baseRadius = horseshoe.svg.radius;

    const barMode = horseshoe.bar_mode;
    const arcDegrees = horseshoe.arc_degrees;

    return Label.renderScaleTicks({
      cx,
      cy,
      radius: baseRadius,
      min,
      max,
      arcDegrees,
      barMode,
      colorStops: horseshoe.colorStops,
      ticksMajor: tickmarks.ticks_major,
      ticksMinor: tickmarks.ticks_minor,
      tickType,
    });
  }

  _renderHorseshoeScale(horseshoe, horseshoeIndex) {
    const scaleMode = horseshoe?.show?.scale_style ?? 'fixed';

    if (scaleMode === 'none') {
      return svg``;
    }

    const min = Number(horseshoe.horseshoe_scale.min);
    const max = Number(horseshoe.horseshoe_scale.max);

    const cx = horseshoe.svg.xpos;
    const cy = horseshoe.svg.ypos;
    const radius = horseshoe.svg.radius;

    const barMode = horseshoe.bar_mode;
    const arcDegrees = horseshoe.arc_degrees;

    const width = horseshoe.horseshoe_scale.width;
    const color = horseshoe.horseshoe_scale.color;

    const colorStops = horseshoe.colorStops;

    if (scaleMode === 'colorstop') {
      if (!colorStops?.colors?.length) {
        return svg``;
      }

      return Label.renderColorStopScaleSegments({
        cx,
        cy,
        radius,
        startAngle: -arcDegrees / 2,
        endAngle: arcDegrees / 2,
        width,
        colorStops,
        min,
        max,
        arcDegrees,
        barMode,
        gap: colorStops.gap ?? 0,
        className: 'horseshoe-colorstop-scale-segment',
        lineCap: 'round',
      });
    }

    if (scaleMode === 'fixed') {
      return Label.renderFixedScaleSegments({
        cx,
        cy,
        radius,
        startAngle: -arcDegrees / 2,
        endAngle: arcDegrees / 2,
        width,
        color,
        min,
        max,
        arcDegrees,
        barMode,
        segmentSize: 0,
        gap: 0,
        className: 'horseshoe-fixed-scale-segment',
        lineCap: 'round',
      });
    }

    return svg``;
  }

  _testRenderColorStopScale(horseshoeIndex, horseshoe) {
    const scaleMode = horseshoe?.show?.scale_style;

    if (!scaleMode) {
      return svg``;
    }

    const min = Number(horseshoe.horseshoe_scale.min);
    const max = Number(horseshoe.horseshoe_scale.max);

    const cx = horseshoe.svg.xpos;
    const cy = horseshoe.svg.ypos;
    const radius = horseshoe.svg.radius;

    const barMode = horseshoe.bar_mode;
    const arcDegrees = horseshoe.arc_degrees;

    const width = horseshoe.horseshoe_scale.width;
    const color = horseshoe.horseshoe_scale.color;

    const colorStops = horseshoe.colorStops;

    if (scaleMode === 'colorstop') {
      if (!colorStops?.colors?.length) {
        return svg``;
      }

      return Label.renderColorStopScaleSegments({
        cx,
        cy,
        radius,
        startAngle: -arcDegrees / 2,
        endAngle: arcDegrees / 2,
        width,
        colorStops,
        min,
        max,
        arcDegrees,
        barMode,
        gap: colorStops.gap ?? 0,
        className: 'horseshoe-colorstop-scale-segment',
        lineCap: 'round',
      });
    }

    if (scaleMode === 'fixed_tickmarks') {
      return Label.renderScaleTicks({
        cx,
        cy,
        radius,
        min,
        max,
        arcDegrees,
        barMode,
        color,
        ticksMajor: horseshoe.horseshoe_scale.ticks_major,
        ticksMinor: horseshoe.horseshoe_scale.ticks_minor,
      });
    }
    // if (scaleMode === 'fixed_tickmarks') {
    //   return Label.renderFixedScaleSegments({
    //     cx,
    //     cy,
    //     radius,
    //     startAngle: -arcDegrees / 2,
    //     endAngle: arcDegrees / 2,
    //     width,
    //     color,
    //     min,
    //     max,
    //     arcDegrees,
    //     barMode,
    //     segmentSize: horseshoe.horseshoe_scale.ticksize,
    //     gap: horseshoe.horseshoe_scale?.gap ?? 0,
    //     className: 'horseshoe-fixed-scale-segment',
    //     lineCap: 'round',
    //   });
    // }

    if (scaleMode === 'fixed') {
      return Label.renderFixedScaleSegments({
        cx,
        cy,
        radius,
        startAngle: -arcDegrees / 2,
        endAngle: arcDegrees / 2,
        width,
        color,
        min,
        max,
        arcDegrees,
        barMode,
        segmentSize: 0,
        gap: 0,
        className: 'horseshoe-fixed-scale-segment',
        lineCap: 'round',
      });
    }

    return svg``;
  }

  _renderHorseshoeLabelBackground(horseshoe, horseshoeIndex) {
    const backgroundMode = horseshoe?.show?.label_background ?? 'none';

    if (backgroundMode === 'none') {
      return svg``;
    }

    const background = horseshoe?.horseshoe_labels?.background ?? {};

    const min = Number(horseshoe.horseshoe_scale.min);
    const max = Number(horseshoe.horseshoe_scale.max);

    const cx = horseshoe.svg.xpos;
    const cy = horseshoe.svg.ypos;

    const radius = horseshoe.svg.radius + Number(horseshoe?.horseshoe_labels?.offset ?? horseshoe.horseshoe_state.width + 2);

    const barMode = horseshoe.bar_mode;
    const arcDegrees = horseshoe.arc_degrees;

    const width = Number(background.width ?? 6);
    const color = background.color; // ?? 'var(--secondary-background-color)';
    const gap = Number(background.gap ?? 0);

    const colorStops = horseshoe.colorStops;

    // const extendDegrees = Label.getLabelBackgroundExtend({
    //   horseshoe,
    //   min,
    //   max,
    //   radius,
    // });

    const extendDegrees = Label.getLabelBackgroundExtend({
      minLabel: min,
      maxLabel: max,
      charWidth: Number(horseshoe?.horseshoe_labels?.badges?.char_width ?? 4),
      padding: Number(horseshoe?.horseshoe_labels?.badges?.padding ?? 3),
      radius,
    });

    if (backgroundMode === 'colorstop') {
      if (!colorStops?.colors?.length) {
        return svg``;
      }

      return Label.renderColorStopScaleSegments({
        cx,
        cy,
        radius,
        startAngle: -arcDegrees / 2,
        endAngle: arcDegrees / 2,
        width,
        colorStops,
        min,
        max,
        arcDegrees,
        barMode,
        gap,
        className: 'horseshoe-label-background-colorstop',
        lineCap: 'round',
      });
    }

    if (backgroundMode === 'fixed') {
      return Label.renderFixedScaleSegments({
        cx,
        cy,
        radius,
        startAngle: -arcDegrees / 2 - 20, // extendDegrees,
        endAngle: arcDegrees / 2 + 20, // extendDegrees,
        width,
        color,
        min,
        max,
        arcDegrees,
        barMode,
        segmentSize: 0,
        gap: 0,
        className: 'horseshoe-label-background-fixed',
        lineCap: 'round',
      });
    }

    return svg``;
  }

  _renderHorseshoeLabelBadges(horseshoe, horseshoeIndex) {
    const labelsAt = horseshoe?.show?.labels_at ?? 'none';

    if (labelsAt === 'none' || !horseshoe?.show?.label_badges) {
      return svg``;
    }

    const min = Number(horseshoe.horseshoe_scale.min);
    const max = Number(horseshoe.horseshoe_scale.max);

    const cx = horseshoe.svg.xpos;
    const cy = horseshoe.svg.ypos;

    const radius = horseshoe.svg.radius + Number(horseshoe?.horseshoe_labels?.offset ?? horseshoe.horseshoe_state.width + 2);

    const barMode = horseshoe.bar_mode;
    const arcDegrees = horseshoe.arc_degrees;
    const colorStops = horseshoe.colorStops;

    const orientation = horseshoe?.horseshoe_labels?.orientation ?? 'arc';
    const badgeConfig = horseshoe?.horseshoe_labels?.badges ?? {};
    // console.log('badges', orientation, badgeConfig);
    let labelStops = [];

    if (labelsAt === 'minmax') {
      labelStops = [
        { value: min, label: min },
        { value: max, label: max },
      ];
    }

    if (labelsAt === 'colorstop') {
      if (!colorStops?.colors?.length) return svg``;

      labelStops = [{ value: min, label: min }, ...colorStops.colors, { value: max, label: max }];
    }

    if (labelsAt === 'ticks_major') {
      const ticksize = Number(horseshoe.horseshoe_tickmarks?.ticks_major?.ticksize);

      if (!Number.isFinite(ticksize) || ticksize <= 0) return svg``;

      labelStops = Label.buildTickValues(min, max, ticksize).map((value) => ({
        value,
        label: value,
      }));
    }

    if (labelsAt === 'both') {
      const colorStopLabels = colorStops?.colors?.length ? [{ value: min, label: min }, ...colorStops.colors, { value: max, label: max }] : [];

      const ticksize = Number(horseshoe.horseshoe_tickmarks?.ticks_major?.ticksize);

      const tickLabels = Number.isFinite(ticksize) && ticksize > 0 ? Label.buildTickValues(min, max, ticksize).map((value) => ({ value, label: value })) : [];

      labelStops = [...colorStopLabels, ...tickLabels];
    }

    labelStops = labelStops
      .filter((stop) => {
        const value = Number(stop.value);
        return Number.isFinite(value) && value >= min && value <= max;
      })
      .sort((a, b) => Number(a.value) - Number(b.value))
      .filter((stop, index, array) => {
        const value = Number(stop.value);
        return array.findIndex((item) => Number(item.value) === value) === index;
      });

    const distanceMin = Number(horseshoe?.horseshoe_labels?.distance_min ?? 0);
    const visibleLabelStops = [];

    labelStops.forEach((stop) => {
      const value = Number(stop.value);

      if (distanceMin <= 0) {
        visibleLabelStops.push(stop);
        return;
      }

      const previous = visibleLabelStops[visibleLabelStops.length - 1];

      if (!previous || Math.abs(value - Number(previous.value)) >= distanceMin) {
        visibleLabelStops.push(stop);
      }
    });

    return svg`
    ${visibleLabelStops.map((stop, index) => {
      const value = Number(stop.value);
      const angle = Label.valueToAngle(value, min, max, arcDegrees, barMode);

      return Label.renderLabelBadge({
        horseshoeIndex,
        index,
        label: stop.label ?? stop.value,
        angle,
        cx,
        cy,
        radius,
        cardId: this.cardId,
        orientation,
        badge: badgeConfig,
      });
    })}
  `;
  }

  _renderHorseshoeLabels(horseshoe, horseshoeIndex, groupRotation) {
    const labelsAt = horseshoe?.show?.labels_at ?? 'none';

    if (labelsAt === 'none') {
      return svg``;
    }

    const min = Number(horseshoe.horseshoe_scale.min);
    const max = Number(horseshoe.horseshoe_scale.max);

    const cx = horseshoe.svg.xpos;
    const cy = horseshoe.svg.ypos;

    const radius = horseshoe.svg.radius + Number(horseshoe?.horseshoe_labels?.offset ?? horseshoe.horseshoe_state.width + 2);

    const barMode = horseshoe.bar_mode;
    const arcDegrees = horseshoe.arc_degrees;
    const colorStops = horseshoe.colorStops;

    const orientation = horseshoe?.horseshoe_labels?.orientation ?? 'arc';

    const flip = horseshoe?.flip;
    const rotation = horseshoe?.rotate ?? 0;

    const transformContext = {
      rotation,
      flipX: flip === 'x' || flip === 'both',
      flipY: flip === 'y' || flip === 'both',
    };
    let labelStops = [];

    if (labelsAt === 'minmax') {
      labelStops = [
        { value: min, label: min },
        { value: max, label: max },
      ];
    }

    if (labelsAt === 'colorstop') {
      if (!colorStops?.colors?.length) {
        return svg``;
      }

      labelStops = [{ value: min, label: min }, ...colorStops.colors, { value: max, label: max }].filter((stop, index, array) => {
        const value = Number(stop.value);

        return Number.isFinite(value) && value >= min && value <= max && array.findIndex((item) => Number(item.value) === value) === index;
      });
    }

    if (labelsAt === 'ticks_major') {
      const ticksize = Number(horseshoe.horseshoe_tickmarks?.ticks_major?.ticksize);

      if (!Number.isFinite(ticksize) || ticksize <= 0) {
        return svg``;
      }

      labelStops = Label.buildTickValues(min, max, ticksize).map((value) => ({
        value,
        label: value,
      }));
    }

    if (labelsAt === 'both') {
      const colorStopLabels = colorStops?.colors?.length ? [{ value: min, label: min }, ...colorStops.colors, { value: max, label: max }] : [];

      const ticksize = Number(horseshoe.horseshoe_tickmarks?.ticks_major?.ticksize);
      const tickLabels =
        Number.isFinite(ticksize) && ticksize > 0
          ? Label.buildTickValues(min, max, ticksize).map((value) => ({
              value,
              label: value,
            }))
          : [];

      labelStops = [...colorStopLabels, ...tickLabels]
        .filter((stop) => {
          const value = Number(stop.value);

          return Number.isFinite(value) && value >= min && value <= max;
        })
        .sort((a, b) => Number(a.value) - Number(b.value))
        .filter((stop, index, array) => {
          const value = Number(stop.value);

          return array.findIndex((item) => Number(item.value) === value) === index;
        });
    }

    const distanceMin = Number(horseshoe?.horseshoe_labels?.distance_min ?? 0);
    const visibleLabelStops = [];

    labelStops.forEach((stop) => {
      const value = Number(stop.value);

      if (distanceMin <= 0) {
        visibleLabelStops.push(stop);
        return;
      }

      const previous = visibleLabelStops[visibleLabelStops.length - 1];

      if (!previous || Math.abs(value - Number(previous.value)) >= distanceMin) {
        visibleLabelStops.push(stop);
      }
    });

    return svg`
      ${visibleLabelStops.map((stop, index) => {
        const value = Number(stop.value);
        const angle = Label.valueToAngle(value, min, max, arcDegrees, barMode);

        return Label.renderLabel({
          horseshoeIndex,
          index,
          label: stop.label ?? stop.value,
          angle,
          cx,
          cy,
          radius,
          cardId: this.cardId,
          orientation,
          isMin: false,
          isMax: false,
          transformContext,
        });
      })}
    `;
  }

  _renderColorStopLabels(horseshoeIndex, horseshoe, horseshoeScale, colorStops, arcDegrees) {
    if (horseshoe?.show?.labels_at !== 'colorstop') {
      console.log('_renderColorStopLabels, NO labels_at', horseshoe?.show);
      return svg``;
    }
    if (!colorStops?.colors?.length) {
      console.log('renderColorStopLabels, no colorstops', horseshoe);
      return svg``;
    }
    const min = Number(horseshoeScale.min);
    const max = Number(horseshoeScale.max);

    const cx = horseshoe.svg.xpos;
    const cy = horseshoe.svg.ypos;
    const radius = horseshoe.svg.radius + Number(horseshoe?.horseshoe_labels?.offset ?? horseshoe.horseshoe_state.width + 2);

    const barMode = horseshoe.bar_mode;
    let labelStops = [];
    if (horseshoe?.show?.labels_at === 'colorstop') {
      labelStops = [{ value: min, label: min }, ...colorStops.colors, { value: max, label: max }].filter((stop, index, array) => {
        const value = Number(stop.value);

        return Number.isFinite(value) && value >= min && value <= max && array.findIndex((item) => Number(item.value) === value) === index;
      });
    }
    // console.log('_renderColorStopLabels, labelStops ', labelStops);

    const distanceMin = Number(horseshoe?.horseshoe_labels?.distance_min ?? 0);

    const visibleLabelStops = [];

    labelStops.forEach((stop, index) => {
      const value = Number(stop.value);
      const isEndpoint = index === 0 || index === labelStops.length - 1;

      if (isEndpoint || distanceMin <= 0) {
        visibleLabelStops.push(stop);
        return;
      }

      const previous = visibleLabelStops[visibleLabelStops.length - 1];

      if (!previous || Math.abs(value - Number(previous.value)) >= distanceMin) {
        visibleLabelStops.push(stop);
      }
    });
    // console.log('_renderColorStopLabels, labelStops ', labelStops, visibleLabelStops);

    return svg`
      ${visibleLabelStops.map((stop, index) => {
        const value = Number(stop.value);

        const angle = Label.valueToAngle(value, min, max, arcDegrees, barMode);

        return Label.renderColorStopLabel({
          horseshoeIndex,
          index,
          label: stop.label ?? stop.value,
          angle,
          cx,
          cy,
          radius,
          cardId: this.cardId,
          isMin: false,
          isMax: false,
        });
      })}
  `;

    return svg`
      ${Label.renderArcSegment({
        cx,
        cy,
        radius,
        startAngle: -arcDegrees / 2,
        endAngle: arcDegrees / 2,
        width: horseshoe?.horseshoe_labels?.background?.width ?? 8,
        color: 'rgba(255, 255, 255, 0.02)',
        className: 'horseshoe-label-background',
      })};
      ${
        horseshoe?.colorStops.colors.length
          ? Label.renderColorStopScaleSegments({
              cx,
              cy,
              radius,
              startAngle: -arcDegrees / 2,
              endAngle: arcDegrees / 2,
              width: horseshoe?.horseshoe_labels?.background?.width ?? 8,
              colorStops,
              min,
              max,
              arcDegrees,
              barMode,
              gap: colorStops.gap ?? 2,
              className: 'horseshoe-label-colorstop-segment',
              lineCap: 'round',
            })
          : svg``
      }
      ${labelStops.map((stop, index) => {
        const value = Number(stop.value);

        const angle = Label.valueToAngle(value, min, max, arcDegrees, barMode);

        return Label.renderColorStopLabel({
          horseshoeIndex,
          index,
          label: stop.label ?? stop.value,
          angle,
          cx,
          cy,
          radius,
          cardId: this.cardId,
          isMin: false,
          isMax: false,
        });
      })}
  `;
  }

  getCardSize() {
    return 4;
  }
}

if (!customElements.get('flex-horseshoe-card')) {
  customElements.define('flex-horseshoe-card', FlexHorseshoeCard);
}
