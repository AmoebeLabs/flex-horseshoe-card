import { svg } from 'lit';
import {
  createValueAnimatorState,
  DEFAULT_STATE_ANIMATION,
  getStateAnimationConfig as getAnimatorConfig,
  startValueAnimation as runValueAnimation,
} from './horseshoe-animator.js';
import { GaugeGeometry, GaugeScale } from './horseshoe-geometry.js';
import {
  renderLabelsLayer,
  renderScaleLayer,
  renderStateLayer,
  updateStatePathElements,
} from './horseshoe-renderer.js';
import {
  buildLabelItems,
  buildScaleArcs,
  buildStatePathItems,
} from './horseshoe-shapes.js';
import {
  getGaugeStateData,
  normalizeBaseConfig,
} from './horseshoe-state.js';

export default class HorseshoeGauge {
  static setConfig(config, templates, cardId, card) {
    const horseshoes = Array.isArray(config.layout?.horseshoes_v2) ? config.layout.horseshoes_v2 : [];

    return horseshoes
      .map((horseshoeConfig, index) => new HorseshoeGauge(normalizeBaseConfig(horseshoeConfig, index), index, templates, cardId, card))
      .filter((horseshoe) => horseshoe.show?.horseshoe !== false);
  }

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

  setState(entity, entityConfig) {
    this.entity = entity;
    this.entityConfig = entityConfig;

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

    this.scale = new GaugeScale(this.runtimeConfig.horseshoe_scale);
    this.geometry = new GaugeGeometry(this.runtimeConfig, this.scale);

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

  render() {
    if (!Number.isFinite(this.value) || !this.runtimeConfig || !this.scale || !this.geometry) {
      return svg``;
    }

    return svg`
      <g id="horseshoe-${this.index}" class="horseshoe">
        ${this.renderScale()}
        ${this.renderState()}
        ${this.renderLabels()}
      </g>
    `;
  }

  renderScale() {
    const scaleArcs = buildScaleArcs(this.runtimeConfig, this.geometry);

    return renderScaleLayer(this.runtimeConfig, this.geometry, scaleArcs);
  }

  renderState() {
    const statePathItems = buildStatePathItems(
      this.runtimeConfig,
      this.geometry,
      this.displayValue ?? this.value,
    );

    return renderStateLayer(this.runtimeConfig, statePathItems, this.cardId, this.index);
  }

  renderLabels() {
    const labelItems = buildLabelItems(this.runtimeConfig, this.geometry, this.scale);

    return renderLabelsLayer(this.runtimeConfig, this.geometry, this.cardId, this.index, labelItems);
  }

  getStateAnimationConfig() {
    return getAnimatorConfig(this.runtimeConfig);
  }

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
