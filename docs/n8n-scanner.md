# n8n Community Package Scanner

This document explains how to use the official n8n community package scanner to validate and security-check your n8n node package.

## What is the n8n Scanner?

The `@n8n/scan-community-package` is an official tool from n8n that:

- **Validates package structure** for n8n community nodes
- **Performs security analysis** to detect malicious code
- **Checks for vulnerabilities** in dependencies and code
- **Ensures compliance** with n8n community standards

## Usage

### Local Development

Run the scanner locally to check the published package:

```bash
# Run the n8n scanner
pnpm run scan:n8n
```

This will scan your published package `@nskha/n8n-nodes-scrappey` directly from the npm registry.

### Direct Usage

You can also run the scanner directly:

```bash
# Scan the published package
npx @n8n/scan-community-package @nskha/n8n-nodes-scrappey
```

### CI/CD Integration

The scanner is automatically integrated into our workflows:

- **CI Pipeline**: Runs on every commit (checks published version if available)
- **Release Pipeline**: Runs after publishing to npm to validate the new version
- **Behavior**: Continues on error (won't fail the build if package isn't published yet)

## How It Works

The scanner works by:

1. **Downloading** the specified package from npm registry
2. **Analyzing** the package structure and code
3. **Checking** for security vulnerabilities and compliance
4. **Reporting** results with detailed feedback

## Example Results

### Successful Scan
```bash
✅ Downloaded @nskha/n8n-nodes-scrappey@0.3.7
✅ Analyzed @nskha/n8n-nodes-scrappey@0.3.7  
✅ Package @nskha/n8n-nodes-scrappey@0.3.7 has passed all security checks
```

### Failed Scan
```bash
❌ Failed to analyze @nskha/n8n-nodes-scrappey@0.3.7: AxiosError: Request failed with status code 404
```

## What the Scanner Checks

### Security Analysis
- **Malicious code patterns** in your source files
- **Suspicious network requests** or file system access
- **Obfuscated code** that might hide malicious intent
- **Dependency vulnerabilities** in your package tree

### Package Structure
- **Required files** are present (package.json, built files)
- **n8n node structure** follows conventions
- **Credential handling** is secure
- **API usage** follows n8n guidelines

### Code Quality
- **TypeScript compliance** for better maintainability
- **Error handling** patterns are present
- **Documentation** completeness
- **Version compatibility** with n8n

## Common Issues and Solutions

### Package Not Found (404 Error)

**Error**: `Request failed with status code 404`

**Cause**: Package not published to npm registry

**Solution**: 
- Ensure package is published to npm: `pnpm publish`
- Check package name is correct: `@nskha/n8n-nodes-scrappey`
- Wait a few minutes for npm to propagate new packages

### Network Connectivity Issues

**Error**: Connection timeout or network errors

**Cause**: Network connectivity issues

**Solution**:
- Check internet connection
- Try again after a few minutes
- Use VPN if corporate firewall blocks npm

### Scanner Tool Not Found

**Error**: Command not found errors

**Cause**: n8n scanner package not installed

**Solution**:
- The scanner is installed automatically via `npx`
- Ensure you have Node.js and npm installed
- Try: `npx @n8n/scan-community-package --help`

## Integration with Release Process

### Automated Scanning

1. **During CI**: Scanner attempts to check published version (expected to fail for unpublished packages)
2. **After Release**: Scanner runs automatically after npm publish
3. **Manual Check**: Run `pnpm run scan:n8n` anytime to check latest published version

### Release Workflow Integration

The scanner is integrated into the release workflow:

```yaml
- name: Run n8n Security Scanner
  run: |
    echo "🔍 Running n8n community package security scan..."
    # Wait a bit for npm to propagate the package
    sleep 30
    node scripts/n8n-scanner.js || echo "⚠️ Scanner check completed"
```

## Best Practices

### For Developers

1. **Regular Scanning**: Run scanner after each release
2. **Fix Issues Promptly**: Address security findings immediately
3. **Monitor Dependencies**: Keep dependencies updated
4. **Secure Coding**: Follow n8n security guidelines

### For CI/CD

1. **Non-Blocking**: Scanner continues on error to avoid blocking releases
2. **Post-Publish**: Scanner runs after successful publishing
3. **Logging**: Results are captured in CI logs for review

## Manual Commands

```bash
# Check current published version
npx @n8n/scan-community-package @nskha/n8n-nodes-scrappey

# Check specific version
npx @n8n/scan-community-package @nskha/n8n-nodes-scrappey@0.3.7

# Use local script
pnpm run scan:n8n

# Get scanner help
npx @n8n/scan-community-package --help
```

## Troubleshooting

### Scanner Always Fails

1. Verify package is published: `npm view @nskha/n8n-nodes-scrappey`
2. Check package name spelling
3. Ensure you have internet access
4. Try running scanner directly with npx

### Development vs Published Package

- The scanner only works with **published** packages
- For unpublished code, use other security tools like CodeQL (integrated in CI)
- The scanner is most useful **after** publishing to validate releases

## Further Reading

- [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/community-nodes/)
- [n8n Security Guidelines](https://docs.n8n.io/integrations/community-nodes/security/)
- [npm Security Best Practices](https://docs.npmjs.com/security-best-practices) 
