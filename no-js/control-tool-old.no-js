import { svg } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import BaseTool from './base-tool.js';
import ConfigHelper from './config-helper.js';
import Merge from './merge.js';
import actionHandler from './action-handler.js';
import TextTool from './text-tool.js';
import IconTool from './icon-tool.js';
import Utils from './utils.js';

const DEFAULT_CONTROL_CONFIG = {
  type: 'button',
  mode: 'button',
  content: { mode: 'horizontal', gap: 2, padding: 2, icon_size: 2 },
  viz: {
    background: { fill: 'var(--secondary-background-color)', stroke: 'none', radius: 2 },
    track: { fill: 'transparent', stroke: 'none', padding: 1 },
    indicator: { shape: 'roundrect', radius: 2, fill: 'var(--primary-color)', stroke: 'none' },
    animation: { duration: 200, easing: 'ease' },
  },
};

const DEFAULT_TOGGLE_CONFIG = {
  mode: 'toggle',
  tap_action: { action: 'toggle' },
  viz: {
    background: { fill: 'transparent' },
    track: { fill: 'var(--secondary-background-color)', padding: 0, width: 16, height: 7 },
    indicator: { shape: 'circle', radius: 4.5, width: 9, height: 9 },
  },
};

const DEFAULT_TOGGLE_CONFIG_NEW = {
  orientation: 'horizontal',

  track: {
    width: 16,
    height: 7,
    radius: 3.5,
  },

  thumb: {
    width: 9,
    height: 9,
    radius: 4.5,
    offset: 4.5,
  },

  content: {
    mode: 'content_icon',

    content_icon: {
      icon: {},
    },
  },

  animation: {
    duration: 250,
    easing: 'ease-out',
  },
};

const DEFAULT_NUMBER_CONTENT = {
  minus: { mode: 'text', text: '-' },
  value: { mode: 'text' },
  plus: { mode: 'text', text: '+' },
};

export default class ControlTool extends BaseTool {
  static setConfig(config, templates, cardId, card) {
    const controls = config.layout.controls;

    return controls.filter((item) => item.type === 'button').map((item, index) => new ControlTool(item, index, templates, cardId, card));
  }

  constructor(config, index, templates, cardId, card) {
    const modeConfig = config.mode === 'toggle' ? DEFAULT_TOGGLE_CONFIG : {};
    const mergedConfig = Merge.mergeDeep(DEFAULT_CONTROL_CONFIG, modeConfig, config);

    if (mergedConfig.mode === 'number') {
      mergedConfig.content = Merge.mergeDeep(mergedConfig.content, DEFAULT_NUMBER_CONTENT, config.content);
    }

    if (mergedConfig.states) {
      mergedConfig.states = mergedConfig.states.map((state) => Merge.mergeDeep({ content: {} }, state));
    }
    super(mergedConfig, index, templates, cardId, card, 'controls', 'controls', undefined, { fill: true, stroke: false });

    this.config.svg = this.calculateSvgDimensions();
    this.textTools = [];
    this.iconTools = [];
    this.createContentTools();
  }

  calculateSvgDimensions(config = this.config) {
    const coordinates = this.card._calculateSvgCoordinatesInGroup(config);
    return Merge.mergeDeep(coordinates, {
      width: Utils.calculateSvgDimension(config.width),
      height: Utils.calculateSvgDimension(config.height),
    });
  }

  createContentTools() {
    this.textTools = [];
    this.iconTools = [];
    const contentItems = [];

    if (this.config.mode === 'select') {
      this.config.states.forEach((state, index) => {
        contentItems.push({
          id: `select-${index}`,
          content: Merge.mergeDeep(this.config.content, state.content, { text: state.text, icon: state.icon }),
          xpos: this.config.xpos - this.config.width / 2 + ((index + 0.5) * this.config.width) / this.config.states.length,
          ypos: this.config.ypos,
          width: this.config.width / this.config.states.length,
          height: this.config.height,
        });
      });
    } else if (this.config.mode === 'number') {
      ['minus', 'value', 'plus'].forEach((part, index) => {
        contentItems.push({
          id: `number-${part}`,
          content: Merge.mergeDeep(this.config.content, this.config.content[part]),
          xpos: this.config.xpos - this.config.width / 3 + ((index + 0.5) * this.config.width) / 3,
          ypos: this.config.ypos,
          width: this.config.width / 3,
          height: this.config.height,
        });
      });
    } else {
      contentItems.push({
        id: 'main',
        content: this.config.content,
        xpos: this.config.xpos,
        ypos: this.config.ypos,
        width: this.config.width,
        height: this.config.height,
      });
    }

    contentItems.forEach((item) => {
      const childConfig = {
        id: `${this.id}-${item.id}`,
        group: this.config.group,
        xpos: item.xpos,
        ypos: item.ypos,
        width: item.width,
        height: item.height,
        text: item.content.text,
        icon: item.content.icon,
        icon_size: item.content.icon_size,
        text_overflow: item.content.text_overflow,
        styles: item.content.styles,
        tap_action: { action: 'none' },
      };

      if (item.content.text !== undefined) {
        this.textTools.push(TextTool.setConfig({ layout: { texts: [childConfig] } }, this.templates, this.cardId, this.card)[0]);
      }
      if (item.content.icon !== undefined) {
        this.iconTools.push(IconTool.setConfig({ layout: { icons: [childConfig] } }, this.templates, this.cardId, this.card)[0]);
      }
    });
  }

