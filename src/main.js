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
import ConfigHelper from './config-helper.js';
import Templates from './templates.js';
import ColorStops from './color-stops.js';
import { stateIconName } from './frontend_mods/common/entity/state_icon_name.js';
import { formatNumber, getDefaultFormatOptions } from './frontend_mods/format_number.js';
import { formatDate, formatDateMonth, formatDateMonthYear, formatDateShort, formatDateNumeric, formatDateWeekday, formatDateWeekdayDay, formatDateWeekdayShort } from './frontend_mods/datetime/format_date';
import { formatTime, formatTime24h, formatTimeWeekday, formatTimeWithSeconds } from './frontend_mods/datetime/format_time';
import { formatDateTime, formatDateTimeNumeric, formatDateTimeWithSeconds, formatShortDateTime, formatShortDateTimeWithYear } from './frontend_mods/datetime/format_date_time';
import { formatDuration } from './frontend_mods/datetime/duration.js';
import { computeDomain } from './frontend_mods/common/entity/compute_domain.js';

import { hs2rgb, rgb2hex, rgb2hsv, hsv2rgb } from './frontend_mods/color/convert-color';
import { rgbw2rgb, rgbww2rgb, temperature2rgb } from './frontend_mods/color/convert-light-color';
import Colors from './colors.js';
import { version } from '../package.json';

console.info(`%c FLEX-HORSESHOE-CARD %c Version ${version} `, 'color: white; font-weight: bold; background: darkgreen', 'color: darkgreen; font-weight: bold; background: white');

// ++ Consts ++++++++++
const FONT_SIZE = 12;
const SVG_VIEW_BOX = 200;

// Donut starts at -220 degrees and is 260 degrees in size.
// zero degrees is at 3 o'clock.
const HORSESHOE_RADIUS_SIZE = 0.45 * SVG_VIEW_BOX;
const TICKMARKS_RADIUS_SIZE = 0.43 * SVG_VIEW_BOX;
const HORSESHOE_PATH_LENGTH = ((2 * 260) / 360) * Math.PI * HORSESHOE_RADIUS_SIZE;
const CIRCLE_PATH_LENGTH = 2 * Math.PI * HORSESHOE_RADIUS_SIZE;

const DEFAULT_HORSESHOE_POSITION = {
  xpos: 50,
  ypos: 50,
  horseshoe_radius: HORSESHOE_RADIUS_SIZE,
  tickmarks_radius: TICKMARKS_RADIUS_SIZE,
};

