---
template: main.html
title: Installation of the card
description: The preferred way to install the flexible horseshoe card is using HACS from within your Home Assistant dashboard.\
tags:
  - HACS
  - Installation
---


## Install via HACS

[![hacs_badge](https://img.shields.io/badge/HACS-Default-orange.svg?style=for-the-badge)](https://github.com/custom-components/hacs)

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=AmoebeLabs&repository=flex-horseshoe-card&category=Dashboard)


HACS allows you to download Stable and Latest available versions where the latest can be a pre-release (DEV) version:
<br><br>[![stable][stable-badge]][release-url]
[![stable-date][stable-date-badge]][release-url]
<br>[![latest][latest-badge]][release-url]
[![latest-date][latest-date-badge]][release-url]
<br>[![downloads][downloads-badge]][release-url]

## Manual install

1. Download and copy `dist/flex-horseshoe-card.js` from github into your `config/www` directory.

2. If using the editor UI: Add a reference to `flex-horseshoe-card.js` inside your `ui-lovelace.yaml` or at the top of the _raw config editor UI_.
3. If using yaml mode, add a reference in the resources.yaml file that is !included in your `ui-lovelac.yaml` file

```yaml
resources:
  - url: /community/flex-horseshoe-card/flex-horseshoe-card.js
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