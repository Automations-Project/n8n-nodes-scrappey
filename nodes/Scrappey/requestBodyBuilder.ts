import { IExecuteFunctions, NodeOperationError } from 'n8n-workflow';
import { buildBrowserActionsArray } from './browserActions';
import type { ScrappeyRequestBody } from './types';

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

// Helper to safely parse comma-separated strings into arrays
const parseCommaSeparated = (value: string): string[] => {
	if (!value || value.trim() === '') return [];
	return value.split(',').map(s => s.trim()).filter(s => s !== '');
};

// Helper to safely parse JSON
const safeParseJson = (value: string, defaultValue: any = null): any => {
	if (!value || value.trim() === '') return defaultValue;
	try {
		return JSON.parse(value);
	} catch {
		return defaultValue;
	}
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
	// Basic browser options
	const antibot = eFn.getNodeParameter('antibot', itemIndex, false) as boolean;
	const addRandomMouseMovement = eFn.getNodeParameter('addRandomMouseMovement', itemIndex, false) as boolean;
	const forceMouseMovement = eFn.getNodeParameter('forceMouseMovement', itemIndex, false) as boolean;
	const recordVideoSession = eFn.getNodeParameter('recordVideoSession', itemIndex, false) as boolean;
	const cssSelector = eFn.getNodeParameter('cssSelector', itemIndex, '') as string;
	const href = eFn.getNodeParameter('href', itemIndex, '') as string;
	const interceptXhrFetchRequest = eFn.getNodeParameter('interceptXhrFetchRequest', itemIndex, '') as string;

	// Antibot options
	const cloudflareBypass = eFn.getNodeParameter('cloudflareBypass', itemIndex, false) as boolean;
	const datadome = eFn.getNodeParameter('datadome', itemIndex, false) as boolean;
	const datadomeDebug = eFn.getNodeParameter('datadomeDebug', itemIndex, false) as boolean;
	const kasadaBypass = eFn.getNodeParameter('kasadaBypass', itemIndex, false) as boolean;
	const disableAntiBot = eFn.getNodeParameter('disableAntiBot', itemIndex, false) as boolean;
	const detectIncapsula = eFn.getNodeParameter('detectIncapsula', itemIndex, false) as boolean;
	const spsnspidChallenge = eFn.getNodeParameter('spsnspidChallenge', itemIndex, false) as boolean;

	// Captcha options
	const alwaysLoad = eFn.getNodeParameter('alwaysLoad', itemIndex, []) as string[];
	const captchaAnswer = eFn.getNodeParameter('captchaAnswer', itemIndex, '') as string;
	const captchaSuccessIntercept = eFn.getNodeParameter('captchaSuccessIntercept', itemIndex, '') as string;

	// Browser configuration
	const browserType = eFn.getNodeParameter('browserType', itemIndex, 'firefox') as string;
	const browserMinVersion = eFn.getNodeParameter('browserMinVersion', itemIndex, 0) as number;
	const browserMaxVersion = eFn.getNodeParameter('browserMaxVersion', itemIndex, 0) as number;
	const userAgent = eFn.getNodeParameter('userAgent', itemIndex, '') as string;
	const locales = eFn.getNodeParameter('locales', itemIndex, '') as string;
	const setLocale = eFn.getNodeParameter('setLocale', itemIndex, false) as boolean;
	const forceUniqueFingerprint = eFn.getNodeParameter('forceUniqueFingerprint', itemIndex, false) as boolean;
	const webrtcIpv4 = eFn.getNodeParameter('webrtcIpv4', itemIndex, '') as string;
	const webrtcIpv6 = eFn.getNodeParameter('webrtcIpv6', itemIndex, '') as string;

	// Response options
	const innerText = eFn.getNodeParameter('innerText', itemIndex, false) as boolean;
	const includeImages = eFn.getNodeParameter('includeImages', itemIndex, false) as boolean;
	const includeLinks = eFn.getNodeParameter('includeLinks', itemIndex, false) as boolean;
	const screenshot = eFn.getNodeParameter('screenshot', itemIndex, false) as boolean;
	const screenshotUpload = eFn.getNodeParameter('screenshotUpload', itemIndex, false) as boolean;
	const screenshotWidth = eFn.getNodeParameter('screenshotWidth', itemIndex, 1280) as number;
	const screenshotHeight = eFn.getNodeParameter('screenshotHeight', itemIndex, 1024) as number;
	const pdf = eFn.getNodeParameter('pdf', itemIndex, false) as boolean;
	const base64 = eFn.getNodeParameter('base64', itemIndex, false) as boolean;

	// Request interception
	const abortOnDetection = eFn.getNodeParameter('abortOnDetection', itemIndex, '') as string;
	const abortOnPostRequest = eFn.getNodeParameter('abortOnPostRequest', itemIndex, false) as boolean;
	const waitForAbortOnDetection = eFn.getNodeParameter('waitForAbortOnDetection', itemIndex, false) as boolean;
	const waitForAbortOnDetectionTimeout = eFn.getNodeParameter('waitForAbortOnDetectionTimeout', itemIndex, 45000) as number;
	const blackListedDomains = eFn.getNodeParameter('blackListedDomains', itemIndex, '') as string;
	const neverCacheDomains = eFn.getNodeParameter('neverCacheDomains', itemIndex, '') as string;
	const dontLoadMainSite = eFn.getNodeParameter('dontLoadMainSite', itemIndex, false) as boolean;
	const dontLoadFirstRequest = eFn.getNodeParameter('dontLoadFirstRequest', itemIndex, false) as boolean;

	// Advanced browser options
	const fullPageLoad = eFn.getNodeParameter('fullPageLoad', itemIndex, false) as boolean;
	const dontWaitOnPageLoad = eFn.getNodeParameter('dontWaitOnPageLoad', itemIndex, false) as boolean;
	const waitForUrl = eFn.getNodeParameter('waitForUrl', itemIndex, '') as string;
	const removeIframes = eFn.getNodeParameter('removeIframes', itemIndex, false) as boolean;
	const blockCookieBanners = eFn.getNodeParameter('blockCookieBanners', itemIndex, false) as boolean;
	const legacy = eFn.getNodeParameter('legacy', itemIndex, false) as boolean;
	const websocketConnection = eFn.getNodeParameter('websocketConnection', itemIndex, false) as boolean;
	const localStorage = eFn.getNodeParameter('localStorage', itemIndex, '') as string;

	// Browser Actions
	const browserActions = eFn.getNodeParameter('browserActions', itemIndex, {}) as any;

	// Apply basic browser options
	if (antibot) body.automaticallySolveCaptchas = true;
	if (addRandomMouseMovement) body.mouseMovements = true;
	if (forceMouseMovement) body.forceMouseMovement = true;
	if (recordVideoSession) body.video = true;
	if (cssSelector && cssSelector.trim() !== '') body.cssSelector = cssSelector;
	if (href && href.trim() !== '') body.customAttribute = href;

	// Handle intercept fetch request (can be string or array)
	if (interceptXhrFetchRequest && interceptXhrFetchRequest.trim() !== '') {
		// Check if it's a JSON array
		const parsed = safeParseJson(interceptXhrFetchRequest);
		if (Array.isArray(parsed)) {
			body.interceptFetchRequest = parsed;
		} else {
			body.interceptFetchRequest = interceptXhrFetchRequest;
		}
	}

	// Apply antibot options
	if (cloudflareBypass) body.cloudflareBypass = true;
	if (datadome) body.datadomeBypass = true;
	if (datadomeDebug) body.datadomeDebug = true;
	if (kasadaBypass) body.kasadaBypass = true;
	if (disableAntiBot) body.disableAntiBot = true;
	if (detectIncapsula) body.detectIncapsula = true;
	if (spsnspidChallenge) body.spsnspidChallenge = true;

	// Apply captcha options
	if (alwaysLoad && alwaysLoad.length > 0) body.alwaysLoad = alwaysLoad;
	if (captchaAnswer && captchaAnswer.trim() !== '') body.captchaAnswer = captchaAnswer;
	if (captchaSuccessIntercept && captchaSuccessIntercept.trim() !== '') body.captchaSuccessIntercept = captchaSuccessIntercept;

	// Apply browser configuration
	if (browserType || browserMinVersion > 0 || browserMaxVersion > 0) {
		const browserSpec: any = { name: browserType || 'firefox' };
		if (browserMinVersion > 0) browserSpec.minVersion = browserMinVersion;
		if (browserMaxVersion > 0) browserSpec.maxVersion = browserMaxVersion;
		body.browser = [browserSpec];
	}
	if (userAgent && userAgent.trim() !== '') body.userAgent = userAgent;
	if (locales && locales.trim() !== '') {
		body.locales = parseCommaSeparated(locales);
	}
	if (setLocale) body.setLocale = true;
	if (forceUniqueFingerprint) body.forceUniqueFingerprint = true;
	if (webrtcIpv4 && webrtcIpv4.trim() !== '') body.webrtcIpv4 = webrtcIpv4;
	if (webrtcIpv6 && webrtcIpv6.trim() !== '') body.webrtcIpv6 = webrtcIpv6;

	// Apply response options
	if (innerText) body.innerText = true;
	if (includeImages) body.includeImages = true;
	if (includeLinks) body.includeLinks = true;
	if (screenshot) {
		body.screenshot = true;
		if (screenshotUpload) body.screenshotUpload = true;
		if (screenshotWidth !== 1280) body.screenshotWidth = screenshotWidth;
		if (screenshotHeight !== 1024) body.screenshotHeight = screenshotHeight;
		if (base64) body.base64 = true;
	}
	if (pdf) body.pdf = true;

	// Apply request interception options
	if (abortOnDetection && abortOnDetection.trim() !== '') {
		body.abortOnDetection = parseCommaSeparated(abortOnDetection);
	}
	if (abortOnPostRequest) body.abortOnPostRequest = true;
	if (waitForAbortOnDetection) {
		body.waitForAbortOnDetection = true;
		if (waitForAbortOnDetectionTimeout !== 45000) {
			body.waitForAbortOnDetectionTimeout = waitForAbortOnDetectionTimeout;
		}
	}
	if (blackListedDomains && blackListedDomains.trim() !== '') {
		body.blackListedDomains = parseCommaSeparated(blackListedDomains);
	}
	if (neverCacheDomains && neverCacheDomains.trim() !== '') {
		body.neverCacheDomains = parseCommaSeparated(neverCacheDomains);
	}
	if (dontLoadMainSite) body.dontLoadMainSite = true;
	if (dontLoadFirstRequest) body.dontLoadFirstRequest = true;

	// Apply advanced browser options
	if (fullPageLoad) body.fullPageLoad = true;
	if (dontWaitOnPageLoad) body.dontWaitOnPageLoad = true;
	if (waitForUrl && waitForUrl.trim() !== '') body.waitForUrl = waitForUrl;
	if (removeIframes) body.removeIframes = true;
	if (blockCookieBanners) body.blockCookieBanners = true;
	if (legacy) body.legacy = true;
	if (websocketConnection) body.websocket = true;
	if (localStorage && localStorage.trim() !== '') {
		const parsedLocalStorage = safeParseJson(localStorage);
		if (parsedLocalStorage) {
			body.localStorage = parsedLocalStorage;
		}
	}

	// Build browser actions array
	const actionsArray = buildBrowserActionsArray(browserActions);
	if (actionsArray.length > 0) {
		body.browserActions = actionsArray;
	}
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
	const customProxyCountryBoolean = eFn.getNodeParameter('customProxyCountryBoolean', itemIndex, false) as boolean;
	const customProxy = eFn.getNodeParameter('custom_proxy', itemIndex, false) as boolean;
	const whichProxyToUse = eFn.getNodeParameter('whichProxyToUse', itemIndex, 'proxyFromCredentials') as string;
	const attempts = eFn.getNodeParameter('attempts', itemIndex, 1) as number;
	const oneStringCookie = eFn.getNodeParameter('oneStringCookie', itemIndex, false) as boolean;
	const cookie = eFn.getNodeParameter('cookie', itemIndex, '') as string;

	// New fields
	const referer = eFn.getNodeParameter('referer', itemIndex, '') as string;
	const closeAfterUse = eFn.getNodeParameter('closeAfterUse', itemIndex, false) as boolean;
	const dontChangeProxy = eFn.getNodeParameter('dontChangeProxy', itemIndex, false) as boolean;
	const cookiejar = eFn.getNodeParameter('cookiejar', itemIndex, '') as string;
	const timeout = eFn.getNodeParameter('timeout', itemIndex, 60000) as number;

	// Response options
	const onlyStatusCode = eFn.getNodeParameter('onlyStatusCode', itemIndex, false) as boolean;
	const regex = eFn.getNodeParameter('regex', itemIndex, '') as string;
	const filter = eFn.getNodeParameter('filter', itemIndex, []) as string[];
	const base64Response = eFn.getNodeParameter('base64Response', itemIndex, false) as boolean;
	const binary = eFn.getNodeParameter('binary', itemIndex, false) as boolean;
	const listAllRedirects = eFn.getNodeParameter('listAllRedirects', itemIndex, false) as boolean;

	// AI parsing options
	const autoparse = eFn.getNodeParameter('autoparse', itemIndex, false) as boolean;
	const model = eFn.getNodeParameter('model', itemIndex, '') as string;
	const aiApiKey = eFn.getNodeParameter('aiApiKey', itemIndex, '') as string;
	const structure = eFn.getNodeParameter('structure', itemIndex, '') as string;

	if (url && url.trim() !== '') {
		// Process URL expressions - starts with '=' or contains {{ $json.key }}
		url = processUrlExpressions(url, eFn, itemIndex);

		if (url.endsWith('/')) {
			url = url.slice(0, -1);
		}

		body.url = url;
	}

	if (httpMethod && httpMethod.trim() !== '') body.cmd = httpMethod;
	if (referer && referer.trim() !== '') body.referer = referer;

	if (proxyType && proxyType.trim() !== '' && whichProxyToUse === 'proxyFromScrappey') {
		body[proxyType] = true;
	}

	if (userSession && userSession.trim() !== '') body.session = userSession;
	if (closeAfterUse) body.closeAfterUse = true;

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
					itemIndex,
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

	// Handle cookie jar
	if (cookiejar && cookiejar.trim() !== '') {
		const parsedCookiejar = safeParseJson(cookiejar);
		if (parsedCookiejar && Array.isArray(parsedCookiejar)) {
			body.cookiejar = parsedCookiejar;
		}
	}

	if (customProxyCountryBoolean) body.proxyCountry = customProxyCountry;
	if (dontChangeProxy) body.dontChangeProxy = true;

	// Handle proxy configuration
	if (whichProxyToUse === 'proxyFromCredentials' && credentials?.proxyUrl) {
		body.proxy = credentials.proxyUrl as string;
	} else if (whichProxyToUse === 'proxyFromScrappey') {
		if (customProxy && credentials?.proxyUrl) {
			body.proxy = credentials.proxyUrl as string;
		}
	} else if (whichProxyToUse === 'noProxy') {
		body.noProxy = true;
	}

	// Handle attempts/retries
	if (attempts > 1) {
		body.attempts = attempts;
		body.retries = attempts;
	}

	// Handle timeout
	if (timeout !== 60000) {
		body.timeout = timeout;
	}

	// Handle response options
	if (onlyStatusCode) body.onlyStatusCode = true;
	if (regex && regex.trim() !== '') {
		// Check if it's a JSON array
		const parsedRegex = safeParseJson(regex);
		if (Array.isArray(parsedRegex)) {
			body.regex = parsedRegex;
		} else {
			body.regex = regex;
		}
	}
	if (filter && filter.length > 0) body.filter = filter;
	if (base64Response) body.base64Response = true;
	if (binary) body.binary = true;
	if (listAllRedirects) body.listAllRedirects = true;

	// Handle AI parsing
	if (autoparse) {
		body.autoparse = true;
		if (model && model.trim() !== '') body.model = model;
		if (aiApiKey && aiApiKey.trim() !== '') body.api_key = aiApiKey;
		if (structure && structure.trim() !== '') {
			const parsedStructure = safeParseJson(structure);
			if (parsedStructure) {
				body.structure = parsedStructure;
			}
		}
	}

	// Handle whitelisted domains from credentials
	if (credentials?.whitelistedDomains) {
		// Ensure whitelistedDomains is passed as an array
		const domains = Array.isArray(credentials.whitelistedDomains)
			? credentials.whitelistedDomains
			: typeof credentials.whitelistedDomains === 'string'
				? credentials.whitelistedDomains.split(',').map((domain) => domain.trim())
				: [];

		body.whitelistedDomains = domains;
	}

	return body as ScrappeyRequestBody;
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
