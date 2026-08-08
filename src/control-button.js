// control-toggle.js

import ControlBase from './control-base.js';
import Merge from './merge.js';

export default class ButtonControl extends ControlBase {
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
    const DEFAULT_BUTTON_CONFIG = {
      orientation: 'horizontal',

      width: 20,
      height: 10,

      background: {
        styles: {},
      },

      content: {
        mode: 'content_horizontal',

        content_horizontal: {
          gap: 5,
          padding: 1,

          icon: {
            styles: {},
          },

          text: {
            text_overflow: {
              mode: 'fit',

              fit: {
                max_width: 'auto',
              },
            },

            styles: {},
          },
        },

        content_icon: {
          icon: {
            styles: {},
          },
        },

        content_text: {
          text: '',
          styles: {},
        },
      },

      show: {
        viz: 'viz_button',
      },

      viz_button: {
        background: {
          styles: {},
        },

        content: {
          styles: {},
        },

        animation: {
          duration: 250,
          easing: 'ease-out',
        },
      },

      viz_line: {
        styles: {},
      },

      viz_dot: {
        styles: {},
      },
    };
    let buttonConfig = Merge.mergeDeep(DEFAULT_BUTTON_CONFIG, config);

    super(buttonConfig, index, templates, cardId, card);

    this.config.svg = this.calculateSvgDimensions();
    this.createControlLabelTextTool(this.config.width, this.config.height);
  }

  /**
   * Converts select config coordinates to SVG coordinates.
   *
   * @param {object} config - Static or runtime area config.
   * @returns {object} SVG coordinates.
   */
  /** Updates button runtime config and its shared label. */
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
