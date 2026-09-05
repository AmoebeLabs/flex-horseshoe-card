import { clamp } from './frontend_mods/common/number/clamp.ts';

const PATH_ANIMATION_EASING = {
  linear: (progress) => progress,
  'ease-in': (progress) => progress ** 3,
  'ease-out': (progress) => 1 - (1 - progress) ** 3,
  'ease-in-out': (progress) => progress < 0.5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2,
};

/**
 * Animates normalized state progress inside one explicitly bound state layer.
 * Geometry and static visual layers are deliberately absent from this contract:
 * the adapter supplies one targeted state updater after the master path has
 * already been generated, rendered, bound, and measured.
 */
export default class PathStateAnimator {
  /**
   * Stores the complete internal animation contract.
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
  }

  /**
   * Binds the mutable state-layer mount and paints its current progress. Static
   * siblings remain owned by the normal renderer and are never passed here.
   *
   * @param {Element} stateLayerElement - Dedicated DOM mount for state-dependent path output.
   */
  bindStateLayer(stateLayerElement) {
    this.stateLayerElement = stateLayerElement;
    this.updateStateLayer(this.stateLayerElement, this.currentProgress);
  }

  /**
   * Replaces any active transition and animates from the currently displayed
   * progress, preventing an interrupted update from jumping back to its old source.
   *
   * @param {number} targetProgress - Validated normalized target in 0..100 path space.
   */
  animateTo(targetProgress) {
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
      this.onComplete(this.currentProgress);
      return;
    }

    this.animating = true;
    const easing = PATH_ANIMATION_EASING[this.animation.easing];

    // Only normalized progress changes per frame. The bound updater decides
    // whether that means one dash change, segment visibility, or a state-only
    // gradient rerender; it cannot invalidate the master geometry lifecycle.
    const updateAnimationFrame = (timestamp) => {
      if (this.startTime === undefined) {
        this.startTime = timestamp;
      }

      const elapsed = timestamp - this.startTime;
      const linearProgress = clamp(elapsed / this.animation.duration, 0, 1);
      const easedProgress = easing(linearProgress);
      this.currentProgress = this.fromProgress + (this.toProgress - this.fromProgress) * easedProgress;
      this.updateStateLayer(this.stateLayerElement, this.currentProgress);

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
    if (this.frame !== undefined) {
      this.cancelFrame(this.frame);
    }

    this.frame = undefined;
    this.startTime = undefined;
    this.animating = false;
  }
}
