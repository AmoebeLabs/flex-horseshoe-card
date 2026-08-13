import { svg } from 'lit';
import GroupManager from './group-manager.js';
import MasksClips from './masks-clips.js';
import Utils from './utils.js';
import { SVG_VIEW_BOX, SVG_DEFAULT_DIMENSIONS } from './const.js';

/** Owns card geometry, runtime groups, the viewBox, and reusable SVG definitions. */
export default class CardLayout {
  /**
   * Creates card geometry state and reusable SVG definition managers that share
   * the card's template evaluator and id namespace.
   */
  constructor(templates, cardId) {
    this.templates = templates;
    this.cardId = cardId;
    this.viewBox = { width: SVG_VIEW_BOX, height: SVG_VIEW_BOX };
    this.sourceGroupConfigs = [];
    this.activeGroupConfigs = [];
    this.activeGroupSignatures = {};
    this.groupsHaveJavascript = false;
    this.changedGroupIds = new Set();
  }

  /** Initializes groups, SVG definitions, aspect ratio, and static dimensions. */
  setConfig(config, horseshoes) {
    config.layout.groups ??= [];
    config.layout.gradients ??= {};
    config.layout.clips ??= {};
    config.layout.masks ??= {};

    this.sourceGroupConfigs = config.layout.groups;
    this.activeGroupConfigs = this.sourceGroupConfigs;
    this.activeGroupSignatures = {};
    this.groupsHaveJavascript = this.sourceGroupConfigs.some((group) => this.templates.hasJavascriptTemplates(group));
    this.changedGroupIds.clear();
    this.groupManager = new GroupManager(this.activeGroupConfigs);
    this.masksClips = new MasksClips(config, this.cardId, this);

    // Card-level aspectratio remains valid, while layout.aspectratio takes precedence.
    this.aspectratio = (config.layout.aspectratio || config.aspectratio || '1/1').trim();
    const aspectRatioParts = this.aspectratio.split('/');
    this.viewBox.width = aspectRatioParts[0] * SVG_DEFAULT_DIMENSIONS;
    this.viewBox.height = aspectRatioParts[1] * SVG_DEFAULT_DIMENSIONS;

    if (config.layout.icons) {
      config.layout.icons.forEach((item) => {
        item.svg = this.calculateSvgCoordinatesInGroup(item);
      });
    }

    if (horseshoes) {
      horseshoes.forEach((item) => {
        item.svg = this.calculateSvgCoordinatesInGroup(item);
        item.svg.radius = Utils.calculateSvgDimension(item.radius);
        item.svg.tickmarksRadius = Utils.calculateSvgDimension(item.tickmarks_radius);
        item.svg.rotateX = item.svg.xpos;
        item.svg.rotateY = item.svg.ypos;
      });
    }
  }

  /** Evaluates dynamic groups and records every descendant affected by a change. */
  updateGroups(configuredEntityStateChanged) {
    this.changedGroupIds.clear();
    if (!configuredEntityStateChanged || !this.groupsHaveJavascript) return;

    const nextActiveGroupConfigs = [...this.activeGroupConfigs];
    const directlyChangedGroupIds = new Set();

    this.sourceGroupConfigs.forEach((sourceGroupConfig, groupIndex) => {
      if (!this.templates.hasJavascriptTemplates(sourceGroupConfig)) return;

      const groupId = String(sourceGroupConfig.id);
      const activeGroupConfig = this.templates.getJsTemplateOrValue(sourceGroupConfig, sourceGroupConfig, { resolveKeys: true });
      const activeGroupSignature = JSON.stringify(activeGroupConfig);
      nextActiveGroupConfigs[groupIndex] = activeGroupConfig;
      if (activeGroupSignature !== this.activeGroupSignatures[groupId]) {
        this.activeGroupSignatures[groupId] = activeGroupSignature;
        directlyChangedGroupIds.add(groupId);
      }
    });

    if (directlyChangedGroupIds.size === 0) return;

    this.activeGroupConfigs = nextActiveGroupConfigs;
    this.groupManager = new GroupManager(this.activeGroupConfigs);

    // A changed parent changes the effective position, visibility, and scale of all descendants.
    Object.keys(this.groupManager.groups).forEach((groupId) => {
      let currentGroupId = groupId;
      while (currentGroupId) {
        if (directlyChangedGroupIds.has(currentGroupId)) {
          this.changedGroupIds.add(groupId);
          break;
        }

        const currentGroup = this.groupManager.groups[currentGroupId];
        currentGroupId = currentGroupId === 'card' ? undefined : (currentGroup.parent ?? 'card');
      }
    });
  }

  /** Clears group invalidation after all tools have consumed it. */
  markGroupsHandled() {
    this.changedGroupIds.clear();
  }

  /** Converts item coordinates through its effective parent group. */
  calculateSvgCoordinatesInGroup(item) {
    return this.groupManager.calculateSvgCoordinatesInGroup(item);
  }

  /** Builds the scale and flip transform for a layout item. */
  getGroupScaleTransform(item) {
    return this.groupManager.getGroupScaleTransform(item);
  }

  /** Builds the transform-origin style for a scaled layout item. */
  getGroupScaleStyle(item) {
    return this.groupManager.getGroupScaleStyle(item);
  }

  /** Renders shared filters, gradients, masks, and clips inside the card SVG defs. */
  renderSvgDefs() {
    return svg`
      <defs>
        <filter id="fhs-inset-1" x="-50%" y="-50%" width="400%" height="400%">
          <feComponentTransfer in="SourceAlpha">
            <feFuncA type="table" tableValues="1 0"></feFuncA>
          </feComponentTransfer>
          <feGaussianBlur stdDeviation="1"></feGaussianBlur>
          <feOffset dx="0" dy="1" result="offsetblur"></feOffset>
          <feFlood flood-color="rgba(0, 0, 0, 0.3)" result="color"></feFlood>
          <feComposite in2="offsetblur" operator="in"></feComposite>
          <feComposite in2="SourceAlpha" operator="in"></feComposite>
          <feMerge>
            <feMergeNode in="SourceGraphic"></feMergeNode>
            <feMergeNode></feMergeNode>
          </feMerge>
        </filter>

        <filter id="fhs-inset-2">
          <feOffset dx="1" dy="1"></feOffset>
          <feGaussianBlur stdDeviation="0.5" result="offset-blur"></feGaussianBlur>
          <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse"></feComposite>
          <feFlood flood-color="black" flood-opacity="0.4" result="color"></feFlood>
          <feComposite operator="in" in="color" in2="inverse" result="shadow"></feComposite>
          <feComposite operator="over" in="shadow" in2="SourceGraphic"></feComposite>
        </filter>

        ${this.masksClips.renderDefs()}
      </defs>
    `;
  }
}
