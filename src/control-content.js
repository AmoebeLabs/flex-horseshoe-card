import { svg } from 'lit';
import ConfigHelper from './config-helper.js';
import Merge from './merge.js';
import IconTool from './icon-tool.js';
import TextTool from './text-tool.js';
import LineTool from './line-tool.js';
import CircleTool from './circle-tool.js';
import HorseshoeGauge from './horseshoe-gauge.js';
import SparklineGraphTool from './sparkline-graph-tool.js';

const VISUAL_ITEM_TYPES = ['icon', 'text', 'state', 'name', 'area', 'line', 'circle', 'horseshoe', 'sparkline'];
const TEXT_SOURCE_ITEM_TYPES = ['state', 'name', 'area'];

/**
 * Read-only visual content stack shared by button controls and select segments.
 */
export default class ControlContent {
  /**
   * Normalizes one explicit content stack and creates its visual child tools.
   *
   * @param {object} contentConfig - Active content_horizontal/content_vertical config.
   * @param {string} direction - Stack direction: horizontal or vertical.
   * @param {object} bounds - Parent-owned x/y center and width/height.
   * @param {object} itemOverrides - Per-button or per-option overrides keyed by item id.
   * @param {number} parentEntityIndex - Entity inherited by every visual item.
   * @param {string} instanceId - Unique button or select-option content id.
   * @param {object} templates - Shared template evaluator.
   * @param {string} cardId - Parent card id.
   * @param {object} card - Parent card instance.
   */
  constructor(contentConfig, direction, bounds, itemOverrides, parentEntityIndex, instanceId, templates, cardId, card) {
    this.contentConfig = contentConfig;
    this.direction = direction;
    this.bounds = bounds;
    this.itemOverrides = itemOverrides;
    this.parentEntityIndex = parentEntityIndex;
    this.instanceId = instanceId;
    this.templates = templates;
    this.cardId = cardId;
    this.card = card;
    this.vertical = direction === 'vertical';
    this.childTools = [];

    // Complete all public padding shorthands here. The layout loop below only
    // consumes explicit edges and therefore performs no fallback decisions.
    const sourcePadding = contentConfig.padding;
    if (typeof sourcePadding === 'number') {
      this.padding = {
        top: sourcePadding,
        right: sourcePadding,
        bottom: sourcePadding,
        left: sourcePadding,
      };
    } else {
      const paddingTop = typeof sourcePadding.y === 'object' ? sourcePadding.y.top : sourcePadding.y;
      const paddingBottom = typeof sourcePadding.y === 'object' ? sourcePadding.y.bottom : sourcePadding.y;
      this.padding = {
        top: sourcePadding.top ?? paddingTop ?? 0,
        right: sourcePadding.right ?? sourcePadding.x ?? 0,
        bottom: sourcePadding.bottom ?? paddingBottom ?? 0,
        left: sourcePadding.left ?? sourcePadding.x ?? 0,
      };
    }

    // The parent entity is the normal source for every visual. A shared item may
    // override it, and the option-specific dictionary has final authority by id.
    // Validation belongs here because this constructor is the config boundary.
    const itemIds = new Set();
    this.items = contentConfig.items.map((sourceItem, itemIndex) => {
      if (sourceItem.id === undefined) throw Error(`[controls] Content item ${itemIndex} requires an id`);
      if (itemIds.has(sourceItem.id)) throw Error(`[controls] Duplicate content item id '${sourceItem.id}'`);
      if (!VISUAL_ITEM_TYPES.includes(sourceItem.type)) {
        throw Error(`[controls] Invalid content item type '${sourceItem.type}' [${VISUAL_ITEM_TYPES.join(', ')}]`);
      }
      itemIds.add(sourceItem.id);

      const mergedItem = Merge.mergeDeep(
        { entity_index: parentEntityIndex },
        sourceItem,
        itemOverrides[sourceItem.id] ?? {},
      );
      const sourceMargin = mergedItem.margin ?? 0;
      let margin;
      if (typeof sourceMargin === 'number') {
        margin = {
          top: sourceMargin,
          right: sourceMargin,
          bottom: sourceMargin,
          left: sourceMargin,
        };
      } else {
        margin = {
          top: sourceMargin.top ?? sourceMargin.y ?? 0,
          right: sourceMargin.right ?? sourceMargin.x ?? 0,
          bottom: sourceMargin.bottom ?? sourceMargin.y ?? 0,
          left: sourceMargin.left ?? sourceMargin.x ?? 0,
        };
      }

      return {
        ...mergedItem,
        margin,
      };
    });

    this.createVisualTools();
  }

