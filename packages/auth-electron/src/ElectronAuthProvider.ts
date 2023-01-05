/// <reference lib="dom" />

import { parse, stringify } from '@d-fischer/qs';
import type { AccessToken } from '@twurple/auth';
import {
	type AccessTokenMaybeWithUserId,
	type AccessTokenWithUserId,
	type AuthProvider,
	TokenFetcher
} from '@twurple/auth';
import { extractUserId, type UserIdResolvable } from '@twurple/common';
import type { BrowserWindowConstructorOptions } from 'electron';
import { BrowserWindow } from 'electron';
import { createAuthorizeParams } from './AuthorizeParams.external';
import type {
	BaseOptions,
	ElectronAuthProviderOptions,
	WindowOptions,
	WindowStyleOptions
} from './ElectronAuthProviderOptions';
import { WindowClosedError } from './WindowClosedError';

export interface TwitchClientCredentials {
	/**
	 * The client ID of your application.
	 */
	clientId: string;

	/**
	 * A redirect URI that was added to your application.
	 */
	redirectUri: string;
}

const defaultOptions: BaseOptions & Partial<WindowStyleOptions & WindowOptions> = {
	escapeToClose: true,
	closeOnLogin: true
};

export class ElectronAuthProvider implements AuthProvider {
	private _accessToken?: AccessToken;
	private _currentScopes = new Set<string>();
	private readonly _options: BaseOptions & Partial<WindowOptions & WindowStyleOptions>;
	private _allowUserChange = false;
	private readonly _clientId: string;
	private readonly _redirectUri: string;
	private readonly _fetcher: TokenFetcher;

	constructor(
		clientCredentials: TwitchClientCredentials,
		options?: ElectronAuthProviderOptions | ElectronAuthProviderOptions<WindowOptions>
	) {
		this._clientId = clientCredentials.clientId;
		this._redirectUri = clientCredentials.redirectUri;
		this._options = { ...defaultOptions, ...options };
		this._fetcher = new TokenFetcher(async scopes => await this._fetch(scopes));
	}

	allowUserChange(): void {
		this._allowUserChange = true;
	}

	get clientId(): string {
		return this._clientId;
	}

	getCurrentScopesForUser(): string[] {
		return Array.from(this._currentScopes);
	}

	async getAccessTokenForUser(user: UserIdResolvable, scopes?: string[]): Promise<AccessTokenWithUserId> {
		const token = await this._fetcher.fetch(scopes);

		return {
			...token,
			userId: extractUserId(user)
		};
	}

	async getAnyAccessToken(): Promise<AccessTokenMaybeWithUserId> {
		return await this._fetcher.fetch();
	}

	private async _fetch(scopeSets: string[][]): Promise<AccessToken> {
		return await new Promise<AccessToken>((resolve, reject) => {
			if (this._accessToken && scopeSets.every(scopes => scopes.some(scope => this._currentScopes.has(scope)))) {
				resolve(this._accessToken);
				return;
			}

			const scopesToRequest = new Set(this._currentScopes);
			for (const scopes of scopeSets) {
				if (scopes.length && scopes.every(scope => !scopesToRequest.has(scope))) {
					scopesToRequest.add(scopes[0]);
				}
			}
			const queryParams = createAuthorizeParams(this.clientId, this._redirectUri, Array.from(scopesToRequest));
			if (this._allowUserChange) {
				queryParams.force_verify = true;
			}
			const authUrl = `https://id.twitch.tv/oauth2/authorize${stringify(queryParams, { addQueryPrefix: true })}`;
			const defaultBrowserWindowOptions: BrowserWindowConstructorOptions = {
				width: 800,
				height: 600,
				show: false,
				modal: true,
				webPreferences: {
					nodeIntegration: false
				}
			};
			let done = false;
			const authWindow =
				this._options.window ??
				new BrowserWindow(Object.assign(defaultBrowserWindowOptions, this._options.windowOptions));

			authWindow.webContents.once('did-finish-load', () => authWindow.show());

			authWindow.on('closed', () => {
				if (!done) {
					reject(new WindowClosedError());
				}
			});

			if (this._options.escapeToClose) {
				authWindow.webContents.on('before-input-event', (_, input) => {
					switch (input.key) {
						case 'Esc':
						case 'Escape':
							authWindow.close();
							break;

						default:
							break;
					}
				});
			}

			authWindow.webContents.session.webRequest.onBeforeRequest(
				{ urls: [this._redirectUri] },
				(details, callback) => {
					const url = new URL(details.url);
					const match = url.origin + url.pathname;

					// sometimes, electron seems to intercept too much... we catch this here
					if (match !== this._redirectUri) {
						// the trailing slash might be too much in the pathname
						if (url.pathname !== '/' || url.origin !== this._redirectUri) {
							callback({});
							return;
						}
					}
					// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
					const params: Record<string, string> = url.hash ? parse(url.hash.slice(1)) : url.searchParams;

					if (params.error || params.access_token) {
						done = true;

						if (this._options.closeOnLogin) {
							authWindow.destroy();
						}
					}

					if (params.error) {
						reject(new Error(`Error received from Twitch: ${params.error}`));
					} else if (params.access_token) {
						const accessToken = params.access_token;
						this._currentScopes = scopesToRequest;
						this._accessToken = {
							accessToken,
							scope: Array.from(this._currentScopes),
							refreshToken: null,
							expiresIn: null,
							obtainmentTimestamp: Date.now()
						};
						this._allowUserChange = false;
						resolve(this._accessToken);
					}

					callback({ cancel: true });
				}
			);

			// do this last so there is no race condition
			void authWindow.loadURL(authUrl);
		});
	}
}
