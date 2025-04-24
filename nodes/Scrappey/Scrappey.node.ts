import { INodeType, INodeTypeDescription } from 'n8n-workflow';
import { AdvancedSettingsForBrowser, publicFields } from './fields';
import { executeScrappey } from './execute';
import { scrappeyOperators } from './operators';
import { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
export class Scrappey implements INodeType {
	public async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		// Get input data from previous node (like HTTP node)
		const items = this.getInputData();

		// Log the incoming data to see its structure
		console.log('Incoming data:', JSON.stringify(items, null, 2));

		// Access the message from incoming data (if it exists)
		if (items.length > 0 && items[0].json && items[0].json.message) {
			console.log('Message from previous node:', items[0].json.message);
		}

		// You can also access other fields from the incoming data
		if (items.length > 0) {
			console.log('Full JSON data from previous node:', items[0].json);
		}

		const operation = this.getNodeParameter('scrappeyOperations', 0) as string;
		const responseData = await executeScrappey.call(this, operation);

		// You can still use node parameters as before if needed
		const message = this.getNodeParameter('message', 0, '') as string;
		console.log('Message from node parameter:', message);

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
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Scrappey API',
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
			{
				displayName: 'Message',
				name: 'message',
				type: 'string',
				default: '',
				hint: 'Message to be sent with the request',
			},
		],
	};
}
