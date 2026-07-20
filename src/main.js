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
import { SVG_VIEW_BOX, SVG_DEFAULT_DIMENSIONS, DEFAULT_ZPOS } from './const.js';
import HorseshoeGauge from './horseshoe-gauge.js';
import RectangleTool from './rectangle-tool.js';
import LineTool from './line-tool.js';
import CircleTool from './circle-tool.js';
import ArcTool from './arc-tool.js';
import NameTool from './name-tool.js';
import AreaTool from './area-tool.js';
import StateTool from './state-tool.js';
import IconTool from './icon-tool.js';
import SparklineGraphTool from './sparkline-graph-tool.js';
import GroupManager from './group-manager.js';
import SameAs from './same-as.js';
import CardTemplates from './card-templates.js';
import ChildCards from './child-cards.js';
import MasksClips from './masks-clips.js';
import { DEFINITION_SHAPE_SECTIONS, VISIBLE_LAYOUT_SECTIONS } from './layout-sections.js';
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
    this.hassConnection = undefined;
    this.hassConnectionReadyHandler = () => {
      this._getRenderableTools().forEach((tool) => tool.hassConnected());
    };
    this.entities = [];
    this.entitiesStr = [];
    this.attributesStr = [];
    this.viewBoxSize = SVG_VIEW_BOX;
    this.viewBox = { width: SVG_VIEW_BOX, height: SVG_VIEW_BOX };
    this.colorStops = {};
    this.animations = {};
    this.animations.lines = {};
    this.childCards = new ChildCards(this);
    this.animations.vlines = {};
    this.animations.hlines = {};
    this.animations.circles = {};
    this.animations.arcs = {};
    this.animations.rectangles = {};
    this.animations.icons = {};
    this.animations.iconsIcon = {};
    this.animations.names = {};
    this.animations.areas = {};
    this.animations.states = {};
    this.rectangleTools = [];
    this.lineTools = [];
    this.circleTools = [];
    this.arcTools = [];
    this.nameTools = [];
    this.areaTools = [];
    this.stateTools = [];
    this.iconTools = [];
    this.sparklineGraphTools = [];
    this.groupManager = undefined;
    this.sourceGroupConfigs = undefined;
    this.activeGroupConfigs = undefined;
    this.activeGroupSignatures = {};
    this.groupsHaveJavascript = false;
    this.changedGroupIds = new Set();
    this.resolvedEntityConfigs = [];
    this.entityConfigsInitialized = false;
    this.evaluateJavascriptTemplates = false;
    this.sourceCardStyles = undefined;
    this.activeCardStyles = undefined;
    this.cardStylesHaveJavascript = false;
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

      // Resolve entities. Note that entities can be defined as a string, and can contain templates, so we resolve them here once and for all, and store the result in this.entities. This is used by the rest of the code to get the entities to work with.
      this.resolvedEntityConfigs = this._resolveEntityConfigs(this.config, false);
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

      :host([embedded]) {
        display: block;
        width: 100%;
        height: 100%;
      }

      :host([embedded]) ha-card {
        box-sizing: border-box;
        width: 100%;
        height: 100%;
      }

      :host([embedded]) .container {
        width: 100%;
        height: 100%;
      }

      :host([embedded]) .container > svg {
        width: 100%;
        height: 100%;
      }

      .container {
        position: relative;
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      .fhs-child-card-layer {
        position: absolute;
        inset: 0;
        pointer-events: none;
      }

      .sparkline-tooltip-layer {
        position: absolute;
        inset: 0;
        pointer-events: none;
      }

      .sparkline-tooltip {
        position: absolute;
        z-index: 5;
        pointer-events: none;
        display: inline-block;
        width: auto;
        max-width: calc(100% - 24px);
        padding: 0.2em 0.3em;
        border-radius: 0.3em;
        background: var(--card-background-color, var(--ha-card-background, rgba(32, 32, 32, 0.94)));
        color: var(--primary-text-color);
        box-shadow: 0 0.35em 0.9em rgba(0, 0, 0, 0.22);
        border: 1px solid var(--divider-color);
        font-size: var(--sparkline-tooltip-font-size, 0.5em);
        -webkit-text-size-adjust: 100%;
        text-size-adjust: 100%;
        line-height: 1.15;
        transform: translate(-50%, -100%);
      }

      .sparkline-tooltip__title {
        font-weight: 600;
        margin-bottom: 0.22em;
        white-space: nowrap;
      }

      .sparkline-tooltip__row {
        display: grid;
        grid-template-columns: auto auto;
        gap: 0.6em;
        align-items: baseline;
        white-space: nowrap;
      }

      .sparkline-tooltip__row + .sparkline-tooltip__row {
        margin-top: 0.08em;
      }

      .fhs-child-card {
        position: absolute;
        pointer-events: auto;
      }

      .fhs-child-card > * {
        display: block;
        width: 100%;
        height: 100%;
      }

      .fhs-child-card--frameless {
        background: transparent;
        border: 0;
        box-shadow: none;
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

  _resolveEntityConfigs(config, evaluateJavascript) {
    if (config?.dev?.debug) {
      console.log('resolving entity config for', config?.entities);
    }
    return (
      config?.entities?.map((entityConfig, index) => {
        const item = {
          entity_index: index,
        };

        if (!evaluateJavascript || !Templates.hasJavascriptTemplates(entityConfig)) return entityConfig;

        return Templates.getJsTemplateOrValue(item, entityConfig);
      }) ?? []
    );
  }

  /**
   * Builds local runtime entity configs for sparkline min/avg/max values.
   *
   * The generated entities behave like normal entity_index targets for the rest
   * of the card. The source entity config is kept so unit/icon/device metadata
   * can still come from Home Assistant, while the state is provided by the graph.
   *
   * @returns {Array<object>} Local sparkline entity configs appended after HA entities.
   */
  _buildSparklineEntityConfigs() {
    const configs = [];

    this.sparklineGraphTools.forEach((sparklineGraphTool) => {
      const sourceEntityIndex = sparklineGraphTool.entity_index;
      const sourceEntityConfig = this.resolvedEntityConfigs[sourceEntityIndex];
      const sparklineId = sparklineGraphTool.config.id;

      ['min', 'avg', 'max', 'min_time', 'max_time'].forEach((stat) => {
        const statEntityConfig = {
          ...sourceEntityConfig,
          entity: `fhs_sparkline.${sparklineId}_${stat}`,
          local: true,
          source_entity_index: sourceEntityIndex,
          sparkline_id: sparklineId,
          sparkline_stat: stat,
        };

        delete statEntityConfig.name;

        if (stat === 'min_time' || stat === 'max_time') {
          statEntityConfig.format = 'datetime-short'; // 'time';
          statEntityConfig.unit = '';
        }

        configs.push(statEntityConfig);
      });
    });

    return configs;
  }

  /**
   * Copies the source HA entity into local sparkline entities and replaces only
   * the values that are derived from the graph statistics.
   */
  _updateSparklineEntities() {
    const baseIndex = this.config.entities?.length ?? 0;

    this.sparklineGraphTools.forEach((sparklineGraphTool, sparklineIndex) => {
      const sourceEntity = this.entities[sparklineGraphTool.entity_index];
      const sparklineId = sparklineGraphTool.config.id;

      ['min', 'avg', 'max', 'min_time', 'max_time'].forEach((stat, statIndex) => {
        const entityIndex = baseIndex + sparklineIndex * 5 + statIndex;
        const state = sparklineGraphTool.stats[stat];
        const labelMap = {
          min: 'min',
          avg: 'mean',
          max: 'max',
          min_time: 'min',
          max_time: 'max',
        };
        const label = labelMap[stat];
        const sourceEntityConfig = this.resolvedEntityConfigs[sparklineGraphTool.entity_index];
        const sourceDecimals = sourceEntityConfig.decimals !== undefined ? Number(sourceEntityConfig.decimals) : Number(String(sourceEntity.state).includes('.') ? String(sourceEntity.state).split('.')[1].length : 0);
        const roundedState = stat === 'avg' && Number.isFinite(Number(state)) ? Number(state).toFixed(sourceDecimals) : String(state);
        const entity = Merge.mergeDeep(sourceEntity, {
          entity_id: `fhs_sparkline.${sparklineId}_${stat}`,
          state: roundedState,
          label,
          attributes: {
            ...sourceEntity.attributes,
            source_entity_id: stat === 'min_time' || stat === 'max_time' ? undefined : sourceEntity.entity_id,
            unit_of_measurement: stat === 'min_time' || stat === 'max_time' ? undefined : sourceEntity.attributes.unit_of_measurement,
            sparkline_id: sparklineId,
            sparkline_stat: stat,
          },
        });

        this.entities[entityIndex] = entity;
      });
    });
  }

  /**
   * Refeeds all normal entity-bound tools after async sparkline history refresh.
   *
   * Sparkline history arrives outside the normal Home Assistant setHass pass. The
   * local fhs_sparkline entities are updated there, so the existing tools that
   * point at those entity_index values must receive their entity state again.
   */
  _updateToolsUsingSparklineEntities() {
    this.evaluateJavascriptTemplates = true;

    this.horseshoeGauges = this.horseshoeGauges.map((horseshoe) => this._setToolEntityState(horseshoe));
    this.nameTools = (this.nameTools ?? []).map((nameTool) => this._setToolEntityState(nameTool));
    this.areaTools = (this.areaTools ?? []).map((areaTool) => this._setToolEntityState(areaTool));
    this.stateTools = (this.stateTools ?? []).map((stateTool) => this._setToolEntityState(stateTool));
    this.rectangleTools = (this.rectangleTools ?? []).map((rectangleTool) => this._setToolEntityState(rectangleTool));
    this.lineTools = (this.lineTools ?? []).map((lineTool) => this._setToolEntityState(lineTool));
    this.circleTools = (this.circleTools ?? []).map((circleTool) => this._setToolEntityState(circleTool));
    this.arcTools = (this.arcTools ?? []).map((arcTool) => this._setToolEntityState(arcTool));
    this.iconTools = (this.iconTools ?? []).map((iconTool) => this._setToolEntityState(iconTool));

    this.evaluateJavascriptTemplates = false;
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

  getActiveColorStopMode() {
    const hassDarkMode = this._hass?.themes?.darkMode;

    if (hassDarkMode !== undefined) {
      return hassDarkMode === true ? 'dark' : 'light';
    }

    return this.themeIsDarkMode() ? 'dark' : 'light';
  }

  set hass(hass) {
    this.setHass(hass);
  }

  /*
   * If theme mode changed. It takes some time for the DOM to be complete
   * RequestUpdate() after that to make sure the palette colors are loaded, and processed
   */
  async _updateGradientsAfterRender() {
    await this.updateComplete;
    await new Promise(requestAnimationFrame);
    this.requestUpdate();
  }

  setHass(hass, forceUpdate = false) {
    this._hass = hass;

    if (this.hassConnection !== hass.connection) {
      if (this.hassConnection && this.isConnected) this.hassConnection.removeEventListener('ready', this.hassConnectionReadyHandler);
      this.hassConnection = hass.connection;
      if (this.isConnected) this.hassConnection.addEventListener('ready', this.hassConnectionReadyHandler);
    }
    this.childCards.setHass(hass);

    // Capture every configured Home Assistant entity before evaluating dynamic config.
    // Object identity changes when HA publishes a new state or attribute set.
    let configuredEntityStateChanged = !this.entityConfigsInitialized;
    const configuredEntityCount = this.config.entities.length;

    this.resolvedEntityConfigs.slice(0, configuredEntityCount).forEach((activeEntityConfig, index) => {
      const entity = hass.states[activeEntityConfig.entity];

      if (!entity) return;
      if (this.entities[index] !== entity) configuredEntityStateChanged = true;
      this.entities[index] = entity;
    });

    Templates.setContext({
      hass: this._hass,
      config: this.config,
      entities: this.entities,
      horseshoes: this.horseshoes,
    });

    // Evaluate every marked entity config exactly once for this configured state update.
    // Static entity configs retain their compiled source object.
    if (configuredEntityStateChanged) {
      this.resolvedEntityConfigs = this._resolveEntityConfigs(this.config, true);
      this.entityConfigsInitialized = true;
    } else {
      this.resolvedEntityConfigs = this.resolvedEntityConfigs.slice(0, configuredEntityCount);
    }

    // An evaluated entity config may select a different entity. Publish the final entity list
    // before tools, animations and card styles receive their JavaScript context.
    this.resolvedEntityConfigs.forEach((entityConfig, index) => {
      const entity = hass.states[entityConfig.entity];

      if (entity) this.entities[index] = entity;
    });

    Templates.setContext({
      hass: this._hass,
      config: this.config,
      entities: this.entities,
      horseshoes: this.horseshoes,
    });

    // Groups are complete runtime components. Evaluate marked groups before tools,
    // rebuild the manager only for changed results, and mark every dependent descendant.
    this.changedGroupIds.clear();
    if (configuredEntityStateChanged && this.groupsHaveJavascript) {
      const nextActiveGroupConfigs = { ...this.activeGroupConfigs };
      const directlyChangedGroupIds = new Set();

      Object.entries(this.sourceGroupConfigs).forEach(([groupId, sourceGroupConfig]) => {
        if (!Templates.hasJavascriptTemplates(sourceGroupConfig)) return;

        const activeGroupConfig = Templates.getJsTemplateOrValue(sourceGroupConfig, sourceGroupConfig, {
          resolveKeys: true,
        });
        const activeGroupSignature = JSON.stringify(activeGroupConfig);

        nextActiveGroupConfigs[groupId] = activeGroupConfig;
        if (activeGroupSignature !== this.activeGroupSignatures[groupId]) {
          this.activeGroupSignatures[groupId] = activeGroupSignature;
          directlyChangedGroupIds.add(groupId);
        }
      });

      if (directlyChangedGroupIds.size > 0) {
        this.activeGroupConfigs = nextActiveGroupConfigs;
        this.groupManager = new GroupManager(this.activeGroupConfigs);

        Object.keys(this.groupManager.groups).forEach((groupId) => {
          let currentGroupId = groupId;

          while (currentGroupId) {
            if (directlyChangedGroupIds.has(currentGroupId)) {
              this.changedGroupIds.add(groupId);
              break;
            }

            const currentGroup = this.groupManager.groups[currentGroupId];
            currentGroupId = currentGroupId === 'card' ? undefined : currentGroup.parent ?? 'card';
          }
        });
      }
    }

    if (configuredEntityStateChanged && this.cardStylesHaveJavascript) {
      this.activeCardStyles = Templates.getJsTemplateOrValue({ entity_index: 0 }, this.sourceCardStyles);
    }

    this.resolvedEntityConfigs = [...this.resolvedEntityConfigs, ...this._buildSparklineEntityConfigs()];

    let entityHasChanged = forceUpdate || configuredEntityStateChanged || this._getRenderableTools().some((tool) => tool.requiresHassUpdate());

    const themeName = hass.selectedTheme || hass.themes.theme || '';
    const themeDarkMode = hass.themes.darkMode === true;

    this.theme.nameChanged = this.theme.name !== themeName;
    this.theme.modeChanged = this.theme.darkMode !== themeDarkMode;

    if (this.theme.nameChanged || this.theme.modeChanged) {
      this.theme.name = themeName;
      this.theme.darkMode = themeDarkMode;
      Colors.colorCache = {};
      const mode = this.getActiveColorStopMode();
      Palette.applyAll(this, this.palettes, mode);
      this.horseshoeGauges?.forEach((horseshoe) => horseshoe.clearPathItemCache());
      this._updateGradientsAfterRender();
      entityHasChanged = true;
    }

    this.resolvedEntityConfigs.forEach((entityConfig, index) => {
      const entity = hass.states[entityConfig.entity];

      if (!entity) return;

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

    if (!entityHasChanged) return;

    // Tool state and data lifecycles still run for forced, theme and history updates.
    // BaseTool enters JavaScript evaluation only for an actual configured entity update.
    this.evaluateJavascriptTemplates = configuredEntityStateChanged;

    this.sparklineGraphTools = (this.sparklineGraphTools ?? []).map((sparklineGraphTool) => this._setToolEntityState(sparklineGraphTool));
    this._updateSparklineEntities();

    this.horseshoeGauges = this.horseshoeGauges.map((horseshoe) => this._setToolEntityState(horseshoe));
    this.nameTools = (this.nameTools ?? []).map((nameTool) => this._setToolEntityState(nameTool));
    this.areaTools = (this.areaTools ?? []).map((areaTool) => this._setToolEntityState(areaTool));
    this.stateTools = (this.stateTools ?? []).map((stateTool) => this._setToolEntityState(stateTool));
    this.rectangleTools = (this.rectangleTools ?? []).map((rectangleTool) => this._setToolEntityState(rectangleTool));
    this.lineTools = (this.lineTools ?? []).map((lineTool) => this._setToolEntityState(lineTool));
    this.circleTools = (this.circleTools ?? []).map((circleTool) => this._setToolEntityState(circleTool));
    this.arcTools = (this.arcTools ?? []).map((arcTool) => this._setToolEntityState(arcTool));
    this.iconTools = (this.iconTools ?? []).map((iconTool) => this._setToolEntityState(iconTool));

    // Evaluate a complete animation state item before matching its state and applying
    // its already active icons and styles. No animation field has a separate evaluator.
    if (configuredEntityStateChanged && this.config.animations) {
      Object.keys(this.config.animations).forEach((animation) => {
        const entityIndex = animation.substr(Number(animation.indexOf('.') + 1));

        this.config.animations[animation].forEach((sourceAnimationItem) => {
          const animationContext = {
            ...sourceAnimationItem,
            entity_index: entityIndex,
          };
          const item = Templates.hasJavascriptTemplates(sourceAnimationItem)
            ? Templates.getJsTemplateOrValue(animationContext, sourceAnimationItem)
            : sourceAnimationItem;

          if (this.entities[entityIndex].state.toLowerCase() !== item.state.toLowerCase()) return;

          ['lines', 'vlines', 'hlines', 'circles', 'arcs', 'rectangles', 'names', 'areas', 'states'].forEach((section) => {
            if (item[section]) item[section].forEach((animationItem) => this._updateAnimationStyles(section, animationItem));
          });

          if (item.icons) {
            item.icons.forEach((animationItem) => {
              const animationId = animationItem.animation_id;

              if (!this.animations.icons[animationId] || !animationItem.reuse) {
                this.animations.icons[animationId] = {};
                this.animations.iconsIcon[animationId] = {};
              }

              this.animations.icons[animationId] = {
                ...this.animations.icons[animationId],
                ...ConfigHelper.toStyleDict(animationItem.styles),
              };
              this.animations.iconsIcon[animationId] = animationItem.icon;
            });
          }
        });
      });
    }

    this.evaluateJavascriptTemplates = false;
    this.changedGroupIds.clear();

    Templates.setContext({
      hass: this._hass,
      config: this.config,
      entities: this.entities,
      horseshoes: this.horseshoes,
    });

    // An update has been requested to recalculate / redraw the tools, so reset theme mode changed.
    this.theme.modeChanged = false;
    this.requestUpdate();
  }

  _updateAnimationStyles(section, item) {
    const animationId = item.animation_id;

    if (animationId === undefined || animationId === null) return;

    const styleDict = ConfigHelper.toStyleDict(item.styles);

    this.animations[section][animationId] = {
      ...(item.reuse ? (this.animations[section][animationId] ?? {}) : {}),
      ...styleDict,
    };
  }

  _calculateSvgCoordinatesInGroup(item) {
    return this.groupManager.calculateSvgCoordinatesInGroup(item);
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

  _isCalcExpression(value) {
    return typeof value === 'string' && value.startsWith('calc(') && value.endsWith(')');
  }

  _calculateStaticCalc(value, constants = {}) {
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

  _assignIdItems(items) {
    return items.map((item, index) => ({
      ...item,
      id: String(item.id ?? index),
    }));
  }

  _assignSectionIds(config) {
    VISIBLE_LAYOUT_SECTIONS.forEach((section) => {
      const items = config.layout?.[section];

      if (!Array.isArray(items)) return;

      config.layout[section] = this._assignIdItems(items);
    });

    [config.layout?.clips, config.layout?.masks].forEach((definitions) => {
      if (!definitions) return;

      Object.values(definitions).forEach((definition) => {
        DEFINITION_SHAPE_SECTIONS.forEach((section) => {
          const items = definition[section];

          if (!Array.isArray(items)) return;

          definition[section] = this._assignIdItems(items);
        });
      });
    });
  }

  /**
   * Resolves item-level entity ids to entity_index values.
   *
   * This keeps user YAML readable (`entity: sensor.x` or
   * `entity: fhs_sparkline.<sparkline_id>_avg`) while every tool still receives
   * the same internal entity_index it already understands.
   *
   * @param {object} config - Card config after ids and static values are resolved.
   * @param {Array<object>} resolvedEntitiesConfig - Normal HA entity configs.
   */
  _resolveLayoutItemEntityIndexes(config, resolvedEntitiesConfig) {
    const entityIndexes = {};
    const stats = ['min', 'avg', 'max', 'min_time', 'max_time'];
    const sparklineBaseIndex = resolvedEntitiesConfig.length;

    resolvedEntitiesConfig.forEach((entityConfig, index) => {
      entityIndexes[entityConfig.entity] = index;
    });

    config.layout.sparklines?.forEach((sparkline, sparklineIndex) => {
      stats.forEach((stat, statIndex) => {
        entityIndexes[`fhs_sparkline.${sparkline.id}_${stat}`] = sparklineBaseIndex + sparklineIndex * stats.length + statIndex;
      });
    });

    VISIBLE_LAYOUT_SECTIONS.forEach((section) => {
      const items = config.layout?.[section];

      if (!Array.isArray(items)) return;

      items.forEach((item) => {
        if (item.entity === undefined) return;

        item.entity_index = entityIndexes[item.entity];
      });
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

  _buildConstants(config) {
    const constants = config.constants;
    const calcConstants = {
      zpos: { ...DEFAULT_ZPOS },
    };

    if (!constants || typeof constants !== 'object') {
      return calcConstants;
    }

    Object.entries(constants).forEach(([key, value]) => {
      constants[key] = this._calculateStaticValues(value, calcConstants);

      if (this._isStaticNumber(constants[key])) {
        calcConstants[key] = constants[key];
      }
    });

    return calcConstants;
  }

  _replaceStaticRef(value, constants) {
    if (!this._isStaticRef(value)) return value;

    const refName = value.slice(4, -1).trim();

    if (!(refName in constants)) {
      throw new Error(`Static ref '${refName}' not found`);
    }

    const resolvedRef = this._cloneStaticValue(constants[refName]);

    // Mark object and array refs internally so same_as can replace that exact path instead of deep-merging it.
    if (resolvedRef && typeof resolvedRef === 'object') {
      Object.defineProperty(resolvedRef, SameAs.STATIC_REF_MARKER, {
        value: true,
      });
    }

    return resolvedRef;
  }

  _replaceStaticRefs(value, constants = {}) {
    if (this._isStaticRef(value)) {
      return this._replaceStaticRef(value, constants);
    }

    if (Array.isArray(value)) {
      return value.map((item) => this._replaceStaticRefs(item, constants));
    }

    if (value && typeof value === 'object') {
      Object.entries(value).forEach(([key, itemValue]) => {
        value[key] = this._replaceStaticRefs(itemValue, constants);
      });

      return value;
    }

    return value;
  }

  _calculateStaticValues(value, constants = {}) {
    if (this._isCalcExpression(value)) {
      return this._calculateStaticCalc(value, constants);
    }

    if (Array.isArray(value)) {
      const evaluatedArray = value.map((item) => this._calculateStaticValues(item, constants));

      // Arrays are recreated during calc evaluation; keep the ref marker for same_as replacement.
      if (value[SameAs.STATIC_REF_MARKER]) {
        Object.defineProperty(evaluatedArray, SameAs.STATIC_REF_MARKER, {
          value: true,
        });
      }

      return evaluatedArray;
    }

    if (value && typeof value === 'object') {
      Object.entries(value).forEach(([key, itemValue]) => {
        value[key] = this._calculateStaticValues(itemValue, constants);
      });

      return value;
    }

    return value;
  }

  /**
   * Records JavaScript-template metadata for every supported runtime config unit.
   *
   * The scan runs after card templates, ref(), calc() and same_as have produced
   * their final config shapes. Metadata is stored by Templates in a WeakMap,
   * leaving the public configuration untouched. The returned card flag allows
   * later lifecycle steps to skip all dynamic work for fully static cards.
   *
   * @param {object} config - Finalized card config before runtime tool construction.
   * @returns {boolean} True when any supported runtime config unit contains JavaScript.
   */
  _detectJavascriptTemplates(config) {
    let cardHasJavascript = false;

    config.entities.forEach((entityConfig) => {
      if (Templates.detectJavascriptTemplates(entityConfig)) cardHasJavascript = true;
    });

    VISIBLE_LAYOUT_SECTIONS.forEach((section) => {
      const items = config.layout[section];

      if (!Array.isArray(items)) return;

      items.forEach((item) => {
        if (Templates.detectJavascriptTemplates(item)) cardHasJavascript = true;
      });
    });

    if (config.layout.groups) {
      Object.values(config.layout.groups).forEach((group) => {
        if (Templates.detectJavascriptTemplates(group)) cardHasJavascript = true;
      });
    }

    if (config.animations) {
      Object.values(config.animations).forEach((animationItems) => {
        animationItems.forEach((animationItem) => {
          if (Templates.detectJavascriptTemplates(animationItem)) cardHasJavascript = true;
        });
      });
    }

    if (config.styles && Templates.detectJavascriptTemplates(config.styles)) cardHasJavascript = true;

    return cardHasJavascript;
  }

  setConfig(config) {
    try {
      config = JSON.parse(JSON.stringify(config));

      if (config.embedded === true) {
        this.setAttribute('embedded', '');
      } else {
        this.removeAttribute('embedded');
      }
      // Root template compilation must happen before required sections are checked.
      // Testing teal on all cards!!!!!!!!!!!
      // config.color_filter = {};
      // config.color_filter.monochrome = {};
      // config.color_filter.monochrome.color = 'teal';
      // config.color_filter.monochrome.amount = 0.6;
      // config.color_filter.preserve_neutral = true;
      // config.color_filter.lightness = {};
      // config.color_filter.lightness.min = 0.2;
      // config.color_filter.lightness.max = 1;

      CardTemplates.compile(config, this);

      this.dev = { ...config.dev };

      const hasChildCards = Array.isArray(config.cards);

      if (!hasChildCards && !config.entities) {
        throw Error('No entities defined');
      }

      if (!hasChildCards && !config.layout) {
        throw Error('No layout defined');
      }

      if (hasChildCards && !config.layout) {
        config.layout = {};
      }

      if (hasChildCards && !config.entities) {
        config.entities = [];
      }
      if (config?.palettes) {
        this.palettesLoaded = false;
        Palette.loadAll(config?.palettes).then((palettes) => {
          this.palettes = palettes;
          const mode = this.getActiveColorStopMode();
          Colors.setElement(this);
          Palette.applyAll(this, palettes, mode);
          Colors.colorCache = {};
          this.palettesLoaded = true;
          this.horseshoeGauges?.forEach((horseshoe) => horseshoe.clearPathItemCache());
          if (this._hass) this.setHass(this._hass, true);
          this.requestUpdate();
        });
      }

      this._assignSectionIds(config);

      const calcConstants = this._buildConstants(config);

      this._replaceStaticRefs(config, config.constants);
      this._calculateStaticValues(config, calcConstants);

      SameAs.compile(config);

      this.hasJavascriptTemplates = this._detectJavascriptTemplates(config);

      // this._assignSectionIds(config);
      // this._buildConstants(config);
      // this._replaceStaticRefs(config);
      // this._calculateStaticValues(config);
      // SameAs.compile(config);

      Templates.setContext({
        hass: this._hass,
        config,
        entities: this.entities,
        horseshoes: this.horseshoes,
      });

      const resolvedEntitiesConfig = this._resolveEntityConfigs(config, false);

      if (resolvedEntitiesConfig.length > 0) {
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

      this._resolveLayoutItemEntityIndexes(config, resolvedEntitiesConfig);

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
      this.sourceCardStyles = this.config.styles;
      this.activeCardStyles = this.sourceCardStyles;
      this.cardStylesHaveJavascript = Templates.hasJavascriptTemplates(this.sourceCardStyles);
      this.config.layout.groups ??= {};
      this.sourceGroupConfigs = this.config.layout.groups;
      this.activeGroupConfigs = this.sourceGroupConfigs;
      this.activeGroupSignatures = {};
      this.groupsHaveJavascript = Object.values(this.sourceGroupConfigs).some((group) => Templates.hasJavascriptTemplates(group));
      this.changedGroupIds.clear();
      this.entityConfigsInitialized = false;
      this.config.layout.gradients ??= {};
      this.config.layout.clips ??= {};
      this.config.layout.masks ??= {};
      this.groupManager = new GroupManager(this.activeGroupConfigs);
      this.masksClips = new MasksClips(this.config, this.cardId, this);

      this.horseshoeGauges = HorseshoeGauge.setConfig(config, Templates, this.cardId, this);

      this.bar_mode = newConfig.bar_mode || 'normal';

      // Get aspectratio. This can be defined at card level or layout level
      this.aspectratio = (this.config.layout.aspectratio || this.config.aspectratio || '1/1').trim();

      const ar = this.aspectratio.split('/');
      if (!this.viewBox) this.viewBox = {};
      this.viewBox.width = ar[0] * SVG_DEFAULT_DIMENSIONS;
      this.viewBox.height = ar[1] * SVG_DEFAULT_DIMENSIONS;

      this._computeSvgDimensions(this.config);
      this.nameTools = NameTool.setConfig(this.config, Templates, this.cardId, this);
      this.areaTools = AreaTool.setConfig(this.config, Templates, this.cardId, this);
      this.stateTools = StateTool.setConfig(this.config, Templates, this.cardId, this);
      this.rectangleTools = RectangleTool.setConfig(this.config, Templates, this.cardId, this);
      this.lineTools = LineTool.setConfig(this.config, Templates, this.cardId, this);
      this.circleTools = CircleTool.setConfig(this.config, Templates, this.cardId, this);
      this.arcTools = ArcTool.setConfig(this.config, Templates, this.cardId, this);
      this.iconTools = IconTool.setConfig(this.config, Templates, this.cardId, this);
      this.sparklineGraphTools = SparklineGraphTool.setConfig(this.config, Templates, this.cardId, this);
      this.childCards.setConfig(this.config.cards ?? []);

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
    if (!item.colorstops) return undefined;

    const rawState = this._getItemStateValue(item);
    const stateNumber = Number(rawState);

    if (!Number.isFinite(stateNumber)) {
      return undefined;
    }

    return Colors.calculateStrokeColor(stateNumber, item.colorstops, item.colorstop_gradient === true);
  }

  /**
   * Returns the configured tool collection for a layout section.
   *
   * @param {string} section - Layout section name.
   * @returns {Array<BaseTool>} Tools in the requested section.
   */
  getToolsBySection(section) {
    const sections = {
      rectangles: this.rectangleTools,
      circles: this.circleTools,
      arcs: this.arcTools,
      horseshoes: this.horseshoeGauges,
      lines: this.lineTools,
      icons: this.iconTools,
      areas: this.areaTools,
      names: this.nameTools,
      states: this.stateTools,
      sparklines: this.sparklineGraphTools,
    };

    return sections[section];
  }

  /**
   * Resolves a numeric width or the measured width of a referenced text tool.
   *
   * @param {number|object} itemWidthConfig - Numeric width or item reference.
   * @returns {number} Width in FHS coordinates including configured padding.
   */
  getItemWidth(itemWidthConfig) {
    if (typeof itemWidthConfig === 'number') {
      return itemWidthConfig;
    }

    const tools = this.getToolsBySection(itemWidthConfig.section);
    const item = tools.find((tool) => tool.id === itemWidthConfig.item_id);

    return item.getWidth() + itemWidthConfig.padding * 2;
  }

  /**
   * Resolves a numeric height or the measured height of a referenced text tool.
   *
   * @param {number|object} itemHeightConfig - Numeric height or item reference.
   * @returns {number} Height in FHS coordinates including configured padding.
   */
  getItemHeight(itemHeightConfig) {
    if (typeof itemHeightConfig === 'number') {
      return itemHeightConfig;
    }

    const tools = this.getToolsBySection(itemHeightConfig.section);
    const item = tools.find((tool) => tool.id === itemHeightConfig.item_id);

    return item.getHeight() + itemHeightConfig.padding * 2;
  }

  /**
   * Returns the complete measured geometry of a referenced text item.
   *
   * @param {object} fitConfig - Rectangle fit reference.
   * @returns {object} Center and dimensions in their respective SVG/FHS coordinate systems.
   */
  getItemGeometry(fitConfig) {
    const tools = this.getToolsBySection(fitConfig.section);
    const item = tools.find((tool) => tool.id === fitConfig.item_id);

    return {
      xpos: item.getXpos(),
      ypos: item.getYpos(),
      width: item.getWidth(),
      height: item.getHeight(),
    };
  }

  /** *****************************************************************************
   * connectedCallback()
   *
   * Summary.
   *
   */
  connectedCallback() {
    super.connectedCallback();
    if (this.hassConnection) this.hassConnection.addEventListener('ready', this.hassConnectionReadyHandler);
    this._getRenderableTools().forEach((tool) => tool.connected());
  }

  /** *****************************************************************************
   * disconnectedCallback()
   *
   * Summary.
   *
   */
  disconnectedCallback() {
    if (this.hassConnection) this.hassConnection.removeEventListener('ready', this.hassConnectionReadyHandler);
    this._getRenderableTools().forEach((tool) => tool.disconnected());
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

  render() {
    const cardStyle = ConfigHelper.toStyleDict(this.activeCardStyles);

    return html`
      <ha-card @click=${(e) => this.handleCardClick(e)} style=${styleMap(cardStyle)}>
        <div class="container" id="container">${this._renderSvg()} ${this._renderSparklineTooltips()} ${this.childCards.render()}</div>
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

        ${this.masksClips.renderDefs()}
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
      ...(this.arcTools ?? []),
      ...(this.horseshoeGauges ?? []),
      ...(this.lineTools ?? []),
      ...(this.iconTools ?? []),
      ...(this.areaTools ?? []),
      ...(this.nameTools ?? []),
      ...(this.stateTools ?? []),
      ...(this.sparklineGraphTools ?? []),
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

  _renderSparklineTooltips() {
    return html` <div class="sparkline-tooltip-layer">${this.sparklineGraphTools?.map((sparklineGraphTool) => sparklineGraphTool.renderTooltip())}</div> `;
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
  firstUpdated(changedProperties) {
    super.firstUpdated?.(changedProperties);

    this.sparklineGraphTools?.forEach((sparklineGraphTool) => sparklineGraphTool.attachPointerHandlers());
  }

  updated(changedProperties) {
    super.updated?.(changedProperties);

    this._getRenderableTools().forEach((tool) => tool.updated(changedProperties));
    this.sparklineGraphTools?.forEach((sparklineGraphTool) => sparklineGraphTool.attachPointerHandlers());
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

  /**
   * Handles clicks on the parent FHS card shell.
   *
   * Child cards own their own click handling, so clicks inside a child wrapper
   * must not open the parent popup. A cards-only parent also has no entity 0.
   *
   * @param {Event} e - Click event from the parent ha-card.
   */
  handleCardClick(e) {
    const clickedChildCard = e.composedPath().some((node) => node.classList?.contains('fhs-child-card'));

    if (clickedChildCard || !this.entities[0]) return;

    this.handlePopup(e, this.entities[0]);
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
