import type { AccessToken } from './AccessToken';

export class TokenFetcher<T extends AccessToken = AccessToken> {
	private readonly _executor: (scopes: string[]) => Promise<T>;
	private _newTokenScopes = new Set<string>();
	private _newTokenPromise: Promise<T> | null = null;
	private _queuedScopes = new Set<string>();
	private _queueExecutor: (() => void) | null = null;
	private _queuePromise: Promise<T> | null = null;

	constructor(executor: (scopes: string[]) => Promise<T>) {
		this._executor = executor;
	}

	async fetch(scopes?: string[]): Promise<T> {
		if (this._newTokenPromise) {
			if (!scopes || scopes.every(scope => this._newTokenScopes.has(scope))) {
				return await this._newTokenPromise;
			}

			if (this._queueExecutor) {
				for (const scope of scopes) {
					this._queuedScopes.add(scope);
				}
			} else {
				this._queuedScopes = new Set<string>(scopes);
			}

			this._queuePromise ??= new Promise<T>((resolve, reject) => {
				this._queueExecutor = async () => {
					if (!this._queuePromise) {
						return;
					}
					this._newTokenScopes = this._queuedScopes;
					this._queuedScopes = new Set<string>();
					this._newTokenPromise = this._queuePromise;
					this._queuePromise = null;
					this._queueExecutor = null;
					try {
						resolve(await this._executor(Array.from(this._newTokenScopes)));
					} catch (e) {
						reject(e);
					} finally {
						this._newTokenPromise = null;
						this._newTokenScopes = new Set<string>();
						(this._queueExecutor as (() => void) | null)?.();
					}
				};
			});

			return await this._queuePromise;
		}

		this._newTokenScopes = new Set<string>(scopes ?? []);
		this._newTokenPromise = new Promise<T>(async (resolve, reject) => {
			try {
				const scopesToFetch = Array.from(this._newTokenScopes);
				resolve(await this._executor(scopesToFetch));
			} catch (e) {
				reject(e);
			} finally {
				this._newTokenPromise = null;
				this._newTokenScopes = new Set<string>();
				this._queueExecutor?.();
			}
		});

		return await this._newTokenPromise;
	}
}
