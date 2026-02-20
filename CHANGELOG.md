# Changelog

All notable changes to this project are documented in this file.

## [0.3.1] - 2026-02-20

### Fixed

- Reduced page interference by separating extension UI styles from page content flow (`fdc14fa`).
- Fixed text segmentation and re-scan behavior in content processing (`0534d16`).

### Changed

- Migrated dependency management to pnpm (`42cc38c`).
- Upgraded Biome to `2.4.3` (`861c6d1`).

### Build

- Added CRX packaging script with private key based signing flow (`a60196f`).

### Docs

- Added bilingual README support (`README.md` + `README_ja.md`) and translated source comments to English (`2320631`).

## [0.3.0] - 2025-07-29

### Added

- Added IP address classification support for detected/converted addresses (`0ba70c7`).

### Changed

- Bumped version to `0.3.0` (`2c9abb4`).

### Docs

- Improved README feature wording and project descriptions (`ef327bf`).

## [0.2.1] - 2025-07-23

### Changed

- Prepared release and Chrome Web Store related project structure updates (`82a2321`, `bbbc2ad`, `b2cd630`).

### Fixed

- Updated store metadata to resolve Chrome Web Store keyword spam compliance issue (`0952717`).

## [0.2.0] - 2025-07-16

### Added

- Added IPv4 support and related refactoring (`463d3aa`).
- Added context-menu based conversion from selected text (`9a2764c`).
- Improved popup UX with auto-conversion and layout updates (`c359afa`).

### Changed

- Standardized IPv6 regex behavior to exact match patterns (`ec4a30f`).

### Docs

- Updated README and store-related project documentation (`9cb6386`, `1e53804`, `ce678a7`).

## [0.1.0] - 2025-07-14

### Added

- Added settings/options page and UI internationalization improvements (`b86ef03`).
- Added hover tooltip enhancements and shared component structure (`c931db4`).
- Added Chrome Web Store assets and listing descriptions (`eb74806`, `676fd38`).

### Fixed

- Fixed IPv6 regex bug and strengthened related security behavior (`73aca15`).

### Changed

- Bumped version to `0.1.0` (`564901c`).

## [0.0.1] - 2025-07-12

### Added

- Initial Chrome extension implementation for IPv6 conversion (`28ea451`).
