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
import ConfigHelper from './config-helper.js';
import Templates from './templates.js';
import ColorStops from './color-stops.js';
import { computeDomain } from './frontend_mods/common/entity/compute_domain.ts';
import { hs2rgb, rgb2hex, rgb2hsv, hsv2rgb } from './frontend_mods/common/color/convert-color.ts';
import { rgbw2rgb, rgbww2rgb, temperature2rgb } from './frontend_mods/common/color/convert-light-color.ts';
import { computeStateDomain } from './frontend_mods/common/entity/compute_state_domain.ts';
import Colors from './colors.js';
import Utils from './utils.js';
import Merge from './merge.js';
import { SVG_VIEW_BOX, SVG_DEFAULT_DIMENSIONS } from './const.js';
import HorseshoeGauge from './horseshoe-gauge.js';
import RectangleTool from './rectangle-tool.js';
import LineTool from './line-tool.js';
import CircleTool from './circle-tool.js';
import NameTool from './name-tool.js';
import AreaTool from './area-tool.js';
import StateTool from './state-tool.js';
import IconTool from './icon-tool.js';
import GroupManager from './group-manager.js';
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
    this.animations.lines = {};
    this.animations.vlines = {};
    this.animations.hlines = {};
    this.animations.circles = {};
    this.animations.rectangles = {};
    this.animations.icons = {};
    this.animations.iconsIcon = {};
    this.animations.names = {};
    this.animations.areas = {};
    this.animations.states = {};
    this.rectangleTools = [];
    this.lineTools = [];
    this.circleTools = [];
    this.nameTools = [];
    this.areaTools = [];
    this.stateTools = [];
    this.iconTools = [];
    this.groupManager = undefined;
    this.resolvedEntityConfigs = [];
    this.colorCache = {};
    this.isAndroid = false;
    this.isSafari = false;
    this.iOS = false;

    this.resolvedVariables = {};
    this.iconCache = {};
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

      .icon-svg-url.hidden {
        display: none;
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

  _setToolEntityState(tool) {
    const entityIndex = tool.entity_index;

    if (entityIndex === undefined || entityIndex === null) {
      tool.setState(undefined, undefined);
      return tool;
    }

    const entityConfig = this.resolvedEntityConfigs[entityIndex];
    const entity = this.entities[entityIndex];

    if (!entity || !entityConfig) {
      return tool;
    }

    tool.setState(entity, entityConfig);

    return tool;
  }

  /** **************************************************************************************
   * hass()
   *
   * Summary.
   *  Updates hass data for the card
   *
   */

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
      this.horseshoeGauges?.forEach((horseshoe) => horseshoe.clearPathItemCache());
    }

    this.resolvedEntityConfigs = this._resolveEntityConfigs(this.config);

    this.resolvedEntityConfigs.forEach((entityConfig, index) => {
      const entity = hass.states[entityConfig.entity];

      if (!entity) {
        return;
      }

      this.entities[index] = entity;

      const newStateStr = StateTool.buildState(entity.state, entityConfig, this._hass, entity);

      // testing
      const stateObj = entity;
      const domain = computeStateDomain(stateObj);

      if (newStateStr !== this.entitiesStr[index]) {
        this.entitiesStr[index] = newStateStr;
        entityHasChanged = true;
      }

      // eslint-disable-next-line prefer-object-has-own
      if (entityConfig.attribute && Object.prototype.hasOwnProperty.call(entity.attributes, entityConfig.attribute)) {
        const newAttributeStr = StateTool.buildState(entity.attributes[entityConfig.attribute], entityConfig, this._hass, entity);

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

    this.horseshoeGauges = this.horseshoeGauges.map((horseshoe) => this._setToolEntityState(horseshoe));

    this.rectangleTools = (this.rectangleTools ?? []).map((rectangleTool) => this._setToolEntityState(rectangleTool));

    this.lineTools = (this.lineTools ?? []).map((lineTool) => this._setToolEntityState(lineTool));

    this.circleTools = (this.circleTools ?? []).map((circleTool) => this._setToolEntityState(circleTool));

    this.nameTools = (this.nameTools ?? []).map((nameTool) => this._setToolEntityState(nameTool));

    this.areaTools = (this.areaTools ?? []).map((areaTool) => this._setToolEntityState(areaTool));

    this.stateTools = (this.stateTools ?? []).map((stateTool) => this._setToolEntityState(stateTool));

    this.iconTools = (this.iconTools ?? []).map((iconTool) => this._setToolEntityState(iconTool));

    if (this.config.animations) {
      Object.keys(this.config.animations).map((animation) => {
        const entityIndex = animation.substr(Number(animation.indexOf('.') + 1));

        this.config.animations[animation].map((item) => {
          if (this.entities[entityIndex].state.toLowerCase() !== item.state.toLowerCase()) {
            return false;
          }

          if (item.lines) {
            item.lines.forEach((item2) => this._updateAnimationStyles('lines', item2));
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

          if (item.rectangles) {
            item.rectangles.forEach((item2) => this._updateAnimationStyles('rectangles', item2));
          }

          if (item.names) {
            item.names.forEach((item2) => this._updateAnimationStyles('names', item2));
          }

          if (item.areas) {
            item.areas.forEach((item2) => this._updateAnimationStyles('areas', item2));
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
    const layoutSections = ['states', 'names', 'areas', 'circles', 'rectangles', 'lines', 'hlines', 'vlines', 'icons', 'horseshoes', 'horseshoes_v2'];

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
    return this.groupManager.calculateSvgCoordinatesInGroup(item);
  }

  _computeGroupDimensions(config) {
    const groups = this.groupManager.groups;

    Object.keys(groups).forEach((groupName) => {
      groups[groupName] = this.groupManager.getGroup(groupName);
    });

    config.layout.groups = groups;
  }

  _computeSvgDimensions(config) {
    const layout = config.layout;

    if (layout?.icons) {
      layout.icons.forEach((item) => {
        item.svg = this._calculateSvgCoordinatesInGroup(item);
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

  _isStaticNumber(value) {
    return typeof value === 'number' && Number.isFinite(value);
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

  _resolveSectionSameAs(config) {
    const layoutSections = ['horseshoes', 'horseshoes_v2', 'states', 'names', 'areas', 'circles', 'rectangles', 'lines', 'hlines', 'vlines', 'icons'];

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
    const layoutSections = ['horseshoes', 'horseshoes_v2', 'states', 'names', 'areas', 'circles', 'rectangles', 'lines', 'hlines', 'vlines', 'icons'];

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
        this.palettesLoaded = false;
        Palette.loadAll(config?.palettes).then((palettes) => {
          this.palettes = palettes;
          const mode = this.hass?.themes?.darkMode ? 'dark' : 'light';
          Colors.setElement(this);
          Palette.applyAll(this, palettes, mode);
          Colors.colorCache = {};
          this.palettesLoaded = true;
          this.horseshoeGauges?.forEach((horseshoe) => horseshoe.clearPathItemCache());
          this.setHass(this._hass, true);
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

      this.config = newConfig;
      this.groupManager = new GroupManager(this.config.layout?.groups);
      this.horseshoeGauges = HorseshoeGauge.setConfig(config, Templates, this.cardId, this);

      this._prepareItemColorStops(newConfig);

      this.bar_mode = newConfig.bar_mode || 'normal';

      // Get aspectratio. This can be defined at card level or layout level
      this.aspectratio = (this.config.layout.aspectratio || this.config.aspectratio || '1/1').trim();

      const ar = this.aspectratio.split('/');
      if (!this.viewBox) this.viewBox = {};
      this.viewBox.width = ar[0] * SVG_DEFAULT_DIMENSIONS;
      this.viewBox.height = ar[1] * SVG_DEFAULT_DIMENSIONS;

      this._computeGroupDimensions(this.config);
      this._computeSvgDimensions(this.config);
      this.rectangleTools = RectangleTool.setConfig(this.config, Templates, this.cardId, this);
      this.lineTools = LineTool.setConfig(this.config, Templates, this.cardId, this);
      this.circleTools = CircleTool.setConfig(this.config, Templates, this.cardId, this);
      this.nameTools = NameTool.setConfig(this.config, Templates, this.cardId, this);
      this.areaTools = AreaTool.setConfig(this.config, Templates, this.cardId, this);
      this.stateTools = StateTool.setConfig(this.config, Templates, this.cardId, this);
      this.iconTools = IconTool.setConfig(this.config, Templates, this.cardId, this);

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
    const entityIndex = item.entity_index;

    if (entityIndex === undefined || entityIndex === null) return undefined;

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

      </ha-card>
    `;
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
  /** *****************************************************************************
   * _renderSvgDefs()
   *
   * Summary.
   * Renders reusable SVG definitions for filters and other shared drawing helpers.
   */
  _renderSvgDefs() {
    return svg`
      <defs>
        <filter id="fhs-inset-1" x="-50%" y="-50%" width="400%" height="400%">
          <feComponentTransfer in="SourceAlpha">
            <feFuncA type="table" tableValues="1 0"></feFuncA>
          </feComponentTransfer>
          <feGaussianBlur stdDeviation="1"></feGaussianBlur>
          <feOffset dx="0" dy="1" result="offsetblur"></feOffset>
          <feFlood flood-color="rgba(0, 0, 0, 0.3)" result="color"></feFlood>
          <feComposite in2="offsetblur" operator="in"></feComposite>
          <feComposite in2="SourceAlpha" operator="in"></feComposite>
          <feMerge>
            <feMergeNode in="SourceGraphic"></feMergeNode>
            <feMergeNode></feMergeNode>
          </feMerge>
        </filter>

        <filter id="fhs-inset-2">
          <feOffset dx="1" dy="1"></feOffset>
          <feGaussianBlur stdDeviation="0.5" result="offset-blur"></feGaussianBlur>
          <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse"></feComposite>
          <feFlood flood-color="black" flood-opacity="0.4" result="color"></feFlood>
          <feComposite operator="in" in="color" in2="inverse" result="shadow"></feComposite>
          <feComposite operator="over" in="shadow" in2="SourceGraphic"></feComposite>
        </filter>
      </defs>
    `;
  }

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
            ${this._renderSvgDefs()}
            <g id="layout-tools" class="layout-tools">
              ${this._renderLayoutTools()}
            </g>
        </svg>
      `;
  }

  /**
   * Returns every renderable layout tool in one list for global zpos sorting.
   *
   * @returns {Array<object>} Renderable tool instances.
   */
  _getRenderableTools() {
    return [
      ...(this.rectangleTools ?? []),
      ...(this.circleTools ?? []),
      ...(this.horseshoeGauges ?? []),
      ...(this.lineTools ?? []),
      ...(this.iconTools ?? []),
      ...(this.areaTools ?? []),
      ...(this.nameTools ?? []),
      ...(this.stateTools ?? []),
    ];
  }

  /**
   * Converts sort fields to finite numbers so zpos templates cannot break sorting.
   *
   * @param {*} value - Tool sort field value.
   * @param {number} fallback - Value used when conversion fails.
   * @returns {number} Finite sort value.
   */
  _getToolSortNumber(value, fallback = 0) {
    const numberValue = Number(value);

    return Number.isFinite(numberValue) ? numberValue : fallback;
  }

  /**
   * Sorts tools first by configured layer, then by existing render order.
   *
   * @param {object} firstTool - First renderable tool.
   * @param {object} secondTool - Second renderable tool.
   * @returns {number} Sort comparison result.
   */
  _sortRenderableTools(firstTool, secondTool) {
    const zposDifference = this._getToolSortNumber(firstTool.zpos) - this._getToolSortNumber(secondTool.zpos);

    if (zposDifference !== 0) return zposDifference;

    return this._getToolSortNumber(firstTool.renderIndex) - this._getToolSortNumber(secondTool.renderIndex);
  }

  /**
   * Renders all layout tools through one globally sorted zpos pipeline.
   *
   * @returns {TemplateResult} Sorted SVG layout tool templates.
   */
  _renderLayoutTools() {
    return svg`
      ${this._getRenderableTools()
        .sort((firstTool, secondTool) => this._sortRenderableTools(firstTool, secondTool))
        .map((tool) => tool.render())}
    `;
  }

  /** *****************************************************************************
   * _getGroupScaleTransform()
   *
   * Summary.
   * Builds the group scale and flip transform for layout tools.
   *
   */
  _getGroupScaleTransform(item) {
    return this.groupManager.getGroupScaleTransform(item);
  }

  _getGroupScaleStyle(item) {
    return this.groupManager.getGroupScaleStyle(item);
  }

  /**
   * Injects external SVG URL icon placeholders after Lit updates the DOM.
   *
   * @param {Map} changedProperties - Lit changed properties map.
   */
  updated(changedProperties) {
    super.updated?.(changedProperties);

    this.iconTools?.[0]?.injectSvgUrlIcons();
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

  getCardSize() {
    return 4;
  }
}

if (!customElements.get('flex-horseshoe-card')) {
  customElements.define('flex-horseshoe-card', FlexHorseshoeCard);
}
