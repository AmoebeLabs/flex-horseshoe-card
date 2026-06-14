/* eslint-disable max-classes-per-file */

const DEG_TO_RAD = Math.PI / 180;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

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

class NaturalCubicSpline {
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

    return this.a[index] + this.b[index] * diff + this.c[index] * diff * diff + this.d[index] * diff * diff * diff;
  }
}

class MonotoneCubicSpline {
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

export class GaugeScale {
  constructor(config) {
    this.type = config.type;
    this.min = Number(config.min);
    this.max = Number(config.max);

    this.points = GaugeScale.buildPoints(config);

    if (this.type === 'spline') {
      this.spline = new CubicSpline(
        this.points.map((point) => point.value),
        this.points.map((point) => point.position),
      );
      return;
    }

    if (this.type === 'spline2') {
      this.spline2 = new MonotoneCubicSpline(
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
    if (config.type !== 'spline' && config.type !== 'spline2') {
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

    if (config.type === 'spline2') {
      const points = [
        { value: Number(config.min), position: 0 },
        ...anchors,
        { value: Number(config.max), position: 1 },
      ]
        .filter((point) => Number.isFinite(point.value) && Number.isFinite(point.position))
        .sort((a, b) => a.value - b.value);

      const byValue = new Map();

      points.forEach((point) => {
        byValue.set(point.value, point);
      });

      return [...byValue.values()].sort((a, b) => a.value - b.value);
    }

    return anchors;
  }

  toRatio(value) {
    const numericValue = Number(value);

    if (this.type === 'spline') {
      return clamp(this.spline.get(numericValue), 0, 1);
    }

    if (this.type === 'spline2') {
      return clamp(this.spline2.get(numericValue), 0, 1);
    }

    return clamp((numericValue - this.min) / (this.max - this.min), 0, 1);
  }
}

export class GaugeGeometry {
  constructor(config, scale) {
    this.cx = config.svg.xpos;
    this.cy = config.svg.ypos;

    this.radius = config.svg.radius;
    this.tickmarksRadius = config.svg.tickmarks_radius;

    this.arcDegrees = config.arc_degrees;
    this.startAngle = config.start_angle;
    this.endAngle = this.startAngle + this.arcDegrees;

    this.rotation = Number(config.rotate ?? 0);
    this.flip = config.flip ?? 'none';

    this.zeroRatio = config.zero_ratio;
    this.zeroAngle = this.ratioToAngle(this.zeroRatio);

    this.scale = scale;
  }

  getTransformContext() {
    return {
      rotation: this.rotation,
      flipX: this.flip === 'x' || this.flip === 'both',
      flipY: this.flip === 'y' || this.flip === 'both',
    };
  }

  getRotateTransform() {
    if (!this.rotation) {
      return '';
    }

    return `rotate(${this.rotation} ${this.cx} ${this.cy})`;
  }

  getScaleTransform() {
    const transformContext = this.getTransformContext();

    if (!transformContext.flipX && !transformContext.flipY) {
      return '';
    }

    const scaleX = transformContext.flipX ? -1 : 1;
    const scaleY = transformContext.flipY ? -1 : 1;

    return `translate(${this.cx} ${this.cy}) scale(${scaleX} ${scaleY}) translate(${-this.cx} ${-this.cy})`;
  }

  getGroupTransform() {
    return [
      this.getRotateTransform(),
      this.getScaleTransform(),
    ].filter(Boolean).join(' ');
  }

  getInverseGroupTransform() {
    const transformContext = this.getTransformContext();
    const parts = [];

    if (transformContext.flipX || transformContext.flipY) {
      const scaleX = transformContext.flipX ? -1 : 1;
      const scaleY = transformContext.flipY ? -1 : 1;

      parts.push(`translate(${this.cx} ${this.cy})`);
      parts.push(`scale(${scaleX} ${scaleY})`);
      parts.push(`translate(${-this.cx} ${-this.cy})`);
    }

    if (this.rotation) {
      parts.push(`rotate(${-this.rotation} ${this.cx} ${this.cy})`);
    }

    return parts.join(' ');
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
