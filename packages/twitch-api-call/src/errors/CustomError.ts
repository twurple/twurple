/** @private */
export class CustomError extends Error {
	constructor(...params: [string, string?, string?]) {
		// @ts-ignore
		super(...params);

		// restore prototype chain
		const actualProto = new.target.prototype;

		if (Object.setPrototypeOf) {
			Object.setPrototypeOf(this, actualProto);
		} else {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(this as any).__proto__ = actualProto;
		}

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, new.target.constructor);
		}
	}

	get name() {
		return this.constructor.name;
	}
}
