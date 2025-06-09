/* eslint-disable n8n-nodes-base/node-param-display-name-miscased */
/* eslint-disable n8n-nodes-base/node-param-description-excess-final-period */
/* eslint-disable n8n-nodes-base/node-param-options-type-unsorted-items */
/* eslint-disable n8n-nodes-base/node-param-required-false */
import { INodeProperties } from 'n8n-workflow';
import { Static_Country_Proxies , generateUUID} from './utils';

export const publicFields: INodeProperties[] = [
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
	{
		displayName: 'HTTP Method',
		name: 'httpMethod',
		type: 'options',
		default: 'request.get',
		hint: 'HTTP method to use with the URL',
		options: [
			{
				name: 'GET',
				value: 'request.get',
			},
			{
				name: 'POST',
				value: 'request.post',
			},
			{
				name: 'PUT',
				value: 'request.put',
			},
			{
				name: 'DELETE',
				value: 'request.delete',
			},
			{
				name: 'PATCH',
				value: 'request.patch',
			},
			{
				name: 'PUBLISH',
				value: 'request.publish',
			},
		],
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
			},
		},
	},
	{
		displayName: 'Request Type',
		name: 'request_type',
		type: 'options',
		default: 'Request',
		options: [
			{
				name: 'Browser',
				value: 'Browser',
			},
			{
				name: 'Request',
				value: 'Request',
			},
			{
				name: 'Patched Chrome Browser',
				value: 'PatchedChrome',
			},
		],
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
			},
		},
	},
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
		],
		default: 'proxyFromCredentials',
		displayOptions: {
			show: {
				scrappeyOperations: [
					'requestBuilder',
					'httpRequestAutoRetry',
					'httpRequestAutoRetryBrowser',
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
			{
				name: 'Residential proxy',
				value: '',
			},
			{
				name: 'Premium residential proxy',
				value: 'premiumProxy',
			},
			{
				name: 'Datacenter proxy',
				value: 'datacenter',
			},
			{
				name: 'Mobile proxy',
				value: 'mobileProxy',
			},
		],
		displayOptions: {
			show: {
				scrappeyOperations: [
					'requestBuilder',
					'httpRequestAutoRetry',
					'httpRequestAutoRetryBrowser',
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
				scrappeyOperations: ['requestBuilder'],
				proxyType: [''],
				whichProxyToUse: ['proxyFromScrappey'],
			},
		},
	},
	{
		displayName: 'Body OR Params?',
		name: 'bodyOrParams',
		type: 'options',
		default: 'params_used',
		hint: 'Select whether to use Body or Params for the request',
		options: [
			{
				name: 'Body',
				value: 'body_used',
			},
			{
				name: 'Params',
				value: 'params_used',
			},
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
		displayName: 'Headers Input Method',
		name: 'headersInputMethod',
		type: 'options',
		default: 'fields',
		hint: 'Choose how to input headers',
		options: [
			{
				name: 'Using Fields Below',
				value: 'fields',
			},
			{
				name: 'Using JSON',
				value: 'json',
			},
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
		displayName: 'Datadome',
		name: 'datadome',
		type: 'boolean',
		default: false,
		hint: 'Enable Datadome protection bypass. Get the best results by selecting a preconfigured option. Advanced includes all common antibot protections.',
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
				request_type: ['Browser'],
			},
		},
	},
	{
		displayName: 'Attempts',
		name: 'attempts',
		type: 'number',
		default: 1,
		hint: 'Number of attempts to make the request if it fails',
		typeOptions: {
			minValue: 1,
			maxValue: 3,
		},
		required: false,
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
			},
		},
	},
];

export const AdvancedSettingsForBrowser: INodeProperties[] = [
	{
		displayName: 'Antibot',
		name: 'antibot',
		type: 'boolean',
		default: false,
		hint: 'Enable automatic solving of hCaptcha and reCAPTCHA challenges',
		required: false,
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
				request_type: ['Browser'],
			},
		},
	},
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
		placeholder:
			'div[class="px-mobile-1 px-tablet-1 pt-mobile-0 pt-desktop-6 pt-tablet-6 pt-widescreen-6 pb-mobile-7 pb-desktop-6 pb-tablet-6 pb-widescreen-6"]',
		hint: 'CSS selector to target specific elements on the page',
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
		hint: 'Intercept and return data from a specific XHR/Fetch request rather than the main page. For example, instead of returning google.com content, it will return the data from google.com/result.json in text format.',
		required: false,
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
				request_type: ['Browser'],
			},
		},
	},
];
