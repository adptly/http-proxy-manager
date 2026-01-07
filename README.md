# HTTP Proxy Manager

[![Firefox Add-on](https://img.shields.io/amo/v/http-proxy-manager?label=Firefox%20Add-on&logo=firefox)](https://addons.mozilla.org/firefox/addon/http-proxy-manager/)
[![Users](https://img.shields.io/amo/users/http-proxy-manager?label=Users)](https://addons.mozilla.org/firefox/addon/http-proxy-manager/)
[![Rating](https://img.shields.io/amo/rating/http-proxy-manager?label=Rating)](https://addons.mozilla.org/firefox/addon/http-proxy-manager/reviews/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A simple proxy manager for Firefox. Add proxies by pasting URLs, switch between multiple profiles, and connect to authenticated proxies with one click.

## Install

[Get it on Firefox Add-ons](https://addons.mozilla.org/firefox/addon/http-proxy-manager/)

## Features

- **Quick Add** - Paste proxy URLs to instantly add profiles
- **Multiple Profiles** - Save and switch between proxy configurations
- **Authentication** - Username/password support for authenticated proxies
- **One-Click Toggle** - Enable/disable proxy instantly
- **Dark UI** - Clean, modern dark interface
- **Visual Status** - Icon changes to indicate proxy state

## Screenshots

<p align="center">
  <img src="docs/screenshots/screenshot-1-main-interface.png" alt="Main Interface" width="400">
  <br>
  <em>Main interface with proxy toggle and Quick Add field</em>
</p>

<p align="center">
  <img src="docs/screenshots/screenshot-2-quick-add.png" alt="Quick Add Feature" width="400">
  <br>
  <em>Paste proxy URLs to add profiles instantly</em>
</p>

<p align="center">
  <img src="docs/screenshots/screenshot-3-profile-management.png" alt="Profile Management" width="400">
  <br>
  <em>Manage proxy profiles with authentication support</em>
</p>

<p align="center">
  <img src="docs/screenshots/screenshot-4-active-proxy.png" alt="Active Proxy" width="400">
  <br>
  <em>Visual confirmation when proxy is active</em>
</p>

## Usage

### Quick Add (Recommended)

1. Click the extension icon in the toolbar
2. Paste a proxy URL in the **Quick Add** field
3. Profile is added automatically

**Supported formats:**
```
http://username:password@host:port
http://host:port
username:password@host:port
host:port
```

### Manual Setup

1. Click the **+** button to add a new profile
2. Enter proxy details:
   - **Host** - Proxy server address
   - **Port** - Proxy port (default: 8080)
   - **Username/Password** - For authenticated proxies (optional)
3. Click **Save Profile**

### Switching Profiles

Use the dropdown to switch between saved profiles. Changes apply immediately.

### Toggle Proxy

Click the toggle switch to enable/disable the proxy. The toolbar icon indicates status:
- Blue = Proxy enabled
- Gray = Proxy disabled

## Permissions

This extension requires the following permissions to function:

| Permission | Purpose |
|------------|---------|
| `proxy` | Route browser traffic through configured proxy |
| `storage` | Save proxy profiles locally |
| `webRequest` | Handle proxy authentication requests |
| `webRequestBlocking` | Provide credentials for authenticated proxies |
| `<all_urls>` | Apply proxy to all web requests |

**Privacy:** This extension does not collect, transmit, or share any user data. All proxy configurations are stored locally in your browser.

## Requirements

- Firefox 142 or later
- Manifest V2

## Development

### Load Temporarily

1. Open `about:debugging` in Firefox
2. Click **This Firefox**
3. Click **Load Temporary Add-on**
4. Select `manifest.json`

### Build

```bash
zip -r http-proxy-manager.zip manifest.json background.js popup.js popup.html icons/
```

See [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) for technical documentation.

## Support

- **Bug Reports:** [Open an issue](https://github.com/adptly/http-proxy-manager/issues)
- **Feature Requests:** [Submit a request](https://github.com/adptly/http-proxy-manager/issues/new?template=feature_request.md)
- **Security Issues:** Report privately to code@adptly.com (see [SECURITY.md](SECURITY.md))
- **Questions:** [Start a discussion](https://github.com/adptly/http-proxy-manager/discussions)

## Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md) before submitting pull requests.

## Versioning

This project follows [Semantic Versioning](https://semver.org/). For the versions available, see the [CHANGELOG](CHANGELOG.md).

## License

MIT License - see the [LICENSE](LICENSE) file for details.
