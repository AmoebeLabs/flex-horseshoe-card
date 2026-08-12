import { fireEvent } from './frontend_mods/common/dom/fire_event.js';
import { normalizeFhsInputNumberConfig, clampFhsInputNumberValue, calculateFhsInputNumberNextValue } from './fhs-input-number.js';

/**
 * Owns local FHS input configuration, shared storage, events and state changes.
 */
export default class CardInputEntities {
  static numbers = new Map();

  static booleans = new Map();

  static numberEvent = 'flex-horseshoe-card:fhs-input-number-changed';

  static booleanEvent = 'flex-horseshoe-card:fhs-input-boolean-changed';

  static numberStoragePrefix = 'flex-horseshoe-card:fhs-input-number';

  static booleanStoragePrefix = 'flex-horseshoe-card:fhs-input-boolean';

  /**
   * @param {string} cardId Unique card identifier used in debug output.
   * @param {Array<object>} entities Card-owned entity state array.
   * @param {Function} updateCard Enters the normal card hass update pipeline.
   */
  constructor(cardId, entities, updateCard) {
    this.cardId = cardId;
    this.entities = entities;
    this.updateCard = updateCard;
    this.config = undefined;
    this.stateChanged = false;

    // Global inputs notify every card. A card accepts only entities configured
    // in that card with global scope.
    this.eventHandler = (event) => {
      const matchingConfig = this.config.entities.find((entityConfig) => entityConfig.entity === event.detail.entity_id && entityConfig.scope === 'global');

      if (this.config.dev.debug) {
        console.log('[FHS global input event]', {
          cardId: this.cardId,
          entityId: event.detail.entity_id,
          state: event.detail.state,
          matched: matchingConfig !== undefined,
        });
      }

      if (matchingConfig?.entity.startsWith('fhs_input_boolean.')) {
        this.replaceEntityState(event.detail.entity_id, event.detail);
      } else if (matchingConfig) {
        this.replaceEntityState(event.detail.entity_id, event.detail);
      }
    };
  }

  /** Validates and completes local input definitions during setConfig. */
  validateConfig(config) {
    this.config = config;

    config.entities.forEach((entityConfig) => {
      if (entityConfig.entity.startsWith('fhs_input_number.')) {
        normalizeFhsInputNumberConfig(entityConfig);
        return;
      }
      if (!entityConfig.entity.startsWith('fhs_input_boolean.')) return;

      if (entityConfig.initial === undefined) entityConfig.initial = false;
      if (typeof entityConfig.initial !== 'boolean') throw Error(`FHS input boolean '${entityConfig.entity}' initial must be a boolean`);
      if (entityConfig.scope !== undefined && !['card', 'global'].includes(entityConfig.scope)) {
        throw Error(`FHS input boolean '${entityConfig.entity}' scope must be 'card' or 'global'`);
      }

      entityConfig.local = true;
      entityConfig.scope ??= 'card';
      entityConfig.persist ??= false;
      if (typeof entityConfig.persist !== 'boolean') throw Error(`FHS input boolean '${entityConfig.entity}' persist must be a boolean`);
      if (entityConfig.persist && entityConfig.scope !== 'global') {
        throw Error(`FHS input boolean '${entityConfig.entity}' can only persist with scope 'global'`);
      }
      entityConfig.name ??= entityConfig.entity.split('.', 2)[1];
      entityConfig.icon ??= 'mdi:toggle-switch';
      entityConfig.tap_action ??= { action: 'none' };
    });
  }

  /** Creates local entity state records before the first Home Assistant pass. */
  initializeEntities(entityConfigs) {
    entityConfigs.forEach((entityConfig, index) => {
      if (entityConfig.entity.startsWith('fhs_input_number.')) {
        this.initializeNumberEntity(entityConfig, index);
      } else if (entityConfig.entity.startsWith('fhs_input_boolean.')) {
        this.initializeBooleanEntity(entityConfig, index);
      }
    });
  }

  /** Creates one local number state record, including global persistence. */
  initializeNumberEntity(entityConfig, index) {
    const timestamp = new Date().toISOString();
    let stateRecord = {
      entity_id: entityConfig.entity,
      state: String(Number(entityConfig.initial)),
      last_changed: timestamp,
      last_updated: timestamp,
    };

    if (entityConfig.scope === 'global') {
      if (!CardInputEntities.numbers.has(entityConfig.entity)) {
        if (entityConfig.persist) {
          const storageKey = `${CardInputEntities.numberStoragePrefix}:${entityConfig.entity}`;
          const storedStateRecord = localStorage.getItem(storageKey);
          if (storedStateRecord !== null) stateRecord = JSON.parse(storedStateRecord);
        }
        CardInputEntities.numbers.set(entityConfig.entity, stateRecord);
      }
      stateRecord = CardInputEntities.numbers.get(entityConfig.entity);
    }

    this.entities[index] = {
      ...stateRecord,
      attributes: {
        friendly_name: entityConfig.name,
        icon: entityConfig.icon,
        unit_of_measurement: entityConfig.unit,
        ...(entityConfig.min !== undefined ? { min: entityConfig.min } : {}),
        ...(entityConfig.max !== undefined ? { max: entityConfig.max } : {}),
        step: entityConfig.step,
      },
      context: { id: null, parent_id: null, user_id: null },
    };
  }

