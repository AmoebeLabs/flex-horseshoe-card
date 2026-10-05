import { svg } from "lit";
import { styleMap } from "lit/directives/style-map.js";
import BaseTool from "./base-tool.js";
import Colors from "./colors.js";
import ConfigHelper from "./config-helper.js";
import Merge from "./merge.js";
import FIXED_WEATHER_ATTRIBUTE_ICONS_NAME from "./weather-icons-name.ts";
import { FONT_SIZE, SVG_VIEW_BOX } from "./const.js";
import { entityIcon, attributeIcon } from "./frontend_mods/data/icons.ts";
import { getIconSource, HomeAssistantIconPath } from "./icon-source.js";
import { injectExternalSvgSources } from "./icon-svg-source.js";

/**
 * Layout icon tool that renders Home Assistant icons and URL image/SVG icons.
 */
export default class IconTool extends BaseTool {
  /**
   * Stores the initial Icon config and creates the id for its hidden HA icon.
   *
   * @param {object} config - Initial icon item config from layout.icons.
   * @param {number} index - Icon index inside layout.icons.
   * @param {object} templates - FHS JavaScript template evaluator shared with the card.
   * @param {string} cardId - Stable card id for generated SVG ids.
   * @param {LitElement} card - Parent card instance with shared render helpers.
   */
  constructor(config, index, templates, cardId, card) {
    const hasStandaloneIconSource =
      config.icon !== undefined || config.state_map !== undefined;
    const defaultEntityIndex = hasStandaloneIconSource ? undefined : 0;

    super(
      config,
      index,
      templates,
      cardId,
      card,
      "icons",
      "icons",
      defaultEntityIndex,
      { fill: true, stroke: false },
    );

    this.geometry = { svg: this.calculateSvgDimensions() };
    this.runtime.stateMapItem = this.getStateMapItem();
    this.iconId = Math.random().toString(36).substr(2, 9);
    this.haIconPath = new HomeAssistantIconPath(card, this.iconId);
    this.iconRequest = undefined;
    this.iconClosed = false;
  }

  /** Updates icon configuration and geometry before entity data is assigned. */
  updateRuntimeConfig() {
    super.updateRuntimeConfig();

    if (this.configurationChanged) {
      this.stopEntityIconRequest();
      this.runtime.stateMapItem = this.getStateMapItem();
    }
    if (this.configurationChanged || this.groupChanged) {
      this.geometry.svg = this.calculateSvgDimensions(this.config);
    }
  }

  /** Stores the state_map entry matching the current HA entity state for this render. */
  setState(entity, entityConfig) {
    super.setState(entity, entityConfig);
    this.runtime.stateMapItem = this.getStateMapItem();
  }

  /** Selects the configured default map entry for an icon without an entity. */
  setStaticState() {
    this.runtime.stateMapItem = this.getStateMapItem();
  }

  /** Releases only the pending entity-icon lookup started by this tool. */
  stopEntityIconRequest() {
    if (this.iconRequest && this.iconRequest.owner === this) {
      if (this.card.entitiesIconPending.get(this.iconRequest.id) === this.iconRequest) {
        this.card.entitiesIconPending.delete(this.iconRequest.id);
      }
    }
    this.iconRequest = undefined;
  }

  /** Allows HA icon path reads again after the card reconnects. */
  connected() {
    this.iconClosed = false;
    this.haIconPath.connected();
  }

  /** Prevents pending HA icon results from changing the card and stops hidden-icon path polling. */
  disconnected() {
    this.iconClosed = true;
    this.stopEntityIconRequest();
    this.haIconPath.disconnected();
  }


  /** Identifies the HA inputs which determine one entity/attribute icon. */
  getEntityIconKey(entity, entityConfig) {
    const attribute = entityConfig.attribute;
    return [
      entityConfig.entity,
      attribute ? "attribute" : "state",
      attribute ? attribute : "",
      attribute ? entity.attributes[attribute] : entity.state,
      entity.entity_id.split(".")[0],
      entity.attributes.device_class,
      entity.attributes.icon,
    ].join("|");
  }

  /**
   * Returns the state_map entry matching the HA entity state, or its `default` entry.
   *
   * @returns {object|undefined} Matching state_map item.
   */
  getStateMapItem() {
    const entries = this.config?.state_map?.map;
    if (!entries) return undefined;

    const state = this.runtime.entity?.state;

    return (
      entries.find(
        (entry) =>
          entry.state !== undefined && String(entry.state) === String(state),
      ) ?? entries.find((entry) => entry.state === "default")
    );
  }

