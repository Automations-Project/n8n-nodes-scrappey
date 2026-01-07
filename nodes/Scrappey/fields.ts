/* eslint-disable n8n-nodes-base/node-param-display-name-miscased */
/* eslint-disable n8n-nodes-base/node-param-description-excess-final-period */
/* eslint-disable n8n-nodes-base/node-param-options-type-unsorted-items */
/* eslint-disable n8n-nodes-base/node-param-required-false */
import { INodeProperties } from 'n8n-workflow';
import { Static_Country_Proxies, generateUUID } from './utils';
import { browserActionsFields } from './browserActions';

// ============================================
// Session Operation Fields
// ============================================

export const sessionFields: INodeProperties[] = [
	// Session Create Fields
	{
		displayName: 'Session ID',
		name: 'sessionId',
		type: 'string',
		default: '',
		placeholder: 'my-session-123',
		hint: 'Optional custom session ID. If not provided, one will be generated.',
		displayOptions: {
			show: {
				scrappeyOperations: ['sessionCreate'],
			},
		},
	},
	{
		displayName: 'Session TTL (seconds)',
		name: 'sessionTtl',
		type: 'number',
		default: 180,
		hint: 'Time-to-live for the session in seconds',
		displayOptions: {
			show: {
				scrappeyOperations: ['sessionCreate', 'websocketCreate'],
			},
		},
	},
	{
		displayName: 'Headless Mode',
		name: 'headless',
		type: 'options',
		default: 'true',
		options: [
			{ name: 'Headless (No UI)', value: 'true' },
			{ name: 'Headful (With UI)', value: 'false' },
		],
		hint: 'Whether to run browser without visible UI',
		displayOptions: {
			show: {
				scrappeyOperations: ['sessionCreate', 'websocketCreate'],
			},
		},
	},
	{
		displayName: 'GeoIP Detection',
		name: 'geoip',
		type: 'options',
		default: 'false',
		options: [
			{ name: 'Disabled', value: 'false' },
			{ name: 'Enabled', value: 'true' },
		],
		hint: 'Enable GeoIP-based locale detection',
		displayOptions: {
			show: {
				scrappeyOperations: ['sessionCreate', 'websocketCreate'],
			},
		},
	},

	// Session Destroy Fields
	{
		displayName: 'Session to Destroy',
		name: 'sessionToDestroy',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'session-id-to-destroy',
		hint: 'The session ID to destroy',
		displayOptions: {
			show: {
				scrappeyOperations: ['sessionDestroy'],
			},
		},
	},

	// Session List Fields
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'number',
		default: 0,
		hint: 'Optional user ID to filter sessions',
		displayOptions: {
			show: {
				scrappeyOperations: ['sessionList'],
			},
		},
	},

	// Session Active Check Fields
	{
		displayName: 'Session to Check',
		name: 'sessionToCheck',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'session-id-to-check',
		hint: 'The session ID to check',
		displayOptions: {
			show: {
				scrappeyOperations: ['sessionActive'],
			},
		},
	},
];

// ============================================
// Main Public Fields
// ============================================

