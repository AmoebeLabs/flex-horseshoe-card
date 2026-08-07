// control-toggle.js
import { svg } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import { ref } from 'lit/directives/ref.js';
import BaseTool from './base-tool.js';
import ConfigHelper from './config-helper.js';
import Merge from './merge.js';
import Utils from './utils.js';

export default class ToggleControl extends BaseTool {
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
    if (!['horizontal', 'vertical'].includes(toggleConfig.orientation)) throw Error('SwitchTool::constructor - invalid orientation [vertical, horizontal] = ', toggleConfig.orientation);

    super(toggleConfig, index, templates, cardId, card, 'controls', 'controls', undefined, { fill: true, stroke: false });

    this.config.svg = this.calculateSvgDimensions();
  }

  /**
   * Converts toggle config coordinates to SVG coordinates.
   *
   * @param {object} config - Static or runtime area config.
   * @returns {object} SVG coordinates.
   */
  calculateSvgDimensions(config = this.config) {
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
    return this.renderItemLayers(svg`
      <g
        transform="${this.getGroupScaleTransform()}"
        style="${this.getGroupScaleStyle()}"
          ${this.actionHandler()}
          @action=${(event) => this.handleAction(event)}
      >
        ${this._renderToggle()}
      </g>
    `);
  }
}
