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
}
