# HTTP Proxy Manager

A Firefox extension for managing multiple HTTP proxy configurations with authentication support.

## Features

- **Quick Add** - Paste proxy URLs to instantly add profiles
- **Multiple Profiles** - Save and switch between different proxy configurations
- **Authentication** - Support for username/password authenticated proxies
- **One-Click Toggle** - Enable/disable proxy with a single click
- **Persistent Storage** - Settings saved across browser sessions
- **Visual Feedback** - Icon changes to indicate proxy status

## Installation

### Temporary Installation (Development)

1. Open Firefox and navigate to `about:debugging`
2. Click **"This Firefox"** in the left sidebar
3. Click **"Load Temporary Add-on..."**
4. Select any file from the extension folder (e.g., `manifest.json`)

### Permanent Installation

1. Package the extension as a `.xpi` file
2. Submit to [Firefox Add-ons](https://addons.mozilla.org/) for signing
3. Install the signed extension

## Usage

### Quick Add (Recommended)

The fastest way to add a proxy:

1. Click the extension icon in the toolbar
2. Paste a proxy URL in the **Quick Add** field
3. Profile is added automatically!

**Supported formats:**
```
http://username:password@host:port
http://host:port
username:password@host:port
host:port
```

**Example:**
```
http://14ac02cb5f36f:ff805af7e9@185.123.144.151:12323
```

### Adding a Proxy Profile Manually

1. Click the extension icon in the toolbar
2. Click the **+** button to add a new profile
3. Fill in the details:
   - **Profile Name** - A friendly name (optional)
   - **Host** - Proxy server address (required)
   - **Port** - Proxy port (default: 8080)
   - **Username/Password** - For authenticated proxies (optional)
4. Click **"Add Profile"**

### Switching Profiles

Use the dropdown menu to select a different proxy profile. The selected profile becomes active immediately.

### Enabling/Disabling Proxy

Click the toggle switch in the top-right corner to enable or disable the proxy. The icon in the toolbar will change to indicate the current state:
- Blue circle = Proxy enabled
- Gray circle = Proxy disabled

### Deleting a Profile

1. Select the profile you want to delete
2. Click the **×** button
3. Confirm the deletion

## File Structure

```
ffproxy/
├── manifest.json      # Extension manifest
├── background.js      # Proxy request handler
├── popup.html         # Settings popup UI
├── popup.js           # Popup logic
├── icons/             # Extension icons
│   ├── proxy-off-*.svg
│   └── proxy-on-*.svg
├── README.md          # This file
├── CHANGELOG.md       # Version history
└── docs/
    └── DEVELOPMENT.md # Developer documentation
```

## Permissions

| Permission | Purpose |
|------------|---------|
| `proxy` | Required to intercept and route requests through proxy |
| `storage` | Save proxy profiles and settings |
| `webRequest` | Handle proxy authentication |
| `webRequestBlocking` | Provide credentials for authenticated proxies |
| `<all_urls>` | Apply proxy to all web requests |

## Browser Compatibility

- Firefox 91.0 or later
- Uses Manifest V2 for maximum compatibility

## License

MIT License
