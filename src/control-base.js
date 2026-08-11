import { svg } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import actionHandler from './action-handler.js';
import BaseTool from './base-tool.js';
import ConfigHelper from './config-helper.js';
import Merge from './merge.js';
import TextTool from './text-tool.js';

/**
 * Shared base for visible controls with an optional TextTool label.
 */
export default class ControlBase extends BaseTool {
  /**
   * Stores common control configuration.
   *
   * Concrete controls complete their own visualization config before calling
   * this constructor and create the label after calculating their geometry.
   */
  constructor(config, index, templates, cardId, card) {
    const DEFAULT_CONTROL_CONFIG = {
      visibility: 'visible',
      unavailable: {
        styles: {
          opacity: 0.35,
        },
      },
    };
    const controlHaptics = {
      tap_action: 'selection',
      hold_action: 'medium',
      double_tap_action: 'heavy',
    };
    const controlConfig = Merge.mergeDeep(DEFAULT_CONTROL_CONFIG, config);

    // Complete every configured control gesture, including actions nested in
    // number buttons and select options. Explicit YAML remains the final value.
    const addControlHaptics = (value) => {
      if (Array.isArray(value)) {
        value.forEach((entry) => addControlHaptics(entry));
        return;
      }

      if (!value || typeof value !== 'object') return;

      Object.entries(value).forEach(([property, propertyValue]) => {
        if (controlHaptics[property] !== undefined && propertyValue.action !== 'none') {
          value[property] = Merge.mergeDeep(
            { haptic: controlHaptics[property] },
            propertyValue,
          );
        }

        addControlHaptics(value[property]);
      });
    };

    addControlHaptics(controlConfig);
    if (controlConfig.label !== undefined) {
      controlConfig.label = Merge.mergeDeep(
        {
          position: 'start',
          gap: 0,
          offset: {
            x: 0,
            y: 0,
          },
          entity_index: controlConfig.entity_index,
          tap_action: {
            action: 'none',
          },
        },
        controlConfig.label,
      );

      const labelAlignmentStyles = {
        start: { 'text-anchor': 'end', 'dominant-baseline': 'central' },
        end: { 'text-anchor': 'start', 'dominant-baseline': 'central' },
        top: { 'text-anchor': 'middle', 'dominant-baseline': 'central' },
        bottom: { 'text-anchor': 'middle', 'dominant-baseline': 'central' },
      };

      controlConfig.label.styles = Merge.mergeDeep(
        labelAlignmentStyles[controlConfig.label.position],
        ConfigHelper.toStyleDict(controlConfig.label.styles),
      );
    }

    super(controlConfig, index, templates, cardId, card, 'controls', 'controls', undefined, { fill: true, stroke: false });

    this.hasControlLabel = controlConfig.label !== undefined;
    this.labelTextTool = undefined;
  }

  /**
   * Activates runtime control configuration and validates its interaction state.
   */
  updateRuntimeConfig() {
    super.updateRuntimeConfig();

    if (!['visible', 'hidden', 'unavailable'].includes(this.config.visibility)) {
      throw Error(`[controls] Invalid visibility '${this.config.visibility}' [visible, hidden, unavailable]`);
    }
  }

  /**
   * Returns action-handler flags for an available control.
   */
  getControlActionHandlerOptions(itemConfig, entityIndex) {
    if (this.config.visibility === 'unavailable') {
      return {
        hasTap: false,
        hasHold: false,
        hasDoubleClick: false,
      };
    }

    return this.card.getActionHandlerOptions(itemConfig, entityIndex);
  }

  /**
   * Returns the shared gesture directive while honoring unavailable state.
   */
  controlActionHandler(itemConfig, entityIndex) {
    return actionHandler(this.getControlActionHandlerOptions(itemConfig, entityIndex));
  }

  /**
   * Blocks unavailable control actions before they reach the card action router.
   */
  handleControlAction(event, itemConfig, entityIndex) {
    if (this.config.visibility === 'unavailable') {
      event.stopPropagation();
      return;
    }

    this.card.handleAction(event, itemConfig, entityIndex);
  }

