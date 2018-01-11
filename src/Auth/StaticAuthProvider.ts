import AuthProvider from './AuthProvider';
import { NonEnumerable } from '../Toolkit/Decorators';

export default class StaticAuthProvider implements AuthProvider {
	@NonEnumerable private _clientId: string;
	@NonEnumerable private _accessToken: string;
	private _currentScopes: Set<string> = new Set();

	constructor(clientId?: string, accessToken?: string) {
		this._clientId = clientId || '';
		this._accessToken = accessToken || '';
	}

	async getAccessToken(scopes: string[]) {
		// we only get a static token, so we just hope it works...
		this._currentScopes = new Set([...Array.from(this._currentScopes), ...scopes]);

		return this._accessToken;
	}

	get clientId() {
		return this._clientId;
	}

	get currentScopes() {
		return Array.from(this._currentScopes);
	}
}
