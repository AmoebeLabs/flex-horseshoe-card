import { svg } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';

import HorseshoeLabels from './horseshoe-labels.js';

export function getStatePathElementId(cardId, horseshoeIndex, pathKey) {
  return `horseshoe-state-${cardId}-${horseshoeIndex}-${pathKey}`;
}

export function renderScaleLayer(runtimeConfig, geometry, scalePathItems) {
  const scaleStyle = {
    ...runtimeConfig.horseshoe_scale.styles,
  };

  return svg`
    <g class="horseshoe__scale-layer" style=${styleMap(scaleStyle)}>
      ${scalePathItems.map((pathItem) => {
        const fill = pathItem.arc.color ?? runtimeConfig.horseshoe_scale.color ?? scaleStyle.fill ?? 'none';

        return pathItem.path
          ? svg`
              <path
                class="horseshoe__scale"
                d=${pathItem.path}
                fill="${fill}"
              ></path>
            `
          : svg``;
      })}
    </g>
  `;
}

export function renderStateLayer(runtimeConfig, statePathItems, cardId, horseshoeIndex) {
  const stateStyle = {
    ...runtimeConfig.horseshoe_state.styles,
  };

  const scaleStyle = {
    ...runtimeConfig.horseshoe_scale.styles,
  };

  return svg`
    <g class="horseshoe__state-layer">
      ${statePathItems.map((pathItem) => {
        const arcBaseStyle = pathItem.arc.active === false ? scaleStyle : stateStyle;
        const fill = pathItem.arc.color ?? arcBaseStyle.fill ?? runtimeConfig.horseshoe_state.color ?? 'none';
        const opacity = pathItem.path ? '1' : '0';
        const pathElementId = getStatePathElementId(cardId, horseshoeIndex, pathItem.key);

        return svg`
          <path
            id="${pathElementId}"
            data-horseshoe-state-path="${pathElementId}"
            class="horseshoe__state"
            d="${pathItem.path}"
            fill="${fill}"
            opacity="${opacity}"
          ></path>
        `;
      })}
    </g>
  `;
}

export function renderLabelsLayer(runtimeConfig, geometry, cardId, horseshoeIndex, labelItems) {
  const labelStyle = {
    ...runtimeConfig.horseshoe_labels.styles,
  };

  return svg`
    <g class="horseshoe__labels-layer" style=${styleMap(labelStyle)}>
      ${labelItems.map((labelItem, index) => (
        HorseshoeLabels.renderLabel({
          horseshoeIndex,
          index,
          label: labelItem.text,
          angle: labelItem.angle,
          cx: geometry.cx,
          cy: geometry.cy,
          radius: labelItem.radius,
          cardId,
          orientation: runtimeConfig.horseshoe_labels.orientation ?? 'arc',
          isMin: labelItem.role === 'min',
          isMax: labelItem.role === 'max',
          transformContext: {
            rotation: runtimeConfig.rotate ?? 0,
            flipX: runtimeConfig.flip === 'x' || runtimeConfig.flip === 'both',
            flipY: runtimeConfig.flip === 'y' || runtimeConfig.flip === 'both',
          },
        })
      ))}
    </g>
  `;
}

export function renderLabelBackgroundLayer(runtimeConfig, geometry, backgroundItems) {
  if (!backgroundItems.length) {
    return svg``;
  }

  const backgroundStyle = {
    ...runtimeConfig.horseshoe_labels.background.styles,
  };

  return svg`
    <g class="horseshoe__label-background-layer" style=${styleMap(backgroundStyle)}>
      ${backgroundItems.map((backgroundItem) => HorseshoeLabels.renderArcSegment({
        cx: geometry.cx,
        cy: geometry.cy,
        radius: backgroundItem.radius,
        startAngle: backgroundItem.startAngle,
        endAngle: backgroundItem.endAngle,
        width: backgroundItem.width,
        color: backgroundItem.color ?? backgroundStyle.stroke ?? 'currentColor',
        className: 'horseshoe__label-background',
        lineCap: backgroundItem.lineCap ?? 'round',
      }))}
    </g>
  `;
}

