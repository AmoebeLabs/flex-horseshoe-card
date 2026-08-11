import { svg } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import ConfigHelper from './config-helper.js';
import ControlBase from './control-base.js';
import IconTool from './icon-tool.js';
import Merge from './merge.js';
import StateTool from './state-tool.js';
import TextTool from './text-tool.js';
import Utils from './utils.js';

/** Increment/decrement control with one formatted StateTool value. */
export default class ControlNumber extends ControlBase {
  /** Completes number configuration and creates its three child tools. */
  constructor(config, index, templates, cardId, card) {
    const ICON_SIZE_PERCENTAGE = 75;
    const DEFAULT_NUMBER_CONFIG = {
      show: {
        item_variant: 'stepper',
        item_viz: 'buttons',
        item_style: 'filled_square',
      },
      orientation: 'horizontal',
      width: 30,
      height: 10,
      padding: { x: 0.5, y: 0.5 },
      gap: 0.5,
      animation: {
        press: {
          scale: 0.9,
          duration: 140,
          easing: 'ease-out',
        },
      },
      background: {
        radius: 2,
        styles: { fill: 'transparent' },
      },
      content: {
        mode: 'content_horizontal',
        content_horizontal: {
          minus: {
            tap_action: { action: 'decrement' },
            background: {
              radius: 2,
              styles: { fill: 'var(--secondary-background-color)' },
            },
            mode: 'content_text',
            content_text: {
              text: '-',
              styles: {},
            },
            content_icon: {
              size: ICON_SIZE_PERCENTAGE,
              icon: { icon: 'mdi:minus', styles: { fill: 'var(--primary-text-color)' } },
            },
          },
          value: {
            size: 75,
            show: { uom: 'end' },
            styles: {},
          },
          plus: {
            tap_action: { action: 'increment' },
            background: {
              radius: 2,
              styles: { fill: 'var(--secondary-background-color)' },
            },
            mode: 'content_text',
            content_text: {
              text: '+',
              styles: {},
            },
            content_icon: {
              size: ICON_SIZE_PERCENTAGE,
              icon: { icon: 'mdi:plus', styles: { fill: 'var(--primary-text-color)' } },
            },
          },
        },
        content_vertical: {
          minus: {
            tap_action: { action: 'decrement' },
            background: {
              radius: 2,
              styles: { fill: 'var(--secondary-background-color)' },
            },
            mode: 'content_text',
            content_text: {
              text: '-',
              styles: {},
            },
            content_icon: {
              size: ICON_SIZE_PERCENTAGE,
              icon: { icon: 'mdi:chevron-down', styles: { fill: 'var(--primary-text-color)' } },
            },
          },
          value: {
            size: 75,
            show: { uom: 'end' },
            styles: {},
          },
          plus: {
            tap_action: { action: 'increment' },
            background: {
              radius: 2,
              styles: { fill: 'var(--secondary-background-color)' },
            },
            mode: 'content_text',
            content_text: {
              text: '+',
              styles: {},
            },
            content_icon: {
              size: ICON_SIZE_PERCENTAGE,
              icon: { icon: 'mdi:chevron-up', styles: { fill: 'var(--primary-text-color)' } },
            },
          },
        },
      },
    };
    const HORIZONTAL_NUMBER_CONFIG = {
      content: {
        content_horizontal: {
          minus: { content_icon: { icon: { icon: 'mdi:minus' } } },
          plus: { content_icon: { icon: { icon: 'mdi:plus' } } },
        },
        content_vertical: {
          minus: { content_icon: { icon: { icon: 'mdi:minus' } } },
          plus: { content_icon: { icon: { icon: 'mdi:plus' } } },
        },
      },
    };
    const VERTICAL_NUMBER_CONFIG = {
      content: {
        content_horizontal: {
          minus: { content_icon: { icon: { icon: 'mdi:chevron-down' } } },
          plus: { content_icon: { icon: { icon: 'mdi:chevron-up' } } },
        },
        content_vertical: {
          minus: { content_icon: { icon: { icon: 'mdi:chevron-down' } } },
          plus: { content_icon: { icon: { icon: 'mdi:chevron-up' } } },
        },
      },
    };
    const NUMBER_SURFACE_PRESETS = {
      filled: {
        background: { styles: { fill: 'var(--secondary-background-color)', stroke: 'none' } },
        content: {
          content_horizontal: {
            minus: { background: { styles: { fill: 'var(--card-background-color)', stroke: 'none' } } },
            plus: { background: { styles: { fill: 'var(--card-background-color)', stroke: 'none' } } },
          },
          content_vertical: {
            minus: { background: { styles: { fill: 'var(--card-background-color)', stroke: 'none' } } },
            plus: { background: { styles: { fill: 'var(--card-background-color)', stroke: 'none' } } },
          },
        },
      },
      outlined: {
        background: {
          styles: { fill: 'var(--card-background-color)', stroke: 'var(--divider-color)', 'stroke-width': 0.5 },
        },
        content: {
          content_horizontal: {
            minus: {
              background: { styles: { fill: 'transparent', stroke: 'none' } },
              content_text: { styles: { fill: 'var(--primary-text-color)' } },
              content_icon: { icon: { styles: { fill: 'var(--primary-text-color)' } } },
            },
            value: { styles: { fill: 'var(--primary-text-color)' } },
            plus: {
              background: { styles: { fill: 'transparent', stroke: 'none' } },
              content_text: { styles: { fill: 'var(--primary-text-color)' } },
              content_icon: { icon: { styles: { fill: 'var(--primary-text-color)' } } },
            },
          },
          content_vertical: {
            minus: {
              background: { styles: { fill: 'transparent', stroke: 'none' } },
              content_text: { styles: { fill: 'var(--primary-text-color)' } },
              content_icon: { icon: { styles: { fill: 'var(--primary-text-color)' } } },
            },
            value: { styles: { fill: 'var(--primary-text-color)' } },
            plus: {
              background: { styles: { fill: 'transparent', stroke: 'none' } },
              content_text: { styles: { fill: 'var(--primary-text-color)' } },
              content_icon: { icon: { styles: { fill: 'var(--primary-text-color)' } } },
            },
          },
        },
      },
    };
    const NUMBER_SHAPE_PRESETS = {
      round: { background: { radius: 5 } },
      square: { background: { radius: 2 } },
    };
    const NUMBER_STYLE_PRESETS = {
      filled_round: Merge.mergeDeep(NUMBER_SURFACE_PRESETS.filled, NUMBER_SHAPE_PRESETS.round),
      filled_square: Merge.mergeDeep(NUMBER_SURFACE_PRESETS.filled, NUMBER_SHAPE_PRESETS.square),
      outlined_round: Merge.mergeDeep(NUMBER_SURFACE_PRESETS.outlined, NUMBER_SHAPE_PRESETS.round),
      outlined_square: Merge.mergeDeep(NUMBER_SURFACE_PRESETS.outlined, NUMBER_SHAPE_PRESETS.square),
    };

    const normalizedConfig = Merge.mergeDeep({}, config);

    // A layout-level content shorthand selects the same content mode for both buttons.
    ['content_horizontal', 'content_vertical'].forEach((contentLayout) => {
      const shorthand = normalizedConfig.content?.[contentLayout];

      if (typeof shorthand === 'string') {
        if (!['content_text', 'content_icon'].includes(shorthand)) {
          throw Error(`[controls] Invalid number content shorthand '${shorthand}' [content_text, content_icon]`);
        }

        normalizedConfig.content[contentLayout] = {
          minus: { mode: shorthand },
          plus: { mode: shorthand },
        };
      }
    });

    const selectedConfig = Merge.mergeDeep(DEFAULT_NUMBER_CONFIG, normalizedConfig);
    if (selectedConfig.show.item_variant !== 'stepper') {
      throw Error(`[controls] Invalid number item_variant '${selectedConfig.show.item_variant}' [stepper]`);
    }
    if (selectedConfig.show.item_viz !== 'buttons') {
      throw Error(`[controls] Invalid number item_viz '${selectedConfig.show.item_viz}' [buttons]`);
    }
    if (!Object.hasOwn(NUMBER_STYLE_PRESETS, selectedConfig.show.item_style)) {
      throw Error(`[controls] Invalid number item_style '${selectedConfig.show.item_style}' [${Object.keys(NUMBER_STYLE_PRESETS).join(', ')}]`);
    }

    const orientationConfig = selectedConfig.orientation === 'vertical' ? VERTICAL_NUMBER_CONFIG : HORIZONTAL_NUMBER_CONFIG;
    const numberConfig = Merge.mergeDeep(
      DEFAULT_NUMBER_CONFIG,
      orientationConfig,
      NUMBER_STYLE_PRESETS[selectedConfig.show.item_style],
      normalizedConfig,
    );

    super(numberConfig, index, templates, cardId, card);

    this.config.svg = this.calculateSvgDimensions();
    this.minusContentTool = undefined;
    this.plusContentTool = undefined;
    this.valueStateTool = undefined;
    this.minusActionConfig = undefined;
    this.plusActionConfig = undefined;
    this.createNumberContentTools();
    this.createControlLabelTextTool(this.config.width, this.config.height);
  }

