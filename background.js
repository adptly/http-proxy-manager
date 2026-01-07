// Proxy state with multiple profiles
let state = {
  enabled: false,
  activeProfileId: null,
  profiles: []
};

// Migrate from old single-proxy format to new multi-profile format
function migrateFromOldFormat(oldConfig) {
  const profile = {
    id: generateId(),
    name: oldConfig.host ? `${oldConfig.host}:${oldConfig.port}` : "Migrated Proxy",
    host: oldConfig.host || "",
    port: oldConfig.port || 8080,
    username: oldConfig.username || "",
    password: oldConfig.password || ""
  };

  return {
    enabled: oldConfig.enabled || false,
    activeProfileId: profile.host ? profile.id : null,
    profiles: profile.host ? [profile] : []
  };
}

// Load saved state on startup (with migration support)
browser.storage.local.get(["proxyState", "proxyConfig"]).then((result) => {
  if (result.proxyState) {
    // New format exists
    state = result.proxyState;
  } else if (result.proxyConfig) {
    // Old format exists - migrate it
    state = migrateFromOldFormat(result.proxyConfig);
    // Save in new format and remove old key
    browser.storage.local.set({ proxyState: state });
    browser.storage.local.remove("proxyConfig");
    console.log("Migrated from old proxyConfig format");
  }
  updateProxyState();
});

// Get active profile
function getActiveProfile() {
  if (!state.activeProfileId) return null;
  return state.profiles.find(p => p.id === state.activeProfileId);
}

// Handle proxy requests
function handleProxyRequest(requestInfo) {
  const profile = getActiveProfile();

  if (!state.enabled || !profile || !profile.host) {
    return { type: "direct" };
  }

  return {
    type: "http",
    host: profile.host,
    port: parseInt(profile.port, 10)
  };
}

// Handle proxy authentication
function handleAuthRequired(details) {
  if (!details.isProxy || !state.enabled) {
    return {};
  }

  const profile = getActiveProfile();
  if (profile && profile.username) {
    return {
      authCredentials: {
        username: profile.username,
        password: profile.password
      }
    };
  }

  return {};
}

// Update proxy state and icon
function updateProxyState() {
  const profile = getActiveProfile();

  if (state.enabled && profile && profile.host) {
    // Register proxy handler
    if (!browser.proxy.onRequest.hasListener(handleProxyRequest)) {
      browser.proxy.onRequest.addListener(handleProxyRequest, { urls: ["<all_urls>"] });
    }

    // Register auth handler
    if (!browser.webRequest.onAuthRequired.hasListener(handleAuthRequired)) {
      browser.webRequest.onAuthRequired.addListener(
        handleAuthRequired,
        { urls: ["<all_urls>"] },
        ["blocking"]
      );
    }

    // Update icon to "on" state
    browser.browserAction.setIcon({
      path: {
        16: "icons/proxy-on-16.svg",
        32: "icons/proxy-on-32.svg"
      }
    });
    browser.browserAction.setTitle({ title: `Proxy: ${profile.name} (${profile.host}:${profile.port})` });
  } else {
    // Remove listeners when disabled
    if (browser.proxy.onRequest.hasListener(handleProxyRequest)) {
      browser.proxy.onRequest.removeListener(handleProxyRequest);
    }
    if (browser.webRequest.onAuthRequired.hasListener(handleAuthRequired)) {
      browser.webRequest.onAuthRequired.removeListener(handleAuthRequired);
    }

    // Update icon to "off" state
    browser.browserAction.setIcon({
      path: {
        16: "icons/proxy-off-16.svg",
        32: "icons/proxy-off-32.svg"
      }
    });
    browser.browserAction.setTitle({ title: "HTTP Proxy Manager (Off)" });
  }
}

// Save state to storage
function saveState() {
  browser.storage.local.set({ proxyState: state });
}

// Generate unique ID for profiles
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// Listen for messages from popup
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case "getState":
      sendResponse(state);
      return true;

    case "toggle":
      // Can only enable if there's an active profile with a host
      const activeProfile = getActiveProfile();
      if (!state.enabled && (!activeProfile || !activeProfile.host)) {
        sendResponse({ enabled: false, error: "No active profile configured" });
        return true;
      }
      state.enabled = !state.enabled;
      saveState();
      updateProxyState();
      sendResponse({ enabled: state.enabled });
      return true;

    case "setActiveProfile":
      state.activeProfileId = message.profileId;
      saveState();
      updateProxyState();
      sendResponse({ success: true });
      return true;

    case "addProfile":
      const port = parseInt(message.profile.port, 10) || 8080;
      if (port < 1 || port > 65535) {
        sendResponse({ success: false, error: "Port must be between 1 and 65535" });
        return true;
      }
      const newProfile = {
        id: generateId(),
        name: message.profile.name || "New Proxy",
        host: message.profile.host,
        port: port,
        username: message.profile.username || "",
        password: message.profile.password || ""
      };
      state.profiles.push(newProfile);
      if (!state.activeProfileId) {
        state.activeProfileId = newProfile.id;
      }
      saveState();
      updateProxyState();
      sendResponse({ success: true, profile: newProfile });
      return true;

    case "updateProfile":
      const updatePort = parseInt(message.profile.port, 10) || 8080;
      if (updatePort < 1 || updatePort > 65535) {
        sendResponse({ success: false, error: "Port must be between 1 and 65535" });
        return true;
      }
      const idx = state.profiles.findIndex(p => p.id === message.profile.id);
      if (idx !== -1) {
        state.profiles[idx] = { ...state.profiles[idx], ...message.profile, port: updatePort };
        saveState();
        updateProxyState();
        sendResponse({ success: true });
      } else {
        sendResponse({ success: false, error: "Profile not found" });
      }
      return true;

    case "deleteProfile":
      state.profiles = state.profiles.filter(p => p.id !== message.profileId);
      if (state.activeProfileId === message.profileId) {
        state.activeProfileId = state.profiles.length > 0 ? state.profiles[0].id : null;
      }
      // Auto-disable if no profiles left
      if (state.profiles.length === 0) {
        state.enabled = false;
      }
      saveState();
      updateProxyState();
      sendResponse({ success: true, enabled: state.enabled });
      return true;

    default:
      sendResponse({ success: false, error: "Unknown message type" });
      return true;
  }
});

// Handle proxy errors
browser.proxy.onError.addListener((error) => {
  console.error("Proxy error:", error.message);
});
