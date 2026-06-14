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

    const labelAngle = labelGeometry.visualAngle;
    // Angle starts at 90. that is 0. so + 90.
    // 180 .. 360 is topHalf then.
    // const isTopHalf = labelAngle >= 270 || labelAngle <= 90;
    const isTopHalf = labelAngle >= 180 && labelAngle <= 360;

    console.log('[horseshoe-labels] arc label orientation', {
      label: labelText,
      rawAngle: labelConfig.angle,
      visualAngle: labelGeometry.visualAngle,
      mirrored: labelGeometry.mirrored,
      labelAngle,
      isTopHalf,
      rotation: labelConfig.transformContext?.rotation ?? 0,
      flipX: labelConfig.transformContext?.flipX ?? false,
      flipY: labelConfig.transformContext?.flipY ?? false,
    });

    const startAngle = labelAngle - arcSize / 2;
    const endAngle = labelAngle + arcSize / 2;

    // const isTopHalf = labelAngle >= 180 && labelAngle <= 360;
    const pathStartAngle = isTopHalf ? startAngle : endAngle;
    const pathEndAngle = isTopHalf ? endAngle : startAngle;
    const sweepFlag = isTopHalf ? 1 : 0;

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

    const inverseParentTransform = labelConfig.inverseTransform ?? '';

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
            startOffset="50%"
            text-anchor="middle"
          >
            ${labelText}
          </textPath>
        </text>
      </g>
    `;
  }

  static renderLabelBadge(labelConfig) {
    const orientation = labelConfig.orientation ?? 'arc';

    if (orientation === 'horizontal') {
      return HorseshoeLabels.renderHorizontalBadge(labelConfig);
    }

    return HorseshoeLabels.renderArcBadge(labelConfig);
  }

  static renderArcSegment(segmentConfig) {
    const startPoint = HorseshoeLabels.pointAt({
      cx: segmentConfig.cx,
      cy: segmentConfig.cy,
      radius: segmentConfig.radius,
      angle: segmentConfig.startAngle,
    });

    const endPoint = HorseshoeLabels.pointAt({
      cx: segmentConfig.cx,
      cy: segmentConfig.cy,
      radius: segmentConfig.radius,
      angle: segmentConfig.endAngle,
    });

    const largeArcFlag = Math.abs(segmentConfig.endAngle - segmentConfig.startAngle) > 180 ? 1 : 0;
    const sweepFlag = segmentConfig.endAngle > segmentConfig.startAngle ? 1 : 0;

    return svg`
      <path
        class="${segmentConfig.className ?? ''}"
        d="M ${startPoint.x} ${startPoint.y} A ${segmentConfig.radius} ${segmentConfig.radius} 0 ${largeArcFlag} ${sweepFlag} ${endPoint.x} ${endPoint.y}"
        fill="none"
        stroke="${segmentConfig.color ?? 'currentColor'}"
        stroke-width="${segmentConfig.width}"
        stroke-linecap="${segmentConfig.lineCap ?? 'round'}"
      />
    `;
  }

  static renderArcBadge(labelConfig) {
    const labelText = String(labelConfig.label ?? '');
    const badgeConfig = labelConfig.badge ?? {};
    const padding = Number(badgeConfig.padding ?? 2);
    const charWidth = Number(badgeConfig.char_width ?? 4);
    const badgeWidth = Number(badgeConfig.width ?? labelText.length * charWidth + padding * 2);
    const badgeHeight = Number(badgeConfig.height ?? 8);
    const badgeBodyWidth = Math.max(0, badgeWidth - badgeHeight);
    const badgeArcSize = HorseshoeLabels.arcLengthToDegrees(badgeBodyWidth, labelConfig.radius);
    const badgePath = HorseshoeLabels.buildArcCapsulePath({
      cx: labelConfig.cx,
      cy: labelConfig.cy,
      radius: labelConfig.radius,
      angle: labelConfig.angle,
      arcSize: badgeArcSize,
      width: badgeHeight,
    });

    return svg`
      <path
        class="horseshoe-label-badge"
        d="${badgePath}"
        fill="${badgeConfig.color ?? 'var(--card-background-color)'}"
        stroke="${badgeConfig.border_color ?? 'none'}"
      />
    `;
  }

  static renderHorizontalBadge(labelConfig) {
    const badgeConfig = labelConfig.badge ?? {};
    const point = HorseshoeLabels.pointAt({
      cx: labelConfig.cx,
      cy: labelConfig.cy,
      radius: labelConfig.radius,
      angle: labelConfig.angle,
    });

    const labelText = String(labelConfig.label ?? '');
    const padding = Number(badgeConfig.padding ?? 4);
    const badgeRadius = Number(badgeConfig.radius ?? Math.max(7, labelText.length * 3 + padding));

    return svg`
      <circle
        class="horseshoe-label-badge"
        cx="${point.x}"
        cy="${point.y}"
        r="${badgeRadius}"
        fill="${badgeConfig.color ?? 'var(--card-background-color)'}"
        stroke="${badgeConfig.border_color ?? 'none'}"
      />
    `;
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

  static arcLengthToDegrees(lengthPx, radius) {
    return (Number(lengthPx) / (2 * Math.PI * radius)) * 360;
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

  static buildArcCapsulePath(input) {
    const halfWidth = input.width / 2;
    const outerRadius = input.radius + halfWidth;
    const innerRadius = input.radius - halfWidth;
    const startAngle = input.angle - input.arcSize / 2;
    const endAngle = input.angle + input.arcSize / 2;

    const outerStart = HorseshoeLabels.pointAt({
      cx: input.cx,
      cy: input.cy,
      radius: outerRadius,
      angle: startAngle,
    });

    const outerEnd = HorseshoeLabels.pointAt({
      cx: input.cx,
      cy: input.cy,
      radius: outerRadius,
      angle: endAngle,
    });

    const innerEnd = HorseshoeLabels.pointAt({
      cx: input.cx,
      cy: input.cy,
      radius: innerRadius,
      angle: endAngle,
    });

    const innerStart = HorseshoeLabels.pointAt({
      cx: input.cx,
      cy: input.cy,
      radius: innerRadius,
      angle: startAngle,
    });

    const largeArcFlag = input.arcSize > 180 ? 1 : 0;

    return `
      M ${outerStart.x} ${outerStart.y}
      A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${outerEnd.x} ${outerEnd.y}
      A ${halfWidth} ${halfWidth} 0 0 1 ${innerEnd.x} ${innerEnd.y}
      A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerStart.x} ${innerStart.y}
      A ${halfWidth} ${halfWidth} 0 0 1 ${outerStart.x} ${outerStart.y}
      Z
    `;
  }
}
