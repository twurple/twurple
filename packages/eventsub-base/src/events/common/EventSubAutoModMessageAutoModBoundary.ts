import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import { type EventSubAutoModMessageAutoModBoundaryData } from './EventSubAutoModMessageAutoModBoundary.external';

/**
 * The bounds of the text that caused the message to be caught.
 */
@rtfm('eventsub-base', 'EventSubAutoModMessageAutoModBoundary')
export class EventSubAutoModMessageAutoModBoundary extends DataObject<EventSubAutoModMessageAutoModBoundaryData> {
	/** @internal */
	constructor(data: EventSubAutoModMessageAutoModBoundaryData, private readonly _messageText: string) {
		super(data);
	}

	/**
	 * The start index (inclusive) of the problematic text in the message.
	 */
	get start(): number {
		return this[rawDataSymbol].start_pos;
	}

	/**
	 * The end index (inclusive) of the problematic text in the message.
	 */
	get end(): number {
		return this[rawDataSymbol].end_pos;
	}

	/**
	 * The problematic text that caused message to be caught.
	 */
	get text(): string {
		return this._messageText.substring(this.start, this.end + 1);
	}
}
