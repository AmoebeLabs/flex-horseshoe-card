import { svg } from 'lit';

export default class Label {
  static renderColorStopLabel(args) {
    const labelText = String(args.label);
    const isNumericLabel = false; // Number.isFinite(Number(labelText));

    // Getallen altijd gewoon rotated label
    if (isNumericLabel) {
      return Label.renderColorStopRotatedLabel({
        ...args,
        label: labelText,
      });
    }

    // Alleen tekstlabels zoals Laag/Gemiddeld/Hoog via textPath
    if (labelText.length > 0) {
      return Label.renderColorStopTextPathLabel({
        ...args,
        label: labelText,
      });
    }

    return Label.renderColorStopRotatedLabel({
      ...args,
      label: labelText,
    });
  }

  static renderColorStopLabelV1(args) {
    const labelText = String(args.label);

    if (labelText.length > 3) {
      return Label.renderColorStopTextPathLabel({
        ...args,
        label: labelText,
      });
    }

    return Label.renderColorStopRotatedLabel({
      ...args,
      label: labelText,
    });
  }

  static renderColorStopTextPathLabel({ horseshoeIndex, index, label, angle, cx, cy, radius, cardId, isMin = false, isMax = false }) {
    const labelText = String(label);
    const arcSize = 24;

    let startAngle = angle - arcSize / 2;
    let endAngle = angle + arcSize / 2;

    if (isMin) {
      startAngle = angle;
      endAngle = angle + arcSize;
    }

    if (isMax) {
      startAngle = angle - arcSize;
      endAngle = angle;
    }

    const isTopHalf = angle > -90 && angle < 90;

    const pathStartAngle = isTopHalf ? startAngle : endAngle;
    const pathEndAngle = isTopHalf ? endAngle : startAngle;
    const sweepFlag = isTopHalf ? 1 : 0;

    let startOffset = '50%';
    let textAnchor = 'middle';

    if (isMin) {
      startOffset = isTopHalf ? '0%' : '100%';
      textAnchor = isTopHalf ? 'start' : 'end';
    }

    if (isMax) {
      startOffset = isTopHalf ? '100%' : '0%';
      textAnchor = isTopHalf ? 'end' : 'start';
    }

    const start = Label.polarToCartesian(cx, cy, radius, pathStartAngle);
    const end = Label.polarToCartesian(cx, cy, radius, pathEndAngle);

    // const pathId = `${cardId}-colorstop-label-${index}`;
    // const pathId = `${cardId}-colorstop-label-${Math.round(cx)}-${Math.round(cy)}-${index}`;
    const pathId = `${cardId}-colorstop-label-${horseshoeIndex}-${index}`;

    return svg`
    <path
      id="${pathId}"
      d="M ${start.x} ${start.y} A ${radius} ${radius} 0 0 ${sweepFlag} ${end.x} ${end.y}"
      fill="none"
      stroke="none"
    />

    <text
    <text
      class="horseshoe-colorstop-label"
      style="fill:var(--primary-text-color)"
      dy="0.30em"
    >
      <textPath
        href="#${pathId}"
        startOffset="${startOffset}"
        text-anchor="${textAnchor}"
      >
        ${labelText}
      </textPath>
    </text>
  `;
  }

