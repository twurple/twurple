import type { MakeOptional } from '@d-fischer/shared-utils';
import { Enumerable } from '@d-fischer/shared-utils';
import { rtfm } from '@twurple/common';
import type { AccessToken } from '../AccessToken';
import { accessTokenIsExpired } from '../AccessToken';
import { InvalidTokenError } from '../Errors/InvalidTokenError';
import { compareScopes, loadAndCompareScopes, refreshUserToken } from '../helpers';
import type { AuthProvider, AuthProviderTokenType } from './AuthProvider';

/**
 * Configuration for the {@RefreshableAuthProvider}.
 */
export interface RefreshConfig {
	/**
	 * The client ID of your application.
	 */
	clientId: string;

	/**
	 * The client secret of your application.
	 */
	clientSecret: string;

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
@rtfm<RefreshingAuthProvider>('auth', 'RefreshableAuthProvider', 'clientId')
export class RefreshingAuthProvider implements AuthProvider {
	private readonly _clientId: string;
	@Enumerable(false) private readonly _clientSecret: string;
	@Enumerable(false) private _accessToken: MakeOptional<AccessToken, 'accessToken' | 'scope'>;

	private readonly _onRefresh?: (token: AccessToken) => void;

	/**
	 * The type of tokens the provider generates.
	 *
	 * This auth provider generates user tokens.
	 */
	readonly tokenType: AuthProviderTokenType = 'user';

	/**
	 * Creates a new auth provider based on the given one that can automatically
	 * refresh access tokens.
	 *
	 * @param refreshConfig The information necessary to automatically refresh an access token.
	 * @param initialToken The initial access token.
	 */
	constructor(refreshConfig: RefreshConfig, initialToken: MakeOptional<AccessToken, 'accessToken' | 'scope'>) {
		this._clientId = refreshConfig.clientId;
		this._clientSecret = refreshConfig.clientSecret;
		this._onRefresh = refreshConfig.onRefresh;
		this._accessToken = initialToken;
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
	async getAccessToken(scopes?: string[]): Promise<AccessToken | null> {
		// if we don't have a current token, we just pass this and refresh right away
		if (this._accessToken.accessToken && !accessTokenIsExpired(this._accessToken)) {
			try {
				// don't create new object on every get
				if (this._accessToken.scope) {
					compareScopes(this._accessToken.scope, scopes);
				} else {
					this._accessToken = {
						...this._accessToken,
						scope: await loadAndCompareScopes(
							this._clientId,
							this._accessToken.accessToken,
							this._accessToken.scope,
							scopes
						)
					};
				}
				return this._accessToken as AccessToken;
			} catch (e) {
				// if loading scopes failed, ignore InvalidTokenError and proceed with refreshing
				if (!(e instanceof InvalidTokenError)) {
					throw e;
				}
			}
		}

		const refreshedToken = await this.refresh();
		compareScopes(refreshedToken.scope, scopes);
		return refreshedToken;
	}

	/**
	 * Force a refresh of the access token.
	 */
	async refresh(): Promise<AccessToken> {
		const tokenData = await refreshUserToken(this.clientId, this._clientSecret, this._accessToken.refreshToken!);
		this._accessToken = tokenData;

		this._onRefresh?.(tokenData);

		return tokenData;
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
		return this._accessToken.scope ?? [];
	}
}
