import test from 'node:test';
import assert from 'node:assert/strict';
import CardConfig from '../src/card-config.js';
import CardTemplates from '../src/card-templates.js';
import Compounds from '../src/compounds.js';
import ControlTool from '../src/control-tool.js';
import SameAs from '../src/same-as.js';
import Templates from '../src/templates.js';

test('SameAs replaces referenced color lists while retaining explicit array merge choices', () => {
  const cardConfig = new CardConfig({ hasJavascriptTemplates: () => false });
  const inheritedStops = {
    gap: 3,
    scales: { default: { min: 0, max: 100 } },
    colors: [{ value: 0, color: '#111111' }],
  };
  const referencedColors = [
    { value: 50, color: '#ff0000' },
    { value: 100, color: '#0000ff' },
  ];
  const appendedColor = { value: 25, color: '#00ff00' };
  const replacedColor = { value: 75, color: '#ffff00' };
  const config = {
    constants: { referencedColors: structuredClone(referencedColors) },
    layout: {
      groups: [],
      rectangles: [
        { id: 'base', color_stops: structuredClone(inheritedStops) },
        { id: 'reference', same_as: 'base', color_stops: { colors: 'ref(referencedColors)' } },
        { id: 'append', same_as: 'base', color_stops: { colors: [appendedColor] } },
        {
          id: 'explicit-replacement',
          same_as: 'base',
          same_as_replace: ['color_stops.colors'],
          color_stops: { colors: [replacedColor] },
        },
        { id: 'reference-copy', same_as: 'base', color_stops: { colors: 'ref(referencedColors)' } },
      ],
    },
  };

  cardConfig.compileStaticValues(config);
  assert.equal(
    Object.getOwnPropertyDescriptor(config.layout.rectangles[1].color_stops.colors, SameAs.STATIC_REF_MARKER).enumerable,
    false,
  );
  SameAs.compile(config);

  const [base, reference, append, explicitReplacement, referenceCopy] = config.layout.rectangles;
  assert.deepEqual(reference.color_stops, {
    gap: inheritedStops.gap,
    scales: inheritedStops.scales,
    colors: referencedColors,
  });
  assert.deepEqual(append.color_stops.colors, [...inheritedStops.colors, appendedColor]);
  assert.deepEqual(explicitReplacement.color_stops, {
    gap: inheritedStops.gap,
    scales: inheritedStops.scales,
    colors: [replacedColor],
  });
  assert.deepEqual(base.color_stops, inheritedStops);
  assert.notStrictEqual(reference.color_stops.colors, referenceCopy.color_stops.colors);
  assert.notStrictEqual(reference.color_stops.colors, config.constants.referencedColors);

  reference.color_stops.colors[0].color = '#123456';
  assert.deepEqual(referenceCopy.color_stops.colors, referencedColors);
  assert.deepEqual(config.constants.referencedColors, referencedColors);
});

test('SameAs replaces the complete referenced color-stop block independently', () => {
  const cardConfig = new CardConfig({ hasJavascriptTemplates: () => false });
  const completeColorStops = {
    gap: 8,
    scales: { default: { min: 10, max: 30 } },
    colors: [{ value: 10, color: '#008000' }, { value: 30, color: '#ffa500' }],
  };
  const config = {
    constants: { completeColorStops: structuredClone(completeColorStops) },
    layout: {
      groups: [],
      rectangles: [
        {
          id: 'base',
          color_stops: {
            gap: 1,
            scales: { default: { min: 0, max: 1 } },
            colors: [{ value: 0, color: '#000000' }],
          },
        },
        { id: 'complete-reference', same_as: 'base', color_stops: 'ref(completeColorStops)' },
        { id: 'complete-reference-copy', same_as: 'base', color_stops: 'ref(completeColorStops)' },
      ],
    },
  };

  cardConfig.compileStaticValues(config);
  assert.equal(
    Object.getOwnPropertyDescriptor(config.layout.rectangles[1].color_stops, SameAs.STATIC_REF_MARKER).enumerable,
    false,
  );
  SameAs.compile(config);

  const [, first, second] = config.layout.rectangles;
  assert.deepEqual(first.color_stops, completeColorStops);
  assert.deepEqual(second.color_stops, completeColorStops);
  assert.notStrictEqual(first.color_stops, second.color_stops);
  assert.notStrictEqual(first.color_stops, config.constants.completeColorStops);

  first.color_stops.scales.default.max = 25;
  first.color_stops.colors[0].color = '#123456';
  assert.deepEqual(second.color_stops, completeColorStops);
  assert.deepEqual(config.constants.completeColorStops, completeColorStops);
});

