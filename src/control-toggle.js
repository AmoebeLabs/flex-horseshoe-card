// control-toggle.js
import { svg } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import ControlBase from './control-base.js';
import IconTool from './icon-tool.js';
import Merge from './merge.js';
import Utils from './utils.js';
import { SVG_VIEW_BOX } from './const.js';

const DEFAULT_TOGGLE_CONFIG = {
  orientation: 'horizontal',
  show: {
    item_variant: 'switch',
    item_viz: 'default',
    item_style: 'ha',
  },
  ha: {},
  ios: {},
  industrial: {},
  tap_action: {
    action: 'toggle',
  },
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
    mode: 'content_none',

    content_icon: {
      size: 75,
      icon: {
        // default icon config
      },
    },
  },
};

const HORIZONTAL_TOGGLE_CONFIG = {
  animation: {
    duration: 250,
    easing: 'ease-out',
    states: {
      on: {
        track: {
          styles: {
            fill: 'var(--switch-checked-track-color)',
            'pointer-events': 'auto',
          },
        },
        thumb: {
          fill: 'var(--switch-checked-button-color)',
          transform: 'translateX(4.5em)',
          'pointer-events': 'auto',
        },
      },
      off: {
        styles: {
          track: {
            fill: 'var(--switch-checked-track-color)',
            'pointer-events': 'auto',
          },
          thumb: {
            fill: 'var(--switch-checked-button-color)',
            transform: 'translateX(4.5em)',
            'pointer-events': 'auto',
          },
        },
      },
    },
  },
};

const VERTICAL_TOGGLE_CONFIG = {
  animation: {
    duration: 250,
    easing: 'ease-out',
    on: {
      track: {
        styles: {
          fill: 'var(--switch-checked-track-color)',
          'pointer-events': 'auto',
        },
      },
      thumb: {
        fill: 'var(--switch-checked-button-color)',
        transform: 'translateY(4.5em)',
        'pointer-events': 'auto',
      },
    },
    off: {
      styles: {
        track: {
          fill: 'var(--switch-checked-track-color)',
          'pointer-events': 'auto',
        },
        thumb: {
          fill: 'var(--switch-checked-button-color)',
          transform: 'translateY(4.5em)',
          'pointer-events': 'auto',
        },
      },
    },
  },
};

const SWITCH_STYLES = {
  // === 1. IOS STYLE ===
  ios: {
    vbH: 26,
    vbW: 50,
    xOn: 26,
    xOff: 2,
    knobY: 2,
    knobW: 22,
    knobH: 22,
    knobRx: 11,
    trackY: 0,
    trackH: 26,
    trackRx: 13,
    checked: {
      track: { styles: { fill: '#34C759', opacity: '1.0' } },
      thumb: { styles: { fill: '#FFFFFF', opacity: '1.0' } },
    },
    unchecked: {
      track: { styles: { fill: '#E9E9EA', opacity: '1.0' } },
      thumb: { styles: { fill: '#FFFFFF', opacity: '1.0' } },
    },
  },

  // === 2. HOME ASSISTANT STYLE ===
  ha: {
    vbH: 26,
    vbW: 50,
    xOn: 30,
    xOff: 0,
    knobY: 3,
    knobW: 20,
    knobH: 20,
    knobRx: 10,
    trackY: 6,
    trackH: 14,
    trackRx: 7,
    shadow: {
      x: '-20%',
      y: '-20%',
      width: '140%',
      height: '140%',
      dx: 0,
      dy: 1,
      stdDeviation: 1,
      color: '#000000',
      opacity: 0.2,
    },
    checked: {
      track: { styles: { fill: 'var(--switch-checked-track-color, #4ad66d)' } },
      thumb: { styles: { fill: 'var(--switch-checked-button-color, #ffffff)' } },
    },
    unchecked: {
      track: { styles: { fill: 'var(--switch-unchecked-track-color, #9b9b9b)', opacity: '0.6' } }, // Dim the track in the off state.
      thumb: { styles: { fill: 'var(--switch-unchecked-button-color, #ffffff)' } },
    },
  },

  // === 3. INDUSTRIAL RETRO STYLE ===
  industrial: {
    vbH: 26,
    vbW: 50,
    xOn: 26,
    xOff: 2,
    knobY: 2,
    knobW: 22,
    knobH: 22,
    knobRx: 0,
    trackY: 0,
    trackH: 26,
    trackRx: 0,
    checked: {
      track: { styles: { fill: '#D32F2F', stroke: '#FFCDD2', 'stroke-width': '0.5' } }, // The checked outline reinforces the industrial state.
      thumb: { styles: { fill: '#FFFFFF' } },
    },
    unchecked: {
      track: { styles: { fill: '#212121' } },
      thumb: { styles: { fill: '#B0BEC5' } },
    },
  },
};


