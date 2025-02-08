import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import { type EventSubAutoModMessageAutoModData } from './EventSubAutoModMessageAutoMod.external';
import { type EventSubAutoModLevel } from './EventSubAutoModLevel';
import { EventSubAutoModMessageAutoModBoundary } from './EventSubAutoModMessageAutoModBoundary';

/**
 * An object representing an AutoMod violation data if the massage caught by AutoMod.
 */
@rtfm('eventsub-base', 'EventSubAutoModMessageAutoMod')
export class EventSubAutoModMessageAutoMod extends DataObject<EventSubAutoModMessageAutoModData> {
	/** @internal */
	constructor(data: EventSubAutoModMessageAutoModData, private readonly _messageText: string) {
		super(data);
	}

	/**
	 * The category of the caught message.
	 */
	get category(): string {
		return this[rawDataSymbol].category;
	}

	/**
	 * The level of severity.
	 */
	get level(): EventSubAutoModLevel {
		return this[rawDataSymbol].level;
	}

	/**
	 * The bounds of the text that caused the message to be caught.
	 */
	get boundaries(): EventSubAutoModMessageAutoModBoundary[] {
		return this[rawDataSymbol].boundaries.map(
			boundary => new EventSubAutoModMessageAutoModBoundary(boundary, this._messageText),
		);
	}
}
