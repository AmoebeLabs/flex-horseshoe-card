import ConfigHelper from './config-helper.js';
import { DEFINITION_SHAPE_SECTIONS, VISIBLE_LAYOUT_SECTIONS } from './layout-sections.js';
import Merge from './merge.js';
import SameAs from './same-as.js';
import { DEFAULT_ZPOS } from './const.js';

/** Owns validation and compilation of user-facing card configuration. */
export default class CardConfig {
  constructor(templates) {
    this.templates = templates;
  }

  /** Expands constants, deep-cloned ref() values and static calc() expressions. */
  compileStaticValues(config) {
    const isCalcExpression = (value) => typeof value === 'string' && value.startsWith('calc(') && value.endsWith(')');
    const calculateValue = (value, constants) => {
      if (isCalcExpression(value)) {
        const expression = value.slice(5, -1).trim();
        if (!/^[0-9+\-*/().,\sA-Za-z_]+$/.test(expression)) throw new Error(`Invalid static calc expression '${value}'`);
        const calcScope = {
          ...constants,
          sin: Math.sin,
          cos: Math.cos,
          tan: Math.tan,
          abs: Math.abs,
          round: Math.round,
          floor: Math.floor,
          ceil: Math.ceil,
          min: Math.min,
          max: Math.max,
          sqrt: Math.sqrt,
          PI: Math.PI,
        };
        // eslint-disable-next-line no-new-func
        const result = Function(...Object.keys(calcScope), `"use strict"; return (${expression});`)(...Object.values(calcScope));
        if (typeof result !== 'number' || !Number.isFinite(result)) {
          throw new Error(`Static calc expression '${value}' did not return a finite number`);
        }
        return result;
      }

      if (Array.isArray(value)) {
        const evaluatedArray = value.map((entry) => calculateValue(entry, constants));
        if (value[SameAs.STATIC_REF_MARKER]) Object.defineProperty(evaluatedArray, SameAs.STATIC_REF_MARKER, { value: true });
        return evaluatedArray;
      }
      if (value && typeof value === 'object') {
        Object.entries(value).forEach(([key, entry]) => {
          value[key] = calculateValue(entry, constants);
        });
      }
      return value;
    };

    const calcConstants = { zpos: { ...DEFAULT_ZPOS } };
    const constants = config.constants ?? {};
    Object.entries(constants).forEach(([key, value]) => {
      constants[key] = calculateValue(value, calcConstants);
      if (typeof constants[key] === 'number' && Number.isFinite(constants[key])) calcConstants[key] = constants[key];
    });

    const replaceRefs = (value) => {
      if (typeof value === 'string' && value.startsWith('ref(') && value.endsWith(')')) {
        const refName = value.slice(4, -1).trim();
        if (!(refName in constants)) throw new Error(`Static ref '${refName}' not found`);
        const constant = constants[refName];
        const resolvedRef = constant && typeof constant === 'object'
          ? Merge.mergeDeep(Array.isArray(constant) ? [] : {}, constant)
          : constant;
        if (resolvedRef && typeof resolvedRef === 'object') Object.defineProperty(resolvedRef, SameAs.STATIC_REF_MARKER, { value: true });
        return resolvedRef;
      }
      if (Array.isArray(value)) return value.map((entry) => replaceRefs(entry));
      if (value && typeof value === 'object') {
        Object.entries(value).forEach(([key, entry]) => {
          value[key] = replaceRefs(entry);
        });
      }
      return value;
    };

    replaceRefs(config);
    calculateValue(config, calcConstants);
  }

  /** Resolves layout entity ids and animation targets to flat entity indexes. */
  resolveLayoutEntityIndexes(config, resolvedEntityConfigs, entitySlots) {
    const entityIndexes = {};
    resolvedEntityConfigs.forEach((entityConfig, index) => {
      entityIndexes[entityConfig.entity] = entityIndexes[entityConfig.entity] === undefined ? index : null;
    });

    VISIBLE_LAYOUT_SECTIONS.forEach((section) => {
      const items = config.layout[section];
      if (!Array.isArray(items)) return;
      items.forEach((item) => {
        if (item.entity === undefined) return;
        if (entityIndexes[item.entity] === undefined) throw new Error(`[${section}] Unknown entity: ${item.entity}`);
        if (entityIndexes[item.entity] === null) throw new Error(`[${section}] Entity '${item.entity}' occurs more than once; use entity_index`);
        item.entity_index = entityIndexes[item.entity];
      });
    });

    if (config.animations === undefined) return;
    const resolvedAnimations = {};
    Object.entries(config.animations).forEach(([animationKey, animationItems]) => {
      const entityReference = animationKey.substring('entity.'.length);
      let entityIndex;

      if (/^\d+$/.test(entityReference)) {
        entityIndex = Number(entityReference);
        if (resolvedEntityConfigs[entityIndex] === undefined) throw new Error(`[animations] Unknown entity index: ${entityIndex}`);
      } else {
        const slotMatch = entityReference.match(/^([A-Za-z_][A-Za-z0-9_]*)\[(\d+)\]$/);
        if (slotMatch) {
          const slotName = slotMatch[1];
          const slotIndex = Number(slotMatch[2]);
          const slot = entitySlots[slotName];
          if (slot === undefined) throw new Error(`[animations] Unknown entity slot: ${slotName}`);
          if (slot[slotIndex] === undefined) throw new Error(`[animations] Entity slot ${slotName} has no index ${slotIndex}`);
          entityIndex = slot[slotIndex];
        } else {
          entityIndex = entityIndexes[entityReference];
          if (entityIndex === undefined) throw new Error(`[animations] Unknown entity: ${entityReference}`);
          if (entityIndex === null) throw new Error(`[animations] Entity '${entityReference}' occurs more than once; use entity.<index>`);
        }
      }

      const resolvedAnimationKey = `entity.${entityIndex}`;
      if (resolvedAnimations[resolvedAnimationKey] !== undefined) throw new Error(`[animations] Duplicate entity target: ${resolvedAnimationKey}`);
      resolvedAnimations[resolvedAnimationKey] = animationItems;
    });
    config.animations = resolvedAnimations;
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
