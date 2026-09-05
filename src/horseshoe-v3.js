import { svg } from 'lit';

import BaseTool from './base-tool.js';
import ConfigHelper from './config-helper.js';
import { GaugeScale } from './horseshoe-geometry.js';
import { normalizeBaseConfig, normalizeRuntimeConfig } from './horseshoe-state.js';
import {
  buildArcPathDefinition,
  buildInfinityPathDefinition,
  buildLinePathDefinition,
  buildRectanglePathDefinition,
  buildSpiralPathDefinition,
  buildWavePathDefinition,
} from './path-generators.js';
import { renderNormalizedPathBands } from './path-mask-renderer.js';
import { buildPaintedRanges, PathValueMapper } from './path-ranges.js';
import Utils from './utils.js';

const PATH_TYPES = ['arc', 'line', 'rectangle', 'wave', 'spiral', 'infinity'];

/**
 * Temporary public adapter that translates horseshoe configuration into the
 * complete contracts consumed by the generic path engine. Compatibility,
 * defaults, and validation end here; path modules never inspect card config.
 */
export default class HorseshoeV3 extends BaseTool {
  /**
   * Constructs only the temporary layout.horseshoes_v3 section. The existing
   * horseshoes and horseshoes_v2 sections remain owned by HorseshoeGauge.
   */
  static setConfig(config, templates, cardId, card) {
    const horseshoes = Array.isArray(config.layout?.horseshoes_v3) ? config.layout.horseshoes_v3 : [];

    return horseshoes
      .map((horseshoeConfig, index) => new HorseshoeV3(
        normalizeBaseConfig(
          horseshoeConfig,
          index,
          card.cardLayout.groupManager,
          card.cardTheme.getActiveColorStopMode(),
        ),
        index,
        templates,
        cardId,
        card,
      ))
      .filter((horseshoe) => horseshoe.config.show.horseshoe !== false);
  }

