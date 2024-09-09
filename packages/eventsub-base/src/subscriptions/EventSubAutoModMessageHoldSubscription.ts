import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import type { EventSubBase } from '../EventSubBase';
import { EventSubSubscription } from './EventSubSubscription';
import { EventSubAutoModMessageHoldEvent } from '../events/EventSubAutoModMessageHoldEvent';
import { type EventSubAutoModMessageHoldEventData } from '../events/EventSubAutoModMessageHoldEvent.external';

/** @internal */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubAutoModMessageHoldSubscription extends EventSubSubscription<EventSubAutoModMessageHoldEvent> {
	/** @protected */ readonly _cliName = '';

	constructor(
		handler: (data: EventSubAutoModMessageHoldEvent) => void,
		client: EventSubBase,
		private readonly _broadcasterId: string,
		private readonly _moderatorId: string,
	) {
		super(handler, client);
	}

	get id(): string {
		return `automod.message.hold.${this._broadcasterId}.${this._moderatorId}`;
	}

	get authUserId(): string | null {
		return this._moderatorId;
	}

	protected transformData(data: EventSubAutoModMessageHoldEventData): EventSubAutoModMessageHoldEvent {
		return new EventSubAutoModMessageHoldEvent(data, this._client._apiClient);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription> {
		return await this._client._apiClient.asUser(
			this._moderatorId,
			async ctx =>
				await ctx.eventSub.subscribeToAutoModMessageHoldEvents(
					this._broadcasterId,
					await this._getTransportOptions(),
				),
		);
	}
}
