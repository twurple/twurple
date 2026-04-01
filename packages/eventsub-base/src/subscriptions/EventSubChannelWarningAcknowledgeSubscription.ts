import { type HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { type EventSubChannelWarningAcknowledgeEventData } from '../events/EventSubChannelWarningAcknowledgeEvent.external.js';
import { EventSubChannelWarningAcknowledgeEvent } from '../events/EventSubChannelWarningAcknowledgeEvent.js';
import { type EventSubBase } from '../EventSubBase.js';
import { EventSubSubscription } from './EventSubSubscription.js';

/** @internal */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubChannelWarningAcknowledgeSubscription extends EventSubSubscription<EventSubChannelWarningAcknowledgeEvent> {
	/** @protected */ readonly _cliName = '';

	constructor(
		handler: (data: EventSubChannelWarningAcknowledgeEvent) => void,
		client: EventSubBase,
		private readonly _broadcasterId: string,
		private readonly _moderatorId: string,
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.warning.acknowledge.${this._broadcasterId}.${this._moderatorId}`;
	}

	get authUserId(): string | null {
		return this._moderatorId;
	}

	protected transformData(data: EventSubChannelWarningAcknowledgeEventData): EventSubChannelWarningAcknowledgeEvent {
		return this._client._config.managed
			? new EventSubChannelWarningAcknowledgeEvent(data, this._client._config.apiClient)
			: new EventSubChannelWarningAcknowledgeEvent(data);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription | undefined> {
		return this._client._config.managed
			? await this._client._config.apiClient.asUser(
					this._moderatorId,
					async ctx =>
						await ctx.eventSub.subscribeToChannelWarningAcknowledgeEvents(
							this._broadcasterId,
							await this._getTransportOptions(),
						),
			  )
			: undefined;
	}
}