/** Native switch presets with ordinary IconTool content in the moving thumb. */
export default class ControlToggle extends ControlBase {
  /**
   * Completes orientation defaults, then the selected native switch preset.
   * Toggle templates keep their existing pre-preset item context.
   */
  static translateConfig(config, forTemplateContext = false) {
    const selectedConfig = Merge.mergeDeep(DEFAULT_TOGGLE_CONFIG, config);
    const orientationConfig = selectedConfig.orientation === 'vertical'
      ? VERTICAL_TOGGLE_CONFIG : HORIZONTAL_TOGGLE_CONFIG;
    const toggleConfig = Merge.mergeDeep(DEFAULT_TOGGLE_CONFIG, orientationConfig, config);
    if (forTemplateContext) return toggleConfig;

    if (!['horizontal', 'vertical'].includes(toggleConfig.orientation)) {
      throw Error(`ToggleTool::validateOrientation - invalid orientation '${toggleConfig.orientation}' [horizontal, vertical]`);
    }
    if (toggleConfig.show.item_variant !== 'switch') {
      throw Error(`[controls] Invalid toggle item_variant '${toggleConfig.show.item_variant}' [switch]`);
    }
    if (toggleConfig.show.item_viz !== 'default') {
      throw Error(`[controls] Invalid toggle item_viz '${toggleConfig.show.item_viz}' [default]`);
    }
    if (!Object.hasOwn(SWITCH_STYLES, toggleConfig.show.item_style)) {
      throw Error(`[controls] Invalid toggle item_style '${toggleConfig.show.item_style}' [${Object.keys(SWITCH_STYLES).join(', ')}]`);
    }
    const styleName = toggleConfig.show.item_style;
    toggleConfig[styleName] = Merge.mergeDeep(SWITCH_STYLES[styleName], toggleConfig[styleName]);
    return toggleConfig;
  }

  /** Stores Toggle config; JavaScript-configured content waits for HA evaluation. */
  constructor(config, index, templates, cardId, card) {
    super(Merge.mergeDeep({
      orientation: DEFAULT_TOGGLE_CONFIG.orientation,
      show: DEFAULT_TOGGLE_CONFIG.show,
    }, config), index, templates, cardId, card, ControlToggle.translateConfig);
    this.geometry = {};
    this.shadowFilterId = `${this.cardId}-${this.id}-toggle-shadow`;
    this.iconTool = undefined;
    if (!this.hasJavascript) {
      this.geometry = this.calculateToggleGeometry();
      this.createThumbIconTool();
      this.createControlLabelTextTool(
        this.geometry.svg.width * 100 / SVG_VIEW_BOX,
        this.geometry.svg.height * 100 / SVG_VIEW_BOX,
      );
    }
  }

  /**
   * Creates the IconTool rendered inside the moving thumb group.
   *
   * The complete evaluated icon config comes from this.config. Only the configured
   * thumb position, relative size and non-interactive action are added here.
   */
  createThumbIconTool() {
    this.getContentTools().forEach((tool) => tool.disconnected());
    if (this.config.content.mode !== 'content_icon') {
      this.iconTool = undefined;
      return;
    }

    const iconConfig = Merge.mergeDeep(
      {
        id: `${this.id}-icon`,
        entity_index: this.entity_index,
        xpos: 50,
        yposc: 50,
        icon_size_percent: this.config.content.content_icon.size,
        tap_action: {
          action: 'none',
        },
      },
      this.config.content.content_icon.icon,
      {
        tap_action: {
          action: 'none',
        },
      },
    );

    this.iconTool = new IconTool(iconConfig, 0, this.templates, this.cardId, this.card);
    this.activateContentTools();
  }

