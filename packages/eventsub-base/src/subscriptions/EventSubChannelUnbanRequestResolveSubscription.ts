import { type HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { type EventSubChannelUnbanRequestResolveEventData } from '../events/EventSubChannelUnbanRequestResolveEvent.external.js';
import { EventSubChannelUnbanRequestResolveEvent } from '../events/EventSubChannelUnbanRequestResolveEvent.js';
import { type EventSubBase } from '../EventSubBase.js';
import { EventSubSubscription } from './EventSubSubscription.js';

/** @internal */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubChannelUnbanRequestResolveSubscription extends EventSubSubscription<EventSubChannelUnbanRequestResolveEvent> {
	/** @protected */ readonly _cliName = '';

	constructor(
		handler: (data: EventSubChannelUnbanRequestResolveEvent) => void,
		client: EventSubBase,
		private readonly _broadcasterId: string,
		private readonly _moderatorId: string,
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.unban_request.resolve.${this._broadcasterId}.${this._moderatorId}`;
	}

	get authUserId(): string | null {
		return this._moderatorId;
	}

	protected transformData(
		data: EventSubChannelUnbanRequestResolveEventData,
	): EventSubChannelUnbanRequestResolveEvent {
		return this._client._config.managed
			? new EventSubChannelUnbanRequestResolveEvent(data, this._client._config.apiClient)
			: new EventSubChannelUnbanRequestResolveEvent(data);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription | undefined> {
		return this._client._config.managed
			? await this._client._config.apiClient.asUser(
					this._moderatorId,
					async ctx =>
						await ctx.eventSub.subscribeToChannelUnbanRequestResolveEvents(
							this._broadcasterId,
							await this._getTransportOptions(),
						),
			  )
			: undefined;
	}
}
