import { svg } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import actionHandler from './action-handler.js';
import BaseTool from './base-tool.js';
import ConfigHelper from './config-helper.js';
import Merge from './merge.js';
import TextTool from './text-tool.js';
import Templates from './templates.js';

/**
 * Shared base for visible controls with an optional TextTool label.
 */
export default class ControlBase extends BaseTool {
  /**
   * Adds shared visibility, gesture and label defaults at the config boundary.
   * Concrete source objects retain nested expressions for their owning pass.
   */
  static completeConfig(config) {
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
        if (controlHaptics[property] !== undefined
          && typeof propertyValue === 'object' && propertyValue !== null
          && !Templates.isJsTemplate(propertyValue.action)
          && propertyValue.action !== 'none') {
          value[property] = Merge.mergeDeep(
            { haptic: controlHaptics[property] },
            propertyValue,
          );
        }

        addControlHaptics(value[property]);
      });
    };

    addControlHaptics(controlConfig);
    if (controlConfig.label !== undefined && !Templates.isJsTemplate(controlConfig.label)) {
      controlConfig.label = Merge.mergeDeep(
        {
          position: 'start',
          gap: 0,
          offset: {
            x: 0,
            y: 0,
          },
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

      // Whole-value templates keep their source until the owning runtime pass.
      // Concrete style dictionaries may contain nested templates without losing them.
      if (!Templates.isJsTemplate(controlConfig.label.position)
        && !Templates.isJsTemplate(controlConfig.label.styles)) {
        controlConfig.label.styles = Merge.mergeDeep(
          labelAlignmentStyles[controlConfig.label.position],
          ConfigHelper.toStyleDict(controlConfig.label.styles),
        );
      }
    }

    return controlConfig;
  }

  /** Captures source and uses one subtype translator for concrete config. */
  constructor(config, index, templates, cardId, card, translateControlConfig) {
    const controlConfig = ControlBase.completeConfig(config);
    super(controlConfig, index, templates, cardId, card, 'controls', 'controls', undefined, { fill: true, stroke: false },
      translateControlConfig ? (value) => ControlBase.completeConfig(translateControlConfig(value)) : undefined);
    this.translateControlConfig = translateControlConfig;

    this.labelTextTool = undefined;
    this.controlHassAvailable = false;
    this.controlConnected = false;
    this.controlDisconnected = false;
  }

  /** Evaluates parent-owned Control fields before completing current configuration. */
  updateRuntimeConfig() {
    let sourceConfig = this.sourceConfig;
    if (this.translateControlConfig && this.hasJavascript
      && (!this.runtimeConfigInitialized || this.card.evaluateJavascriptTemplates)) {
      // Selectors establish the preset/defaults visible through item. Reuse their
      // evaluated values in the remaining pass, so each expression runs once.
      const selectorContext = Merge.mergeDeep(this.translateControlConfig({}, true), sourceConfig);
      // Selectors see the authored state map as a complete replacement, just as
      // the final translator does after evaluation.
      if (sourceConfig.state_map !== undefined) selectorContext.state_map = sourceConfig.state_map;
      const orientation = this.templates.getJsTemplateOrValue(selectorContext, selectorContext.orientation);
      const show = this.templates.getJsTemplateOrValue(selectorContext, selectorContext.show);
      sourceConfig = this.translateControlConfig({ ...sourceConfig, orientation, show }, true);
    }
    super.updateRuntimeConfig(sourceConfig, { resolveKeys: true, preserve: ControlBase.isChildConfigPath });
    if (!['visible', 'hidden', 'unavailable'].includes(this.config.visibility)) {
      throw Error(`[controls] Invalid visibility '${this.config.visibility}' [visible, hidden, unavailable]`);
    }

    // Retained labels evaluate their own part templates and theme paint. Structural
    // changes rebuild the label later with its new source and current placement.
    if (!this.configurationChanged && !this.groupChanged && this.labelTextTool) {
      this.labelTextTool.updateRuntimeConfig();
    }
  }

  /**
   * Keeps generated visual source in its own template context. Layout fields
   * such as padding, margins and icon size belong to the parent Control.
   *
   * @param {Array<string|number>} path - Field address in the parent source.
   * @returns {boolean} Whether this field is evaluated by a generated child.
   */
  static isChildConfigPath(path) {
    const [section, branch, field, item, property] = path;
    if (section === 'label' && path.length === 2) {
      return !['position', 'gap', 'offset', 'styles'].includes(branch);
    }
    if (section === 'value') return ['state', 'separator_config', 'separator'].includes(branch);
    if (section === 'values') return field === 'value';
    if (section === 'option_map') {
      if (['text_config', 'icon_config', 'icon', 'text'].includes(field)) return true;
      if (field === 'content' && path.length === 5) return !['margin', 'size'].includes(property);
    }
    if (section !== 'content') return false;
    if (field === 'items' && path.length === 5) return !['id', 'type', 'margin', 'size'].includes(property);
    if (field === 'icon' && path.length === 4) return item !== 'size';
    if (field === 'text') return true;
    if (branch === 'content_text' && path.length === 3) return !['padding', 'gap'].includes(field);
    if (field === 'value' && path.length === 4) return item !== 'size';
    if (['minus', 'plus'].includes(field)) {
      if (item === 'content_text') return true;
      if (item === 'content_icon' && property === 'icon') return true;
    }
    return false;
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

    return this.card.actions.getActionHandlerOptions(itemConfig, entityIndex);
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

    this.card.actions.handleAction(event, itemConfig, entityIndex);
  }

  /**
   * Creates the label TextTool at one physical side of the complete control.
   *
   * Width and height use normal card configuration units. The label remains a
   * normal TextTool and therefore owns text parts, fitting, wrapping and styles.
   */
  createControlLabelTextTool(controlWidth, controlHeight) {
    if (this.config.label === undefined) {
      // Removing a configured label ends its child lifetime and rendered content.
      if (this.labelTextTool) this.labelTextTool.disconnected();
      this.labelTextTool = undefined;
      return;
    }
    if (this.labelTextTool) this.labelTextTool.disconnected();

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
        entity_index: this.entity_index,
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

      // TextTool evaluates each part in its own context before combining styles.
      // Keep that source intact and apply the shared label styles first.
      return {
        ...part,
        styles: [labelConfig.styles, part.styles],
      };
    });

    // Styles now live on exactly one SVG level; em values must not compound.
    delete labelConfig.styles;

    delete labelConfig.position;
    delete labelConfig.gap;
    delete labelConfig.offset;

    this.labelTextTool = new TextTool(labelConfig, 0, this.templates, this.cardId, this.card);
    this.labelTextTool.updateRuntimeConfig();
    if (this.controlHassAvailable) this.labelTextTool.hassAvailable();
    if (this.controlConnected) this.labelTextTool.connected();
    else if (this.controlDisconnected) this.labelTextTool.disconnected();
  }

  /** Gives rebuilt content the lifecycle already reached by this control. */
  activateContentTools() {
    this.getContentTools().forEach((tool) => {
      if (this.controlHassAvailable) tool.hassAvailable();
      if (this.controlConnected) tool.connected();
      else if (this.controlDisconnected) tool.disconnected();
    });
  }

  /** Forwards initial HA availability to the label and concrete content tools. */
  hassAvailable() {
    if (this.controlHassAvailable) return;
    this.controlHassAvailable = true;
    if (this.labelTextTool) this.labelTextTool.hassAvailable();
    this.getContentTools().forEach((tool) => tool.hassAvailable());
  }

  /** Connects the current children once when their parent enters the DOM. */
  connected() {
    if (this.controlConnected) return;
    this.controlConnected = true;
    this.controlDisconnected = false;
    if (this.labelTextTool) this.labelTextTool.connected();
    this.getContentTools().forEach((tool) => tool.connected());
  }

  /** Closes every nested owner, including direct icon/text/state content. */
  disconnected() {
    this.controlConnected = false;
    this.controlDisconnected = true;
    if (this.labelTextTool) this.labelTextTool.disconnected();
    this.getContentTools().forEach((tool) => tool.disconnected());
  }

  /** Forwards websocket readiness without repeating DOM connection. */
  hassConnected() {
    if (this.labelTextTool) this.labelTextTool.hassConnected();
    this.getContentTools().forEach((tool) => tool.hassConnected());
  }

  /** Includes nested data visualizations in the card's update decision. */
  requiresHassUpdate() {
    return super.requiresHassUpdate() || this.getContentTools().some((tool) => tool.requiresHassUpdate());
  }

  /** Forwards first-render work after the current child nodes are committed. */
  firstUpdated(changedProperties) {
    if (this.labelTextTool) this.labelTextTool.firstUpdated(changedProperties);
    this.getContentTools().forEach((tool) => tool.firstUpdated(changedProperties));
  }

  /**
   * Publishes the exact configured label entity to its TextTool.
   */
  setState(entity, entityConfig) {
    super.setState(entity, entityConfig);

    if (this.labelTextTool) {
      const labelEntityIndex = this.labelTextTool.entity_index;

      this.labelTextTool.setState(
        this.card.entities[labelEntityIndex],
        this.card.runtimeEntityConfigs[labelEntityIndex],
      );
    }
  }

  /** Includes the optional label's own text and paint in the parent render decision. */
  hasPresentationChanged(content) {
    const changed = super.hasPresentationChanged(content);
    const labelChanged = this.labelTextTool !== undefined && this.labelTextTool.hasPresentationChanged();
    return changed || labelChanged;
  }

  /** Initializes a literal label or its explicitly configured entity. */
  setStaticState() {
    if (this.labelTextTool) {
      this.labelTextTool.setEntities(
        this.card.runtimeEntityConfigs,
        this.card.entities,
      );
    }
  }

  /** Runs TextTool measurement and overflow lifecycle after rendering. */
  updated() {
    if (this.labelTextTool) this.labelTextTool.updated();
  }

  /** Returns the optional label as an ordinary TextTool template. */
  renderControlLabel() {
    return this.labelTextTool ? this.labelTextTool.render() : svg``;
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
