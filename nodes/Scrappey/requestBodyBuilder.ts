import { IExecuteFunctions, NodeOperationError } from 'n8n-workflow';
type BodyEntry = Record<
	string,
	string | number | boolean | Object | BodyEntry[] | Record<string, string>
>;
let body: BodyEntry = {};

// Function to process URLs with multiple expressions like {{ $json.key }} or {{ $node["NodeName"].json["key"] }}
const processUrlExpressions = (
	url: string,
	eFn: IExecuteFunctions,
	itemIndex: number = 0,
): string => {
	if (typeof url !== 'string') return String(url);

	let processedUrl = url;
	eFn.logger.info(`Processing URL: ${url} for item ${itemIndex}`);

	// If the URL starts with '=', we need special handling
	if (processedUrl.trim().startsWith('=')) {
		eFn.logger.info('URL starts with =, special handling required');
		processedUrl = processedUrl.trim().substring(1);

		// Find all n8n expressions in the URL - handles both simple and complex patterns
		const expressionRegex = /{{\s*(.*?)\s*}}/g;
		let match;
		const expressions: string[] = [];

		while ((match = expressionRegex.exec(processedUrl)) !== null) {
			if (match[1]) {
				expressions.push(match[1]);
				eFn.logger.info(`Found expression: ${match[1]}`);
			}
		}

		if (expressions.length > 0) {
			eFn.logger.info('URL contains expressions, processing each one');
			for (const expr of expressions) {
				try {
					// Create a proper n8n expression to evaluate
					const fullExpr = `={{ ${expr} }}`;
					eFn.logger.info(`Evaluating expression: ${fullExpr} for item ${itemIndex}`);

					const value = eFn.evaluateExpression(fullExpr, itemIndex);
					eFn.logger.info(`Evaluated value: ${value}`);

					let stringValue = value !== undefined && value !== null ? String(value) : '';

					// Remove any leading equals sign from the evaluated value to prevent double equals in URLs
					if (stringValue.startsWith('=')) {
						stringValue = stringValue.substring(1);
						eFn.logger.info(`Removed leading equals sign, new value: ${stringValue}`);
					}

					processedUrl = processedUrl.replace(
						new RegExp(`{{\\s*${expr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*}}`, 'g'),
						stringValue,
					);
				} catch (error) {
					eFn.logger.error(`Error evaluating expression ${expr} for item ${itemIndex}`, error);
					// If evaluation fails, replace with empty string
					processedUrl = processedUrl.replace(
						new RegExp(`{{\\s*${expr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*}}`, 'g'),
						'',
					);
				}
			}
			eFn.logger.info(`Final processed URL for item ${itemIndex}: ${processedUrl}`);
			return processedUrl;
		} else {
			// No expressions found, return the URL without the = prefix
			return processedUrl;
		}
	}

	// For URLs without '=' prefix, find and process expressions
	const expressionRegex = /{{\s*(.*?)\s*}}/g;
	let match;
	const expressions: string[] = [];

	while ((match = expressionRegex.exec(processedUrl)) !== null) {
		if (match[1]) {
			expressions.push(match[1]);
			eFn.logger.info(`Found expression: ${match[1]}`);
		}
	}

	if (expressions.length > 0) {
		eFn.logger.info('URL contains expressions, processing each one');
		for (const expr of expressions) {
			try {
				// Create a proper n8n expression to evaluate
				const fullExpr = `={{ ${expr} }}`;
				eFn.logger.info(`Evaluating expression: ${fullExpr} for item ${itemIndex}`);

				const value = eFn.evaluateExpression(fullExpr, itemIndex);
				eFn.logger.info(`Evaluated value: ${value}`);

				let stringValue = value !== undefined && value !== null ? String(value) : '';

				// Remove any leading equals sign from the evaluated value to prevent double equals in URLs
				if (stringValue.startsWith('=')) {
					stringValue = stringValue.substring(1);
					eFn.logger.info(`Removed leading equals sign, new value: ${stringValue}`);
				}

				processedUrl = processedUrl.replace(
					new RegExp(`{{\\s*${expr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*}}`, 'g'),
					stringValue,
				);
			} catch (error) {
				eFn.logger.error(`Error evaluating expression ${expr} for item ${itemIndex}`, error);
				// If evaluation fails, replace with empty string
				processedUrl = processedUrl.replace(
					new RegExp(`{{\\s*${expr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*}}`, 'g'),
					'',
				);
			}
		}
	}

	eFn.logger.info(`Final processed URL for item ${itemIndex}: ${processedUrl}`);
	return processedUrl;
};

