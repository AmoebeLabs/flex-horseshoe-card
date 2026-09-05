import HorseshoeGauge from './horseshoe-gauge.js';
import RectangleTool from './rectangle-tool.js';
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
import HorseshoeV3 from './horseshoe-v3.js';

const RUNTIME_SECTIONS = ['horseshoes', 'horseshoes_v3', 'names', 'areas', 'states', 'texts', 'rectangles', 'lines', 'circles', 'arcs', 'icons', 'controls'];
const RENDER_SECTIONS = ['rectangles', 'circles', 'arcs', 'horseshoes', 'horseshoes_v3', 'lines', 'icons', 'areas', 'names', 'states', 'texts', 'sparklines', 'controls'];

/** Owns every configured layout tool and forwards their shared lifecycle phases. */
export default class CardTools {
  /**
   * Creates stable section arrays for every tool family. Main and runtime
   * domains retain these arrays throughout the card lifecycle.
   */
  constructor(card, templates, cardId) {
    this.card = card;
    this.templates = templates;
    this.cardId = cardId;
    this.sections = {
      rectangles: [], circles: [], arcs: [], horseshoes: [], horseshoes_v3: [], lines: [], icons: [],
      areas: [], names: [], states: [], texts: [], sparklines: [], controls: [],
    };
  }

  /** Constructs horseshoes before main calculates the remaining SVG dimensions. */
  setHorseshoeConfig(config) {
    this.sections.horseshoes = HorseshoeGauge.setConfig(config, this.templates, this.cardId, this.card);
  }

  /** Constructs the remaining tools after main has calculated their SVG dimensions. */
  setLayoutToolConfig(config) {
    this.sections.horseshoes_v3 = HorseshoeV3.setConfig(config, this.templates, this.cardId, this.card);
    this.sections.names = NameTool.setConfig(config, this.templates, this.cardId, this.card);
    this.sections.areas = AreaTool.setConfig(config, this.templates, this.cardId, this.card);
    this.sections.states = StateTool.setConfig(config, this.templates, this.cardId, this.card);
    this.sections.texts = TextTool.setConfig(config, this.templates, this.cardId, this.card);
    this.sections.rectangles = RectangleTool.setConfig(config, this.templates, this.cardId, this.card);
    this.sections.lines = LineTool.setConfig(config, this.templates, this.cardId, this.card);
    this.sections.circles = CircleTool.setConfig(config, this.templates, this.cardId, this.card);
    this.sections.arcs = ArcTool.setConfig(config, this.templates, this.cardId, this.card);
    this.sections.icons = IconTool.setConfig(config, this.templates, this.cardId, this.card);
    this.sections.controls = ControlTool.setConfig(config, this.templates, this.cardId, this.card);
    this.sections.sparklines = SparklineGraphTool.setConfig(config, this.templates, this.cardId, this.card);
  }

  /** Returns the tools from one named layout section. */
  getBySection(section) {
    return this.sections[section];
  }

  /** Returns a configured number or the measured width of a referenced tool. */
  getItemWidth(itemWidthConfig) {
    if (typeof itemWidthConfig === 'number') return itemWidthConfig;
    const item = this.sections[itemWidthConfig.section].find((tool) => tool.id === itemWidthConfig.item_id);
    return item.getWidth() + itemWidthConfig.padding * 2;
  }

  /** Returns a configured number or the measured height of a referenced tool. */
  getItemHeight(itemHeightConfig) {
    if (typeof itemHeightConfig === 'number') return itemHeightConfig;
    const item = this.sections[itemHeightConfig.section].find((tool) => tool.id === itemHeightConfig.item_id);
    return item.getHeight() + itemHeightConfig.padding * 2;
  }

  /** Returns center and measured dimensions of one referenced tool. */
  getItemGeometry(fitConfig) {
    const item = this.sections[fitConfig.section].find((tool) => tool.id === fitConfig.item_id);
    return {
      xpos: item.getXpos(),
      ypos: item.getYpos(),
      width: item.getWidth(),
      height: item.getHeight(),
    };
  }

