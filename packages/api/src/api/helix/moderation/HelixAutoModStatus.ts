import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';

/** @private */
export interface HelixAutoModStatusData {
	msg_id: string;
	is_permitted: boolean;
}

/**
 * The status of a message that says whether it is permitted by AutoMod or not.
 */
@rtfm<HelixAutoModStatus>('api', 'HelixAutoModStatus', 'messageId')
export class HelixAutoModStatus extends DataObject<HelixAutoModStatusData> {
	/**
	 * The developer-generated ID that was sent with the request data.
	 */
	get messageId(): string {
		return this[rawDataSymbol].msg_id;
	}

	/**
	 * Whether the message is permitted by AutoMod or not.
	 */
	get isPermitted(): boolean {
		return this[rawDataSymbol].is_permitted;
	}
}
