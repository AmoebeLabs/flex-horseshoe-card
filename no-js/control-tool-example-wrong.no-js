import { svg } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import BaseTool from './base-tool.js';
import Merge from './merge.js';
import ConfigHelper from './config-helper.js';
import actionHandler from './action-handler.js';
import TextTool from './text-tool.js';
import IconTool from './icon-tool.js';
import Utils from './utils.js';

/**
 * Renders compact interactive controls without requiring separate rectangle,
 * text and icon layout items. The mode selects the state behavior; the visual
 * layers remain configurable through the shared FHS style pipeline.
 */
export default class ControlTool extends BaseTool {
  /** Builds ControlTool instances from layout.controls. */
  static setConfig(config, templates, cardId, card) {
    const controls = config.layout?.controls ?? [];

    return controls.filter((controlConfig) => controlConfig.type === 'button').map((controlConfig, index) => new ControlTool(controlConfig, index, templates, cardId, card));
  }

  /** Stores the control config and calculates its fixed SVG geometry. */
  constructor(config, index, templates, cardId, card) {
    const hasExplicitTapAction = config.tap_action !== undefined;
    const buttonConfig = Merge.mergeDeep(
      {
        mode: 'button',
        content: {
          mode: 'horizontal',
          gap: 2,
          padding: 2,
        },
        viz: {
          background: {
            fill: 'var(--secondary-background-color)',
            stroke: 'none',
            radius: 2,
          },
          track: {
            fill: 'transparent',
            stroke: 'none',
            padding: 1,
          },
          indicator: {
            shape: 'roundrect',
            radius: 2,
            fill: 'var(--primary-color)',
            stroke: 'none',
          },
          animation: {
            duration: 200,
            easing: 'ease',
          },
        },
        styles: {},
      },
      config,
    );

    buttonConfig.content = Merge.mergeDeep(
      {
        mode: 'horizontal',
        gap: 2,
        padding: 2,
        icon_size: 2,
        ...(buttonConfig.mode === 'number'
          ? {
              minus: { mode: 'text', text: '-' },
              value: { mode: 'text' },
              plus: { mode: 'text', text: '+' },
            }
          : {}),
      },
      config.content ?? {},
    );
    const modeViz = config.viz?.[buttonConfig.mode] ?? {};
    buttonConfig.viz = {
      ...config.viz,
      ...modeViz,
      background: {
        fill: buttonConfig.mode === 'toggle' ? 'transparent' : 'var(--secondary-background-color)',
        stroke: 'none',
        radius: 2,
        ...config.viz?.background,
        ...modeViz.background,
      },
      track: {
        fill: buttonConfig.mode === 'toggle' ? 'var(--secondary-background-color)' : 'transparent',
        stroke: 'none',
        padding: buttonConfig.mode === 'toggle' ? 0 : 1,
        width: buttonConfig.mode === 'toggle' ? 16 : buttonConfig.width,
        height: buttonConfig.mode === 'toggle' ? 7 : buttonConfig.height,
        ...config.viz?.track,
        ...modeViz.track,
      },
      indicator: {
        shape: 'roundrect',
        radius: buttonConfig.mode === 'toggle' ? 4.5 : 2,
        fill: 'var(--primary-color)',
        stroke: 'none',
        ...(buttonConfig.mode === 'toggle' ? { width: 9, height: 9 } : {}),
        ...config.viz?.indicator,
        ...modeViz.indicator,
      },
      animation: { duration: 200, easing: 'ease', ...config.viz?.animation, ...modeViz.animation },
    };

    super(buttonConfig, index, templates, cardId, card, 'controls', 'controls', undefined, { fill: true, stroke: false });

    if (buttonConfig.entity === undefined && buttonConfig.entity_index === undefined && buttonConfig.tap_action === undefined) {
      buttonConfig.tap_action = { action: 'none' };
    }

    this.config.svg = this.calculateSvgDimensions();
    this.hasExplicitTapAction = hasExplicitTapAction;
    this.contentTextTools = new Map();
    this.contentIconTools = new Map();
  }

