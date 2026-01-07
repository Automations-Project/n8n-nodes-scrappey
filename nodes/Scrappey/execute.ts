import {
	AutoRetryTypeBrowser,
	PostRequest,
	AutoRetryTypeRequest,
	SessionCreate,
	SessionDestroy,
	SessionList,
	SessionActive,
	WebSocketCreate,
} from './methods';
import { IExecuteFunctions, NodeOperationError } from 'n8n-workflow';

export async function executeScrappey(this: IExecuteFunctions, operation: string, itemIndex: number = 0) {
	switch (operation) {
		// Request Builder
		case 'requestBuilder':
			return await PostRequest.call(this, itemIndex);
		
		// Auto-Retry Operations
		case 'httpRequestAutoRetry':
			return await AutoRetryTypeRequest.call(this, itemIndex);
		case 'httpRequestAutoRetryBrowser':
			return await AutoRetryTypeBrowser.call(this, itemIndex);
		
		// Session Management
		case 'sessionCreate':
			return await SessionCreate.call(this, itemIndex);
		case 'sessionDestroy':
			return await SessionDestroy.call(this, itemIndex);
		case 'sessionList':
			return await SessionList.call(this, itemIndex);
		case 'sessionActive':
			return await SessionActive.call(this, itemIndex);
		
		// WebSocket
		case 'websocketCreate':
			return await WebSocketCreate.call(this, itemIndex);
		
		default:
			throw new NodeOperationError(this.getNode(), `Operation "${operation}" is not supported`, {
				description: 'Please select a valid operation from the available options.',
				itemIndex,
			});
	}
}
