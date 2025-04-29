import { IExecuteFunctions } from 'n8n-workflow';
import { handleBody, HTTPRequest_Extract_Parameters } from './requestBodyBuilder';
import { genericHttpRequest } from '../../GenericFunctions';
import type { ScrappeyRequestBody } from './types';

export const PostRequest = async function (this: IExecuteFunctions) {
	const body = await handleBody(this);
	const response = await genericHttpRequest.call(this, 'POST', '', { body });
	return {
		response,
	};
};

export const AutoRetryTypeBrowser = async function (this: IExecuteFunctions) {
	const prev_HTTPRequest = await HTTPRequest_Extract_Parameters(this);
	const proxyType = this.getNodeParameter('proxyType', 0, '') as string;

	let body: ScrappeyRequestBody = {
		cmd: prev_HTTPRequest.cmd,
		url: prev_HTTPRequest.url as string,
		datadomeBypass: true,
		retries: 3,
		mouseMovements: true,
		automaticallySolveCaptchas: true,
	};

	// Set custom headers if available from the processed data
	if (prev_HTTPRequest.processedHeaders) {
		body.customHeaders = prev_HTTPRequest.processedHeaders;
	}

	// Set proxy if available from the processed data
	if (prev_HTTPRequest.processedProxy) {
		body.proxy = prev_HTTPRequest.processedProxy;
	}

	// Set proxyType if provided
	if (proxyType && proxyType.trim() !== '') {
		body[proxyType] = true;
	}

	// Set post data if available from the processed data
	if (prev_HTTPRequest.processedPostData) {
		body.postData = prev_HTTPRequest.processedPostData;

		// Set content-type header if available
		if (prev_HTTPRequest.contentType) {
			body.customHeaders['content-type'] = prev_HTTPRequest.contentType;
		}
	}

	const response = await genericHttpRequest.call(this, 'POST', '', { body });
	return {
		response,
		_debug: body,
	};
};

export const AutoRetryTypeRequest = async function (this: IExecuteFunctions) {
	const prev_HTTPRequest = await HTTPRequest_Extract_Parameters(this);
	const customProxyCountry = this.getNodeParameter('customProxyCountry', 0, '');
	const proxyType = this.getNodeParameter('proxyType', 0, '') as string;

	let body: ScrappeyRequestBody = {
		cmd: prev_HTTPRequest.cmd,
		url: prev_HTTPRequest.url as string,
	};

	// Set custom headers if available from the processed data
	if (prev_HTTPRequest.processedHeaders) {
		body.customHeaders = prev_HTTPRequest.processedHeaders;
	}

	// Set proxy if available from the processed data
	if (prev_HTTPRequest.processedProxy) {
		body.proxy = prev_HTTPRequest.processedProxy;
	} else {
		body.proxyCountry = customProxyCountry as string;
	}

	// Set proxyType if provided
	if (proxyType && proxyType.trim() !== '') {
		body[proxyType] = true;
	}

	// Set post data if available from the processed data
	if (prev_HTTPRequest.processedPostData) {
		body.postData = prev_HTTPRequest.processedPostData;

		// Set content-type header if available
		if (prev_HTTPRequest.contentType) {
			body.customHeaders['content-type'] = prev_HTTPRequest.contentType;
		}
	}
	const response = await genericHttpRequest.call(this, 'POST', '', { body });
	return {
		response,
		_debug: body,
	};
};
