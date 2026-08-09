import { svg } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import Colors from './colors.js';
import ConfigHelper from './config-helper.js';
import ControlBase from './control-base.js';
import { fireEvent } from './frontend_mods/common/dom/fire_event.js';
import Merge from './merge.js';
import StateTool from './state-tool.js';
import TextTool from './text-tool.js';
import Utils from './utils.js';

/** Numeric single/range slider with linear HA and circular visualizations. */
export default class ControlSlider extends ControlBase {
  /** Completes slider configuration and creates its numeric child tools. */
  constructor(config, index, templates, cardId, card) {
    const DEFAULT_SLIDER_CONFIG = {
      mode: 'single',
      orientation: 'horizontal',
      width: 40,
      height: 10,
      scale: {
        min: { attribute: 'min' },
        max: { attribute: 'max' },
        step: { attribute: 'step' },
      },
      interaction: {
        update_interval: 100,
        haptic: 'selection',
      },
      animation: {
        duration: 180,
        easing: 'ease-in-out',
      },
      set_value_action: { action: 'set-value' },
      value: {
        show: true,
        position: 'top',
        gap: 1,
        range_spacing: 8,
        separator: '-',
        offset: { x: 0, y: 0 },
        state: { show: { uom: 'none' }, styles: {} },
        separator_config: {},
      },
      show: { item_viz: 'ha' },
      ha: {
        track: {
          height: 8,
          radius: 4,
          styles: { fill: 'var(--secondary-background-color)' },
        },
        active: {
          radius: 2,
          styles: { fill: 'var(--fhs-slider-active-color, var(--primary-color))' },
        },
        thumb: {
          width: 0.8,
          height: 4,
          radius: 0.4,
          margin: 1,
          hit_size: 12,
          styles: { fill: 'var(--primary-background-color)' },
        },
      },
      circular: {
        start_angle: -135,
        arc_degrees: 270,
        clockwise: true,
        radius: 12,
        track: {
          width: 5,
          styles: {
            fill: 'none',
            stroke: 'var(--secondary-background-color)',
            'stroke-linecap': 'round',
          },
        },
        active: {
          width: 5,
          styles: {
            fill: 'none',
            stroke: 'var(--fhs-slider-active-color, var(--primary-color))',
            'stroke-linecap': 'round',
          },
        },
        thumb: {
          width: 0.8,
          length: '50%',
          hit_size: 12,
          styles: {
            stroke: 'var(--primary-background-color)',
            'stroke-linecap': 'round',
          },
        },
        capture: { width: 12 },
      },
    };
    const HA_SLIDER_CONFIG = { width: 40, height: 10 };
    const CIRCULAR_SLIDER_CONFIG = {
      width: 30,
      height: 30,
      value: { position: 'center' },
    };
    const vizConfig = config.show?.item_viz === 'circular'
      ? CIRCULAR_SLIDER_CONFIG
      : HA_SLIDER_CONFIG;
    const sliderConfig = Merge.mergeDeep(DEFAULT_SLIDER_CONFIG, vizConfig, config);

    if (typeof sliderConfig.circular.thumb.length === 'string') {
      if (!/^\d+(\.\d+)?%$/.test(sliderConfig.circular.thumb.length)) {
        throw Error('[controls] Slider circular.thumb.length must be numeric or a percentage');
      }
      sliderConfig.circular.thumb.length = sliderConfig.circular.track.width
        * Number(sliderConfig.circular.thumb.length.slice(0, -1)) / 100;
    }

    if (!['single', 'range'].includes(sliderConfig.mode)) {
      throw Error(`[controls] Invalid slider mode '${sliderConfig.mode}' [single, range]`);
    }
    if (!['ha', 'circular'].includes(sliderConfig.show.item_viz)) {
      throw Error(`[controls] Invalid slider item_viz '${sliderConfig.show.item_viz}' [ha, circular]`);
    }
    if (!['horizontal', 'vertical'].includes(sliderConfig.orientation)) {
      throw Error(`[controls] Invalid slider orientation '${sliderConfig.orientation}' [horizontal, vertical]`);
    }
    if (!['center', 'start', 'end', 'top', 'bottom'].includes(sliderConfig.value.position)) {
      throw Error(`[controls] Invalid slider value position '${sliderConfig.value.position}'`);
    }
    if (!Number.isFinite(Number(sliderConfig.interaction.update_interval))
      || Number(sliderConfig.interaction.update_interval) < 0) {
      throw Error('[controls] Slider interaction.update_interval must be zero or positive');
    }
    if (!Number.isFinite(Number(sliderConfig.animation.duration))
      || Number(sliderConfig.animation.duration) < 0) {
      throw Error('[controls] Slider animation.duration must be zero or positive');
    }
    if (!Number.isFinite(Number(sliderConfig.circular.arc_degrees))
      || Number(sliderConfig.circular.arc_degrees) <= 0
      || Number(sliderConfig.circular.arc_degrees) > 360) {
      throw Error('[controls] Slider circular.arc_degrees must be greater than zero and at most 360');
    }
    if (sliderConfig.set_value_action.value_field !== undefined) {
      const valuePath = sliderConfig.set_value_action.value_field.split('.');
      let valueTarget = sliderConfig.set_value_action;
      valuePath.slice(0, -1).forEach((property) => {
        if (typeof valueTarget[property] !== 'object') {
          throw Error(`[controls] Slider value_field '${sliderConfig.set_value_action.value_field}' does not exist`);
        }
        valueTarget = valueTarget[property];
      });
    }
    if (sliderConfig.set_value_action.value_fields !== undefined) {
      Object.entries(sliderConfig.set_value_action.value_fields)
        .forEach(([valuePathString, valueName]) => {
          if (!['lower', 'upper'].includes(valueName)) {
            throw Error(`[controls] Slider value_fields '${valuePathString}' must select lower or upper`);
          }
          const valuePath = valuePathString.split('.');
          let valueTarget = sliderConfig.set_value_action;
          valuePath.slice(0, -1).forEach((property) => {
            if (typeof valueTarget[property] !== 'object') {
              throw Error(`[controls] Slider value_fields path '${valuePathString}' does not exist`);
            }
            valueTarget = valueTarget[property];
          });
        });
    }

    if (sliderConfig.mode === 'single') {
      sliderConfig.values = [{ entity_index: sliderConfig.entity_index, value: {} }];
    } else {
      if (!Array.isArray(sliderConfig.values) || sliderConfig.values.length !== 2) {
        throw Error('[controls] Range slider requires exactly two values');
      }
      sliderConfig.values = sliderConfig.values.map((valueConfig) => Merge.mergeDeep(
        { value: {} },
        valueConfig,
      ));
      sliderConfig.entity_index = sliderConfig.values[0].entity_index;
    }

    super(sliderConfig, index, templates, cardId, card);

    this.config.svg = this.calculateSvgDimensions();
    this.sliderValues = this.config.mode === 'single' ? [0] : [0, 0];
    this.displaySliderValues = [...this.sliderValues];
    this.sliderAvailable = false;
    this.resolvedScale = {};
    this.activeValueIndex = 0;
    this.dragging = false;
    this.draggingThumb = false;
    this.lastWrittenSignature = '';
    this.renderFrame = undefined;
    this.stateAnimationFrame = undefined;
    this.writeTimer = undefined;
    this.pointerMoveListener = (event) => this.moveSliderPointer(event);
    this.pointerUpListener = (event) => this.finishSliderPointer(event);
    this.createSliderValueTools();
    this.createControlLabelTextTool(this.config.width, this.config.height);
  }

