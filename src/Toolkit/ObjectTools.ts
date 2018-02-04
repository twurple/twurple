/** @private */
declare interface ObjectCtor extends ObjectConstructor {
	assign<T>(target: {}, ...source: Array<Partial<T>>): T;

	entries<T, Obj>(o: Obj): Array<[keyof Obj, T]>;
}

/** @private */
declare let Object: ObjectCtor;

/** @private */
export type ObjMap<Obj, T> = { [name in keyof Obj]: T };
/** @private */
export type ObjMapPart<Obj, T> = Partial<ObjMap<Obj, T>>;

/** @private */
export type UniformObject<T> = { [name: string]: T };
/** @private */
export type KeyMapper<T> = (value: T) => string;

/** @private */
export default class ObjectTools {
	static map<T, O, Obj = UniformObject<T>>(obj: Obj, fn: (value: T, key: keyof Obj) => O): ObjMap<Obj, O> {
		const mapped = Object.entries<T, Obj>(obj).map(([key, value]: [keyof Obj, T]): ObjMapPart<Obj, O> => {
			const result: ObjMapPart<Obj, O> = {};
			result[key] = fn(value, key);
			return result;
		});
		return Object.assign<ObjMap<Obj, O>>({}, ...mapped);
	}

	static fromArray<T, O, Obj>(arr: T[], fn: (value: T) => ObjMapPart<Obj, O>): ObjMap<Obj, O> {
		return Object.assign<ObjMap<Obj, O>>({}, ...arr.map(fn));
	}

	static indexBy<T>(arr: T[], key: keyof T): UniformObject<T>;
	static indexBy<T>(arr: T[], keyFn: KeyMapper<T>): UniformObject<T>;
	// tslint:disable-next-line:no-any
	static indexBy<T>(arr: T[], keyFn: any): UniformObject<T> {
		if (typeof keyFn !== 'function') {
			const key = keyFn;
			keyFn = (value: T) => value[key].toString();
		}
		return this.fromArray(arr, val => ({ [keyFn(val)]: val }));
	}

	static forEach<T, Obj>(obj: Obj, fn: (value: T, key: keyof Obj) => void): void {
		Object.entries(obj).forEach(([key, value]: [keyof Obj, T]) => fn(value, key));
	}

	static entriesToObject<T>(obj: Array<[string, T]>): UniformObject<T> {
		return this.fromArray(obj, ([key, val]) => ({ [key]: val }));
	}
}
