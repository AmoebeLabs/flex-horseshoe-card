import { svg } from 'lit';
import GroupManager from './group-manager.js';
import MasksClips from './masks-clips.js';
import Utils from './utils.js';
import { SVG_VIEW_BOX, SVG_DEFAULT_DIMENSIONS } from './const.js';

/** Keeps layout groups, SVG viewBox size, and shared SVG definitions for this FHS card. */
export default class CardLayout {
  /**
   * Stores the template evaluator and card id used by JavaScript groups and SVG definitions.
   */
  constructor(templates, cardId) {
    this.templates = templates;
    this.cardId = cardId;
    this.viewBox = { width: SVG_VIEW_BOX, height: SVG_VIEW_BOX };
    this.sourceGroupConfigs = [];
    this.runtimeGroupConfigs = [];
    this.evaluatedGroupSignatures = {};
    this.groupsHaveJavascript = false;
    this.changedGroupIds = new Set();
  }

  /** Sets layout groups and SVG definitions, then sizes the SVG viewBox from aspectratio. */
  setConfig(config) {
    config.layout.groups ??= [];
    config.layout.gradients ??= {};
    config.layout.clips ??= {};
    config.layout.masks ??= {};

    this.sourceGroupConfigs = config.layout.groups;
    this.runtimeGroupConfigs = this.sourceGroupConfigs;
    this.evaluatedGroupSignatures = {};
    this.groupsHaveJavascript = this.sourceGroupConfigs.some((group) => this.templates.hasJavascriptTemplates(group));
    this.changedGroupIds.clear();
    this.groupManager = new GroupManager(this.runtimeGroupConfigs);
    this.masksClips = new MasksClips(config, this.cardId, this);

    // Card-level aspectratio remains valid, while layout.aspectratio takes precedence.
    this.aspectratio = (config.layout.aspectratio || config.aspectratio || '1/1').trim();
    const aspectRatioParts = this.aspectratio.split('/');
    this.viewBox.width = aspectRatioParts[0] * SVG_DEFAULT_DIMENSIONS;
    this.viewBox.height = aspectRatioParts[1] * SVG_DEFAULT_DIMENSIONS;

  }

  /** Re-evaluates JavaScript in layout.groups when HA data or FHS entity values change. */
  updateGroups(configuredEntityStateChanged) {
    // Group templates can use configured HA entities before Sparkline runs and
    // fhs_sparkline.* values after it. Reevaluate at both points so group positions
    // and visibility follow the values those templates use.
    if (!configuredEntityStateChanged || !this.groupsHaveJavascript) return;

    const newGroupConfigs = [...this.runtimeGroupConfigs];
    const directlyChangedGroupIds = new Set();

    this.sourceGroupConfigs.forEach((sourceGroupConfig, groupIndex) => {
      if (!this.templates.hasJavascriptTemplates(sourceGroupConfig)) return;

      const groupId = String(sourceGroupConfig.id);
      const newGroupConfig = this.templates.getJsTemplateOrValue(sourceGroupConfig, sourceGroupConfig, { resolveKeys: true });
      const evaluatedGroupSignature = JSON.stringify(newGroupConfig);
      newGroupConfigs[groupIndex] = newGroupConfig;
      if (evaluatedGroupSignature !== this.evaluatedGroupSignatures[groupId]) {
        this.evaluatedGroupSignatures[groupId] = evaluatedGroupSignature;
        directlyChangedGroupIds.add(groupId);
      }
    });

    if (directlyChangedGroupIds.size === 0) return;

    this.runtimeGroupConfigs = newGroupConfigs;
    this.groupManager = new GroupManager(this.runtimeGroupConfigs);

    // A changed parent can move, hide, or scale every nested group and its tools.
    // Mark each affected group so its tools recalculate their SVG geometry.
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

  /** Clears changed group IDs after their tools recalculate positions, scale, and visibility. */
  markGroupsHandled() {
    this.changedGroupIds.clear();
  }

  /** Converts item coordinates to SVG coordinates using its parent groups. */
  calculateSvgCoordinatesInGroup(item) {
    return this.groupManager.calculateSvgCoordinatesInGroup(item);
  }

  /** Builds the scale and flip transform for a layout item. */
  getGroupScaleTransform(item) {
    return this.groupManager.getGroupScaleTransform(item);
  }

  /** Builds the transform-origin style for a scaled layout item. */
  getGroupScaleStyle(item, svg = item.svg) {
    return this.groupManager.getGroupScaleStyle(item, svg);
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
