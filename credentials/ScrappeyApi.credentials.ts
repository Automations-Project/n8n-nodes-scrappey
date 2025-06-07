import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class ScrappeyApi implements ICredentialType {
	name = 'scrappeyApi';
	displayName = 'Scrappey API';
	icon = 'file:Scrappey.svg' as const;
	documentationUrl = 'https://wiki.scrappey.com';
	properties: INodeProperties[] = [
		{
			displayName:
'Get 750 Direct (bot-bypass) & 150 GUI Browser requests free—sign up now 👉 <a href="https://nodes.n8n.community/scrappey/signup" target="_blank">Start scraping</a>',
			name: 'affiliateMessage',
			type: 'notice',
			default: '',
		},

		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			default: '',
			required: true,
			typeOptions: {
				password: true,
			},
		},
		{
			displayName: 'Allow Proxy?',
			name: 'allowProxy',
			type: 'boolean',
			default: false,
		},
		{
			displayName: 'Proxy URL Socks-5 Socks-4 Http Https',
			name: 'proxyUrl',
			type: 'string',
			default: '',
			required: false,
			hint: 'Optional. Proxy URL to be used for the scraping.',
			displayOptions: {
				show: {
					allowProxy: [true],
				},
			},
		},
		{
			displayName: 'Whitelisted Domains',
			name: 'whitelistedDomains',
			type: 'string',
			placeholder: '["google.com","youtube.com","n8n.nskha.com"]',
			default: '',
			required: false,
			hint: "Optional. List of domains that are allowed to be scraped. If isn't set, all domains are allowed",
		},
	];
}
