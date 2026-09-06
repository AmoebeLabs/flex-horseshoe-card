import { clamp } from './frontend_mods/common/number/clamp.ts';

/**
 * Cubic Hermite spline used by the original spline scale type.
 */
class CubicSpline {
  /**
   * Precomputes spline coefficients for the supplied control points.
   *
   * @param {Array<number>} x - Sorted input values.
   * @param {Array<number>} y - Output positions for each input value.
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;

    const n = x.length;
    this.n = n;

    const dx = new Array(n - 1);
    const ms = new Array(n - 1);

    // Segment slopes seed the Hermite tangents between adjacent anchors.
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

    // Limit tangents so the interpolated curve does not overshoot flat or steep segments.
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

  /**
   * Evaluates the spline position for a scale value.
   *
   * @param {number} value - Scale value to evaluate.
   * @returns {number} Interpolated scale position.
   */
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

/**
 * Monotone cubic spline used by the default spline scale to preserve anchor ordering without overshoot.
 */
class MonotoneCubicSpline {
  /**
   * Builds monotone tangents for ordered scale anchors without overshooting
   * their configured positions.
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.n = x.length;

    this.m = new Array(this.n - 1);
    this.t = new Array(this.n);

    const dx = new Array(this.n - 1);
    const dy = new Array(this.n - 1);

    for (let i = 0; i < this.n - 1; i += 1) {
      dx[i] = x[i + 1] - x[i];
      dy[i] = y[i + 1] - y[i];
      this.m[i] = dy[i] / dx[i];
    }

    this.t[0] = this.m[0] * 0.25;
    this.t[this.n - 1] = this.m[this.n - 2] * 0.25;

    for (let i = 1; i < this.n - 1; i += 1) {
      if (this.m[i - 1] === 0 || this.m[i] === 0 || this.m[i - 1] * this.m[i] < 0) {
        this.t[i] = 0;
      } else {
        const w1 = 2 * dx[i] + dx[i - 1];
        const w2 = dx[i] + 2 * dx[i - 1];
        this.t[i] = (w1 + w2) / ((w1 / this.m[i - 1]) + (w2 / this.m[i]));
      }
    }

    for (let i = 0; i < this.n - 1; i += 1) {
      if (this.m[i] === 0) {
        this.t[i] = 0;
        this.t[i + 1] = 0;
      } else {
        const a = this.t[i] / this.m[i];
        const b = this.t[i + 1] / this.m[i];
        const s = a * a + b * b;

        if (s > 9) {
          const tau = 3 / Math.sqrt(s);
          this.t[i] = tau * a * this.m[i];
          this.t[i + 1] = tau * b * this.m[i];
        }
      }
    }
  }

  /**
   * Interpolates one value inside the anchor interval and clamps lookup to
   * the endpoint positions.
   *
   * @param {number} value - Scale value to interpolate.
   * @returns {number} Interpolated position.
   */
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

    const h = this.x[index + 1] - this.x[index];
    const s = (value - this.x[index]) / h;
    const s2 = s * s;
    const s3 = s2 * s;

    const h00 = 2 * s3 - 3 * s2 + 1;
    const h10 = s3 - 2 * s2 + s;
    const h01 = -2 * s3 + 3 * s2;
    const h11 = s3 - s2;

    return (
      h00 * this.y[index]
      + h10 * h * this.t[index]
      + h01 * this.y[index + 1]
      + h11 * h * this.t[index + 1]
    );
  }
}

/**
 * Maps configured scale values to normalized positions along the horseshoe arc.
 */
export class GaugeScale {
  /**
   * Builds the selected linear or spline value-to-ratio mapping from the
   * normalized horseshoe scale configuration.
   */
  constructor(config) {
    this.type = config.type;
    this.min = Number(config.min);
    this.max = Number(config.max);

    this.points = GaugeScale.buildPoints(config);

    if (this.type === 'splineorg') {
      this.splineorg = new CubicSpline(
        this.points.map((point) => point.value),
        this.points.map((point) => point.position),
      );
      return;
    }

    if (this.type === 'spline') {
      this.spline = new MonotoneCubicSpline(
        this.points.map((point) => point.value),
        this.points.map((point) => point.position),
      );
      return;
    }

    if (this.type !== 'linear') {
      throw new Error(`[V2 GaugeScale] Unsupported scale type: ${this.type}`);
    }
  }

  /**
   * Builds and sorts the scale points used by linear, splineorg, and spline scales.
   *
   * @param {object} config - Normalized horseshoe scale configuration.
   * @returns {Array<object>} Scale point definitions with value and position.
   */
  static buildPoints(config) {
    if (config.type !== 'splineorg' && config.type !== 'spline') {
      return [
        { value: Number(config.min), position: 0 },
        { value: Number(config.max), position: 1 },
      ];
    }

    if (!config.spline?.anchors) {
      throw new Error('[V2 GaugeScale] Missing horseshoe_scale.spline.anchors');
    }

    const anchors = config.spline.anchors
      .map((point) => ({
        value: Number(point.value),
        position: Number(point.position),
      }))
      .filter((point) => Number.isFinite(point.value) && Number.isFinite(point.position))
      .sort((a, b) => a.value - b.value);

    if (config.type === 'spline') {
      const minValue = Number(config.min);
      const maxValue = Number(config.max);
      // The default spline owns its endpoints: scale min is position 0 and scale max is position 1.
      // Anchors exactly on min/max are ignored here so they cannot collapse the usable arc range.
      const innerAnchors = anchors.filter((point) => point.value > minValue && point.value < maxValue);

      return [
        { value: minValue, position: 0 },
        ...innerAnchors,
        { value: maxValue, position: 1 },
      ]
        .filter((point) => Number.isFinite(point.value) && Number.isFinite(point.position))
        .sort((a, b) => a.value - b.value);
    }

    return anchors;
  }

  /**
   * Converts a scale value to a clamped 0..1 position.
   *
   * @param {number} value - Scale value to map.
   * @returns {number} Normalized arc position.
   */
  toRatio(value) {
    const numericValue = Number(value);

    if (this.type === 'splineorg') {
      return clamp(this.splineorg.get(numericValue), 0, 1);
    }

    if (this.type === 'spline') {
      return clamp(this.spline.get(numericValue), 0, 1);
    }

    return clamp((numericValue - this.min) / (this.max - this.min), 0, 1);
  }
}
