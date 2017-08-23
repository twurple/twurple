import AuthProvider from './AuthProvider';
import { NonEnumerable } from '../Toolkit/Decorators';

export default class StaticAuthProvider implements AuthProvider {
	@NonEnumerable private _clientId: string;
	@NonEnumerable private _authToken: string;
	private _currentScopes: Set<string> = new Set();

	constructor(clientId?: string, authToken?: string) {
		this._clientId = clientId || '';
		this._authToken = authToken || '';
	}

	async getAuthToken(scopes: string[]) {
		// we only get a static token, so we just hope it works...
		this._currentScopes = new Set([...this._currentScopes, ...scopes]);

		return this._authToken;
	}

	get clientId() {
		return this._clientId;
	}

	get currentScopes() {
		return Array.from(this._currentScopes);
	}
}
