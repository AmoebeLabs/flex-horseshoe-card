# Section Documentation Structure Proposal

## Scope

This proposal reorganizes the documentation for the horseshoe and sparkline sections. It follows the structure already used by the stronger section pages: a focused introduction, basic usage, practical examples, configuration fields, styling, and links to related topics.

The existing documentation pages should not be rewritten until the proposed structure and scope have been accepted.

## Recommendation

The complete horseshoe reference does not fit comfortably on one page. The horseshoe combines geometry, value scaling, state behavior, color stops, backgrounds, tick marks, labels, and styling. Putting all of that on one page would make the most important section difficult to scan and maintain.

Separate pages for only tick marks and only labels would be too small and would repeat much of the same scale and positioning context. Those subjects should therefore share one page.

The recommended structure is:

- Three horseshoe pages.
- Four sparkline pages.
- Keep the current horseshoe overview URL where possible.
- Group related configuration instead of creating a page for every configuration object.
- Keep examples next to the behavior they demonstrate.

## Proposed Navigation

```yaml
- Card Layout Sections:
    - Horseshoes:
        - Overview: sections/horseshoes-section.md
        - Scale and State: sections/horseshoe-scale-and-state.md
        - Tick Marks and Labels: sections/horseshoe-ticks-and-labels.md
    - Sparkline Graphs:
        - Overview: sections/sparklines-section.md
        - History Periods and Bins: sections/sparkline-history-periods.md
        - Cartesian Charts and Axes: sections/sparkline-cartesian-charts.md
        - Specialized Charts: sections/sparkline-specialized-charts.md
```

The exact location of the Sparkline Graphs group in the navigation can be decided when the first sparkline page is written. It should be at the same structural level as the other visual card sections, not hidden under examples or advanced topics.

## Shared Page Pattern

Each section page should use the same recognizable order where applicable:

1. Front matter with a unique title and description.
2. One descriptive H1 heading.
3. A short introduction explaining the purpose of the section.
4. Basic usage with the smallest useful YAML example.
5. One or more visual examples showing meaningful differences.
6. Configuration fields grouped by responsibility.
7. Styling fields and selectors.
8. Related documentation links.

Not every page needs every heading. The order should remain predictable, but empty headings or placeholder sections should not be published.

## Horseshoe Pages

### 1. Horseshoes Overview

**File:** `sections/horseshoes-section.md`

This page remains the entry point and keeps the existing URL. The current page should be rewritten because it is short, unfinished, and still contains placeholder or inherited example material.

Recommended content:

- What a horseshoe section displays.
- An annotated description of the scale, state arc, background, tick marks, and labels.
- A minimal working horseshoe configuration.
- Top-level position and geometry fields.
- Visibility and basic presentation options.
- A concise overview of numeric and mapped state use cases.
- A complete common example.
- Links to Scale and State and Tick Marks and Labels.

This page should help a user create a recognizable horseshoe without becoming the complete reference.

### 2. Horseshoe Scale and State

**File:** `sections/horseshoe-scale-and-state.md`

This page documents how values are converted into the visible horseshoe state.

Recommended content:

- Numeric scale range and geometry.
- Supported scale types verified against the current implementation.
- State arc behavior, zero crossing, and applicable state modes.
- String or mapped states where supported.
- Scale and state backgrounds.
- Color stops, transitions, and state colors.
- Animation behavior.
- Styling for the scale, active state, inactive state, and backgrounds.
- Examples for a normal numeric range, a range crossing zero, and a mapped state.

The page should explain the rendered result rather than internal calculation details.

### 3. Horseshoe Tick Marks and Labels

**File:** `sections/horseshoe-ticks-and-labels.md`

This page replaces the two former empty tick and label pages. Tick marks and labels share the same scale, orientation, and positioning context, so documenting them together avoids repetition.

Recommended content:

- Relationship between the horseshoe scale, tick marks, and labels.
- Major and minor tick configuration where supported.
- Tick mark backgrounds and styling.
- Numeric labels and formatting.
- Label orientation and positioning.
- Badges or secondary label elements where supported.
- Labels for mapped states.
- Combined examples that show ticks and labels together.

The previous draft pages can remain outside the published documentation until any useful notes have been incorporated into this page.

## Sparkline Pages

The sparkline implementation is broad enough that one page would become a mixture of history retrieval, bucket aggregation, axes, rendering, specialized chart types, styling, and interaction. Four pages keep those responsibilities understandable without fragmenting the documentation into tiny pages.

### 1. Sparkline Graphs Overview

**File:** `sections/sparklines-section.md`

Recommended content:

