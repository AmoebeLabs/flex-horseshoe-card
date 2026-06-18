/* eslint-disable max-classes-per-file */

import { svg } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';

import Colors from './colors.js';
import Label from './labels.js';
import { SVG_VIEW_BOX } from './const.js';

const DEG_TO_RAD = Math.PI / 180;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const asArray = (value) => (Array.isArray(value) ? value : []);

const toStyleDict = (styles) => {
  if (!styles) return {};

  if (Array.isArray(styles)) {
    return styles.reduce((result, item) => {
      if (item && typeof item === 'object') {
        return {
          ...result,
          ...item,
        };
      }

      return result;
    }, {});
  }

  if (typeof styles === 'object') {
    return styles;
  }

  return {};
};

class CubicSpline {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    const n = x.length;
    this.n = n;

    const dx = new Array(n - 1);
    const ms = new Array(n - 1);

    for (let i = 0; i < n - 1; i += 1) {
      dx[i] = x[i + 1] - x[i];
      ms[i] = (y[i + 1] - y[i]) / dx[i];
    }

    this.c1s = new Array(n).fill(0);
    this.c1s[0] = ms[0];

    for (let i = 1; i < n - 1; i += 1) {
      this.c1s[i] = (ms[i - 1] + ms[i]) / 2;
    }

    this.c1s[n - 1] = ms[n - 2];

    for (let i = 0; i < n - 1; i += 1) {
      if (ms[i] === 0) {
        this.c1s[i] = 0;
        this.c1s[i + 1] = 0;
      } else {
        const alpha = this.c1s[i] / ms[i];
        const beta = this.c1s[i + 1] / ms[i];
        const h = Math.hypot(alpha, beta);

        if (h > 3) {
          const tau = 3 / h;
          this.c1s[i] = tau * alpha * ms[i];
          this.c1s[i + 1] = tau * beta * ms[i];
        }
      }
    }

    this.c2s = new Array(n - 1);
    this.c3s = new Array(n - 1);

    for (let i = 0; i < n - 1; i += 1) {
      const m = ms[i];
      const c1Next = this.c1s[i + 1];
      const c1Current = this.c1s[i];

      this.c2s[i] = (3 * m - 2 * c1Current - c1Next) / dx[i];
      this.c3s[i] = (c1Current + c1Next - 2 * m) / (dx[i] * dx[i]);
    }
  }

  get(value) {
    if (value <= this.x[0]) {
      return this.y[0];
    }

    if (value >= this.x[this.n - 1]) {
      return this.y[this.n - 1];
    }

    let index = 0;

    for (let i = 0; i < this.n - 1; i += 1) {
      if (value >= this.x[i] && value <= this.x[i + 1]) {
        index = i;
        break;
      }
    }

    const diff = value - this.x[index];

    return this.y[index] + this.c1s[index] * diff + this.c2s[index] * diff * diff + this.c3s[index] * diff * diff * diff;
  }
}

class GaugeScale {
  constructor(config, barMode) {
    this.type = config.type;
    this.min = Number(config.min);
    this.max = Number(config.max);
    this.barMode = barMode;

    this.points = GaugeScale.buildPoints(config);

    if (this.type === 'spline') {
      this.spline = new CubicSpline(
        this.points.map((point) => point.value),
        this.points.map((point) => point.position),
      );
      return;
    }

    if (this.type !== 'linear') {
      throw new Error(`[V2 GaugeScale] Unsupported scale type: ${this.type}`);
    }
  }

  static buildPoints(config) {
    if (config.type !== 'spline') {
      return [
        { value: Number(config.min), position: 0 },
        { value: Number(config.max), position: 1 },
      ];
    }

    if (!config.spline?.anchors) {
      throw new Error('[V2 GaugeScale] Missing horseshoe_scale.spline.anchors');
    }

    return config.spline.anchors
      .map((point) => ({
        value: Number(point.value),
        position: Number(point.position),
      }))
      .sort((a, b) => a.value - b.value);
  }

  toRatio(value) {
    const numericValue = Number(value);

    if (this.type === 'spline') {
      return clamp(this.spline.get(numericValue), 0, 1);
    }

    return clamp((numericValue - this.min) / (this.max - this.min), 0, 1);
  }
}

class GaugeGeometry {
  constructor(config, scale) {
    this.cx = config.svg.xpos;
    this.cy = config.svg.ypos;

    this.radius = config.svg.radius;
    this.tickmarksRadius = config.svg.tickmarks_radius;

    this.arcDegrees = config.arc_degrees;
    this.startAngle = config.start_angle;
    this.endAngle = this.startAngle + this.arcDegrees;

    this.zeroRatio = config.zero_ratio;
    this.zeroAngle = this.ratioToAngle(this.zeroRatio);

    this.scale = scale;
  }

