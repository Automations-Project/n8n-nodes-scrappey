/* eslint-disable n8n-nodes-base/node-param-display-name-miscased */
/* eslint-disable n8n-nodes-base/node-param-description-excess-final-period */
/* eslint-disable n8n-nodes-base/node-param-options-type-unsorted-items */
/* eslint-disable n8n-nodes-base/node-param-required-false */
import { v4 as uuidGenerate } from 'uuid';
import { INodeProperties } from 'n8n-workflow';
import { Static_Country_Proxies } from './utils';
export const publicFields: INodeProperties[] = [
	{
		displayName:
			'✨ Feel free to support us by using our Scrappey <a href="https://scrappey.com/?ref=karek" target="_blank">Affiliate Link</a> ✨ Thanks for your support! 💖',
		name: 'affiliateMessage',
		type: 'notice',
		default: '',
	},
	{
		displayName: 'Allow using Credinital Proxy?',
		name: 'allowCredinitalProxy',
		type: 'boolean',
		default: false,
		hint: 'Override proxy settings from HTTP-Request Node. When enabled, any proxy configured in the HTTP-Request Node will be ignored, even if available.',
		required: false,
		displayOptions: {
			show: {
				scrappeyOperations: ['httpRequestAutoRetry', 'browserRequestAutoRetry'],
			},
		},
	},
	{
		displayName: 'URL',
		name: 'url',
		type: 'string',
		default: '',
		hint: 'URL OF THE PAGE TO SCRAP',
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
				scrappeyOperations: ['requestBuilder'],
			},
		},
	},
	{
		displayName: 'Body OR Params?',
		name: 'bodyOrParams',
		type: 'options',
		default: 'params_used',
		hint: 'Select Body or Params',
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
		hint: 'Params to use for the request',
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
		displayName: 'User Season',
		name: 'userSeason',
		type: 'string',
		default: uuidGenerate(),
		hint: 'User season to use for the request',
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
			},
		},
		typeOptions: {
			multipleValues: true,
		},
	},
	{
		displayName: 'One String Cookie',
		name: 'oneStringCookie',
		type: 'boolean',
		default: false,
		hint: 'One string cookie to use for the request',
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
		hint: 'Cookie to use for the request',
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
		displayName: 'Custom Proxy Country',
		name: 'customProxyCountry',
		type: 'options',
		options: Static_Country_Proxies,
		default: '',
		hint: 'Custom proxy country to use for the request',
		required: false,
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
			},
		},
	},
	{
		displayName: 'Datadome',
		name: 'datadome',
		type: 'boolean',
		default: false,
		hint: 'Get the best results by clicking a preconfig. Advanced includes all most common antibots.',
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
				request_type: ['Browser'],
			},
		},
	},
	{
		displayName: 'Custom Proxy',
		name: 'custom_proxy',
		type: 'boolean',
		default: false,
		hint: 'That means the proxy in the credentials will be sent with the request.',
		required: false,
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
		displayName: 'Attempts',
		name: 'attempts',
		type: 'number',
		default: 1,
		hint: 'Number of attempts to make the request',
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
		hint: 'Solve hcaptcha & recaptcha',
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
		hint: 'Add random mouse movement to the session',
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
		hint: 'Record a video of the session',
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
		hint: 'CSS selector to use for the request',
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
		hint: 'Href to use with cssSelector',
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
		hint: 'By intercepting an XHR/Fetch request it will return the data of the intercepted request instead of the main scrape url. Example: instead of returning google.com it will return the result of google.com/result.json in text format.',
		required: false,
		displayOptions: {
			show: {
				scrappeyOperations: ['requestBuilder'],
				request_type: ['Browser'],
			},
		},
	},
];
