import { Enumerable } from '@d-fischer/shared-utils';
import { rtfm } from '@twurple/common';
import type { AccessToken } from '../AccessToken';
import { accessTokenIsExpired } from '../AccessToken';
import { getAppToken } from '../helpers';
import type { AuthProviderTokenType } from './AuthProvider';
import { BaseAuthProvider } from './BaseAuthProvider';

/**
 * An auth provider that retrieve tokens using client credentials.
 */
@rtfm<ClientCredentialsAuthProvider>('auth', 'ClientCredentialsAuthProvider', 'clientId')
export class ClientCredentialsAuthProvider extends BaseAuthProvider {
	private readonly _clientId: string;
	@Enumerable(false) private readonly _clientSecret: string;
	@Enumerable(false) private _token?: AccessToken;
	private readonly _impliedScopes: string[];

	/**
	 * The type of tokens the provider generates.
	 *
	 * This auth provider generates app tokens.
	 */
	readonly tokenType: AuthProviderTokenType = 'app';

	/**
	 * Creates a new auth provider to receive an application token with using the client ID and secret.
	 *
	 * @param clientId The client ID of your application.
	 * @param clientSecret The client secret of your application.
	 * @param impliedScopes The scopes that are implied for your application,
	 * for example an extension that is allowed to access subscriptions.
	 */
	constructor(clientId: string, clientSecret: string, impliedScopes: string[] = []) {
		super();
		this._clientId = clientId;
		this._clientSecret = clientSecret;
		this._impliedScopes = impliedScopes;
	}

	/**
	 * Retrieves a new app access token.
	 */
	async refresh(): Promise<AccessToken> {
		return (this._token = await getAppToken(this._clientId, this._clientSecret));
	}

	/**
	 * The client ID.
	 */
	get clientId(): string {
		return this._clientId;
	}

	/**
	 * The scopes that are currently available using the access token.
	 */
	get currentScopes(): string[] {
		return [];
	}

	/**
	 * Retrieves an access token.
	 *
	 * If any scopes are provided, this throws. The client credentials flow does not support scopes.
	 *
	 * @param scopes The requested scopes.
	 */
	protected async _doGetAccessToken(scopes?: string[]): Promise<AccessToken> {
		if (scopes && scopes.length > 0) {
			if (this._impliedScopes.length) {
				if (scopes.some(scope => !this._impliedScopes.includes(scope))) {
					throw new Error(
						`Scope ${scopes.join(', ')} requested but only the scope ${this._impliedScopes.join(
							', '
						)} is implied`
					);
				}
			} else {
				throw new Error(
					`Scope ${scopes.join(', ')} requested but the client credentials flow does not support scopes`
				);
			}
		}

		if (!this._token || accessTokenIsExpired(this._token)) {
			return await this.refresh();
		}

		return this._token;
	}
}
