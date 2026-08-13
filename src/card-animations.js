import ConfigHelper from './config-helper.js';

/** Owns evaluated animation styles and state-trigger matching. */
export default class CardAnimations {
  /**
   * Creates stable style maps per renderable section so matching state
   * animations can update entries without replacing domain references.
   */
  constructor() {
    this.styles = {
      lines: {}, vlines: {}, hlines: {}, circles: {}, arcs: {}, rectangles: {},
      icons: {}, iconsIcon: {}, names: {}, areas: {}, states: {}, texts: {}, controls: {},
    };
  }

  /** Evaluates matching animation items after configured entity state changes. */
  update(config, entities, templates, configuredEntityStateChanged) {
    if (!configuredEntityStateChanged || !config.animations) return;

    Object.keys(config.animations).forEach((animation) => {
      const entityIndex = animation.substr(Number(animation.indexOf('.') + 1));
      config.animations[animation].forEach((sourceAnimationItem) => {
        const animationContext = { ...sourceAnimationItem, entity_index: entityIndex };
        const item = templates.hasJavascriptTemplates(sourceAnimationItem)
          ? templates.getJsTemplateOrValue(animationContext, sourceAnimationItem)
          : sourceAnimationItem;
        if (entities[entityIndex].state.toLowerCase() !== item.state.toLowerCase()) return;

        ['lines', 'vlines', 'hlines', 'circles', 'arcs', 'rectangles', 'names', 'areas', 'states', 'texts', 'controls'].forEach((section) => {
          if (!item[section]) return;
          item[section].forEach((animationItem) => {
            const animationId = animationItem.animation_id;
            if (animationId === undefined || animationId === null) return;
            this.styles[section][animationId] = {
              ...(animationItem.reuse ? (this.styles[section][animationId] ?? {}) : {}),
              ...ConfigHelper.toStyleDict(animationItem.styles),
            };
          });
        });

        if (item.icons) {
          item.icons.forEach((animationItem) => {
            const animationId = animationItem.animation_id;
            if (!this.styles.icons[animationId] || !animationItem.reuse) {
              this.styles.icons[animationId] = {};
              this.styles.iconsIcon[animationId] = {};
            }
            this.styles.icons[animationId] = {
              ...this.styles.icons[animationId],
              ...ConfigHelper.toStyleDict(animationItem.styles),
            };
            this.styles.iconsIcon[animationId] = animationItem.icon;
          });
        }
      });
    });
  }
}
