import { svg } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import ConfigHelper from './config-helper.js';
import Utils from './utils.js';
import Merge from './merge.js';

const DEF_SHAPE_SECTIONS = ['rectangles', 'circles', 'arcs'];
const LAYOUT_SECTIONS = ['horseshoes', 'horseshoes_v2', 'states', 'names', 'areas', 'circles', 'arcs', 'rectangles', 'lines', 'hlines', 'vlines', 'icons'];

/**
 * Renders SVG clipPath and mask definitions from layout.clips and layout.masks.
 *
 * Clips and masks reuse the same shape-section config style as normal layout
 * tools. The module only renders definitions and item wrappers; it does not own
 * visible layout rendering.
 */
export default class MasksClips {
  /**
   * Stores card context and already-compiled clip/mask config.
   *
   * @param {object} config - Full card config after template/ref/calc/same_as compilation.
   * @param {string} cardId - Stable card id used to scope SVG ids.
   * @param {LitElement} card - Parent FHS card instance.
   */
  constructor(config, cardId, card) {
    this.config = config;
    this.cardId = cardId;
    this.card = card;
    this.gradients = this.normalizeGradients(config.layout.gradients);
    this.clips = this.normalizeDefinitions(config.layout.clips);
    this.masks = this.normalizeDefinitions(config.layout.masks);
  }

  /**
   * Normalizes SVG gradient definitions at construction time.
   *
   * Gradient config is intentionally small: the type selects the SVG element,
   * coordinates are passed through to SVG, and stops define the color ramp.
   *
   * @param {object} gradients - layout.gradients config.
   * @returns {object} Gradient definitions with render-ready defaults.
   */
  normalizeGradients(gradients) {
    const normalizedGradients = {};

    Object.entries(gradients).forEach(([id, gradient]) => {
      const baseGradient = gradient.type === 'radial'
        ? { type: 'radial', gradientUnits: 'objectBoundingBox', cx: '50%', cy: '50%', r: '50%', stops: [] }
        : { type: 'linear', gradientUnits: 'objectBoundingBox', x1: '0%', y1: '0%', x2: '100%', y2: '0%', stops: [] };

      normalizedGradients[id] = Merge.mergeDeep({}, baseGradient, gradient);
      normalizedGradients[id].stops = normalizedGradients[id].stops.map((stop) => {
        const normalizedStop = Merge.mergeDeep({}, { opacity: 1 }, stop);

        // SVG gradient stops need percentages. FHS config can use plain 0..100 numbers.
        if (typeof normalizedStop.offset === 'number') {
          normalizedStop.offset = `${normalizedStop.offset}%`;
        }

        return normalizedStop;
      });

      // FHS config uses 0..100 values. SVG objectBoundingBox gradients need percentages,
      // while userSpaceOnUse gradients use the normal 200x200 SVG card coordinate system.
      ['cx', 'cy', 'r', 'x1', 'y1', 'x2', 'y2'].forEach((field) => {
        if (typeof normalizedGradients[id][field] !== 'number') return;

        normalizedGradients[id][field] = normalizedGradients[id].gradientUnits === 'userSpaceOnUse'
          ? Utils.calculateSvgDimension(normalizedGradients[id][field])
          : `${normalizedGradients[id][field]}%`;
      });
    });

    return normalizedGradients;
  }

  /**
   * Normalizes clip/mask definitions at construction time.
   *
   * The renderer can then render the supported sections directly without adding
   * fallback checks in the render path.
   *
   * @param {object} definitions - layout.clips or layout.masks config.
   * @returns {object} Definitions with supported shape sections present.
   */
  normalizeDefinitions(definitions) {
    const normalizedDefinitions = {};

    Object.entries(definitions).forEach(([id, definition]) => {
      normalizedDefinitions[id] = Merge.mergeDeep({}, definition, {
        rectangles: definition.rectangles ?? [],
        circles: definition.circles ?? [],
        arcs: definition.arcs ?? [],
      });

      DEF_SHAPE_SECTIONS.forEach((section) => {
        normalizedDefinitions[id][section] = normalizedDefinitions[id][section].map((shape) => {
          if (shape.dxpos === undefined && shape.dypos === undefined) return shape;

          return Merge.mergeDeep({}, { dxpos: 0, dypos: 0 }, shape);
        });
      });
    });

    return normalizedDefinitions;
  }