  /**
   * Chooses an icon from the animation, state_map, Icon config, or HA entity.
   * HA entity and attribute icon helpers are used when those sources have no icon.
   *
   * @param {object} stateMapConfig - Matching state_map entry.
   * @returns {string|undefined} HA icon name or CSS url(...) value.
   */
  buildIcon(stateMapConfig, item = this.config) {
    const entityAnimation =
      this.card.cardAnimations.styles.iconsIcon[item.animation_id];

    if (entityAnimation) {
      return entityAnimation;
    }

    if (stateMapConfig?.icon) {
      return stateMapConfig.icon;
    }

    if (item.icon) {
      return item.icon;
    }

    if (!this.runtime.entity || !this.runtime.entityConfig) {
      return undefined;
    }

    if (this.runtime.entityConfig.icon) {
      return this.runtime.entityConfig.icon;
    }

    const entityId = this.runtime.entityConfig.entity;
    const attribute = this.runtime.entityConfig.attribute;
    const attributeValue = attribute
      ? this.runtime.entity.attributes?.[attribute]
      : undefined;
    const domain = this.runtime.entity.entity_id?.split(".")[0];

    if (this.runtime.entity.attributes?.icon && !attribute) {
      return this.runtime.entity.attributes.icon;
    }

    if (attribute && domain === "weather") {
      const weatherIcon = FIXED_WEATHER_ATTRIBUTE_ICONS_NAME[attribute];

      if (weatherIcon) {
        return weatherIcon;
      }
    }

    const iconId = attribute
      ? `${entityId}|attribute:${attribute}`
      : `${entityId}|state`;
    const key = this.getEntityIconKey(this.runtime.entity, this.runtime.entityConfig);

    if (this.card.entitiesIconKey[iconId] === key) {
      return this.card.entitiesIcon[iconId];
    }

    if (this.iconClosed) return this.card.entitiesIcon[iconId];
    const pending = this.card.entitiesIconPending.get(iconId);
    if (pending && pending.key === key) return this.card.entitiesIcon[iconId];

    // HA looks up translated entity and attribute icons asynchronously. Return the
    // card cache while waiting, then render again if the current result changes it.
    // Each request uses the current HA entity and attribute values, so a late reply
    // cannot replace an icon selected by newer entity data.
    this.stopEntityIconRequest();
    const request = { id: iconId, key, owner: this };
    this.iconRequest = request;
    this.card.entitiesIconPending.set(iconId, request);

    const iconPromise = attribute
      ? attributeIcon(
          this.card._hass,
          this.runtime.entity,
          attribute,
          attributeValue !== undefined ? String(attributeValue) : undefined,
        )
      : entityIcon(
          this.card._hass.entities,
          this.card._hass.config,
          this.card._hass.connection,
          this.runtime.entity,
        );

    iconPromise
      .then((icon) => {
        if (this.iconClosed || this.iconRequest !== request || this.card.entitiesIconPending.get(iconId) !== request) return;
        if (this.getEntityIconKey(this.runtime.entity, this.runtime.entityConfig) !== key) return;

        if (!icon) {
          return;
        }

        this.card.entitiesIconKey[iconId] = key;
        if (this.card.entitiesIcon[iconId] !== icon) {
          this.card.entitiesIcon[iconId] = icon;
          this.card.requestUpdate();
        }
      })
      .catch((err) => {
        if (this.iconClosed || this.iconRequest !== request || this.card.entitiesIconPending.get(iconId) !== request) return;
        if (this.getEntityIconKey(this.runtime.entity, this.runtime.entityConfig) !== key) return;
        console.error(
          attribute
            ? "IconTool.buildIcon attributeIcon failed"
            : "IconTool.buildIcon entityIcon failed",
          entityId,
          attribute ?? "",
          err,
        );
      })
      .finally(() => {
        // Clear only this request's entry; an older completion must not clear a newer lookup.
        if (this.card.entitiesIconPending.get(iconId) === request) this.card.entitiesIconPending.delete(iconId);
        if (this.iconRequest === request) this.iconRequest = undefined;
      });

    return this.card.entitiesIcon[iconId];
  }