  /** Creates one local boolean state record, including global persistence. */
  initializeBooleanEntity(entityConfig, index) {
    const timestamp = new Date().toISOString();
    let stateRecord = {
      entity_id: entityConfig.entity,
      state: entityConfig.initial ? 'on' : 'off',
      last_changed: timestamp,
      last_updated: timestamp,
    };

    if (entityConfig.scope === 'global') {
      if (!CardInputEntities.booleans.has(entityConfig.entity)) {
        if (entityConfig.persist) {
          const storageKey = `${CardInputEntities.booleanStoragePrefix}:${entityConfig.entity}`;
          const storedStateRecord = localStorage.getItem(storageKey);
          if (storedStateRecord !== null) stateRecord = JSON.parse(storedStateRecord);
        }
        CardInputEntities.booleans.set(entityConfig.entity, stateRecord);
      }
      stateRecord = CardInputEntities.booleans.get(entityConfig.entity);
    }

    this.entities[index] = {
      ...stateRecord,
      attributes: { friendly_name: entityConfig.name, icon: entityConfig.icon },
      context: { id: null, parent_id: null, user_id: null },
    };
  }

  /**
   * Listens for global FHS input changes while this card is in the DOM.
   *
   * Global FHS inputs publish their state through window events. This card
   * updates its local entity record through the normal hass pipeline.
   */
  connected() {
    window.addEventListener(CardInputEntities.numberEvent, this.eventHandler);
    window.addEventListener(CardInputEntities.booleanEvent, this.eventHandler);
  }

  /**
   * Stops global input delivery while the card is detached.
   *
   * Removing the exact constructor-owned handler makes the window subscription
   * follow this card instance's Lit connection lifecycle.
   */
  disconnected() {
    window.removeEventListener(CardInputEntities.numberEvent, this.eventHandler);
    window.removeEventListener(CardInputEntities.booleanEvent, this.eventHandler);
  }

  /** Clears the mutation marker after the card completed its update. */
  markStateHandled() {
    this.stateChanged = false;
  }

  /** Applies the local equivalent of input_number.set_value. */
  setNumberValue(entityId, value) {
    const entityConfig = this.config.entities.find((config) => config.entity === entityId);
    const numericValue = clampFhsInputNumberValue(entityConfig, value);
    const timestamp = new Date().toISOString();
    const stateRecord = { entity_id: entityId, state: String(numericValue), last_changed: timestamp, last_updated: timestamp };

    if (entityConfig.scope === 'global') {
      CardInputEntities.numbers.set(entityId, stateRecord);
      if (entityConfig.persist) {
        const storageKey = `${CardInputEntities.numberStoragePrefix}:${entityId}`;
        localStorage.setItem(storageKey, JSON.stringify(stateRecord));
      }
      fireEvent(window, CardInputEntities.numberEvent, stateRecord);
      return;
    }

    this.replaceEntityState(entityId, stateRecord);
  }

  /** Applies the local equivalent of input_number.increment or decrement. */
  changeNumberValue(entityId, direction) {
    const entityConfig = this.config.entities.find((config) => config.entity === entityId);
    const entityIndex = this.config.entities.indexOf(entityConfig);
    const currentValue = entityConfig.scope === 'global' ? Number(CardInputEntities.numbers.get(entityId).state) : Number(this.entities[entityIndex].state);
    const nextValue = calculateFhsInputNumberNextValue(entityConfig, currentValue, direction);

    this.setNumberValue(entityId, nextValue);
  }

  /** Applies input_boolean.turn_on, turn_off, or toggle locally. */
  setBooleanState(entityId, service) {
    const entityConfig = this.config.entities.find((config) => config.entity === entityId);
    const entityIndex = this.config.entities.indexOf(entityConfig);
    const currentState = entityConfig.scope === 'global' ? CardInputEntities.booleans.get(entityId).state : this.entities[entityIndex].state;
    const nextState = service === 'toggle' ? (currentState === 'on' ? 'off' : 'on') : service === 'turn_on' ? 'on' : 'off';
    const timestamp = new Date().toISOString();
    const stateRecord = { entity_id: entityId, state: nextState, last_changed: timestamp, last_updated: timestamp };

    if (entityConfig.scope === 'global') {
      CardInputEntities.booleans.set(entityId, stateRecord);
      if (entityConfig.persist) {
        const storageKey = `${CardInputEntities.booleanStoragePrefix}:${entityId}`;
        localStorage.setItem(storageKey, JSON.stringify(stateRecord));
      }
      fireEvent(window, CardInputEntities.booleanEvent, stateRecord);
      return;
    }

    this.replaceEntityState(entityId, stateRecord);
  }

  /** Replaces one card-local state while retaining validated metadata. */
  replaceEntityState(entityId, stateRecord) {
    this.config.entities.forEach((entityConfig, index) => {
      if (entityConfig.entity !== entityId) return;
      this.entities[index] = {
        ...this.entities[index],
        state: stateRecord.state,
        last_changed: stateRecord.last_changed,
        last_updated: stateRecord.last_updated,
      };
    });

    this.stateChanged = true;
    this.updateCard();
  }
}
