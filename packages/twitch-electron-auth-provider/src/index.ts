import { AccessToken, AuthProvider } from 'twitch';
import { BrowserWindow } from 'electron';
import * as qs from 'qs';

export interface TwitchClientCredentials {
	clientId: string;
	redirectURI: string;
}

export default class ElectronAuthProvider implements AuthProvider {
	private _accessToken?: AccessToken;
	private readonly _currentScopes: Set<string> = new Set();

	constructor(private readonly _clientCredentials: TwitchClientCredentials) {
	}

	get clientId() {
		return this._clientCredentials.clientId;
	}

	get currentScopes() {
		return Array.from(this._currentScopes);
	}

	async getAccessToken(scopes?: string | string[]) {
		return new Promise<AccessToken>((resolve, reject) => {
			if (this._accessToken || !scopes) {
				resolve(this._accessToken);
				return;
			}
			if (typeof scopes === 'string') {
				scopes = [scopes];
			}
			if (scopes.every(scope => this._currentScopes.has(scope))) {
				resolve(this._accessToken);
				return;
			}

			const redir = encodeURIComponent(this._clientCredentials.redirectURI);
			const authUrl = `https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=${this.clientId}&redirect_uri=${redir}&scope=${scopes.join(' ')}`;
			let done = false;

			const authWindow = new BrowserWindow({
				width: 800,
				height: 600,
				show: false,
				modal: true,
				webPreferences: {
					nodeIntegration: false
				}
			});
			authWindow.loadURL(authUrl);
			authWindow.show();

			authWindow.on('closed', () => {
				if (!done) {
					reject(new Error('window was closed'));
				}
			});

			authWindow.webContents.session.webRequest.onBeforeRequest({ urls: [this._clientCredentials.redirectURI] }, (details, callback) => {
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
					authWindow.destroy();
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
						scope: this.currentScopes.join(' '),
						refresh_token: ''
					});
					resolve(this._accessToken);
				}
				callback({ cancel: true });
			});
		});
	}

	setAccessToken(token: AccessToken) {
		this._accessToken = token;
	}
}
