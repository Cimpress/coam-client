# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [0.1.13] - 2019.06.06
### Changed
- Downgrade axios until a fix for axios-retry is avaialble

## [0.1.12] - 2019.06.06
### Changed
- Updated deps to address security concerns

## [0.1.10] - 2019.03.25
### Added
- Include a convenience method for constructing a COAM group URL from an ID (buildGroupUrlFromId())

## [0.1.7] - 2019.02.06
### Added
- Fixed incorrect response of createGroup method

## [0.1.6] - 2019.01.17
### Added
- Pass shouldResetTimeout=true to axiosRetry to ensure better retry results
- Fixed searching for users with a specified permission for a resource.

## [0.1.4] - 2019.01.17
### Added
- Allow to search for users with a specified permission for a resource.

## [0.1.3] - 2018.12.05
### Fixed
- Fixed babel runtime issues, upgraded to babel 7

## [0.1.2] - 2018.12.05
### Added
- Get unique principal helper

## [0.1.0] - 2018.12.05
### Added
- Initial release

## [0.0.x] - 2018.11.30
### Added
- Initial version (PROTOTYPE)
