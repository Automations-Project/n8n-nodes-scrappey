// ============================================
// Scrappey API Types - Complete Type Definitions
// Based on API Documentation
// ============================================

// ============================================
// Browser Action Types
// ============================================

export interface BrowserActionBase {
	type: string;
	when?: 'beforeload' | 'afterload';
	ignoreErrors?: boolean;
	timeout?: number;
}

export interface ClickAction extends BrowserActionBase {
	type: 'click';
	cssSelector: string;
	wait?: number;
	waitForSelector?: string;
	direct?: boolean;
}

export interface TypeAction extends BrowserActionBase {
	type: 'type';
	cssSelector: string;
	text: string;
	wait?: number;
	direct?: boolean;
}

export interface GotoAction extends BrowserActionBase {
	type: 'goto';
	url: string;
	wait?: number;
}

export interface WaitAction extends BrowserActionBase {
	type: 'wait';
	wait: number;
}

export interface WaitForSelectorAction extends BrowserActionBase {
	type: 'wait_for_selector';
	cssSelector: string;
}

export interface WaitForFunctionAction extends BrowserActionBase {
	type: 'wait_for_function';
	code: string;
}

export interface WaitForLoadStateAction extends BrowserActionBase {
	type: 'wait_for_load_state';
	waitForLoadState: 'domcontentloaded' | 'networkidle' | 'load';
}

export interface WaitForCookieAction extends BrowserActionBase {
	type: 'wait_for_cookie';
	cookieName: string;
	cookieValue?: string;
	cookieDomain?: string;
	pollIntervalMs?: number;
}

export interface ExecuteJsAction extends BrowserActionBase {
	type: 'execute_js';
	code: string;
	dontReturnValue?: boolean;
}

export interface ScrollAction extends BrowserActionBase {
	type: 'scroll';
	cssSelector?: string;
	repeat?: number;
	delayMs?: number;
}

export interface HoverAction extends BrowserActionBase {
	type: 'hover';
	cssSelector: string;
}

export interface KeyboardAction extends BrowserActionBase {
	type: 'keyboard';
	value: 'tab' | 'enter' | 'space' | 'arrowdown' | 'arrowup' | 'arrowleft' | 'arrowright' | 'backspace' | 'clear';
	cssSelector?: string;
	wait?: number;
	waitForSelector?: string;
}

export interface DropdownAction extends BrowserActionBase {
	type: 'dropdown';
	cssSelector: string;
	index?: number;
	value?: string;
	wait?: number;
	waitForSelector?: string;
}

export interface SwitchIframeAction extends BrowserActionBase {
	type: 'switch_iframe';
	cssSelector: string;
}

export interface SetViewportAction extends BrowserActionBase {
	type: 'set_viewport';
	width?: number;
	height?: number;
	wait?: number;
}

export interface IfAction extends BrowserActionBase {
	type: 'if';
	condition: string;
	then: BrowserAction[];
	or?: BrowserAction[];
}

export interface WhileAction extends BrowserActionBase {
	type: 'while';
	condition: string;
	then: BrowserAction[];
	maxAttempts?: number;
}

export interface CaptchaData {
	sitekey?: string;
	action?: string;
	pageAction?: string;
	invisible?: boolean;
	base64Image?: string;
	cssSelector?: string;
	reset?: boolean;
	fast?: boolean;
}

export type CaptchaType = 
	| 'turnstile'
	| 'recaptcha'
	| 'recaptchav2'
	| 'recaptchav3'
	| 'hcaptcha'
	| 'hcaptcha_inside'
	| 'hcaptcha_enterprise_inside'
	| 'funcaptcha'
	| 'perimeterx'
	| 'mtcaptcha'
	| 'mtcaptchaisolated'
	| 'v4guard'
	| 'custom'
	| 'fingerprintjscom'
	| 'fingerprintjs_curseforge';

export interface SolveCaptchaAction extends BrowserActionBase {
	type: 'solve_captcha';
	captcha: CaptchaType;
	captchaData?: CaptchaData;
	websiteUrl?: string;
	websiteKey?: string;
	cssSelector?: string;
	inputSelector?: string;
	clickSelector?: string;
	iframeSelector?: string;
	coreName?: string;
}

