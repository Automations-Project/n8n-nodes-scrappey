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
		],
	},
];