  /**
   * Builds a card-scoped SVG gradient id.
   *
   * @param {string} id - User configured gradient name.
   * @returns {string} Scoped SVG id.
   */
  getGradientId(id) {
    return `fhs-${this.cardId}-gradient-${id}`;
  }

  /**
   * Builds a card-scoped SVG clip id.
   *
   * @param {string} id - User configured clip name.
   * @returns {string} Scoped SVG id.
   */
  getClipId(id, item, section) {
    if (item && section) {
      return `fhs-${this.cardId}-clip-${id}-${section}-${item.id}`;
    }

    return `fhs-${this.cardId}-clip-${id}`;
  }

  /**
   * Returns the SVG clip id that a visible item should reference.
   *
   * Absolute definitions use one shared id. Relative definitions use the item
   * specific id rendered from dxpos/dypos offsets.
   *
   * @param {string} id - User configured clip name.
   * @param {object} item - Visible item using the clip.
   * @param {string} section - Layout section of the visible item.
   * @returns {string} Scoped SVG id to use in clip-path.
   */
  getClipUseId(id, item, section) {
    if (this.definitionUsesRelativePosition(this.clips[id])) {
      return this.getClipId(id, item, section);
    }

    return this.getClipId(id);
  }

  /**
   * Builds a card-scoped SVG mask id.
   *
   * @param {string} id - User configured mask name.
   * @returns {string} Scoped SVG id.
   */
  getMaskId(id, item, section) {
    if (item && section) {
      return `fhs-${this.cardId}-mask-${id}-${section}-${item.id}`;
    }

    return `fhs-${this.cardId}-mask-${id}`;
  }

  /**
   * Returns the SVG mask id that a visible item should reference.
   *
   * Absolute definitions use one shared id. Relative definitions use the item
   * specific id rendered from dxpos/dypos offsets.
   *
   * @param {string} id - User configured mask name.
   * @param {object} item - Visible item using the mask.
   * @param {string} section - Layout section of the visible item.
   * @returns {string} Scoped SVG id to use in mask.
   */
  getMaskUseId(id, item, section) {
    if (this.definitionUsesRelativePosition(this.masks[id])) {
      return this.getMaskId(id, item, section);
    }

    return this.getMaskId(id);
  }

  /**
   * Returns one or more SVG mask ids for a configured mask name.
   *
   * soft_arc expands to two nested masks: one for the curved edge and one for
   * the chord fade. Separate masks are needed because SVG mask shapes are
   * painted together; nesting makes the masks constrain each other.
   *
   * @param {string} id - User configured mask name.
   * @param {object} item - Visible item using the mask.
   * @param {string} section - Layout section of the visible item.
   * @returns {Array<string>} Scoped SVG mask ids to apply in order.
   */
  getMaskUseIds(id, item, section) {
    if (this.masks[id].soft_arc) {
      const maskId = this.getMaskId(id, item, section);

      return [`${maskId}-edge`, `${maskId}-chord`];
    }

    return [this.getMaskUseId(id, item, section)];
  }

  /**
   * Renders all clip and mask definitions for this card.
   *
   * @returns {TemplateResult} SVG defs content.
   */
  renderDefs() {
    return svg`
      ${this.renderGradients()}
      ${this.renderClips()}
      ${this.renderMasks()}
      ${this.renderRelativeClips()}
      ${this.renderRelativeMasks()}
    `;
  }

