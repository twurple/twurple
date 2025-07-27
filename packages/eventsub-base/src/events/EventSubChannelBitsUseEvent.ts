import { Enumerable, mapNullable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixUser } from '@twurple/api';
import { checkRelationAssertion, DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import {
	type EventSubChannelBitsUseEventData,
	type EventSubChannelBitsUseMessagePart,
	type EventSubChannelBitsUseType,
} from './EventSubChannelBitsUseEvent.external';
import { EventSubChannelBitsUsePowerUp } from './common/EventSubChannelBitsUsePowerUp';

/**
 * An EventSub event representing bits being used in a channel.
 */
@rtfm<EventSubChannelBitsUseEvent>('eventsub-base', 'EventSubChannelBitsUserEvent', 'userId')
export class EventSubChannelBitsUseEvent extends DataObject<EventSubChannelBitsUseEventData> {
	/** @internal */ @Enumerable(false) private readonly _client: ApiClient;

	/** @internal */
	constructor(data: EventSubChannelBitsUseEventData, client: ApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The ID of the broadcaster in whose channel the bits were used.
	 */
	get broadcasterId(): string {
		return this[rawDataSymbol].broadcaster_user_id;
	}

	/**
	 * The name of the broadcaster in whose channel the bits were used.
	 */
	get broadcasterName(): string {
		return this[rawDataSymbol].broadcaster_user_login;
	}

	/**
	 * The display name of the broadcaster in whose channel the bits were used.
	 */
	get broadcasterDisplayName(): string {
		return this[rawDataSymbol].broadcaster_user_name;
	}

	/**
	 * Gets more information about the broadcaster.
	 */
	async getBroadcaster(): Promise<HelixUser> {
		return checkRelationAssertion(await this._client.users.getUserById(this[rawDataSymbol].broadcaster_user_id));
	}

	/**
	 * The ID of the user who has used bits.
	 */
	get userId(): string {
		return this[rawDataSymbol].user_id;
	}

	/**
	 * The name of the user who has used bits.
	 */
	get userName(): string {
		return this[rawDataSymbol].user_login;
	}

	/**
	 * The display name of the user who has used bits.
	 */
	get userDisplayName(): string {
		return this[rawDataSymbol].user_name;
	}

	/**
	 * Gets more information about the user.
	 */
	async getUser(): Promise<HelixUser> {
		return checkRelationAssertion(await this._client.users.getUserById(this[rawDataSymbol].user_id));
	}

	/**
	 * The type of the bits usage.
	 */
	get type(): EventSubChannelBitsUseType {
		return this[rawDataSymbol].type;
	}

	/**
	 * The number of bits used.
	 */
	get bits(): number {
		return this[rawDataSymbol].bits;
	}

	/**
	 * The chat message in plain text, or `null` if it's not applicable.
	 */
	get messageText(): string | null {
		return this[rawDataSymbol].message?.text ?? null;
	}

	/**
	 * Ordered list of chat message fragments, or `null` if it's not applicable.
	 */
	get messageParts(): EventSubChannelBitsUseMessagePart[] | null {
		return this[rawDataSymbol].message?.fragments ?? null;
	}

	/**
	 * The Power-up data, or `null` if it's not applicable.
	 */
	get powerUp(): EventSubChannelBitsUsePowerUp | null {
		return mapNullable(this[rawDataSymbol].power_up, v => new EventSubChannelBitsUsePowerUp(v));
	}
}
