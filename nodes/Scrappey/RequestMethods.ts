import { IExecuteFunctions } from 'n8n-workflow';
import { handleBody, HTTPRequest_Extract_Parameters } from './requestBodyBuilder';
import { genericHttpRequest } from '../../GenericFunctions';
import type { ScrappeyRequestBody } from './types';

export const PostRequest = async function (this: IExecuteFunctions) {
	const body = handleBody(this);
	const response = await genericHttpRequest.call(this, 'POST', '', { body });
	return response;
};

export const AutoRetryTypeBrowser = async function (this: IExecuteFunctions) {
	const prev_HTTPRequest = await HTTPRequest_Extract_Parameters(this);
	// Create body with the specified interface

	let body: ScrappeyRequestBody = {
		cmd: prev_HTTPRequest.cmd,
		url: prev_HTTPRequest.url as string,
		datadomeBypass: true,
		retries: 3,
		mouseMovements: true,
		automaticallySolveCaptchas: true,
		customHeaders: prev_HTTPRequest.processedHeaders || {},
	};

	// Set proxy if available from the processed data
	if (prev_HTTPRequest.processedProxy) {
		body.proxy = prev_HTTPRequest.processedProxy;
	}

	// Set post data if available from the processed data
	if (prev_HTTPRequest.processedPostData) {
		body.postData = prev_HTTPRequest.processedPostData;

		// Set content-type header if available
		if (prev_HTTPRequest.contentType) {
			body.customHeaders['content-type'] = prev_HTTPRequest.contentType;
		}
	}

	return body;
};
