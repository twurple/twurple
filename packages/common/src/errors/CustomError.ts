/// <reference lib="es2021.promise"/>
/// <reference lib="es2022.error"/>

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