export interface DiscordLoginAction extends BrowserActionBase {
	type: 'discord_login';
	token: string;
	direct?: boolean;
	wait?: number;
}

export interface RemoveIframesAction extends BrowserActionBase {
	type: 'remove_iframes';
}

export type BrowserAction =
	| ClickAction
	| TypeAction
	| GotoAction
	| WaitAction
	| WaitForSelectorAction
	| WaitForFunctionAction
	| WaitForLoadStateAction
	| WaitForCookieAction
	| ExecuteJsAction
	| ScrollAction
	| HoverAction
	| KeyboardAction
	| DropdownAction
	| SwitchIframeAction
	| SetViewportAction
	| IfAction
	| WhileAction
	| SolveCaptchaAction
	| DiscordLoginAction
	| RemoveIframesAction;

// ============================================
// Browser Configuration Types
// ============================================

export interface BrowserSpec {
	name: 'firefox' | 'chrome' | 'safari';
	minVersion?: number;
	maxVersion?: number;
}

export interface DeviceSpec {
	[key: string]: unknown;
}

export interface OperatingSystemSpec {
	[key: string]: unknown;
}

// ============================================
// Cookie Types
// ============================================

export interface CookieObject {
	name: string;
	value: string;
	domain?: string;
	path?: string;
	expires?: number;
	httpOnly?: boolean;
	secure?: boolean;
	sameSite?: 'Strict' | 'Lax' | 'None';
}

// ============================================
// Main Request Body Interface
// ============================================

export interface ScrappeyRequestBody {
	// Command and URL (Required)
	cmd: string;
	url?: string;

	// Request Settings
	referer?: string;
	postData?: string | Record<string, unknown>;
	requestType?: 'request';
	onlyStatusCode?: boolean;
	method?: string;

	// Browser Configuration
	browser?: BrowserSpec[];
	userAgent?: string;
	device?: DeviceSpec;
	operatingSystem?: OperatingSystemSpec;
	locales?: string[];
	setLocale?: boolean;
	headful?: boolean;
	devTools?: boolean;
	showBrowser?: boolean;

	// Proxy Settings
	proxy?: string;
	proxyCountry?: string;
	noProxy?: boolean;
	premiumProxy?: boolean;
	mobileProxy?: boolean;
	dontChangeProxy?: boolean;

	// Session Management
	session?: string;
	closeAfterUse?: boolean;
	userId?: number;
	MAX_SESSIONS_OPEN?: number;
	session_ttl?: number;

	// Antibot Bypass Options
	cloudflareBypass?: boolean;
	datadomeBypass?: boolean;
	datadomeDebug?: boolean;
	kasadaBypass?: boolean;
	disableAntiBot?: boolean;
	detectIncapsula?: boolean;
	spsnspidChallenge?: boolean;

	// Captcha Solving
	automaticallySolveCaptchas?: boolean;
	alwaysLoad?: string[];
	captchaAnswer?: string;
	captchaSuccessIntercept?: string;

	// Browser Actions
	browserActions?: BrowserAction[];
	waitForSpecificActionOnSite?: boolean;
	mouseMovements?: boolean;
	forceMouseMovement?: boolean;

	// Response Data Options
	cssSelector?: string;
	innerText?: boolean;
	includeImages?: boolean;
	includeLinks?: boolean;
	regex?: string | string[];
	screenshot?: boolean;
	screenshotUpload?: boolean;
	screenshotWidth?: number;
	screenshotHeight?: number;
	video?: boolean;
	base64?: boolean;
	base64Response?: boolean;
	binary?: boolean;
	pdf?: boolean;
	filter?: string[];

	// Request Interception
	interceptFetchRequest?: string | string[];
	abortOnDetection?: string[];
	abortOnPostRequest?: boolean;
	waitForAbortOnDetection?: boolean;
	waitForAbortOnDetectionTimeout?: number;
	whitelistedDomains?: string[];
	blackListedDomains?: string[];
	neverCacheDomains?: string[];
	dontLoadMainSite?: boolean;
	dontLoadFirstRequest?: boolean;

