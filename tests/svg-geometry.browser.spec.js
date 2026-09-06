import { readFile } from 'node:fs/promises';

import { test, expect } from '@playwright/test';

test('SVGGeometryElement reports actual length and points independently from pathLength', async ({ page }) => {
  await page.setContent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="240" height="40">
      <path id="actual" d="M 10 20 L 210 20"></path>
      <path id="normalized" d="M 10 20 L 210 20" pathLength="100"></path>
    </svg>
  `);

  const geometry = await page.evaluate(() => {
    const actual = document.querySelector('#actual');
    const normalized = document.querySelector('#normalized');
    const actualMidpoint = actual.getPointAtLength(actual.getTotalLength() / 2);
    const normalizedMidpoint = normalized.getPointAtLength(normalized.getTotalLength() / 2);

    return {
      actualLength: actual.getTotalLength(),
      normalizedLength: normalized.getTotalLength(),
      normalizedPathLength: Number(normalized.getAttribute('pathLength')),
      actualMidpoint: { x: actualMidpoint.x, y: actualMidpoint.y },
      normalizedMidpoint: { x: normalizedMidpoint.x, y: normalizedMidpoint.y },
    };
  });

  expect(geometry.actualLength).toBeCloseTo(200, 5);
  expect(geometry.normalizedLength).toBeCloseTo(200, 5);
  expect(geometry.normalizedPathLength).toBe(100);
  expect(geometry.actualMidpoint).toEqual({ x: 110, y: 20 });
  expect(geometry.normalizedMidpoint).toEqual({ x: 110, y: 20 });
});

test('pathLength 100 gives different actual paths the same relative dash coverage', async ({ page }) => {
  await page.setContent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="440" height="80">
      <path id="short" d="M 10 20 L 210 20" pathLength="100"
        fill="none" stroke="black" stroke-width="10" stroke-dasharray="25 75"></path>
      <path id="long" d="M 10 60 L 410 60" pathLength="100"
        fill="none" stroke="black" stroke-width="10" stroke-dasharray="25 75"></path>
    </svg>
  `);

  const paintedPoints = await page.evaluate(() => {
    const shortPath = document.querySelector('#short');
    const longPath = document.querySelector('#long');

    return {
      shortInside: shortPath.isPointInStroke(new DOMPoint(50, 20)),
      shortOutside: shortPath.isPointInStroke(new DOMPoint(90, 20)),
      longInside: longPath.isPointInStroke(new DOMPoint(90, 60)),
      longOutside: longPath.isPointInStroke(new DOMPoint(130, 60)),
    };
  });

  expect(paintedPoints).toEqual({
    shortInside: true,
    shortOutside: false,
    longInside: true,
    longOutside: false,
  });
});

test('an invisible zero-size master path remains measurable', async ({ page }) => {
  await page.setContent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="0" height="0"
      aria-hidden="true" style="position:absolute;visibility:hidden;pointer-events:none">
      <path id="measurement" d="M 5 5 C 25 45 75 45 95 5" pathLength="100"></path>
    </svg>
  `);

  const measurement = await page.evaluate(() => {
    const path = document.querySelector('#measurement');
    const length = path.getTotalLength();
    const midpoint = path.getPointAtLength(length / 2);

    return {
      connected: path.isConnected,
      length,
      midpoint: { x: midpoint.x, y: midpoint.y },
    };
  });

  expect(measurement.connected).toBe(true);
  expect(measurement.length).toBeGreaterThan(90);
  expect(measurement.midpoint.x).toBeCloseTo(50, 3);
  expect(measurement.midpoint.y).toBeGreaterThan(30);
});

test('geometry-dependent content stays hidden until its first path binding is complete', async ({ page }) => {
  await page.setContent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="240" height="80">
      <path id="measurement" d="M 10 40 L 210 40" pathLength="100"
        fill="none" stroke="transparent"></path>
      <circle id="dependent" cx="0" cy="0" r="5" visibility="hidden"></circle>
    </svg>
    <script>
      window.bindPathGeometry = () => new Promise((resolve) => {
        requestAnimationFrame(() => {
          const path = document.querySelector('#measurement');
          const dependent = document.querySelector('#dependent');
          const point = path.getPointAtLength(path.getTotalLength() / 2);

          dependent.setAttribute('cx', point.x);
          dependent.setAttribute('cy', point.y);
          dependent.setAttribute('visibility', 'visible');
          resolve();
        });
      });
    </script>
  `);

  await expect(page.locator('#dependent')).toHaveAttribute('visibility', 'hidden');
  await page.evaluate(() => window.bindPathGeometry());
  await expect(page.locator('#dependent')).toHaveAttribute('visibility', 'visible');
  await expect(page.locator('#dependent')).toHaveAttribute('cx', '110');
  await expect(page.locator('#dependent')).toHaveAttribute('cy', '40');
});

