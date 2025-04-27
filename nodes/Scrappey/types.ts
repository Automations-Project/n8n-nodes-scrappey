export interface HTTPRequest_Body {
	cmd: string;
	method: string;
	url: string;
	datadomeBypass: string;
	retries: string;
	mouseMovements: string;
	automaticallySolveCaptchas: string;
	customHeaders: { [key: string]: string };
	proxy: string;
}

export interface ScrappeyRequestBody {
	cmd: string;
	url: string;
	datadomeBypass: boolean;
	retries: number;
	mouseMovements: boolean;
	automaticallySolveCaptchas: boolean;
	customHeaders: any;
	proxy?: string;
	bodyParameters?: any;
	postData?: string;
}