  /** Creates ordinary StateTool values at the configured control-relative position. */
  createSliderValueTools() {
    this.valueStateTools = [];
    this.valueSeparatorTool = undefined;
    if (!this.config.value.show) return;

    const valueConfig = this.config.value;
    let xpos = this.config.xpos;
    let yposc = this.config.ypos;

    switch (valueConfig.position) {
      case 'start':
        xpos -= this.config.width / 2 + valueConfig.gap;
        break;
      case 'end':
        xpos += this.config.width / 2 + valueConfig.gap;
        break;
      case 'top':
        yposc -= this.config.height / 2 + valueConfig.gap;
        break;
      case 'bottom':
        yposc += this.config.height / 2 + valueConfig.gap;
        break;
      case 'center':
      default:
        break;
    }
    xpos += valueConfig.offset.x;
    yposc += valueConfig.offset.y;

    this.valueStateTools = this.config.values.map((sliderValueConfig, valueIndex) => {
      const valueXpos = this.config.mode === 'range'
        ? xpos + (valueIndex === 0 ? -valueConfig.range_spacing / 2 : valueConfig.range_spacing / 2)
        : xpos;
      const stateConfig = Merge.mergeDeep(
        {
          id: `${this.id}-value-${valueIndex}`,
          group: this.config.group,
          entity_index: sliderValueConfig.entity_index,
          xpos: valueXpos,
          yposc,
          tap_action: { action: 'none' },
          styles: {
            fill: 'var(--primary-text-color)',
            'text-anchor': 'middle',
            'pointer-events': 'none',
          },
        },
        valueConfig.state,
        sliderValueConfig.value,
        {
          xpos: valueXpos,
          yposc,
          tap_action: { action: 'none' },
        },
      );
      return new StateTool(stateConfig, valueIndex, this.templates, this.cardId, this.card);
    });

    if (this.config.mode === 'range') {
      this.valueSeparatorTool = new TextTool(
        Merge.mergeDeep(
          {
            id: `${this.id}-value-separator`,
            group: this.config.group,
            entity_index: this.config.values[0].entity_index,
            xpos,
            yposc,
            text: valueConfig.separator,
            tap_action: { action: 'none' },
            styles: {
              fill: 'var(--primary-text-color)',
              'text-anchor': 'middle',
              'dominant-baseline': 'central',
              'pointer-events': 'none',
            },
          },
          valueConfig.separator_config,
          { xpos, yposc, tap_action: { action: 'none' } },
        ),
        0,
        this.templates,
        this.cardId,
        this.card,
      );
    }
  }

