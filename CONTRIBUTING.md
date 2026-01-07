# Contributing to HTTP Proxy Manager

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Code of Conduct

This project adheres to the Contributor Covenant [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How to Contribute

### Reporting Bugs

Before creating a bug report, please check existing issues to avoid duplicates.

**Good bug reports include:**
- Clear, descriptive title
- Steps to reproduce the issue
- Expected vs actual behavior
- Firefox version and extension version
- Console errors (if applicable)

**Template:**
```
**Description:** Brief description of the bug

**Steps to Reproduce:**
1. Go to...
2. Click on...
3. See error

**Expected:** What should happen
**Actual:** What actually happens

**Environment:**
- Firefox version:
- Extension version:
- OS:

**Console errors:** (if any)
```

### Suggesting Features

Feature suggestions are welcome! Please:
- Check existing issues first
- Describe the use case clearly
- Explain why this would be useful to users
- Consider implementation complexity

### Pull Requests

#### Before submitting:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Test your changes thoroughly
4. Follow the existing code style
5. Update documentation if needed

#### PR Guidelines:
- Reference related issues
- Describe what changes were made and why
- Include screenshots for UI changes
- Test on Firefox (latest version)
- Ensure the extension loads without errors

**PR Template:**
```
**Description:** Brief description of changes

**Related Issue:** Fixes #123

**Changes:**
- Change 1
- Change 2

**Testing:**
- [ ] Tested loading extension
- [ ] Tested adding/editing/deleting profiles
- [ ] Tested proxy toggle
- [ ] Tested authentication (if applicable)
- [ ] No console errors
```

## Development Setup

See [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) for technical documentation.

### Quick Start

1. Clone the repository
```bash
git clone https://github.com/adptly/http-proxy-manager.git
cd http-proxy-manager
```

2. Load in Firefox
- Open `about:debugging`
- Click "This Firefox"
- Click "Load Temporary Add-on"
- Select `manifest.json`

3. Make changes and reload
- After editing files, click "Reload" in about:debugging

### Testing Changes

Manual testing checklist:
- [ ] Add new profile with valid data
- [ ] Add profile with invalid data (should show errors)
- [ ] Switch between profiles
- [ ] Enable/disable proxy toggle
- [ ] Delete active profile
- [ ] Delete last profile (should auto-disable)
- [ ] Test with authenticated proxy
- [ ] Verify IP change at https://whatismyip.com
- [ ] Check browser console for errors

## Code Style

- Use consistent indentation (2 spaces)
- Use descriptive variable names
- Add comments for complex logic
- Handle errors gracefully with user-friendly messages
- Validate user input

## Project Structure

```
http-proxy-manager/
├── manifest.json          # Extension manifest
├── background.js          # Background script (proxy logic)
├── popup.js              # Popup UI logic
├── popup.html            # Popup UI
├── icons/                # Extension icons
└── docs/                 # Documentation
    └── DEVELOPMENT.md    # Technical docs
```

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

Feel free to open an issue for questions or contact the maintainers at code@adptly.com.

## Recognition

Contributors will be recognized in release notes and the project's contributor list.
