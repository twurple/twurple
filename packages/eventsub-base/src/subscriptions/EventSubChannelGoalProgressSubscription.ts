import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { type EventSubChannelGoalProgressEventData } from '../events/EventSubChannelGoalProgressEvent.external.js';
import { EventSubChannelGoalProgressEvent } from '../events/EventSubChannelGoalProgressEvent.js';
import type { EventSubBase } from '../EventSubBase.js';
import { EventSubSubscription } from './EventSubSubscription.js';

/** @internal */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubChannelGoalProgressSubscription extends EventSubSubscription<EventSubChannelGoalProgressEvent> {
	/** @protected */ readonly _cliName = 'goal-progress';

	constructor(
		handler: (data: EventSubChannelGoalProgressEvent) => void,
		client: EventSubBase,
		private readonly _userId: string,
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.goal.progress.${this._userId}`;
	}

	get authUserId(): string | null {
		return this._userId;
	}

	protected transformData(data: EventSubChannelGoalProgressEventData): EventSubChannelGoalProgressEvent {
		return this._client._config.managed
			? new EventSubChannelGoalProgressEvent(data, this._client._config.apiClient)
			: new EventSubChannelGoalProgressEvent(data);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription | undefined> {
		return this._client._config.managed
			? await this._client._config.apiClient.eventSub.subscribeToChannelGoalProgressEvents(
					this._userId,
					await this._getTransportOptions(),
			  )
			: undefined;
	}
}
