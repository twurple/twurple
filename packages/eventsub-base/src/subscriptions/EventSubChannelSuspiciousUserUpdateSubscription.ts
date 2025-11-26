import { type HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { type EventSubBase } from '../EventSubBase.js';
import { EventSubSubscription } from './EventSubSubscription.js';
import { EventSubChannelSuspiciousUserUpdateEvent } from '../events/EventSubChannelSuspiciousUserUpdateEvent.js';
import { type EventSubChannelSuspiciousUserUpdateEventData } from '../events/EventSubChannelSuspiciousUserUpdateEvent.external.js';

/** @internal */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubChannelSuspiciousUserUpdateSubscription extends EventSubSubscription<EventSubChannelSuspiciousUserUpdateEvent> {
	/** @protected */ readonly _cliName = '';

	constructor(
		handler: (data: EventSubChannelSuspiciousUserUpdateEvent) => void,
		client: EventSubBase,
		private readonly _broadcasterId: string,
		private readonly _moderatorId: string,
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.suspicious_user.update.${this._broadcasterId}.${this._moderatorId}`;
	}

	get authUserId(): string | null {
		return this._moderatorId;
	}

	protected transformData(
		data: EventSubChannelSuspiciousUserUpdateEventData,
	): EventSubChannelSuspiciousUserUpdateEvent {
		return new EventSubChannelSuspiciousUserUpdateEvent(data, this._client._apiClient);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription> {
		return await this._client._apiClient.asUser(
			this._moderatorId,
			async ctx =>
				await ctx.eventSub.subscribeToChannelSuspiciousUserUpdateEvents(
					this._broadcasterId,
					await this._getTransportOptions(),
				),
		);
	}
}
