import AuthProvider from './AuthProvider';
import AccessToken from '../API/AccessToken';
import { NonEnumerable } from '../Toolkit/Decorators';
import TwitchClient from '../TwitchClient';

/**
 * Configuration for the {@RefreshableAuthProvider}.
 */
export interface RefreshConfig {
	/**
	 * The client secret of your application.
	 */
	clientSecret: string;

	/**
	 * The refresh token you got when requesting an access token from Twitch.
	 */
	refreshToken: string;

	/**
	 * The date of expiry of your access token.
	 */
	expiry?: Date | null;

	/**
	 * A callback that is called whenever the auth provider refreshes the token, e.g. to save the new data in your database.
	 *
	 * @param token The token data.
	 */
	onRefresh?: (token: AccessToken) => void;
}

/**
 * Enhances another auth provider with the ability to make use of refresh
 * tokens, automatically refreshing the access token whenever necessary.
 */
export default class RefreshableAuthProvider implements AuthProvider {
	@NonEnumerable private readonly _clientSecret: string;
	@NonEnumerable private _refreshToken: string;
	private readonly _childProvider: AuthProvider;
	private _expiry?: Date | null;
	private readonly _onRefresh?: (token: AccessToken) => void;

	/**
	 * Creates a new auth provider based on the given one that can automatically
	 * refresh access tokens.
	 * @param childProvider The base auth provider.
	 * @param refreshConfig The information necessary to automatically refresh an access token.
	 */
	constructor(childProvider: AuthProvider, refreshConfig: RefreshConfig) {
		this._clientSecret = refreshConfig.clientSecret;
		this._refreshToken = refreshConfig.refreshToken;
		this._childProvider = childProvider;
		this._expiry = refreshConfig.expiry;
		this._onRefresh = refreshConfig.onRefresh;
	}

	/**
	 * Retrieves an access token.
	 *
	 * If the current access token does not have the requested scopes, the base auth
	 * provider is called.
	 *
	 * If the current access token is expired, automatically renew it.
	 *
	 * @param scopes The requested scopes.
	 */
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

	/**
	 * Force a refresh of the access token.
	 */
	async refresh() {
		const tokenData = await TwitchClient.refreshAccessToken(this.clientId, this._clientSecret, this._refreshToken);
		this.setAccessToken(tokenData.accessToken);
		this._refreshToken = tokenData.refreshToken;
		this._expiry = tokenData.expiryDate;

		if (this._onRefresh) {
			this._onRefresh(tokenData);
		}

		return tokenData;
	}

	/** @private */
	setAccessToken(token: string) {
		this._childProvider.setAccessToken(token);
	}

	/**
	 * The client ID.
	 */
	get clientId() {
		return this._childProvider.clientId;
	}

	/**
	 * The scopes that are currently available using the access token.
	 */
	get currentScopes() {
		return this._childProvider.currentScopes;
	}
}
