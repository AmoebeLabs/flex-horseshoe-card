import assert from 'node:assert/strict';
import test from 'node:test';

import { getIconSource, HomeAssistantIconPath } from '../src/icon-source.js';

test('configured icon sources distinguish Home Assistant, SVG, and raster sources', () => {
  assert.deepEqual(getIconSource('mdi:gauge'), {
    type: 'ha-icon',
    value: 'mdi:gauge',
  });
  assert.deepEqual(getIconSource("url('/local/marker.svg')"), {
    type: 'svg-url',
    value: '/local/marker.svg',
  });
  assert.deepEqual(getIconSource('url(/local/marker.webp)'), {
    type: 'image-url',
    value: '/local/marker.webp',
  });
});

test('Home Assistant icon paths are shared through the existing card cache', () => {
  const card = {
    iconCache: { 'mdi:gauge': 'M0 0h24v24z' },
  };
  const source = new HomeAssistantIconPath(card, 'marker');

  assert.equal(source.elementId, 'icon-marker');
  assert.equal(source.getPath('mdi:gauge'), 'M0 0h24v24z');
  assert.equal(source.path, 'M0 0h24v24z');
});
