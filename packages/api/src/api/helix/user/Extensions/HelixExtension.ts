import { DataObject, rawDataSymbol } from '@twurple/common';

/** @private */
export interface HelixExtensionData {
	id: string;
	version: string;
	name: string;
}

/** @protected */
export abstract class HelixExtension extends DataObject<HelixExtensionData> {
	/**
	 * The ID of the extension.
	 */
	get id(): string {
		return this[rawDataSymbol].id;
	}

	/**
	 * The version of the extension.
	 */
	get version(): string {
		return this[rawDataSymbol].version;
	}

	/**
	 * The name of the extension.
	 */
	get name(): string {
		return this[rawDataSymbol].name;
	}
}