const Request_Type_Choice = (choice: string, eFn: IExecuteFunctions, itemIndex: number) => {
	switch (choice) {
		case 'Browser':
			handleAdvancedBrowser(eFn, itemIndex);
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

const handleAdvancedBrowser = (eFn: IExecuteFunctions, itemIndex: number) => {
	const antibot = eFn.getNodeParameter('antibot', itemIndex, false) as boolean;
	const addRandomMouseMovement = eFn.getNodeParameter(
		'addRandomMouseMovement',
		itemIndex,
		false,
	) as boolean;
	const recordVideoSession = eFn.getNodeParameter('recordVideoSession', itemIndex, false) as boolean;
	const cssSelector = eFn.getNodeParameter('cssSelector', itemIndex, '') as string;
	const href = eFn.getNodeParameter('href', itemIndex, '') as string;
	const interceptXhrFetchRequest = eFn.getNodeParameter(
		'interceptXhrFetchRequest',
		itemIndex,
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

export const handleBody = async (eFn: IExecuteFunctions, itemIndex: number = 0) => {
	const credentials = await eFn.getCredentials('scrappeyApi');
	// Reset body object for each call
	body = {};

	const request_type = eFn.getNodeParameter('request_type', itemIndex, 'Request') as string;
	body = Request_Type_Choice(request_type, eFn, itemIndex);

	let url = eFn.getNodeParameter('url', itemIndex, '') as string;
	const httpMethod = eFn.getNodeParameter('httpMethod', itemIndex, '') as string;
	const proxyType = eFn.getNodeParameter('proxyType', itemIndex, '') as string;
	const bodyOrParams = eFn.getNodeParameter('bodyOrParams', itemIndex, '') as string;
	const params_for_request = eFn.getNodeParameter('params_for_request', itemIndex, '') as string;
	const body_for_request = eFn.getNodeParameter('body_for_request', itemIndex, '') as string;
	const userSession = eFn.getNodeParameter('userSession', itemIndex, '') as string;
	const headersInputMethod = eFn.getNodeParameter('headersInputMethod', itemIndex, 'fields') as string;
	const customHeaders = eFn.getNodeParameter('customHeaders', itemIndex, {}) as Record<string, string>;
	const jsonHeaders = eFn.getNodeParameter('jsonHeaders', itemIndex, '') as string;
	const customCookies = eFn.getNodeParameter('customCookies', itemIndex, {}) as Record<string, string>;
	const customProxyCountry = eFn.getNodeParameter('customProxyCountry', itemIndex, '') as string;
	const customProxyCountryBoolean = eFn.getNodeParameter(
		'customProxyCountryBoolean',
		itemIndex,
		false,
	) as boolean;
	const customProxy = eFn.getNodeParameter('custom_proxy', itemIndex, false) as boolean;
	const whichProxyToUse = eFn.getNodeParameter('whichProxyToUse', itemIndex, 'proxyFromCredentials') as string;
	const attempts = eFn.getNodeParameter('attempts', itemIndex, 3) as number;
	const datadome = eFn.getNodeParameter('datadome', itemIndex, false) as boolean;
	const oneStringCookie = eFn.getNodeParameter('oneStringCookie', itemIndex, false) as boolean;
	const cookie = eFn.getNodeParameter('cookie', itemIndex, '') as string;

	if (url && url.trim() !== '') {
		// Process URL expressions - starts with '=' or contains {{ $json.key }}
		url = processUrlExpressions(url, eFn, itemIndex);

		if (url.endsWith('/')) {
			url = url.slice(0, -1);
		}

		body.url = url;
	}

	if (httpMethod && httpMethod.trim() !== '') body.cmd = httpMethod;

	if (proxyType && proxyType.trim() !== '') body[proxyType] = true;

	if (userSession && userSession.trim() !== '') body.session = userSession;

	if (httpMethod !== 'request.get') {
		if (bodyOrParams === 'body_used') {
			body.postData = body_for_request;
			body.customHeaders = {
				'content-type': 'application/json',
			};
		} else {
			body.postData = params_for_request;
		}
	}

	// Handle headers based on input method
	if (headersInputMethod === 'fields') {
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
		if (jsonHeaders && jsonHeaders.trim() !== '') {
			try {
				const headersObj = JSON.parse(jsonHeaders);
				if (headersObj && typeof headersObj === 'object') {
					body.customHeaders = headersObj;
				}
			} catch (error) {
				throw new NodeOperationError(eFn.getNode(), 'Invalid JSON headers format', {
					description: `The provided JSON headers are not valid: ${error instanceof Error ? error.message : 'Unknown error'}`,
					itemIndex // Include item index in error
				});
			}
		}
	}

	// Handle cookies
	if (oneStringCookie) {
		if (cookie && cookie.trim() !== '') {
			body.cookies = cookie;
		}
	} else if (customCookies && Object.keys(customCookies).length > 0) {
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

		if (cookieString) {
			body.cookies = cookieString;
		}
	}

	if (customProxyCountryBoolean) body.proxyCountry = customProxyCountry;

	// Handle proxy configuration
	if (whichProxyToUse === 'proxyFromCredentials' && credentials?.proxyUrl) {
		body.proxy = credentials.proxyUrl as string;
	} else if (whichProxyToUse === 'proxyFromScrappey') {
		if (customProxy && credentials?.proxyUrl) {
			body.proxy = credentials.proxyUrl as string;
		}
	}

	if (datadome && request_type === 'Browser') {
		body.datadomeBypass = true;
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

export const HTTPRequest_Extract_Parameters = async (eFn: IExecuteFunctions, itemIndex: number = 0) => {
	const method = eFn.getNodeParameter('method', itemIndex, '={{ $($prevNode.name).params.method }}');

	const processedMethod = typeof method === 'string' ? method.toLowerCase() : method;
	const cmd = `request.${processedMethod}`;
	let urlRaw = eFn.getNodeParameter('url', itemIndex, '={{ $($prevNode.name).params.url }}') as string;

	urlRaw = processUrlExpressions(urlRaw, eFn, itemIndex);

	if (typeof urlRaw === 'string' && urlRaw.endsWith('/')) {
		urlRaw = urlRaw.slice(0, -1);
	}

	const url = urlRaw;

	const authentication = eFn.getNodeParameter(
		'authentication',
		itemIndex,
		'={{ $($prevNode.name).params.authentication }}',
	);
	const sendQuery = eFn.getNodeParameter(
		'sendQuery',
		itemIndex,
		'={{ $($prevNode.name).params.sendQuery }}',
	);

	const queryParameters = eFn.getNodeParameter(
		'queryParameters',
		itemIndex,
		'={{ $($prevNode.name).params.queryParameters }}',
	);
	const headerParameters = eFn.getNodeParameter(
		'headerParameters',
		itemIndex,
		'={{ $($prevNode.name).params.headerParameters }}',
	);
	const proxy = eFn.getNodeParameter('proxy', itemIndex, '={{ $($prevNode.name).params.options.proxy }}');
	const bodyParameters = eFn.getNodeParameter(
		'bodyParameters',
		itemIndex,
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
		itemIndex,
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
			// No processing needed here
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