import { svg } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import ConfigHelper from './config-helper.js';
import ControlBase from './control-base.js';
import ControlContent from './control-content.js';
import IconTool from './icon-tool.js';
import Merge from './merge.js';
import TextTool from './text-tool.js';
import Utils from './utils.js';

/**
 * Stateful action button with ordinary FHS TextTool/IconTool content.
 */
export default class ControlButton extends ControlBase {
  /**
   * Completes button, visualization, state-map and content configuration.
   *
   * The constructor is the only normalization boundary. Rendering consumes the
   * completed configuration directly and never invents presentation defaults.
   */
  constructor(config, index, templates, cardId, card) {
    const DEFAULT_BUTTON_STATE_MAP = {
      map: [
        { state: 'on', active: true },
        { state: 'default', active: false },
      ],
    };
    const DEFAULT_BUTTON_CONFIG = {
      orientation: 'horizontal',
      width: 20,
      height: 10,
      tap_action: {
        action: 'toggle',
      },
      background: {
        radius: 2,
        styles: {},
      },
      content: {
        mode: 'content_horizontal',
        content_horizontal: {
          padding: { x: 2, y: 1.5 },
          gap: 3,
          icon: {
            size: 75,
            styles: {},
          },
          text: {
            text: '',
            styles: {},
          },
        },
        content_vertical: {
          padding: { x: 2, y: 1.5 },
          gap: 2,
          icon: {
            size: 75,
            styles: {},
          },
          text: {
            text: '',
            styles: {},
          },
        },
        content_icon: {
          padding: { x: 2, y: 1.5 },
          icon: {
            size: 65,
            styles: {},
          },
        },
        content_text: {
          padding: { x: 2, y: 1.5 },
          text: '',
          styles: {},
        },
      },
      show: {
        item_variant: 'default',
        item_viz: 'viz_button',
        item_style: 'filled_square',
      },
      viz_button: {
        inactive: {
          background: {
            styles: {
              fill: 'var(--secondary-background-color)',
            },
          },
          icon: {
            styles: {
              fill: 'var(--primary-text-color)',
            },
          },
          text: {
            styles: {
              fill: 'var(--primary-text-color)',
            },
          },
        },
        active: {
          background: {
            styles: {
              fill: 'var(--primary-color)',
            },
          },
          icon: {
            styles: {
              fill: 'var(--primary-background-color)',
            },
          },
          text: {
            styles: {
              fill: 'var(--primary-background-color)',
            },
          },
        },
        animation: {
          duration: 200,
          easing: 'ease-out',
        },
        press: {
          scale: 0.9,
          duration: 140,
          easing: 'ease-out',
        },
      },
      viz_line: {
        indicator: {
          position: 'bottom',
          padding: { x: 1, y: 0.75 },
          thickness: 0.75,
          radius: 0.375,
        },
        inactive: {
          background: {
            styles: {
              fill: 'var(--secondary-background-color)',
            },
          },
          indicator: {
            styles: {
              fill: 'var(--divider-color)',
            },
          },
          icon: {
            styles: {
              fill: 'var(--primary-text-color)',
            },
          },
          text: {
            styles: {
              fill: 'var(--primary-text-color)',
            },
          },
        },
        active: {
          background: {
            styles: {
              fill: 'var(--secondary-background-color)',
            },
          },
          indicator: {
            styles: {
              fill: 'var(--primary-color)',
            },
          },
          icon: {
            styles: {
              fill: 'var(--primary-color)',
            },
          },
          text: {
            styles: {
              fill: 'var(--primary-color)',
            },
          },
        },
        animation: {
          duration: 200,
          easing: 'ease-out',
        },
        press: {
          scale: 0.9,
          duration: 140,
          easing: 'ease-out',
        },
      },
    };
    const BUTTON_SURFACE_PRESETS = {
      filled: {},
      outlined: {
        background: {
          styles: { fill: 'var(--card-background-color)', stroke: 'var(--divider-color)', 'stroke-width': 0.5 },
        },
        viz_button: {
          inactive: {
            background: {
              styles: { fill: 'var(--card-background-color)', stroke: 'var(--divider-color)', 'stroke-width': 0.5 },
            },
          },
          active: {
            background: {
              styles: { fill: 'var(--primary-color)', stroke: 'none' },
            },
            icon: { styles: { fill: 'var(--primary-background-color)' } },
            text: { styles: { fill: 'var(--primary-background-color)' } },
          },
        },
        viz_line: {
          inactive: {
            background: {
              styles: { fill: 'var(--card-background-color)', stroke: 'var(--divider-color)', 'stroke-width': 0.5 },
            },
          },
          active: {
            background: {
              styles: { fill: 'var(--card-background-color)', stroke: 'var(--divider-color)', 'stroke-width': 0.5 },
            },
          },
        },
      },
    };
    const BUTTON_SHAPE_PRESETS = {
      round: { background: { radius: 5 } },
      square: { background: { radius: 2 } },
    };
    const BUTTON_STYLE_PRESETS = {
      filled_round: Merge.mergeDeep(BUTTON_SURFACE_PRESETS.filled, BUTTON_SHAPE_PRESETS.round),
      filled_square: Merge.mergeDeep(BUTTON_SURFACE_PRESETS.filled, BUTTON_SHAPE_PRESETS.square),
      outlined_round: Merge.mergeDeep(BUTTON_SURFACE_PRESETS.outlined, BUTTON_SHAPE_PRESETS.round),
      outlined_square: Merge.mergeDeep(BUTTON_SURFACE_PRESETS.outlined, BUTTON_SHAPE_PRESETS.square),
    };
    const selectedConfig = Merge.mergeDeep(DEFAULT_BUTTON_CONFIG, config);
    if (selectedConfig.show.item_variant !== 'default') {
      throw Error(`[controls] Invalid button item_variant '${selectedConfig.show.item_variant}' [default]`);
    }
    if (!['viz_button', 'viz_line'].includes(selectedConfig.show.item_viz)) {
      throw Error(`[controls] Invalid button item_viz '${selectedConfig.show.item_viz}' [viz_button, viz_line]`);
    }
    if (!Object.hasOwn(BUTTON_STYLE_PRESETS, selectedConfig.show.item_style)) {
      throw Error(`[controls] Invalid button item_style '${selectedConfig.show.item_style}' [${Object.keys(BUTTON_STYLE_PRESETS).join(', ')}]`);
    }
    const buttonConfig = Merge.mergeDeep(
      DEFAULT_BUTTON_CONFIG,
      BUTTON_STYLE_PRESETS[selectedConfig.show.item_style],
      config,
    );
    const selectedVizName = buttonConfig.show.item_viz;
    buttonConfig[selectedVizName] = Merge.mergeDeep(DEFAULT_BUTTON_CONFIG.viz_button, buttonConfig[selectedVizName]);

    // An explicit state map replaces the default map instead of concatenating
    // arrays through the normal deep-merge behavior.
    buttonConfig.state_map = config.state_map === undefined ? DEFAULT_BUTTON_STATE_MAP : Merge.mergeDeep({}, config.state_map);

    super(buttonConfig, index, templates, cardId, card);

    this.config.svg = this.calculateSvgDimensions();
    this.active = false;
    this.contentTextTool = undefined;
    this.contentIconTool = undefined;
    this.contentVisual = undefined;
    this.contentTextBaseStyles = undefined;
    this.contentIconBaseStyles = undefined;
    this.createButtonContentTools();
    this.createControlLabelTextTool(this.config.width, this.config.height);
  }

