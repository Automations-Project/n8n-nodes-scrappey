type BodyEntry = Record<
	string,
	string | number | boolean | Object | BodyEntry[] | Record<string, string>
>;
let body: BodyEntry = {};
import { IExecuteFunctions } from 'n8n-workflow';
const Request_Type_Choice = (choice: string, eFn: IExecuteFunctions) => {
	switch (choice) {
		case 'Browser':
			handleAdvancedBrowser(eFn);
			return body;
		case 'Request':
			// * Added When Choosing Request Option
			body.requestType = 'request';
			return body;

		case 'PatchedChrome':
			// * Patched Body Added When Choosing Patched Chrome Browser
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

	// *******************************************************************************/
	//Getting Advanced Values from Request Type
	const request_type = eFn.getNodeParameter('request_type', 0, 'Request') as string;
	body = Request_Type_Choice(request_type, eFn);
	//*********************************************************************************/

	const url = eFn.getNodeParameter('url', 0, '') as string;
	const httpMethod = eFn.getNodeParameter('httpMethod', 0, '') as string;
	const proxyType = eFn.getNodeParameter('proxyType', 0, '') as string;
	const bodyOrParams = eFn.getNodeParameter('bodyOrParams', 0, '') as string;
	const params_for_request = eFn.getNodeParameter('params_for_request', 0, '') as string;
	const body_for_request = eFn.getNodeParameter('body_for_request', 0, '') as string;
	const userSeason = eFn.getNodeParameter('userSeason', 0, '') as string;
	const customHeaders = eFn.getNodeParameter('customHeaders', 0, {}) as Record<string, string>;
	const customCookies = eFn.getNodeParameter('customCookies', 0, {}) as Record<string, string>;
	const customProxyCountry = eFn.getNodeParameter('customProxyCountry', 0, '') as string;
	const customProxy = eFn.getNodeParameter('custom_proxy', 0, false) as boolean;
	const allowProxy = eFn.getNodeParameter('allowProxy', 0, false) as boolean;
	//*************************************************************
	// Adding Keys if they have values
	//*************************************************************
	if (url && url.trim() !== '') body.url = url;
	if (httpMethod && httpMethod.trim() !== '') body.cmd = httpMethod;
	// When proxyType has a valid value (not empty string), use that value as a key
	if (proxyType && proxyType.trim() !== '') body[proxyType] = true;

	if (userSeason && userSeason.trim() !== '') body.session = userSeason;

	// Handle the body or params will be sended
	if (httpMethod !== 'request.get') {
		if (bodyOrParams) {
			body.postData = body_for_request;
			body.customHeaders = {
				'content-type': 'application/json',
			};
		} else body.postData = params_for_request;
	}
	/*********************************************************************** */

	// Handle Custom headers keys and values
	if (customHeaders && Object.keys(customHeaders).length > 0) {
		const headersObj: Record<string, string> = {};

		if (customHeaders.headers && Array.isArray(customHeaders.headers)) {
			customHeaders.headers.forEach((header: any) => {
				if (header.header_key && header.header_value) {
					headersObj[header.header_key] = header.header_value;
				}
			});
			body.customHeaders = headersObj;
		} else body.customHeaders = customHeaders;
	}

	// Handle Custom cookies keys and values
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

	if (customProxyCountry && customProxyCountry.trim() !== '')
		body.proxyCountry = customProxyCountry;

	if (allowProxy) {
		if (customProxy === true) body.proxy = credentials.proxyUrl;
	}

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
