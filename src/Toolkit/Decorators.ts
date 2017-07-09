// tslint:disable-next-line:no-any
export type Constructor<T = {}> = new (...args: any[]) => T;

// tslint:disable-next-line:no-any
export type CacheEntry<T = any> = {
	value: T;
	expires: number;
};

export function Cacheable<TBase extends Constructor>(cls: TBase) {
	return class extends cls {
		public cache: Map<string, CacheEntry> = new Map;

		public getFromCache(cacheKey: string): {} | undefined {
			this._cleanCache();
			if (this.cache.has(cacheKey)) {
				const entry = this.cache.get(cacheKey);

				if (entry) {
					return entry.value;
				}
			}

			return undefined;
		}

		public setCache(cacheKey: string, value: {}, timeInSeconds: number): void {
			this.cache.set(cacheKey, {
				value, expires: Date.now() + (timeInSeconds * 1000)
			});
		}

		public removeFromCache(cacheKey: string) {
			this.cache.delete(cacheKey);
		}

		public _cleanCache() {
			const now = Date.now();
			this.cache.forEach((val, key) => {
				if (val.expires < now) {
					this.cache.delete(key);
				}
			});
		}
	};
}

export function Cached(timeInSeconds: number = Infinity) {
	// tslint:disable-next-line:no-any
	return function (target: any, propName: string, descriptor: PropertyDescriptor) {
		const origFn = descriptor.value;

		// tslint:disable-next-line:no-any
		descriptor.value = async function(this: any, ...params: string[]) {
			const cacheKey = [propName, ...params].join('/');
			const cachedValue = this.getFromCache(cacheKey);

			if (cachedValue) {
				return cachedValue;
			}

			const result = await origFn.apply(this, params);
			this.setCache(cacheKey, result, timeInSeconds);
			return result;
		};

		return descriptor;
	};
}

export function CachedGetter(timeInSeconds: number = Infinity) {
	// tslint:disable-next-line:no-any
	return function (target: any, propName: string, descriptor: PropertyDescriptor) {
		if (descriptor.get) {
			const origFn = descriptor.get;

			// tslint:disable-next-line:no-any
			descriptor.get = function(this: any, ...params: string[]) {
				const cacheKey = [propName, ...params].join('/');
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

// tslint:disable-next-line:no-any
export function NonEnumerable(target: any, key: string) {
	// first property defined in prototype, that's why we use getters/setters
	// (otherwise assignment in object will override property in prototype)
	Object.defineProperty(target, key, {
		get: function() {
			return undefined;
		},
		// tslint:disable-next-line:no-any
		set: function(this: any, val: any) {
			// here we have reference to instance and can set property directly to it
			Object.defineProperty(this, key, {
				value: val,
				writable: true,
				enumerable: false,
			});
		},

		enumerable: false,
	});
}
