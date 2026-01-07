# Development Guide

Technical documentation for developing and extending HTTP Proxy Manager.

## Architecture Overview

```
┌─────────────────┐     messages      ┌──────────────────┐
│   popup.js      │ ◄───────────────► │  background.js   │
│   (UI Logic)    │                   │  (Proxy Handler) │
└────────┬────────┘                   └────────┬─────────┘
         │                                     │
         ▼                                     ▼
┌─────────────────┐                   ┌──────────────────┐
│   popup.html    │                   │ browser.proxy    │
│   (Settings UI) │                   │ (Firefox API)    │
└─────────────────┘                   └──────────────────┘
```

## Storage Schema

Data is stored in `browser.storage.local` under the key `proxyState`:

```javascript
{
  enabled: boolean,           // Is proxy currently active
  activeProfileId: string,    // ID of selected profile
  profiles: [
    {
      id: string,             // Unique identifier (generated)
      name: string,           // Display name
      host: string,           // Proxy server hostname/IP
      port: number,           // Proxy port (1-65535)
      username: string,       // Auth username (optional)
      password: string        // Auth password (optional)
    }
  ]
}
```

### Migration

When upgrading from v1.0.0, the old `proxyConfig` format is automatically migrated:

```javascript
// Old format (v1.0.0)
{
  enabled: boolean,
  host: string,
  port: number,
  username: string,
  password: string,
  type: string
}

// Automatically converted to new format
```

## Message API

Communication between popup and background script uses `browser.runtime.sendMessage()`.

### Messages

| Type | Direction | Payload | Response |
|------|-----------|---------|----------|
| `getState` | popup → bg | - | `state` object |
| `toggle` | popup → bg | - | `{ enabled, error? }` |
| `setActiveProfile` | popup → bg | `{ profileId }` | `{ success }` |
| `addProfile` | popup → bg | `{ profile }` | `{ success, profile?, error? }` |
| `updateProfile` | popup → bg | `{ profile }` | `{ success, error? }` |
| `deleteProfile` | popup → bg | `{ profileId }` | `{ success, enabled }` |

## Proxy Configuration

The extension uses Firefox's `browser.proxy.onRequest` API:

```javascript
browser.proxy.onRequest.addListener(
  handleProxyRequest,
  { urls: ["<all_urls>"] }
);

function handleProxyRequest(requestInfo) {
  // Return proxy config or { type: "direct" }
  return {
    type: "http",
    host: "proxy.example.com",
    port: 8080
  };
}
```

### Authentication

HTTP proxy authentication is handled via `browser.webRequest.onAuthRequired`:

```javascript
browser.webRequest.onAuthRequired.addListener(
  handleAuthRequired,
  { urls: ["<all_urls>"] },
  ["blocking"]
);

function handleAuthRequired(details) {
  if (details.isProxy) {
    return {
      authCredentials: {
        username: "user",
        password: "pass"
      }
    };
  }
  return {};
}
```

## Testing

### Manual Testing

1. Load extension via `about:debugging`
2. Open popup and add a proxy profile
3. Enable proxy
4. Visit [whatismyip.com](https://whatismyip.com) to verify IP change
5. Check browser console for errors

### Test Cases

- [ ] Add new profile with valid data
- [ ] Add profile with invalid port (should show error)
- [ ] Add profile without host (should show error)
- [ ] Switch between profiles
- [ ] Enable/disable proxy toggle
- [ ] Delete profile while proxy enabled
- [ ] Delete last profile (should auto-disable)
- [ ] Toggle when no profiles exist (should show error)
- [ ] Authenticated proxy connection
- [ ] Migration from v1.0.0 format

## Building for Distribution

### Package as XPI

```bash
cd ffproxy
zip -r ../http-proxy-manager.xpi * -x "*.md" -x "docs/*"
```

### Submit to AMO

1. Create account at [addons.mozilla.org](https://addons.mozilla.org/developers/)
2. Click "Submit a New Add-on"
3. Choose distribution:
   - **Listed** - Public on AMO, full review (days/weeks)
   - **Unlisted** - Self-distributed, automated signing (minutes)
4. Upload the `.zip` file
5. Fill in metadata (name, description, categories)
6. Download signed `.xpi` once processed

## Extending

### Adding SOCKS Support

To add SOCKS proxy support:

1. Update popup.html with proxy type dropdown
2. Store `type` in profile schema
3. Modify `handleProxyRequest()` in background.js:

```javascript
return {
  type: profile.type, // "http", "https", "socks", "socks4"
  host: profile.host,
  port: profile.port,
  proxyDNS: profile.type === "socks" // DNS through proxy
};
```

### Adding URL Bypass

To add URL bypass patterns:

1. Add `bypassList` array to storage schema
2. Check URL against patterns in `handleProxyRequest()`:

```javascript
function handleProxyRequest(requestInfo) {
  const url = requestInfo.url;

  for (const pattern of bypassList) {
    if (url.match(pattern)) {
      return { type: "direct" };
    }
  }

  return proxyConfig;
}
```

## Debugging

### View Background Script Logs

1. Go to `about:debugging`
2. Click **"This Firefox"**
3. Find the extension and click **"Inspect"**
4. Check the Console tab

### Common Issues

| Issue | Solution |
|-------|----------|
| Proxy not working | Check host/port, verify proxy server is running |
| Auth failing | Verify username/password, check proxy server logs |
| Extension not loading | Check manifest.json for syntax errors |
| Storage not persisting | Verify `storage` permission in manifest |
