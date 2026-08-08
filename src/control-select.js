// control-toggle.js

import ControlBase from './control-base.js';
import Merge from './merge.js';

export default class SelectControl extends ControlBase {
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
    const DEFAULT_SELECT_CONFIG = {
      orientation: 'horizontal',

      background: {
        width: 34,
        height: 11,
        radius: 5,
        styles: {},
      },

      track: {
        width: 32,
        height: 10,
        styles: {},
      },

      option_map: [],

      content: {
        mode: 'content_horizontal',

        content_horizontal: {
          padding: 1,
          gap: 5,

          icon: {
            // default icon config
            styles: {},
          },

          text: {
            text_overflow: {
              mode: 'fit',

              fit: {
                max_width: 15,
              },
            },

            styles: {},
          },
        },
      },

      show: {
        item_viz: 'viz_button',
      },

      viz_button: {
        background: {
          styles: {},
        },

        track: {
          styles: {},
        },

        indicator: {
          radius: 2,

          styles: {
            fill: 'var(--switch-checked-track-color)',
          },
        },

        selected: {
          background: {
            styles: {},
          },

          icon: {
            styles: {},
          },

          text: {
            styles: {},
          },
        },

        unselected: {
          background: {
            styles: {},
          },

          icon: {
            styles: {},
          },

          text: {
            styles: {},
          },
        },

        animation: {
          duration: 250,
          easing: 'ease-out',
        },
      },
    };
    let selectConfig = Merge.mergeDeep(DEFAULT_SELECT_CONFIG, config);

    super(selectConfig, index, templates, cardId, card);

    this.config.svg = this.calculateSvgDimensions();
    this.createControlLabelTextTool(this.config.background.width, this.config.background.height);
  }

  /**
   * Converts select config coordinates to SVG coordinates.
   *
   * @param {object} config - Static or runtime area config.
   * @returns {object} SVG coordinates.
   */
  /** Updates select runtime config and its shared label. */
  updateRuntimeConfig() {
    super.updateRuntimeConfig();

    if (this.configChanged) {
      this.config.svg = this.calculateSvgDimensions(this.config);
      this.createControlLabelTextTool(this.config.background.width, this.config.background.height);
    }
  }

  calculateSvgDimensions(config = this.config) {
    const svgDimensions = this.card._calculateSvgCoordinatesInGroup(config);

    return svgDimensions;
  }

  render() {
    return this.renderControlLabel();
  }
}
