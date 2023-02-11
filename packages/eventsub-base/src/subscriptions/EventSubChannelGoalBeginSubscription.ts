import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { EventSubChannelGoalBeginEvent } from '../events/EventSubChannelGoalBeginEvent';
import { type EventSubChannelGoalBeginEventData } from '../events/EventSubChannelGoalBeginEvent.external';
import type { EventSubBase } from '../EventSubBase';
import { EventSubSubscription } from './EventSubSubscription';

/**
 * @private
 */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubChannelGoalBeginSubscription extends EventSubSubscription<EventSubChannelGoalBeginEvent> {
	/** @protected */ readonly _cliName = 'goal-begin';

	constructor(
		handler: (data: EventSubChannelGoalBeginEvent) => void,
		client: EventSubBase,
		private readonly _userId: string
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
		return new EventSubChannelGoalBeginEvent(data, this._client._apiClient);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription> {
		return await this._client._apiClient.eventSub.subscribeToChannelGoalBeginEvents(
			this._userId,
			await this._getTransportOptions()
		);
	}
}
