import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import type { EventSubBase } from '../EventSubBase';
import { EventSubSubscription } from './EventSubSubscription';
import { EventSubAutoModMessageHoldV2Event } from '../events/EventSubAutoModMessageHoldV2Event';
import { type EventSubAutoModMessageHoldV2EventData } from '../events/EventSubAutoModMessageHoldV2Event.external';

/** @internal */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubAutoModMessageHoldV2Subscription extends EventSubSubscription<EventSubAutoModMessageHoldV2Event> {
	/** @protected */ readonly _cliName = '';

	constructor(
		handler: (data: EventSubAutoModMessageHoldV2Event) => void,
		client: EventSubBase,
		private readonly _broadcasterId: string,
		private readonly _moderatorId: string,
	) {
		super(handler, client);
	}

	get id(): string {
		return `automod.message.hold.v2.${this._broadcasterId}.${this._moderatorId}`;
	}

	get authUserId(): string | null {
		return this._moderatorId;
	}

	protected transformData(data: EventSubAutoModMessageHoldV2EventData): EventSubAutoModMessageHoldV2Event {
		return new EventSubAutoModMessageHoldV2Event(data, this._client._apiClient);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription> {
		return await this._client._apiClient.asUser(
			this._moderatorId,
			async ctx =>
				await ctx.eventSub.subscribeToAutoModMessageHoldV2Events(
					this._broadcasterId,
					await this._getTransportOptions(),
				),
		);
	}
}
