import { IExecuteFunctions } from 'n8n-workflow';
import { handleBody, HTTPRequest_Extract_Parameters } from './requestBodyBuilder';
import type { ScrappeyRequestBody } from './types';
import { genericHttpRequest } from './GenericFunctions';

export const PostRequest = async function (this: IExecuteFunctions, itemIndex: number = 0) {
	const body = await handleBody(this, itemIndex);
	const response = await genericHttpRequest.call(this, 'POST', '', { body });
	return response;
};

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
				body.country = customProxyCountry;
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
		requestType: 'request', // Add this to ensure it's a request type
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