export const publicFields: INodeProperties[] = [
	// Auto-retry notice
	{
		displayName:
			'⚠️This is a fallback solution and works only if the previous node is an HTTP node. <br/><br/>🚦 For best results, connect the error path of the HTTP node to this operation. <br/><br/> 👉 See the <a href="https://source.n8n.community/scrappey-example-workflow-fallback" target="_blank">example workflow</a>.',
		name: 'affiliateMessage',
		type: 'notice',
		default: '',
		displayOptions: {
			show: {
				scrappeyOperations: ['httpRequestAutoRetry', 'httpRequestAutoRetryBrowser'],
			},
		},
	},

	// URL Field
	{
		displayName: 'URL',
		name: 'url',
		type: 'string',
		default: '',
		hint: 'URL of the page to scrape',
		placeholder: 'https://httpbin.rs/get',
		required: true,
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
			},
		},
	},

	// HTTP Method
	{
		displayName: 'HTTP Method',
		name: 'httpMethod',
		type: 'options',
		default: 'request.get',
		hint: 'HTTP method to use with the URL',
		options: [
			{ name: 'GET', value: 'request.get' },
			{ name: 'POST', value: 'request.post' },
			{ name: 'PUT', value: 'request.put' },
			{ name: 'DELETE', value: 'request.delete' },
			{ name: 'PATCH', value: 'request.patch' },
			{ name: 'PUBLISH', value: 'request.publish' },
		],
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
			},
		},
	},

	// Request Type
	{
		displayName: 'Request Type',
		name: 'request_type',
		type: 'options',
		default: 'Request',
		options: [
			{ name: 'Browser', value: 'Browser', description: 'Full browser with JavaScript execution' },
			{ name: 'Request', value: 'Request', description: 'HTTP-only mode (faster, no browser)' },
			{ name: 'Patched Chrome Browser', value: 'PatchedChrome', description: 'Chrome with enhanced anti-detection' },
		],
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
			},
		},
	},

	// Referer
	{
		displayName: 'Referer',
		name: 'referer',
		type: 'string',
		default: '',
		placeholder: 'https://google.com',
		hint: 'HTTP Referer header value',
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
			},
		},
	},

	// ============================================
	// Proxy Configuration
	// ============================================

	{
		displayName: 'Which Proxy To Use',
		name: 'whichProxyToUse',
		type: 'options',
		options: [
			{
				name: 'Proxy From Credentials',
				value: 'proxyFromCredentials',
				description: 'Use the proxy defined in credentials for this request',
			},
			{
				name: 'Proxy From HTTP Request Node',
				value: 'proxyFromNode',
				description: 'Use the proxy defined in HTTP Request Node for this request',
			},
			{
				name: 'Proxy From Scrappey',
				value: 'proxyFromScrappey',
				description: 'Use the proxy defined in Scrappey for this request',
			},
			{
				name: 'No Proxy',
				value: 'noProxy',
				description: 'Disable proxy usage for this request',
			},
		],
		default: 'proxyFromCredentials',
		displayOptions: {
			show: {
				scrappeyOperations: [
					'requestBuilder',
					'httpRequestAutoRetry',
					'httpRequestAutoRetryBrowser',
					'sessionCreate',
					'websocketCreate',
				],
			},
		},
	},
	{
		displayName: 'Proxy Type',
		name: 'proxyType',
		type: 'options',
		default: '',
		hint: 'Proxy type to use for the request',
		options: [
			{ name: 'Residential proxy', value: '' },
			{ name: 'Premium residential proxy', value: 'premiumProxy' },
			{ name: 'Datacenter proxy', value: 'datacenter' },
			{ name: 'Mobile proxy', value: 'mobileProxy' },
		],
		displayOptions: {
			show: {
				scrappeyOperations: [
					'requestBuilder',
					'httpRequestAutoRetry',
					'httpRequestAutoRetryBrowser',
					'sessionCreate',
					'websocketCreate',
				],
				whichProxyToUse: ['proxyFromScrappey'],
			},
		},
	},
	{
		displayName: 'Custom proxy country',
		name: 'customProxyCountryBoolean',
		type: 'boolean',
		default: false,
		hint: 'Use a custom proxy country',
		required: false,
		displayOptions: {
			show: {
				scrappeyOperations: [
					'requestBuilder',
					'httpRequestAutoRetry',
					'httpRequestAutoRetryBrowser',
					'sessionCreate',
					'websocketCreate',
				],
				whichProxyToUse: ['proxyFromScrappey'],
			},
		},
	},
	{
		displayName: 'Custom Proxy Country',
		name: 'customProxyCountry',
		type: 'options',
		options: Static_Country_Proxies,
		default: '',
		hint: 'Specify a country for the proxy to use with this request',
		required: false,
		displayOptions: {
			show: {
				scrappeyOperations: [
					'requestBuilder',
					'httpRequestAutoRetry',
					'httpRequestAutoRetryBrowser',
					'sessionCreate',
					'websocketCreate',
				],
				customProxyCountryBoolean: [true],
			},
		},
	},
	{
		displayName: 'Custom Proxy',
		name: 'custom_proxy',
		type: 'boolean',
		default: false,
		hint: 'When enabled, the proxy defined in credentials will be used for this request.',
		required: false,
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder', 'sessionCreate', 'websocketCreate'],
				proxyType: [''],
				whichProxyToUse: ['proxyFromScrappey'],
			},
		},
	},
	{
		displayName: "Don't Change Proxy",
		name: 'dontChangeProxy',
		type: 'boolean',
		default: false,
		hint: 'Keep the same proxy for session reuse',
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
				whichProxyToUse: ['proxyFromScrappey'],
			},
		},
	},

	// ============================================
	// Body/Params Configuration
	// ============================================

	{
		displayName: 'Body OR Params?',
		name: 'bodyOrParams',
		type: 'options',
		default: 'params_used',
		hint: 'Select whether to use Body or Params for the request',
		options: [
			{ name: 'Body', value: 'body_used' },
			{ name: 'Params', value: 'params_used' },
		],
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
				httpMethod: [
					'request.put',
					'request.post',
					'request.patch',
					'request.delete',
					'request.publish',
				],
			},
		},
	},
	{
		displayName: 'Params',
		name: 'params_for_request',
		type: 'string',
		default: '',
		hint: 'Parameters to use for the request',
		displayOptions: {
			show: {
				bodyOrParams: ['params_used'],
				scrappeyOperations: ['requestBuilder'],
				httpMethod: [
					'request.put',
					'request.post',
					'request.patch',
					'request.delete',
					'request.publish',
				],
			},
		},
		placeholder: 'g-recaptcha-response=03AGdBq24JZ&submit=Submit',
	},
	{
		displayName: 'Body',
		name: 'body_for_request',
		type: 'string',
		default: '',
		hint: 'Body to use for the request',
		displayOptions: {
			show: {
				bodyOrParams: ['body_used'],
				scrappeyOperations: ['requestBuilder'],
				httpMethod: [
					'request.put',
					'request.post',
					'request.patch',
					'request.delete',
					'request.publish',
				],
			},
		},
		typeOptions: {
			rows: 4,
			editor: 'jsEditor',
		},
	},

	// ============================================
	// Session Management
	// ============================================

	{
		displayName: 'User Session',
		name: 'userSession',
		type: 'string',
		default: generateUUID(),
		hint: 'User session identifier to use for the request',
		required: false,
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
			},
		},
		typeOptions: {
			loadOptionsDependsOn: ['refreshSession'],
		},
	},
	{
		displayName: 'Close After Use',
		name: 'closeAfterUse',
		type: 'boolean',
		default: false,
		hint: 'Automatically close the session after the request',
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
			},
		},
	},

	// ============================================
	// Headers Configuration
	// ============================================

	{
		displayName: 'Headers Input Method',
		name: 'headersInputMethod',
		type: 'options',
		default: 'fields',
		hint: 'Choose how to input headers',
		options: [
			{ name: 'Using Fields Below', value: 'fields' },
			{ name: 'Using JSON', value: 'json' },
		],
		required: false,
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
			},
		},
	},
	{
		displayName: 'Custom Headers',
		name: 'customHeaders',
		type: 'fixedCollection',
		default: {},
		hint: 'Custom headers to use for the request',
		options: [
			{
				name: 'headers',
				displayName: 'Headers',
				values: [
					{
						displayName: 'Header Key',
						name: 'header_key',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Header Value',
						name: 'header_value',
						type: 'string',
						default: '',
						description: 'Value to set for the header key.',
					},
				],
			},
		],
		required: false,
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
				headersInputMethod: ['fields'],
			},
		},
		typeOptions: {
			multipleValues: true,
		},
	},
	{
		displayName: 'JSON Headers',
		name: 'jsonHeaders',
		type: 'string',
		default: '{"User-Agent": "Mozilla/5.0", "Accept": "application/json"}',
		hint: 'Enter headers as a JSON object',
		required: false,
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
				headersInputMethod: ['json'],
			},
		},
		typeOptions: {
			rows: 4,
		},
	},

	// ============================================
	// Cookies Configuration
	// ============================================

	{
		displayName: 'One String Cookie',
		name: 'oneStringCookie',
		type: 'boolean',
		default: false,
		hint: 'Use a single string format for cookies',
		required: false,
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
			},
		},
	},
	{
		displayName: 'Single String Cookie',
		name: 'cookie',
		type: 'string',
		default: '',
		placeholder: 'sessionid=abc123;csrftoken=xyz456;theme=light',
		hint: 'Cookie string to use for the request (format: name=value;name2=value2)',
		required: false,
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
				oneStringCookie: [true],
			},
		},
	},
	{
		displayName: 'Custom Cookies',
		name: 'customCookies',
		type: 'fixedCollection',
		default: {},
		hint: 'Custom cookies to use for the request',
		options: [
			{
				name: 'cookies',
				displayName: 'Cookies',
				values: [
					{
						displayName: 'Cookie Key',
						name: 'cookie_key',
						type: 'string',
						placeholder: 'theme',
						default: '',
					},
					{
						displayName: 'Cookie Value',
						name: 'cookie_value',
						type: 'string',
						default: '',
						placeholder: 'dark',
						description: 'Value to set for the cookie key.',
					},
				],
			},
		],
		required: false,
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
				oneStringCookie: [false],
			},
		},
		typeOptions: {
			multipleValues: true,
		},
	},
	{
		displayName: 'Cookie Jar (JSON)',
		name: 'cookiejar',
		type: 'string',
		default: '',
		placeholder: '[{"name": "session", "value": "abc", "domain": "example.com"}]',
		hint: 'Array of cookie objects in JSON format',
		typeOptions: {
			rows: 3,
		},
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
				oneStringCookie: [false],
			},
		},
	},

	// ============================================
	// Retry/Attempts
	// ============================================

	{
		displayName: 'Attempts',
		name: 'attempts',
		type: 'number',
		default: 1,
		hint: 'Number of attempts to make the request if it fails',
		typeOptions: {
			minValue: 1,
			maxValue: 5,
		},
		required: false,
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
			},
		},
	},
	{
		displayName: 'Timeout (ms)',
		name: 'timeout',
		type: 'number',
		default: 60000,
		hint: 'Request timeout in milliseconds',
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
			},
		},
	},
];

