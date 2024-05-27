import { type HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { type EventSubBase } from '../EventSubBase';
import { EventSubSubscription } from './EventSubSubscription';
import { EventSubChannelUnbanRequestCreateEvent } from '../events/EventSubChannelUnbanRequestCreateEvent';
import { type EventSubChannelUnbanRequestCreateEventData } from '../events/EventSubChannelUnbanRequestCreateEvent.external';

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
		return `channel.unban_request.create.${this._broadcasterId}`;
	}

	get authUserId(): string | null {
		return this._moderatorId;
	}

	protected transformData(data: EventSubChannelUnbanRequestCreateEventData): EventSubChannelUnbanRequestCreateEvent {
		return new EventSubChannelUnbanRequestCreateEvent(data, this._client._apiClient);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription> {
		return await this._client._apiClient.asUser(
			this._moderatorId,
			async ctx =>
				await ctx.eventSub.subscribeToChannelUnbanRequestCreateEvents(
					this._broadcasterId,
					await this._getTransportOptions(),
				),
		);
	}
}
