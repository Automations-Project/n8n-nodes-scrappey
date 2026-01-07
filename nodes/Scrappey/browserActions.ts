/* eslint-disable n8n-nodes-base/node-param-display-name-miscased */
/* eslint-disable n8n-nodes-base/node-param-description-excess-final-period */
/* eslint-disable n8n-nodes-base/node-param-options-type-unsorted-items */
import { INodeProperties } from 'n8n-workflow';

// ============================================
// Browser Actions Field Definitions
// ============================================

export const browserActionsFields: INodeProperties[] = [
	// Main Browser Actions Collection
	{
		displayName: 'Browser Actions',
		name: 'browserActions',
		type: 'fixedCollection',
		default: {},
		placeholder: 'Add Browser Action',
		description: 'Define a sequence of browser actions to execute on the page',
		typeOptions: {
			multipleValues: true,
			sortable: true,
		},
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
				request_type: ['Browser'],
			},
		},
		options: [
			{
				name: 'actions',
				displayName: 'Actions',
				values: [
					// Action Type Selector
					{
						displayName: 'Action Type',
						name: 'type',
						type: 'options',
						default: 'click',
						options: [
							{ name: 'Click', value: 'click', description: 'Click on an element using CSS selector' },
							{ name: 'Type', value: 'type', description: 'Type text into an input field' },
							{ name: 'Navigate (goto)', value: 'goto', description: 'Navigate to a new URL' },
							{ name: 'Wait', value: 'wait', description: 'Wait for a specified time' },
							{ name: 'Wait for Selector', value: 'wait_for_selector', description: 'Wait for an element to appear' },
							{ name: 'Wait for Function', value: 'wait_for_function', description: 'Wait for JavaScript condition' },
							{ name: 'Wait for Load State', value: 'wait_for_load_state', description: 'Wait for page load state' },
							{ name: 'Wait for Cookie', value: 'wait_for_cookie', description: 'Wait for a cookie to be set' },
							{ name: 'Execute JavaScript', value: 'execute_js', description: 'Execute JavaScript code on the page' },
							{ name: 'Scroll', value: 'scroll', description: 'Scroll to an element or page bottom' },
							{ name: 'Hover', value: 'hover', description: 'Hover over an element' },
							{ name: 'Keyboard', value: 'keyboard', description: 'Simulate keyboard key presses' },
							{ name: 'Dropdown', value: 'dropdown', description: 'Select an option from a dropdown' },
							{ name: 'Switch Iframe', value: 'switch_iframe', description: 'Switch context to an iframe' },
							{ name: 'Set Viewport', value: 'set_viewport', description: 'Change browser viewport size' },
							{ name: 'Conditional (if)', value: 'if', description: 'Execute actions conditionally' },
							{ name: 'Loop (while)', value: 'while', description: 'Loop actions while condition is true' },
							{ name: 'Solve Captcha', value: 'solve_captcha', description: 'Solve various captcha types' },
							{ name: 'Discord Login', value: 'discord_login', description: 'Login to Discord with token' },
							{ name: 'Remove Iframes', value: 'remove_iframes', description: 'Remove all iframes from page' },
						],
					},
					// When to Execute
					{
						displayName: 'When',
						name: 'when',
						type: 'options',
						default: 'afterload',
						options: [
							{ name: 'After Page Load', value: 'afterload' },
							{ name: 'Before Page Load', value: 'beforeload' },
						],
						description: 'When to execute this action',
					},
					// Ignore Errors
					{
						displayName: 'Ignore Errors',
						name: 'ignoreErrors',
						type: 'boolean',
						default: false,
						description: 'Whether to continue execution if this action fails',
					},
					// Timeout
					{
						displayName: 'Timeout (ms)',
						name: 'timeout',
						type: 'number',
						default: 60000,
						description: 'Timeout in milliseconds for this action',
					},

					// ============ CLICK ACTION FIELDS ============
					{
						displayName: 'CSS Selector',
						name: 'cssSelector',
						type: 'string',
						default: '',
						placeholder: '#submit-button',
						description: 'CSS selector of the element to interact with',
						displayOptions: {
							show: {
								type: ['click', 'type', 'wait_for_selector', 'scroll', 'hover', 'dropdown', 'switch_iframe'],
							},
						},
					},
					{
						displayName: 'Wait After (ms)',
						name: 'wait',
						type: 'number',
						default: 0,
						description: 'Time to wait after performing the action',
						displayOptions: {
							show: {
								type: ['click', 'type', 'goto', 'keyboard', 'dropdown', 'set_viewport', 'discord_login'],
							},
						},
					},
					{
						displayName: 'Wait for Selector',
						name: 'waitForSelector',
						type: 'string',
						default: '',
						placeholder: '.success-message',
						description: 'Wait for this selector to appear after the action',
						displayOptions: {
							show: {
								type: ['click', 'keyboard', 'dropdown'],
							},
						},
					},
					{
						displayName: 'Direct Click',
						name: 'direct',
						type: 'boolean',
						default: false,
						description: 'Whether to use direct click instead of cursor simulation',
						displayOptions: {
							show: {
								type: ['click', 'type', 'discord_login'],
							},
						},
					},

					// ============ TYPE ACTION FIELDS ============
					{
						displayName: 'Text to Type',
						name: 'text',
						type: 'string',
						default: '',
						placeholder: 'Enter your text here',
						description: 'The text to type into the input field',
						displayOptions: {
							show: {
								type: ['type'],
							},
						},
					},

					// ============ GOTO ACTION FIELDS ============
					{
						displayName: 'URL',
						name: 'url',
						type: 'string',
						default: '',
						placeholder: 'https://example.com/page2',
						description: 'The URL to navigate to',
						displayOptions: {
							show: {
								type: ['goto'],
							},
						},
					},

					// ============ WAIT ACTION FIELDS ============
					{
						displayName: 'Wait Time (ms)',
						name: 'waitTime',
						type: 'number',
						default: 1000,
						description: 'Time to wait in milliseconds',
						displayOptions: {
							show: {
								type: ['wait'],
							},
						},
					},

					// ============ WAIT FOR FUNCTION FIELDS ============
					{
						displayName: 'JavaScript Code',
						name: 'code',
						type: 'string',
						default: '',
						placeholder: 'window.dataLoaded === true',
						description: 'JavaScript code that returns truthy when condition is met',
						typeOptions: {
							rows: 3,
						},
						displayOptions: {
							show: {
								type: ['wait_for_function', 'execute_js'],
							},
						},
					},
					{
						displayName: "Don't Return Value",
						name: 'dontReturnValue',
						type: 'boolean',
						default: false,
						description: 'Whether to skip capturing the return value',
						displayOptions: {
							show: {
								type: ['execute_js'],
							},
						},
					},

					// ============ WAIT FOR LOAD STATE FIELDS ============
					{
						displayName: 'Load State',
						name: 'waitForLoadState',
						type: 'options',
						default: 'networkidle',
						options: [
							{ name: 'DOM Content Loaded', value: 'domcontentloaded' },
							{ name: 'Network Idle', value: 'networkidle' },
							{ name: 'Full Load', value: 'load' },
						],
						displayOptions: {
							show: {
								type: ['wait_for_load_state'],
							},
						},
					},

					// ============ WAIT FOR COOKIE FIELDS ============
					{
						displayName: 'Cookie Name',
						name: 'cookieName',
						type: 'string',
						default: '',
						placeholder: 'session_id',
						description: 'Name of the cookie to wait for',
						displayOptions: {
							show: {
								type: ['wait_for_cookie'],
							},
						},
					},
					{
						displayName: 'Cookie Value',
						name: 'cookieValue',
						type: 'string',
						default: '',
						placeholder: 'optional-expected-value',
						description: 'Optional expected value of the cookie',
						displayOptions: {
							show: {
								type: ['wait_for_cookie'],
							},
						},
					},
					{
						displayName: 'Cookie Domain',
						name: 'cookieDomain',
						type: 'string',
						default: '',
						placeholder: 'example.com',
						description: 'Domain the cookie should be set on',
						displayOptions: {
							show: {
								type: ['wait_for_cookie'],
							},
						},
					},
					{
						displayName: 'Poll Interval (ms)',
						name: 'pollIntervalMs',
						type: 'number',
						default: 200,
						description: 'How often to check for the cookie',
						displayOptions: {
							show: {
								type: ['wait_for_cookie'],
							},
						},
					},

					// ============ SCROLL ACTION FIELDS ============
					{
						displayName: 'Repeat',
						name: 'repeat',
						type: 'number',
						default: 1,
						description: 'Number of times to repeat the scroll',
						displayOptions: {
							show: {
								type: ['scroll'],
							},
						},
					},
					{
						displayName: 'Delay Between Scrolls (ms)',
						name: 'delayMs',
						type: 'number',
						default: 100,
						description: 'Delay between scroll actions',
						displayOptions: {
							show: {
								type: ['scroll'],
							},
						},
					},

					// ============ KEYBOARD ACTION FIELDS ============
					{
						displayName: 'Key',
						name: 'value',
						type: 'options',
						default: 'enter',
						options: [
							{ name: 'Enter', value: 'enter' },
							{ name: 'Tab', value: 'tab' },
							{ name: 'Space', value: 'space' },
							{ name: 'Arrow Down', value: 'arrowdown' },
							{ name: 'Arrow Up', value: 'arrowup' },
							{ name: 'Arrow Left', value: 'arrowleft' },
							{ name: 'Arrow Right', value: 'arrowright' },
							{ name: 'Backspace', value: 'backspace' },
							{ name: 'Clear', value: 'clear' },
						],
						displayOptions: {
							show: {
								type: ['keyboard'],
							},
						},
					},
					{
						displayName: 'Focus Element First',
						name: 'keyboardCssSelector',
						type: 'string',
						default: '',
						placeholder: '#input-field',
						description: 'CSS selector of element to focus before pressing key',
						displayOptions: {
							show: {
								type: ['keyboard'],
							},
						},
					},

					// ============ DROPDOWN ACTION FIELDS ============
					{
						displayName: 'Selection Method',
						name: 'dropdownMethod',
						type: 'options',
						default: 'value',
						options: [
							{ name: 'By Value', value: 'value' },
							{ name: 'By Index', value: 'index' },
						],
						displayOptions: {
							show: {
								type: ['dropdown'],
							},
						},
					},
					{
						displayName: 'Option Value',
						name: 'dropdownValue',
						type: 'string',
						default: '',
						placeholder: 'US',
						description: 'The value of the option to select',
						displayOptions: {
							show: {
								type: ['dropdown'],
								dropdownMethod: ['value'],
							},
						},
					},
					{
						displayName: 'Option Index',
						name: 'dropdownIndex',
						type: 'number',
						default: 0,
						description: 'The index of the option to select (0-based)',
						displayOptions: {
							show: {
								type: ['dropdown'],
								dropdownMethod: ['index'],
							},
						},
					},

					// ============ SET VIEWPORT FIELDS ============
					{
						displayName: 'Width',
						name: 'viewportWidth',
						type: 'number',
						default: 1280,
						description: 'Viewport width in pixels',
						displayOptions: {
							show: {
								type: ['set_viewport'],
							},
						},
					},
					{
						displayName: 'Height',
						name: 'viewportHeight',
						type: 'number',
						default: 1024,
						description: 'Viewport height in pixels',
						displayOptions: {
							show: {
								type: ['set_viewport'],
							},
						},
					},

					// ============ IF/WHILE ACTION FIELDS ============
					{
						displayName: 'Condition',
						name: 'condition',
						type: 'string',
						default: '',
						placeholder: "document.querySelector('.captcha') !== null",
						description: 'JavaScript condition to evaluate',
						typeOptions: {
							rows: 2,
						},
						displayOptions: {
							show: {
								type: ['if', 'while'],
							},
						},
					},
					{
						displayName: 'Then Actions (JSON)',
						name: 'thenActions',
						type: 'string',
						default: '[]',
						description: 'Array of actions to execute if condition is true (JSON format)',
						typeOptions: {
							rows: 4,
						},
						displayOptions: {
							show: {
								type: ['if', 'while'],
							},
						},
					},
					{
						displayName: 'Else Actions (JSON)',
						name: 'orActions',
						type: 'string',
						default: '[]',
						description: 'Array of actions to execute if condition is false (JSON format)',
						typeOptions: {
							rows: 4,
						},
						displayOptions: {
							show: {
								type: ['if'],
							},
						},
					},
					{
						displayName: 'Max Iterations',
						name: 'maxAttempts',
						type: 'number',
						default: 10,
						description: 'Maximum number of loop iterations to prevent infinite loops',
						displayOptions: {
							show: {
								type: ['while'],
							},
						},
					},

					// ============ SOLVE CAPTCHA FIELDS ============
					{
						displayName: 'Captcha Type',
						name: 'captcha',
						type: 'options',
						default: 'turnstile',
						options: [
							{ name: 'Cloudflare Turnstile', value: 'turnstile' },
							{ name: 'reCAPTCHA v2', value: 'recaptcha' },
							{ name: 'reCAPTCHA v2 (with sitekey)', value: 'recaptchav2' },
							{ name: 'reCAPTCHA v3', value: 'recaptchav3' },
							{ name: 'hCaptcha', value: 'hcaptcha' },
							{ name: 'hCaptcha (with sitekey)', value: 'hcaptcha_inside' },
							{ name: 'hCaptcha Enterprise', value: 'hcaptcha_enterprise_inside' },
							{ name: 'FunCaptcha (Arkose Labs)', value: 'funcaptcha' },
							{ name: 'PerimeterX', value: 'perimeterx' },
							{ name: 'MTCaptcha', value: 'mtcaptcha' },
							{ name: 'MTCaptcha Isolated', value: 'mtcaptchaisolated' },
							{ name: 'v4Guard', value: 'v4guard' },
							{ name: 'Custom (Image)', value: 'custom' },
							{ name: 'FingerprintJS', value: 'fingerprintjscom' },
							{ name: 'FingerprintJS CurseForge', value: 'fingerprintjs_curseforge' },
						],
						displayOptions: {
							show: {
								type: ['solve_captcha'],
							},
						},
					},
					{
						displayName: 'Site Key',
						name: 'sitekey',
						type: 'string',
						default: '',
						placeholder: '0x4AAAAAAA...',
						description: 'The captcha site key',
						displayOptions: {
							show: {
								type: ['solve_captcha'],
							},
						},
					},
					{
						displayName: 'Captcha CSS Selector',
						name: 'captchaCssSelector',
						type: 'string',
						default: '',
						placeholder: '.cf-turnstile',
						description: 'CSS selector of the captcha container',
						displayOptions: {
							show: {
								type: ['solve_captcha'],
							},
						},
					},
					{
						displayName: 'Website URL',
						name: 'websiteUrl',
						type: 'string',
						default: '',
						placeholder: 'https://example.com',
						description: 'The website URL for captcha solving',
						displayOptions: {
							show: {
								type: ['solve_captcha'],
							},
						},
					},
					{
						displayName: 'Website Key',
						name: 'websiteKey',
						type: 'string',
						default: '',
						description: 'Alternative website key for captcha',
						displayOptions: {
							show: {
								type: ['solve_captcha'],
							},
						},
					},
					{
						displayName: 'Input Selector',
						name: 'inputSelector',
						type: 'string',
						default: '',
						placeholder: '#captcha-input',
						description: 'CSS selector of the input to fill with captcha token',
						displayOptions: {
							show: {
								type: ['solve_captcha'],
							},
						},
					},
					{
						displayName: 'Click Selector',
						name: 'clickSelector',
						type: 'string',
						default: '',
						placeholder: '#submit',
						description: 'CSS selector of button to click after solving',
						displayOptions: {
							show: {
								type: ['solve_captcha'],
							},
						},
					},
					{
						displayName: 'Iframe Selector',
						name: 'iframeSelector',
						type: 'string',
						default: '',
						placeholder: '#captcha-iframe',
						description: 'CSS selector of captcha iframe if applicable',
						displayOptions: {
							show: {
								type: ['solve_captcha'],
							},
						},
					},
					{
						displayName: 'Action',
						name: 'captchaAction',
						type: 'string',
						default: '',
						description: 'reCAPTCHA action parameter',
						displayOptions: {
							show: {
								type: ['solve_captcha'],
								captcha: ['recaptchav3'],
							},
						},
					},
					{
						displayName: 'Invisible Captcha',
						name: 'invisible',
						type: 'boolean',
						default: false,
						description: 'Whether the captcha is invisible',
						displayOptions: {
							show: {
								type: ['solve_captcha'],
							},
						},
					},
					{
						displayName: 'Reset Before Solving',
						name: 'captchaReset',
						type: 'boolean',
						default: false,
						description: 'Whether to reset captcha state before solving',
						displayOptions: {
							show: {
								type: ['solve_captcha'],
							},
						},
					},
					{
						displayName: 'Fast Mode',
						name: 'captchaFast',
						type: 'boolean',
						default: false,
						description: 'Whether to use fast solving mode',
						displayOptions: {
							show: {
								type: ['solve_captcha'],
							},
						},
					},
					{
						displayName: 'Base64 Image',
						name: 'base64Image',
						type: 'string',
						default: '',
						description: 'Base64 encoded image for custom captcha',
						typeOptions: {
							rows: 3,
						},
						displayOptions: {
							show: {
								type: ['solve_captcha'],
								captcha: ['custom'],
							},
						},
					},

					// ============ DISCORD LOGIN FIELDS ============
					{
						displayName: 'Discord Token',
						name: 'token',
						type: 'string',
						default: '',
						typeOptions: {
							password: true,
						},
						description: 'Discord authentication token',
						displayOptions: {
							show: {
								type: ['discord_login'],
							},
						},
					},
				],
			},
		],
	},
];

