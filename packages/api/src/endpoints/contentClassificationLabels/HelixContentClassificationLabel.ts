import { DataObject, rawDataSymbol } from '@twurple/common';
import { type HelixContentClassificationLabelData } from '../../interfaces/endpoints/contentClassificationLabels.external.js';

/**
 * A content classification label that can be applied to a Twitch stream.
 */
export class HelixContentClassificationLabel extends DataObject<HelixContentClassificationLabelData> {
	/**
	 * The ID of the content classification label.
	 */
	get id(): string {
		return this[rawDataSymbol].id;
	}

	/**
	 * The name of the content classification label.
	 */
	get name(): string {
		return this[rawDataSymbol].name;
	}

	/**
	 * The description of the content classification label.
	 */
	get description(): string {
		return this[rawDataSymbol].description;
	}
}
