import SparklineGraph from './sparkline-graph.js';

/**
 * Coordinates the graph engines belonging to one sparkline item.
 *
 * Phase 3 normalizes every existing sparkline into one internal default series.
 * The graph engine and its current row set live here while SparklineGraphTool
 * continues to own Home Assistant fetching and Lit rendering.
 */
export default class SparklineSeries {
  /**
   * Creates the implicit series used by all existing sparkline YAML.
   *
   * @param {object} config - Effective sparkline configuration.
   */
  constructor(config) {
    this.items = [{
      id: 'default',
      config,
      graph: undefined,
      rows: [],
    }];
  }

  /** Returns the only normalized series during the single-series phase. */
  get defaultItem() {
    return this.items[0];
  }

  /**
   * Replaces the graph after static or runtime configuration changed.
   *
   * @param {number} width - SVG graph width.
   * @param {number} height - SVG graph height.
   * @param {object} axisMargin - Outer axis and label space.
   * @param {object} configuredMargin - User-configured inner margin.
   * @param {object} graphConfig - Engine configuration for the active runtime state.
   * @param {Array<number>} gradeValues - Numeric grade boundaries.
   * @param {Array<object>} gradeRanks - Visual grade ranges.
   * @param {object} stateMap - State-band mapping for the graph engine.
   */
  createGraph(width, height, axisMargin, configuredMargin, graphConfig, gradeValues, gradeRanks, stateMap) {
    this.defaultItem.config = graphConfig;
    this.defaultItem.graph = new SparklineGraph(
      width,
      height,
      axisMargin,
      configuredMargin,
      graphConfig,
      gradeValues,
      gradeRanks,
      stateMap,
    );
  }

  /** Removes graph geometry while a dynamic period has no valid duration. */
  clearGraph() {
    this.defaultItem.graph = undefined;
  }

  /**
   * Replaces the current normalized rows supplied by SparklineGraphTool.
   *
   * @param {Array<object>} rows - Flat graph history rows.
   */
  setRows(rows) {
    this.defaultItem.rows = rows;
  }

  /**
   * Runs the one graph engine against its normalized rows.
   *
   * @returns {boolean} Whether complete graph geometry is available.
   */
  updateGraph() {
    return this.defaultItem.graph.update(this.defaultItem.rows);
  }
}
