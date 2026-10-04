import { svg } from "lit";
import { styleMap } from "lit/directives/style-map.js";
import ConfigHelper from "./config-helper.js";
import ControlBase from "./control-base.js";
import ControlContent from "./control-content.js";
import IconTool from "./icon-tool.js";
import Merge from "./merge.js";
import SameAs from "./same-as.js";
import TextTool from "./text-tool.js";
import Templates from "./templates.js";
import Utils from "./utils.js";

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

/** Segmented select control backed by an entity state or configured attribute. */
export default class ControlSelect extends ControlBase {
  /**
   * Removes disabled options before entity addresses are resolved.
   *
   * @param {object} config Raw select control configuration.
   * @param {object} templates Shared template evaluator.
   */
  static removeDisabledOptionConfigs(config, templates) {
    if (config.option_map === undefined || Templates.isJsTemplate(config.option_map)) return;

    const optionMap = config.option_map;
    config.option_map = optionMap.filter((option) => {
      if (option.disabled === undefined) return true;

      return !ConfigHelper.isDisabled(
        option,
        option.disabled,
        "controls.option_map",
        templates,
      );
    });

    // Filtering creates a new array; keep the marker so same_as can replace this option map.
    if (optionMap[SameAs.STATIC_REF_MARKER]) {
      Object.defineProperty(config.option_map, SameAs.STATIC_REF_MARKER, {
        value: true,
      });
    }
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

  /**
   * Completes the selected visualization and authored option definitions.
   * HA options remain runtime data and use the same normalizer when they arrive.
   */
  static translateConfig(config, forTemplateContext, usesEntityOptions) {
    const selectedConfig = Merge.mergeDeep(DEFAULT_SELECT_CONFIG, config);
    if (!forTemplateContext) {
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

    }
    const selectConfig = Merge.mergeDeep(
      DEFAULT_SELECT_CONFIG,
      SELECT_STYLE_PRESETS[selectedConfig.show.item_style],
      config,
    );
    const selectedVizName = selectConfig.show.item_viz;

    // A named visualization inherits the complete button visualization before
    // its own config overrides are applied. Render code consumes one final viz.
    // Whole-value JavaScript must reach evaluation as source, not as an object
    // built from the template string's characters during context completion.
    if (!forTemplateContext || !Templates.isJsTemplate(selectConfig[selectedVizName])) {
      selectConfig[selectedVizName] = Merge.mergeDeep(
        DEFAULT_SELECT_CONFIG.viz_button,
        selectConfig[selectedVizName],
      );
    }
    if (forTemplateContext) return selectConfig;

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

    return selectConfig;
  }

  /** Captures select source without interpreting dynamic options or selectors. */
  constructor(config, index, templates, cardId, card) {
    const usesEntityOptions = config.option_map === undefined;
    super(Merge.mergeDeep({
      orientation: DEFAULT_SELECT_CONFIG.orientation,
      show: DEFAULT_SELECT_CONFIG.show,
    }, config), index, templates, cardId, card,
      (value, forTemplateContext = false) => ControlSelect.translateConfig(value, forTemplateContext, usesEntityOptions));

    this.usesEntityOptions = usesEntityOptions;
    this.optionsInitialized = !this.hasJavascript && !usesEntityOptions;
    this.entityOptionsSignature = undefined;
    this.optionDisplayTextSignature = undefined;
    this.geometry = {};
    this.runtime.selectedIndex = -1;
    this.runtime.options = this.optionsInitialized ? this.config.option_map : [];
    this.runtime.optionDisplayTexts = this.runtime.options.map((option) => option.text ?? String(option.state));
    this.runtime.actionConfigs = this.runtime.options.map((option) => ControlSelect.buildOptionActionConfig(option));
    this.optionTextTools = [];
    this.optionIconTools = [];
    this.optionContentVisuals = [];
    if (!this.hasJavascript) {
      this.geometry.svg = this.calculateSvgDimensions();
      if (this.optionsInitialized) this.createOptionContentTools();
      this.createControlLabelTextTool(this.config.width, this.config.height);
    }
  }

  /** Creates normal TextTool and IconTool instances at each segment center. */
  createOptionContentTools() {
    this.getContentTools().forEach((tool) => tool.disconnected());
    this.optionContentVisuals = [];
    const optionCount = this.runtime.options.length;
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

      this.optionContentVisuals = this.runtime.options.map(
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
      this.activateContentTools();
      return;
    }

    const optionIconSize =
      (Math.min(contentWidth, contentHeight) * contentConfig.icon.size) / 100;
    const textMaximumWidth = verticalContent
      ? contentWidth
      : contentWidth - optionIconSize - contentConfig.gap;

    this.optionTextTools = this.runtime.options.map((option, optionIndex) => {
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
          entity_index: option.entity_index,
          xpos: textXpos,
          yposc: textYpos,
          text: this.runtime.optionDisplayTexts[optionIndex],
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

      return new TextTool(
        textConfig,
        optionIndex,
        this.templates,
        this.cardId,
        this.card,
      );
    });

    this.optionIconTools = this.runtime.options.map((option, optionIndex) => {
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
          entity_index: option.entity_index,
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
      return new IconTool(
        iconConfig,
        optionIndex,
        this.templates,
        this.cardId,
        this.card,
      );
    });
    this.activateContentTools();
  }

  /** Returns both stacked visuals and direct text/icon option content. */
  getContentTools() {
    return [...this.optionContentVisuals, ...this.optionTextTools, ...this.optionIconTools].filter((tool) => tool !== undefined);
  }

  /** Updates evaluated select config, geometry and child tool configuration. */
  updateRuntimeConfig() {
    super.updateRuntimeConfig();

    if (this.configurationChanged || this.groupChanged) {
      this.geometry.svg = this.calculateSvgDimensions(this.config);
      // Changed parent defaults invalidate HA-derived option inheritance once.
      // The next state pass rebuilds from HA options, even when that list is unchanged.
      if (this.configurationChanged && this.usesEntityOptions) this.entityOptionsSignature = undefined;
      if (this.configurationChanged && !this.usesEntityOptions) {
        this.runtime.options = this.config.option_map;
        this.runtime.optionDisplayTexts = this.runtime.options.map((option) => option.text ?? String(option.state));
        this.runtime.actionConfigs = this.runtime.options.map((option) => ControlSelect.buildOptionActionConfig(option));
        this.optionsInitialized = true;
      }
      if (this.optionsInitialized && (!this.usesEntityOptions || !this.configurationChanged)) {
        this.createOptionContentTools();
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
  }


  /** Selects the active option and publishes state plus visual styles. */
  setState(entity, entityConfig) {
    super.setState(entity, entityConfig);

    // Entity-driven selects publish their segment definitions through the same
    // attributes.options contract as Home Assistant select entities. Option and
    // display-label changes rebuild the segment children once in this lifecycle.
    let optionsChanged = false;

    if (this.usesEntityOptions) {
      if (!Array.isArray(entity.attributes.options) || entity.attributes.options.length === 0) {
        throw Error(
          "[controls] Select " + this.id + " requires option_map or entity.attributes.options",
        );
      }

      const entityOptionsSignature = JSON.stringify(entity.attributes.options);
      if (entityOptionsSignature !== this.entityOptionsSignature) {
        const entityOptionMap = entity.attributes.options.map((option) => ({
          value: option,
        }));
        this.runtime.options = ControlSelect.normalizeOptionMap(entityOptionMap, this.config);
        this.entityOptionsSignature = entityOptionsSignature;
        this.optionsInitialized = true;
        optionsChanged = true;
      }
    }

    const optionDisplayTexts = this.runtime.options.map((option) => {
      if (option.text !== undefined) return option.text;

      return entityConfig.attribute !== undefined
        ? this.card._hass.formatEntityAttributeValue(entity, entityConfig.attribute, option.state)
        : this.card._hass.formatEntityState(entity, option.state);
    });
    const optionDisplayTextSignature = JSON.stringify(optionDisplayTexts);

    if (optionDisplayTextSignature !== this.optionDisplayTextSignature) {
      this.runtime.optionDisplayTexts = optionDisplayTexts;
      this.optionDisplayTextSignature = optionDisplayTextSignature;
      optionsChanged = true;
    }

    if (optionsChanged) {
      this.createOptionContentTools();
      this.optionContentVisuals.forEach((contentVisual) => contentVisual.updateRuntimeConfig());
      this.optionTextTools.forEach((textTool) => textTool.updateRuntimeConfig());
      this.optionIconTools
        .filter((iconTool) => iconTool !== undefined)
        .forEach((iconTool) => iconTool.updateRuntimeConfig());
    }

    const selectedState =
      entityConfig.attribute === undefined
        ? entity.state
        : entity.attributes[entityConfig.attribute];
    this.runtime.selectedIndex = this.runtime.options.findIndex(
      (option) => String(option.state) === String(selectedState),
    );
    const viz = this.config[this.config.show.item_viz];
    const transition = `${viz.animation.duration}ms ${viz.animation.easing}`;

    if (optionsChanged) {
      this.runtime.actionConfigs = this.runtime.options.map((option) =>
        ControlSelect.buildOptionActionConfig(option),
      );
    }
    this.optionContentVisuals.forEach((contentVisual, optionIndex) => {
      const optionStyle =
        optionIndex === this.runtime.selectedIndex
          ? viz.selected
          : viz.unselected;
      contentVisual.setState(optionStyle, transition);
    });

    this.optionTextTools.forEach((textTool, optionIndex) => {
      const optionStyle =
        optionIndex === this.runtime.selectedIndex
          ? viz.selected
          : viz.unselected;

      textTool.setEffectiveStyles(Merge.mergeDeep(
        ConfigHelper.toStyleDict(optionStyle.text.styles),
        ConfigHelper.toStyleDict(textTool.config.styles),
        {
          transition: `fill ${transition}, color ${transition}, opacity ${transition}`,
        },
      ));
      // Text and icon children follow the same effective option/tool binding.
      textTool.setEntities(
        this.card.runtimeEntityConfigs, this.card.entities,
      );
    });

    this.optionIconTools.forEach((iconTool, optionIndex) => {
      if (iconTool === undefined) return;

      const optionStyle =
        optionIndex === this.runtime.selectedIndex
          ? viz.selected
          : viz.unselected;
      iconTool.setEffectiveStyles(Merge.mergeDeep(
        ConfigHelper.toStyleDict(optionStyle.icon.styles),
        ConfigHelper.toStyleDict(iconTool.config.styles),
        {
          transition: `fill ${transition}, color ${transition}, opacity ${transition}`,
        },
      ));
      iconTool.setEntities(
        this.card.runtimeEntityConfigs,
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
    if (this.hasJavascript && !this.runtimeConfigInitialized) return svg``;
    if (!this.optionsInitialized) return this.renderControl(svg``);

    const viz = this.config[this.config.show.item_viz];
    const horizontal = this.config.orientation === "horizontal";
    const optionCount = this.runtime.options.length;
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
    const trackX = this.geometry.svg.xpos - trackWidth / 2;
    const trackY = this.geometry.svg.ypos - trackHeight / 2;
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
    let indicatorLeftPadding =
      horizontal && this.runtime.selectedIndex > 0
        ? separatorPaddingX + separatorStrokeWidth / 2
        : indicatorPaddingX;
    let indicatorRightPadding =
      horizontal && this.runtime.selectedIndex < optionCount - 1
        ? separatorPaddingX + separatorStrokeWidth / 2
        : indicatorPaddingX;

    const indicatorThickness = Utils.calculateSvgDimension(
      viz.indicator.thickness,
    );
    let indicatorX = trackX + indicatorLeftPadding;
    let indicatorY;
    let indicatorWidth =
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

    // Outer indicator geometry follows the rounded background. Filled
    // indicators use corner radii; line indicators use the arc inset.
    const backgroundX = this.geometry.svg.xpos - backgroundWidth / 2;
    const backgroundY = this.geometry.svg.ypos - backgroundHeight / 2;
    const indicatorRadius = Utils.calculateSvgDimension(viz.indicator.radius);
    const backgroundRadius = Math.min(
      Utils.calculateSvgDimension(this.config.background.radius),
      backgroundWidth / 2,
      backgroundHeight / 2,
    );

    if (this.config.show.item_viz === "viz_line") {
      const selectedIndicatorY = indicatorY
        + (!horizontal && this.runtime.selectedIndex >= 0 ? this.runtime.selectedIndex * segmentHeight : 0);
      const roundedEdgeInset = Utils.calculateRoundedRectHorizontalInset(
        backgroundRadius,
        backgroundY,
        backgroundY + backgroundHeight,
        selectedIndicatorY,
        selectedIndicatorY + indicatorHeight,
      );
      const trackOuterInset = trackX - backgroundX;
      const roundedIndicatorPadding = Math.max(
        indicatorPaddingX,
        roundedEdgeInset + indicatorPaddingX - trackOuterInset,
      );

      if (!horizontal || this.runtime.selectedIndex === 0) {
        indicatorLeftPadding = Math.max(indicatorLeftPadding, roundedIndicatorPadding);
      }
      if (!horizontal || this.runtime.selectedIndex === optionCount - 1) {
        indicatorRightPadding = Math.max(indicatorRightPadding, roundedIndicatorPadding);
      }

      indicatorX = trackX + indicatorLeftPadding;
      indicatorWidth = segmentWidth - indicatorLeftPadding - indicatorRightPadding;
    }
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
        if (this.runtime.selectedIndex === 0) {
          topLeftRadiusX = edgeRadius;
          topLeftRadiusY = edgeRadius;
          bottomLeftRadiusX = edgeRadius;
          bottomLeftRadiusY = edgeRadius;
        }
        if (this.runtime.selectedIndex === optionCount - 1) {
          topRightRadiusX = edgeRadius;
          topRightRadiusY = edgeRadius;
          bottomRightRadiusX = edgeRadius;
          bottomRightRadiusY = edgeRadius;
        }
      } else {
        if (this.runtime.selectedIndex === 0) {
          topLeftRadiusX = edgeRadius;
          topLeftRadiusY = edgeRadius;
          topRightRadiusX = edgeRadius;
          topRightRadiusY = edgeRadius;
        }
        if (this.runtime.selectedIndex === optionCount - 1) {
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
      horizontal && this.runtime.selectedIndex >= 0
        ? this.runtime.selectedIndex * segmentWidth
        : 0;
    const indicatorTranslateY =
      !horizontal && this.runtime.selectedIndex >= 0
        ? this.runtime.selectedIndex * segmentHeight
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
      visibility: this.runtime.selectedIndex === -1 ? "hidden" : "visible",
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
        ${this.runtime.options.map((option, optionIndex) => {
          const optionStyle =
            optionIndex === this.runtime.selectedIndex
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
            ? [...this.runtime.options.keys()].slice(1).map((optionIndex) =>
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

    const optionContent = this.runtime.options.map(
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
          ${this.controlActionHandler(this.runtime.actionConfigs[optionIndex], this.entity_index)}
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
          @action=${(event) => this.handleControlAction(event, this.runtime.actionConfigs[optionIndex], this.entity_index)}
        />
      </g>
    `,
    );

    return this.renderControl(svg`${select}${optionContent}`);
  }
}