  /** Keeps one internal TextTool per rendered content instance. */
  updateContentTextTool(content, geometry, key = 'main') {
    const text = this.getContentText(content);

    if (text === undefined) return undefined;

    const textConfig = {
      id: `${this.id}--${key}-text`,
      group: this.config.group,
      text,
      xpos: geometry.x + geometry.width / 2,
      ypos: geometry.y + geometry.height / 2,
      text_overflow: content.text_overflow,
      styles: content.styles,
      tap_action: { action: 'none' },
    };

    let textTool = this.contentTextTools.get(key);
    if (!textTool) {
      textTool = new TextTool(textConfig, this.index, this.templates, this.cardId, this.card);
      this.contentTextTools.set(key, textTool);
    } else {
      textTool.config = Merge.mergeDeep(textTool.config, textConfig);
      textTool.sourceTextParts = [{ type: 'text', value: text }];
      textTool.textPartsHaveJavascript = false;
      textTool.activeTextPartsSignature = undefined;
      textTool.config.svg = textTool.calculateSvgDimensions(textTool.config);
      textTool.updateRuntimeConfig();
    }

    textTool.setState(this.entity, this.entityConfig);
    return textTool;
  }

  /** Keeps button icons on the existing FHS IconTool SVG pipeline. */
  updateContentIconTool(content, geometry, key = 'main') {
    const iconConfig = {
      id: `${this.id}--${key}-icon`,
      group: this.config.group,
      icon: content.icon,
      xpos: geometry.x + geometry.width / 2,
      ypos: geometry.y + geometry.height / 2,
      icon_size: content.icon_size ?? 2,
      styles: content.styles,
      tap_action: { action: 'none' },
    };

    let iconTool = this.contentIconTools.get(key);
    if (!iconTool) {
      iconTool = new IconTool(iconConfig, this.index, this.templates, this.cardId, this.card);
      this.contentIconTools.set(key, iconTool);
    } else {
      iconTool.config = Merge.mergeDeep(iconTool.config, iconConfig);
      iconTool.config.svg = iconTool.calculateSvgDimensions(iconTool.config);
      iconTool.updateRuntimeConfig();
    }

    iconTool.setState(this.entity, this.entityConfig);
    return iconTool;
  }

  /** Recalculates geometry when templates, groups or theme styles change. */
  updateRuntimeConfig() {
    super.updateRuntimeConfig();

    if (this.configChanged) this.config.svg = this.calculateSvgDimensions(this.config);
  }

  /** Converts FHS coordinates and dimensions to the SVG coordinate system. */
  calculateSvgDimensions(config = this.config) {
    const coordinates = this.card._calculateSvgCoordinatesInGroup(config);
    const width = Utils.calculateSvgDimension(config.width);
    const height = Utils.calculateSvgDimension(config.height);

    return {
      ...coordinates,
      width,
      height,
      x: coordinates.xpos - width / 2,
      y: coordinates.ypos - height / 2,
    };
  }

  /** Returns the state entry selected by the current entity state. */
  getSelectedState() {
    const states = this.config.states ?? [];
    const currentState = this.entity?.state;

    return states.find((stateConfig) => String(stateConfig.value) === String(currentState));
  }

  /** Returns the selected state index used by select indicators. */
  getSelectedStateIndex() {
    const states = this.config.states ?? [];
    const selectedState = this.getSelectedState();

    return states.indexOf(selectedState);
  }

  /** Returns the effective content for the current mode and entity state. */
  getContent() {
    const selectedState = this.getSelectedState();
    const content = selectedState?.content ?? selectedState ?? this.config.content;

    return {
      ...this.config.content,
      ...content,
    };
  }

  /** Returns a safe text representation for button content. */
  getContentText(content) {
    if (this.config.mode === 'number' && content.text === undefined) return String(this.entity?.state);

    return content.text;
  }

