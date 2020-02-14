import { NonEnumerable } from '@d-fischer/shared-utils';
import AccessToken from '../API/AccessToken';
import TwitchClient from '../TwitchClient';
import AuthProvider from './AuthProvider';

/**
 * An auth provider that retrieve tokens using client credentials.
 */
export default class ClientCredentialsAuthProvider implements AuthProvider {
	@NonEnumerable private readonly _clientId: string;
	@NonEnumerable private readonly _clientSecret: string;
	@NonEnumerable private _token?: AccessToken;

	/**
	 * Creates a new auth provider to receive an application token with using the client ID and secret.
	 *
	 * You don't usually have to create this manually. You should use `TwitchClient.withClientCredentials` instead.
	 *
	 * @param clientId The client ID of your application.
	 * @param clientSecret The client secret of your application.
	 *
	 * You need to obtain one using one of the [Twitch OAuth flows](https://dev.twitch.tv/docs/authentication/getting-tokens-oauth/).
	 */
	constructor(clientId: string, clientSecret: string) {
		this._clientId = clientId;
		this._clientSecret = clientSecret;
	}

	/**
	 * Retrieves an access token.
	 *
	 * If any scopes are provided, this throws. The client credentials flow does not support scopes.
	 *
	 * @param scopes The requested scopes.
	 */
	async getAccessToken(scopes?: string | string[]) {
		if (scopes && scopes.length > 0) {
			throw new Error('The client credentials flow does not support scopes');
		}

		if (!this._token || this._token.isExpired) {
			return this.refresh();
		}

		return this._token;
	}

	/**
	 * Retrieves a new app access token.
	 */
	async refresh() {
		return (this._token = await TwitchClient.getAppAccessToken(this._clientId, this._clientSecret));
	}

	/** @private */
	setAccessToken(token: AccessToken) {
		this._token = token;
	}

	/**
	 * The client ID.
	 */
	get clientId() {
		return this._clientId;
	}

	/**
	 * The scopes that are currently available using the access token.
	 */
	get currentScopes() {
		return [];
	}
}
