import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { type EventSubUserWhisperMessageEventData } from '../events/EventSubUserWhisperMessageEvent.external.js';
import { EventSubUserWhisperMessageEvent } from '../events/EventSubUserWhisperMessageEvent.js';
import type { EventSubBase } from '../EventSubBase.js';
import { EventSubSubscription } from './EventSubSubscription.js';

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
		return this._client._config.managed
			? new EventSubUserWhisperMessageEvent(data, this._client._config.apiClient)
			: new EventSubUserWhisperMessageEvent(data);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription | undefined> {
		return this._client._config.managed
			? await this._client._config.apiClient.eventSub.subscribeToUserWhisperMessageEvents(
					this._userId,
					await this._getTransportOptions(),
			  )
			: undefined;
	}
}
