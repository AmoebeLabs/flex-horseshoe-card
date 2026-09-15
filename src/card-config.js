import ConfigHelper from './config-helper.js';
import { DEFINITION_SHAPE_SECTIONS, VISIBLE_LAYOUT_SECTIONS } from './layout-sections.js';
import Merge from './merge.js';
import SameAs from './same-as.js';
import { DEFAULT_ZPOS } from './const.js';

/** Owns validation and compilation of user-facing card configuration. */
export default class CardConfig {
  /**
   * Stores the card's template compiler used while raw YAML becomes validated
   * runtime configuration.
   */
  constructor(templates) {
    this.templates = templates;
  }

  /**
   * Creates the complete developer configuration consumed during runtime.
   *
   * This runs once at the configuration boundary. Runtime domains can therefore
   * read both completed flags directly.
   */
  initializeDeveloperConfig(config) {
    config.dev = {
      debug: false,
      performance: false,
      ...config.dev,
    };
  }

  /**
   * Adds the card-level values required by rendering and runtime domains.
   *
   * This mutates the compiled config so the Templates context can retain the
   * same config reference from compilation through rendering.
   */
  initializeCardRuntimeDefaults(config) {
    config.card_filter ??= 'card--filter-none';
  }

  /** Expands constants, deep-cloned ref() values and static calc() expressions. */
  compileStaticValues(config) {
    const constantIdentifierPattern = /^[A-Za-z_][A-Za-z0-9_]*$/;
    const isCalcExpression = (value) => typeof value === 'string' && value.startsWith('calc(') && value.endsWith(')');

    /*
     * Resolve JavaScript-like constant paths:
     *
     *   ref(theme.colors.warning)
     *   ref(geometry.horseshoe.radius)
     *
     * Each path segment must be a normal JavaScript-style identifier.
     * Arrays are deliberately not traversed: foo[0].bar is not part of
     * the static constant path syntax.
     */
    const resolveConstantPath = (path, constants) => {
      const parts = path.split('.');

      if (parts.length === 0 || parts.some((part) => !constantIdentifierPattern.test(part))) {
        throw new Error(`Invalid static constant path '${path}'`);
      }

      let resolved = constants;

      parts.forEach((part) => {
        if (!resolved || typeof resolved !== 'object' || Array.isArray(resolved) || !Object.prototype.hasOwnProperty.call(resolved, part)) {
          throw new Error(`Static ref '${path}' not found`);
        }

        resolved = resolved[part];
      });

      return resolved;
    };

    /*
     * Build the part of a constant that is useful inside calc().
     *
     * calc() is numeric, so strings, booleans, arrays and other values are
     * not exposed to the expression scope. Nested numeric objects are retained:
     *
     *   constants:
     *     geometry:
     *       horseshoe:
     *         radius: 45
     *
     * becomes:
     *
     *   geometry.horseshoe.radius
     *
     * inside calc().
     */
    const buildCalcScopeValue = (value) => {
      if (typeof value === 'number' && Number.isFinite(value)) return value;

      if (!value || typeof value !== 'object' || Array.isArray(value)) {
        return undefined;
      }

      const result = Object.create(null);

      Object.entries(value).forEach(([key, entry]) => {
        // Non-identifier config keys may still exist inside reusable fragments,
        // but cannot be addressed through JavaScript-style dot notation.
        if (!constantIdentifierPattern.test(key)) return;

        const calcValue = buildCalcScopeValue(entry);

        if (calcValue !== undefined) {
          result[key] = calcValue;
        }
      });

      return Object.keys(result).length > 0 ? result : undefined;
    };

    /*
     * Resolve static calc() expressions recursively.
     */
    const calculateValue = (value, constants) => {
      if (isCalcExpression(value)) {
        const expression = value.slice(5, -1).trim();

        if (!/^[0-9+\-*/().,\sA-Za-z_]+$/.test(expression)) {
          throw new Error(`Invalid static calc expression '${value}'`);
        }

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

        if (value[SameAs.STATIC_REF_MARKER]) {
          Object.defineProperty(evaluatedArray, SameAs.STATIC_REF_MARKER, { value: true });
        }

        return evaluatedArray;
      }

      if (value && typeof value === 'object') {
        Object.entries(value).forEach(([key, entry]) => {
          value[key] = calculateValue(entry, constants);
        });
      }

      return value;
    };

    /*
     * Compile constants in declaration order.
     *
     * Top-level constant names use JavaScript-style identifiers. This makes '.'
     * unambiguous: it always means "go one level deeper".
     *
     * Later constants may use earlier numeric constants or earlier nested
     * numeric constant namespaces in calc().
     */
    const calcConstants = {
      zpos: { ...DEFAULT_ZPOS },
    };

    const constants = config.constants ?? {};

    Object.entries(constants).forEach(([key, value]) => {
      if (!constantIdentifierPattern.test(key)) {
        throw new Error(`Invalid constant name '${key}'; use letters, numbers and underscores, and do not use '.'`);
      }

      constants[key] = calculateValue(value, calcConstants);

      const calcValue = buildCalcScopeValue(constants[key]);

      if (calcValue !== undefined) {
        calcConstants[key] = calcValue;
      }
    });

    /*
     * Replace ref() expressions throughout the complete configuration.
     *
     * Scalars are inserted directly.
     * Objects and arrays are deep-cloned so every ref() receives its own copy.
     */
    const replaceRefs = (value) => {
      if (typeof value === 'string' && value.startsWith('ref(') && value.endsWith(')')) {
        const refPath = value.slice(4, -1).trim();
        const constant = resolveConstantPath(refPath, constants);

        const resolvedRef = constant && typeof constant === 'object' ? Merge.mergeDeep(Array.isArray(constant) ? [] : {}, constant) : constant;

        if (resolvedRef && typeof resolvedRef === 'object') {
          Object.defineProperty(resolvedRef, SameAs.STATIC_REF_MARKER, { value: true });
        }

        return resolvedRef;
      }

      if (Array.isArray(value)) {
        return value.map((entry) => replaceRefs(entry));
      }

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

  /**
   * Resolves layout entity ids and animation targets to flat entity indexes.
   *
   * For example, `animations.entity.rooms[0]` becomes `animations.entity.2`
   * when the first entity in the `rooms` slot occupies flat index 2.
   */
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

  /**
   * Builds named slots for the final flat configured entity list.
   *
   * A slot starts at an entity containing `slot: room`; following entities
   * inherit that slot until another explicit slot starts.
   */
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

  /**
   * Converts entity indexes to symbolic addresses before same_as inheritance.
   *
   * `entity_index: rooms[1]` becomes
   * `{ type: 'entity_address', slot: 'rooms', index: 1 }` until flattening.
   */
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

  /**
   * Flattens symbolic entity addresses after inheritance is complete.
   *
   * With `rooms: [3, 4]`, the address `rooms[1]` becomes flat entity index 4.
   */
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
    const validActions = ['none', 'more-info', 'toggle', 'perform-action', 'call-service', 'navigate', 'url', 'assist', 'fire-dom-event', 'increment', 'decrement', 'select-option'];

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
