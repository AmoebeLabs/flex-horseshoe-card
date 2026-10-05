import HorseshoeGauge from './horseshoe-gauge.js';
import RectangleTool from './rectangle-tool.js';
import PolygonTool from './polygon-tool.js';
import LineTool from './line-tool.js';
import CircleTool from './circle-tool.js';
import ArcTool from './arc-tool.js';
import NameTool from './name-tool.js';
import AreaTool from './area-tool.js';
import StateTool from './state-tool.js';
import TextTool from './text-tool.js';
import IconTool from './icon-tool.js';
import ControlTool from './control-tool.js';
import SparklineGraphTool from './sparkline-graph-tool.js';
import getTextToolGeometry from './text-tool-geometry.js';

const RUNTIME_SECTIONS = ['horseshoes', 'names', 'areas', 'states', 'texts', 'rectangles', 'polygons', 'lines', 'circles', 'arcs', 'icons', 'controls'];
const RENDER_SECTIONS = ['rectangles', 'polygons', 'circles', 'arcs', 'horseshoes', 'lines', 'icons', 'areas', 'names', 'states', 'texts', 'sparklines', 'controls'];

/** Keeps tools for each configured layout section and forwards card updates to them. */
export default class CardTools {
  /**
   * Creates the named layout sections for this card. Replacing config disconnects
   * existing tools before new tools are created.
   */
  constructor(card, templates, cardId) {
    this.card = card;
    this.templates = templates;
    this.cardId = cardId;
    this.connectedToCard = false;
    this.disconnectedFromCard = false;
    this.sections = {
      rectangles: [], polygons: [], circles: [], arcs: [], horseshoes: [], lines: [], icons: [],
      areas: [], names: [], states: [], texts: [], sparklines: [], controls: [],
    };
  }

  /** Disconnects existing tools before a new card config creates replacements. */
  clearTools() {
    this.getRenderableTools().forEach((tool) => tool.disconnected());
    this.connectedToCard = false;
    RENDER_SECTIONS.forEach((section) => { this.sections[section] = []; });
  }

  /** Constructs horseshoes before main calculates the remaining SVG dimensions. */
  setHorseshoeConfig(config) {
    this.sections.horseshoes = HorseshoeGauge.setConfig(config, this.templates, this.cardId, this.card);
  }

  /** Constructs one layout section's tools with this card's shared context.
   *
   * @param {Array<object>} items - Config items from one normalized layout section.
   * @param {new (config: object, index: number, templates: object, cardId: string, card: LitElement) => object} ToolClass - Tool class for the section.
   * @returns {Array<object>} Configured tools in section order.
   */
  createLayoutTools(items, ToolClass) {
    return items.map((item, index) => new ToolClass(item, index, this.templates, this.cardId, this.card));
  }

  /** Constructs the remaining tools after main has calculated their SVG dimensions. */
  setLayoutToolConfig(config) {
    this.sections.names = this.createLayoutTools(config.layout?.names ?? [], NameTool);
    this.sections.areas = this.createLayoutTools(config.layout?.areas ?? [], AreaTool);
    this.sections.states = this.createLayoutTools(config.layout?.states ?? [], StateTool);
    this.sections.texts = this.createLayoutTools(config.layout?.texts ?? [], TextTool);
    this.sections.rectangles = this.createLayoutTools(config.layout?.rectangles ?? [], RectangleTool);
    this.sections.polygons = this.createLayoutTools(config.layout?.polygons ?? [], PolygonTool);
    this.sections.lines = LineTool.setConfig(config, this.templates, this.cardId, this.card);
    this.sections.circles = this.createLayoutTools(config.layout?.circles ?? [], CircleTool);
    this.sections.arcs = this.createLayoutTools(config.layout?.arcs ?? [], ArcTool);
    this.sections.icons = this.createLayoutTools(config.layout?.icons ?? [], IconTool);
    this.sections.controls = ControlTool.setConfig(config, this.templates, this.cardId, this.card);
    this.sections.sparklines = SparklineGraphTool.setConfig(config, this.templates, this.cardId, this.card);
  }

  /** Returns the tools from one named layout section. */
  getBySection(section) {
    return this.sections[section];
  }

  /** Returns configured width or measured/estimated Text width plus twice its configured padding. */
  getItemWidth(itemWidthConfig) {
    if (typeof itemWidthConfig === 'number') return itemWidthConfig;
    const item = this.sections[itemWidthConfig.section].find((tool) => tool.id === itemWidthConfig.item_id);
    return getTextToolGeometry(item).width + itemWidthConfig.padding * 2;
  }

