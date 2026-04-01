import { type HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { type EventSubChannelUnbanRequestCreateEventData } from '../events/EventSubChannelUnbanRequestCreateEvent.external.js';
import { EventSubChannelUnbanRequestCreateEvent } from '../events/EventSubChannelUnbanRequestCreateEvent.js';
import { type EventSubBase } from '../EventSubBase.js';
import { EventSubSubscription } from './EventSubSubscription.js';

/** @internal */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubChannelUnbanRequestCreateSubscription extends EventSubSubscription<EventSubChannelUnbanRequestCreateEvent> {
	/** @protected */ readonly _cliName = '';

	constructor(
		handler: (data: EventSubChannelUnbanRequestCreateEvent) => void,
		client: EventSubBase,
		private readonly _broadcasterId: string,
		private readonly _moderatorId: string,
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.unban_request.create.${this._broadcasterId}.${this._moderatorId}`;
	}

	get authUserId(): string | null {
		return this._moderatorId;
	}

	protected transformData(data: EventSubChannelUnbanRequestCreateEventData): EventSubChannelUnbanRequestCreateEvent {
		return this._client._config.managed
			? new EventSubChannelUnbanRequestCreateEvent(data, this._client._config.apiClient)
			: new EventSubChannelUnbanRequestCreateEvent(data);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription | undefined> {
		return this._client._config.managed
			? await this._client._config.apiClient.asUser(
					this._moderatorId,
					async ctx =>
						await ctx.eventSub.subscribeToChannelUnbanRequestCreateEvents(
							this._broadcasterId,
							await this._getTransportOptions(),
						),
			  )
			: undefined;
	}
}
