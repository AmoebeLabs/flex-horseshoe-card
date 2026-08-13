import { svg } from "lit";
import { styleMap } from "lit/directives/style-map.js";
import ConfigHelper from "./config-helper.js";
import ControlBase from "./control-base.js";
import ControlContent from "./control-content.js";
import IconTool from "./icon-tool.js";
import Merge from "./merge.js";
import TextTool from "./text-tool.js";
import Utils from "./utils.js";

/** Segmented select control backed by an entity state or configured attribute. */
export default class ControlSelect extends ControlBase {
  /**
   * Removes disabled options before entity addresses are resolved.
   *
   * @param {object} config Raw select control configuration.
   * @param {object} templates Shared template evaluator.
   */
  static removeDisabledOptionConfigs(config, templates) {
    if (config.option_map === undefined) return;

    config.option_map = config.option_map.filter((option) => {
      if (option.disabled === undefined) return true;

      return !ConfigHelper.isDisabled(
        option,
        option.disabled,
        "controls.option_map",
        templates,
      );
    });
  }

  /**
   * Completes one explicit or entity-derived option map.
   *
   * State identifies the selected segment, value feeds actions, and text is
   * presentation. Keeping those roles separate lets one map handle translated
   * labels and services whose accepted value differs from the reported state.
   */
  static normalizeOptionMap(optionMap, selectConfig) {
    if (!Array.isArray(optionMap) || optionMap.length === 0) {
      throw Error("[controls] Select option_map must contain at least one option");
    }

    return optionMap.map((option, optionIndex) => {
      if (!Object.hasOwn(option, "value")) {
        throw Error(
          `[controls] Select option_map[${optionIndex}] requires value`,
        );
      }

      return Merge.mergeDeep(
        {
          state: option.value,
          text: option.value,
          tap_action: selectConfig.tap_action,
          ...(selectConfig.hold_action !== undefined
            ? { hold_action: selectConfig.hold_action }
            : {}),
          ...(selectConfig.double_tap_action !== undefined
            ? { double_tap_action: selectConfig.double_tap_action }
            : {}),
          entity_index: selectConfig.entity_index,
          content: {},
          text_config: {},
          icon_config: {},
        },
        option,
      );
    });
  }

  /**
   * Replaces exact option(path) values inside one option's gesture configs.
   *
   * For example, data.hvac_mode: option(value) receives the raw option value.
   * References are not interpolated into surrounding strings, preserving the
   * referenced property's original datatype.
   */
  static buildOptionActionConfig(option) {
    const replaceOptionReferences = (value) => {
      if (Array.isArray(value)) {
        return value.map((entry) => replaceOptionReferences(entry));
      }
      if (value && typeof value === "object") {
        return Object.fromEntries(
          Object.entries(value).map(([property, propertyValue]) => [
            property,
            replaceOptionReferences(propertyValue),
          ]),
        );
      }
      if (typeof value !== "string") return value;

      const optionReference = value.trim();
      const referenceMatch = optionReference.match(
        /^option\(([A-Za-z_][A-Za-z0-9_]*(?:\.[A-Za-z_][A-Za-z0-9_]*)*)\)$/,
      );

      if (referenceMatch === null) {
        if (optionReference.startsWith("option(")) {
          throw Error(
            `[controls] Invalid select option reference '${value}'`,
          );
        }
        return value;
      }

      let referencedValue = option;
      referenceMatch[1].split(".").forEach((property) => {
        if (
          referencedValue === null ||
          typeof referencedValue !== "object" ||
          !Object.hasOwn(referencedValue, property)
        ) {
          throw Error(
            `[controls] Select option reference '${value}' not found`,
          );
        }
        referencedValue = referencedValue[property];
      });
      return referencedValue;
    };

    const actionConfig = Merge.mergeDeep({}, option);
    ["tap_action", "hold_action", "double_tap_action"].forEach(
      (actionProperty) => {
        if (actionConfig[actionProperty] !== undefined) {
          actionConfig[actionProperty] = replaceOptionReferences(
            actionConfig[actionProperty],
          );
        }
      },
    );
    return actionConfig;
  }

