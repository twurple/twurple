/** @private */
export class CustomError extends Error {
	constructor(...params: [string, string?, string?]) {
		// @ts-ignore
		super(...params);

		// restore prototype chain
		const actualProto = new.target.prototype;

		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		if (Object.setPrototypeOf) {
			Object.setPrototypeOf(this, actualProto);
		} else {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-member-access
			(this as any).__proto__ = actualProto;
		}

		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, new.target.constructor);
		}
	}

	get name(): string {
		return this.constructor.name;
	}
}