  /** Divides the content box into equal cells and constructs every visual tool. */
  createVisualTools() {
    // Convert the parent-owned center and dimensions into the inner content box.
    // Child tools receive final card coordinates, not local percentages.
    const contentX = this.bounds.xpos - this.bounds.width / 2 + this.padding.left;
    const contentY = this.bounds.ypos - this.bounds.height / 2 + this.padding.top;
    const contentWidth = this.bounds.width - this.padding.left - this.padding.right;
    const contentHeight = this.bounds.height - this.padding.top - this.padding.bottom;
    const mainLength = this.vertical ? contentHeight : contentWidth;
    const cellLength = (mainLength - this.contentConfig.gap * (this.items.length - 1)) / this.items.length;

    // Divide only the main axis. Every item gets the full cross-axis space and
    // can refine its own cell with non-collapsing margins.
    this.childTools = this.items.map((item, itemIndex) => {
      const cellX = this.vertical
        ? contentX
        : contentX + itemIndex * (cellLength + this.contentConfig.gap);
      const cellY = this.vertical
        ? contentY + itemIndex * (cellLength + this.contentConfig.gap)
        : contentY;
      const cellWidth = this.vertical ? contentWidth : cellLength;
      const cellHeight = this.vertical ? cellLength : contentHeight;
      const itemX = cellX + item.margin.left;
      const itemY = cellY + item.margin.top;
      const itemWidth = cellWidth - item.margin.left - item.margin.right;
      const itemHeight = cellHeight - item.margin.top - item.margin.bottom;
      const xpos = itemX + itemWidth / 2;
      const yposc = itemY + itemHeight / 2;
      const childCardId = `${this.cardId}-${this.instanceId}-${item.id}`;
      const childId = `${this.instanceId}-${item.id}`;
      // Tool implementations differ between ypos and yposc, so publish the same
      // absolute center through both names. The enclosing control remains the
      // sole pointer target regardless of child tool capabilities.
      const visualConfig = Merge.mergeDeep(
        item,
        {
          id: childId,
          group: this.bounds.group,
          xpos,
          ypos: yposc,
          yposc,
          tap_action: { action: 'none' },
          hold_action: { action: 'none' },
          double_tap_action: { action: 'none' },
          styles: Merge.mergeDeep(
            ConfigHelper.toStyleDict(item.styles),
            { 'pointer-events': 'none' },
          ),
        },
      );
      delete visualConfig.type;
      delete visualConfig.margin;

      // Adapt each public content type to an existing FHS visual tool. This keeps
      // state, color-stop, template, animation, and lifecycle behavior shared.
      let tool;
      switch (item.type) {
        case 'icon': {
          visualConfig.icon_size_percent = Math.min(contentWidth, contentHeight) * item.size / 100;
          delete visualConfig.size;
          tool = new IconTool(visualConfig, itemIndex, this.templates, childCardId, this.card);
          break;
        }

        case 'text':
          visualConfig.text_overflow = Merge.mergeDeep(
            {
              mode: 'fit',
              fit: { max_width: itemWidth },
            },
            visualConfig.text_overflow ?? {},
          );
          tool = new TextTool(visualConfig, itemIndex, this.templates, childCardId, this.card);
          break;

        case 'state':
        case 'name':
        case 'area': {
          const sourcePart = { ...visualConfig, type: item.type };
          delete sourcePart.id;
          delete sourcePart.text;
          // Item styles belong to the outer TextTool. Repeating relative font
          // sizes on the generated tspan would multiply values such as 0.7em.
          delete sourcePart.styles;
          visualConfig.text = [sourcePart];
          visualConfig.text_overflow = Merge.mergeDeep(
            {
              mode: 'fit',
              fit: { max_width: itemWidth },
            },
            visualConfig.text_overflow ?? {},
          );
          tool = new TextTool(visualConfig, itemIndex, this.templates, childCardId, this.card);
          break;
        }

        case 'line':
          visualConfig.animation_section = 'lines';
          tool = new LineTool(visualConfig, itemIndex, this.templates, childCardId, this.card);
          break;

        case 'circle':
          tool = new CircleTool(visualConfig, itemIndex, this.templates, childCardId, this.card);
          break;

        case 'horseshoe':
          [tool] = HorseshoeGauge.setConfig(
            { layout: { horseshoes: [visualConfig] } },
            this.templates,
            childCardId,
            this.card,
          );
          break;

        case 'sparkline':
          [tool] = SparklineGraphTool.setConfig(
            { layout: { sparklines: [visualConfig] } },
            this.templates,
            childCardId,
            this.card,
          );
          break;

        default:
          throw Error(`[controls] Invalid content item type '${item.type}'`);
      }

      return {
        id: item.id,
        type: TEXT_SOURCE_ITEM_TYPES.includes(item.type) ? 'text' : item.type,
        baseStyles: ConfigHelper.toStyleDict(tool.config.styles),
        tool,
      };
    });
  }

