// tslint:disable:only-arrow-functions

/** @private */
// tslint:disable-next-line:no-any
export type Constructor<T = {}> = new (...args: any[]) => T;

/** @private */
// tslint:disable-next-line:no-any
export interface CacheEntry<T = any> {
	value: T;
	expires: number;
}

/** @private */
export function Cacheable<T extends Constructor>(cls: T) {
	return class extends cls {
		cache: Map<string, CacheEntry> = new Map;

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

		setCache(cacheKey: string, value: {}, timeInSeconds: number): void {
			this.cache.set(cacheKey, {
				value, expires: Date.now() + (timeInSeconds * 1000)
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
// tslint:disable-next-line:no-any
export function createCacheKey(propName: string, params: any[], prefix?: boolean): string {
	// tslint:disable-next-line:no-any
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
			// tslint:disable-next-line:no-switch-case-fall-through
			default: {
				return param.toString();
			}
		}
	}

	return [propName, ...params.map(createSingleCacheKey)].join('/') + (prefix ? '/' : '');
}

/** @private */
export function Cached(timeInSeconds: number = Infinity, cacheFailures: boolean = false) {
	// tslint:disable-next-line:no-any
	return function (target: any, propName: string, descriptor: PropertyDescriptor) {
		const origFn = descriptor.value;

		// tslint:disable-next-line:no-any
		descriptor.value = async function (this: any, ...params: any[]) {
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
	// tslint:disable-next-line:no-any
	return function (target: any, propName: string, descriptor: PropertyDescriptor) {
		if (descriptor.get) {
			// tslint:disable-next-line:no-unbound-method
			const origFn = descriptor.get;

			// tslint:disable-next-line:no-any
			descriptor.get = function (this: any, ...params: any[]) {
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
	// tslint:disable-next-line:no-any
	return function (target: any, propName: string, descriptor: PropertyDescriptor) {
		const origFn = descriptor.value;

		// tslint:disable-next-line:no-any
		descriptor.value = async function (this: any, ...params: any[]) {
			const result = await origFn.apply(this, params);
			const args = numberOfArguments === undefined ? params.slice() : params.slice(0, numberOfArguments);
			this.removeFromCache([cacheName, ...args], true);
			return result;
		};

		return descriptor;
	};
}

/** @private */
// tslint:disable-next-line:no-any
export function NonEnumerable(target: any, key: string) {
	// first property defined in prototype, that's why we use getters/setters
	// (otherwise assignment in object will override property in prototype)
	Object.defineProperty(target, key, {
		get: function () {
			return;
		},
		// tslint:disable-next-line:no-any
		set: function (this: any, val: any) {
			// here we have reference to instance and can set property directly to it
			Object.defineProperty(this, key, {
				value: val,
				writable: true,
				enumerable: false
			});
		},

		enumerable: false
	});
}