  ratioToAngle(ratio) {
    return this.startAngle + ratio * this.arcDegrees;
  }

  valueToAngle(value) {
    return this.ratioToAngle(this.scale.toRatio(value));
  }

  pointAt(angle, radius) {
    const rad = angle * DEG_TO_RAD;

    return {
      x: this.cx + Math.cos(rad) * radius,
      y: this.cy + Math.sin(rad) * radius,
    };
  }
}

class ArcPathBuilder {
  static buildBandPath(segment) {
    const { geometry, startAngle, endAngle, innerRadius, outerRadius, startCap, endCap } = segment;

    if (endAngle === startAngle) {
      return '';
    }

    const outerStart = geometry.pointAt(startAngle, outerRadius);
    const outerEnd = geometry.pointAt(endAngle, outerRadius);
    const innerEnd = geometry.pointAt(endAngle, innerRadius);
    const innerStart = geometry.pointAt(startAngle, innerRadius);

    const largeArc = Math.abs(endAngle - startAngle) > 180 ? 1 : 0;
    const sweep = endAngle > startAngle ? 1 : 0;
    const reverseSweep = sweep ? 0 : 1;
    const capRadius = (outerRadius - innerRadius) / 2;

    const parts = [];

    parts.push(`M ${outerStart.x} ${outerStart.y}`);

    parts.push(`A ${outerRadius} ${outerRadius} 0 ${largeArc} ${sweep} ${outerEnd.x} ${outerEnd.y}`);

    if (endCap === 'round') {
      parts.push(`A ${capRadius} ${capRadius} 0 0 ${sweep} ${innerEnd.x} ${innerEnd.y}`);
    } else {
      parts.push(`L ${innerEnd.x} ${innerEnd.y}`);
    }

    parts.push(`A ${innerRadius} ${innerRadius} 0 ${largeArc} ${reverseSweep} ${innerStart.x} ${innerStart.y}`);

    if (startCap === 'round') {
      parts.push(`A ${capRadius} ${capRadius} 0 0 ${sweep} ${outerStart.x} ${outerStart.y}`);
    } else {
      parts.push(`L ${outerStart.x} ${outerStart.y}`);
    }

    parts.push('Z');

    return parts.join(' ');
  }
}

export default class HorseshoeGaugeV2 {
  static setConfig(config, templates, cardId) {
    const horseshoes = Array.isArray(config.layout?.horseshoes_v2) ? config.layout.horseshoes_v2 : [];

    return horseshoes
      .map((horseshoeConfig, index) => new HorseshoeGaugeV2(HorseshoeGaugeV2.normalizeBaseConfig(horseshoeConfig, index), index, templates, cardId))
      .filter((horseshoe) => horseshoe.show?.horseshoe !== false);
  }

  static normalizeBaseConfig(config, index) {
    const entityIndex = config.entity_index ?? 0;

    return {
      ...config,
      entity_index: entityIndex,
      index,
      show: {
        horseshoe: true,
        horseshoe_style: 'fixed',
        labels_at: 'none',
        ...(config.show ?? {}),
      },
    };
  }

