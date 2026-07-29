import { svg } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';

import { fireEvent } from './frontend_mods/common/dom/fire_event';

import Merge from './merge';
import Utils from './utils';
import BaseTool from './base-tool';

/** ***************************************************************************
 * RangeSliderTool::constructor class
 *
 * Summary.
 *
 */

export default class RangeSliderTool extends BaseTool {
  constructor(argToolset, argConfig, argPos) {
    const DEFAULT_RANGESLIDER_CONFIG = {
      descr: 'none',
      position: {
        cx: 50,
        cy: 50,
        orientation: 'horizontal',
        active: {
          width: 0,
          height: 0,
          radius: 0,
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
        label: {
          placement: 'none',
        },
      },
      show: {
        uom: 'end',
        active: false,
      },
      classes: {
        tool: {
          'sak-slider': true,
          hover: true,
        },
        capture: {
          'sak-slider__capture': true,
        },
        active: {
          'sak-slider__active': true,
        },
        track: {
          'sak-slider__track': true,
        },
        thumb: {
          'sak-slider__thumb': true,
        },
        label: {
          'sak-slider__value': true,
        },
        uom: {
          'sak-slider__uom': true,
        },
      },
      styles: {
        tool: {},
        capture: {},
        active: {},
        track: {},
        thumb: {},
        label: {},
        uom: {},
      },
    };

    super(argToolset, Merge.mergeDeep(DEFAULT_RANGESLIDER_CONFIG, argConfig), argPos);

    this.svg.activeTrack = {};
    this.svg.activeTrack.radius = Utils.calculateSvgDimension(this.config.position.active.radius);
    this.svg.activeTrack.height = Utils.calculateSvgDimension(this.config.position.active.height);
    this.svg.activeTrack.width = Utils.calculateSvgDimension(this.config.position.active.width);

    this.svg.track = {};
    this.svg.track.radius = Utils.calculateSvgDimension(this.config.position.track.radius);

    this.svg.thumb = {};
    this.svg.thumb.radius = Utils.calculateSvgDimension(this.config.position.thumb.radius);
    this.svg.thumb.offset = Utils.calculateSvgDimension(this.config.position.thumb.offset);

    this.svg.capture = {};

    this.svg.label = {};

    switch (this.config.position.orientation) {
      case 'horizontal':
      case 'vertical':
        this.svg.capture.width = Utils.calculateSvgDimension(this.config.position.capture.width || 1.1 * this.config.position.track.width);
        this.svg.capture.height = Utils.calculateSvgDimension(this.config.position.capture.height || 3 * this.config.position.thumb.height);

        this.svg.track.width = Utils.calculateSvgDimension(this.config.position.track.width);
        this.svg.track.height = Utils.calculateSvgDimension(this.config.position.track.height);

        this.svg.thumb.width = Utils.calculateSvgDimension(this.config.position.thumb.width);
        this.svg.thumb.height = Utils.calculateSvgDimension(this.config.position.thumb.height);

        // x1, y1 = topleft corner
        this.svg.capture.x1 = this.svg.cx - this.svg.capture.width / 2;
        this.svg.capture.y1 = this.svg.cy - this.svg.capture.height / 2;

        // x1, y1 = topleft corner
        this.svg.track.x1 = this.svg.cx - this.svg.track.width / 2;
        this.svg.track.y1 = this.svg.cy - this.svg.track.height / 2;

        // x1, y1 = topleft corner
        this.svg.activeTrack.x1 = this.config.position.orientation === 'horizontal' ? this.svg.track.x1 : this.svg.cx - this.svg.activeTrack.width / 2;
        this.svg.activeTrack.y1 = this.svg.cy - this.svg.activeTrack.height / 2;
        // this.svg.activeTrack.x1 = this.svg.track.x1;

        this.svg.thumb.x1 = this.svg.cx - this.svg.thumb.width / 2;
        this.svg.thumb.y1 = this.svg.cy - this.svg.thumb.height / 2;
        break;

      default:
        console.error('RangeSliderTool - constructor: invalid orientation [vertical, horizontal] = ', this.config.position.orientation);
        throw Error('RangeSliderTool::constructor - invalid orientation [vertical, horizontal] = ', this.config.position.orientation);
    }

    switch (this.config.position.orientation) {
      case 'vertical':
        this.svg.track.y2 = this.svg.cy + this.svg.track.height / 2;
        this.svg.activeTrack.y2 = this.svg.track.y2;
        break;
      default:
    }
    switch (this.config.position.label.placement) {
      case 'position':
        this.svg.label.cx = Utils.calculateSvgCoordinate(this.config.position.label.cx, 0);
        this.svg.label.cy = Utils.calculateSvgCoordinate(this.config.position.label.cy, 0);
        break;

      case 'thumb':
        this.svg.label.cx = this.svg.cx;
        this.svg.label.cy = this.svg.cy;
        break;

      case 'none':
        break;

      default:
        console.error('RangeSliderTool - constructor: invalid label placement [none, position, thumb] = ', this.config.position.label.placement);
        throw Error('RangeSliderTool::constructor - invalid label placement [none, position, thumb] = ', this.config.position.label.placement);
    }

    // Init classes
    this.classes.capture = {};
    this.classes.track = {};
    this.classes.thumb = {};
    this.classes.label = {};
    this.classes.uom = {};

    // Init styles
    this.styles.capture = {};
    this.styles.track = {};
    this.styles.thumb = {};
    this.styles.label = {};
    this.styles.uom = {};

    // Init scale
    this.svg.scale = {};
    this.svg.scale.min = this.valueToSvg(this, this.config.scale.min);
    this.svg.scale.max = this.valueToSvg(this, this.config.scale.max);
    this.svg.scale.step = this.config.scale.step;

    if (this.dev.debug) console.log('RangeSliderTool constructor coords, dimensions', this.coords, this.dimensions, this.svg, this.config);
  }

  /** *****************************************************************************
   * RangeSliderTool::svgCoordinateToSliderValue()
   *
   * Summary.
   * @returns {slider value} Translated svg coordinate to actual slider value
   *
   */

  svgCoordinateToSliderValue(argThis, m) {
    let state;
    let scalePos;
    let xpos;
    let ypos;

    switch (argThis.config.position.orientation) {
      case 'horizontal':
        xpos = m.x - argThis.svg.track.x1 - this.svg.thumb.width / 2;
        scalePos = xpos / (argThis.svg.track.width - this.svg.thumb.width);
        break;

      case 'vertical':
        // y is calculated from lower y value. So slider is from bottom to top...
        ypos = argThis.svg.track.y2 - this.svg.thumb.height / 2 - m.y;
        scalePos = ypos / (argThis.svg.track.height - this.svg.thumb.height);
        break;

      default:
    }
    state = (argThis.config.scale.max - argThis.config.scale.min) * scalePos + argThis.config.scale.min;
    state = Math.round(state / this.svg.scale.step) * this.svg.scale.step;
    state = Math.max(Math.min(this.config.scale.max, state), this.config.scale.min);

    return state;
  }

  valueToSvg(argThis, argValue) {
    if (argThis.config.position.orientation === 'horizontal') {
      const state = Utils.calculateValueBetween(argThis.config.scale.min, argThis.config.scale.max, argValue);

      const xposp = state * (argThis.svg.track.width - this.svg.thumb.width);
      const xpos = argThis.svg.track.x1 + this.svg.thumb.width / 2 + xposp;
      return xpos;
    } else if (argThis.config.position.orientation === 'vertical') {
      const state = Utils.calculateValueBetween(argThis.config.scale.min, argThis.config.scale.max, argValue);

      const yposp = state * (argThis.svg.track.height - this.svg.thumb.height);
      const ypos = argThis.svg.track.y2 - this.svg.thumb.height / 2 - yposp;
      return ypos;
    }
  }

  updateValue(argThis, m) {
    this._value = this.svgCoordinateToSliderValue(argThis, m);
    // set dist to 0 to cancel animation frame
    const dist = 0;
    // improvement
    if (Math.abs(dist) < 0.01) {
      if (this.rid) {
        window.cancelAnimationFrame(this.rid);
        this.rid = null;
      }
    }
  }

  updateThumb(argThis, m) {
    switch (argThis.config.position.orientation) {
      // eslint-disable-next-line default-case-last
      default:
      case 'horizontal':
        if (this.config.position.label.placement === 'thumb') {
        }

        if (this.dragging) {
          const yUp = this.config.position.label.placement === 'thumb' ? -50 : 0;
          const yUpStr = `translate(${m.x - this.svg.cx}px , ${yUp}px)`;

          argThis.elements.thumbGroup.style.transform = yUpStr;
        } else {
          argThis.elements.thumbGroup.style.transform = `translate(${m.x - this.svg.cx}px, ${0}px)`;
        }
        break;

      case 'vertical':
        if (this.dragging) {
          const xUp = this.config.position.label.placement === 'thumb' ? -50 : 0;
          const xUpStr = `translate(${xUp}px, ${m.y - this.svg.cy}px)`;
          argThis.elements.thumbGroup.style.transform = xUpStr;
        } else {
          argThis.elements.thumbGroup.style.transform = `translate(${0}px, ${m.y - this.svg.cy}px)`;
        }
        break;
    }

    argThis.updateLabel(argThis, m);
  }

  updateActiveTrack(argThis, m) {
    if (!argThis.config.show.active) return;

    switch (argThis.config.position.orientation) {
      // eslint-disable-next-line default-case-last
      default:
      case 'horizontal':
        if (this.dragging) {
          argThis.elements.activeTrack.setAttribute('width', Math.abs(this.svg.activeTrack.x1 - m.x + this.svg.cx));
        }
        break;

      case 'vertical':
        if (this.dragging) {
          argThis.elements.activeTrack.setAttribute('y', m.y - this.svg.cy);
          argThis.elements.activeTrack.setAttribute('height', Math.abs(argThis.svg.activeTrack.y2 - m.y + this.svg.cx));
        }
        break;
    }
  }

  updateLabel(argThis, m) {
    if (this.dev.debug) console.log('SLIDER - updateLabel start', m, argThis.config.position.orientation);

    const dec = this._card.config.entities[this.defaultEntityIndex()].decimals || 0;
    const x = 10 ** dec;
    argThis.labelValue2 = (Math.round(argThis.svgCoordinateToSliderValue(argThis, m) * x) / x).toFixed(dec);

    if (this.config.position.label.placement !== 'none') {
      argThis.elements.label.textContent = argThis.labelValue2;
    }
  }

  /*
   * mouseEventToPoint
   *
   * Translate mouse/touch client window coordinates to SVG window coordinates
   *
   */
  // mouseEventToPoint(e) {
  //   var p = this.elements.svg.createSVGPoint();
  //   p.x = e.touches ? e.touches[0].clientX : e.clientX;
  //   p.y = e.touches ? e.touches[0].clientY : e.clientY;
  //   const ctm = this.elements.svg.getScreenCTM().inverse();
  //   var p = p.matrixTransform(ctm);
  //   return p;
  // }
  mouseEventToPoint(e) {
    let p = this.elements.svg.createSVGPoint();
    p.x = e.touches ? e.touches[0].clientX : e.clientX;
    p.y = e.touches ? e.touches[0].clientY : e.clientY;
    const ctm = this.elements.svg.getScreenCTM().inverse();
    p = p.matrixTransform(ctm);
    return p;
  }

  callDragService() {
    if (typeof this.labelValue2 === 'undefined') return;

    if (this.labelValuePrev !== this.labelValue2) {
      this.labelValuePrev = this.labelValue2;

      this._processTapEvent(this._card, this._card._hass, this.config, this.config.user_actions.tap_action, this._card.config.entities[this.defaultEntityIndex()]?.entity, this.labelValue2);
    }
    if (this.dragging) this.timeOutId = setTimeout(() => this.callDragService(), this.config.user_actions.drag_action.update_interval);
  }

  callTapService() {
    if (typeof this.labelValue2 === 'undefined') return;

    if (this.labelValuePrev !== this.labelValue2) {
      this.labelValuePrev = this.labelValue2;

      this._processTapEvent(this._card, this._card._hass, this.config, this.config.user_actions?.tap_action, this._card.config.entities[this.defaultEntityIndex()]?.entity, this.labelValue2);
    }
  }

  firstUpdated(changedProperties) {
    // const thisValue = this;
    this.labelValue = this._stateValue;

    // function Frame() {
    //   thisValue.rid = window.requestAnimationFrame(Frame);
    //   thisValue.updateValue(thisValue, thisValue.m);
    //   thisValue.updateThumb(thisValue, thisValue.m);
    //   thisValue.updateActiveTrack(thisValue, thisValue.m);
    // }

    function Frame2() {
      this.rid = window.requestAnimationFrame(Frame2);
      this.updateValue(this, this.m);
      this.updateThumb(this, this.m);
      this.updateActiveTrack(this, this.m);
    }

    function pointerMove(e) {
      let scaleValue;

      e.preventDefault();

      if (this.dragging) {
        this.m = this.mouseEventToPoint(e);

        switch (this.config.position.orientation) {
          case 'horizontal':
            scaleValue = this.svgCoordinateToSliderValue(this, this.m);
            this.m.x = this.valueToSvg(this, scaleValue);
            this.m.x = Math.max(this.svg.scale.min, Math.min(this.m.x, this.svg.scale.max));
            this.m.x = Math.round(this.m.x / this.svg.scale.step) * this.svg.scale.step;
            break;

          case 'vertical':
            scaleValue = this.svgCoordinateToSliderValue(this, this.m);
            this.m.y = this.valueToSvg(this, scaleValue);
            this.m.y = Math.round(this.m.y / this.svg.scale.step) * this.svg.scale.step;
            break;

          default:
        }
        Frame2.call(this);
      }
    }

    if (this.dev.debug) console.log('slider - firstUpdated');
    this.elements = {};
    this.elements.svg = this._card.shadowRoot.getElementById('rangeslider-'.concat(this.toolId));
    this.elements.capture = this.elements.svg.querySelector('#capture');
    this.elements.track = this.elements.svg.querySelector('#rs-track');
    this.elements.activeTrack = this.elements.svg.querySelector('#active-track');
    this.elements.thumbGroup = this.elements.svg.querySelector('#rs-thumb-group');
    this.elements.thumb = this.elements.svg.querySelector('#rs-thumb');
    this.elements.label = this.elements.svg.querySelector('#rs-label tspan');

    if (this.dev.debug) console.log('slider - firstUpdated svg = ', this.elements.svg, 'path=', this.elements.path, 'thumb=', this.elements.thumb, 'label=', this.elements.label, 'text=', this.elements.text);

    function pointerDown(e) {
      e.preventDefault();

      // @NTS: Keep this comment for later!!
      // Safari: We use mouse stuff for pointerdown, but have to use pointer stuff to make sliding work on Safari. WHY??
      window.addEventListener('pointermove', pointerMove.bind(this), false);
      // eslint-disable-next-line no-use-before-define
      window.addEventListener('pointerup', pointerUp.bind(this), false);

      // @NTS: Keep this comment for later!!
      // Below lines prevent slider working on Safari...
      //
      // window.addEventListener('mousemove', pointerMove.bind(this), false);
      // window.addEventListener('touchmove', pointerMove.bind(this), false);
      // window.addEventListener('mouseup', pointerUp.bind(this), false);
      // window.addEventListener('touchend', pointerUp.bind(this), false);

      const mousePos = this.mouseEventToPoint(e);
      const thumbPos = this.svg.thumb.x1 + this.svg.thumb.cx;
      if (mousePos.x > thumbPos - 10 && mousePos.x < thumbPos + this.svg.thumb.width + 10) {
        fireEvent(window, 'haptic', 'heavy');
      } else {
        fireEvent(window, 'haptic', 'error');
        return;
      }

      // User is dragging the thumb of the slider!
      this.dragging = true;

      // Check for drag_action. If none specified, or update_interval = 0, don't update while dragging...

      if (this.config.user_actions?.drag_action && this.config.user_actions?.drag_action.update_interval) {
        if (this.config.user_actions.drag_action.update_interval > 0) {
          this.timeOutId = setTimeout(() => this.callDragService(), this.config.user_actions.drag_action.update_interval);
        } else {
          this.timeOutId = null;
        }
      }
      this.m = this.mouseEventToPoint(e);

      if (this.config.position.orientation === 'horizontal') {
        this.m.x = Math.round(this.m.x / this.svg.scale.step) * this.svg.scale.step;
      } else {
        this.m.y = Math.round(this.m.y / this.svg.scale.step) * this.svg.scale.step;
      }
      if (this.dev.debug) console.log('pointerDOWN', Math.round(this.m.x * 100) / 100);
      Frame2.call(this);
    }

    function pointerUp(e) {
      e.preventDefault();

      // @NTS: Keep this comment for later!!
      // Safari: Fixes unable to grab pointer
      window.removeEventListener('pointermove', pointerMove.bind(this), false);
      window.removeEventListener('pointerup', pointerUp.bind(this), false);

      window.removeEventListener('mousemove', pointerMove.bind(this), false);
      window.removeEventListener('touchmove', pointerMove.bind(this), false);
      window.removeEventListener('mouseup', pointerUp.bind(this), false);
      window.removeEventListener('touchend', pointerUp.bind(this), false);

      if (!this.dragging) return;

      this.dragging = false;
      clearTimeout(this.timeOutId);
      this.target = 0;
      if (this.dev.debug) console.log('pointerUP');
      Frame2.call(this);
      this.callTapService();
    }

    // @NTS: Keep this comment for later!!
    // For things to work in Safari, we need separate touch and mouse down handlers...
    // DON't ask WHY! The pointerdown method prevents listening on window events later on.
    // ie, we can't move our finger

    // this.elements.svg.addEventListener("pointerdown", pointerDown.bind(this), false);

    this.elements.svg.addEventListener('touchstart', pointerDown.bind(this), false);
    this.elements.svg.addEventListener('mousedown', pointerDown.bind(this), false);
  }

  /** *****************************************************************************
   * RangeSliderTool::value()
   *
   * Summary.
   * Receive new state data for the entity this rangeslider is linked to. Called from set hass;
   * Sets the brightness value of the slider. This is a value 0..255. We display %, so translate
   *
   */
  set value(state) {
    super.value = state;
    if (!this.dragging) this.labelValue = this._stateValue;
  }

  _renderUom() {
    if (this.config.show.uom === 'none') {
      return svg``;
    } else {
      this.MergeAnimationStyleIfChanged();
      this.MergeColorFromState(this.styles.uom);

      let fsuomStr = this.styles.label['font-size'];

      let fsuomValue = 0.5;
      let fsuomType = 'em';
      const fsuomSplit = fsuomStr.match(/\D+|\d*\.?\d+/g);
      if (fsuomSplit.length === 2) {
        fsuomValue = Number(fsuomSplit[0]) * 0.6;
        fsuomType = fsuomSplit[1];
      } else console.error('Cannot determine font-size for state/unit', fsuomStr);

      fsuomStr = { 'font-size': fsuomValue + fsuomType };

      this.styles.uom = Merge.mergeDeep(this.config.styles.uom, fsuomStr);

      const uom = this._card._buildUom(this.derivedEntity, this._card.entities[this.defaultEntityIndex()], this._card.config.entities[this.defaultEntityIndex()]);

      // Check for location of uom. end = next to state, bottom = below state ;-), etc.
      if (this.config.show.uom === 'end') {
        return svg`
          <tspan class="${classMap(this.classes.uom)}" dx="-0.1em" dy="-0.35em"
            style="${styleMap(this.styles.uom)}">
            ${uom}</tspan>
        `;
      } else if (this.config.show.uom === 'bottom') {
        return svg`
          <tspan class="${classMap(this.classes.uom)}" x="${this.svg.label.cx}" dy="1.5em"
            style="${styleMap(this.styles.uom)}">
            ${uom}</tspan>
        `;
      } else if (this.config.show.uom === 'top') {
        return svg`
          <tspan class="${classMap(this.classes.uom)}" x="${this.svg.label.cx}" dy="-1.5em"
            style="${styleMap(this.styles.uom)}">
            ${uom}</tspan>
        `;
      } else {
        return svg`
          <tspan class="${classMap(this.classes.uom)}"  dx="-0.1em" dy="-0.35em"
            style="${styleMap(this.styles.uom)}">
            ERRR</tspan>
        `;
      }
    }
  }

  /** *****************************************************************************
   * RangeSliderTool::_renderRangeSlider()
   *
   * Summary.
   * Renders the range slider
   *
   */

  _renderRangeSlider() {
    if (this.dev.debug) console.log('slider - _renderRangeSlider');

    this.MergeAnimationClassIfChanged();
    // this.MergeColorFromState(this.styles);
    // this.MergeAnimationStyleIfChanged(this.styles);
    // this.MergeColorFromState(this.styles);

    this.MergeColorFromState();
    this.MergeAnimationStyleIfChanged();
    this.MergeColorFromState();

    // this.MergeAnimationStyleIfChanged();
    // console.log("renderRangeSlider, styles", this.styles);

    this.renderValue = this._stateValue;
    if (this.dragging) {
      this.renderValue = this.labelValue2;
    } else if (this.elements?.label) this.elements.label.textContent = this.renderValue;

    // Calculate cx and cy: the relative move of the thumb from the center of the track
    let cx;
    let cy;
    switch (this.config.position.label.placement) {
      case 'none':
        this.styles.label.display = 'none';
        this.styles.uom.display = 'none';
        break;
      case 'position':
        cx = this.config.position.orientation === 'horizontal' ? this.valueToSvg(this, Number(this.renderValue)) - this.svg.cx : 0;
        cy = this.config.position.orientation === 'vertical' ? this.valueToSvg(this, Number(this.renderValue)) - this.svg.cy : 0;
        break;

      case 'thumb':
        cx = this.config.position.orientation === 'horizontal' ? -this.svg.label.cx + this.valueToSvg(this, Number(this.renderValue)) : 0;
        cy = this.config.position.orientation === 'vertical' ? this.valueToSvg(this, Number(this.renderValue)) : 0;

        if (this.dragging) {
          this.config.position.orientation === 'horizontal' ? (cy -= 50) : (cx -= 50);
        }
        break;

      default:
        console.error('_renderRangeSlider(), invalid label placement', this.config.position.label.placement);
    }
    this.svg.thumb.cx = cx;
    this.svg.thumb.cy = cy;

    function renderActiveTrack() {
      if (!this.config.show.active) return svg``;

      if (this.config.position.orientation === 'horizontal') {
        return svg`
          <rect id="active-track" class="${classMap(this.classes.active)}" x="${this.svg.activeTrack.x1}" y="${this.svg.activeTrack.y1}"
            width="${Math.abs(this.svg.thumb.x1 - this.svg.activeTrack.x1 + cx + this.svg.thumb.width / 2)}" height="${this.svg.activeTrack.height}" rx="${this.svg.activeTrack.radius}"
            style="${styleMap(this.styles.active)}" touch-action="none"
          />`;
      } else {
        return svg`
          <rect id="active-track" class="${classMap(this.classes.active)}" x="${this.svg.activeTrack.x1}" y="${cy}"
            height="${Math.abs(this.svg.activeTrack.y1 + cy - this.svg.thumb.height)}" width="${this.svg.activeTrack.width}" rx="${this.svg.activeTrack.radius}"
            style="${styleMap(this.styles.active)}"
          />`;
      }
    }

    function renderLabel(argGroup) {
      if (this.config.position.label.placement === 'thumb' && argGroup) {
        return svg`
      <text id="rs-label">
        <tspan class="${classMap(this.classes.label)}" x="${this.svg.label.cx}" y="${this.svg.label.cy}" style="${styleMap(this.styles.label)}">
        ${this.renderValue}</tspan>
        ${this._renderUom()}
        </text>
        `;
      }

      if (this.config.position.label.placement === 'position' && !argGroup) {
        return svg`
          <text id="rs-label" style="transform-origin:center;transform-box: fill-box;">
            <tspan class="${classMap(this.classes.label)}" data-placement="position" x="${this.svg.label.cx}" y="${this.svg.label.cy}"
            style="${styleMap(this.styles.label)}">${this.renderValue ? this.renderValue : ''}</tspan>
            ${this.renderValue ? this._renderUom() : ''}
          </text>
          `;
      }
    }

    function renderThumbGroup() {
      return svg`
        <g id="rs-thumb-group" x="${this.svg.thumb.x1}" y="${this.svg.thumb.y1}" style="transform:translate(${cx}px, ${cy}px);">
          <g style="transform-origin:center;transform-box: fill-box;">
            <rect id="rs-thumb" class="${classMap(this.classes.thumb)}" x="${this.svg.thumb.x1}" y="${this.svg.thumb.y1}"
              width="${this.svg.thumb.width}" height="${this.svg.thumb.height}" rx="${this.svg.thumb.radius}" 
              style="${styleMap(this.styles.thumb)}"
            />
            </g>
            ${renderLabel.call(this, true)} 
        </g>
      `;
    }

    const svgItems = [];
    svgItems.push(svg`
      <rect id="capture" class="${classMap(this.classes.capture)}" x="${this.svg.capture.x1}" y="${this.svg.capture.y1}"
      width="${this.svg.capture.width}" height="${this.svg.capture.height}" rx="${this.svg.track.radius}"          
      />

      <rect id="rs-track" class="${classMap(this.classes.track)}" x="${this.svg.track.x1}" y="${this.svg.track.y1}"
        width="${this.svg.track.width}" height="${this.svg.track.height}" rx="${this.svg.track.radius}"
        style="${styleMap(this.styles.track)}"
      />

      ${renderActiveTrack.call(this)}
      ${renderThumbGroup.call(this)}
      ${renderLabel.call(this, false)}


      `);

    return svgItems;
  }

  /** *****************************************************************************
   * RangeSliderTool::render()
   *
   * Summary.
   * The render() function for this object. The conversion of pointer events need
   * an SVG as grouping object!
   *
   * NOTE:
   * It is imperative that the style overflow=visible is set on the svg.
   * The weird thing is that if using an svg as grouping object, AND a class, the overflow=visible
   * seems to be ignored by both chrome and safari. If the overflow=visible is directly set as style,
   * the setting works.
   *
   * Works on svg with direct styling:
   * ---
   *  return svg`
   *    <svg xmlns="http://www.w3.org/2000/svg" id="rangeslider-${this.toolId}"
   *      pointer-events="all" overflow="visible"
   *    >
   *      ${this._renderRangeSlider()}
   *    </svg>
   *  `;
   *
   * Does NOT work on svg with class styling:
   * ---
   *  return svg`
   *    <svg xmlns="http://www.w3.org/2000/svg" id="rangeslider-${this.toolId}" class="${classMap(this.classes.tool)}"
   *    >
   *      ${this._renderRangeSlider()}
   *    </svg>
   *  `;
   * where the class has the overflow=visible setting...
   *
   */
  render() {
    return svg`
      <svg xmlns="http://www.w3.org/2000/svg" id="rangeslider-${this.toolId}" overflow="visible"
        touch-action="none" style="touch-action:none; pointer-events:none;"
      >
        ${this._renderRangeSlider()}
      </svg>
    `;
  }
} // END of class