  static renderColorStopTextPathLabelV4({ index, label, angle, cx, cy, radius, cardId, isMin, isMax }) {
    const labelText = String(label);
    const arcSize = 24;

    let startAngle = angle - arcSize / 2;
    let endAngle = angle + arcSize / 2;

    if (isMin) {
      startAngle = angle;
      endAngle = angle + arcSize;
    }

    if (isMax) {
      startAngle = angle - arcSize;
      endAngle = angle;
    }

    const isTopHalf = angle > -90 && angle < 90;

    const pathStartAngle = isTopHalf ? startAngle : endAngle;
    const pathEndAngle = isTopHalf ? endAngle : startAngle;
    const sweepFlag = isTopHalf ? 1 : 0;

    let startOffset = '50%';
    let textAnchor = 'middle';

    if (isMin) {
      startOffset = isTopHalf ? '0%' : '100%';
      textAnchor = isTopHalf ? 'start' : 'end';
    }

    if (isMax) {
      startOffset = isTopHalf ? '100%' : '0%';
      textAnchor = isTopHalf ? 'end' : 'start';
    }

    const start = Label.polarToCartesian(cx, cy, radius, pathStartAngle);
    const end = Label.polarToCartesian(cx, cy, radius, pathEndAngle);

    const pathId = `${cardId}-colorstop-label-${index}`;

    return svg`
    <path
      id="${pathId}"
      d="M ${start.x} ${start.y} A ${radius} ${radius} 0 0 ${sweepFlag} ${end.x} ${end.y}"
      fill="none"
      stroke="none"
    />

    <text class="horseshoe-colorstop-label" style="fill:var(--primary-text-color)">
      <textPath
        href="#${pathId}"
        startOffset="${startOffset}"
        text-anchor="${textAnchor}"
      >
        ${labelText}
      </textPath>
    </text>
  `;
  }

  static renderColorStopTextPathLabelV2({ index, label, angle, cx, cy, radius, cardId, isMin = false, isMax = false }) {
    const labelText = String(label);

    const arcSize = Math.max(18, labelText.length * 5);

    let startAngle = angle - arcSize / 2;
    let endAngle = angle + arcSize / 2;

    // min/max niet buiten de arc laten steken
    if (isMin) {
      startAngle = angle;
      endAngle = angle + arcSize;
    }

    if (isMax) {
      startAngle = angle - arcSize;
      endAngle = angle;
    }

    const isTopHalf = angle > -90 && angle < 90;

    const pathStartAngle = isTopHalf ? startAngle : endAngle;
    const pathEndAngle = isTopHalf ? endAngle : startAngle;
    const sweepFlag = isTopHalf ? 1 : 0;

    const start = Label.polarToCartesian(cx, cy, radius, pathStartAngle);
    const end = Label.polarToCartesian(cx, cy, radius, pathEndAngle);

    const pathId = `${cardId}-colorstop-label-${index}`;

    return svg`
    <path
      id="${pathId}"
      d="M ${start.x} ${start.y} A ${radius} ${radius} 0 0 ${sweepFlag} ${end.x} ${end.y}"
      fill="none"
      stroke="none"
    />

    <text class="horseshoe-colorstop-label" style="fill:var(--primary-text-color)">
      <textPath
        href="#${pathId}"
        startOffset="50%"
        text-anchor="middle"
      >
        ${labelText}
      </textPath>
    </text>
  `;
  }

  static renderColorStopTextPathLabelV1({ index, label, angle, cx, cy, radius, cardId }) {
    const labelText = String(label);
    const arcSize = Math.max(18, labelText.length * 5);

    const angleA = angle - arcSize / 2;
    const angleB = angle + arcSize / 2;

    const isTopHalf = angle > -90 && angle < 90;

    const pathStartAngle = isTopHalf ? angleA : angleB;
    const pathEndAngle = isTopHalf ? angleB : angleA;
    const sweepFlag = isTopHalf ? 1 : 0;

    const start = Label.polarToCartesian(cx, cy, radius, pathStartAngle);
    const end = Label.polarToCartesian(cx, cy, radius, pathEndAngle);

    const pathId = `${cardId}-colorstop-label-${index}`;

    const path = `
    M ${start.x} ${start.y}
    A ${radius} ${radius} 0 0 ${sweepFlag} ${end.x} ${end.y}
  `;

    return svg`
    <path
      id="${pathId}"
      d="${path}"
      fill="none"
      stroke="none"
    />

    <text class="horseshoe-colorstop-label">
      <textPath
        href="#${pathId}"
        startOffset="50%"
        text-anchor="middle"
      >
        ${labelText}
      </textPath>
    </text>
  `;
  }

