import { render, svg } from 'lit';

import BaseTool from './base-tool.js';
import Colors from './colors.js';
import ConfigHelper from './config-helper.js';
import { GaugeScale } from './horseshoe-geometry.js';
import { applyEllipsis, buildLabelStopItems } from './horseshoe-labels.js';
import { getGaugeStateData, normalizeBaseConfig, normalizeRuntimeConfig } from './horseshoe-state.js';
import { applyLegacyScaleTickmarkConfig, buildTickValues, getTickmarkVisibility } from './horseshoe-tickmarks.js';
import { buildArcPathDefinition, buildInfinityPathDefinition, buildLinePathDefinition, buildRectanglePathDefinition, buildSpiralPathDefinition, buildWavePathDefinition } from './path-generators.js';
import PathGeometry, { buildOffsetPathDefinition, TransformedPathGeometry } from './path-geometry.js';
import { buildPathElements } from './path-elements.js';
import { renderPathElements } from './path-elements-renderer.js';
import { buildAdaptivePathGradient, renderAdaptivePathGradient } from './path-gradient-renderer.js';
import PathStateAnimator from './path-animator.js';
import { renderNormalizedPathBands } from './path-mask-renderer.js';
import { buildPaintedRanges, PathValueMapper } from './path-ranges.js';
import Utils from './utils.js';

const PATH_TYPES = ['arc', 'line', 'rectangle', 'wave', 'spiral', 'infinity'];

/**
 * Translates horseshoe configuration into the complete contracts consumed by
 * the generic path engine. Compatibility, defaults, and validation end here;
 * path modules never inspect card configuration.
 */
export default class HorseshoeGauge extends BaseTool {
  /**
   * Constructs gauges from the current section, its v2 alias, and the original
   * root-level configuration.
   */
  static setConfig(config, templates, cardId, card) {
    const legacyConfig = HorseshoeGauge.getLegacyRootConfig(config);
    const horseshoes = [
      ...(legacyConfig ? [legacyConfig] : []),
      ...(Array.isArray(config.layout?.horseshoes_v2) ? config.layout.horseshoes_v2 : []),
      ...(Array.isArray(config.layout?.horseshoes) ? config.layout.horseshoes : []),
    ];

    return horseshoes
      .filter(Boolean)
      .map((horseshoeConfig) => applyLegacyScaleTickmarkConfig(horseshoeConfig))
      .map((horseshoeConfig, index) => new HorseshoeGauge(normalizeBaseConfig(horseshoeConfig, index, card.cardLayout.groupManager, card.cardTheme.getActiveColorStopMode()), index, templates, cardId, card))
      .filter((horseshoe) => horseshoe.config.show.horseshoe !== false);
  }

  /** Copies original root-level horseshoe fields into one normal gauge item. */
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

    if (!hasRootHorseshoeConfig) return undefined;

    const legacyConfig = {};
    legacyFields.forEach((field) => {
      if (config[field] !== undefined) legacyConfig[field] = config[field];
    });

