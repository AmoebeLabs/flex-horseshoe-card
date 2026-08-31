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
import Colors from './colors.js';
import StateTool from './state-tool.js';
import ControlTool from './control-tool.js';
import SameAs from './same-as.js';
import Compounds from './compounds.js';
import CardTemplates from './card-templates.js';
import ChildCards from './child-cards.js';
import { version } from '../package.json';

console.info(`%c FLEX-HORSESHOE-CARD %c Version ${version} `, 'color: white; font-weight: bold; background: darkgreen', 'color: darkgreen; font-weight: bold; background: white');

/**
 * Lovelace owns configuration and Home Assistant state delivery; Lit owns DOM
 * connection and rendering. These entry points keep config compilation, entity
 * updates and post-render DOM work in their corresponding lifecycle phases.
 */
class FlexHorseshoeCard extends LitElement {
  /**
   * Assembles the per-card domains and their callbacks once. Lovelace config,
   * Home Assistant updates and Lit rendering then reuse these same objects for the
   * complete custom-element lifecycle.
   */
  constructor() {
    super();

    Colors.setElement(this);

    // A card-specific id scopes generated SVG definitions and their references
    // to this card inside the shared dashboard document.
    this.cardId = Math.random().toString(36).substr(2, 9);
    this._hass = undefined;

    // Templates retains this array reference for the complete card lifecycle.
    // Entity updates replace array entries, and the shared reference gives every
    // tool the current data throughout the card lifecycle.
    this.entities = [];
    this.templates = new Templates(this.entities);

    // These domains own configuration, tools, HA connection state and local input
    // behavior. Main only orders their Lovelace, hass and Lit lifecycle phases.
    this.cardLayout = new CardLayout(this.templates, this.cardId);
    this.cardTools = new CardTools(this, this.templates, this.cardId);
    this.homeAssistant = new HomeAssistant(() => this.cardTools.hassConnected());
    this.cardInputEntities = new CardInputEntities(this.cardId, this.entities, () => this.setHass(this._hass));
    this.actions = new CardActions(this, this.cardInputEntities);
    this.cardConfig = new CardConfig(this.templates);
    this.cardTheme = new CardTheme(
      this,
      () => this._updateGradientsAfterRender(),
      () => {
        if (this._hass) this.setHass(this._hass, true);
        this.requestUpdate();
      },
    );
    this.cardEntities = new CardEntities(this.templates, this.cardTheme);
    this.entitiesStr = [];
    this.attributesStr = [];
    this.childCards = new ChildCards(this);
    this.cardAnimations = new CardAnimations();
    this.resolvedEntityConfigs = [];
    this.entitySlots = { flat: [], default: [] };
    this.entityConfigsInitialized = false;
    this.evaluateJavascriptTemplates = false;
    this.sourceCardStyles = undefined;
    this.activeCardStyles = undefined;
    this.cardStylesHaveJavascript = false;
    this.iconCache = {};
    this.svgUrlCache = {};

    this.dev = {
      debug: false,
    };
    this.performanceUpdateStart = undefined;
    this.performanceRenderStart = undefined;
  }

  /** Lit adopts this shared stylesheet into every card shadow root once per class. */
  static styles = CardStyles;

  /**
   * Home Assistant lifecycle: Lovelace assigns a new hass object whenever global
   * state, services, themes or user data change.
   */
  set hass(hass) {
    this.setHass(hass);
  }

  /**
   * Recalculates gradients after theme CSS variables are present in the DOM.
   *
   * updateComplete waits for Lit's current commit; requestAnimationFrame then
   * lets the browser apply new theme variables before the follow-up render reads
   * palette colors and rebuilds gradients.
   */
  async _updateGradientsAfterRender() {
    await this.updateComplete;
    await new Promise(requestAnimationFrame);
    this.requestUpdate();
  }