// Helper function to build browser actions array from n8n UI data
export function buildBrowserActionsArray(actionsData: any): any[] {
	if (!actionsData || !actionsData.actions || !Array.isArray(actionsData.actions)) {
		return [];
	}

	return actionsData.actions.map((action: any) => {
		const baseAction: any = {
			type: action.type,
		};

		// Add optional common properties if they have non-default values
		if (action.when && action.when !== 'afterload') {
			baseAction.when = action.when;
		}
		if (action.ignoreErrors === true) {
			baseAction.ignoreErrors = true;
		}
		if (action.timeout && action.timeout !== 60000) {
			baseAction.timeout = action.timeout;
		}

		switch (action.type) {
			case 'click':
				baseAction.cssSelector = action.cssSelector;
				if (action.wait) baseAction.wait = action.wait;
				if (action.waitForSelector) baseAction.waitForSelector = action.waitForSelector;
				if (action.direct) baseAction.direct = action.direct;
				break;

			case 'type':
				baseAction.cssSelector = action.cssSelector;
				baseAction.text = action.text;
				if (action.wait) baseAction.wait = action.wait;
				if (action.direct) baseAction.direct = action.direct;
				break;

			case 'goto':
				baseAction.url = action.url;
				if (action.wait) baseAction.wait = action.wait;
				break;

			case 'wait':
				baseAction.wait = action.waitTime || 1000;
				break;

			case 'wait_for_selector':
				baseAction.cssSelector = action.cssSelector;
				break;

			case 'wait_for_function':
				baseAction.code = action.code;
				break;

			case 'wait_for_load_state':
				baseAction.waitForLoadState = action.waitForLoadState;
				break;

			case 'wait_for_cookie':
				baseAction.cookieName = action.cookieName;
				if (action.cookieValue) baseAction.cookieValue = action.cookieValue;
				if (action.cookieDomain) baseAction.cookieDomain = action.cookieDomain;
				if (action.pollIntervalMs) baseAction.pollIntervalMs = action.pollIntervalMs;
				break;

			case 'execute_js':
				baseAction.code = action.code;
				if (action.dontReturnValue) baseAction.dontReturnValue = action.dontReturnValue;
				break;

			case 'scroll':
				if (action.cssSelector) baseAction.cssSelector = action.cssSelector;
				if (action.repeat) baseAction.repeat = action.repeat;
				if (action.delayMs) baseAction.delayMs = action.delayMs;
				break;

			case 'hover':
				baseAction.cssSelector = action.cssSelector;
				break;

			case 'keyboard':
				baseAction.value = action.value;
				if (action.keyboardCssSelector) baseAction.cssSelector = action.keyboardCssSelector;
				if (action.wait) baseAction.wait = action.wait;
				if (action.waitForSelector) baseAction.waitForSelector = action.waitForSelector;
				break;

			case 'dropdown':
				baseAction.cssSelector = action.cssSelector;
				if (action.dropdownMethod === 'index') {
					baseAction.index = action.dropdownIndex;
				} else {
					baseAction.value = action.dropdownValue;
				}
				if (action.wait) baseAction.wait = action.wait;
				if (action.waitForSelector) baseAction.waitForSelector = action.waitForSelector;
				break;

			case 'switch_iframe':
				baseAction.cssSelector = action.cssSelector;
				break;

			case 'set_viewport':
				if (action.viewportWidth) baseAction.width = action.viewportWidth;
				if (action.viewportHeight) baseAction.height = action.viewportHeight;
				if (action.wait) baseAction.wait = action.wait;
				break;

			case 'if':
				baseAction.condition = action.condition;
				try {
					baseAction.then = JSON.parse(action.thenActions || '[]');
				} catch (error) {
					throw new Error(`Invalid JSON in 'Then Actions' for 'if' action: ${error instanceof Error ? error.message : 'Unknown error'}. Please provide valid JSON array format.`);
				}
				if (action.orActions && action.orActions.trim() !== '' && action.orActions.trim() !== '[]') {
					try {
						const orActions = JSON.parse(action.orActions);
						if (Array.isArray(orActions) && orActions.length > 0) {
							baseAction.or = orActions;
						}
					} catch (error) {
						throw new Error(`Invalid JSON in 'Else Actions' for 'if' action: ${error instanceof Error ? error.message : 'Unknown error'}. Please provide valid JSON array format.`);
					}
				}
				break;

			case 'while':
				baseAction.condition = action.condition;
				try {
					baseAction.then = JSON.parse(action.thenActions || '[]');
				} catch (error) {
					throw new Error(`Invalid JSON in 'Then Actions' for 'while' action: ${error instanceof Error ? error.message : 'Unknown error'}. Please provide valid JSON array format.`);
				}
				if (action.maxAttempts) baseAction.maxAttempts = action.maxAttempts;
				break;

			case 'solve_captcha':
				baseAction.captcha = action.captcha;
				const captchaData: any = {};
				if (action.sitekey) captchaData.sitekey = action.sitekey;
				if (action.captchaAction) captchaData.action = action.captchaAction;
				if (action.invisible) captchaData.invisible = action.invisible;
				if (action.base64Image) captchaData.base64Image = action.base64Image;
				if (action.captchaCssSelector) captchaData.cssSelector = action.captchaCssSelector;
				if (action.captchaReset) captchaData.reset = action.captchaReset;
				if (action.captchaFast) captchaData.fast = action.captchaFast;
				
				if (Object.keys(captchaData).length > 0) {
					baseAction.captchaData = captchaData;
				}
				if (action.websiteUrl) baseAction.websiteUrl = action.websiteUrl;
				if (action.websiteKey) baseAction.websiteKey = action.websiteKey;
				if (action.inputSelector) baseAction.inputSelector = action.inputSelector;
				if (action.clickSelector) baseAction.clickSelector = action.clickSelector;
				if (action.iframeSelector) baseAction.iframeSelector = action.iframeSelector;
				break;

			case 'discord_login':
				baseAction.token = action.token;
				if (action.direct) baseAction.direct = action.direct;
				if (action.wait) baseAction.wait = action.wait;
				break;

			case 'remove_iframes':
				// No additional properties needed
				break;
		}

		return baseAction;
	});
}