  /** Creates the two button contents and the formatted value StateTool. */
  createNumberContentTools() {
    const horizontal = this.config.orientation === 'horizontal';
    const contentConfig = this.config.content[this.config.content.mode];
    const innerWidth = this.config.width - this.config.padding.x * 2;
    const innerHeight = this.config.height - this.config.padding.y * 2;
    const mainSize = horizontal ? innerWidth : innerHeight;
    const crossSize = horizontal ? innerHeight : innerWidth;
    const buttonSize = Math.min(crossSize, (mainSize - this.config.gap * 2) / 3);
    const valueSize = (horizontal ? innerWidth : innerHeight) - buttonSize * 2 - this.config.gap * 2;
    const minusCenterX = horizontal ? this.config.xpos - valueSize / 2 - this.config.gap - buttonSize / 2 : this.config.xpos;
    const minusCenterY = horizontal ? this.config.ypos : this.config.ypos + valueSize / 2 + this.config.gap + buttonSize / 2;
    const plusCenterX = horizontal ? this.config.xpos + valueSize / 2 + this.config.gap + buttonSize / 2 : this.config.xpos;
    const plusCenterY = horizontal ? this.config.ypos : this.config.ypos - valueSize / 2 - this.config.gap - buttonSize / 2;

    this.numberGeometry = {
      horizontal,
      innerWidth,
      innerHeight,
      buttonSize,
      valueWidth: horizontal ? valueSize : innerWidth,
      valueHeight: horizontal ? innerHeight : valueSize,
      minusCenterX,
      minusCenterY,
      plusCenterX,
      plusCenterY,
    };

    const buttonConfigs = [
      { name: 'minus', config: contentConfig.minus, xpos: minusCenterX, ypos: minusCenterY },
      { name: 'plus', config: contentConfig.plus, xpos: plusCenterX, ypos: plusCenterY },
    ];
    const buttonTools = buttonConfigs.map((button, buttonIndex) => {
      if (button.config.mode === 'content_icon') {
        const iconConfig = Merge.mergeDeep(
          {
            id: `${this.id}-${button.name}-icon`,
            group: this.config.group,
            entity_index: this.entity_index,
            xpos: button.xpos,
            yposc: button.ypos,
            icon_size_percent: (buttonSize * button.config.content_icon.size) / 100,
            tap_action: { action: 'none' },
            styles: { 'pointer-events': 'none' },
          },
          button.config.content_icon.icon,
          { tap_action: { action: 'none' } },
        );

        return new IconTool(iconConfig, buttonIndex, this.templates, this.cardId, this.card);
      }

      const textConfig = Merge.mergeDeep(
        {
          id: `${this.id}-${button.name}-text`,
          group: this.config.group,
          entity_index: this.entity_index,
          xpos: button.xpos,
          yposc: button.ypos,
          text: button.config.content_text.text,
          tap_action: { action: 'none' },
          styles: {
            'text-anchor': 'middle',
            'dominant-baseline': 'central',
            'pointer-events': 'none',
          },
        },
        button.config.content_text,
        { tap_action: { action: 'none' } },
      );

      return new TextTool(textConfig, buttonIndex, this.templates, this.cardId, this.card);
    });

    [this.minusContentTool, this.plusContentTool] = buttonTools;

    const valueConfig = Merge.mergeDeep(
      {
        id: `${this.id}-value`,
        group: this.config.group,
        entity_index: this.entity_index,
        xpos: this.config.xpos,
        ypos: this.config.ypos,
        tap_action: { action: 'none' },
        styles: {
          'text-anchor': 'middle',
          'pointer-events': 'none',
        },
      },
      contentConfig.value,
      {
        xpos: this.config.xpos,
        ypos: this.config.ypos,
        tap_action: { action: 'none' },
      },
    );

    this.valueStateTool = new StateTool(valueConfig, 0, this.templates, this.cardId, this.card);
    this.valueMeasurementSignature = '';
    this.valueMeasurementPass = 0;
  }

