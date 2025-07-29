import { AutoRetryTypeBrowser, PostRequest, AutoRetryTypeRequest } from './methods';
import { IExecuteFunctions, NodeOperationError } from 'n8n-workflow';

export async function executeScrappey(this: IExecuteFunctions, operation: string, itemIndex: number = 0) {
	switch (operation) {
		case 'requestBuilder':
			return await PostRequest.call(this, itemIndex);
		case 'httpRequestAutoRetry':
			return await AutoRetryTypeRequest.call(this, itemIndex);
		case 'httpRequestAutoRetryBrowser':
			return await AutoRetryTypeBrowser.call(this, itemIndex);
		default:
			throw new NodeOperationError(this.getNode(), `Operation "${operation}" is not supported`, {
				description: 'Please select a valid operation from the available options.',
				itemIndex // item index in error for better debugging
			});
	}
}