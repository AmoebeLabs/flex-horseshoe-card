import { svg } from 'lit';
import Colors from './colors.js';
import { createValueAnimatorState, DEFAULT_STATE_ANIMATION, getStateAnimationConfig as getAnimatorConfig, startValueAnimation as runValueAnimation } from './horseshoe-animator.js';
import { GaugeGeometry, GaugeScale } from './horseshoe-geometry.js';
import {
  renderHorseshoeBackgroundLayer,
  renderLabelBackgroundLayer,
  renderLabelBadgesLayer,
  renderLabelsLayer,
  renderScaleLayer,
  renderStateLayer,
  renderTickmarkBackgroundLayer,
  renderTickmarksLayer,
  updateStatePathElements,
} from './horseshoe-renderer.js';
import { buildHorseshoeBackgroundItems, buildLabelBackgroundItems, buildLabelItems, buildScalePathItems, buildStatePathItems } from './horseshoe-shapes.js';
import { getGaugeStateData, normalizeBaseConfig } from './horseshoe-state.js';
import buildTickPathItems, { buildTickBackgroundItems } from './horseshoe-tickmarks.js';

/**
 * Coordinates runtime state, geometry, path builders, and SVG render layers for one v2 horseshoe.
 */
export default class HorseshoeGauge {
  /**
   * Builds gauge instances from the v2 horseshoe layout configuration.
   *
   * @param {object} config - Full card configuration.
   * @param {object} templates - Template resolver used by state normalization.
   * @param {string} cardId - Stable card id used for SVG element ids.
   * @param {LitElement} card - Card instance used for DOM updates.
   * @returns {Array<HorseshoeGauge>} Configured gauge instances.
   */
  static setConfig(config, templates, cardId, card) {
    // Hack for testing
    // Set legacy
    if (config.layout && !config.layout.horseshoes_v2) {
      config.layout.horseshoes_v2 = 'legacy';
    }
    const horseshoes = config.layout?.horseshoes_v2 === 'legacy' ? [HorseshoeGauge.getLegacyRootConfig(config)] : Array.isArray(config.layout?.horseshoes_v2) ? config.layout.horseshoes_v2 : [];

    return horseshoes
      .filter(Boolean)
      .map((horseshoeConfig, index) => new HorseshoeGauge(normalizeBaseConfig(horseshoeConfig, index, config.layout?.groups), index, templates, cardId, card))
      .filter((horseshoe) => horseshoe.show?.horseshoe !== false);
  }

  /**
   * Copies the root-level legacy horseshoe fields into one v2 gauge config for test rendering.
   *
   * @param {object} config - Full card configuration.
   * @returns {object|undefined} Root legacy horseshoe config for the v2 renderer.
   */
  static getLegacyRootConfig(config) {
    const legacyConfig = {};

    [
      'entity_index',
      'show',
      'horseshoe_position',
      'horseshoe_scale',
      'horseshoe_state',
      'horseshoe_background',
      'horseshoe_labels',
      'horseshoe_tickmarks',
      'color_stops',
      'colorstops',
      'styles',
      'bar_mode',
      'radius',
      'tickmarks_radius',
      'arc_degrees',
      'start_angle',
      'rotate',
      'flip',
      'xpos',
      'ypos',
      'yposc',
    ].forEach((field) => {
      if (config[field] !== undefined) {
        legacyConfig[field] = config[field];
      }
    });

    return Object.keys(legacyConfig).length ? legacyConfig : undefined;
  }

  /**
   * Stores static gauge inputs and initializes per-entity runtime state.
   *
   * @param {object} config - Normalized base horseshoe configuration.
   * @param {number} index - Gauge index inside the layout.
   * @param {object} templates - Template resolver for dynamic configuration.
   * @param {string} cardId - Stable card id used for SVG element ids.
   * @param {LitElement} card - Card instance used for targeted DOM updates.
   */
  constructor(config, index, templates, cardId, card) {
    this.config = config;
    this.index = index;
    this.templates = templates;
    this.cardId = cardId;
    this.card = card;
    this.entity_index = config.entity_index ?? 0;
    this.show = config.show;

    this.entity = undefined;
    this.entityConfig = undefined;
    this.rawState = undefined;
    this.value = undefined;
    this.displayValue = undefined;
    this.mappedState = undefined;

    this.runtimeConfig = undefined;
    this.scale = undefined;
    this.geometry = undefined;

    this.valueAnimator = createValueAnimatorState();

    this.statePathElements = new Map();
    this.pathItemCache = new Map();
    this.pathItemCacheKey = undefined;
  }