  /**
   * Renders layout.gradients as SVG linearGradient/radialGradient definitions.
   *
   * @returns {Array<TemplateResult>} Gradient templates.
   */
  renderGradients() {
    return Object.entries(this.gradients).map(([id, gradient]) => {
      if (gradient.type === 'radial') {
        return svg`
          <radialGradient
            id="${this.getGradientId(id)}"
            gradientUnits="${gradient.gradientUnits}"
            cx="${gradient.cx}"
            cy="${gradient.cy}"
            r="${gradient.r}"
          >
            ${this.renderGradientStops(gradient.stops)}
          </radialGradient>
        `;
      }

      return svg`
        <linearGradient
          id="${this.getGradientId(id)}"
          gradientUnits="${gradient.gradientUnits}"
          x1="${gradient.x1}"
          y1="${gradient.y1}"
          x2="${gradient.x2}"
          y2="${gradient.y2}"
        >
          ${this.renderGradientStops(gradient.stops)}
        </linearGradient>
      `;
    });
  }

  /**
   * Renders SVG gradient stops.
   *
   * @param {Array<object>} stops - Gradient stop configs.
   * @returns {Array<TemplateResult>} Stop templates.
   */
  renderGradientStops(stops) {
    return stops.map((stop) => svg`
      <stop
        offset="${stop.offset}"
        stop-color="${stop.color}"
        stop-opacity="${stop.opacity}"
      ></stop>
    `);
  }

  /**
   * Renders layout.clips as SVG clipPath definitions.
   *
   * @returns {Array<TemplateResult>} ClipPath templates.
   */
  renderClips() {
    return Object.entries(this.clips).map(([id, clip]) => {
      if (this.definitionUsesRelativePosition(clip)) return svg``;

      return svg`
        <clipPath id="${this.getClipId(id)}" clipPathUnits="userSpaceOnUse">
          ${this.renderShapeSections(clip)}
        </clipPath>
      `;
    });
  }

  /**
   * Renders layout.masks as SVG mask definitions.
   *
   * @returns {Array<TemplateResult>} Mask templates.
   */
  renderMasks() {
    return Object.entries(this.masks).map(([id, mask]) => {
      if (this.definitionUsesRelativePosition(mask)) return svg``;

      return svg`
        <mask id="${this.getMaskId(id)}" maskUnits="userSpaceOnUse">
          <g class="mask-clip-definition mask-clip-definition--mask" style=${styleMap(this.getDefinitionStyles(mask))}>
            ${this.renderShapeSections(mask)}
          </g>
        </mask>
      `;
    });
  }

  /**
   * Renders item-specific clipPath definitions for clips that use dxpos/dypos.
   *
   * @returns {Array<TemplateResult>} Relative clipPath templates.
   */
  renderRelativeClips() {
    return Object.entries(this.clips).map(([id, clip]) => {
      if (!this.definitionUsesRelativePosition(clip)) return svg``;

      return this.getItemsUsingDefinition('clip', id).map(({ section, item }) => svg`
        <clipPath id="${this.getClipId(id, item, section)}" clipPathUnits="userSpaceOnUse">
          ${this.renderShapeSections(clip, item)}
        </clipPath>
      `);
    });
  }

  /**
   * Renders item-specific mask definitions for masks that use dxpos/dypos.
   *
   * @returns {Array<TemplateResult>} Relative mask templates.
   */
  renderRelativeMasks() {
    return Object.entries(this.masks).map(([id, mask]) => {
      if (!this.definitionUsesRelativePosition(mask)) return svg``;

      return this.getItemsUsingDefinition('mask', id).map(({ section, item }) => {
        if (mask.soft_arc) {
          return this.renderSoftArcMasks(id, mask, item, section);
        }

        return svg`
          <mask id="${this.getMaskId(id, item, section)}" maskUnits="userSpaceOnUse">
            <g class="mask-clip-definition mask-clip-definition--mask" style=${styleMap(this.getDefinitionStyles(mask))}>
              ${this.renderShapeSections(mask, item)}
            </g>
          </mask>
        `;
      });
    });
  }

  /**
   * Renders every supported shape section inside one clip/mask definition.
   *
   * @param {object} config - One clip or mask config object.
   * @returns {TemplateResult} Shape templates.
   */
  renderShapeSections(config, targetItem) {
    return svg`
      ${this.renderRectangles(config.rectangles, targetItem)}
      ${this.renderCircles(config.circles, targetItem)}
      ${this.renderArcs(config.arcs, targetItem)}
    `;
  }

