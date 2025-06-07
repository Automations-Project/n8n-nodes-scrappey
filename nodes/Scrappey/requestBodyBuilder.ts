import { evaluateExpression } from './utils';
import { IExecuteFunctions } from 'n8n-workflow';
type BodyEntry = Record<
	string,
	string | number | boolean | Object | BodyEntry[] | Record<string, string>
>;
let body: BodyEntry = {};

// Function to process URLs with multiple expressions like {{ $json.key }}
const processUrlExpressions = (url: string, eFn: IExecuteFunctions, itemIndex: number = 0): string => {
	// If the URL isn't a string, return it as is
	if (typeof url !== 'string') return String(url);

	let processedUrl = url;
	console.log(`Processing URL: ${url}`);

	// If the URL starts with '=', we need special handling
	if (processedUrl.trim().startsWith('=')) {
		console.log('URL starts with =, special handling required');

		// Check if it contains {{ $json.key }} patterns
		if (processedUrl.includes('{{') && processedUrl.includes('$json.')) {
			console.log('URL contains {{ $json.key }} patterns, processing manually');

			// Remove the leading '=' to process manually
			processedUrl = processedUrl.trim().substring(1);

			// Replace {{ $json.key }} patterns first
			processedUrl = processedUrl.replace(/{{\s*\$json\.([a-zA-Z0-9_]+)\s*}}/g, (match, key) => {
				console.log(`Found key: ${key}, trying to replace`);
				try {
					// Try to get the value from the current execution context
					const paramName = `$json["${key}"]`;
					try {
						const value = eFn.evaluateExpression(`={{ ${paramName} }}`, itemIndex);
						console.log(`Evaluated value for ${key}: ${value}`);
						return value !== undefined && value !== null ? String(value) : '';
					} catch (e) {
						console.log(`First method failed: ${e.message}, trying alternate method`);
						try {
							const value = eFn.getNodeParameter(paramName, itemIndex, '');
							console.log(`Alternate method value for ${key}: ${value}`);
							return value !== undefined && value !== null ? String(value) : '';
						} catch (e2) {
							console.log(`Both methods failed: ${e2.message}`);
							return '';
						}
					}
				} catch (error) {
					console.log(`Error processing key ${key}: ${error.message}`);
					return '';
				}
			});

			console.log(`Final processed URL: ${processedUrl}`);
			// Now return the processed URL
			return processedUrl;
		} else {
			console.log('URL is a standard n8n expression, using evaluateExpression');
			// Standard n8n expression without {{ $json.key }} patterns
			try {
				// Use the existing evaluateExpression function which handles '=' prefix
				const evaluatedUrl = evaluateExpression(eFn, url, itemIndex);
				console.log(`Evaluated URL: ${evaluatedUrl}`);
				// Convert to string if the result is not a string
				return typeof evaluatedUrl === 'string' ? evaluatedUrl : String(evaluatedUrl);
			} catch (error) {
				// If evaluation fails, continue with the original URL without the '='
				console.warn(`Failed to evaluate URL expression: ${url}`, error);
				return url.trim().substring(1);
			}
		}
	}

	console.log('URL does not start with =, processing only {{ $json.key }} patterns');
	// For URLs without '=' prefix, just handle {{ $json.key }} patterns
	return processedUrl.replace(/{{\s*\$json\.([a-zA-Z0-9_]+)\s*}}/g, (match, key) => {
		console.log(`Found key without = prefix: ${key}, trying to replace`);
		try {
			// Try to get the value from the current execution context
			const paramName = `$json["${key}"]`;
			try {
				const value = eFn.evaluateExpression(`={{ ${paramName} }}`, itemIndex);
				console.log(`Evaluated value for ${key}: ${value}`);
				return value !== undefined && value !== null ? String(value) : '';
			} catch (e) {
				console.log(`First method failed: ${e.message}, trying alternate method`);
				try {
					const value = eFn.getNodeParameter(paramName, itemIndex, '');
					console.log(`Alternate method value for ${key}: ${value}`);
					return value !== undefined && value !== null ? String(value) : '';
				} catch (e2) {
					console.log(`Both methods failed: ${e2.message}`);
					return '';
				}
			}
		} catch (error) {
			console.log(`Error processing key ${key}: ${error.message}`);
			return '';
		}
	});
};

const Request_Type_Choice = (choice: string, eFn: IExecuteFunctions) => {
	switch (choice) {
		case 'Browser':
			handleAdvancedBrowser(eFn);
			return body;
		case 'Request':
			body.requestType = 'request';
			return body;

		case 'PatchedChrome':
			body.browser = [
				{
					name: 'chrome',
				},
			];
			body.noDriver = true;
			return body;

		default:
			return body;
	}
};