  /** Calculates the track geometry; toggle defaults mirror the SAK compact switch. */
  getTrackGeometry() {
    const { x, y, width, height } = this.config.svg;
    const track = this.config.viz.track;
    const padding = Utils.calculateSvgDimension(track.padding);
    const trackWidth = Utils.calculateSvgDimension(track.width) - padding * 2;
    const trackHeight = Utils.calculateSvgDimension(track.height) - padding * 2;

    return {
      x: x + (width - trackWidth) / 2,
      y: y + (height - trackHeight) / 2,
      width: trackWidth,
      height: trackHeight,
    };
  }

  /** Calculates the active indicator geometry for toggle, select and number. */
  getIndicatorGeometry() {
    const { x, y, width, height } = this.config.svg;
    const mode = this.config.mode;
    const indicator = this.config.viz.indicator;
    const trackGeometry = this.getTrackGeometry();

    if (mode === 'toggle') {
      const indicatorWidth = indicator.width === undefined ? Utils.calculateSvgDimension(9) : Utils.calculateSvgDimension(indicator.width);
      const indicatorHeight = indicator.height === undefined ? Utils.calculateSvgDimension(9) : Utils.calculateSvgDimension(indicator.height);
      const isOn = this.entity?.state === 'on';

      return {
        x: isOn ? trackGeometry.x + trackGeometry.width - indicatorWidth : trackGeometry.x,
        y: trackGeometry.y + (trackGeometry.height - indicatorHeight) / 2,
        width: indicatorWidth,
        height: indicatorHeight,
      };
    }

    if (mode === 'select') {
      const states = this.config.states;
      const segmentWidth = width / states.length;
      const configX = this.config.xpos;
      const configY = this.config.ypos;
      const configWidth = this.config.width;
      const configHeight = this.config.height;
      const trackPadding = Utils.calculateSvgDimension(this.config.viz.track.padding ?? 0);
      const indicatorWidth = (indicator.width === undefined ? segmentWidth : Utils.calculateSvgDimension(indicator.width)) - trackPadding * 2;
      const indicatorHeight = (indicator.height === undefined ? height : Utils.calculateSvgDimension(indicator.height)) - trackPadding * 2;
      const selectedIndex = this.getSelectedStateIndex();

      return {
        x: x + selectedIndex * segmentWidth + trackPadding,
        y: y + trackPadding,
        width: indicatorWidth,
        height: indicatorHeight,
      };
    }

    return { x, y, width, height };
  }

  /** Converts a shape config into an SVG rectangle geometry. */
  getShapeRadius(shapeConfig, width, height) {
    if (shapeConfig.shape === 'circle') return Math.min(width, height) / 2;

    return Utils.calculateSvgDimension(shapeConfig.radius ?? 0);
  }

  /** Builds styles for one visual layer through the regular FHS style path. */
  getLayerStyles(layer, defaults) {
    const styles = this.getStyles({ ...defaults, ...ConfigHelper.toStyleDict(layer.styles) });

    return styles;
  }

  /** Renders one rounded or circular visual layer. */
  renderLayer(layer, defaults, geometry, className) {
    const styles = this.getLayerStyles(layer, defaults);
    const radius = this.getShapeRadius(layer, geometry.width, geometry.height);

    return svg`
      <rect
        class="${className}"
        x="${geometry.x}"
        y="${geometry.y}"
        width="${geometry.width}"
        height="${geometry.height}"
        rx="${radius}"
        ry="${radius}"
        style="${styleMap(styles)}"
      ></rect>
    `;
  }

