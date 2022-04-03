/** @private */
export class CustomError extends Error {
	constructor(message: string, options?: ErrorOptions) {
		super(message, options);

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
		Error.captureStackTrace?.(this, new.target.constructor);
	}

	get name(): string {
		return this.constructor.name;
	}
}
