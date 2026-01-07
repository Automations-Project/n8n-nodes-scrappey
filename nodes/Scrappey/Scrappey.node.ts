import { INodeType, INodeTypeDescription } from 'n8n-workflow';
import { allFields } from './fields';
import { executeScrappey } from './execute';
import { scrappeyOperators } from './operators';
import { IExecuteFunctions, INodeExecutionData, IDataObject, NodeOperationError } from 'n8n-workflow';

export class Scrappey implements INodeType {
	public async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		// Get all input items - this is crucial for item linking
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		
		const operation = this.getNodeParameter('scrappeyOperations', 0) as string;
		
		// Process each input item individually to maintain item relationships
		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				// This ensures that expressions like {{ $json.field }} work correctly
				const responseData = await executeScrappey.call(this, operation, itemIndex);
				
				if (Array.isArray(responseData)) {
					if (responseData.length > 0 && responseData[0].hasOwnProperty('json')) {
						responseData.forEach((item) => {
							returnData.push({
								json: item.json,
								pairedItem: { item: itemIndex }
							});
						});
					} else {
						responseData.forEach((item) => {
							returnData.push({
								json: item as IDataObject,
								pairedItem: { item: itemIndex }
							});
						});
					}
				} else {
					returnData.push({
						json: responseData as IDataObject,
						pairedItem: { item: itemIndex }
					});
				}
			} catch (error) {
				// This allows n8n to track which input item caused the error
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error.message,
							// Include the original input data so it's not lost
							originalInput: items[itemIndex].json
						},
						pairedItem: { item: itemIndex },
						error: new NodeOperationError(this.getNode(), error as Error)
					});
				} else {
					throw new NodeOperationError(
						this.getNode(),
						error as Error,
						{
							message: `Failed to process item ${itemIndex}`,
							description: `Error occurred while processing input item at index ${itemIndex}`,
							itemIndex
						}
					);
				}
			}
		}
		
		return [returnData];
	}

	description: INodeTypeDescription = {
		displayName: 'Scrappey',
		name: 'scrappey',
		icon: 'file:Scrappey.svg',
		group: ['transform'],
		version: 1,
		subtitle:
			'={{ { requestBuilder: "🛠️ Request Builder", httpRequestAutoRetry: "🔁 Auto • HTTP Mode", httpRequestAutoRetryBrowser: "🌐 Auto • Browser Mode" }[$parameter["scrappeyOperations"]] }}',
		description: 'Make advanced web requests with anti-bot protection bypass using Scrappey API',
		defaults: {
			name: 'scrappey',
		},
		inputs: ['main'] as unknown as INodeTypeDescription['inputs'],
		outputs: ['main'] as unknown as INodeTypeDescription['outputs'],
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
		properties: [...scrappeyOperators, ...allFields],
	};
}