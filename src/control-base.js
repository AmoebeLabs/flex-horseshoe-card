import { svg } from 'lit';
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
    const controlHaptics = {
      tap_action: 'selection',
      hold_action: 'medium',
      double_tap_action: 'heavy',
    };

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

    addControlHaptics(config);
    if (config.label !== undefined) {
      config.label = Merge.mergeDeep(
        {
          position: 'start',
          gap: 0,
          offset: {
            x: 0,
            y: 0,
          },
          entity_index: config.entity_index,
          tap_action: {
            action: 'none',
          },
        },
        config.label,
      );
    }

    if (config.label !== undefined) {
      const labelAlignmentStyles = {
        start: { 'text-anchor': 'end', 'dominant-baseline': 'central' },
        end: { 'text-anchor': 'start', 'dominant-baseline': 'central' },
        top: { 'text-anchor': 'middle', 'dominant-baseline': 'central' },
        bottom: { 'text-anchor': 'middle', 'dominant-baseline': 'central' },
      };

      config.label.styles = Merge.mergeDeep(
        labelAlignmentStyles[config.label.position],
        ConfigHelper.toStyleDict(config.label.styles),
      );
    }

    super(config, index, templates, cardId, card, 'controls', 'controls', undefined, { fill: true, stroke: false });

    this.hasControlLabel = config.label !== undefined;
    this.labelTextTool = undefined;
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
}
