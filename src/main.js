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
import CardLayout from './card-layout.js';
import ConfigHelper from './config-helper.js';
import Templates from './templates.js';
import { computeDomain } from './frontend_mods/common/entity/compute_domain.ts';
import ControlTool from './control-tool.js';
import SameAs from './same-as.js';
import Compounds from './compounds.js';
import CardTemplates from './card-templates.js';
import ChildCards from './child-cards.js';
import ExternalSvgSources from './icon-svg-source.js';
import { version } from '../package.json';

console.info(`%c FLEX-HORSESHOE-CARD %c Version ${version} `, 'color: white; font-weight: bold; background: darkgreen', 'color: darkgreen; font-weight: bold; background: white');

/**
 * Lovelace card combining SVG tools and embedded HA cards. Updates Sparklines
 * before other tools so fhs_sparkline.* values are current when templates run.
 */
class FlexHorseshoeCard extends LitElement {

  /** Sets up the shared entities, templates, tool sections and asynchronous SVG loads. */
  constructor() {
    super();

    this.cardId = Math.random().toString(36).substr(2, 9);
    this._hass = undefined;

    // Templates and tools keep this same array while HA and local FHS values change.
    this.entities = [];
    this.templates = new Templates(this.entities);

    this.cardLayout = new CardLayout(this.templates, this.cardId);
    this.cardTools = new CardTools(this, this.templates, this.cardId);
    this.homeAssistant = new HomeAssistant(() => this.cardTools.hassConnected());
    this.cardInputEntities = new CardInputEntities(this.cardId, this.entities, () => {

      if (this._hass !== undefined) this.updateSourceEntities(true, false);
    });
    this.actions = new CardActions(this, this.cardInputEntities);
    this.cardConfig = new CardConfig(this.templates);
    this.cardTheme = new CardTheme(
      this,
      () => this._updateGradientsAfterRender(),
      () => this.updatePalettePaint(),
    );
    this.cardEntities = new CardEntities(this.templates, this.cardTheme);
    this.childCards = new ChildCards(this);
    this.cardAnimations = new CardAnimations();
    this.runtimeEntityConfigs = [];
    this.entitySlots = { flat: [], default: [] };
    this.entityConfigsInitialized = false;
    this.evaluateJavascriptTemplates = false;
    this.sourceCardStyles = undefined;
    this.activeCardStyles = undefined;
    this.cardStylesHaveJavascript = false;
    this.iconCache = {};
    this.iconBoundsCache = {};
    this.svgUrlCache = {};
    this.entitiesIcon = {};
    this.entitiesIconKey = {};
    this.entitiesIconPending = new Map();
    this.externalSvgSources = new ExternalSvgSources(this);
    this.gradientUpdate = undefined;
    this.gradientsClosed = false;
    this.gradientsNeedUpdate = false;

    this.dev = {
      debug: false,
    };
    this.performanceUpdateStart = undefined;
    this.performanceRenderStart = undefined;
  }

  static styles = CardStyles;

  /** Receives Home Assistant updates from Lovelace. */
  set hass(hass) {
    this.setHass(hass);
  }

  /**
   * Refreshes palette colors after Lit has rendered and the browser has applied
   * theme CSS. Newer requests supersede a pending frame so old colors cannot
   * repaint a card after a theme change or dashboard removal.
   */
  async _updateGradientsAfterRender() {
    this.stopGradientUpdate();
    this.gradientsNeedUpdate = true;
    if (this.gradientsClosed) return;
    const update = { frame: undefined, completeFrame: undefined };
    this.gradientUpdate = update;
    try {
      await this.updateComplete;
      if (this.gradientUpdate !== update || this.gradientsClosed) return;
      await new Promise((complete) => {
        update.completeFrame = complete;
        update.frame = window.requestAnimationFrame(complete);
      });
      if (this.gradientUpdate !== update || this.gradientsClosed) return;
      this.gradientUpdate = undefined;
      this.gradientsNeedUpdate = false;

      // Read inherited CSS colors now, then refresh tool palettes before rendering.
      if (this.cardTheme.finishPaintUpdate()) this.cardTools.updatePalettePaint();
      this.requestUpdate();
    } catch (error) {
      if (this.gradientUpdate !== update || this.gradientsClosed) return;
      this.stopGradientUpdate();
      console.error('[FHC gradient update]', error);
    }
  }