  static renderColorStopRotatedLabel({ label, angle, cx, cy, radius }) {
    const point = Label.polarToCartesian(cx, cy, radius, angle);

    let textAngle = angle;

    if (textAngle > 90) textAngle -= 180;
    if (textAngle < -90) textAngle += 180;

    return svg`
      <text
        x="${point.x}"
        y="${point.y}"
        text-anchor="middle"
        dominant-baseline="middle"
        transform="rotate(${textAngle} ${point.x} ${point.y})"
        class="horseshoe-colorstop-label"
        style="fill:var(--primary-text-color)"
      >
        ${label}
      </text>
    `;
  }

  static renderColorStopTextPathLabelV3({ index, label, angle, cx, cy, radius, cardId }) {
    const arcSize = Math.max(18, String(label).length * 5);

    const startAngle = angle - arcSize / 2;
    const endAngle = angle + arcSize / 2;

    const start = Label.polarToCartesian(cx, cy, radius, endAngle);
    const end = Label.polarToCartesian(cx, cy, radius, startAngle);

    const pathId = `${cardId}-colorstop-label-${index}`;

    const path = `
      M ${start.x} ${start.y}
      A ${radius} ${radius} 0 0 0 ${end.x} ${end.y}
    `;

    return svg`
      <path
        id="${pathId}"
        d="${path}"
        fill="none"
        stroke="none"
      />

      <text class="horseshoe-colorstop-label">
        <textPath
          href="#${pathId}"
          startOffset="50%"
          text-anchor="middle"
          style="fill:var(--primary-text-color)"
        >
          ${label}
        </textPath>
      </text>
    `;
  }

  static valueToAngle(value, min, max, arcDegrees, barMode) {
    if (barMode !== 'bidirectional') {
      const pct = (value - min) / (max - min);
      return -arcDegrees / 2 + pct * arcDegrees;
    }

    const halfArc = arcDegrees / 2;

    if (value < 0) {
      const pct = value / min; // -10 / -20 = 0.5
      return -pct * halfArc;
    }

    if (value > 0) {
      const pct = value / max; // 20 / 40 = 0.5
      return pct * halfArc;
    }

    return 0;
  }

  static valueToAngleV1(value, min, max, arcDegrees, barMode) {
    if (barMode !== 'bidirectional') {
      const pct = (value - min) / (max - min);
      return -arcDegrees / 2 + pct * arcDegrees;
    }

    if (value < 0) {
      const pct = value / min;
      return -pct * (arcDegrees / 2);
    }

    if (value > 0) {
      const pct = value / max;
      return pct * (arcDegrees / 2);
    }

    return 0;
  }

  static polarToCartesian(cx, cy, radius, angleDeg) {
    const angleRad = ((angleDeg - 90) * Math.PI) / 180;

    return {
      x: cx + radius * Math.cos(angleRad),
      y: cy + radius * Math.sin(angleRad),
    };
  }

  // Example usage:
  // Full horseshoe arc for labels:
  //
  // Label.renderArcSegment({
  //   cx,
  //   cy,
  //   radius,
  //   startAngle: -arcDegrees / 2,
  //   endAngle: arcDegrees / 2,
  //   width: 14,
  //   color: 'rgba(255,255,255,0.12)',
  //   className: 'horseshoe-scale-background',
  // });
  //
  // Color stop zone:
  //
  // Label.renderArcSegment({
  //   cx,
  //   cy,
  //   radius,
  //   startAngle: Label.valueToAngle(startValue, min, max, arcDegrees, barMode),
  //   endAngle: Label.valueToAngle(endValue, min, max, arcDegrees, barMode),
  //   width: 14,
  //   color,
  //   className: 'horseshoe-colorstop-zone',
  // });
  //
  static renderArcSegment({ cx, cy, radius, startAngle, endAngle, width, color, className = '', lineCap = 'round' }) {
    const start = Label.polarToCartesian(cx, cy, radius, startAngle);
    const end = Label.polarToCartesian(cx, cy, radius, endAngle);

    const largeArcFlag = Math.abs(endAngle - startAngle) > 180 ? 1 : 0;
    const sweepFlag = endAngle > startAngle ? 1 : 0;

    return svg`
    <path
      class="${className}"
      d="M ${start.x} ${start.y}
         A ${radius} ${radius} 0 ${largeArcFlag} ${sweepFlag} ${end.x} ${end.y}"
      fill="none"
      stroke="${color}"
      stroke-width="${width}"
      stroke-linecap="${lineCap}"
      opacity="0.1"
    />
  `;
  }

