import { Constructor } from '../Types';

/** @private */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface CacheEntry<T = any> {
	value: T;
	expires: number;
}

// does not return async; eslint false positive
// eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/promise-function-async
function createSingleCacheKey(param: any) {
	// noinspection FallThroughInSwitchStatementJS
	switch (typeof param) {
		case 'undefined': {
			return '';
		}
		case 'object': {
			if (param === null) {
				return '';
			}
			if ('cacheKey' in param) {
				return param.cacheKey;
			}
			const objKey = JSON.stringify(param);
			if (objKey !== '{}') {
				return objKey;
			}
		}
		// fallthrough
		default: {
			return param.toString();
		}
	}
}

/** @private */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createCacheKey(propName: string, params: any[], prefix?: boolean) {
	return [propName, ...params.map(createSingleCacheKey)].join('/') + (prefix ? '/' : '');
}

/** @private */
export function Cacheable<T extends Constructor>(cls: T) {
	return class extends cls {
		cache: Map<string, CacheEntry> = new Map();

		getFromCache(cacheKey: string): {} | undefined {
			this._cleanCache();
			if (this.cache.has(cacheKey)) {
				const entry = this.cache.get(cacheKey);

				if (entry) {
					return entry.value;
				}
			}

			return undefined;
		}

		setCache(cacheKey: string, value: {}, timeInSeconds: number) {
			this.cache.set(cacheKey, {
				value,
				expires: Date.now() + timeInSeconds * 1000
			});
		}

		removeFromCache(cacheKey: string | string[], prefix?: boolean) {
			let internalCacheKey: string;
			if (typeof cacheKey === 'string') {
				internalCacheKey = cacheKey;
				if (!internalCacheKey.endsWith('/')) {
					internalCacheKey += '/';
				}
			} else {
				const propName = cacheKey.shift()!;
				internalCacheKey = createCacheKey(propName, cacheKey, prefix);
			}
			if (prefix) {
				this.cache.forEach((val, key) => {
					if (key.startsWith(internalCacheKey)) {
						this.cache.delete(key);
					}
				});
			} else {
				this.cache.delete(internalCacheKey);
			}
		}

		_cleanCache() {
			const now = Date.now();
			this.cache.forEach((val, key) => {
				if (val.expires < now) {
					this.cache.delete(key);
				}
			});
		}
	};
}

/** @private */
export function Cached(timeInSeconds: number = Infinity, cacheFailures: boolean = false) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return function(target: any, propName: string, descriptor: PropertyDescriptor) {
		const origFn = descriptor.value;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		descriptor.value = async function(this: any, ...params: any[]) {
			const cacheKey = createCacheKey(propName, params);
			const cachedValue = this.getFromCache(cacheKey);

			if (cachedValue) {
				return cachedValue;
			}

			const result = await origFn.apply(this, params);
			if (result != null || cacheFailures) {
				this.setCache(cacheKey, result, timeInSeconds);
			}
			return result;
		};

		return descriptor;
	};
}

/** @private */
export function CachedGetter(timeInSeconds: number = Infinity) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return function(target: any, propName: string, descriptor: PropertyDescriptor) {
		if (descriptor.get) {
			// eslint-disable-next-line @typescript-eslint/unbound-method
			const origFn = descriptor.get;

			// does not return async; eslint false positive
			// eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/promise-function-async,@typescript-eslint/unbound-method
			descriptor.get = function(this: any, ...params: any[]) {
				const cacheKey = createCacheKey(propName, params);
				const cachedValue = this.getFromCache(cacheKey);

				if (cachedValue) {
					return cachedValue;
				}

				const result = origFn.apply(this, params);
				this.setCache(cacheKey, result, timeInSeconds);
				return result;
			};
		}

		return descriptor;
	};
}

/** @private */
export function ClearsCache<T>(cacheName: keyof T, numberOfArguments?: number) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return function(target: any, propName: string, descriptor: PropertyDescriptor) {
		const origFn = descriptor.value;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		descriptor.value = async function(this: any, ...params: any[]) {
			const result = await origFn.apply(this, params);
			const args = numberOfArguments === undefined ? params.slice() : params.slice(0, numberOfArguments);
			this.removeFromCache([cacheName, ...args], true);
			return result;
		};

		return descriptor;
	};
}
