import { svg } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import actionHandler from './action-handler.js';
import ConfigHelper from './config-helper.js';
import ControlBase from './control-base.js';
import IconTool from './icon-tool.js';
import Merge from './merge.js';
import TextTool from './text-tool.js';
import Utils from './utils.js';

/** Segmented select control backed by one Home Assistant input_select entity. */
export default class ControlSelect extends ControlBase {
  /** Normalizes select configuration and creates reusable option content tools. */
  constructor(config, index, templates, cardId, card) {
    const DEFAULT_SELECT_CONFIG = {
      orientation: 'horizontal',
      width: 34,
      height: 11,
      tap_action: { action: 'select-option' },
      background: {
        radius: 5,
        styles: {},
      },
      track: {
        padding: { x: 0.5, y: 0.5 },
        styles: {},
      },
      separator: {
        padding: { x: 1, y: 1 },
        styles: {
          stroke: 'var(--divider-color)',
          'stroke-width': 0.25,
        },
      },
      option_map: [],
      content: {
        mode: 'content_vertical',
        content_vertical: {
          padding: { x: 0.5, y: 0.5 },
          gap: 0.5,
          icon: { size: 45, styles: {} },
          text: { styles: {} },
        },
        content_horizontal: {
          padding: { x: 0.5, y: 0.5 },
          gap: 0.5,
          icon: { size: 45, styles: {} },
          text: { styles: {} },
        },
      },
      show: {
        item_viz: 'viz_button',
        separator: true,
      },
      viz_button: {
        background: {
          styles: { fill: 'var(--secondary-background-color)' },
        },
        track: {
          styles: { fill: 'transparent' },
        },
        indicator: {
          position: 'fill',
          padding: { x: 0.5, y: 0.5 },
          thickness: 0.75,
          radius: 2,
          styles: { fill: 'var(--primary-color)' },
        },
        selected: {
          background: { styles: { fill: 'transparent' } },
          icon: { styles: { fill: 'var(--primary-background-color)' } },
          text: { styles: { fill: 'var(--primary-background-color)' } },
        },
        unselected: {
          background: { styles: { fill: 'transparent' } },
          icon: { styles: { fill: 'var(--primary-text-color)' } },
          text: { styles: { fill: 'var(--primary-text-color)' } },
        },
        animation: {
          duration: 250,
          easing: 'ease-out',
        },
        press: {
          scale: 0.9,
          duration: 140,
          easing: 'ease-out',
        },
      },
      viz_line: {
        background: {
          styles: { fill: 'var(--secondary-background-color)' },
        },
        track: {
          styles: { fill: 'transparent' },
        },
        indicator: {
          position: 'bottom',
          padding: { x: 0.5, y: 0.5 },
          thickness: 0.75,
          radius: 0.375,
          styles: { fill: 'var(--primary-color)' },
        },
        selected: {
          background: { styles: { fill: 'transparent' } },
          icon: { styles: { fill: 'var(--primary-color)' } },
          text: { styles: { fill: 'var(--primary-color)' } },
        },
        unselected: {
          background: { styles: { fill: 'transparent' } },
          icon: { styles: { fill: 'var(--primary-text-color)' } },
          text: { styles: { fill: 'var(--primary-text-color)' } },
        },
        animation: {
          duration: 250,
          easing: 'ease-out',
        },
        press: {
          scale: 0.9,
          duration: 140,
          easing: 'ease-out',
        },
      },
    };
    const selectConfig = Merge.mergeDeep(DEFAULT_SELECT_CONFIG, config);
    const selectedVizName = selectConfig.show.item_viz;

    // A named visualization inherits the complete button visualization before
    // its own config overrides are applied. Render code consumes one final viz.
    selectConfig[selectedVizName] = Merge.mergeDeep(
      DEFAULT_SELECT_CONFIG.viz_button,
      selectConfig[selectedVizName],
    );
    const selectedIndicatorPadding = selectConfig[selectedVizName].indicator.padding;

    // Normalize the previous scalar padding once at the configuration boundary.
    if (typeof selectedIndicatorPadding === 'number') {
      selectConfig[selectedVizName].indicator.padding = {
        x: selectedIndicatorPadding,
        y: selectedIndicatorPadding,
      };
    }
    selectConfig.option_map = selectConfig.option_map.map((option) => Merge.mergeDeep(
      {
        tap_action: selectConfig.tap_action,
        text_config: {},
        icon_config: {},
      },
      option,
    ));

    super(selectConfig, index, templates, cardId, card);

    this.config.svg = this.calculateSvgDimensions();
    this.selectedOptionIndex = 0;
    this.optionTextTools = [];
    this.optionIconTools = [];
    this.optionActionConfigs = [];
    this.createOptionContentTools();
    this.createControlLabelTextTool(this.config.width, this.config.height);
  }