  /** Returns a fresh list in the established SVG render order. */
  getRenderableTools() {
    return RENDER_SECTIONS.flatMap((section) => this.sections[section]);
  }

  /** Sorts a fresh render list by layer and stable section render index. */
  getSortedRenderableTools() {
    return this.getRenderableTools()
      .sort((firstTool, secondTool) => Number(firstTool.zpos) - Number(secondTool.zpos) || Number(firstTool.renderIndex) - Number(secondTool.renderIndex));
  }

  /** Updates only sparkline runtime config before derived sparkline entities exist. */
  updateSparklineRuntimeConfig() {
    this.sections.sparklines.forEach((tool) => tool.updateRuntimeConfig());
  }

  /** Updates every non-sparkline tool after derived sparkline entities are current. */
  updateRuntimeConfig() {
    RUNTIME_SECTIONS.forEach((section) => this.sections[section].forEach((tool) => tool.updateRuntimeConfig()));
  }

  /**
   * Assigns the current entity and evaluated entity config to one tool.
   *
   * Controls use this for their visual child tools, while the section lifecycle
   * below uses the same path for normal top-level tools.
   */
  setToolEntityState(tool, entityConfigs, entities) {
    tool.setEntities(entityConfigs, entities);
  }

  /** Assigns entity data to every tool in the requested sections. */
  setEntityStates(sectionNames, entityConfigs, entities) {
    sectionNames.forEach((section) => {
      this.sections[section].forEach((tool) => this.setToolEntityState(tool, entityConfigs, entities));
    });
  }

  /** Assigns entity data to the sparkline tools before derived entity calculation. */
  setSparklineEntityStates(entityConfigs, entities) {
    this.setEntityStates(['sparklines'], entityConfigs, entities);
  }

  /** Assigns entity data to every non-sparkline tool. */
  setRuntimeEntityStates(entityConfigs, entities) {
    this.setEntityStates(RUNTIME_SECTIONS, entityConfigs, entities);
  }

  /**
   * Announces the first hass object once, after tool construction, so tools can
   * initialize their HA-dependent resources in a distinct lifecycle phase.
   */
  hassAvailable() {
    this.getRenderableTools().forEach((tool) => tool.hassAvailable());
  }

  /**
   * Announces websocket readiness after reconnects so history-backed tools mark
   * cached series for refresh during the next normal setHass pass.
   */
  hassConnected() {
    this.getRenderableTools().forEach((tool) => tool.hassConnected());
  }

  /**
   * Forwards DOM connection so history-backed and nested tools can mark their
   * existing data for resynchronization after a card is reused.
   */
  connected() {
    this.getRenderableTools().forEach((tool) => tool.connected());
  }

  /**
   * Forwards DOM disconnection so every tool releases owned timers, animation
   * frames and global pointer listeners even during an active interaction.
   */
  disconnected() {
    this.getRenderableTools().forEach((tool) => tool.disconnected());
  }

  /**
   * Forwards Lit's first committed render, then attaches sparkline handlers to
   * the SVG elements created by that render.
   */
  firstUpdated(changedProperties) {
    this.getRenderableTools().forEach((tool) => tool.firstUpdated(changedProperties));
    this.attachSparklinePointerHandlers();
  }

  /**
   * Forwards every committed render and reattaches sparkline pointer handlers
   * because Lit may have replaced the SVG elements they belonged to.
   */
  updated(changedProperties) {
    this.getRenderableTools().forEach((tool) => tool.updated(changedProperties));
    this.attachSparklinePointerHandlers();
  }

  /** Attaches interactions to the current sparkline DOM after rendering. */
  attachSparklinePointerHandlers() {
    this.sections.sparklines.forEach((tool) => tool.attachPointerHandlers());
  }
}
