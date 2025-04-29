import { INodeProperties } from 'n8n-workflow';
export const scrappeyOperators: INodeProperties[] = [
	{
		displayName: 'Scrappey Operations',
		name: 'scrappeyOperations',
		type: 'options',
		default: 'requestBuilder',
		options: [
			{
				name: 'Request Builder',
				value: 'requestBuilder',
				description:
					'Create a customized HTTP or browser request with advanced configuration options',
				action: 'Build a request',
			},
			{
				name: 'HTTP Request • Auto-Retry on Protection',
				value: 'httpRequestAutoRetry',
				description:
					'Automatically retries an HTTP request when it is blocked by CAPTCHA, Cloudflare, or similar anti-bot measures, resending the identical payload, headers, cookies, and proxy settings',
				action: 'Handle Error HTTPs Node (Request)',
			},
			{
				name: 'Browser Request • Auto-Retry & Anti-Bot',
				value: 'httpRequestAutoRetryBrowser',
				description:
					'Executes a browser-based request with built-in anti-bot techniques (movement emulation, hCaptcha/Cloudflare bypass, etc.) and automatically retries if protection pages are encountered',
				action: 'Handle Error HTTPs Node (Browser)',
			},
		],
	},
];