// ============================================
// Antibot Bypass Options
// ============================================

export const antibotFields: INodeProperties[] = [
	{
		displayName: 'Antibot Bypass Options',
		name: 'antibotNotice',
		type: 'notice',
		default: '',
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
				request_type: ['Browser'],
			},
		},
	},
	{
		displayName: 'Cloudflare Bypass',
		name: 'cloudflareBypass',
		type: 'boolean',
		default: false,
		hint: 'Enable Cloudflare-specific bypass techniques',
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
				request_type: ['Browser'],
			},
		},
	},
	{
		displayName: 'Datadome Bypass',
		name: 'datadome',
		type: 'boolean',
		default: false,
		hint: 'Enable Datadome protection bypass using specialized solver',
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
				request_type: ['Browser'],
			},
		},
	},
	{
		displayName: 'Datadome Debug',
		name: 'datadomeDebug',
		type: 'boolean',
		default: false,
		hint: 'Include debug info in Datadome bypass failures',
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
				request_type: ['Browser'],
				datadome: [true],
			},
		},
	},
	{
		displayName: 'Kasada Bypass',
		name: 'kasadaBypass',
		type: 'boolean',
		default: false,
		hint: 'Enable Kasada protection bypass',
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
				request_type: ['Browser'],
			},
		},
	},
	{
		displayName: 'Disable Antibot Detection',
		name: 'disableAntiBot',
		type: 'boolean',
		default: false,
		hint: 'Disable automatic antibot detection (use manual settings)',
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
				request_type: ['Browser'],
			},
		},
	},
	{
		displayName: 'Detect Incapsula',
		name: 'detectIncapsula',
		type: 'boolean',
		default: false,
		hint: 'Enable Incapsula/Imperva detection and solving',
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
				request_type: ['Browser'],
			},
		},
	},
	{
		displayName: 'SPSNSPID Challenge',
		name: 'spsnspidChallenge',
		type: 'boolean',
		default: false,
		hint: 'Handle SPSNSPID challenges',
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
				request_type: ['Browser'],
			},
		},
	},
];

