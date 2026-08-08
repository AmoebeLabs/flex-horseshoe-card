// control-toggle.js

import ControlBase from './control-base.js';
import Merge from './merge.js';

export default class NumberControl extends ControlBase {
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
    const DEFAULT_NUMBER_CONFIG = {
      orientation: 'horizontal',

      width: 30,
      height: 10,

      background: {
        styles: {},
      },

      content: {
        mode: 'content_horizontal',

        content_horizontal: {
          minus: {
            mode: 'content_text',

            content_text: {
              text: '-',
              styles: {},
            },

            content_icon: {
              icon: {
                icon: 'mdi-minus',
                icon_size: 1,
                styles: {},
              },
            },
          },

          value: {
            text_overflow: {
              mode: 'fit',

              fit: {
                max_width: 15,
              },
            },

            styles: {},
          },

          plus: {
            mode: 'content_text',

            content_text: {
              text: '+',
              styles: {},
            },

            content_icon: {
              icon: {
                icon: 'mdi-plus',
                icon_size: 1,
                styles: {},
              },
            },
          },
        },
      },
    };
    let numberConfig = Merge.mergeDeep(DEFAULT_NUMBER_CONFIG, config);

    super(numberConfig, index, templates, cardId, card);

    this.config.svg = this.calculateSvgDimensions();
    this.createControlLabelTextTool(this.config.width, this.config.height);
  }

  /**
   * Converts select config coordinates to SVG coordinates.
   *
   * @param {object} config - Static or runtime area config.
   * @returns {object} SVG coordinates.
   */
  /** Updates number runtime config and its shared label. */
  updateRuntimeConfig() {
    super.updateRuntimeConfig();

    if (this.configChanged) {
      this.config.svg = this.calculateSvgDimensions(this.config);
      this.createControlLabelTextTool(this.config.width, this.config.height);
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