  /** Cancels a palette refresh and releases its frame wait when replaced or disconnected. */
  stopGradientUpdate() {
    const update = this.gradientUpdate;
    if (update) {
      this.gradientUpdate = undefined;
      window.cancelAnimationFrame(update.frame);
      if (update.completeFrame) update.completeFrame();
    }
  }

  /**
   * Gives templates, embedded cards and actions the newest HA data, then checks
   * whether configured entities, formatting or theme changes require an FHS update.
   */
  setHass(hass) {
    const hassBecameAvailable = this._hass === undefined;

    this._hass = hass;
    this.templates.setHass(hass);
    this.homeAssistant.setHass(hass);
    const localeChanged = this.homeAssistant.localeChanged;
    const entityDisplayChanged = this.homeAssistant.entityDisplayChanged;
    const themeChanged = this.cardTheme.updateHass(hass);
    this.childCards.setHass(hass);

    this.actions.setHassAndEntities(hass, this.runtimeEntityConfigs, this.entities);

    this.updateSourceEntities(localeChanged || entityDisplayChanged || themeChanged, hassBecameAvailable);
  }

  /**
   * Updates configured HA/local entities and Sparkline data before other tools.
   * Unrelated HA traffic skips config evaluation and rendering unless a tool
   * still needs work, such as a History refresh after websocket reconnect.
   *
   * @param {boolean} contextChanged - Local input, theme, locale or HA formatting changed.
   * @param {boolean} hassBecameAvailable - This is the first HA update for the card.
   */
  updateSourceEntities(contextChanged, hassBecameAvailable) {
    const hass = this._hass;
    const performanceEnabled = this.dev.performance === true;
    const setHassPerformanceStart = performanceEnabled ? performance.now() : undefined;

    const entitiesPerformanceStart = performanceEnabled ? performance.now() : undefined;

    // HA replaces entity objects when their state or attributes change. Comparing
    // those references also catches updates whose formatted value stays the same.
    let configuredEntityStateChanged = this.cardInputEntities.stateChanged || !this.entityConfigsInitialized;
    const configuredEntityCount = this.runtimeEntityConfigs.length;

    for (let index = 0; index < configuredEntityCount; index += 1) {
      const activeEntityConfig = this.runtimeEntityConfigs[index];
      const entity = activeEntityConfig.local ? this.entities[index] : hass.states[activeEntityConfig.entity];

      if (!entity) continue;
      if (this.entities[index] !== entity) configuredEntityStateChanged = true;
      this.entities[index] = entity;
    }

    const hassContextChanged = configuredEntityStateChanged || contextChanged;

    if (!hassContextChanged && !this.cardTools.getRenderableTools().some((tool) => tool.requiresHassUpdate())) {
      if (performanceEnabled) {
        performance.measure(`FHS:${this.cardId}:setHass`, {
          start: setHassPerformanceStart,
          end: performance.now(),
        });
      }
      return;
    }

    // Entity templates can choose another sensor. Evaluate them before selecting
    // the final entities used by groups, tools and action targets.
    if (hassContextChanged) {
      this.runtimeEntityConfigs = this.cardEntities.buildRuntimeEntityConfigs(this.config, true);
      this.entityConfigsInitialized = true;
    }

    this.runtimeEntityConfigs.forEach((entityConfig, index) => {
      const entity = entityConfig.local ? this.entities[index] : hass.states[entityConfig.entity];

      if (entity) this.entities[index] = entity;
    });
    this.actions.setHassAndEntities(hass, this.runtimeEntityConfigs, this.entities);

    if (performanceEnabled) {
      performance.measure(`FHS:${this.cardId}:entities`, {
        start: entitiesPerformanceStart,
        end: performance.now(),
      });
    }

    const groupsPerformanceStart = performanceEnabled ? performance.now() : undefined;
    // Group templates can move, hide or scale nested tools; update groups first.
    this.cardLayout.updateGroups(hassContextChanged);

    if (performanceEnabled) {
      performance.measure(`FHS:${this.cardId}:groups`, {
        start: groupsPerformanceStart,
        end: performance.now(),
      });
    }

    if (hassBecameAvailable) this.cardTools.hassAvailable();

    this.evaluateJavascriptTemplates = hassContextChanged;

    const toolsPerformanceStart = performanceEnabled ? performance.now() : undefined;

    // Sparkline can change fhs_sparkline.* values used by Text, State, Horseshoe
    // and Controls. Store those values before evaluating their templates.
    this.cardTools.updateSparklineRuntimeConfig();
    this.cardTools.setSparklineEntityStates(this.runtimeEntityConfigs, this.entities);
    const changedEntityIndexes = this.cardEntities.updateSparklineEntities(
      this.runtimeEntityConfigs, this.entities, this.cardTools.getBySection('sparklines'),
    );
    if (performanceEnabled && this.performanceUpdateStart === undefined) {
      this.performanceUpdateStart = setHassPerformanceStart;
    }
    this.updateEntityPresentation(hassContextChanged, changedEntityIndexes);

    if (performanceEnabled) {
      performance.measure(`FHS:${this.cardId}:tools`, {
        start: toolsPerformanceStart,
        end: performance.now(),
      });
    }

    if (performanceEnabled) {
      performance.measure(`FHS:${this.cardId}:setHass`, {
        start: setHassPerformanceStart,
        end: performance.now(),
      });
    }
  }

