import AuthProvider from './AuthProvider';
import AccessToken from '../API/AccessToken';
import { NonEnumerable } from '../Toolkit/Decorators';
import Twitch from '../index';

export interface RefreshConfig {
	clientSecret: string;
	refreshToken: string;
	expiry?: Date | null;
	onRefresh?: (token: AccessToken) => void;
}

export default class RefreshableAuthProvider implements AuthProvider {
	@NonEnumerable private readonly _clientSecret: string;
	@NonEnumerable private _refreshToken: string;
	private _expiry?: Date | null;
	private readonly _onRefresh?: (token: AccessToken) => void;

	constructor(private readonly _childProvider: AuthProvider, refreshConfig: RefreshConfig) {
		this._clientSecret = refreshConfig.clientSecret;
		this._refreshToken = refreshConfig.refreshToken;
		this._expiry = refreshConfig.expiry;
		this._onRefresh = refreshConfig.onRefresh;
	}

	async getAccessToken(scopes?: string|string[]) {
		if (typeof scopes === 'string') {
			scopes = [scopes];
		}
		const oldToken = await this._childProvider.getAccessToken();
		if (scopes && scopes.some(scope => !this.currentScopes.includes(scope))) {
			// requesting a new scope should be delegated down...
			const newToken = await this._childProvider.getAccessToken(scopes);
			// ...but if the token doesn't change, carry on
			if (newToken !== oldToken) {
				return newToken;
			}
		}

		const now = new Date();

		if (!this._expiry || this._expiry > now) {
			return oldToken;
		}

		const tokenData = await this.refresh();
		return tokenData.accessToken;
	}

	async refresh() {
		const tokenData = await Twitch.refreshAccessToken(this.clientId, this._clientSecret, this._refreshToken);
		this.setAccessToken(tokenData.accessToken);
		this._refreshToken = tokenData.refreshToken;
		this._expiry = tokenData.expiresAt;

		if (this._onRefresh) {
			this._onRefresh(tokenData);
		}

		return tokenData;
	}

	setAccessToken(token: string) {
		this._childProvider.setAccessToken(token);
	}

	get clientId() {
		return this._childProvider.clientId;
	}

	get currentScopes() {
		return this._childProvider.currentScopes;
	}
}
