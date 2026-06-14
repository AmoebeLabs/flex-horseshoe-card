import { svg } from 'lit';

export default class HorseshoeLabels {
  static renderLabel(labelConfig) {
    const orientation = labelConfig.orientation ?? 'arc';

    if (orientation === 'horizontal') {
      return HorseshoeLabels.renderHorizontalLabel(labelConfig);
    }

    return HorseshoeLabels.renderArcLabel(labelConfig);
  }

  static renderHorizontalLabel(labelConfig) {
    const point = HorseshoeLabels.pointAt({
      cx: labelConfig.cx,
      cy: labelConfig.cy,
      radius: labelConfig.radius,
      angle: labelConfig.angle,
    });

    const transformContext = labelConfig.transformContext ?? {};
    const rotation = transformContext.rotation ?? 0;
    const flipX = transformContext.flipX ?? false;
    const flipY = transformContext.flipY ?? false;

    const scaleX = flipX ? -1 : 1;
    const scaleY = flipY ? -1 : 1;

    return svg`
      <text
        x="${point.x}"
        y="${point.y}"
        text-anchor="middle"
        style="dominant-baseline:central;fill:var(--primary-text-color)"
        class="horseshoe-label"
        transform="
          translate(${point.x} ${point.y})
          scale(${scaleX} ${scaleY})
          rotate(${-rotation})
          translate(${-point.x} ${-point.y})
        "
      >
        ${labelConfig.label}
      </text>
    `;
  }

  static renderArcLabel(labelConfig) {
    const labelText = String(labelConfig.label ?? '');
    const arcSize = 24;

    const labelGeometry = HorseshoeLabels.getLabelGeometry({
      angle: labelConfig.angle,
      transformContext: labelConfig.transformContext,
    });

    const labelAngle = labelGeometry.mirrored
      ? HorseshoeLabels.normalizeAngle(labelGeometry.visualAngle + 180)
      : labelGeometry.visualAngle;

    let startAngle = labelAngle - arcSize / 2;
    let endAngle = labelAngle + arcSize / 2;

    if (labelConfig.isMin) {
      startAngle = labelAngle;
      endAngle = labelAngle + arcSize;
    }

    if (labelConfig.isMax) {
      startAngle = labelAngle - arcSize;
      endAngle = labelAngle;
    }

    const isTopHalf = labelAngle >= 180 && labelAngle <= 360;
    const pathStartAngle = isTopHalf ? startAngle : endAngle;
    const pathEndAngle = isTopHalf ? endAngle : startAngle;
    const sweepFlag = isTopHalf ? 1 : 0;

    let startOffset = '50%';
    let textAnchor = 'middle';

    if (labelConfig.isMin) {
      startOffset = isTopHalf ? '0%' : '100%';
      textAnchor = isTopHalf ? 'start' : 'end';
    }

    if (labelConfig.isMax) {
      startOffset = isTopHalf ? '100%' : '0%';
      textAnchor = isTopHalf ? 'end' : 'start';
    }

    const startPoint = HorseshoeLabels.pointAt({
      cx: labelConfig.cx,
      cy: labelConfig.cy,
      radius: labelConfig.radius,
      angle: pathStartAngle,
    });

    const endPoint = HorseshoeLabels.pointAt({
      cx: labelConfig.cx,
      cy: labelConfig.cy,
      radius: labelConfig.radius,
      angle: pathEndAngle,
    });

    const pathId = `${labelConfig.cardId}-horseshoe-label-${labelConfig.horseshoeIndex}-${labelConfig.index}`;

    const transformContext = labelConfig.transformContext ?? {};
    const rotation = transformContext.rotation ?? 0;
    const flipX = transformContext.flipX ?? false;
    const flipY = transformContext.flipY ?? false;

    const scaleX = flipX ? -1 : 1;
    const scaleY = flipY ? -1 : 1;

    const inverseParentTransform = `
      translate(${labelConfig.cx} ${labelConfig.cy})
      scale(${scaleX} ${scaleY})
      rotate(${-rotation})
      translate(${-labelConfig.cx} ${-labelConfig.cy})
    `;

    return svg`
      <g transform="${inverseParentTransform}">
        <path
          id="${pathId}"
          d="M ${startPoint.x} ${startPoint.y} A ${labelConfig.radius} ${labelConfig.radius} 0 0 ${sweepFlag} ${endPoint.x} ${endPoint.y}"
          fill="none"
          stroke="none"
        />

        <text
          class="horseshoe-label"
          style="fill:currentColor"
          dy="0em"
        >
          <textPath
            href="#${pathId}"
            style="dominant-baseline:central"
            startOffset="${startOffset}"
            text-anchor="${textAnchor}"
          >
            ${labelText}
          </textPath>
        </text>
      </g>
    `;
  }

  static getLabelGeometry(input) {
    const angle = input.angle ?? 0;
    const transformContext = input.transformContext ?? {};
    const rotation = transformContext.rotation ?? 0;
    const flipX = transformContext.flipX ?? false;
    const flipY = transformContext.flipY ?? false;

    const visualAngle = HorseshoeLabels.getVisualAngleFromParentTransform({
      angle,
      rotation,
      flipX,
      flipY,
    });

    const mirrored = flipX !== flipY;

    return {
      positionAngle: angle,
      visualAngle,
      mirrored,
    };
  }

  static getVisualAngleFromParentTransform(input) {
    const angle = input.angle ?? 0;
    const rotation = input.rotation ?? 0;
    const flipX = input.flipX ?? false;
    const flipY = input.flipY ?? false;

    const scaleX = flipX ? -1 : 1;
    const scaleY = flipY ? -1 : 1;

    const angleInRadians = HorseshoeLabels.degToRad(angle);
    const rotationInRadians = HorseshoeLabels.degToRad(rotation);

    const x = Math.cos(angleInRadians);
    const y = Math.sin(angleInRadians);

    const rotatedX = x * Math.cos(rotationInRadians) - y * Math.sin(rotationInRadians);
    const rotatedY = x * Math.sin(rotationInRadians) + y * Math.cos(rotationInRadians);

    const scaledX = rotatedX * scaleX;
    const scaledY = rotatedY * scaleY;

    return HorseshoeLabels.normalizeAngle(HorseshoeLabels.radToDeg(Math.atan2(scaledY, scaledX)));
  }

  static pointAt(input) {
    const angleInRadians = HorseshoeLabels.degToRad(input.angle);

    return {
      x: input.cx + Math.cos(angleInRadians) * input.radius,
      y: input.cy + Math.sin(angleInRadians) * input.radius,
    };
  }

  static normalizeAngle(angle) {
    return ((angle % 360) + 360) % 360;
  }

  static degToRad(degrees) {
    return (degrees * Math.PI) / 180;
  }

  static radToDeg(radians) {
    return (radians * 180) / Math.PI;
  }
}