test('Compounds retain referenced replacements, keyed siblings and independent generated children', () => {
  const cardConfig = new CardConfig({ hasJavascriptTemplates: () => false });
  const referencedColors = [{ value: 40, color: '#ff00ff' }, { value: 80, color: '#00ffff' }];
  const referencedColorStops = {
    gap: 9,
    scales: { default: { min: 20, max: 80 } },
    colors: [{ value: 20, color: '#880000' }, { value: 80, color: '#008800' }],
  };
  const config = {
    constants: {
      referencedColors: structuredClone(referencedColors),
      referencedColorStops: structuredClone(referencedColorStops),
    },
    layout: {
      groups: [],
      rectangles: [],
      compounds: [
        {
          id: 'cpu',
          rectangles: [
            {
              id: 'base',
              width: 40,
              color_stops: {
                gap: 2,
                scales: { default: { min: 0, max: 100 } },
                colors: [{ value: 0, color: '#111111' }],
              },
            },
            { id: 'colors-copy', same_as: 'base', color_stops: { colors: 'ref(referencedColors)' } },
            { id: 'block-copy', same_as: 'base', color_stops: 'ref(referencedColorStops)' },
            { id: 'sibling', width: 20, styles: { fill: 'blue', opacity: 0.8 } },
          ],
        },
        {
          id: 'cpu-copy',
          same_as: 'cpu',
          rectangles: [{ id: 'sibling', styles: { opacity: 0.4 } }],
        },
      ],
    },
  };

  cardConfig.compileStaticValues(config);
  Compounds.compile(config);

  const baseColorsCopyBeforeSameAs = config.layout.rectangles.find((item) => item.id === 'cpu--colors-copy');
  const derivedColorsCopyBeforeSameAs = config.layout.rectangles.find((item) => item.id === 'cpu-copy--colors-copy');
  const baseBlockCopyBeforeSameAs = config.layout.rectangles.find((item) => item.id === 'cpu--block-copy');
  const derivedBlockCopyBeforeSameAs = config.layout.rectangles.find((item) => item.id === 'cpu-copy--block-copy');
  assert.equal(
    Object.getOwnPropertyDescriptor(baseColorsCopyBeforeSameAs.color_stops.colors, SameAs.STATIC_REF_MARKER).enumerable,
    false,
  );
  assert.equal(
    Object.getOwnPropertyDescriptor(baseBlockCopyBeforeSameAs.color_stops, SameAs.STATIC_REF_MARKER).enumerable,
    false,
  );
  assert.equal(
    Object.getOwnPropertyDescriptor(derivedColorsCopyBeforeSameAs.color_stops.colors, SameAs.STATIC_REF_MARKER).enumerable,
    false,
  );
  assert.equal(
    Object.getOwnPropertyDescriptor(derivedBlockCopyBeforeSameAs.color_stops, SameAs.STATIC_REF_MARKER).enumerable,
    false,
  );

  SameAs.compile(config);

  const baseColorsCopy = config.layout.rectangles.find((item) => item.id === 'cpu--colors-copy');
  const derivedColorsCopy = config.layout.rectangles.find((item) => item.id === 'cpu-copy--colors-copy');
  const baseBlockCopy = config.layout.rectangles.find((item) => item.id === 'cpu--block-copy');
  const derivedBlockCopy = config.layout.rectangles.find((item) => item.id === 'cpu-copy--block-copy');

  assert.equal(baseColorsCopy.width, 40);
  assert.deepEqual(baseColorsCopy.color_stops, {
    gap: 2,
    scales: { default: { min: 0, max: 100 } },
    colors: referencedColors,
  });
  assert.equal(derivedColorsCopy.width, 40);
  assert.deepEqual(derivedColorsCopy.color_stops, baseColorsCopy.color_stops);
  assert.equal(baseBlockCopy.width, 40);
  assert.deepEqual(baseBlockCopy.color_stops, referencedColorStops);
  assert.equal(derivedBlockCopy.width, 40);
  assert.deepEqual(derivedBlockCopy.color_stops, referencedColorStops);

  assert.deepEqual(config.layout.rectangles.find((item) => item.id === 'cpu-copy--sibling'), {
    id: 'cpu-copy--sibling',
    width: 20,
    styles: { fill: 'blue', opacity: 0.4 },
  });

  baseColorsCopy.color_stops.colors[0].color = '#123456';
  baseBlockCopy.color_stops.colors[0].color = '#654321';
  assert.deepEqual(derivedColorsCopy.color_stops.colors, referencedColors);
  assert.deepEqual(derivedBlockCopy.color_stops, referencedColorStops);
  assert.deepEqual(config.constants.referencedColors, referencedColors);
  assert.deepEqual(config.constants.referencedColorStops, referencedColorStops);
});