  /** Renders text and optional HA icon content centered inside the control. */
  renderContent(content, geometry, actionKind, textKey = 'main') {
    const contentMode = content.mode;
    const contentPadding = content.padding;
    const contentGeometry = {
      x: geometry.x + contentPadding,
      y: geometry.y + contentPadding,
      width: geometry.width - contentPadding * 2,
      height: geometry.height - contentPadding * 2,
    };
    const text = this.getContentText(content);
    const icon = content.icon;
    const centerX = contentGeometry.x + contentGeometry.width / 2;
    const centerY = contentGeometry.y + contentGeometry.height / 2;
    const contentStyles = this.getStyles({
      fill: 'var(--primary-text-color)',
      color: 'var(--primary-text-color)',
      'text-anchor': 'middle',
      'dominant-baseline': 'central',
      ...ConfigHelper.toStyleDict(content.styles),
    });
    const iconSize = content.icon_size;
    const contentGap = content.gap;
    const hasIcon = icon && ['horizontal', 'vertical', 'icon'].includes(contentMode);
    const hasText = text !== undefined && ['horizontal', 'vertical', 'text'].includes(contentMode);
    const iconX = centerX - iconSize / 2;
    const iconY = centerY - iconSize / 2;
    const textX = contentMode === 'horizontal' && hasIcon ? centerX + (iconSize + contentGap) / 2 : centerX;
    const textY = contentMode === 'vertical' && hasIcon ? centerY + (iconSize + contentGap) / 2 : centerY;
    let contentTextTool;
    let contentIconTool;

    if (hasIcon) {
      contentIconTool = this.updateContentIconTool(
        content,
        {
          x: iconX - contentGeometry.width / 2,
          y: iconY - contentGeometry.height / 2,
          width: contentGeometry.width,
          height: contentGeometry.height,
        },
        textKey,
      );
    }

    if (hasText) {
      contentTextTool = this.updateContentTextTool(
        content,
        {
          x: textX - contentGeometry.width / 2,
          y: textY - contentGeometry.height / 2,
          width: contentGeometry.width,
          height: contentGeometry.height,
        },
        textKey,
      );
    }

    const contentActionHandler = actionKind === undefined ? svg`` : actionHandler({ hasTap: true, hasHold: false, hasDoubleClick: false });

    return svg`
      <g class="button-content" style="pointer-events:${actionKind === undefined ? 'none' : 'auto'}" ${contentActionHandler}
        @action=${actionKind === undefined ? undefined : (event) => this.handleButtonAction(event, actionKind)}>
        ${hasIcon ? svg`<g style="pointer-events:none">${contentIconTool.render()}</g>` : svg``}
        ${hasText ? contentTextTool.render() : svg``}
      </g>
    `;
  }

  /** Renders the fixed label outside the interactive content area. */
  renderLabel() {
    const label = this.config.label;

    if (!label) return svg``;

    const { x, y, width, height } = this.config.svg;
    const position = label.position ?? 'before';
    const offset = label.offset ?? { x: 0, y: 0 };
    const labelStyles = this.getStyles({
      fill: 'var(--primary-text-color)',
      'dominant-baseline': 'central',
      ...ConfigHelper.toStyleDict(label.styles),
    });
    const offsetX = Utils.calculateSvgDimension(offset.x ?? 0);
    const offsetY = Utils.calculateSvgDimension(offset.y ?? 0);
    const labelX = position === 'start' ? x + offsetX : position === 'end' ? x + width + offsetX : x + width / 2 + offsetX;
    const labelY = position === 'above' ? y + offsetY : position === 'below' ? y + height + offsetY : y + height / 2 + offsetY;
    const textAnchor = label.align === 'end' ? 'end' : label.align === 'start' ? 'start' : 'middle';

    return svg`<text x="${labelX}" y="${labelY}" text-anchor="${textAnchor}" style="${styleMap(labelStyles)}">${label.text}</text>`;
  }

