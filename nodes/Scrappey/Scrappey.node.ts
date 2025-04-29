import { INodeType, INodeTypeDescription } from 'n8n-workflow';
import { AdvancedSettingsForBrowser, publicFields } from './fields';
import { executeScrappey } from './execute';
import { scrappeyOperators } from './operators';
import { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
export class Scrappey implements INodeType {
	public async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const operation = this.getNodeParameter('scrappeyOperations', 0) as string;
		const responseData = await executeScrappey.call(this, operation);

		if (
			Array.isArray(responseData) &&
			responseData.length > 0 &&
			responseData[0].hasOwnProperty('json')
		) {
			return [responseData as INodeExecutionData[]];
		}
		return [[{ json: responseData as unknown as IDataObject }]];
	}
	description: INodeTypeDescription = {
		displayName: 'Scrappey',
		name: 'scrappey',
		icon: 'file:scrappey.svg',
		group: ['web-scraping'],
		version: 1,
		subtitle: '={{$parameter["scrappeyOperations"]}}',
		description: 'Make advanced web requests with anti-bot protection bypass using Scrappey API',
		defaults: {
			name: 'scrappey',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'scrappeyApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://api.scrappey.com',
			url: '',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				default: 'operators',
				options: [
					{
						name: 'Operator',
						value: 'operators',
					},
				],
			},
			...scrappeyOperators,
			...publicFields,
			...AdvancedSettingsForBrowser,
		],
	};
}
