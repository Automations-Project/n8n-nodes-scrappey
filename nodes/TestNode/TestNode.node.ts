import { INodeType, INodeTypeDescription } from 'n8n-workflow';
export class TestNode implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'TestNode',
		name: 'testNode',
		//icon: 'file:',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with HttpBin API',
		defaults: {
			name: 'TestNode',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'testNodeApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://test.com',
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
				options: [
					{
						name: 'Test',
						value: 'test',
					},
				],
				default: 'test',
			},

		],
	};
}