  /**
   * Creates the configured TextTool and/or IconTool inside the button bounds.
   *
   * Content orientation is independent from the button itself. The active mode
   * chooses one completed content dictionary and controls only its inner layout.
   */
  createButtonContentTools() {
    // Dynamic JavaScript config may rebuild the stack; release child-owned
    // history subscriptions and timers before replacing it.
    this.contentVisual?.disconnected();
    const contentMode = this.config.content.mode;
    const contentConfig = this.config.content[contentMode];
    const hasIcon = ['content_horizontal', 'content_vertical', 'content_icon'].includes(contentMode);
    const hasText = ['content_horizontal', 'content_vertical', 'content_text'].includes(contentMode);
    const verticalContent = contentMode === 'content_vertical';
    const contentWidth = this.config.width - contentConfig.padding.x * 2;
    let contentHeight = this.config.height - contentConfig.padding.y * 2;
    let contentYpos = this.config.ypos;

    // A line visualization owns one edge of the button. Remove that strip from
    // the content bounds and center all content in the remaining area.
    if (this.config.show.item_viz === 'viz_line') {
      const vizLine = this.config.viz_line;
      const lineSpace = vizLine.indicator.padding.y + vizLine.indicator.thickness;

      contentHeight -= lineSpace;
      contentYpos += vizLine.indicator.position === 'top' ? lineSpace / 2 : -lineSpace / 2;
    }

    if (contentConfig.items !== undefined) {
      if (!['content_horizontal', 'content_vertical'].includes(contentMode)) {
        throw Error('[controls] Explicit button content items require content_horizontal or content_vertical');
      }

      this.contentIconTool = undefined;
      this.contentTextTool = undefined;
      this.contentVisual = new ControlContent(
        contentConfig,
        contentMode === 'content_vertical' ? 'vertical' : 'horizontal',
        {
          xpos: this.config.xpos,
          ypos: contentYpos,
          width: this.config.width,
          height: contentHeight,
          group: this.config.group,
        },
        {},
        this.entity_index,
        `${this.id}-content`,
        this.templates,
        this.cardId,
        this.card,
      );
      return;
    }

    this.contentVisual = undefined;
    const iconConfigPart = contentConfig.icon;
    const textConfigPart = contentMode === 'content_text' ? contentConfig : contentConfig.text;
    const iconSize = hasIcon ? (Math.min(contentWidth, contentHeight) * iconConfigPart.size) / 100 : 0;
    const textMaximumWidth = hasIcon && hasText && !verticalContent ? contentWidth - iconSize - contentConfig.gap : contentWidth;
    const iconXpos = hasIcon && hasText && !verticalContent ? this.config.xpos - (textMaximumWidth + contentConfig.gap) / 2 : this.config.xpos;
    const iconYpos = hasIcon && hasText && verticalContent ? contentYpos - (iconSize + contentConfig.gap) / 2 : contentYpos;
    const textXpos = hasIcon && hasText && !verticalContent ? this.config.xpos + (iconSize + contentConfig.gap) / 2 : this.config.xpos;
    const textYpos = hasIcon && hasText && verticalContent ? contentYpos + (iconSize + contentConfig.gap) / 2 : contentYpos;

    if (hasIcon) {
      const iconToolConfig = Merge.mergeDeep(
        {
          id: `${this.id}-icon`,
          group: this.config.group,
          entity_index: this.entity_index,
          xpos: iconXpos,
          yposc: iconYpos,
          icon_size_percent: iconSize,
          tap_action: {
            action: 'none',
          },
          styles: {
            'pointer-events': 'none',
          },
        },
        iconConfigPart,
        {
          xpos: iconXpos,
          yposc: iconYpos,
          icon_size_percent: iconSize,
          tap_action: {
            action: 'none',
          },
        },
      );

      delete iconToolConfig.size;
      this.contentIconBaseStyles = ConfigHelper.toStyleDict(iconToolConfig.styles);
      this.contentIconTool = new IconTool(iconToolConfig, 0, this.templates, this.cardId, this.card);
    } else {
      this.contentIconBaseStyles = undefined;
      this.contentIconTool = undefined;
    }

    if (hasText) {
      const textToolConfig = Merge.mergeDeep(
        {
          id: `${this.id}-text`,
          group: this.config.group,
          entity_index: this.entity_index,
          xpos: textXpos,
          yposc: textYpos,
          text_overflow: {
            mode: 'fit',
            fit: {
              max_width: textMaximumWidth,
            },
          },
          tap_action: {
            action: 'none',
          },
          styles: {
            'text-anchor': 'middle',
            'dominant-baseline': 'central',
            'pointer-events': 'none',
          },
        },
        textConfigPart,
        {
          xpos: textXpos,
          yposc: textYpos,
          tap_action: {
            action: 'none',
          },
        },
      );

      delete textToolConfig.padding;
      this.contentTextBaseStyles = ConfigHelper.toStyleDict(textToolConfig.styles);
      this.contentTextTool = new TextTool(textToolConfig, 0, this.templates, this.cardId, this.card);
    } else {
      this.contentTextBaseStyles = undefined;
      this.contentTextTool = undefined;
    }
  }

