import test from 'node:test';
import assert from 'node:assert/strict';
import {
  renderHorseshoeBackgroundLayer,
  renderLabelBackgroundLayer,
  renderScaleLayer,
  renderTickmarkBackgroundLayer,
} from '../src/horseshoe-renderer.js';

const gradientItem = {
  key: 'gradient-0',
  path: 'M 0 0',
  arc: {
    gradient: {
      x1: 0,
      y1: 0,
      x2: 10,
      y2: 10,
      startColor: '#000000',
      endColor: '#ffffff',
    },
  },
};

test('arc backgrounds composite opacity once on their complete layer', () => {
  const styles = {
    opacity: 0.35,
    filter: 'blur(1px)',
    'fill-opacity': 0.6,
  };
  const runtimeConfig = {
    horseshoe_background: { styles },
    horseshoe_labels: { background: { styles } },
    horseshoe_tickmarks: { background: { styles } },
  };
  const renderedLayers = [
    renderHorseshoeBackgroundLayer(runtimeConfig, {}, [gradientItem], 'card', 0, (style) => style),
    renderLabelBackgroundLayer(runtimeConfig, {}, [gradientItem], 'card', 0, (style) => style),
    renderTickmarkBackgroundLayer(runtimeConfig, {}, [gradientItem], 'card', 0),
  ];

  renderedLayers.forEach((renderedLayer) => {
    const groupStyles = renderedLayer.values[1].values[0];
    const pathStyles = renderedLayer.values[3][0].values[2].values[0];

    assert.deepEqual(groupStyles, {
      filter: 'blur(1px)',
      opacity: 0.35,
    });
    assert.equal(pathStyles.opacity, undefined);
    assert.equal(pathStyles['fill-opacity'], 0.6);
    assert.match(pathStyles.fill, /^url\('#horseshoe-/);
  });
});

test('scale keeps the same layer opacity composition', () => {
  const runtimeConfig = {
    horseshoe_scale: {
      styles: { opacity: 0.35 },
    },
  };
  const renderedLayer = renderScaleLayer(runtimeConfig, {}, [gradientItem], 'card', 0, (style) => style);
  const groupStyles = renderedLayer.values[0].values[0];
  const pathStyles = renderedLayer.values[2][0].values[1].values[0];

  assert.equal(groupStyles.opacity, 0.35);
  assert.equal(pathStyles.opacity, undefined);
  assert.match(pathStyles.fill, /^url\('#horseshoe-scale-/);
});

