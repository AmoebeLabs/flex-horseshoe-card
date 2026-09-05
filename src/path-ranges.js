import { clamp } from './frontend_mods/common/number/clamp.ts';

/**
 * Maps source values and state modes into semantic 0..100 path ranges. This
 * layer knows scale and state meaning, but never receives SVG or paint data.
 */
export class PathValueMapper {
  /**
   * Stores one normalized value-mapping contract and selects its initial active
   * absolute branch.
   *
   * @param {object} config - Scale, bar mode, zero position, and state mapping.
   * @param {number} activeValue - Current source value.
   */
  constructor(config, activeValue) {
    this.scale = config.scale;
    this.barMode = config.barMode;
    this.zeroProgress = config.zeroRatio * 100;
    this.stateMode = config.stateMode;
    this.stateMap = config.stateMap;
    this.absoluteSign = Number(activeValue) < 0 ? -1 : 1;
  }

  /**
   * Selects the signed scale branch used by absolute value mapping.
   *
   * @param {number} value - Current signed source value.
   * @returns {boolean} Whether the visible absolute branch changed.
   */
  setActiveValue(value) {
    const nextSign = Number(value) < 0 ? -1 : 1;
    const changed = this.barMode === 'absolute' && nextSign !== this.absoluteSign;

    this.absoluteSign = nextSign;

    return changed;
  }

  /**
   * Converts a source value to its legacy normalized ratio. Path consumers use
   * valueToProgress(); this ratio remains available while the V2 horseshoe is
   * connected to the shared mapper.
   *
   * @param {number} value - Source value to map.
   * @returns {number} Normalized 0..1 ratio.
   */
  valueToRatio(value) {
    const numericValue = Number(value);
    const symmetricalBidirectional = this.barMode === 'bidirectional' || this.barMode === 'bidirectional_symmetrical';

    if (this.barMode === 'absolute') {
      const zeroScaleRatio = this.scale.toRatio(0);
      const valueScaleRatio = this.scale.toRatio(this.scale.min === 0 ? Math.abs(numericValue) : numericValue);

      if (this.scale.min === 0) {
        const endScaleRatio = this.scale.toRatio(this.scale.max);
        return clamp((valueScaleRatio - zeroScaleRatio) / (endScaleRatio - zeroScaleRatio), 0, 1);
      }

      if (numericValue < 0) {
        const endScaleRatio = this.scale.toRatio(this.scale.min);
        return clamp((zeroScaleRatio - valueScaleRatio) / (zeroScaleRatio - endScaleRatio), 0, 1);
      }

      const endScaleRatio = this.scale.toRatio(this.scale.max);
      return clamp((valueScaleRatio - zeroScaleRatio) / (endScaleRatio - zeroScaleRatio), 0, 1);
    }

    if (!symmetricalBidirectional) {
      return this.scale.toRatio(numericValue);
    }

    if (this.scale.min >= 0) {
      return 0.5 + 0.5 * this.scale.toRatio(numericValue);
    }

    if (this.scale.max <= 0) {
      return 0.5 * this.scale.toRatio(numericValue);
    }

    const zeroScaleRatio = this.scale.toRatio(0);

    if (numericValue < 0) {
      const valueRatio = this.scale.toRatio(numericValue);
      const sideRatio = zeroScaleRatio > 0 ? valueRatio / zeroScaleRatio : 0;

      return 0.5 * clamp(sideRatio, 0, 1);
    }

    const valueRatio = this.scale.toRatio(numericValue);
    const positiveRange = 1 - zeroScaleRatio;
    const sideRatio = positiveRange > 0 ? (valueRatio - zeroScaleRatio) / positiveRange : 0;

    return 0.5 + 0.5 * clamp(sideRatio, 0, 1);
  }

  /**
   * Converts a source value to normalized 0..100 path progress after applying
   * the selected normal, absolute, or bidirectional mapping.
   *
   * @param {number} value - Source value to map.
   * @returns {number} Normalized path progress.
   */
  valueToProgress(value) {
    return this.valueToRatio(value) * 100;
  }

  /**
   * Returns the signed source interval represented by the complete path for the
   * active branch.
   *
   * @returns {object} Source start and end values in traversal order.
   */
  getActiveSourceRange() {
    if (this.barMode !== 'absolute') {
      return {
        start: this.scale.min,
        end: this.scale.max,
      };
    }

    return {
      start: 0,
      end: this.absoluteSign < 0
        ? (this.scale.min < 0 ? this.scale.min : -this.scale.max)
        : this.scale.max,
    };
  }

  /**
   * Converts a visual magnitude back to the signed source branch.
   *
   * @param {number} magnitude - Positive distance from zero.
   * @returns {number} Source value on the active branch.
   */
  magnitudeToSourceValue(magnitude) {
    const numericMagnitude = Number(magnitude);

    if (numericMagnitude === 0) {
      return 0;
    }

    return this.barMode === 'absolute' ? numericMagnitude * this.absoluteSign : numericMagnitude;
  }

  /** Returns the visible magnitude limit for the active source branch. */
  getActiveMagnitudeMax() {
    return Math.abs(this.getActiveSourceRange().end);
  }

  /**
   * Selects and orders source stops for the active absolute branch.
   *
   * @param {Array<object>} colorStops - Normalized signed source stops.
   * @returns {Array<object>} Stops ordered by visual progress.
   */
  getActiveColorStops(colorStops) {
    if (this.barMode !== 'absolute') {
      return colorStops;
    }

    const range = this.getActiveSourceRange();
    const sourceMin = Math.min(range.start, range.end);
    const sourceMax = Math.max(range.start, range.end);

    return colorStops
      .filter((colorStop) => Number(colorStop.value) >= sourceMin && Number(colorStop.value) <= sourceMax)
      .sort((colorStopA, colorStopB) => this.valueToProgress(colorStopA.value) - this.valueToProgress(colorStopB.value));
  }

  /**
   * Builds semantic ranges for the current source or ranked state. Equal state
   * slots retain their before/current/after relation without adding paint data.
   *
   * @param {number} value - Current numeric or ranked source value.
   * @returns {Array<object>} Semantic ranges in normalized 0..100 path space.
   */
  buildSemanticRanges(value) {
    if (this.stateMode === 'segment' || this.stateMode === 'stringstate_mode' || this.stateMode === 'stringstate_level') {
      const currentIndex = this.stateMap.findIndex((item) => Number(item.value) === Number(value));
      const step = 100 / this.stateMap.length;

      return this.stateMap.map((item, index) => {
        let relation = 'current';

        if (index < currentIndex) relation = 'before';
        if (index > currentIndex || currentIndex < 0) relation = 'after';

        return {
          id: `mapped-state-${index}`,
          start: index * step,
          end: (index + 1) * step,
          active: this.stateMode === 'stringstate_level'
            ? relation === 'before' || relation === 'current'
            : relation === 'current',
          sourceValue: item.value,
          role: 'state',
          relation,
        };
      });
    }

    const valueProgress = this.valueToProgress(value);

    if (this.barMode === 'bidirectional' || this.barMode === 'bidirectional_symmetrical' || this.barMode === 'bidirectional_linear') {
      return [{
        id: 'state',
        start: Math.min(this.zeroProgress, valueProgress),
        end: Math.max(this.zeroProgress, valueProgress),
        active: true,
        sourceValue: value,
        role: 'state',
      }];
    }

    return [{
      id: 'state',
      start: 0,
      end: valueProgress,
      active: true,
      sourceValue: value,
      role: 'state',
    }];
  }
}