  /**
   * Resolves entity state into runtime config, scale, geometry, and animation target.
   *
   * @param {object} entity - Home Assistant entity state object.
   * @param {object} entityConfig - Entity configuration for this gauge.
   */
  setState(entity, entityConfig) {
    this.entity = entity;
    this.entityConfig = entityConfig;

    // State resolution may change both the numeric value and runtime config via templates.
    const stateData = getGaugeStateData(this.config, this.templates, this.entity_index, entity, entityConfig);

    const nextValue = stateData.value;
    const previousDisplayValue = Number.isFinite(this.displayValue) ? this.displayValue : nextValue;

    this.runtimeConfig = stateData.runtimeConfig;
    this.rawState = stateData.rawState;
    this.mappedState = stateData.mappedState;
    this.value = nextValue;

    // Recreate scale and geometry after template resolution so spline anchors and layout stay current.
    this.scale = new GaugeScale(this.runtimeConfig.horseshoe_scale);
    this.geometry = new GaugeGeometry(this.runtimeConfig, this.scale);
    this.refreshPathItemCacheKey();

    // The first state assignment initializes the display value without animating from an empty state.
    if (!Number.isFinite(this.displayValue)) {
      this.displayValue = this.value;
      return;
    }

    if (this.displayValue !== this.value) {
      this.startValueAnimation({
        fromValue: previousDisplayValue,
        toValue: this.value,
      });
    }
  }

  /**
   * Renders the complete horseshoe group for the current runtime state.
   *
   * @returns {TemplateResult} SVG template for the gauge.
   */
  render() {
    if (!Number.isFinite(this.value) || !this.runtimeConfig || !this.scale || !this.geometry) {
      return svg``;
    }

    // External palettes must be applied before static gradient/tick path items are cached.
    if (this.card?.config?.palettes && !this.card.palettesLoaded) {
      return svg``;
    }

    const groupTransform = this.geometry.getGroupTransform();

    return svg`
      <g
        id="horseshoe-${this.index}"
        class="horseshoe"
        transform="${groupTransform}"
      >
        ${this.renderHorseshoeBackground()}
        ${this.renderScale()}
        ${this.renderLabelBackground()}
        ${this.renderTickmarkBackground()}
        ${this.renderTickmarks()}
        ${this.renderState()}
        ${this.renderLabelBadges()}
        ${this.renderLabels()}
      </g>
    `;
  }

  /**
   * Builds a stable key for config that can affect cached path and label items.
   *
   * @returns {string} Cache key for render-relevant static item inputs.
   */
  getPathItemCacheKey() {
    return JSON.stringify({
      show: this.runtimeConfig.show,
      svg: this.runtimeConfig.svg,
      arc_degrees: this.runtimeConfig.arc_degrees,
      start_angle: this.runtimeConfig.start_angle,
      rotate: this.runtimeConfig.rotate,
      flip: this.runtimeConfig.flip,
      group_config: this.runtimeConfig.group_config,
      bar_mode: this.runtimeConfig.bar_mode,
      zero_ratio: this.runtimeConfig.zero_ratio,
      colorStops: this.runtimeConfig.colorStops,
      colorStopsMinMax: this.runtimeConfig.colorStopsMinMax,
      horseshoe_background: this.runtimeConfig.horseshoe_background,
      horseshoe_scale: this.runtimeConfig.horseshoe_scale,
      horseshoe_state: {
        width: this.runtimeConfig.horseshoe_state.width,
        linecap: this.runtimeConfig.horseshoe_state.linecap,
        mode: this.runtimeConfig.horseshoe_state.mode,
        segment_gap: this.runtimeConfig.horseshoe_state.segment_gap,
        color: this.runtimeConfig.horseshoe_state.color,
        styles: this.runtimeConfig.horseshoe_state.styles,
      },
      state_map: this.runtimeConfig.state_map,
      horseshoe_labels: this.runtimeConfig.horseshoe_labels,
      horseshoe_tickmarks: this.runtimeConfig.horseshoe_tickmarks,
    });
  }

  /**
   * Clears cached path and label items after render-relevant config changes.
   */
  refreshPathItemCacheKey() {
    const nextCacheKey = this.getPathItemCacheKey();

    if (nextCacheKey !== this.pathItemCacheKey) {
      this.pathItemCache.clear();
      this.pathItemCacheKey = nextCacheKey;
    }
  }

  /**
   * Clears cached static path and label items after external CSS variables change.
   */
  clearPathItemCache() {
    this.pathItemCache.clear();
    this.pathItemCacheKey = undefined;
  }