const DEFAULT_SHOW = {
  horseshoe: true,
  scale_tickmarks: false,
  horseshoe_style: 'fixed',
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

const DEFAULT_TAP_ACTION = {
  action: 'more-info',
};

//--

// ++ Class ++++++++++

class FlexHorseshoeCard extends LitElement {
  constructor() {
    super();

    Colors.setElement(this);

    // Get cardId for unique SVG gradient Id
    this.cardId = Math.random().toString(36).substr(2, 9);
    this._hass = undefined;
    this.entities = [];
    this.entitiesStr = [];
    this.attributesStr = [];
    this.viewBoxSize = SVG_VIEW_BOX;
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

    this.iconCache = {};
    this.iconsSvg = [];
    this.pendingIconPath = [];
    this.iconsId = [];

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

      console.log('style test 1', ConfigHelper.toStyleDict([{ 'font-size': '2.8em;' }, { 'text-anchor': 'start;' }, { opacity: '0.7;' }]));

      console.log('style test 2', ConfigHelper.toStyleDict(['font-size: 2.8em;', 'text-anchor: start;', 'opacity: 0.7;']));

      console.log('style test 3', ConfigHelper.toStyleDict(['font-size: 2.8em', 'text-anchor: start', 'opacity: 0.7']));

      console.log(
        'style test 4',
        ConfigHelper.toStyleDict({
          'font-size': '2.8em;',
          'text-anchor': 'start;',
          opacity: '0.7;',
        }),
      );

      console.log(
        'style test 5',
        ConfigHelper.toStyleDict({
          'font-size': '2.8em',
          'text-anchor': 'start',
          opacity: 0.7,
        }),
      );

      console.log('style test 6', ConfigHelper.toStyleDict('font-size: 2.8em; text-anchor: start; opacity: 0.7;'));

      console.log(
        'style test 7',
        ConfigHelper.toStyleDict([
          `[[[
          return { 'font-size': '2.8em' };
        ]]]`,
          'text-anchor: start;',
          'opacity: 0.7;',
        ]),
      );

      const rawStyles = [
        `[[[
        return { 'font-size': '2.8em' };
      ]]]`,
        'text-anchor: start;',
        'opacity: 0.7;',
      ];
      const item = {
        entity_index: 0,
      };
      const resolvedStyles = Templates.getJsTemplateOrValue(item, rawStyles);
      const itemStyleDict = ConfigHelper.toStyleDict(resolvedStyles);

      console.log('style test 8 - resolvedStyles', resolvedStyles);
      console.log('style test 8 - itemStyleDict', itemStyleDict);
      if (this.config?.dev?.debug) {
        ColorStops._testColorStopsNormalizer();
      }

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
        padding: 10px 10px 0px 10px;
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

  set hass(hass) {
    this._hass = hass;

    Templates.setContext({
      hass: this._hass,
      config: this.config,
      entities: this.entities,
      horseshoes: this.horseshoes,
    });

    let entityHasChanged = false;

    this.resolvedEntityConfigs = this._resolveEntityConfigs(this.config);

    this.resolvedEntityConfigs.forEach((entityConfig, index) => {
      const entity = hass.states[entityConfig.entity];

      if (!entity) {
        return;
      }

      this.entities[index] = entity;

      const newStateStr = this._buildState(entity.state, entityConfig);

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

    this.horseshoes = this.horseshoes.map((horseshoe) => {
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

      const horseshoeScale = Templates.getJsTemplateOrValue({ entity_index: entityIndex }, horseshoe.horseshoe_scale);

      const min = horseshoeScale?.min ?? 0;
      const max = horseshoeScale?.max ?? 100;
      const barMode = horseshoe.bar_mode || 'normal';

      let dashArray;
      let dashOffset;
      let bidirectionalNegative = false;

      if (barMode === 'bidirectional') {
        const totalLength = horseshoe.horseshoePathLength;
        const value = Number(state);

        if (value >= 0) {
          const positiveLength = Math.min(Colors.calculateValueBetween(0, max, value), 1) * (totalLength / 2);

          dashArray = `${positiveLength} ${horseshoe.circlePathLength - positiveLength}`;
          dashOffset = undefined;
          bidirectionalNegative = false;
        } else {
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
        const stroke = this._calculateStrokeColor(state, horseshoe.colorStopsMinMax, true);

        color0 = stroke;
        color1 = stroke;
        color1Offset = '0%';
      } else if (strokeStyle === 'colorstop' || strokeStyle === 'colorstopgradient') {
        const stroke = this._calculateStrokeColor(state, horseshoe.colorStops, strokeStyle === 'colorstopgradient');

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

    const defaultHorseshoe = this.horseshoes[0];

    this.dashArray = defaultHorseshoe.dashArray;
    this.dashOffset = defaultHorseshoe.dashOffset;
    this._bidirectional_negative = defaultHorseshoe.bidirectional_negative;

    this.stroke_color = defaultHorseshoe.stroke_color;
    this.color0 = defaultHorseshoe.color0;
    this.color1 = defaultHorseshoe.color1;
    this.color1_offset = defaultHorseshoe.color1_offset;
    this.angleCoords = defaultHorseshoe.angleCoords;

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
    const layoutSections = ['states', 'names', 'areas', 'circles', 'hlines', 'vlines', 'icons'];

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

  /** *****************************************************************************
   * setConfig()
   *
   * Summary.
   *  Sets/Updates the card configuration. Rarely called if the doc is right
   *
   */

  setConfig(config) {
    config = JSON.parse(JSON.stringify(config));

    if (!config.entities) {
      throw Error('No entities defined');
    }

    if (!config.layout) {
      throw Error('No layout defined');
    }

    const resolvedEntitiesConfig = this._resolveEntityConfigs(config);

    if (resolvedEntitiesConfig) {
      const newdomain = this._computeDomain(resolvedEntitiesConfig[0].entity);

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
      horseshoe_position: {
        ...DEFAULT_HORSESHOE_POSITION,
        ...config?.horseshoe_position,
      },
      horseshoe_scale: {
        ...DEFAULT_HORSESHOE_SCALE,
        ...config.horseshoe_scale,
      },
      horseshoe_state: {
        ...DEFAULT_HORSESHOE_STATE,
        ...config.horseshoe_state,
      },
    };

    const rawHorseshoes = Array.isArray(newConfig.horseshoes)
      ? newConfig.horseshoes.map((horseshoeConfig, index) => ({
          ...newConfig,
          ...horseshoeConfig,
          entity_index: horseshoeConfig.entity_index ?? index,
        }))
      : [
          {
            ...newConfig,
            entity_index: 0,
          },
        ];

    this.horseshoes = rawHorseshoes.map((horseshoeConfig, index) => {
      const entityIndex = horseshoeConfig.entity_index ?? index;

      const show = {
        ...DEFAULT_SHOW,
        ...(horseshoeConfig.show ?? {}),
      };

      const horseshoeScale = {
        ...DEFAULT_HORSESHOE_SCALE,
        ...(horseshoeConfig.horseshoe_scale ?? {}),
      };

      const horseshoeState = {
        ...DEFAULT_HORSESHOE_STATE,
        ...(horseshoeConfig.horseshoe_state ?? {}),
      };

      const xpos = horseshoeConfig.xpos ?? horseshoeConfig.horseshoe_position?.xpos ?? horseshoeConfig.horseshoe_position?.cx ?? DEFAULT_HORSESHOE_POSITION.xpos ?? DEFAULT_HORSESHOE_POSITION.cx ?? 50;

      const ypos = horseshoeConfig.ypos ?? horseshoeConfig.horseshoe_position?.ypos ?? horseshoeConfig.horseshoe_position?.cy ?? DEFAULT_HORSESHOE_POSITION.ypos ?? DEFAULT_HORSESHOE_POSITION.cy ?? 50;

      if ((!horseshoeScale.min && horseshoeScale.min !== 0) || (!horseshoeScale.max && horseshoeScale.max !== 0)) {
        throw Error(`No horseshoe min/max for scale defined for horseshoe ${index}`);
      }

      const colorStopsConfig = horseshoeConfig.color_stops;

      if (!colorStopsConfig) {
        throw Error(`No color_stops defined for horseshoe ${index}`);
      }

      const resolvedColorStops = Templates.getJsTemplateOrValue({ entity_index: entityIndex }, colorStopsConfig, { resolveKeys: true });

      const colorStops = ColorStops.normalize(resolvedColorStops);
      const colorStopColors = colorStops.colors;

      if (!colorStopColors || colorStopColors.length < 2) {
        throw Error(`No color_stops defined or not at least two colorstops for horseshoe ${index}`);
      }

      const firstStop = colorStopColors[0];
      const lastStop = colorStopColors[colorStopColors.length - 1];

      let colorStopsMinMax = ColorStops.normalize({});
      let color0;
      let color1;

      if (firstStop && lastStop) {
        colorStopsMinMax = ColorStops.normalize({
          [horseshoeScale.min]: firstStop.color,
          [horseshoeScale.max]: lastStop.color,
        });

        color0 = firstStop.color;
        color1 = lastStop.color;
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

        dashArray: this.dashArray,
        dashOffset: this.dashOffset,
        bidirectional_negative: this._bidirectional_negative,
      };
    });

    if (!this.horseshoes.length) {
      throw Error('No horseshoes defined');
    }

    const defaultHorseshoe = this.horseshoes[0];

    this.colorStops = defaultHorseshoe.colorStops;
    this.colorStopsMinMax = defaultHorseshoe.colorStopsMinMax;
    this.color0 = defaultHorseshoe.color0;
    this.color1 = defaultHorseshoe.color1;
    this.angleCoords = defaultHorseshoe.angleCoords;
    this.color1_offset = defaultHorseshoe.color1_offset;

    this._prepareItemColorStops(newConfig);

    this.config = newConfig;
    this.bar_mode = newConfig.bar_mode || 'normal';

    if (this.config.layout?.icons) {
      this.config.layout.icons.forEach((iconConfig, index) => {
        this.iconsId[index] = Math.random().toString(36).substr(2, 9);
      });
    }

    Templates.setContext({
      hass: this._hass,
      config: this.config,
      entities: this.entities,
      horseshoes: this.horseshoes,
    });
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

    return this._calculateStrokeColor(stateNumber, item._colorStops, item.colorstop_gradient === true);
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

  _renderTickMarks(horseshoe) {
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
    const centerX = (horseshoe.xpos ?? 50) * 2;
    const centerY = (horseshoe.ypos ?? 50) * 2;

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

  _renderTickMarksV2(horseshoe) {
    if (!horseshoe?.show?.scale_tickmarks) {
      return svg``;
    }

    const cx = horseshoe.xpos ?? 50;
    const cy = horseshoe.ypos ?? 50;

    const rotateX = cx * 2;
    const rotateY = cy * 2;

    const scale = horseshoe.horseshoe_scale;

    const stroke = scale.color || 'var(--primary-background-color)';
    const tickSize = scale.ticksize || (scale.max - scale.min) / 10;

    const fullScale = horseshoe.arc_degrees || 260;
    const remainder = scale.min % tickSize;
    const startTickValue = scale.min + (remainder === 0 ? 0 : tickSize - remainder);

    const startAngle = ((startTickValue - scale.min) / (scale.max - scale.min)) * fullScale;

    const tickSteps = (scale.max - startTickValue) / tickSize;
    const angleStepSize = (fullScale - startAngle) / tickSteps;

    let steps = Math.floor(tickSteps);

    if (Math.floor(steps * tickSize + startTickValue) <= scale.max) {
      steps += 1;
    }

    const radius = scale.width ? scale.width / 2 : 6 / 2;

    const scaleItems = Array.from({ length: steps }, (_, index) => {
      /*
       * NTS:
       * Value of -230 is weird. Should be -220. Can't find why...
       */
      const angle = startAngle + ((-230 + (360 - index * angleStepSize)) * Math.PI) / 180;

      return svg`
      <circle
        cx="${rotateX - Math.sin(angle) * horseshoe.tickmarksRadiusSize}"
        cy="${rotateY - Math.cos(angle) * horseshoe.tickmarksRadiusSize}"
        r="${radius}"
        fill="${stroke}">
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
          viewBox='0 0 200 200'>
            ${this._renderHorseShoes()}
            <g id="datagroup" class="datagroup">
              ${this._renderCircles()}
              ${this._renderHorizontalLines()}
              ${this._renderVerticalLines()}
              ${this._renderIcons()}
              ${this._renderEntityAreas()}
              ${this._renderEntityNames()}
              ${this._renderStates()}
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
  _renderHorseShoes() {
    return svg`
    ${this.horseshoes?.map((horseshoe, index) => this._renderHorseShoe(horseshoe, index)) ?? svg``}
  `;
  }

  _renderHorseShoe(horseshoe, index) {
    if (horseshoe.show?.horseshoe === false) {
      return svg``;
    }

    const cx = horseshoe.xpos ?? 50;
    const cy = horseshoe.ypos ?? 50;

    const cxPercent = `${cx}%`;
    const cyPercent = `${cy}%`;

    const rotateX = cx * 2;
    const rotateY = cy * 2;

    const barMode = horseshoe.bar_mode || 'normal';
    const radius = `${horseshoe.radius}%`;

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
    // fill="${fill}"
    //   stroke="${scaleStroke}"
    //   stroke-dasharray="${scaleDashArray}"
    //   stroke-width="${scaleStrokeWidth}"
    //   stroke-linecap="round"

    // fill="${fill}"
    // stroke="url('#${gradientId}')"
    // stroke-dasharray="${horseshoe.dashArray}"
    // stroke-dashoffset="${horseshoe.dashOffset}"
    // stroke-width="${stateStrokeWidth}"
    // stroke-linecap="round"
    // transform="rotate(-90 ${rotateX} ${rotateY})"
    // style="transition: all 2.5s ease-out;"/>

    if (barMode === 'bidirectional') {
      if (horseshoe.bidirectional_negative) {
        return svg`
        <g id="horseshoe__svg__group-${index}" class="horseshoe__svg__group">
          <circle id="horseshoe__scale-${index}" class="horseshoe__scale" cx="${cxPercent}" cy="${cyPercent}" r="${radius}"
            style=${styleMap(scaleStyle)}  
            transform="rotate(${startRotation} ${rotateX} ${rotateY})"/>
          <circle id="horseshoe__state__value-${index}" class="horseshoe__state__value" cx="${cxPercent}" cy="${cyPercent}" r="${radius}"
            transform="rotate(-90 ${rotateX} ${rotateY})"
            style=${styleMap(stateStyle)} />
          ${this._renderTickMarks(horseshoe)}
        </g>
      `;
      }

      return svg`
      <g id="horseshoe__svg__group-${index}" class="horseshoe__svg__group">
        <circle id="horseshoe__scale-${index}" class="horseshoe__scale" cx="${cxPercent}" cy="${cyPercent}" r="${radius}"
            style=${styleMap(scaleStyle)}  
          transform="rotate(${startRotation} ${rotateX} ${rotateY})"/>
        <circle id="horseshoe__state__value-${index}" class="horseshoe__state__value" cx="${cxPercent}" cy="${cyPercent}" r="${radius}"
          transform="rotate(-90 ${rotateX} ${rotateY})"
            style=${styleMap(stateStyle)} />
        ${this._renderTickMarks(horseshoe)}
      </g>
    `;
    }

    return svg`
    <g id="horseshoe__svg__group-${index}" class="horseshoe__svg__group">
      <circle id="horseshoe__scale-${index}" class="horseshoe__scale" cx="${cxPercent}" cy="${cyPercent}" r="${radius}"
        style=${styleMap(scaleStyle)}
        transform="rotate(${startRotation} ${rotateX} ${rotateY})"/>
      <circle id="horseshoe__state__value-${index}" class="horseshoe__state__value" cx="${cxPercent}" cy="${cyPercent}" r="${radius}"
        transform="rotate(${startRotation} ${rotateX} ${rotateY})"
        style=${styleMap(stateStyle)} />
      ${this._renderTickMarks(horseshoe)}
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

  _renderEntityNames() {
    const { layout } = this.config;

    if (!layout?.names) return svg``;

    const ENTITY_NAME_STYLES = {
      'font-size': '1em',
      color: 'var(--primary-text-color)',
      opacity: '1.0',
      'text-anchor': 'middle',
    };

    const svgItems = layout.names.map((item) => {
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
        <text
          @click=${(e) => this.handlePopup(e, this.entities[entityIndex])}
          class="entity__name">
            <tspan
              class="entity__name"
              x="${item.xpos}%"
              y="${item.ypos}%"
              style=${styleMap(styles)}>
              ${name}</tspan>
        </text>
      `;
    });

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

  _renderEntityAreas() {
    const { layout } = this.config;

    if (!layout?.areas) return svg``;

    const AREA_STYLES = {
      'font-size': '1em',
      color: 'var(--primary-text-color)',
      opacity: '1.0',
      'text-anchor': 'middle',
    };

    const svgItems = layout.areas.map((item) => {
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
        <text
          @click=${(e) => this.handlePopup(e, this.entities[entityIndex])}
          class="entity__area">
            <tspan
              class="entity__area"
              x="${item.xpos}%"
              y="${item.ypos}%"
              style=${styleMap(styles)}>
              ${area}</tspan>
        </text>
      `;
    });

    return svg`${svgItems}`;
  }

  /** *****************************************************************************
   * _renderState()
   *
   * Summary.
   * Renders the entity or attribute state of a single item.
   *
   */
  _renderState(item) {
    if (!item) return svg``;

    const entityIndex = item.entity_index ?? 0;

    // compute x,y or dx,dy positions. Spec none if not specified.
    const x = item.xpos ? item.xpos : '';
    const y = item.ypos ? item.ypos : '';
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

    const uomDx = uomConfig.dx ?? '0';
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

    const fsuomSplit = String(fsuomStr).match(/\D+|\d*\.?\d+/g);

    if (fsuomSplit?.length === 2) {
      fsuomValue = Number(fsuomSplit[0]) * 0.6;
      fsuomType = fsuomSplit[1];
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

    // console.log('[uom debug]', {
    //   rawUom: item.uom,
    //   rawUomStyles: item.uom?.styles,
    //   resolvedUomStyles,
    //   itemUomStyleDict,
    //   uomStyle,
    // });
    // const uom = this._buildUom(this.entities[entityIndex], this.resolvedEntityConfigs[entityIndex]);

    // const state =
    //   this.resolvedEntityConfigs[entityIndex].attribute && this.entities[entityIndex].attributes[this.resolvedEntityConfigs[entityIndex].attribute] ? this.attributesStr[entityIndex] : this.entitiesStr[entityIndex];
    const entity = this.entities[entityIndex];
    const entityConfig = this.resolvedEntityConfigs[entityIndex] ?? {};
    const state = this._buildStateText(entity, entityConfig);
    const uom = this._buildUom(entity, entityConfig);

    return svg`
      <text @click=${(e) => this.handlePopup(e, this.entities[entityIndex])}>
        <tspan
          class="state__value"
          x="${x}%"
          y="${y}%"
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
    `;
  }

  formatStateString(inState, entityConfig) {
    const lang = this._hass.selectedLanguage || this._hass.language;
    let locale = {};
    locale.language = lang;

    if (
      [
        'relative',
        'total',
        'datetime',
        'datetime-short',
        'datetime-short_with-year',
        'datetime_seconds',
        'datetime-numeric',
        'date',
        'date_month',
        'date_month_year',
        'date-short',
        'date-numeric',
        'date_weekday',
        'date_weekday_day',
        'date_weekday-short',
        'time',
        'time-24h',
        'time-24h_date-short',
        'time_weekday',
        'time_seconds',
      ].includes(entityConfig.format)
    ) {
      const timestamp = new Date(inState);
      if (!(timestamp instanceof Date) || isNaN(timestamp.getTime())) {
        return inState;
      }

      // if (!EntityStateTool.testTimeDate) {
      //   EntityStateTool.testTimeDate = true;
      //   console.log('datetime', formatDateTime(timestamp, locale));
      //   console.log('datetime-numeric', formatDateTimeNumeric(timestamp, locale));
      //   console.log('date', formatDate(timestamp, locale));
      //   console.log('date_month', formatDateMonth(timestamp, locale));
      //   console.log('date_month_year', formatDateMonthYear(timestamp, locale));
      //   console.log('date-short', formatDateShort(timestamp, locale));
      //   console.log('date-numeric', formatDateNumeric(timestamp, locale));
      //   console.log('date_weekday', formatDateWeekday(timestamp, locale));
      //   console.log('date_weekday-short', formatDateWeekdayShort(timestamp, locale));
      //   console.log('date_weekday_day', formatDateWeekdayDay(timestamp, locale));
      //   console.log('time', formatTime(timestamp, locale));
      //   console.log('time-24h', formatTime24h(timestamp, locale));
      //   console.log('time_weekday', formatTimeWeekday(timestamp, locale));
      //   console.log('time_seconds', formatTimeWithSeconds(timestamp, locale));
      // }

      let retValue;
      // return date/time according to formatting...
      switch (entityConfig.format) {
        case 'relative':
          // eslint-disable-next-line no-case-declarations
          const diff = selectUnit(timestamp, new Date());
          retValue = new Intl.RelativeTimeFormat(lang, { numeric: 'auto' }).format(diff.value, diff.unit);
          break;
        case 'total':
        case 'precision':
          retValue = 'Not Yet Supported';
          break;
        case 'datetime':
          retValue = formatDateTime(timestamp, locale);
          break;
        case 'datetime-short':
          retValue = formatShortDateTime(timestamp, locale);
          break;
        case 'datetime-short_with-year':
          retValue = formatShortDateTimeWithYear(timestamp, locale);
          break;
        case 'datetime_seconds':
          retValue = formatDateTimeWithSeconds(timestamp, locale);
          break;
        case 'datetime-numeric':
          retValue = formatDateTimeNumeric(timestamp, locale);
          break;
        case 'date':
          retValue = formatDate(timestamp, locale);
          // retValue = new Intl.DateTimeFormat(lang, { year: 'numeric', month: 'numeric', day: 'numeric' }).format(timestamp);
          break;
        case 'date_month':
          retValue = formatDateMonth(timestamp, locale);
          break;
        case 'date_month_year':
          retValue = formatDateMonthYear(timestamp, locale);
          break;
        case 'date-short':
          retValue = formatDateShort(timestamp, locale);
          break;
        case 'date-numeric':
          retValue = formatDateNumeric(timestamp, locale);
          break;
        case 'date_weekday':
          retValue = formatDateWeekday(timestamp, locale);
          break;
        case 'date_weekday-short':
          retValue = formatDateWeekdayShort(timestamp, locale);
          break;
        case 'date_weekday_day':
          retValue = formatDateWeekdayDay(timestamp, locale);
          break;
        case 'time':
          retValue = formatTime(timestamp, locale);
          // retValue = new Intl.DateTimeFormat(lang, { hour: 'numeric', minute: 'numeric', second: 'numeric' }).format(timestamp);
          break;
        case 'time-24h':
          retValue = formatTime24h(timestamp);
          break;
        case 'time-24h_date-short':
          // eslint-disable-next-line no-case-declarations
          const diff2 = selectUnit(timestamp, new Date());
          if (['second', 'minute', 'hour'].includes(diff2.unit)) {
            retValue = formatTime24h(timestamp);
          } else {
            retValue = formatDateShort(timestamp, locale);
          }
          break;
        case 'time_weekday':
          retValue = formatTimeWeekday(timestamp, locale);
          break;
        case 'time_seconds':
          retValue = formatTimeWithSeconds(timestamp, locale);
          break;
        default:
      }
      return retValue;
    }

    if (isNaN(parseFloat(inState)) || !isFinite(inState)) {
      return inState;
    }
    if (entityConfig.format === 'brightness' || entityConfig.format === 'brightness_pct') {
      return `${Math.round((inState / 255) * 100)} %`;
    }
    if (entityConfig.format === 'duration') {
      return formatDuration(inState, 's');
    }
  }

  _buildStateText(stateObj, entityConfig = {}) {
    if (!stateObj) return '';

    const entityId = stateObj.entity_id;
    const entity = this._hass.entities?.[entityId];
    const entity2 = this._hass.states?.[entityId];
    const domain = computeDomain(entityId);

    let inState = entityConfig.attribute ? stateObj.attributes?.[entityConfig.attribute] : stateObj.state;
    inState = this._buildState(inState, entityConfig);

    if ([undefined, 'undefined'].includes(inState)) {
      return '';
    }

    if (entityConfig.format !== undefined && typeof inState !== 'undefined') {
      inState = this.formatStateString(inState, entityConfig);
    }

    const localeTag = entityConfig.locale_tag ? `${entityConfig.locale_tag}${String(inState).toLowerCase()}` : undefined;

    if (inState && isNaN(inState) && (!entityConfig.secondary_info || entityConfig.attribute)) {
      inState =
        (localeTag && this._hass.localize(localeTag)) ||
        (entity?.translation_key && this._hass.localize(`component.${entity.platform}.entity.${domain}.${entity.translation_key}.state.${inState}`)) ||
        (entity2?.attributes?.device_class && this._hass.localize(`component.${domain}.entity_component.${entity2.attributes.device_class}.state.${inState}`)) ||
        this._hass.localize(`component.${domain}.entity_component._.state.${inState}`) ||
        inState;

      inState = this.textEllipsis?.(inState, this.config?.show?.ellipsis) ?? inState;
    }

    if (['undefined', 'unknown', 'unavailable', '-ua-'].includes(inState)) {
      inState = this._hass.localize(`state.default.${inState}`);
    }

    if (!isNaN(inState)) {
      let options = {};
      options = getDefaultFormatOptions(inState, options);

      if (entityConfig.decimals !== undefined) {
        options.maximumFractionDigits = entityConfig.decimals;
        options.minimumFractionDigits = options.maximumFractionDigits;
      }

      inState = formatNumber(inState, this._hass.locale, options);
    }

    return inState;
  }

  /** *****************************************************************************
   * _renderStates()
   *
   * Summary.
   * Renders the states.
   *
   */

  _renderStates() {
    const { layout } = this.config;

    if (!layout) return;
    if (!layout.states) return;

    const svgItems = layout.states.map(
      (item) => svg`
            ${this._renderState(item)}
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

  _renderIcon(item, index) {
    if (!item) return;

    item.entity = item.entity ? item.entity : 0;

    this.iconCache ||= {};
    this.iconsSvg ||= [];
    this.pendingIconPath ||= [];

    const iconSize = item.icon_size ? item.icon_size : 2;
    const iconPixels = iconSize * FONT_SIZE;

    const x = item.xpos ? item.xpos / 100 : 0.5;
    const y = item.ypos ? item.ypos / 100 : 0.5;

    const cx = x * SVG_VIEW_BOX;
    const cy = y * SVG_VIEW_BOX;

    const align = item.align ? item.align : 'center';
    const adjust = align === 'center' ? 0.5 : align === 'start' ? -1 : 1;

    let xpx = cx - iconPixels * adjust;
    let ypx = cy - iconPixels * adjust;
    let foIconPixels = iconPixels;

    const entityIndex = item.entity_index ?? 0;

    // Config styles from icon itself.
    const resolvedStyles = Templates.getJsTemplateOrValue(item, item.styles);
    let configStyle = ConfigHelper.toStyleDict(resolvedStyles);

    // Runtime animation styles.
    const stateStyle = this.animations?.icons?.[item.animation_id] ?? {};

    const stopColor = this._getItemColorFromStops(item);
    if (stopColor) {
      configStyle.fill = stopColor;
    }

    // Runtime animation styles overwrite static/config styles.
    configStyle = {
      ...configStyle,
      ...stateStyle,
    };

    const icon = this._buildIcon(this.entities[entityIndex], this.resolvedEntityConfigs[entityIndex], this.animations?.iconsIcon?.[item.animation_id]);

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
      const y1 = cy - iconPixels * 0.5 - iconPixels * 0.25;
      const scale = iconPixels / 24;

      return svg`
      <g
        id="icon-rendered-${this.iconsId[index]}"
        style="${styleMap(configStyle)}"
        x="${x1}px"
        y="${y1}px"
        transform-origin="${cx} ${cy}"
        @click=${(e) => this.handlePopup(e, this.entities[item.entity_index])}
      >
        <rect
          x="${x1}"
          y="${y1}"
          height="${iconPixels}px"
          width="${iconPixels}px"
          stroke-width="0px"
          fill="rgba(0,0,0,0)"
        ></rect>

        <path
          d="${iconSvg}"
          transform="translate(${x1},${y1}) scale(${scale})"
        ></path>
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

  _renderHorizontalLines() {
    const { layout } = this.config;

    if (!layout?.hlines) return svg``;

    const HLINES_STYLES = {
      'stroke-linecap': 'round',
      stroke: 'var(--primary-text-color)',
      opacity: '1.0',
      'stroke-width': '2',
    };

    const svgItems = layout.hlines.map((item) => {
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
      <line
        @click=${(e) => this.handlePopup(e, this.entities[entityIndex])}
        class="line__horizontal"
        x1="${item.xpos - item.length / 2}%"
        y1="${item.ypos}%"
        x2="${item.xpos + item.length / 2}%"
        y2="${item.ypos}%" 
        style=${styleMap(styles)}
      ></line>
    `;
    });

    return svg`${svgItems}`;
  }

  /** *****************************************************************************
   * _renderVerticalLines()
   *
   * Summary.
   * Renders the specified lines in the grid.
   *
   */

  _renderVerticalLines() {
    const { layout } = this.config;

    if (!layout?.vlines) return svg``;

    const VLINES_STYLES = {
      'stroke-linecap': 'round',
      stroke: 'var(--primary-text-color)',
      opacity: '1.0',
      'stroke-width': '2',
    };

    const svgItems = layout.vlines.map((item) => {
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
      <line
        @click=${(e) => this.handlePopup(e, this.entities[entityIndex])}
        class="line__vertical"
        x1="${item.xpos}%"
        y1="${item.ypos - item.length / 2}%"
        x2="${item.xpos}%"
        y2="${item.ypos + item.length / 2}%"
        style=${styleMap(styles)}
      ></line>
    `;
    });

    return svg`${svgItems}`;
  }

  /** *****************************************************************************
   * _renderCircles()
   *
   * Summary.
   * Renders the specified circles in the grid.
   *
   */

  _renderCircles() {
    const { layout } = this.config;

    if (!layout?.circles) return svg``;

    const CIRCLES_STYLES = {};

    const svgItems = layout.circles.map((item) => {
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
      <circle
        @click=${(e) => this.handlePopup(e, this.entities[entityIndex])}
        class="svg__dot"
        cx="${item.xpos}%"
        cy="${item.ypos}%"
        r="${item.radius}"
        style=${styleMap(styles)}
      ></circle>
    `;
    });

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
    return entityConfig.area || '?';
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

  _buildUom(entityState, entityConfig) {
    return entityConfig.unit || entityState.attributes.unit_of_measurement || '';
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
          console.log('divide converter', { inState, parameter });
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

  _computeState(inState, dec) {
    if (isNaN(inState)) return inState;

    const state = Number(inState);

    if (dec === undefined || Number.isNaN(dec) || Number.isNaN(state)) return Math.round(state * 100) / 100;

    const x = 10 ** dec;
    return (Math.round(state * x) / x).toFixed(dec);
  }

  /** *****************************************************************************
   * _calculateStrokeColor()
   *
   * Summary.
   *
   */

  _calculateStrokeColor(state, colorStops, gradient) {
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

  _computeDomain(entityId) {
    return entityId.substr(0, entityId.indexOf('.'));
  }

  _computeEntity(entityId) {
    return entityId.substr(entityId.indexOf('.') + 1);
  }

  getCardSize() {
    return 4;
  }
}

if (!customElements.get('flex-horseshoe-card')) {
  customElements.define('flex-horseshoe-card', FlexHorseshoeCard);
}
