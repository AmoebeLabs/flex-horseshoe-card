import Merge from './merge.js';
import { fireEvent } from './frontend_mods/common/dom/fire_event.js';

const DEFAULT_TAP_ACTION = { action: 'more-info' };

/** Owns gesture selection, entity targeting and action execution. */
export default class CardActions {
  /**
   * Stores the card element and local input-entity service used by normalized
   * Home Assistant gesture actions.
   */
  constructor(element, inputEntities) {
    this.element = element;
    this.inputEntities = inputEntities;
    this.hass = undefined;
    this.resolvedEntityConfigs = undefined;
    this.entities = undefined;
  }

  /** Publishes current Home Assistant and entity data after every hass update. */
  setHassAndEntities(hass, resolvedEntityConfigs, entities) {
    this.hass = hass;
    this.resolvedEntityConfigs = resolvedEntityConfigs;
    this.entities = entities;
  }

  /** Selects one gesture and rejects more-info actions without a Home Assistant target. */
  getGestureConfig(itemConfig, entityIndex, actionProperty) {
    let gestureConfig = itemConfig?.[actionProperty];

    if (gestureConfig === undefined && entityIndex !== undefined) {
      const entityConfig = this.resolvedEntityConfigs[entityIndex];
      gestureConfig = entityConfig[actionProperty];

      if (gestureConfig === undefined && actionProperty === 'tap_action') {
        gestureConfig = DEFAULT_TAP_ACTION;
      }
    }

    if (gestureConfig === undefined) return undefined;

    const configuredActions = gestureConfig.actions ?? [gestureConfig];
    const hasInvalidMoreInfoTarget = configuredActions.some((actionConfig) => {
      if (actionConfig.action !== 'more-info') return false;

      if (actionConfig.entity !== undefined) {
        return actionConfig.entity.startsWith('fhs_');
      }

      if (entityIndex === undefined) return true;

      const entityConfig = this.resolvedEntityConfigs[entityIndex];
      const targetIndex = entityConfig.source_entity_index ?? entityIndex;
      return this.entities[targetIndex].entity_id.startsWith('fhs_');
    });

    return hasInvalidMoreInfoTarget ? undefined : gestureConfig;
  }

  /** Returns enabled gestures for the shared action-handler directive. */
  getActionHandlerOptions(itemConfig, entityIndex) {
    return {
      hasTap: this.getGestureConfig(itemConfig, entityIndex, 'tap_action') !== undefined,
      hasHold: this.getGestureConfig(itemConfig, entityIndex, 'hold_action') !== undefined,
      hasDoubleClick: this.getGestureConfig(itemConfig, entityIndex, 'double_tap_action') !== undefined,
    };
  }

  /** Resolves the HA entity target while preserving sparkline source routing. */
  getActionEntityId(entityIndex, actionConfig) {
    if (actionConfig.entity) return actionConfig.entity;
    if (entityIndex === undefined) return undefined;
    const entityConfig = this.resolvedEntityConfigs[entityIndex];
    const targetIndex = entityConfig.source_entity_index ?? entityIndex;
    return this.entities[targetIndex].entity_id;
  }

