import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { type EventSubChannelFollowEventData } from '../events/EventSubChannelFollowEvent.external.js';
import { EventSubChannelFollowEvent } from '../events/EventSubChannelFollowEvent.js';
import type { EventSubBase } from '../EventSubBase.js';
import { EventSubSubscription } from './EventSubSubscription.js';

/** @internal */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubChannelFollowSubscription extends EventSubSubscription<EventSubChannelFollowEvent> {
	/** @protected */ readonly _cliName = 'follow';

	constructor(
		handler: (data: EventSubChannelFollowEvent) => void,
		client: EventSubBase,
		private readonly _userId: string,
		private readonly _moderatorId: string,
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
		return this._client._config.managed
			? new EventSubChannelFollowEvent(data, this._client._config.apiClient)
			: new EventSubChannelFollowEvent(data);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription | undefined> {
		return this._client._config.managed
			? await this._client._config.apiClient.asUser(
					this._moderatorId,
					async ctx =>
						await ctx.eventSub.subscribeToChannelFollowEvents(
							this._userId,
							await this._getTransportOptions(),
						),
			  )
			: undefined;
	}
}