  /** Renders every select option and leaves the active indicator to the visual layer. */
  renderSelectContents() {
    const { x, y, width, height } = this.config.svg;
    const states = this.config.states;
    const segmentWidth = width / states.length;
    const configX = this.config.xpos;
    const configY = this.config.ypos;
    const configWidth = this.config.width;
    const configHeight = this.config.height;

    return svg`${states.map((stateConfig, index) => {
      const stateContent = {
        ...this.config.content,
        ...stateConfig.content,
        icon: stateConfig.icon,
        text: stateConfig.text,
      };
      const geometry = { x: x + index * segmentWidth, y, width: segmentWidth, height };
      return svg`
        <g class="button-select-option">
          <rect
            x="${geometry.x}"
            y="${geometry.y}"
            width="${geometry.width}"
            height="${geometry.height}"
            fill="transparent"
            pointer-events="auto"
            ${actionHandler({ hasTap: true, hasHold: false, hasDoubleClick: false })}
            @action=${(event) => this.handleButtonAction(event, { type: 'select', value: stateConfig.value })}
          ></rect>
          ${this.renderContent(stateContent, { x: configX + (index * configWidth) / states.length, y: configY, width: configWidth / states.length, height: configHeight }, undefined, `select-${index}`)}
        </g>
      `;
    })}`;
  }

  /** Renders the number mode's minus/value/plus control zones. */
  renderNumberContent() {
    const { x, y, width, height } = this.config.svg;
    const contentPadding = Utils.calculateSvgDimension(this.config.content.padding ?? 0);
    const contentX = x + contentPadding;
    const contentY = y + contentPadding;
    const contentWidth = width - contentPadding * 2;
    const contentHeight = height - contentPadding * 2;
    const buttonWidth = contentWidth / 3;
    const content = this.config.content;
    const configPadding = this.config.content.padding;
    const configX = this.config.xpos + configPadding;
    const configY = this.config.ypos + configPadding;
    const configWidth = (this.config.width - configPadding * 2) / 3;
    const configHeight = this.config.height - configPadding * 2;
    const minusContentGeometry = { x: configX, y: configY, width: configWidth, height: configHeight };
    const valueContentGeometry = { x: configX + configWidth, y: configY, width: configWidth, height: configHeight };
    const plusContentGeometry = { x: configX + configWidth * 2, y: configY, width: configWidth, height: configHeight };
    const valueGeometry = { x: contentX + buttonWidth, y: contentY, width: buttonWidth, height: contentHeight };
    const minusGeometry = { x: contentX, y: contentY, width: buttonWidth, height: contentHeight };
    const plusGeometry = { x: contentX + buttonWidth * 2, y: contentY, width: buttonWidth, height: contentHeight };
    const minusContent = { ...content, ...content.minus };
    const plusContent = { ...content, ...content.plus };
    const valueContent = { ...content, ...content.value };

    return svg`
      <rect x="${minusGeometry.x}" y="${minusGeometry.y}" width="${minusGeometry.width}" height="${minusGeometry.height}" fill="transparent" pointer-events="auto" ${actionHandler({ hasTap: true, hasHold: false, hasDoubleClick: false })} @action=${(event) => this.handleButtonAction(event, 'decrement')}></rect>
      ${this.renderContent(minusContent, minusContentGeometry, undefined, 'number-minus')}
      ${this.renderContent(valueContent, valueContentGeometry, undefined, 'number-value')}
      <rect x="${plusGeometry.x}" y="${plusGeometry.y}" width="${plusGeometry.width}" height="${plusGeometry.height}" fill="transparent" pointer-events="auto" ${actionHandler({ hasTap: true, hasHold: false, hasDoubleClick: false })} @action=${(event) => this.handleButtonAction(event, 'increment')}></rect>
      ${this.renderContent(plusContent, plusContentGeometry, undefined, 'number-plus')}
    `;
  }

