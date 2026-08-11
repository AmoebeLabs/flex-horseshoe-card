import ControlButton from './control-button.js';
import ControlNumber from './control-number.js';
import ControlSelect from './control-select.js';
import ControlSlider from './control-slider.js';
import ControlToggle from './control-toggle.js';

// const CONTROL_TYPES = {
//   toggle: ToggleControl,
//   select: SelectControl,
//   number: NumberControl,
//   button: ButtonControl,
// };

/**
 * Layout control tool that renders the configured control subtypes.
 */
export default class ControlTool {
  /**
   * Compiles subtype-owned control configuration before entity resolution.
   *
   * @param {object} config Full card configuration after static values.
   * @param {object} templates Shared template evaluator.
   */
  static compileConfig(config, templates) {
    if (config.layout.controls === undefined) return;

    config.layout.controls.forEach((control) => {
      switch (control.type) {
        case 'select':
          ControlSelect.removeDisabledOptionConfigs(control, templates);
          break;
        default:
          break;
      }
    });
  }

  /**
   * Builds control tool instances from the already normalized layout config.
   *
   * @param {object} config - Full card configuration after static card-level normalization.
   * @param {object} templates - Template resolver shared with the card.
   * @param {string} cardId - Stable card id for generated SVG ids.
   * @param {LitElement} card - Parent card instance with shared render helpers.
   * @returns {Array<ControlTool>} Configured control tool (just one!!).
   */
  // static setConfig(config, templates, cardId, card) {
  //   return [new ControlTool(config.layout.controls, 0, templates, cardId, card)];

  static setConfig(config, templates, cardId, card) {
    if (config.layout.controls === undefined) return [];

    return config.layout.controls.map((control, index) => {
      switch (control.type) {
        case 'toggle':
          return new ControlToggle(control, index, templates, cardId, card);

        case 'select':
          return new ControlSelect(control, index, templates, cardId, card);

        case 'number':
          return new ControlNumber(control, index, templates, cardId, card);

        case 'button':
          return new ControlButton(control, index, templates, cardId, card);

        case 'slider':
          return new ControlSlider(control, index, templates, cardId, card);

        default:
          throw new Error(`Unknown control type: ${control.type}`);
      }
    });
  }

  /**
   * Stores static control config and creates control subtypes
   *
   * @param {object} config - Static control item config.
   * @param {number} index - Control index inside layout.controls.
   * @param {object} templates - Template resolver shared with the card.
   * @param {string} cardId - Stable card id for generated SVG ids.
   * @param {LitElement} card - Parent card instance with shared render helpers.
   */
  // constructor(controls, index, templates, cardId, card) {
  //   super(controls, index, templates, cardId, card);

  //   this.controls = controls.map((control, controlIndex) => {
  //     switch (control.type) {
  //       case 'button':
  //         return new ControlButton(control, controlIndex, templates, cardId, card);

  //       case 'number':
  //         return new ControlNumber(control, controlIndex, templates, cardId, card);

  //       case 'select':
  //         return new ControlSelect(control, controlIndex, templates, cardId, card);

  //       case 'toggle':
  //         return new ControlToggle(control, controlIndex, templates, cardId, card);

  //       default:
  //         throw new Error(`[ControlTool] Unknown control type: ${control.type}`);
  //     }
  //   });
  // }

  // render() {
  //   return svg`
  //     <g class="controls">
  //       ${this.controls.map((control) => control.render())}
  //     </g>
  //   `;
  // }
}
