/**
 * Normalizes and validates one local FHS input_select configuration.
 *
 * The local entity mirrors Home Assistant select semantics: its state is one
 * configured option string and the complete option list is entity metadata.
 *
 * @param {object} entityConfig - Local FHS input_select configuration.
 * @returns {object} The normalized configuration.
 */
export function normalizeFhsInputSelectConfig(entityConfig) {
  if (!Array.isArray(entityConfig.options) || entityConfig.options.length === 0) {
    throw Error(`FHS input select '${entityConfig.entity}' options must be a non-empty array`);
  }
  if (entityConfig.options.some((option) => typeof option !== 'string' || option.trim().length === 0)) {
    throw Error(`FHS input select '${entityConfig.entity}' options must contain non-empty strings`);
  }
  if (new Set(entityConfig.options).size !== entityConfig.options.length) {
    throw Error(`FHS input select '${entityConfig.entity}' options must be unique`);
  }
  if (entityConfig.scope !== undefined && !['card', 'global'].includes(entityConfig.scope)) {
    throw Error(`FHS input select '${entityConfig.entity}' scope must be 'card' or 'global'`);
  }

  entityConfig.initial ??= entityConfig.options[0];
  if (!entityConfig.options.includes(entityConfig.initial)) {
    throw Error(`FHS input select '${entityConfig.entity}' initial must be one of its options`);
  }

  entityConfig.local = true;
  entityConfig.scope ??= 'card';
  entityConfig.persist ??= false;
  if (typeof entityConfig.persist !== 'boolean') {
    throw Error(`FHS input select '${entityConfig.entity}' persist must be a boolean`);
  }
  if (entityConfig.persist && entityConfig.scope !== 'global') {
    throw Error(`FHS input select '${entityConfig.entity}' can only persist with scope 'global'`);
  }
  entityConfig.name ??= entityConfig.entity.split('.', 2)[1];
  entityConfig.icon ??= 'mdi:form-dropdown';
  entityConfig.tap_action ??= { action: 'none' };

  return entityConfig;
}