  static normalizeRuntimeConfig(config) {
    const show = {
      horseshoe: true,
      horseshoe_style: 'fixed',
      labels_at: 'none',
      ...(config.show ?? {}),
    };

    if (!config.horseshoe_scale) {
      throw new Error('[V2] Missing horseshoe_scale');
    }

    const horseshoeScale = config.horseshoe_scale;

    if (horseshoeScale.min === undefined) {
      throw new Error('[V2] Missing horseshoe_scale.min');
    }

    if (horseshoeScale.max === undefined) {
      throw new Error('[V2] Missing horseshoe_scale.max');
    }

    if (!horseshoeScale.type) {
      throw new Error('[V2] Missing horseshoe_scale.type');
    }

    if (!horseshoeScale[horseshoeScale.type]) {
      throw new Error(`[V2] Missing horseshoe_scale.${horseshoeScale.type}`);
    }

    const horseshoeScaleV2 = {
      min: 0,
      max: 100,
      width: 6,
      color: 'var(--primary-background-color)',
      linecap: 'round',
      type: 'linear',
      ...(config.horseshoe_scale ?? {}),
    };

    const horseshoeState = {
      width: 12,
      color: 'var(--primary-color)',
      linecap: 'round',
      mode: 'value',
      segment_gap: 2,
      ...(config.horseshoe_state ?? {}),
    };

    const horseshoeLabels = {
      offset: 12,
      ...(config.horseshoe_labels ?? {}),
    };

    const radius = config.radius ?? 45;
    const tickmarksRadius = config.tickmarks_radius ?? 43;
    const arcDegrees = config.arc_degrees ?? 260;
    const xpos = config.xpos ?? 50;
    const ypos = config.ypos ?? 50;

    return {
      ...config,

      show,

      xpos,
      ypos,
      radius,
      tickmarks_radius: tickmarksRadius,
      arc_degrees: arcDegrees,

      svg: {
        xpos: (xpos / 100) * SVG_VIEW_BOX,
        ypos: (ypos / 100) * SVG_VIEW_BOX,
        radius: (radius / 100) * SVG_VIEW_BOX,
        tickmarks_radius: (tickmarksRadius / 100) * SVG_VIEW_BOX,
      },

      start_angle: config.start_angle ?? 90 + (360 - arcDegrees) / 2,
      bar_mode: config.bar_mode ?? 'normal',
      zero_ratio: config.zero_ratio ?? HorseshoeGaugeV2.getZeroRatio(horseshoeScale),

      state_map: config.state_map ?? horseshoeState.state_map ?? [],

      color_stops: config.color_stops,
      colorStops: HorseshoeGaugeV2.normalizeColorStops(config.color_stops),

      horseshoe_scale: {
        ...horseshoeScale,
        linecap: HorseshoeGaugeV2.normalizeLinecap(horseshoeScale.linecap),
        styles: {
          fill: horseshoeScale.color,
          ...toStyleDict(horseshoeScale.styles),
        },
      },

      horseshoe_state: {
        ...horseshoeState,
        linecap: HorseshoeGaugeV2.normalizeLinecap(horseshoeState.linecap),
        styles: {
          fill: horseshoeState.color,
          ...toStyleDict(horseshoeState.styles),
        },
      },

      horseshoe_labels: {
        ...horseshoeLabels,
        styles: {
          fill: 'var(--primary-text-color)',
          'font-size': '6px',
          ...toStyleDict(horseshoeLabels.styles),
        },
      },
    };
  }

  static normalizeColorStops(colorStopsConfig) {
    if (!colorStopsConfig) {
      return {
        colors: [],
      };
    }

    if (Array.isArray(colorStopsConfig)) {
      return {
        colors: colorStopsConfig
          .map((entry) => ({
            value: Number(entry.value),
            color: entry.color,
            label: entry.label,
          }))
          .filter((entry) => Number.isFinite(entry.value) && entry.color != null)
          .sort((a, b) => a.value - b.value),
      };
    }

    return {
      colors: Object.entries(colorStopsConfig)
        .map(([value, color]) => ({
          value: Number(value),
          color,
        }))
        .filter((entry) => Number.isFinite(entry.value) && entry.color != null)
        .sort((a, b) => a.value - b.value),
    };
  }

  static normalizeLinecap(linecap) {
    if (typeof linecap === 'string') {
      return {
        start: linecap,
        end: linecap,
      };
    }

    return {
      start: linecap.start,
      end: linecap.end,
    };
  }

  static getZeroRatio(horseshoeScale) {
    const min = Number(horseshoeScale.min);
    const max = Number(horseshoeScale.max);

    if (min >= 0 || max <= 0) {
      return 0;
    }

    return clamp((0 - min) / (max - min), 0, 1);
  }

  constructor(config, index, templates, cardId) {
    this.config = config;
    this.index = index;
    this.templates = templates;
    this.cardId = cardId;

    this.entity_index = config.entity_index ?? 0;
    this.show = config.show;

    this.entity = undefined;
    this.entityConfig = undefined;
    this.rawState = undefined;
    this.value = undefined;
    this.mappedState = undefined;

    this.runtimeConfig = undefined;
    this.scale = undefined;
    this.geometry = undefined;
  }

  constructorV2(config, index, templates) {
    this.config = config;
    this.index = index;
    this.templates = templates;

    this.entity_index = config.entity_index ?? 0;
    this.show = config.show;

    this.entity = undefined;
    this.entityConfig = undefined;
    this.rawState = undefined;
    this.value = undefined;
    this.mappedState = undefined;

    this.runtimeConfig = undefined;
    this.scale = undefined;
    this.geometry = undefined;
  }