  /** Injects all pending external SVG URL icons once per Lit update. */
  updated() {
    if (this.index === 0) injectExternalSvgSources(this.card);
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

    svgNode.classList.remove("hidden");

    return svg`
      <g
        transform="${this.getGroupScaleTransform(item)}"
        style="${this.getGroupScaleStyle(item)}"
      >
        <g
          class="icon-position"
          transform="translate(${iconCx} ${iconCy})"
          ${this.actionHandler()}
          @action=${(event) => this.handleAction(event)}
        >
          <rect
            x="${-iconPixels / 2}"
            y="${-iconPixels / 2}"
            height="${iconPixels}px"
            width="${iconPixels}px"
            stroke-width="0px"
            fill="rgba(0,0,0,0)"
            pointer-events="${item.tap_action?.action === "none" ? "none" : "auto"}"
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
      return this.renderCachedSvgUrlIcon(
        item,
        url,
        configStyle,
        iconPixels,
        cx,
        cy,
        adjust,
      );
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
          ${this.actionHandler()}
          @action=${(event) => this.handleAction(event)}
        >
          <rect
            x="${-iconPixels / 2}"
            y="${-iconPixels / 2}"
            height="${iconPixels}px"
            width="${iconPixels}px"
            stroke-width="0px"
            fill="rgba(0,0,0,0)"
            pointer-events="${item.tap_action?.action === "none" ? "none" : "auto"}"
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
   * Renders this icon tool.
   *
   * @returns {TemplateResult} SVG template for the icon.
   */
  render() {
    const item = this.config;

    const smItem = this.runtime.stateMapItem;
    let renderItem = item;

    if (smItem) {
      renderItem = Merge.mergeDeep(item, smItem);
    }

    // icon_size_percent is relative to the full square SVG viewbox; icon_size keeps the legacy font-size based sizing.
    const iconPixels =
      renderItem.icon_size_percent !== undefined
        ? (Number(renderItem.icon_size_percent) / 100) * SVG_VIEW_BOX
        : (renderItem.icon_size
            ? renderItem.icon_size
            : renderItem.size
              ? renderItem.size
              : 2) * FONT_SIZE;
    const cx = this.geometry.svg.xpos;
    const cy = this.geometry.svg.ypos;
    const align = renderItem.align ? renderItem.align : "center";
    const adjust = align === "center" ? 0.5 : align === "start" ? -1 : 1;
    const xpx = cx - iconPixels * adjust;
    const ypx = cy - iconPixels * adjust;
    const foIconPixels = iconPixels;

    const haStyle = this.runtime.entity
      ? Colors.getHaEntityIconStyle(this.runtime.entity)
      : { fill: "currentColor", color: "var(--state-icon-color)" };
    const defaultIconColor = {};
    defaultIconColor.fill = haStyle.fill;
    defaultIconColor.color = haStyle.color;
    defaultIconColor.filter = haStyle.filter;

    let configStyle = ConfigHelper.toStyleDict(this.runtime.effectiveStyles ?? renderItem.styles);
    // A Control can pass styles selected for this child Icon. The matching
    // state_map styles override them, then color stops and animation are applied.
    if (this.runtime.effectiveStyles) Object.assign(configStyle, ConfigHelper.toStyleDict(smItem?.styles));
    const stateStyle =
      this.card.cardAnimations.styles.icons[renderItem.animation_id] ?? {};
    // A state_map can select another Icon config. Apply this Icon's color stops
    // to it before falling back to the HA entity's icon colors.
    this.applyColorStops(configStyle, renderItem, ["fill", "color"], this.paint?.colorStops);

    configStyle = this.getRenderStyles(
      {
        ...defaultIconColor,
        ...configStyle,
        ...stateStyle,
      },
      renderItem === item ? [] : [renderItem.color_filter],
    );

    const icon = this.buildIcon(smItem, renderItem);

    if (icon) {
      const iconSource = getIconSource(icon);

      if (iconSource.type === "svg-url") {
        return this.renderItemLayers(
          this.renderSvgUrlIcon(
            renderItem,
            iconSource.value,
            configStyle,
            iconPixels,
            cx,
            cy,
            adjust,
          ),
          renderItem,
        );
      }

      if (iconSource.type === "image-url") {
        return this.renderItemLayers(
          this.renderImageUrlIcon(
            renderItem,
            iconSource.value,
            configStyle,
            iconPixels,
            cx,
            cy,
            adjust,
          ),
          renderItem,
        );
      }
    }

    if (!icon) {
      return svg``;
    }

    const iconSvg = this.haIconPath.getPath(icon);

    if (iconSvg) {
      const x1 = cx - iconPixels * adjust;
      const y1 =
        cy - iconPixels * 0.5 - (renderItem.yposc ? 0 : iconPixels * 0.25);
      const scale = iconPixels / 24;
      const rotate = renderItem.rotate ?? 0;
      const iconCx = x1 + 12 * scale;
      const iconCy = y1 + 12 * scale;

      configStyle["transform-origin"] ??= "0 0";

      return this.renderItemLayers(
        svg`
        <g
          transform="${this.getGroupScaleTransform(renderItem)}"
          style="${this.getGroupScaleStyle(renderItem)}"
        >
          <g
            id="icon-rendered-${this.iconId}"
            class="icon-position"
            transform="translate(${iconCx} ${iconCy})"
            ${this.actionHandler()}
            @action=${(event) => this.handleAction(event)}
          >
            <rect
              x="${-iconPixels / 2}"
              y="${-iconPixels / 2}"
              height="${iconPixels}px"
              width="${iconPixels}px"
              stroke-width="0px"
              fill="rgba(0,0,0,0)"
              pointer-events="${renderItem.tap_action?.action === "none" ? "none" : "auto"}"
            ></rect>

            <g class="icon-style-animation" style="${styleMap(configStyle)}">
              <g class="icon-rotate" transform="rotate(${rotate})">
                <g class="icon-scale" transform="scale(${scale})">
                  <g class="icon-center" transform="translate(-12 -12)">
                    <path d="${iconSvg}"></path>
                  </g>
                </g>
              </g>
            </g>
          </g>
        </g>
      `,
        renderItem,
      );
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
              id="${this.haIconPath.elementId}"
            ></ha-icon>
          </div>
        </body>
      </foreignObject>
    `;
  }
}