export function renderLabelBadgesLayer(runtimeConfig, geometry, cardId, horseshoeIndex, labelItems) {
  if (!labelItems.length || !runtimeConfig.show.label_badges) {
    return svg``;
  }

  const badgeStyle = {
    ...runtimeConfig.horseshoe_labels.badges.styles,
  };

  return svg`
    <g class="horseshoe__label-badges-layer" style=${styleMap(badgeStyle)}>
      ${labelItems.map((labelItem, index) => HorseshoeLabels.renderLabelBadge({
        horseshoeIndex,
        index,
        label: labelItem.text,
        angle: labelItem.angle,
        cx: geometry.cx,
        cy: geometry.cy,
        radius: labelItem.radius,
        cardId,
        orientation: runtimeConfig.horseshoe_labels.orientation ?? 'arc',
        badge: runtimeConfig.horseshoe_labels.badges ?? {},
      }))}
    </g>
  `;
}

export function renderTickmarkBackgroundLayer(runtimeConfig, geometry, backgroundItems) {
  if (!backgroundItems.length) {
    return svg``;
  }

  const backgroundStyle = {
    ...runtimeConfig.horseshoe_tickmarks.background.styles,
  };

  return svg`
    <g class="horseshoe__tick-background-layer" style=${styleMap(backgroundStyle)}>
      ${backgroundItems.map((backgroundItem) => HorseshoeLabels.renderArcSegment({
        cx: geometry.cx,
        cy: geometry.cy,
        radius: backgroundItem.radius,
        startAngle: backgroundItem.startAngle,
        endAngle: backgroundItem.endAngle,
        width: backgroundItem.width,
        color: backgroundItem.color ?? backgroundStyle.stroke ?? 'currentColor',
        className: 'horseshoe__tick-background',
        lineCap: backgroundItem.lineCap ?? 'round',
      }))}
    </g>
  `;
}

export function renderTickmarksLayer(tickPathItems) {
  if (!tickPathItems.length) {
    return svg``;
  }

  return svg`
    <g class="horseshoe__ticks-layer">
      ${tickPathItems.map((pathItem) => svg`
        <path
          class="${pathItem.className}"
          d="${pathItem.path}"
          fill="${pathItem.fill}"
          style=${styleMap(pathItem.styles ?? {})}
        ></path>
      `)}
    </g>
  `;
}

function getStatePathElement(statePathElements, card, cardId, horseshoeIndex, pathItem) {
  if (!pathItem?.key) {
    return undefined;
  }

  if (statePathElements.has(pathItem.key)) {
    const existingElement = statePathElements.get(pathItem.key);

    if (existingElement?.isConnected) {
      return existingElement;
    }

    statePathElements.delete(pathItem.key);
  }

  const root = card?.renderRoot ?? card?.shadowRoot;

  if (!root) {
    return undefined;
  }

  const pathElementId = getStatePathElementId(cardId, horseshoeIndex, pathItem.key);
  const element = root.getElementById?.(pathElementId) ?? root.querySelector?.(`[data-horseshoe-state-path="${pathElementId}"]`);

  if (element) {
    statePathElements.set(pathItem.key, element);
  }

  return element;
}

export function updateStatePathElements(runtimeConfig, statePathItems, statePathElements, card, cardId, horseshoeIndex) {
  const stateStyle = {
    ...runtimeConfig.horseshoe_state.styles,
  };

  const scaleStyle = {
    ...runtimeConfig.horseshoe_scale.styles,
  };

  statePathItems.forEach((pathItem) => {
    const pathElement = getStatePathElement(statePathElements, card, cardId, horseshoeIndex, pathItem);

    if (!pathElement) {
      return;
    }

    const arcBaseStyle = pathItem.arc.active === false ? scaleStyle : stateStyle;
    const fill = pathItem.arc.color ?? arcBaseStyle.fill ?? runtimeConfig.horseshoe_state.color ?? 'none';

    pathElement.setAttribute('d', pathItem.path || '');
    pathElement.setAttribute('fill', fill);
    pathElement.setAttribute('opacity', pathItem.path ? '1' : '0');
  });
}