  /**
   * Rebuilds button geometry and child tools after evaluated config changes.
   */
  updateRuntimeConfig() {
    super.updateRuntimeConfig();

    if (this.configChanged) {
      this.config.svg = this.calculateSvgDimensions(this.config);
      this.createButtonContentTools();
      this.createControlLabelTextTool(this.config.width, this.config.height);
    }

    if (this.contentVisual) this.contentVisual.updateRuntimeConfig();
    if (this.contentIconTool) this.contentIconTool.updateRuntimeConfig();
    if (this.contentTextTool) this.contentTextTool.updateRuntimeConfig();
  }

  /** Initializes an entityless command button with its inactive visualization. */
  setStaticState() {
    super.setStaticState();

    const viz = this.config[this.config.show.item_viz];
    const visualState = viz.inactive;
    const transition = viz.animation.duration + 'ms ' + viz.animation.easing;

    this.active = false;

    if (this.contentVisual) this.contentVisual.setState(visualState, transition);

    if (this.contentIconTool) {
      this.contentIconTool.config.styles = Merge.mergeDeep(ConfigHelper.toStyleDict(visualState.icon.styles), this.contentIconBaseStyles, {
        transition: 'fill ' + transition + ', color ' + transition + ', opacity ' + transition,
      });
      this.contentIconTool.setStaticState();
    }

    if (this.contentTextTool) {
      this.contentTextTool.config.styles = Merge.mergeDeep(ConfigHelper.toStyleDict(visualState.text.styles), this.contentTextBaseStyles, {
        transition: 'fill ' + transition + ', color ' + transition + ', opacity ' + transition,
      });
      this.contentTextTool.setStaticState();
    }
  }

