# SEO review for the Flexible Horseshoe Card documentation

Review date: 18 July 2026

## Scope

This review covers the MkDocs configuration, active Markdown pages, custom templates, generated site output, sitemap, metadata, headings, images, internal links, and structured data. It uses Google Search Central guidance for technical documentation rather than commercial SEO practices.

## Executive assessment

The site has a solid technical foundation: readable topic-based URLs, a configured `site_url`, self-referencing canonical URLs, a generated sitemap, server-rendered documentation content, responsive MkDocs Material pages, and page-specific descriptions. The new descriptions are suitable for Google because they are unique, concise summaries of the actual page content.

The current source is not yet search-ready because the custom template injects incorrect and unrelated metadata into every page. Old, copied, draft, and empty pages can also be generated and included in the sitemap. These issues are more important than further tuning individual descriptions.

Overall assessment before the critical fixes: **needs technical cleanup before active Search Console promotion**.

## Critical findings

### 1. Remove the global `HowTo` structured data (DONE!)

`docs/overrides/main.html` injects a large `HowTo` JSON-LD object into every page. It describes Swiss Army Knife tools, images, and URLs rather than the Flexible Horseshoe Card page being viewed. Most documentation pages are not a single how-to procedure matching this object.

Google requires structured data to represent the visible main content of the page and warns against irrelevant or misleading markup. Remove this entire global `HowTo` block. Do not replace it with another global rich-result type merely for SEO. Add page-specific structured data only when a page genuinely meets all requirements for that type.

The global `Organization` object is less problematic, but Google recommends placing organization markup on the home page or a single organization page rather than every page.

### 2. Remove non-published Markdown from `docs/docs` (DONE!)

MkDocs discovers Markdown files under `docs/docs` even when they are absent from `nav`. Old and copied pages can therefore become standalone URLs and sitemap entries. The source currently contains:

- `examples/overview-old.md`
- `getting-started/introduction-old.md`
- `reuse/reuse-introduction-old.md`
- `sections/entities-section copy.md`
- `sections/groups-section copy.md`
- `sections/layout-overview copy.md`
- `sections/visual-shapes-section copy.md`
- unfinished reuse pages that are commented out in `nav`
- a nearly empty blog page
- two empty horseshoe pages

Move drafts and source copies outside `docs/docs`, remove them, or explicitly exclude them from the build. If an obsolete URL has already been published or indexed, redirect it permanently to the relevant current page. Do not leave duplicate content for Google to resolve.

The two horseshoe pages now have descriptions but still contain no documentation. Remove them from navigation and publication until they have useful content, or complete them before deployment.

### 3. Correct Open Graph and Twitter metadata (DONE!)

Every page currently uses `config.site_description` for `og:description` and `twitter:description`, ignoring the new page-specific `page.meta.description`. Both social images still point to Swiss Army Knife assets on another documentation domain.

Use the page description when present and the site description only on pages without one. Replace the images with crawlable Flexible Horseshoe Card assets on the current domain. Although social metadata is not a direct Google ranking mechanism, correct previews improve discovery and avoid contradictory page signals.

Suggested template logic:

```jinja2
{% set description = config.site_description %}
{% if page and page.meta and page.meta.description %}
  {% set description = page.meta.description %}
{% endif %}
```

Use `{{ description }}` for both social description fields.

## High-priority findings

### 4. Correct and align page titles

The custom title suffix is misspelled as `Flexibile Horseshoe Card`. Google currently exposes that spelling in at least one indexed result. Change it to `Flexible Horseshoe Card`.

Several frontmatter titles do not match their content:

- `demo-card-electricity-many.md` still has the title `Functional Cards: Tomorrow Pollen Card`.
- `reuse-card-examples.md` is titled `Combining Calc with same_as`, while the page is a broader collection of reuse examples.
- The pollen page describes several cards, not only one tomorrow card.
- `Frontpage` is not a useful home-page search title.

Use a unique, concise title that matches the visible main heading. Keep the site-name suffix short and consistent.

### 5. Give each published page one clear H1

Several active pages start at H2 or contain no H1, including the examples overview, both demo-card pages, and the reuse card examples. Google uses the visible main title and heading elements when generating title links. Add one descriptive H1 near the start of every published page and keep it consistent with the frontmatter title.

