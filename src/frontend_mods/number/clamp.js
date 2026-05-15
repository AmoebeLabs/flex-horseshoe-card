export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

// Variant that only applies the clamping to a border if the border is defined
export const conditionalClamp = (value, min, max) => {
  let result;
  result = min ? Math.max(value, min) : value;
  result = max ? Math.min(result, max) : result;
  return result;
};
