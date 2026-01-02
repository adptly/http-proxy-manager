document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("toggle");
  const status = document.getElementById("status");
  const errorMessage = document.getElementById("errorMessage");
  const successMessage = document.getElementById("successMessage");
  const quickAddInput = document.getElementById("quickAddInput");
  const quickAddBtn = document.getElementById("quickAddBtn");
  const profileSelect = document.getElementById("profileSelect");
  const newProfileBtn = document.getElementById("newProfile");
  const deleteProfileBtn = document.getElementById("deleteProfile");
  const profileForm = document.getElementById("profileForm");
  const noProfiles = document.getElementById("noProfiles");
  const nameInput = document.getElementById("name");
  const hostInput = document.getElementById("host");
  const portInput = document.getElementById("port");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const saveButton = document.getElementById("save");
  const cancelButton = document.getElementById("cancel");

  let state = {
    enabled: false,
    activeProfileId: null,
    profiles: []
  };

  let isNewProfile = false;

  // Parse proxy URL in format: http://user:pass@host:port or host:port
  function parseProxyUrl(input) {
    input = input.trim();

    // Try parsing as URL first
    // Formats supported:
    // http://user:pass@host:port
    // http://host:port
    // user:pass@host:port
    // host:port

    let host, port, username, password;

    // Remove protocol if present
    let urlPart = input.replace(/^https?:\/\//, '');

    // Check for auth (user:pass@)
    const atIndex = urlPart.lastIndexOf('@');
    if (atIndex !== -1) {
      const authPart = urlPart.substring(0, atIndex);
      urlPart = urlPart.substring(atIndex + 1);

      const colonIndex = authPart.indexOf(':');
      if (colonIndex !== -1) {
        username = authPart.substring(0, colonIndex);
        password = authPart.substring(colonIndex + 1);
      } else {
        username = authPart;
        password = '';
      }
    }

    // Parse host:port
    const portMatch = urlPart.match(/:(\d+)$/);
    if (portMatch) {
      port = parseInt(portMatch[1], 10);
      host = urlPart.substring(0, urlPart.length - portMatch[0].length);
    } else {
      host = urlPart;
      port = 8080; // default port
    }

    // Remove trailing slash or path
    host = host.split('/')[0];

    if (!host) {
      return null;
    }

    return { host, port, username: username || '', password: password || '' };
  }

  // Show error message
  function showError(message) {
    successMessage.classList.add("hidden");
    errorMessage.textContent = message;
    errorMessage.classList.remove("hidden");
    setTimeout(() => {
      errorMessage.classList.add("hidden");
    }, 3000);
  }

  // Show success message
  function showSuccess(message) {
    errorMessage.classList.add("hidden");
    successMessage.textContent = message;
    successMessage.classList.remove("hidden");
    setTimeout(() => {
      successMessage.classList.add("hidden");
    }, 3000);
  }

  // Hide error message
  function hideError() {
    errorMessage.classList.add("hidden");
    successMessage.classList.add("hidden");
  }

  // Load state from background
  function loadState() {
    browser.runtime.sendMessage({ type: "getState" })
      .then((s) => {
        state = s;
        updateUI();
      })
      .catch((err) => {
        showError("Failed to load settings");
        console.error("Load state error:", err);
      });
  }

  // Update the entire UI based on state
  function updateUI() {
    updateToggleUI(state.enabled);
    updateProfileSelect();
    updateForm();
  }

  // Update toggle visual state
  function updateToggleUI(enabled) {
    const hasProfiles = state.profiles.length > 0;
    const activeProfile = state.profiles.find(p => p.id === state.activeProfileId);
    const canEnable = hasProfiles && activeProfile && activeProfile.host;

    // Update disabled state
    if (canEnable) {
      toggle.classList.remove("disabled");
    } else {
      toggle.classList.add("disabled");
    }

    // Update enabled state
    if (enabled && canEnable) {
      toggle.classList.add("enabled");
      toggle.setAttribute("aria-checked", "true");
      status.textContent = "On";
      status.classList.add("on");
    } else {
      toggle.classList.remove("enabled");
      toggle.setAttribute("aria-checked", "false");
      status.textContent = "Off";
      status.classList.remove("on");
    }
  }

  // Populate profile dropdown
  function updateProfileSelect() {
    profileSelect.innerHTML = "";

    if (state.profiles.length === 0) {
      profileSelect.innerHTML = '<option value="">No profiles</option>';
      profileForm.classList.add("hidden");
      noProfiles.classList.remove("hidden");
      deleteProfileBtn.disabled = true;
    } else {
      noProfiles.classList.add("hidden");
      profileForm.classList.remove("hidden");
      deleteProfileBtn.disabled = false;

      state.profiles.forEach((profile) => {
        const option = document.createElement("option");
        option.value = profile.id;
        option.textContent = profile.name || `${profile.host}:${profile.port}`;
        if (profile.id === state.activeProfileId) {
          option.selected = true;
        }
        profileSelect.appendChild(option);
      });
    }
  }

  // Update form with selected profile
  function updateForm() {
    if (isNewProfile) {
      nameInput.value = "";
      hostInput.value = "";
      portInput.value = "8080";
      usernameInput.value = "";
      passwordInput.value = "";
      saveButton.textContent = "Add Profile";
      cancelButton.classList.remove("hidden");
      return;
    }

    cancelButton.classList.add("hidden");
    const profile = state.profiles.find(p => p.id === state.activeProfileId);
    if (profile) {
      nameInput.value = profile.name || "";
      hostInput.value = profile.host || "";
      portInput.value = profile.port || 8080;
      usernameInput.value = profile.username || "";
      passwordInput.value = profile.password || "";
      saveButton.textContent = "Save Profile";
    }
  }

  // Validate port number
  function validatePort(port) {
    const portNum = parseInt(port, 10);
    return portNum >= 1 && portNum <= 65535;
  }

  // Toggle proxy on/off
  toggle.addEventListener("click", () => {
    const hasProfiles = state.profiles.length > 0;
    const activeProfile = state.profiles.find(p => p.id === state.activeProfileId);
    const canEnable = hasProfiles && activeProfile && activeProfile.host;

    if (!state.enabled && !canEnable) {
      showError("Add a profile first");
      return;
    }

    browser.runtime.sendMessage({ type: "toggle" })
      .then((response) => {
        if (response.error) {
          showError(response.error);
          return;
        }
        state.enabled = response.enabled;
        updateToggleUI(state.enabled);
      })
      .catch((err) => {
        showError("Failed to toggle proxy");
        console.error("Toggle error:", err);
      });
  });

  // Keyboard support for toggle
  toggle.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle.click();
    }
  });

  // Profile selection changed
  profileSelect.addEventListener("change", () => {
    const profileId = profileSelect.value;
    if (profileId) {
      isNewProfile = false;
      browser.runtime.sendMessage({ type: "setActiveProfile", profileId })
        .then(() => {
          state.activeProfileId = profileId;
          updateForm();
          updateToggleUI(state.enabled);
        })
        .catch((err) => {
          showError("Failed to switch profile");
          console.error("Switch profile error:", err);
        });
    }
  });

  // New profile button
  newProfileBtn.addEventListener("click", () => {
    isNewProfile = true;
    profileForm.classList.remove("hidden");
    noProfiles.classList.add("hidden");
    updateForm();
    nameInput.focus();
  });

  // Cancel button
  cancelButton.addEventListener("click", () => {
    isNewProfile = false;
    hideError();
    if (state.profiles.length === 0) {
      profileForm.classList.add("hidden");
      noProfiles.classList.remove("hidden");
    } else {
      updateForm();
    }
  });

  // Quick add - add profile from URL
  function quickAddProfile() {
    const input = quickAddInput.value.trim();
    if (!input) {
      showError("Paste a proxy URL first");
      quickAddInput.focus();
      return;
    }

    const parsed = parseProxyUrl(input);
    if (!parsed) {
      showError("Invalid proxy URL format");
      quickAddInput.focus();
      return;
    }

    if (!validatePort(parsed.port)) {
      showError("Invalid port number");
      quickAddInput.focus();
      return;
    }

    const profile = {
      name: `${parsed.host}:${parsed.port}`,
      host: parsed.host,
      port: parsed.port,
      username: parsed.username,
      password: parsed.password
    };

    browser.runtime.sendMessage({ type: "addProfile", profile })
      .then((response) => {
        if (!response.success) {
          showError(response.error || "Failed to add profile");
          return;
        }
        quickAddInput.value = "";
        state.activeProfileId = response.profile.id;
        loadState();
        showSuccess("Profile added!");
      })
      .catch((err) => {
        showError("Failed to add profile");
        console.error("Quick add error:", err);
      });
  }

  quickAddBtn.addEventListener("click", quickAddProfile);

  // Quick add on Enter key
  quickAddInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      quickAddProfile();
    }
  });

  // Auto-detect and add on paste
  quickAddInput.addEventListener("paste", (e) => {
    // Wait for paste to complete
    setTimeout(() => {
      const value = quickAddInput.value.trim();
      if (value && parseProxyUrl(value)) {
        quickAddProfile();
      }
    }, 50);
  });

  // Delete profile button
  deleteProfileBtn.addEventListener("click", () => {
    if (!state.activeProfileId) return;

    const profile = state.profiles.find(p => p.id === state.activeProfileId);
    if (profile && confirm(`Delete profile "${profile.name}"?`)) {
      browser.runtime.sendMessage({ type: "deleteProfile", profileId: state.activeProfileId })
        .then((response) => {
          if (response.enabled !== undefined) {
            state.enabled = response.enabled;
          }
          loadState();
        })
        .catch((err) => {
          showError("Failed to delete profile");
          console.error("Delete error:", err);
        });
    }
  });

  // Save profile
  saveButton.addEventListener("click", () => {
    hideError();

    const host = hostInput.value.trim();
    if (!host) {
      showError("Host is required");
      hostInput.focus();
      return;
    }

    const port = portInput.value;
    if (!validatePort(port)) {
      showError("Port must be 1-65535");
      portInput.focus();
      return;
    }

    const profile = {
      name: nameInput.value.trim() || `${host}:${port}`,
      host: host,
      port: parseInt(port, 10),
      username: usernameInput.value,
      password: passwordInput.value
    };

    if (isNewProfile) {
      browser.runtime.sendMessage({ type: "addProfile", profile })
        .then((response) => {
          if (!response.success) {
            showError(response.error || "Failed to add profile");
            return;
          }
          isNewProfile = false;
          state.activeProfileId = response.profile.id;
          loadState();
          showSaved();
        })
        .catch((err) => {
          showError("Failed to add profile");
          console.error("Add profile error:", err);
        });
    } else {
      profile.id = state.activeProfileId;
      browser.runtime.sendMessage({ type: "updateProfile", profile })
        .then((response) => {
          if (!response.success) {
            showError(response.error || "Failed to update profile");
            return;
          }
          loadState();
          showSaved();
        })
        .catch((err) => {
          showError("Failed to update profile");
          console.error("Update profile error:", err);
        });
    }
  });

  function showSaved() {
    const originalText = saveButton.textContent;
    saveButton.textContent = "Saved!";
    setTimeout(() => {
      saveButton.textContent = originalText;
    }, 1500);
  }

  // Initial load
  loadState();
});