  /** Stores adapter state without creating geometry before runtime config exists. */
  constructor(config, index, templates, cardId, card) {
    super(config, index, templates, cardId, card, 'horseshoes_v3', 'horseshoes_v3', 0);

    this.activeItemConfig = this.config;
    this.runtimeConfig = undefined;
    this.pathContract = undefined;
    this.pathDefinition = undefined;
    this.scale = undefined;
    this.valueMapper = undefined;
    this.value = undefined;
    this.renderContract = undefined;
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

    if (this.config.bar_mode !== 'normal') {
      throw new Error(`[horseshoes_v3] bar_mode '${this.config.bar_mode}' is not available during fixed-mode migration`);
    }
    if (this.config.show.horseshoe_style !== 'fixed') {
      throw new Error(`[horseshoes_v3] horseshoe_style '${this.config.show.horseshoe_style}' is not available during fixed-mode migration`);
    }
    if (this.config.horseshoe_scale.type !== 'linear') {
      throw new Error(`[horseshoes_v3] scale type '${this.config.horseshoe_scale.type}' is not available during fixed-mode migration`);
    }

    const sourcePath = itemConfig.path ?? {
      type: 'arc',
      radius: itemConfig.radius,
      arc_degrees: itemConfig.arc_degrees,
      start_angle: itemConfig.start_angle,
    };

    if (!PATH_TYPES.includes(sourcePath.type)) {
      throw new Error(`[horseshoes_v3] path.type '${sourcePath.type}' is invalid [${PATH_TYPES.join(', ')}]`);
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
          throw new Error('[horseshoes_v3] arc radii must be greater than zero and arc_degrees must be between -360 and 360');
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
        if (length <= 0) throw new Error('[horseshoes_v3] line length must be greater than zero');
        const angle = (sourcePath.angle ?? 0) * Math.PI / 180;
        const deltaX = Math.cos(angle) * length / 2;
        const deltaY = Math.sin(angle) * length / 2;
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
        if (width <= 0 || height <= 0) throw new Error('[horseshoes_v3] rectangle width and height must be greater than zero');
        if (!['top', 'right', 'bottom', 'left'].includes(sourcePath.start ?? 'top')) {
          throw new Error(`[horseshoes_v3] rectangle path.start '${sourcePath.start}' is invalid [top, right, bottom, left]`);
        }
        if (!['clockwise', 'counterclockwise'].includes(sourcePath.direction ?? 'clockwise')) {
          throw new Error(`[horseshoes_v3] rectangle path.direction '${sourcePath.direction}' is invalid [clockwise, counterclockwise]`);
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
          throw new Error('[horseshoes_v3] wave length, waves, and amplitude must be greater than zero');
        }
        const angle = (sourcePath.angle ?? 0) * Math.PI / 180;
        const deltaX = Math.cos(angle) * length / 2;
        const deltaY = Math.sin(angle) * length / 2;
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
          throw new Error('[horseshoes_v3] spiral radii must be valid and points must be at least 2');
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
          throw new Error('[horseshoes_v3] infinity radii must be greater than zero');
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
  }

  /** Maps the current entity state into one fixed solid normalized state range. */
  setState(entity, entityConfig) {
    super.setState(entity, entityConfig);

    const sourceValue = entityConfig.attribute === undefined ? entity.state : entity.attributes[entityConfig.attribute];
    this.value = Number(sourceValue);
    this.valueMapper = new PathValueMapper({
      scale: this.scale,
      barMode: this.config.bar_mode,
      zeroRatio: this.config.zero_ratio,
      stateMode: this.config.horseshoe_state.mode,
      stateMap: [],
    }, this.value);

    const scaleStyles = ConfigHelper.toStyleDict(this.config.horseshoe_scale.styles);
    const stateStyles = ConfigHelper.toStyleDict(this.config.horseshoe_state.styles);
    const semanticRanges = this.valueMapper.buildSemanticRanges(this.value);
    const stateRanges = buildPaintedRanges(semanticRanges, {
      paints: [{
        color: stateStyles.fill,
        width: Number(this.config.horseshoe_state.width),
        opacity: Number(stateStyles.opacity),
      }],
      clip: { start: 0, end: 100 },
      gap: 0,
      endpointGap: { start: 0, end: 0 },
      linecap: this.config.horseshoe_state.linecap,
    });

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
      stateRanges,
      backgroundLayer: {
        opacity: 1,
        fillOpacity: 1,
        strokeOpacity: 1,
        border: { color: 'transparent', width: 0 },
      },
      stateLayer: {
        opacity: 1,
        fillOpacity: 1,
        strokeOpacity: 1,
        border: { color: 'transparent', width: 0 },
      },
    };
  }

  /** Renders path layers only; later parity phases add separately positioned features. */
  render() {
    if (!this.renderContract) return svg``;

    const pathId = `${this.cardId}-horseshoe-v3-${this.index}`;
    const rotate = Number(this.config.rotate);
    const pathTransform = `${this.getGroupScaleTransform()} rotate(${rotate} ${this.config.svg.xpos} ${this.config.svg.ypos})`;

    return this.renderItemLayers(svg`
      <g
        id=${pathId}
        class="horseshoe-v3"
        ${this.actionHandler()}
        @action=${(event) => this.handleAction(event)}
      >
        <g class="horseshoe-v3__path" transform=${pathTransform} style=${this.getGroupScaleStyle()}>
          <path
            id="${pathId}-master"
            class="horseshoe-v3__master"
            d=${this.pathDefinition.d}
            pathLength="100"
            fill="none"
            stroke="transparent"
            stroke-width="0"
            visibility="hidden"
            pointer-events="none"
          ></path>
          ${renderNormalizedPathBands(
            this.pathDefinition,
            [this.renderContract.backgroundRange],
            this.renderContract.backgroundLayer,
            `${pathId}-scale`,
            'horseshoe-v3__scale',
          )}
          <g id="${pathId}-state" class="horseshoe-v3__state">
            ${renderNormalizedPathBands(
              this.pathDefinition,
              this.renderContract.stateRanges,
              this.renderContract.stateLayer,
              `${pathId}-state`,
              'horseshoe-v3__state-band',
            )}
          </g>
        </g>
        <g class="horseshoe-v3__features"></g>
      </g>
    `);
  }
}