  /** Creates normal TextTool and IconTool instances at each segment center. */
  createOptionContentTools() {
    this.optionTextBaseStyles = [];
    this.optionIconBaseStyles = [];
    const optionCount = this.config.option_map.length;
    const horizontalControl = this.config.orientation === 'horizontal';
    const verticalContent = this.config.content.mode === 'content_vertical';
    const trackWidth = this.config.width - this.config.track.padding.x * 2;
    const trackHeight = this.config.height - this.config.track.padding.y * 2;
    const segmentWidth = horizontalControl ? trackWidth / optionCount : trackWidth;
    const segmentHeight = horizontalControl ? trackHeight : trackHeight / optionCount;
    const trackStartX = this.config.xpos - trackWidth / 2;
    const trackStartY = this.config.ypos - trackHeight / 2;
    const contentConfig = this.config.content[this.config.content.mode];
    const viz = this.config[this.config.show.item_viz];
    let contentWidth;
    let contentHeight;
    let contentOffsetY = 0;

    // A filled indicator contains the content. A top or bottom line reserves
    // only its own thickness and vertical padding on that side.
    switch (viz.indicator.position) {
      case 'fill':
        contentWidth = segmentWidth - viz.indicator.padding.x * 2 - contentConfig.padding.x * 2;
        contentHeight = segmentHeight - viz.indicator.padding.y * 2 - contentConfig.padding.y * 2;
        break;
      case 'top':
        contentWidth = segmentWidth - contentConfig.padding.x * 2;
        contentHeight = segmentHeight - viz.indicator.thickness - viz.indicator.padding.y - contentConfig.padding.y * 2;
        contentOffsetY = (viz.indicator.thickness + viz.indicator.padding.y) / 2;
        break;
      case 'bottom':
        contentWidth = segmentWidth - contentConfig.padding.x * 2;
        contentHeight = segmentHeight - viz.indicator.thickness - viz.indicator.padding.y - contentConfig.padding.y * 2;
        contentOffsetY = -(viz.indicator.thickness + viz.indicator.padding.y) / 2;
        break;
      default:
        throw Error(`[controls] Invalid select indicator position '${viz.indicator.position}' [fill, top, bottom]`);
    }

    const optionIconSize = Math.min(contentWidth, contentHeight) * contentConfig.icon.size / 100;
    const textMaximumWidth = verticalContent
      ? contentWidth
      : contentWidth - optionIconSize - contentConfig.gap;

    this.optionTextTools = this.config.option_map.map((option, optionIndex) => {
      const centerX = horizontalControl
        ? trackStartX + segmentWidth * (optionIndex + 0.5)
        : this.config.xpos;
      const centerY = horizontalControl
        ? this.config.ypos + contentOffsetY
        : trackStartY + segmentHeight * (optionIndex + 0.5) + contentOffsetY;
      const hasIcon = option.icon !== undefined;
      const textXpos = hasIcon && !verticalContent
        ? centerX + (optionIconSize + contentConfig.gap) / 2
        : centerX;
      const textYpos = hasIcon && verticalContent
        ? centerY + (optionIconSize + contentConfig.gap) / 2
        : centerY;
      const textConfig = Merge.mergeDeep(
        {
          id: `${this.id}-option-${optionIndex}-text`,
          group: this.config.group,
          entity_index: this.entity_index,
          xpos: textXpos,
          yposc: textYpos,
          text: option.text,
          text_overflow: {
            mode: 'fit',
            fit: { max_width: hasIcon ? textMaximumWidth : contentWidth },
          },
          tap_action: { action: 'none' },
          styles: {
            'text-anchor': 'middle',
            'dominant-baseline': 'central',
            'pointer-events': 'none',
          },
        },
        contentConfig.text,
        option.text_config,
        { tap_action: { action: 'none' } },
      );

      this.optionTextBaseStyles[optionIndex] = textConfig.styles;
      return new TextTool(textConfig, optionIndex, this.templates, this.cardId, this.card);
    });

    this.optionIconTools = this.config.option_map.map((option, optionIndex) => {
      if (option.icon === undefined) return undefined;

      const centerX = horizontalControl
        ? trackStartX + segmentWidth * (optionIndex + 0.5)
        : this.config.xpos;
      const centerY = horizontalControl
        ? this.config.ypos + contentOffsetY
        : trackStartY + segmentHeight * (optionIndex + 0.5) + contentOffsetY;
      const iconXpos = verticalContent
        ? centerX
        : centerX - (textMaximumWidth + contentConfig.gap) / 2;
      const iconYpos = verticalContent
        ? centerY - (optionIconSize + contentConfig.gap) / 2
        : centerY;
      const iconConfig = Merge.mergeDeep(
        {
          id: `${this.id}-option-${optionIndex}-icon`,
          group: this.config.group,
          entity_index: this.entity_index,
          xpos: iconXpos,
          yposc: iconYpos,
          icon_size_percent: optionIconSize,
          icon: option.icon,
          tap_action: { action: 'none' },
          styles: { 'pointer-events': 'none' },
        },
        contentConfig.icon,
        option.icon_config,
        { tap_action: { action: 'none' } },
      );

      delete iconConfig.size;
      this.optionIconBaseStyles[optionIndex] = iconConfig.styles;
      return new IconTool(iconConfig, optionIndex, this.templates, this.cardId, this.card);
    });
  }