  /**
   * Creates the label TextTool at one physical side of the complete control.
   *
   * Width and height use normal card configuration units. The label remains a
   * normal TextTool and therefore owns text parts, fitting, wrapping and styles.
   */
  createControlLabelTextTool(controlWidth, controlHeight) {
    if (!this.hasControlLabel) return;

    const label = this.config.label;
    let xpos = this.config.xpos;
    let yposc = this.config.ypos;

    switch (label.position) {
      case 'start':
        xpos -= controlWidth / 2 + label.gap;
        break;
      case 'end':
        xpos += controlWidth / 2 + label.gap;
        break;
      case 'top':
        yposc -= controlHeight / 2 + label.gap;
        break;
      case 'bottom':
        yposc += controlHeight / 2 + label.gap;
        break;
      default:
        throw Error(`ControlBase - invalid label position '${label.position}' [start, end, top, bottom]`);
    }

    xpos += label.offset.x;
    yposc += label.offset.y;

    const labelConfig = Merge.mergeDeep(
      {
        id: `${this.id}-label`,
        group: this.config.group,
        entity_index: label.entity_index,
        xpos,
        yposc,
      },
      label,
      {
        xpos,
        yposc,
        tap_action: {
          action: 'none',
        },
      },
    );

    // TextTool source parts render as their own tspans. Publish the control-label
    // styles to those parts so explicit part styles remain the final override.
    const labelTextParts = Array.isArray(labelConfig.text) ? labelConfig.text : [labelConfig.text];
    labelConfig.text = labelTextParts.map((part) => {
      if (typeof part !== 'object') {
        return {
          value: part,
          styles: ConfigHelper.toStyleDict(labelConfig.styles),
        };
      }

      return Merge.mergeDeep(part, {
        styles: Merge.mergeDeep(
          ConfigHelper.toStyleDict(labelConfig.styles),
          ConfigHelper.toStyleDict(part.styles),
        ),
      });
    });

    // Styles now live on exactly one SVG level; em values must not compound.
    delete labelConfig.styles;

    delete labelConfig.position;
    delete labelConfig.gap;
    delete labelConfig.offset;

    this.labelTextTool = new TextTool(labelConfig, 0, this.templates, this.cardId, this.card);
    this.labelTextTool.updateRuntimeConfig();
  }

  /**
   * Publishes the exact configured label entity to its TextTool.
   */
  setState(entity, entityConfig) {
    super.setState(entity, entityConfig);

    if (this.hasControlLabel) {
      const labelEntityIndex = this.labelTextTool.entity_index;

      this.labelTextTool.setState(
        this.card.entities[labelEntityIndex],
        this.card.resolvedEntityConfigs[labelEntityIndex],
      );
    }
  }

  /** Runs TextTool measurement and overflow lifecycle after rendering. */
  updated() {
    if (this.hasControlLabel) this.labelTextTool.updated();
  }

  /** Returns the optional label as an ordinary TextTool template. */
  renderControlLabel() {
    return this.hasControlLabel ? this.labelTextTool.render() : svg``;
  }

  /**
   * Wraps label and complete control content in one visibility/availability layer.
   */
  renderControl(content) {
    let control = svg`${this.renderControlLabel()}${content}`;

    if (this.config.visibility === 'unavailable') {
      const grayscaleFilterId = `${this.cardId}-${this.id}-unavailable-grayscale`;
      const unavailableStyles = Merge.mergeDeep(
        ConfigHelper.toStyleDict(this.config.unavailable.styles),
        { 'pointer-events': 'none' },
      );

      control = svg`
        <defs>
          <filter
            id="${grayscaleFilterId}"
            x="-100%"
            y="-100%"
            width="300%"
            height="300%"
            color-interpolation-filters="sRGB"
          >
            <feColorMatrix type="saturate" values="0"></feColorMatrix>
          </filter>
        </defs>
        <g
          class="fhs-control--unavailable"
          style=${styleMap(unavailableStyles)}
          filter="url(#${grayscaleFilterId})"
          aria-disabled="true"
        >
          ${control}
        </g>
      `;
    }

    return this.renderItemLayers(control);
  }
}
