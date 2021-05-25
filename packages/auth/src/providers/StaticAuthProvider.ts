import { Enumerable } from '@d-fischer/shared-utils';
import { rtfm } from '@twurple/common';
import type { AccessToken } from '../AccessToken';
import { loadAndCompareScopes } from '../helpers';
import type { AuthProvider, AuthProviderTokenType } from './AuthProvider';

/**
 * An auth provider that always returns the same initially given credentials.
 *
 * You are advised to roll your own auth provider that can handle scope upgrades,
 * or to plan ahead and supply only access tokens that account for all scopes
 * you will ever need.
 */
@rtfm<StaticAuthProvider>('auth', 'StaticAuthProvider', 'clientId')
export class StaticAuthProvider implements AuthProvider {
	@Enumerable(false) private readonly _clientId: string;
	@Enumerable(false) private readonly _accessToken: AccessToken;
	private _scopes?: string[];

	/**
	 * The type of token the provider holds.
	 */
	readonly tokenType: AuthProviderTokenType;

	/**
	 * Creates a new auth provider with static credentials.
	 *
	 * @param clientId The client ID of your application.
	 * @param accessToken The access token to provide.
	 *
	 * You need to obtain one using one of the [Twitch OAuth flows](https://dev.twitch.tv/docs/authentication/getting-tokens-oauth/).
	 * @param scopes The scopes the supplied token has.
	 *
	 * If this argument is given, the scopes need to be correct, or weird things might happen. If it's not (i.e. it's `undefined`), we fetch the correct scopes for you.
	 *
	 * If you can't exactly say which scopes your token has, don't use this parameter/set it to `undefined`.
	 * @param tokenType The type of the supplied token.
	 *
	 * This has to match with the actual type of the token. If it doesn't match, the behavior is undefined.
	 *
	 * The Client Credentials flow only produces app tokens, while the other flows produce user tokens.
	 */
	constructor(
		clientId: string,
		accessToken: string | AccessToken,
		scopes?: string[],
		tokenType: AuthProviderTokenType = 'user'
	) {
		this._clientId = clientId || '';
		this.tokenType = tokenType;
		this._accessToken =
			typeof accessToken === 'string'
				? {
						accessToken,
						refreshToken: null,
						scope: scopes ?? [],
						expiresIn: null,
						obtainmentTimestamp: Date.now()
				  }
				: accessToken;
		this._scopes = scopes;
	}

	/**
	 * Retrieves an access token.
	 *
	 * If the current access token does not have the requested scopes, this method throws.
	 * This makes supplying an access token with the correct scopes from the beginning necessary.
	 *
	 * @param requestedScopes The requested scopes.
	 */
	async getAccessToken(requestedScopes?: string[]): Promise<AccessToken | null> {
		this._scopes = await loadAndCompareScopes(
			this._clientId,
			this._accessToken.accessToken,
			this._scopes,
			requestedScopes
		);

		return this._accessToken;
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
		return this._scopes ?? [];
	}
}