  /** Updates evaluated select config, geometry and child tool configuration. */
  updateRuntimeConfig() {
    super.updateRuntimeConfig();

    if (this.configChanged) {
      this.config.svg = this.calculateSvgDimensions(this.config);
      this.createOptionContentTools();
      this.createControlLabelTextTool(this.config.width, this.config.height);
    }

    this.optionTextTools.forEach((textTool) => textTool.updateRuntimeConfig());
    this.optionIconTools.filter((iconTool) => iconTool !== undefined)
      .forEach((iconTool) => iconTool.updateRuntimeConfig());
  }

  /** Selects the active option and publishes state plus visual styles. */
  setState(entity, entityConfig) {
    super.setState(entity, entityConfig);

    this.selectedOptionIndex = this.config.option_map
      .findIndex((option) => String(option.value) === String(entity.state));
    const viz = this.config[this.config.show.item_viz];
    const transition = `${viz.animation.duration}ms ${viz.animation.easing}`;

    // The internal semantic default becomes a normal HA action only after the
    // exact control entity and option value are available.
    this.optionActionConfigs = this.config.option_map.map((option) => {
      const tapAction = option.tap_action.action === 'select-option'
        ? {
          action: 'perform-action',
          perform_action: 'input_select.select_option',
          target: { entity_id: entity.entity_id },
          data: { option: option.value },
        }
        : option.tap_action;

      return Merge.mergeDeep(option, { tap_action: tapAction });
    });

    this.optionTextTools.forEach((textTool, optionIndex) => {
      const optionStyle = optionIndex === this.selectedOptionIndex ? viz.selected : viz.unselected;

      textTool.config.styles = Merge.mergeDeep(
        ConfigHelper.toStyleDict(optionStyle.text.styles),
        ConfigHelper.toStyleDict(this.optionTextBaseStyles[optionIndex]),
        { transition: `fill ${transition}, color ${transition}, opacity ${transition}` },
      );
      textTool.setState(entity, entityConfig);
    });

    this.optionIconTools.forEach((iconTool, optionIndex) => {
      if (iconTool === undefined) return;

      const optionStyle = optionIndex === this.selectedOptionIndex ? viz.selected : viz.unselected;
      iconTool.config.styles = Merge.mergeDeep(
        ConfigHelper.toStyleDict(optionStyle.icon.styles),
        ConfigHelper.toStyleDict(this.optionIconBaseStyles[optionIndex]),
        { transition: `fill ${transition}, color ${transition}, opacity ${transition}` },
      );
      iconTool.setState(entity, entityConfig);
    });
  }

  /** Runs child TextTool and IconTool post-render lifecycle hooks. */
  updated() {
    super.updated();
    this.optionTextTools.forEach((textTool) => textTool.updated());
    this.optionIconTools.filter((iconTool) => iconTool !== undefined)
      .forEach((iconTool) => iconTool.updated());
  }

