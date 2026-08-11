import ConfigHelper from './config-helper.js';
import { DEFINITION_SHAPE_SECTIONS, VISIBLE_LAYOUT_SECTIONS } from './layout-sections.js';

/** Owns validation and compilation of user-facing card configuration. */
export default class CardConfig {
  constructor(templates) {
    this.templates = templates;
  }

  /** Assigns stable string ids to every visible and definition item. */
  assignLayoutItemIds(config) {
    const assignIds = (items) => items.map((item, index) => ({ ...item, id: String(item.id ?? index) }));
    config.layout.groups ??= [];
    config.layout.groups = assignIds(config.layout.groups);

    if (Array.isArray(config.layout.compounds)) {
      config.layout.compounds = assignIds(config.layout.compounds);
      config.layout.compounds.forEach((compound) => {
        VISIBLE_LAYOUT_SECTIONS.forEach((section) => {
          if (Array.isArray(compound[section])) compound[section] = assignIds(compound[section]);
        });
      });
    }

    VISIBLE_LAYOUT_SECTIONS.forEach((section) => {
      if (Array.isArray(config.layout[section])) config.layout[section] = assignIds(config.layout[section]);
    });

    [config.layout.clips, config.layout.masks].forEach((definitions) => {
      if (!definitions) return;
      Object.values(definitions).forEach((definition) => {
        DEFINITION_SHAPE_SECTIONS.forEach((section) => {
          if (Array.isArray(definition[section])) definition[section] = assignIds(definition[section]);
        });
      });
    });
  }

  /** Removes statically disabled visible layout items after inheritance. */
  removeDisabledLayoutItems(config) {
    VISIBLE_LAYOUT_SECTIONS.forEach((section) => {
      const items = config.layout[section];
      if (!Array.isArray(items)) return;
      config.layout[section] = items.filter((item) => item.disabled === undefined || !ConfigHelper.isDisabled(item, item.disabled, section, this.templates));
    });
  }

  /** Removes disabled entities before named slots are built. */
  removeDisabledEntityConfigs(config) {
    config.entities = config.entities
      .map((entityConfig, index) => {
        if (entityConfig.disabled === undefined) return entityConfig;
        const item = { ...entityConfig, entity_index: index };
        return {
          ...entityConfig,
          disabled: ConfigHelper.isDisabled(item, entityConfig.disabled, 'entities', this.templates),
        };
      })
      .filter((entityConfig) => entityConfig.disabled !== true);
  }

  /** Records JavaScript-template metadata and returns the card-level flag. */
  detectJavascriptTemplates(config) {
    let cardHasJavascript = false;

    config.entities.forEach((entityConfig) => {
      if (this.templates.detectJavascriptTemplates(entityConfig)) cardHasJavascript = true;
    });
    VISIBLE_LAYOUT_SECTIONS.forEach((section) => {
      const items = config.layout[section];
      if (!Array.isArray(items)) return;
      items.forEach((item) => {
        if (this.templates.detectJavascriptTemplates(item)) cardHasJavascript = true;
      });
    });
    config.layout.groups.forEach((group) => {
      if (this.templates.detectJavascriptTemplates(group)) cardHasJavascript = true;
    });
    if (config.animations) {
      Object.values(config.animations).forEach((animationItems) => {
        animationItems.forEach((animationItem) => {
          if (this.templates.detectJavascriptTemplates(animationItem)) cardHasJavascript = true;
        });
      });
    }
    if (config.styles && this.templates.detectJavascriptTemplates(config.styles)) cardHasJavascript = true;
    return cardHasJavascript;
  }