  /**
   * Renders the generated masks for a soft_arc definition.
   *
   * The user supplies one arc clip and two fade widths. This function derives
   * the visible circle and chord fade geometry from that clip arc, so the
   * YAML does not need hand-tuned rectangle positions or sizes.
   *
   * @param {string} id - User configured soft_arc mask name.
   * @param {object} mask - soft_arc mask config.
   * @param {object} item - Visible item using the mask.
   * @param {string} section - Layout section of the visible item.
   * @returns {TemplateResult} Gradient and mask templates.
   */
  renderSoftArcMasks(id, mask, item, section) {
    const maskId = this.getMaskId(id, item, section);
    const arc = this.clips[mask.soft_arc.clip].arcs[0];
    const arcDimensions = this.calculateArcDimensions(arc, item);
    const edgeGradientId = `${maskId}-edge-gradient`;
    const chordGradientId = `${maskId}-chord-gradient`;
    const edgeStopsStart = Number(mask.soft_arc.edge.stops_start);
    const edgeStops = mask.soft_arc.edge.stops ?? [
      { offset: 0, opacity: 1 },
      { offset: 100, opacity: 0 },
    ];
    const chordStopsStart = Number(mask.soft_arc.chord.stops_start);
    const chordStops = mask.soft_arc.chord.stops ?? [
      { offset: 0, opacity: 1 },
      { offset: 100, opacity: 0 },
    ];
    const chordDx = arcDimensions.endX - arcDimensions.startX;
    const chordDy = arcDimensions.endY - arcDimensions.startY;
    const chordLength = Math.sqrt(chordDx ** 2 + chordDy ** 2);
    const chordMidX = (arcDimensions.startX + arcDimensions.endX) / 2;
    const chordMidY = (arcDimensions.startY + arcDimensions.endY) / 2;
    let normalX = -chordDy / chordLength;
    let normalY = chordDx / chordLength;

    // The chord mask fades from the arc center toward the chord. Flip the normal
    // when needed so its positive direction points from center to the chord line.
    if (((chordMidX - arcDimensions.xpos) * normalX) + ((chordMidY - arcDimensions.ypos) * normalY) < 0) {
      normalX = -normalX;
      normalY = -normalY;
    }

    const centerToChord = Math.abs(((chordMidX - arcDimensions.xpos) * normalX) + ((chordMidY - arcDimensions.ypos) * normalY));
    const chordGradientStartX = arcDimensions.xpos;
    const chordGradientStartY = arcDimensions.ypos;
    const chordGradientEndX = arcDimensions.xpos + normalX * centerToChord;
    const chordGradientEndY = arcDimensions.ypos + normalY * centerToChord;
    const chordMaskSize = arcDimensions.radius * 2;

    return svg`
      <radialGradient id="${edgeGradientId}" gradientUnits="objectBoundingBox" cx="50%" cy="50%" r="50%">
        ${edgeStops.map((stop) => svg`
          <stop
            offset="${edgeStopsStart + (Number(stop.offset) / 100) * (100 - edgeStopsStart)}%"
            stop-color="white"
            stop-opacity="${stop.opacity}"
          ></stop>
        `)}
      </radialGradient>
      <linearGradient
        id="${chordGradientId}"
        gradientUnits="userSpaceOnUse"
        x1="${chordGradientStartX}"
        y1="${chordGradientStartY}"
        x2="${chordGradientEndX}"
        y2="${chordGradientEndY}"
      >
        ${chordStops.map((stop) => svg`
          <stop
            offset="${chordStopsStart + (Number(stop.offset) / 100) * (100 - chordStopsStart)}%"
            stop-color="white"
            stop-opacity="${stop.opacity}"
          ></stop>
        `)}
      </linearGradient>
      <mask id="${maskId}-edge" maskUnits="userSpaceOnUse">
        <circle
          class="mask-clip-soft-arc-edge"
          cx="${arcDimensions.xpos}"
          cy="${arcDimensions.ypos}"
          r="${arcDimensions.radius}"
          fill="url(#${edgeGradientId})"
        ></circle>
      </mask>
      <mask id="${maskId}-chord" maskUnits="userSpaceOnUse">
        <rect
          class="mask-clip-soft-arc-chord"
          x="${arcDimensions.xpos - arcDimensions.radius}"
          y="${arcDimensions.ypos - arcDimensions.radius}"
          width="${chordMaskSize}"
          height="${chordMaskSize}"
          fill="url(#${chordGradientId})"
        ></rect>
      </mask>
    `;
  }

