/* eslint-disable max-classes-per-file */
// src/horseshoe-gauge-v2.js

import { svg } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import ColorStops from './color-stops';
import Colors from './colors';

import { SVG_VIEW_BOX } from './const.js';

const DEG_TO_RAD = Math.PI / 180;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const asArray = (value) => (Array.isArray(value) ? value : []);

const centerFromPercent = (value) => (value / 100) * SVG_VIEW_BOX;

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

    for (let i = 0; i < this.n - 1; i++) {
      h[i] = x[i + 1] - x[i];
    }

    const alpha = new Array(this.n - 1).fill(0);

    for (let i = 1; i < this.n - 1; i++) {
      alpha[i] = (3 / h[i]) * (this.a[i + 1] - this.a[i]) - (3 / h[i - 1]) * (this.a[i] - this.a[i - 1]);
    }

    const l = new Array(this.n).fill(1);
    const mu = new Array(this.n).fill(0);
    const z = new Array(this.n).fill(0);

    for (let i = 1; i < this.n - 1; i++) {
      l[i] = 2 * (x[i + 1] - x[i - 1]) - h[i - 1] * mu[i - 1];
      mu[i] = h[i] / l[i];
      z[i] = (alpha[i] - h[i - 1] * z[i - 1]) / l[i];
    }

    for (let j = this.n - 2; j >= 0; j--) {
      this.c[j] = z[j] - mu[j] * this.c[j + 1];

      this.b[j] = (this.a[j + 1] - this.a[j]) / h[j] - (h[j] * (this.c[j + 1] + 2 * this.c[j])) / 3;

      this.d[j] = (this.c[j + 1] - this.c[j]) / (3 * h[j]);
    }
  }

  get(value) {
    if (value <= this.x[0]) return this.y[0];
    if (value >= this.x[this.n - 1]) return this.y[this.n - 1];

    let i = 0;

    for (let k = 0; k < this.n - 1; k++) {
      if (value >= this.x[k] && value <= this.x[k + 1]) {
        i = k;
        break;
      }
    }

    const dx = value - this.x[i];

    return this.a[i] + this.b[i] * dx + this.c[i] * dx ** 2 + this.d[i] * dx ** 3;
  }
}

class GaugeState {
  constructor(config) {
    this.stateMap = config.state_map ?? [];
  }

  getMappedState(entity, state) {
    return this.stateMap.find((item) => {
      if (item.state !== undefined) {
        return String(item.state) === String(entity.state);
      }

      if (item.value !== undefined) {
        return String(item.value) === String(state);
      }

      return false;
    });
  }
}

class GaugeStateV1 {
  constructor(config) {
    this.stateMap = config.state_map;
  }

  get(entityState) {
    const rawState = entityState?.state;

    const mapped = this.stateMap.find((item) => String(item.state) === String(rawState));

    if (mapped) {
      return {
        rawState,
        value: mapped.value,
        label: mapped.label ?? String(mapped.state),
        mapped,
      };
    }

    const numericValue = Number(rawState);

    return {
      rawState,
      value: Number.isFinite(numericValue) ? numericValue : rawState,
      label: String(rawState),
      mapped: null,
    };
  }
}

class LinearScaleMapper {
  constructor(config) {
    this.min = config.min;
    this.max = config.max;
  }

  toRatio(value) {
    return clamp((Number(value) - this.min) / (this.max - this.min), 0, 1);
  }
}

class SplineScaleMapper {
  constructor(config) {
    this.anchors = config.anchors;

    this.spline = new CubicSpline(
      this.anchors.map((item) => item.value),
      this.anchors.map((item) => item.position),
    );
  }

  toRatio(value) {
    return clamp(this.spline.get(Number(value)), 0, 1);
  }
}

class GaugeScale {
  constructor(config) {
    this.config = config;
    this.mapper = GaugeScale.createMapper(config);
  }

  static createMapper(config) {
    console.log('[V2 scale config]', config);

    switch (config.type) {
      case 'linear':
        console.log('[V2 scale mapper] linear');
        return new LinearScaleMapper(config);

      case 'spline':
        console.log('[V2 scale mapper] spline');
        return new SplineScaleMapper(config);

      default:
        throw new Error(`Unsupported V2 scale type: ${config.type}`);
    }
  }

  static createMapperV1(config) {
    switch (config.type) {
      case 'linear':
        return new LinearScaleMapper(config);

      case 'spline':
        return new SplineScaleMapper(config);

      default:
        throw new Error(`Unsupported V2 scale type: ${config.type}`);
    }
  }

