import { svg } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';

import HorseshoeLabels from './horseshoe-labels.js';

/**
 * Builds the stable DOM id used for state path lookup and updates.
 *
 * @param {string} cardId - Card id namespace.
 * @param {number} horseshoeIndex - Gauge index.
 * @param {string} pathKey - State path key.
 * @returns {string} DOM id for the state path.
 */
export function getStatePathElementId(cardId, horseshoeIndex, pathKey) {
  return `horseshoe-state-${cardId}-${horseshoeIndex}-${pathKey}`;
}

/**
 * Renders the scale path items into the scale SVG layer.
 *
 * @param {object} runtimeConfig - Normalized horseshoe runtime configuration.
 * @param {GaugeGeometry} geometry - Geometry helper for the gauge.
 * @param {Array<object>} scalePathItems - Renderable scale path items.
 * @returns {TemplateResult} SVG layer template.
 */
export function renderScaleLayer(runtimeConfig, geometry, scalePathItems) {
  const scaleStyle = {
    ...runtimeConfig.horseshoe_scale.styles,
  };

  return svg`
    <g class="horseshoe__scale-layer" style=${styleMap(scaleStyle)}>
      ${scalePathItems.map((pathItem) => {
        // Arc-specific colors win over the layer style so color-stop segments keep their colors.
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

/**
 * Renders state path items and assigns ids for later animation updates.
 *
 * @param {object} runtimeConfig - Normalized horseshoe runtime configuration.
 * @param {Array<object>} statePathItems - Renderable state path items.
 * @param {string} cardId - Card id namespace.
 * @param {number} horseshoeIndex - Gauge index.
 * @returns {TemplateResult} SVG layer template.
 */
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
        // Inactive mapped segments render with the scale style so only the active segment stands out.
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

/**
 * Renders positioned labels through the label renderer.
 *
 * @param {object} runtimeConfig - Normalized horseshoe runtime configuration.
 * @param {GaugeGeometry} geometry - Geometry helper for label transforms.
 * @param {string} cardId - Card id namespace.
 * @param {number} horseshoeIndex - Gauge index.
 * @param {Array<object>} labelItems - Positioned label items.
 * @returns {TemplateResult} SVG layer template.
 */
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
          transformContext: geometry.getTransformContext(),
          inverseTransform: geometry.getInverseGroupTransform(),
        })
      ))}
    </g>
  `;
}

/**
 * Renders optional label background arc segments.
 *
 * @param {object} runtimeConfig - Normalized horseshoe runtime configuration.
 * @param {GaugeGeometry} geometry - Geometry helper for background arcs.
 * @param {Array<object>} backgroundItems - Label background arc items.
 * @returns {TemplateResult} SVG layer template.
 */
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

/**
 * Renders optional label badge shapes behind labels.
 *
 * @param {object} runtimeConfig - Normalized horseshoe runtime configuration.
 * @param {GaugeGeometry} geometry - Geometry helper for badge positions.
 * @param {string} cardId - Card id namespace.
 * @param {number} horseshoeIndex - Gauge index.
 * @param {Array<object>} labelItems - Positioned label items.
 * @returns {TemplateResult} SVG layer template.
 */
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

/**
 * Renders optional tickmark background arc segments.
 *
 * @param {object} runtimeConfig - Normalized horseshoe runtime configuration.
 * @param {GaugeGeometry} geometry - Geometry helper for background arcs.
 * @param {Array<object>} backgroundItems - Tickmark background items.
 * @returns {TemplateResult} SVG layer template.
 */
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

/**
 * Renders major and minor tickmark path items.
 *
 * @param {Array<object>} tickPathItems - Renderable tickmark path items.
 * @returns {TemplateResult} SVG layer template.
 */
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
          data-value="${pathItem.value ?? ''}"
          data-thickness="${pathItem.thickness ?? ''}"
          data-start-angle="${pathItem.startAngle ?? ''}"
          data-end-angle="${pathItem.endAngle ?? ''}"
          style=${styleMap(pathItem.styles ?? {})}
        ></path>
      `)}
    </g>
  `;
}

/**
 * Finds and caches the DOM element for a state path item.
 *
 * @param {Map} statePathElements - Cache keyed by state path key.
 * @param {LitElement} card - Card instance containing the render root.
 * @param {string} cardId - Card id namespace.
 * @param {number} horseshoeIndex - Gauge index.
 * @param {object} pathItem - State path item.
 * @returns {Element|undefined} Existing DOM element for the path item.
 */
function getStatePathElement(statePathElements, card, cardId, horseshoeIndex, pathItem) {
  if (!pathItem?.key) {
    return undefined;
  }

  // Reuse connected DOM nodes across animation frames and discard stale cache entries.
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

/**
 * Updates existing state path DOM nodes during value animation.
 *
 * @param {object} runtimeConfig - Normalized horseshoe runtime configuration.
 * @param {Array<object>} statePathItems - Latest state path items.
 * @param {Map} statePathElements - Cache keyed by state path key.
 * @param {LitElement} card - Card instance containing the render root.
 * @param {string} cardId - Card id namespace.
 * @param {number} horseshoeIndex - Gauge index.
 */
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

    // Only the mutable path attributes are updated during animation frames.
    pathElement.setAttribute('d', pathItem.path || '');
    pathElement.setAttribute('fill', fill);
    pathElement.setAttribute('opacity', pathItem.path ? '1' : '0');
  });
}