  /** Updates evaluated number config and recreates child geometry when needed. */
  updateRuntimeConfig() {
    super.updateRuntimeConfig();

    if (this.configChanged) {
      this.config.svg = this.calculateSvgDimensions(this.config);
      this.createNumberContentTools();
      this.createControlLabelTextTool(this.config.width, this.config.height);
    }

    this.minusContentTool.updateRuntimeConfig();
    this.plusContentTool.updateRuntimeConfig();
    this.valueStateTool.updateRuntimeConfig();
  }

  /** Publishes entity state and builds automatic increment/decrement actions. */
  setState(entity, entityConfig) {
    super.setState(entity, entityConfig);

    const contentConfig = this.config.content[this.config.content.mode];
    const entityDomain = entity.entity_id.split('.')[0];
    this.minusActionConfig = Merge.mergeDeep(contentConfig.minus, {
      tap_action:
        contentConfig.minus.tap_action.action === 'decrement'
          ? {
              action: 'perform-action',
              perform_action: `${entityDomain}.decrement`,
              target: { entity_id: entity.entity_id },
            }
          : contentConfig.minus.tap_action,
    });
    this.plusActionConfig = Merge.mergeDeep(contentConfig.plus, {
      tap_action:
        contentConfig.plus.tap_action.action === 'increment'
          ? {
              action: 'perform-action',
              perform_action: `${entityDomain}.increment`,
              target: { entity_id: entity.entity_id },
            }
          : contentConfig.plus.tap_action,
    });

    this.minusContentTool.setState(entity, entityConfig);
    this.plusContentTool.setState(entity, entityConfig);
    this.valueStateTool.setState(entity, entityConfig);
    if (this.valueMeasurementSignature !== this.valueStateTool.textMeasurementSignature) {
      this.valueMeasurementSignature = this.valueStateTool.textMeasurementSignature;
      this.valueMeasurementPass = 0;
    }
  }