  /**
   * Returns a cached item collection, building it on first use for this runtime cycle.
   *
   * @param {string} key - Cache key for the item collection.
   * @param {Function} builder - Builder invoked when the key is not cached.
   * @returns {*} Cached builder result.
   */
  getCachedPathItems(key, builder) {
    if (!this.pathItemCache.has(key)) {
      Colors.unresolvedColor = false;
      const pathItems = builder();

      if (Colors.unresolvedColor) {
        return pathItems;
      }

      this.pathItemCache.set(key, pathItems);
    }

    return this.pathItemCache.get(key);
  }

  /**
   * Renders the optional horseshoe background below scale and state.
   */
  renderHorseshoeBackground() {
    const backgroundItems = this.getCachedPathItems('horseshoeBackgroundItems', () => buildHorseshoeBackgroundItems(this.runtimeConfig, this.geometry));

    return renderHorseshoeBackgroundLayer(this.runtimeConfig, this.geometry, backgroundItems);
  }

  /**
   * Renders the static scale layer.
   */
  renderScale() {
    const scalePathItems = this.getCachedPathItems('scalePathItems', () => buildScalePathItems(this.runtimeConfig, this.geometry));

    return renderScaleLayer(this.runtimeConfig, this.geometry, scalePathItems);
  }

  /**
   * Renders the value/state layer using the animated display value.
   */
  renderState() {
    const statePathItems = buildStatePathItems(this.runtimeConfig, this.geometry, this.displayValue ?? this.value);

    return renderStateLayer(this.runtimeConfig, this.geometry, statePathItems, this.cardId, this.index);
  }

  /**
   * Renders major and minor tickmark paths.
   */
  renderTickmarks() {
    const tickPathItems = this.getCachedPathItems('tickPathItems', () => buildTickPathItems(this.runtimeConfig, this.geometry));

    return renderTickmarksLayer(tickPathItems);
  }

  /**
   * Renders the optional tickmark background layer.
   */
  renderTickmarkBackground() {
    const backgroundItems = this.getCachedPathItems('tickmarkBackgroundItems', () => buildTickBackgroundItems(this.runtimeConfig, this.geometry));

    return renderTickmarkBackgroundLayer(this.runtimeConfig, this.geometry, backgroundItems);
  }

  /**
   * Renders labels after resolving label positions.
   */
  renderLabels() {
    const labelItems = this.getCachedPathItems('labelItems', () => buildLabelItems(this.runtimeConfig, this.geometry));

    return renderLabelsLayer(this.runtimeConfig, this.geometry, this.cardId, this.index, labelItems);
  }

  /**
   * Renders the optional label background layer.
   */
  renderLabelBackground() {
    const backgroundItems = this.getCachedPathItems('labelBackgroundItems', () => buildLabelBackgroundItems(this.runtimeConfig, this.geometry));

    return renderLabelBackgroundLayer(this.runtimeConfig, this.geometry, backgroundItems);
  }

  /**
   * Renders optional label badge shapes.
   */
  renderLabelBadges() {
    const labelItems = this.getCachedPathItems('labelItems', () => buildLabelItems(this.runtimeConfig, this.geometry));

    return renderLabelBadgesLayer(this.runtimeConfig, this.geometry, this.cardId, this.index, labelItems);
  }

  /**
   * Returns the effective state animation configuration for this gauge.
   */
  getStateAnimationConfig() {
    return getAnimatorConfig(this.runtimeConfig);
  }

  /**
   * Starts an animated transition and updates only the state path DOM during frames.
   *
   * @param {object} animation - From/to value payload for the animator.
   */
  startValueAnimation(animation = {}) {
    const animationConfig = this.getStateAnimationConfig();

    runValueAnimation(this.valueAnimator, animationConfig, animation, {
      onUpdate: (displayValue) => {
        this.displayValue = displayValue;
        this.updateStatePathDom({
          value: this.displayValue,
        });
      },
      onComplete: (displayValue) => {
        this.displayValue = displayValue;
        this.updateStatePathDom({
          value: this.displayValue,
        });
      },
    });
  }

  /**
   * Updates existing state path DOM nodes without rerendering the full gauge.
   *
   * @param {object} options - Optional value override for this update.
   */
  updateStatePathDom(options = {}) {
    if (!this.runtimeConfig || !this.geometry || !this.scale) {
      return;
    }

    const value = Number(options.value ?? this.displayValue ?? this.value);

    const statePathItems = buildStatePathItems(this.runtimeConfig, this.geometry, value);
    updateStatePathElements(this.runtimeConfig, statePathItems, this.statePathElements, this.card, this.cardId, this.index);
  }
}
