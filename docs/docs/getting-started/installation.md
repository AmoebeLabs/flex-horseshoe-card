---
template: main.html
title: Installation
description: Install the Flexible Horseshoe Card through HACS or manually, then add the card resource to Home Assistant.
tags:
  - HACS
  - Installation
---

# Installation

The recommended way to install the Flexible Horseshoe Card is through HACS. This keeps installation simple and makes it easier to update the card when a new version is released.

Manual installation is also possible if you prefer to manage the card files yourself.

## Install via HACS

[![hacs_badge](https://img.shields.io/badge/HACS-Default-orange.svg?style=for-the-badge)](https://github.com/custom-components/hacs)

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=AmoebeLabs&repository=flex-horseshoe-card&category=Dashboard)

HACS can install both stable and latest available versions. The latest version may be a pre-release or development version.

<br><br>[![stable][stable-badge]][release-url]
[![stable-date][stable-date-badge]][release-url]
<br>[![latest][latest-badge]][release-url]
[![latest-date][latest-date-badge]][release-url]
<br>[![downloads][downloads-badge]][release-url]

## Manual installation

1. Download `dist/flex-horseshoe-card.js` from GitHub.

2. Copy the file into your Home Assistant `config/www` directory.

3. Add the card as a Lovelace resource.

If you use the dashboard editor UI, add the resource in the raw configuration editor.

If you use YAML mode, add the resource to the `resources.yaml` file that is included in your `ui-lovelace.yaml` file.

```yaml
resources:
  - url: /local/flex-horseshoe-card.js
    type: module
```

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
