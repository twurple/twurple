import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import type { EventSubChannelGoalEndEventData } from '../events/EventSubChannelGoalEndEvent';
import { EventSubChannelGoalEndEvent } from '../events/EventSubChannelGoalEndEvent';
import type { EventSubBase } from '../EventSubBase';
import { EventSubSubscription } from './EventSubSubscription';

/**
 * @private
 */
@rtfm('eventsub', 'EventSubSubscription')
export class EventSubChannelGoalEndSubscription extends EventSubSubscription<EventSubChannelGoalEndEvent> {
	protected readonly _cliName = 'goal-end';

	constructor(
		handler: (data: EventSubChannelGoalEndEvent) => void,
		client: EventSubBase,
		private readonly _userId: string
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.goal.end.${this._userId}`;
	}

	protected transformData(data: EventSubChannelGoalEndEventData): EventSubChannelGoalEndEvent {
		return new EventSubChannelGoalEndEvent(data, this._client._apiClient);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription> {
		return await this._client._apiClient.eventSub.subscribeToChannelGoalEndEvents(
			this._userId,
			await this._getTransportOptions()
		);
	}
}