// ============================================
// Captcha Solving Options
// ============================================

export const captchaFields: INodeProperties[] = [
	{
		displayName: 'Automatically Solve Captchas',
		name: 'antibot',
		type: 'boolean',
		default: false,
		hint: 'Automatically detect and solve captchas (hCaptcha, reCAPTCHA, etc.)',
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
				request_type: ['Browser'],
			},
		},
	},
	{
		displayName: 'Always Load Captcha Types',
		name: 'alwaysLoad',
		type: 'multiOptions',
		default: [],
		hint: 'Always load scripts for these captcha types',
		options: [
			{ name: 'reCAPTCHA', value: 'recaptcha' },
			{ name: 'hCaptcha', value: 'hcaptcha' },
			{ name: 'Turnstile', value: 'turnstile' },
		],
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
				request_type: ['Browser'],
			},
		},
	},
	{
		displayName: 'Captcha Answer',
		name: 'captchaAnswer',
		type: 'string',
		default: '',
		hint: 'Manual captcha answer (if you already have the solution)',
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
				request_type: ['Browser'],
			},
		},
	},
	{
		displayName: 'Captcha Success Intercept',
		name: 'captchaSuccessIntercept',
		type: 'string',
		default: '',
		placeholder: 'https://example.com/success',
		hint: 'URL pattern to intercept on captcha success',
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
				request_type: ['Browser'],
			},
		},
	},
];

