# MkDocs description review

This document reviews the page descriptions in `docs/docs`. It does not change the page frontmatter itself. The proposals use one concise sentence that describes the concrete subject and expected value of each page.

## Active pages

These pages are included in the navigation in `docs/mkdocs.yml`.

| Page | Current description | Proposed description | Notes |
| --- | --- | --- | --- |
| `index.md` | None | Create highly configurable Home Assistant dashboards with the Flexible Horseshoe Card, using reusable layouts, dynamic styling, and data-driven visualizations. | Add a description to the existing frontmatter. |
| `getting-started/introduction.md` | Introduction to the Flexible Horseshoe Card for Home Assistant. | Learn how the Flexible Horseshoe Card combines flexible layouts, entity data, styling, animations, templates, and reusable YAML in Home Assistant. | The current description repeats the title and does not explain the page. |
| `getting-started/installation.md` | The preferred way to install the Flexible Horseshoe Card is through HACS from within your Home Assistant dashboard. | Install the Flexible Horseshoe Card through HACS or manually, then add the card resource to Home Assistant. | Covers both installation methods documented on the page. |
| `examples/overview.md` | Overview of some of the basic examples. | Explore basic Flexible Horseshoe Card examples and learn how to extend them with entities, visual elements, actions, and animations. | More specific than “overview of examples.” |
| `examples/demo-cards/demo-card-kleenex-pollen-many.md` | Example of functional card, Tomorrow Pollen Card | Explore several pollen radar cards that visualize tree, grass, and weed levels with horseshoes, icons, state maps, and reusable YAML. | The page contains several pollen cards, not only a tomorrow card. |
| `examples/demo-cards/demo-card-electricity-many.md` | Example of functional card, Tomorrow Pollen Card | Explore nine electricity cards that visualize total and per-phase DSMR consumption with horseshoes, ticks, labels, palettes, and reusable YAML. | The current description belongs to the pollen page. The page title and tags are also incorrect. |
| `core-concepts/card-structure.md` | Overview of the main YAML structure used by the Flexible Horseshoe Card. | Understand the Flexible Horseshoe Card YAML structure, including entities, layout sections, tools, styling, and card templates. | Adds the subjects covered by the structure. |
| `core-concepts/entity-definitions.md` | Define Home Assistant entities, attributes, icons, units, precision, names, areas, tap actions, and dynamic entity values for the Flexible Horseshoe Card. | Configure Home Assistant entities, attributes, names, icons, units, precision, actions, and dynamic values for use throughout the card. | Keeps the strong existing description while making the scope clearer. |
| `core-concepts/positioning-and-groups.md` | Position layout items with xpos and ypos, understand the card canvas, and use groups to move related items together. | Position items on the card coordinate system with `xpos` and `ypos`, and use groups to move and reuse related layout elements together. | Retains the existing meaning and names the coordinate system. |
| `core-concepts/css-styling.md` | Use the styles section to style the card and individual layout items with CSS. | Style the card and individual layout items with CSS properties in their `styles` sections. | Small wording refinement; the current description is already accurate. |
| `core-concepts/color-stops.md` | Use color stops to change colors based on numeric entity states, including horseshoe color modes and gradients. | Map numeric entity states to colors with color stops, scales, hard transitions, smooth transitions, and horseshoe gradients. | Describes the principal behavior and transition options. |
| `core-concepts/color-filters.md` | Use color filters to transform rendered colors without CSS filters. | Transform configured colors with reusable color filters while preserving the card’s state-based color logic. | Explains why these filters differ from CSS filters. |
| `core-concepts/external-palettes.md` | Load external JSON color palettes with light and dark mode support. | Load reusable color palettes from external JSON files and provide separate colors for Home Assistant light and dark modes. | The current description is good; this adds the reuse aspect. |
| `core-concepts/localization.md` | Use Home Assistant localization for names, states, units, icons, state colors, and number formatting. | Use Home Assistant localization and entity metadata for translated names, states, units, icons, state colors, and number formatting. | Clarifies that metadata is also involved. |
| `core-concepts/animations.md` | Use state-based animations, CSS animations, and dynamic styling in the Flexible Horseshoe Card. | Configure state-driven and CSS animations, animation triggers, and dynamic styles for Flexible Horseshoe Card elements. | Includes trigger configuration covered by the page. |
| `core-concepts/templating.md` | Define reusable Flexible Horseshoe Card templates and use JavaScript templates for dynamic values. | Define reusable card, tool, and color-stop templates, pass template variables, and calculate dynamic values with JavaScript templates. | Describes the template types and variables covered by the page. |
| `sections/layout-overview.md` | Overview of the layout section and the main layout item sections in the Flexible Horseshoe Card. | Understand the `layout` structure, card coordinate system, groups, and available visual and entity layout sections. | Replaces a generic overview description with the actual topics. |
| `sections/groups-section.md` | Use groups to position related layout items together on the card. | Group related layout items around a shared position and reuse grouped elements to build consistent card layouts. | Includes the reuse examples documented on the page. |
| `sections/visual-shapes-section.md` | Use circles, horizontal lines, and vertical lines as visual building blocks in the Flexible Horseshoe Card. | Configure circles, horizontal lines, and vertical lines as positioned and styled visual building blocks in card layouts. | The current description is already accurate; this adds positioning and styling. |
| `sections/entities-section.md` | Configure areas, names, states, and icons for Home Assistant entities. | Configure positioned areas, names, states, and icons that display Home Assistant entity data in the card layout. | Clarifies that these are layout elements. |
| `sections/horseshoes-section.md` | The horseshoe tool ... | Configure horseshoe tools, including scales, fill styles, color stops, tick marks, labels, animations, styling, and interactions. | Replaces an unfinished placeholder. The page itself still contains `TBD!`. |
| `sections/horseshoe-ticks.md` | None | Configure major and minor horseshoe tick marks, including their placement, size, labels, colors, and styling. | The file is currently empty, so verify this description when content is added. |
| `sections/horseshoe-labels.md` | None | Configure labels around a horseshoe to display scale values, states, and other contextual information. | The file is currently empty, so verify this description when content is added. |
| `reuse/reuse-introduction.md` | Reduce repeated YAML with same_as, calc(), constants, and ref(). | Reduce repeated card YAML with `same_as`, static `calc()` expressions, constants, and `ref()` while keeping layouts readable. | The current description is good; this adds the static nature and purpose. |
| `reuse/reuse-card-examples.md` | Practical card examples using same_as, calc(), constants, and ref(). | Study complete electricity card examples that combine `same_as`, `calc()`, constants, and `ref()` to reduce repeated YAML. | The current title “Combining Calc with same_as” is narrower than the page content. |
| `reuse/reuse-reference.md` | Compact reference for same_as, calc(), constants, and ref(). | Reference the processing order, supported sections, syntax, and constraints for `same_as`, `calc()`, constants, and `ref()`. | States what makes this page a reference. |