  /** Normalizes select configuration and creates reusable option content tools. */
  constructor(config, index, templates, cardId, card) {
    const usesEntityOptions = config.option_map === undefined;
    const DEFAULT_SELECT_CONFIG = {
      orientation: "horizontal",
      width: 34,
      height: 11,
      tap_action: {
        action: "select-option",
        option: "option(value)",
      },
      background: {
        radius: 5,
        styles: {},
      },
      track: {
        padding: { x: 0.5, y: 0.5 },
        styles: {},
      },
      separator: {
        padding: { x: 1, y: 1 },
        styles: {
          stroke: "var(--divider-color)",
          "stroke-width": 0.25,
        },
      },
      option_map: [],
      content: {
        mode: "content_vertical",
        content_vertical: {
          padding: { x: 0.5, y: 0.5 },
          gap: 0.5,
          icon: { size: 45, styles: {} },
          text: { styles: {} },
        },
        content_horizontal: {
          padding: { x: 0.5, y: 0.5 },
          gap: 0.5,
          icon: { size: 45, styles: {} },
          text: { styles: {} },
        },
      },
      show: {
        item_variant: "segmented",
        item_viz: "viz_button",
        item_style: "filled_round",
        separator: true,
      },
      viz_button: {
        background: {
          styles: { fill: "var(--secondary-background-color)" },
        },
        track: {
          styles: { fill: "transparent" },
        },
        indicator: {
          position: "fill",
          padding: { x: 0.5, y: 0.5 },
          thickness: 0.75,
          radius: 2,
          styles: { fill: "var(--primary-color)", opacity: 0.8 },
        },
        selected: {
          background: { styles: { fill: "transparent" } },
          icon: { styles: { fill: "var(--primary-background-color)" } },
          text: { styles: { fill: "var(--primary-background-color)" } },
        },
        unselected: {
          background: { styles: { fill: "transparent" } },
          icon: { styles: { fill: "var(--primary-text-color)" } },
          text: { styles: { fill: "var(--primary-text-color)" } },
        },
        animation: {
          duration: 250,
          easing: "ease-out",
        },
        press: {
          scale: 0.9,
          duration: 140,
          easing: "ease-out",
        },
      },
      viz_line: {
        background: {
          styles: { fill: "var(--secondary-background-color)" },
        },
        track: {
          styles: { fill: "transparent" },
        },
        indicator: {
          position: "bottom",
          padding: { x: 0.5, y: 0.5 },
          thickness: 0.75,
          radius: 0.375,
          styles: { fill: "var(--primary-color)" },
        },
        selected: {
          background: { styles: { fill: "transparent" } },
          icon: { styles: { fill: "var(--primary-color)" } },
          text: { styles: { fill: "var(--primary-color)" } },
        },
        unselected: {
          background: { styles: { fill: "transparent" } },
          icon: { styles: { fill: "var(--primary-text-color)" } },
          text: { styles: { fill: "var(--primary-text-color)" } },
        },
        animation: {
          duration: 250,
          easing: "ease-out",
        },
        press: {
          scale: 0.9,
          duration: 140,
          easing: "ease-out",
        },
      },
    };
    const SELECT_SURFACE_PRESETS = {
      filled: {
        background: {
          styles: { fill: "var(--secondary-background-color)", stroke: "none" },
        },
        viz_button: {
          background: {
            styles: {
              fill: "var(--secondary-background-color)",
              stroke: "none",
            },
          },
          indicator: {
            styles: { fill: "var(--primary-color)", stroke: "none" },
          },
        },
        viz_line: {
          background: {
            styles: {
              fill: "var(--secondary-background-color)",
              stroke: "none",
            },
          },
          indicator: {
            styles: { fill: "var(--primary-color)", stroke: "none" },
          },
        },
      },
      outlined: {
        background: {
          styles: {
            fill: "var(--card-background-color)",
            stroke: "var(--divider-color)",
            "stroke-width": 1,
          },
        },
        viz_button: {
          background: {
            styles: {
              fill: "var(--card-background-color)",
              stroke: "var(--divider-color)",
              "stroke-width": 1,
            },
          },
          track: { styles: { fill: "transparent" } },
          indicator: {
            styles: { fill: "var(--primary-color)", stroke: "none" },
          },
          selected: {
            background: { styles: { fill: "transparent" } },
            icon: { styles: { fill: "var(--primary-background-color)" } },
            text: { styles: { fill: "var(--primary-background-color)" } },
          },
        },
        viz_line: {
          background: {
            styles: {
              fill: "var(--card-background-color)",
              stroke: "var(--divider-color)",
              "stroke-width": 1,
            },
          },
          track: { styles: { fill: "transparent" } },
          indicator: {
            styles: { fill: "var(--primary-color)", stroke: "none" },
          },
        },
      },
    };
    const SELECT_SHAPE_PRESETS = {
      round: { background: { radius: 5 } },
      square: { background: { radius: 2 } },
    };
    const SELECT_STYLE_PRESETS = {
      filled_round: Merge.mergeDeep(
        SELECT_SURFACE_PRESETS.filled,
        SELECT_SHAPE_PRESETS.round,
      ),
      filled_square: Merge.mergeDeep(
        SELECT_SURFACE_PRESETS.filled,
        SELECT_SHAPE_PRESETS.square,
      ),
      outlined_round: Merge.mergeDeep(
        SELECT_SURFACE_PRESETS.outlined,
        SELECT_SHAPE_PRESETS.round,
      ),
      outlined_square: Merge.mergeDeep(
        SELECT_SURFACE_PRESETS.outlined,
        SELECT_SHAPE_PRESETS.square,
      ),
    };
    const selectedConfig = Merge.mergeDeep(DEFAULT_SELECT_CONFIG, config);
    if (selectedConfig.show.item_variant !== "segmented") {
      throw Error(
        `[controls] Invalid select item_variant '${selectedConfig.show.item_variant}' [segmented]`,
      );
    }
    if (!["viz_button", "viz_line"].includes(selectedConfig.show.item_viz)) {
      throw Error(
        `[controls] Invalid select item_viz '${selectedConfig.show.item_viz}' [viz_button, viz_line]`,
      );
    }
    if (!Object.hasOwn(SELECT_STYLE_PRESETS, selectedConfig.show.item_style)) {
      throw Error(
        `[controls] Invalid select item_style '${selectedConfig.show.item_style}' [${Object.keys(SELECT_STYLE_PRESETS).join(", ")}]`,
      );
    }

    const selectConfig = Merge.mergeDeep(
      DEFAULT_SELECT_CONFIG,
      SELECT_STYLE_PRESETS[selectedConfig.show.item_style],
      config,
    );
    const selectedVizName = selectConfig.show.item_viz;

    // A named visualization inherits the complete button visualization before
    // its own config overrides are applied. Render code consumes one final viz.
    selectConfig[selectedVizName] = Merge.mergeDeep(
      DEFAULT_SELECT_CONFIG.viz_button,
      selectConfig[selectedVizName],
    );
    let selectedIndicatorPadding =
      selectConfig[selectedVizName].indicator.padding;

    // Normalize the previous scalar padding once at the configuration boundary.
    if (typeof selectedIndicatorPadding === "number") {
      selectConfig[selectedVizName].indicator.padding = {
        x: selectedIndicatorPadding,
        y: selectedIndicatorPadding,
      };
    }
    selectedIndicatorPadding = selectConfig[selectedVizName].indicator.padding;
    if (typeof selectedIndicatorPadding.y === "number") {
      selectedIndicatorPadding.y = {
        top: selectedIndicatorPadding.y,
        bottom: selectedIndicatorPadding.y,
      };
    }
    // Match the visible outer inset unless YAML explicitly overrides separator x.
    selectConfig.separator.padding = Merge.mergeDeep(
      selectConfig.separator.padding,
      { x: selectConfig.track.padding.x + selectedIndicatorPadding.x },
      config.separator?.padding ?? {},
    );

    // Content accepts the existing symmetric y shorthand or independent top
    // and bottom padding. Normalize both content modes once at construction.
    ["content_vertical", "content_horizontal"].forEach((contentMode) => {
      const contentPadding = selectConfig.content[contentMode].padding;

      if (typeof contentPadding.y === "number") {
        contentPadding.y = {
          top: contentPadding.y,
          bottom: contentPadding.y,
        };
      }
    });

    selectConfig.option_map = usesEntityOptions
      ? []
      : ControlSelect.normalizeOptionMap(
          selectConfig.option_map,
          selectConfig,
        );

    super(selectConfig, index, templates, cardId, card);

    this.usesEntityOptions = usesEntityOptions;
    this.optionsInitialized = !usesEntityOptions;
    this.entityOptionsSignature = undefined;
    this.controlHassAvailable = false;
    this.controlConnected = false;
    this.config.svg = this.calculateSvgDimensions();
    this.selectedOptionIndex = -1;
    this.optionTextTools = [];
    this.optionIconTools = [];
    this.optionContentVisuals = [];
    this.optionActionConfigs = this.optionsInitialized
      ? this.config.option_map.map((option) =>
          ControlSelect.buildOptionActionConfig(option),
        )
      : [];
    if (this.optionsInitialized) this.createOptionContentTools();
    this.createControlLabelTextTool(this.config.width, this.config.height);
  }