test('PathGeometry measures each signature once and hides output during rebinding', async ({ page }) => {
  const pathGeometrySource = await readFile(new URL('../src/path-geometry.js', import.meta.url), 'utf8');

  await page.setContent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="240" height="80">
      <path id="measurement" d="M 10 40 L 110 40" pathLength="100"
        fill="none" stroke="transparent"></path>
      <circle id="dependent" cx="0" cy="0" r="5" visibility="hidden"></circle>
    </svg>
  `);

  const lifecycle = await page.evaluate(async (moduleSource) => {
    const moduleUrl = URL.createObjectURL(new Blob([moduleSource], { type: 'text/javascript' }));
    const { default: PathGeometry } = await import(moduleUrl);
    const pathElement = document.querySelector('#measurement');
    const dependent = document.querySelector('#dependent');
    const nativeGetTotalLength = pathElement.getTotalLength.bind(pathElement);
    let measurementCalls = 0;
    let requestedRenders = 0;

    pathElement.getTotalLength = () => {
      measurementCalls += 1;
      return nativeGetTotalLength();
    };

    const geometry = new PathGeometry(() => {
      requestedRenders += 1;
    });
    const shortDefinition = {
      d: 'M 10 40 L 110 40',
      closed: false,
      direction: 'forward',
      signature: 'line-100',
    };
    const longDefinition = {
      d: 'M 10 40 L 210 40',
      closed: false,
      direction: 'forward',
      signature: 'line-200',
    };

    geometry.setPathDefinition(shortDefinition);
    geometry.bindPathElement(pathElement);
    dependent.setAttribute('visibility', geometry.isReady() ? 'visible' : 'hidden');
    const initial = {
      ready: geometry.isReady(),
      visibility: dependent.getAttribute('visibility'),
      totalLength: geometry.getTotalLength(),
      measurementCalls,
      requestedRenders,
    };

    geometry.setPathDefinition(shortDefinition);
    geometry.bindPathElement(pathElement);
    const unchanged = { measurementCalls, requestedRenders };

    geometry.setPathDefinition(longDefinition);
    dependent.setAttribute('visibility', geometry.isReady() ? 'visible' : 'hidden');
    pathElement.setAttribute('d', longDefinition.d);
    const invalidated = {
      ready: geometry.isReady(),
      visibility: dependent.getAttribute('visibility'),
    };
    geometry.bindPathElement(pathElement);
    const changed = {
      ready: geometry.isReady(),
      totalLength: geometry.getTotalLength(),
      measurementCalls,
      requestedRenders,
    };

    geometry.setPathDefinition(shortDefinition);
    pathElement.setAttribute('d', shortDefinition.d);
    geometry.bindPathElement(pathElement);
    const reused = {
      ready: geometry.isReady(),
      totalLength: geometry.getTotalLength(),
      measurementCalls,
      requestedRenders,
    };

    URL.revokeObjectURL(moduleUrl);
    return { initial, unchanged, invalidated, changed, reused };
  }, pathGeometrySource);

  expect(lifecycle).toEqual({
    initial: {
      ready: true,
      visibility: 'visible',
      totalLength: 100,
      measurementCalls: 1,
      requestedRenders: 1,
    },
    unchanged: {
      measurementCalls: 1,
      requestedRenders: 1,
    },
    invalidated: {
      ready: false,
      visibility: 'hidden',
    },
    changed: {
      ready: true,
      totalLength: 200,
      measurementCalls: 2,
      requestedRenders: 2,
    },
    reused: {
      ready: true,
      totalLength: 100,
      measurementCalls: 2,
      requestedRenders: 3,
    },
  });
});

test('all initial path generators produce measurable centerlines with stable endpoints', async ({ page }) => {
  const pathGeneratorSource = await readFile(new URL('../src/path-generators.js', import.meta.url), 'utf8');

  const generatedPaths = await page.evaluate(async (moduleSource) => {
    const moduleUrl = URL.createObjectURL(new Blob([moduleSource], { type: 'text/javascript' }));
    const { buildPathDefinition } = await import(moduleUrl);
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const configs = [
      {
        type: 'arc',
        cx: 50,
        cy: 50,
        radiusX: 40,
        radiusY: 40,
        startAngle: 0,
        arcDegrees: 90,
      },
      {
        type: 'line',
        x1: 10,
        y1: 20,
        x2: 110,
        y2: 70,
      },
      {
        type: 'rectangle',
        x: 10,
        y: 20,
        width: 100,
        height: 60,
        radiusTopLeft: 5,
        radiusTopRight: 10,
        radiusBottomRight: 15,
        radiusBottomLeft: 20,
        start: 'right',
        direction: 'counter-clockwise',
      },
      {
        type: 'wave',
        x1: 10,
        y1: 50,
        x2: 130,
        y2: 50,
        waves: 3,
        amplitude: 12,
      },
      {
        type: 'spiral',
        cx: 70,
        cy: 70,
        radiusInner: 5,
        radiusOuter: 55,
        startAngle: -90,
        degrees: 1080,
        points: 72,
      },
      {
        type: 'infinity',
        cx: 70,
        cy: 50,
        radiusX: 55,
        radiusY: 30,
      },
    ];
    const measurements = configs.map((config) => {
      const definition = buildPathDefinition(config);
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', definition.d);
      svg.append(path);
      const length = path.getTotalLength();
      const start = path.getPointAtLength(0);
      const end = path.getPointAtLength(length);

      return {
        type: config.type,
        closed: definition.closed,
        length,
        start: { x: start.x, y: start.y },
        end: { x: end.x, y: end.y },
      };
    });

    document.body.append(svg);
    URL.revokeObjectURL(moduleUrl);
    return measurements;
  }, pathGeneratorSource);

  const [arc, line, rectangle, wave, spiral, infinity] = generatedPaths;

  expect(arc.length).toBeCloseTo(Math.PI * 20, 1);
  expect(arc.start.x).toBeCloseTo(90, 4);
  expect(arc.start.y).toBeCloseTo(50, 4);
  expect(arc.end.x).toBeCloseTo(50, 4);
  expect(arc.end.y).toBeCloseTo(90, 4);

  expect(line.length).toBeCloseTo(Math.hypot(100, 50), 4);
  expect(line.start).toEqual({ x: 10, y: 20 });
  expect(line.end).toEqual({ x: 110, y: 70 });

  expect(rectangle.closed).toBe(true);
  expect(rectangle.length).toBeGreaterThan(280);
  expect(rectangle.start.x).toBeCloseTo(rectangle.end.x, 4);
  expect(rectangle.start.y).toBeCloseTo(rectangle.end.y, 4);

  expect(wave.length).toBeGreaterThan(120);
  expect(wave.start).toEqual({ x: 10, y: 50 });
  expect(wave.end.x).toBeCloseTo(130, 4);
  expect(wave.end.y).toBeCloseTo(50, 4);

  expect(spiral.closed).toBe(false);
  expect(spiral.length).toBeGreaterThan(500);
  expect(spiral.start.x).toBeCloseTo(70, 4);
  expect(spiral.start.y).toBeCloseTo(65, 4);
  expect(spiral.end.x).toBeCloseTo(70, 4);
  expect(spiral.end.y).toBeCloseTo(15, 4);

  expect(infinity.closed).toBe(true);
  expect(infinity.length).toBeGreaterThan(200);
  expect(infinity.start).toEqual({ x: 70, y: 50 });
  expect(infinity.end).toEqual({ x: 70, y: 50 });
});

test('shared measured geometry handles every initial shape, boundaries, corners, cusps, and seams', async ({ page }) => {
  const pathGeometrySource = await readFile(new URL('../src/path-geometry.js', import.meta.url), 'utf8');
  const pathGeneratorSource = await readFile(new URL('../src/path-generators.js', import.meta.url), 'utf8');

  const geometryContracts = await page.evaluate(async ({ geometrySource, generatorSource }) => {
    const geometryModuleUrl = URL.createObjectURL(new Blob([geometrySource], { type: 'text/javascript' }));
    const generatorModuleUrl = URL.createObjectURL(new Blob([generatorSource], { type: 'text/javascript' }));
    const { default: PathGeometry } = await import(geometryModuleUrl);
    const { buildPathDefinition } = await import(generatorModuleUrl);
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    document.body.append(svg);

    const configs = [
      {
        type: 'arc',
        cx: 50,
        cy: 50,
        radiusX: 40,
        radiusY: 40,
        startAngle: 0,
        arcDegrees: 270,
      },
      {
        type: 'line',
        x1: 10,
        y1: 20,
        x2: 110,
        y2: 70,
      },
      {
        type: 'rectangle',
        x: 10,
        y: 20,
        width: 100,
        height: 60,
        radiusTopLeft: 0,
        radiusTopRight: 0,
        radiusBottomRight: 0,
        radiusBottomLeft: 0,
        start: 'top',
        direction: 'clockwise',
      },
      {
        type: 'wave',
        x1: 10,
        y1: 50,
        x2: 130,
        y2: 50,
        waves: 3,
        amplitude: 12,
      },
      {
        type: 'spiral',
        cx: 70,
        cy: 70,
        radiusInner: 5,
        radiusOuter: 55,
        startAngle: -90,
        degrees: 1080,
        points: 72,
      },
      {
        type: 'infinity',
        cx: 70,
        cy: 50,
        radiusX: 55,
        radiusY: 30,
      },
    ];
    const sharedContracts = configs.map((config) => {
      const definition = buildPathDefinition(config);
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', definition.d);
      svg.append(path);
      const geometry = new PathGeometry(() => {});
      geometry.setPathDefinition(definition);
      geometry.bindPathElement(path);

      return {
        type: config.type,
        samples: [0, 25, 50, 75, 100].map((progress) => ({
          point: geometry.pointAtProgress(progress),
          tangent: geometry.tangentAtProgress(progress),
          left: geometry.normalAtProgress(progress, 'left'),
          right: geometry.normalAtProgress(progress, 'right'),
        })),
      };
    });

    const clockwiseArc = sharedContracts[0].samples[0].tangent;
    const counterClockwiseDefinition = buildPathDefinition({
      type: 'arc',
      cx: 50,
      cy: 50,
      radiusX: 40,
      radiusY: 40,
      startAngle: 0,
      arcDegrees: -90,
    });
    const counterClockwisePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    counterClockwisePath.setAttribute('d', counterClockwiseDefinition.d);
    svg.append(counterClockwisePath);
    const counterClockwiseGeometry = new PathGeometry(() => {});
    counterClockwiseGeometry.setPathDefinition(counterClockwiseDefinition);
    counterClockwiseGeometry.bindPathElement(counterClockwisePath);

    const rectangleDefinition = buildPathDefinition(configs[2]);
    const rectanglePath = svg.querySelectorAll('path')[2];
    const rectangleGeometry = new PathGeometry(() => {});
    rectangleGeometry.setPathDefinition(rectangleDefinition);
    rectangleGeometry.bindPathElement(rectanglePath);
    const cornerTangent = rectangleGeometry.tangentAtProgress((50 / rectangleGeometry.getTotalLength()) * 100);
    const seamStart = rectangleGeometry.tangentAtProgress(0);
    const seamEnd = rectangleGeometry.tangentAtProgress(100);

    const cuspDefinition = {
      d: 'M 0 0 L 50 0 L 0 0',
      closed: false,
      direction: 'forward',
      signature: 'cusp',
    };
    const cuspPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    cuspPath.setAttribute('d', cuspDefinition.d);
    svg.append(cuspPath);
    const cuspGeometry = new PathGeometry(() => {});
    cuspGeometry.setPathDefinition(cuspDefinition);
    cuspGeometry.bindPathElement(cuspPath);
    const cuspTangent = cuspGeometry.tangentAtProgress(50);

    // A self-intersection has two traversal positions at one physical point.
    // Its local tangent must remain continuous through the crossing, while the
    // closed seam must return with the same direction with which it started.
    const infinityDefinition = buildPathDefinition(configs[5]);
    const infinityPath = svg.querySelectorAll('path')[5];
    const infinityGeometry = new PathGeometry(() => {});
    infinityGeometry.setPathDefinition(infinityDefinition);
    infinityGeometry.bindPathElement(infinityPath);
    const infinityCrossing = {
      before: infinityGeometry.tangentAtProgress(49.9),
      at: infinityGeometry.tangentAtProgress(50),
      after: infinityGeometry.tangentAtProgress(50.1),
      point: infinityGeometry.pointAtProgress(50),
    };
    const infinitySeam = {
      start: infinityGeometry.tangentAtProgress(0),
      end: infinityGeometry.tangentAtProgress(100),
    };

    URL.revokeObjectURL(geometryModuleUrl);
    URL.revokeObjectURL(generatorModuleUrl);
    return {
      sharedContracts,
      clockwiseArc,
      counterClockwiseArc: counterClockwiseGeometry.tangentAtProgress(0),
      cornerTangent,
      seamStart,
      seamEnd,
      cuspTangent,
      infinityCrossing,
      infinitySeam,
    };
  }, {
    geometrySource: pathGeometrySource,
    generatorSource: pathGeneratorSource,
  });

  geometryContracts.sharedContracts.forEach(({ samples }) => {
    samples.forEach(({ point, tangent, left, right }) => {
      [point.x, point.y, tangent.x, tangent.y, left.x, left.y, right.x, right.y].forEach((value) => {
        expect(Number.isFinite(value)).toBe(true);
      });
      expect(Math.hypot(tangent.x, tangent.y)).toBeCloseTo(1, 5);
      expect(tangent.x * left.x + tangent.y * left.y).toBeCloseTo(0, 5);
      expect(left.x).toBeCloseTo(-right.x, 5);
      expect(left.y).toBeCloseTo(-right.y, 5);
    });
  });

  expect(geometryContracts.clockwiseArc.x).toBeCloseTo(0, 2);
  expect(geometryContracts.clockwiseArc.y).toBeCloseTo(1, 3);
  expect(geometryContracts.counterClockwiseArc.x).toBeCloseTo(0, 2);
  expect(geometryContracts.counterClockwiseArc.y).toBeCloseTo(-1, 3);
  expect(geometryContracts.cornerTangent.x).toBeCloseTo(Math.SQRT1_2, 2);
  expect(geometryContracts.cornerTangent.y).toBeCloseTo(Math.SQRT1_2, 2);
  expect(geometryContracts.seamStart.x).toBeCloseTo(geometryContracts.seamEnd.x, 5);
  expect(geometryContracts.seamStart.y).toBeCloseTo(geometryContracts.seamEnd.y, 5);
  expect(geometryContracts.cuspTangent.x).toBeCloseTo(-1, 5);
  expect(geometryContracts.cuspTangent.y).toBeCloseTo(0, 3);
  expect(geometryContracts.infinityCrossing.point.x).toBeCloseTo(70, 4);
  expect(geometryContracts.infinityCrossing.point.y).toBeCloseTo(50, 4);
  expect(geometryContracts.infinityCrossing.before.x).toBeCloseTo(geometryContracts.infinityCrossing.at.x, 2);
  expect(geometryContracts.infinityCrossing.before.y).toBeCloseTo(geometryContracts.infinityCrossing.at.y, 2);
  expect(geometryContracts.infinityCrossing.after.x).toBeCloseTo(geometryContracts.infinityCrossing.at.x, 2);
  expect(geometryContracts.infinityCrossing.after.y).toBeCloseTo(geometryContracts.infinityCrossing.at.y, 2);
  expect(geometryContracts.infinitySeam.start.x).toBeCloseTo(geometryContracts.infinitySeam.end.x, 5);
  expect(geometryContracts.infinitySeam.start.y).toBeCloseTo(geometryContracts.infinitySeam.end.y, 5);
});