	// Advanced Options
	customHeaders?: Record<string, string>;
	setCustomHeaders?: boolean;
	cookies?: string;
	cookiejar?: CookieObject[];
	localStorage?: Record<string, unknown>;
	javascriptReturn?: unknown[];
	autoparse?: boolean;
	structure?: Record<string, unknown>;
	model?: string;
	api_key?: string;
	fullPageLoad?: boolean;
	dontWaitOnPageLoad?: boolean;
	waitForUrl?: string;
	listAllRedirects?: boolean;
	removeIframes?: boolean;
	blockCookieBanners?: boolean;
	legacy?: boolean;
	websocket?: boolean;
	forceUniqueFingerprint?: boolean;
	webrtcIpv4?: string;
	webrtcIpv6?: string;
	retries?: number;
	attempts?: number;
	timeout?: number;

	// For PatchedChrome
	noDriver?: boolean;

	// Custom attribute (href)
	customAttribute?: string;

	// Dynamic properties for proxy types
	[key: string]: string | boolean | number | unknown[] | Record<string, unknown> | undefined;
}

// ============================================
// Session Request Types
// ============================================

export interface SessionCreateRequest {
	cmd: 'sessions.create';
	session?: string;
	proxy?: string;
	userId?: number;
	session_ttl?: number;
	headless?: string;
	geoip?: string;
}

export interface SessionDestroyRequest {
	cmd: 'sessions.destroy';
	session: string;
}

export interface SessionListRequest {
	cmd: 'sessions.list';
	userId?: number;
}

export interface SessionActiveRequest {
	cmd: 'sessions.active';
	session: string;
}

export interface WebSocketCreateRequest {
	cmd: 'websocket.create';
	userId?: number;
	proxy?: string;
	session_ttl?: number;
	headless?: string;
	geoip?: string;
}

// ============================================
// Response Types
// ============================================

export interface DetectedAntibotProviders {
	providers: string[];
	confidence: Record<string, number>;
	primaryProvider?: string;
}

export interface InterceptedRequest {
	url: string;
	method: string;
	headers: Record<string, string>;
	body?: string;
	response?: unknown;
}

export interface SolutionResponse {
	verified: boolean;
	type?: 'browser' | 'request';
	response?: string;
	statusCode?: number;
	currentUrl?: string;
	userAgent?: string;
	cookies?: CookieObject[];
	cookieString?: string;
	responseHeaders?: Record<string, string>;
	requestHeaders?: Record<string, string>;
	requestBody?: string;
	method?: string;
	ipInfo?: Record<string, unknown>;
	innerText?: string;
	localStorageData?: Record<string, unknown>;
	screenshot?: string;
	screenshotUrl?: string;
	videoUrl?: string;
	interceptFetchRequestResponse?: InterceptedRequest | InterceptedRequest[];
	javascriptReturn?: unknown[];
	base64Response?: string;
	listAllRedirectsResponse?: string[];
	additionalCost?: number;
	wsEndpoint?: string;
	ws?: string;
	detectedAntibotProviders?: DetectedAntibotProviders;
	captchaSolveResult?: {
		type: string;
		status: string;
		timeTaken: number;
	};
	abortOnDetectionResponse?: Array<{
		url: string;
		headers: Record<string, string>;
		payload?: string;
	}>;
}

export interface ScrappeyResponse {
	solution: SolutionResponse;
	timeElapsed: number;
	data: 'success' | 'error';
	session?: string;
	error?: string;
	info?: string;
	fingerprint?: Record<string, unknown>;
	context?: Record<string, unknown>;
}

export interface SessionListResponse {
	sessions: Array<{
		session: string;
		lastAccessed: number;
	}>;
	open: number;
	limit: number;
	timeElapsed: number;
}

export interface SessionActiveResponse {
	active: boolean;
}

// ============================================
// Legacy Types (for backward compatibility)
// ============================================

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