  /** Creates normal TextTool and IconTool instances at each segment center. */
  createOptionContentTools() {
    this.optionContentVisuals.forEach((contentVisual) =>
      contentVisual.disconnected(),
    );
    this.optionContentVisuals = [];
    this.optionTextBaseStyles = [];
    this.optionIconBaseStyles = [];
    const optionCount = this.config.option_map.length;
    const horizontalControl = this.config.orientation === "horizontal";
    const verticalContent = this.config.content.mode === "content_vertical";
    const trackWidth = this.config.width - this.config.track.padding.x * 2;
    const trackHeight = this.config.height - this.config.track.padding.y * 2;
    const segmentWidth = horizontalControl
      ? trackWidth / optionCount
      : trackWidth;
    const segmentHeight = horizontalControl
      ? trackHeight
      : trackHeight / optionCount;
    const trackStartX = this.config.xpos - trackWidth / 2;
    const trackStartY = this.config.ypos - trackHeight / 2;
    const contentConfig = this.config.content[this.config.content.mode];
    const viz = this.config[this.config.show.item_viz];
    const contentPaddingTop = contentConfig.padding.y.top;
    const contentPaddingBottom = contentConfig.padding.y.bottom;
    const indicatorPaddingTop = viz.indicator.padding.y.top;
    const indicatorPaddingBottom = viz.indicator.padding.y.bottom;
    let contentWidth;
    let contentHeight;
    let contentOffsetY = 0;

    // A filled indicator contains the content. A top or bottom line reserves
    // only its own thickness and vertical padding on that side.
    switch (viz.indicator.position) {
      case "fill":
        contentWidth = segmentWidth - contentConfig.padding.x * 2;
        contentHeight =
          segmentHeight - contentPaddingTop - contentPaddingBottom;
        break;
      case "top":
        contentWidth = segmentWidth - contentConfig.padding.x * 2;
        contentHeight =
          segmentHeight -
          viz.indicator.thickness -
          indicatorPaddingTop -
          contentPaddingTop -
          contentPaddingBottom;
        contentOffsetY = (viz.indicator.thickness + indicatorPaddingTop) / 2;
        break;
      case "bottom":
        contentWidth = segmentWidth - contentConfig.padding.x * 2;
        contentHeight =
          segmentHeight -
          viz.indicator.thickness -
          indicatorPaddingBottom -
          contentPaddingTop -
          contentPaddingBottom;
        contentOffsetY =
          -(viz.indicator.thickness + indicatorPaddingBottom) / 2;
        break;
      default:
        throw Error(
          `[controls] Invalid select indicator position '${viz.indicator.position}' [fill, top, bottom]`,
        );
    }
    contentOffsetY += (contentPaddingTop - contentPaddingBottom) / 2;

    // Each segment owns one content parent. Selection still belongs to the
    // select entity, while option.entity_index becomes the inherited visual
    // entity for every child in this one segment.
    if (contentConfig.items !== undefined) {
      this.optionTextTools = [];
      this.optionIconTools = [];
      const stackHeight =
        contentHeight + contentPaddingTop + contentPaddingBottom;

      this.optionContentVisuals = this.config.option_map.map(
        (option, optionIndex) => {
          const centerX = horizontalControl
            ? trackStartX + segmentWidth * (optionIndex + 0.5)
            : this.config.xpos;
          const centerY = horizontalControl
            ? this.config.ypos + contentOffsetY
            : trackStartY +
              segmentHeight * (optionIndex + 0.5) +
              contentOffsetY;

          return new ControlContent(
            contentConfig,
            verticalContent ? "vertical" : "horizontal",
            {
              xpos: centerX,
              ypos: centerY,
              width: segmentWidth,
              height: stackHeight,
              group: this.config.group,
            },
            option.content,
            option.entity_index,
            `${this.id}-option-${optionIndex}-content`,
            this.templates,
            this.cardId,
            this.card,
          );
        },
      );
      return;
    }

    const optionIconSize =
      (Math.min(contentWidth, contentHeight) * contentConfig.icon.size) / 100;
    const textMaximumWidth = verticalContent
      ? contentWidth
      : contentWidth - optionIconSize - contentConfig.gap;

    this.optionTextTools = this.config.option_map.map((option, optionIndex) => {
      const centerX = horizontalControl
        ? trackStartX + segmentWidth * (optionIndex + 0.5)
        : this.config.xpos;
      const centerY = horizontalControl
        ? this.config.ypos + contentOffsetY
        : trackStartY + segmentHeight * (optionIndex + 0.5) + contentOffsetY;
      const hasIcon = option.icon !== undefined;
      const textXpos =
        hasIcon && !verticalContent
          ? centerX + (optionIconSize + contentConfig.gap) / 2
          : centerX;
      const textYpos =
        hasIcon && verticalContent
          ? centerY + (optionIconSize + contentConfig.gap) / 2
          : centerY;
      const textConfig = Merge.mergeDeep(
        {
          id: `${this.id}-option-${optionIndex}-text`,
          group: this.config.group,
          entity_index: this.entity_index,
          xpos: textXpos,
          yposc: textYpos,
          text: option.text,
          text_overflow: {
            mode: "fit",
            fit: { max_width: hasIcon ? textMaximumWidth : contentWidth },
          },
          tap_action: { action: "none" },
          styles: {
            "text-anchor": "middle",
            "dominant-baseline": "central",
            "pointer-events": "none",
          },
        },
        contentConfig.text,
        option.text_config,
        { tap_action: { action: "none" } },
      );

      this.optionTextBaseStyles[optionIndex] = textConfig.styles;
      return new TextTool(
        textConfig,
        optionIndex,
        this.templates,
        this.cardId,
        this.card,
      );
    });

    this.optionIconTools = this.config.option_map.map((option, optionIndex) => {
      if (option.icon === undefined) return undefined;

      const optionIconConfig =
        typeof option.icon === "string" ? { icon: option.icon } : option.icon;

      const centerX = horizontalControl
        ? trackStartX + segmentWidth * (optionIndex + 0.5)
        : this.config.xpos;
      const centerY = horizontalControl
        ? this.config.ypos + contentOffsetY
        : trackStartY + segmentHeight * (optionIndex + 0.5) + contentOffsetY;
      const iconXpos = verticalContent
        ? centerX
        : centerX - (textMaximumWidth + contentConfig.gap) / 2;
      const iconYpos = verticalContent
        ? centerY - (optionIconSize + contentConfig.gap) / 2
        : centerY;
      const iconConfig = Merge.mergeDeep(
        {
          id: `${this.id}-option-${optionIndex}-icon`,
          group: this.config.group,
          entity_index: this.entity_index,
          xpos: iconXpos,
          yposc: iconYpos,
          icon_size_percent: optionIconSize,
          tap_action: { action: "none" },
          styles: { "pointer-events": "none" },
        },
        contentConfig.icon,
        optionIconConfig,
        option.icon_config,
        { tap_action: { action: "none" } },
      );

      delete iconConfig.size;
      this.optionIconBaseStyles[optionIndex] = iconConfig.styles;
      return new IconTool(
        iconConfig,
        optionIndex,
        this.templates,
        this.cardId,
        this.card,
      );
    });
  }

