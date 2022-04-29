declare global {
	// in case this interface is not available to consumers (TS <4.6), declaring it empty should be enough to prevent TS errors
	// eslint-disable-next-line @typescript-eslint/no-empty-interface
	interface ErrorOptions {}
}

/** @private */
export class CustomError extends Error {
	constructor(message: string, options?: ErrorOptions) {
		super(message, options);

		// restore prototype chain
		Object.setPrototypeOf(this, new.target.prototype);

		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		Error.captureStackTrace?.(this, new.target.constructor);
	}

	get name(): string {
		return this.constructor.name;
	}
}
