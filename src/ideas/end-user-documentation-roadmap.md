# End-User Documentation Roadmap

## Main Goal

Make the documentation useful for someone who has installed the Flexible Horseshoe Card but has never configured one before.

The current documentation contains extensive reference information and several advanced demo cards. What is missing is the learning path between those two ends. A new user can read which fields exist, but does not yet get a simple complete card that can be copied, displayed, and extended one step at a time.

The documentation should therefore lead users from a first working card to the existing advanced examples without requiring them to assemble a complete configuration from unrelated YAML fragments.

## Current Gap

The Examples section currently contains only the Pollen and Electricity demo cards. Both demonstrate many capabilities at once and are useful as showcases, but they are too advanced to serve as introductory examples.

Most section pages contain useful configuration fragments, but few contain a complete card beginning with `type: custom:flex-horseshoe-card`. A user must determine where each fragment belongs and which surrounding configuration is required.

This creates a large jump between:

- understanding a basic horseshoe configuration;
- reading individual configuration field descriptions;
- building a complete card with several related elements;
- understanding the large existing demo cards.

The documentation currently works better as a reference manual than as a practical guide for building cards.

## Documentation Principles

End-user documentation should explain what users can build and which YAML they need. It should not describe internal processing, normalized configuration, graph engines, rendering lifecycles, or implementation architecture.

Every practical example should follow the same structure:

1. A screenshot of the result.
2. A short description of what the card displays.
3. Complete copy-and-paste YAML.
4. A clear indication of which entity IDs must be replaced.
5. A small number of useful variations.
6. Links to the detailed reference pages for the fields being used.

Examples should use automatic behavior where FHS already provides it. Users should not be taught to calculate graph axes, dynamic text dimensions, localized label widths, or other values that the card determines automatically.

## Proposed Learning Path

### 1. My First Card

Create a dedicated introductory page comparable to the first custom-card example in the Home Assistant documentation.

The first example should contain:

- one Home Assistant sensor;
- one horseshoe;
- the current state and unit;
- the entity name;
- a square `1/1` card;
- one complete YAML configuration;
- only the configuration needed to display the result.

The page should tell the user to replace one example entity ID and then show the expected result. It should avoid templates, constants, groups, animations, external palettes, child cards, and JavaScript.

### 2. Extend the First Card

Build on the first card instead of introducing an unrelated configuration. Add one concept at a time:

- an icon;
- an area label;
- color stops for the horseshoe;
- a circle, line, or rectangle;
- basic item styling;
- a tap action.

Each step should show the complete resulting card or clearly highlight the addition within the complete configuration.

### 3. Build a First History Card

Provide a complete line or area chart using one sensor and a straightforward history period. The example should demonstrate:

- a history period and bins;
- an average line or area;
- automatic X and Y axes;
- grid, tick marks, and labels;
- the tooltip with minimum, average, and maximum values;
- optional minimum and maximum range display.

The page should emphasize that FHS selects suitable axes and labels automatically. Users should only select the sensor, period, number of bins, chart type, and visible chart elements.

### 4. Intermediate Examples

Add compact examples that each teach one practical capability:

- a multi-entity card using groups;
- a state label with a rectangle using `fit`;
- a bar chart;
- a dots chart;
- an equalizer chart;
- a barcode chart;
- a radial barcode chart;
- an embedded child card;
- a reusable card template with variables.

These examples should remain small enough to understand without first studying the advanced demo cards.

### 5. Advanced Examples

Keep the existing Pollen and Electricity cards as advanced showcase material. Add further complete use-case examples only after the introductory and intermediate route exists, for example:

- battery status;
- temperature and humidity;
- energy and power flow;
- air quality;
- device or room status;
- server statistics;
- light, switch, and binary sensor cards.

Advanced examples may combine groups, templates, constants, dynamic JavaScript, animations, multiple entities, and specialized charts. They should link back to the simpler pages that explain each capability.

## Examples Overview

Replace the current short Examples overview with a task-oriented gallery. Users should be able to choose an example by what they want to build rather than by an internal configuration concept.

Suggested groups are:

- **Start here:** My First Card and First History Card.
- **Horseshoe cards:** colors, scales, multiple horseshoes, and status cards.
- **History charts:** line, area, bar, dots, and min/max.
- **Specialized charts:** equalizer, graded, barcode, and radial barcode.
- **Layouts:** groups, dynamic fitted rectangles, wide cards, and embedded cards.
- **Reusable and dynamic cards:** templates, constants, variables, animations, and JavaScript.
- **Complete dashboards:** the existing advanced demo cards and future use-case examples.

Each gallery entry should include a screenshot, a one-sentence purpose, and a direct link to the complete YAML.

## Existing Pages To Improve

The current reference pages should remain focused reference material, but each important feature page should include or link to at least one complete working card.

The following user-visible documentation also needs to be synchronized with the current software:

- Remove the warning that the dots chart is not available.
- Verify and correct tooltip support tables for all chart types.
- Document the sparkline `animate` option separately from state-based card animations.
- Add screenshots for line, dots, equalizer, graded, and basic layout examples.
- Ensure every chart page shows the currently supported axes, grid, labels, tooltip, and indicator behavior.
- Ensure examples consistently use the current public configuration names, including `color_stops`.

## Recommended Delivery Order

1. Publish My First Card.
2. Expand it into the first horseshoe tutorial.
3. Publish First History Card.
4. Correct outdated chart documentation.
5. Add the compact intermediate examples.
6. Rebuild the Examples overview as a visual gallery.
7. Add further real-world use-case cards and screenshots over time.

This order closes the largest onboarding gap first. It also allows every later example to reuse concepts and links introduced by the earlier pages.

## Acceptance Criteria

- A new user can create a working card from a single page without reconstructing missing YAML.
- The first card requires changing only an entity ID.
- Every example states what it displays and shows the expected result.
- Examples progress from one entity and one horseshoe to advanced multi-entity cards.
- Important section pages provide a complete example or link directly to one.
- Advanced demo cards are presented as showcase destinations, not starting points.
- User documentation contains no internal implementation or processing details.
- Documented chart behavior matches the current software.
