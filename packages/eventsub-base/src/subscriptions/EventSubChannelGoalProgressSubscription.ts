import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import type { EventSubChannelGoalProgressEventData } from '../events/EventSubChannelGoalProgressEvent';
import { EventSubChannelGoalProgressEvent } from '../events/EventSubChannelGoalProgressEvent';
import type { EventSubBase } from '../EventSubBase';
import { EventSubSubscription } from './EventSubSubscription';

/**
 * @private
 */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubChannelGoalProgressSubscription extends EventSubSubscription<EventSubChannelGoalProgressEvent> {
	/** @protected */ readonly _cliName = 'goal-progress';

	constructor(
		handler: (data: EventSubChannelGoalProgressEvent) => void,
		client: EventSubBase,
		private readonly _userId: string
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.goal.progress.${this._userId}`;
	}

	protected transformData(data: EventSubChannelGoalProgressEventData): EventSubChannelGoalProgressEvent {
		return new EventSubChannelGoalProgressEvent(data, this._client._apiClient);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription> {
		return await this._client._apiClient.eventSub.subscribeToChannelGoalProgressEvents(
			this._userId,
			await this._getTransportOptions()
		);
	}
}
