import { svg } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import { SVGInjector } from '@tanem/svg-injector';
import BaseTool from './base-tool.js';
import Colors from './colors.js';
import ConfigHelper from './config-helper.js';
import Merge from './merge.js';
import Templates from './templates.js';
import FIXED_WEATHER_ATTRIBUTE_ICONS_NAME from './weather-icons-name.ts';
import { FONT_SIZE } from './const.js';
import { entityIcon, attributeIcon } from './frontend_mods/data/icons.ts';

/**
 * Layout icon tool that renders Home Assistant icons and URL image/SVG icons.
 */
export default class IconTool extends BaseTool {
  /**
   * Builds icon tool instances from the already normalized layout config.
   *
   * @param {object} config - Full card configuration after static card-level normalization.
   * @param {object} templates - Template resolver shared with the card.
   * @param {string} cardId - Stable card id for generated SVG ids.
   * @param {LitElement} card - Parent card instance with shared render helpers.
   * @returns {Array<IconTool>} Configured icon tools.
   */
  static setConfig(config, templates, cardId, card) {
    const icons = config.layout?.icons ?? [];

    return icons.map((iconConfig, index) => new IconTool(iconConfig, index, templates, cardId, card));
  }

  /**
   * Stores static icon config and initializes icon cache ids.
   *
   * @param {object} config - Static icon item config.
   * @param {number} index - Icon index inside layout.icons.
   * @param {object} templates - Template resolver shared with the card.
   * @param {string} cardId - Stable card id for generated SVG ids.
   * @param {LitElement} card - Parent card instance with shared render helpers.
   */
  constructor(config, index, templates, cardId, card) {
    const hasStandaloneIconSource = config.icon !== undefined || config.state_map !== undefined;
    const defaultEntityIndex = hasStandaloneIconSource ? undefined : 0;

    super(config, index, templates, cardId, card, 'icons', 'icons', defaultEntityIndex);

    this.config.svg = this.calculateSvgDimensions();
    this.runtimeConfig = this.config;
    this.iconId = Math.random().toString(36).substr(2, 9);
    this.iconSvg = undefined;
    this.pendingIconPath = undefined;
  }

  /**
   * Updates runtime entity context for this icon.
   *
   * @param {object} entity - Home Assistant entity state object for this icon.
   * @param {object} entityConfig - Entity configuration for this icon.
   */
  setState(entity, entityConfig) {
    super.setState(entity, entityConfig);

    this.runtimeConfig.svg = this.calculateSvgDimensions(this.runtimeConfig);
  }

  /**
   * Converts icon config coordinates to SVG coordinates.
   *
   * @param {object} config - Static or runtime icon config.
   * @returns {object} SVG coordinates.
   */
  calculateSvgDimensions(config = this.config) {
    return this.card._calculateSvgCoordinatesInGroup(config);
  }

  /**
   * Returns the SVG transform for the effective icon item.
   *
   * @param {object} item - Runtime icon config after optional state_map merge.
   * @returns {string} SVG transform value.
   */
  getGroupScaleTransform(item = this.runtimeConfig) {
    return this.card._getGroupScaleTransform(item);
  }

  /**
   * Returns the SVG style needed for the effective icon group scale origin.
   *
   * @param {object} item - Runtime icon config after optional state_map merge.
   * @returns {string} SVG style value.
   */
  getGroupScaleStyle(item = this.runtimeConfig) {
    return this.card._getGroupScaleStyle(item);
  }

  /**
   * Returns a state_map entry for the current entity state.
   *
   * @returns {object|undefined} Matching state_map item.
   */
  getStateMapItem() {
    const entries = this.runtimeConfig?.state_map?.map;
    if (!entries) return undefined;

    const state = this.entity?.state;

    return entries.find((entry) => entry.state === state) ?? entries.find((entry) => entry.state === 'default');
  }