  /**
   * Selects active/inactive visualization and publishes state to child tools.
   */
  setState(entity, entityConfig) {
    super.setState(entity, entityConfig);

    const stateMapItem = this.config.state_map.map.find((item) => String(item.state) === String(entity.state)) ?? this.config.state_map.map.find((item) => item.state === 'default');
    const viz = this.config[this.config.show.item_viz];
    const visualState = stateMapItem.active ? viz.active : viz.inactive;
    const transition = `${viz.animation.duration}ms ${viz.animation.easing}`;

    this.active = stateMapItem.active;

    if (this.contentVisual) this.contentVisual.setState(visualState, transition);

    if (this.contentIconTool) {
      this.contentIconTool.config.styles = Merge.mergeDeep(ConfigHelper.toStyleDict(visualState.icon.styles), this.contentIconBaseStyles, {
        transition: `fill ${transition}, color ${transition}, opacity ${transition}`,
      });
      this.contentIconTool.setState(entity, entityConfig);
    }

    if (this.contentTextTool) {
      this.contentTextTool.config.styles = Merge.mergeDeep(ConfigHelper.toStyleDict(visualState.text.styles), this.contentTextBaseStyles, {
        transition: `fill ${transition}, color ${transition}, opacity ${transition}`,
      });
      this.contentTextTool.setState(entity, entityConfig);
    }
  }

  /**
   * Runs ordinary child-tool post-render lifecycles.
   */
  updated() {
    super.updated();
    if (this.contentVisual) this.contentVisual.updated();
    if (this.contentIconTool) this.contentIconTool.updated();
    if (this.contentTextTool) this.contentTextTool.updated();
  }

