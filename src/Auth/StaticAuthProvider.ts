import AuthProvider from './AuthProvider';
import { NonEnumerable } from '../Toolkit/Decorators';

/**
 * An auth provider that always returns the same initially given credentials.
 *
 * You are advised to roll your own auth provider that can handle scope upgrades,
 * or to plan ahead and supply only access tokens that account for all scopes
 * you will ever need (not recommended).
 */
export default class StaticAuthProvider implements AuthProvider {
	@NonEnumerable private readonly _clientId: string;
	@NonEnumerable private _accessToken: string;
	private _currentScopes: Set<string> = new Set();

	/**
	 * Creates a new auth provider with static credentials.
	 *
	 * @param clientId The client ID.
	 * @param accessToken The access token.
	 */
	constructor(clientId: string, accessToken?: string) {
		this._clientId = clientId || '';
		this._accessToken = accessToken || '';
	}

	/**
	 * Retrieves an access token.
	 *
	 * If the current access token does not have the requested scopes, the current
	 * token is returned anyway. This makes supplying an access token with the correct
	 * scopes from the beginning necessary.
	 *
	 * @param scopes The requested scopes.
	 */
	async getAccessToken(scopes: string|string[]) {
		if (typeof scopes === 'string') {
			scopes = [scopes];
		}

		// we only get a static token, so we just hope it works...
		this._currentScopes = new Set([...Array.from(this._currentScopes), ...scopes]);

		return this._accessToken;
	}

	/** @private */
	setAccessToken(token: string) {
		this._accessToken = token;
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
		return Array.from(this._currentScopes);
	}
}
