import { svg } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';

import Merge from './merge';
import Utils from './utils';
import BaseTool from './base-tool';

/** ****************************************************************************
 * SwitchTool class
 *
 * Summary.
 *
 *
 * NTS:
 * - .mdc-switch__native-control uses:
 *     - width: 68px, 17em
 *     - height: 48px, 12em
 * - and if checked (.mdc-switch--checked):
 *     - transform: translateX(-20px)
 *
 * .mdc-switch.mdc-switch--checked .mdc-switch__thumb {
 *  background-color: var(--switch-checked-button-color);
 *  border-color: var(--switch-checked-button-color);
 *
 */

export default class SwitchTool extends BaseTool {
  constructor(argToolset, argConfig, argPos) {
    const DEFAULT_SWITCH_CONFIG = {
      position: {
        cx: 50,
        cy: 50,
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
      },
      classes: {
        tool: {
          'sak-switch': true,
          hover: true,
        },
        track: {
          'sak-switch__track': true,
        },
        thumb: {
          'sak-switch__thumb': true,
        },
      },
      styles: {
        tool: {
          overflow: 'visible',
        },
        track: {},
        thumb: {},
      },
    };

    const HORIZONTAL_SWITCH_CONFIG = {
      animations: [
        {
          state: 'on',
          id: 1,
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
        {
          state: 'off',
          id: 0,
          styles: {
            track: {
              fill: 'var(--switch-unchecked-track-color)',
              'pointer-events': 'auto',
            },
            thumb: {
              fill: 'var(--switch-unchecked-button-color)',
              transform: 'translateX(-4.5em)',
              'pointer-events': 'auto',
            },
          },
        },
      ],
    };

    const VERTICAL_SWITCH_CONFIG = {
      animations: [
        {
          state: 'on',
          id: 1,
          styles: {
            track: {
              fill: 'var(--switch-checked-track-color)',
              'pointer-events': 'auto',
            },
            thumb: {
              fill: 'var(--switch-checked-button-color)',
              transform: 'translateY(-4.5em)',
              'pointer-events': 'auto',
            },
          },
        },
        {
          state: 'off',
          id: 0,
          styles: {
            track: {
              fill: 'var(--switch-unchecked-track-color)',
              'pointer-events': 'auto',
            },
            thumb: {
              fill: 'var(--switch-unchecked-button-color)',
              transform: 'translateY(4.5em)',
              'pointer-events': 'auto',
            },
          },
        },
      ],
    };

    super(argToolset, Merge.mergeDeep(DEFAULT_SWITCH_CONFIG, argConfig), argPos);

    if (!['horizontal', 'vertical'].includes(this.config.position.orientation)) throw Error('SwitchTool::constructor - invalid orientation [vertical, horizontal] = ', this.config.position.orientation);

    this.svg.track = {};
    this.svg.track.radius = Utils.calculateSvgDimension(this.config.position.track.radius);

    this.svg.thumb = {};
    this.svg.thumb.radius = Utils.calculateSvgDimension(this.config.position.thumb.radius);
    this.svg.thumb.offset = Utils.calculateSvgDimension(this.config.position.thumb.offset);

    switch (this.config.position.orientation) {
      // eslint-disable-next-line default-case-last
      default:
      case 'horizontal':
        this.config = Merge.mergeDeep(DEFAULT_SWITCH_CONFIG, HORIZONTAL_SWITCH_CONFIG, argConfig);

        this.svg.track.width = Utils.calculateSvgDimension(this.config.position.track.width);
        this.svg.track.height = Utils.calculateSvgDimension(this.config.position.track.height);
        this.svg.thumb.width = Utils.calculateSvgDimension(this.config.position.thumb.width);
        this.svg.thumb.height = Utils.calculateSvgDimension(this.config.position.thumb.height);

        this.svg.track.x1 = this.svg.cx - this.svg.track.width / 2;
        this.svg.track.y1 = this.svg.cy - this.svg.track.height / 2;

        this.svg.thumb.x1 = this.svg.cx - this.svg.thumb.width / 2;
        this.svg.thumb.y1 = this.svg.cy - this.svg.thumb.height / 2;
        break;

      case 'vertical':
        this.config = Merge.mergeDeep(DEFAULT_SWITCH_CONFIG, VERTICAL_SWITCH_CONFIG, argConfig);

        this.svg.track.width = Utils.calculateSvgDimension(this.config.position.track.height);
        this.svg.track.height = Utils.calculateSvgDimension(this.config.position.track.width);
        this.svg.thumb.width = Utils.calculateSvgDimension(this.config.position.thumb.height);
        this.svg.thumb.height = Utils.calculateSvgDimension(this.config.position.thumb.width);

        this.svg.track.x1 = this.svg.cx - this.svg.track.width / 2;
        this.svg.track.y1 = this.svg.cy - this.svg.track.height / 2;

        this.svg.thumb.x1 = this.svg.cx - this.svg.thumb.width / 2;
        this.svg.thumb.y1 = this.svg.cy - this.svg.thumb.height / 2;
        break;
    }

    this.classes.track = {};
    this.classes.thumb = {};

    this.styles.track = {};
    this.styles.thumb = {};
    if (this.dev.debug) console.log('SwitchTool constructor config, svg', this.toolId, this.config, this.svg);
  }

  /** *****************************************************************************
   * SwitchTool::value()
   *
   * Summary.
   * Receive new state data for the entity this switch is linked to. Called from set hass;
   *
   */
  set value(state) {
    super.value = state;
  }

  /**
   * SwitchTool::_renderSwitch()
   *
   * Summary.
   * Renders the switch using precalculated coordinates and dimensions.
   * Only the runtime style is calculated before rendering the switch
   *
   */

  _renderSwitch() {
    this.MergeAnimationClassIfChanged();
    // this.MergeColorFromState(this.styles);
    this.MergeAnimationStyleIfChanged(this.styles);
    // this.MergeAnimationStyleIfChanged(this.styles.thumb);

    return svg`
      <g>
        <rect class="${classMap(this.classes.track)}" x="${this.svg.track.x1}" y="${this.svg.track.y1}"
          width="${this.svg.track.width}" height="${this.svg.track.height}" rx="${this.svg.track.radius}"
          style="${styleMap(this.styles.track)}"
        />
        <rect class="${classMap(this.classes.thumb)}" x="${this.svg.thumb.x1}" y="${this.svg.thumb.y1}"
          width="${this.svg.thumb.width}" height="${this.svg.thumb.height}" rx="${this.svg.thumb.radius}" 
          style="${styleMap(this.styles.thumb)}"
        />
      </g>
      `;
  }

  /** *****************************************************************************
   * SwitchTool::render()
   *
   * Summary.
   * The render() function for this object.
   *
   * https://codepen.io/joegaffey/pen/vrVZaN
   *
   */

  render() {
    return svg`
      <g id="switch-${this.toolId}" transform-origin="${this.svg.cx} ${this.svg.cy}"
        class="${classMap(this.classes.tool)}" style="${styleMap(this.styles.tool)}"
        @click=${(e) => this.handleTapEvent(e, this.config)}>
        ${this._renderSwitch()}
      </g>
    `;
  }
} // END of class
