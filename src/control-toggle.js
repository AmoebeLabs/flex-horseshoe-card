// control-toggle.js
import { svg } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import { ref } from 'lit/directives/ref.js';
import ControlBase from './control-base.js';
import ConfigHelper from './config-helper.js';
import IconTool from './icon-tool.js';
import Merge from './merge.js';
import Utils from './utils.js';
import { SVG_VIEW_BOX } from './const.js';

export default class ControlToggle extends ControlBase {
  /**
   * Stores static control config and creates control subtypes
   *
   * @param {object} config - Static control item config.
   * @param {number} index - Control index inside layout.controls.
   * @param {object} templates - Template resolver shared with the card.
   * @param {string} cardId - Stable card id for generated SVG ids.
   * @param {LitElement} card - Parent card instance with shared render helpers.
   */

  constructor(config, index, templates, cardId, card) {
    const DEFAULT_TOGGLE_CONFIG = {
      orientation: 'horizontal',
      show: {
        item_viz: 'ha',
      },
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

    let toggleConfig;
    switch (config.orientation) {
      // eslint-disable-next-line default-case-last
      default:
      case 'horizontal':
        toggleConfig = Merge.mergeDeep(DEFAULT_TOGGLE_CONFIG, HORIZONTAL_TOGGLE_CONFIG, config);
        break;
      case 'vertical':
        toggleConfig = Merge.mergeDeep(DEFAULT_TOGGLE_CONFIG, VERTICAL_TOGGLE_CONFIG, config);
        break;
    }

    super(toggleConfig, index, templates, cardId, card);
    this.validateOrientation(toggleConfig.orientation);
    this.config = this.buildConfig(toggleConfig);
    this.config.svg = this.calculateSvgDimensions();
    this.createThumbIconTool();
    this.createControlLabelTextTool(
      this.config.orientation === 'vertical' ? (this.config.width * this.config[this.config.show.item_viz].svgVbW) / this.config[this.config.show.item_viz].svgVbH : this.config.width,
      this.config.orientation === 'vertical' ? this.config.width : (this.config.width * this.config[this.config.show.item_viz].svgVbH) / this.config[this.config.show.item_viz].svgVbW,
    );
  }

  /**
   * Creates the IconTool rendered inside the moving thumb group.
   *
   * The complete evaluated icon config comes from this.config. Only the configured
   * thumb position, relative size and non-interactive action are added here.
   */
  createThumbIconTool() {
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
  }

  buildConfig(config) {
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
          icon: { styles: { fill: '#FFFFFF', opacity: '1.0' } },
        },
        unchecked: {
          track: { styles: { fill: '#E9E9EA', opacity: '1.0' } },
          thumb: { styles: { fill: '#FFFFFF', opacity: '1.0' } },
          icon: { styles: { fill: '#8E8E93', opacity: '0.8' } }, // Subtiel transparant icoon bij 'uit'
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
          icon: { styles: { fill: 'var(--primary-color, #2196F3)' } },
        },
        unchecked: {
          track: { styles: { fill: 'var(--switch-unchecked-track-color, #9b9b9b)', opacity: '0.6' } }, // Track dimt bij 'uit'
          thumb: { styles: { fill: 'var(--switch-unchecked-button-color, #ffffff)' } },
          icon: { styles: { fill: '#757575', opacity: '0.5' } },
        },
      },

