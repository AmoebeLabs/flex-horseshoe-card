import Merge from './merge.js';
import SameAs from './same-as.js';
import { VISIBLE_LAYOUT_SECTIONS } from './layout-sections.js';

const TEXT_SOURCE_SECTIONS = {
  name: 'names',
  area: 'areas',
  state: 'states',
};

/**
 * Expands configuration-only compounds into normal visible layout sections.
 *
 * Compounds keep related tools together in YAML. The compiler applies shared
 * defaults, namespaces child ids and rewrites local references. Runtime tools
 * only receive the resulting normal section items.
 */
export default class Compounds {
  /**
   * Compiles compound reuse and appends every generated child to its target section.
   *
   * @param {object} config - Card configuration after ref() and calc() processing.
   */
  static compile(config) {
    const compounds = config.layout.compounds;

    if (!Array.isArray(compounds)) return;

    // Merge.mergeDeep copies configured fields but intentionally ignores
    // non-enumerable symbols. Preserve the internal ref() marker so the later
    // same_as pass still knows that the complete referenced value must replace
    // its inherited counterpart.
    const preserveStaticRefMarkers = (source, target) => {
      if (!source || typeof source !== 'object'
        || !target || typeof target !== 'object') return;

      if (source[SameAs.STATIC_REF_MARKER]
        && !target[SameAs.STATIC_REF_MARKER]) {
        Object.defineProperty(target, SameAs.STATIC_REF_MARKER, {
          value: true,
        });
      }

      if (Array.isArray(source)) {
        source.forEach((value, index) => preserveStaticRefMarkers(value, target[index]));
        return;
      }

      Object.entries(source).forEach(([field, value]) => {
        preserveStaticRefMarkers(value, target[field]);
      });
    };

    const compoundIds = new Set();

    compounds.forEach((compound) => {
      if (compoundIds.has(String(compound.id))) {
        throw new Error(`[compounds] duplicate compound id '${compound.id}'`);
      }
      compoundIds.add(String(compound.id));

      VISIBLE_LAYOUT_SECTIONS.forEach((section) => {
        const childIds = new Set();
        const children = compound[section];

        if (!Array.isArray(children)) return;

        children.forEach((child) => {
          if (childIds.has(String(child.id))) {
            throw new Error(`[compounds] duplicate child id '${child.id}' in ${compound.id}.${section}`);
          }
          childIds.add(String(child.id));
        });
      });
    });

    const compiledCompoundsById = new Map();
    const compiledCompounds = compounds.map((compound, compoundIndex) => {
      let compiledCompound = compound;

      if (compound.same_as !== undefined) {
        const inheritedCompound = compiledCompoundsById.get(String(compound.same_as));

        if (!inheritedCompound) {
          throw new Error(`[compounds] same_as '${compound.same_as}' not found for compound ${compoundIndex}`);
        }

        const compoundOverrides = { ...compound };
        const sameAsReplace = compoundOverrides.same_as_replace ?? [];
        const inheritedForMerge = { ...inheritedCompound };
        const replacePaths = [...sameAsReplace];

        delete compoundOverrides.same_as;
        delete compoundOverrides.same_as_replace;

        // A ref() override replaces the inherited object at that exact path
        // instead of deep-merging it with the inherited compound value.
        const collectRefReplacePaths = (value, path, collectedPaths) => {
          if (value && typeof value === 'object' && value[SameAs.STATIC_REF_MARKER]) {
            collectedPaths.push(path.join('.'));
            return;
          }

          if (value && typeof value === 'object' && !Array.isArray(value)) {
            Object.entries(value).forEach(([field, fieldValue]) => {
              collectRefReplacePaths(fieldValue, [...path, field], collectedPaths);
            });
          }
        };

        Object.entries(compoundOverrides).forEach(([field, value]) => {
          if (!VISIBLE_LAYOUT_SECTIONS.includes(field)) {
            collectRefReplacePaths(value, [field], replacePaths);
          }
        });

        replacePaths.forEach((fieldPath) => {
          SameAs.deleteReplacePath(inheritedForMerge, fieldPath);
        });

        // Child lists are merged by their local id. This allows a derived
        // compound to override one child without repeating every sibling.
        const inheritedChildrenBySection = {};
        const overrideChildrenBySection = {};

        VISIBLE_LAYOUT_SECTIONS.forEach((section) => {
          inheritedChildrenBySection[section] = inheritedForMerge[section];
          overrideChildrenBySection[section] = compoundOverrides[section];
          delete inheritedForMerge[section];
          delete compoundOverrides[section];
        });

        compiledCompound = Merge.mergeDeep(inheritedForMerge, compoundOverrides);
        preserveStaticRefMarkers(inheritedForMerge, compiledCompound);
        preserveStaticRefMarkers(compoundOverrides, compiledCompound);
        compiledCompound = SameAs.applyDeltas(compound, compiledCompound, compoundIndex);

        VISIBLE_LAYOUT_SECTIONS.forEach((section) => {
          const inheritedChildren = inheritedChildrenBySection[section];
          const overrideChildren = overrideChildrenBySection[section];

          if (!inheritedChildren && !overrideChildren) return;
          if (!inheritedChildren) {
            compiledCompound[section] = overrideChildren;
            return;
          }
          if (!overrideChildren) {
            compiledCompound[section] = inheritedChildren;
            return;
          }

          const mergedChildren = [...inheritedChildren];
          const childIndexesById = new Map();

          mergedChildren.forEach((child, index) => {
            childIndexesById.set(String(child.id), index);
          });

          overrideChildren.forEach((child, childIndex) => {
            const inheritedChildIndex = childIndexesById.get(String(child.id));

            if (inheritedChildIndex === undefined) {
              childIndexesById.set(String(child.id), mergedChildren.length);
              mergedChildren.push(child);
              return;
            }

            if (child.same_as !== undefined) {
              throw new Error(
                `[compounds] ${compound.id}.${section}.${child.id} cannot override an inherited child and use same_as`,
              );
            }

            const inheritedChild = { ...mergedChildren[inheritedChildIndex] };
            const childReplacePaths = [...(child.same_as_replace ?? [])];

            Object.entries(child).forEach(([field, value]) => {
              collectRefReplacePaths(value, [field], childReplacePaths);
            });
            childReplacePaths.forEach((fieldPath) => {
              SameAs.deleteReplacePath(inheritedChild, fieldPath);
            });

            let mergedChild = Merge.mergeDeep(inheritedChild, child);
            preserveStaticRefMarkers(inheritedChild, mergedChild);
            preserveStaticRefMarkers(child, mergedChild);
            mergedChild = SameAs.applyDeltas(child, mergedChild, childIndex);
            delete mergedChild.same_as_replace;
            Object.keys(mergedChild)
              .filter((key) => key.startsWith('same_as_d'))
              .forEach((key) => delete mergedChild[key]);

            mergedChildren[inheritedChildIndex] = mergedChild;
          });

          compiledCompound[section] = mergedChildren;
        });

        delete compiledCompound.same_as;
        delete compiledCompound.same_as_replace;
        Object.keys(compiledCompound)
          .filter((key) => key.startsWith('same_as_d'))
          .forEach((key) => delete compiledCompound[key]);
      }

      compiledCompoundsById.set(String(compiledCompound.id), compiledCompound);

      return compiledCompound;
    });

    const generatedIdsBySection = {};

    VISIBLE_LAYOUT_SECTIONS.forEach((section) => {
      generatedIdsBySection[section] = new Set(
        (config.layout[section] ?? []).map((item) => String(item.id)),
      );
    });

    compiledCompounds.forEach((compound) => {
      const localIdsBySection = {};

      VISIBLE_LAYOUT_SECTIONS.forEach((section) => {
        localIdsBySection[section] = new Set(
          (compound[section] ?? []).map((child) => String(child.id)),
        );
      });

      const sharedDefaults = { ...compound };

      delete sharedDefaults.id;
      delete sharedDefaults.same_as;
      delete sharedDefaults.same_as_replace;
      Object.keys(sharedDefaults)
        .filter((key) => key.startsWith('same_as_d'))
        .forEach((key) => delete sharedDefaults[key]);
      VISIBLE_LAYOUT_SECTIONS.forEach((section) => delete sharedDefaults[section]);

      VISIBLE_LAYOUT_SECTIONS.forEach((section) => {
        const children = compound[section];

        if (!Array.isArray(children)) return;

        config.layout[section] ??= [];

        children.forEach((child) => {
          const localChildId = String(child.id);
          const generatedChildId = `${compound.id}--${localChildId}`;

          if (generatedIdsBySection[section].has(generatedChildId)) {
            throw new Error(
              `[compounds] generated id '${generatedChildId}' already exists in layout.${section}`,
            );
          }

          const generatedChild = Merge.mergeDeep(sharedDefaults, child);
          preserveStaticRefMarkers(sharedDefaults, generatedChild);
          preserveStaticRefMarkers(child, generatedChild);

          // A same_as child must inherit fields from its referenced sibling.
          // Remove only the compound-level entity_index when the child did not
          // explicitly define one; otherwise it would override the base index
          // before same_as_dentity_index can apply its delta.
          if (child.same_as !== undefined
            && child.entity_index === undefined
            && sharedDefaults.entity_index !== undefined) {
            delete generatedChild.entity_index;
          }

          generatedChild.id = generatedChildId;

          // same_as is local when it names a sibling in the same target
          // section. Full ids and normal top-level references remain untouched.
          if (generatedChild.same_as !== undefined
            && localIdsBySection[section].has(String(generatedChild.same_as))) {
            generatedChild.same_as = `${compound.id}--${generatedChild.same_as}`;
          }

          ['fit', 'width', 'height'].forEach((field) => {
            const reference = generatedChild[field];

            if (reference && typeof reference === 'object'
              && localIdsBySection[reference.section]?.has(String(reference.item_id))) {
              reference.item_id = `${compound.id}--${reference.item_id}`;
            }
          });

          if (section === 'texts') {
            const textParts = Array.isArray(generatedChild.text)
              ? generatedChild.text
              : [generatedChild.text];

            textParts.forEach((textPart) => {
              if (!textPart || typeof textPart !== 'object') return;

              const sourceSection = TEXT_SOURCE_SECTIONS[textPart.type];

              if (sourceSection && localIdsBySection[sourceSection].has(String(textPart.id))) {
                textPart.id = `${compound.id}--${textPart.id}`;
              }
            });
          }

          generatedIdsBySection[section].add(generatedChildId);
          config.layout[section].push(generatedChild);
        });
      });
    });

    delete config.layout.compounds;
  }
}