  /** Executes one normalized Home Assistant action or compatible FHS action. */
  async executeAction(actionConfig, entityId) {
    switch (actionConfig.action) {
      case 'select-option': {
        const entityDomain = entityId.split('.')[0];

        // The select control supplies one semantic option value. This action
        // router owns the standard service translation for compatible entities.
        switch (entityDomain) {
          case 'input_select':
          case 'select':
            await this.hass.callService(entityDomain, 'select_option', { option: actionConfig.option }, { entity_id: entityId });
            break;
          case 'fhs_input_select':
            this.inputEntities.setSelectOption(entityId, actionConfig.option);
            break;
          case 'input_number':
            await this.hass.callService('input_number', 'set_value', { value: actionConfig.option }, { entity_id: entityId });
            break;
          case 'fhs_input_number':
            this.inputEntities.setNumberValue(entityId, actionConfig.option);
            break;
          default:
            throw Error(`Select option action does not support entity domain '${entityDomain}'; configure a perform-action with option(value)`);
        }
        break;
      }
      case 'more-info':
        fireEvent(this.element, 'hass-more-info', { entityId: actionConfig.entity ?? entityId });
        break;
      case 'toggle': {
        const targetEntityId = actionConfig.entity ?? entityId;
        if (targetEntityId.startsWith('fhs_input_boolean.')) this.inputEntities.setBooleanState(targetEntityId, 'toggle');
        else await this.hass.callService('homeassistant', 'toggle', {}, { entity_id: targetEntityId });
        break;
      }
      case 'perform-action': {
        const [domain, service] = actionConfig.perform_action.split('.', 2);
        if (domain === 'fhs_input_number' && service === 'set_value') {
          this.inputEntities.setNumberValue(actionConfig.target.entity_id, actionConfig.data.value);
        } else if (domain === 'fhs_input_select' && service === 'select_option') {
          this.inputEntities.setSelectOption(actionConfig.target.entity_id, actionConfig.data.option);
        } else if (domain === 'fhs_input_number' && ['increment', 'decrement'].includes(service)) {
          this.inputEntities.changeNumberValue(actionConfig.target.entity_id, service === 'increment' ? 1 : -1);
        } else if (domain === 'fhs_input_boolean' && ['turn_on', 'turn_off', 'toggle'].includes(service)) {
          this.inputEntities.setBooleanState(actionConfig.target.entity_id, service);
        } else {
          await this.hass.callService(domain, service, actionConfig.data, actionConfig.target);
        }
        break;
      }
      case 'navigate':
        window.history[actionConfig.navigation_replace ? 'replaceState' : 'pushState'](null, '', actionConfig.navigation_path);
        fireEvent(window, 'location-changed', { replace: actionConfig.navigation_replace === true });
        break;
      case 'url':
        window.open(actionConfig.url_path, '_blank');
        break;
      case 'assist':
        fireEvent(this.element, 'hass-start-voice-assistant', {
          pipeline_id: actionConfig.pipeline_id,
          start_listening: actionConfig.start_listening,
        });
        break;
      case 'call-service': {
        const [domain, service] = actionConfig.service.split('.', 2);
        const targetEntityId = actionConfig.target?.entity_id ?? actionConfig.service_data?.entity_id;
        if (domain === 'fhs_input_number' && service === 'set_value') {
          this.inputEntities.setNumberValue(targetEntityId, actionConfig.service_data?.value);
        } else if (domain === 'fhs_input_select' && service === 'select_option') {
          this.inputEntities.setSelectOption(targetEntityId, actionConfig.service_data?.option);
        } else if (domain === 'fhs_input_number' && ['increment', 'decrement'].includes(service)) {
          this.inputEntities.changeNumberValue(targetEntityId, service === 'increment' ? 1 : -1);
        } else if (domain === 'fhs_input_boolean' && ['turn_on', 'turn_off', 'toggle'].includes(service)) {
          this.inputEntities.setBooleanState(targetEntityId, service);
        } else {
          await this.hass.callService(domain, service, actionConfig.service_data, actionConfig.target);
        }
        break;
      }
      case 'fire-dom-event':
        fireEvent(this.element, 'll-custom', actionConfig);
        break;
      case 'none':
      default:
        break;
    }
  }

  /** Inserts current slider values into one configured action and executes it. */
  async executeSliderAction(actionConfig, entityIndex, values, activeIndex) {
    const entityId = this.getActionEntityId(entityIndex, actionConfig);
    let executableAction;

    if (actionConfig.action === 'set-value') {
      const entityDomain = entityId.split('.')[0];
      executableAction = {
        action: 'perform-action',
        perform_action: `${entityDomain}.set_value`,
        target: { entity_id: entityId },
        data: { value: values[activeIndex] },
      };
    } else {
      executableAction = Merge.mergeDeep({}, actionConfig);

      if (executableAction.value_field !== undefined) {
        const valuePath = executableAction.value_field.split('.');
        let valueTarget = executableAction;
        valuePath.slice(0, -1).forEach((property) => {
          valueTarget = valueTarget[property];
        });
        valueTarget[valuePath[valuePath.length - 1]] = values[activeIndex];
        delete executableAction.value_field;
      }

      if (executableAction.value_fields !== undefined) {
        Object.entries(executableAction.value_fields).forEach(([valuePathString, valueName]) => {
          const valuePath = valuePathString.split('.');
          let valueTarget = executableAction;
          valuePath.slice(0, -1).forEach((property) => {
            valueTarget = valueTarget[property];
          });
          valueTarget[valuePath[valuePath.length - 1]] = values[valueName === 'lower' ? 0 : 1];
        });
        delete executableAction.value_fields;
      }
    }

    await this.executeAction(executableAction, entityId);
  }

  /** Executes the selected tap, hold, or double-tap config for one item. */
  async handleAction(event, itemConfig, entityIndex) {
    event.stopPropagation();
    const actionProperty = event.detail.action === 'double_tap' ? 'double_tap_action' : `${event.detail.action}_action`;
    const gestureConfig = this.getGestureConfig(itemConfig, entityIndex, actionProperty);
    const entityId = this.getActionEntityId(entityIndex, gestureConfig);
    const actions = gestureConfig.actions ?? [gestureConfig];

    if (gestureConfig.haptic) fireEvent(this.element, 'haptic', gestureConfig.haptic);
    await actions.reduce((previousAction, configuredAction) => previousAction.then(() => this.executeAction(configuredAction, entityId)), Promise.resolve());
  }
}