  /** Recalculates runtime geometry and child configs after dynamic YAML changes. */
  updateRuntimeConfig() {
    super.updateRuntimeConfig();
    if (this.configChanged) {
      this.config.svg = this.calculateSvgDimensions(this.config);
      this.createSliderValueTools();
      this.createControlLabelTextTool(this.config.width, this.config.height);
    }
    this.valueStateTools.forEach((valueTool) => valueTool.updateRuntimeConfig());
    if (this.valueSeparatorTool) this.valueSeparatorTool.updateRuntimeConfig();
  }

  /** Resolves scale metadata and current values from the configured entities. */
  setState(entity, entityConfig) {
    super.setState(entity, entityConfig);
    const scaleEntity = this.card.entities[this.config.values[0].entity_index];

    ['min', 'max', 'step'].forEach((property) => {
      const scaleSource = this.config.scale[property];
      this.resolvedScale[property] = typeof scaleSource === 'object'
        ? Number(scaleEntity.attributes[scaleSource.attribute])
        : Number(scaleSource);
    });
    if (!Number.isFinite(this.resolvedScale.min)
      || !Number.isFinite(this.resolvedScale.max)
      || this.resolvedScale.min >= this.resolvedScale.max) {
      throw Error('[controls] Slider scale requires a numeric min lower than max');
    }
    if (!Number.isFinite(this.resolvedScale.step) || this.resolvedScale.step <= 0) {
      throw Error('[controls] Slider scale.step must be a positive number');
    }

    const entitySliderValues = this.config.values.map((sliderValueConfig) => {
      const sliderEntity = this.card.entities[sliderValueConfig.entity_index];
      const sliderEntityConfig = this.card.resolvedEntityConfigs[sliderValueConfig.entity_index];
      return Number(sliderEntityConfig.attribute === undefined
        ? sliderEntity.state
        : sliderEntity.attributes[sliderEntityConfig.attribute]);
    });
    const sliderWasAvailable = this.sliderAvailable;
    this.sliderAvailable = entitySliderValues.every((sliderValue) => Number.isFinite(sliderValue));

    // Keep the background track visible for unknown/unavailable entities, but
    // publish their real state to the optional value tools and render no active
    // slider or interaction surface.
    if (!this.sliderAvailable) {
      this.valueStateTools.forEach((valueTool, valueIndex) => {
        const sliderValueConfig = this.config.values[valueIndex];
        valueTool.setState(
          this.card.entities[sliderValueConfig.entity_index],
          this.card.resolvedEntityConfigs[sliderValueConfig.entity_index],
        );
      });
      if (this.valueSeparatorTool) {
        const separatorEntityIndex = this.config.values[0].entity_index;
        this.valueSeparatorTool.setState(
          this.card.entities[separatorEntityIndex],
          this.card.resolvedEntityConfigs[separatorEntityIndex],
        );
      }
      return;
    }

    if (!this.dragging) {
      if (this.config.mode === 'range' && entitySliderValues[0] > entitySliderValues[1]) {
        throw Error('[controls] Slider lower value must not exceed its upper value');
      }

      const startDisplayValues = [...this.displaySliderValues];
      this.sliderValues = entitySliderValues;

      if (this.config.mode === 'range'
        && sliderWasAvailable
        && this.config.animation.duration > 0
        && this.sliderValues.some(
          (sliderValue, valueIndex) => sliderValue !== startDisplayValues[valueIndex],
        )) {
        window.cancelAnimationFrame(this.stateAnimationFrame);
        let animationStart;
        const animateRangeState = (timestamp) => {
          if (animationStart === undefined) animationStart = timestamp;
          const progress = Math.min(
            (timestamp - animationStart) / this.config.animation.duration,
            1,
          );
          const easedProgress = progress * progress * (3 - 2 * progress);
          this.displaySliderValues = this.sliderValues.map(
            (sliderValue, valueIndex) => startDisplayValues[valueIndex]
              + (sliderValue - startDisplayValues[valueIndex]) * easedProgress,
          );
          this.card.requestUpdate();

          if (progress < 1) {
            this.stateAnimationFrame = window.requestAnimationFrame(animateRangeState);
          } else {
            this.stateAnimationFrame = undefined;
          }
        };
        this.stateAnimationFrame = window.requestAnimationFrame(animateRangeState);
      } else {
        this.displaySliderValues = [...this.sliderValues];
      }
    }
    this.publishSliderValuesToStateTools();
  }