## Pages outside the active navigation

These pages are not currently linked from the active navigation. Some may be drafts or reusable includes rather than standalone pages.

| Page | Recommendation |
| --- | --- |
| `blog/index.md` | Contains only a heading and no frontmatter. Add frontmatter only if the blog becomes an actual published section. Suggested description: “Read development notes, release highlights, and practical Flexible Horseshoe Card examples.” |
| `sections/default-haptics.md` | Appears to be a reusable content fragment. If published as a standalone page, use: “Configure haptic feedback for card actions in supported Home Assistant Companion apps.” |
| `reuse/reuse-with-same_as.md` | Replace `Brrrrrr.` with: “Reuse earlier items within the same layout section with `same_as`, field overrides, numeric deltas, and chained references.” |
| `reuse/reuse-with-calc-and-ref.md` | Replace `Brrrrrr.` with: “Calculate static numeric configuration values with `calc()` and reuse constants and configuration fragments with `ref()`.” |
| `reuse/reuse-combined.md` | Replace `Combine` with: “Combine `same_as` and `calc()` to create repeated layout items with calculated sizes, positions, and numeric offsets.” |

## Legacy and duplicate files

The following filenames indicate old or copied pages and should preferably be removed from `docs/docs`, moved outside the MkDocs source directory, or explicitly excluded from the build. Improving their descriptions would leave duplicate pages discoverable by MkDocs and search engines.

- `examples/overview-old.md`
- `getting-started/introduction-old.md`
- `reuse/reuse-introduction-old.md`
- `sections/entities-section copy.md`
- `sections/groups-section copy.md`
- `sections/layout-overview copy.md`
- `sections/visual-shapes-section copy.md`

## Additional frontmatter findings

- `examples/demo-cards/demo-card-electricity-many.md` has the pollen page title, description, and tags. Suggested title: `Electricity Cards`; suggested tags: `Design`, `Demo Card`, `Electricity`, `DSMR`.
- Both demo-card pages use `hideno:` followed by `toc`; verify whether this should be valid MkDocs frontmatter such as `hide: [toc]`.
- `sections/horseshoe-labels.md` and `sections/horseshoe-ticks.md` are empty but are present in the active navigation.
- `index.md` begins with a byte-order mark before the opening `---`. Verify that the frontmatter parser consistently accepts it.