    return Object.keys(legacyConfig).length ? legacyConfig : undefined;
  }

  /** Stores adapter state without creating geometry before runtime config exists. */
  constructor(config, index, templates, cardId, card) {
    super(config, index, templates, cardId, card, 'horseshoes', 'horseshoes', 0);

    this.activeItemConfig = this.config;
    this.runtimeConfig = undefined;
    this.pathContract = undefined;
    this.pathDefinition = undefined;
    this.scale = undefined;
    this.valueMapper = undefined;
    this.value = undefined;
    this.renderContract = undefined;
    this.pathGeometry = new PathGeometry(() => this.card.requestUpdate());
    this.transformedPathGeometry = undefined;
    this.pathTransform = undefined;
    this.scaleGradient = undefined;
    this.stateGradient = undefined;
    this.stateGradientKey = undefined;
    this.scaleAndBackgroundLayoutKey = undefined;
    this.pathElementsKey = undefined;
    this.pathElements = { ticks: [], labels: [], markers: [] };
    this.backgroundLayers = [];
    this.stateAnimator = undefined;
    this.displayProgress = undefined;
    this.stateRanges = [];
    this.colorStopRanges = [];
    this.stateSegmentPaints = [];
    this.statePaints = [];
    this.statePaintConfig = undefined;
    this.currentStateGradientConfig = undefined;
  }

  /** Rebuilds all color-dependent path layers after theme or palette changes. */
  clearPathItemCache() {
    this.stateGradientKey = undefined;
    this.scaleAndBackgroundLayoutKey = undefined;
    this.pathElementsKey = undefined;

    if (this.pathGeometry.isReady() && this.valueMapper) this.buildMeasuredGradientContracts();
  }

  /**
   * Normalizes the established arc fields and the frozen path shape schema.
   * Shape dimensions use card percentages and are converted to SVG units once.
   */
  updateRuntimeConfig() {
    this.config = this.activeItemConfig;
    super.updateRuntimeConfig();
    this.activeItemConfig = this.config;
    const itemConfig = this.config;

    if (!this.configChanged && this.pathDefinition) {
      this.config = this.runtimeConfig;
      return;
    }

    this.config.group_config = this.card.cardLayout.groupManager.getGroupForItem(this.config);
    this.config = normalizeRuntimeConfig(this.config, this.card.cardTheme.getActiveColorStopMode());
    this.config.colorstops = {
      gap: 0,
      ...this.config.colorstops,
    };
    this.config.horseshoe_state = {
      ...this.config.horseshoe_state,
      segment_gap: this.config.horseshoe_state.segment_gap ?? 0,
    };
    this.config.rotate = itemConfig.rotate ?? 0;
    this.config.flip = itemConfig.flip ?? 'none';
    this.config.horseshoe_scale.styles = {
      opacity: 1,
      ...this.config.horseshoe_scale.styles,
    };
    this.config.horseshoe_state.styles = {
      opacity: 1,
      ...this.config.horseshoe_state.styles,
    };
    this.runtimeConfig = this.config;

    if (!this.stateAnimator) {
      this.stateAnimator = new PathStateAnimator({
        animation: this.config.horseshoe_state.animation,
        requestFrame: (callback) => requestAnimationFrame(callback),
        cancelFrame: (frame) => cancelAnimationFrame(frame),
        updateStateLayer: (stateLayerElement, progress) => {
          const pathId = `${this.cardId}-horseshoe-${this.index}`;
          render(this.renderStateAtProgress(progress, pathId), stateLayerElement);
        },
        onComplete: (progress) => {
          this.displayProgress = progress;
        },
        initialProgress: 0,
      });
    } else {
      this.stateAnimator.animation = this.config.horseshoe_state.animation;
    }

    const sourcePath = itemConfig.path ?? {
      type: 'arc',
      radius: itemConfig.radius,
      arc_degrees: itemConfig.arc_degrees,
      start_angle: itemConfig.start_angle,
    };

    if (!PATH_TYPES.includes(sourcePath.type)) {
      throw new Error(`[horseshoes] path.type '${sourcePath.type}' is invalid [${PATH_TYPES.join(', ')}]`);
    }

    const center = this.config.svg;
    const dimension = (value) => Utils.calculateSvgDimension(value);

    // Every branch creates the exact complete generator contract. Shared item
    // placement stays outside path; all shape-specific fields remain in path.
    switch (sourcePath.type) {
      case 'arc': {
        const radius = sourcePath.radius ?? 45;
        const radiusX = sourcePath.radius_x ?? radius;
        const radiusY = sourcePath.radius_y ?? radius;
        const arcDegrees = sourcePath.arc_degrees ?? 260;
        if (radiusX <= 0 || radiusY <= 0 || arcDegrees === 0 || Math.abs(arcDegrees) > 360) {
          throw new Error('[horseshoes] arc radii must be greater than zero and arc_degrees must be between -360 and 360');
        }
        this.pathContract = {
          type: 'arc',
          cx: center.xpos,
          cy: center.ypos,
          radiusX: dimension(radiusX),
          radiusY: dimension(radiusY),
          startAngle: sourcePath.start_angle ?? 90 + (360 - arcDegrees) / 2,
          arcDegrees,
        };
        this.pathDefinition = buildArcPathDefinition(this.pathContract);
        break;
      }
      case 'line': {
        const length = dimension(sourcePath.length ?? 80);
        if (length <= 0) throw new Error('[horseshoes] line length must be greater than zero');
        const angle = ((sourcePath.angle ?? 0) * Math.PI) / 180;
        const deltaX = (Math.cos(angle) * length) / 2;
        const deltaY = (Math.sin(angle) * length) / 2;
        this.pathContract = {
          type: 'line',
          x1: center.xpos - deltaX,
          y1: center.ypos - deltaY,
          x2: center.xpos + deltaX,
          y2: center.ypos + deltaY,
        };
        this.pathDefinition = buildLinePathDefinition(this.pathContract);
        break;
      }
      case 'rectangle': {
        const width = dimension(sourcePath.width ?? 80);
        const height = dimension(sourcePath.height ?? 80);
        const radiusConfig = typeof sourcePath.radius === 'object' ? sourcePath.radius : { all: sourcePath.radius ?? 0 };
        const maxRadius = Math.min(width, height) / 2;
        const radius = (value) => Math.min(maxRadius, dimension(value));
        if (width <= 0 || height <= 0) throw new Error('[horseshoes] rectangle width and height must be greater than zero');
        if (!['top', 'right', 'bottom', 'left'].includes(sourcePath.start ?? 'top')) {
          throw new Error(`[horseshoes] rectangle path.start '${sourcePath.start}' is invalid [top, right, bottom, left]`);
        }
        if (!['clockwise', 'counterclockwise'].includes(sourcePath.direction ?? 'clockwise')) {
          throw new Error(`[horseshoes] rectangle path.direction '${sourcePath.direction}' is invalid [clockwise, counterclockwise]`);
        }
        this.pathContract = {
          type: 'rectangle',
          x: center.xpos - width / 2,
          y: center.ypos - height / 2,
          width,
          height,
          radiusTopLeft: radius(radiusConfig.top_left ?? radiusConfig.all),
          radiusTopRight: radius(radiusConfig.top_right ?? radiusConfig.all),
          radiusBottomRight: radius(radiusConfig.bottom_right ?? radiusConfig.all),
          radiusBottomLeft: radius(radiusConfig.bottom_left ?? radiusConfig.all),
          start: sourcePath.start ?? 'top',
          direction: sourcePath.direction ?? 'clockwise',
        };
        this.pathDefinition = buildRectanglePathDefinition(this.pathContract);
        break;
      }
      case 'wave': {
        const length = dimension(sourcePath.length ?? 80);
        if (length <= 0 || (sourcePath.waves ?? 3) <= 0 || (sourcePath.amplitude ?? 8) <= 0) {
          throw new Error('[horseshoes] wave length, waves, and amplitude must be greater than zero');
        }
        const angle = ((sourcePath.angle ?? 0) * Math.PI) / 180;
        const deltaX = (Math.cos(angle) * length) / 2;
        const deltaY = (Math.sin(angle) * length) / 2;
        this.pathContract = {
          type: 'wave',
          x1: center.xpos - deltaX,
          y1: center.ypos - deltaY,
          x2: center.xpos + deltaX,
          y2: center.ypos + deltaY,
          waves: sourcePath.waves ?? 3,
          amplitude: dimension(sourcePath.amplitude ?? 8),
        };
        this.pathDefinition = buildWavePathDefinition(this.pathContract);
        break;
      }
      case 'spiral': {
        if ((sourcePath.radius_inner ?? 5) < 0 || (sourcePath.radius_outer ?? 40) <= 0 || (sourcePath.points ?? 48) < 2) {
          throw new Error('[horseshoes] spiral radii must be valid and points must be at least 2');
        }
        this.pathContract = {
          type: 'spiral',
          cx: center.xpos,
          cy: center.ypos,
          radiusInner: dimension(sourcePath.radius_inner ?? 5),
          radiusOuter: dimension(sourcePath.radius_outer ?? 40),
          startAngle: sourcePath.start_angle ?? -90,
          degrees: sourcePath.degrees ?? 720,
          points: sourcePath.points ?? 48,
        };
        this.pathDefinition = buildSpiralPathDefinition(this.pathContract);
        break;
      }
      case 'infinity': {
        if ((sourcePath.radius_x ?? 40) <= 0 || (sourcePath.radius_y ?? 25) <= 0) {
          throw new Error('[horseshoes] infinity radii must be greater than zero');
        }
        this.pathContract = {
          type: 'infinity',
          cx: center.xpos,
          cy: center.ypos,
          radiusX: dimension(sourcePath.radius_x ?? 40),
          radiusY: dimension(sourcePath.radius_y ?? 25),
        };
        this.pathDefinition = buildInfinityPathDefinition(this.pathContract);
        break;
      }
    }

    this.scale = new GaugeScale(this.config.horseshoe_scale);

    // Compose item flip/rotation and group scale/rotation into one affine
    // matrix. Only path layers receive this SVG matrix. Path elements read
    // the matching TransformedPathGeometry and renders final coordinates as a
    // separate, untransformed sibling.
    const itemScaleX = this.config.flip === 'x' || this.config.flip === 'both' ? -1 : 1;
    const itemScaleY = this.config.flip === 'y' || this.config.flip === 'both' ? -1 : 1;
    const itemRadians = (Number(this.config.rotate) * Math.PI) / 180;
    const itemCosine = Math.cos(itemRadians);
    const itemSine = Math.sin(itemRadians);
    const itemMatrix = {
      a: itemCosine * itemScaleX,
      b: itemSine * itemScaleX,
      c: -itemSine * itemScaleY,
      d: itemCosine * itemScaleY,
    };
    itemMatrix.e = center.xpos - itemMatrix.a * center.xpos - itemMatrix.c * center.ypos;
    itemMatrix.f = center.ypos - itemMatrix.b * center.xpos - itemMatrix.d * center.ypos;

    const groupConfig = this.config.group_config;
    const groupScaleX = groupConfig.scale?.x ?? groupConfig.scale ?? 1;
    const groupScaleY = groupConfig.scale?.y ?? groupConfig.scale ?? 1;
    const groupRadians = (Number(groupConfig.rotate ?? groupConfig.rotation ?? 0) * Math.PI) / 180;
    const groupCosine = Math.cos(groupRadians);
    const groupSine = Math.sin(groupRadians);
    const groupCenterX = Utils.calculateSvgDimension(groupConfig.xpos);
    const groupCenterY = Utils.calculateSvgDimension(groupConfig.ypos);
    const groupMatrix = {
      a: groupCosine * groupScaleX,
      b: groupSine * groupScaleX,
      c: -groupSine * groupScaleY,
      d: groupCosine * groupScaleY,
    };
    groupMatrix.e = groupCenterX - groupMatrix.a * groupCenterX - groupMatrix.c * groupCenterY;
    groupMatrix.f = groupCenterY - groupMatrix.b * groupCenterX - groupMatrix.d * groupCenterY;

    const matrix = {
      a: groupMatrix.a * itemMatrix.a + groupMatrix.c * itemMatrix.b,
      b: groupMatrix.b * itemMatrix.a + groupMatrix.d * itemMatrix.b,
      c: groupMatrix.a * itemMatrix.c + groupMatrix.c * itemMatrix.d,
      d: groupMatrix.b * itemMatrix.c + groupMatrix.d * itemMatrix.d,
      e: groupMatrix.a * itemMatrix.e + groupMatrix.c * itemMatrix.f + groupMatrix.e,
      f: groupMatrix.b * itemMatrix.e + groupMatrix.d * itemMatrix.f + groupMatrix.f,
    };
    this.pathTransform = `matrix(${matrix.a} ${matrix.b} ${matrix.c} ${matrix.d} ${matrix.e} ${matrix.f})`;
    this.pathGeometry.setPathDefinition(this.pathDefinition);
    this.transformedPathGeometry = new TransformedPathGeometry(this.pathGeometry, matrix);

    const scaleStyles = this.getRenderStyles(ConfigHelper.toStyleDict(this.config.horseshoe_scale.styles), [this.config.horseshoe_scale.color_filter]);
    const stateStyles = this.getRenderStyles(ConfigHelper.toStyleDict(this.config.horseshoe_state.styles), [this.config.horseshoe_state.color_filter]);
    this.renderContract = {
      backgroundRange: {
        id: 'scale',
        start: 0,
        end: 100,
        length: 100,
        color: scaleStyles.fill,
        width: Number(this.config.horseshoe_scale.width),
        opacity: Number(scaleStyles.opacity),
        startCap: this.config.horseshoe_scale.linecap.start,
        endCap: this.config.horseshoe_scale.linecap.end,
        dash: { array: [100, 100], offset: 0 },
      },
      stateRanges: [],
      backgroundLayer: {
        opacity: Number(scaleStyles.opacity),
        fillOpacity: Number(scaleStyles['fill-opacity'] ?? 1),
        strokeOpacity: Number(scaleStyles['stroke-opacity'] ?? 1),
        border: {
          color: scaleStyles.stroke ?? 'transparent',
          width: Number(scaleStyles['stroke-width'] ?? 0),
        },
      },
      stateLayer: {
        opacity: Number(stateStyles.opacity),
        fillOpacity: Number(stateStyles['fill-opacity'] ?? 1),
        strokeOpacity: Number(stateStyles['stroke-opacity'] ?? 1),
        border: {
          color: stateStyles.stroke ?? 'transparent',
          width: Number(stateStyles['stroke-width'] ?? 0),
        },
      },
    };
    this.scaleGradient = undefined;
    this.stateGradient = undefined;
    this.stateGradientKey = undefined;
    this.scaleAndBackgroundLayoutKey = undefined;
    this.pathElementsKey = undefined;
    this.pathElements = { ticks: [], labels: [], markers: [] };
    this.backgroundLayers = [];
  }

  /**
   * Maps the entity through the shared state resolver, then builds path-independent
   * value and painted ranges for all non-gradient scale and state modes.
   */
  setState(entity, entityConfig) {
    super.setState(entity, entityConfig);

    const stateData = getGaugeStateData(this.runtimeConfig, entity, entityConfig);
    this.config = stateData.config;
    this.config.state_map = this.buildStateMapDisplayLabels(this.config.state_map, entity);
    const displayMappedState = this.config.state_map?.map?.find((entry) => entry.state === stateData.mappedState?.state && Number(entry.value) === Number(stateData.mappedState?.value));
    this.config.mapped_state = displayMappedState ? { ...stateData.mappedState, ...displayMappedState, color: stateData.mappedState.color ?? displayMappedState.color } : stateData.mappedState;
    this.value = stateData.value;
    this.scale = new GaugeScale(this.config.horseshoe_scale);
    this.valueMapper = new PathValueMapper(
      {
        scale: this.scale,
        barMode: this.config.bar_mode,
        zeroRatio: this.config.zero_ratio,
        stateMode: this.config.horseshoe_state.mode,
        stateMap: this.config.state_map?.map ?? [],
      },
      this.value,
    );

    const rawStateStyles = ConfigHelper.toStyleDict(this.config.horseshoe_state.styles);
    const rawScaleStyles = ConfigHelper.toStyleDict(this.config.horseshoe_scale.styles);
    const stateStyles = this.getRenderStyles(rawStateStyles, [this.config.horseshoe_state.color_filter]);
    const scaleStyles = this.getRenderStyles(rawScaleStyles, [this.config.horseshoe_scale.color_filter]);
    const stateMode = this.config.show.horseshoe_style;
    const scaleMode = this.config.show.scale_style ?? 'fixed';
    const stateRanges = this.valueMapper.buildStateRanges(this.value);
    const activeStateRanges = stateRanges.filter((range) => range.active);
    const stateClip = activeStateRanges.length
      ? {
          start: Math.min(...activeStateRanges.map((range) => range.start)),
          end: Math.max(...activeStateRanges.map((range) => range.end)),
        }
      : { start: 0, end: 0 };
    const colorStops = this.valueMapper.getActiveColorStops(this.config.colorstops.colors);
    const colorStopRanges = this.valueMapper.buildColorStopRanges(colorStops.map((colorStop) => colorStop.value));
    const pathGap = this.pathContract.type === 'arc' ? (Number(this.config.horseshoe_state.segment_gap) / Math.abs(this.pathContract.arcDegrees)) * 100 : Number(this.config.horseshoe_state.segment_gap);
    let statePathRanges;
    this.stateSegmentPaints = [];

    if (this.config.horseshoe_state.mode === 'segment' || this.config.horseshoe_state.mode === 'stringstate_mode' || this.config.horseshoe_state.mode === 'stringstate_level') {
      statePathRanges = buildPaintedRanges(stateRanges, {
        paints: stateRanges.map((range, index) => ({
          color: this.getRenderStyles({ ...rawStateStyles, fill: this.config.state_map.map[index].color ?? Colors.calculateStrokeColor(this.config.state_map.map[index].value, this.config.colorstops, stateMode === 'colorstopinterpolated') }, [this.config.horseshoe_state.color_filter]).fill,
          width: Number(this.config.horseshoe_state.width),
          opacity: range.active ? Number(stateStyles.opacity) : Number(this.config.horseshoe_state.inactive_opacity ?? 0),
        })),
        clip: { start: 0, end: 100 },
        gap: pathGap,
        endpointGap: { start: pathGap / 2, end: pathGap / 2 },
        linecap: this.config.horseshoe_state.linecap,
      });
    } else if (stateMode === 'colorstopsegments' && colorStopRanges.length) {
      this.stateSegmentPaints = colorStopRanges.map((range) => ({
        color: this.getRenderStyles({ ...rawStateStyles, fill: Colors.calculateStrokeColor(range.sourceValue, this.config.colorstops, false) }, [this.config.horseshoe_state.color_filter]).fill,
        width: Number(this.config.horseshoe_state.width),
        opacity: Number(stateStyles.opacity),
      }));
      statePathRanges = buildPaintedRanges(colorStopRanges, {
        paints: this.stateSegmentPaints,
        clip: stateClip,
        gap: pathGap,
        endpointGap: { start: 0, end: 0 },
        linecap: this.config.horseshoe_state.linecap,
      });
    } else {
      let stateColor = stateStyles.fill;

      if (stateMode === 'colorstop' || stateMode === 'colorstopinterpolated') {
        stateColor = Colors.calculateStrokeColor(this.value, this.config.colorstops, stateMode === 'colorstopinterpolated');
      }
      if (stateMode === 'autominmax') {
        stateColor = Colors.calculateStrokeColor(this.value, this.config.colorstopsMinMax, true);
      }
      stateColor = this.getRenderStyles({ ...rawStateStyles, fill: stateColor }, [this.config.horseshoe_state.color_filter]).fill;

      statePathRanges = buildPaintedRanges(stateRanges, {
        paints: stateRanges.map(() => ({
          color: stateColor,
          width: Number(this.config.horseshoe_state.width),
          opacity: Number(stateStyles.opacity),
        })),
        clip: { start: 0, end: 100 },
        gap: 0,
        endpointGap: { start: 0, end: 0 },
        linecap: this.config.horseshoe_state.linecap,
      });
    }

    const scaleGap = this.pathContract.type === 'arc' ? (Number(this.config.colorstops.gap) / Math.abs(this.pathContract.arcDegrees)) * 100 : Number(this.config.colorstops.gap);
    let scaleRanges = [];

    if (scaleMode === 'fixed' || (scaleMode === 'colorstopsegments' && !colorStopRanges.length)) {
      scaleRanges = [this.renderContract.backgroundRange];
    }
    if (scaleMode === 'colorstopsegments' && colorStopRanges.length) {
      scaleRanges = buildPaintedRanges(colorStopRanges, {
        paints: colorStopRanges.map((range) => ({
          color: this.getRenderStyles({ ...rawScaleStyles, fill: Colors.calculateStrokeColor(range.sourceValue, this.config.colorstops, false) }, [this.config.horseshoe_scale.color_filter]).fill,
          width: Number(this.config.horseshoe_scale.width),
          opacity: Number(scaleStyles.opacity),
        })),
        clip: { start: 0, end: 100 },
        gap: scaleGap,
        endpointGap: { start: 0, end: 0 },
        linecap: this.config.horseshoe_scale.linecap,
      });
    }

    this.renderContract.scaleRanges = scaleRanges;
    this.renderContract.stateMode = stateMode;
    this.renderContract.scaleMode = scaleMode;
    this.renderContract.stateClip = stateClip;
    this.renderContract.colorStops = colorStops;
    this.renderContract.stateRanges = statePathRanges;
    this.stateRanges = stateRanges;
    this.colorStopRanges = colorStopRanges;
    this.statePaints = [
      {
        color: statePathRanges[0]?.color ?? stateStyles.fill,
        width: Number(this.config.horseshoe_state.width),
        opacity: Number(stateStyles.opacity),
      },
    ];
    this.statePaintConfig = {
      gap: pathGap,
      linecap: this.config.horseshoe_state.linecap,
    };

    const targetProgress = this.valueMapper.valueToProgress(this.value);
    const discreteState = this.config.horseshoe_state.mode === 'segment' || this.config.horseshoe_state.mode === 'stringstate_mode' || this.config.horseshoe_state.mode === 'stringstate_level';

    if (this.displayProgress === undefined || discreteState || !this.stateAnimator.stateLayerElement) {
      this.displayProgress = targetProgress;
      this.stateAnimator.currentProgress = targetProgress;
    } else if (this.stateAnimator.currentProgress !== targetProgress) {
      this.stateAnimator.animateTo(targetProgress);
    }

    if (this.pathGeometry.isReady()) {
      this.buildMeasuredGradientContracts();
    }
  }

  /**
   * Adds Home Assistant's translated state or attribute text to mapped labels.
   * Explicit labels remain authoritative, exactly as in the current horseshoe.
   */
  buildStateMapDisplayLabels(stateMap, entity) {
    if (!stateMap?.map || stateMap.type === 'rank_state') return stateMap;

    return {
      ...stateMap,
      map: stateMap.map.map((entry) => {
        const state = String(entry.state ?? entry.value);
        const displayLabel = this.entityConfig.attribute !== undefined ? this.card._hass.formatEntityAttributeValue(entity, this.entityConfig.attribute, state) : this.card._hass.formatEntityState(entity, state);

        return {
          ...entry,
          display_label: entry.label ?? displayLabel,
        };
      }),
    };
  }

  /**
   * Builds browser-measured gradient contracts after value ranges are known.
   * Full gradients retain value positions; current gradients distribute their
   * selected colors over only the currently visible state range.
   */
  buildMeasuredGradientContracts() {
    const stateMode = this.renderContract.stateMode;
    const scaleMode = this.renderContract.scaleMode;
    const stateClip = this.renderContract.stateClip;
    const sourceColorStops = this.renderContract.colorStops;
    const stateGradientKey = JSON.stringify({
      path: this.pathDefinition.signature,
      stateMode,
      stateClip,
      sourceColorStops,
      stateWidth: this.config.horseshoe_state.width,
      stateLinecap: this.config.horseshoe_state.linecap,
      barMode: this.config.bar_mode,
      value: this.value,
    });
    const scaleAndBackgroundLayoutKey = JSON.stringify({
      path: this.pathDefinition.signature,
      scaleMode,
      sourceColorStops,
      scaleWidth: this.config.horseshoe_scale.width,
      scaleLinecap: this.config.horseshoe_scale.linecap,
      backgrounds: {
        show: this.config.show,
        horseshoe: this.config.horseshoe_background,
        labels: this.config.horseshoe_labels.background,
        ticks: this.config.horseshoe_tickmarks.background,
      },
    });
    const pathElementsKey = JSON.stringify({
      path: this.pathDefinition.signature,
      labels: this.config.horseshoe_labels,
      tickmarks: this.config.horseshoe_tickmarks,
      show: this.config.show,
      mappedState: this.config.mapped_state,
      barMode: this.config.bar_mode,
      activeScaleRange: this.valueMapper.getActiveSourceRange(),
      scale: this.config.horseshoe_scale,
    });

    const rebuildStateGradient = stateGradientKey !== this.stateGradientKey;
    const rebuildScaleAndBackgroundLayers = scaleAndBackgroundLayoutKey !== this.scaleAndBackgroundLayoutKey;
    const rebuildPathElements = pathElementsKey !== this.pathElementsKey;

    if (!rebuildStateGradient && !rebuildScaleAndBackgroundLayers && !rebuildPathElements) return false;

    const adaptiveConfig = {
      maxSegmentLength: 25,
      minSegmentLength: 1,
      maxTangentAngle: 12,
      maxSegments: 96,
      overlap: 0.5,
    };
    const stateCompleteColorStops = sourceColorStops.map((colorStop) => ({
      progress: this.valueMapper.valueToProgress(colorStop.value),
      color: this.getRenderStyles({ fill: colorStop.color }, [this.config.horseshoe_state.color_filter]).fill,
    }));
    const stateEvenlyDistributedColorStops = sourceColorStops.map((colorStop, index) => ({
      progress: (index / (sourceColorStops.length - 1)) * 100,
      color: this.getRenderStyles({ fill: colorStop.color }, [this.config.horseshoe_state.color_filter]).fill,
    }));
    const scaleCompleteColorStops = sourceColorStops.map((colorStop) => ({
      progress: this.valueMapper.valueToProgress(colorStop.value),
      color: this.getRenderStyles({ fill: colorStop.color }, [this.config.horseshoe_scale.color_filter]).fill,
    }));
    const scaleEvenlyDistributedColorStops = sourceColorStops.map((colorStop, index) => ({
      progress: (index / (sourceColorStops.length - 1)) * 100,
      color: this.getRenderStyles({ fill: colorStop.color }, [this.config.horseshoe_scale.color_filter]).fill,
    }));

    if (rebuildScaleAndBackgroundLayers) {
      this.scaleGradient = undefined;
      if (scaleMode === 'lineargradient' || scaleMode === 'colorstopgradient') {
        this.scaleGradient = buildAdaptivePathGradient(this.pathGeometry, {
          ...adaptiveConfig,
          mode: 'full',
          range: { start: 0, end: 100 },
          colorStops: scaleMode === 'lineargradient' ? scaleEvenlyDistributedColorStops : scaleCompleteColorStops,
          width: Number(this.config.horseshoe_scale.width),
          startCap: this.config.horseshoe_scale.linecap.start,
          endCap: this.config.horseshoe_scale.linecap.end,
        });
      }
    }

    if (rebuildStateGradient) {
      this.stateGradient = undefined;
      this.currentStateGradientConfig = undefined;
      if (stateMode === 'colorstopgradient') {
        this.stateGradient = buildAdaptivePathGradient(this.pathGeometry, {
          ...adaptiveConfig,
          mode: 'full',
          range: stateClip,
          colorStops: stateCompleteColorStops,
          width: Number(this.config.horseshoe_state.width),
          startCap: this.config.horseshoe_state.linecap.start,
          endCap: this.config.horseshoe_state.linecap.end,
        });
      }
      if (stateMode === 'minmaxgradient' || stateMode === 'lineargradient') {
        let currentColorStops = sourceColorStops;
        const bidirectional = this.config.bar_mode === 'bidirectional' || this.config.bar_mode === 'bidirectional_symmetrical' || this.config.bar_mode === 'bidirectional_linear' || this.config.bar_mode === 'absolute';

        if (bidirectional) {
          const zeroColor = this.getRenderStyles({ fill: Colors.calculateStrokeColor(0, this.config.colorstops, true) }, [this.config.horseshoe_state.color_filter]).fill;
          currentColorStops =
            Number(this.value) < 0
              ? [...stateCompleteColorStops.filter((_colorStop, index) => Number(sourceColorStops[index].value) < 0), { progress: this.valueMapper.zeroProgress, color: zeroColor }]
              : [{ progress: this.valueMapper.zeroProgress, color: zeroColor }, ...stateCompleteColorStops.filter((_colorStop, index) => Number(sourceColorStops[index].value) > 0)];
        } else {
          currentColorStops = stateCompleteColorStops;
        }

        const currentGradientStops =
          stateMode === 'minmaxgradient'
            ? [
                { progress: 0, color: currentColorStops[0].color },
                { progress: 100, color: currentColorStops[currentColorStops.length - 1].color },
              ]
            : currentColorStops.map((colorStop, index) => ({
                progress: (index / (currentColorStops.length - 1)) * 100,
                color: colorStop.color,
              }));

        this.currentStateGradientConfig = {
          ...adaptiveConfig,
          mode: 'current',
          colorStops: currentGradientStops,
          width: Number(this.config.horseshoe_state.width),
          startCap: this.config.horseshoe_state.linecap.start,
          endCap: this.config.horseshoe_state.linecap.end,
        };
        if (stateClip.end > stateClip.start) {
          this.stateGradient = buildAdaptivePathGradient(this.pathGeometry, {
            ...this.currentStateGradientConfig,
            range: stateClip,
          });
        }
      }
    }

    if (rebuildScaleAndBackgroundLayers) {
      const tickVisibilityForBackground = getTickmarkVisibility(this.config);
      const tickBackgroundConfig = this.config.horseshoe_tickmarks.background;
      const visibleTickConfig = tickVisibilityForBackground.major ? this.config.horseshoe_tickmarks.ticks_major : this.config.horseshoe_tickmarks.ticks_minor;
      const backgroundConfigs = [
        {
          id: 'horseshoe',
          mode: this.config.show.horseshoe_background ?? 'none',
          config: this.config.horseshoe_background,
          offset: Number(this.config.horseshoe_background.offset ?? 0),
          width: Number(this.config.horseshoe_background.width ?? this.config.horseshoe_scale.width),
          colorFilter: this.config.horseshoe_background.color_filter,
        },
        {
          id: 'label',
          mode: this.config.show.label_background ?? 'none',
          config: this.config.horseshoe_labels.background,
          offset: Number(this.config.horseshoe_labels.offset),
          width: Number(this.config.horseshoe_labels.background.width ?? 6),
          colorFilter: this.config.horseshoe_labels.background.color_filter,
        },
        {
          id: 'tick',
          mode: tickVisibilityForBackground.major || tickVisibilityForBackground.minor ? (this.config.show.tick_background ?? 'none') : 'none',
          config: tickBackgroundConfig,
          offset: Number(tickBackgroundConfig.offset ?? visibleTickConfig?.offset ?? 0),
          width: Number(tickBackgroundConfig.width ?? visibleTickConfig?.width ?? 4),
          colorFilter: tickBackgroundConfig.color_filter,
        },
      ];
      const backgroundColorStopRanges = this.valueMapper.buildColorStopRanges(sourceColorStops.map((colorStop) => colorStop.value));

      this.backgroundLayers = backgroundConfigs
        .filter((background) => background.mode !== 'none')
        .map((background) => {
          const rawStyles = ConfigHelper.toStyleDict(background.config.styles);
          const styles = this.getRenderStyles(rawStyles, [background.colorFilter]);
          const linecap = typeof background.config.linecap === 'object' ? background.config.linecap : { start: background.config.linecap ?? 'round', end: background.config.linecap ?? 'round' };
          const gap = this.pathContract.type === 'arc' ? (Number(background.config.gap ?? 0) / Math.abs(this.pathContract.arcDegrees)) * 100 : Number(background.config.gap ?? 0);
          const definition = background.offset === 0 ? this.pathDefinition : buildOffsetPathDefinition(this.pathGeometry, background.offset, 'left', 200);
          const layer = {
            opacity: Number(styles.opacity ?? 1),
            fillOpacity: Number(styles['fill-opacity'] ?? 1),
            strokeOpacity: Number(styles['stroke-opacity'] ?? 1),
            border: {
              color: styles.stroke ?? 'transparent',
              width: Number(styles['stroke-width'] ?? 0),
            },
          };
          let ranges = buildPaintedRanges(
            [
              {
                id: `${background.id}-background`,
                start: 0,
                end: 100,
                active: true,
                role: 'background',
              },
            ],
            {
              paints: [
                {
                  color: this.getRenderStyles({ ...rawStyles, fill: background.config.color ?? rawStyles.fill ?? rawStyles.stroke }, [background.colorFilter]).fill,
                  width: background.width,
                  opacity: 1,
                },
              ],
              clip: { start: 0, end: 100 },
              gap: 0,
              endpointGap: { start: gap / 2, end: gap / 2 },
              linecap,
            },
          );
          let gradient;

          if (background.mode === 'colorstopsegments') {
            ranges = buildPaintedRanges(backgroundColorStopRanges, {
              paints: backgroundColorStopRanges.map((range) => ({
                color: this.getRenderStyles({ ...rawStyles, fill: Colors.calculateStrokeColor(range.sourceValue, this.config.colorstops, false) }, [background.colorFilter]).fill,
                width: background.width,
                opacity: 1,
              })),
              clip: { start: 0, end: 100 },
              gap,
              endpointGap: { start: 0, end: 0 },
              linecap,
            });
          }
          if (background.mode === 'lineargradient' || background.mode === 'colorstopgradient') {
            gradient = buildAdaptivePathGradient(this.pathGeometry, {
              ...adaptiveConfig,
              mode: 'full',
              range: { start: 0, end: 100 },
              colorStops: sourceColorStops.map((colorStop, index) => ({
                progress: background.mode === 'lineargradient' ? (index / (sourceColorStops.length - 1)) * 100 : this.valueMapper.valueToProgress(colorStop.value),
                color: this.getRenderStyles({ fill: colorStop.color }, [background.colorFilter]).fill,
              })),
              width: background.width,
              startCap: linecap.start,
              endCap: linecap.end,
            });
          }

          return {
            ...background,
            definition,
            layer,
            ranges,
            gradient,
          };
        });
    }

    if (rebuildPathElements) {
      const tickVisibility = getTickmarkVisibility(this.config);
      const tickConfigs = [
        { layer: 'minor', visible: tickVisibility.minor, config: this.config.horseshoe_tickmarks.ticks_minor },
        { layer: 'major', visible: tickVisibility.major, config: this.config.horseshoe_tickmarks.ticks_major },
      ];
      const absolute = this.config.bar_mode === 'absolute';
      const bidirectional = this.config.bar_mode === 'bidirectional' || this.config.bar_mode === 'bidirectional_symmetrical' || this.config.bar_mode === 'bidirectional_linear';
      const tickMin = absolute ? 0 : Number(this.config.horseshoe_scale.min);
      const tickMax = absolute ? this.valueMapper.getActiveMagnitudeMax() : Number(this.config.horseshoe_scale.max);
      const tickAnchor = absolute || bidirectional ? 0 : tickMin;
      const majorTickSize = Number(this.config.horseshoe_tickmarks.ticks_major?.ticksize);
      const ticks = [];

      tickConfigs.forEach((tickLayer) => {
        if (!tickLayer.visible || !tickLayer.config) return;

        const tickSize = Number(tickLayer.config.ticksize);
        const tickStyles = ConfigHelper.toStyleDict(tickLayer.config.styles);
        const values = buildTickValues(tickMin, tickMax, tickSize, tickAnchor).filter(
          (value) => tickLayer.layer === 'major' || !Number.isFinite(majorTickSize) || Math.abs((value - tickAnchor) / majorTickSize - Math.round((value - tickAnchor) / majorTickSize)) >= 1e-9,
        );

        values.forEach((magnitude, index) => {
          const value = absolute ? this.valueMapper.magnitudeToSourceValue(magnitude) : magnitude;
          let color = tickLayer.config.color ?? tickStyles.fill;

          if (tickLayer.config.color_mode === 'colorstop') {
            color = Colors.calculateStrokeColor(value, this.config.colorstops, false);
          }
          if (tickLayer.config.color_mode === 'colorstopinterpolated') {
            color = Colors.calculateStrokeColor(value, this.config.colorstops, true);
          }
          const renderStyles = this.getRenderStyles({
            ...tickStyles,
            fill: color,
            stroke: color,
            'stroke-width': tickLayer.config.shape === 'circle' ? tickStyles['stroke-width'] : Number(tickLayer.config.thickness),
          }, [this.config.horseshoe_tickmarks.color_filter, tickLayer.config.color_filter]);

          ticks.push({
            id: `${tickLayer.layer}-${index}`,
            layer: tickLayer.layer,
            progress: this.valueMapper.valueToProgress(value),
            side: 'left',
            offset: Number(tickLayer.config.offset ?? 0),
            length: Number(tickLayer.config.width),
            shape: tickLayer.config.shape === 'circle' ? 'circle' : 'line',
            radius: Number(tickLayer.config.radius ?? Number(tickLayer.config.width) / 2),
            styles: renderStyles,
          });
        });
      });

      const labelStops = buildLabelStopItems(this.config, this.valueMapper);
      const labelStyles = ConfigHelper.toStyleDict(this.config.horseshoe_labels.styles);
      const badgeConfig = this.config.horseshoe_labels.badges;
      const pathLength = this.transformedPathGeometry.getTotalLength();
      const configuredLabelLength =
        this.pathContract.type === 'arc'
          ? (pathLength * Number(this.config.horseshoe_labels.arc_size ?? 24)) / Math.abs(this.pathContract.arcDegrees)
          : (pathLength * Number(this.config.horseshoe_labels.arc_size ?? 24)) / 260;
      const labels = labelStops.map((labelStop, index) => {
        const mappedStateLabels = this.config.horseshoe_state.mode === 'segment' || this.config.horseshoe_state.mode === 'stringstate_mode' || this.config.horseshoe_state.mode === 'stringstate_level';
        const progress = mappedStateLabels ? ((index + 0.5) / labelStops.length) * 100 : this.valueMapper.valueToProgress(labelStop.value);
        const text = applyEllipsis(String(labelStop.text), this.config.horseshoe_labels.ellipsis);
        const segmentLength = mappedStateLabels ? pathLength / labelStops.length : configuredLabelLength;
        const orientation = this.config.horseshoe_labels.orientation === 'horizontal' ? 'horizontal' : 'path';
        const badgeWidth = Number(badgeConfig.width ?? text.length * Number(badgeConfig.char_width ?? 4) + Number(badgeConfig.padding ?? 2) * 2);
        const badgeHeight = Number(badgeConfig.height ?? 8);

        return {
          id: `label-${index}`,
          progress,
          side: 'left',
          offset: Number(this.config.horseshoe_labels.offset),
          text,
          orientation,
          length: segmentLength,
          samples: 17,
          styles: this.getRenderStyles({ ...labelStyles, ...labelStop.styles }, [this.config.horseshoe_labels.color_filter]),
          badge: {
            visible: this.config.show.label_badges === true,
            shape: orientation === 'horizontal' ? 'circle' : 'capsule',
            radius: Number(badgeConfig.radius ?? Math.max(7, text.length * 3 + Number(badgeConfig.padding ?? 4))),
            width: badgeWidth,
            height: badgeHeight,
            styles: this.getRenderStyles({
              ...badgeConfig.styles,
              fill: badgeConfig.color ?? 'var(--card-background-color)',
              stroke: badgeConfig.border_color ?? 'none',
            }, [badgeConfig.color_filter]),
          },
        };
      });

      this.pathElements = buildPathElements(this.transformedPathGeometry, {
        ticks,
        labels,
        markers: [],
      });
    }

    this.stateGradientKey = stateGradientKey;
    this.scaleAndBackgroundLayoutKey = scaleAndBackgroundLayoutKey;
    this.pathElementsKey = pathElementsKey;
    return true;
  }

  /**
   * Renders one animated value progress into the dedicated state mount. Only
   * normalized clipping changes; master geometry and static layers are absent
   * from this contract and cannot be rebuilt by an animation frame.
   */
  renderStateAtProgress(progress, pathId) {
    const discreteState = this.config.horseshoe_state.mode === 'segment' || this.config.horseshoe_state.mode === 'stringstate_mode' || this.config.horseshoe_state.mode === 'stringstate_level';
    const bidirectional = this.config.bar_mode === 'bidirectional' || this.config.bar_mode === 'bidirectional_symmetrical' || this.config.bar_mode === 'bidirectional_linear';
    const clip = discreteState
      ? { start: 0, end: 100 }
      : bidirectional
        ? { start: Math.min(this.valueMapper.zeroProgress, progress), end: Math.max(this.valueMapper.zeroProgress, progress) }
        : { start: 0, end: progress };

    if (clip.end <= clip.start) {
      return renderNormalizedPathBands(this.pathDefinition, [], this.renderContract.stateLayer, `${pathId}-state`, 'horseshoe__state-band');
    }

    if (this.stateGradient || this.currentStateGradientConfig) {
      let gradient = this.stateGradient;

      if (gradient?.mode === 'full') {
        const length = clip.end - clip.start;
        gradient = {
          ...gradient,
          revealRange: {
            ...gradient.revealRange,
            start: clip.start,
            end: clip.end,
            dash: {
              array: [length, 100],
              offset: clip.start === 0 ? 0 : -clip.start,
            },
          },
        };
      } else if (!gradient || clip.start !== this.renderContract.stateClip.start || clip.end !== this.renderContract.stateClip.end) {
        gradient = buildAdaptivePathGradient(this.pathGeometry, {
          ...this.currentStateGradientConfig,
          range: clip,
        });
      }

      return renderAdaptivePathGradient(this.pathDefinition, gradient, this.renderContract.stateLayer, `${pathId}-state-gradient`, 'horseshoe__state-gradient');
    }

    let ranges = this.renderContract.stateRanges;

    if (!discreteState) {
      const animatedStateRanges = this.renderContract.stateMode === 'colorstopsegments' ? this.colorStopRanges : [{ ...this.stateRanges[0], start: clip.start, end: clip.end }];
      const paints =
        this.renderContract.stateMode === 'colorstopsegments'
          ? this.stateSegmentPaints
          : [this.statePaints[0]];

      ranges = buildPaintedRanges(animatedStateRanges, {
        paints,
        clip,
        gap: this.renderContract.stateMode === 'colorstopsegments' ? this.statePaintConfig.gap : 0,
        endpointGap: { start: 0, end: 0 },
        linecap: this.statePaintConfig.linecap,
      });
    }

    return renderNormalizedPathBands(this.pathDefinition, ranges, this.renderContract.stateLayer, `${pathId}-state`, 'horseshoe__state-band');
  }

  /** Binds the committed master centerline for gradients, tickmarks, labels, badges, and markers. */
  updated() {
    const pathId = `${this.cardId}-horseshoe-${this.index}`;
    const masterPath = this.card.shadowRoot.getElementById(`${pathId}-master`);
    const newlyBound = this.pathGeometry.bindPathElement(masterPath);
    const stateLayerElement = this.card.shadowRoot.getElementById(`${pathId}-state`);

    if (this.valueMapper) {
      this.stateAnimator.bindStateLayer(stateLayerElement);
    }

    if (newlyBound && this.valueMapper && this.buildMeasuredGradientContracts()) {
      this.card.requestUpdate();
    }
  }

  /** Renders the path layers followed by separately positioned tickmarks, labels, badges, and markers. */
  render() {
    if (!this.pathDefinition) return svg``;

    const pathId = `${this.cardId}-horseshoe-${this.index}`;
    return this.renderItemLayers(svg`
      <g
        id=${pathId}
        class="horseshoe"
        ${this.actionHandler()}
        @action=${(event) => this.handleAction(event)}
      >
        <g class="horseshoe__path" transform=${this.pathTransform}>
          <path
            id="${pathId}-master"
            class="horseshoe__master"
            d=${this.pathDefinition.d}
            pathLength="100"
            fill="none"
            stroke="transparent"
            stroke-width="0"
            visibility="hidden"
            pointer-events="none"
          ></path>
          ${this.backgroundLayers.map((background) =>
            background.gradient
              ? renderAdaptivePathGradient(background.definition, background.gradient, background.layer, `${pathId}-${background.id}-background-gradient`, `horseshoe__${background.id}-background-gradient`)
              : renderNormalizedPathBands(background.definition, background.ranges, background.layer, `${pathId}-${background.id}-background`, `horseshoe__${background.id}-background`),
          )}
          ${
            this.scaleGradient
              ? renderAdaptivePathGradient(this.pathDefinition, this.scaleGradient, this.renderContract.backgroundLayer, `${pathId}-scale-gradient`, 'horseshoe__scale-gradient')
              : renderNormalizedPathBands(this.pathDefinition, this.renderContract.scaleRanges, this.renderContract.backgroundLayer, `${pathId}-scale`, 'horseshoe__scale')
          }
          <g id="${pathId}-state" class="horseshoe__state">
            ${this.valueMapper ? this.renderStateAtProgress(this.stateAnimator.currentProgress, pathId) : svg``}
          </g>
        </g>
        <g class="horseshoe__path-elements">
          ${renderPathElements(this.pathElements, `${pathId}-items`)}
        </g>
      </g>
    `);
  }
}