  /** Sends transient slider values through normal StateTool formatting. */
  publishSliderValuesToStateTools() {
    this.valueStateTools.forEach((valueTool, valueIndex) => {
      const sliderValueConfig = this.config.values[valueIndex];
      const sliderEntityConfig = this.card.resolvedEntityConfigs[sliderValueConfig.entity_index];
      let transientValue = { state: String(this.sliderValues[valueIndex]) };

      if (sliderEntityConfig.attribute !== undefined) {
        transientValue = {
          attributes: {
            [sliderEntityConfig.attribute]: this.sliderValues[valueIndex],
          },
        };
      }

      const transientEntity = Merge.mergeDeep(
        {},
        this.card.entities[sliderValueConfig.entity_index],
        transientValue,
      );
      valueTool.setState(
        transientEntity,
        this.card.resolvedEntityConfigs[sliderValueConfig.entity_index],
      );
    });

    if (this.valueSeparatorTool) {
      const separatorEntityIndex = this.config.values[0].entity_index;
      this.valueSeparatorTool.setState(
        this.card.entities[separatorEntityIndex],
        this.card.resolvedEntityConfigs[separatorEntityIndex],
      );
    }
  }

  /** Converts the slider center through the normal group pipeline. */
  calculateSvgDimensions(config = this.config) {
    return this.card._calculateSvgCoordinatesInGroup(config);
  }

  /** Converts viewport pointer coordinates into card SVG coordinates. */
  pointerEventToSvgPoint(event) {
    const sliderElement = this.card.shadowRoot.getElementById(
      `${this.cardId}-${this.id}-slider`,
    );
    return new DOMPoint(event.clientX, event.clientY)
      .matrixTransform(sliderElement.getScreenCTM().inverse());
  }

  /** Snaps one numeric value to step and clamps it to the configured scale. */
  snapSliderValue(value) {
    const { min, max, step } = this.resolvedScale;
    const stepDecimals = String(step).includes('.') ? String(step).split('.')[1].length : 0;
    const steppedValue = Math.round((value - min) / step) * step + min;
    return Number(Math.max(min, Math.min(max, steppedValue)).toFixed(stepDecimals));
  }

  /** Converts one value into its normalized position on the shared scale. */
  sliderValueToRatio(value) {
    return (value - this.resolvedScale.min) / (this.resolvedScale.max - this.resolvedScale.min);
  }

  /** Calculates the selected visualization's physical SVG geometry. */
  getSliderGeometry() {
    const width = Utils.calculateSvgDimension(this.config.width);
    const height = Utils.calculateSvgDimension(this.config.height);
    return {
      cx: this.config.svg.xpos,
      cy: this.config.svg.ypos,
      width,
      height,
      startX: this.config.svg.xpos - width / 2,
      startY: this.config.svg.ypos + height / 2,
      length: this.config.orientation === 'horizontal' ? width : height,
      radius: Utils.calculateSvgDimension(this.config.circular.radius),
    };
  }

  /** Maps one pointer position to the selected visualization's numeric scale. */
  svgPointToSliderValue(point) {
    const geometry = this.getSliderGeometry();
    let ratio;

    if (this.config.show.item_viz === 'ha') {
      ratio = this.config.orientation === 'horizontal'
        ? (point.x - geometry.startX) / geometry.length
        : (geometry.startY - point.y) / geometry.length;
      ratio = Math.max(0, Math.min(1, ratio));
    } else {
      const circular = this.config.circular;
      const pointerAngle = (
        Math.atan2(point.y - geometry.cy, point.x - geometry.cx) * 180 / Math.PI
        + 90 + 360
      ) % 360;
      const startAngle = (circular.start_angle + 360) % 360;
      let angleDistance = circular.clockwise
        ? (pointerAngle - startAngle + 360) % 360
        : (startAngle - pointerAngle + 360) % 360;

      if (angleDistance > circular.arc_degrees) {
        const startDistance = Math.min(angleDistance, 360 - angleDistance);
        const endDistanceRaw = Math.abs(angleDistance - circular.arc_degrees);
        const endDistance = Math.min(endDistanceRaw, 360 - endDistanceRaw);
        angleDistance = startDistance <= endDistance ? 0 : circular.arc_degrees;
      }
      ratio = angleDistance / circular.arc_degrees;
    }

    return this.snapSliderValue(
      this.resolvedScale.min + ratio * (this.resolvedScale.max - this.resolvedScale.min),
    );
  }

