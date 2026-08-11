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
import TextTool from './text-tool.js';
import IconTool from './icon-tool.js';
import ControlTool from './control-tool.js';
import SparklineGraphTool from './sparkline-graph-tool.js';
import GroupManager from './group-manager.js';
import SameAs from './same-as.js';
import Compounds from './compounds.js';
import CardTemplates from './card-templates.js';
import ChildCards from './child-cards.js';
import MasksClips from './masks-clips.js';
import { DEFINITION_SHAPE_SECTIONS, VISIBLE_LAYOUT_SECTIONS } from './layout-sections.js';
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
    this.homeAssistant = new HomeAssistant(() => this._getRenderableTools().forEach((tool) => tool.hassConnected()));
    this.entities = [];
    this.cardInputEntities = new CardInputEntities(this.cardId, this.entities, () => this.setHass(this._hass));
    this.actions = new CardActions(this, this.cardInputEntities);
    this.cardTheme = new CardTheme(
      this,
      () => this._updateGradientsAfterRender(),
      () => {
        if (this._hass) this.setHass(this._hass, true);
        this.requestUpdate();
      },
    );
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
    this.animations.texts = {};
    this.animations.controls = {};
    this.rectangleTools = [];
    this.lineTools = [];
    this.circleTools = [];
    this.arcTools = [];
    this.nameTools = [];
    this.areaTools = [];
    this.stateTools = [];
    this.textTools = [];
    this.iconTools = [];
    this.sparklineGraphTools = [];
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


  _resolveEntityConfigs(config, evaluateJavascript) {
    if (config?.dev?.debug) {
      console.log('resolving entity config for', config?.entities);
    }
    const resolvedEntityConfigs = config.entities.map((entityConfig, index) => {
      const item = {
        entity_index: index,
      };

      const resolvedEntityConfig = evaluateJavascript && Templates.hasJavascriptTemplates(entityConfig) ? Templates.getJsTemplateOrValue(item, entityConfig) : entityConfig;

      // Normalize reusable entity-level color stops once for every opted-in layout item.
      if (resolvedEntityConfig.color_stops) {
        resolvedEntityConfig.colorstops = ColorStops.normalize(resolvedEntityConfig.color_stops, this.cardTheme.getActiveColorStopMode());
      }

      return resolvedEntityConfig;
    });
    const sparklineEntityTypes = ['min_time', 'max_time', 'bin_duration', 'aggregate_func', 'duration', 'min', 'avg', 'max'];
    const sparklineConfigs = config.layout.sparklines ?? [];

    // Resolve every explicitly configured fhs_sparkline entity against the
    // matching graph. This keeps its public index in entities while retaining
    // the real Home Assistant source for metadata and action routing.
    return resolvedEntityConfigs.map((entityConfig) => {
      if (!entityConfig.entity.startsWith('fhs_sparkline.')) return entityConfig;

      let matchedSparkline;
      let matchedType;

      sparklineConfigs.forEach((sparklineConfig) => {
        sparklineEntityTypes.forEach((entityType) => {
          if (entityConfig.entity === `fhs_sparkline.${sparklineConfig.id}_${entityType}`) {
            matchedSparkline = sparklineConfig;
            matchedType = entityType;
          }
        });
      });

      if (!matchedSparkline) {
        throw new Error(`[entities] Unknown sparkline entity: ${entityConfig.entity}`);
      }

      const sourceEntityConfig = resolvedEntityConfigs[matchedSparkline.entity_index];
      const localEntityConfig = {
        ...sourceEntityConfig,
        ...entityConfig,
        local: true,
        source_entity_index: matchedSparkline.entity_index,
        sparkline_id: matchedSparkline.id,
        sparkline_entity_type: matchedType,
      };

      // A derived state is already final and must never read the source
      // attribute again. Source names are also replaced by the graph label.
      delete localEntityConfig.attribute;
      if (entityConfig.name === undefined) delete localEntityConfig.name;

      if (matchedType === 'min_time' || matchedType === 'max_time') {
        localEntityConfig.format = entityConfig.format ?? 'datetime-short';
        localEntityConfig.unit = entityConfig.unit ?? '';
      }

      if (matchedType === 'duration' || matchedType === 'bin_duration') {
        if (entityConfig.unit === undefined) delete localEntityConfig.unit;
      }

      if (matchedType === 'aggregate_func') {
        localEntityConfig.unit = entityConfig.unit ?? '';
      }

      return localEntityConfig;
    });
  }

  /**
   * Copies the source HA entity into local sparkline entities and replaces only
   * the values that are derived from the graph statistics.
   */
  _updateSparklineEntities() {
    this.resolvedEntityConfigs.forEach((entityConfig, entityIndex) => {
      if (!entityConfig.sparkline_entity_type) return;

      const sparklineGraphTool = this.sparklineGraphTools.find((tool) => tool.config.id === entityConfig.sparkline_id);
      const sourceEntity = this.entities[entityConfig.source_entity_index];
      const sourceEntityConfig = this.resolvedEntityConfigs[entityConfig.source_entity_index];
      const entityType = entityConfig.sparkline_entity_type;
      const labelMap = {
        min: 'min',
        avg: 'mean',
        max: 'max',
        min_time: 'min',
        max_time: 'max',
        duration: 'Duration',
        bin_duration: 'Bin duration',
        aggregate_func: 'Aggregate function',
      };
      let state;
      let unitOfMeasurement = sourceEntity.attributes.unit_of_measurement;
      let deviceClass = sourceEntity.attributes.device_class;

      if (['min', 'avg', 'max', 'min_time', 'max_time'].includes(entityType)) {
        state = Object.hasOwn(sparklineGraphTool.stats, entityType) ? sparklineGraphTool.stats[entityType] : 'unavailable';

        if (entityType === 'avg' && Number.isFinite(Number(state))) {
          const sourceDecimals = sourceEntityConfig.decimals !== undefined ? Number(sourceEntityConfig.decimals) : Number(String(sourceEntity.state).includes('.') ? String(sourceEntity.state).split('.')[1].length : 0);
          state = Number(state).toFixed(sourceDecimals);
        }

        if (entityType === 'min_time' || entityType === 'max_time') {
          unitOfMeasurement = undefined;
          deviceClass = undefined;
        }
      }

      if (entityType === 'duration') {
        const historical = sparklineGraphTool.config.period.type !== 'real_time';

        if (historical && sparklineGraphTool.historyDurationReady) {
          const durationHours = sparklineGraphTool.config.period[sparklineGraphTool.config.period.type].duration.hour;
          state = String(durationHours);
          unitOfMeasurement = 'h';

          if (durationHours < 1) {
            state = String(durationHours * 60);
            unitOfMeasurement = 'min';
          }

          if (durationHours >= 24) {
            state = String(durationHours / 24);
            unitOfMeasurement = 'd';
          }
        } else {
          state = 'unavailable';
          unitOfMeasurement = 'h';
        }

        deviceClass = 'duration';
      }

      if (entityType === 'bin_duration') {
        const binnedHistory = sparklineGraphTool.config.period.type !== 'real_time' && sparklineGraphTool.config.sparkline.show.chart_type !== 'state_bands';

        if (binnedHistory && sparklineGraphTool.historyDurationReady) {
          const binDurationHours = 1 / sparklineGraphTool.calculateBinsPerHour(sparklineGraphTool.config);
          state = String(binDurationHours);
          unitOfMeasurement = 'h';

          if (binDurationHours < 1) {
            state = String(binDurationHours * 60);
            unitOfMeasurement = 'min';
          }

          if (binDurationHours >= 24) {
            state = String(binDurationHours / 24);
            unitOfMeasurement = 'd';
          }
        } else {
          state = 'unavailable';
          unitOfMeasurement = 'h';
        }

        deviceClass = 'duration';
      }

      if (entityType === 'aggregate_func') {
        const binnedHistory = sparklineGraphTool.config.period.type !== 'real_time' && sparklineGraphTool.config.sparkline.show.chart_type !== 'state_bands';
        state = binnedHistory && sparklineGraphTool.historyDurationReady ? sparklineGraphTool.config.sparkline.state_values.aggregate_func : 'unavailable';
        unitOfMeasurement = undefined;
        deviceClass = undefined;
      }

      const entity = Merge.mergeDeep(sourceEntity, {
        entity_id: entityConfig.entity,
        state: String(state),
        label: entityConfig.name === undefined ? labelMap[entityType] : undefined,
        attributes: {
          ...sourceEntity.attributes,
          source_entity_id: ['min', 'avg', 'max'].includes(entityType) ? sourceEntity.entity_id : undefined,
          unit_of_measurement: unitOfMeasurement,
          device_class: deviceClass,
          sparkline_id: entityConfig.sparkline_id,
          sparkline_entity_type: entityType,
        },
      });

      this.entities[entityIndex] = entity;
    });
  }

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

    // Async sparkline statistics update runtime config before entity data.
    this.horseshoeGauges.forEach((horseshoe) => horseshoe.updateRuntimeConfig());
    this.nameTools.forEach((nameTool) => nameTool.updateRuntimeConfig());
    this.areaTools.forEach((areaTool) => areaTool.updateRuntimeConfig());
    this.stateTools.forEach((stateTool) => stateTool.updateRuntimeConfig());
    this.textTools.forEach((textTool) => textTool.updateRuntimeConfig());
    this.rectangleTools.forEach((rectangleTool) => rectangleTool.updateRuntimeConfig());
    this.lineTools.forEach((lineTool) => lineTool.updateRuntimeConfig());
    this.circleTools.forEach((circleTool) => circleTool.updateRuntimeConfig());
    this.arcTools.forEach((arcTool) => arcTool.updateRuntimeConfig());
    this.iconTools.forEach((iconTool) => iconTool.updateRuntimeConfig());
    this.controlTools.forEach((controlTool) => controlTool.updateRuntimeConfig());

    this.horseshoeGauges = this.horseshoeGauges.map((horseshoe) => this._setToolEntityState(horseshoe));
    this.nameTools = (this.nameTools ?? []).map((nameTool) => this._setToolEntityState(nameTool));
    this.areaTools = (this.areaTools ?? []).map((areaTool) => this._setToolEntityState(areaTool));
    this.stateTools = (this.stateTools ?? []).map((stateTool) => this._setToolEntityState(stateTool));
    this.textTools = (this.textTools ?? []).map((textTool) => this._setToolEntityState(textTool));
    this.rectangleTools = (this.rectangleTools ?? []).map((rectangleTool) => this._setToolEntityState(rectangleTool));
    this.lineTools = (this.lineTools ?? []).map((lineTool) => this._setToolEntityState(lineTool));
    this.circleTools = (this.circleTools ?? []).map((circleTool) => this._setToolEntityState(circleTool));
    this.arcTools = (this.arcTools ?? []).map((arcTool) => this._setToolEntityState(arcTool));
    this.iconTools = (this.iconTools ?? []).map((iconTool) => this._setToolEntityState(iconTool));
    this.controlTools = (this.controlTools ?? []).map((controlTool) => this._setToolEntityState(controlTool));

    this.evaluateJavascriptTemplates = false;
  }

  /** Assigns only the selected entity data after the separate runtime-config phase. */
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
      this.resolvedEntityConfigs = this._resolveEntityConfigs(this.config, true);
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

    let entityHasChanged = forceUpdate || themeChanged || configuredEntityStateChanged || this._getRenderableTools().some((tool) => tool.requiresHassUpdate());

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
    if (hassBecameAvailable) this._getRenderableTools().forEach((tool) => tool.hassAvailable());

    // Runtime configuration and entity data still run for forced, theme and history updates.
    // JavaScript evaluation still occurs only for an actual configured entity update.
    this.evaluateJavascriptTemplates = configuredEntityStateChanged;

    const toolsPerformanceStart = performanceEnabled ? performance.now() : undefined;

    // Runtime configuration is updated once before sparkline entity data.
    this.sparklineGraphTools.forEach((sparklineGraphTool) => sparklineGraphTool.updateRuntimeConfig());

    this.sparklineGraphTools = (this.sparklineGraphTools ?? []).map((sparklineGraphTool) => this._setToolEntityState(sparklineGraphTool));
    this._updateSparklineEntities();

    // Remaining runtime configurations can now use the current local sparkline entities.
    this.horseshoeGauges.forEach((horseshoe) => horseshoe.updateRuntimeConfig());
    this.nameTools.forEach((nameTool) => nameTool.updateRuntimeConfig());
    this.areaTools.forEach((areaTool) => areaTool.updateRuntimeConfig());
    this.stateTools.forEach((stateTool) => stateTool.updateRuntimeConfig());
    this.textTools.forEach((textTool) => textTool.updateRuntimeConfig());
    this.rectangleTools.forEach((rectangleTool) => rectangleTool.updateRuntimeConfig());
    this.lineTools.forEach((lineTool) => lineTool.updateRuntimeConfig());
    this.circleTools.forEach((circleTool) => circleTool.updateRuntimeConfig());
    this.arcTools.forEach((arcTool) => arcTool.updateRuntimeConfig());
    this.iconTools.forEach((iconTool) => iconTool.updateRuntimeConfig());
    this.controlTools.forEach((controlTool) => controlTool.updateRuntimeConfig());

    this.horseshoeGauges = this.horseshoeGauges.map((horseshoe) => this._setToolEntityState(horseshoe));
    this.nameTools = (this.nameTools ?? []).map((nameTool) => this._setToolEntityState(nameTool));
    this.areaTools = (this.areaTools ?? []).map((areaTool) => this._setToolEntityState(areaTool));
    this.stateTools = (this.stateTools ?? []).map((stateTool) => this._setToolEntityState(stateTool));
    this.textTools = (this.textTools ?? []).map((textTool) => this._setToolEntityState(textTool));
    this.rectangleTools = (this.rectangleTools ?? []).map((rectangleTool) => this._setToolEntityState(rectangleTool));
    this.lineTools = (this.lineTools ?? []).map((lineTool) => this._setToolEntityState(lineTool));
    this.circleTools = (this.circleTools ?? []).map((circleTool) => this._setToolEntityState(circleTool));
    this.arcTools = (this.arcTools ?? []).map((arcTool) => this._setToolEntityState(arcTool));
    this.iconTools = (this.iconTools ?? []).map((iconTool) => this._setToolEntityState(iconTool));
    this.controlTools = (this.controlTools ?? []).map((controlTool) => this._setToolEntityState(controlTool));

    if (performanceEnabled) {
      performance.measure(`FHS:${this.cardId}:tools`, {
        start: toolsPerformanceStart,
        end: performance.now(),
      });
    }

    // Evaluate a complete animation state item before matching its state and applying
    // its already active icons and styles. No animation field has a separate evaluator.
    const animationsPerformanceStart = performanceEnabled ? performance.now() : undefined;
    if (configuredEntityStateChanged && this.config.animations) {
      Object.keys(this.config.animations).forEach((animation) => {
        const entityIndex = animation.substr(Number(animation.indexOf('.') + 1));

        this.config.animations[animation].forEach((sourceAnimationItem) => {
          const animationContext = {
            ...sourceAnimationItem,
            entity_index: entityIndex,
          };
          const item = Templates.hasJavascriptTemplates(sourceAnimationItem) ? Templates.getJsTemplateOrValue(animationContext, sourceAnimationItem) : sourceAnimationItem;

          if (this.entities[entityIndex].state.toLowerCase() !== item.state.toLowerCase()) return;

          ['lines', 'vlines', 'hlines', 'circles', 'arcs', 'rectangles', 'names', 'areas', 'states', 'texts', 'controls'].forEach((section) => {
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
    config.layout.groups ??= [];
    config.layout.groups = this._assignIdItems(config.layout.groups);

    if (Array.isArray(config.layout.compounds)) {
      config.layout.compounds = this._assignIdItems(config.layout.compounds);

      config.layout.compounds.forEach((compound) => {
        VISIBLE_LAYOUT_SECTIONS.forEach((section) => {
          const children = compound[section];

          if (!Array.isArray(children)) return;

          compound[section] = this._assignIdItems(children);
        });
      });
    }

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
   * Removes statically disabled layout items after reuse has been compiled.
   *
   * A disabled base item remains available while same_as is expanded. Filtering
   * here then prevents every remaining disabled item from entering JavaScript
   * detection, entity resolution, tool construction or any runtime lifecycle.
   *
   * @param {object} config - Card config after ref, calc and same_as processing.
   */
  _removeDisabledLayoutItems(config) {
    VISIBLE_LAYOUT_SECTIONS.forEach((section) => {
      const items = config.layout[section];

      if (!Array.isArray(items)) return;

      config.layout[section] = items.filter((item) => {
        if (item.disabled === undefined) return true;

        return !ConfigHelper.isDisabled(item, item.disabled, section, Templates);
      });
    });
  }

  /**
   * Resolves item-level entity ids and animation triggers against the explicit entities list.
   *
   * Tools continue to consume entity_index internally while user YAML may use
   * the matching entity id directly. Unknown ids fail during configuration so
   * they can never silently fall back to the first entity.
   *
   * @param {object} config - Card config after ids and static values are resolved.
   * @param {Array<object>} resolvedEntitiesConfig - Explicit resolved entity configs.
   */
  _resolveLayoutItemEntityIndexes(config, resolvedEntitiesConfig) {
    const entityIndexes = {};

    resolvedEntitiesConfig.forEach((entityConfig, index) => {
      entityIndexes[entityConfig.entity] = entityIndexes[entityConfig.entity] === undefined ? index : null;
    });

    VISIBLE_LAYOUT_SECTIONS.forEach((section) => {
      const items = config.layout[section];

      if (!Array.isArray(items)) return;

      items.forEach((item) => {
        if (item.entity === undefined) return;
        if (entityIndexes[item.entity] === undefined) throw new Error(`[${section}] Unknown entity: ${item.entity}`);
        if (entityIndexes[item.entity] === null) throw new Error(`[${section}] Entity '${item.entity}' occurs more than once; use entity_index`);

        item.entity_index = entityIndexes[item.entity];
      });
    });

    if (config.animations !== undefined) {
      const resolvedAnimations = {};

      Object.entries(config.animations).forEach(([animationKey, animationItems]) => {
        const entityReference = animationKey.substring('entity.'.length);
        let entityIndex;

        if (/^\d+$/.test(entityReference)) {
          entityIndex = Number(entityReference);
          if (resolvedEntitiesConfig[entityIndex] === undefined) {
            throw new Error(`[animations] Unknown entity index: ${entityIndex}`);
          }
        } else {
          const slotMatch = entityReference.match(/^([A-Za-z_][A-Za-z0-9_]*)\[(\d+)\]$/);

          if (slotMatch) {
            const slotName = slotMatch[1];
            const slotIndex = Number(slotMatch[2]);
            const slot = this.entitySlots[slotName];

            if (slot === undefined) throw new Error(`[animations] Unknown entity slot: ${slotName}`);
            if (slot[slotIndex] === undefined) {
              throw new Error(`[animations] Entity slot ${slotName} has no index ${slotIndex}`);
            }

            entityIndex = slot[slotIndex];
          } else {
            entityIndex = entityIndexes[entityReference];
            if (entityIndex === undefined) throw new Error(`[animations] Unknown entity: ${entityReference}`);
            if (entityIndex === null) throw new Error(`[animations] Entity '${entityReference}' occurs more than once; use entity.<index>`);
          }
        }

        const resolvedAnimationKey = `entity.${entityIndex}`;
        if (resolvedAnimations[resolvedAnimationKey] !== undefined) {
          throw new Error(`[animations] Duplicate entity target: ${resolvedAnimationKey}`);
        }

        resolvedAnimations[resolvedAnimationKey] = animationItems;
      });

      config.animations = resolvedAnimations;
    }
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
   * Removes disabled entities before slot resolution.
   *
   * Entity slots are built only after this pass, so disabled entities cannot
   * leave empty or shifting slot addresses.
   *
   * @param {object} config - Card configuration with calculated static values.
   */
  _removeDisabledEntityConfigs(config) {
    config.entities = config.entities
      .map((entityConfig, index) => {
        if (entityConfig.disabled === undefined) return entityConfig;

        const item = {
          ...entityConfig,
          entity_index: index,
        };
        const disabled = ConfigHelper.isDisabled(item, entityConfig.disabled, 'entities', Templates);

        return {
          ...entityConfig,
          disabled,
        };
      })
      .filter((entityConfig) => entityConfig.disabled !== true);
  }

  /**
   * Builds the final slot map for the flat configured entity list.
   *
   * Slots are sticky: an entity with a slot changes the active slot for the
   * following entities. Every entity is also recorded in the internal flat
   * slot, so numeric indices and named slot references share one address model.
   *
   * @param {Array<object>} entityConfigs - Final entity configs after template merge.
   * @returns {object} Slot names mapped to flat entity indices.
   */
  _buildEntitySlots(entityConfigs) {
    const entitySlots = {
      flat: [],
      default: [],
    };
    let activeSlot = 'default';

    entityConfigs.forEach((entityConfig, index) => {
      if (entityConfig.slot !== undefined) {
        if (typeof entityConfig.slot !== 'string' || !/^[A-Za-z_][A-Za-z0-9_]*$/.test(entityConfig.slot)) {
          throw new Error(`[entities] Invalid slot ${entityConfig.slot} at index ${index}`);
        }
        if (entityConfig.slot === 'flat') {
          throw new Error('[entities] Slot name flat is reserved');
        }
        activeSlot = entityConfig.slot;
      }

      entityConfig.slot = activeSlot;
      entitySlots[activeSlot] ??= [];
      entitySlots[activeSlot].push(index);
      entitySlots.flat.push(index);
    });

    return entitySlots;
  }

  /**
   * Converts user-facing entity_index values into symbolic addresses before
   * compounds and SameAs inherit and modify them.
   *
   * @param {object} config - Card configuration after static values are resolved.
   */
  _normalizeEntityIndexAddresses(config) {
    const normalizeValue = (value) => {
      if (typeof value === 'number') {
        return { type: 'entity_address', slot: 'flat', index: value };
      }

      if (typeof value === 'string') {
        const slotMatch = value.match(/^([A-Za-z_][A-Za-z0-9_]*)\[(\d+)\]$/);
        if (slotMatch) {
          return {
            type: 'entity_address',
            slot: slotMatch[1],
            index: Number(slotMatch[2]),
          };
        }
      }

      throw new Error(`[layout] Invalid entity_index ${value}. Use a number or slot[index]`);
    };

    const visit = (value) => {
      if (Array.isArray(value)) {
        value.forEach((entry) => visit(entry));
        return;
      }

      if (!value || typeof value !== 'object') return;

      Object.entries(value).forEach(([key, entryValue]) => {
        if (key === 'entity_index' && entryValue !== undefined) {
          value[key] = normalizeValue(entryValue);
          return;
        }
        visit(entryValue);
      });
    };

    visit(config.layout);
  }

  /**
   * Flattens symbolic entity slot addresses into the numeric indices consumed by tools.
   *
   * @param {object} config - Card configuration after SameAs and entity-id resolution.
   */
  _flattenEntitySlotIndexes(config) {
    const visit = (value) => {
      if (Array.isArray(value)) {
        value.forEach((entry) => visit(entry));
        return;
      }

      if (!value || typeof value !== 'object') return;

      Object.entries(value).forEach(([key, entryValue]) => {
        if (key === 'entity_index' && entryValue?.type === 'entity_address') {
          const slot = this.entitySlots[entryValue.slot];
          if (slot === undefined) throw new Error(`[layout] Unknown entity slot ${entryValue.slot}`);
          if (entryValue.index >= slot.length) {
            throw new Error(`[layout] Entity slot ${entryValue.slot} has no index ${entryValue.index}`);
          }
          value[key] = slot[entryValue.index];
          return;
        }
        visit(entryValue);
      });
    };

    visit(config.layout);
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
  /**
   * Validates every configured gesture before tools may consume the config.
   *
   * Control-specific semantic actions are accepted here and converted by their
   * constructors. JavaScript action templates are validated after evaluation.
   *
   * @param {object} config - Final static card config after inheritance and disabled filtering.
   */
  _validateActionConfigs(config) {
    const gestureProperties = ['tap_action', 'hold_action', 'double_tap_action'];
    const validActions = [
      'none',
      'more-info',
      'toggle',
      'perform-action',
      'call-service',
      'navigate',
      'url',
      'assist',
      'fire-dom-event',
      'increment',
      'decrement',
      'select-option',
    ];

    const visit = (value, configPath) => {
      if (Array.isArray(value)) {
        value.forEach((entry, index) => visit(entry, `${configPath}[${index}]`));
        return;
      }

      if (!value || typeof value !== 'object') return;

      Object.entries(value).forEach(([property, propertyValue]) => {
        const propertyPath = configPath ? `${configPath}.${property}` : property;

        if (property === 'double_tap') {
          throw Error(`[actions] Invalid '${propertyPath}'; use 'double_tap_action'`);
        }

        if (gestureProperties.includes(property)) {
          const configuredActions = propertyValue.actions ?? [propertyValue];

          configuredActions.forEach((actionConfig, actionIndex) => {
            const actionPath = propertyValue.actions
              ? `${propertyPath}.actions[${actionIndex}].action`
              : `${propertyPath}.action`;

            if (!Templates.hasJavascriptTemplates(actionConfig.action)
              && !validActions.includes(actionConfig.action)) {
              throw Error(`[actions] Invalid action '${actionConfig.action}' at '${actionPath}'`);
            }
          });
        }

        visit(propertyValue, propertyPath);
      });
    };

    visit(config, '');
  }

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

    config.layout.groups.forEach((group) => {
      if (Templates.detectJavascriptTemplates(group)) cardHasJavascript = true;
    });

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

      this._assignSectionIds(config);

      const calcConstants = this._buildConstants(config);

      this._replaceStaticRefs(config, config.constants);
      this._calculateStaticValues(config, calcConstants);

      // Entity disabled templates use finalized constants but run before entity slots exist.
      Templates.setContext({
        hass: this._hass,
        config,
        entities: this.entities,
        horseshoes: this.horseshoes,
      });
      ControlTool.compileConfig(config, Templates);
      this._removeDisabledEntityConfigs(config);

      this.entitySlots = this._buildEntitySlots(config.entities);
      this._normalizeEntityIndexAddresses(config);
      Compounds.compile(config);
      SameAs.compile(config);

      this._removeDisabledLayoutItems(config);
      this.cardInputEntities.validateConfig(config);
      this._validateActionConfigs(config);

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
        entity_slots: this.entitySlots,
      });

      const resolvedEntitiesConfig = this._resolveEntityConfigs(config, false);
      this.cardInputEntities.initializeEntities(resolvedEntitiesConfig);

      if (resolvedEntitiesConfig.length > 0) {
        const newdomain = computeDomain(resolvedEntitiesConfig[0].entity);

        if (newdomain !== 'sensor' && newdomain !== 'fhs_input_number' && newdomain !== 'fhs_input_boolean') {
          if (resolvedEntitiesConfig[0].attribute && !isNaN(resolvedEntitiesConfig[0].attribute)) {
            throw Error('First entity or attribute must be a numbered sensorvalue, but is NOT');
          }
        }
      }

      this._resolveLayoutItemEntityIndexes(config, resolvedEntitiesConfig);
      this._flattenEntitySlotIndexes(config);

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

      this.horseshoeGauges = HorseshoeGauge.setConfig(config, Templates, this.cardId, this);
      this.cardTheme.setHorseshoes(this.horseshoeGauges);

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
      this.textTools = TextTool.setConfig(this.config, Templates, this.cardId, this);
      this.rectangleTools = RectangleTool.setConfig(this.config, Templates, this.cardId, this);
      this.lineTools = LineTool.setConfig(this.config, Templates, this.cardId, this);
      this.circleTools = CircleTool.setConfig(this.config, Templates, this.cardId, this);
      this.arcTools = ArcTool.setConfig(this.config, Templates, this.cardId, this);
      this.iconTools = IconTool.setConfig(this.config, Templates, this.cardId, this);
      this.controlTools = ControlTool.setConfig(this.config, Templates, this.cardId, this);
      this.sparklineGraphTools = SparklineGraphTool.setConfig(this.config, Templates, this.cardId, this);
      this.childCards.setConfig(this.config.cards ?? []);

      Templates.setContext({
        hass: this._hass,
        config: this.config,
        entities: this.entities,
        horseshoes: this.horseshoes,
        entity_slots: this.entitySlots,
      });
      if (this._hass !== undefined) this._getRenderableTools().forEach((tool) => tool.hassAvailable());

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
      texts: this.textTools,
      sparklines: this.sparklineGraphTools,
      controls: this.controlTools,
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
    this.cardInputEntities.connected();
    this.homeAssistant.connected();
    this._getRenderableTools().forEach((tool) => tool.connected());
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
      ...(this.textTools ?? []),
      ...(this.sparklineGraphTools ?? []),
      ...(this.controlTools ?? []),
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
   * Runs every tool first-update lifecycle after Lit creates the initial DOM.
   *
   * @param {Map} changedProperties - Lit changed properties map.
   */
  firstUpdated(changedProperties) {
    super.firstUpdated?.(changedProperties);

    this._getRenderableTools().forEach((tool) => tool.firstUpdated(changedProperties));

    this.sparklineGraphTools?.forEach((sparklineGraphTool) => sparklineGraphTool.attachPointerHandlers());
  }

  updated(changedProperties) {
    const performanceEnabled = this.dev.performance === true;
    const updatedPerformanceStart = performanceEnabled ? performance.now() : undefined;

    super.updated?.(changedProperties);

    this._getRenderableTools().forEach((tool) => tool.updated(changedProperties));
    this.sparklineGraphTools?.forEach((sparklineGraphTool) => sparklineGraphTool.attachPointerHandlers());

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
