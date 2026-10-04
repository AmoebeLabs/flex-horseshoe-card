import { render, svg } from 'lit';

import BaseTool from './base-tool.js';
import Colors from './colors.js';
import ColorStops from './color-stops.js';
import { GaugeScale } from './horseshoe-geometry.js';
import { applyEllipsis, buildLabelStopItems } from './horseshoe-labels.js';
import { buildGaugeColorStops, getGaugeStateData, normalizeBaseConfig, translateHorseshoeConfig } from './horseshoe-state.js';
import { applyLegacyScaleTickmarkConfig, buildTickValues, getTickmarkVisibility } from './horseshoe-tickmarks.js';
import { buildArcPathDefinition, buildInfinityPathDefinition, buildLinePathDefinition, buildPolygonPathDefinition, buildRectanglePathDefinition, buildSpiralPathDefinition, buildWavePathDefinition, calculatePolygonMaximumRadius } from './path-generators.js';
import PathGeometry, { buildOffsetPathDefinition, TransformedPathGeometry } from './path-geometry.js';
import { buildPathElements } from './path-elements.js';
import { renderPathElements } from './path-elements-renderer.js';
import { buildAdaptivePathGradient, renderAdaptivePathGradient, setFullPathGradientRevealRange } from './path-gradient-renderer.js';
import PathStateAnimator from './path-animator.js';
import HorseshoeStateMarker from './horseshoe-marker.js';
import { getIconSource } from './icon-source.js';
import { injectExternalSvgSources } from './icon-svg-source.js';
import { renderNormalizedPathBands } from './path-mask-renderer.js';
import { buildPaintedRanges, PathValueMapper } from './path-ranges.js';
import Utils from './utils.js';

const PATH_TYPES = ['arc', 'line', 'rectangle', 'polygon', 'wave', 'spiral', 'infinity'];

/**
 * Translates horseshoe configuration into the complete path and rendering data
 * consumed by the generic path engine. Compatibility, defaults, and validation end here;
 * path modules never inspect card configuration.
 */
export default class HorseshoeGauge extends BaseTool {
  /**
   * Constructs gauges from the current section and the original root-level
   * configuration.
   */
  static setConfig(config, templates, cardId, card) {
    const legacyConfig = HorseshoeGauge.getLegacyRootConfig(config);
    const horseshoes = [
      ...(legacyConfig ? [legacyConfig] : []),
      ...(Array.isArray(config.layout?.horseshoes) ? config.layout.horseshoes : []),
    ];

    return horseshoes
      .filter(Boolean)
      .map((horseshoeConfig) => applyLegacyScaleTickmarkConfig(horseshoeConfig))
      .map((horseshoeConfig) => normalizeBaseConfig(horseshoeConfig))
      // A statically disabled gauge needs no geometry or runtime configuration.
      // Dynamic visibility remains source until the normal evaluation phase.
      .map((horseshoeConfig, index) => ({ horseshoeConfig, index }))
      .filter(({ horseshoeConfig }) => horseshoeConfig.show.horseshoe !== false)
      .map(({ horseshoeConfig, index }) => new HorseshoeGauge(horseshoeConfig, index, templates, cardId, card));
  }