const handleAdvancedBrowser = (eFn: IExecuteFunctions) => {
	const antibot = eFn.getNodeParameter('antibot', 0, false) as boolean;
	const addRandomMouseMovement = eFn.getNodeParameter(
		'addRandomMouseMovement',
		0,
		false,
	) as boolean;
	const recordVideoSession = eFn.getNodeParameter('recordVideoSession', 0, false) as boolean;
	const cssSelector = eFn.getNodeParameter('cssSelector', 0, '') as string;
	const href = eFn.getNodeParameter('href', 0, '') as string;
	const interceptXhrFetchRequest = eFn.getNodeParameter(
		'interceptXhrFetchRequest',
		0,
		'',
	) as string;

	if (antibot) body.automaticallySolveCaptchas = true;

	if (addRandomMouseMovement) body.mouseMovements = true;

	if (recordVideoSession) body.video = true;

	if (cssSelector && cssSelector.trim() !== '') body.cssSelector = cssSelector;

	if (href && href.trim() !== '') body.customAttribute = href;

	if (interceptXhrFetchRequest && interceptXhrFetchRequest.trim() !== '')
		body.interceptFetchRequest = interceptXhrFetchRequest;
};

export const handleBody = async (eFn: IExecuteFunctions) => {
	const credentials = await eFn.getCredentials('scrappeyApi');
	// Reset body object for each call
	body = {};

	const request_type = eFn.getNodeParameter('request_type', 0, 'Request') as string;
	body = Request_Type_Choice(request_type, eFn);

	let url = eFn.getNodeParameter('url', 0, '') as string;
	const httpMethod = eFn.getNodeParameter('httpMethod', 0, '') as string;
	const proxyType = eFn.getNodeParameter('proxyType', 0, '') as string;
	const bodyOrParams = eFn.getNodeParameter('bodyOrParams', 0, '') as string;
	const params_for_request = eFn.getNodeParameter('params_for_request', 0, '') as string;
	const body_for_request = eFn.getNodeParameter('body_for_request', 0, '') as string;
	const userSession = eFn.getNodeParameter('userSession', 0, '') as string;
	const headersInputMethod = eFn.getNodeParameter('headersInputMethod', 0, 'fields') as string;
	const customHeaders = eFn.getNodeParameter('customHeaders', 0, {}) as Record<string, string>;
	const jsonHeaders = eFn.getNodeParameter('jsonHeaders', 0, '') as string;
	const customCookies = eFn.getNodeParameter('customCookies', 0, {}) as Record<string, string>;
	const customProxyCountry = eFn.getNodeParameter('customProxyCountry', 0, '') as string;
	const customProxyCountryBoolean = eFn.getNodeParameter(
		'customProxyCountryBoolean',
		0,
		false,
	) as boolean;
	const customProxy = eFn.getNodeParameter('custom_proxy', 0, false) as boolean;
	const allowProxy = eFn.getNodeParameter('allowProxy', 0, false) as boolean;
	const attempts = eFn.getNodeParameter('attempts', 0, 3) as number;

	// Process URL with expressions
	if (url && url.trim() !== '') {
		// Process URL expressions - starts with '=' or contains {{ $json.key }}
		url = processUrlExpressions(url, eFn, 0);

		// Clean up URL if needed
		if (url.endsWith('/')) {
			url = url.slice(0, -1);
		}

		body.url = url;
	}

	if (httpMethod && httpMethod.trim() !== '') body.cmd = httpMethod;

	if (proxyType && proxyType.trim() !== '') body[proxyType] = true;

	if (userSession && userSession.trim() !== '') body.session = userSession;

	if (httpMethod !== 'request.get') {
		if (bodyOrParams) {
			body.postData = body_for_request;
			body.customHeaders = {
				'content-type': 'application/json',
			};
		} else body.postData = params_for_request;
	}

	// Handle headers based on input method
	if (headersInputMethod === 'fields') {
		// Process headers from fields
		if (customHeaders && Object.keys(customHeaders).length > 0) {
			const headersObj: Record<string, string> = {};

			if (customHeaders.headers && Array.isArray(customHeaders.headers)) {
				customHeaders.headers.forEach((header: any) => {
					if (header.header_key && header.header_value) {
						headersObj[header.header_key] = header.header_value;
					}
				});
				body.customHeaders = headersObj;
			}
		}
	} else if (headersInputMethod === 'json') {
		// Process headers from JSON
		if (jsonHeaders && jsonHeaders.trim() !== '') {
			try {
				const headersObj = JSON.parse(jsonHeaders);
				if (headersObj && typeof headersObj === 'object') {
					body.customHeaders = headersObj;
				}
			} catch (error) {
				throw new Error(`Invalid JSON headers format: ${error.message}`);
			}
		}
	}

	if (customCookies && Object.keys(customCookies).length > 0) {
		let cookieString = '';

		if (customCookies.cookies && Array.isArray(customCookies.cookies)) {
			customCookies.cookies.forEach((cookie: any) => {
				if (cookie.cookie_key && cookie.cookie_value) {
					if (cookieString) cookieString += '; ';
					cookieString += `${cookie.cookie_key}=${cookie.cookie_value}`;
				}
			});
		} else {
			for (const [key, value] of Object.entries(customCookies)) {
				if (cookieString) cookieString += '; ';
				cookieString += `${key}=${value}`;
			}
		}

		body.cookies = cookieString;
	}

	if (customProxyCountryBoolean) body.proxyCountry = customProxyCountry;

	if (allowProxy) {
		if (customProxy === true) body.proxy = credentials.proxyUrl;
	}

	body.attempts = attempts;

	if (credentials?.whitelistedDomains) {
		// Ensure whitelistedDomains is passed as an array
		const domains = Array.isArray(credentials.whitelistedDomains)
			? credentials.whitelistedDomains
			: typeof credentials.whitelistedDomains === 'string'
				? credentials.whitelistedDomains.split(',').map((domain) => domain.trim())
				: [];

		body.whitelistedDomains = domains;
	}

	return body;
};

