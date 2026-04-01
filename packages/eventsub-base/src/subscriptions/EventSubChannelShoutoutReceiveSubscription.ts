import { type HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { type EventSubChannelShoutoutReceiveEventData } from '../events/EventSubChannelShoutoutReceiveEvent.external.js';
import { EventSubChannelShoutoutReceiveEvent } from '../events/EventSubChannelShoutoutReceiveEvent.js';
import { type EventSubBase } from '../EventSubBase.js';
import { EventSubSubscription } from './EventSubSubscription.js';

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
		return this._client._config.managed
			? new EventSubChannelShoutoutReceiveEvent(data, this._client._config.apiClient)
			: new EventSubChannelShoutoutReceiveEvent(data);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription | undefined> {
		return this._client._config.managed
			? await this._client._config.apiClient.asUser(
					this._moderatorId,
					async ctx =>
						await ctx.eventSub.subscribeToChannelShoutoutReceiveEvents(
							this._userId,
							await this._getTransportOptions(),
						),
			  )
			: undefined;
	}
}
