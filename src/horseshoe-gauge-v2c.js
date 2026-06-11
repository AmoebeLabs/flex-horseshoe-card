/* eslint-disable max-classes-per-file */

import { svg } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';

import Colors from './colors.js';
import { SVG_VIEW_BOX } from './const.js';

const DEG_TO_RAD = Math.PI / 180;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const asArray = (value) => (Array.isArray(value) ? value : []);

const toStyleDict = (styles) => {
  if (!styles) return {};

  if (Array.isArray(styles)) {
    return styles.reduce((result, item) => {
      if (item && typeof item === 'object') {
        return { ...result, ...item };
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
    this.n = x.length;

    this.a = [...y];
    this.b = new Array(this.n - 1).fill(0);
    this.c = new Array(this.n).fill(0);
    this.d = new Array(this.n - 1).fill(0);

    const h = new Array(this.n - 1);

    for (let i = 0; i < this.n - 1; i += 1) {
      h[i] = x[i + 1] - x[i];
    }

    const alpha = new Array(this.n - 1).fill(0);

    for (let i = 1; i < this.n - 1; i += 1) {
      alpha[i] = (3 / h[i]) * (this.a[i + 1] - this.a[i]) - (3 / h[i - 1]) * (this.a[i] - this.a[i - 1]);
    }

    const l = new Array(this.n).fill(1);
    const mu = new Array(this.n).fill(0);
    const z = new Array(this.n).fill(0);

    for (let i = 1; i < this.n - 1; i += 1) {
      l[i] = 2 * (x[i + 1] - x[i - 1]) - h[i - 1] * mu[i - 1];
      mu[i] = h[i] / l[i];
      z[i] = (alpha[i] - h[i - 1] * z[i - 1]) / l[i];
    }

    for (let j = this.n - 2; j >= 0; j -= 1) {
      this.c[j] = z[j] - mu[j] * this.c[j + 1];

      this.b[j] = (this.a[j + 1] - this.a[j]) / h[j] - (h[j] * (this.c[j + 1] + 2 * this.c[j])) / 3;

      this.d[j] = (this.c[j + 1] - this.c[j]) / (3 * h[j]);
    }
  }

  get(value) {
    if (value <= this.x[0]) return this.y[0];
    if (value >= this.x[this.n - 1]) return this.y[this.n - 1];

    let i = 0;

    for (let k = 0; k < this.n - 1; k += 1) {
      if (value >= this.x[k] && value <= this.x[k + 1]) {
        i = k;
        break;
      }
    }

    const dx = value - this.x[i];

    return this.a[i] + this.b[i] * dx + this.c[i] * dx ** 2 + this.d[i] * dx ** 3;
  }
}

class GaugeScale {
  constructor(horseshoeScale) {
    console.log('[V2 GaugeScale NEW]', {
      type: this.type,
      min: this.min,
      max: this.max,
      points: this.points,
    });
    this.type = horseshoeScale.type ?? 'linear';
    this.min = Number(horseshoeScale.min);
    this.max = Number(horseshoeScale.max);

    this.points = GaugeScale.buildPoints(horseshoeScale);

    this.spline =
      this.type === 'spline'
        ? new CubicSpline(
            this.points.map((point) => point.value),
            this.points.map((point) => point.position),
          )
        : undefined;
  }

  toRatio(value) {
    const numericValue = Number(value);

    if (!Number.isFinite(numericValue)) {
      return 0;
    }

    if (this.type === 'spline') {
      return clamp(this.spline.get(numericValue), 0, 1);
    }

    return clamp((numericValue - this.min) / (this.max - this.min), 0, 1);
  }

  static buildPoints(horseshoeScale) {
    const points = [{ value: horseshoeScale.min, position: 0 }, ...(horseshoeScale.anchors ?? []), { value: horseshoeScale.max, position: 1 }]
      .map((point) => ({
        value: Number(point.value),
        position: Number(point.position),
      }))
      .filter((point) => Number.isFinite(point.value) && Number.isFinite(point.position));

    const byValue = new Map();

    points.forEach((point) => {
      byValue.set(point.value, point);
    });

    return [...byValue.values()].sort((a, b) => a.value - b.value);
  }
}

class GaugeScaleV2 {
  constructor(config) {
    console.log('[V2 GaugeScale NEW]', {
      type: this.type,
      min: this.min,
      max: this.max,
      points: this.points,
    });

    this.type = config.type ?? 'linear';
    this.min = Number(config.min);
    this.max = Number(config.max);

    this.points = GaugeScale.buildPoints(config);

    this.spline =
      this.type === 'spline'
        ? new CubicSpline(
            this.points.map((point) => point.value),
            this.points.map((point) => point.position),
          )
        : undefined;
  }

  toRatio(value) {
    const numericValue = Number(value);

    if (!Number.isFinite(numericValue)) {
      return 0;
    }

    if (this.type === 'spline') {
      return clamp(this.spline.get(numericValue), 0, 1);
    }

    return clamp((numericValue - this.min) / (this.max - this.min), 0, 1);
  }

  static buildPoints(config) {
    const points = [{ value: config.min, position: 0 }, ...(config.anchors ?? []), { value: config.max, position: 1 }]
      .map((point) => ({
        value: Number(point.value),
        position: Number(point.position),
      }))
      .filter((point) => Number.isFinite(point.value) && Number.isFinite(point.position));

    const byValue = new Map();

    points.forEach((point) => {
      byValue.set(point.value, point);
    });

    return [...byValue.values()].sort((a, b) => a.value - b.value);
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
  static setConfig(config, templates) {
    const horseshoes = Array.isArray(config.layout?.horseshoes_v2) ? config.layout.horseshoes_v2 : [];

    return horseshoes.map((horseshoeConfig, index) => new HorseshoeGaugeV2(HorseshoeGaugeV2.normalizeConfig(horseshoeConfig, index, templates), index)).filter((horseshoe) => horseshoe.show?.horseshoe !== false);
  }

  static normalizeConfig(config, index, templates) {
    const entityIndex = config.entity_index ?? 0;

    const show = {
      horseshoe: true,
      horseshoe_style: 'fixed',
      labels_at: 'none',
      ...(config.show ?? {}),
    };

    const horseshoeScale = {
      min: 0,
      max: 100,
      width: 6,
      color: 'var(--primary-background-color)',
      linecap: 'round',
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

    if (horseshoeScale.min == null || horseshoeScale.max == null) {
      throw new Error(`No V2 horseshoe min/max defined for horseshoe ${index}`);
    }

    const radius = config.radius ?? 45;
    const tickmarksRadius = config.tickmarks_radius ?? 43;
    const arcDegrees = config.arc_degrees ?? 260;
    const xpos = config.xpos ?? 50;
    const ypos = config.ypos ?? 50;

    const scale = {
      type: horseshoeScale.type ?? 'linear',
      min: horseshoeScale.min,
      max: horseshoeScale.max,
      anchors: horseshoeScale.anchors,
    };

    const colorStopsConfig = config.color_stops;

    const resolvedColorStops = colorStopsConfig == null ? undefined : templates.getJsTemplateOrValue({ entity_index: entityIndex }, colorStopsConfig, { resolveKeys: true });

    const colorStops = HorseshoeGaugeV2.normalizeColorStops(resolvedColorStops);

    const svgConfig = {
      xpos: (xpos / 100) * SVG_VIEW_BOX,
      ypos: (ypos / 100) * SVG_VIEW_BOX,
      radius: (radius / 100) * SVG_VIEW_BOX,
      tickmarks_radius: (tickmarksRadius / 100) * SVG_VIEW_BOX,
    };

    return {
      ...config,

      entity_index: entityIndex,
      show,

      xpos,
      ypos,
      radius,
      tickmarks_radius: tickmarksRadius,
      arc_degrees: arcDegrees,

      svg: svgConfig,

      start_angle: config.start_angle ?? 90 + (360 - arcDegrees) / 2,
      bar_mode: config.bar_mode ?? 'normal',

      scale,
      zero_ratio: config.zero_ratio ?? HorseshoeGaugeV2.getZeroRatio(scale),

      state_map: config.state_map ?? horseshoeState.state_map ?? [],

      color_stops: colorStopsConfig,
      colorStops,

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
        offset: config.horseshoe_labels?.offset ?? 12,
        styles: {
          fill: 'var(--primary-text-color)',
          'font-size': '6px',
          ...toStyleDict(config.horseshoe_labels?.styles),
        },
      },
    };
  }

  static normalizeColorStops(colorStopsConfig) {
    if (!colorStopsConfig) {
      return { colors: [] };
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

  static getZeroRatio(scale) {
    if (scale.min >= 0 || scale.max <= 0) {
      return 0;
    }

    return clamp((0 - scale.min) / (scale.max - scale.min), 0, 1);
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

  constructor(config, index) {
    this.config = config;
    this.index = index;
    this.entity_index = config.entity_index ?? 0;
    this.show = config.show;

    this.entity = undefined;
    this.entityConfig = undefined;
    this.value = undefined;
    this.rawState = undefined;
    this.mappedState = undefined;

    this.scale = new GaugeScale(config.horseshoe_scale);
    this.geometry = new GaugeGeometry(config, this.scale);
  }

  setState(entity, entityConfig) {
    this.entity = entity;
    this.entityConfig = entityConfig;

    let value = entity.state;

    if (entityConfig?.attribute && entity.attributes?.[entityConfig.attribute] !== undefined) {
      value = entity.attributes[entityConfig.attribute];
    }

    const mappedState = this.getStateMapItem(entity.state, value);

    this.rawState = entity.state;
    this.mappedState = mappedState;
    this.value = Number(mappedState?.value ?? value);
  }

  getStateMapItem(rawState, value) {
    return this.config.state_map.find((item) => {
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
    if (!Number.isFinite(this.value)) {
      return svg``;
    }

    const model = {
      scaleSegment: this.buildScaleSegment(),
      stateSegments: this.buildStateSegments(),
      labels: this.buildLabels(),
    };

    return svg`
      <g id="horseshoe-v2-${this.index}" class="horseshoe-v2">
        ${this.renderArcSegment(model.scaleSegment, 'horseshoe-v2__scale')}
        ${model.stateSegments.map((segment) => this.renderArcSegment(segment, 'horseshoe-v2__state'))}
        ${this.renderLabels(model.labels)}
      </g>
    `;
  }

  buildScaleSegment() {
    const width = this.config.horseshoe_scale.width;

    return {
      geometry: this.geometry,
      startAngle: this.geometry.startAngle,
      endAngle: this.geometry.endAngle,
      innerRadius: this.geometry.radius - width / 2,
      outerRadius: this.geometry.radius + width / 2,
      startCap: this.config.horseshoe_scale.linecap.start,
      endCap: this.config.horseshoe_scale.linecap.end,
      styles: this.config.horseshoe_scale.styles,
    };
  }

  buildStateSegments() {
    if (this.config.horseshoe_state.mode === 'segment') {
      return this.buildMappedStateSegments();
    }

    if (this.config.bar_mode === 'bidirectional') {
      return this.buildBidirectionalStateSegments();
    }

    return this.buildNormalStateSegments();
  }

  buildNormalStateSegments() {
    const endAngle = this.geometry.valueToAngle(this.value);

    return this.buildColorAwareStateSegments({
      fromAngle: this.geometry.startAngle,
      toAngle: endAngle,
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
    const strokeStyle = this.config.show?.horseshoe_style;

    if (strokeStyle === 'colorstopsegments') {
      return this.buildColorStopStateSegments({
        fromAngle,
        toAngle,
      });
    }

    if (strokeStyle === 'colorstop' || strokeStyle === 'colorstopgradient') {
      const color = Colors.calculateStrokeColor(this.value, this.config.colorStops, strokeStyle === 'colorstopgradient');

      return [
        this.buildSingleStateSegment(fromAngle, toAngle, {
          fill: color,
        }),
      ];
    }

    return [this.buildSingleStateSegment(fromAngle, toAngle)];
  }

  buildSingleStateSegment(fromAngle, toAngle, styleOverrides = {}) {
    const width = this.config.horseshoe_state.width;

    return {
      geometry: this.geometry,
      startAngle: fromAngle,
      endAngle: toAngle,
      innerRadius: this.geometry.radius - width / 2,
      outerRadius: this.geometry.radius + width / 2,
      startCap: this.config.horseshoe_state.linecap.start,
      endCap: this.config.horseshoe_state.linecap.end,
      styles: {
        ...this.config.horseshoe_state.styles,
        ...styleOverrides,
      },
    };
  }

  buildColorStopStateSegments({ fromAngle, toAngle }) {
    const width = this.config.horseshoe_state.width;
    const colorStops = asArray(this.config.colorStops?.colors);
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
            ...this.config.horseshoe_state.styles,
            fill: stopA.color,
          },
        });
      }
    }

    if (segments.length) {
      segments[0].startCap = this.config.horseshoe_state.linecap.start;
      segments[segments.length - 1].endCap = this.config.horseshoe_state.linecap.end;
    }

    return segments;
  }

  buildMappedStateSegments() {
    const stateMap = this.config.state_map;
    const width = this.config.horseshoe_state.width;
    const gap = this.config.horseshoe_state.segment_gap;
    const count = stateMap.length;
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
        startCap: index === 0 ? this.config.horseshoe_state.linecap.start : 'butt',
        endCap: index === count - 1 ? this.config.horseshoe_state.linecap.end : 'butt',
        styles: active ? this.config.horseshoe_state.styles : this.config.horseshoe_scale.styles,
        active,
        value: item.value,
        label: item.label ?? String(item.state),
      };
    });
  }

  buildLabels() {
    switch (this.config.show.labels_at) {
      case 'minmax':
        return [this.buildLabel(this.config.horseshoe_scale.min, String(this.config.horseshoe_scale.min)), this.buildLabel(this.config.horseshoe_scale.max, String(this.config.horseshoe_scale.max))];

      case 'colorstops':
        return asArray(this.config.colorStops?.colors).map((stop) => this.buildLabel(stop.value, String(stop.value)));

      case 'none':
        return [];

      default:
        return [];
    }
  }

  buildLabel(value, text) {
    const angle = this.geometry.valueToAngle(value);
    const point = this.geometry.pointAt(angle, this.geometry.radius + this.config.horseshoe_labels.offset);

    return {
      value,
      text,
      angle,
      x: point.x,
      y: point.y,
      styles: this.config.horseshoe_labels.styles,
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
    return asArray(labels).map(
      (label) => svg`
      <text
        class="horseshoe-v2__label"
        x=${label.x}
        y=${label.y}
        style=${styleMap(label.styles)}
        text-anchor="middle"
        dominant-baseline="middle"
      >${label.text}</text>
    `,
    );
  }
}
