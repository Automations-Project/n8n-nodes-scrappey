import { IExecuteFunctions, IHttpRequestMethods, ILoadOptionsFunctions } from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

interface RequestOptions {
	method?: IHttpRequestMethods;
	headers?: Record<string, string>;
	body?: any;
	params?: Record<string, string>;
}

export async function genericHttpRequest<T>(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	options: RequestOptions = {},
): Promise<T> {
	try {
		const credentials = await this.getCredentials('scrappeyApi');
		const apiKey = credentials?.apiKey as string;

		// Set up base URL and add API key as query parameter
		let fullEndpoint = `https://publisher.scrappey.com/api/v1${endpoint}`;

		// Initialize params if they don't exist
		const params = options.params || {};
		// Add API key to params
		params.key = apiKey;

		// Add query parameters to URL
		const searchParams = new URLSearchParams(params);
		fullEndpoint += fullEndpoint.includes('?') ? '&' : '?';
		fullEndpoint += searchParams.toString();

		const response = await this.helpers.httpRequest({
			method,
			url: fullEndpoint,
			headers: {
				'Content-Type': 'application/json',
				...options.headers,
			},
			body: options.body ? JSON.stringify(options.body) : undefined,
			json: true,
		});
		return response as T;
	} catch (error: any) {
		// Error mapping for Scrappey API error codes
		const errorCodeMap: Record<string, { code: string; message: string; details: string }> = {
			'CODE-0001': {
				code: 'CODE-0001',
				message: 'Server is overloaded',
				details: 'All server capacity is used, please try again.',
			},
			'CODE-0002': {
				code: 'CODE-0002',
				message: 'Cloudflare blocked',
				details: 'Cloudflare blocked the request, preventing access to the resource.',
			},
			'CODE-0003': {
				code: 'CODE-0003',
				message: 'Cloudflare too many attempts, try again',
				details: 'Cloudflare has detected too many attempts from your IP; please try again later.',
			},
			'CODE-0004': {
				code: 'CODE-0004',
				message: 'Invalid cmd command',
				details: 'The provided cmd command is invalid and cannot be executed.',
			},
			'CODE-0005': {
				code: 'CODE-0005',
				message: 'Tunnel connection failed',
				details: 'Tunnel connection failed, and the request cannot be completed.',
			},
			'CODE-0006': {
				code: 'CODE-0006',
				message: 'ERR_HTTP_RESPONSE_CODE_FAILURE',
				details: 'Failure in the HTTP response code.',
			},
			'CODE-0007': {
				code: 'CODE-0007',
				message: 'Could not click turnstile button',
				details: 'System could not click the turnstile button, and the request cannot proceed.',
			},
			'CODE-0008': {
				code: 'CODE-0008',
				message: 'Ticketmaster blocked',
				details: 'Ticketmaster has blocked access to the resource.',
			},
			'CODE-0009': {
				code: 'CODE-0009',
				message: 'Error from ChatGPT, try again',
				details: 'An error occurred in the ChatGPT API, please try again.',
			},
			'CODE-0010': {
				code: 'CODE-0010',
				message: 'Blocked proxy on Datadome',
				details: 'Proxy blocked by Datadome, please try again later.',
			},
			'CODE-0011': {
				code: 'CODE-0011',
				message: 'Could not solve datadome',
				details: 'System could not solve Datadome protection, please try again.',
			},
			'CODE-0012': {
				code: 'CODE-0012',
				message: 'Could not parse datadome cookie',
				details: 'Issue parsing the Datadome cookie, please try again.',
			},
			'CODE-0013': {
				code: 'CODE-0013',
				message: 'Captcha solver datadome cookie error',
				details: "Captcha solver's Datadome cookie error, please retry the request.",
			},
			'CODE-0014': {
				code: 'CODE-0014',
				message: 'Could not load Datadome',
				details: 'Datadome protection could not be loaded, please try again.',
			},
			'CODE-0015': {
				code: 'CODE-0015',
				message: 'Socks4 With Authentication not Supported',
				details: 'Socks4 with authentication is not supported.',
			},
			'CODE-0016': {
				code: 'CODE-0016',
				message: 'Socks5 With Authentication not Supported',
				details: 'Socks5 with authentication is not supported.',
			},
			'CODE-0017': {
				code: 'CODE-0017',
				message: 'Cloudflare updated and is currently not solvable, try again later',
				details: 'Cloudflare updated and is currently unsolvable, try again later.',
			},
			'CODE-0018': {
				code: 'CODE-0018',
				message: 'Too high error rate for this URL',
				details:
					'High error rate for this URL, affecting service. Contact support to lift the temporary ban.',
			},
			'CODE-0019': {
				code: 'CODE-0019',
				message: 'The proxy server is refusing connections',
				details: 'Proxy server refusing connections, check proxy settings.',
			},
			'CODE-0020': {
				code: 'CODE-0020',
				message: 'Could not find intercept request',
				details: 'System could not find the intercept request, please try again.',
			},
			'CODE-0021': {
				code: 'CODE-0021',
				message: 'Unknown error occurred with request',
				details: 'Unknown error occurred with the request, please try again.',
			},
			'CODE-0022': {
				code: 'CODE-0022',
				message: 'Captcha type solve_captcha is not found',
				details: 'Specified captcha type "solve_captcha" was not found, please try again.',
			},
			'CODE-0023': {
				code: 'CODE-0023',
				message: 'Turnstile solve_captcha was not found',
				details: 'Turnstile "solve_captcha" was not found, please try again.',
			},
			'CODE-0024': {
				code: 'CODE-0024',
				message: 'Proxy timeout - proxy too slow',
				details: 'Proxy connection timed out due to slowness, please try again.',
			},
			'CODE-0025': {
				code: 'CODE-0025',
				message: 'NS_ERROR_NET_TIMEOUT - proxy too slow',
				details: 'NS_ERROR_NET_TIMEOUT occurred due to a slow proxy, please try again.',
			},
			'CODE-0026': {
				code: 'CODE-0026',
				message: 'Internal browser error',
				details: 'Internal browser error occurred, please try again.',
			},
			'CODE-0027': {
				code: 'CODE-0027',
				message: 'No elements found for this CSS selector',
				details: 'No elements found for the given CSS selector, please retry.',
			},
			'CODE-0028': {
				code: 'CODE-0028',
				message: 'Could not solve perimeterx',
				details: 'System could not solve PerimeterX protection, please try again.',
			},
			'CODE-0029': {
				code: 'CODE-0029',
				message: 'Too many sessions open',
				details:
					'Too many sessions open; sessions will automatically close after 240 seconds. Contact support for more sessions.',
			},
			'CODE-0030': {
				code: 'CODE-0030',
				message: 'Browser name must be: firefox, chrome or safari',
				details: 'Browser name must be one of: firefox, chrome, or safari.',
			},
			'CODE-0031': {
				code: 'CODE-0031',
				message: 'Request error, please try again',
				details: 'Request error, please try again.',
			},
			'CODE-0032': {
				code: 'CODE-0032',
				message: 'Turnstile captcha could not be solved',
				details: 'Turnstile captcha could not be solved, please try again with a different proxy.',
			},
			'CODE-0033': {
				code: 'CODE-0033',
				message: 'Mt captcha could not be solved',
				details: 'Mt captcha could not be solved, please try again.',
			},
			'CODE-0034': {
				code: 'CODE-0034',
				message: 'Datadome captcha could not be solved after 5 attempts',
				details:
					'Datadome captcha could not be solved after 5 attempts, try different proxy settings.',
			},
			'CODE-0035': {
				code: 'CODE-0035',
				message: 'Could not load geetest',
				details: 'Could not load geetest, please try again.',
			},
			'CODE-0036': {
				code: 'CODE-0036',
				message: 'Keyboard action value not found',
				details: 'Keyboard action value not found.',
			},
		'CODE-0037': {
			code: 'CODE-0037',
			message: 'Datadome was blocked',
			details: 'Datadome was blocked, please try again with a different proxy.',
		},
		'CODE-0038': {
			code: 'CODE-0038',
			message: 'Could not solve FingerprintJS challenge',
			details: 'The FingerprintJS challenge could not be solved, please try again.',
		},
		'CODE-10000': {
				code: 'CODE-10000',
				message: 'Unknown error - has to be specified',
				details: 'An unknown error occurred and needs to be specified.',
			},
		};


		if (
			(error.message && error.message.includes('ERR_TUNNEL_CONNECTION_FAILED')) ||
			error.message.includes('ERR_EMPTY_RESPONSE')
		) {
			const errorDetails = errorCodeMap['CODE-0007'];
			throw new NodeApiError(this.getNode(), error, {
				message: errorDetails.message,
				description: errorDetails.details,
				httpCode: '500',
			});
		}

		// Try to extract error code from response
		let errorCode = 'CODE-10000'; // Default unknown error
		if (error.response?.data?.code) {
			errorCode = error.response.data.code;
		}

		// Use mapped error if available, otherwise use a generic error
		const mappedError = errorCodeMap[errorCode] || errorCodeMap['CODE-10000'];

		throw new NodeApiError(this.getNode(), error, {
			message: mappedError.message,
			description: mappedError.details,
			httpCode: error.response?.status.toString() || '500',
		});
	}
}
