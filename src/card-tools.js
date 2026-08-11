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

const RUNTIME_SECTIONS = ['horseshoes', 'names', 'areas', 'states', 'texts', 'rectangles', 'lines', 'circles', 'arcs', 'icons', 'controls'];
const RENDER_SECTIONS = ['rectangles', 'circles', 'arcs', 'horseshoes', 'lines', 'icons', 'areas', 'names', 'states', 'texts', 'sparklines', 'controls'];

/** Owns every configured layout tool and forwards their shared lifecycle phases. */
export default class CardTools {
  constructor(card, templates, cardId) {
    this.card = card;
    this.templates = templates;
    this.cardId = cardId;
    this.sections = {
      rectangles: [], circles: [], arcs: [], horseshoes: [], lines: [], icons: [],
      areas: [], names: [], states: [], texts: [], sparklines: [], controls: [],
    };
  }

  /** Constructs horseshoes before main calculates the remaining SVG dimensions. */
  setHorseshoeConfig(config) {
    this.sections.horseshoes = HorseshoeGauge.setConfig(config, this.templates, this.cardId, this.card);
  }

  /** Constructs the remaining tools after main has calculated their SVG dimensions. */
  setLayoutToolConfig(config) {
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

  /** Returns a fresh list in the established SVG render order. */
  getRenderableTools() {
    return RENDER_SECTIONS.flatMap((section) => this.sections[section]);
  }

  /** Updates only sparkline runtime config before derived sparkline entities exist. */
  updateSparklineRuntimeConfig() {
    this.sections.sparklines.forEach((tool) => tool.updateRuntimeConfig());
  }

  /** Updates every non-sparkline tool after derived sparkline entities are current. */
  updateRuntimeConfig() {
    RUNTIME_SECTIONS.forEach((section) => this.sections[section].forEach((tool) => tool.updateRuntimeConfig()));
  }

  /** Assigns entity data to every tool in the requested sections. */
  setEntityStates(sectionNames, entityConfigs, entities) {
    sectionNames.forEach((section) => {
      this.sections[section].forEach((tool) => {
        const entityIndex = tool.entity_index;
        if (entityIndex === undefined || entityIndex === null) {
          tool.setState(undefined, undefined);
          return;
        }

        const entityConfig = entityConfigs[entityIndex];
        const entity = entities[entityIndex];
        if (entity && entityConfig) tool.setState(entity, entityConfig);
      });
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

  /** Forwards Home Assistant availability after the card receives its first hass object. */
  hassAvailable() {
    this.getRenderableTools().forEach((tool) => tool.hassAvailable());
  }

  /** Forwards connection readiness from the Home Assistant connection helper. */
  hassConnected() {
    this.getRenderableTools().forEach((tool) => tool.hassConnected());
  }

  /** Forwards the custom-element connection lifecycle. */
  connected() {
    this.getRenderableTools().forEach((tool) => tool.connected());
  }

  /** Forwards the custom-element disconnection lifecycle. */
  disconnected() {
    this.getRenderableTools().forEach((tool) => tool.disconnected());
  }

  /** Forwards Lit's first update and attaches sparkline pointer handlers. */
  firstUpdated(changedProperties) {
    this.getRenderableTools().forEach((tool) => tool.firstUpdated(changedProperties));
    this.attachSparklinePointerHandlers();
  }

  /** Forwards Lit updates and restores pointer handlers replaced by rendering. */
  updated(changedProperties) {
    this.getRenderableTools().forEach((tool) => tool.updated(changedProperties));
    this.attachSparklinePointerHandlers();
  }

  /** Attaches interactions to the current sparkline DOM after rendering. */
  attachSparklinePointerHandlers() {
    this.sections.sparklines.forEach((tool) => tool.attachPointerHandlers());
  }
}