test('Compounds replace shared-default refs without changing ordinary child merges', () => {
  const cardConfig = new CardConfig(new Templates([]));
  const referencedColors = [{ value: 40, color: '#ff00ff' }, { value: 80, color: '#00ffff' }];
  const referencedColorStops = {
    gap: 7,
    scales: { default: { min: 10, max: 90 } },
    colors: [{ value: 10, color: '#123456' }, { value: 90, color: '#654321' }],
  };
  const defaults = {
    gap: 2,
    scales: { default: { min: 0, max: 100 } },
    colors: [{ value: 0, color: '#111111' }, { value: 100, color: '#eeeeee' }],
  };
  const config = {
    constants: {
      referencedColors: structuredClone(referencedColors),
      referencedColorStops: structuredClone(referencedColorStops),
    },
    layout: {
      groups: [],
      rectangles: [],
      compounds: [{
        id: 'shared',
        color_stops: structuredClone(defaults),
        rectangles: [
          { id: 'base' },
          { id: 'colors-ref', color_stops: { colors: 'ref(referencedColors)' } },
          { id: 'block-ref', color_stops: 'ref(referencedColorStops)' },
          { id: 'ordinary', color_stops: { colors: [{ value: 50, color: '#00ff00' }] } },
          { id: 'same-as-base' },
          { id: 'same-as-ref', same_as: 'same-as-base', color_stops: { colors: 'ref(referencedColors)' } },
          { id: 'unaffected-sibling' },
        ],
      }],
    },
  };

  cardConfig.compileStaticValues(config);
  Compounds.compile(config);

  const generatedColorsRef = config.layout.rectangles.find((item) => item.id === 'shared--colors-ref');
  const generatedBlockRef = config.layout.rectangles.find((item) => item.id === 'shared--block-ref');
  const generatedSameAsRef = config.layout.rectangles.find((item) => item.id === 'shared--same-as-ref');
  assert.equal(
    Object.getOwnPropertyDescriptor(generatedColorsRef.color_stops.colors, SameAs.STATIC_REF_MARKER).enumerable,
    false,
  );
  assert.equal(
    Object.getOwnPropertyDescriptor(generatedBlockRef.color_stops, SameAs.STATIC_REF_MARKER).enumerable,
    false,
  );
  assert.equal(
    Object.getOwnPropertyDescriptor(generatedSameAsRef.color_stops.colors, SameAs.STATIC_REF_MARKER).enumerable,
    false,
  );

  SameAs.compile(config);

  const generatedBase = config.layout.rectangles.find((item) => item.id === 'shared--base');
  const finalColorsRef = config.layout.rectangles.find((item) => item.id === 'shared--colors-ref');
  const finalBlockRef = config.layout.rectangles.find((item) => item.id === 'shared--block-ref');
  const finalOrdinary = config.layout.rectangles.find((item) => item.id === 'shared--ordinary');
  const finalSameAsRef = config.layout.rectangles.find((item) => item.id === 'shared--same-as-ref');
  const finalUnaffectedSibling = config.layout.rectangles.find((item) => item.id === 'shared--unaffected-sibling');

  assert.deepEqual(generatedBase.color_stops, defaults);
  assert.deepEqual(finalColorsRef.color_stops, {
    gap: defaults.gap,
    scales: defaults.scales,
    colors: referencedColors,
  });
  assert.deepEqual(finalBlockRef.color_stops, referencedColorStops);
  assert.deepEqual(finalOrdinary.color_stops, {
    ...defaults,
    colors: [...defaults.colors, { value: 50, color: '#00ff00' }],
  });
  assert.deepEqual(finalSameAsRef.color_stops, {
    gap: defaults.gap,
    scales: defaults.scales,
    colors: referencedColors,
  });
  assert.deepEqual(finalUnaffectedSibling.color_stops, defaults);

  finalColorsRef.color_stops.colors[0].color = '#123456';
  assert.deepEqual(finalSameAsRef.color_stops.colors, referencedColors);
  assert.deepEqual(finalUnaffectedSibling.color_stops, defaults);
  assert.deepEqual(config.constants.referencedColors, referencedColors);
});

