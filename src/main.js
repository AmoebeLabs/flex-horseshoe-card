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
    this.templates = new Templates();
    this.cardLayout = new CardLayout(this.templates, this.cardId);
    this.cardTools = new CardTools(this, this.templates, this.cardId);
    this.homeAssistant = new HomeAssistant(() => this.cardTools.hassConnected());
    this.entities = [];
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
    this.colorCache = {};
    this.iconCache = {};
    this.svgUrlCache = {};

    this.dev = {
      debug: false,
    };
    this.performanceUpdateStart = undefined;
    this.performanceRenderStart = undefined;
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
    this.templates.setContext({
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

    this.templates.setContext({
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

    this.templates.setContext({
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
    this.cardLayout.updateGroups(configuredEntityStateChanged);

    if (performanceEnabled) {
      performance.measure(`FHS:${this.cardId}:groups`, {
        start: groupsPerformanceStart,
        end: performance.now(),
      });
    }

    const cardStylesPerformanceStart = performanceEnabled ? performance.now() : undefined;
    if (configuredEntityStateChanged && this.cardStylesHaveJavascript) {
      this.activeCardStyles = this.templates.getJsTemplateOrValue({ entity_index: 0 }, this.sourceCardStyles);
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
    this.cardAnimations.update(this.config, this.entities, this.templates, configuredEntityStateChanged);

    if (performanceEnabled) {
      performance.measure(`FHS:${this.cardId}:animations`, {
        start: animationsPerformanceStart,
        end: performance.now(),
      });
    }

    this.evaluateJavascriptTemplates = false;
    this.cardInputEntities.markStateHandled();
    this.cardLayout.markGroupsHandled();

    this.templates.setContext({
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
      this.templates.setContext({
        hass: this._hass,
        config,
        entities: this.entities,
        horseshoes: this.horseshoes,
      });
      ControlTool.compileConfig(config, this.templates);
      this.cardConfig.removeDisabledEntityConfigs(config);

      this.entitySlots = this.cardConfig.buildEntitySlots(config.entities);
      this.cardConfig.normalizeEntityIndexAddresses(config);
      Compounds.compile(config);
      SameAs.compile(config);

      this.cardConfig.removeDisabledLayoutItems(config);
      this.cardInputEntities.validateConfig(config);
      this.cardConfig.validateActionConfigs(config);

      this.cardConfig.detectJavascriptTemplates(config);

      this.templates.setContext({
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
      this.cardStylesHaveJavascript = this.templates.hasJavascriptTemplates(this.sourceCardStyles);
      this.entityConfigsInitialized = false;
      this.cardLayout.setConfig(this.config, this.horseshoes);

      this.cardTools.setHorseshoeConfig(config);
      this.cardTheme.setHorseshoes(this.cardTools.getBySection('horseshoes'));

      this.cardTools.setLayoutToolConfig(this.config);
      this.childCards.setConfig(this.config.cards ?? []);

      this.templates.setContext({
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
  _renderSvg() {
    // For some reason, using a var/const for the viewboxsize doesn't work.
    // Even if the Chrome inspector shows 200 200. So hardcode for now!
    // const { viewBoxSize, } = this;
    //    console.log('Rendering SVG!!!!!!!!!!');
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
   * Renders all layout tools through one globally sorted zpos pipeline.
   *
   * @returns {TemplateResult} Sorted SVG layout tool templates.
   */
  _renderLayoutTools() {
    return svg`
      ${this.cardTools.getSortedRenderableTools().map((tool) => tool.render())}
    `;
  }

  _renderSparklineTooltips() {
    return html` <div class="sparkline-tooltip-layer">${this.cardTools.getBySection('sparklines').map((sparklineGraphTool) => sparklineGraphTool.renderTooltip())}</div> `;
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

  getCardSize() {
    return 4;
  }
}

if (!customElements.get('flex-horseshoe-card')) {
  customElements.define('flex-horseshoe-card', FlexHorseshoeCard);
}