  /** Chooses a thumb, applies direct track input and starts card-wide dragging. */
  startSliderPointer(event, requestedValueIndex) {
    event.preventDefault();
    event.stopPropagation();
    window.cancelAnimationFrame(this.stateAnimationFrame);
    this.stateAnimationFrame = undefined;
    this.displaySliderValues = [...this.sliderValues];
    const pointerValue = this.svgPointToSliderValue(this.pointerEventToSvgPoint(event));

    if (this.config.mode === 'range' && requestedValueIndex === undefined) {
      const lowerDistance = Math.abs(pointerValue - this.sliderValues[0]);
      const upperDistance = Math.abs(pointerValue - this.sliderValues[1]);
      if (lowerDistance < upperDistance) this.activeValueIndex = 0;
      if (upperDistance < lowerDistance) this.activeValueIndex = 1;
    } else if (requestedValueIndex !== undefined) {
      this.activeValueIndex = requestedValueIndex;
    }

    this.dragging = true;
    this.draggingThumb = requestedValueIndex !== undefined;
    this.lastWrittenSignature = JSON.stringify(this.sliderValues);
    window.addEventListener('pointermove', this.pointerMoveListener, { passive: false });
    window.addEventListener('pointerup', this.pointerUpListener, { passive: false });
    window.addEventListener('pointercancel', this.pointerUpListener, { passive: false });
    fireEvent(this.card, 'haptic', this.config.interaction.haptic);
    this.applySliderPointerValue(pointerValue);

    if (this.config.interaction.update_interval > 0) {
      this.writeTimer = window.setInterval(
        () => this.writeSliderValues(false),
        this.config.interaction.update_interval,
      );
    }
  }

  /** Applies one transient value while preventing range thumbs from crossing. */
  applySliderPointerValue(pointerValue) {
    let nextValue = pointerValue;
    if (this.config.mode === 'range') {
      nextValue = this.activeValueIndex === 0
        ? Math.min(nextValue, this.sliderValues[1])
        : Math.max(nextValue, this.sliderValues[0]);
    }
    this.sliderValues[this.activeValueIndex] = nextValue;
    this.displaySliderValues = [...this.sliderValues];
    this.scheduleSliderRender();
  }

  /** Processes one card-wide pointer movement. */
  moveSliderPointer(event) {
    event.preventDefault();
    this.draggingThumb = true;
    this.applySliderPointerValue(
      this.svgPointToSliderValue(this.pointerEventToSvgPoint(event)),
    );
  }

  /** Ends dragging, removes global listeners and always commits the final value. */
  finishSliderPointer(event) {
    event.preventDefault();
    event.stopPropagation();
    this.dragging = false;
    this.draggingThumb = false;
    window.removeEventListener('pointermove', this.pointerMoveListener);
    window.removeEventListener('pointerup', this.pointerUpListener);
    window.removeEventListener('pointercancel', this.pointerUpListener);
    window.clearInterval(this.writeTimer);
    this.writeTimer = undefined;
    this.writeSliderValues(true);
  }

  /** Coalesces visual pointer changes into one Lit update per animation frame. */
  scheduleSliderRender() {
    if (this.renderFrame !== undefined) return;
    this.renderFrame = window.requestAnimationFrame(() => {
      this.renderFrame = undefined;
      this.publishSliderValuesToStateTools();
      this.card.requestUpdate();
    });
  }

  /** Executes one throttled or final value action. */
  writeSliderValues(finalWrite) {
    const valueSignature = JSON.stringify(this.sliderValues);
    if (!finalWrite && valueSignature === this.lastWrittenSignature) return;

    this.lastWrittenSignature = valueSignature;
    this.card.executeSliderAction(
      this.config.set_value_action,
      this.config.values[this.activeValueIndex].entity_index,
      this.sliderValues,
      this.activeValueIndex,
    );
  }

  /** Handles standard slider keyboard input for one thumb. */
  handleSliderKeydown(event, valueIndex) {
    const increaseKeys = ['ArrowRight', 'ArrowUp'];
    const decreaseKeys = ['ArrowLeft', 'ArrowDown'];
    const handledKeys = [...increaseKeys, ...decreaseKeys, 'Home', 'End'];
    if (!handledKeys.includes(event.key)) return;

    event.preventDefault();
    event.stopPropagation();
    this.activeValueIndex = valueIndex;
    let nextValue = this.sliderValues[valueIndex];
    if (increaseKeys.includes(event.key)) nextValue += this.resolvedScale.step;
    if (decreaseKeys.includes(event.key)) nextValue -= this.resolvedScale.step;
    if (event.key === 'Home') nextValue = this.resolvedScale.min;
    if (event.key === 'End') nextValue = this.resolvedScale.max;
    this.applySliderPointerValue(this.snapSliderValue(nextValue));
    this.writeSliderValues(true);
  }

