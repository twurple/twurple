/// <reference lib="dom" />

import { parse, stringify } from '@d-fischer/qs';
import type { AccessToken, AuthProvider, AuthProviderTokenType } from '@twurple/auth';
import type { BrowserWindowConstructorOptions } from 'electron';
import { BrowserWindow } from 'electron';
import type {
	BaseOptions,
	ElectronAuthProviderOptions,
	WindowOptions,
	WindowStyleOptions
} from './ElectronAuthProviderOptions';
import { WindowClosedError } from './WindowClosedError';

interface AuthorizeParams {
	response_type: string;
	client_id: string;
	redirect_uri: string;
	scope: string;
	force_verify?: boolean;
}

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
	private readonly _currentScopes = new Set<string>();
	private readonly _options: BaseOptions & Partial<WindowOptions & WindowStyleOptions>;
	private _allowUserChange = false;
	private readonly _clientId: string;
	private readonly _redirectUri: string;

	readonly tokenType: AuthProviderTokenType = 'user';

	constructor(
		clientCredentials: TwitchClientCredentials,
		options?: ElectronAuthProviderOptions | ElectronAuthProviderOptions<WindowOptions>
	) {
		this._clientId = clientCredentials.clientId;
		this._redirectUri = clientCredentials.redirectUri;
		this._options = { ...defaultOptions, ...options };
	}

	allowUserChange(): void {
		this._allowUserChange = true;
	}

	get clientId(): string {
		return this._clientId;
	}

	get currentScopes(): string[] {
		return Array.from(this._currentScopes);
	}

	async getAccessToken(scopes: string[] = []): Promise<AccessToken> {
		return await new Promise<AccessToken>((resolve, reject) => {
			if (this._accessToken && scopes.every(scope => this._currentScopes.has(scope))) {
				resolve(this._accessToken);
				return;
			}

			const queryParams: AuthorizeParams = {
				response_type: 'token',
				client_id: this.clientId,
				redirect_uri: this._redirectUri,
				scope: scopes.join(' ')
			};
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
					const params: Record<string, string> = url.hash ? parse(url.hash.substr(1)) : url.searchParams;

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
						for (const scope of scopes) {
							this._currentScopes.add(scope);
						}
						this._accessToken = {
							accessToken,
							scope: this.currentScopes,
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
