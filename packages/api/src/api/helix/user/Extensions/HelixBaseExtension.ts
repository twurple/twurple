import { DataObject, rawDataSymbol } from '@twurple/common';
import { type HelixBaseExtensionData } from '../../../../interfaces/helix/userExtension.external';

/** @protected */
export abstract class HelixBaseExtension extends DataObject<HelixBaseExtensionData> {
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