  /** Builds named slots for the final flat configured entity list. */
  buildEntitySlots(entityConfigs) {
    const entitySlots = { flat: [], default: [] };
    let activeSlot = 'default';

    entityConfigs.forEach((entityConfig, index) => {
      if (entityConfig.slot !== undefined) {
        if (typeof entityConfig.slot !== 'string' || !/^[A-Za-z_][A-Za-z0-9_]*$/.test(entityConfig.slot)) {
          throw new Error(`[entities] Invalid slot ${entityConfig.slot} at index ${index}`);
        }
        if (entityConfig.slot === 'flat') throw new Error('[entities] Slot name flat is reserved');
        activeSlot = entityConfig.slot;
      }

      entityConfig.slot = activeSlot;
      entitySlots[activeSlot] ??= [];
      entitySlots[activeSlot].push(index);
      entitySlots.flat.push(index);
    });

    return entitySlots;
  }

  /** Converts entity_index values to symbolic addresses before inheritance. */
  normalizeEntityIndexAddresses(config) {
    const normalizeValue = (value) => {
      if (typeof value === 'number') return { type: 'entity_address', slot: 'flat', index: value };
      if (typeof value === 'string') {
        const slotMatch = value.match(/^([A-Za-z_][A-Za-z0-9_]*)\[(\d+)\]$/);
        if (slotMatch) return { type: 'entity_address', slot: slotMatch[1], index: Number(slotMatch[2]) };
      }
      throw new Error(`[layout] Invalid entity_index ${value}. Use a number or slot[index]`);
    };

    const visit = (value) => {
      if (Array.isArray(value)) {
        value.forEach((entry) => visit(entry));
        return;
      }
      if (!value || typeof value !== 'object') return;

      Object.entries(value).forEach(([key, entryValue]) => {
        if (key === 'entity_index' && entryValue !== undefined) {
          value[key] = normalizeValue(entryValue);
          return;
        }
        visit(entryValue);
      });
    };

    visit(config.layout);
  }

  /** Flattens symbolic entity addresses after inheritance is complete. */
  flattenEntitySlotIndexes(config, entitySlots) {
    const visit = (value) => {
      if (Array.isArray(value)) {
        value.forEach((entry) => visit(entry));
        return;
      }
      if (!value || typeof value !== 'object') return;

      Object.entries(value).forEach(([key, entryValue]) => {
        if (key === 'entity_index' && entryValue?.type === 'entity_address') {
          const slot = entitySlots[entryValue.slot];
          if (slot === undefined) throw new Error(`[layout] Unknown entity slot ${entryValue.slot}`);
          if (entryValue.index >= slot.length) throw new Error(`[layout] Entity slot ${entryValue.slot} has no index ${entryValue.index}`);
          value[key] = slot[entryValue.index];
          return;
        }
        visit(entryValue);
      });
    };

    visit(config.layout);
  }

  /** Validates every configured tap, hold and double-tap action. */
  validateActionConfigs(config) {
    const gestureProperties = ['tap_action', 'hold_action', 'double_tap_action'];
    const validActions = [
      'none',
      'more-info',
      'toggle',
      'perform-action',
      'call-service',
      'navigate',
      'url',
      'assist',
      'fire-dom-event',
      'increment',
      'decrement',
      'select-option',
    ];

    const visit = (value, configPath) => {
      if (Array.isArray(value)) {
        value.forEach((entry, index) => visit(entry, `${configPath}[${index}]`));
        return;
      }
      if (!value || typeof value !== 'object') return;

      Object.entries(value).forEach(([property, propertyValue]) => {
        const propertyPath = configPath ? `${configPath}.${property}` : property;
        if (property === 'double_tap') throw Error(`[actions] Invalid '${propertyPath}'; use 'double_tap_action'`);

        if (gestureProperties.includes(property)) {
          const configuredActions = propertyValue.actions ?? [propertyValue];
          configuredActions.forEach((actionConfig, actionIndex) => {
            const actionPath = propertyValue.actions ? `${propertyPath}.actions[${actionIndex}].action` : `${propertyPath}.action`;
            if (!this.templates.hasJavascriptTemplates(actionConfig.action) && !validActions.includes(actionConfig.action)) {
              throw Error(`[actions] Invalid action '${actionConfig.action}' at '${actionPath}'`);
            }
          });
        }

        visit(propertyValue, propertyPath);
      });
    };

    visit(config, '');
  }
}
