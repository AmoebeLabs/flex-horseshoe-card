---
template: main.html
title: Installation
description: Install the Flexible Horseshoe Card through HACS or manually, then add the card resource to Home Assistant.
tags:
- HACS
- Installation
---

# Installation

The recommended way to install the Flexible Horseshoe Card is through HACS. This keeps the setup straightforward and makes future updates easier to manage.

Manual installation is also available when you prefer to manage the card files yourself.

!!! info "Home Assistant version"

    Flexible Horseshoe Card requires Home Assistant 2026.4 or newer so names, states, attributes, units, and translations follow Home Assistant consistently.

## :material-horseshoe: Install with HACS

[![hacs\_badge](https://img.shields.io/badge/HACS-Default-orange.svg?style=for-the-badge)](https://github.com/custom-components/hacs)

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=AmoebeLabs&repository=flex-horseshoe-card&category=Dashboard)

Use the button above to open the repository directly in HACS.

HACS can install both stable and latest available releases. The latest release may be a pre-release or development version, so use the stable release when reliability is more important than early access to new features.

<br><br>[![stable][stable-badge]][release-url]
[![stable-date][stable-date-badge]][release-url] <br>[![latest][latest-badge]][release-url]
[![latest-date][latest-date-badge]][release-url] <br>[![downloads][downloads-badge]][release-url]

After installation, restart or reload Home Assistant if required, then refresh the dashboard before adding the card to a view.

## :material-horseshoe: Manual installation

Use manual installation when you want to manage the JavaScript file yourself.

1. Download `dist/flex-horseshoe-card.js` from the GitHub releases page.
2. Copy the file to the `config/www` directory in Home Assistant.
3. Add the file as a Lovelace resource.

The file becomes available in Home Assistant at:

```text
/local/flex-horseshoe-card.js
```

Add the following resource definition:

```yaml linenums="1"
resources:
  - url: /local/flex-horseshoe-card.js
    type: module
```

### Dashboard editor

When using the dashboard editor, add the resource through the dashboard resource settings or the raw configuration editor.

### YAML mode

When using YAML mode, add the resource to the `resources.yaml` file included by your `ui-lovelace.yaml` configuration.

After adding or replacing the file, refresh the browser cache so Home Assistant loads the latest version.

## :material-horseshoe: Verify the installation

After installing the resource, add a card with:

```yaml linenums="1"
type: custom:flex-horseshoe-card
```

If Home Assistant recognizes the custom card, the installation is complete.

If the card is not found, check that:

* the file exists in `config/www`
* the resource URL is `/local/flex-horseshoe-card.js`
* the resource type is set to `module`
* the browser is not using an older cached file

## :material-horseshoe: Related links

* [HACS](https://hacs.xyz)
* [Flexible Horseshoe Card releases][release-url]
* [Home Assistant][home-assistant]

<!-- Badges -->

[hacs-url]: https://github.com/hacs/integration
[hacs-badge]: https://img.shields.io/badge/HACS-Default-41BDF5.svg?logo=homeassistantcommunitystore
[beta_badge]: https://img.shields.io/badge/State-Beta-orange?logo=homeassistantcommunitystore
[rc_badge]: https://img.shields.io/badge/State-Release%20Candidate-orange?logo=homeassistantcommunitystore
[maintain_badge]: https://img.shields.io/maintenance/yes/2100?logo=homeassistantcommunitystore
[release-badge]: https://img.shields.io/github/v/release/AmoebeLabs/flex-horseshoe-card?include_prereleases&logo=github
[latest-badge]: https://img.shields.io/github/v/release/AmoebeLabs/flex-horseshoe-card?include_prereleases&logo=github&label=latest
[latest-date-badge]: https://img.shields.io/github/release-date-pre/AmoebeLabs/flex-horseshoe-card?logo=github&label=latest%20date
[stable-badge]: https://img.shields.io/github/v/release/AmoebeLabs/flex-horseshoe-card?logo=github&label=stable&cacheSeconds=3600
[stable-date-badge]: https://img.shields.io/github/release-date/AmoebeLabs/flex-horseshoe-card?logo=github&label=stable%20date
[downloads-badge]: https://img.shields.io/github/downloads/AmoebeLabs/flex-horseshoe-card/total?logo=github&label=downloads%20since%20May%202026

<!-- References -->

[home-assistant]: https://www.home-assistant.io/
[hacs]: https://hacs.xyz
[release-url]: https://github.com/AmoebeLabs/flex-horseshoe-card/releases