  /** Removes all global interaction resources when the card disconnects. */
  disconnected() {
    window.removeEventListener('pointermove', this.pointerMoveListener);
    window.removeEventListener('pointerup', this.pointerUpListener);
    window.removeEventListener('pointercancel', this.pointerUpListener);
    window.clearInterval(this.writeTimer);
    if (this.renderFrame !== undefined) window.cancelAnimationFrame(this.renderFrame);
    if (this.stateAnimationFrame !== undefined) window.cancelAnimationFrame(this.stateAnimationFrame);
  }

  /** Runs child text measurement after each completed card update. */
  updated() {
    super.updated();
    this.valueStateTools.forEach((valueTool) => valueTool.updated());
    if (this.valueSeparatorTool) this.valueSeparatorTool.updated();
  }

  /** Converts one circular ratio into an SVG point on the configured radius. */
  circularRatioToPoint(ratio, radius) {
    const circular = this.config.circular;
    const direction = circular.clockwise ? 1 : -1;
    const angle = circular.start_angle + direction * circular.arc_degrees * ratio;
    const radians = (angle - 90) * Math.PI / 180;
    const geometry = this.getSliderGeometry();
    return {
      x: geometry.cx + radius * Math.cos(radians),
      y: geometry.cy + radius * Math.sin(radians),
    };
  }

  /** Builds an SVG arc path between two normalized positions. */
  circularArcPath(startRatio, endRatio) {
    const geometry = this.getSliderGeometry();
    const start = this.circularRatioToPoint(startRatio, geometry.radius);
    const end = this.circularRatioToPoint(endRatio, geometry.radius);
    const arcSize = Math.abs(endRatio - startRatio) * this.config.circular.arc_degrees;
    const largeArc = arcSize > 180 ? 1 : 0;
    const sweep = this.config.circular.clockwise ? 1 : 0;
    if (arcSize >= 360) {
      const middleRatio = startRatio + (endRatio - startRatio) / 2;
      const middle = this.circularRatioToPoint(middleRatio, geometry.radius);
      return `M ${start.x} ${start.y} A ${geometry.radius} ${geometry.radius} 0 1 ${sweep} ${middle.x} ${middle.y} A ${geometry.radius} ${geometry.radius} 0 1 ${sweep} ${end.x} ${end.y}`;
    }
    return `M ${start.x} ${start.y} A ${geometry.radius} ${geometry.radius} 0 ${largeArc} ${sweep} ${end.x} ${end.y}`;
  }

  /** Renders one accessible linear thumb hit-area and visible marker. */
  renderLinearThumb(valueIndex, coordinate, geometry, showMarker) {
    const viz = this.config.ha;
    const horizontal = this.config.orientation === 'horizontal';
    const hitSize = Utils.calculateSvgDimension(viz.thumb.hit_size);
    const thumbWidth = Utils.calculateSvgDimension(
      horizontal ? viz.thumb.width : viz.thumb.height,
    );
    const thumbHeight = Utils.calculateSvgDimension(
      horizontal ? viz.thumb.height : viz.thumb.width,
    );
    const thumbX = horizontal ? coordinate - thumbWidth / 2 : geometry.cx - thumbWidth / 2;
    const thumbY = horizontal ? geometry.cy - thumbHeight / 2 : coordinate - thumbHeight / 2;
    const hitX = horizontal ? coordinate - hitSize / 2 : geometry.cx - hitSize / 2;
    const hitY = horizontal ? geometry.cy - hitSize / 2 : coordinate - hitSize / 2;

    return svg`
      <g class="slider-control__thumb">
        <rect
          class="slider-control__thumb-hit-area"
          x=${hitX} y=${hitY} width=${hitSize} height=${hitSize}
          fill="transparent" tabindex="0" role="slider"
          aria-valuemin=${this.resolvedScale.min}
          aria-valuemax=${this.resolvedScale.max}
          aria-valuenow=${this.sliderValues[valueIndex]}
          style="outline:none;touch-action:none;cursor:pointer;"
          @pointerdown=${(event) => this.startSliderPointer(event, valueIndex)}
          @keydown=${(event) => this.handleSliderKeydown(event, valueIndex)}
        />
        ${showMarker ? svg`
          <rect
            class="slider-control__thumb-marker"
            x=${thumbX} y=${thumbY} width=${thumbWidth} height=${thumbHeight}
            rx=${Utils.calculateSvgDimension(viz.thumb.radius)}
            style=${styleMap(this.getStyles(ConfigHelper.toStyleDict(viz.thumb.styles)))}
            pointer-events="none"
          />
        ` : svg``}
      </g>
    `;
  }