  /**
   * Renders rectangle definition shapes.
   *
   * @param {Array<object>} rectangles - Rectangle configs inside one clip/mask.
   * @returns {Array<TemplateResult>} Rectangle path templates.
   */
  renderRectangles(rectangles, targetItem) {
    return rectangles.map((rectangle) => {
      const dimensions = this.calculateRectangleDimensions(rectangle, targetItem);

      return svg`
        <path
          class="mask-clip-rectangle"
          d="${this.buildRoundedRectanglePath(dimensions)}"
          style=${styleMap(this.getShapeStyles(rectangle))}
        ></path>
      `;
    });
  }

  /**
   * Renders circle definition shapes.
   *
   * @param {Array<object>} circles - Circle configs inside one clip/mask.
   * @returns {Array<TemplateResult>} Circle templates.
   */
  renderCircles(circles, targetItem) {
    return circles.map((circle) => {
      const dimensions = this.calculateCircleDimensions(circle, targetItem);

      return svg`
        <circle
          class="mask-clip-circle"
          cx="${dimensions.xpos}"
          cy="${dimensions.ypos}"
          r="${dimensions.radius}"
          style=${styleMap(this.getShapeStyles(circle))}
        ></circle>
      `;
    });
  }

  /**
   * Renders arc definition shapes.
   *
   * @param {Array<object>} arcs - Arc configs inside one clip/mask.
   * @returns {Array<TemplateResult>} Arc path templates.
   */
  renderArcs(arcs, targetItem) {
    return arcs.map((arc) => {
      const dimensions = this.calculateArcDimensions(arc, targetItem);

      return svg`
        <path
          class="mask-clip-arc"
          d="${this.buildArcPath(dimensions)}"
          style=${styleMap(this.getShapeStyles(arc))}
        ></path>
      `;
    });
  }

  /**
   * Converts one rectangle config to SVG path dimensions.
   *
   * @param {object} rectangle - Rectangle config.
   * @returns {object} SVG rectangle dimensions.
   */
  calculateRectangleDimensions(rectangle, targetItem) {
    const svgDimensions = this.calculateShapeCenter(rectangle, targetItem);
    const width = Utils.calculateSvgDimension(rectangle.width);
    const height = Utils.calculateSvgDimension(rectangle.height);
    const radiusConfig = typeof rectangle.radius === 'object' ? rectangle.radius : { all: rectangle.radius };
    const maxRadius = Math.min(height, width) / 2;
    const calculateRadius = (value) => Math.min(maxRadius, Math.max(0, Utils.calculateSvgDimension(value)));

    svgDimensions.width = width;
    svgDimensions.height = height;
    svgDimensions.x = svgDimensions.xpos - width / 2;
    svgDimensions.y = svgDimensions.ypos - height / 2;
    svgDimensions.radiusTopLeft = calculateRadius(radiusConfig.top_left ?? radiusConfig.left ?? radiusConfig.top ?? radiusConfig.all);
    svgDimensions.radiusTopRight = calculateRadius(radiusConfig.top_right ?? radiusConfig.right ?? radiusConfig.top ?? radiusConfig.all);
    svgDimensions.radiusBottomLeft = calculateRadius(radiusConfig.bottom_left ?? radiusConfig.left ?? radiusConfig.bottom ?? radiusConfig.all);
    svgDimensions.radiusBottomRight = calculateRadius(radiusConfig.bottom_right ?? radiusConfig.right ?? radiusConfig.bottom ?? radiusConfig.all);

    return svgDimensions;
  }

