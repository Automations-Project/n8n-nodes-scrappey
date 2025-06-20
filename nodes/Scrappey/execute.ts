import { AutoRetryTypeBrowser, PostRequest, AutoRetryTypeRequest } from './RequestMethods';
import { IExecuteFunctions } from 'n8n-workflow';

export async function executeScrappey(this: IExecuteFunctions, operation: string) {
	switch (operation) {
		case 'requestBuilder':
			return await PostRequest.call(this);
		case 'httpRequestAutoRetry':
			return await AutoRetryTypeRequest.call(this);
		case 'httpRequestAutoRetryBrowser':
			return await AutoRetryTypeBrowser.call(this);
		default:
			throw new Error(`Operation ${operation} is not supported`);
	}
}
