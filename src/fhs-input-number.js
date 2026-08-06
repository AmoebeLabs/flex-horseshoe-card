/**
 * Normalizes and validates one local FHS input_number configuration.
 *
 * The card uses this configuration layer to keep existing inputs compatible
 * while exposing Home Assistant-like numeric bounds and step metadata.
 *
 * @param {object} entityConfig - Local FHS input_number configuration.
 * @returns {object} The normalized configuration.
 */
export function normalizeFhsInputNumberConfig(entityConfig) {
  if (!Number.isFinite(Number(entityConfig.initial))) {
    throw Error(`FHS input number '${entityConfig.entity}' requires a numeric initial value`);
  }
  if (entityConfig.scope !== undefined && !['card', 'global'].includes(entityConfig.scope)) {
    throw Error(`FHS input number '${entityConfig.entity}' scope must be 'card' or 'global'`);
  }

  entityConfig.local = true;
  entityConfig.scope ??= 'card';
  entityConfig.persist ??= false;
  entityConfig.step ??= 1;
  if (!Number.isFinite(Number(entityConfig.step)) || Number(entityConfig.step) <= 0) {
    throw Error(`FHS input number '${entityConfig.entity}' step must be a positive number`);
  }
  if (entityConfig.min !== undefined && !Number.isFinite(Number(entityConfig.min))) {
    throw Error(`FHS input number '${entityConfig.entity}' min must be numeric`);
  }
  if (entityConfig.max !== undefined && !Number.isFinite(Number(entityConfig.max))) {
    throw Error(`FHS input number '${entityConfig.entity}' max must be numeric`);
  }
  if (entityConfig.min !== undefined && entityConfig.max !== undefined && Number(entityConfig.min) >= Number(entityConfig.max)) {
    throw Error(`FHS input number '${entityConfig.entity}' min must be lower than max`);
  }
  if (entityConfig.min !== undefined && Number(entityConfig.initial) < Number(entityConfig.min)) {
    throw Error(`FHS input number '${entityConfig.entity}' initial must not be lower than min`);
  }
  if (entityConfig.max !== undefined && Number(entityConfig.initial) > Number(entityConfig.max)) {
    throw Error(`FHS input number '${entityConfig.entity}' initial must not be higher than max`);
  }
  if (typeof entityConfig.persist !== 'boolean') {
    throw Error(`FHS input number '${entityConfig.entity}' persist must be a boolean`);
  }
  if (entityConfig.persist && entityConfig.scope !== 'global') {
    throw Error(`FHS input number '${entityConfig.entity}' can only persist with scope 'global'`);
  }
  entityConfig.name ??= entityConfig.entity.split('.', 2)[1];
  entityConfig.unit ??= '';
  entityConfig.decimals ??= 0;
  entityConfig.tap_action ??= { action: 'none' };

  return entityConfig;
}

/**
 * Applies optional numeric bounds to a local FHS input_number value.
 *
 * @param {object} entityConfig - Normalized local FHS input_number configuration.
 * @param {number|string} value - Candidate numeric value.
 * @returns {number} Bounded numeric value.
 */
export function clampFhsInputNumberValue(entityConfig, value) {
  let numericValue = Number(value);
  if (entityConfig.min !== undefined) numericValue = Math.max(Number(entityConfig.min), numericValue);
  if (entityConfig.max !== undefined) numericValue = Math.min(Number(entityConfig.max), numericValue);
  return numericValue;
}

/**
 * Calculates one increment or decrement using the configured step.
 *
 * @param {object} entityConfig - Normalized local FHS input_number configuration.
 * @param {number|string} currentValue - Current numeric state.
 * @param {number} direction - Positive one for increment, negative one for decrement.
 * @returns {number} Next bounded numeric value.
 */
export function calculateFhsInputNumberNextValue(entityConfig, currentValue, direction) {
  return clampFhsInputNumberValue(entityConfig, Number(currentValue) + (Number(entityConfig.step) * direction));
}
