/* eslint-disable filenames/match-exported */
import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron';
import * as qs from 'qs';
import { AccessToken, AuthProvider } from 'twitch';
import WindowClosedError from './WindowClosedError';

export interface TwitchClientCredentials {
	clientId: string;
	redirectURI: string;
}

interface BaseOptions {
	/**
	 * If `true`, if the user presses Esc, the window will close.  Default `true`.
	 */
	escapeToClose?: boolean;
}

interface WindowStyleOptions {
	/**
	 * Options passed to the `BrowserWindow` constructor, primarily for styling.
	 */
	windowOptions?: BrowserWindowConstructorOptions;
}

interface WindowOptions {
	/**
	 * A custom `BrowserWindow` in which the loading will occur.
	 *
	 * @default
	 * ```js
	 *	{
	 *		width: 800,
	 *		height: 600,
	 *		show: false,
	 *		modal: true,
	 *		webPreferences: {
	 *			nodeIntegration: false
	 *		}
	 *	}
	 *```
	 */
	window: BrowserWindow;

	/**
	 * Close the `BrowserWindow` after the user has logged in.  Default: `true`.
	 */
	closeOnLogin?: boolean;
}

type Options<T extends WindowOptions | WindowStyleOptions = WindowStyleOptions> = BaseOptions & T;

const defaultOptions: BaseOptions & Partial<WindowStyleOptions & WindowOptions> = {
	escapeToClose: true,
	closeOnLogin: true
};

export default class ElectronAuthProvider implements AuthProvider {
	private _accessToken?: AccessToken;
	private readonly _currentScopes = new Set<string>();
	private readonly _options: BaseOptions & Partial<WindowOptions & WindowStyleOptions>;

	constructor(clientCredentials: TwitchClientCredentials, options?: Options<WindowStyleOptions>);
	constructor(clientCredentials: TwitchClientCredentials, options?: Options<WindowOptions>);
	constructor(
		private readonly _clientCredentials: TwitchClientCredentials,
		options?: Options<WindowStyleOptions> | Options<WindowOptions>
	) {
		this._options = { ...defaultOptions, ...options };
	}

	get clientId() {
		return this._clientCredentials.clientId;
	}

	get currentScopes() {
		return Array.from(this._currentScopes);
	}

	async getAccessToken(scopes?: string | string[]) {
		return new Promise<AccessToken>((resolve, reject) => {
			if (typeof scopes === 'string') {
				scopes = [scopes];
			} else if (!scopes) {
				scopes = [];
			}

			if (this._accessToken && scopes.every(scope => this._currentScopes.has(scope))) {
				resolve(this._accessToken);
				return;
			}

			const redir = encodeURIComponent(this._clientCredentials.redirectURI);
			const authUrl = `https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=${
				this.clientId
			}&redirect_uri=${redir}&scope=${scopes.join(' ')}`;
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
				this._options.window ||
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
				{ urls: [this._clientCredentials.redirectURI] },
				(details, callback) => {
					const url = new URL(details.url);
					const match = url.origin + url.pathname;

					// sometimes, electron seems to intercept too much... we catch this here
					if (match !== this._clientCredentials.redirectURI) {
						// the trailing slash might be too much in the pathname
						if (url.pathname !== '/' || url.origin !== this._clientCredentials.redirectURI) {
							callback({});
							return;
						}
					}
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					const params: any = url.hash ? qs.parse(url.hash.substr(1)) : url.searchParams;

					if (params.error || params.access_token) {
						done = true;

						if (this._options.closeOnLogin) {
							authWindow.destroy();
						}
					}

					if (params.error) {
						reject(new Error(`Error received from Twitch: ${params.error}`));
					} else if (params.access_token) {
						const accessToken = params.access_token as string;
						for (const scope of scopes!) {
							this._currentScopes.add(scope);
						}
						this._accessToken = new AccessToken({
							access_token: accessToken,
							scope: this.currentScopes,
							refresh_token: ''
						});
						resolve(this._accessToken);
					}

					callback({ cancel: true });
				}
			);

			// do this last so there is no race condition
			authWindow.loadURL(authUrl);
		});
	}

	setAccessToken(token: AccessToken) {
		this._accessToken = token;
	}
}
