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
export function renderScaleLayer(runtimeConfig, geometry, scalePathItems, cardId, horseshoeIndex, applyColorFilter = (styles) => styles) {
  const scaleStyle = {
    ...runtimeConfig.horseshoe_scale.styles,
  };

  return svg`
    <g class="horseshoe__scale-layer" style=${styleMap(applyColorFilter(scaleStyle))}>
      <defs>
        ${scalePathItems.map((pathItem) => {
          if (!pathItem.arc.gradient) return svg``;
          const gradientId = `horseshoe-scale-${cardId}-${horseshoeIndex}-${pathItem.key}`;
          const startStyle = applyColorFilter({ fill: pathItem.arc.gradient.startColor }, pathItem);
          const endStyle = applyColorFilter({ fill: pathItem.arc.gradient.endColor }, pathItem);

          return svg`
            <linearGradient id=${gradientId} gradientUnits="userSpaceOnUse" x1=${pathItem.arc.gradient.x1} y1=${pathItem.arc.gradient.y1} x2=${pathItem.arc.gradient.x2} y2=${pathItem.arc.gradient.y2}>
              <stop offset="0%" stop-color=${startStyle.fill}></stop>
              <stop offset="100%" stop-color=${endStyle.fill}></stop>
            </linearGradient>
          `;
        })}
      </defs>
      ${scalePathItems.map((pathItem) => {
        // Arc-specific colors win over the layer style so color-stop segments keep their colors.
        const gradientId = `horseshoe-scale-${cardId}-${horseshoeIndex}-${pathItem.key}`;
        const fill = pathItem.arc.gradient
          ? `url('#${gradientId}')`
          : pathItem.arc.color ?? runtimeConfig.horseshoe_scale.color ?? scaleStyle.fill ?? 'none';

        const renderStyle = {
          fill,
        };

        return pathItem.path
          ? svg`
              <path
                class="horseshoe__scale"
                d=${pathItem.path}
                style=${styleMap(applyColorFilter(renderStyle, pathItem))}
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
 * @param {Array<object>} statePathItems - Current active state path items.
 * @param {Array<object>} gradientPathItems - Cached full-scale colorstopgradient paths.
 * @param {string} cardId - Card id namespace.
 * @param {number} horseshoeIndex - Gauge index.
 * @returns {TemplateResult} SVG layer template.
 */
export function renderStateLayer(runtimeConfig, geometry, statePathItems, gradientPathItems, cardId, horseshoeIndex, applyColorFilter = (styles) => styles) {
  const stateStyle = {
    ...runtimeConfig.horseshoe_state.styles,
  };

  const scaleStyle = {
    ...runtimeConfig.horseshoe_scale.styles,
  };

  if (runtimeConfig.show?.horseshoe_style === 'minmaxgradient' || runtimeConfig.show?.horseshoe_style === 'lineargradient') {
    const gradientStyle = runtimeConfig.show.horseshoe_style;

    return svg`
      <g class="horseshoe__state-layer horseshoe__state-layer--${gradientStyle}">
        <defs>
          ${statePathItems.map((pathItem) => {
            const pathElementId = getStatePathElementId(cardId, horseshoeIndex, pathItem.key);
            const pathGradientId = `${pathElementId}-gradient`;

            const startStyle = applyColorFilter({ fill: pathItem.arc.gradient.startColor }, pathItem);
            const endStyle = applyColorFilter({ fill: pathItem.arc.gradient.endColor }, pathItem);

            return svg`
              <linearGradient
                id="${pathGradientId}"
                gradientUnits="userSpaceOnUse"
                spreadMethod="pad"
                x1="${pathItem.arc.gradient.x1}"
                y1="${pathItem.arc.gradient.y1}"
                x2="${pathItem.arc.gradient.x2}"
                y2="${pathItem.arc.gradient.y2}"
              >
                <stop offset="0%" stop-color="${startStyle.fill}"></stop>
                <stop offset="100%" stop-color="${endStyle.fill}"></stop>
              </linearGradient>
            `;
          })}
        </defs>
        <g id="horseshoe-state-${cardId}-${horseshoeIndex}-${gradientStyle}-group" class="horseshoe__state-gradient" style=${styleMap(applyColorFilter(stateStyle))}>
          ${statePathItems.map((pathItem) => {
            const pathElementId = getStatePathElementId(cardId, horseshoeIndex, pathItem.key);
            const pathGradientId = `${pathElementId}-gradient`;

            return svg`
              <path
                id="${pathElementId}"
                data-horseshoe-state-path="${pathElementId}"
                class="horseshoe__state horseshoe__state-gradient-segment"
                d="${pathItem.path}"
                style=${styleMap({ fill: `url('#${pathGradientId}')` })}
              ></path>
            `;
          })}
        </g>
      </g>
    `;
  }

  if (runtimeConfig.show?.horseshoe_style === 'colorstopgradient') {
    const clipPathItem = statePathItems[0];
    const clipElementId = getStatePathElementId(cardId, horseshoeIndex, clipPathItem.key);
    const clipPathId = `${clipElementId}-path`;

    return svg`
      <g class="horseshoe__state-layer horseshoe__state-layer--colorstopgradient">
        <defs>
          <clipPath id="${clipPathId}" clipPathUnits="userSpaceOnUse">
            <path
              id="${clipElementId}"
              data-horseshoe-state-path="${clipElementId}"
              d="${clipPathItem.path}"
            ></path>
          </clipPath>
          ${gradientPathItems.map((pathItem) => {
            const pathGradientId = `${clipElementId}-${pathItem.key}`;

            const startStyle = applyColorFilter({ fill: pathItem.arc.gradient.startColor }, pathItem);
            const endStyle = applyColorFilter({ fill: pathItem.arc.gradient.endColor }, pathItem);

            return svg`
              <linearGradient
                id="${pathGradientId}"
                gradientUnits="userSpaceOnUse"
                spreadMethod="pad"
                x1="${pathItem.arc.gradient.x1}"
                y1="${pathItem.arc.gradient.y1}"
                x2="${pathItem.arc.gradient.x2}"
                y2="${pathItem.arc.gradient.y2}"
              >
                <stop offset="0%" stop-color="${startStyle.fill}"></stop>
                <stop offset="100%" stop-color="${endStyle.fill}"></stop>
              </linearGradient>
            `;
          })}
        </defs>
        <g class="horseshoe__state-gradient" clip-path="url(#${clipPathId})" style=${styleMap(applyColorFilter(stateStyle))}>
          ${gradientPathItems.map((pathItem) => {
            const pathGradientId = `${clipElementId}-${pathItem.key}`;
            const renderStyle = {
              fill: `url('#${pathGradientId}')`,
            };

            return svg`
              <path
                class="horseshoe__state horseshoe__state-gradient-segment"
                d="${pathItem.path}"
                style=${styleMap(renderStyle)}
              ></path>
            `;
          })}
        </g>
      </g>
    `;
  }

  return svg`
    <g class="horseshoe__state-layer">
      ${statePathItems.map((pathItem) => {
        const isStringStateMode = runtimeConfig.horseshoe_state.mode === 'stringstate_mode' || runtimeConfig.horseshoe_state.mode === 'stringstate_level';
        // String-state modes keep every segment path mounted so only styles change between states.
        const arcBaseStyle = pathItem.arc.active === false && !isStringStateMode ? scaleStyle : stateStyle;
        const fill = pathItem.arc.color ?? arcBaseStyle.fill ?? runtimeConfig.horseshoe_state.color ?? 'none';
        const renderStyle = {
          ...arcBaseStyle,
          fill,
        };

        if (isStringStateMode && renderStyle.transition === undefined) {
          renderStyle.transition = 'fill 600ms ease, opacity 600ms ease, filter 600ms ease';
        }

        if (isStringStateMode && pathItem.arc.active === false) {
          renderStyle.opacity = runtimeConfig.horseshoe_state.inactive_opacity ?? '0';
        }

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
            style=${styleMap(applyColorFilter(renderStyle, pathItem))}
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
export function renderLabelsLayer(runtimeConfig, geometry, cardId, horseshoeIndex, labelItems, applyColorFilter = (styles) => styles) {
  const labelStyle = {
    ...runtimeConfig.horseshoe_labels.styles,
  };

  return svg`
    <g class="horseshoe__labels-layer" style=${styleMap(applyColorFilter(labelStyle))}>
      ${labelItems.map((labelItem, index) => (
        HorseshoeLabels.renderLabel({
          horseshoeIndex,
          index,
          label: labelItem.text,
          styles: labelItem.styles,
          relation: labelItem.relation,
          ellipsis: runtimeConfig.horseshoe_labels.ellipsis,
          angle: labelItem.angle,
          arcSize: runtimeConfig.horseshoe_labels.arc_size ?? labelItem.arcSize,
          cx: geometry.cx,
          cy: geometry.cy,
          radius: labelItem.radius,
          cardId,
          orientation: runtimeConfig.horseshoe_labels.orientation ?? 'arc',
          isMin: labelItem.role === 'min',
          isMax: labelItem.role === 'max',
          transformContext: geometry.getTransformContext(),
          inverseTransform: geometry.getInverseGroupTransform(),
          applyColorFilter,
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
    applyColorFilter = (style) => style,
    gradientPrefix,
  } = options;

  const { filter, ...pathStyles } = styles;
  const groupStyle = filter ? { filter } : {};

  return svg`
    <g class=${layerClass} style=${styleMap(groupStyle)}>
      <defs>
        ${backgroundItems.map((backgroundItem) => {
          if (!backgroundItem.arc.gradient) return svg``;
          const gradientId = `${gradientPrefix}-${backgroundItem.key}`;
          const startStyle = applyColorFilter({ fill: backgroundItem.arc.gradient.startColor }, backgroundItem);
          const endStyle = applyColorFilter({ fill: backgroundItem.arc.gradient.endColor }, backgroundItem);

          return svg`
            <linearGradient
              id=${gradientId}
              gradientUnits="userSpaceOnUse"
              x1=${backgroundItem.arc.gradient.x1}
              y1=${backgroundItem.arc.gradient.y1}
              x2=${backgroundItem.arc.gradient.x2}
              y2=${backgroundItem.arc.gradient.y2}
            >
              <stop offset="0%" stop-color=${startStyle.fill}></stop>
              <stop offset="100%" stop-color=${endStyle.fill}></stop>
            </linearGradient>
          `;
        })}
      </defs>
      ${backgroundItems.map((backgroundItem) => {
        const gradientId = `${gradientPrefix}-${backgroundItem.key}`;
        const renderStyle = {
          'stroke-width': 0,
          ...pathStyles,
          fill: backgroundItem.arc.gradient
            ? `url('#${gradientId}')`
            : backgroundItem.color ?? pathStyles.fill ?? pathStyles.stroke ?? 'currentColor',
        };

        return backgroundItem.path
          ? svg`
              <path
                class=${itemClass}
                d=${backgroundItem.path}
                style=${styleMap(applyColorFilter(renderStyle, backgroundItem))}
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
export function renderHorseshoeBackgroundLayer(runtimeConfig, geometry, backgroundItems, cardId, horseshoeIndex, applyColorFilter) {
  return renderArcBackgroundLayer(geometry, backgroundItems, {
    layerClass: 'horseshoe__background-layer',
    itemClass: 'horseshoe__background',
    styles: runtimeConfig.horseshoe_background.styles,
    applyColorFilter,
    gradientPrefix: `horseshoe-background-${cardId}-${horseshoeIndex}`,
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
export function renderLabelBackgroundLayer(runtimeConfig, geometry, backgroundItems, cardId, horseshoeIndex, applyColorFilter) {
  return renderArcBackgroundLayer(geometry, backgroundItems, {
    layerClass: 'horseshoe__label-background-layer',
    itemClass: 'horseshoe__label-background',
    styles: runtimeConfig.horseshoe_labels.background.styles,
    applyColorFilter,
    gradientPrefix: `horseshoe-label-background-${cardId}-${horseshoeIndex}`,
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
export function renderLabelBadgesLayer(runtimeConfig, geometry, cardId, horseshoeIndex, labelItems, applyColorFilter = (styles) => styles) {
  if (!labelItems.length || !runtimeConfig.show.label_badges) {
    return svg``;
  }

  const badgeStyle = {
    ...runtimeConfig.horseshoe_labels.badges.styles,
  };

  return svg`
    <g class="horseshoe__label-badges-layer" style=${styleMap(applyColorFilter(badgeStyle))}>
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
export function renderTickmarkBackgroundLayer(runtimeConfig, geometry, backgroundItems, cardId, horseshoeIndex) {
  return renderArcBackgroundLayer(geometry, backgroundItems, {
    layerClass: 'horseshoe__tick-background-layer',
    itemClass: 'horseshoe__tick-background',
    styles: runtimeConfig.horseshoe_tickmarks.background.styles,
    gradientPrefix: `horseshoe-tick-background-${cardId}-${horseshoeIndex}`,
  });
}

/**
 * Renders major and minor tickmark path items.
 *
 * @param {Array<object>} tickPathItems - Renderable tickmark path items.
 * @returns {TemplateResult} SVG layer template.
 */
export function renderTickmarksLayer(tickPathItems, applyColorFilter = (styles) => styles) {
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
              style=${styleMap(applyColorFilter(pathItem.styles ?? {}, pathItem))}
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
              style=${styleMap(applyColorFilter(pathItem.styles ?? {}, pathItem))}
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
export function updateStatePathElements(runtimeConfig, statePathItems, statePathElements, card, cardId, horseshoeIndex, applyColorFilter = (styles) => styles) {
  const stateStyle = {
    ...runtimeConfig.horseshoe_state.styles,
  };

  const scaleStyle = {
    ...runtimeConfig.horseshoe_scale.styles,
  };

  if (runtimeConfig.show?.horseshoe_style === 'minmaxgradient' || runtimeConfig.show?.horseshoe_style === 'lineargradient') {
    const gradientStyle = runtimeConfig.show.horseshoe_style;
    const root = card.renderRoot ?? card.shadowRoot;
    const gradientGroup = root.getElementById?.(`horseshoe-state-${cardId}-${horseshoeIndex}-${gradientStyle}-group`)
      ?? root.querySelector?.(`#horseshoe-state-${cardId}-${horseshoeIndex}-${gradientStyle}-group`);

    if (!gradientGroup) {
      return;
    }

    gradientGroup.setAttribute(
      'style',
      Object.entries(applyColorFilter(stateStyle)).map(([property, styleValue]) => `${property}: ${styleValue}`).join('; '),
    );

    // Update the stable path and gradient pool directly so value animation does not rerender the full gauge.
    statePathItems.forEach((pathItem) => {
      const pathElement = getStatePathElement(statePathElements, card, cardId, horseshoeIndex, pathItem);
      const pathElementId = getStatePathElementId(cardId, horseshoeIndex, pathItem.key);
      const pathGradientId = `${pathElementId}-gradient`;
      const gradientElementKey = `${pathItem.key}-gradient`;
      let gradientElement = statePathElements.get(gradientElementKey);

      if (!gradientElement?.isConnected) {
        gradientElement = root.getElementById?.(pathGradientId) ?? root.querySelector?.(`#${pathGradientId}`);
        statePathElements.set(gradientElementKey, gradientElement);
      }

      if (!pathElement || !gradientElement) {
        return;
      }

      const startStyle = applyColorFilter({ fill: pathItem.arc.gradient.startColor }, pathItem);
      const endStyle = applyColorFilter({ fill: pathItem.arc.gradient.endColor }, pathItem);

      pathElement.setAttribute('d', pathItem.path || '');
      pathElement.setAttribute('style', `fill: url('#${pathGradientId}')`);
      gradientElement.setAttribute('x1', pathItem.arc.gradient.x1);
      gradientElement.setAttribute('y1', pathItem.arc.gradient.y1);
      gradientElement.setAttribute('x2', pathItem.arc.gradient.x2);
      gradientElement.setAttribute('y2', pathItem.arc.gradient.y2);
      gradientElement.children[0].setAttribute('stop-color', startStyle.fill);
      gradientElement.children[1].setAttribute('stop-color', endStyle.fill);
    });

    return;
  }

  if (runtimeConfig.show?.horseshoe_style === 'colorstopgradient') {
    const clipPathItem = statePathItems[0];
    const clipPathElement = getStatePathElement(statePathElements, card, cardId, horseshoeIndex, clipPathItem);

    if (!clipPathElement) {
      return;
    }

    clipPathElement.setAttribute('d', clipPathItem.path || '');

    return;
  }
  statePathItems.forEach((pathItem) => {
    const pathElement = getStatePathElement(statePathElements, card, cardId, horseshoeIndex, pathItem);

    if (!pathElement) {
      return;
    }

    const isStringStateMode = runtimeConfig.horseshoe_state.mode === 'stringstate_mode' || runtimeConfig.horseshoe_state.mode === 'stringstate_level';
    const arcBaseStyle = pathItem.arc.active === false && !isStringStateMode ? scaleStyle : stateStyle;
    const fill = pathItem.arc.color ?? arcBaseStyle.fill ?? runtimeConfig.horseshoe_state.color ?? 'none';
    const renderStyle = {
      ...arcBaseStyle,
      fill,
    };

    if (isStringStateMode && renderStyle.transition === undefined) {
      renderStyle.transition = 'fill 600ms ease, opacity 600ms ease, filter 600ms ease';
    }

    if (isStringStateMode && pathItem.arc.active === false) {
      renderStyle.opacity = runtimeConfig.horseshoe_state.inactive_opacity ?? '0';
    }

    if (!pathItem.path) {
      renderStyle.opacity = '0';
    }

    // Only the mutable path data and style are updated during animation frames.
    pathElement.setAttribute('d', pathItem.path || '');
    pathElement.setAttribute(
      'style',
      Object.entries(applyColorFilter(renderStyle, pathItem)).map(([property, value]) => `${property}: ${value}`).join('; '),
    );
  });
}
