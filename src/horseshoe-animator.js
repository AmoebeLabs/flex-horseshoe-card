import { clamp } from './frontend_mods/common/number/clamp.ts';

/**
 * Default state animation settings used when the horseshoe state has no override.
 */
export const DEFAULT_STATE_ANIMATION = {
  enabled: true,
  duration: 2500,
  easing: 'ease-out',
  debug: false,
};

/**
 * Creates the mutable state object used by requestAnimationFrame value animations.
 *
 * @returns {object} Animation state tracked between frames.
 */
export function createValueAnimatorState() {
  return {
    frame: undefined,
    startTime: undefined,
    fromValue: undefined,
    toValue: undefined,
    animating: false,
  };
}

/**
 * Merges runtime animation config with the default animation settings.
 *
 * @param {object} runtimeConfig - Normalized horseshoe runtime configuration.
 * @returns {object} Effective state animation configuration.
 */
export function getStateAnimationConfig(runtimeConfig) {
  return {
    ...DEFAULT_STATE_ANIMATION,
    ...(runtimeConfig?.horseshoe_state?.animation ?? {}),
  };
}

/**
 * Maps linear progress to the configured easing curve.
 *
 * @param {number} progress - Linear animation progress from 0 to 1.
 * @param {string} easing - Easing name from the runtime configuration.
 * @returns {number} Eased progress from 0 to 1.
 */
export function getAnimationProgress(progress, easing) {
  if (easing === 'linear') {
    return progress;
  }

  if (easing === 'ease-in') {
    return progress ** 3;
  }

  if (easing === 'ease-in-out') {
    return progress < 0.5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2;
  }

  return 1 - (1 - progress) ** 3;
}

/**
 * Cancels any active animation frame and resets frame-specific animator state.
 *
 * @param {object} animatorState - Mutable animation state created by createValueAnimatorState.
 */
export function stopValueAnimation(animatorState) {
  if (animatorState.frame) {
    cancelAnimationFrame(animatorState.frame);
  }

  animatorState.frame = undefined;
  animatorState.startTime = undefined;
  animatorState.animating = false;
}

/**
 * Starts a value interpolation animation and reports frame updates through callbacks.
 *
 * @param {object} animatorState - Mutable animation state for the current gauge.
 * @param {object} animationConfig - Effective animation configuration.
 * @param {object} animation - From/to value payload for this animation run.
 * @param {object} callbacks - Optional update and completion callbacks.
 */
export function startValueAnimation(animatorState, animationConfig, animation, callbacks = {}) {
  const fromValue = Number(animation.fromValue);
  const toValue = Number(animation.toValue);
  const onUpdate = callbacks.onUpdate;
  const onComplete = callbacks.onComplete;

  // Disabled animation still pushes the final value through the normal callbacks.
  if (animationConfig.enabled === false) {
    if (onUpdate) {
      onUpdate(toValue);
    }

    if (onComplete) {
      onComplete(toValue);
    }

    return;
  }

  // Cancel any in-flight frame before replacing the animation target.
  stopValueAnimation(animatorState);

  animatorState.fromValue = fromValue;
  animatorState.toValue = toValue;
  animatorState.startTime = undefined;
  animatorState.animating = true;

  if (animationConfig.debug) {
    console.log('[horseshoe animation] start', {
      fromValue: animatorState.fromValue,
      toValue: animatorState.toValue,
    });
  }

  // requestAnimationFrame supplies timestamps; the first frame establishes the baseline.
  const runFrame = (timestamp) => {
    if (!animatorState.startTime) {
      animatorState.startTime = timestamp;
    }

    const duration = Number(animationConfig.duration ?? DEFAULT_STATE_ANIMATION.duration);
    const elapsed = timestamp - animatorState.startTime;
    const progress = duration <= 0 ? 1 : clamp(elapsed / duration, 0, 1);
    const easedProgress = getAnimationProgress(progress, animationConfig.easing);
    // Interpolate only the displayed value; the raw state remains unchanged until completion.
    const displayValue = animatorState.fromValue + (animatorState.toValue - animatorState.fromValue) * easedProgress;

    if (onUpdate) {
      onUpdate(displayValue);
    }

    if (progress < 1) {
      animatorState.frame = requestAnimationFrame((nextTimestamp) => runFrame(nextTimestamp));
      return;
    }

    animatorState.frame = undefined;
    animatorState.startTime = undefined;
    animatorState.animating = false;

    if (onComplete) {
      onComplete(animatorState.toValue);
    }

    if (animationConfig.debug) {
      console.log('[horseshoe animation] end', {
        value: animatorState.toValue,
      });
    }
  };

  animatorState.frame = requestAnimationFrame((timestamp) => runFrame(timestamp));
}