  /**
   * Builds the effective icon name or URL from animation, state_map, config, and Home Assistant.
   *
   * @param {object} stateMapConfig - Matching state_map entry.
   * @returns {string|undefined} Icon name or css url(...).
   */
  buildIcon(stateMapConfig, item = this.runtimeConfig) {
    const entityAnimation = this.card.animations?.iconsIcon?.[item.animation_id];

    if (entityAnimation) {
      return entityAnimation;
    }

    if (stateMapConfig?.icon) {
      return stateMapConfig.icon;
    }

    if (item.icon) {
      return item.icon;
    }

    if (!this.entity || !this.entityConfig) {
      return undefined;
    }

    if (this.entityConfig.icon) {
      return this.entityConfig.icon;
    }

    const entityId = this.entityConfig.entity;
    const attribute = this.entityConfig.attribute;
    const attributeValue = attribute ? this.entity.attributes?.[attribute] : undefined;
    const domain = this.entity.entity_id?.split('.')[0];

    if (this.entity.attributes?.icon && !attribute) {
      return this.entity.attributes.icon;
    }

    if (attribute && domain === 'weather') {
      const weatherIcon = FIXED_WEATHER_ATTRIBUTE_ICONS_NAME[attribute];

      if (weatherIcon) {
        return weatherIcon;
      }
    }

    this.card.entitiesIcon ??= {};
    this.card.entitiesIconKey ??= {};
    this.card.entitiesIconPending ??= {};

    const iconId = attribute ? `${entityId}|attribute:${attribute}` : `${entityId}|state`;
    const key = attribute
      ? [entityId, 'attribute', attribute, attributeValue ?? '', domain ?? '', this.entity.attributes?.device_class ?? '', this.entity.attributes?.icon ?? ''].join('|')
      : [entityId, 'state', this.entity.state ?? '', domain ?? '', this.entity.attributes?.device_class ?? '', this.entity.attributes?.icon ?? ''].join('|');

    if (this.card.entitiesIconKey[iconId] === key) {
      return this.card.entitiesIcon[iconId];
    }

    this.card.entitiesIconKey[iconId] = key;

    if (!this.card.entitiesIconPending[iconId]) {
      this.card.entitiesIconPending[iconId] = true;

      const iconPromise = attribute
        ? attributeIcon(this.card._hass, this.entity, attribute, attributeValue !== undefined ? String(attributeValue) : undefined)
        : entityIcon(this.card._hass.entities, this.card._hass.config, this.card._hass.connection, this.entity);

      iconPromise
        .then((icon) => {
          if (this.card.entitiesIconKey[iconId] !== key) {
            return;
          }

          if (!icon) {
            return;
          }

          if (this.card.entitiesIcon[iconId] !== icon) {
            this.card.entitiesIcon[iconId] = icon;
            this.card.requestUpdate();
          }
        })
        .catch((err) => {
          console.error(attribute ? 'IconTool.buildIcon attributeIcon failed' : 'IconTool.buildIcon entityIcon failed', entityId, attribute ?? '', err);
        })
        .finally(() => {
          this.card.entitiesIconPending[iconId] = false;
        });
    }

    return this.card.entitiesIcon[iconId];
  }