  static buildColorStopSegments(colorStops, min, max) {
    const stops = colorStops
      .map((stop) => ({
        value: Number(stop.value),
        color: stop.color,
        label: stop.label ?? stop.value,
      }))
      .filter((stop) => Number.isFinite(stop.value) && stop.value >= min && stop.value <= max)
      .sort((a, b) => a.value - b.value);

    if (!stops.length) {
      return [];
    }

    const points = [
      {
        value: min,
        color: stops[0].color,
      },
      ...stops,
      {
        value: max,
        color: stops[stops.length - 1].color,
      },
    ];

    return points
      .slice(0, -1)
      .map((point, index) => {
        const next = points[index + 1];

        return {
          startValue: point.value,
          endValue: next.value,
          color: point.color,
        };
      })
      .filter((segment) => segment.startValue !== segment.endValue);
  }

  static buildColorStopSegmentsV1(colorStops, min, max) {
    const stops = colorStops
      .map((stop) => ({
        value: Number(stop.value),
        color: stop.color,
        label: stop.label ?? stop.value,
      }))
      .filter((stop) => Number.isFinite(stop.value) && stop.value >= min && stop.value <= max)
      .sort((a, b) => a.value - b.value);

    const points = [{ value: min, color: stops[0]?.color }, ...stops, { value: max, color: stops.at(-1)?.color }];

    return points
      .slice(0, -1)
      .map((point, index) => {
        const next = points[index + 1];

        return {
          startValue: point.value,
          endValue: next.value,
          color: next.color ?? point.color,
        };
      })
      .filter((segment) => segment.startValue !== segment.endValue);
  }

  static renderColorStopScaleSegments({ cx, cy, radius, startAngle, endAngle, width, colorStops, min, max, arcDegrees, barMode, gap = 0, opacity = 1, className = '', lineCap = 'butt' }) {
    const segments = Label.buildColorStopSegments(colorStops.colors, min, max);
    const useRoundCaps = lineCap === 'round';

    return svg`
    ${segments.map((segment, index) => {
      const isFirst = index === 0;
      const isLast = index === segments.length - 1;

      const startAngle = Label.valueToAngle(segment.startValue, min, max, arcDegrees, barMode) + gap / 2;
      const endAngle = Label.valueToAngle(segment.endValue, min, max, arcDegrees, barMode) - gap / 2;

      if (endAngle <= startAngle) return svg``;

      const sweepFlag = endAngle > startAngle ? 1 : 0;

      return svg`
        ${Label.renderArcSegment({
          cx,
          cy,
          radius,
          startAngle,
          endAngle,
          width,
          color: segment.color,
          opacity,
          className,
          lineCap: 'butt',
        })}

        ${
          isFirst && useRoundCaps
            ? Label.renderArcHalfCap({
                cx,
                cy,
                radius,
                angle: startAngle,
                width,
                color: segment.color,
                opacity,
                className,
                sweepFlag,
                side: 'start',
              })
            : svg``
        }

        ${
          isLast && useRoundCaps
            ? Label.renderArcHalfCap({
                cx,
                cy,
                radius,
                angle: endAngle,
                width,
                color: segment.color,
                opacity,
                className,
                sweepFlag,
                side: 'end',
              })
            : svg``
        }
      `;
    })}
  `;
  }

