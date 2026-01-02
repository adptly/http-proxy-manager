# HTTP Proxy Manager

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

| Permission | Purpose |
|------------|---------|
| `proxy` | Route browser traffic through configured proxy |
| `storage` | Save proxy profiles locally |
| `webRequest` | Handle proxy authentication requests |
| `webRequestBlocking` | Provide credentials for authenticated proxies |
| `<all_urls>` | Apply proxy to all web requests |

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

## License

MIT License