  /** Updates child runtime configuration before entity state is assigned. */
  updateRuntimeConfig() {
    this.childTools.forEach((child) => child.tool.updateRuntimeConfig());
  }

  /**
   * Applies parent visual styling and publishes each inherited or overridden entity.
   *
   * @param {object} visualState - Active/inactive or selected/unselected visual state.
   * @param {string} transition - Parent control transition string.
   */
  setState(visualState, transition) {
    // Parent state colors apply only to semantic icon/text content. Data
    // visualizations retain their own styles and color-stop state at all times.
    this.childTools.forEach((child) => {
      if (child.type === 'icon' || child.type === 'text') {
        child.tool.config.styles = Merge.mergeDeep(
          ConfigHelper.toStyleDict(visualState[child.type].styles),
          child.baseStyles,
          { transition: `fill ${transition}, color ${transition}, opacity ${transition}` },
        );
      }
      this.card.cardTools.setToolEntityState(
        child.tool,
        this.card.resolvedEntityConfigs,
        this.card.entities,
      );
    });
  }

  /** Returns every visual child inside a pointer-transparent wrapper. */
  render() {
    return svg`
      <g class="control-content" style="pointer-events:none;">
        ${this.childTools.map((child) => child.tool.render())}
      </g>
    `;
  }

  /** Forwards initial Home Assistant availability to visual children. */
  hassAvailable() {
    this.childTools.forEach((child) => child.tool.hassAvailable());
  }

  /** Forwards parent DOM connection to visual children. */
  connected() {
    this.childTools.forEach((child) => child.tool.connected());
  }

  /** Stops timers and listeners owned by visual children. */
  disconnected() {
    this.childTools.forEach((child) => child.tool.disconnected());
  }

  /** Forwards Home Assistant websocket reconnects to visual children. */
  hassConnected() {
    this.childTools.forEach((child) => child.tool.hassConnected());
  }

  /** Reports whether any visual child requires a Home Assistant state pass. */
  requiresHassUpdate() {
    return this.childTools.some((child) => child.tool.requiresHassUpdate());
  }

  /** Forwards the parent's first completed render to visual children. */
  firstUpdated(changedProperties) {
    this.childTools.forEach((child) => child.tool.firstUpdated(changedProperties));
  }

  /** Forwards each completed parent render to visual children. */
  updated(changedProperties) {
    this.childTools.forEach((child) => child.tool.updated(changedProperties));
  }
}