  /**
   * Updates tools using fhs_sparkline.* when a History request changes status or
   * graph rows change at a response or bin boundary. Refresh their text and styles
   * from the Sparkline's current statistics and request state.
   */
  updateSparklineResult(graphTool) {
    const changedEntityIndexes = this.cardEntities.updateSparklineEntities(
      this.runtimeEntityConfigs, this.entities, [graphTool],
    );
    this.updateEntityPresentation(false, changedEntityIndexes);
  }

  /**
   * Updates styles, animations and displayed content after the shared entity
   * values are current, whether they came from HA or a completed History request.
   *
   * @param {boolean} contextChanged - Configured HA/FHS entity, theme, locale or HA formatting changed.
   * @param {Array<number>} changedEntityIndexes - fhs_sparkline.* entries whose value/metadata changed.
   */
  updateEntityPresentation(contextChanged, changedEntityIndexes) {
    this.evaluateJavascriptTemplates = contextChanged || changedEntityIndexes.length > 0;

    // Entity and group templates may read any fhs_sparkline.* entry. Reevaluate
    // them with the new graph values before binding the remaining tools.
    if (changedEntityIndexes.length > 0) {
      this.runtimeEntityConfigs = this.cardEntities.buildRuntimeEntityConfigs(this.config, true, this.cardTools.getBySection('sparklines'));
      this.cardLayout.updateGroups(true);
    }
    const cardStylesPerformanceStart = this.dev.performance === true ? performance.now() : undefined;
    if (this.evaluateJavascriptTemplates && this.cardStylesHaveJavascript) {
      this.activeCardStyles = this.templates.getJsTemplateOrValue({ entity_index: 0 }, this.sourceCardStyles);
    }
    if (this.dev.performance === true) {
      performance.measure(`FHS:${this.cardId}:card-styles`, { start: cardStylesPerformanceStart, end: performance.now() });
    }

    this.runtimeEntityConfigs.forEach((entityConfig, index) => {
      const entity = entityConfig.local ? this.entities[index] : this._hass.states[entityConfig.entity];
      if (!entity) return;
      this.entities[index] = entity;
    });
    this.actions.setHassAndEntities(this._hass, this.runtimeEntityConfigs, this.entities);
    this.cardTools.updateRuntimeConfig();

    const animationsPerformanceStart = this.dev.performance === true ? performance.now() : undefined;
    this.cardAnimations.update(this.config, this.entities, this.templates, this.evaluateJavascriptTemplates);
    if (this.dev.performance === true) {
      performance.measure(`FHS:${this.cardId}:animations`, { start: animationsPerformanceStart, end: performance.now() });
    }

    // Animations can change fonts. Choose their styles before Text measures its
    // displayed parts, and then refresh legends with the final entity values.
    this.cardTools.setRuntimeEntityStates(this.runtimeEntityConfigs, this.entities);
    this.cardTools.updateSparklinePresentation();

    this.evaluateJavascriptTemplates = false;
    this.cardInputEntities.markStateHandled();
    this.cardLayout.markGroupsHandled();
    this.homeAssistant.markLocaleHandled();
    this.homeAssistant.markEntityDisplayHandled();
    this.cardTheme.markModeHandled();

    // Lit reuses unchanged DOM values; graph calculations and text measurements
    // repeat only when the inputs they use have changed.
    this.requestUpdate();
  }

