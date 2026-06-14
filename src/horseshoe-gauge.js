import { svg } from 'lit';
import {
  createValueAnimatorState,
  DEFAULT_STATE_ANIMATION,
  getStateAnimationConfig as getAnimatorConfig,
  startValueAnimation as runValueAnimation,
} from './horseshoe-animator.js';
import { GaugeGeometry, GaugeScale } from './horseshoe-geometry.js';
import {
  renderLabelBackgroundLayer,
  renderLabelBadgesLayer,
  renderLabelsLayer,
  renderScaleLayer,
  renderStateLayer,
  renderTickmarkBackgroundLayer,
  renderTickmarksLayer,
  updateStatePathElements,
} from './horseshoe-renderer.js';
import {
  buildLabelBackgroundItems,
  buildLabelItems,
  buildScalePathItems,
  buildStatePathItems,
} from './horseshoe-shapes.js';
import {
  getGaugeStateData,
  normalizeBaseConfig,
} from './horseshoe-state.js';
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
    const horseshoes = Array.isArray(config.layout?.horseshoes_v2) ? config.layout.horseshoes_v2 : [];

    return horseshoes
      .map((horseshoeConfig, index) => new HorseshoeGauge(normalizeBaseConfig(horseshoeConfig, index), index, templates, cardId, card))
      .filter((horseshoe) => horseshoe.show?.horseshoe !== false);
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
    const stateData = getGaugeStateData(
      this.config,
      this.templates,
      this.entity_index,
      entity,
      entityConfig,
    );

    const nextValue = stateData.value;
    const previousDisplayValue = Number.isFinite(this.displayValue) ? this.displayValue : nextValue;

    this.runtimeConfig = stateData.runtimeConfig;
    this.rawState = stateData.rawState;
    this.mappedState = stateData.mappedState;
    this.value = nextValue;

    // Recreate scale and geometry after template resolution so spline anchors and layout stay current.
    this.scale = new GaugeScale(this.runtimeConfig.horseshoe_scale);
    this.geometry = new GaugeGeometry(this.runtimeConfig, this.scale);

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

    const groupTransform = this.geometry.getGroupTransform();

    return svg`
      <g
        id="horseshoe-${this.index}"
        class="horseshoe"
        transform="${groupTransform}"
      >
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
   * Renders the static scale layer.
   */
  renderScale() {
    const scalePathItems = buildScalePathItems(this.runtimeConfig, this.geometry);

    return renderScaleLayer(this.runtimeConfig, this.geometry, scalePathItems);
  }

  /**
   * Renders the value/state layer using the animated display value.
   */
  renderState() {
    const statePathItems = buildStatePathItems(
      this.runtimeConfig,
      this.geometry,
      this.displayValue ?? this.value,
    );

    return renderStateLayer(this.runtimeConfig, statePathItems, this.cardId, this.index);
  }

  /**
   * Renders major and minor tickmark paths.
   */
  renderTickmarks() {
    const tickPathItems = buildTickPathItems(this.runtimeConfig, this.geometry);

    return renderTickmarksLayer(tickPathItems);
  }

  /**
   * Renders the optional tickmark background layer.
   */
  renderTickmarkBackground() {
    const backgroundItems = buildTickBackgroundItems(this.runtimeConfig, this.geometry);

    return renderTickmarkBackgroundLayer(this.runtimeConfig, this.geometry, backgroundItems);
  }

  /**
   * Renders labels after resolving label positions.
   */
  renderLabels() {
    const labelItems = buildLabelItems(this.runtimeConfig, this.geometry, this.scale);

    return renderLabelsLayer(this.runtimeConfig, this.geometry, this.cardId, this.index, labelItems);
  }

  /**
   * Renders the optional label background layer.
   */
  renderLabelBackground() {
    const backgroundItems = buildLabelBackgroundItems(this.runtimeConfig, this.geometry);

    return renderLabelBackgroundLayer(this.runtimeConfig, this.geometry, backgroundItems);
  }

  /**
   * Renders optional label badge shapes.
   */
  renderLabelBadges() {
    const labelItems = buildLabelItems(this.runtimeConfig, this.geometry, this.scale);

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
    updateStatePathElements(
      this.runtimeConfig,
      statePathItems,
      this.statePathElements,
      this.card,
      this.cardId,
      this.index,
    );
  }
}