  static renderColorStopScaleSegmentsV2({ cx, cy, radius, width, colorStops, min, max, arcDegrees, barMode, gap = 0, opacity = 1, className = '' }) {
    const segments = Label.buildColorStopSegments(colorStops, min, max);

    return svg`
    ${segments.map((segment, index) => {
      const isFirst = index === 0;
      const isLast = index === segments.length - 1;

      const startAngle = Label.valueToAngle(segment.startValue, min, max, arcDegrees, barMode) + gap / 2;

      const endAngle = Label.valueToAngle(segment.endValue, min, max, arcDegrees, barMode) - gap / 2;

      if (endAngle <= startAngle) return svg``;

      const sweepFlag = endAngle > startAngle ? 1 : 0;

      return svg`
        ${Label.renderArcSegment({
          cx,
          cy,
          radius,
          startAngle,
          endAngle,
          width,
          color: segment.color,
          opacity,
          className,
          lineCap: 'butt',
        })}

        ${
          isFirst
            ? Label.renderArcHalfCap({
                cx,
                cy,
                radius,
                angle: startAngle,
                width,
                color: segment.color,
                opacity,
                className,
                sweepFlag,
                side: 'start',
              })
            : svg``
        }

        ${
          isLast
            ? Label.renderArcHalfCap({
                cx,
                cy,
                radius,
                angle: endAngle,
                width,
                color: segment.color,
                opacity,
                className,
                sweepFlag,
                side: 'end',
              })
            : svg``
        }
      `;
    })}
  `;
  }

  static renderColorStopScaleSegmentsV1({ cx, cy, radius, startAngle, endAngle, width, colorStops, min, max, arcDegrees, barMode, className = '', lineCap = 'butt' }) {
    const segments = Label.buildColorStopSegments(colorStops, min, max);

    return svg`
    ${segments.map((segment) => {
      const segmentStartAngle = Label.valueToAngle(segment.startValue, min, max, arcDegrees, barMode);

      const segmentEndAngle = Label.valueToAngle(segment.endValue, min, max, arcDegrees, barMode);

      return Label.renderArcSegment({
        cx,
        cy,
        radius,
        startAngle: segmentStartAngle,
        endAngle: segmentEndAngle,
        width,
        color: segment.color,
        className,
        lineCap,
      });
    })}
  `;
  }

  static renderArcHalfCap({
    cx,
    cy,
    radius,
    angle,
    width,
    color,
    opacity = 1,
    className = '',
    side = 'end', // 'start' | 'end'
  }) {
    const p = Label.polarToCartesian(cx, cy, radius, angle);
    const capRadius = width / 2;

    // Radiale richting = dwars over de stroke-breedte
    const radial = {
      x: (p.x - cx) / radius,
      y: (p.y - cy) / radius,
    };

    const a = {
      x: p.x - radial.x * capRadius,
      y: p.y - radial.y * capRadius,
    };

    const b = {
      x: p.x + radial.x * capRadius,
      y: p.y + radial.y * capRadius,
    };

    // const sweepFlag = side === 'start' ? 0 : 1;
    const sweepFlag = side === 'start' ? 1 : 0;

    return svg`
    <path
      class="${className}"
      d="
        M ${a.x} ${a.y}
        A ${capRadius} ${capRadius} 0 0 ${sweepFlag} ${b.x} ${b.y}
        Z
      "
      fill="${color}"
      opacity="${opacity}"
    />
  `;
  }

  static renderArcHalfCapV1({ cx, cy, radius, angle, width, color, sweepFlag, side }) {
    const p = Label.polarToCartesian(cx, cy, radius, angle);

    const capRadius = width / 2;

    const tangentDeg = sweepFlag ? angle + 90 : angle - 90;
    const tangentRad = ((tangentDeg - 90) * Math.PI) / 180;

    const dx = Math.cos(tangentRad) * capRadius;
    const dy = Math.sin(tangentRad) * capRadius;

    const a = { x: p.x - dx, y: p.y - dy };
    const b = { x: p.x + dx, y: p.y + dy };

    const capSweep = side === 'start' ? 0 : 1;

    return svg`
      <path
        d="
          M ${a.x} ${a.y}
          A ${capRadius} ${capRadius} 0 0 ${capSweep} ${b.x} ${b.y}
          L ${p.x} ${p.y}
          Z
        "
        fill="${color}"
      />
    `;
  }

  static textLengthToArcDegrees(textLength, radius, paddingDegrees = 6) {
    const circumference = 2 * Math.PI * radius;
    return (textLength / circumference) * 360 + paddingDegrees;
  }
}