- What a sparkline section displays and when to use it.
- A minimal working configuration using a common line or area graph.
- A chart type overview covering line, area, bar, equalizer, graded, barcode, and radial barcode.
- A compact selection guide explaining which chart types use Cartesian axes and which do not.
- Common top-level dimensions, visibility, colors, and state aggregation settings.
- Links to the three detailed sparkline pages.

This page should allow a user to select a chart type and render a basic graph without presenting every history and rendering option.

### 2. Sparkline History Periods and Bins

**File:** `sections/sparkline-history-periods.md`

Recommended content:

- The realtime, rolling window, and calendar period types.
- The difference between a current rolling range and a fixed calendar range.
- Calendar offsets and past periods.
- Duration configuration.
- Bins per hour and how bin size affects the graph.
- Aggregation functions and the values produced per bin.
- Current-bin updates and closed-bin behavior.
- Time-zone and calendar-boundary behavior.
- Practical examples for realtime, the last 24 hours, today, and a previous calendar day.

This page should document observable behavior and configuration. Internal history lifecycle details should only be included when they affect how a user configures or interprets the graph.

### 3. Sparkline Cartesian Charts and Axes

**File:** `sections/sparkline-cartesian-charts.md`

Recommended content:

- Line, area, min/max area, bar, and point rendering.
- Automatic X-axis and Y-axis geometry.
- Grid lines, tick marks, and labels.
- Relationship between bins, graph points, and X-axis positions.
- Automatic Y-axis scaling and tick rounding.
- Logarithmic Y-axis behavior after it has been verified.
- Smoothing, line width, dots, area fills, and fade masks.
- Tooltip and indicator behavior.
- Examples showing the same data as line, area, min/max, and bar charts.

This page is the main reference for chart types that use X and Y geometry.

### 4. Sparkline Specialized Charts

**File:** `sections/sparkline-specialized-charts.md`

Recommended content:

- Equalizer and graded charts.
- Linear barcode charts.
- Radial barcode charts.
- Which chart types use an axis and which use their own geometry.
- Radial face and size configuration.
- Foreground and background styles.
- Per-bin colors and color-stop transitions.
- Data-driven hover and touch interaction.
- Tooltip behavior without a Cartesian X-axis.
- Separate working examples for each specialized chart type.

These chart types belong together because they use the same aggregated bins but do not all use the normal Cartesian rendering model.

## Shared Subjects

Color stops, formatting, styling, and tooltips occur in several chart types. They should be explained on the page where their behavior is visible instead of adding a fifth generic reference page immediately.

Cross-links should point to the existing entity, color-stop, positioning, and reusable-template documentation for shared card concepts. Sparkline pages should document only the configuration that changes sparkline behavior.

## Source of Truth

The published documentation must be based on:

- The current configuration and defaults.
- The current graph engine, reducers, and render methods.
- Working YAML tested in Home Assistant.
- Screenshots made from the current Flexible Horseshoe Card implementation.

Old Swiss Army Knife examples can help identify intended features, but they must not be copied as authoritative configuration. Every option and example should be verified against the current card before publication.

The repository currently has no complete, verified, published sparkline example set. The sparkline pages should therefore not be filled with speculative examples. First establish one working YAML example for every documented period and chart type, then write the reference around those examples.

## Suggested Implementation Order

1. Rewrite the Horseshoes Overview while preserving its URL.
2. Add Horseshoe Scale and State.
3. Combine the useful material from the tick and label drafts into Horseshoe Tick Marks and Labels.
4. Add the Sparkline Graphs Overview and one verified basic example.
5. Add History Periods and Bins with verified realtime, rolling-window, and calendar examples.
6. Add Cartesian Charts and Axes using the same data source for comparable examples.
7. Add Specialized Charts after each chart type has a verified YAML example.
8. Update navigation, internal links, descriptions, and screenshot alt text.
9. Run the MkDocs build and validate all published links.

This order makes the most important unfinished section useful first and prevents the sparkline documentation from being written ahead of verified examples.

## Publication Checklist

Before publishing each page, verify that it has:

- A unique, descriptive title, description, and H1.
- No `TBD`, empty headings, or placeholder text.
- A minimal working YAML example.
- At least one representative screenshot with meaningful alt text where a visual result is discussed.
- Configuration names and accepted values matching the current implementation.
- Styling examples matching the current `styles` structure.
- Links to the relevant shared concepts and adjacent section pages.
- No outdated Swiss Army Knife names or configuration paths.

## Final Assessment

The horseshoe documentation should not be forced onto one page. Three pages provide enough room for the real functionality while keeping related concepts together. Combining tick marks and labels avoids recreating the empty, overly granular pages that were removed.

Sparkline documentation should be introduced as a four-page set. Its history modes, Cartesian geometry, and specialized chart types are distinct user-facing subjects and cannot be explained clearly on a single page without producing an oversized reference.
