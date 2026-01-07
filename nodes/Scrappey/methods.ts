import { IExecuteFunctions } from 'n8n-workflow';
import { handleBody, HTTPRequest_Extract_Parameters } from './requestBodyBuilder';
import type { ScrappeyRequestBody } from './types';
import { genericHttpRequest } from './GenericFunctions';

// ============================================
// Request Builder Operation
// ============================================

export const PostRequest = async function (this: IExecuteFunctions, itemIndex: number = 0) {
	const body = await handleBody(this, itemIndex);
	const response = await genericHttpRequest.call(this, 'POST', '', { body });
	return response;
};

// ============================================
// Auto-Retry Operations
// ============================================

export const AutoRetryTypeBrowser = async function (this: IExecuteFunctions, itemIndex: number = 0) {
	const prev_HTTPRequest = await HTTPRequest_Extract_Parameters(this, itemIndex);
	
	const proxyType = this.getNodeParameter('proxyType', itemIndex, '') as string;
	const whichProxyToUse = this.getNodeParameter(
		'whichProxyToUse',
		itemIndex,
		'proxyFromCredentials',
	) as string;

	let body: ScrappeyRequestBody = {
		cmd: prev_HTTPRequest.cmd,
		url: prev_HTTPRequest.url as string,
		datadomeBypass: true,
		retries: 3,
		mouseMovements: true,
		automaticallySolveCaptchas: true,
	};

	if (prev_HTTPRequest.processedHeaders) {
		body.customHeaders = prev_HTTPRequest.processedHeaders;
	}

	// Handle proxy settings based on the selected proxy source
	if (whichProxyToUse === 'proxyFromScrappey') {
		if (proxyType && proxyType.trim() !== '') {
			body[proxyType] = true;
		}

		const customProxyCountryBoolean = this.getNodeParameter(
			'customProxyCountryBoolean',
			itemIndex,
			false,
		) as boolean;

		if (customProxyCountryBoolean) {
			const customProxyCountry = this.getNodeParameter('customProxyCountry', itemIndex, '') as string;
			if (customProxyCountry && customProxyCountry.trim() !== '') {
				body.proxyCountry = customProxyCountry;
			}
		}
	} else if (whichProxyToUse === 'proxyFromNode' && prev_HTTPRequest.processedProxy) {
		body.proxy = prev_HTTPRequest.processedProxy;
	}
	// For proxyFromCredentials, proxy is handled by the credentials

	if (prev_HTTPRequest.processedPostData) {
		body.postData = prev_HTTPRequest.processedPostData;

		if (prev_HTTPRequest.contentType && body.customHeaders) {
			body.customHeaders['content-type'] = prev_HTTPRequest.contentType;
		}
	}
	
	const response = await genericHttpRequest.call(this, 'POST', '', { body });
	return response;
};

export const AutoRetryTypeRequest = async function (this: IExecuteFunctions, itemIndex: number = 0) {
	const prev_HTTPRequest = await HTTPRequest_Extract_Parameters(this, itemIndex);
	
	const customProxyCountry = this.getNodeParameter('customProxyCountry', itemIndex, '') as string;
	const customProxyCountryBoolean = this.getNodeParameter(
		'customProxyCountryBoolean',
		itemIndex,
		false,
	) as boolean;
	const proxyType = this.getNodeParameter('proxyType', itemIndex, '') as string;

	let body: ScrappeyRequestBody = {
		cmd: prev_HTTPRequest.cmd,
		url: prev_HTTPRequest.url as string,
		requestType: 'request',
	};

	if (prev_HTTPRequest.processedHeaders) {
		body.customHeaders = prev_HTTPRequest.processedHeaders;
	}

	const whichProxyToUse = this.getNodeParameter(
		'whichProxyToUse',
		itemIndex,
		'proxyFromCredentials',
	) as string;

	if (whichProxyToUse === 'proxyFromNode' && prev_HTTPRequest.processedProxy) {
		body.proxy = prev_HTTPRequest.processedProxy;
	} else if (whichProxyToUse === 'proxyFromScrappey') {
		if (customProxyCountryBoolean) {
			body.proxyCountry = customProxyCountry;
		}
		
		if (proxyType && proxyType.trim() !== '') {
			body[proxyType] = true;
		}
	}

	if (prev_HTTPRequest.processedPostData) {
		body.postData = prev_HTTPRequest.processedPostData;

		if (prev_HTTPRequest.contentType) {
			if (!body.customHeaders) {
				body.customHeaders = {};
			}
			body.customHeaders['content-type'] = prev_HTTPRequest.contentType;
		}
	}
	
	const response = await genericHttpRequest.call(this, 'POST', '', { body });
	return response;
};

// ============================================
// Session Management Operations
// ============================================

