import { type HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { EventSubChannelShoutoutReceiveEvent } from '../events/EventSubChannelShoutoutReceiveEvent';
import { type EventSubChannelShoutoutReceiveEventData } from '../events/EventSubChannelShoutoutReceiveEvent.external';
import { type EventSubBase } from '../EventSubBase';
import { EventSubSubscription } from './EventSubSubscription';

/** @internal */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubChannelShoutoutReceiveSubscription extends EventSubSubscription<EventSubChannelShoutoutReceiveEvent> {
	/** @protected */ readonly _cliName = 'shoutout-received';

	constructor(
		handler: (data: EventSubChannelShoutoutReceiveEvent) => void,
		client: EventSubBase,
		private readonly _userId: string,
		private readonly _moderatorId: string,
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.shoutout.receive.${this._userId}`;
	}

	get authUserId(): string | null {
		return this._userId;
	}

	protected transformData(data: EventSubChannelShoutoutReceiveEventData): EventSubChannelShoutoutReceiveEvent {
		return new EventSubChannelShoutoutReceiveEvent(data, this._client._apiClient);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription> {
		return await this._client._apiClient.asUser(
			this._moderatorId,
			async ctx =>
				await ctx.eventSub.subscribeToChannelShoutoutReceiveEvents(
					this._userId,
					await this._getTransportOptions(),
				),
		);
	}
}
