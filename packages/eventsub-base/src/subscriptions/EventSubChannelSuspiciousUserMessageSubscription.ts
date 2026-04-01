import { type HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { type EventSubChannelSuspiciousUserMessageEventData } from '../events/EventSubChannelSuspiciousUserMessageEvent.external.js';
import { EventSubChannelSuspiciousUserMessageEvent } from '../events/EventSubChannelSuspiciousUserMessageEvent.js';
import { type EventSubBase } from '../EventSubBase.js';
import { EventSubSubscription } from './EventSubSubscription.js';

/** @internal */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubChannelSuspiciousUserMessageSubscription extends EventSubSubscription<EventSubChannelSuspiciousUserMessageEvent> {
	/** @protected */ readonly _cliName = '';

	constructor(
		handler: (data: EventSubChannelSuspiciousUserMessageEvent) => void,
		client: EventSubBase,
		private readonly _broadcasterId: string,
		private readonly _moderatorId: string,
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.suspicious_user.message.${this._broadcasterId}.${this._moderatorId}`;
	}

	get authUserId(): string | null {
		return this._moderatorId;
	}

	protected transformData(
		data: EventSubChannelSuspiciousUserMessageEventData,
	): EventSubChannelSuspiciousUserMessageEvent {
		return this._client._config.managed
			? new EventSubChannelSuspiciousUserMessageEvent(data, this._client._config.apiClient)
			: new EventSubChannelSuspiciousUserMessageEvent(data);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription | undefined> {
		return this._client._config.managed
			? await this._client._config.apiClient.asUser(
					this._moderatorId,
					async ctx =>
						await ctx.eventSub.subscribeToChannelSuspiciousUserMessageEvents(
							this._broadcasterId,
							await this._getTransportOptions(),
						),
			  )
			: undefined;
	}
}
