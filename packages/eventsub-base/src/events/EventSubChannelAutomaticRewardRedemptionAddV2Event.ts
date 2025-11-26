import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixUser } from '@twurple/api';
import { checkRelationAssertion, DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import {
	type EventSubAutomaticRewardRedemptionMessagePart,
	type EventSubChannelAutomaticRewardRedemptionAddV2EventData,
} from './EventSubChannelAutomaticRewardRedemptionAddV2Event.external.js';
import { EventSubChannelAutomaticReward } from './common/EventSubChannelAutomaticReward.js';

/**
 * An EventSub event representing an automatic reward being redeemed by a user in a channel.
 */
@rtfm<EventSubChannelAutomaticRewardRedemptionAddV2Event>(
	'eventsub-base',
	'EventSubChannelAutomaticRewardRedemptionAddV2Event',
	'id',
)
export class EventSubChannelAutomaticRewardRedemptionAddV2Event extends DataObject<EventSubChannelAutomaticRewardRedemptionAddV2EventData> {
	/** @internal */ @Enumerable(false) private readonly _client: ApiClient;

	/** @internal */
	constructor(data: EventSubChannelAutomaticRewardRedemptionAddV2EventData, client: ApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The ID of the redemption.
	 */
	get id(): string {
		return this[rawDataSymbol].id;
	}

	/**
	 * The ID of the broadcaster in whose channel the reward was redeemed.
	 */
	get broadcasterId(): string {
		return this[rawDataSymbol].broadcaster_user_id;
	}

	/**
	 * The name of the broadcaster in whose channel the reward was redeemed.
	 */
	get broadcasterName(): string {
		return this[rawDataSymbol].broadcaster_user_login;
	}

	/**
	 * The display name of the broadcaster in whose channel the reward was redeemed.
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
	 * The ID of the redeeming user.
	 */
	get userId(): string {
		return this[rawDataSymbol].user_id;
	}

	/**
	 * The name of the redeeming user.
	 */
	get userName(): string {
		return this[rawDataSymbol].user_login;
	}

	/**
	 * The display name of the redeeming user.
	 */
	get userDisplayName(): string {
		return this[rawDataSymbol].user_name;
	}

	/**
	 * Gets more information about the redeeming user.
	 */
	async getUser(): Promise<HelixUser> {
		return checkRelationAssertion(await this._client.users.getUserById(this[rawDataSymbol].user_id));
	}

	/**
	 * An object that contains the reward information.
	 */
	get reward(): EventSubChannelAutomaticReward {
		return new EventSubChannelAutomaticReward(this[rawDataSymbol].reward);
	}

	/**
	 * The text of the message, or `null` if there is no message.
	 */
	get messageText(): string | null {
		return this[rawDataSymbol].message?.text ?? null;
	}

	/**
	 * The pre-parsed message parts.
	 */
	get messageParts(): EventSubAutomaticRewardRedemptionMessagePart[] {
		return this[rawDataSymbol].message?.fragments ?? [];
	}

	/**
	 * The date when the user redeemed the reward.
	 */
	get redemptionDate(): Date | null {
		return new Date(this[rawDataSymbol].redeemed_at);
	}
}