  setState(entity, entityConfig) {
    this.entity = entity;
    this.entityConfig = entityConfig;

    const item = {
      entity_index: this.entity_index,
    };

    const resolvedConfig = this.templates.getJsTemplateOrValue(item, this.config, {
      resolveKeys: true,
    });

    this.runtimeConfig = HorseshoeGaugeV2.normalizeRuntimeConfig(resolvedConfig);

    let value = entity.state;

    if (entityConfig?.attribute && entity.attributes?.[entityConfig.attribute] !== undefined) {
      value = entity.attributes[entityConfig.attribute];
    }

    const mappedState = this.getStateMapItem(entity.state, value);

    this.rawState = entity.state;
    this.mappedState = mappedState;
    this.value = Number(mappedState?.value ?? value);

    // this.scale = new GaugeScale(this.runtimeConfig.horseshoe_scale);
    this.scale = new GaugeScale(this.runtimeConfig.horseshoe_scale, this.runtimeConfig.bar_mode);
    this.geometry = new GaugeGeometry(this.runtimeConfig, this.scale);
  }

  getStateMapItem(rawState, value) {
    return this.runtimeConfig.state_map.find((item) => {
      if (item.state !== undefined) {
        return String(item.state) === String(rawState);
      }

      if (item.value !== undefined) {
        return String(item.value) === String(value);
      }

      return false;
    });
  }

  render() {
    if (!Number.isFinite(this.value) || !this.runtimeConfig || !this.scale || !this.geometry) {
      return svg``;
    }

    return svg`
      <g id="horseshoe-v2-${this.index}" class="horseshoe-v2">
        ${this.renderArcSegment(this.buildScaleSegment(), 'horseshoe-v2__scale')}
        ${this.buildStateSegments().map((segment) => this.renderArcSegment(segment, 'horseshoe-v2__state'))}
        ${this.renderLabels(this.buildLabels())}
      </g>
    `;
  }

  buildScaleSegment() {
    const config = this.runtimeConfig;
    const width = config.horseshoe_scale.width;

    return {
      geometry: this.geometry,
      startAngle: this.geometry.startAngle,
      endAngle: this.geometry.endAngle,
      innerRadius: this.geometry.radius - width / 2,
      outerRadius: this.geometry.radius + width / 2,
      startCap: config.horseshoe_scale.linecap.start,
      endCap: config.horseshoe_scale.linecap.end,
      styles: config.horseshoe_scale.styles,
    };
  }

  buildStateSegments() {
    const config = this.runtimeConfig;

    if (config.horseshoe_state.mode === 'segment') {
      return this.buildMappedStateSegments();
    }

    if (config.bar_mode === 'bidirectional') {
      return this.buildBidirectionalStateSegments();
    }

    return this.buildNormalStateSegments();
  }

  buildNormalStateSegments() {
    return this.buildColorAwareStateSegments({
      fromAngle: this.geometry.startAngle,
      toAngle: this.geometry.valueToAngle(this.value),
    });
  }

  buildBidirectionalStateSegments() {
    const valueAngle = this.geometry.valueToAngle(this.value);
    const zeroAngle = this.geometry.zeroAngle;

    return this.buildColorAwareStateSegments({
      fromAngle: Math.min(zeroAngle, valueAngle),
      toAngle: Math.max(zeroAngle, valueAngle),
    });
  }

  buildColorAwareStateSegments({ fromAngle, toAngle }) {
    const config = this.runtimeConfig;
    const strokeStyle = config.show?.horseshoe_style;

    if (strokeStyle === 'colorstopsegments') {
      return this.buildColorStopStateSegments({
        fromAngle,
        toAngle,
      });
    }

    if (strokeStyle === 'colorstop' || strokeStyle === 'colorstopgradient') {
      const color = Colors.calculateStrokeColor(this.value, config.colorStops, strokeStyle === 'colorstopgradient');

      return [
        this.buildSingleStateSegment(fromAngle, toAngle, {
          fill: color,
        }),
      ];
    }

    return [this.buildSingleStateSegment(fromAngle, toAngle)];
  }

  buildSingleStateSegment(fromAngle, toAngle, styleOverrides = {}) {
    const config = this.runtimeConfig;
    const width = config.horseshoe_state.width;

    return {
      geometry: this.geometry,
      startAngle: fromAngle,
      endAngle: toAngle,
      innerRadius: this.geometry.radius - width / 2,
      outerRadius: this.geometry.radius + width / 2,
      startCap: config.horseshoe_state.linecap.start,
      endCap: config.horseshoe_state.linecap.end,
      styles: {
        ...config.horseshoe_state.styles,
        ...styleOverrides,
      },
    };
  }

