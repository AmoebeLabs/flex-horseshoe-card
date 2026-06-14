export const DEFAULT_STATE_ANIMATION = {
  enabled: true,
  duration: 2500,
  easing: 'ease-out',
  debug: false,
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export function createValueAnimatorState() {
  return {
    frame: undefined,
    startTime: undefined,
    fromValue: undefined,
    toValue: undefined,
    animating: false,
  };
}

export function getStateAnimationConfig(runtimeConfig) {
  return {
    ...DEFAULT_STATE_ANIMATION,
    ...(runtimeConfig?.horseshoe_state?.animation ?? {}),
  };
}

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

export function stopValueAnimation(animatorState) {
  if (animatorState.frame) {
    cancelAnimationFrame(animatorState.frame);
  }

  animatorState.frame = undefined;
  animatorState.startTime = undefined;
  animatorState.animating = false;
}

export function startValueAnimation(animatorState, animationConfig, animation, callbacks = {}) {
  const fromValue = Number(animation.fromValue);
  const toValue = Number(animation.toValue);
  const onUpdate = callbacks.onUpdate;
  const onComplete = callbacks.onComplete;

  if (animationConfig.enabled === false) {
    if (onUpdate) {
      onUpdate(toValue);
    }

    if (onComplete) {
      onComplete(toValue);
    }

    return;
  }

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

  const runFrame = (timestamp) => {
    if (!animatorState.startTime) {
      animatorState.startTime = timestamp;
    }

    const duration = Number(animationConfig.duration ?? DEFAULT_STATE_ANIMATION.duration);
    const elapsed = timestamp - animatorState.startTime;
    const progress = duration <= 0 ? 1 : clamp(elapsed / duration, 0, 1);
    const easedProgress = getAnimationProgress(progress, animationConfig.easing);
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