  /** Schedules a refresh when an external palette becomes available. */
  updatePalettePaint() {
    this._updateGradientsAfterRender();
  }

  /**
   * Compiles a Lovelace config into entities, groups and layout tools. Named
   * templates and calc expressions are expanded before disabled items, slots
   * and same_as references are finalized; tools then keep their own JS source.
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

      // A card template can supply the required entities and layout sections.
      CardTemplates.compile(config, this);
      this.templates.beginConfig(config);

      this.cardConfig.initializeDeveloperConfig(config);
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

      // Compile constants before Control and disabled-item expressions read them.
      this.cardConfig.assignLayoutItemIds(config);
      this.cardConfig.compileStaticValues(config);

      ControlTool.compileConfig(config, this.templates);
      this.cardConfig.removeDisabledEntityConfigs(config);

      // Keep named entity addresses usable while compounds and same_as expand,
      // then convert the completed bindings into the shared entity array indexes.
      this.entitySlots = this.cardConfig.buildEntitySlots(config.entities);
      this.templates.setEntitySlots(this.entitySlots);
      this.cardConfig.normalizeEntityIndexAddresses(config);
      Compounds.compile(config);
      SameAs.compile(config);

      this.cardConfig.removeDisabledLayoutItems(config);
      this.cardInputEntities.validateConfig(config);
      this.cardConfig.validateActionConfigs(config);

      // Detect JS once so each tool evaluates only its own authored fields later.
      this.templates.detectJavascriptTemplates(config);

      const resolvedEntitiesConfig = this.cardEntities.buildRuntimeEntityConfigs(config, false);
      this.cardInputEntities.initializeEntities(resolvedEntitiesConfig);

      if (resolvedEntitiesConfig.length > 0) {
        const newdomain = computeDomain(resolvedEntitiesConfig[0].entity);

        if (
          newdomain !== 'sensor'
          && newdomain !== 'fhs_input_number'
          && newdomain !== 'fhs_input_boolean'
          && newdomain !== 'fhs_input_select'
        ) {
          if (resolvedEntitiesConfig[0].attribute && !isNaN(resolvedEntitiesConfig[0].attribute)) {
            throw Error('First entity or attribute must be a numbered sensorvalue, but is NOT');
          }
        }
      }

      this.cardConfig.resolveLayoutEntityIndexes(config, resolvedEntitiesConfig, this.entitySlots);
      this.cardConfig.flattenEntitySlotIndexes(config, this.entitySlots);
      this.cardConfig.initializeCardRuntimeDefaults(config);

      this.config = config;
      this.stopGradientUpdate();
      this.externalSvgSources.clearPendingRequests();
      this.sourceCardStyles = this.config.styles;
      this.activeCardStyles = this.sourceCardStyles;
      this.cardStylesHaveJavascript = this.templates.hasJavascriptTemplates(this.sourceCardStyles);
      this.entityConfigsInitialized = false;
      this.cardLayout.setConfig(this.config);

      // Stop the old tools' timers, listeners and measurements before replacement.
      this.cardTools.clearTools();
      this.cardTools.setHorseshoeConfig(config);

      this.cardTools.setLayoutToolConfig(this.config);
      this.cardTheme.loadPalettes(this.config.palettes ?? {}).catch((error) => console.error('[FHC palettes]', error));
      this.childCards.setConfig(this.config.cards ?? []).catch((error) => console.error('[FHC child cards]', error));

      if (this._hass !== undefined) this.cardTools.hassAvailable();

      // Editing YAML on a mounted card does not trigger connectedCallback again.
      // Let replacement tools start now and bind their SVG after the next render.
      if (this.isConnected) this.cardTools.connected();

      // A removed card keeps replacement tools stopped until it reconnects.
      else if (this.cardTools.disconnectedFromCard) this.cardTools.disconnected();

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

  /** Starts input synchronization, History, icon loads and tool listeners on dashboard entry. */
  connectedCallback() {
    super.connectedCallback();
    this.gradientsClosed = false;
    this.cardTheme.connected();
    this.childCards.connected();
    this.externalSvgSources.connected();

    // FHS input events synchronize local values between cards on the dashboard.
    this.cardInputEntities.connected();

    // HA emits ready after reconnecting; Sparklines can then refresh History.
    this.homeAssistant.connected();

    this.cardTools.connected();
    if (this.gradientsNeedUpdate && !this.gradientUpdate) this._updateGradientsAfterRender();

    // A reused card can retain SVG nodes. Render once so tools reattach listeners
    // and measured animation paths that were released on dashboard removal.
    this.requestUpdate();
  }

