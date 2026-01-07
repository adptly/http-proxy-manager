# Security Policy

## Supported Versions

We release patches for security vulnerabilities in the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.2.x   | :white_check_mark: |
| < 1.2   | :x:                |

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability, please report it responsibly.

### How to Report

**Please do NOT report security vulnerabilities through public GitHub issues.**

Instead, report vulnerabilities privately:
- **Email:** code@adptly.com
- **Subject:** [SECURITY] Brief description

### What to Include

A good security report includes:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Affected versions
- Suggested fix (if any)

**Example:**
```
**Vulnerability:** XSS in proxy hostname field
**Steps to Reproduce:**
1. Add new profile
2. Enter <script>alert('xss')</script> in hostname field
3. Script executes when...

**Impact:** Could allow malicious code execution
**Affected:** v1.2.0 and earlier
```

### Response Timeline

- **Initial Response:** Within 48 hours
- **Status Updates:** Every 5 business days
- **Fix Timeline:** Depends on severity
  - Critical: 1-7 days
  - High: 7-30 days
  - Medium: 30-90 days
  - Low: Best effort

### What to Expect

1. **Acknowledgment:** We'll confirm receipt of your report
2. **Investigation:** We'll validate and assess the vulnerability
3. **Fix Development:** We'll develop and test a fix
4. **Disclosure:** We'll coordinate disclosure timing with you
5. **Credit:** We'll credit you in the security advisory (if desired)

## Security Best Practices

When using HTTP Proxy Manager:
- Only use trusted proxy servers
- Avoid entering credentials for untrusted proxies
- Keep the extension updated
- Review proxy configurations regularly

## Known Security Considerations

### Storage Security
- Proxy credentials are stored in Firefox's local storage
- Credentials are NOT encrypted by the extension
- Firefox's built-in storage security protections apply

### Permissions
This extension requires broad permissions to function:
- `<all_urls>`: Required to route all traffic through the proxy
- `webRequest`: Required for proxy authentication
- See [README.md](README.md#permissions) for full permission details

### Privacy
- No data is sent to external servers
- All configuration is stored locally
- No analytics or tracking

## Disclosure Policy

When we resolve a security vulnerability:
1. We'll release a patched version
2. We'll publish a security advisory on GitHub
3. We'll credit the reporter (if they consent)
4. We'll update this document if needed

## Past Security Issues

No security vulnerabilities have been reported or discovered to date.

## Contact

For security concerns: code@adptly.com