  /**
   * Checks for css url(...) icon values.
   *
   * @param {*} icon - Icon config value.
   * @returns {boolean} True when the icon is a css url(...).
   */
  isUrlIcon(icon) {
    return typeof icon === 'string' && /^url\(['"]?.+['"]?\)$/i.test(icon.trim());
  }

  /**
   * Checks whether a URL points to an SVG file.
   *
   * @param {string} url - Image URL.
   * @returns {boolean} True when the URL ends in .svg.
   */
  isSvgUrl(url) {
    return url.endsWith('.svg');
  }

  /**
   * Extracts the URL from a css url(...) value.
   *
   * @param {string} value - CSS url value.
   * @returns {string} Plain URL.
   */
  getUrlFromCssUrl(value) {
    return value
      .trim()
      .replace(/^url\(['"]?/i, '')
      .replace(/['"]?\)$/, '');
  }

  /**
   * Injects pending external SVG URL icons into the shadow DOM.
   */
  injectSvgUrlIcons() {
    const elements = this.card.shadowRoot.querySelectorAll('svg.icon-svg-url[data-src]:not(.injected-svg)');

    if (!elements.length) return;

    SVGInjector(elements, {
      beforeEach(svgNode) {
        svgNode.removeAttribute('height');
        svgNode.removeAttribute('width');
      },

      afterEach: (err, injectedSvg) => {
        if (err || !injectedSvg) return;

        const url = injectedSvg.dataset.src;
        if (!url) return;

        this.card.svgUrlCache[url] = injectedSvg.cloneNode(true);
      },

      afterAll: () => {
        this.card.requestUpdate();
      },

      cacheRequests: false,
      evalScripts: 'once',
      httpRequestWithCredentials: false,
      renumerateIRIElements: false,
    });
  }

  /**
   * Renders a cached injected SVG URL icon.
   */
  renderCachedSvgUrlIcon(item, url, configStyle, iconPixels, cx, cy, adjust) {
    const svgNode = this.card.svgUrlCache[url].cloneNode(true);
    const rotate = item.rotate ?? 0;
    const x1 = cx - iconPixels * adjust;
    const y1 = cy - iconPixels * 0.5 - (item.yposc ? 0 : iconPixels * 0.25);
    const scale = iconPixels / 24;
    const iconCx = x1 + 12 * scale;
    const iconCy = y1 + 12 * scale;

    svgNode.classList.remove('hidden');

    return svg`
      <g
        transform="${this.getGroupScaleTransform(item)}"
        style="${this.getGroupScaleStyle(item)}"
      >
        <g
          class="icon-position"
          transform="translate(${iconCx} ${iconCy})"
          @click=${(event) => this.handlePopup(event)}
        >
          <rect
            x="${-iconPixels / 2}"
            y="${-iconPixels / 2}"
            height="${iconPixels}px"
            width="${iconPixels}px"
            stroke-width="0px"
            fill="rgba(0,0,0,0)"
          ></rect>

          <g class="icon-style-animation" style="${styleMap(configStyle)}">
            <g class="icon-rotate" transform="rotate(${rotate})">
              <svg
                x="${-iconPixels / 2}"
                y="${-iconPixels / 2}"
                width="${iconPixels}"
                height="${iconPixels}"
                viewBox="0 0 24 24"
                overflow="visible"
              >
                ${svgNode}
              </svg>
            </g>
          </g>
        </g>
      </g>
    `;
  }

  /**
   * Renders a placeholder that SVGInjector replaces with the external SVG contents.
   */
  renderSvgUrlPlaceholder(item, url, iconPixels, cx, cy, adjust) {
    const rotate = item.rotate ?? 0;
    const x1 = cx - iconPixels * adjust;
    const y1 = cy - iconPixels * 0.5 - (item.yposc ? 0 : iconPixels * 0.25);
    const scale = iconPixels / 24;
    const iconCx = x1 + 12 * scale;
    const iconCy = y1 + 12 * scale;

    return svg`
      <g
        transform="${this.getGroupScaleTransform(item)}"
        style="${this.getGroupScaleStyle(item)}"
      >
        <g class="icon-position" transform="translate(${iconCx} ${iconCy})">
          <g class="icon-rotate" transform="rotate(${rotate})">
            <g class="icon-scale" transform="scale(${scale})">
              <g class="icon-center" transform="translate(-12 -12)">
                <svg
                  class="icon-svg-url hidden"
                  data-src="${url}"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                >
                  <image
                    href="${url}"
                    width="24"
                    height="24"
                  />
                </svg>
              </g>
            </g>
          </g>
        </g>
      </g>
    `;
  }

  /**
   * Renders an SVG URL icon, using the injected cache when available.
   */
  renderSvgUrlIcon(item, url, configStyle, iconPixels, cx, cy, adjust) {
    if (this.card.svgUrlCache[url]) {
      return this.renderCachedSvgUrlIcon(item, url, configStyle, iconPixels, cx, cy, adjust);
    }

    return this.renderSvgUrlPlaceholder(item, url, iconPixels, cx, cy, adjust);
  }

  /**
   * Renders a normal image URL icon.
   */
  renderImageUrlIcon(item, url, configStyle, iconPixels, cx, cy, adjust) {
    const rotate = item.rotate ?? 0;
    const x1 = cx - iconPixels * adjust;
    const y1 = cy - iconPixels * 0.5 - (item.yposc ? 0 : iconPixels * 0.25);
    const scale = iconPixels / 24;
    const iconCx = x1 + 12 * scale;
    const iconCy = y1 + 12 * scale;

    return svg`
      <g
        transform="${this.getGroupScaleTransform(item)}"
        style="${this.getGroupScaleStyle(item)}"
      >
        <g
          class="icon-position"
          transform="translate(${iconCx} ${iconCy})"
          @click=${(event) => this.handlePopup(event)}
        >
          <rect
            x="${-iconPixels / 2}"
            y="${-iconPixels / 2}"
            height="${iconPixels}px"
            width="${iconPixels}px"
            stroke-width="0px"
            fill="rgba(0,0,0,0)"
          ></rect>

          <g class="icon-style-animation" style="${styleMap(configStyle)}">
            <g class="icon-rotate" transform="rotate(${rotate})">
              <g class="icon-scale" transform="scale(${scale})">
                <g class="icon-center" transform="translate(-12 -12)">
                  <image
                    href="${url}"
                    width="24"
                    height="24"
                    preserveAspectRatio="xMidYMid meet"
                  />
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>
    `;
  }

  /**
   * Reads the rendered ha-icon SVG path from the shadow DOM.
   *
   * @returns {string|undefined} Rendered icon path.
   */
  getRenderedHaIconPath() {
    const iconElement = this.card.shadowRoot.getElementById(`icon-${this.iconId}`);

    return iconElement?.shadowRoot?.querySelector('*')?.path;
  }

  /**
   * Renders this icon tool.
   *
   * @returns {TemplateResult} SVG template for the icon.
   */
  render() {
    const item = this.runtimeConfig;

    item.entity = item.entity ? item.entity : 0;

    const iconSize = item.icon_size ? item.icon_size : item.size ? item.size : 2;
    const iconPixels = iconSize * FONT_SIZE;
    const cx = item.svg.xpos;
    const cy = item.svg.ypos;
    const align = item.align ? item.align : 'center';
    const adjust = align === 'center' ? 0.5 : align === 'start' ? -1 : 1;
    const xpx = cx - iconPixels * adjust;
    const ypx = cy - iconPixels * adjust;
    const foIconPixels = iconPixels;
    const smItem = this.getStateMapItem();
    let renderItem = item;

    if (smItem) {
      renderItem = Merge.mergeDeep(item, smItem);
    }

    const haStyle = this.entity
      ? Colors.getHaEntityIconStyle(this.entity)
      : { fill: 'currentColor', color: 'var(--state-icon-color)' };
    const defaultIconColor = {};
    defaultIconColor.fill = haStyle.fill;
    defaultIconColor.color = haStyle.color;
    defaultIconColor.filter = haStyle.filter;

    const resolvedStyles = Templates.getJsTemplateOrValue(renderItem, renderItem.styles);
    let configStyle = ConfigHelper.toStyleDict(resolvedStyles);
    const stateStyle = this.card.animations?.icons?.[renderItem.animation_id] ?? {};
    const stopColor = this.card._getItemColorFromStops(renderItem);

    if (stopColor) {
      configStyle.fill = stopColor;
      configStyle.color = stopColor;
    }

    configStyle = this.getRenderStyles({
      ...defaultIconColor,
      ...configStyle,
      ...stateStyle,
    }, renderItem === item ? [] : [renderItem.color_filter]);

    const icon = this.buildIcon(smItem, renderItem);

    if (this.isUrlIcon(icon)) {
      const url = this.getUrlFromCssUrl(icon);

      if (this.isSvgUrl(url)) {
        return this.renderSvgUrlIcon(renderItem, url, configStyle, iconPixels, cx, cy, adjust);
      }

      return this.renderImageUrlIcon(renderItem, url, configStyle, iconPixels, cx, cy, adjust);
    }

    if (!icon) {
      return svg``;
    }

    if (this.card.iconCache[icon]) {
      this.iconSvg = this.card.iconCache[icon];
    } else {
      this.iconSvg = undefined;

      if (this.pendingIconPath !== icon) {
        this.pendingIconPath = icon;

        let attempts = 0;
        const maxAttempts = 40;
        const delay = 50;

        const readIconPath = () => {
          if (this.pendingIconPath !== icon) return;

          const iconSvg = this.getRenderedHaIconPath();

          if (iconSvg) {
            this.iconSvg = iconSvg;
            this.card.iconCache[icon] = iconSvg;
            this.pendingIconPath = undefined;

            this.card.requestUpdate();
            return;
          }

          attempts += 1;

          if (attempts >= maxAttempts) {
            this.pendingIconPath = undefined;
            return;
          }

          window.setTimeout(readIconPath, delay);
        };

        const afterRender = this.card?.updateComplete && typeof this.card.updateComplete.then === 'function'
          ? this.card.updateComplete
          : new Promise((resolve) => {
            window.requestAnimationFrame(resolve);
          });

        afterRender.then(() => {
          window.setTimeout(readIconPath, 0);
        });
      }
    }

    if (this.iconSvg) {
      const x1 = cx - iconPixels * adjust;
      const y1 = cy - iconPixels * 0.5 - (renderItem.yposc ? 0 : iconPixels * 0.25);
      const scale = iconPixels / 24;
      const rotate = renderItem.rotate ?? 0;
      const iconCx = x1 + 12 * scale;
      const iconCy = y1 + 12 * scale;

      configStyle['transform-origin'] ??= '0 0';

      return svg`
        <g
          transform="${this.getGroupScaleTransform(renderItem)}"
          style="${this.getGroupScaleStyle(renderItem)}"
        >
          <g
            id="icon-rendered-${this.iconId}"
            class="icon-position"
            transform="translate(${iconCx} ${iconCy})"
            @click=${(event) => this.handlePopup(event)}
          >
            <rect
              x="${-iconPixels / 2}"
              y="${-iconPixels / 2}"
              height="${iconPixels}px"
              width="${iconPixels}px"
              stroke-width="0px"
              fill="rgba(0,0,0,0)"
            ></rect>

            <g class="icon-style-animation" style="${styleMap(configStyle)}">
              <g class="icon-rotate" transform="rotate(${rotate})">
                <g class="icon-scale" transform="scale(${scale})">
                  <g class="icon-center" transform="translate(-12 -12)">
                    <path d="${this.iconSvg}"></path>
                  </g>
                </g>
              </g>
            </g>
          </g>
        </g>
      `;
    }

    return svg`
      <foreignObject
        width="0px"
        height="0px"
        x="${xpx}"
        y="${ypx}"
        overflow="hidden"
      >
        <body>
          <div
            xmlns="http://www.w3.org/1999/xhtml"
            class="div__icon hover"
            style="
              line-height: ${foIconPixels}px;
              position: relative;
              border-style: solid;
              border-width: 0px;
              border-color: rgba(0,0,0,0);
              fill: rgba(0,0,0,0);
              color: rgba(0,0,0,0);
            "
          >
            <ha-icon
              .icon=${icon}
              id="icon-${this.iconId}"
            ></ha-icon>
          </div>
        </body>
      </foreignObject>
    `;
  }
}
