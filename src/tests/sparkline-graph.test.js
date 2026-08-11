import test from 'node:test';
import assert from 'node:assert/strict';
import SparklineGraph from '../sparkline-graph.js';

/** Builds only the state owned by SparklineGraph.update for its lifecycle contract. */
const createStateBandsGraph = () => {
  const graph = Object.create(SparklineGraph.prototype);
  graph.config = {
    sparkline: {
      show: {
        chart_type: 'state_bands',
      },
    },
  };
  graph.stateMap = {
    map: [
      { value: 0 },
      { value: 1 },
    ],
  };
  graph.buildAxisGeometry = () => {
    graph.axisGeometryBuilt = true;
  };

  return graph;
};

test('reports whether an update produced complete axis geometry', () => {
  const graph = createStateBandsGraph();

  assert.equal(graph.update([]), false);
  assert.equal(graph.axisGeometryBuilt, undefined);

  assert.equal(graph.update([{ state: 'on' }]), true);
  assert.equal(graph.axisGeometryBuilt, true);
});