  /**
   * Converts one circle config to SVG dimensions.
   *
   * @param {object} circle - Circle config.
   * @returns {object} SVG circle dimensions.
   */
  calculateCircleDimensions(circle, targetItem) {
    const svgDimensions = this.calculateShapeCenter(circle, targetItem);

    svgDimensions.radius = circle.radius_percent !== undefined
      ? Utils.calculateSvgDimension(circle.radius_percent)
      : circle.radius;

    return svgDimensions;
  }

  /**
   * Converts one arc config to SVG dimensions.
   *
   * @param {object} arc - Arc config.
   * @returns {object} SVG arc dimensions.
   */
  calculateArcDimensions(arc, targetItem) {
    const svgDimensions = this.calculateShapeCenter(arc, targetItem);
    const radius = Utils.calculateSvgDimension(arc.radius);
    const arcDegrees = Number(arc.arc_degrees);
    const rotate = Number(arc.rotate);
    const startAngle = 90 + (360 - arcDegrees) / 2 + rotate;
    const endAngle = startAngle + arcDegrees;
    const startRadians = (startAngle * Math.PI) / 180;
    const endRadians = (endAngle * Math.PI) / 180;

    svgDimensions.radius = radius;
    svgDimensions.arcDegrees = arcDegrees;
    svgDimensions.largeArcFlag = Math.abs(arcDegrees) > 180 ? 1 : 0;
    svgDimensions.sweepFlag = arcDegrees >= 0 ? 1 : 0;
    svgDimensions.startX = svgDimensions.xpos + radius * Math.cos(startRadians);
    svgDimensions.startY = svgDimensions.ypos + radius * Math.sin(startRadians);
    svgDimensions.endX = svgDimensions.xpos + radius * Math.cos(endRadians);
    svgDimensions.endY = svgDimensions.ypos + radius * Math.sin(endRadians);

    return svgDimensions;
  }

  /**
   * Builds a rounded rectangle path from precomputed dimensions.
   *
   * @param {object} dimensions - Rectangle dimensions.
   * @returns {string} SVG path data.
   */
  buildRoundedRectanglePath(dimensions) {
    return `
      M ${dimensions.x + dimensions.radiusTopLeft} ${dimensions.y}
      h ${dimensions.width - dimensions.radiusTopLeft - dimensions.radiusTopRight}
      q ${dimensions.radiusTopRight} 0 ${dimensions.radiusTopRight} ${dimensions.radiusTopRight}
      v ${dimensions.height - dimensions.radiusTopRight - dimensions.radiusBottomRight}
      q 0 ${dimensions.radiusBottomRight} -${dimensions.radiusBottomRight} ${dimensions.radiusBottomRight}
      h -${dimensions.width - dimensions.radiusBottomRight - dimensions.radiusBottomLeft}
      q -${dimensions.radiusBottomLeft} 0 -${dimensions.radiusBottomLeft} -${dimensions.radiusBottomLeft}
      v -${dimensions.height - dimensions.radiusBottomLeft - dimensions.radiusTopLeft}
      q 0 -${dimensions.radiusTopLeft} ${dimensions.radiusTopLeft} -${dimensions.radiusTopLeft}
      Z
    `;
  }

  /**
   * Builds a closed chord arc path from precomputed dimensions.
   *
   * @param {object} dimensions - Arc dimensions.
   * @returns {string} SVG path data.
   */
  buildArcPath(dimensions) {
    if (Math.abs(dimensions.arcDegrees) >= 360) {
      return `
        M ${dimensions.xpos - dimensions.radius} ${dimensions.ypos}
        A ${dimensions.radius} ${dimensions.radius} 0 1 1 ${dimensions.xpos + dimensions.radius} ${dimensions.ypos}
        A ${dimensions.radius} ${dimensions.radius} 0 1 1 ${dimensions.xpos - dimensions.radius} ${dimensions.ypos}
        Z
      `;
    }

    return `
      M ${dimensions.startX} ${dimensions.startY}
      A ${dimensions.radius} ${dimensions.radius} 0 ${dimensions.largeArcFlag} ${dimensions.sweepFlag} ${dimensions.endX} ${dimensions.endY}
      Z
    `;
  }