// ============================================
// Browser Configuration Options
// ============================================

export const browserConfigFields: INodeProperties[] = [
	{
		displayName: 'Browser Type',
		name: 'browserType',
		type: 'options',
		default: 'firefox',
		options: [
			{ name: 'Firefox', value: 'firefox' },
			{ name: 'Chrome', value: 'chrome' },
			{ name: 'Safari', value: 'safari' },
		],
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
				request_type: ['Browser'],
			},
		},
	},
	{
		displayName: 'Browser Min Version',
		name: 'browserMinVersion',
		type: 'number',
		default: 0,
		hint: 'Minimum browser version (0 = any)',
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
				request_type: ['Browser'],
			},
		},
	},
	{
		displayName: 'Browser Max Version',
		name: 'browserMaxVersion',
		type: 'number',
		default: 0,
		hint: 'Maximum browser version (0 = any)',
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
				request_type: ['Browser'],
			},
		},
	},
	{
		displayName: 'Custom User Agent',
		name: 'userAgent',
		type: 'string',
		default: '',
		placeholder: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)...',
		hint: 'Custom user agent string',
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
				request_type: ['Browser'],
			},
		},
	},
	{
		displayName: 'Locales',
		name: 'locales',
		type: 'string',
		default: '',
		placeholder: 'en-US,en',
		hint: 'Browser locales (comma-separated)',
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
				request_type: ['Browser'],
			},
		},
	},
	{
		displayName: 'Auto Set Locale',
		name: 'setLocale',
		type: 'boolean',
		default: false,
		hint: 'Automatically set locale based on proxy location',
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
				request_type: ['Browser'],
			},
		},
	},
	{
		displayName: 'Force Unique Fingerprint',
		name: 'forceUniqueFingerprint',
		type: 'boolean',
		default: false,
		hint: 'Create new browser instance with unique fingerprint for each request',
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
				request_type: ['Browser'],
			},
		},
	},
	{
		displayName: 'WebRTC IPv4',
		name: 'webrtcIpv4',
		type: 'string',
		default: '',
		placeholder: '1.2.3.4',
		hint: 'IPv4 address for WebRTC spoofing',
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
				request_type: ['Browser'],
				forceUniqueFingerprint: [true],
			},
		},
	},
	{
		displayName: 'WebRTC IPv6',
		name: 'webrtcIpv6',
		type: 'string',
		default: '',
		placeholder: '2001:0db8::1',
		hint: 'IPv6 address for WebRTC spoofing',
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
				request_type: ['Browser'],
				forceUniqueFingerprint: [true],
			},
		},
	},
];