  /** Renders the broad linear Home Assistant slider. */
  renderHaSlider() {
    const geometry = this.getSliderGeometry();
    const viz = this.config.ha;
    const horizontal = this.config.orientation === 'horizontal';
    const trackThickness = Utils.calculateSvgDimension(viz.track.height);
    const trackRadius = Utils.calculateSvgDimension(viz.track.radius);
    const thumbWidth = Utils.calculateSvgDimension(
      horizontal ? viz.thumb.width : viz.thumb.height,
    );
    const thumbHeight = Utils.calculateSvgDimension(
      horizontal ? viz.thumb.height : viz.thumb.width,
    );
    const thumbMargin = Utils.calculateSvgDimension(viz.thumb.margin);
    const startRatio = this.config.mode === 'range'
      ? this.sliderValueToRatio(this.displaySliderValues[0])
      : 0;
    const endRatio = this.sliderValueToRatio(
      this.displaySliderValues[this.displaySliderValues.length - 1],
    );
    const trackX = horizontal ? geometry.startX : geometry.cx - trackThickness / 2;
    const trackY = horizontal ? geometry.cy - trackThickness / 2 : geometry.startY - geometry.length;
    const trackWidth = horizontal ? geometry.length : trackThickness;
    const trackHeight = horizontal ? trackThickness : geometry.length;
    const thumbAxisSize = horizontal ? thumbWidth : thumbHeight;
    const sliderSize = geometry.length - thumbMargin * 2 - thumbAxisSize;
    const startCoordinate = horizontal
      ? geometry.startX + thumbMargin + thumbWidth / 2 + sliderSize * startRatio
      : geometry.startY - thumbMargin - thumbHeight / 2 - sliderSize * startRatio;
    const endCoordinate = horizontal
      ? geometry.startX + thumbMargin + thumbWidth / 2 + sliderSize * endRatio
      : geometry.startY - thumbMargin - thumbHeight / 2 - sliderSize * endRatio;
    const activeX = horizontal ? startCoordinate : trackX;
    const activeY = horizontal ? trackY : endCoordinate;
    const activeWidth = horizontal ? endCoordinate - startCoordinate : trackThickness;
    const activeHeight = horizontal ? trackThickness : startCoordinate - endCoordinate;
    const clipId = `${this.cardId}-${this.id}-ha-track-clip`;
    const singleTranslation = (1 - endRatio) * sliderSize;
    const singleTranslationPercentage = singleTranslation / geometry.length * 100;
    const singleThumbCoordinate = horizontal
      ? trackX + geometry.length - thumbMargin - thumbWidth / 2 - singleTranslation
      : trackY + thumbMargin + thumbHeight / 2 + singleTranslation;
    const transition = this.dragging && this.draggingThumb
      ? 'none'
      : `transform ${this.config.animation.duration}ms ${this.config.animation.easing}`;
    const movingTransform = horizontal
      ? `translateX(-${singleTranslationPercentage}%)`
      : `translateY(${singleTranslationPercentage}%)`;
    const activeStyles = this.getStyles({
      '--fhs-slider-active-color': Colors.computeColor(this.entity),
      ...ConfigHelper.toStyleDict(viz.active.styles),
    });

    return svg`
      <defs>
        <clipPath id=${clipId}>
          <rect x=${trackX} y=${trackY} width=${trackWidth} height=${trackHeight}
            rx=${trackRadius} />
        </clipPath>
      </defs>
      <rect x=${trackX} y=${trackY} width=${trackWidth} height=${trackHeight}
        rx=${trackRadius}
        style=${styleMap(this.getStyles(ConfigHelper.toStyleDict(viz.track.styles)))}
        pointer-events="none" />
      ${this.sliderAvailable ? svg`
        <rect
          class="slider-control__capture"
          x=${geometry.startX} y=${geometry.startY - geometry.height}
          width=${geometry.width} height=${geometry.height}
          fill="transparent" style="touch-action:none;cursor:pointer;"
          @pointerdown=${(event) => this.startSliderPointer(event, undefined)}
        />
        ${this.config.mode === 'single' ? svg`
          <g clip-path="url(#${clipId})">
            <g style="transform-box:fill-box;transform:${movingTransform};transition:${transition};">
              <rect x=${trackX} y=${trackY} width=${trackWidth} height=${trackHeight}
                rx=${Utils.calculateSvgDimension(viz.active.radius)}
                style=${styleMap(activeStyles)}
                pointer-events="none" />
              <rect
                class="slider-control__thumb-marker"
                x=${horizontal
                  ? trackX + geometry.length - thumbMargin - thumbWidth
                  : geometry.cx - thumbWidth / 2}
                y=${horizontal
                  ? geometry.cy - thumbHeight / 2
                  : trackY + thumbMargin}
                width=${thumbWidth} height=${thumbHeight}
                rx=${Utils.calculateSvgDimension(viz.thumb.radius)}
                style=${styleMap(this.getStyles(ConfigHelper.toStyleDict(viz.thumb.styles)))}
                pointer-events="none" />
            </g>
          </g>
          ${this.renderLinearThumb(0, singleThumbCoordinate, geometry, false)}
        ` : svg`
          <rect x=${activeX} y=${activeY} width=${activeWidth} height=${activeHeight}
            rx=${Utils.calculateSvgDimension(viz.active.radius)}
            style=${styleMap(activeStyles)}
            pointer-events="none" />
          ${this.displaySliderValues.map((sliderValue, valueIndex) => {
            const ratio = this.sliderValueToRatio(sliderValue);
            const coordinate = horizontal
              ? geometry.startX + thumbMargin + thumbWidth / 2 + sliderSize * ratio
              : geometry.startY - thumbMargin - thumbHeight / 2 - sliderSize * ratio;
            return this.renderLinearThumb(valueIndex, coordinate, geometry, true);
          })}
        `}
      ` : svg``}
    `;
  }

