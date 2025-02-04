import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import type { EventSubBase } from '../EventSubBase';
import { EventSubSubscription } from './EventSubSubscription';
import { EventSubAutoModMessageUpdateV2Event } from '../events/EventSubAutoModMessageUpdateV2Event';
import { type EventSubAutoModMessageUpdateV2EventData } from '../events/EventSubAutoModMessageUpdateV2Event.external';

/** @internal */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubAutoModMessageUpdateV2Subscription extends EventSubSubscription<EventSubAutoModMessageUpdateV2Event> {
	/** @protected */ readonly _cliName = '';

	constructor(
		handler: (data: EventSubAutoModMessageUpdateV2Event) => void,
		client: EventSubBase,
		private readonly _broadcasterId: string,
		private readonly _moderatorId: string,
	) {
		super(handler, client);
	}

	get id(): string {
		return `automod.message.update.v2.${this._broadcasterId}.${this._moderatorId}`;
	}

	get authUserId(): string | null {
		return this._moderatorId;
	}

	protected transformData(data: EventSubAutoModMessageUpdateV2EventData): EventSubAutoModMessageUpdateV2Event {
		return new EventSubAutoModMessageUpdateV2Event(data, this._client._apiClient);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription> {
		return await this._client._apiClient.asUser(
			this._moderatorId,
			async ctx =>
				await ctx.eventSub.subscribeToAutoModMessageUpdateV2Events(
					this._broadcasterId,
					await this._getTransportOptions(),
				),
		);
	}
}