  /**
   * Processes one Home Assistant update and requests a Lit render only when card
   * entities, runtime config, theme data or history-dependent tools changed.
   */
  setHass(hass, forceUpdate = false) {
    const performanceEnabled = this.dev.performance === true;
    const setHassPerformanceStart = performanceEnabled ? performance.now() : undefined;
    const hassBecameAvailable = this._hass === undefined;

    this._hass = hass;
    this.templates.setHass(hass);
    this.homeAssistant.setHass(hass);
    const localeChanged = this.homeAssistant.localeChanged;
    const entityDisplayChanged = this.homeAssistant.entityDisplayChanged;
    const themeChanged = this.cardTheme.updateHass(hass);
    this.childCards.setHass(hass);

    const entitiesPerformanceStart = performanceEnabled ? performance.now() : undefined;

    // Local fhs_sparkline entities enter through the same update pipeline after
    // their graph has published new statistics into the persistent entity array.
    const localEntityStateChanged = this.cardEntities.stateChanged;

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

    // Entity state, display metadata, locale and theme changes publish a new
    // Hass context to every context-dependent card domain during this pass.
    const hassContextChanged = configuredEntityStateChanged || localeChanged || entityDisplayChanged || themeChanged;

    // Evaluate every marked entity config exactly once for this configured state update.
    // Static entity configs retain their compiled source object.
    if (hassContextChanged) {
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

    if (performanceEnabled) {
      performance.measure(`FHS:${this.cardId}:entities`, {
        start: entitiesPerformanceStart,
        end: performance.now(),
      });
    }

    // Groups are complete runtime components. Evaluate marked groups before tools,
    // rebuild the manager only for changed results, and mark every dependent descendant.
    const groupsPerformanceStart = performanceEnabled ? performance.now() : undefined;
    this.cardLayout.updateGroups(hassContextChanged);

    if (performanceEnabled) {
      performance.measure(`FHS:${this.cardId}:groups`, {
        start: groupsPerformanceStart,
        end: performance.now(),
      });
    }

    const cardStylesPerformanceStart = performanceEnabled ? performance.now() : undefined;
    if (hassContextChanged && this.cardStylesHaveJavascript) {
      this.activeCardStyles = this.templates.getJsTemplateOrValue({ entity_index: 0 }, this.sourceCardStyles);
    }

    if (performanceEnabled) {
      performance.measure(`FHS:${this.cardId}:card-styles`, {
        start: cardStylesPerformanceStart,
        end: performance.now(),
      });
    }

    // Every Hass context change runs the remaining runtime phases and commits a
    // complete Lit render. Tools can request the same pass for async local data.
    let renderRequired = forceUpdate
      || hassContextChanged
      || localEntityStateChanged
      || this.cardTools.getRenderableTools().some((tool) => tool.requiresHassUpdate());

    this.resolvedEntityConfigs.forEach((entityConfig, index) => {
      const entity = entityConfig.local ? this.entities[index] : hass.states[entityConfig.entity];

      if (!entity) return;

      this.entities[index] = entity;

      const newStateStr = StateTool.buildState(entity.state, entityConfig, this._hass, entity);

      if (newStateStr !== this.entitiesStr[index]) {
        this.entitiesStr[index] = newStateStr;
        renderRequired = true;
      }

      // eslint-disable-next-line prefer-object-has-own
      if (entityConfig.attribute && Object.prototype.hasOwnProperty.call(entity.attributes, entityConfig.attribute)) {
        const newAttributeStr = StateTool.buildState(entity.attributes[entityConfig.attribute], entityConfig, this._hass, entity);

        if (newAttributeStr !== this.attributesStr[index]) {
          this.attributesStr[index] = newAttributeStr;
          renderRequired = true;
        }
      }
    });

    if (!renderRequired) {
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

    // Every Hass context change re-evaluates JavaScript-backed tool configuration.
    this.evaluateJavascriptTemplates = hassContextChanged;

    const toolsPerformanceStart = performanceEnabled ? performance.now() : undefined;

    // Every state assignment follows runtime-config activation. Local sparkline
    // states keep evaluateJavascriptTemplates disabled because their data changed,
    // while the card's Home Assistant configuration context remained the same.
    this.cardTools.updateSparklineRuntimeConfig();
    this.cardTools.setSparklineEntityStates(this.resolvedEntityConfigs, this.entities);
    this.cardEntities.updateSparklineEntities(this.resolvedEntityConfigs, this.entities, this.cardTools.getBySection('sparklines'));
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
    this.cardAnimations.update(
      this.config,
      this.entities,
      this.templates,
      configuredEntityStateChanged || localEntityStateChanged,
    );

    if (performanceEnabled) {
      performance.measure(`FHS:${this.cardId}:animations`, {
        start: animationsPerformanceStart,
        end: performance.now(),
      });
    }

    this.evaluateJavascriptTemplates = false;
    this.cardInputEntities.markStateHandled();
    this.cardEntities.markStateHandled();
    this.cardLayout.markGroupsHandled();
    this.homeAssistant.markLocaleHandled();
    this.homeAssistant.markEntityDisplayHandled();

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

  /**
   * Lovelace lifecycle: compiles and validates one user-facing card configuration.
   *
   * Lovelace calls setConfig when it creates the card or replaces its YAML/config.
   * The order remains explicit because each phase consumes the previous phase:
   * templates, static values, controls, slots, inheritance, runtime entities and
   * finally concrete tool instances.
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
      // A root template may create required sections such as entities and layout.
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
      if (config?.palettes) this.cardTheme.loadPalettes(config.palettes);

      // Compile static syntax before controls and disabled templates inspect config.
      this.cardConfig.assignLayoutItemIds(config);
      this.cardConfig.compileStaticValues(config);

      // Entity disabled templates use finalized constants but run before entity slots exist.
      ControlTool.compileConfig(config, this.templates);
      this.cardConfig.removeDisabledEntityConfigs(config);

      // `entity_index: sensors[1]` remains symbolic through compound/same_as expansion.
      this.entitySlots = this.cardConfig.buildEntitySlots(config.entities);
      this.templates.setEntitySlots(this.entitySlots);
      this.cardConfig.normalizeEntityIndexAddresses(config);
      Compounds.compile(config);
      SameAs.compile(config);

      this.cardConfig.removeDisabledLayoutItems(config);
      this.cardInputEntities.validateConfig(config);
      this.cardConfig.validateActionConfigs(config);

      this.cardConfig.detectJavascriptTemplates(config);

      // Runtime entity templates now receive the final entity-slot map.
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
      this.sourceCardStyles = this.config.styles;
      this.activeCardStyles = this.sourceCardStyles;
      this.cardStylesHaveJavascript = this.templates.hasJavascriptTemplates(this.sourceCardStyles);
      this.entityConfigsInitialized = false;
      this.cardLayout.setConfig(this.config, this.horseshoes);

      this.cardTools.setHorseshoeConfig(config);
      this.cardTheme.setHorseshoes(this.cardTools.getBySection('horseshoes'));

      this.cardTools.setLayoutToolConfig(this.config);
      this.childCards.setConfig(this.config.cards ?? []);

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

  /**
   * Lit/custom-element lifecycle: runs when the card enters the DOM.
   * Event listeners and tool connections may be attached from this point onward.
   */
  connectedCallback() {
    super.connectedCallback();

    // Global FHS input events synchronize card-scoped representations between
    // cards while they are present together in the dashboard DOM.
    this.cardInputEntities.connected();

    // The HA connection emits `ready` after websocket reconnects. Tools use that
    // signal to request fresh history for the reconnected session.
    // Temporarily disabled to isolate websocket-ready history resynchronization during tab-resume testing.
    // this.homeAssistant.connected();

    // Visual tools may own timers or nested lifecycle-aware content. Forwarding
    // connection here keeps those resources tied to the parent card's DOM life.
    this.cardTools.connected();
  }

  /**
   * Lit/custom-element lifecycle: runs when the card leaves the DOM.
   * Card-owned listeners are detached so reconnecting does not duplicate them.
   */
  disconnectedCallback() {
    // Dashboard and websocket listener lifetimes follow the card's DOM
    // connection lifecycle.
    this.cardInputEntities.disconnected();
    this.homeAssistant.disconnected();

    // Sparkline timers, active slider pointer listeners and nested visual
    // resources must stop even when disconnection happens during interaction.
    this.cardTools.disconnected();
    super.disconnectedCallback();
  }

  /**
   * Lit lifecycle: returns the DOM template whenever Lit schedules a render.
   * This method describes output only; DOM measurements happen after rendering.
   */
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

  /**
   * Leaves SVG width and height unset so the browser scales the configured
   * viewBox to the card width while preserving CardLayout's aspect ratio.
   */
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

  /**
   * Sorts all tool sections together so zpos can place, for example, a control
   * above a line even though those tools originate from different config arrays.
   *
   * @returns {TemplateResult} Sorted SVG layout tool templates.
   */
  _renderLayoutTools() {
    return svg`
      ${this.cardTools.getSortedRenderableTools().map((tool) => tool.render())}
    `;
  }

  /**
   * Renders sparkline tooltips in an HTML layer outside SVG.
   *
   * The HTML overlay uses viewport pointer coordinates and remains visible when
   * tooltip content extends beyond the graph's SVG bounds.
   */
  _renderSparklineTooltips() {
    return html` <div class="sparkline-tooltip-layer">${this.cardTools.getBySection('sparklines').map((sparklineGraphTool) => sparklineGraphTool.renderTooltip())}</div> `;
  }

  /**
   * Lit lifecycle: runs once after Lit creates and commits the initial DOM.
   *
   * @param {Map} changedProperties - Lit changed properties map.
   */
  firstUpdated(changedProperties) {
    super.firstUpdated?.(changedProperties);

    this.cardTools.firstUpdated(changedProperties);
  }

  /**
   * Lit lifecycle: runs after every committed render, including the first one.
   * Tools can now read rendered DOM and attach handlers to replaced SVG elements.
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

      // Text measurement can request one follow-up Lit update from a tool's updated callback.
      if (this.isUpdatePending) this.performanceUpdateStart = updatedPerformanceEnd;
    }
  }


  /**
   * Returns Lovelace's masonry-layout estimate. The actual rendered height still
   * follows CardLayout's SVG aspect ratio.
   */
  getCardSize() {
    return 4;
  }
}

if (!customElements.get('flex-horseshoe-card')) {
  customElements.define('flex-horseshoe-card', FlexHorseshoeCard);
}