  /** Forwards first-render work to explicit visual content. */
  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    if (this.contentVisual) this.contentVisual.firstUpdated(changedProperties);
  }

  /** Forwards initial Home Assistant availability to explicit visual content. */
  hassAvailable() {
    super.hassAvailable();
    if (this.contentVisual) this.contentVisual.hassAvailable();
  }

  /** Forwards DOM connection to explicit visual content. */
  connected() {
    super.connected();
    if (this.contentVisual) this.contentVisual.connected();
  }

  /** Stops timers and listeners owned by explicit visual content. */
  disconnected() {
    if (this.contentVisual) this.contentVisual.disconnected();
    super.disconnected();
  }

  /** Forwards Home Assistant reconnects to explicit visual content. */
  hassConnected() {
    super.hassConnected();
    if (this.contentVisual) this.contentVisual.hassConnected();
  }

  /** Includes explicit visual children in the card's update decision. */
  requiresHassUpdate() {
    return super.requiresHassUpdate() || (this.contentVisual && this.contentVisual.requiresHassUpdate());
  }

  /**
   * Converts the button center through the ordinary group pipeline.
   */
  calculateSvgDimensions(config = this.config) {
    return this.card.cardLayout.calculateSvgCoordinatesInGroup(config);
  }

  /**
   * Runs one immediate press animation around the complete button center.
   */
  animateButtonPress(buttonGroup) {
    const center = this.config.svg;
    const press = this.config[this.config.show.item_viz].press;
    const restingTransform = `translate(${center.xpos}px, ${center.ypos}px) scale(1) translate(-${center.xpos}px, -${center.ypos}px)`;
    const pressedTransform = `translate(${center.xpos}px, ${center.ypos}px) scale(${press.scale}) translate(-${center.xpos}px, -${center.ypos}px)`;

    buttonGroup.getAnimations().forEach((animation) => animation.cancel());
    buttonGroup.animate([{ transform: restingTransform }, { transform: pressedTransform }, { transform: restingTransform }], {
      duration: press.duration,
      easing: press.easing,
    });
  }

  /**
   * Renders state visualization, child content and one authoritative hit area.
   */
  render() {
    const vizName = this.config.show.item_viz;
    const viz = this.config[vizName];
    const visualState = this.active ? viz.active : viz.inactive;
    const transition = `${viz.animation.duration}ms ${viz.animation.easing}`;
    const width = Utils.calculateSvgDimension(this.config.width);
    const height = Utils.calculateSvgDimension(this.config.height);
    const x = this.config.svg.xpos - width / 2;
    const y = this.config.svg.ypos - height / 2;
    const backgroundStyles = this.getStyles(
      Merge.mergeDeep(ConfigHelper.toStyleDict(this.config.background.styles), ConfigHelper.toStyleDict(visualState.background.styles), {
        transition: `fill ${transition}, stroke ${transition}, opacity ${transition}`,
      }),
    );
    let indicator = svg``;

    if (this.config.show.item_viz === 'viz_line') {
      const indicatorPaddingX = Utils.calculateSvgDimension(viz.indicator.padding.x);
      const indicatorPaddingY = Utils.calculateSvgDimension(viz.indicator.padding.y);
      const indicatorThickness = Utils.calculateSvgDimension(viz.indicator.thickness);
      const indicatorWidth = width - indicatorPaddingX * 2;
      const indicatorY = viz.indicator.position === 'top' ? y + indicatorPaddingY : y + height - indicatorPaddingY - indicatorThickness;
      const indicatorStyles = this.getStyles(
        Merge.mergeDeep(ConfigHelper.toStyleDict(visualState.indicator.styles), {
          transition: `fill ${transition}, stroke ${transition}, opacity ${transition}`,
          'pointer-events': 'none',
        }),
      );

      indicator = svg`
        <rect
          class="button-control__indicator"
          x="${x + indicatorPaddingX}"
          y="${indicatorY}"
          width="${indicatorWidth}"
          height="${indicatorThickness}"
          rx="${Utils.calculateSvgDimension(viz.indicator.radius)}"
          style=${styleMap(indicatorStyles)}
        />
      `;
    }

    const button = svg`
      <g
        class="button-control"
        transform="${this.getGroupScaleTransform()}"
        style="${this.getGroupScaleStyle()}"
      >
        <rect
          class="button-control__background"
          x="${x}"
          y="${y}"
          width="${width}"
          height="${height}"
          rx="${Utils.calculateSvgDimension(this.config.background.radius)}"
          style=${styleMap(backgroundStyles)}
        />
        ${indicator}
      </g>
    `;

    const control = svg`
      <g class="button-control__press">
        ${button}
        ${this.contentVisual?.render()}
        ${this.contentIconTool?.render()}
        ${this.contentTextTool?.render()}
        <rect
          class="button-control__hit-area"
          x="${x}"
          y="${y}"
          width="${width}"
          height="${height}"
          fill="transparent"
          style="outline: none;"
          tabindex="0"
          role="button"
          ${this.controlActionHandler(this.config, this.entity_index)}
          @pointerdown=${(event) => this.animateButtonPress(event.currentTarget.parentElement)}
          @action=${(event) => this.handleControlAction(event, this.config, this.entity_index)}
        />
      </g>
    `;

    return this.renderControl(control);
  }
}