Do not add multiple competing hero-sized headings. A predictable structure is sufficient:

```markdown
# Page subject

Short introductory paragraph.

## First section
```

### 6. Add meaningful image alt text

The demo and color-filter pages contain many images using empty alt text such as `![](...)`. These screenshots communicate card designs and differences, so most are not decorative. Add short alt text describing what each screenshot demonstrates, for example:

```markdown
![Electricity card with total usage and three phase indicators](../../assets/screenshots/example.webp)
```

Avoid repeating filenames or stuffing keywords. Images used only as duplicated light/dark presentation can share a concise description or be treated as decorative when the surrounding text already provides the full meaning.

### 7. Replace the site description (DONE!)

The current site description contains awkward wording: “allows you to create your horseshoe alike visualizations.” Use a clear summary that identifies the product and audience.

Suggested `site_description`:

> Documentation for the Flexible Horseshoe Card, a configurable Home Assistant dashboard card for data-driven horseshoes, layouts, styling, animations, and reusable YAML.

## Medium-priority findings

### 8. Strengthen contextual internal linking

The navigation provides crawlable links, and the introduction links to important sections. Add a small number of contextual links between closely related pages where they help readers continue a task:

- entity definitions to entity layout elements and localization;
- color stops to color filters and horseshoe configuration;
- positioning and groups to reuse examples;
- examples back to the relevant concepts demonstrated by each card;
- horseshoe documentation to ticks and labels once those pages contain content.

Use descriptive anchor text rather than “click here.” Do not add links merely to increase link counts.

### 9. Keep published URLs stable

The directory structure is clear and topic-based. Some demo URLs are verbose, but renaming already published URLs solely for shorter keywords is not worthwhile. If a URL must change, add a permanent redirect and update internal links and the sitemap to the canonical destination.

### 10. Clean and verify generated output before deployment

The checked-in `docs/site` output is stale and still contains old titles, descriptions, paths, and sitemap URLs. Perform a clean MkDocs build during deployment rather than relying on an incrementally generated directory. Verify that each active page has:

- one canonical URL on the current domain;
- its own title and meta description;
- no unexpected `noindex` directive;
- no Swiss Army Knife metadata or assets;
- a sitemap entry only when the page should be indexed.

### 11. Use Google Search Console after deployment

Submit the generated `sitemap.xml` in Search Console and inspect the home page plus representative documentation pages with URL Inspection. Monitor:

- indexed versus excluded pages;
- duplicate pages and Google-selected canonicals;
- crawled pages that should not exist;
- title and snippet behavior;
- mobile usability and Core Web Vitals.

Request recrawling only for important updated pages. Google may take days or weeks to reflect changed titles and snippets.

## What is already good

- The site is static and its primary documentation content is available without client-side rendering.
- `site_url` enables absolute canonical URLs and sitemap generation.
- Active topics are grouped into understandable directories.
- MkDocs Material provides responsive navigation and semantic document output.
- The updated page descriptions are unique and page-specific.
- The introduction provides useful links to major documentation topics.
- The project and repository names consistently identify the Flexible Horseshoe Card in most navigation and content.

## Recommended implementation order

1. Remove the global `HowTo` JSON-LD block. (DONE!)
2. Move or exclude old, copied, draft, and empty pages from the published documentation source. (DONE!)
3. Fix the `Flexibile` title typo and incorrect page titles. (DONE!)
4. Make Open Graph and Twitter metadata page-specific and replace Swiss Army Knife assets. (DONE!)
5. Add one H1 to every active page that lacks one.
6. Add descriptive alt text to meaningful screenshots.
7. Replace `site_description` and add useful contextual internal links.
8. Run a clean build, validate generated HTML and structured data, deploy, and submit the sitemap in Search Console.

## Google references

- [SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Control snippets and write meta descriptions](https://developers.google.com/search/docs/appearance/snippet)
- [Influence title links](https://developers.google.com/search/docs/appearance/title-link)
- [Consolidate duplicate URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- [Build and submit a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [General structured data guidelines](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)
- [Provide a site name](https://developers.google.com/search/docs/appearance/site-names)
- [Block indexing with `noindex`](https://developers.google.com/search/docs/crawling-indexing/block-indexing)
