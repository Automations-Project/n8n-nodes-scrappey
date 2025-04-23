import { IAuthenticateGeneric, ICredentialType, INodeProperties } from 'n8n-workflow';

export class ScrappeyApi implements ICredentialType {
	name = 'scrappeyApi';
	displayName = 'Scrappey API';
	documentationUrl = 'https://wiki.scrappey.com';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			default: '',
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
		// {
		// 	displayName: 'Custom Browser/OperatorSystem/Device',
		// 	name: 'customEnvironment',
		// 	type: 'boolean',
		// 	default: false,
		// 	required: true,
		// 	hint: 'Optional. Custom browser, operator system or device to be used for the scraping.',
		// },
		// {
		// 	displayName: 'Browser',
		// 	name: 'browser',
		// 	type: 'string',
		// 	default:
		// 		'"browser": [{ "name": "chrome", "minVersion": 116, "maxVersion": 117 }{ "name": "firefox", "minVersion": 116, "maxVersion": 117 }]',
		// 	hint: 'Optional. Setting the browser name, min version and max version. Options: chrome, firefox and safari',
		// 	displayOptions: {
		// 		show: {
		// 			customEnvironment: [true],
		// 		},
		// 	},
		// },
		// {
		// 	displayName: 'Operator System',
		// 	name: 'operatorSystem',
		// 	type: 'options',
		// 	default: 'windows',
		// 	hint: 'Optional. Setting the operating system, min version and max version. Options: windows, macos, linux, android and ios',
		// 	options: [
		// 		{
		// 			name: 'Windows',
		// 			value: 'windows',
		// 		},
		// 		{
		// 			name: 'MacOS',
		// 			value: 'macos',
		// 		},
		// 		{
		// 			name: 'Linux',
		// 			value: 'linux',
		// 		},
		// 		{
		// 			name: 'Android',
		// 			value: 'android',
		// 		},
		// 		{
		// 			name: 'iOS',
		// 			value: 'ios',
		// 		},
		// 	],
		// 	displayOptions: {
		// 		show: {
		// 			customEnvironment: [true],
		// 		},
		// 	},
		// },
		// {
		// 	displayName: 'Device',
		// 	name: 'device',
		// 	type: 'options',
		// 	default: 'desktop',
		// 	hint: 'Optional. Setting the operating system, min version and max version. Options: desktop, mobile',
		// 	displayOptions: {
		// 		show: {
		// 			customEnvironment: [true],
		// 		},
		// 	},
		// 	options: [
		// 		{
		// 			name: 'Desktop',
		// 			value: 'desktop',
		// 		},
		// 		{
		// 			name: 'Mobile',
		// 			value: 'mobile',
		// 		},
		// 	],
		// },
	];

	// This allows the credential to be used by other parts of n8n
	// stating how this credential is injected as part of the request
	// An example is the Http Request node that can make generic calls
	// reusing this credential
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '={{"Bearer " + $credentials.apiKey}}',
			},
		},
	};
}