// ============================================
// Response Options
// ============================================

export const responseOptionsFields: INodeProperties[] = [
	{
		displayName: 'Response Options',
		name: 'responseOptionsNotice',
		type: 'notice',
		default: '',
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
			},
		},
	},
	{
		displayName: 'Only Status Code',
		name: 'onlyStatusCode',
		type: 'boolean',
		default: false,
		hint: 'Return only the HTTP status code',
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
			},
		},
	},
	{
		displayName: 'Include Inner Text',
		name: 'innerText',
		type: 'boolean',
		default: false,
		hint: 'Include the inner text of the page',
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
				request_type: ['Browser'],
			},
		},
	},
	{
		displayName: 'Include Images',
		name: 'includeImages',
		type: 'boolean',
		default: false,
		hint: 'Include image URLs in the response',
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
				request_type: ['Browser'],
			},
		},
	},
	{
		displayName: 'Include Links',
		name: 'includeLinks',
		type: 'boolean',
		default: false,
		hint: 'Include link URLs in the response',
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
				request_type: ['Browser'],
			},
		},
	},
	{
		displayName: 'Regex Pattern',
		name: 'regex',
		type: 'string',
		default: '',
		placeholder: 'price: \\$([0-9.]+)',
		hint: 'Extract content matching regex pattern(s). Use JSON array for multiple patterns.',
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
			},
		},
	},
	{
		displayName: 'Filter Fields',
		name: 'filter',
		type: 'multiOptions',
		default: [],
		hint: 'Return only specified fields in response',
		options: [
			{ name: 'Response', value: 'response' },
			{ name: 'Cookies', value: 'cookies' },
			{ name: 'Status Code', value: 'statusCode' },
			{ name: 'Headers', value: 'responseHeaders' },
			{ name: 'Current URL', value: 'currentUrl' },
			{ name: 'User Agent', value: 'userAgent' },
		],
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
			},
		},
	},
	{
		displayName: 'Screenshot',
		name: 'screenshot',
		type: 'boolean',
		default: false,
		hint: 'Capture a screenshot of the page',
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
				request_type: ['Browser'],
			},
		},
	},
	{
		displayName: 'Upload Screenshot',
		name: 'screenshotUpload',
		type: 'boolean',
		default: false,
		hint: 'Upload screenshot to storage and return URL',
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
				request_type: ['Browser'],
				screenshot: [true],
			},
		},
	},
	{
		displayName: 'Screenshot Width',
		name: 'screenshotWidth',
		type: 'number',
		default: 1280,
		hint: 'Screenshot width in pixels',
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
				request_type: ['Browser'],
				screenshot: [true],
			},
		},
	},
	{
		displayName: 'Screenshot Height',
		name: 'screenshotHeight',
		type: 'number',
		default: 1024,
		hint: 'Screenshot height in pixels',
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
				request_type: ['Browser'],
				screenshot: [true],
			},
		},
	},
	{
		displayName: 'Generate PDF',
		name: 'pdf',
		type: 'boolean',
		default: false,
		hint: 'Generate a PDF of the page',
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
				request_type: ['Browser'],
			},
		},
	},
	{
		displayName: 'Base64 Screenshot',
		name: 'base64',
		type: 'boolean',
		default: false,
		hint: 'Return screenshot as base64 string',
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
				request_type: ['Browser'],
				screenshot: [true],
			},
		},
	},
	{
		displayName: 'Base64 Response',
		name: 'base64Response',
		type: 'boolean',
		default: false,
		hint: 'Return HTML response as base64',
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
			},
		},
	},
	{
		displayName: 'Binary Response',
		name: 'binary',
		type: 'boolean',
		default: false,
		hint: 'Return binary response data',
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
			},
		},
	},
	{
		displayName: 'List All Redirects',
		name: 'listAllRedirects',
		type: 'boolean',
		default: false,
		hint: 'Track and return all redirect URLs',
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
			},
		},
	},
];

