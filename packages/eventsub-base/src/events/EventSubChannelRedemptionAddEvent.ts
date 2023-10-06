import { Enumerable } from '@d-fischer/shared-utils';
import type {
	ApiClient,
	HelixCustomReward,
	HelixCustomRewardRedemption,
	HelixCustomRewardRedemptionTargetStatus,
	HelixUser,
} from '@twurple/api';
import { checkRelationAssertion, DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import { type EventSubChannelRedemptionAddEventData } from './EventSubChannelRedemptionAddEvent.external';

/**
 * An EventSub event representing a Channel Points redemption.
 */
@rtfm<EventSubChannelRedemptionAddEvent>('eventsub-base', 'EventSubChannelRedemptionAddEvent', 'id')
export class EventSubChannelRedemptionAddEvent extends DataObject<EventSubChannelRedemptionAddEventData> {
	/** @internal */ @Enumerable(false) private readonly _client: ApiClient;

	/** @internal */
	constructor(data: EventSubChannelRedemptionAddEventData, client: ApiClient) {
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
	 * The ID of the broadcaster.
	 */
	get broadcasterId(): string {
		return this[rawDataSymbol].broadcaster_user_id;
	}

	/**
	 * The name of the broadcaster.
	 */
	get broadcasterName(): string {
		return this[rawDataSymbol].broadcaster_user_login;
	}

	/**
	 * The display name of the broadcaster.
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
	 * The ID of the user.
	 */
	get userId(): string {
		return this[rawDataSymbol].user_id;
	}

	/**
	 * The name of the user.
	 */
	get userName(): string {
		return this[rawDataSymbol].user_login;
	}

	/**
	 * The display name of the user.
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
	 * The input text given by the user.
	 *
	 * If there is no input to be given, this is an empty string.
	 */
	get input(): string {
		return this[rawDataSymbol].user_input;
	}

	/**
	 * The status of the redemption.
	 */
	get status(): string {
		return this[rawDataSymbol].status;
	}

	/**
	 * The ID of the reward that was redeemed.
	 */
	get rewardId(): string {
		return this[rawDataSymbol].reward.id;
	}

	/**
	 * The title of the reward that was redeemed.
	 */
	get rewardTitle(): string {
		return this[rawDataSymbol].reward.title;
	}

	/**
	 * The cost of the reward that was redeemed.
	 */
	get rewardCost(): number {
		return this[rawDataSymbol].reward.cost;
	}

	/**
	 * The description of the reward that was redeemed.
	 */
	get rewardPrompt(): string {
		return this[rawDataSymbol].reward.prompt;
	}

	/**
	 * Gets more information about the reward that was redeemed.
	 */
	async getReward(): Promise<HelixCustomReward> {
		return checkRelationAssertion(
			await this._client.channelPoints.getCustomRewardById(
				this[rawDataSymbol].broadcaster_user_id,
				this[rawDataSymbol].reward.id,
			),
		);
	}

	/**
	 * The time when the user redeemed the reward.
	 */
	get redemptionDate(): Date {
		return new Date(this[rawDataSymbol].redeemed_at);
	}

	/**
	 * Updates the redemption's status.
	 *
	 * @param newStatus The status the redemption should have.
	 */
	async updateStatus(newStatus: HelixCustomRewardRedemptionTargetStatus): Promise<HelixCustomRewardRedemption> {
		const result = await this._client.channelPoints.updateRedemptionStatusByIds(
			this[rawDataSymbol].broadcaster_user_id,
			this[rawDataSymbol].reward.id,
			[this[rawDataSymbol].id],
			newStatus,
		);

		return result[0];
	}
}
