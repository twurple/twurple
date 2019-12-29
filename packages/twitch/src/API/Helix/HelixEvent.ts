/** @private */
export interface HelixEventData<T extends object, EventType extends string = string> {
	id: string;
	event_type: EventType;
	event_timestamp: string;
	version: string;
	event_data: T;
}
