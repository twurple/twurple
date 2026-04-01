import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import type { EventSubChannelShieldModeBeginEventData } from '../events/EventSubChannelShieldModeBeginEvent.external.js';
import { EventSubChannelShieldModeBeginEvent } from '../events/EventSubChannelShieldModeBeginEvent.js';
import type { EventSubBase } from '../EventSubBase.js';
import { EventSubSubscription } from './EventSubSubscription.js';

/** @internal */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubChannelShieldModeBeginSubscription extends EventSubSubscription<EventSubChannelShieldModeBeginEvent> {
	/** @protected */ readonly _cliName = '';

	constructor(
		handler: (data: EventSubChannelShieldModeBeginEvent) => void,
		client: EventSubBase,
		private readonly _userId: string,
		private readonly _moderatorId: string,
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.shield_mode.begin.${this._userId}`;
	}

	get authUserId(): string | null {
		return this._userId;
	}

	protected transformData(data: EventSubChannelShieldModeBeginEventData): EventSubChannelShieldModeBeginEvent {
		return this._client._config.managed
			? new EventSubChannelShieldModeBeginEvent(data, this._client._config.apiClient)
			: new EventSubChannelShieldModeBeginEvent(data);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription | undefined> {
		return this._client._config.managed
			? await this._client._config.apiClient.asUser(
					this._moderatorId,
					async ctx =>
						await ctx.eventSub.subscribeToChannelShieldModeBeginEvents(
							this._userId,
							await this._getTransportOptions(),
						),
			  )
			: undefined;
	}
}