  /** Runs child measurement lifecycles after the complete control rendered. */
  updated() {
    super.updated();
    this.minusContentTool.updated();
    this.plusContentTool.updated();
    if (this.valueMeasurementPass < 5) {
      this.valueMeasurementPass += 1;
      this.valueStateTool.updated();
    }
  }

  /** Converts the configured number center through the normal group pipeline. */
  calculateSvgDimensions(config = this.config) {
    return this.card._calculateSvgCoordinatesInGroup(config);
  }

  /** Runs one immediate press animation on a complete number button group. */
  animateButtonPress(buttonGroup, center) {
    const restingTransform = `translate(${center.xpos}px, ${center.ypos}px) scale(1) translate(-${center.xpos}px, -${center.ypos}px)`;
    const pressedTransform = `translate(${center.xpos}px, ${center.ypos}px) scale(${this.config.animation.press.scale}) translate(-${center.xpos}px, -${center.ypos}px)`;

    // Repeated presses restart the same short visual response immediately.
    buttonGroup.getAnimations().forEach((animation) => animation.cancel());
    buttonGroup.animate([{ transform: restingTransform }, { transform: pressedTransform }, { transform: restingTransform }], {
      duration: this.config.animation.press.duration,
      easing: this.config.animation.press.easing,
    });
  }