  buildColorStopStateSegments({ fromAngle, toAngle }) {
    const config = this.runtimeConfig;
    const width = config.horseshoe_state.width;
    const colorStops = asArray(config.colorStops?.colors);
    const segments = [];

    if (colorStops.length < 2) {
      return [this.buildSingleStateSegment(fromAngle, toAngle)];
    }

    for (let i = 0; i < colorStops.length - 1; i += 1) {
      const stopA = colorStops[i];
      const stopB = colorStops[i + 1];

      const segmentStart = this.geometry.valueToAngle(stopA.value);
      const segmentEnd = this.geometry.valueToAngle(stopB.value);

      const drawStart = Math.max(segmentStart, fromAngle);
      const drawEnd = Math.min(segmentEnd, toAngle);

      if (drawEnd > drawStart) {
        segments.push({
          geometry: this.geometry,
          startAngle: drawStart,
          endAngle: drawEnd,
          innerRadius: this.geometry.radius - width / 2,
          outerRadius: this.geometry.radius + width / 2,
          startCap: 'butt',
          endCap: 'butt',
          styles: {
            ...config.horseshoe_state.styles,
            fill: stopA.color,
          },
        });
      }
    }

    if (segments.length) {
      segments[0].startCap = config.horseshoe_state.linecap.start;
      segments[segments.length - 1].endCap = config.horseshoe_state.linecap.end;
    }

    return segments;
  }

  buildMappedStateSegments() {
    const config = this.runtimeConfig;
    const stateMap = config.state_map;
    const width = config.horseshoe_state.width;
    const gap = config.horseshoe_state.segment_gap;
    const count = stateMap.length;

    if (!count) {
      return [];
    }

    const step = this.geometry.arcDegrees / count;

    return stateMap.map((item, index) => {
      const startAngle = this.geometry.startAngle + index * step + gap / 2;
      const endAngle = this.geometry.startAngle + (index + 1) * step - gap / 2;
      const active = Number(item.value) === Number(this.value);

      return {
        geometry: this.geometry,
        startAngle,
        endAngle,
        innerRadius: this.geometry.radius - width / 2,
        outerRadius: this.geometry.radius + width / 2,
        startCap: index === 0 ? config.horseshoe_state.linecap.start : 'butt',
        endCap: index === count - 1 ? config.horseshoe_state.linecap.end : 'butt',
        styles: active ? config.horseshoe_state.styles : config.horseshoe_scale.styles,
        active,
        value: item.value,
        label: item.label ?? String(item.state),
      };
    });
  }

  buildLabels() {
    const config = this.runtimeConfig;

    switch (config.show.labels_at) {
      case 'minmax':
        return [this.buildLabel(config.horseshoe_scale.min, String(config.horseshoe_scale.min)), this.buildLabel(config.horseshoe_scale.max, String(config.horseshoe_scale.max))];

      case 'colorstops':
        return asArray(config.colorStops?.colors).map((stop) => this.buildLabel(stop.value, String(stop.value)));

      case 'none':
        return [];

      default:
        return [];
    }
  }

  buildLabel(value, text) {
    const ratio = this.scale.toRatio(value);
    const angle = this.geometry.ratioToAngle(ratio);

    const point = this.geometry.pointAt(angle, this.geometry.radius + this.runtimeConfig.horseshoe_labels.offset);

    return {
      value,
      text,
      angle,
      x: point.x,
      y: point.y,
      styles: this.runtimeConfig.horseshoe_labels.styles,
    };
  }

  renderArcSegment(segment, className) {
    const d = ArcPathBuilder.buildBandPath(segment);

    if (!d) {
      return svg``;
    }

    return svg`
      <path
        class=${className}
        d=${d}
        style=${styleMap(segment.styles)}
      ></path>
    `;
  }

  renderLabels(labels) {
    const config = this.runtimeConfig;

    return labels.map((label, index) =>
      // eslint-disable-next-line @stylistic/implicit-arrow-linebreak
      Label.renderLabel({
        horseshoeIndex: this.index,
        index,
        label: label.text,
        angle: label.angle,
        cx: this.geometry.cx,
        cy: this.geometry.cy,
        radius: this.geometry.radius + Number(config.horseshoe_labels.offset ?? config.horseshoe_state.width + 2),
        cardId: this.cardId,
        orientation: config.horseshoe_labels.orientation ?? 'arc',
        isMin: false,
        isMax: false,
        transformContext: {
          rotation: config.rotate ?? 0,
          flipX: config.flip === 'x' || config.flip === 'both',
          flipY: config.flip === 'y' || config.flip === 'both',
        },
      }),
    );
  }
}