  /** Returns configured height or measured/estimated Text height plus twice its configured padding. */
  getItemHeight(itemHeightConfig) {
    if (typeof itemHeightConfig === 'number') return itemHeightConfig;
    const item = this.sections[itemHeightConfig.section].find((tool) => tool.id === itemHeightConfig.item_id);
    return getTextToolGeometry(item).height + itemHeightConfig.padding * 2;
  }

  /** Returns the referenced Text tool's SVG position and measured or estimated size. */
  getItemGeometry(fitConfig) {
    const item = this.sections[fitConfig.section].find((tool) => tool.id === fitConfig.item_id);
    return getTextToolGeometry(item);
  }

  /** Returns a fresh list in the established SVG render order. */
  getRenderableTools() {
    return RENDER_SECTIONS.flatMap((section) => this.sections[section]);
  }

  /** Sorts tools by zpos, keeping configured SVG section order when layers tie. */
  getSortedRenderableTools() {
    return this.getRenderableTools()
      .sort((firstTool, secondTool) => firstTool.zpos - secondTool.zpos || firstTool.renderIndex - secondTool.renderIndex);
  }


  /** Evaluates Sparkline config before its fhs_sparkline.* values are calculated. */
  updateSparklineRuntimeConfig() {
    this.sections.sparklines.forEach((tool) => tool.updateRuntimeConfig());
  }

  /** Updates non-Sparkline tools after fhs_sparkline.* entity values are current. */
  updateRuntimeConfig() {
    RUNTIME_SECTIONS.forEach((section) => this.sections[section].forEach((tool) => tool.updateRuntimeConfig()));
  }

  /** Recalculates Sparkline and Horseshoe colors after HA theme or palette changes. */
  updatePalettePaint() {
    this.sections.sparklines.forEach((tool) => tool.updatePalettePaint());
    this.sections.horseshoes.forEach((tool) => tool.updatePalettePaint());
  }

  /** Updates Sparkline legend Text tools after all fhs_sparkline.* values are current. */
  updateSparklinePresentation() {
    this.sections.sparklines.forEach((tool) => tool.updateLegendTextTools());
  }

  /** Assigns entity data to every tool in the requested sections. */
  setEntityStates(sectionNames, entityConfigs, entities) {
    sectionNames.forEach((section) => {
      this.sections[section].forEach((tool) => tool.setEntities(entityConfigs, entities));
    });
  }

  /** Assigns HA and local entities to Sparkline tools before they calculate fhs_sparkline.* values. */
  setSparklineEntityStates(entityConfigs, entities) {
    this.setEntityStates(['sparklines'], entityConfigs, entities);
  }

  /** Assigns current HA and local entity data to every non-Sparkline tool. */
  setRuntimeEntityStates(entityConfigs, entities) {
    this.setEntityStates(RUNTIME_SECTIONS, entityConfigs, entities);
  }

  /**
   * Gives each configured tool the first Home Assistant object after construction.
   */
  hassAvailable() {
    this.getRenderableTools().forEach((tool) => tool.hassAvailable());
  }

  /**
   * Reports websocket readiness so Sparkline History can refresh rows after an
   * HA reconnect.
   */
  hassConnected() {
    if (!this.connectedToCard) return;
    this.getRenderableTools().forEach((tool) => tool.hassConnected());
  }

  /**
   * Notifies nested Control tools and Sparkline History when the card re-enters
   * the DOM, so History can recheck HA rows and icon readers can resume.
   */
  connected() {
    if (this.connectedToCard) return;
    this.connectedToCard = true;
    this.disconnectedFromCard = false;
    this.getRenderableTools().forEach((tool) => tool.connected());
  }

  /**
   * Notifies tools that the card left the DOM so they can stop timers and animation
   * frames and remove pointer listeners, including during an active Control drag.
   */
  disconnected() {
    this.connectedToCard = false;
    this.disconnectedFromCard = true;
    this.getRenderableTools().forEach((tool) => tool.disconnected());
  }

  /**
   * Forwards Lit's first committed render, then attaches sparkline handlers to
   * the SVG elements created by that render.
   */
  firstUpdated(changedProperties) {
    if (!this.connectedToCard) return;
    this.getRenderableTools().forEach((tool) => tool.firstUpdated(changedProperties));
    this.attachSparklinePointerHandlers();
  }

  /**
   * Forwards every committed render and reattaches sparkline pointer handlers
   * because Lit may have replaced the SVG elements they belonged to.
   */
  updated(changedProperties) {
    if (!this.connectedToCard) return;
    this.getRenderableTools().forEach((tool) => tool.updated(changedProperties));
    this.attachSparklinePointerHandlers();
  }

  /** Attaches interactions to the current sparkline DOM after rendering. */
  attachSparklinePointerHandlers() {
    this.sections.sparklines.forEach((tool) => tool.attachPointerHandlers());
  }
}