  /** Renders fixed slots and centers the measured state/UOM bounding box. */
  render() {
    const contentConfig = this.config.content[this.config.content.mode];
    const geometry = this.numberGeometry;
    const backgroundWidth = Utils.calculateSvgDimension(this.config.width);
    const backgroundHeight = Utils.calculateSvgDimension(this.config.height);
    const buttonSize = Utils.calculateSvgDimension(geometry.buttonSize);
    const minusCenter = this.card._calculateSvgCoordinatesInGroup({
      group: this.config.group,
      xpos: geometry.minusCenterX,
      ypos: geometry.minusCenterY,
    });
    const plusCenter = this.card._calculateSvgCoordinatesInGroup({
      group: this.config.group,
      xpos: geometry.plusCenterX,
      ypos: geometry.plusCenterY,
    });
    const measuredValueWidth = this.valueStateTool.getWidth();
    const measuredValueHeight = this.valueStateTool.getHeight();
    const valueHeight = geometry.valueHeight * contentConfig.value.size / 100;
    const valueScale = Math.min(
      1,
      geometry.valueWidth / measuredValueWidth,
      valueHeight / measuredValueHeight,
    );
    const valueCenterX = this.valueStateTool.config.svg.xpos;
    const valueCenterY = this.valueStateTool.config.svg.ypos;
    const measuredValueCenterX = this.valueStateTool.getXpos();
    const measuredValueCenterY = this.valueStateTool.getYpos();
    const valueTransform = `translate(${valueCenterX} ${valueCenterY}) scale(${valueScale}) translate(-${measuredValueCenterX} -${measuredValueCenterY})`;
    const backgroundStyles = this.getStyles(ConfigHelper.toStyleDict(this.config.background.styles));
    const minusBackgroundStyles = this.getStyles(ConfigHelper.toStyleDict(contentConfig.minus.background.styles));
    const plusBackgroundStyles = this.getStyles(ConfigHelper.toStyleDict(contentConfig.plus.background.styles));
    const control = svg`
      <g
        class="number-control"
        transform="${this.getGroupScaleTransform()}"
        style="${this.getGroupScaleStyle()}"
      >
        <rect
          class="number-control__background"
          x="${this.config.svg.xpos - backgroundWidth / 2}"
          y="${this.config.svg.ypos - backgroundHeight / 2}"
          width="${backgroundWidth}"
          height="${backgroundHeight}"
          rx="${Utils.calculateSvgDimension(this.config.background.radius)}"
          style=${styleMap(backgroundStyles)}
        />
      </g>
    `;

    return this.renderControl(svg`
      ${control}
      <g class="number-control__minus-button">
        <rect
          class="number-control__minus-background"
          x="${minusCenter.xpos - buttonSize / 2}"
          y="${minusCenter.ypos - buttonSize / 2}"
          width="${buttonSize}"
          height="${buttonSize}"
          rx="${Utils.calculateSvgDimension(contentConfig.minus.background.radius)}"
          style=${styleMap(minusBackgroundStyles)}
        />
        ${this.minusContentTool.render()}
        <rect
          class="number-control__minus-hit-area"
          x="${minusCenter.xpos - buttonSize / 2}"
          y="${minusCenter.ypos - buttonSize / 2}"
          width="${buttonSize}"
          height="${buttonSize}"
          fill="transparent"
          style="outline: none;"
          tabindex="0"
          role="button"
          ${this.controlActionHandler(this.minusActionConfig, this.entity_index)}
          @pointerdown=${(event) => this.animateButtonPress(event.currentTarget.parentElement, minusCenter)}
          @action=${(event) => this.handleControlAction(event, this.minusActionConfig, this.entity_index)}
        />
      </g>
      <g class="number-control__value" transform="${valueTransform}">
        ${this.valueStateTool.render()}
      </g>
      <g class="number-control__plus-button">
        <rect
          class="number-control__plus-background"
          x="${plusCenter.xpos - buttonSize / 2}"
          y="${plusCenter.ypos - buttonSize / 2}"
          width="${buttonSize}"
          height="${buttonSize}"
          rx="${Utils.calculateSvgDimension(contentConfig.plus.background.radius)}"
          style=${styleMap(plusBackgroundStyles)}
        />
        ${this.plusContentTool.render()}
        <rect
          class="number-control__plus-hit-area"
          x="${plusCenter.xpos - buttonSize / 2}"
          y="${plusCenter.ypos - buttonSize / 2}"
          width="${buttonSize}"
          height="${buttonSize}"
          fill="transparent"
          style="outline: none;"
          tabindex="0"
          role="button"
          ${this.controlActionHandler(this.plusActionConfig, this.entity_index)}
          @pointerdown=${(event) => this.animateButtonPress(event.currentTarget.parentElement, plusCenter)}
          @action=${(event) => this.handleControlAction(event, this.plusActionConfig, this.entity_index)}
        />
      </g>
    `);
  }
}