  /** Copies original root-level horseshoe fields into one normal gauge item. */
  static getLegacyRootConfig(config) {
    const legacyFields = [
      'entity_index',
      'show',
      'horseshoe_position',
      'horseshoe_scale',
      'horseshoe_state',
      'horseshoe_marker',
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
    super(config, index, templates, cardId, card, 'horseshoes', 'horseshoes', 0, undefined,
      (newConfig) => translateHorseshoeConfig(newConfig, card.cardTheme.getActiveColorStopMode()));

    this.geometry = { templateGroup: card.cardLayout.groupManager.getGroupForItem(config) };
    this.paint = { sourceColorStopMode: card.cardTheme.getActiveColorStopMode() };
    this.geometry.pathInput = undefined;
    this.geometry.pathInputKey = undefined;
    this.geometry.pathTransformKey = undefined;
    this.geometry.pathElementsGeometryKey = undefined;
    this.geometry.backgroundDefinitions = new Map();
    this.geometry.pathDefinition = undefined;
    this.runtime.scale = undefined;
    this.runtime.valueMapper = undefined;
    this.runtime.value = undefined;
    this.geometry.pathGeometry = new PathGeometry(() => this.card.requestUpdate());
    this.geometry.transformedPathGeometry = undefined;
    this.geometry.transform = undefined;
    this.paint.scaleGradient = undefined;
    this.paint.stateGradient = undefined;
    this.paint.stateGradientKey = undefined;
    this.paint.scaleAndBackgroundLayoutKey = undefined;
    this.geometry.pathElementsKey = undefined;
    this.geometry.pathElements = { ticks: [], labels: [], markers: [] };
    this.geometry.pathElementSources = { ticks: [], labels: [] };
    this.geometry.colorStopPositions = [];
    this.paint.backgroundLayers = [];
    this.stateAnimator = undefined;
    this.stateMarker = new HorseshoeStateMarker(
      card,
      `${cardId}-horseshoe-${index}-marker`,
      () => this.stateAnimator.updateStateLayer(this.stateAnimator.stateLayerElement, this.stateAnimator.currentProgress),
    );
    this.paint.markerStyles = undefined;
    this.runtime.displayProgress = undefined;
    this.runtime.stateRanges = [];
    this.runtime.colorStopRanges = [];
    this.paint.stateSegmentPaints = [];
    this.paint.statePaints = [];
    this.paint.statePaintConfig = undefined;
    this.paint.currentStateGradientConfig = undefined;
    this.measuredPaintReady = false;
  }

  /**
   * Recolors the retained state after theme or palette variables have been applied.
   * Source ranges, measured paths and the running animation keep their positions.
   */
  updatePalettePaint() {
    // A palette can finish before the gauge has received its first entity.
    // That first state pass will calculate paint from the already applied colors.
    if ((this.hasJavascript && !this.runtimeConfigInitialized) || !this.runtime.valueMapper) return;

    const palette = buildGaugeColorStops(this.config, this.runtime, this.paint.sourceColorStops);
    this.paint.colorStops = palette.colorStops;
    this.paint.colorStopsMinMax = palette.minMax;
    this.paint.activeColorStops = this.runtime.valueMapper.getActiveColorStops(this.paint.colorStops.colors);
    this.updateStateAndScalePaint();
    // Binding a master path precedes building its gradients in updated(). Keep
    // that first measured pass with its normal owner, even if a palette finishes
    // in between those two lifecycle steps.
    if (this.geometry.pathGeometry.isReady() && this.measuredPaintReady) this.buildMeasuredGradientContracts(true);
  }

  /**
   * Normalizes the established arc fields and the frozen path shape schema.
   * Shape dimensions use card percentages and are converted to SVG units once.
   */
  updateRuntimeConfig() {
    // Existing templates see the original index/group/palette context. This
    // temporary view supplies that context to the single BaseTool evaluation;
    // neither sourceConfig nor current config stores derived palette or layout.
    const evaluateJavascript = this.hasJavascript && (!this.runtimeConfigInitialized || this.card.evaluateJavascriptTemplates);
    const templateContext = evaluateJavascript ? {
      ...this.sourceConfig,
      index: this.index,
      group_config: this.geometry.templateGroup,
      colorstops: ColorStops.normalize(this.sourceConfig.color_stops, this.paint.sourceColorStopMode),
    } : this.sourceConfig;
    super.updateRuntimeConfig(this.sourceConfig, { resolveKeys: true }, templateContext);
    if (!this.configChanged && this.geometry.pathDefinition) return;

    const itemConfig = this.config;
    this.paint.sourceColorStops = ColorStops.ensureMinimumStops(
      { gap: 0, ...this.paint.colorStops }, this.config.horseshoe_scale.max,
    );
    // Theme changes refresh active stops, but reuse the existing path and group
    // transform. The state pass separately compares numeric mapping inputs.
    if (!this.configurationChanged && !this.groupChanged && this.geometry.pathDefinition) return;
    const groupConfig = this.card.cardLayout.groupManager.getGroupForItem(this.config);
    this.geometry.group = groupConfig;
    this.geometry.svg = {
      xpos: Utils.calculateSvgDimension(groupConfig.xpos + itemConfig.xpos - 50),
      ypos: Utils.calculateSvgDimension(groupConfig.ypos + itemConfig.ypos - 50),
      radius: Utils.calculateSvgDimension(itemConfig.radius),
      tickmarks_radius: Utils.calculateSvgDimension(itemConfig.tickmarks_radius),
    };

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
          this.runtime.displayProgress = progress;
        },
        initialProgress: 0,
      });
    } else {
      // Timing changes restart from the visible progress with the new settings.
      // Paint-only changes leave the running transition on its existing clock.
      if (JSON.stringify(this.stateAnimator.animation) !== JSON.stringify(this.config.horseshoe_state.animation)) {
        this.stateAnimator.stopAnimation();
      }
      this.stateAnimator.animation = this.config.horseshoe_state.animation;
    }

    const sourcePath = itemConfig.path ?? {
      type: 'arc',
      radius: itemConfig.radius,
      arc_degrees: itemConfig.arc_degrees,
      start_angle: itemConfig.start_angle,
    };

    if (this.config.horseshoe_marker.attach_to === 'center' && sourcePath.type !== 'arc') {
      throw new Error('[horseshoes] center-attached horseshoe_marker requires path.type arc');
    }

    if (!PATH_TYPES.includes(sourcePath.type)) {
      throw new Error(`[horseshoes] path.type '${sourcePath.type}' is invalid [${PATH_TYPES.join(', ')}]`);
    }

    const center = this.geometry.svg;
    const dimension = (value) => Utils.calculateSvgDimension(value);

    // Every branch creates the complete config for one path generator. Shared item
    // placement stays outside path; all shape-specific fields remain in path.
    const pathInputKey = JSON.stringify([sourcePath, center.xpos, center.ypos]);
    // Paint changes retain the generated centerline. Only shape or placement
    // changes need to run the existing shape generator again.
    if (pathInputKey !== this.geometry.pathInputKey) {
      switch (sourcePath.type) {
        case 'arc': {
          const radius = sourcePath.radius ?? 45;
          const radiusX = sourcePath.radius_x ?? radius;
          const radiusY = sourcePath.radius_y ?? radius;
          const arcDegrees = sourcePath.arc_degrees ?? 260;
          if (radiusX <= 0 || radiusY <= 0 || arcDegrees === 0 || Math.abs(arcDegrees) > 360) {
            throw new Error('[horseshoes] arc radii must be greater than zero and arc_degrees must be between -360 and 360');
          }
          this.geometry.pathInput = {
            type: 'arc',
            cx: center.xpos,
            cy: center.ypos,
            radiusX: dimension(radiusX),
            radiusY: dimension(radiusY),
            startAngle: sourcePath.start_angle ?? 90 + (360 - arcDegrees) / 2,
            arcDegrees,
          };
          this.geometry.pathDefinition = buildArcPathDefinition(this.geometry.pathInput);
          break;
        }
        case 'line': {
          const length = dimension(sourcePath.length ?? 80);
          if (length <= 0) throw new Error('[horseshoes] line length must be greater than zero');
          const angle = ((sourcePath.angle ?? 0) * Math.PI) / 180;
          const deltaX = (Math.cos(angle) * length) / 2;
          const deltaY = (Math.sin(angle) * length) / 2;
          this.geometry.pathInput = {
            type: 'line',
            x1: center.xpos - deltaX,
            y1: center.ypos - deltaY,
            x2: center.xpos + deltaX,
            y2: center.ypos + deltaY,
          };
          this.geometry.pathDefinition = buildLinePathDefinition(this.geometry.pathInput);
          break;
        }
        case 'rectangle': {
          const width = dimension(sourcePath.width ?? 80);
          const height = dimension(sourcePath.height ?? 80);
          const radiusConfig = typeof sourcePath.radius === 'object' ? sourcePath.radius : { all: sourcePath.radius ?? 0 };
          const maxRadius = Math.min(width, height) / 2;
          const radius = (value) => Math.min(maxRadius, dimension(value));
          const start = sourcePath.start ?? 0;
          const end = sourcePath.end ?? 4;
          const top = sourcePath.top ?? 0.5;
          const direction = sourcePath.direction ?? 'clockwise';
          if (width <= 0 || height <= 0) throw new Error('[horseshoes] rectangle width and height must be greater than zero');
          if (![start, end, top].every((position) => Number.isFinite(position) && position >= 0 && position <= 4)) {
            throw new Error('[horseshoes] rectangle path.start, path.end, and path.top must be numbers from 0 through 4');
          }
          if (!['clockwise', 'counterclockwise'].includes(direction)) {
            throw new Error(`[horseshoes] rectangle path.direction '${sourcePath.direction}' is invalid [clockwise, counterclockwise]`);
          }
          this.geometry.pathInput = {
            type: 'rectangle',
            cx: center.xpos,
            cy: center.ypos,
            width,
            height,
            radiusTopLeft: radius(radiusConfig.top_left ?? radiusConfig.all),
            radiusTopRight: radius(radiusConfig.top_right ?? radiusConfig.all),
            radiusBottomRight: radius(radiusConfig.bottom_right ?? radiusConfig.all),
            radiusBottomLeft: radius(radiusConfig.bottom_left ?? radiusConfig.all),
            start,
            end,
            top,
            direction,
          };
          this.geometry.pathDefinition = buildRectanglePathDefinition(this.geometry.pathInput);
          break;
        }
        case 'polygon': {
          const sides = sourcePath.sides;
          const radiusValue = sourcePath.radius ?? 0;
          const start = sourcePath.start ?? 0;
          const end = sourcePath.end ?? sides;
          const top = sourcePath.top ?? (sides % 2 === 0 ? 0.5 : 0);
          const direction = sourcePath.direction ?? 'clockwise';

          if (!Number.isInteger(sides) || sides < 3) {
            throw new Error('[horseshoes] polygon path.sides must be an integer equal to or greater than 3');
          }
          if (sourcePath.width === undefined || sourcePath.height === undefined || sourcePath.width <= 0 || sourcePath.height <= 0) {
            throw new Error('[horseshoes] polygon path.width and path.height must be greater than zero');
          }
          if (!Number.isFinite(radiusValue) || radiusValue < 0) throw new Error('[horseshoes] polygon path.radius must be zero or greater');
          if (![start, end, top].every((position) => Number.isFinite(position) && position >= 0 && position <= sides)) {
            throw new Error(`[horseshoes] polygon path.start, path.end, and path.top must be numbers from 0 through ${sides}`);
          }
          if (!['clockwise', 'counterclockwise'].includes(direction)) {
            throw new Error(`[horseshoes] polygon path.direction '${sourcePath.direction}' is invalid [clockwise, counterclockwise]`);
          }

          this.geometry.pathInput = {
            type: 'polygon',
            cx: center.xpos,
            cy: center.ypos,
            sides,
            width: dimension(sourcePath.width),
            height: dimension(sourcePath.height),
            radius: dimension(radiusValue),
            start,
            end,
            top,
            direction,
          };
          if (this.geometry.pathInput.radius > calculatePolygonMaximumRadius(this.geometry.pathInput)) {
            throw new Error('[horseshoes] polygon path.radius is too large for its width, height, and number of sides');
          }
          this.geometry.pathDefinition = buildPolygonPathDefinition(this.geometry.pathInput);
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
          this.geometry.pathInput = {
            type: 'wave',
            x1: center.xpos - deltaX,
            y1: center.ypos - deltaY,
            x2: center.xpos + deltaX,
            y2: center.ypos + deltaY,
            waves: sourcePath.waves ?? 3,
            amplitude: dimension(sourcePath.amplitude ?? 8),
          };
          this.geometry.pathDefinition = buildWavePathDefinition(this.geometry.pathInput);
          break;
        }
        case 'spiral': {
          if ((sourcePath.radius_inner ?? 5) < 0 || (sourcePath.radius_outer ?? 40) <= 0 || (sourcePath.points ?? 48) < 2) {
            throw new Error('[horseshoes] spiral radii must be valid and points must be at least 2');
          }
          this.geometry.pathInput = {
            type: 'spiral',
            cx: center.xpos,
            cy: center.ypos,
            radiusInner: dimension(sourcePath.radius_inner ?? 5),
            radiusOuter: dimension(sourcePath.radius_outer ?? 40),
            startAngle: sourcePath.start_angle ?? -90,
            degrees: sourcePath.degrees ?? 720,
            points: sourcePath.points ?? 48,
          };
          this.geometry.pathDefinition = buildSpiralPathDefinition(this.geometry.pathInput);
          break;
        }
        case 'infinity': {
          if ((sourcePath.radius_x ?? 40) <= 0 || (sourcePath.radius_y ?? 25) <= 0) {
            throw new Error('[horseshoes] infinity radii must be greater than zero');
          }
          this.geometry.pathInput = {
            type: 'infinity',
            cx: center.xpos,
            cy: center.ypos,
            radiusX: dimension(sourcePath.radius_x ?? 40),
            radiusY: dimension(sourcePath.radius_y ?? 25),
          };
          this.geometry.pathDefinition = buildInfinityPathDefinition(this.geometry.pathInput);
          break;
        }
      }
      this.geometry.pathInputKey = pathInputKey;
    }

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
    this.geometry.transform = `matrix(${matrix.a} ${matrix.b} ${matrix.c} ${matrix.d} ${matrix.e} ${matrix.f})`;
    // Stop using the old state mount before replacing its measured master path.
    // The new binding receives the current state through the normal render cycle.
    if (this.geometry.pathGeometry.getPathDefinition()?.signature !== this.geometry.pathDefinition.signature) {
      this.stateAnimator.unbindStateLayer();
    }
    const pathChanged = this.geometry.pathGeometry.setPathDefinition(this.geometry.pathDefinition);
    const pathTransformKey = JSON.stringify([this.geometry.pathDefinition.signature, matrix]);
    if (pathTransformKey !== this.geometry.pathTransformKey) {
      this.geometry.transformedPathGeometry = new TransformedPathGeometry(this.geometry.pathGeometry, matrix);
      this.geometry.pathTransformKey = pathTransformKey;
    }

    const scaleStyles = this.getRenderStyles(this.config.horseshoe_scale.styles, [this.config.horseshoe_scale.color_filter]);
    const stateStyles = this.getRenderStyles(this.config.horseshoe_state.styles, [this.config.horseshoe_state.color_filter]);
    this.measuredPaintReady = false;
    this.paint.backgroundRange = {
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
      };
    this.paint.paintedStateRanges = [];
    this.paint.backgroundLayer = {
        opacity: Number(scaleStyles.opacity),
        fillOpacity: Number(scaleStyles['fill-opacity'] ?? 1),
        strokeOpacity: Number(scaleStyles['stroke-opacity'] ?? 1),
        border: {
          color: scaleStyles.stroke ?? 'transparent',
          width: Number(scaleStyles['stroke-width'] ?? 0),
        },
      };
    this.paint.stateLayer = {
        opacity: Number(stateStyles.opacity),
        fillOpacity: Number(stateStyles['fill-opacity'] ?? 1),
        strokeOpacity: Number(stateStyles['stroke-opacity'] ?? 1),
        border: {
          color: stateStyles.stroke ?? 'transparent',
          width: Number(stateStyles['stroke-width'] ?? 0),
        },
      };
    if (pathChanged) {
      this.paint.scaleGradient = undefined;
      this.paint.stateGradient = undefined;
      this.paint.stateGradientKey = undefined;
      this.paint.scaleAndBackgroundLayoutKey = undefined;
      this.geometry.pathElementsKey = undefined;
      this.geometry.pathElementsGeometryKey = undefined;
      this.geometry.pathElements = { ticks: [], labels: [], markers: [] };
      this.paint.backgroundLayers = [];
      this.geometry.backgroundDefinitions.clear();
    }
  }

  /** Compares the mapped value and painted ranges while retaining the path animator. */
  hasPresentationChanged() {
    if (this.hasJavascript && !this.runtimeConfigInitialized) return false;
    return super.hasPresentationChanged([
      this.runtime.value,
      this.paint.paintedStateRanges,
      this.paint.scaleRanges,
      this.paint.stateLayer,
      this.paint.backgroundLayer,
      this.paint.markerStyles,
    ]);
  }

  /**
   * Maps the entity through the shared state resolver, then builds path-independent
   * value and painted ranges for all non-gradient scale and state modes.
   */
  setState(entity, entityConfig) {
    super.setState(entity, entityConfig);

    // Active colors are deliberately absent from this key. A light/dark palette
    // switch reuses semantic mapping; changed thresholds/ranks still rebuild it.
    const mappingKey = JSON.stringify([
      entity.state, entity.attributes[entityConfig.attribute], entityConfig.attribute,
      this.config.state_map, this.config.horseshoe_scale, this.config.bar_mode,
      this.config.zero_ratio, this.config.horseshoe_state.mode,
      this.card._hass.locale,
      this.paint.sourceColorStops.colors.map(({ color, styles, ...mapping }) => mapping),
    ]);
    if (mappingKey !== this.runtime.mappingKey) {
      const stateData = getGaugeStateData(this.config, entity, entityConfig, this.paint.sourceColorStops);
      this.runtime.stateMap = this.buildStateMapDisplayLabels(stateData.stateMap, entity);
      const displayMappedState = this.runtime.stateMap.map.find((entry) => entry.state === stateData.mappedState?.state && Number(entry.value) === Number(stateData.mappedState?.value));
      this.runtime.mappedState = displayMappedState ? { ...stateData.mappedState, ...displayMappedState } : stateData.mappedState;
      this.runtime.rawState = stateData.rawState;
      this.runtime.value = stateData.value;
      this.runtime.scale = new GaugeScale(stateData.scale);
      this.runtime.valueMapper = new PathValueMapper({
        scale: this.runtime.scale,
        barMode: this.config.bar_mode,
        zeroRatio: this.config.zero_ratio,
        stateMode: this.config.horseshoe_state.mode,
        stateMap: this.runtime.stateMap.map,
      }, this.runtime.value);
      this.runtime.mappingKey = mappingKey;
    }
    const palette = buildGaugeColorStops(this.config, this.runtime, this.paint.sourceColorStops);
    this.paint.colorStops = palette.colorStops;
    this.paint.colorStopsMinMax = palette.minMax;

    // Range placement uses the configured band appearance. Color selection is
    // shared with later palette updates after these normalized ranges are stored.
    const stateStyles = this.config.horseshoe_state.styles;
    const scaleStyles = this.config.horseshoe_scale.styles;
    const stateMode = this.config.show.horseshoe_style;
    const scaleMode = this.config.show.scale_style ?? 'fixed';
    const stateRanges = this.runtime.valueMapper.buildStateRanges(this.runtime.value);
    const activeStateRanges = stateRanges.filter((range) => range.active);
    const stateClip = activeStateRanges.length
      ? {
          start: Math.min(...activeStateRanges.map((range) => range.start)),
          end: Math.max(...activeStateRanges.map((range) => range.end)),
        }
      : { start: 0, end: 0 };
    const colorStops = this.runtime.valueMapper.getActiveColorStops(this.paint.colorStops.colors);
    const colorStopRanges = this.runtime.valueMapper.buildColorStopRanges(colorStops.map((colorStop) => colorStop.value));
    const pathGap = this.geometry.pathInput.type === 'arc' ? (Number(this.config.horseshoe_state.segment_gap) / Math.abs(this.geometry.pathInput.arcDegrees)) * 100 : Number(this.config.horseshoe_state.segment_gap);
    let statePathRanges;

    if (this.config.horseshoe_state.mode === 'segment' || this.config.horseshoe_state.mode === 'stringstate_mode' || this.config.horseshoe_state.mode === 'stringstate_level') {
      const stringStateMode = this.config.horseshoe_state.mode === 'stringstate_mode' || this.config.horseshoe_state.mode === 'stringstate_level';
      const stateTransition = stringStateMode ? String(stateStyles.transition).replace(/\bfill\b/g, 'stroke') : stateStyles.transition;

      statePathRanges = buildPaintedRanges(stateRanges, {
        paints: stateRanges.map((range) => ({
          color: stateStyles.fill,
          width: Number(this.config.horseshoe_state.width),
          opacity: range.active ? Number(stateStyles.opacity) : Number(this.config.horseshoe_state.inactive_opacity ?? 0),
          transition: stateTransition,
        })),
        clip: { start: 0, end: 100 },
        gap: pathGap,
        endpointGap: { start: pathGap / 2, end: pathGap / 2 },
        linecap: this.config.horseshoe_state.linecap,
      });
    } else if (stateMode === 'colorstopsegments' && colorStopRanges.length) {
      statePathRanges = buildPaintedRanges(colorStopRanges, {
        paints: colorStopRanges.map(() => ({
          color: stateStyles.fill,
          width: Number(this.config.horseshoe_state.width),
          opacity: Number(stateStyles.opacity),
        })),
        clip: stateClip,
        gap: pathGap,
        endpointGap: { start: 0, end: 0 },
        linecap: this.config.horseshoe_state.linecap,
      });
    } else {
      statePathRanges = buildPaintedRanges(stateRanges, {
        paints: stateRanges.map(() => ({
          color: stateStyles.fill,
          width: Number(this.config.horseshoe_state.width),
          opacity: Number(stateStyles.opacity),
        })),
        clip: { start: 0, end: 100 },
        gap: 0,
        endpointGap: { start: 0, end: 0 },
        linecap: this.config.horseshoe_state.linecap,
      });
    }

    const scaleGap = this.geometry.pathInput.type === 'arc' ? (Number(this.paint.colorStops.gap) / Math.abs(this.geometry.pathInput.arcDegrees)) * 100 : Number(this.paint.colorStops.gap);
    let scaleRanges = [];

    if (scaleMode === 'fixed' || (scaleMode === 'colorstopsegments' && !colorStopRanges.length)) {
      scaleRanges = [this.paint.backgroundRange];
    }
    if (scaleMode === 'colorstopsegments' && colorStopRanges.length) {
      scaleRanges = buildPaintedRanges(colorStopRanges, {
        paints: colorStopRanges.map(() => ({
          color: scaleStyles.fill,
          width: Number(this.config.horseshoe_scale.width),
          opacity: Number(scaleStyles.opacity),
        })),
        clip: { start: 0, end: 100 },
        gap: scaleGap,
        endpointGap: { start: 0, end: 0 },
        linecap: this.config.horseshoe_scale.linecap,
      });
    }

    this.paint.scaleRanges = scaleRanges;
    this.runtime.stateClip = stateClip;
    this.paint.activeColorStops = colorStops;
    this.paint.paintedStateRanges = statePathRanges;
    this.runtime.stateRanges = stateRanges;
    this.runtime.colorStopRanges = colorStopRanges;
    this.paint.statePaintConfig = {
      gap: pathGap,
      linecap: this.config.horseshoe_state.linecap,
    };
    this.updateStateAndScalePaint();

    const targetProgress = this.runtime.valueMapper.valueToProgress(this.runtime.value);
    const discreteState = this.config.horseshoe_state.mode === 'segment' || this.config.horseshoe_state.mode === 'stringstate_mode' || this.config.horseshoe_state.mode === 'stringstate_level';

    if (this.runtime.displayProgress === undefined || discreteState || !this.stateAnimator.stateLayerElement) {
      this.runtime.displayProgress = targetProgress;
      this.stateAnimator.currentProgress = targetProgress;
    } else if (this.stateAnimator.currentProgress !== targetProgress) {
      this.stateAnimator.animateTo(targetProgress);
    }

    if (this.geometry.pathGeometry.isReady()) {
      this.buildMeasuredGradientContracts();
    }
  }

  /**
   * Applies the configured state and scale colors to their stored source ranges.
   * Both an entity update and a palette update use this same color/filter policy;
   * clipping, gaps, caps and animation progress remain owned by the range pass.
   */
  updateStateAndScalePaint() {
    const rawStateStyles = this.config.horseshoe_state.styles;
    const rawScaleStyles = this.config.horseshoe_scale.styles;
    const stateStyles = this.getRenderStyles(rawStateStyles, [this.config.horseshoe_state.color_filter]);
    const scaleStyles = this.getRenderStyles(rawScaleStyles, [this.config.horseshoe_scale.color_filter]);
    const stateMode = this.config.show.horseshoe_style;
    const scaleMode = this.config.show.scale_style;
    const colorContext = this.card.cardTheme.colorContext;
    let markerColor = stateStyles.fill;
    this.paint.stateSegmentPaints = [];

    // Mapped states keep their own source value even when an inactive segment
    // is transparent. Changing a palette therefore recolors every retained slot.
    if (this.config.horseshoe_state.mode === 'segment' || this.config.horseshoe_state.mode === 'stringstate_mode' || this.config.horseshoe_state.mode === 'stringstate_level') {
      this.paint.paintedStateRanges.forEach((range) => {
        const mappedState = this.runtime.stateMap.map.find((entry) => Number(entry.value) === Number(range.sourceValue));
        range.color = this.getRenderStyles({
          ...rawStateStyles,
          fill: mappedState.color ?? Colors.calculateStrokeColor(mappedState.value, this.paint.colorStops, stateMode === 'colorstopinterpolated', colorContext),
        }, [this.config.horseshoe_state.color_filter]).fill;
      });
      const mappedState = this.runtime.stateMap.map.find((entry) => Number(entry.value) === Number(this.runtime.mappedState.value));
      markerColor = this.getRenderStyles({
        ...rawStateStyles,
        fill: mappedState.color ?? Colors.calculateStrokeColor(mappedState.value, this.paint.colorStops, stateMode === 'colorstopinterpolated', colorContext),
      }, [this.config.horseshoe_state.color_filter]).fill;
    } else if (stateMode === 'colorstopsegments' && this.runtime.colorStopRanges.length) {
      this.paint.stateSegmentPaints = this.runtime.colorStopRanges.map((range) => ({
        color: this.getRenderStyles({ ...rawStateStyles, fill: Colors.calculateStrokeColor(range.sourceValue, this.paint.colorStops, false, colorContext) }, [this.config.horseshoe_state.color_filter]).fill,
        width: Number(this.config.horseshoe_state.width),
        opacity: Number(stateStyles.opacity),
      }));
      this.paint.paintedStateRanges.forEach((range) => {
        const sourceIndex = this.runtime.colorStopRanges.findIndex((sourceRange) => sourceRange.id === range.id);
        range.color = this.paint.stateSegmentPaints[sourceIndex].color;
      });
      markerColor = this.getRenderStyles({ ...rawStateStyles, fill: Colors.calculateStrokeColor(this.runtime.value, this.paint.colorStops, false, colorContext) }, [this.config.horseshoe_state.color_filter]).fill;
    } else {
      let stateColor = stateStyles.fill;
      if (stateMode === 'colorstop' || stateMode === 'colorstopinterpolated') {
        stateColor = Colors.calculateStrokeColor(this.runtime.value, this.paint.colorStops, stateMode === 'colorstopinterpolated', colorContext);
      }
      if (stateMode === 'autominmax') {
        stateColor = Colors.calculateStrokeColor(this.runtime.value, this.paint.colorStopsMinMax, true, colorContext);
      }
      stateColor = this.getRenderStyles({ ...rawStateStyles, fill: stateColor }, [this.config.horseshoe_state.color_filter]).fill;
      this.paint.paintedStateRanges.forEach((range) => { range.color = stateColor; });
      markerColor = stateColor;
    }

    this.paint.backgroundRange.color = scaleStyles.fill;
    if (scaleMode === 'colorstopsegments' && this.runtime.colorStopRanges.length) {
      this.paint.scaleRanges.forEach((range) => {
        range.color = this.getRenderStyles({ ...rawScaleStyles, fill: Colors.calculateStrokeColor(range.sourceValue, this.paint.colorStops, false, colorContext) }, [this.config.horseshoe_scale.color_filter]).fill;
      });
    }

    // Borders and the marker have independently configured paint. Their colors
    // follow the same filter cascade while explicit marker styles stay last.
    if ('stroke' in stateStyles) this.paint.stateLayer.border.color = stateStyles.stroke;
    if ('stroke' in scaleStyles) this.paint.backgroundLayer.border.color = scaleStyles.stroke;
    this.paint.statePaints = [{
      color: this.paint.paintedStateRanges[0]?.color ?? stateStyles.fill,
      width: Number(this.config.horseshoe_state.width),
      opacity: Number(stateStyles.opacity),
    }];
    this.paint.markerStyles = {
      ...stateStyles,
      fill: markerColor,
      ...this.config.horseshoe_marker.styles,
    };
  }

  /**
   * Adds Home Assistant's translated state or attribute text to mapped labels.
   * Explicit labels remain authoritative, exactly as in the current horseshoe.
   */
  buildStateMapDisplayLabels(stateMap, entity) {
    if (stateMap.type === 'rank_state') return stateMap;

    return {
      ...stateMap,
      map: stateMap.map.map((entry) => {
        const state = String(entry.state ?? entry.value);
        const displayLabel = this.runtime.entityConfig.attribute !== undefined ? this.card._hass.formatEntityAttributeValue(entity, this.runtime.entityConfig.attribute, state) : this.card._hass.formatEntityState(entity, state);

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
   *
   * @param {boolean} paintOnly - Reuse retained gradient coordinates and static layout.
   */
  buildMeasuredGradientContracts(paintOnly) {
    // External palettes may still be loading when the first measured paths are
    // built. Unresolved colors must leave these keys open for the palette-driven
    // update, matching the established horseshoe cache lifecycle.
    Colors.unresolvedColor = false;

    // The moving gradient may currently end between the last source value and
    // its target. Recolor that exact prepared domain instead of sampling the
    // target again or changing the running animation's visible position.
    const retainedStateGradient = this.paint.stateGradient;
    const retainedScaleGradient = this.paint.scaleGradient;
    const retainedBackgroundLayers = this.paint.backgroundLayers;

    const stateMode = this.config.show.horseshoe_style;
    const scaleMode = this.config.show.scale_style;
    const stateClip = this.runtime.stateClip;
    const sourceColorStops = this.paint.activeColorStops;
    const colorStopPositions = paintOnly ? this.geometry.colorStopPositions : sourceColorStops.map((colorStop) => this.runtime.valueMapper.valueToProgress(colorStop.value));
    if (!paintOnly) this.geometry.colorStopPositions = colorStopPositions;
    const colorFilterCascade = this.getColorFilterCascade();
    const stateGradientKey = paintOnly ? this.paint.stateGradientKey : JSON.stringify({
      path: this.geometry.pathDefinition.signature,
      stateMode,
      stateClip: stateMode === 'colorstopgradient' ? undefined : stateClip,
      sourceColorStops,
      colorStopPositions,
      colorFilter: [...colorFilterCascade, this.config.horseshoe_state.color_filter],
      stateWidth: this.config.horseshoe_state.width,
      stateLinecap: this.config.horseshoe_state.linecap,
      barMode: this.config.bar_mode,
      negativeBranch: stateMode === 'colorstopgradient' ? undefined : Number(this.runtime.value) < 0,
    });
    const scaleAndBackgroundLayoutKey = paintOnly ? this.paint.scaleAndBackgroundLayoutKey : JSON.stringify({
      path: this.geometry.pathDefinition.signature,
      scaleMode,
      sourceColorStops,
      colorStopPositions,
      colorFilter: [...colorFilterCascade, this.config.horseshoe_scale.color_filter],
      scaleWidth: this.config.horseshoe_scale.width,
      scaleLinecap: this.config.horseshoe_scale.linecap,
      backgrounds: {
        show: this.config.show,
        horseshoe: this.config.horseshoe_background,
        labels: this.config.horseshoe_labels,
        ticks: this.config.horseshoe_tickmarks,
      },
    });
    const pathElementsKey = paintOnly ? this.geometry.pathElementsKey : JSON.stringify({
      path: this.geometry.pathDefinition.signature,
      transform: this.geometry.pathTransformKey,
      colorFilter: colorFilterCascade,
      labels: this.config.horseshoe_labels,
      tickmarks: this.config.horseshoe_tickmarks,
      show: this.config.show,
      mappedState: this.runtime.mappedState,
      barMode: this.config.bar_mode,
      activeScaleRange: this.runtime.valueMapper.getActiveSourceRange(),
      scale: [this.runtime.scale.type, this.runtime.scale.min, this.runtime.scale.max, this.runtime.scale.points],
    });

    const rebuildStateGradient = paintOnly || stateGradientKey !== this.paint.stateGradientKey;
    const rebuildScaleAndBackgroundLayers = paintOnly || scaleAndBackgroundLayoutKey !== this.paint.scaleAndBackgroundLayoutKey;
    const rebuildPathElements = paintOnly || pathElementsKey !== this.geometry.pathElementsKey;

    // A full-path gradient keeps its color layout when only the value moves.
    // The new target updates its reveal; animation uses that same prepared layout.
    if (stateMode === 'colorstopgradient' && !rebuildStateGradient) {
      setFullPathGradientRevealRange(this.paint.stateGradient, stateClip);
    }

    if (!rebuildStateGradient && !rebuildScaleAndBackgroundLayers && !rebuildPathElements) {
      this.measuredPaintReady = true;
      return false;
    }

    const adaptiveConfig = {
      maxSegmentLength: 25,
      minSegmentLength: 1,
      maxTangentAngle: 12,
      maxSegments: 96,
      overlap: 2,
    };
    if (rebuildScaleAndBackgroundLayers) {
      this.paint.scaleGradient = undefined;
      if (scaleMode === 'lineargradient' || scaleMode === 'colorstopgradient') {
        const scaleColorStops = sourceColorStops.map((colorStop, index) => ({
          progress: scaleMode === 'lineargradient' ? (index / (sourceColorStops.length - 1)) * 100 : colorStopPositions[index],
          color: this.getRenderStyles({ fill: colorStop.color }, [this.config.horseshoe_scale.color_filter]).fill,
        }));
        const gradientGeometry = paintOnly
          ? { getGradientGeometry: () => retainedScaleGradient.geometry }
          : this.geometry.pathGeometry;
        this.paint.scaleGradient = buildAdaptivePathGradient(gradientGeometry, {
          ...adaptiveConfig,
          mode: 'full',
          range: { start: 0, end: 100 },
          colorStops: scaleColorStops,
          width: Number(this.config.horseshoe_scale.width),
          startCap: this.config.horseshoe_scale.linecap.start,
          endCap: this.config.horseshoe_scale.linecap.end,
        }, this.card.cardTheme.colorContext);
      }
    }

    if (rebuildStateGradient) {
      const stateCompleteColorStops = sourceColorStops.map((colorStop, index) => ({
        progress: colorStopPositions[index],
        color: this.getRenderStyles({ fill: colorStop.color }, [this.config.horseshoe_state.color_filter]).fill,
      }));
      this.paint.stateGradient = undefined;
      this.paint.currentStateGradientConfig = undefined;
      if (stateMode === 'colorstopgradient') {
        const gradientGeometry = paintOnly
          ? { getGradientGeometry: () => retainedStateGradient.geometry }
          : this.geometry.pathGeometry;
        this.paint.stateGradient = buildAdaptivePathGradient(gradientGeometry, {
          ...adaptiveConfig,
          mode: 'full',
          range: paintOnly ? retainedStateGradient.revealRange : stateClip,
          colorStops: stateCompleteColorStops,
          width: Number(this.config.horseshoe_state.width),
          startCap: this.config.horseshoe_state.linecap.start,
          endCap: this.config.horseshoe_state.linecap.end,
        }, this.card.cardTheme.colorContext);
      }
      if (stateMode === 'minmaxgradient' || stateMode === 'lineargradient') {
        let currentColorStops = sourceColorStops;
        const bidirectional = this.config.bar_mode === 'bidirectional' || this.config.bar_mode === 'bidirectional_symmetrical' || this.config.bar_mode === 'bidirectional_linear' || this.config.bar_mode === 'absolute';

        if (bidirectional) {
          const zeroColor = this.getRenderStyles({ fill: Colors.calculateStrokeColor(0, this.paint.colorStops, true, this.card.cardTheme.colorContext) }, [this.config.horseshoe_state.color_filter]).fill;
          currentColorStops =
            Number(this.runtime.value) < 0
              ? [...stateCompleteColorStops.filter((_colorStop, index) => Number(sourceColorStops[index].value) < 0), { progress: this.runtime.valueMapper.zeroProgress, color: zeroColor }]
              : [{ progress: this.runtime.valueMapper.zeroProgress, color: zeroColor }, ...stateCompleteColorStops.filter((_colorStop, index) => Number(sourceColorStops[index].value) > 0)];
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

        this.paint.currentStateGradientConfig = {
          ...adaptiveConfig,
          mode: 'current',
          colorStops: currentGradientStops,
          width: Number(this.config.horseshoe_state.width),
          startCap: this.config.horseshoe_state.linecap.start,
          endCap: this.config.horseshoe_state.linecap.end,
        };
        if (paintOnly ? retainedStateGradient !== undefined : stateClip.end > stateClip.start) {
          const range = paintOnly ? retainedStateGradient.revealRange : stateClip;
          const gradientGeometry = paintOnly
            ? { getGradientGeometry: () => retainedStateGradient.geometry }
            : this.geometry.pathGeometry;
          if (!paintOnly) this.geometry.pathGeometry.beginTemporarySampling(JSON.stringify(range));
          try {
            this.paint.stateGradient = buildAdaptivePathGradient(gradientGeometry, {
              ...this.paint.currentStateGradientConfig,
              range,
            }, this.card.cardTheme.colorContext);
          } finally {
            if (!paintOnly) this.geometry.pathGeometry.endTemporarySampling();
          }
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
      const backgroundColorStopRanges = this.runtime.colorStopRanges;

      this.paint.backgroundLayers = backgroundConfigs
        .filter((background) => background.mode !== 'none')
        .map((background) => {
          const rawStyles = background.config.styles;
          const styles = this.getRenderStyles(rawStyles, [background.colorFilter]);
          const linecap = typeof background.config.linecap === 'object' ? background.config.linecap : { start: background.config.linecap ?? 'round', end: background.config.linecap ?? 'round' };
          const gap = this.geometry.pathInput.type === 'arc' ? (Number(background.config.gap ?? 0) / Math.abs(this.geometry.pathInput.arcDegrees)) * 100 : Number(background.config.gap ?? 0);
          const definitionKey = JSON.stringify([this.geometry.pathDefinition.signature, background.offset]);
          if (!paintOnly && this.geometry.backgroundDefinitions.get(background.id)?.key !== definitionKey) {
            this.geometry.backgroundDefinitions.set(background.id, {
              key: definitionKey,
              definition: background.offset === 0 ? this.geometry.pathDefinition : buildOffsetPathDefinition(this.geometry.pathGeometry, background.offset, 'left', 200),
            });
          }
          const definition = this.geometry.backgroundDefinitions.get(background.id).definition;
          const retainedBackground = retainedBackgroundLayers.find((item) => item.id === background.id);
          const layer = {
            opacity: Number(styles.opacity ?? 1),
            fillOpacity: Number(styles['fill-opacity'] ?? 1),
            strokeOpacity: Number(styles['stroke-opacity'] ?? 1),
            border: {
              color: styles.stroke ?? 'transparent',
              width: Number(styles['stroke-width'] ?? 0),
            },
          };
          let ranges = paintOnly ? retainedBackground.ranges : buildPaintedRanges(
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
                  color: rawStyles.fill,
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
            ranges = paintOnly ? retainedBackground.ranges : buildPaintedRanges(backgroundColorStopRanges, {
              paints: backgroundColorStopRanges.map(() => ({
                color: rawStyles.fill,
                width: background.width,
                opacity: 1,
              })),
              clip: { start: 0, end: 100 },
              gap,
              endpointGap: { start: 0, end: 0 },
              linecap,
            });
          }
          // Normal state work and palette-only work share this paint selection.
          // The latter retains the already clipped band endpoints and caps.
          ranges.forEach((range) => {
            const color = background.mode === 'colorstopsegments'
              ? Colors.calculateStrokeColor(range.sourceValue, this.paint.colorStops, false, this.card.cardTheme.colorContext)
              : background.config.color ?? rawStyles.fill ?? rawStyles.stroke;
            range.color = this.getRenderStyles({ ...rawStyles, fill: color }, [background.colorFilter]).fill;
          });
          if (background.mode === 'lineargradient' || background.mode === 'colorstopgradient') {
            const gradientGeometry = paintOnly
              ? { getGradientGeometry: () => retainedBackground.gradient.geometry }
              : this.geometry.pathGeometry;
            gradient = buildAdaptivePathGradient(gradientGeometry, {
              ...adaptiveConfig,
              mode: 'full',
              range: { start: 0, end: 100 },
              colorStops: sourceColorStops.map((colorStop, index) => ({
                progress: background.mode === 'lineargradient' ? (index / (sourceColorStops.length - 1)) * 100 : colorStopPositions[index],
                color: this.getRenderStyles({ fill: colorStop.color }, [background.colorFilter]).fill,
              })),
              width: background.width,
              startCap: linecap.start,
              endCap: linecap.end,
            }, this.card.cardTheme.colorContext);
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
      const badgeConfig = this.config.horseshoe_labels.badges;
      if (!paintOnly) {
        const tickVisibility = getTickmarkVisibility(this.config);
        const tickConfigs = [
          { layer: 'minor', visible: tickVisibility.minor, config: this.config.horseshoe_tickmarks.ticks_minor },
          { layer: 'major', visible: tickVisibility.major, config: this.config.horseshoe_tickmarks.ticks_major },
        ];
        const absolute = this.config.bar_mode === 'absolute';
        const bidirectional = this.config.bar_mode === 'bidirectional' || this.config.bar_mode === 'bidirectional_symmetrical' || this.config.bar_mode === 'bidirectional_linear';
        const tickMin = absolute ? 0 : this.runtime.scale.min;
        const tickMax = absolute ? this.runtime.valueMapper.getActiveMagnitudeMax() : this.runtime.scale.max;
        const tickAnchor = absolute || bidirectional ? 0 : tickMin;
        const majorTickSize = Number(this.config.horseshoe_tickmarks.ticks_major?.ticksize);
        const ticks = [];

        tickConfigs.forEach((tickLayer) => {
          if (!tickLayer.visible || !tickLayer.config) return;

          const tickSize = Number(tickLayer.config.ticksize);
          const tickStyles = tickLayer.config.styles;
          const values = buildTickValues(tickMin, tickMax, tickSize, tickAnchor).filter(
            (value) => tickLayer.layer === 'major' || !Number.isFinite(majorTickSize) || Math.abs((value - tickAnchor) / majorTickSize - Math.round((value - tickAnchor) / majorTickSize)) >= 1e-9,
          );

          values.forEach((magnitude, index) => {
            const value = absolute ? this.runtime.valueMapper.magnitudeToSourceValue(magnitude) : magnitude;
            ticks.push({
              id: `${tickLayer.layer}-${index}`,
              layer: tickLayer.layer,
              progress: this.runtime.valueMapper.valueToProgress(value),
              side: 'left',
              offset: Number(tickLayer.config.offset ?? 0),
              length: Number(tickLayer.config.width),
              shape: tickLayer.config.shape === 'circle' ? 'circle' : 'line',
              radius: Number(tickLayer.config.radius ?? Number(tickLayer.config.width) / 2),
              sourceValue: value,
              styles: tickStyles,
            });
          });
        });

        const labelStops = buildLabelStopItems(this.config, this.runtime, this.paint);
        const labelStyles = this.config.horseshoe_labels.styles;
        const pathLength = this.geometry.transformedPathGeometry.getTotalLength();
        const configuredLabelLength =
          this.geometry.pathInput.type === 'arc'
            ? (pathLength * Number(this.config.horseshoe_labels.arc_size ?? 24)) / Math.abs(this.geometry.pathInput.arcDegrees)
            : (pathLength * Number(this.config.horseshoe_labels.arc_size ?? 24)) / 260;
        const labels = labelStops.map((labelStop, index) => {
          const mappedStateLabels = this.config.horseshoe_state.mode === 'segment' || this.config.horseshoe_state.mode === 'stringstate_mode' || this.config.horseshoe_state.mode === 'stringstate_level';
          const progress = mappedStateLabels ? ((index + 0.5) / labelStops.length) * 100 : this.runtime.valueMapper.valueToProgress(labelStop.value);
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
            styles: { ...labelStyles, ...labelStop.styles },
            badge: {
              visible: this.config.show.label_badges === true,
              shape: orientation === 'horizontal' ? 'circle' : 'capsule',
              radius: Number(badgeConfig.radius ?? Math.max(7, text.length * 3 + Number(badgeConfig.padding ?? 4))),
              width: badgeWidth,
              height: badgeHeight,
              styles: {
                ...badgeConfig.styles,
                fill: badgeConfig.color ?? 'var(--card-background-color)',
                stroke: badgeConfig.border_color ?? 'none',
              },
            },
          };
        });

        this.geometry.pathElementSources = { ticks, labels };
      }

      // Source values and unfiltered styles are stored beside the static layout.
      // Recoloring uses that same paint policy without rebuilding tick values,
      // label stops or their measured guide paths.
      const ticks = this.geometry.pathElementSources.ticks.map((tick) => {
        const tickConfig = tick.layer === 'major' ? this.config.horseshoe_tickmarks.ticks_major : this.config.horseshoe_tickmarks.ticks_minor;
        let color = tickConfig.color ?? tick.styles.fill;
        if (tickConfig.color_mode === 'colorstop') {
          color = Colors.calculateStrokeColor(tick.sourceValue, this.paint.colorStops, false, this.card.cardTheme.colorContext);
        }
        if (tickConfig.color_mode === 'colorstopinterpolated') {
          color = Colors.calculateStrokeColor(tick.sourceValue, this.paint.colorStops, true, this.card.cardTheme.colorContext);
        }
        return {
          ...tick,
          styles: this.getRenderStyles({
            ...tick.styles,
            fill: color,
            stroke: color,
            'stroke-width': tickConfig.shape === 'circle' ? tick.styles['stroke-width'] : Number(tickConfig.thickness),
          }, [this.config.horseshoe_tickmarks.color_filter, tickConfig.color_filter]),
        };
      });
      const labels = this.geometry.pathElementSources.labels.map((label) => ({
        ...label,
        styles: this.getRenderStyles(label.styles, [this.config.horseshoe_labels.color_filter]),
        badge: { ...label.badge, styles: this.getRenderStyles(label.badge.styles, [badgeConfig.color_filter]) },
      }));

      const elementsGeometryKey = paintOnly ? this.geometry.pathElementsGeometryKey : JSON.stringify([
        this.geometry.pathTransformKey,
        ticks.map((tick) => [tick.id, tick.layer, tick.progress, tick.side, tick.offset, tick.length, tick.shape, tick.radius]),
        labels.map((label) => [
          label.id, label.progress, label.side, label.offset, label.text, label.orientation, label.length, label.samples,
          label.badge.visible, label.badge.shape, label.badge.radius, label.badge.width, label.badge.height,
        ]),
      ]);
      if (!paintOnly && elementsGeometryKey !== this.geometry.pathElementsGeometryKey) {
        this.geometry.pathElements = buildPathElements(this.geometry.transformedPathGeometry, { ticks, labels, markers: [] });
        this.geometry.pathElementsGeometryKey = elementsGeometryKey;
      } else {
        // Color and opacity changes update paint on the prepared coordinates.
        // Label guide paths and tick endpoints remain the existing result.
        const tickPaint = new Map(ticks.map((tick) => [tick.id, tick.styles]));
        const labelPaint = new Map(labels.map((label) => [label.id, label]));
        this.geometry.pathElements = {
          ticks: this.geometry.pathElements.ticks.map((tick) => ({ ...tick, styles: tickPaint.get(tick.id) })),
          labels: this.geometry.pathElements.labels.map((label) => {
            const paint = labelPaint.get(label.id);
            return {
              ...label,
              styles: paint.styles,
              badge: { ...label.badge, styles: paint.badge.styles },
            };
          }),
          markers: [],
        };
      }
    }

    if (!Colors.unresolvedColor) {
      this.paint.stateGradientKey = stateGradientKey;
      this.paint.scaleAndBackgroundLayoutKey = scaleAndBackgroundLayoutKey;
      this.geometry.pathElementsKey = pathElementsKey;
    } else {
      // Leave failed palette colors retryable on the next normal measured pass.
      this.paint.stateGradientKey = undefined;
      this.paint.scaleAndBackgroundLayoutKey = undefined;
      this.geometry.pathElementsKey = undefined;
    }
    this.measuredPaintReady = true;
    return true;
  }

  /**
   * Renders one animated value progress into the dedicated state mount. Only
   * normalized clipping changes; master geometry and static layers are absent
   * from this contract and cannot be rebuilt by an animation frame.
   */
  renderStateAtProgress(progress, pathId) {
    // The marker and current gradient share samples for this drawing pass.
    // Fixed labels, ticks and full gradients retain their separate cache.
    this.geometry.pathGeometry.beginTemporarySampling(JSON.stringify([progress, this.runtime.valueMapper.zeroProgress, this.config.bar_mode]));
    try {
      const discreteState = this.config.horseshoe_state.mode === 'segment' || this.config.horseshoe_state.mode === 'stringstate_mode' || this.config.horseshoe_state.mode === 'stringstate_level';
      const bidirectional = this.config.bar_mode === 'bidirectional' || this.config.bar_mode === 'bidirectional_symmetrical' || this.config.bar_mode === 'bidirectional_linear';
      const clip = discreteState
        ? { start: 0, end: 100 }
        : bidirectional
          ? { start: Math.min(this.runtime.valueMapper.zeroProgress, progress), end: Math.max(this.runtime.valueMapper.zeroProgress, progress) }
          : { start: 0, end: progress };

      let progressLayer = svg``;

      if (this.config.show.state_progress && clip.end > clip.start) {
        if (this.paint.stateGradient || this.paint.currentStateGradientConfig) {
          let gradient = this.paint.stateGradient;

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
          } else if (!gradient || clip.start !== gradient.revealRange.start || clip.end !== gradient.revealRange.end) {
            gradient = buildAdaptivePathGradient(this.geometry.pathGeometry, {
              ...this.paint.currentStateGradientConfig,
              range: clip,
            }, this.card.cardTheme.colorContext);
            this.paint.stateGradient = gradient;
          }

          progressLayer = renderAdaptivePathGradient(this.geometry.pathDefinition, gradient, this.paint.stateLayer, `${pathId}-state-gradient`, 'horseshoe__state-gradient');
        } else {
          let ranges = this.paint.paintedStateRanges;

          if (!discreteState) {
            const animatedStateRanges = this.config.show.horseshoe_style === 'colorstopsegments' ? this.runtime.colorStopRanges : [{ ...this.runtime.stateRanges[0], start: clip.start, end: clip.end }];
            const paints =
              this.config.show.horseshoe_style === 'colorstopsegments'
                ? this.paint.stateSegmentPaints
                : [this.paint.statePaints[0]];

            ranges = buildPaintedRanges(animatedStateRanges, {
              paints,
              clip,
              gap: this.config.show.horseshoe_style === 'colorstopsegments' ? this.paint.statePaintConfig.gap : 0,
              endpointGap: { start: 0, end: 0 },
              linecap: this.paint.statePaintConfig.linecap,
            });
          }

          progressLayer = renderNormalizedPathBands(this.geometry.pathDefinition, ranges, this.paint.stateLayer, `${pathId}-state`, 'horseshoe__state-band');
        }
      }

      // Progress uses the path transform; the marker uses already transformed
      // coordinates so its text/image source is rotated but never mirrored.
      return svg`
        <g class="horseshoe__state-progress" transform=${this.geometry.transform}>${progressLayer}</g>
        ${this.config.show.state_marker
          ? this.stateMarker.render(this.geometry.transformedPathGeometry, this.geometry.pathInput, this.config.horseshoe_marker, progress, this.paint.markerStyles)
          : svg``}
      `;
    } finally {
      this.geometry.pathGeometry.endTemporarySampling();
    }
  }

  /** Reactivates the state marker's concrete icon source after reconnection. */
  connected() {
    this.stateMarker.haIconPath.connected();
  }

  /** Stops animation, marker loading and old DOM bindings on disconnect. */
  disconnected() {
    this.stateMarker.haIconPath.disconnected();
    if (this.stateAnimator) {
      this.stateAnimator.unbindStateLayer();
      this.runtime.displayProgress = this.stateAnimator.currentProgress;
    }
    // Retain measurements, but bind the actual master node again after reconnect.
    this.geometry.pathGeometry.unbindPathElement();
  }

  /** Binds the committed master centerline for gradients, tickmarks, labels, badges, and markers. */
  updated() {
    if (this.hasJavascript && !this.runtimeConfigInitialized) return;
    const pathId = `${this.cardId}-horseshoe-${this.index}`;
    const masterPath = this.card.shadowRoot.getElementById(`${pathId}-master`);
    const newlyBound = this.geometry.pathGeometry.bindPathElement(masterPath);
    const stateLayerElement = this.card.shadowRoot.getElementById(`${pathId}-state`);

    if (this.runtime.valueMapper) {
      this.stateAnimator.bindStateLayer(stateLayerElement);
    }

    if (newlyBound && this.runtime.valueMapper && this.buildMeasuredGradientContracts()) {
      this.card.requestUpdate();
    }

    if (
      this.config.show.state_marker &&
      this.config.horseshoe_marker.icon &&
      getIconSource(this.config.horseshoe_marker.icon).type === 'svg-url'
    ) {
      injectExternalSvgSources(this.card);
    }
  }

  /** Renders the path layers followed by separately positioned tickmarks, labels, badges, and markers. */
  render() {
    if (!this.geometry.pathDefinition) return svg``;

    const pathId = `${this.cardId}-horseshoe-${this.index}`;
    return this.renderItemLayers(svg`
      <g
        id=${pathId}
        class="horseshoe"
        ${this.actionHandler()}
        @action=${(event) => this.handleAction(event)}
      >
        <g class="horseshoe__path" transform=${this.geometry.transform}>
          <path
            id="${pathId}-master"
            class="horseshoe__master"
            d=${this.geometry.pathDefinition.d}
            pathLength="100"
            fill="none"
            stroke="transparent"
            stroke-width="0"
            visibility="hidden"
            pointer-events="none"
          ></path>
          ${this.paint.backgroundLayers.map((background) =>
            background.gradient
              ? renderAdaptivePathGradient(background.definition, background.gradient, background.layer, `${pathId}-${background.id}-background-gradient`, `horseshoe__${background.id}-background-gradient`)
              : renderNormalizedPathBands(background.definition, background.ranges, background.layer, `${pathId}-${background.id}-background`, `horseshoe__${background.id}-background`),
          )}
          ${
            this.paint.scaleGradient
              ? renderAdaptivePathGradient(this.geometry.pathDefinition, this.paint.scaleGradient, this.paint.backgroundLayer, `${pathId}-scale-gradient`, 'horseshoe__scale-gradient')
              : renderNormalizedPathBands(this.geometry.pathDefinition, this.paint.scaleRanges, this.paint.backgroundLayer, `${pathId}-scale`, 'horseshoe__scale')
          }
        </g>
        <g id="${pathId}-state" class="horseshoe__state"></g>
        <g class="horseshoe__path-elements">
          ${renderPathElements(this.geometry.pathElements, `${pathId}-items`)}
        </g>
      </g>
    `);
  }
}
