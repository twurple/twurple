import { Enumerable } from '@d-fischer/shared-utils';

/** @private */
export interface HelixExtensionData {
	id: string;
	version: string;
	name: string;
}

/** @protected */
export abstract class HelixExtension {
	/** @private */
	@Enumerable(false) protected readonly _data: HelixExtensionData;

	/** @private */
	constructor(data: HelixExtensionData) {
		this._data = data;
	}

	/**
	 * The ID of the extension.
	 */
	get id(): string {
		return this._data.id;
	}

	/**
	 * The version of the extension.
	 */
	get version(): string {
		return this._data.version;
	}

	/**
	 * The name of the extension.
	 */
	get name(): string {
		return this._data.name;
	}
}
