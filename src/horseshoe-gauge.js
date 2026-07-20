import { svg } from 'lit';
import BaseTool from './base-tool.js';
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
import { getGaugeStateData, normalizeBaseConfig, normalizeRuntimeConfig } from './horseshoe-state.js';
import { computeStateDisplay } from './frontend_mods/common/entity/compute_state_display.ts';
import buildTickPathItems, { buildTickBackgroundItems } from './horseshoe-tickmarks.js';

/**
 * Coordinates runtime state, geometry, path builders, and SVG render layers for one v2 horseshoe.
 */
export default class HorseshoeGauge extends BaseTool {
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
    const legacyConfig = HorseshoeGauge.getLegacyRootConfig(config);
    const layoutConfigs = [
      ...(Array.isArray(config.layout?.horseshoes_v2) ? config.layout.horseshoes_v2 : []),
      ...(Array.isArray(config.layout?.horseshoes) ? config.layout.horseshoes : []),
    ];
    const horseshoes = [
      ...(legacyConfig ? [legacyConfig] : []),
      ...layoutConfigs,
    ];

    return horseshoes
      .filter(Boolean)
      .map((horseshoeConfig, index) => HorseshoeGauge.applyLegacyTickmarkCompat(horseshoeConfig))
      .map((horseshoeConfig, index) => new HorseshoeGauge(normalizeBaseConfig(horseshoeConfig, index, card.groupManager), index, templates, cardId, card))
      .filter((horseshoe) => horseshoe.show?.horseshoe !== false);
  }

  /**
   * Copies the root-level legacy horseshoe fields into one v2 gauge config for test rendering.
   *
   * @param {object} config - Full card configuration.
   * @returns {object|undefined} Root legacy horseshoe config for the v2 renderer.
   */
  static getLegacyRootConfig(config) {
    const legacyFields = [
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
    ];
    const rootHorseshoeFields = legacyFields.filter((field) => field !== 'show' && field !== 'styles' && field !== 'entity_index');
    const hasRootHorseshoeConfig = rootHorseshoeFields.some((field) => config[field] !== undefined);

    if (!hasRootHorseshoeConfig) {
      return undefined;
    }

    const legacyConfig = {};

    legacyFields.forEach((field) => {
      if (config[field] !== undefined) {
        legacyConfig[field] = config[field];
      }
    });

    return Object.keys(legacyConfig).length ? legacyConfig : undefined;
  }

  /**
   * Maps legacy scale tickmark config to v2 tickmarks when no v2 tickmarks are configured.
   *
   * @param {object} horseshoeConfig - Root or layout horseshoe config.
   * @returns {object} Horseshoe config with compatibility tickmarks applied.
   */
  static applyLegacyTickmarkCompat(horseshoeConfig) {
    if (horseshoeConfig.show?.scale_tickmarks !== true) {
      return horseshoeConfig;
    }

    const existingTickmarks = horseshoeConfig.horseshoe_tickmarks ?? {};

    if (existingTickmarks.ticks_major || existingTickmarks.ticks_minor) {
      return {
        ...horseshoeConfig,
        show: {
          ...horseshoeConfig.show,
          tickmarks: horseshoeConfig.show.tickmarks ?? horseshoeConfig.show.ticks ?? true,
        },
      };
    }

    const scale = horseshoeConfig.horseshoe_scale ?? {};
    const min = Number(scale.min ?? 0);
    const max = Number(scale.max ?? 100);
    const range = max - min;
    const ticksize = scale.ticksize ?? (range ? range / 10 : undefined);
    const radius = Number(horseshoeConfig.radius ?? 45);
    const tickmarksRadius = Number(horseshoeConfig.tickmarks_radius ?? 43);
    const tickWidth = Number(scale.width ?? 6);

    return {
      ...horseshoeConfig,
      show: {
        ...horseshoeConfig.show,
        tickmarks: true,
      },
      horseshoe_tickmarks: {
        ...existingTickmarks,
        ticks_major: {
          ticksize,
          shape: 'circle',
          radius: tickWidth / 2,
          width: tickWidth,
          thickness: tickWidth,
          offset: tickmarksRadius - radius,
          styles: [
            ...(Array.isArray(existingTickmarks.styles) ? existingTickmarks.styles : existingTickmarks.styles ? [existingTickmarks.styles] : []),
            { fill: scale.color ?? 'var(--primary-background-color)' },
          ],
        },
      },
    };
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
    super(config, index, templates, cardId, card, 'horseshoes_v2', 'horseshoes_v2', 0);

    this.show = config.show;

    this.entity = undefined;
    this.entityConfig = undefined;
    this.rawState = undefined;
    this.value = undefined;
    this.displayValue = undefined;
    this.mappedState = undefined;

    this.normalizedConfig = undefined;
    this.geometryConfigSignature = undefined;
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
    super.setState(entity, entityConfig);

    // Normalize only when the complete evaluated item changed. The normalized source stays
    // separate because entity-state mapping adds transient fields for the current state.
    if (this.configChanged || !this.normalizedConfig) {
      this.config.group_config = this.card.groupManager.getGroupForItem(this.config);
      this.normalizedConfig = normalizeRuntimeConfig(this.config, this.card.getActiveColorStopMode());
    }

    const stateData = getGaugeStateData(this.normalizedConfig, entity, entityConfig);
    const nextValue = stateData.value;
    const previousDisplayValue = Number.isFinite(this.displayValue) ? this.displayValue : nextValue;

    this.config = stateData.config;
    this.config.state_map = this.buildStateMapDisplayLabels(this.config.state_map, entity);

    // Display labels are added after state resolution; keep fields from the active mapped state.
    const displayMappedState = this.config.state_map?.map?.find((entry) => entry.state === stateData.mappedState?.state && Number(entry.value) === Number(stateData.mappedState?.value));
    let mappedState = stateData.mappedState;

    if (displayMappedState) {
      mappedState = {
        ...stateData.mappedState,
        ...displayMappedState,
        color: stateData.mappedState?.color ?? displayMappedState.color,
      };
    }

    this.config.mapped_state = mappedState;
    this.zpos = Number(this.config.zpos) + Number(this.config.dzpos);
    this.rawState = stateData.rawState;
    this.mappedState = mappedState;
    this.value = nextValue;

    // Scale and geometry change only when their active inputs change, not for every entity update.
    const geometryConfigSignature = JSON.stringify({
      horseshoe_scale: this.config.horseshoe_scale,
      svg: this.config.svg,
      arc_degrees: this.config.arc_degrees,
      start_angle: this.config.start_angle,
      rotate: this.config.rotate,
      flip: this.config.flip,
      group_config: this.config.group_config,
      bar_mode: this.config.bar_mode,
      zero_ratio: this.config.zero_ratio,
    });

    if (geometryConfigSignature !== this.geometryConfigSignature) {
      this.scale = new GaugeScale(this.config.horseshoe_scale);
      this.geometry = new GaugeGeometry(this.config, this.scale);
      this.geometryConfigSignature = geometryConfigSignature;
    }

    this.refreshPathItemCacheKey();

    const stringStateMode = this.config.horseshoe_state.mode === 'stringstate_mode' || this.config.horseshoe_state.mode === 'stringstate_level';

    // String states are discrete. CSS transitions animate their styles; numeric interpolation would produce unmapped intermediate states.
    if (stringStateMode) {
      this.displayValue = this.value;
      return;
    }

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
   * Adds Home Assistant translated display labels to every state_map entry.
   *
   * @param {object} stateMap - Runtime state_map config.
   * @param {object} entity - Home Assistant entity state object.
   * @returns {object} State map with display_label values.
   */
  buildStateMapDisplayLabels(stateMap, entity) {
    if (!stateMap?.map) return stateMap;

    if (stateMap.type === 'rank_state') {
      return stateMap;
    }

    return {
      ...stateMap,
      map: stateMap.map.map((entry) => {
        const state = String(entry.state ?? entry.value);
        const stateEntity = {
          ...entity,
          state,
        };
        const formattedState = this.card._hass.formatEntityState?.(entity, state);
        const formattedStateEntity = this.card._hass.formatEntityState?.(stateEntity);
        const computedState = computeStateDisplay(
          this.card._hass.localize,
          stateEntity,
          this.card._hass.locale,
          [],
          this.card._hass.config,
          this.card._hass.entities,
        );
        const displayLabel = [formattedState, formattedStateEntity, computedState]
          .find((label) => label !== undefined && label !== state) ?? formattedState ?? formattedStateEntity ?? computedState;

        if (this.config?.dev?.debug_state_map || this.config?.debug_state_map) {
          console.log('[horseshoe-state-map] display label', {
            entity_id: entity.entity_id,
            activeState: entity.state,
            state,
            formattedState,
            formattedStateEntity,
            computedState,
            displayLabel,
            entry,
          });
        }

        return {
          ...entry,
          display_label: displayLabel ?? entry.display_label,
        };
      }),
    };
  }

  /**
   * Renders the complete horseshoe group for the current runtime state.
   *
   * @returns {TemplateResult} SVG template for the gauge.
   */
  render() {
    if (!Number.isFinite(this.value) || !this.config || !this.scale || !this.geometry) {
      return svg``;
    }

    // External palettes must be applied before static gradient/tick path items are cached.
    if (this.card?.config?.palettes && !this.card.palettesLoaded) {
      return svg``;
    }

    const groupTransform = this.geometry.getGroupTransform();

    return this.renderItemLayers(svg`
      <g
        id="horseshoe-${this.index}"
        class="horseshoe"
        transform="${groupTransform}"
      >
        ${this.renderHorseshoeBackground()}
        ${this.renderScale()}
        ${this.renderLabelBackground()}
        ${this.renderTickmarkBackground()}
        ${this.renderState()}
        ${this.renderTickmarks()}
        ${this.renderLabelBadges()}
        ${this.renderLabels()}
      </g>
    `);
  }

  /**
   * Builds a stable key for config that can affect cached path and label items.
   *
   * @returns {string} Cache key for render-relevant static item inputs.
   */
  getPathItemCacheKey() {
    return JSON.stringify({
      show: this.config.show,
      svg: this.config.svg,
      arc_degrees: this.config.arc_degrees,
      start_angle: this.config.start_angle,
      rotate: this.config.rotate,
      flip: this.config.flip,
      group_config: this.config.group_config,
      bar_mode: this.config.bar_mode,
      zero_ratio: this.config.zero_ratio,
      colorstops: this.config.colorstops,
      colorstopsMinMax: this.config.colorstopsMinMax,
      horseshoe_background: this.config.horseshoe_background,
      horseshoe_scale: this.config.horseshoe_scale,
      horseshoe_state: {
        width: this.config.horseshoe_state.width,
        linecap: this.config.horseshoe_state.linecap,
        mode: this.config.horseshoe_state.mode,
        segment_gap: this.config.horseshoe_state.segment_gap,
        color: this.config.horseshoe_state.color,
        styles: this.config.horseshoe_state.styles,
      },
      state_map: this.config.state_map,
      mapped_state: this.config.mapped_state,
      horseshoe_labels: this.config.horseshoe_labels,
      horseshoe_tickmarks: this.config.horseshoe_tickmarks,
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
    const backgroundItems = this.getCachedPathItems('horseshoeBackgroundItems', () => buildHorseshoeBackgroundItems(this.config, this.geometry));

    return renderHorseshoeBackgroundLayer(
      this.config,
      this.geometry,
      backgroundItems,
      (styles) => this.getRenderStyles(styles, [this.config.horseshoe_background?.color_filter]),
    );
  }

  /**
   * Renders the static scale layer.
   */
  renderScale() {
    const scalePathItems = this.getCachedPathItems('scalePathItems', () => buildScalePathItems(this.config, this.geometry));

    return renderScaleLayer(
      this.config,
      this.geometry,
      scalePathItems,
      (styles) => this.getRenderStyles(styles, [this.config.horseshoe_scale?.color_filter]),
    );
  }

  /**
   * Renders the value/state layer using the animated display value.
   */
  renderState() {
    const statePathItems = buildStatePathItems(this.config, this.geometry, this.displayValue ?? this.value);

    return renderStateLayer(
      this.config,
      this.geometry,
      statePathItems,
      this.cardId,
      this.index,
      (styles) => this.getRenderStyles(styles, [this.config.horseshoe_state?.color_filter]),
    );
  }

  /**
   * Renders major and minor tickmark paths.
   */
  renderTickmarks() {
    const tickPathItems = this.getCachedPathItems('tickPathItems', () => buildTickPathItems(this.config, this.geometry));
    const applyTickmarkColorFilter = (styles, pathItem) => {
      const tickConfig = pathItem.className === 'horseshoe__tick-major'
        ? this.config.horseshoe_tickmarks?.ticks_major
        : this.config.horseshoe_tickmarks?.ticks_minor;

      return this.getRenderStyles(styles, [
        this.config.horseshoe_tickmarks?.color_filter,
        tickConfig?.color_filter,
      ]);
    };

    return renderTickmarksLayer(tickPathItems, applyTickmarkColorFilter);
  }

  /**
   * Renders the optional tickmark background layer.
   */
  renderTickmarkBackground() {
    const backgroundItems = this.getCachedPathItems('tickmarkBackgroundItems', () => buildTickBackgroundItems(this.config, this.geometry));

    return renderTickmarkBackgroundLayer(this.config, this.geometry, backgroundItems);
  }

  /**
   * Renders labels after resolving label positions.
   */
  renderLabels() {
    const labelItems = this.getCachedPathItems('labelItems', () => buildLabelItems(this.config, this.geometry));

    return renderLabelsLayer(
      this.config,
      this.geometry,
      this.cardId,
      this.index,
      labelItems,
      (styles) => this.getRenderStyles(styles, [this.config.horseshoe_labels?.color_filter]),
    );
  }

  /**
   * Renders the optional label background layer.
   */
  renderLabelBackground() {
    const backgroundItems = this.getCachedPathItems('labelBackgroundItems', () => buildLabelBackgroundItems(this.config, this.geometry));

    return renderLabelBackgroundLayer(
      this.config,
      this.geometry,
      backgroundItems,
      (styles) => this.getRenderStyles(styles, [this.config.horseshoe_labels?.background?.color_filter]),
    );
  }

  /**
   * Renders optional label badge shapes.
   */
  renderLabelBadges() {
    const labelItems = this.getCachedPathItems('labelItems', () => buildLabelItems(this.config, this.geometry));

    return renderLabelBadgesLayer(
      this.config,
      this.geometry,
      this.cardId,
      this.index,
      labelItems,
      (styles) => this.getRenderStyles(styles, [this.config.horseshoe_labels?.badges?.color_filter]),
    );
  }

  /**
   * Returns the effective state animation configuration for this gauge.
   */
  getStateAnimationConfig() {
    return getAnimatorConfig(this.config);
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
    if (!this.config || !this.geometry || !this.scale) {
      return;
    }

    const value = Number(options.value ?? this.displayValue ?? this.value);

    const statePathItems = buildStatePathItems(this.config, this.geometry, value);
    updateStatePathElements(
      this.config,
      statePathItems,
      this.statePathElements,
      this.card,
      this.cardId,
      this.index,
      (styles) => this.getRenderStyles(styles, [this.config.horseshoe_state?.color_filter]),
    );
  }
}
