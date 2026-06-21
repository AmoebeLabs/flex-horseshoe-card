import Utils from './utils.js';

const CARD_GROUP_ID = 'card';
const GROUP_CENTER = 50;

/**
 * Resolves layout groups into an effective parent tree.
 *
 * The public card helpers still ask for one item at a time. This class keeps the
 * parent-chain logic in the configuration layer, so render tools can continue to
 * use the same coordinate and transform helpers without knowing about parents.
 */
export default class GroupManager {
  /**
   * Stores the configured group tree and computes the effective group positions.
   *
   * @param {object} groups - layout.groups from the normalized card config.
   */
  constructor(groups) {
    if (groups?.[CARD_GROUP_ID]) {
      throw new Error('[groups] card is reserved for the card root group');
    }

    this.groups = {
      [CARD_GROUP_ID]: {
        id: CARD_GROUP_ID,
        xpos: GROUP_CENTER,
        ypos: GROUP_CENTER,
      },
      ...(groups ?? {}),
    };

    this.resolvedGroups = {};

    Object.keys(this.groups).forEach((groupId) => {
      this.getGroup(groupId);
    });
  }

  /**
   * Returns the effective group for an item, using the card root when no group is configured.
   *
   * @param {object} item - Layout item that can reference a group.
   * @returns {object} Effective group config.
   */
  getGroupForItem(item) {
    return this.getGroup(item?.group ?? CARD_GROUP_ID);
  }

  /**
   * Returns one group after applying the full parent chain.
   *
   * @param {string} groupId - Group id from layout.groups or the implicit card root.
   * @param {Array<string>} resolving - Parent stack used to detect cycles.
   * @returns {object} Effective group config.
   */
  getGroup(groupId, resolving = []) {
    if (this.resolvedGroups[groupId]) {
      return this.resolvedGroups[groupId];
    }

    if (resolving.includes(groupId)) {
      throw new Error(`[groups] Circular parent reference: ${[...resolving, groupId].join(' -> ')}`);
    }

    const group = this.groups[groupId];

    if (!group) {
      throw new Error(`[groups] Unknown group: ${groupId}`);
    }

    const parentId = group.parent ?? CARD_GROUP_ID;
    const parent = groupId === CARD_GROUP_ID ? undefined : this.getGroup(parentId, [...resolving, groupId]);
    const xpos = parent ? parent.xpos + group.xpos - GROUP_CENTER : group.xpos;
    const ypos = parent ? parent.ypos + group.ypos - GROUP_CENTER : group.ypos;

    // Keep the original group properties, but expose effective coordinates to existing render code.
    const resolvedGroup = {
      ...group,
      id: groupId,
      parent: groupId === CARD_GROUP_ID ? undefined : parentId,
      xpos,
      ypos,
      svg: {
        xpos: Utils.calculateSvgDimension(xpos),
        ypos: Utils.calculateSvgDimension(ypos),
      },
    };

    this.resolvedGroups[groupId] = resolvedGroup;

    return resolvedGroup;
  }

  /**
   * Converts item coordinates into effective SVG coordinates after parent group offsets.
   *
   * @param {object} item - Layout item with xpos/ypos and optional group.
   * @returns {object} SVG coordinate object.
   */
  calculateSvgCoordinatesInGroup(item) {
    const itemXpos = item.xpos;
    const itemYpos = item.yposc || item.ypos;
    const group = this.getGroupForItem(item);
    const xpos = group.xpos + itemXpos - GROUP_CENTER;
    const ypos = group.ypos + itemYpos - GROUP_CENTER;

    return {
      xpos: Utils.calculateSvgDimension(xpos),
      ypos: Utils.calculateSvgDimension(ypos),
    };
  }

  /**
   * Builds the existing group scale and item flip transform for layout tools.
   *
   * @param {object} item - Layout item with optional group and flip config.
   * @returns {string} SVG transform value.
   */
  getGroupScaleTransform(item) {
    const group = this.getGroupForItem(item);

    if (!group.scale && !item?.flip) return '';

    const scaleX = group.scale?.x ?? group.scale ?? 1;
    const scaleY = group.scale?.y ?? group.scale ?? 1;

    const flipX = item?.flip === 'x' || item?.flip === 'both' ? -1 : 1;
    const flipY = item?.flip === 'y' || item?.flip === 'both' ? -1 : 1;

    return `scale(${scaleX * flipX}, ${scaleY * flipY})`;
  }

  /**
   * Builds the SVG style needed by the existing scale transform.
   *
   * @param {object} item - Layout item with precomputed svg coordinates.
   * @returns {string} SVG style value.
   */
  getGroupScaleStyle(item) {
    const group = this.getGroupForItem(item);

    if (!group.scale) return `transform-origin:${item.svg.xpos}px ${item.svg.ypos}px; transform-box:view-box;`;

    return `transform-origin:${group.svg.xpos}px ${group.svg.ypos}px; transform-box:view-box;`;
  }
}