  /** Stops dashboard listeners, timers, drags and pending SVG/palette work on removal. */
  disconnectedCallback() {
    this.gradientsClosed = true;
    this.stopGradientUpdate();

    this.cardInputEntities.disconnected();
    this.homeAssistant.disconnected();

    this.cardTools.disconnected();
    this.cardTheme.disconnected();
    this.childCards.disconnected();
    this.externalSvgSources.disconnected();
    super.disconnectedCallback();
  }

  /** Draws the SVG tools, HTML tooltips and embedded HA cards with the current card styles. */
  render() {
    const performanceEnabled = this.dev.performance === true;
    const renderPerformanceStart = performanceEnabled ? performance.now() : undefined;

    if (performanceEnabled) this.performanceRenderStart = renderPerformanceStart;

    const cardStyle = ConfigHelper.toStyleDict(this.activeCardStyles);

    const cardTemplate = html`
      <ha-card style=${styleMap(cardStyle)}>
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

  /** Uses the configured viewBox ratio while the browser scales SVG to the card width. */
  _renderSvg() {
    return svg`
        <svg xmlns="http://www/w3.org/2000/svg" xmlns:xlink="http://www/w3.org/1999/xlink"
            class="${this.config.card_filter}"
          viewBox='0 0 ${this.cardLayout.viewBox.width} ${this.cardLayout.viewBox.height}'>
            ${this.cardLayout.renderSvgDefs()}
            <g id="layout-tools" class="layout-tools">
              ${this._renderLayoutTools()}
            </g>
        </svg>
      `;
  }

  /** Draws all sections together in zpos order, allowing any tool to overlap another. */
  _renderLayoutTools() {
    return svg`
      ${this.cardTools.getSortedRenderableTools().map((tool) => tool.render())}
    `;
  }

  /** Draws tooltips in HTML so they can extend beyond a Sparkline's SVG bounds. */
  _renderSparklineTooltips() {
    return html` <div class="sparkline-tooltip-layer">${this.cardTools.getBySection('sparklines').map((sparklineGraphTool) => sparklineGraphTool.renderTooltip())}</div> `;
  }

  /** Lets tools initialize once their first SVG elements exist. */
  firstUpdated(changedProperties) {
    super.firstUpdated?.(changedProperties);

    this.cardTools.firstUpdated(changedProperties);
  }

  /**
   * Lets tools measure Text, read Path lengths and bind pointer listeners after
   * rendering. Optional timing includes follow-up renders requested by measurements.
   */
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

      // Exact Text measurements can require one more render to fit or position it.
      if (this.isUpdatePending) this.performanceUpdateStart = updatedPerformanceEnd;
    }
  }

  /** Gives Lovelace a masonry height estimate; the SVG aspect ratio sets actual height. */
  getCardSize() {
    return 4;
  }
}

if (!customElements.get('flex-horseshoe-card')) {
  customElements.define('flex-horseshoe-card', FlexHorseshoeCard);
}