export const HTTPRequest_Extract_Parameters = async (eFn: IExecuteFunctions) => {
	const method = eFn.getNodeParameter('method', 0, '={{ $($prevNode.name).params.method }}');

	const processedMethod = typeof method === 'string' ? method.toLowerCase() : method;
	const cmd = `request.${processedMethod}`;
	let urlRaw = eFn.getNodeParameter('url', 0, '={{ $($prevNode.name).params.url }}') as string;

	// Process URL expressions - handles both direct expressions and {{ $json.key }} patterns
	urlRaw = processUrlExpressions(urlRaw, eFn, 0);

	// Clean up the URL if needed
	if (typeof urlRaw === 'string' && urlRaw.endsWith('/')) {
		urlRaw = urlRaw.slice(0, -1);
	}

	const url = urlRaw;

	const authentication = eFn.getNodeParameter(
		'authentication',
		0,
		'={{ $($prevNode.name).params.authentication }}',
	);
	const sendQuery = eFn.getNodeParameter(
		'sendQuery',
		0,
		'={{ $($prevNode.name).params.sendQuery }}',
	);

	const queryParameters = eFn.getNodeParameter(
		'queryParameters',
		0,
		'={{ $($prevNode.name).params.queryParameters }}',
	);
	const headerParameters = eFn.getNodeParameter(
		'headerParameters',
		0,
		'={{ $($prevNode.name).params.headerParameters }}',
	);
	const proxy = eFn.getNodeParameter('proxy', 0, '={{ $($prevNode.name).params.options.proxy }}');
	const bodyParameters = eFn.getNodeParameter(
		'bodyParameters',
		0,
		'={{ $($prevNode.name).params.bodyParameters }}',
	);

	let processedHeaders: Record<string, string> | undefined = undefined;
	if (headerParameters) {
		const tempHeaders: Record<string, string> = {};

		if (typeof headerParameters === 'object') {
			const headerParams = headerParameters as any;

			if (Array.isArray(headerParams.parameters)) {
				for (const header of headerParams.parameters) {
					if (header.name && header.value) {
						tempHeaders[header.name] = header.value;
					}
				}
			} else if (typeof headerParams === 'object') {
				Object.assign(tempHeaders, headerParams);
			}
		}

		if (Object.keys(tempHeaders).length > 0) {
			processedHeaders = tempHeaders;
		}
	}

	let processedProxy: string | undefined;
	const whichProxyToUse = eFn.getNodeParameter(
		'whichProxyToUse',
		0,
		'proxyFromCredentials',
	) as string;
	switch (whichProxyToUse) {
		case 'proxyFromCredentials': {
			const credentials = await eFn.getCredentials('scrappeyApi');
			if (credentials?.proxyUrl) {
				processedProxy = String(credentials.proxyUrl);
			}
			break;
		}
		case 'proxyFromNode': {
			if (proxy) {
				processedProxy = proxy as string;
			}
			break;
		}
		case 'proxyFromScrappey': {
			break;
		}
	}

	let processedPostData: string | undefined;
	let contentType: string | undefined;

	if (bodyParameters) {
		const bodyParams = bodyParameters;

		if (
			typeof bodyParams === 'object' &&
			bodyParams !== null &&
			'parameters' in bodyParams &&
			Array.isArray(bodyParams.parameters)
		) {
			const bodyParamsObj: Record<string, string> = {};
			for (const param of bodyParams.parameters) {
				if (param && typeof param === 'object' && 'name' in param && 'value' in param) {
					bodyParamsObj[param.name as string] = param.value as string;
				}
			}

			processedPostData = JSON.stringify(bodyParamsObj);

			contentType = 'application/json';
		} else {
			processedPostData = typeof bodyParams === 'string' ? bodyParams : JSON.stringify(bodyParams);
			contentType = 'application/json';
		}
	}

	if (queryParameters) {
		const qParams = queryParameters;

		if (
			typeof qParams === 'object' &&
			qParams !== null &&
			'parameters' in qParams &&
			Array.isArray(qParams.parameters) &&
			qParams.parameters.length > 0
		) {
		}
	}
	return {
		method,
		cmd,
		url,
		authentication,
		proxy,
		processedProxy,
		processedHeaders,
		processedPostData,
		contentType,
		sendQuery,
		queryParameters,
		headerParameters,
		bodyParameters,
	};
};