  /** Updates evaluated select config, geometry and child tool configuration. */
  updateRuntimeConfig() {
    super.updateRuntimeConfig();
    let contentRebuilt = false;

    if (this.configChanged) {
      this.config.svg = this.calculateSvgDimensions(this.config);
      if (this.optionsInitialized) {
        this.createOptionContentTools();
        contentRebuilt = true;
      }
      this.createControlLabelTextTool(this.config.width, this.config.height);
    }

    this.optionContentVisuals.forEach((contentVisual) =>
      contentVisual.updateRuntimeConfig(),
    );
    this.optionTextTools.forEach((textTool) => textTool.updateRuntimeConfig());
    this.optionIconTools
      .filter((iconTool) => iconTool !== undefined)
      .forEach((iconTool) => iconTool.updateRuntimeConfig());

    // Rebuilt segment visuals join the lifecycle phase already reached by their
    // parent select instead of waiting for a card reconnect.
    if (contentRebuilt && this.controlHassAvailable) {
      this.optionContentVisuals.forEach((contentVisual) =>
        contentVisual.hassAvailable(),
      );
    }
    if (contentRebuilt && this.controlConnected) {
      this.optionContentVisuals.forEach((contentVisual) =>
        contentVisual.connected(),
      );
    }
  }

  /** Selects the active option and publishes state plus visual styles. */
  setState(entity, entityConfig) {
    super.setState(entity, entityConfig);

    // Entity-driven selects publish their segment definitions through the same
    // attributes.options contract as Home Assistant select entities.
    if (this.usesEntityOptions) {
      if (
        !Array.isArray(entity.attributes.options) ||
        entity.attributes.options.length === 0
      ) {
        throw Error(
          `[controls] Select '${this.id}' requires option_map or entity.attributes.options`,
        );
      }

      const entityOptionsSignature = JSON.stringify(entity.attributes.options);
      if (entityOptionsSignature !== this.entityOptionsSignature) {
        const entityOptionMap = entity.attributes.options.map((option) => ({
          value: option,
        }));
        this.config.option_map = ControlSelect.normalizeOptionMap(
          entityOptionMap,
          this.config,
        );
        this.entityOptionsSignature = entityOptionsSignature;
        this.optionsInitialized = true;
        this.createOptionContentTools();
        this.optionContentVisuals.forEach((contentVisual) =>
          contentVisual.updateRuntimeConfig(),
        );
        this.optionTextTools.forEach((textTool) =>
          textTool.updateRuntimeConfig(),
        );
        this.optionIconTools
          .filter((iconTool) => iconTool !== undefined)
          .forEach((iconTool) => iconTool.updateRuntimeConfig());
        if (this.controlHassAvailable) {
          this.optionContentVisuals.forEach((contentVisual) =>
            contentVisual.hassAvailable(),
          );
        }
        if (this.controlConnected) {
          this.optionContentVisuals.forEach((contentVisual) =>
            contentVisual.connected(),
          );
        }
      }
    }

    const selectedState =
      entityConfig.attribute === undefined
        ? entity.state
        : entity.attributes[entityConfig.attribute];
    this.selectedOptionIndex = this.config.option_map.findIndex(
      (option) => String(option.state) === String(selectedState),
    );
    const viz = this.config[this.config.show.item_viz];
    const transition = `${viz.animation.duration}ms ${viz.animation.easing}`;

    this.optionActionConfigs = this.config.option_map.map((option) =>
      ControlSelect.buildOptionActionConfig(option),
    );
    this.optionContentVisuals.forEach((contentVisual, optionIndex) => {
      const optionStyle =
        optionIndex === this.selectedOptionIndex
          ? viz.selected
          : viz.unselected;
      contentVisual.setState(optionStyle, transition);
    });

    this.optionTextTools.forEach((textTool, optionIndex) => {
      const optionStyle =
        optionIndex === this.selectedOptionIndex
          ? viz.selected
          : viz.unselected;

      textTool.config.styles = Merge.mergeDeep(
        ConfigHelper.toStyleDict(optionStyle.text.styles),
        ConfigHelper.toStyleDict(this.optionTextBaseStyles[optionIndex]),
        {
          transition: `fill ${transition}, color ${transition}, opacity ${transition}`,
        },
      );
      textTool.setState(entity, entityConfig);
    });

    this.optionIconTools.forEach((iconTool, optionIndex) => {
      if (iconTool === undefined) return;

      const optionStyle =
        optionIndex === this.selectedOptionIndex
          ? viz.selected
          : viz.unselected;
      iconTool.config.styles = Merge.mergeDeep(
        ConfigHelper.toStyleDict(optionStyle.icon.styles),
        ConfigHelper.toStyleDict(this.optionIconBaseStyles[optionIndex]),
        {
          transition: `fill ${transition}, color ${transition}, opacity ${transition}`,
        },
      );
      this.card.cardTools.setToolEntityState(
        iconTool,
        this.card.resolvedEntityConfigs,
        this.card.entities,
      );
    });
  }

