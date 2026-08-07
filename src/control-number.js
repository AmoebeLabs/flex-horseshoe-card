// control-toggle.js

import BaseTool from './base-tool.js';
import Merge from './merge.js';

export default class NumberControl extends BaseTool {
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

    super(numberConfig, index, templates, cardId, card, 'controls', 'controls', undefined, { fill: true, stroke: false });

    this.config.svg = this.calculateSvgDimensions();
  }

  /**
   * Converts select config coordinates to SVG coordinates.
   *
   * @param {object} config - Static or runtime area config.
   * @returns {object} SVG coordinates.
   */
  calculateSvgDimensions(config = this.config) {
    const svgDimensions = this.card._calculateSvgCoordinatesInGroup(config);

    return svgDimensions;
  }

  render() {
    return null;
  }
}
