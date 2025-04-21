import { IExecuteFunctions, IHttpRequestMethods, ILoadOptionsFunctions } from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

interface RequestOptions {
	method?: IHttpRequestMethods;
	headers?: HeadersInit;
	body?: any;
	params?: Record<string, string>;
	// true for render endpoints, false for classic API
}

export interface FieldConfig {
	condition: string;
	values?: string[];
}

export interface AccountDataTemplate {
	[key: string]: FieldConfig;
}

export interface GameBoostResponse {
	data?: Array<{
		id: string;
		type: string;

		attributes: {
			title: string;
			game_slug: string;
			status: string;
			account_data: Record<string, any>;
			[key: string]: any;
		};
	}>;
	meta?: {
		to: number;
		total: number;
		per_page: number;
	};
	template?: {
		account_data: AccountDataTemplate;
	};
}

export async function genericHttpRequest<T = GameBoostResponse>(this: IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, endpoint: string, options: RequestOptions = {}): Promise<T> {
	try {
		const credentials = await this.getCredentials('testNodeApi');
		const apiKey = credentials?.apiKey as string;

		// Add query parameters to URL if they exist
		let fullEndpoint = `https://test.com${endpoint}`;
		if (options.params) {
			const searchParams = new URLSearchParams(options.params);
			fullEndpoint += fullEndpoint.includes('?') ? '&' : '?';
			fullEndpoint += searchParams.toString();
		}

		const response = await this.helpers.httpRequest({
			method,
			url: fullEndpoint,
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${apiKey}`,
				...options.headers,
			},
			body: options.body ? JSON.stringify(options.body) : undefined,
			json: true,
		});
		return response as T;
	} catch (error: any) {
		// console.error('Request failed:', JSON.stringify(error.response?.data,

		if (error.response?.status >= 400) {
			// Handle all client (4xx) and server (5xx) errors
			const errorData = error.response.data;
			let errorMessage = `Error ${error.response.status}: `;

			if (errorData.errors) {
				// Format validation errors into readable message
				errorMessage += Object.entries(errorData.errors)
					.map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
					.join('; ');
			} else if (errorData.message) {
				errorMessage += errorData.message;
			} else {
				errorMessage += 'An unexpected error occurred';
			}

			return { status: error.response.status, error: errorMessage } as T;
		}

		// Fallback for other types of errors
		throw new NodeApiError(this.getNode(), { message: error.message });
	}
}

export function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}