  /** Runs child TextTool and IconTool post-render lifecycle hooks. */
  updated() {
    super.updated();
    this.optionContentVisuals.forEach((contentVisual) =>
      contentVisual.updated(),
    );
    this.optionTextTools.forEach((textTool) => textTool.updated());
    this.optionIconTools
      .filter((iconTool) => iconTool !== undefined)
      .forEach((iconTool) => iconTool.updated());
  }

  /** Forwards first-render work to segment visual content. */
  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    this.optionContentVisuals.forEach((contentVisual) =>
      contentVisual.firstUpdated(changedProperties),
    );
  }

  /** Forwards initial Home Assistant availability to segment visual content. */
  hassAvailable() {
    super.hassAvailable();
    this.controlHassAvailable = true;
    this.optionContentVisuals.forEach((contentVisual) =>
      contentVisual.hassAvailable(),
    );
  }

  /** Forwards DOM connection to segment visual content. */
  connected() {
    super.connected();
    this.controlConnected = true;
    this.optionContentVisuals.forEach((contentVisual) =>
      contentVisual.connected(),
    );
  }

  /** Stops timers and listeners owned by segment visual content. */
  disconnected() {
    this.optionContentVisuals.forEach((contentVisual) =>
      contentVisual.disconnected(),
    );
    this.controlConnected = false;
    super.disconnected();
  }

  /** Forwards Home Assistant reconnects to segment visual content. */
  hassConnected() {
    super.hassConnected();
    this.optionContentVisuals.forEach((contentVisual) =>
      contentVisual.hassConnected(),
    );
  }

  /** Includes segment visual children in the card's update decision. */
  requiresHassUpdate() {
    return (
      super.requiresHassUpdate() ||
      this.optionContentVisuals.some((contentVisual) =>
        contentVisual.requiresHassUpdate(),
      )
    );
  }

  /** Converts the select center through the normal group pipeline. */
  calculateSvgDimensions(config = this.config) {
    return this.card.cardLayout.calculateSvgCoordinatesInGroup(config);
  }

  /** Runs one immediate press animation around the center of the selected segment. */
  animateOptionPress(optionGroup, centerX, centerY) {
    const press = this.config[this.config.show.item_viz].press;
    const restingTransform = `translate(${centerX}px, ${centerY}px) scale(1) translate(-${centerX}px, -${centerY}px)`;
    const pressedTransform = `translate(${centerX}px, ${centerY}px) scale(${press.scale}) translate(-${centerX}px, -${centerY}px)`;

    optionGroup.getAnimations().forEach((animation) => animation.cancel());
    optionGroup.animate(
      [
        { transform: restingTransform },
        { transform: pressedTransform },
        { transform: restingTransform },
      ],
      {
        duration: press.duration,
        easing: press.easing,
      },
    );
  }

  /** Renders background, segments, moving indicator, content and hit areas. */
  render() {
    if (!this.optionsInitialized) return this.renderControl(svg``);

    const viz = this.config[this.config.show.item_viz];
    const horizontal = this.config.orientation === "horizontal";
    const optionCount = this.config.option_map.length;
    const backgroundWidth = Utils.calculateSvgDimension(this.config.width);
    const backgroundHeight = Utils.calculateSvgDimension(this.config.height);
    const trackWidth = Utils.calculateSvgDimension(
      this.config.width - this.config.track.padding.x * 2,
    );
    const trackHeight = Utils.calculateSvgDimension(
      this.config.height - this.config.track.padding.y * 2,
    );
    const segmentWidth = horizontal ? trackWidth / optionCount : trackWidth;
    const segmentHeight = horizontal ? trackHeight : trackHeight / optionCount;
    const trackX = this.config.svg.xpos - trackWidth / 2;
    const trackY = this.config.svg.ypos - trackHeight / 2;
    const indicatorPaddingX = Utils.calculateSvgDimension(
      viz.indicator.padding.x,
    );
    const indicatorPaddingTop = Utils.calculateSvgDimension(
      viz.indicator.padding.y.top,
    );
    const indicatorPaddingBottom = Utils.calculateSvgDimension(
      viz.indicator.padding.y.bottom,
    );
    const separatorPaddingX = Utils.calculateSvgDimension(
      this.config.separator.padding.x,
    );
    const separatorStrokeWidth = Utils.calculateSvgDimension(
      this.config.separator.styles["stroke-width"],
    );

    // A separator is centered on the segment boundary. Add half its stroke to
    // internal indicator sides so their visible gap equals the outer x inset.
    const indicatorLeftPadding =
      horizontal && this.selectedOptionIndex > 0
        ? separatorPaddingX + separatorStrokeWidth / 2
        : indicatorPaddingX;
    const indicatorRightPadding =
      horizontal && this.selectedOptionIndex < optionCount - 1
        ? separatorPaddingX + separatorStrokeWidth / 2
        : indicatorPaddingX;

    const indicatorThickness = Utils.calculateSvgDimension(
      viz.indicator.thickness,
    );
    const indicatorX = trackX + indicatorLeftPadding;
    let indicatorY;
    const indicatorWidth =
      segmentWidth - indicatorLeftPadding - indicatorRightPadding;
    let indicatorHeight;

    // Indicator geometry is entirely selected by the active visualization preset.
    switch (viz.indicator.position) {
      case "fill":
        indicatorY = trackY + indicatorPaddingTop;
        indicatorHeight =
          segmentHeight - indicatorPaddingTop - indicatorPaddingBottom;
        break;
      case "top":
        indicatorY = trackY + indicatorPaddingTop;
        indicatorHeight = indicatorThickness;
        break;
      case "bottom":
        indicatorY =
          trackY + segmentHeight - indicatorPaddingBottom - indicatorThickness;
        indicatorHeight = indicatorThickness;
        break;
      default:
        throw Error(
          `[controls] Invalid select indicator position '${viz.indicator.position}' [fill, top, bottom]`,
        );
    }

    // The first and last button corners run concentrically with the outer
    // background. Separate x/y radii account for the indicator inset.
    const backgroundX = this.config.svg.xpos - backgroundWidth / 2;
    const backgroundY = this.config.svg.ypos - backgroundHeight / 2;
    const indicatorRadius = Utils.calculateSvgDimension(viz.indicator.radius);
    const backgroundRadius = Math.min(
      Utils.calculateSvgDimension(this.config.background.radius),
      backgroundWidth / 2,
      backgroundHeight / 2,
    );
    const edgeRadius = Math.min(
      backgroundRadius -
        Math.max(
          trackX + indicatorPaddingX - backgroundX,
          indicatorY - backgroundY,
        ),
      indicatorWidth / 2,
      indicatorHeight / 2,
    );
    let topLeftRadiusX = indicatorRadius;
    let topLeftRadiusY = indicatorRadius;
    let topRightRadiusX = indicatorRadius;
    let topRightRadiusY = indicatorRadius;
    let bottomRightRadiusX = indicatorRadius;
    let bottomRightRadiusY = indicatorRadius;
    let bottomLeftRadiusX = indicatorRadius;
    let bottomLeftRadiusY = indicatorRadius;

    if (this.config.show.item_viz === "viz_button") {
      if (horizontal) {
        if (this.selectedOptionIndex === 0) {
          topLeftRadiusX = edgeRadius;
          topLeftRadiusY = edgeRadius;
          bottomLeftRadiusX = edgeRadius;
          bottomLeftRadiusY = edgeRadius;
        }
        if (this.selectedOptionIndex === optionCount - 1) {
          topRightRadiusX = edgeRadius;
          topRightRadiusY = edgeRadius;
          bottomRightRadiusX = edgeRadius;
          bottomRightRadiusY = edgeRadius;
        }
      } else {
        if (this.selectedOptionIndex === 0) {
          topLeftRadiusX = edgeRadius;
          topLeftRadiusY = edgeRadius;
          topRightRadiusX = edgeRadius;
          topRightRadiusY = edgeRadius;
        }
        if (this.selectedOptionIndex === optionCount - 1) {
          bottomLeftRadiusX = edgeRadius;
          bottomLeftRadiusY = edgeRadius;
          bottomRightRadiusX = edgeRadius;
          bottomRightRadiusY = edgeRadius;
        }
      }
    }

    const indicatorPath = `
      M ${indicatorX + topLeftRadiusX} ${indicatorY}
      H ${indicatorX + indicatorWidth - topRightRadiusX}
      A ${topRightRadiusX} ${topRightRadiusY} 0 0 1 ${indicatorX + indicatorWidth} ${indicatorY + topRightRadiusY}
      V ${indicatorY + indicatorHeight - bottomRightRadiusY}
      A ${bottomRightRadiusX} ${bottomRightRadiusY} 0 0 1 ${indicatorX + indicatorWidth - bottomRightRadiusX} ${indicatorY + indicatorHeight}
      H ${indicatorX + bottomLeftRadiusX}
      A ${bottomLeftRadiusX} ${bottomLeftRadiusY} 0 0 1 ${indicatorX} ${indicatorY + indicatorHeight - bottomLeftRadiusY}
      V ${indicatorY + topLeftRadiusY}
      A ${topLeftRadiusX} ${topLeftRadiusY} 0 0 1 ${indicatorX + topLeftRadiusX} ${indicatorY}
      Z
    `;
    const indicatorTranslateX =
      horizontal && this.selectedOptionIndex >= 0
        ? this.selectedOptionIndex * segmentWidth
        : 0;
    const indicatorTranslateY =
      !horizontal && this.selectedOptionIndex >= 0
        ? this.selectedOptionIndex * segmentHeight
        : 0;
    const transition = `${viz.animation.duration}ms ${viz.animation.easing}`;
    const backgroundStyles = this.getStyles(
      Merge.mergeDeep(
        ConfigHelper.toStyleDict(this.config.background.styles),
        ConfigHelper.toStyleDict(viz.background.styles),
      ),
    );
    const trackStyles = this.getStyles(
      Merge.mergeDeep(
        ConfigHelper.toStyleDict(this.config.track.styles),
        ConfigHelper.toStyleDict(viz.track.styles),
      ),
    );
    const indicatorStyles = this.getStyles(
      Merge.mergeDeep(ConfigHelper.toStyleDict(viz.indicator.styles), {
        transition: `fill ${transition}, stroke ${transition}, opacity ${transition}`,
      }),
    );
    const separatorPaddingY = Utils.calculateSvgDimension(
      this.config.separator.padding.y,
    );
    const separatorStyles = this.getStyles(
      Merge.mergeDeep(ConfigHelper.toStyleDict(this.config.separator.styles), {
        "pointer-events": "none",
      }),
    );
    const indicatorPositionStyles = {
      transform: `translate(${indicatorTranslateX}px, ${indicatorTranslateY}px)`,
      transition: `transform ${transition}`,
      "pointer-events": "none",
      visibility: this.selectedOptionIndex === -1 ? "hidden" : "visible",
    };

    const select = svg`
      <g
        class="select-control"
        transform="${this.getGroupScaleTransform()}"
        style="${this.getGroupScaleStyle()}"
      >
        <rect
          class="select-control__background"
          x="${backgroundX}"
          y="${backgroundY}"
          width="${backgroundWidth}"
          height="${backgroundHeight}"
          rx="${Utils.calculateSvgDimension(this.config.background.radius)}"
          style=${styleMap(backgroundStyles)}
        />
        <rect
          class="select-control__track"
          x="${trackX}"
          y="${trackY}"
          width="${trackWidth}"
          height="${trackHeight}"
          style=${styleMap(trackStyles)}
        />
        ${this.config.option_map.map((option, optionIndex) => {
          const optionStyle =
            optionIndex === this.selectedOptionIndex
              ? viz.selected
              : viz.unselected;

          return svg`
            <rect
              class="select-control__option-background"
              x="${trackX + (horizontal ? optionIndex * segmentWidth : 0)}"
              y="${trackY + (horizontal ? 0 : optionIndex * segmentHeight)}"
              width="${segmentWidth}"
              height="${segmentHeight}"
              style=${styleMap(this.getStyles(Merge.mergeDeep(ConfigHelper.toStyleDict(optionStyle.background.styles), { transition: `fill ${transition}, stroke ${transition}, opacity ${transition}` })))}
            />
          `;
        })}
        <g
          class="select-control__indicator-position"
          style=${styleMap(indicatorPositionStyles)}
        >
          <path
            class="select-control__indicator"
            d="${indicatorPath}"
            style=${styleMap(indicatorStyles)}
          />
        </g>
        ${
          this.config.show.separator
            ? [...this.config.option_map.keys()].slice(1).map((optionIndex) =>
                horizontal
                  ? svg`
            <line
              class="select-control__separator"
              x1="${trackX + optionIndex * segmentWidth}"
              y1="${trackY + separatorPaddingY}"
              x2="${trackX + optionIndex * segmentWidth}"
              y2="${trackY + trackHeight - separatorPaddingY}"
              style=${styleMap(separatorStyles)}
            />
          `
                  : svg`
            <line
              class="select-control__separator"
              x1="${trackX + separatorPaddingX}"
              y1="${trackY + optionIndex * segmentHeight}"
              x2="${trackX + trackWidth - separatorPaddingX}"
              y2="${trackY + optionIndex * segmentHeight}"
              style=${styleMap(separatorStyles)}
            />
          `,
              )
            : svg``
        }
      </g>
    `;

    const optionContent = this.config.option_map.map(
      (option, optionIndex) => svg`
      <g class="select-control__option-content">
        ${this.optionIconTools[optionIndex]?.render()}
        ${this.optionContentVisuals[optionIndex]?.render()}
        ${this.optionTextTools[optionIndex]?.render()}
        <rect
          class="select-control__hit-area"
          x="${trackX + (horizontal ? optionIndex * segmentWidth : 0)}"
          y="${trackY + (horizontal ? 0 : optionIndex * segmentHeight)}"
          width="${segmentWidth}"
          height="${segmentHeight}"
          fill="transparent"
          style="outline: none;"
          tabindex="0"
          role="button"
          ${this.controlActionHandler(this.optionActionConfigs[optionIndex], this.entity_index)}
          @pointerdown=${(event) =>
            this.animateOptionPress(
              event.currentTarget.parentElement,
              trackX +
                (horizontal ? optionIndex * segmentWidth : 0) +
                segmentWidth / 2,
              trackY +
                (horizontal ? 0 : optionIndex * segmentHeight) +
                segmentHeight / 2,
            )}
          @action=${(event) => this.handleControlAction(event, this.optionActionConfigs[optionIndex], this.entity_index)}
        />
      </g>
    `,
    );

    return this.renderControl(svg`${select}${optionContent}`);
  }
}
