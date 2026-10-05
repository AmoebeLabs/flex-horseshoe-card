import ConfigHelper from './config-helper.js';

/** Selects configured animation styles when an HA entity matches an animation state. */
export default class CardAnimations {
  /**
   * Keeps animation styles for each tool section. Tools read the selected
   * animation_id when combining their configured and animated styles.
   */
  constructor() {
    this.styles = {
      lines: {}, vlines: {}, hlines: {}, circles: {}, arcs: {}, rectangles: {}, polygons: {},
      icons: {}, iconsIcon: {}, names: {}, areas: {}, states: {}, texts: {}, controls: {},
    };
  }

  /** Selects animation styles from the final entity values before text measurement. */
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

        ['lines', 'vlines', 'hlines', 'circles', 'arcs', 'rectangles', 'polygons', 'names', 'areas', 'states', 'texts', 'controls'].forEach((section) => {
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
