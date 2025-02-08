import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import { type EventSubAutoModMessageFoundBlockedTermData } from './EventSubAutoModMessageBlockedTerm.external';

/**
 * An object representing an AutoMod blocked term that caused the message to be caught.
 */
@rtfm('eventsub-base', 'EventSubAutoModMessageBlockedTerm')
export class EventSubAutoModMessageBlockedTerm extends DataObject<EventSubAutoModMessageFoundBlockedTermData> {
	/** @internal */
	constructor(data: EventSubAutoModMessageFoundBlockedTermData, private readonly _messageText: string) {
		super(data);
	}

	/**
	 * The ID of the blocked term.
	 */
	get id(): string {
		return this[rawDataSymbol].term_id;
	}
	/**
	 * The start index (inclusive) of the blocked term in the message.
	 */
	get start(): number {
		return this[rawDataSymbol].boundary.start_pos;
	}

	/**
	 * The end index (inclusive) of the blocked term in the message.
	 */
	get end(): number {
		return this[rawDataSymbol].boundary.end_pos;
	}

	/**
	 * The text of the blocked term.
	 */
	get text(): string {
		return this._messageText.substring(this.start, this.end + 1);
	}

	/**
	 * The ID of the broadcaster that owns the blocked term.
	 */
	get ownerBroadcasterId(): string {
		return this[rawDataSymbol].owner_broadcaster_user_id;
	}

	/**
	 * The name of the broadcaster that owns the blocked term.
	 */
	get ownerBroadcasterName(): string {
		return this[rawDataSymbol].owner_broadcaster_user_login;
	}

	/**
	 * The display name of the broadcaster that owns the blocked term.
	 */
	get ownerBroadcasterDisplayName(): string {
		return this[rawDataSymbol].owner_broadcaster_user_name;
	}
}
