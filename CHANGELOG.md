# Changelog

All notable changes to HTTP Proxy Manager are documented here.

Format based on [Keep a Changelog](https://keepachangelog.com/).

## [1.2.1] - 2026-01-02

### Changed
- Minimum Firefox version updated to 142.0 (required for AMO data collection permissions)
- Updated `default_title` to "HTTP Proxy Manager" for consistency
- Enhanced README with Support section, SemVer documentation, and privacy statement
- Improved documentation and community health files

### Fixed
- Fixed deprecated `substr()` method, replaced with `substring()`
- Fixed `data_collection_permissions` format for AMO compliance

## [1.2.0] - 2026-01-01

### Added
- Quick Add feature - paste proxy URLs to instantly create profiles
- Auto-add on paste - profiles created automatically when valid URL is pasted
- Support for multiple URL formats (http://user:pass@host:port, host:port, etc.)
- Success message feedback

## [1.1.0] - 2026-01-01

### Added
- Multiple proxy profile support
- Profile management (add, edit, delete, switch)
- Cancel button when creating new profiles
- Error message display in popup
- Storage migration from v1.0.0 format
- Keyboard accessibility (Enter/Space to toggle)
- ARIA labels for screen readers
- Port validation (1-65535)
- Auto-disable proxy when last profile is deleted

### Changed
- Renamed extension from "Simple Proxy" to "HTTP Proxy Manager"
- Updated storage schema to support multiple profiles
- Improved toggle visual feedback with disabled state

### Fixed
- Added missing `proxy-on-48.svg` and `proxy-on-96.svg` icons
- Added error handling for all async operations

## [1.0.0] - 2026-01-01

### Added
- Initial release
- Single HTTP proxy configuration
- Enable/disable toggle
- Username/password authentication
- Persistent storage
- Visual status icons
