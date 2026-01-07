![Banner](.github/assets/banner.webp)

# Scrappey n8n Node

[![CI](https://github.com/Automations-Project/n8n-nodes-scrappey/actions/workflows/ci.yml/badge.svg)](https://github.com/Automations-Project/n8n-nodes-scrappey/actions/workflows/ci.yml)
[![Release](https://github.com/Automations-Project/n8n-nodes-scrappey/actions/workflows/release.yml/badge.svg)](https://github.com/Automations-Project/n8n-nodes-scrappey/actions/workflows/release.yml)
[![Security Scan](https://github.com/Automations-Project/n8n-nodes-scrappey/actions/workflows/security.yml/badge.svg)](https://github.com/Automations-Project/n8n-nodes-scrappey/actions/workflows/security.yml)
[![npm version](https://img.shields.io/npm/v/@nskha/n8n-nodes-scrappey?logo=npm)](https://www.npmjs.com/package/@nskha/n8n-nodes-scrappey)
[![npm downloads](https://img.shields.io/npm/dm/@nskha/n8n-nodes-scrappey?logo=npm)](https://www.npmjs.com/package/@nskha/n8n-nodes-scrappey)
[![n8n Node version](https://img.shields.io/github/package-json/v/Automations-Project/n8n-nodes-scrappey?logo=n8n&label=n8n%20node)](https://github.com/Automations-Project/n8n-nodes-scrappey)
[![n8n compatibility](https://img.shields.io/github/v/release/n8n-io/n8n?logo=n8n&label=)](https://n8n.io)
[![Node.js compatibility](https://img.shields.io/node/v/@nskha/n8n-nodes-scrappey?logo=node.js)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5%2B-blue?logo=typescript)](https://www.typescriptlang.org)
[![Dependencies](https://img.shields.io/librariesio/release/npm/@nskha/n8n-nodes-scrappey?logo=dependabot)](https://libraries.io/npm/@nskha%2Fn8n-nodes-scrappey)
[![License](https://img.shields.io/github/license/Automations-Project/n8n-nodes-scrappey)](LICENSE.md)

[![GitHub stars](https://img.shields.io/github/stars/Automations-Project/n8n-nodes-scrappey?style=social)](https://github.com/Automations-Project/n8n-nodes-scrappey/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/Automations-Project/n8n-nodes-scrappey?style=social)](https://github.com/Automations-Project/n8n-nodes-scrappey/network)
[![GitHub issues](https://img.shields.io/github/issues/Automations-Project/n8n-nodes-scrappey)](https://github.com/Automations-Project/n8n-nodes-scrappey/issues)
[![Last commit](https://img.shields.io/github/last-commit/Automations-Project/n8n-nodes-scrappey)](https://github.com/Automations-Project/n8n-nodes-scrappey/commits)

> **Advanced web scraping and anti-bot bypass node for n8n workflows - Now with complete API coverage!**

A powerful n8n community node that integrates with the [Scrappey.com API](https://scrappey.com) to provide advanced web scraping capabilities with built-in anti-bot protection bypass. Perfect for automating data extraction from protected websites, handling CAPTCHAs, and managing complex browser interactions.

## What's New in v1.0.0

This major update brings **complete API coverage** matching the official Scrappey documentation:

- **Session Management** - Create, destroy, list, and check session status
- **WebSocket Connections** - Advanced persistent browser control
- **20+ Browser Actions** - Click, type, scroll, wait, execute JavaScript, solve captchas, and more
- **Full Antibot Support** - Cloudflare, Datadome, Kasada, Incapsula, PerimeterX bypass
- **Response Options** - Screenshots, PDF generation, regex extraction, filters
- **Request Interception** - Abort patterns, domain blocking, XHR/Fetch interception
- **AI-Powered Parsing** - Automatic HTML structure extraction

## Key Features

### Eight Operation Modes

1. **Request Builder** - Create fully customized HTTP/browser requests with granular control
2. **HTTP Auto-Retry** - Automatically retry failed HTTP requests through Scrappey's anti-bot network
3. **Browser Auto-Retry** - Advanced browser-based retry with full anti-bot protection
4. **Session Create** - Create persistent browser sessions for multi-request workflows
5. **Session Destroy** - Clean up sessions when done
6. **Session List** - View all active sessions
7. **Session Check** - Verify if a session is still active
8. **WebSocket Create** - Create WebSocket-based browser connections

### Anti-Bot Protection Bypass

- **Cloudflare** challenge solving with dedicated bypass
- **Datadome** bypass with debug mode
- **Kasada** protection bypass
- **Incapsula/Imperva** detection and solving
- **PerimeterX** bypass
- **hCaptcha, reCAPTCHA, Turnstile** automatic solving
- **FunCaptcha (Arkose Labs)** support
- **JavaScript-heavy websites** full browser simulation
- **Mouse movement simulation** for enhanced stealth

### 20+ Browser Actions

Execute complex browser automation sequences:

| Action | Description |
|--------|-------------|
| `click` | Click elements with CSS selector |
| `type` | Type text into input fields |
| `goto` | Navigate to URLs |
| `wait` | Wait for specified time |
| `wait_for_selector` | Wait for elements to appear |
| `wait_for_function` | Wait for JavaScript conditions |
| `wait_for_load_state` | Wait for page load states |
| `wait_for_cookie` | Wait for cookies to be set |
| `execute_js` | Run JavaScript code |
| `scroll` | Scroll to elements or page bottom |
| `hover` | Hover over elements |
| `keyboard` | Simulate key presses |
| `dropdown` | Select dropdown options |
| `switch_iframe` | Switch to iframe context |
| `set_viewport` | Change viewport size |
| `if` | Conditional action execution |
| `while` | Loop actions with conditions |
| `solve_captcha` | Solve various captcha types |
| `discord_login` | Discord authentication |
| `remove_iframes` | Remove all iframes |

### Advanced Proxy Management

- **Residential proxies** with country targeting (150+ countries)
- **Premium residential proxies** for better success rates
- **Datacenter proxies** for fast requests
- **Mobile proxies** for mobile-specific content
- **Custom proxy** support (SOCKS4/5, HTTP/HTTPS)
- **No proxy** option for direct connections

### Response Options

- **Screenshots** with custom dimensions and base64/URL output
- **PDF generation** of pages
- **Regex extraction** for pattern matching
- **Field filtering** to reduce response size
- **Base64 encoding** of responses
- **Redirect tracking** for all redirect URLs
- **Inner text extraction** for clean content

### Request Interception

- **Abort patterns** to block unwanted requests
- **Domain blacklisting** for blocking specific domains
- **XHR/Fetch interception** to capture API responses
- **Wait for abort detection** before continuing

### AI-Powered Parsing

- **Automatic structure extraction** with AI models
- **DeepSeek, GPT-4, GPT-3.5** support
- **Custom structure definitions** for targeted extraction

## Installation

### Method 1: n8n Community Nodes (Recommended)

1. Open your n8n instance
2. Go to **Settings** → **Community Nodes**
3. Enter: `@automations-project/n8n-nodes-scrappey`
4. Click **Install**

### Method 2: Manual Installation

```bash
# Using npm
npm install @automations-project/n8n-nodes-scrappey

# Using pnpm
pnpm add @automations-project/n8n-nodes-scrappey

# Using yarn
yarn add @automations-project/n8n-nodes-scrappey
```

### Method 3: Development Installation

```bash
# Clone the repository
git clone https://github.com/Automations-Project/n8n-nodes-scrappey.git
cd n8n-nodes-scrappey

# Install dependencies
npm install

# Build the node
npm run build

# Link for development
npm run start:dev
```

## Configuration

### 1. Set Up Scrappey API Credentials

1. Sign up at [Scrappey.com](https://scrappey.com) to get your API key.
2. In n8n, create new **Scrappey API** credentials
3. Enter your API key and optional proxy settings

> **Get Started Free!** Try Scrappey with **750 Direct requests** and **150 Browser requests** at no cost.
>
> **Affordable scaling**: For just €100, you can get 600,000 request credits including proxies, captcha etc...

### 2. Credential Options

- **API Key** (required): Your Scrappey.com API key
- **Custom Proxy** (optional): Your own proxy URL (SOCKS4/5, HTTP/HTTPS)
- **Whitelisted Domains** (optional): JSON array of allowed domains for enhanced security

## Usage Examples

### Basic Web Scraping

```javascript
{
  "operation": "requestBuilder",
  "url": "https://httpbin.org/get",
  "httpMethod": "request.get",
  "request_type": "Request"
}
```

### Browser Automation with Anti-Bot Protection

```javascript
{
  "operation": "requestBuilder",
  "url": "https://protected-site.com",
  "request_type": "Browser",
  "antibot": true,
  "mouseMovements": true,
  "datadome": true,
  "cloudflareBypass": true,
  "proxyType": "residential",
  "customProxyCountry": "UnitedStates"
}
```

### Session-Based Workflow

```javascript
// 1. Create session
{
  "operation": "sessionCreate",
  "sessionId": "my-session-123",
  "sessionTtl": 300
}

// 2. Use session for requests
{
  "operation": "requestBuilder",
  "url": "https://example.com/login",
  "userSession": "my-session-123",
  "browserActions": [
    {"type": "type", "cssSelector": "#username", "text": "myuser"},
    {"type": "type", "cssSelector": "#password", "text": "mypass"},
    {"type": "click", "cssSelector": "#login-btn"}
  ]
}

// 3. Destroy session when done
{
  "operation": "sessionDestroy",
  "sessionToDestroy": "my-session-123"
}
```

### Captcha Solving

```javascript
{
  "operation": "requestBuilder",
  "url": "https://example.com",
  "request_type": "Browser",
  "antibot": true,
  "alwaysLoad": ["recaptcha", "hcaptcha", "turnstile"],
  "browserActions": [
    {
      "type": "solve_captcha",
      "captcha": "turnstile",
      "captchaCssSelector": ".cf-turnstile"
    }
  ]
}
```

### Screenshot and PDF Generation

```javascript
{
  "operation": "requestBuilder",
  "url": "https://example.com",
  "request_type": "Browser",
  "screenshot": true,
  "screenshotWidth": 1920,
  "screenshotHeight": 1080,
  "screenshotUpload": true,
  "pdf": true
}
```

### XHR/Fetch Interception

```javascript
{
  "operation": "requestBuilder",
  "url": "https://example.com",
  "request_type": "Browser",
  "interceptXhrFetchRequest": "https://api.example.com/data",
  "abortOnDetection": "analytics.com, tracking.js"
}
```

## Error Handling

The node provides detailed error messages for all Scrappey API error codes:

| Code | Description | Solution |
|------|-------------|----------|
| CODE-0001 | Server overloaded | Retry after a few minutes |
| CODE-0002 | Cloudflare blocked | Try different proxy or browser mode |
| CODE-0003 | Too many attempts | Wait before retrying |
| CODE-0004 | Invalid command | Check request configuration |
| CODE-0005 | Tunnel failed | Retry with different proxy |
| CODE-0010 | Datadome blocked | Try different proxy |
| CODE-0029 | Too many sessions | Destroy unused sessions |
| CODE-0032 | Turnstile not solved | Try different proxy |
| CODE-0038 | FingerprintJS failed | Retry request |

## Development

### Building from Source

```bash
# Install dependencies
npm install

# Development build with watch
npm run build:watch

# Production build
npm run build

# Linting & formatting
npm run lint
npm run format

# Type checking
npm run type-check
```

### Project Structure

```
n8n-nodes-scrappey/
├── nodes/Scrappey/
│   ├── Scrappey.node.ts      # Node definition and execution
│   ├── execute.ts            # Operation dispatcher
│   ├── methods.ts            # Request handlers
│   ├── requestBodyBuilder.ts # Request body construction
│   ├── fields.ts             # Node field definitions
│   ├── browserActions.ts     # Browser action definitions
│   ├── types.ts              # TypeScript type definitions
│   ├── GenericFunctions.ts   # API integration utilities
│   ├── operators.ts          # Operation definitions
│   └── utils.ts              # Helper functions
├── credentials/
│   └── ScrappeyApi.credentials.ts
├── scripts/
├── .github/workflows/
└── dist/
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'feat: add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Commit Message Conventions

- `feat: description` → Minor version bump
- `fix: description` → Patch version bump
- `BREAKING CHANGE` or `[major]` → Major version bump
- `[skip ci]` or `[skip version]` → Skip automation

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Links

- **Scrappey Website**: [https://scrappey.com](https://scrappey.com)
- **Scrappey Documentation**: [https://wiki.scrappey.com](https://wiki.scrappey.com)
- **n8n Community**: [https://community.n8n.io](https://community.n8n.io)
- **GitHub Issues**: [Report bugs or request features](https://github.com/Automations-Project/n8n-nodes-scrappey/issues)

---

**Made with love for the n8n community**
