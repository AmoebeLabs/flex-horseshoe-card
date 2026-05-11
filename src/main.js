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
import { version } from '../package.json';
import ConfigHelper from './config-helper.js';
import Templates from './templates.js';

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

    // Get cardId for unique SVG gradient Id
    this.cardId = Math.random().toString(36).substr(2, 9);
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

  /** *****************************************************************************
   * hass()
   *
   * Summary.
   *  Updates hass data for the card
   *
   */

  set hass(hass) {
    // This is a safe and fast method  // Set ref to hass, use "_"for the name ;-)
    this._hass = hass;

    var entityHasChanged = false;

    // Update state strings and check for changes.
    // Only if changed, continue and force render
    var value;
    var index = 0;
    var newStateStr;
    var newAttributeStr;

    // eslint-disable-next-line no-restricted-syntax
    for (value of this.config.entities) {
      const entityConfig = this.config.entities[index];
      const entity = hass.states[entityConfig.entity];

      if (!entity) {
        // eslint-disable-next-line no-plusplus
        index++;
        // eslint-disable-next-line no-continue
        continue;
      }

      this.entities[index] = entity;

      /**
       * Check both entity states and entity attributes
       */
      newStateStr = this._buildState(entity.state, entityConfig);
      if (newStateStr !== this.entitiesStr[index]) {
        this.entitiesStr[index] = newStateStr;
        entityHasChanged = true;
      }

      /**
       * Check attribute if present
       */
      if (
        entityConfig.attribute &&
        // eslint-disable-next-line prefer-object-has-own
        Object.prototype.hasOwnProperty.call(entity.attributes, entityConfig.attribute)
      ) {
        newAttributeStr = this._buildState(entity.attributes[entityConfig.attribute], entityConfig);

        if (newAttributeStr !== this.attributesStr[index]) {
          this.attributesStr[index] = newAttributeStr;
          entityHasChanged = true;
        }
      }

      // eslint-disable-next-line no-plusplus
      index++;
    }

    if (!entityHasChanged) {
      return;
    } else {
    }

    // Use first state or attribute for displaying the horseshoe

    // #TODO: only if state or attribute has changed.
    var state = this.entities[0].state;
    if (this.config.entities[0].attribute) {
      if (this.entities[0].attributes[this.config.entities[0].attribute]) {
        state = this.entities[0].attributes[this.config.entities[0].attribute];
      }
    }

    // Calculate the size of the arc to fill the dasharray with this
    // value. It will fill the horseshoe relative to the state and min/max
    // values given in the configuration.

    const min = this.config.horseshoe_scale.min || 0;
    const max = this.config.horseshoe_scale.max || 100;

    const barMode = this.config.bar_mode || 'normal';

    if (barMode === 'bidirectional') {
      // Bidirectional: zero at top, positive CW, negative CCW
      // Assume min < 0 < max
      const totalLength = HORSESHOE_PATH_LENGTH;
      let val = Number(state);
      let posLen = 0;
      let negLen = 0;
      if (val >= 0) {
        posLen = Math.min(this._calculateValueBetween(0, max, val), 1) * (totalLength / 2);
        this.dashArray = `${posLen} ${CIRCLE_PATH_LENGTH - posLen}`;
        this._bidirectional_negative = false;
      } else {
        negLen = (1 - Math.min(this._calculateValueBetween(min, 0, val), 1)) * (totalLength / 2);
        this.dashArray = `${negLen} ${CIRCLE_PATH_LENGTH - negLen}`;
        this.dashOffset = -`${CIRCLE_PATH_LENGTH - negLen}`;
        this._bidirectional_negative = true;
      }
    } else {
      // Normal mode
      const val = Math.min(this._calculateValueBetween(min, max, state), 1);
      const score = val * HORSESHOE_PATH_LENGTH;
      const total = 10 * HORSESHOE_RADIUS_SIZE;
      this.dashArray = `${score} ${total}`;
      this._bidirectional_negative = false;
    }

    const val = Math.min(this._calculateValueBetween(min, max, state), 1);
    const score = val * HORSESHOE_PATH_LENGTH;
    const total = 10 * HORSESHOE_RADIUS_SIZE;

    // We must draw the horseshoe. Depending on the stroke settings, we draw a fixed color, gradient, autominmax or colorstop
    // #TODO: only if state or attribute has changed.

    const strokeStyle = this.config.show.horseshoe_style;

    if (strokeStyle === 'fixed') {
      this.stroke_color = this.config.horseshoe_state.color;
      this.color0 = this.config.horseshoe_state.color;
      this.color1 = this.config.horseshoe_state.color;
      this.color1_offset = '0%';
      //  We could set the circle attributes, but we do it with a variable as we are using a gradient
      //  to display the horseshoe circle  .. <horseshoe circle>.setAttribute('stroke', stroke);
    } else if (strokeStyle === 'autominmax') {
      // Use color0 and color1 for autoranging the color of the horseshoe
      const stroke = this._calculateStrokeColor(state, this.colorStopsMinMax, true);

      // We now use a gradient for the horseshoe, using two colors
      // Set these colors to the colorstop color...
      this.color0 = stroke;
      this.color1 = stroke;
      this.color1_offset = '0%';
    } else if (strokeStyle === 'colorstop' || strokeStyle === 'colorstopgradient') {
      const stroke = this._calculateStrokeColor(state, this.colorStops, strokeStyle === 'colorstopgradient');

      // We now use a gradient for the horseshoe, using two colors
      // Set these colors to the colorstop color...
      this.color0 = stroke;
      this.color1 = stroke;
      this.color1_offset = '0%';
    } else if (strokeStyle === 'lineargradient') {
      // This has taken a lot of time to get a satisfying result, and it appeared much simpler than anticipated.
      // I don't understand it, but for a circle, a gradient from left/right with adjusted stop is enough ?!?!?!
      // No calculations to adjust the angle of the gradient, or rotating the gradient itself.
      // Weird, but it works. Not a 100% match, but it is good enough for now...

      // According to stackoverflow, these calculations / adjustments would be needed, but it isn't ;-)
      // Added from https://stackoverflow.com/questions/9025678/how-to-get-a-rotated-linear-gradient-svg-for-use-as-a-background-image
      const angleCoords = {
        x1: '0%',
        y1: '0%',
        x2: '100%',
        y2: '0%',
      };
      this.color1_offset = `${Math.round((1 - val) * 100)}%`;

      this.angleCoords = angleCoords;
    }

    // Check for animations linked to an entity or attribute.
    // Set the dynamic animation depending on the state.
    // If the card is rendered, the render() functions will take this dynamic animation into account.
    //
    // #TODO: Determine animation only if specific state or attribute has changed...

    if (this.config.animations)
      Object.keys(this.config.animations).map((animation) => {
        const entityIndex = animation.substr(Number(animation.indexOf('.') + 1));
        this.config.animations[animation].map((item) => {
          // if animation state not equals sensor state, return... Nothing to animate for this state...
          if (this.entities[entityIndex].state.toLowerCase() !== item.state.toLowerCase()) return;

          if (item.vlines) {
            item.vlines.forEach((item2) => this._updateAnimationStyles('vlines', item2));
          }

          if (item.hlines) {
            item.hlines.forEach((item2) => this._updateAnimationStyles('hlines', item2));
          }

          if (item.circles) {
            item.circles.forEach((item2) => this._updateAnimationStyles('circles', item2));
          }
          // if (item.icons) {
          //   item.icons.map((item2) => {
          //     if (!this.animations.icons[item2.animation_id] || !item2.reuse) {
          //       this.animations.icons[item2.animation_id] = {};
          //       this.animations.iconsIcon[item2.animation_id] = {};
          //     }
          //     this.animations.icons[item2.animation_id] = Object.assign(this.animations.icons[item2.animation_id], ...item2.styles);
          //     this.animations.iconsIcon[item2.animation_id] = Templates.getJsTemplateOrValue(item2, item2.icon);
          //     return true;
          //   });
          // }
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
          // Fetch icon too besides the default styles section
          // if (item.icons) {
          //   item.icons.forEach((item2) => {
          //     const animationId = item2.animation_id;

          //     if (animationId === undefined || animationId === null) return;

          //     this._updateAnimationStyles('icons', item2);

          //     if (!this.animations.iconsIcon[animationId] || !item2.reuse) {
          //       this.animations.iconsIcon[animationId] = {};
          //     }

          //     this.animations.iconsIcon[animationId] = Templates.getJsTemplateOrValue(item2, item2.icon);
          //   });
          // }

          if (item.states) {
            item.states.forEach((item2) => this._updateAnimationStyles('states', item2));
          }

          // if (item.states) {
          //   item.states.map((item2) => {
          //     if (!this.animations.states[item2.animation_id] || !item2.reuse) this.animations.states[item2.animation_id] = {};
          //     this.animations.states[item2.animation_id] = Object.assign(this.animations.states[item2.animation_id], ...item2.styles);
          //     return true;
          //   });
          // }
          return true;
        });
        return true;
      });

    // For now, always force update to render the card if any of the states or attributes have changed...
    // if (entityHasChanged) { this.requestUpdate();}
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

        item._colorStops = item.color_stops;
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
    if (!config.horseshoe_scale) {
      throw Error('No horseshoe scale defined');
    } else {
      if ((!config.horseshoe_scale.min && !config.horseshoe_scale.min === 0) || !config.horseshoe_scale.max) {
        throw Error('No horseshoe min/max for scale defined');
      }
    }
    if (!config.color_stops || config.color_stops.length < 2) {
      throw Error('No color_stops defined or not at least two colorstops');
    }

    // testing
    if (config.entities) {
      const newdomain = this._computeDomain(config.entities[0].entity);
      if (newdomain !== 'sensor') {
        // If not a sensor, check if attribute is a number. If so, continue, otherwise Error...
        if (config.entities[0].attribute && !isNaN(config.entities[0].attribute)) {
          throw Error('First entity or attribute must be a numbered sensorvalue, but is NOT');
        }
      }
    }

    const newConfig = {
      texts: [],
      card_filter: 'card--filter-none',
      bar_mode: config.bar_mode || 'normal', // add bar_mode to config
      ...config,
      show: { ...DEFAULT_SHOW, ...config.show },
      horseshoe_scale: {
        ...DEFAULT_HORSESHOE_SCALE,
        ...config.horseshoe_scale,
      },
      horseshoe_state: {
        ...DEFAULT_HORSESHOE_STATE,
        ...config.horseshoe_state,
      },
    };

    // eslint-disable-next-line no-restricted-syntax
    for (var entityValue of newConfig.entities) {
      if (!entityValue.tap_action) {
        entityValue.tap_action = { ...DEFAULT_TAP_ACTION };
      }
    }

    let colorStops = {};
    //    colorStops[newConfig.horseshoe_scale.min] = newConfig.horseshoe_state.color || '#03a9f4';
    if (newConfig.color_stops) {
      Object.keys(newConfig.color_stops).forEach((key) => {
        colorStops[key] = newConfig.color_stops[key];
      });
    }

    const sortedStops = Object.keys(colorStops)
      .map((n) => Number(n))
      .sort((a, b) => a - b);
    this.colorStops = colorStops;
    this.sortedStops = sortedStops;

    // Create a colorStopsMinMax list for autominmax color determination
    let colorStopsMinMax = {};
    colorStopsMinMax[newConfig.horseshoe_scale.min] = colorStops[sortedStops[0]];
    colorStopsMinMax[newConfig.horseshoe_scale.max] = colorStops[sortedStops[sortedStops.length - 1]];

    this.colorStopsMinMax = colorStopsMinMax;

    // Now set the color0 and color1 for the gradient used in the horseshoe to the colors
    // Use default for now!!
    this.color0 = colorStops[sortedStops[0]];
    this.color1 = colorStops[sortedStops[sortedStops.length - 1]];

    const angleCoords = {
      x1: '0%',
      y1: '0%',
      x2: '100%',
      y2: '0%',
    };
    this.angleCoords = angleCoords;
    this.color1_offset = '0%';

    // console.log('Prepared color stops', newConfig);
    this._prepareItemColorStops(newConfig);
    this.config = newConfig;
    this.bar_mode = newConfig.bar_mode || 'normal';

    if (this.config.layout?.icons) {
      this.config.layout.icons.forEach((iconConfig, index) => {
        this.iconsId[index] = Math.random().toString(36).substr(2, 9);
      });
    }
  }

  _getItemEntityIndex(item = {}) {
    const entityIndex = Number(item.entity_index);
    return Number.isFinite(entityIndex) ? entityIndex : 0;
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
          <linearGradient gradientTransform="rotate(0)" id="horseshoe__gradient-${this.cardId}" x1="${this.angleCoords.x1}" y1="${this.angleCoords.y1}" x2="${this.angleCoords.x2}" y2="${this.angleCoords.y2}">
            <stop offset="${this.color1_offset}" stop-color="${this.color1}"></stop>
            <stop offset="100%" stop-color="${this.color0}"></stop>
          </linearGradient>
        </svg>
      </ha-card>
    `;
  }

  renderV1({ config } = this) {
    const configStyle = this._mergeStyles({}, { styles: this.config?.styles });
    const cardStyle = this._buildStyleString([configStyle]);

    return html`
      <ha-card @click=${(e) => this.handlePopup(e, this.entities[0])} style="${cardStyle}">
        <div class="container" id="container">${this._renderSvg()}</div>

        <svg style="width:0;height:0;position:absolute;" aria-hidden="true" focusable="false">
          <linearGradient gradientTransform="rotate(0)" id="horseshoe__gradient-${this.cardId}" x1="${this.angleCoords.x1}" y1="${this.angleCoords.y1}" x2="${this.angleCoords.x2}" y2="${this.angleCoords.y2}">
            <stop offset="${this.color1_offset}" stop-color="${this.color1}" />
            <stop offset="100%" stop-color="${this.color0}" />
          </linearGradient>
        </svg>
      </ha-card>
    `;
  }

  _buildStyleString(styles) {
    // console.log('Building style string for styles: ', styles);
    if (!styles) return '';

    return Object.entries(Object.assign({}, ...styles))
      .map(([key, value]) => `${key}: ${value}`)
      .join(' ');
  }

  /** *****************************************************************************
   * renderTickMarks()
   *
   * Summary.
   * Renders the tick marks on the scale.
   *
   */

  _renderTickMarks() {
    const { config } = this;
    if (!config) return;
    if (!config.show) return;
    if (!config.show.scale_tickmarks) return;

    const stroke = config.horseshoe_scale.color ? config.horseshoe_scale.color : 'var(--primary-background-color)';
    const tickSize = config.horseshoe_scale.ticksize ? config.horseshoe_scale.ticksize : (config.horseshoe_scale.max - config.horseshoe_scale.min) / 10;

    // fullScale is 260 degrees. Hard coded for now...
    const fullScale = 260;
    const remainder = config.horseshoe_scale.min % tickSize;
    const startTickValue = config.horseshoe_scale.min + (remainder === 0 ? 0 : tickSize - remainder);
    const startAngle = ((startTickValue - config.horseshoe_scale.min) / (config.horseshoe_scale.max - config.horseshoe_scale.min)) * fullScale;
    var tickSteps = (config.horseshoe_scale.max - startTickValue) / tickSize;

    // new
    var steps = Math.floor(tickSteps);
    const angleStepSize = (fullScale - startAngle) / tickSteps;

    // If steps exactly match the max. value/range, add extra step for that max value.
    if (Math.floor(steps * tickSize + startTickValue) <= config.horseshoe_scale.max) {
      // eslint-disable-next-line no-plusplus
      steps++;
    }

    const radius = config.horseshoe_scale.width ? config.horseshoe_scale.width / 2 : 6 / 2;
    var angle;
    var scaleItems = [];

    // NTS:
    // Value of -230 is weird. Should be -220. Can't find why...
    var i;
    for (i = 0; i < steps; i++) {
      angle = startAngle + ((-230 + (360 - i * angleStepSize)) * Math.PI) / 180;
      scaleItems[i] = svg`
          <circle cx="${50 + 50 - Math.sin(angle) * TICKMARKS_RADIUS_SIZE}"
                  cy="${50 + 50 - Math.cos(angle) * TICKMARKS_RADIUS_SIZE}" r="${radius}"
                  fill="${stroke}">
        `;
    }
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
            ${this._renderHorseShoe()}
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

  _renderHorseShoe() {
    if (!this.config.show.horseshoe) return;

    // Bidirectional: zero at top, positive CW, negative CCW
    const barMode = this.config.bar_mode || 'normal';
    if (barMode === 'bidirectional') {
      // The horseshoe arc is always 260deg, but we want zero at top (270deg)
      // So rotate -90deg (top center), and for negative values, use stroke-dashoffset to fill CCW
      if (this._bidirectional_negative) {
        // stroke-dashoffset = half the arc length (start at top, fill CCW)
        // But SVG circles always fill CW, so we use dashoffset to "reverse" the fill
        // The arc is 260deg, so half is 130deg, which is HORSESHOE_PATH_LENGTH/2
        // For negative, offset by half the arc
        return svg`
          <g id="horseshoe__svg__group" class="horseshoe__svg__group">
            <circle id="horseshoe__scale" class="horseshoe__scale" cx="50%" cy="50%" r="45%"
              fill="${this.config.fill || 'rgba(0, 0, 0, 0)'}"
              stroke="${this.config.horseshoe_scale.color || '#000000'}"
              stroke-dasharray="408.40704496667314,180"
              stroke-width="${this.config.horseshoe_scale.width || 6}" 
              stroke-linecap="round"
              transform="rotate(-220 100 100)"/>
            <circle id="horseshoe__state__value" class="horseshoe__state__value" cx="50%" cy="50%" r="45%"
              fill="${this.config.fill || 'rgba(0, 0, 0, 0)'}"
              stroke="url('#horseshoe__gradient-${this.cardId}')"
              stroke-dasharray="${this.dashArray}"
              stroke-dashoffset="${this.dashOffset}"
              stroke-width="${this.config.horseshoe_state.width || 12}" 
              stroke-linecap="round"
              transform="rotate(-90 100 100)"
              style="transition: all 2.5s ease-out;"/>
            ${this._renderTickMarks()}
          </g>
        `;
      } else {
        // stroke-dashoffset = 0 (start at top, fill CW)
        return svg`
          <g id="horseshoe__svg__group" class="horseshoe__svg__group">
            <circle id="horseshoe__scale" class="horseshoe__scale" cx="50%" cy="50%" r="45%"
              fill="${this.config.fill || 'rgba(0, 0, 0, 0)'}"
              stroke="${this.config.horseshoe_scale.color || '#000000'}"
              stroke-dasharray="408.40704496667314,180"
              stroke-width="${this.config.horseshoe_scale.width || 6}" 
              stroke-linecap="round"
              transform="rotate(-220 100 100)"/>
            <circle id="horseshoe__state__value" class="horseshoe__state__value" cx="50%" cy="50%" r="45%"
              fill="${this.config.fill || 'rgba(0, 0, 0, 0)'}"
              stroke="url('#horseshoe__gradient-${this.cardId}')"
              stroke-dasharray="${this.dashArray}"
              stroke-width="${this.config.horseshoe_state.width || 12}" 
              stroke-linecap="round"
              transform="rotate(-90 100 100)"
              style="transition: all 2.5s ease-out;"/>
            ${this._renderTickMarks()}
          </g>
        `;
      }
    }

    // Normal mode (default)
    return svg`
      <g id="horseshoe__svg__group" class="horseshoe__svg__group">
        <circle id="horseshoe__scale" class="horseshoe__scale" cx="50%" cy="50%" r="45%"
          fill="${this.config.fill || 'rgba(0, 0, 0, 0)'}"
          stroke="${this.config.horseshoe_scale.color || '#000000'}"
          stroke-dasharray="408.40704496667314,180"
          stroke-width="${this.config.horseshoe_scale.width || 6}" 
          stroke-linecap="round"
          transform="rotate(-220 100 100)"/>
        <circle id="horseshoe__state__value" class="horseshoe__state__value" cx="50%" cy="50%" r="45%"
          fill="${this.config.fill || 'rgba(0, 0, 0, 0)'}"
          stroke="url('#horseshoe__gradient-${this.cardId}')"
          stroke-dasharray="${this.dashArray}"
          stroke-width="${this.config.horseshoe_state.width || 12}" 
          stroke-linecap="round"
          transform="rotate(-220 100 100)"
          style="transition: all 2.5s ease-out;"/>
        ${this._renderTickMarks()}
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

      const name = this._buildName(this.entities[item.entity_index], this.config.entities[item.entity_index]);

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

  _renderEntityNamesV1() {
    const { layout } = this.config;

    if (!layout) return;
    if (!layout.names) return;

    const svgItems = layout.names.map((item) => {
      // compute some styling elements if configured for this name item
      const ENTITY_NAME_STYLES = {
        'font-size': '1.5em;',
        color: 'var(--primary-text-color);',
        opacity: '1.0;',
        'text-anchor': 'middle;',
      };

      // Get configuration styles as the default styles
      // Replace with merge function to allow JavaScript templating.
      let configStyle = this._mergeStyles(ENTITY_NAME_STYLES, item);

      // Get the runtime styles, caused by states & animation settings
      let stateStyle = {};
      if (this.animations.names[item.index]) stateStyle = Object.assign(stateStyle, this.animations.names[item.index]);

      const stopColor = this._getItemColorFromStops(item);
      if (stopColor) {
        stateStyle.fill = stopColor;
      }
      // Merge the two, where the runtime styles may overwrite the statically configured styles
      configStyle = { ...configStyle, ...stateStyle };

      // Convert javascript records to plain text, without "{}" and "," between the styles.
      const configStyleStr = JSON.stringify(configStyle).slice(1, -1).replace(/"/g, '').replace(/,/g, '');

      const name = this._buildName(this.entities[item.entity_index], this.config.entities[item.entity_index]);

      return svg`
      <text>
        <tspan class="entity__name" x="${item.xpos}%" y="${item.ypos}%" style="${configStyleStr}">${name}</tspan>
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

      const area = this._buildArea(this.entities[item.entity_index], this.config.entities[item.entity_index]);

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

  _renderEntityAreasV1() {
    const { layout } = this.config;

    if (!layout) return;
    if (!layout.areas) return;

    const svgItems = layout.areas.map((item) => {
      const AREA_STYLES = {
        'font-size': '1em;',
        color: 'var(--primary-text-color);',
        opacity: '1.0;',
        'text-anchor': 'middle;',
      };

      // Get configuration styles as the default styles
      let configStyle = this._mergeStyles(AREA_STYLES, item);

      // Get the runtime styles, caused by states & animation settings
      let stateStyle = {};
      if (this.animations.areas[item.index]) stateStyle = Object.assign(stateStyle, this.animations.areas[item.index]);

      const stopColor = this._getItemColorFromStops(item);
      if (stopColor) {
        stateStyle.fill = stopColor;
      }

      // Merge the two, where the runtime styles may overwrite the statically configured styles
      configStyle = { ...configStyle, ...stateStyle };

      // Convert javascript records to plain text, without "{}" and "," between the styles.
      const configStyleStr = JSON.stringify(configStyle).slice(1, -1).replace(/"/g, '').replace(/,/g, '');

      const area = this._buildArea(this.entities[item.entity_index], this.config.entities[item.entity_index]);

      return svg`
      <text class="entity__area">
        <tspan class="entity__area" x="${item.xpos}%" y="${item.ypos}%" style="${configStyleStr}">${area}</tspan>
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
    const uom = this._buildUom(this.entities[entityIndex], this.config.entities[entityIndex]);

    const state = this.config.entities[entityIndex].attribute && this.entities[entityIndex].attributes[this.config.entities[entityIndex].attribute] ? this.attributesStr[entityIndex] : this.entitiesStr[entityIndex];

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

  _renderStateV2(item) {
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

    // Config styles.
    const resolvedStyles = Templates.getJsTemplateOrValue(item, item.styles);
    const itemStyleDict = ConfigHelper.toStyleDict(resolvedStyles);

    // Runtime animation styles. Animation styles win later.
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

    // Get font-size of state in configStyle.
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

    const uomStyle = {
      ...configStyle,
      ...UOM_STYLES,
      ...fsuomStyle,
    };

    const uom = this._buildUom(this.entities[entityIndex], this.config.entities[entityIndex]);

    const state = this.config.entities[entityIndex].attribute && this.entities[entityIndex].attributes[this.config.entities[entityIndex].attribute] ? this.attributesStr[entityIndex] : this.entitiesStr[entityIndex];

    return svg`
    <text @click=${(e) => this.handlePopup(e, this.entities[entityIndex])}>
      <tspan
        class="state__value"
        x="${x}%"
        y="${y}%"
        dx="${dx}em"
        dy="${dy}em"
        style=${styleMap(configStyle)}
      >
        ${state}
      </tspan>
      <tspan
        class="state__uom"
        dx="-0.1em"
        dy="-0.45em"
        style=${styleMap(uomStyle)}
      >
        ${uom}
      </tspan>
    </text>
  `;
  }

  _renderStateV1(item) {
    if (!item) return;

    // compute x,y or dx,dy positions. Spec none if not specified.
    const x = item.xpos ? item.xpos : '';
    const y = item.ypos ? item.ypos : '';
    const dx = item.dx ? item.dx : '0';
    const dy = item.dy ? item.dy : '0';

    // compute some styling elements if configured for this state item
    const STATE_STYLES = {
      'font-size': '1em;',
      color: 'var(--primary-text-color);',
      opacity: '1.0;',
      'text-anchor': 'middle;',
    };

    const UOM_STYLES = {
      opacity: '0.7;',
    };

    // Get configuration styles as the default styles
    let configStyle = this._mergeStyles(STATE_STYLES, item);

    // Get the runtime styles, caused by states & animation settings
    let stateStyle = {};
    console.log('Animations for states', this.animations.states, item?.index);
    if (this.animations.states[item.index]) stateStyle = Object.assign(stateStyle, this.animations.states[item.index]);

    const stopColor = this._getItemColorFromStops(item);
    if (stopColor) {
      stateStyle.fill = stopColor;
    }

    // Merge the two, where the runtime styles may overwrite the statically configured styles
    configStyle = { ...configStyle, ...stateStyle };

    // Convert javascript records to plain text, without "{}" and "," between the styles.
    const configStyleStr = JSON.stringify(configStyle).slice(1, -1).replace(/"/g, '').replace(/,/g, '');

    // Get font-size of state in configStyle.
    // Split value and px/em; See: https://stackoverflow.com/questions/3370263/separate-integers-and-text-in-a-string
    // For floats and strings:
    //  - https://stackoverflow.com/questions/17374893/how-to-extract-floating-numbers-from-strings-in-javascript

    // 2019.09.12
    // https://stackoverflow.com/questions/40758143/regular-expression-to-split-double-and-integer-numbers-in-a-string
    // https://regex101.com/r/QYfDtB/1
    // regex \D+|\d*\.?\d+ (met /g van global matches) zou het wel  moeten doen. Deze haalt goed de 1.27em; uit elkaar
    // in twee stukken, dus 1.27 en em;

    var fsuomStr = configStyle['font-size'];

    var fsuomValue = 0.5;
    var fsuomType = 'em;';
    const fsuomSplit = fsuomStr.match(/\D+|\d*\.?\d+/g);
    if (fsuomSplit.length === 2) {
      fsuomValue = Number(fsuomSplit[0]) * 0.6;
      fsuomType = fsuomSplit[1];
    } else console.error('Cannot determine font-size for state', fsuomStr);

    fsuomStr = { 'font-size': fsuomValue + fsuomType };

    let uomStyle = { ...configStyle, ...UOM_STYLES, ...fsuomStr };
    const uomStyleStr = JSON.stringify(uomStyle).slice(1, -1).replace(/"/g, '').replace(/,/g, '');

    const uom = this._buildUom(this.entities[item.entity_index], this.config.entities[item.entity_index]);

    const state =
      this.config.entities[item.entity_index].attribute && this.entities[item.entity_index].attributes[this.config.entities[item.entity_index].attribute]
        ? this.attributesStr[item.entity_index]
        : this.entitiesStr[item.entity_index];

    if (this._computeDomain(this.entities[item.entity_index].entity_id) === 'sensor') {
      return svg`
      <text @click=${(e) => this.handlePopup(e, this.entities[item.entity_index])}>
        <tspan class="state__value" x="${x}%" y="${y}%" dx="${dx}em" dy="${dy}em" 
        style="${configStyleStr}">
        ${state}</tspan>
        <tspan class="state__uom" dx="-0.1em" dy="-0.45em"
        style="${uomStyleStr}">
        ${uom}</tspan>
      </text>
      `;
    } else {
      // Not a sensor. Might be any other domain. Unit can only be specified using the units: in the configuration.
      // Still check for using an attribute value for the domain...
      return svg`
      <text @click=${(e) => this.handlePopup(e, this.entities[item.entity_index])}>
        <tspan class="state__value" x="${x}%" y="${y}%" dx="${dx}em" dy="${dy}em" 
        style="${configStyleStr}">
        ${state}</tspan>
        <tspan class="state__uom" dx="-0.1em" dy="-0.45em"
        style="${uomStyleStr}">
        ${uom}</tspan>
      </text>
      `;
    }
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

    // let configStyle = this._mergeStyles({}, item);

    // let stateStyle = {};
    // if (this.animations.icons[item.animation_id]) stateStyle = Object.assign(stateStyle, this.animations.icons[item.animation_id]);

    // const stopColor = this._getItemColorFromStops(item);
    // if (stopColor) {
    //   configStyle.fill = stopColor;
    // }

    // // Merge the two, where the runtime styles may overwrite the statically configured styles
    // configStyle = { ...configStyle, ...stateStyle };

    // const configStyleStr = JSON.stringify(configStyle).slice(1, -1).replace(/"/g, '').replace(/,/g, '');

    // const icon = this._buildIcon(this.entities[item.entity_index], this.config.entities[item.entity_index], this.animations.iconsIcon[item.animation_id]);
    const entityIndex = item.entity_index ?? 0;

    // Config styles van het icon zelf.
    const resolvedStyles = Templates.getJsTemplateOrValue(item, item.styles);
    let configStyle = ConfigHelper.toStyleDict(resolvedStyles);

    // Runtime animation styles.
    const stateStyle = this.animations?.icons?.[item.animation_id] ?? {};

    // Stop color hoort vóór de animation merge,
    // zodat animation styles uiteindelijk mogen winnen.
    const stopColor = this._getItemColorFromStops(item);
    if (stopColor) {
      configStyle.fill = stopColor;
    }

    // Runtime animation styles overwrite static/config styles.
    configStyle = {
      ...configStyle,
      ...stateStyle,
    };

    const icon = this._buildIcon(this.entities[entityIndex], this.config.entities[entityIndex], this.animations?.iconsIcon?.[item.animation_id]);

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
          this._card?.updateComplete && typeof this.updateComplete.then === 'function'
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

  _renderHorizontalLinesV1() {
    const { layout } = this.config;

    if (!layout) return;
    if (!layout.hlines) return;

    // compute some styling elements if configured for this state item
    const HLINES_STYLES = {
      'stroke-linecap': 'round;',
      stroke: 'var(--primary-text-color);',
      opacity: '1.0;',
      'stroke-width': '2;',
    };

    const svgItems = layout.hlines.map((item) => {
      let configStyle = this._mergeStyles(HLINES_STYLES, item);

      // Get the runtime styles, caused by states & animation settings
      let stateStyle = {};
      if (this.animations.hlines[item.animation_id]) stateStyle = Object.assign(stateStyle, this.animations.hlines[item.animation_id]);

      const stopColor = this._getItemColorFromStops(item);
      if (stopColor) {
        stateStyle.fill = stopColor;
      }

      // Merge the two, where the runtime styles may overwrite the statically configured styles
      configStyle = { ...configStyle, ...stateStyle };

      // Convert javascript records to plain text, without "{}" and "," between the styles.
      const configStyleStr = JSON.stringify(configStyle).slice(1, -1).replace(/"/g, '').replace(/,/g, '');

      item.entity_index = item.entity_index ? item.entity_index : 0;

      return svg`
          <line @click=${(e) => this.handlePopup(e, this.entities[item.entity_index])}
           class="line__horizontal" x1="${item.xpos - item.length / 2}%" y1="${item.ypos}%" x2="${item.xpos + item.length / 2}%" y2="${item.ypos}%" style="${configStyleStr}"/>
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

  _renderVerticalLinesV1() {
    const { layout } = this.config;

    if (!layout) return;
    if (!layout.vlines) return;

    const VLINES_STYLES = {
      'stroke-linecap': 'round;',
      stroke: 'var(--primary-text-color);',
      opacity: '1.0;',
      'stroke-width': '2;',
    };

    const svgItems = layout.vlines.map((item) => {
      // Get configuration styles as the default styles
      // let configStyle = { ...VLINES_STYLES };
      // configStyle = Object.assign(configStyle, ...item.styles);
      let configStyle = this._mergeStyles(VLINES_STYLES, item);

      // Get the runtime styles, caused by states & animation settings
      let stateStyle = {};
      if (this.animations.vlines[item.animation_id]) stateStyle = Object.assign(stateStyle, this.animations.vlines[item.animation_id]);

      const stopColor = this._getItemColorFromStops(item);
      if (stopColor) {
        stateStyle.fill = stopColor;
      }

      // Merge the two, where the runtime styles may overwrite the statically configured styles
      configStyle = { ...configStyle, ...stateStyle };

      // Convert javascript records to plain text, without "{}" and "," between the styles.
      const configStyleStr = JSON.stringify(configStyle).slice(1, -1).replace(/"/g, '').replace(/,/g, '');

      item.entity_index = item.entity_index ? item.entity_index : 0;

      return svg`
          <line @click=${(e) => this.handlePopup(e, this.entities[item.entity_index])} 
           class="line__vertical" x1="${item.xpos}%" y1="${item.ypos - item.length / 2}%" x2="${item.xpos}%" y2="${item.ypos + item.length / 2}%" style="${configStyleStr}"/>
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

  _renderCirclesV1() {
    const { layout } = this.config;

    if (!layout) return;
    if (!layout.circles) return;

    const svgItems = layout.circles.map((item) => {
      // Get configuration styles as the default styles
      // let configStyle = {};
      // if (item.styles) configStyle = Object.assign(configStyle, ...item.styles);
      let configStyle = this._mergeStyles({}, item);

      // Get the runtime styles, caused by states & animation settings
      let stateStyle = {};
      if (this.animations.circles[item.animation_id]) stateStyle = Object.assign(stateStyle, this.animations.circles[item.animation_id]);

      const stopColor = this._getItemColorFromStops(item);
      if (stopColor) {
        stateStyle.fill = stopColor;
      }

      // Merge the two, where the runtime styles may overwrite the statically configured styles
      configStyle = { ...configStyle, ...stateStyle };

      // Convert javascript records to plain text, without "{}" and "," between the styles.
      const configStyleStr = JSON.stringify(configStyle).slice(1, -1).replace(/"/g, '').replace(/,/g, '');

      item.entity_index = item.entity_index ? item.entity_index : 0;

      return svg`
        <circle class="svg__dot" @click=${(e) => this.handlePopup(e, this.entities[item.entity_index])}
        cx="${item.xpos}%" cy="${item.ypos}%" r="${item.radius}"
        style="${configStyleStr}"/>          
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

    this._handleClick(this, this._hass, this.config, this.config.entities[this.config.entities.findIndex((element, index, array) => element.entity === entity.entity_id)].tap_action, entity.entity_id);
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
    return entityConfig.name || entityState.attributes.friendly_name;
  }

  /** *****************************************************************************
   * _buildIcon()
   *
   * Summary.
   * Builds the Icon specification name.
   *
   */
  _buildIcon(entityState, entityConfig, entityAnimation) {
    return entityAnimation || entityConfig.icon || entityState.attributes.icon;
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
   * _buildState()
   *
   * Summary.
   * Builds the State string.
   *  If state is not a number, the state is returned AS IS, otherwise the state
   * is build according to the specified number of decimals.
   *
   */

  _buildState(inState, entityConfig) {
    if (isNaN(inState)) return inState;

    const state = Number(inState);

    if (entityConfig.decimals === undefined || Number.isNaN(entityConfig.decimals) || Number.isNaN(state)) return Math.round(state * 100) / 100;

    const x = 10 ** entityConfig.decimals;
    return (Math.round(state * x) / x).toFixed(entityConfig.decimals);
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

  _calculateStrokeColor(state, stops, gradient) {
    const sortedStops = Object.keys(stops)
      .map((n) => Number(n))
      .sort((a, b) => a - b);
    let start;
    let end;
    let val;
    const l = sortedStops.length;
    if (state <= sortedStops[0]) {
      return stops[sortedStops[0]];
    } else if (state >= sortedStops[l - 1]) {
      return stops[sortedStops[l - 1]];
    } else {
      for (let i = 0; i < l - 1; i++) {
        const s1 = sortedStops[i];
        const s2 = sortedStops[i + 1];
        if (state >= s1 && state < s2) {
          [start, end] = [stops[s1], stops[s2]];
          if (!gradient) {
            return start;
          }
          val = this._calculateValueBetween(s1, s2, state);
          break;
        }
      }
    }
    return this._getGradientValue(start, end, val);
  }

  /** *****************************************************************************
   * _calculateValueBetween()
   *
   * Summary.
   *  Clips the val value between start and end, and returns the between value ;-)
   *
   */

  _calculateValueBetween(start, end, val) {
    return (Math.min(Math.max(val, start), end) - start) / (end - start);
  }

  _getLovelacePanel() {
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
   * _getColorVariable()
   *
   * Summary.
   *  Get value of CSS color variable, specified as var(--color-value)
   * These variables are defined in the lovelace element so it appears...
   *
   */

  _getColorVariable(inColor) {
    const newColor = inColor.substr(4, inColor.length - 5);

    if (!this.lovelace) {
      this.lovelace = this._getLovelacePanel();
      // const root = document.querySelector('home-assistant');
      // const main = root.shadowRoot.querySelector('home-assistant-main');
      // const drawer_layout = main.shadowRoot.querySelector('app-drawer-layout');
      // const pages = drawer_layout.querySelector('partial-panel-resolver');
      // this.lovelace = pages.querySelector('ha-panel-lovelace');
    } else {
    }

    const returnColor = window.getComputedStyle(this.lovelace).getPropertyValue(newColor);
    return returnColor;
  }

  /** *****************************************************************************
   * _getGradientValue()
   *
   * Summary.
   *  Get gradient value of color as a result of a color_stop.
   * An RGBA value is calculated, so transparancy is possible...
   *
   * The colors (colorA and colorB) can be specified as:
   *  - a css variable, var(--color-value)
   *  - a hex value, #fff or #ffffff
   *  -  an rgb() or rgba() value
   *  - a hsl() or hsla() value
   *  - a named css color value, such as white.
   *
   */

  _getGradientValue(colorA, colorB, val) {
    const resultColorA = this._colorToRGBA(colorA);
    const resultColorB = this._colorToRGBA(colorB);

    // We have a rgba() color array from cache or canvas.
    // Calculate color in between, and return #hex value as a result.
    //

    const v1 = 1 - val;
    const v2 = val;
    const rDec = Math.floor(resultColorA[0] * v1 + resultColorB[0] * v2);
    const gDec = Math.floor(resultColorA[1] * v1 + resultColorB[1] * v2);
    const bDec = Math.floor(resultColorA[2] * v1 + resultColorB[2] * v2);
    const aDec = Math.floor(resultColorA[3] * v1 + resultColorB[3] * v2);

    // And convert full RRGGBBAA value to #hex.
    const rHex = this._padZero(rDec.toString(16));
    const gHex = this._padZero(gDec.toString(16));
    const bHex = this._padZero(bDec.toString(16));
    const aHex = this._padZero(aDec.toString(16));
    return `#${rHex}${gHex}${bHex}${aHex}`;
  }

  _padZero(val) {
    if (val.length < 2) {
      val = `0${val}`;
    }
    return val.substr(0, 2);
  }

  _computeDomain(entityId) {
    return entityId.substr(0, entityId.indexOf('.'));
  }

  _computeEntity(entityId) {
    return entityId.substr(entityId.indexOf('.') + 1);
  }

  /** *****************************************************************************
   * _colorToRGBA()
   *
   * Summary.
   *  Get RGBA color value of inColor.
   *
   * The inColor can be specified as:
   *  - a css variable, var(--color-value)
   *  - a hex value, #fff or #ffffff
   *  -  an rgb() or rgba() value
   *  - a hsl() or hsla() value
   *  - a named css color value, such as white.
   *
   */

  _colorToRGBA(inColor) {
    // return color if found in colorCache...
    if (inColor in this.colorCache) {
      return this.colorCache[inColor];
    }

    var theColor = inColor;
    // Check for 'var' colors
    let a0 = inColor.substr(0, 3);
    if (a0.valueOf() === 'var') {
      theColor = this._getColorVariable(inColor);
    }

    // Get color from canvas. This always returns an rgba() value...
    var canvas = window.document.createElement('canvas');
    canvas.width = canvas.height = 1;
    var ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = theColor;
    ctx.fillRect(0, 0, 1, 1);
    const outColor = [...ctx.getImageData(0, 0, 1, 1).data];

    this.colorCache[inColor] = outColor;
    return outColor;
  }

  getCardSize() {
    return 4;
  }

  /** *****************************************************************************
   * Returns the state value that should be used for JavaScript templates.
   *
   * If the configured entity uses an attribute, that attribute value is returned.
   * Otherwise the normal entity state is returned.
   *
   * This allows templates to simply use `state`, regardless of whether the card
   * displays the entity state itself or one of its attributes.
   */
  _getTemplateState(item = {}) {
    const entityIndex = this._getItemEntityIndex(item);
    const entityState = this.entities?.[entityIndex];
    const entityConfig = this.config?.entities?.[entityIndex] || {};

    // Entity may not be available yet during initial render or reload.
    if (!entityState) return undefined;

    const attribute = entityConfig.attribute;

    // If an attribute is configured and available, use that as template state.
    // The explicit !== undefined check keeps valid values like 0, false and ''
    // from being ignored.
    if (attribute && entityState.attributes && entityState.attributes[attribute] !== undefined) {
      return entityState.attributes[attribute];
    }

    // Fallback to the regular Home Assistant entity state.
    return entityState.state;
  }

  /** *****************************************************************************
   * Evaluates a JavaScript template.
   *
   * Templates are written in YAML between [[[ and ]]], for example:
   *
   *   fill: '[[[ return Number(state) > 50 ? "red;" : "green;"; ]]]'
   *
   * The template receives a limited set of useful runtime values:
   *
   * - state          The current state value for this item
   * - states         The full hass.states object
   * - entity         The current Home Assistant entity object
   * - user           The currently logged-in Home Assistant user
   * - hass           The full Home Assistant hass object
   * - tool_config    The current item configuration from YAML
   * - entity_config  The matching entity configuration from config.entities
   * - states_str     Cached rendered state strings
   * - attributes_str Cached rendered attribute strings
   *
   * The template must return the value that should be used.
   */
  _evaluateJsTemplate(item, jsTemplate) {
    const entityIndex = this._getItemEntityIndex(item);
    const state = this._getTemplateState(item);
    const entity = this.entities?.[entityIndex];
    const entityConfig = this.config?.entities?.[entityIndex];

    try {
      // JavaScript templates are intentionally evaluated at runtime.
      // Users are expected to control their own dashboard configuration.
      // eslint-disable-next-line no-new-func
      return new Function('state', 'states', 'entity', 'user', 'hass', 'tool_config', 'entity_config', 'states_str', 'attributes_str', `"use strict";\n${jsTemplate}`).call(
        this,
        state,
        this._hass?.states || {},
        entity,
        this._hass?.user,
        this._hass,
        item,
        entityConfig,
        this.entitiesStr,
        this.attributesStr,
      );
    } catch (e) {
      // Rename the error so template issues are easier to recognize
      // in the browser console.
      e.name = 'FlexHorseshoeCard-evaluateJsTemplate-Error';

      console.error('Error evaluating JS template', {
        item,
        jsTemplate,
        error: e,
      });

      throw e;
    }
  }

  /** *****************************************************************************
   * Resolves a value that may contain JavaScript templates.
   *
   * This function is recursive:
   *
   * - primitive values are returned as-is
   * - arrays are resolved item by item
   * - objects are resolved property by property
   * - strings surrounded by [[[ and ]]] are evaluated as JavaScript templates
   * - normal strings are returned unchanged
   *
   * This makes it usable for complete style arrays such as:
   *
   * styles:
   *   - fill: '[[[ return Number(state) > 50 ? "red;" : "green;"; ]]]'
   *   - opacity: 0.5;
   */
  _getJsTemplateOrValue(item, value) {
    // Keep undefined and null unchanged.
    if (value === undefined || value === null) return value;

    // Primitive non-string values cannot contain templates.
    if (['number', 'boolean', 'bigint', 'symbol'].includes(typeof value)) {
      return value;
    }

    // Resolve every item in an array.
    // This is used heavily by YAML styles arrays.
    if (Array.isArray(value)) {
      return value.map((entry) => this._getJsTemplateOrValue(item, entry));
    }

    // Resolve every value in an object without mutating the original config.
    if (typeof value === 'object') {
      return Object.fromEntries(Object.entries(value).map(([key, entryValue]) => [key, this._getJsTemplateOrValue(item, entryValue)]));
    }

    // At this point only strings can contain template syntax.
    if (typeof value !== 'string') return value;

    const trimmedValue = value.trim();

    // JavaScript templates must occupy the full string and be wrapped in:
    // [[[ ... ]]]
    if (trimmedValue.startsWith('[[[') && trimmedValue.endsWith(']]]')) {
      return this._evaluateJsTemplate(item, trimmedValue.slice(3, -3).trim());
    }

    // Plain string, no template.
    return value;
  }

  /** *****************************************************************************
   * Merges configured styles into a single style object.
   *
   * baseStyle contains default styles from the card code.
   * item.styles contains YAML styles from the configuration.
   *
   * JavaScript templates inside item.styles are resolved before merging.
   *
   * Example YAML:
   *
   * styles:
   *   - font-size: 3em;
   *   - fill: '[[[ return Number(state) > 50 ? "red;" : "green;"; ]]]'
   *
   * Result:
   *
   * {
   *   "font-size": "3em;",
   *   "fill": "red;"
   * }
   */
  _mergeStyles(baseStyle = {}, item = {}) {
    // No configured styles, return a copy of the defaults.
    if (!item.styles) {
      return { ...baseStyle };
    }

    // Resolve possible JavaScript templates before merging the styles.
    const resolvedStyles = this._getJsTemplateOrValue(item, item.styles);

    // Existing YAML style format:
    //
    // styles:
    //   - fill: white;
    //   - opacity: 0.5;
    //
    // This becomes an array of objects and is merged into one object.
    if (Array.isArray(resolvedStyles)) {
      return Object.assign({}, baseStyle, ...resolvedStyles.filter((style) => style && typeof style === 'object'));
    }

    // Also support an already merged style object.
    if (resolvedStyles && typeof resolvedStyles === 'object') {
      return {
        ...baseStyle,
        ...resolvedStyles,
      };
    }

    // Unsupported style format. Keep defaults.
    return { ...baseStyle };
  }

  /** *****************************************************************************
   * Converts a style object into an inline CSS string.
   *
   * Example input:
   *
   * {
   *   fill: "red;",
   *   opacity: "0.5;"
   * }
   *
   * Example output:
   *
   * "fill: red; opacity: 0.5;"
   */
  _styleToString(style = {}) {
    return Object.entries(style)
      .filter(([, value]) => value !== undefined && value !== null)
      .map(([key, value]) => `${key}: ${String(value).trim()}`)
      .join(' ');
  }
}

if (!customElements.get('flex-horseshoe-card')) {
  customElements.define('flex-horseshoe-card', FlexHorseshoeCard);
}