test('ControlTool keeps a referenced select option map replacing inherited options after filtering', () => {
  const cardConfig = new CardConfig(new Templates([]));
  const templates = new Templates([]);
  const config = {
    constants: {
      replacementOptions: [
        { value: 'disabled', disabled: true },
        { value: 'selected', disabled: false },
        { value: 'available' },
      ],
    },
    layout: {
      groups: [],
      controls: [
        { id: 'base', type: 'select', option_map: [{ value: 'base' }] },
        { id: 'referenced', type: 'select', same_as: 'base', option_map: 'ref(replacementOptions)' },
        { id: 'append', type: 'select', same_as: 'base', option_map: [{ value: 'ordinary' }] },
      ],
    },
  };

  cardConfig.compileStaticValues(config);
  ControlTool.compileConfig(config, templates);

  const filteredOptionMap = config.layout.controls[1].option_map;
  assert.equal(
    Object.getOwnPropertyDescriptor(filteredOptionMap, SameAs.STATIC_REF_MARKER)?.enumerable,
    false,
  );
  assert.deepEqual(filteredOptionMap.map((option) => option.value), ['selected', 'available']);

  SameAs.compile(config);

  assert.deepEqual(config.layout.controls[1].option_map.map((option) => option.value), ['selected', 'available']);
  assert.deepEqual(config.layout.controls[2].option_map.map((option) => option.value), ['base', 'ordinary']);
});

test('CardTemplates keeps card array replacement and ref behavior through config compilation', () => {
  const cardConfig = new CardConfig({ hasJavascriptTemplates: () => false });
  const palette = {
    gap: 5,
    scales: { default: { min: 0, max: 100 } },
    colors: [{ value: 0, color: '#000000' }, { value: 100, color: '#ffffff' }],
  };
  const card = {
    lovelace: {
      config: {
        fhs_sys_templates: {
          templates: {
            base: {
              template: { type: 'card' },
              card: {
                entities: [{ entity: 'sensor.template' }],
                constants: { palette: structuredClone(palette) },
                layout: { groups: [], rectangles: [{ id: 'template-shape' }] },
              },
            },
          },
        },
      },
      rawConfig: {},
    },
  };
  const config = {
    template: { name: 'base' },
    entities: [{ entity: 'sensor.card' }],
    layout: {
      rectangles: [{ id: 'card-shape', color_stops: 'ref(palette)' }],
    },
  };

  CardTemplates.compile(config, card);
  cardConfig.compileStaticValues(config);
  Compounds.compile(config);
  SameAs.compile(config);

  assert.deepEqual(config.entities, [{ entity: 'sensor.card' }]);
  assert.deepEqual(config.layout.rectangles.map((item) => item.id), ['card-shape']);
  assert.deepEqual(config.layout.rectangles[0].color_stops, palette);
  assert.notStrictEqual(config.layout.rectangles[0].color_stops, config.constants.palette);
});