  /** Converts the select center through the normal group pipeline. */
  calculateSvgDimensions(config = this.config) {
    return this.card._calculateSvgCoordinatesInGroup(config);
  }

  /** Runs one immediate press animation around the center of the selected segment. */
  animateOptionPress(optionGroup, centerX, centerY) {
    const press = this.config[this.config.show.item_viz].press;
    const restingTransform = `translate(${centerX}px, ${centerY}px) scale(1) translate(-${centerX}px, -${centerY}px)`;
    const pressedTransform = `translate(${centerX}px, ${centerY}px) scale(${press.scale}) translate(-${centerX}px, -${centerY}px)`;

    optionGroup.getAnimations().forEach((animation) => animation.cancel());
    optionGroup.animate(
      [
        { transform: restingTransform },
        { transform: pressedTransform },
        { transform: restingTransform },
      ],
      {
        duration: press.duration,
        easing: press.easing,
      },
    );
  }

  /** Renders background, segments, moving indicator, content and hit areas. */
  render() {
    const viz = this.config[this.config.show.item_viz];
    const horizontal = this.config.orientation === 'horizontal';
    const optionCount = this.config.option_map.length;
    const backgroundWidth = Utils.calculateSvgDimension(this.config.width);
    const backgroundHeight = Utils.calculateSvgDimension(this.config.height);
    const trackWidth = Utils.calculateSvgDimension(this.config.width - this.config.track.padding.x * 2);
    const trackHeight = Utils.calculateSvgDimension(this.config.height - this.config.track.padding.y * 2);
    const segmentWidth = horizontal ? trackWidth / optionCount : trackWidth;
    const segmentHeight = horizontal ? trackHeight : trackHeight / optionCount;
    const trackX = this.config.svg.xpos - trackWidth / 2;
    const trackY = this.config.svg.ypos - trackHeight / 2;
    const indicatorPaddingX = Utils.calculateSvgDimension(viz.indicator.padding.x);
    const indicatorPaddingY = Utils.calculateSvgDimension(viz.indicator.padding.y);

    const indicatorThickness = Utils.calculateSvgDimension(viz.indicator.thickness);
    const indicatorX = trackX + indicatorPaddingX;
    let indicatorY;
    const indicatorWidth = segmentWidth - indicatorPaddingX * 2;
    let indicatorHeight;

    // Indicator geometry is entirely selected by the active visualization preset.
    switch (viz.indicator.position) {
      case 'fill':
        indicatorY = trackY + indicatorPaddingY;
        indicatorHeight = segmentHeight - indicatorPaddingY * 2;
        break;
      case 'top':
        indicatorY = trackY + indicatorPaddingY;
        indicatorHeight = indicatorThickness;
        break;
      case 'bottom':
        indicatorY = trackY + segmentHeight - indicatorPaddingY - indicatorThickness;
        indicatorHeight = indicatorThickness;
        break;
      default:
        throw Error(`[controls] Invalid select indicator position '${viz.indicator.position}' [fill, top, bottom]`);
    }
    const indicatorTranslateX = horizontal && this.selectedOptionIndex >= 0 ? this.selectedOptionIndex * segmentWidth : 0;
    const indicatorTranslateY = !horizontal && this.selectedOptionIndex >= 0 ? this.selectedOptionIndex * segmentHeight : 0;
    const transition = `${viz.animation.duration}ms ${viz.animation.easing}`;
    const backgroundStyles = this.getStyles(Merge.mergeDeep(
      ConfigHelper.toStyleDict(this.config.background.styles),
      ConfigHelper.toStyleDict(viz.background.styles),
    ));
    const trackStyles = this.getStyles(Merge.mergeDeep(
      ConfigHelper.toStyleDict(this.config.track.styles),
      ConfigHelper.toStyleDict(viz.track.styles),
    ));
    const indicatorStyles = this.getStyles(Merge.mergeDeep(
      ConfigHelper.toStyleDict(viz.indicator.styles),
      { transition: `fill ${transition}, stroke ${transition}, opacity ${transition}` },
    ));
    const separatorPaddingX = Utils.calculateSvgDimension(this.config.separator.padding.x);
    const separatorPaddingY = Utils.calculateSvgDimension(this.config.separator.padding.y);
    const separatorStyles = this.getStyles(Merge.mergeDeep(
      ConfigHelper.toStyleDict(this.config.separator.styles),
      { 'pointer-events': 'none' },
    ));
    const indicatorPositionStyles = {
      transform: `translate(${indicatorTranslateX}px, ${indicatorTranslateY}px)`,
      transition: `transform ${transition}`,
      'pointer-events': 'none',
      visibility: this.selectedOptionIndex === -1 ? 'hidden' : 'visible',
    };

    const select = this.renderItemLayers(svg`
      <g
        class="select-control"
        transform="${this.getGroupScaleTransform()}"
        style="${this.getGroupScaleStyle()}"
      >
        <rect
          class="select-control__background"
          x="${this.config.svg.xpos - backgroundWidth / 2}"
          y="${this.config.svg.ypos - backgroundHeight / 2}"
          width="${backgroundWidth}"
          height="${backgroundHeight}"
          rx="${Utils.calculateSvgDimension(this.config.background.radius)}"
          style=${styleMap(backgroundStyles)}
        />
        <rect
          class="select-control__track"
          x="${trackX}"
          y="${trackY}"
          width="${trackWidth}"
          height="${trackHeight}"
          style=${styleMap(trackStyles)}
        />
        ${this.config.option_map.map((option, optionIndex) => {
          const optionStyle = optionIndex === this.selectedOptionIndex ? viz.selected : viz.unselected;

          return svg`
            <rect
              class="select-control__option-background"
              x="${trackX + (horizontal ? optionIndex * segmentWidth : 0)}"
              y="${trackY + (horizontal ? 0 : optionIndex * segmentHeight)}"
              width="${segmentWidth}"
              height="${segmentHeight}"
              style=${styleMap(this.getStyles(Merge.mergeDeep(
                ConfigHelper.toStyleDict(optionStyle.background.styles),
                { transition: `fill ${transition}, stroke ${transition}, opacity ${transition}` },
              )))}
            />
          `;
        })}
        <g
          class="select-control__indicator-position"
          style=${styleMap(indicatorPositionStyles)}
        >
          <rect
            class="select-control__indicator"
            x="${indicatorX}"
            y="${indicatorY}"
            width="${indicatorWidth}"
            height="${indicatorHeight}"
            rx="${Utils.calculateSvgDimension(viz.indicator.radius)}"
            style=${styleMap(indicatorStyles)}
          />
        </g>
        ${this.config.show.separator ? [...this.config.option_map.keys()].slice(1).map((optionIndex) => (horizontal
          ? svg`
            <line
              class="select-control__separator"
              x1="${trackX + optionIndex * segmentWidth}"
              y1="${trackY + separatorPaddingY}"
              x2="${trackX + optionIndex * segmentWidth}"
              y2="${trackY + trackHeight - separatorPaddingY}"
              style=${styleMap(separatorStyles)}
            />
          `
          : svg`
            <line
              class="select-control__separator"
              x1="${trackX + separatorPaddingX}"
              y1="${trackY + optionIndex * segmentHeight}"
              x2="${trackX + trackWidth - separatorPaddingX}"
              y2="${trackY + optionIndex * segmentHeight}"
              style=${styleMap(separatorStyles)}
            />
          `)) : svg``}
      </g>
    `);

    const optionContent = this.config.option_map.map((option, optionIndex) => svg`
      <g class="select-control__option-content">
        ${this.optionIconTools[optionIndex]?.render()}
        ${this.optionTextTools[optionIndex].render()}
        <rect
          class="select-control__hit-area"
          x="${trackX + (horizontal ? optionIndex * segmentWidth : 0)}"
          y="${trackY + (horizontal ? 0 : optionIndex * segmentHeight)}"
          width="${segmentWidth}"
          height="${segmentHeight}"
          fill="transparent"
          style="outline: none;"
          tabindex="0"
          role="button"
          ${actionHandler(this.card.getActionHandlerOptions(this.optionActionConfigs[optionIndex], this.entity_index))}
          @pointerdown=${(event) => this.animateOptionPress(
            event.currentTarget.parentElement,
            trackX + (horizontal ? optionIndex * segmentWidth : 0) + segmentWidth / 2,
            trackY + (horizontal ? 0 : optionIndex * segmentHeight) + segmentHeight / 2,
          )}
          @action=${(event) => this.card.handleAction(event, this.optionActionConfigs[optionIndex], this.entity_index)}
        />
      </g>
    `);

    return svg`${this.renderControlLabel()}${select}${optionContent}`;
  }
}
