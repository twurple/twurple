import { Enumerable, groupBy } from '@d-fischer/shared-utils';
import type { ApiClient, HelixUser } from '@twurple/api';
import { checkRelationAssertion, DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import {
	type EventSubAutomaticRewardRedemptionRewardUnlockedEmoteData,
	type EventSubAutomaticRewardType,
	type EventSubChannelAutomaticRewardRedemptionAddEventData,
} from './EventSubChannelAutomaticRewardRedemptionAddEvent.external';

/**
 * An EventSub event representing an automatic reward being redeemed by a user in a channel.
 */
@rtfm<EventSubChannelAutomaticRewardRedemptionAddEvent>(
	'eventsub-base',
	'EventSubChannelAutomaticRewardRedemptionAddEvent',
	'id',
)
export class EventSubChannelAutomaticRewardRedemptionAddEvent extends DataObject<EventSubChannelAutomaticRewardRedemptionAddEventData> {
	/** @internal */ @Enumerable(false) private readonly _client: ApiClient;

	/** @internal */
	constructor(data: EventSubChannelAutomaticRewardRedemptionAddEventData, client: ApiClient) {
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
	 * Gets more information about the banned user.
	 */
	async getUser(): Promise<HelixUser> {
		return checkRelationAssertion(await this._client.users.getUserById(this[rawDataSymbol].user_id));
	}

	/**
	 * The type of the reward.
	 */
	get rewardType(): EventSubAutomaticRewardType {
		return this[rawDataSymbol].reward.type;
	}

	/**
	 * The display name of the moderator who issued the ban/timeout.
	 */
	get rewardCost(): number {
		return this[rawDataSymbol].reward.cost;
	}

	/**
	 * The emote that was unlocked by the corresponding rewards, or `null` if this field is not relevant.
	 */
	get unlockedEmote(): EventSubAutomaticRewardRedemptionRewardUnlockedEmoteData | null {
		return this[rawDataSymbol].reward.unlocked_emote;
	}

	/**
	 * The input text given by the user.
	 *
	 * If there is no input to be given, this is an empty string.
	 */
	get input(): string | null {
		return this[rawDataSymbol].user_input || null;
	}

	/**
	 * The text of the message, or `null` if there is no message.
	 */
	get messageText(): string | null {
		return this[rawDataSymbol].message?.text ?? null;
	}

	/**
	 * The offsets of emote usages in the message, or `null` if there is no message.
	 */
	get emoteOffsets(): Map<string, string[]> | null {
		if (this[rawDataSymbol].message) {
			return new Map<string, string[]>(
				Object.entries(groupBy(this[rawDataSymbol].message.emotes, 'id')).map(([id, ranges]) => [
					id,
					ranges.map(({ begin, end }) => `${begin}-${end}`),
				]),
			);
		}

		return null;
	}

	/**
	 * The date when the user redeemed the reward.
	 */
	get redemptionDate(): Date | null {
		return new Date(this[rawDataSymbol].redeemed_at);
	}
}
