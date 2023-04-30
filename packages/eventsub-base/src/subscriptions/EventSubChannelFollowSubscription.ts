import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { EventSubChannelFollowEvent } from '../events/EventSubChannelFollowEvent';
import { type EventSubChannelFollowEventData } from '../events/EventSubChannelFollowEvent.external';
import type { EventSubBase } from '../EventSubBase';
import { EventSubSubscription } from './EventSubSubscription';

/** @private */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubChannelFollowSubscription extends EventSubSubscription<EventSubChannelFollowEvent> {
	/** @protected */ readonly _cliName = 'follow';

	constructor(
		handler: (data: EventSubChannelFollowEvent) => void,
		client: EventSubBase,
		private readonly _userId: string,
		private readonly _moderatorId: string
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.follow.${this._userId}.${this._moderatorId}`;
	}

	get authUserId(): string | null {
		return this._moderatorId;
	}

	protected transformData(data: EventSubChannelFollowEventData): EventSubChannelFollowEvent {
		return new EventSubChannelFollowEvent(data, this._client._apiClient);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription> {
		return await this._client._apiClient.asUser(
			this._moderatorId,
			async ctx =>
				await ctx.eventSub.subscribeToChannelFollowEvents(this._userId, await this._getTransportOptions())
		);
	}
}