  toRatio(value) {
    return this.mapper.toRatio(value);
  }
}

class GaugeGeometry {
  constructor(config, scale) {
    this.cx = config.cx;
    this.cy = config.cy;

    this.radius = config.radiusSize;
    this.tickmarksRadius = config.tickmarksRadiusSize;

    this.arcDegrees = config.arc_degrees;
    this.startAngle = config.start_angle;
    this.endAngle = this.startAngle + this.arcDegrees;

    this.barMode = config.bar_mode;
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
  static buildBandPath({ geometry, startAngle, endAngle, innerRadius, outerRadius, startCap, endCap }) {
    if (endAngle <= startAngle) return '';

    const outerStart = geometry.pointAt(startAngle, outerRadius);
    const outerEnd = geometry.pointAt(endAngle, outerRadius);
    const innerEnd = geometry.pointAt(endAngle, innerRadius);
    const innerStart = geometry.pointAt(startAngle, innerRadius);

    const largeArc = Math.abs(endAngle - startAngle) > 180 ? 1 : 0;
    const sweep = 1;
    const reverseSweep = 0;
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

class ArcSegmentBuilder {
  constructor({ config, scale, geometry }) {
    this.config = config;
    this.scale = scale;
    this.geometry = geometry;
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

  buildStateSegments(stateInfo) {
    switch (this.config.horseshoe_state.mode) {
      case 'value':
        return this.buildValueStateSegments(stateInfo);

      case 'segment':
        return this.buildMappedStateSegments(stateInfo);

      default:
        throw new Error(`Unsupported V2 horseshoe_state mode: ${this.config.horseshoe_state.mode}`);
    }
  }

  buildValueStateSegments(stateInfo) {
    if (this.config.bar_mode === 'bidirectional') {
      return this.buildBidirectionalValueStateSegments(stateInfo);
    }

    return this.buildNormalValueStateSegments(stateInfo);
  }

  buildNormalValueStateSegments(stateInfo) {
    const endAngle = this.geometry.valueToAngle(stateInfo.value);

    return this.buildColorAwareStateSegments({
      fromAngle: this.geometry.startAngle,
      toAngle: endAngle,
      stateInfo,
    });
  }

  buildBidirectionalValueStateSegments(stateInfo) {
    const valueAngle = this.geometry.valueToAngle(stateInfo.value);
    const zeroAngle = this.geometry.zeroAngle;

    return this.buildColorAwareStateSegments({
      fromAngle: Math.min(zeroAngle, valueAngle),
      toAngle: Math.max(zeroAngle, valueAngle),
      stateInfo,
    });
  }

  buildColorAwareStateSegments({ fromAngle, toAngle, stateInfo }) {
    const strokeStyle = this.config.show?.horseshoe_style;
    const colorStops = asArray(this.config.colorStops?.colors);

    if (strokeStyle === 'colorstopsegments') {
      return this.buildColorStopStateSegments({
        fromAngle,
        toAngle,
        colorStops,
      });
    }

    if (strokeStyle === 'colorstop' || strokeStyle === 'colorstopgradient') {
      const color = Colors.calculateStrokeColor(stateInfo.value, this.config.colorStops, strokeStyle === 'colorstopgradient');

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

  buildColorStopStateSegments({ fromAngle, toAngle, colorStops }) {
    const width = this.config.horseshoe_state.width;
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

  buildMappedStateSegments(stateInfo) {
    const stateMap = this.config.state_map;
    const width = this.config.horseshoe_state.width;
    const gap = this.config.horseshoe_state.segment_gap;

    const count = stateMap.length;
    const step = this.geometry.arcDegrees / count;

    return stateMap.map((item, index) => {
      const startAngle = this.geometry.startAngle + index * step + gap / 2;
      const endAngle = this.geometry.startAngle + (index + 1) * step - gap / 2;

      const active = Number(item.value) === Number(stateInfo.value);

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
}

class ArcSegmentBuilderV1 {
  constructor({ config, scale, geometry }) {
    this.config = config;
    this.scale = scale;
    this.geometry = geometry;
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

  buildStateSegments(stateInfo) {
    switch (this.config.horseshoe_state.mode) {
      case 'value':
        return this.buildValueStateSegments(stateInfo);

      case 'segment':
        return this.buildMappedStateSegments(stateInfo);

      default:
        throw new Error(`Unsupported V2 horseshoe_state mode: ${this.config.horseshoe_state.mode}`);
    }
  }

  buildValueStateSegments(stateInfo) {
    if (this.config.bar_mode === 'bidirectional') {
      return this.buildBidirectionalValueStateSegments(stateInfo);
    }

    return this.buildNormalValueStateSegments(stateInfo);
  }

  buildNormalValueStateSegments(stateInfo) {
    const endAngle = this.geometry.valueToAngle(stateInfo.value);

    return this.buildColorAwareStateSegments({
      fromAngle: this.geometry.startAngle,
      toAngle: endAngle,
    });
  }

  buildBidirectionalValueStateSegments(stateInfo) {
    const valueAngle = this.geometry.valueToAngle(stateInfo.value);
    const zeroAngle = this.geometry.zeroAngle;

    return this.buildColorAwareStateSegments({
      fromAngle: Math.min(zeroAngle, valueAngle),
      toAngle: Math.max(zeroAngle, valueAngle),
    });
  }

  buildColorAwareStateSegments({ fromAngle, toAngle, stateInfo }) {
    const strokeStyle = this.config.show?.horseshoe_style;
    const colorStops = asArray(this.config.colorStops?.colors);

    if (strokeStyle === 'colorstopsegments') {
      return this.buildColorStopStateSegments({
        fromAngle,
        toAngle,
        colorStops,
      });
    }

    if (strokeStyle === 'colorstop' || strokeStyle === 'colorstopgradient') {
      const color = Colors.calculateStrokeColor(stateInfo.value, this.config.colorStops, strokeStyle === 'colorstopgradient');

      return [
        this.buildSingleStateSegment(fromAngle, toAngle, {
          fill: color,
        }),
      ];
    }

    return [this.buildSingleStateSegment(fromAngle, toAngle)];
  }

  buildColorAwareStateSegmentsV1({ fromAngle, toAngle }) {
    const colorStops = asArray(this.config.colorStops?.colors);

    if (!colorStops.length || this.config.show.horseshoe_style !== 'colorstop') {
      return [this.buildSingleStateSegment(fromAngle, toAngle)];
    }

    return this.buildColorStopStateSegments({
      fromAngle,
      toAngle,
      colorStops,
    });
  }

  buildSingleStateSegment(fromAngle, toAngle) {
    const width = this.config.horseshoe_state.width;

    return {
      geometry: this.geometry,
      startAngle: fromAngle,
      endAngle: toAngle,
      innerRadius: this.geometry.radius - width / 2,
      outerRadius: this.geometry.radius + width / 2,
      startCap: this.config.horseshoe_state.linecap.start,
      endCap: this.config.horseshoe_state.linecap.end,
      styles: this.config.horseshoe_state.styles,
    };
  }

  buildColorStopStateSegments({ fromAngle, toAngle, colorStops }) {
    const { config, geometry } = this;
    const width = this.config.horseshoe_state.width;
    const segments = [];

    for (let i = 0; i < colorStops.length - 1; i++) {
      const stopA = colorStops[i];
      const stopB = colorStops[i + 1];

      const segmentStart = this.geometry.valueToAngle(stopA.value);
      const segmentEnd = this.geometry.valueToAngle(stopB.value);

      const drawStart = Math.max(segmentStart, fromAngle);
      const drawEnd = Math.min(segmentEnd, toAngle);

      if (drawEnd > drawStart) {
        segments.push({
          geometry,
          startAngle: drawStart,
          endAngle: drawEnd,
          innerRadius: geometry.radius - width / 2,
          outerRadius: geometry.radius + width / 2,
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
      segments[0].startCap = this.config.horseshoe_state.linecap.start;
      segments[segments.length - 1].endCap = this.config.horseshoe_state.linecap.end;
    }

    return segments;
  }

  buildMappedStateSegments(stateInfo) {
    const stateMap = this.config.state_map;
    const width = this.config.horseshoe_state.width;
    const gap = this.config.horseshoe_state.segment_gap;

    const count = stateMap.length;
    const step = this.geometry.arcDegrees / count;

    return stateMap.map((item, index) => {
      const startAngle = this.geometry.startAngle + index * step + gap / 2;
      const endAngle = this.geometry.startAngle + (index + 1) * step - gap / 2;

      const active = Number(item.value) === Number(stateInfo.value);

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
}

class LabelBuilder {
  constructor({ config, scale, geometry }) {
    this.config = config;
    this.scale = scale;
    this.geometry = geometry;
  }

  build() {
    switch (this.config.show.labels_at) {
      case 'minmax':
        return this.buildMinMaxLabels();

      case 'colorstops':
        return this.buildColorStopLabels();

      case 'none':
        return [];

      default:
        return [];
    }
  }

  buildMinMaxLabels() {
    return [this.buildLabel(this.config.horseshoe_scale.min, String(this.config.horseshoe_scale.min)), this.buildLabel(this.config.horseshoe_scale.max, String(this.config.horseshoe_scale.max))];
  }

  buildColorStopLabels() {
    return asArray(this.config.colorStops?.colors).map((stop) => this.buildLabel(stop.value, stop.label ?? String(stop.value)));
  }

  buildLabel(value, text) {
    const angle = this.geometry.valueToAngle(value);

    console.log('[V2 label]', { value, text, angle });

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

  buildLabelV1(value, text) {
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
}

class HorseshoeGaugeRenderer {
  render(model) {
    return svg`
      <g class="horseshoe-v2">
        ${this.renderScale(model.scaleSegment)}
        ${this.renderState(model.stateSegments)}
        ${this.renderLabels(model.labels)}
      </g>
    `;
  }

  renderScale(segment) {
    return this.renderArcSegment(segment, 'horseshoe-v2__scale');
  }

  renderState(segments) {
    return asArray(segments).map((segment) => this.renderArcSegment(segment, 'horseshoe-v2__state'));
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

  renderArcSegment(segment, className) {
    const d = ArcPathBuilder.buildBandPath(segment);

    if (!d) return svg``;

    return svg`
      <path
        class=${className}
        d=${d}
        style=${styleMap(segment.styles)}
      ></path>
    `;
  }
}

export default class HorseshoeGaugeV2 {
  static setConfig(config, templates) {
    try {
      console.log('[V2 setConfig] enter');

      const horseshoes = Array.isArray(config.layout?.horseshoes_v2) ? config.layout.horseshoes_v2 : [];

      console.log('[V2 setConfig] raw horseshoes', horseshoes);

      const result = horseshoes
        .map((horseshoeConfig, index) => {
          console.log('[V2 normalize start]', index, horseshoeConfig);

          const normalized = HorseshoeGaugeV2.normalizeConfig(horseshoeConfig, index, templates);

          console.log('[V2 normalize done]', index, normalized);

          return new HorseshoeGaugeV2(normalized, index);
        })
        .filter((horseshoe) => horseshoe.config.show?.horseshoe !== false);

      console.log('[V2 setConfig] done', result);

      return result;
    } catch (error) {
      console.error('[V2 setConfig ERROR]', {
        error,
        message: error?.message,
        stack: error?.stack,
      });

      throw error;
    }
  }

  static setConfigV1(config, templates, cardContext) {
    const horseshoes = Array.isArray(config.layout?.horseshoes_v2) ? config.layout.horseshoes_v2 : [];

    return horseshoes
      .map((horseshoeConfig, index) => {
        const normalizedConfig = HorseshoeGaugeV2.normalizeConfig(horseshoeConfig, index, templates);

        return new HorseshoeGaugeV2(normalizedConfig, index, cardContext);
      })
      .filter((horseshoe) => horseshoe.config.show?.horseshoe !== false);
  }

  constructor(config, index, cardContext) {
    this.config = config;
    this.index = index;
    this.cardContext = cardContext;

    this.objectState = undefined;
    this.stateInfo = undefined;

    this.state = new GaugeState(this.config);
    this.scale = new GaugeScale(this.config.horseshoe_scale);
    this.geometry = new GaugeGeometry(this.config, this.scale);

    this.segmentBuilder = new ArcSegmentBuilder({
      config: this.config,
      scale: this.scale,
      geometry: this.geometry,
    });

    this.labelBuilder = new LabelBuilder({
      config: this.config,
      scale: this.scale,
      geometry: this.geometry,
    });

    this.renderer = new HorseshoeGaugeRenderer();
  }

  setState(entity, entityConfig) {
    this.entity = entity;
    this.entityConfig = entityConfig;

    let state = entity.state;

    if (entityConfig.attribute && entity.attributes[entityConfig.attribute] !== undefined) {
      state = entity.attributes[entityConfig.attribute];
    }

    const mapped = this.state.getMappedState?.(entity, state);

    this.stateInfo = {
      entity,
      entityConfig,
      rawState: entity.state,
      state,
      value: mapped?.value ?? Number(state),
      label: mapped?.label ?? String(state),
      mapped,
    };
  }

  setStateV1(objectState) {
    this.objectState = objectState;
    this.stateInfo = this.state.get(objectState);
  }

  render() {
    const stateInfo = this.stateInfo ?? {
      rawState: '50',
      value: 50,
      label: '50',
      mapped: null,
    };

    const scaleSegment = this.segmentBuilder.buildScaleSegment();
    const stateSegments = this.segmentBuilder.buildStateSegments(stateInfo);
    const labels = this.labelBuilder.build();

    console.log('[V2 render debug]', {
      stateInfo,
      scaleSegment,
      stateSegments,
      labels,
      scalePath: ArcPathBuilder.buildBandPath(scaleSegment),
      statePaths: stateSegments.map((segment) => ArcPathBuilder.buildBandPath(segment)),
    });

    return this.renderer.render({
      stateInfo,
      scaleSegment,
      stateSegments,
      labels,
    });
  }

  renderV2() {
    return svg`
    <g class="horseshoe-v2-test">
      <circle
        cx="100"
        cy="100"
        r="40"
        fill="none"
        stroke="red"
        stroke-width="4"
      ></circle>
    </g>
  `;
  }

  renderV1() {
    const stateInfo = this.stateInfo ?? {
      rawState: '50',
      value: 50,
      label: '50',
      mapped: null,
    };
    if (!this.stateInfo) {
      return svg``;
    }

    const model = {
      index: this.index,
      config: this.config,
      objectState: this.objectState,
      stateInfo: this.stateInfo,

      scaleSegment: this.segmentBuilder.buildScaleSegment(),
      stateSegments: this.segmentBuilder.buildStateSegments(this.stateInfo),
      labels: this.labelBuilder.build(),
    };

    return this.renderer.render(model);
  }

  static normalizeConfig(config, index, templates) {
    const entityIndex = config.entity_index ?? 0;

    const horseshoeScale = {
      min: 0,
      max: 100,
      width: 6,
      color: 'var(--primary-background-color)',
      ...(config.horseshoe_scale ?? {}),
    };

    const horseshoeState = {
      width: 12,
      color: 'var(--primary-color)',
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

    const radiusSize = (radius / 100) * SVG_VIEW_BOX;
    const tickmarksRadiusSize = (tickmarksRadius / 100) * SVG_VIEW_BOX;

    const scale = {
      type: config.horseshoe_scale?.type ?? 'linear',
      min: horseshoeScale.min,
      max: horseshoeScale.max,
      anchors: config.horseshoe_scale?.anchors,
    };

    const colorStopsConfig = config.color_stops;

    const resolvedColorStops = colorStopsConfig == null ? undefined : templates.getJsTemplateOrValue({ entity_index: entityIndex }, colorStopsConfig, { resolveKeys: true });

    const colorStops = resolvedColorStops == null ? { colors: [] } : ColorStops.ensureMinimumStops(ColorStops.normalize(resolvedColorStops), horseshoeScale.max);

    return {
      ...config,

      entity_index: entityIndex,

      show: {
        horseshoe: true,
        horseshoe_style: 'fixed',
        labels_at: 'none',
        ...(config.show ?? {}),
      },

      xpos,
      ypos,
      cx: (xpos / 100) * SVG_VIEW_BOX,
      cy: (ypos / 100) * SVG_VIEW_BOX,

      radius,
      tickmarks_radius: tickmarksRadius,
      arc_degrees: arcDegrees,
      radiusSize,
      tickmarksRadiusSize,

      start_angle: config.start_angle ?? 90 + (360 - arcDegrees) / 2,
      bar_mode: config.bar_mode ?? 'normal',

      scale,
      zero_ratio: config.zero_ratio ?? HorseshoeGaugeV2.getZeroRatio(scale),

      state_map: config.state_map ?? horseshoeState.state_map ?? [],

      color_stops: colorStopsConfig,
      colorStops,

      horseshoe_scale: {
        ...horseshoeScale,
        linecap: HorseshoeGaugeV2.normalizeLinecap(horseshoeScale.linecap ?? 'round'),
        styles: {
          fill: horseshoeScale.color,
          ...(horseshoeScale.styles ?? {}),
        },
      },

      horseshoe_state: {
        ...horseshoeState,
        linecap: HorseshoeGaugeV2.normalizeLinecap(horseshoeState.linecap ?? 'round'),
        styles: {
          fill: horseshoeState.color,
          ...(horseshoeState.styles ?? {}),
        },
      },

      horseshoe_labels: {
        offset: config.horseshoe_labels?.offset ?? 12,
        styles: config.horseshoe_labels?.styles ?? {
          fill: 'var(--primary-text-color)',
          'font-size': '6px',
        },
      },
    };
  }

  static getZeroRatio(scale) {
    if (scale.min >= 0 || scale.max <= 0) return 0;

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
}
