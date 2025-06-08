# Contributing to Scrappey n8n Node

Thank you for your interest in contributing to the Scrappey n8n Node! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js 18.10 or higher
- pnpm 9.1+ (required package manager)
- Git
- n8n instance for testing (optional but recommended)

### Development Setup
```bash
# 1. Fork and clone the repository
git clone https://github.com/YOUR-USERNAME/n8n-nodes-scrappey.git
cd n8n-nodes-scrappey

# 2. Install dependencies
pnpm install

# 3. Build the project
pnpm run build

# 4. Set up development environment
pnpm run start:dev
```

## 📝 Development Guidelines

### Code Style
- **TypeScript**: All new code must be written in TypeScript
- **ESLint**: Follow the existing ESLint configuration
- **Prettier**: Use Prettier for code formatting
- **Naming**: Use descriptive variable and function names

### Code Quality Checklist
Before submitting any code, ensure it passes:
```bash
# Linting
pnpm run lint

# Type checking
pnpm run type-check

# Code formatting
pnpm run format:check

# Build verification
pnpm run build

# Full validation
pnpm run validate
```

### File Structure
```
nodes/Scrappey/
├── Scrappey.node.ts         # Main node definition
├── execute.ts               # Operation dispatcher
├── RequestMethods.ts        # Request handling logic
├── requestBodyBuilder.ts    # Request construction
├── fields.ts                # Node field definitions
├── GenericFunctions.ts      # API utilities
├── utils.ts                 # Helper functions
└── types.ts                 # Type definitions
```

## 🔄 CI/CD Workflow

### Automated Processes
Our CI/CD pipeline automatically handles:

1. **Code Quality**: Linting, formatting, and type checking
2. **Building**: Compiling TypeScript and copying assets
3. **Security**: Dependency auditing and CodeQL analysis
4. **Versioning**: Automatic version bumps based on commit messages
5. **Releases**: Publishing to GitHub Packages and npm

### Commit Message Conventions
We use conventional commits for automatic versioning:

- `feat: description` → **Minor version bump** (new features)
- `fix: description` → **Patch version bump** (bug fixes)
- `docs: description` → **No version bump** (documentation)
- `chore: description` → **No version bump** (maintenance)
- `BREAKING CHANGE` → **Major version bump** (breaking changes)
- `[major]: description` → **Major version bump** (explicit major)

### Special Commit Flags
- `[skip ci]` → Skip CI/CD pipeline
- `[skip version]` → Skip automatic version bump

### Example Commits
```bash
# New feature (minor version bump)
git commit -m "feat: add support for custom user agents"

# Bug fix (patch version bump)
git commit -m "fix: resolve proxy connection timeout issue"

# Breaking change (major version bump)
git commit -m "feat: redesign API interface

BREAKING CHANGE: The request configuration format has changed"

# Documentation update (no version bump)
git commit -m "docs: update installation instructions"

# Skip automation
git commit -m "chore: update dev dependencies [skip ci]"
```

## 🧪 Testing

### Manual Testing
1. Build the node: `pnpm run build`
2. Install in local n8n: `pnpm run start:dev`
3. Test all three operation modes:
   - Request Builder
   - HTTP Auto-Retry
   - Browser Auto-Retry

### Test Cases to Verify
- [ ] Basic HTTP requests work
- [ ] Browser requests with anti-bot protection
- [ ] Proxy configuration (credentials, Scrappey, custom)
- [ ] Error handling for common scenarios
- [ ] Auto-retry functionality with failed HTTP nodes
- [ ] Custom headers and cookies
- [ ] Session management
- [ ] Country-specific proxy selection

## 📦 Release Process

### Automatic Releases (Recommended)
1. Merge approved PRs to `main` branch
2. Auto-versioning workflow triggers automatically
3. Version bump commits are created
4. Release workflow publishes to registries

### Manual Releases
1. Update version in `package.json`
2. Run `node scripts/update-node-json.js`
3. Create and push a version tag: `git tag v1.0.0 && git push origin v1.0.0`
4. GitHub Actions will handle the rest

## 🐛 Issue Reporting

### Bug Reports
Please include:
- n8n version
- Node version
- Scrappey node version
- Steps to reproduce
- Expected vs actual behavior
- Error messages/logs
- Workflow configuration (if applicable)

### Feature Requests
Please include:
- Use case description
- Proposed solution
- Alternatives considered
- Implementation suggestions

## 📋 Pull Request Process

1. **Fork & Branch**: Create a feature branch from `main`
2. **Develop**: Make your changes following the guidelines
3. **Test**: Verify functionality manually
4. **Validate**: Run `pnpm run validate` to ensure quality
5. **Commit**: Use conventional commit messages
6. **Push**: Push to your fork
7. **PR**: Create a pull request with:
   - Clear description of changes
   - Link to related issues
   - Screenshots (if UI changes)
   - Test results

### PR Review Checklist
- [ ] Code follows style guidelines
- [ ] All CI checks pass
- [ ] Functionality tested manually
- [ ] Documentation updated (if needed)
- [ ] No breaking changes (unless intentional)
- [ ] Commit messages follow conventions

## 🏷️ Labeling System

### Issue Labels
- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Documentation improvements
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention is needed
- `question` - Further information is requested

### PR Labels
- `automated` - Created by automation
- `dependencies` - Dependency updates
- `ci/cd` - CI/CD related changes

## 🤝 Community

### Getting Help
- **GitHub Issues**: [Report bugs or ask questions](https://github.com/Automations-Project/n8n-nodes-scrappey/issues)
- **n8n Community**: [Join the discussion](https://community.n8n.io)
- **Scrappey Support**: [API documentation](https://wiki.scrappey.com)

### Code of Conduct
This project follows the [Code of Conduct](CODE_OF_CONDUCT.md). Please read and follow it in all interactions.

## 🙏 Recognition

Contributors are recognized in:
- Release notes
- GitHub contributor graphs
- Community highlights

Thank you for making this project better! 🎉 