import { rtfm } from '@twurple/common';
import type { HelixEventSubSubscription } from '@twurple/api';
import type { EventSubBase } from '../EventSubBase';
import { EventSubSubscription } from './EventSubSubscription';
import { EventSubUserWhisperMessageEvent } from '../events/EventSubUserWhisperMessageEvent';
import { type EventSubUserWhisperMessageEventData } from '../events/EventSubUserWhisperMessageEvent.external';

/** @internal */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubUserWhisperMessageSubscription extends EventSubSubscription<EventSubUserWhisperMessageEvent> {
	/** @protected */ readonly _cliName = '';

	constructor(
		handler: (data: EventSubUserWhisperMessageEvent) => void,
		client: EventSubBase,
		private readonly _userId: string,
	) {
		super(handler, client);
	}

	get id(): string {
		return `user.whisper.message.${this._userId}`;
	}

	get authUserId(): string | null {
		return this._userId;
	}

	protected transformData(data: EventSubUserWhisperMessageEventData): EventSubUserWhisperMessageEvent {
		return new EventSubUserWhisperMessageEvent(data, this._client._apiClient);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription> {
		return await this._client._apiClient.eventSub.subscribeToUserWhisperMessageEvents(
			this._userId,
			await this._getTransportOptions(),
		);
	}
}
