import { clamp } from './frontend_mods/common/number/clamp.ts';

const PATH_ANIMATION_EASING = {
  linear: (progress) => progress,
  'ease-in': (progress) => progress ** 3,
  'ease-out': (progress) => 1 - (1 - progress) ** 3,
  'ease-in-out': (progress) => progress < 0.5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2,
};

/**
 * Animates normalized state progress inside one explicitly bound state layer.
 * The gauge supplies the state updater after the master path has been measured.
 * Each transition owns its scheduled frames until it completes or is replaced.
 */
export default class PathStateAnimator {
  /**
   * Stores the timing, frame scheduler, and state-layer callbacks.
   *
   * @param {object} config - Validated timing, scheduler, and state-layer update callbacks.
   */
  constructor(config) {
    this.animation = config.animation;
    this.requestFrame = config.requestFrame;
    this.cancelFrame = config.cancelFrame;
    this.updateStateLayer = config.updateStateLayer;
    this.onComplete = config.onComplete;
    this.currentProgress = config.initialProgress;
    this.stateLayerElement = undefined;
    this.frame = undefined;
    this.startTime = undefined;
    this.fromProgress = config.initialProgress;
    this.toProgress = config.initialProgress;
    this.animating = false;
    this.animationNumber = 0;
  }

  /**
   * Binds the mutable state-layer mount and paints its current progress. Static
   * siblings remain owned by the normal renderer and are never passed here.
   *
   * @param {Element} stateLayerElement - Dedicated DOM mount for state-dependent path output.
   */
  bindStateLayer(stateLayerElement) {
    const continueTransition = this.animating && this.stateLayerElement !== stateLayerElement;
    const targetProgress = this.toProgress;
    if (continueTransition) this.stopAnimation();

    this.stateLayerElement = stateLayerElement;
    const animationNumber = this.animationNumber;
    this.updateStateLayer(this.stateLayerElement, this.currentProgress);

    // A replacement mount starts at the visible position and takes over the
    // remaining transition. Binding the same mount keeps its existing timing.
    if (continueTransition && this.animationNumber === animationNumber) {
      this.animateTo(targetProgress);
    }
  }

  /** Ends animation and releases its DOM mount while retaining progress. */
  unbindStateLayer() {
    this.stopAnimation();
    this.stateLayerElement = undefined;
  }

  /**
   * Replaces any active transition and animates from the currently displayed
   * progress, preventing an interrupted update from jumping back to its old source.
   *
   * @param {number} targetProgress - Validated normalized target in 0..100 path space.
   */
  animateTo(targetProgress) {
    // Home Assistant can deliver the same value again while its visual
    // transition is running. Keep moving toward that existing target.
    if (this.animating && this.toProgress === targetProgress) return;

    this.animationNumber += 1;
    const animationNumber = this.animationNumber;

    if (this.frame !== undefined) {
      this.cancelFrame(this.frame);
    }

    this.frame = undefined;
    this.startTime = undefined;
    this.fromProgress = this.currentProgress;
    this.toProgress = targetProgress;

    if (!this.animation.enabled) {
      this.currentProgress = this.toProgress;
      this.animating = false;
      this.updateStateLayer(this.stateLayerElement, this.currentProgress);
      if (this.animationNumber === animationNumber) this.onComplete(this.currentProgress);
      return;
    }

    this.animating = true;
    const easing = PATH_ANIMATION_EASING[this.animation.easing];

    // Progress drives the state paint and marker together along the measured
    // path. Replaced transitions relinquish their frame and completion work.
    const updateAnimationFrame = (timestamp) => {
      if (this.animationNumber !== animationNumber) return;
      this.frame = undefined;
      if (this.startTime === undefined) {
        this.startTime = timestamp;
      }

      const elapsed = timestamp - this.startTime;
      const linearProgress = clamp(elapsed / this.animation.duration, 0, 1);
      const easedProgress = easing(linearProgress);
      this.currentProgress = this.fromProgress + (this.toProgress - this.fromProgress) * easedProgress;
      this.updateStateLayer(this.stateLayerElement, this.currentProgress);

      // Painting can close the gauge or start another transition. Only the
      // transition that still owns the mount may schedule its next frame.
      if (this.animationNumber !== animationNumber) return;

      if (linearProgress < 1) {
        this.frame = this.requestFrame(updateAnimationFrame);
        return;
      }

      this.frame = undefined;
      this.startTime = undefined;
      this.animating = false;
      this.onComplete(this.toProgress);
    };

    this.frame = this.requestFrame(updateAnimationFrame);
  }

  /**
   * Cancels pending frame work while retaining the currently displayed progress.
   * A later target therefore continues from the visible state.
   */
  stopAnimation() {
    this.animationNumber += 1;
    if (this.frame !== undefined) {
      this.cancelFrame(this.frame);
    }

    this.frame = undefined;
    this.startTime = undefined;
    this.animating = false;
  }
}