  /** Returns the optional icon rendered on the toggle thumb. */
  getContentTools() {
    return this.iconTool ? [this.iconTool] : [];
  }

  /**
   * Calculates native track/thumb coordinates and the grouped SVG placement.
   * Checked/unchecked styles stay in config; state only selects their positions.
   */
  calculateToggleGeometry() {
    const viz = this.config[this.config.show.item_style];
    const vertical = this.config.orientation === 'vertical';
    return {
      svg: this.calculateSvgDimensions(),
      svgVbW: vertical ? viz.vbH : viz.vbW,
      svgVbH: vertical ? viz.vbW : viz.vbH,
      renderTrackX: vertical ? viz.trackY : 0,
      renderTrackY: vertical ? 0 : viz.trackY,
      renderTrackWidth: vertical ? viz.trackH : viz.vbW,
      renderTrackHeight: vertical ? viz.vbW : viz.trackH,
      on: { knobX: vertical ? viz.knobY : viz.xOn, knobY: vertical ? viz.xOn : viz.knobY },
      off: { knobX: vertical ? viz.knobY : viz.xOff, knobY: vertical ? viz.xOff : viz.knobY },
    };
  }

  /** Repositions the Toggle and recreates its icon/label when config or group changes. */
  updateRuntimeConfig() {
    super.updateRuntimeConfig();
    if (this.configurationChanged || this.groupChanged) {
      this.geometry = this.calculateToggleGeometry();
      this.createThumbIconTool();
      this.createControlLabelTextTool(
        this.geometry.svg.width * 100 / SVG_VIEW_BOX,
        this.geometry.svg.height * 100 / SVG_VIEW_BOX,
      );
    }
    if (this.iconTool) this.iconTool.updateRuntimeConfig();
  }

  /** Selects the Toggle state and updates the thumb icon with its configured entity. */
  setState(entity, entityConfig) {
    super.setState(entity, entityConfig);

    if (this.iconTool) {
      this.iconTool.setEntities(this.card.runtimeEntityConfigs, this.card.entities);
    }
  }


  /** Finishes loading the thumb icon after rendering. */
  updated() {
    super.updated();
    if (this.iconTool) {
      this.iconTool.updated();
    }
  }

  /**
   * Fits the selected preset's native viewBox into the configured control size
   * and converts its center through the card's group geometry.
   *
   * @param {object} config - Static or runtime toggle configuration.
   * @returns {object} SVG position and dimensions.
   */
  calculateSvgDimensions(config = this.config) {
    const svgDimensions = this.card.cardLayout.calculateSvgCoordinatesInGroup(config);
    const viz = config[config.show.item_style];

    const svgVbW = config.orientation === 'vertical' ? viz.vbH : viz.vbW;
    const svgVbH = config.orientation === 'vertical' ? viz.vbW : viz.vbH;
    const configuredSize = Utils.calculateSvgDimension(config.width);
    svgDimensions.width = config.orientation === 'vertical' ? (configuredSize * svgVbW) / svgVbH : configuredSize;
    svgDimensions.height = config.orientation === 'vertical' ? configuredSize : (configuredSize * svgVbH) / svgVbW;
    svgDimensions.x = svgDimensions.xpos - svgDimensions.width / 2;
    svgDimensions.y = svgDimensions.ypos - svgDimensions.height / 2;

    return svgDimensions;
  }

