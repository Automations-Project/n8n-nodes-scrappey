import { ICredentialType, INodeProperties, ICredentialTestRequest } from 'n8n-workflow';

export class ScrappeyApi implements ICredentialType {
	name = 'scrappeyApi';
	displayName = 'Scrappey API';
	icon = 'file:Scrappey.svg' as const;
	documentationUrl = 'https://wiki.scrappey.com';
	properties: INodeProperties[] = [
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
			displayName: 'Add your custom proxy',
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

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://publisher.scrappey.com/api/v1',
			url: '/balance',
			method: 'GET',
			qs: {
				key: '={{$credentials.apiKey}}'
			},
		},
	};
}