  updateRuntimeConfig() {
    super.updateRuntimeConfig();
    if (this.configChanged) {
      this.config.svg = this.calculateSvgDimensions(this.config);
      this.createContentTools();
    }
    this.textTools.forEach((tool) => tool.updateRuntimeConfig());
    this.iconTools.forEach((tool) => tool.updateRuntimeConfig());
  }

  setState(entity, entityConfig) {
    super.setState(entity, entityConfig);
    this.textTools.forEach((tool) => tool.setState(entity, entityConfig));
    this.iconTools.forEach((tool) => tool.setState(entity, entityConfig));
  }

  getAction(action) {
    const entityId = this.entityConfig.entity;
    const domain = entityId.split('.')[0];

    if (this.config.mode === 'toggle') return this.config.tap_action;
    if (this.config.mode === 'button') return this.config.tap_action;
    if (this.config.mode === 'number') {
      const serviceDomain = domain === 'fhs_input_number' ? 'fhs_input_number' : 'input_number';
      return { action: 'perform-action', perform_action: `${serviceDomain}.${action}`, target: { entity_id: entityId }, data: {} };
    }

    const state = this.config.states[action];
    return {
      action: 'perform-action',
      perform_action: domain === 'fhs_input_number' ? 'fhs_input_number.set_value' : 'input_select.select_option',
      target: { entity_id: entityId },
      data: domain === 'fhs_input_number' ? { value: state.value } : { option: state.value },
    };
  }

  renderHitArea(x, y, width, height, action) {
    const config = Merge.mergeDeep(this.config, { tap_action: this.getAction(action) });
    return svg`<g ${actionHandler(this.card.getActionHandlerOptions(config, this.entity_index))} @action=${(event) => this.card.handleAction(event, config, this.entity_index)}><rect x="${x}" y="${y}" width="${width}" height="${height}" fill="transparent" pointer-events="auto"></rect></g>`;
  }

  render() {
    this.config.svg = this.calculateSvgDimensions(this.config);
    const { x, y, width, height } = this.config.svg;
    const background = this.config.viz.background;
    const styles = this.getStyles(Merge.mergeDeep({ fill: background.fill, stroke: background.stroke }, ConfigHelper.toStyleDict(background.styles)));
    const radius = Utils.calculateSvgDimension(background.radius);
    const content = svg`<g pointer-events="none" style="pointer-events:none">${this.textTools.map((tool) => tool.render())}${this.iconTools.map((tool) => tool.render())}</g>`;

    if (this.config.mode === 'select') {
      const segmentWidth = width / this.config.states.length;
      return this.renderItemLayers(
        svg`<g>
          <rect x="${x}" y="${y}"
            width="${width}" height="${height}" 
            rx="${radius}" ry="${radius}" style="${styleMap(styles)}">
          </rect>
         ${this.config.states.map((state, index) => this.renderHitArea(x + index * segmentWidth, y, segmentWidth, height, index))}${content}</g>`,
        this.config,
      );
    }

    if (this.config.mode === 'number') {
      const segmentWidth = width / 3;
      return this.renderItemLayers(
        svg`<g><rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}" ry="${radius}" style="${styleMap(styles)}"></rect>${this.renderHitArea(x, y, segmentWidth, height, 'decrement')}${content}${this.renderHitArea(x + segmentWidth * 2, y, segmentWidth, height, 'increment')}</g>`,
        this.config,
      );
    }

    return this.renderItemLayers(
      svg`<g><rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}" ry="${radius}" style="${styleMap(styles)}"></rect>${this.renderHitArea(x, y, width, height, 'tap')}${content}</g>`,
      this.config,
    );
  }

  updated(changedProperties) {
    this.textTools.forEach((tool) => tool.updated(changedProperties));
    this.iconTools.forEach((tool) => tool.updated(changedProperties));
  }
}