  /**
   * Calculates the SVG center for absolute and item-relative definition shapes.
   *
   * A shape with dxpos/dypos is anchored on the target item center. A shape with
   * xpos/ypos remains an absolute card/group-positioned definition shape.
   *
   * @param {object} shape - Clip or mask shape config.
   * @param {object} targetItem - Visible item that uses the relative definition.
   * @returns {object} SVG center coordinates.
   */
  calculateShapeCenter(shape, targetItem) {
    if (shape.dxpos !== undefined || shape.dypos !== undefined) {
      const targetSvg = this.card._calculateSvgCoordinatesInGroup(targetItem);

      return {
        xpos: targetSvg.xpos + Utils.calculateSvgDimension(shape.dxpos),
        ypos: targetSvg.ypos + Utils.calculateSvgDimension(shape.dypos),
      };
    }

    return this.card._calculateSvgCoordinatesInGroup(shape);
  }

  /**
   * Returns whether a clip/mask definition needs per-item SVG instances.
   *
   * @param {object} definition - Clip or mask definition config.
   * @returns {boolean} True when at least one shape uses dxpos/dypos.
   */
  definitionUsesRelativePosition(definition) {
    if (definition.soft_arc) return true;

    return DEF_SHAPE_SECTIONS.some((section) => definition[section].some((shape) => shape.dxpos !== undefined || shape.dypos !== undefined));
  }

  /**
   * Finds layout items that reference one clip or mask definition.
   *
   * @param {string} property - `clip` or `mask`.
   * @param {string} id - User configured clip/mask name.
   * @returns {Array<object>} Section and item pairs using the definition.
   */
  getItemsUsingDefinition(property, id) {
    const itemsUsingDefinition = [];

    LAYOUT_SECTIONS.forEach((section) => {
      const items = this.config.layout[section];

      if (!Array.isArray(items)) return;

      items.forEach((item) => {
        const definitionIds = Array.isArray(item[property]) ? item[property] : [item[property]];

        if (!definitionIds.includes(id)) return;

        itemsUsingDefinition.push({ section, item });
      });
    });

    return itemsUsingDefinition;
  }

  /**
   * Converts configured clip/mask definition styles to a style dict.
   *
   * @param {object} definition - Clip or mask definition config.
   * @returns {object} Style dict.
   */
  getDefinitionStyles(definition) {
    return ConfigHelper.toStyleDict(definition.styles);
  }

  /**
   * Converts configured shape styles to a style dict.
   *
   * @param {object} shape - Shape config inside a clip/mask.
   * @returns {object} Style dict.
   */
  getShapeStyles(shape) {
    return this.applyGradientRefs(ConfigHelper.toStyleDict(shape.styles));
  }

  /**
   * Converts user-facing gradient(name) style values to scoped SVG url(#id) values.
   *
   * @param {object} styles - Final render style dictionary.
   * @returns {object} Style dictionary with gradient references scoped to this card.
   */
  applyGradientRefs(styles) {
    const nextStyles = {};

    Object.entries(styles).forEach(([property, value]) => {
      const valueText = String(value).trim();
      const gradientMatch = valueText.match(/^gradient\(([^)]+)\)$/);

      nextStyles[property] = gradientMatch ? `url(#${this.getGradientId(gradientMatch[1].trim())})` : value;
    });

    return nextStyles;
  }

  /**
   * Wraps visible item content in mask and clip groups.
   *
   * @param {object} item - Runtime visible item config.
   * @param {TemplateResult} content - Rendered SVG content.
   * @returns {TemplateResult} Wrapped or original content.
   */
  renderItemLayers(item, content, section) {
    let result = content;

    if (item.mask) {
      const maskIds = Array.isArray(item.mask) ? item.mask : [item.mask];

      // Keep the render behavior identical to BaseTool: stacked masks are nested
      // so every mask constrains the already masked content.
      maskIds.forEach((maskId) => {
        this.getMaskUseIds(maskId, item, section).forEach((svgMaskId) => {
          result = svg`<g mask="url(#${svgMaskId})">${result}</g>`;
        });
      });
    }

    if (item.clip) {
      result = svg`<g clip-path="url(#${this.getClipUseId(item.clip, item, section)})">${result}</g>`;
    }

    return result;
  }
}