  /** Renders circular track, active range and radial thumb markers. */
  renderCircularSlider() {
    const geometry = this.getSliderGeometry();
    const viz = this.config.circular;
    const lowerRatio = this.config.mode === 'range'
      ? this.sliderValueToRatio(this.displaySliderValues[0])
      : 0;
    const upperRatio = this.sliderValueToRatio(
      this.displaySliderValues[this.displaySliderValues.length - 1],
    );
    const captureWidth = Utils.calculateSvgDimension(viz.capture.width);
    const thumbLength = Utils.calculateSvgDimension(viz.thumb.length);
    const thumbHitSize = Utils.calculateSvgDimension(viz.thumb.hit_size);
    const activeStyles = this.getStyles({
      '--fhs-slider-active-color': Colors.computeColor(this.entity),
      ...ConfigHelper.toStyleDict(viz.active.styles),
    });

    return svg`
      <path d=${this.circularArcPath(0, 1)}
        style=${styleMap(this.getStyles(ConfigHelper.toStyleDict(viz.track.styles)))}
        stroke-width=${Utils.calculateSvgDimension(viz.track.width)} pointer-events="none" />
      ${this.sliderAvailable ? svg`
        <path d=${this.circularArcPath(0, 1)} fill="none" stroke="transparent"
          stroke-width=${captureWidth} style="touch-action:none;cursor:pointer;"
          @pointerdown=${(event) => this.startSliderPointer(event, undefined)} />
        <path d=${this.circularArcPath(lowerRatio, upperRatio)}
          style=${styleMap(activeStyles)}
          stroke-width=${Utils.calculateSvgDimension(viz.active.width)} pointer-events="none" />
        ${this.displaySliderValues.map((sliderValue, valueIndex) => {
          const ratio = this.sliderValueToRatio(sliderValue);
          const thumbPoint = this.circularRatioToPoint(ratio, geometry.radius);
          const innerPoint = this.circularRatioToPoint(ratio, geometry.radius - thumbLength / 2);
          const outerPoint = this.circularRatioToPoint(ratio, geometry.radius + thumbLength / 2);
          return svg`
            <circle cx=${thumbPoint.x} cy=${thumbPoint.y} r=${thumbHitSize / 2}
              fill="transparent" tabindex="0" role="slider"
              aria-valuemin=${this.resolvedScale.min}
              aria-valuemax=${this.resolvedScale.max}
              aria-valuenow=${this.sliderValues[valueIndex]}
              style="outline:none;touch-action:none;cursor:pointer;"
              @pointerdown=${(event) => this.startSliderPointer(event, valueIndex)}
              @keydown=${(event) => this.handleSliderKeydown(event, valueIndex)} />
            <line x1=${innerPoint.x} y1=${innerPoint.y}
              x2=${outerPoint.x} y2=${outerPoint.y}
              stroke-width=${Utils.calculateSvgDimension(viz.thumb.width)}
              style=${styleMap(this.getStyles(ConfigHelper.toStyleDict(viz.thumb.styles)))}
              pointer-events="none" />
          `;
        })}
      ` : svg``}
    `;
  }

  /** Renders child values and the selected slider visualization. */
  render() {
    const control = this.renderItemLayers(svg`
      <g id="${this.cardId}-${this.id}-slider" class="slider-control"
        transform="${this.getGroupScaleTransform()}"
        style="${this.getGroupScaleStyle()}">
        ${this.config.show.item_viz === 'ha'
          ? this.renderHaSlider()
          : this.renderCircularSlider()}
      </g>
    `);

    return svg`
      ${this.renderControlLabel()}
      ${control}
      ${this.valueStateTools.map((valueTool) => valueTool.render())}
      ${this.valueSeparatorTool ? this.valueSeparatorTool.render() : svg``}
    `;
  }
}
