import { Enumerable } from '@d-fischer/shared-utils';
import { rtfm, type UserIdResolvable } from '@twurple/common';
import type { AccessToken, AccessTokenMaybeWithUserId, AccessTokenWithUserId } from '../AccessToken';
import { loadAndCompareTokenInfo } from '../helpers';
import type { AuthProvider } from './AuthProvider';

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
	private _userId?: string;
	private _scopes?: string[];

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
	 */
	constructor(clientId: string, accessToken: string | AccessToken, scopes?: string[]) {
		this._clientId = clientId || '';
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
	 * The client ID.
	 */
	get clientId(): string {
		return this._clientId;
	}

	/**
	 * Gets the static access token.
	 *
	 * If the current access token does not have the requested scopes, this method throws.
	 * This makes supplying an access token with the correct scopes from the beginning necessary.
	 *
	 * @param user Ignored.
	 * @param scopeSets The requested scopes.
	 */
	async getAccessTokenForUser(
		user: UserIdResolvable,
		...scopeSets: Array<string[] | undefined>
	): Promise<AccessTokenWithUserId> {
		return await this._getAccessToken(scopeSets);
	}

	/**
	 * Gets the static access token.
	 *
	 * If the current access token does not have the requested scopes, this method throws.
	 * This makes supplying an access token with the correct scopes from the beginning necessary.
	 *
	 * @param intent Ignored.
	 * @param scopeSets The requested scopes.
	 */
	async getAccessTokenForIntent(
		intent: string,
		...scopeSets: Array<string[] | undefined>
	): Promise<AccessTokenWithUserId> {
		return await this._getAccessToken(scopeSets);
	}

	/**
	 * Gets the static access token.
	 */
	async getAnyAccessToken(): Promise<AccessTokenMaybeWithUserId> {
		return await this._getAccessToken();
	}

	/**
	 * The scopes that are currently available using the access token.
	 */
	getCurrentScopesForUser(): string[] {
		return this._scopes ?? [];
	}

	private async _getAccessToken(requestedScopeSets?: Array<string[] | undefined>): Promise<AccessTokenWithUserId> {
		const [scopes, userId] = await loadAndCompareTokenInfo(
			this._clientId,
			this._accessToken.accessToken,
			this._userId,
			this._scopes,
			requestedScopeSets
		);

		this._scopes = scopes;
		this._userId = userId;

		return { ...this._accessToken, userId };
	}
}