  /** Renders one complete ControlTool instance. */
  render() {
    this.config.svg = this.calculateSvgDimensions(this.config);

    const { x, y, width, height } = this.config.svg;
    const background = this.config.viz.background;
    const track = this.config.viz.track;
    const indicator = this.config.viz.indicator;
    const indicatorGeometry = this.getIndicatorGeometry();
    const indicatorStyles = this.getLayerStyles(indicator, {
      fill: this.config.mode === 'toggle' ? (this.entity?.state === 'on' ? 'var(--primary-color)' : 'var(--primary-text-color)') : 'var(--primary-color)',
      stroke: 'none',
    });
    const transition = `transform ${this.config.viz.animation.duration}ms ${this.config.viz.animation.easing}`;
    const backgroundGeometry = { x, y, width, height };
    const trackGeometry = this.getTrackGeometry();
    const indicatorLocalGeometry = {
      ...indicatorGeometry,
      x,
      y,
    };
    const rootActionHandler = this.config.mode === 'toggle' ? this.actionHandler() : svg``;

    return this.renderItemLayers(
      svg`
      <g transform="${this.getGroupScaleTransform()}" style="${this.getGroupScaleStyle()}"
        ${rootActionHandler}
        @action=${this.config.mode === 'toggle' ? (event) => this.handleButtonAction(event, 'tap') : undefined}
        @click=${(event) => event.stopPropagation()}>
        ${this.renderLabel()}
        ${this.renderLayer(background, { fill: 'var(--secondary-background-color)', stroke: 'none' }, backgroundGeometry, 'button-background')}
        ${
          this.config.mode === 'toggle' || this.config.mode === 'select'
            ? this.renderLayer(
                track,
                {
                  fill: this.config.mode === 'toggle' ? (this.entity?.state === 'on' ? 'var(--primary-color)' : 'var(--secondary-background-color)') : 'transparent',
                  stroke: 'none',
                },
                trackGeometry,
                'button-track',
              )
            : svg``
        }
        ${
          this.config.mode !== 'button' && this.config.mode !== 'number'
            ? svg`
          <g class="button-indicator" transform="translate(${indicatorGeometry.x - indicatorLocalGeometry.x} ${indicatorGeometry.y - indicatorLocalGeometry.y})" style="transition:${transition}">
            ${this.renderLayer(indicator, indicatorStyles, { ...indicatorLocalGeometry, x: indicatorLocalGeometry.x, y: indicatorLocalGeometry.y }, 'button-indicator-shape')}
          </g>
        `
            : svg``
        }
        ${this.config.mode === 'number' ? this.renderNumberContent() : this.config.mode === 'select' ? this.renderSelectContents() : this.renderContent(this.getContent(), { x: this.config.xpos, y: this.config.ypos, width: this.config.width, height: this.config.height }, 'tap')}
      </g>
    `,
      this.config,
    );
  }

  /** Builds the explicit tap action for this button sub-zone. */
  getButtonTapAction(buttonAction) {
    const entityId = this.entityConfig.entity;
    const entityDomain = entityId.split('.')[0];

    if (this.config.mode === 'toggle') return { action: 'toggle' };

    if (this.config.mode === 'number') {
      const actionDomain = entityDomain === 'fhs_input_number' ? 'fhs_input_number' : 'input_number';
      return {
        action: 'perform-action',
        perform_action: `${actionDomain}.${buttonAction}`,
        target: { entity_id: entityId },
        data: {},
      };
    }

    if (this.config.mode === 'select') {
      const value = buttonAction.value;
      if (entityDomain === 'input_select') {
        return { action: 'perform-action', perform_action: 'input_select.select_option', target: { entity_id: entityId }, data: { option: value } };
      }
      if (entityDomain === 'fhs_input_number') {
        return { action: 'perform-action', perform_action: 'fhs_input_number.set_value', target: { entity_id: entityId }, data: { value } };
      }
    }

    return undefined;
  }

  /** Routes the exact button sub-action through the shared FHS action router. */
  handleButtonAction(event, buttonAction) {
    const generatedAction = !this.hasExplicitTapAction ? this.getButtonTapAction(buttonAction) : undefined;
    const itemConfig = {
      ...this.config,
      ...(generatedAction ? { tap_action: generatedAction } : {}),
      button_action: buttonAction,
    };

    this.card.handleAction(event, itemConfig, this.entity_index);
  }

  /** Forwards the parent card lifecycle to the internal TextTool measurement. */
  updated(changedProperties) {
    this.contentTextTools.forEach((textTool) => textTool.updated(changedProperties));
    this.contentIconTools.forEach((iconTool) => iconTool.updated(changedProperties));
  }
}