// ============================================
// Request Interception Options
// ============================================

export const interceptionFields: INodeProperties[] = [
	{
		displayName: 'Abort On Detection',
		name: 'abortOnDetection',
		type: 'string',
		default: '',
		placeholder: 'analytics.com, tracking.js',
		hint: 'URL patterns to block (comma-separated)',
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
				request_type: ['Browser'],
			},
		},
	},
	{
		displayName: 'Abort Only POST Requests',
		name: 'abortOnPostRequest',
		type: 'boolean',
		default: false,
		hint: 'Only abort POST requests matching patterns',
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
				request_type: ['Browser'],
			},
		},
	},
	{
		displayName: 'Wait For Abort Detection',
		name: 'waitForAbortOnDetection',
		type: 'boolean',
		default: false,
		hint: 'Wait for abort patterns before continuing',
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
				request_type: ['Browser'],
			},
		},
	},
	{
		displayName: 'Abort Detection Timeout (ms)',
		name: 'waitForAbortOnDetectionTimeout',
		type: 'number',
		default: 45000,
		hint: 'Timeout for waiting for abort patterns',
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
				request_type: ['Browser'],
				waitForAbortOnDetection: [true],
			},
		},
	},
	{
		displayName: 'Blacklisted Domains',
		name: 'blackListedDomains',
		type: 'string',
		default: '',
		placeholder: 'ads.com, tracker.net',
		hint: 'Domains to block (comma-separated)',
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
				request_type: ['Browser'],
			},
		},
	},
	{
		displayName: 'Never Cache Domains',
		name: 'neverCacheDomains',
		type: 'string',
		default: '',
		placeholder: 'api.example.com',
		hint: 'Domains to never cache (comma-separated)',
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
				request_type: ['Browser'],
			},
		},
	},
	{
		displayName: "Don't Load Main Site",
		name: 'dontLoadMainSite',
		type: 'boolean',
		default: false,
		hint: "Don't load main site resources",
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
				request_type: ['Browser'],
			},
		},
	},
	{
		displayName: "Don't Load First Request",
		name: 'dontLoadFirstRequest',
		type: 'boolean',
		default: false,
		hint: 'Skip initial page load',
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
				request_type: ['Browser'],
			},
		},
	},
];

// ============================================
// Advanced Browser Settings
// ============================================

