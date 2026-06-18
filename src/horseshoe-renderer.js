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
 * Builds the stable SVG gradient id for v2 lineargradient state rendering.
 *
 * @param {string} cardId - Card id namespace.
 * @param {number} horseshoeIndex - Gauge index.
 * @returns {string} SVG linearGradient id.
 */
function getStateGradientId(cardId, horseshoeIndex) {
  return `horseshoe-state-gradient-${cardId}-${horseshoeIndex}`;
}

/**
 * Renders the v2 lineargradient definition used by the state band fill.
 *
 * @param {object} runtimeConfig - Normalized horseshoe runtime configuration.
 * @param {object} geometry - Geometry helper for arc endpoint projection.
 * @param {Array<object>} statePathItems - Renderable state path items.
 * @param {string} cardId - Card id namespace.
 * @param {number} horseshoeIndex - Gauge index.
 * @returns {TemplateResult|string} SVG defs template or empty string.
 */
function renderStateLinearGradient(runtimeConfig, geometry, statePathItems, cardId, horseshoeIndex) {
  if (runtimeConfig.show?.horseshoe_style !== 'lineargradient') {
    return '';
  }

  const colorStops = runtimeConfig.colorStops.colors;
  const color0 = colorStops[0].color;
  const color1 = colorStops[colorStops.length - 1].color;
  const color1Offset = statePathItems.find((pathItem) => pathItem.arc.gradientOffset)?.arc.gradientOffset ?? '0%';
  const gradientId = getStateGradientId(cardId, horseshoeIndex);
  const startPoint = geometry.pointAt(geometry.startAngle, geometry.radius);
  const endPoint = geometry.pointAt(geometry.endAngle, geometry.radius);

  return svg`
    <defs>
      <linearGradient
        gradientUnits="userSpaceOnUse"
        gradientTransform="rotate(0)"
        id="${gradientId}"
        x1="${startPoint.x}"
        y1="${startPoint.y}"
        x2="${endPoint.x}"
        y2="${endPoint.y}"
      >
        <stop id="${gradientId}-color1" offset="${color1Offset}" stop-color="${color1}" style="transition: stop-color 1s ease;"></stop>
        <stop offset="100%" stop-color="${color0}" style="transition: stop-color 1s ease;"></stop>
      </linearGradient>
    </defs>
  `;
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
export function renderStateLayer(runtimeConfig, geometry, statePathItems, cardId, horseshoeIndex) {
  const stateStyle = {
    ...runtimeConfig.horseshoe_state.styles,
  };

  const scaleStyle = {
    ...runtimeConfig.horseshoe_scale.styles,
  };

  const gradientId = getStateGradientId(cardId, horseshoeIndex);

  return svg`
    <g class="horseshoe__state-layer">
      ${renderStateLinearGradient(runtimeConfig, geometry, statePathItems, cardId, horseshoeIndex)}
      ${statePathItems.map((pathItem) => {
        // Inactive mapped segments render with the scale style so only the active segment stands out.
        const arcBaseStyle = pathItem.arc.active === false ? scaleStyle : stateStyle;
        const fill = runtimeConfig.show?.horseshoe_style === 'lineargradient' && pathItem.arc.active !== false
          ? `url('#${gradientId}')`
          : pathItem.arc.color ?? arcBaseStyle.fill ?? runtimeConfig.horseshoe_state.color ?? 'none';
        const renderStyle = {
          ...arcBaseStyle,
          fill,
        };

        if (!pathItem.path) {
          renderStyle.opacity = '0';
        }

        const pathElementId = getStatePathElementId(cardId, horseshoeIndex, pathItem.key);

        return svg`
          <path
            id="${pathElementId}"
            data-horseshoe-state-path="${pathElementId}"
            class="horseshoe__state"
            d="${pathItem.path}"
            style=${styleMap(renderStyle)}
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
 * Renders arc background items for a configured horseshoe-related layer.
 *
 * @param {GaugeGeometry} geometry - Geometry helper for background arcs.
 * @param {Array<object>} backgroundItems - Background arc items.
 * @param {object} options - Layer class, item class, and normalized styles.
 * @returns {TemplateResult} SVG layer template.
 */
function renderArcBackgroundLayer(geometry, backgroundItems, options = {}) {
  if (!backgroundItems.length) {
    return svg``;
  }

  const {
    layerClass,
    itemClass,
    styles = {},
  } = options;

  const { filter, ...pathStyles } = styles;
  const groupStyle = filter ? { filter } : {};

  return svg`
    <g class=${layerClass} style=${styleMap(groupStyle)}>
      ${backgroundItems.map((backgroundItem) => {
        const renderStyle = {
          'stroke-width': 0,
          ...pathStyles,
          fill: backgroundItem.color ?? pathStyles.fill ?? pathStyles.stroke ?? 'currentColor',
        };

        return backgroundItem.path
          ? svg`
              <path
                class=${itemClass}
                d=${backgroundItem.path}
                style=${styleMap(renderStyle)}
              ></path>
            `
          : svg``;
      })}
    </g>
  `;
}

/**
 * Renders the optional horseshoe background arc behind scale and state layers.
 *
 * @param {object} runtimeConfig - Normalized horseshoe runtime configuration.
 * @param {GaugeGeometry} geometry - Geometry helper for background arcs.
 * @param {Array<object>} backgroundItems - Horseshoe background arc items.
 * @returns {TemplateResult} SVG layer template.
 */
export function renderHorseshoeBackgroundLayer(runtimeConfig, geometry, backgroundItems) {
  return renderArcBackgroundLayer(geometry, backgroundItems, {
    layerClass: 'horseshoe__background-layer',
    itemClass: 'horseshoe__background',
    styles: runtimeConfig.horseshoe_background.styles,
  });
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
  return renderArcBackgroundLayer(geometry, backgroundItems, {
    layerClass: 'horseshoe__label-background-layer',
    itemClass: 'horseshoe__label-background',
    styles: runtimeConfig.horseshoe_labels.background.styles,
  });
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
  return renderArcBackgroundLayer(geometry, backgroundItems, {
    layerClass: 'horseshoe__tick-background-layer',
    itemClass: 'horseshoe__tick-background',
    styles: runtimeConfig.horseshoe_tickmarks.background.styles,
  });
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
      ${tickPathItems.map((pathItem) => (pathItem.shape === 'circle'
        ? svg`
            <circle
              class="${pathItem.className}"
              cx="${pathItem.x}"
              cy="${pathItem.y}"
              r="${pathItem.radius}"
              data-value="${pathItem.value ?? ''}"
              data-thickness="${pathItem.thickness ?? ''}"
              data-start-angle="${pathItem.startAngle ?? ''}"
              data-end-angle="${pathItem.endAngle ?? ''}"
              style=${styleMap(pathItem.styles ?? {})}
            ></circle>
          `
        : svg`
            <path
              class="${pathItem.className}"
              d="${pathItem.path}"
              data-value="${pathItem.value ?? ''}"
              data-thickness="${pathItem.thickness ?? ''}"
              data-start-angle="${pathItem.startAngle ?? ''}"
              data-end-angle="${pathItem.endAngle ?? ''}"
              style=${styleMap(pathItem.styles ?? {})}
            ></path>
          `))}
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

  const gradientId = getStateGradientId(cardId, horseshoeIndex);
  const gradientColor1Stop = card.renderRoot?.querySelector(`#${gradientId}-color1`);

  if (runtimeConfig.show?.horseshoe_style === 'lineargradient' && gradientColor1Stop) {
    const color1Offset = statePathItems.find((pathItem) => pathItem.arc.gradientOffset)?.arc.gradientOffset;

    if (color1Offset) {
      gradientColor1Stop.setAttribute('offset', color1Offset);
    }
  }

  statePathItems.forEach((pathItem) => {
    const pathElement = getStatePathElement(statePathElements, card, cardId, horseshoeIndex, pathItem);

    if (!pathElement) {
      return;
    }

    const arcBaseStyle = pathItem.arc.active === false ? scaleStyle : stateStyle;
    const fill = runtimeConfig.show?.horseshoe_style === 'lineargradient' && pathItem.arc.active !== false
      ? `url('#${gradientId}')`
      : pathItem.arc.color ?? arcBaseStyle.fill ?? runtimeConfig.horseshoe_state.color ?? 'none';
    const renderStyle = {
      ...arcBaseStyle,
      fill,
    };

    if (!pathItem.path) {
      renderStyle.opacity = '0';
    }

    // Only the mutable path data and style are updated during animation frames.
    pathElement.setAttribute('d', pathItem.path || '');
    pathElement.setAttribute(
      'style',
      Object.entries(renderStyle).map(([property, value]) => `${property}: ${value}`).join('; '),
    );
  });
}
