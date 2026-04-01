import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { type EventSubChannelGoalBeginEventData } from '../events/EventSubChannelGoalBeginEvent.external.js';
import { EventSubChannelGoalBeginEvent } from '../events/EventSubChannelGoalBeginEvent.js';
import type { EventSubBase } from '../EventSubBase.js';
import { EventSubSubscription } from './EventSubSubscription.js';

/** @internal */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubChannelGoalBeginSubscription extends EventSubSubscription<EventSubChannelGoalBeginEvent> {
	/** @protected */ readonly _cliName = 'goal-begin';

	constructor(
		handler: (data: EventSubChannelGoalBeginEvent) => void,
		client: EventSubBase,
		private readonly _userId: string,
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.goal.begin.${this._userId}`;
	}

	get authUserId(): string | null {
		return this._userId;
	}

	protected transformData(data: EventSubChannelGoalBeginEventData): EventSubChannelGoalBeginEvent {
		return this._client._config.managed
			? new EventSubChannelGoalBeginEvent(data, this._client._config.apiClient)
			: new EventSubChannelGoalBeginEvent(data);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription | undefined> {
		return this._client._config.managed
			? await this._client._config.apiClient.eventSub.subscribeToChannelGoalBeginEvents(
					this._userId,
					await this._getTransportOptions(),
			  )
			: undefined;
	}
}