export const AdvancedSettingsForBrowser: INodeProperties[] = [
	{
		displayName: 'Add Random mouse movement',
		name: 'addRandomMouseMovement',
		type: 'boolean',
		default: false,
		hint: 'Add random mouse movements to simulate human interaction during the session',
		required: false,
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
				request_type: ['Browser'],
			},
		},
	},
	{
		displayName: 'Force Mouse Movement',
		name: 'forceMouseMovement',
		type: 'boolean',
		default: false,
		hint: 'Force mouse movement simulation',
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
				request_type: ['Browser'],
			},
		},
	},
	{
		displayName: 'Record Video Session',
		name: 'recordVideoSession',
		type: 'boolean',
		default: false,
		hint: 'Record a video of the browser session for debugging purposes',
		required: false,
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
				request_type: ['Browser'],
			},
		},
	},
	{
		displayName: 'CSS Selector',
		name: 'cssSelector',
		type: 'string',
		default: '',
		placeholder: 'div.content',
		hint: 'CSS selector to wait for or extract content from',
		required: false,
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
				request_type: ['Browser'],
			},
		},
	},
	{
		displayName: 'Href (Optional)',
		name: 'href',
		type: 'string',
		default: '',
		placeholder: 'https://example.com',
		hint: 'URL to navigate to when the CSS selector is used',
		required: false,
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
				request_type: ['Browser'],
			},
		},
	},
	{
		displayName: 'Intercept XHR/Fetch Request',
		name: 'interceptXhrFetchRequest',
		type: 'string',
		default: '',
		placeholder: 'https://example.com/api/v2/Test',
		hint: 'Intercept and return data from a specific XHR/Fetch request. For multiple patterns, use JSON array.',
		required: false,
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
				request_type: ['Browser'],
			},
		},
	},
	{
		displayName: 'Full Page Load',
		name: 'fullPageLoad',
		type: 'boolean',
		default: false,
		hint: 'Wait for full page load before continuing',
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
				request_type: ['Browser'],
			},
		},
	},
	{
		displayName: "Don't Wait on Page Load",
		name: 'dontWaitOnPageLoad',
		type: 'boolean',
		default: false,
		hint: "Don't wait for page load to complete",
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
				request_type: ['Browser'],
			},
		},
	},
	{
		displayName: 'Wait For URL Pattern',
		name: 'waitForUrl',
		type: 'string',
		default: '',
		placeholder: 'https://example.com/success',
		hint: 'Wait for URL to match this pattern before returning',
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
				request_type: ['Browser'],
			},
		},
	},
	{
		displayName: 'Remove Iframes',
		name: 'removeIframes',
		type: 'boolean',
		default: false,
		hint: 'Remove all iframes from the page',
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
				request_type: ['Browser'],
			},
		},
	},
	{
		displayName: 'Block Cookie Banners',
		name: 'blockCookieBanners',
		type: 'boolean',
		default: false,
		hint: 'Automatically block cookie consent banners',
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
				request_type: ['Browser'],
			},
		},
	},
	{
		displayName: 'Use Legacy Connection',
		name: 'legacy',
		type: 'boolean',
		default: false,
		hint: 'Use legacy browser connection (no WebSocket)',
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
				request_type: ['Browser'],
			},
		},
	},
	{
		displayName: 'Use WebSocket Connection',
		name: 'websocketConnection',
		type: 'boolean',
		default: false,
		hint: 'Use WebSocket browser connection',
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
				request_type: ['Browser'],
			},
		},
	},
	{
		displayName: 'LocalStorage Data (JSON)',
		name: 'localStorage',
		type: 'string',
		default: '',
		placeholder: '{"key": "value"}',
		hint: 'LocalStorage data to set (JSON format)',
		typeOptions: {
			rows: 3,
		},
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
				request_type: ['Browser'],
			},
		},
	},
];

// ============================================
// AI Parsing Options
// ============================================

export const aiParsingFields: INodeProperties[] = [
	{
		displayName: 'Enable AI Parsing',
		name: 'autoparse',
		type: 'boolean',
		default: false,
		hint: 'Use AI to parse and structure HTML content',
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
			},
		},
	},
	{
		displayName: 'AI Model',
		name: 'model',
		type: 'options',
		default: 'deepseek',
		options: [
			{ name: 'DeepSeek', value: 'deepseek' },
			{ name: 'GPT-4', value: 'gpt-4' },
			{ name: 'GPT-3.5', value: 'gpt-3.5-turbo' },
		],
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
				autoparse: [true],
			},
		},
	},
	{
		displayName: 'AI API Key',
		name: 'aiApiKey',
		type: 'string',
		default: '',
		typeOptions: {
			password: true,
		},
		hint: 'API key for the AI parsing service',
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
				autoparse: [true],
			},
		},
	},
	{
		displayName: 'Structure Definition (JSON)',
		name: 'structure',
		type: 'string',
		default: '',
		placeholder: '{"title": "Extract page title", "products": [{"name": "Product name", "price": "Price"}]}',
		hint: 'Define the structure for AI parsing (JSON format)',
		typeOptions: {
			rows: 5,
		},
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
				autoparse: [true],
			},
		},
	},
];

// ============================================
// Export All Fields
// ============================================

export const allFields: INodeProperties[] = [
	...sessionFields,
	...publicFields,
	...antibotFields,
	...captchaFields,
	...browserConfigFields,
	...responseOptionsFields,
	...interceptionFields,
	...AdvancedSettingsForBrowser,
	...aiParsingFields,
	...browserActionsFields,
];
