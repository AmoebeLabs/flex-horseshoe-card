import { clamp } from './frontend_mods/common/number/clamp.ts';

/**
 * Converts Horseshoe values into 0..100 Path positions using the selected scale
 * and bar_mode. String-state modes divide the Path into equal state_map slots.
 */
export class PathValueMapper {
  /**
   * Keeps the Horseshoe scale and state_map. For absolute mode, the current
   * value's sign selects the negative or positive part of the scale.
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
   * Maps a source value to a 0..1 ratio using the selected absolute or signed
   * scale branch. Path progress converts this ratio to percentages.
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
   * Divides the Horseshoe scale at its color-stop values. Each interval keeps
   * its scale values and 0..100 positions for the gauge to select its color.
   *
   * @param {Array<number>} stopValues - Configured source values.
   * @returns {Array<object>} Ordered color-stop intervals in 0..100 space.
   */
  buildColorStopRanges(stopValues) {
    const sourceRange = this.getActiveSourceRange();
    const sourceMin = Math.min(sourceRange.start, sourceRange.end);
    const sourceMax = Math.max(sourceRange.start, sourceRange.end);
    const progressPoints = [sourceRange.start, ...stopValues, sourceRange.end]
      .filter((sourceValue) => Number(sourceValue) >= sourceMin && Number(sourceValue) <= sourceMax)
      .sort((valueA, valueB) => this.valueToProgress(valueA) - this.valueToProgress(valueB))
      .filter((sourceValue, index, values) => values.findIndex((candidate) => Number(candidate) === Number(sourceValue)) === index);

    return progressPoints.slice(0, -1).map((sourceValue, index) => ({
      id: `color-stop-${index}`,
      start: this.valueToProgress(sourceValue),
      end: this.valueToProgress(progressPoints[index + 1]),
      active: true,
      sourceValue,
      sourceEndValue: progressPoints[index + 1],
      role: 'color-stop',
    }));
  }

  /**
   * Builds the visible progress range for a numeric value or state_map entry.
   * String-state slots record before/current/after so the gauge can choose their
   * configured styles; level mode also activates all slots before the current one.
   *
   * @param {number} value - Current numeric or ranked source value.
   * @returns {Array<object>} Value ranges in normalized 0..100 path space.
   */
  buildStateRanges(value) {
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

/**
 * Prepares Horseshoe ranges for drawing: clip to the visible progress, leave
 * configured gaps and choose the first/last end caps. Dash positions use the
 * same 0..100 scale for every Path shape.
 *
 * @param {Array<object>} ranges - Ordered path-independent ranges.
 * @param {object} config - Normalized paint, clip, gap, and cap configuration.
 * @returns {Array<object>} Visible painted ranges with normalized dash data.
 */
export function buildPaintedRanges(ranges, config) {
  // Clip first so the end caps follow the visible progress, including when the
  // current value ends partway through a color-stop interval.
  const clippedRanges = ranges
    .map((range, index) => ({
      range,
      paint: config.paints[index],
      start: clamp(Math.max(range.start, config.clip.start), 0, 100),
      end: clamp(Math.min(range.end, config.clip.end), 0, 100),
    }))
    .filter((range) => range.end > range.start);

  // Internal gaps are shared equally by their neighbours. Endpoint gaps are
  // independent and therefore never shorten an endpoint unless configured.
  const gappedRanges = clippedRanges
    .map((item, index) => {
      const first = index === 0;
      const last = index === clippedRanges.length - 1;
      const start = clamp(item.start + (first ? config.endpointGap.start : config.gap / 2), 0, 100);
      const end = clamp(item.end - (last ? config.endpointGap.end : config.gap / 2), 0, 100);

      return {
        ...item,
        start,
        end,
      };
    })
    .filter((range) => range.end > range.start);

  // Dash arrays use pathLength="100". A complete 100-unit off-part prevents
  // the visible dash from repeating at the seam of a closed path.
  return gappedRanges.map((item, index) => {
    const first = index === 0;
    const last = index === gappedRanges.length - 1;
    const length = item.end - item.start;

    return {
      ...item.range,
      start: item.start,
      end: item.end,
      length,
      color: item.paint.color,
      width: item.paint.width,
      opacity: item.paint.opacity,
      transition: item.paint.transition,
      startCap: first ? config.linecap.start : 'butt',
      endCap: last ? config.linecap.end : 'butt',
      dash: {
        array: [length, 100],
        offset: item.start === 0 ? 0 : -item.start,
      },
    };
  });
}