      // === 3. INDUSTRIEEL RETRO STYLE ===
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
          track: { styles: { fill: '#D32F2F', stroke: '#FFCDD2', 'stroke-width': '0.5' } }, // Extra stroke bij 'aan'
          thumb: { styles: { fill: '#FFFFFF' } },
          icon: { styles: { fill: '#D32F2F' } },
        },
        unchecked: {
          track: { styles: { fill: '#212121' } },
          thumb: { styles: { fill: '#B0BEC5' } },
          icon: { styles: { fill: '#455A64' } },
        },
      },
    };

    // 1. Pak de naam van de actieve stijl (bijv. 'whatever' of 'ha')
    const vizName = config.show.item_viz;

    // 2. Als config[vizName] nog niet bestaat in de YAML (bijv. bij een standaard preset),
    // dan maken we hem nu leeg aan zodat we er waarden in kunnen schrijven.
    if (!config[vizName]) {
      config[vizName] = {};
    }

    const customYaml = config[vizName];

    // 3. De juiste base-bepaling:
    // Kijk welke 'base' IN het stijl-object gedefinieerd staat (customYaml.base).
    // Als die er niet is, is de stijlnaam zelf de basis (bijv. 'ios'). Fallback is 'ha'.
    const baseName = customYaml.base || (SWITCH_STYLES[vizName] ? vizName : 'ha');
    const chosenBase = SWITCH_STYLES[baseName] || SWITCH_STYLES.ha;

    const isVertical = config.orientation === 'vertical';

    // 4. Voer de diepe merge uit direct IN het config[vizName] object!
    // We starten met de hardcoded basismal, mergen wat er al in customYaml stond,
    // en tot slot eventuele losse root-overrides. Everything merges into config[vizName].
    config[vizName] = Merge.mergeDeep(config[vizName], chosenBase, customYaml);

    // config[vizName] = Merge.mergeDeep(config[vizName], chosenBase, customYaml, {
    //   xOn: config[vizName].xOn,
    //   xOff: config[vizName].xOff,
    //   knobY: config[vizName].knobY,
    //   knobW: config[vizName].knobW,
    //   knobH: config[vizName].knobH,
    //   knobRx: config[vizName].knobRx,
    //   trackY: config[vizName].trackY,
    //   trackH: config[vizName].trackH,
    //   trackRx: config[vizName].trackRx,
    // });

    // 5. Bereken alle statische maten direct binnen config[vizName]
    const posStatic = config[vizName].knobY;
    const trackW = isVertical ? config[vizName].trackH : config[vizName].vbW;
    const trackH = isVertical ? config[vizName].vbW : config[vizName].trackH;

    // 6. Schrijf alle berekende layout-waarden direct weg in config[vizName]
    if (config[vizName].shadow !== undefined) {
      config[vizName].shadow.id = `${this.cardId}-${this.id}-toggle-shadow`;
      const shadowFilter = { filter: `url(#${config[vizName].shadow.id})` };

      config[vizName].checked.thumb.styles = Merge.mergeDeep(config[vizName].checked.thumb.styles, shadowFilter);
      config[vizName].unchecked.thumb.styles = Merge.mergeDeep(config[vizName].unchecked.thumb.styles, shadowFilter);
    }
    config[vizName].svgVbW = isVertical ? config[vizName].vbH : config[vizName].vbW;
    config[vizName].svgVbH = isVertical ? config[vizName].vbW : config[vizName].vbH;

    config[vizName].renderTrackX = isVertical ? config[vizName].trackY : 0;
    config[vizName].renderTrackY = isVertical ? 0 : config[vizName].trackY;
    config[vizName].renderTrackWidth = trackW;
    config[vizName].renderTrackHeight = trackH;

    // 7. Bouw de runtime objecten (on/off) op binnen config[vizName] voor Lit's styleMap
    config[vizName].on = {
      knobX: isVertical ? posStatic : config[vizName].xOn,
      knobY: isVertical ? config[vizName].xOn : posStatic,
      trackStyles: config[vizName].checked?.track?.styles || {},
      thumbStyles: config[vizName].checked?.thumb?.styles || {},
      iconStyles: config[vizName].checked?.icon?.styles || {},
    };

    config[vizName].off = {
      knobX: isVertical ? posStatic : config[vizName].xOff,
      knobY: isVertical ? config[vizName].xOff : posStatic,
      trackStyles: config[vizName].unchecked?.track?.styles || {},
      thumbStyles: config[vizName].unchecked?.thumb?.styles || {},
      iconStyles: config[vizName].unchecked?.icon?.styles || {},
    };

    if (config[vizName].icon) {
      // Bereken hoeveel procent van de knop het icoon mag innemen (bijv. 65%)
      const iconCoverage = 0.65;

      // 1. Bereken de dynamische schaalfactor op basis van de huidige knopgrootte
      const iconScale = (config[vizName].knobW * iconCoverage) / 24;

      // 2. Bereken de exacte verschuiving om het icoon perfect te centreren binnen deze specifieke knop
      const iconTranslateX = (config[vizName].knobW - 24 * iconScale) / 2 / iconScale;
      const iconTranslateY = (config[vizName].knobH - 24 * iconScale) / 2 / iconScale;

      // 3. Sla de kant-en-klare transformatie-string op in de config
      config[vizName].iconTransform = `scale(${iconScale}) translate(${iconTranslateX} ${iconTranslateY})`;
    } else {
      config[vizName].iconTransform = '';
    }
    return config;
  }

  /* Validates the configured toggle orientation at config/runtime boundaries.
   *
   * @param {string} orientation - Line orientation from config.
   */
  validateOrientation(orientation) {
    if (!['horizontal', 'vertical'].includes(orientation)) {
      throw Error(`ToggleTool::validateOrientation - invalid orientation '${orientation}' [horizontal, vertical]`);
    }
  }

  /** Updates toggle configuration and geometry before entity data is assigned. */
  updateRuntimeConfig() {
    super.updateRuntimeConfig();

    if (this.configChanged) {
      this.config = this.buildConfig(this.config);
      this.validateOrientation(this.config.orientation);
      this.config.svg = this.calculateSvgDimensions(this.config);
      this.createThumbIconTool();
      this.createControlLabelTextTool(
        this.config.orientation === 'vertical' ? (this.config.width * this.config[this.config.show.item_viz].svgVbW) / this.config[this.config.show.item_viz].svgVbH : this.config.width,
        this.config.orientation === 'vertical' ? this.config.width : (this.config.width * this.config[this.config.show.item_viz].svgVbH) / this.config[this.config.show.item_viz].svgVbW,
      );
    }
  }

  /**
   * Converts toggle config coordinates to SVG coordinates.
   *
   * @param {object} config - Static or runtime area config.
   * @returns {object} SVG coordinates.
   */
  /** Publishes the toggle entity to the internal IconTool. */
  setState(entity, entityConfig) {
    super.setState(entity, entityConfig);

    if (this.config.content.mode === 'content_icon') {
      this.iconTool.setState(entity, entityConfig);
    }
  }

  /** Runs the normal IconTool post-render lifecycle. */
  updated() {
    super.updated();
    if (this.config.content.mode === 'content_icon') {
      this.iconTool.updated();
    }
  }

  calculateSvgDimensions(config = this.config) {
    const svgDimensions = this.card._calculateSvgCoordinatesInGroup(config);
    const viz = config[config.show.item_viz];

    const configuredSize = Utils.calculateSvgDimension(config.width);
    svgDimensions.width = config.orientation === 'vertical' ? (configuredSize * viz.svgVbW) / viz.svgVbH : configuredSize;
    svgDimensions.height = config.orientation === 'vertical' ? configuredSize : (configuredSize * viz.svgVbH) / viz.svgVbW;
    svgDimensions.x = svgDimensions.xpos - svgDimensions.width / 2;
    svgDimensions.y = svgDimensions.ypos - svgDimensions.height / 2;

    return svgDimensions;
  }

  calculateSvgDimensionsV1(config = this.config) {
    const svgDimensions = this.card._calculateSvgCoordinatesInGroup(config);

    svgDimensions.track = {};
    svgDimensions.track.radius = Utils.calculateSvgDimension(config.track.radius);

    svgDimensions.thumb = {};
    svgDimensions.thumb.radius = Utils.calculateSvgDimension(config.thumb.radius);
    svgDimensions.thumb.offset = Utils.calculateSvgDimension(config.thumb.offset);

    switch (config.orientation) {
      // eslint-disable-next-line default-case-last
      default:
      case 'horizontal':
        // this.config = Merge.mergeDeep(DEFAULT_SWITCH_CONFIG, HORIZONTAL_SWITCH_CONFIG, argConfig);

        svgDimensions.track.width = Utils.calculateSvgDimension(config.track.width);
        svgDimensions.track.height = Utils.calculateSvgDimension(config.track.height);
        svgDimensions.thumb.width = Utils.calculateSvgDimension(config.thumb.width);
        svgDimensions.thumb.height = Utils.calculateSvgDimension(config.thumb.height);

        svgDimensions.track.x1 = svgDimensions.xpos - svgDimensions.track.width / 2;
        svgDimensions.track.y1 = svgDimensions.ypos - svgDimensions.track.height / 2;

        svgDimensions.thumb.x1 = svgDimensions.xpos - svgDimensions.thumb.width / 2;
        svgDimensions.thumb.y1 = svgDimensions.ypos - svgDimensions.thumb.height / 2;
        break;

      case 'vertical':
        // this.config = Merge.mergeDeep(DEFAULT_SWITCH_CONFIG, VERTICAL_SWITCH_CONFIG, argConfig);

        svgDimensions.track.width = Utils.calculateSvgDimension(config.track.height);
        svgDimensions.track.height = Utils.calculateSvgDimension(config.track.width);
        svgDimensions.thumb.width = Utils.calculateSvgDimension(config.thumb.height);
        svgDimensions.thumb.height = Utils.calculateSvgDimension(config.thumb.width);

        svgDimensions.track.x1 = svgDimensions.xpos - svgDimensions.track.width / 2;
        svgDimensions.track.y1 = svgDimensions.ypos - svgDimensions.track.height / 2;

        svgDimensions.thumb.x1 = svgDimensions.xpos - svgDimensions.thumb.width / 2;
        svgDimensions.thumb.y1 = svgDimensions.ypos - svgDimensions.thumb.height / 2;
        break;
    }

    return svgDimensions;
  }

  /**
   * SwitchTool::_renderSwitch()
   *
   * Summary.
   * Renders the switch using precalculated coordinates and dimensions.
   * Only the runtime style is calculated before rendering the switch
   *
   */

  // _renderSwitch() {
  //   return svg`
  //     <g>
  //       <rect class="${classMap(this.classes.track)}" x="${this.svg.track.x1}" y="${this.svg.track.y1}"
  //         width="${this.svg.track.width}" height="${this.svg.track.height}" rx="${this.svg.track.radius}"
  //         style="${styleMap(this.styles.track)}"
  //       />
  //       <rect class="${classMap(this.classes.thumb)}" x="${this.svg.thumb.x1}" y="${this.svg.thumb.y1}"
  //         width="${this.svg.thumb.width}" height="${this.svg.thumb.height}" rx="${this.svg.thumb.radius}"
  //         style="${styleMap(this.styles.thumb)}"
  //       />
  //     </g>
  //     `;
  // }

  /** *****************************************************************************
   * SwitchTool::render()
   *
   * Summary.
   * The render() function for this object.
   *
   * https://codepen.io/joegaffey/pen/vrVZaN
   *
   */

  _renderToggle() {
    const vizName = this.config.show.item_viz;
    const itemConfig = this.config;
    const isOn = this.entity.state === 'on';
    const viz = this.config[vizName];
    const runtime = isOn ? viz.on : viz.off;
    const transition = `${this.config.animation.duration}ms ${this.config.animation.easing}`;

    const trackStyles = this.getStyles(
      Merge.mergeDeep({}, runtime.trackStyles, {
        transition: `fill ${transition}, stroke ${transition}, opacity ${transition}`,
      }),
    );
    const knobStyles = this.getStyles(runtime.thumbStyles);
    const thumbPositionStyles = {
      transform: `translate(${runtime.knobX}px, ${runtime.knobY}px)`,
      transition: `transform ${transition}`,
      'pointer-events': 'none',
    };
    const thumbIcon = this.config.content.mode === 'content_icon' ? this.iconTool.render() : svg``;

    return this.renderItemLayers(svg`
      <g
        transform="${this.getGroupScaleTransform()}"
        style="${this.getGroupScaleStyle()}"
      >
        <g class="toggle-style-animation">
          <svg
            x="${itemConfig.svg.x}"
            y="${itemConfig.svg.y}"
            width="${itemConfig.svg.width}"
            height="${itemConfig.svg.height}"
            viewBox="0 0 ${viz.svgVbW} ${viz.svgVbH}"
            style="overflow: visible;"
          >
          <g class="toggle-scale">
            <svg viewBox="0 0 ${viz.svgVbW} ${viz.svgVbH}" style="width: 100%; height: auto; display: block; overflow: visible;">

              ${
                viz.shadow !== undefined
                  ? svg`
                <defs>
                  <filter
                    id="${viz.shadow.id}"
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
                x="${viz.renderTrackX}" y="${viz.renderTrackY}"
                width="${viz.renderTrackWidth}" height="${viz.renderTrackHeight}"
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
      `);
  }

  _renderToggleV1() {
    const toggleStyles = {
      // 'stroke-linecap': 'round',
      // stroke: 'var(--primary-text-color)',
      // opacity: '1.0',
      // 'stroke-width': '2',
    };
    const stylesTrack = this.getStyles(toggleStyles);
    this.applyColorStops(stylesTrack);
    const stylesThumb = this.getStyles(toggleStyles);
    this.applyColorStops(stylesThumb);

    console.log('renderToggle - config', this.config.svg);
    return svg`
      <g>
        <rect class="toggle-control--track" x="${this.config.svg.track.x1}" y="${this.config.svg.track.y1}"
          width="${this.config.svg.track.width}" height="${this.config.svg.track.height}" rx="${this.config.svg.track.radius}"
          style=${styleMap(this.getRenderStyles(stylesTrack))}
        />
        <rect class="toggle-control--thumb" x="${this.config.svg.thumb.x1}" y="${this.config.svg.thumb.y1}"
          width="${this.config.svg.thumb.width}" height="${this.config.svg.thumb.height}" rx="${this.config.svg.thumb.radius}"
          style=${styleMap(this.getRenderStyles(stylesThumb))}
        />

      </g>
      `;
  }

  render() {
    const toggle = this.renderItemLayers(svg`
      <g
        transform="${this.getGroupScaleTransform()}"
        style="${this.getGroupScaleStyle()}"
          ${this.actionHandler()}
          @action=${(event) => this.handleAction(event)}
      >
        ${this._renderToggle()}
      </g>
    `);

    return svg`${this.renderControlLabel()}${toggle}`;
  }
}
