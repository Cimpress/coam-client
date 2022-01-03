# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [0.4.1] - 2022.01.03
### Fixed
- Fixed error in createGroupWithUser related to checking status of error thrown

## [0.4.0] - 2021.12.09
### Fixed
- Updated all dependencies

## [0.3.2] - 2021.12.07
### Fixed
- Fixed incorrect TypeScript typings for createGroupWithUser

## [0.3.1] - 2021.12.07
### Fixed
- Fixed incorrect TypeScript typings for createGroupWithUser

## [0.3.0] - 2021.12.06
### Added
- TypeScript typings are now bundled with the package

## [0.2.8] - 2020.09.09
### Added
- Add function `getUserPermissionsForResourceTypes` to allow getting permissions for different resource types at once.

## [0.2.5] - 2020.06.18
### Added
- Add function `getUsersWithResource` to allow querying the COAM search endpoint for users with a list of permissions to a resource

## [0.2.4] - 2019.12.06
### Added
- Typescript typings

## [0.1.16] - 2019.09.10
### Changed
- Updated dependencies to address security vulnerabilities

## [0.1.15] - 2019.07.24
### Changed
- Wrap axios errors to avoid logging the http client's buffer.

## [0.1.14] - 2019.06.18
### Changed
- Allow getUsersWithPermission to be called with an undefined resourceIdentifier, as this parameter is now optional in the COAM API

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
