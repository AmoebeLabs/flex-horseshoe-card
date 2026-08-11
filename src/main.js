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

import { LitElement, html, svg } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import CardStyles from './card-styles.js';
import CardInputEntities from './card-input-entities.js';
import CardActions from './card-actions.js';
import HomeAssistant from './home-assistant.js';
import CardTheme from './card-theme.js';
import CardConfig from './card-config.js';
import CardEntities from './card-entities.js';
import CardAnimations from './card-animations.js';
import CardTools from './card-tools.js';
import ConfigHelper from './config-helper.js';
import Templates from './templates.js';
import { computeDomain } from './frontend_mods/common/entity/compute_domain.ts';
import { hs2rgb, rgb2hex, rgb2hsv, hsv2rgb } from './frontend_mods/common/color/convert-color.ts';
import { rgbw2rgb, rgbww2rgb, temperature2rgb } from './frontend_mods/common/color/convert-light-color.ts';
import { computeStateDomain } from './frontend_mods/common/entity/compute_state_domain.ts';
import Colors from './colors.js';
import Utils from './utils.js';
import { SVG_VIEW_BOX, SVG_DEFAULT_DIMENSIONS } from './const.js';
import StateTool from './state-tool.js';
import ControlTool from './control-tool.js';
import GroupManager from './group-manager.js';
import SameAs from './same-as.js';
import Compounds from './compounds.js';
import CardTemplates from './card-templates.js';
import ChildCards from './child-cards.js';
import MasksClips from './masks-clips.js';
import { VISIBLE_LAYOUT_SECTIONS } from './layout-sections.js';
import { version } from '../package.json';