  /** Builds the native-viewBox track, thumb and optional icon for the current state. */
  _renderToggle() {
    const styleName = this.config.show.item_style;
    const geometry = this.geometry;
    const isOn = this.runtime.entity.state === 'on';
    const viz = this.config[styleName];
    const position = isOn ? geometry.on : geometry.off;
    const visualState = isOn ? viz.checked : viz.unchecked;
    const transition = `${this.config.animation.duration}ms ${this.config.animation.easing}`;

    const trackStyles = this.getStyles(
      Merge.mergeDeep({}, visualState.track.styles, {
        transition: `fill ${transition}, stroke ${transition}, opacity ${transition}`,
      }),
    );
    const knobStyles = this.getStyles(Merge.mergeDeep(
      visualState.thumb.styles,
      viz.shadow === undefined ? {} : { filter: `url(#${this.shadowFilterId})` },
    ));
    const thumbPositionStyles = {
      transform: `translate(${position.knobX}px, ${position.knobY}px)`,
      transition: `transform ${transition}`,
      'pointer-events': 'none',
    };
    const thumbIcon = this.config.content.mode === 'content_icon' ? this.iconTool.render() : svg``;

    return svg`
      <g
        transform="${this.getGroupScaleTransform()}"
        style="${this.getGroupScaleStyle()}"
      >
        <g class="toggle-style-animation">
          <svg
            x="${geometry.svg.x}"
            y="${geometry.svg.y}"
            width="${geometry.svg.width}"
            height="${geometry.svg.height}"
            viewBox="0 0 ${geometry.svgVbW} ${geometry.svgVbH}"
            style="overflow: visible;"
          >
          <g class="toggle-scale">
            <svg viewBox="0 0 ${geometry.svgVbW} ${geometry.svgVbH}" style="width: 100%; height: auto; display: block; overflow: visible;">

              ${
                viz.shadow !== undefined
                  ? svg`
                <defs>
                  <filter
                    id="${this.shadowFilterId}"
                    x="${viz.shadow.x}"
                    y="${viz.shadow.y}"
                    width="${viz.shadow.width}"
                    height="${viz.shadow.height}"
                    color-interpolation-filters="sRGB"
                  >
                    <feGaussianBlur in="SourceAlpha" stdDeviation="${viz.shadow.stdDeviation}" result="shadow-blur" />
                    <feOffset in="shadow-blur" dx="${viz.shadow.dx}" dy="${viz.shadow.dy}" result="shadow-offset" />
                    <feFlood flood-color="${viz.shadow.color}" flood-opacity="${viz.shadow.opacity}" result="shadow-color" />
                    <feComposite in="shadow-color" in2="shadow-offset" operator="in" result="shadow" />
                    <feMerge>
                      <feMergeNode in="shadow" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
              `
                  : svg``
              }

              <!-- De Track -->
              <rect
                x="${geometry.renderTrackX}" y="${geometry.renderTrackY}"
                width="${geometry.renderTrackWidth}" height="${geometry.renderTrackHeight}"
                rx="${viz.trackRx}"
                style=${styleMap(trackStyles)}
              />

              <!-- De Knop / Thumb (Beweegt netjes mee over de X of Y as) -->
              <!-- The thumb and its real IconTool share one animated position group. -->
              <g class="toggle-thumb-position" style=${styleMap(thumbPositionStyles)}>
                <rect
                  x="0" y="0"
                  width="${viz.knobW}" height="${viz.knobH}"
                  rx="${viz.knobRx}"
                  style=${styleMap(knobStyles)}
                />
                <g
                  class="toggle-thumb-icon"
                  transform="translate(${(viz.knobW - Math.min(viz.knobW, viz.knobH)) / 2} ${(viz.knobH - Math.min(viz.knobW, viz.knobH)) / 2}) scale(${Math.min(viz.knobW, viz.knobH) / SVG_VIEW_BOX})"
                  pointer-events="none"
                >
                  ${thumbIcon}
                </g>
              </g>
            </svg>
            </g>
          </g>
        </g>
        </svg>
      </g>
      `;
  }

  /** Renders the prepared toggle visualization inside the shared control shell. */
  render() {
    if (this.hasJavascript && !this.runtimeConfigInitialized) return svg``;
    const toggle = svg`
      <g
        transform="${this.getGroupScaleTransform()}"
        style="${this.getGroupScaleStyle()}"
          ${this.controlActionHandler(this.config, this.entity_index)}
          @action=${(event) => this.handleControlAction(event, this.config, this.entity_index)}
      >
        ${this._renderToggle()}
      </g>
    `;

    return this.renderControl(toggle);
  }
}
