import { INodeProperties } from 'n8n-workflow';
export const scrappeyOperators: INodeProperties[] = [
	{
		displayName: 'Scrappey Operations',
		name: 'scrappeyOperations',
		type: 'options',
		default: 'requestBuilder',
		// eslint-disable-next-line n8n-nodes-base/node-param-options-type-unsorted-items
		options: [
			{
				name: 'Request Builder',
				value: 'requestBuilder',
				description: 'Build a request',
				action: 'Build a request',
			},
			{
				name: 'Handle Error HTTPs Node (Request)',
				value: 'handleErrorHttpRequest',
				description:
					'Handle Error HTTPs Node (Request) that means if you had an error like captcha or cloudflare and error happen, this operator will resend the request with same body,headers,cookies,proxy,etc',
				action: 'Handle Error HTTPs Node (Request)',
			},
			{
				name: 'Handle Error HTTPs Node (Browser)',
				value: 'handleErrorHttpBrowser',
				description:
					'Handle Error HTTPs Node (Browser) as default all advanced settings are enabled like addmovementmouse and antibot is on (that means hcaptcha and cloudflare will be handled)',
				action: 'Handle Error HTTPs Node (Browser)',
			},
		],
	},
];
