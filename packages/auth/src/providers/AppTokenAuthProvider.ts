import { Enumerable } from '@d-fischer/shared-utils';
import { extractUserId, rtfm, type UserIdResolvable } from '@twurple/common';
import { type AccessToken, accessTokenIsExpired, type AccessTokenWithUserId } from '../AccessToken';
import { getAppToken } from '../helpers';
import { TokenFetcher } from '../TokenFetcher';
import { type AuthProvider } from './AuthProvider';

/**
 * An auth provider that gets tokens using client credentials.
 */
@rtfm<AppTokenAuthProvider>('auth', 'AppTokenAuthProvider', 'clientId')
export class AppTokenAuthProvider implements AuthProvider {
	private readonly _clientId: string;
	/** @internal */ @Enumerable(false) private readonly _clientSecret: string;
	/** @internal */ @Enumerable(false) private _token?: AccessToken;
	/** @internal */ @Enumerable(false) private readonly _fetcher: TokenFetcher;
	private readonly _impliedScopes: string[];

	/**
	 * Creates a new auth provider to receive an application token with using the client ID and secret.
	 *
	 * @param clientId The client ID of your application.
	 * @param clientSecret The client secret of your application.
	 * @param impliedScopes The scopes that are implied for your application,
	 * for example an extension that is allowed to access subscriptions.
	 */
	constructor(clientId: string, clientSecret: string, impliedScopes: string[] = []) {
		this._clientId = clientId;
		this._clientSecret = clientSecret;
		this._impliedScopes = impliedScopes;
		this._fetcher = new TokenFetcher(async scopes => await this._fetch(scopes));
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
		return this._impliedScopes;
	}

	/**
	 * Can only get tokens for implied scopes (i.e. extension subscription support).
	 *
	 * The consumer is expected to take care that this is actually set up in the Twitch developer console.
	 *
	 * @param user The user to get an access token for.
	 * @param scopeSets The requested scopes.
	 */
	async getAccessTokenForUser(
		user: UserIdResolvable,
		...scopeSets: Array<string[] | undefined>
	): Promise<AccessTokenWithUserId> {
		if (scopeSets.every(scopeSet => scopeSet?.some(scope => this._impliedScopes.includes(scope)) ?? true)) {
			const appToken = await this.getAppAccessToken();
			return {
				...appToken,
				userId: extractUserId(user),
			};
		}
		throw new Error('Can not get user access token for AppTokenAuthProvider');
	}

	/**
	 * Throws, because this auth provider does not support user authentication.
	 */
	getCurrentScopesForUser(): string[] {
		return this._impliedScopes;
	}

	/**
	 * Fetches an app access token.
	 */
	async getAnyAccessToken(): Promise<AccessToken> {
		return await this._fetcher.fetch();
	}

	/**
	 * Fetches an app access token.
	 *
	 * @param forceNew Whether to always get a new token, even if the old one is still deemed valid internally.
	 */
	async getAppAccessToken(forceNew = false): Promise<AccessToken> {
		if (forceNew) {
			this._token = undefined;
		}
		return await this._fetcher.fetch();
	}

	private async _fetch(scopeSets: string[][]): Promise<AccessToken> {
		if (scopeSets.length > 0) {
			for (const scopes of scopeSets) {
				if (this._impliedScopes.length) {
					if (scopes.every(scope => !this._impliedScopes.includes(scope))) {
						throw new Error(
							`One of the scopes ${scopes.join(
								', ',
							)} requested but only the scope ${this._impliedScopes.join(', ')} is implied`,
						);
					}
				} else {
					throw new Error(
						`One of the scopes ${scopes.join(
							', ',
						)} requested but the client credentials flow does not support scopes`,
					);
				}
			}
		}

		if (!this._token || accessTokenIsExpired(this._token)) {
			return (this._token = await getAppToken(this._clientId, this._clientSecret));
		}

		return this._token;
	}
}
