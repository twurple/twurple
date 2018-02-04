import AuthProvider from './AuthProvider';
import { NonEnumerable } from '../Toolkit/Decorators';

export default class StaticAuthProvider implements AuthProvider {
	@NonEnumerable private readonly _clientId: string;
	@NonEnumerable private _accessToken: string;
	private _currentScopes: Set<string> = new Set();

	constructor(clientId: string, accessToken?: string) {
		this._clientId = clientId || '';
		this._accessToken = accessToken || '';
	}

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

	get clientId() {
		return this._clientId;
	}

	get currentScopes() {
		return Array.from(this._currentScopes);
	}
}
