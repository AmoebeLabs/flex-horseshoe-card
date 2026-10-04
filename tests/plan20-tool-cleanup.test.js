import test from 'node:test';
import assert from 'node:assert/strict';
import ControlToggle from '../src/control-toggle.js';
import Templates from '../src/templates.js';

test('Toggle JavaScript item context excludes preset checked and unchecked icons', () => {
  const templates = new Templates([]);
  templates.beginConfig({ constants: {}, entities: [] });
  const card = {
    evaluateJavascriptTemplates: true,
    cardLayout: {
      changedGroupIds: new Set(),
      calculateSvgCoordinatesInGroup: (config) => ({ xpos: config.xpos, ypos: config.ypos }),
    },
    cardTheme: {
      modeChanged: false,
      getActiveColorStopMode: () => 'light',
    },
  };
  const toggle = new ControlToggle({
    id: 'preset-icon-context',
    xpos: 50,
    ypos: 50,
    width: 40,
    show: { item_style: 'ha' },
    checkedPresetIconAbsent: '[[[ return item.ha?.checked?.icon === undefined; ]]]',
    uncheckedPresetIconAbsent: '[[[ return item.ha?.unchecked?.icon === undefined; ]]]',
  }, 0, templates, 'test-card', card);

  toggle.updateRuntimeConfig();

  assert.equal(toggle.config.checkedPresetIconAbsent, true);
  assert.equal(toggle.config.uncheckedPresetIconAbsent, true);
});