console.info(`%c FLEX-HORSESHOE-CARD %c Version ${version} `, 'color: white; font-weight: bold; background: darkgreen', 'color: darkgreen; font-weight: bold; background: white');

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

    // Get cardId for unique SVG gradient Id
    this.cardId = Math.random().toString(36).substr(2, 9);
    this._hass = undefined;
    this.cardTools = new CardTools(this, Templates, this.cardId);
    this.homeAssistant = new HomeAssistant(() => this.cardTools.hassConnected());
    this.entities = [];
    this.cardInputEntities = new CardInputEntities(this.cardId, this.entities, () => this.setHass(this._hass));
    this.actions = new CardActions(this, this.cardInputEntities);
    this.cardConfig = new CardConfig(Templates);
    this.cardTheme = new CardTheme(
      this,
      () => this._updateGradientsAfterRender(),
      () => {
        if (this._hass) this.setHass(this._hass, true);
        this.requestUpdate();
      },
    );
    this.cardEntities = new CardEntities(Templates, this.cardTheme);
    this.entitiesStr = [];
    this.attributesStr = [];
    this.viewBoxSize = SVG_VIEW_BOX;
    this.viewBox = { width: SVG_VIEW_BOX, height: SVG_VIEW_BOX };
    this.colorStops = {};
    this.childCards = new ChildCards(this);
    this.cardAnimations = new CardAnimations();
    this.groupManager = undefined;
    this.sourceGroupConfigs = undefined;
    this.activeGroupConfigs = undefined;
    this.activeGroupSignatures = {};
    this.groupsHaveJavascript = false;
    this.changedGroupIds = new Set();
    this.resolvedEntityConfigs = [];
    this.entitySlots = { flat: [], default: [] };
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


    // Determines if horseshoe has full range, or is split in right/left from the top middle
    this.bar_mode = 'normal'; // default

    this.dev = {
      debug: false,
    };
    this.performanceUpdateStart = undefined;
    this.performanceRenderStart = undefined;
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
  static styles = CardStyles;



  /**
   * Refeeds all normal entity-bound tools after async sparkline history refresh.
   *
   * Sparkline history arrives outside the normal Home Assistant setHass pass. The
   * local fhs_sparkline entities are updated there, so the existing tools that
   * point at those entity_index values must receive their entity state again.
   */
  _updateToolsAfterSparklineStatistics() {
    // History resolves asynchronously and another card may have published its
    // template context meanwhile. Restore this card before evaluating its tools.
    Templates.setContext({
      hass: this._hass,
      config: this.config,
      entities: this.entities,
      horseshoes: this.horseshoes,
      entity_slots: this.entitySlots,
    });

    this.evaluateJavascriptTemplates = true;

    // Async history has already updated derived sparkline entities, so all normal
    // tools can now evaluate their runtime config and receive current entity data.
    this.cardTools.updateRuntimeConfig();
    this.cardTools.setRuntimeEntityStates(this.resolvedEntityConfigs, this.entities);

    this.evaluateJavascriptTemplates = false;
  }

  /** **************************************************************************************
   * hass()
   *
   * Summary.
   *  Updates hass data for the card
   *
   */

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
    const performanceEnabled = this.dev.performance === true;
    const setHassPerformanceStart = performanceEnabled ? performance.now() : undefined;
    const hassBecameAvailable = this._hass === undefined;

    this._hass = hass;
    this.homeAssistant.setHass(hass);
    const themeChanged = this.cardTheme.updateHass(hass);
    this.childCards.setHass(hass);

    const entitiesPerformanceStart = performanceEnabled ? performance.now() : undefined;

    // Capture every configured Home Assistant entity before evaluating dynamic config.
    // Object identity changes when HA publishes a new state or attribute set.
    let configuredEntityStateChanged = this.cardInputEntities.stateChanged || !this.entityConfigsInitialized;
    const configuredEntityCount = this.config.entities.length;

    this.resolvedEntityConfigs.slice(0, configuredEntityCount).forEach((activeEntityConfig, index) => {
      const entity = activeEntityConfig.local ? this.entities[index] : hass.states[activeEntityConfig.entity];

      if (!entity) return;
      if (this.entities[index] !== entity) configuredEntityStateChanged = true;
      this.entities[index] = entity;
    });

    Templates.setContext({
      hass: this._hass,
      config: this.config,
      entities: this.entities,
      horseshoes: this.horseshoes,
      entity_slots: this.entitySlots,
    });

    // Evaluate every marked entity config exactly once for this configured state update.
    // Static entity configs retain their compiled source object.
    if (configuredEntityStateChanged || this.cardTheme.modeChanged) {
      this.resolvedEntityConfigs = this.cardEntities.buildRuntimeEntityConfigs(this.config, true);
      this.entityConfigsInitialized = true;
    } else {
      this.resolvedEntityConfigs = this.resolvedEntityConfigs.slice(0, configuredEntityCount);
    }

    // An evaluated entity config may select a different entity. Publish the final entity list
    // before tools, animations and card styles receive their JavaScript context.
    this.resolvedEntityConfigs.forEach((entityConfig, index) => {
      const entity = entityConfig.local ? this.entities[index] : hass.states[entityConfig.entity];

      if (entity) this.entities[index] = entity;
    });
    this.actions.setHassAndEntities(hass, this.resolvedEntityConfigs, this.entities);

    Templates.setContext({
      hass: this._hass,
      config: this.config,
      entities: this.entities,
      horseshoes: this.horseshoes,
      entity_slots: this.entitySlots,
    });

    if (performanceEnabled) {
      performance.measure(`FHS:${this.cardId}:entities`, {
        start: entitiesPerformanceStart,
        end: performance.now(),
      });
    }

    // Groups are complete runtime components. Evaluate marked groups before tools,
    // rebuild the manager only for changed results, and mark every dependent descendant.
    const groupsPerformanceStart = performanceEnabled ? performance.now() : undefined;
    this.changedGroupIds.clear();
    if (configuredEntityStateChanged && this.groupsHaveJavascript) {
      const nextActiveGroupConfigs = [...this.activeGroupConfigs];
      const directlyChangedGroupIds = new Set();

      this.sourceGroupConfigs.forEach((sourceGroupConfig, groupIndex) => {
        if (!Templates.hasJavascriptTemplates(sourceGroupConfig)) return;

        const groupId = String(sourceGroupConfig.id);
        const activeGroupConfig = Templates.getJsTemplateOrValue(sourceGroupConfig, sourceGroupConfig, {
          resolveKeys: true,
        });
        const activeGroupSignature = JSON.stringify(activeGroupConfig);
        nextActiveGroupConfigs[groupIndex] = activeGroupConfig;
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
            currentGroupId = currentGroupId === 'card' ? undefined : (currentGroup.parent ?? 'card');
          }
        });
      }
    }

    if (performanceEnabled) {
      performance.measure(`FHS:${this.cardId}:groups`, {
        start: groupsPerformanceStart,
        end: performance.now(),
      });
    }

    const cardStylesPerformanceStart = performanceEnabled ? performance.now() : undefined;
    if (configuredEntityStateChanged && this.cardStylesHaveJavascript) {
      this.activeCardStyles = Templates.getJsTemplateOrValue({ entity_index: 0 }, this.sourceCardStyles);
    }

    if (performanceEnabled) {
      performance.measure(`FHS:${this.cardId}:card-styles`, {
        start: cardStylesPerformanceStart,
        end: performance.now(),
      });
    }

    let entityHasChanged = forceUpdate || themeChanged || configuredEntityStateChanged || this.cardTools.getRenderableTools().some((tool) => tool.requiresHassUpdate());

    this.resolvedEntityConfigs.forEach((entityConfig, index) => {
      const entity = entityConfig.local ? this.entities[index] : hass.states[entityConfig.entity];

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

    if (!entityHasChanged) {
      if (performanceEnabled) {
        performance.measure(`FHS:${this.cardId}:setHass`, {
          start: setHassPerformanceStart,
          end: performance.now(),
        });
      }

      return;
    }

    // Home Assistant availability is a distinct one-time lifecycle phase.
    if (hassBecameAvailable) this.cardTools.hassAvailable();

    // Runtime configuration and entity data still run for forced, theme and history updates.
    // JavaScript evaluation still occurs only for an actual configured entity update.
    this.evaluateJavascriptTemplates = configuredEntityStateChanged;

    const toolsPerformanceStart = performanceEnabled ? performance.now() : undefined;

    // Runtime configuration is updated once before sparkline entity data.
    this.cardTools.updateSparklineRuntimeConfig();
    this.cardTools.setSparklineEntityStates(this.resolvedEntityConfigs, this.entities);
    this.cardEntities.updateSparklineEntities(this.resolvedEntityConfigs, this.entities, this.cardTools.getBySection('sparklines'));

    // Remaining runtime configurations can now use the current local sparkline entities.
    this.cardTools.updateRuntimeConfig();
    this.cardTools.setRuntimeEntityStates(this.resolvedEntityConfigs, this.entities);

    if (performanceEnabled) {
      performance.measure(`FHS:${this.cardId}:tools`, {
        start: toolsPerformanceStart,
        end: performance.now(),
      });
    }

    // Evaluate a complete animation state item before matching its state and applying
    // its already active icons and styles. No animation field has a separate evaluator.
    const animationsPerformanceStart = performanceEnabled ? performance.now() : undefined;
    this.cardAnimations.update(this.config, this.entities, Templates, configuredEntityStateChanged);

    if (performanceEnabled) {
      performance.measure(`FHS:${this.cardId}:animations`, {
        start: animationsPerformanceStart,
        end: performance.now(),
      });
    }

    this.evaluateJavascriptTemplates = false;
    this.cardInputEntities.markStateHandled();
    this.changedGroupIds.clear();

    Templates.setContext({
      hass: this._hass,
      config: this.config,
      entities: this.entities,
      horseshoes: this.horseshoes,
      entity_slots: this.entitySlots,
    });

    // An update has been requested to recalculate / redraw the tools, so reset theme mode changed.
    this.cardTheme.markModeHandled();

    if (performanceEnabled && this.performanceUpdateStart === undefined) {
      this.performanceUpdateStart = setHassPerformanceStart;
    }

    this.requestUpdate();

    if (performanceEnabled) {
      performance.measure(`FHS:${this.cardId}:setHass`, {
        start: setHassPerformanceStart,
        end: performance.now(),
      });
    }
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



  setConfig(config) {
    const performanceEnabled = config.dev?.performance === true;
    const setConfigPerformanceStart = performanceEnabled ? performance.now() : undefined;

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
      if (config?.palettes) this.cardTheme.loadPalettes(config.palettes);

      this.cardConfig.assignLayoutItemIds(config);

      this.cardConfig.compileStaticValues(config);

      // Entity disabled templates use finalized constants but run before entity slots exist.
      Templates.setContext({
        hass: this._hass,
        config,
        entities: this.entities,
        horseshoes: this.horseshoes,
      });
      ControlTool.compileConfig(config, Templates);
      this.cardConfig.removeDisabledEntityConfigs(config);

      this.entitySlots = this.cardConfig.buildEntitySlots(config.entities);
      this.cardConfig.normalizeEntityIndexAddresses(config);
      Compounds.compile(config);
      SameAs.compile(config);

      this.cardConfig.removeDisabledLayoutItems(config);
      this.cardInputEntities.validateConfig(config);
      this.cardConfig.validateActionConfigs(config);

      this.hasJavascriptTemplates = this.cardConfig.detectJavascriptTemplates(config);

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
        entity_slots: this.entitySlots,
      });

      const resolvedEntitiesConfig = this.cardEntities.buildRuntimeEntityConfigs(config, false);
      this.cardInputEntities.initializeEntities(resolvedEntitiesConfig);

      if (resolvedEntitiesConfig.length > 0) {
        const newdomain = computeDomain(resolvedEntitiesConfig[0].entity);

        if (newdomain !== 'sensor' && newdomain !== 'fhs_input_number' && newdomain !== 'fhs_input_boolean') {
          if (resolvedEntitiesConfig[0].attribute && !isNaN(resolvedEntitiesConfig[0].attribute)) {
            throw Error('First entity or attribute must be a numbered sensorvalue, but is NOT');
          }
        }
      }

      this.cardConfig.resolveLayoutEntityIndexes(config, resolvedEntitiesConfig, this.entitySlots);
      this.cardConfig.flattenEntitySlotIndexes(config, this.entitySlots);

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
      this.actions.setConfig(newConfig);
      this.sourceCardStyles = this.config.styles;
      this.activeCardStyles = this.sourceCardStyles;
      this.cardStylesHaveJavascript = Templates.hasJavascriptTemplates(this.sourceCardStyles);
      this.config.layout.groups ??= [];
      this.sourceGroupConfigs = this.config.layout.groups;
      this.activeGroupConfigs = this.sourceGroupConfigs;
      this.activeGroupSignatures = {};
      this.groupsHaveJavascript = this.sourceGroupConfigs.some((group) => Templates.hasJavascriptTemplates(group));
      this.changedGroupIds.clear();
      this.entityConfigsInitialized = false;
      this.config.layout.gradients ??= {};
      this.config.layout.clips ??= {};
      this.config.layout.masks ??= {};
      this.groupManager = new GroupManager(this.activeGroupConfigs);
      this.masksClips = new MasksClips(this.config, this.cardId, this);

      this.cardTools.setHorseshoeConfig(config);
      this.cardTheme.setHorseshoes(this.cardTools.getBySection('horseshoes'));

      this.bar_mode = newConfig.bar_mode || 'normal';

      // Get aspectratio. This can be defined at card level or layout level
      this.aspectratio = (this.config.layout.aspectratio || this.config.aspectratio || '1/1').trim();

      const ar = this.aspectratio.split('/');
      if (!this.viewBox) this.viewBox = {};
      this.viewBox.width = ar[0] * SVG_DEFAULT_DIMENSIONS;
      this.viewBox.height = ar[1] * SVG_DEFAULT_DIMENSIONS;

      this._computeSvgDimensions(this.config);
      this.cardTools.setLayoutToolConfig(this.config);
      this.childCards.setConfig(this.config.cards ?? []);

      Templates.setContext({
        hass: this._hass,
        config: this.config,
        entities: this.entities,
        horseshoes: this.horseshoes,
        entity_slots: this.entitySlots,
      });
      if (this._hass !== undefined) this.cardTools.hassAvailable();

      if (performanceEnabled) {
        performance.measure(`FHS:${this.cardId}:setConfig`, {
          start: setConfigPerformanceStart,
          end: performance.now(),
        });
      }
    } catch (error) {
      console.error('[FHC setConfig] CONFIG ERROR', {
        error,
        message: error?.message,
        stack: error?.stack,
        rawConfig: config,
        horseshoes: this.horseshoes,
        entity_slots: this.entitySlots,
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

  _getItemColorFromStops(item, colorStops) {
    if (!colorStops) return undefined;

    const rawState = this._getItemStateValue(item);
    const stateNumber = Number(rawState);

    if (!Number.isFinite(stateNumber)) {
      return undefined;
    }

    return Colors.calculateStrokeColor(stateNumber, colorStops, item.show.item_style === 'colorstopinterpolated');
  }

  /**
   * Returns the configured tool collection for a layout section.
   *
   * @param {string} section - Layout section name.
   * @returns {Array<BaseTool>} Tools in the requested section.
   */
  getToolsBySection(section) {
    return this.cardTools.getBySection(section);
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
    this.cardInputEntities.connected();
    this.homeAssistant.connected();
    this.cardTools.connected();
  }

  /** *****************************************************************************
   * disconnectedCallback()
   *
   * Summary.
   *
   */
  disconnectedCallback() {
    this.cardInputEntities.disconnected();
    this.homeAssistant.disconnected();
    this.cardTools.disconnected();
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
    const performanceEnabled = this.dev.performance === true;
    const renderPerformanceStart = performanceEnabled ? performance.now() : undefined;

    if (performanceEnabled) this.performanceRenderStart = renderPerformanceStart;

    const cardStyle = ConfigHelper.toStyleDict(this.activeCardStyles);

    const cardTemplate = html`
      <ha-card @click=${(e) => this.actions.handleCardClick(e)} style=${styleMap(cardStyle)}>
        <div class="container" id="container">${this._renderSvg()} ${this._renderSparklineTooltips()} ${this.childCards.render()}</div>
      </ha-card>
    `;

    if (performanceEnabled) {
      performance.measure(`FHS:${this.cardId}:render`, {
        start: renderPerformanceStart,
        end: performance.now(),
      });
    }

    return cardTemplate;
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
   * Renders all layout tools through one globally sorted zpos pipeline.
   *
   * @returns {TemplateResult} Sorted SVG layout tool templates.
   */
  _renderLayoutTools() {
    return svg`
      ${this.cardTools.getRenderableTools()
        .sort((firstTool, secondTool) => Number(firstTool.zpos) - Number(secondTool.zpos) || Number(firstTool.renderIndex) - Number(secondTool.renderIndex))
        .map((tool) => tool.render())}
    `;
  }

  _renderSparklineTooltips() {
    return html` <div class="sparkline-tooltip-layer">${this.cardTools.getBySection('sparklines').map((sparklineGraphTool) => sparklineGraphTool.renderTooltip())}</div> `;
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
   * Runs every tool first-update lifecycle after Lit creates the initial DOM.
   *
   * @param {Map} changedProperties - Lit changed properties map.
   */
  firstUpdated(changedProperties) {
    super.firstUpdated?.(changedProperties);

    this.cardTools.firstUpdated(changedProperties);
  }

  updated(changedProperties) {
    const performanceEnabled = this.dev.performance === true;
    const updatedPerformanceStart = performanceEnabled ? performance.now() : undefined;

    super.updated?.(changedProperties);

    this.cardTools.updated(changedProperties);

    if (performanceEnabled) {
      const updatedPerformanceEnd = performance.now();

      performance.measure(`FHS:${this.cardId}:updated`, {
        start: updatedPerformanceStart,
        end: updatedPerformanceEnd,
      });

      if (this.performanceRenderStart !== undefined) {
        performance.measure(`FHS:${this.cardId}:lit-update`, {
          start: this.performanceRenderStart,
          end: updatedPerformanceEnd,
        });
        this.performanceRenderStart = undefined;
      }

      if (this.performanceUpdateStart !== undefined) {
        performance.measure(`FHS:${this.cardId}:update-cycle`, {
          start: this.performanceUpdateStart,
          end: updatedPerformanceEnd,
        });
        this.performanceUpdateStart = undefined;
      }

      // Text measurement can request one follow-up Lit update from a tool's updated callback.
      if (this.isUpdatePending) this.performanceUpdateStart = updatedPerformanceEnd;
    }
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