export const SessionCreate = async function (this: IExecuteFunctions, itemIndex: number = 0) {
	const credentials = await this.getCredentials('scrappeyApi');
	
	const sessionId = this.getNodeParameter('sessionId', itemIndex, '') as string;
	const sessionTtl = this.getNodeParameter('sessionTtl', itemIndex, 180) as number;
	const headless = this.getNodeParameter('headless', itemIndex, 'true') as string;
	const geoip = this.getNodeParameter('geoip', itemIndex, 'false') as string;
	const whichProxyToUse = this.getNodeParameter('whichProxyToUse', itemIndex, 'proxyFromCredentials') as string;
	
	const body: any = {
		cmd: 'sessions.create',
		session_ttl: sessionTtl,
		headless: headless,
		geoip: geoip,
	};
	
	// Add optional session ID
	if (sessionId && sessionId.trim() !== '') {
		body.session = sessionId;
	}
	
	// Handle proxy configuration
	if (whichProxyToUse === 'proxyFromCredentials' && credentials?.proxyUrl) {
		body.proxy = credentials.proxyUrl as string;
	} else if (whichProxyToUse === 'proxyFromScrappey') {
		const proxyType = this.getNodeParameter('proxyType', itemIndex, '') as string;
		if (proxyType && proxyType.trim() !== '') {
			body[proxyType] = true;
		}
		
		const customProxyCountryBoolean = this.getNodeParameter('customProxyCountryBoolean', itemIndex, false) as boolean;
		if (customProxyCountryBoolean) {
			const customProxyCountry = this.getNodeParameter('customProxyCountry', itemIndex, '') as string;
			if (customProxyCountry) {
				body.proxyCountry = customProxyCountry;
			}
		}
		
		const customProxy = this.getNodeParameter('custom_proxy', itemIndex, false) as boolean;
		if (customProxy && credentials?.proxyUrl) {
			body.proxy = credentials.proxyUrl as string;
		}
	}
	
	const response = await genericHttpRequest.call(this, 'POST', '', { body });
	return response;
};

export const SessionDestroy = async function (this: IExecuteFunctions, itemIndex: number = 0) {
	const sessionToDestroy = this.getNodeParameter('sessionToDestroy', itemIndex, '') as string;
	
	const body = {
		cmd: 'sessions.destroy',
		session: sessionToDestroy,
	};
	
	const response = await genericHttpRequest.call(this, 'POST', '', { body });
	return response;
};

export const SessionList = async function (this: IExecuteFunctions, itemIndex: number = 0) {
	const userId = this.getNodeParameter('userId', itemIndex, 0) as number;
	
	const body: any = {
		cmd: 'sessions.list',
	};
	
	if (userId > 0) {
		body.userId = userId;
	}
	
	const response = await genericHttpRequest.call(this, 'POST', '', { body });
	return response;
};

export const SessionActive = async function (this: IExecuteFunctions, itemIndex: number = 0) {
	const sessionToCheck = this.getNodeParameter('sessionToCheck', itemIndex, '') as string;
	
	const body = {
		cmd: 'sessions.active',
		session: sessionToCheck,
	};
	
	const response = await genericHttpRequest.call(this, 'POST', '', { body });
	return response;
};

export const WebSocketCreate = async function (this: IExecuteFunctions, itemIndex: number = 0) {
	const credentials = await this.getCredentials('scrappeyApi');
	
	const sessionTtl = this.getNodeParameter('sessionTtl', itemIndex, 180) as number;
	const headless = this.getNodeParameter('headless', itemIndex, 'true') as string;
	const geoip = this.getNodeParameter('geoip', itemIndex, 'false') as string;
	const whichProxyToUse = this.getNodeParameter('whichProxyToUse', itemIndex, 'proxyFromCredentials') as string;
	
	const body: any = {
		cmd: 'websocket.create',
		session_ttl: sessionTtl,
		headless: headless,
		geoip: geoip,
	};
	
	// Handle proxy configuration
	if (whichProxyToUse === 'proxyFromCredentials' && credentials?.proxyUrl) {
		body.proxy = credentials.proxyUrl as string;
	} else if (whichProxyToUse === 'proxyFromScrappey') {
		const proxyType = this.getNodeParameter('proxyType', itemIndex, '') as string;
		if (proxyType && proxyType.trim() !== '') {
			body[proxyType] = true;
		}
		
		const customProxyCountryBoolean = this.getNodeParameter('customProxyCountryBoolean', itemIndex, false) as boolean;
		if (customProxyCountryBoolean) {
			const customProxyCountry = this.getNodeParameter('customProxyCountry', itemIndex, '') as string;
			if (customProxyCountry) {
				body.proxyCountry = customProxyCountry;
			}
		}
		
		const customProxy = this.getNodeParameter('custom_proxy', itemIndex, false) as boolean;
		if (customProxy && credentials?.proxyUrl) {
			body.proxy = credentials.proxyUrl as string;
		}
	}
	
	const response = await genericHttpRequest.call(this, 'POST', '', { body });
	return response;
};
