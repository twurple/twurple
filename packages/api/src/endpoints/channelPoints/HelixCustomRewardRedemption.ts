import { Enumerable } from '@d-fischer/shared-utils';
import { checkRelationAssertion, DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import { type BaseApiClient } from '../../client/BaseApiClient';
import {
	type HelixCustomRewardRedemptionData,
	type HelixCustomRewardRedemptionTargetStatus
} from '../../interfaces/endpoints/channelPoints.external';
import type { HelixUser } from '../user/HelixUser';
import type { HelixCustomReward } from './HelixCustomReward';

/**
 * A redemption of a custom Channel Points reward.
 */
@rtfm<HelixCustomRewardRedemption>('api', 'HelixCustomRewardRedemption', 'id')
export class HelixCustomRewardRedemption extends DataObject<HelixCustomRewardRedemptionData> {
	/** @internal */ @Enumerable(false) private readonly _client: BaseApiClient;

	/** @internal */
	constructor(data: HelixCustomRewardRedemptionData, client: BaseApiClient) {
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
	 * The ID of the broadcaster where the reward was redeemed.
	 */
	get broadcasterId(): string {
		return this[rawDataSymbol].broadcaster_id;
	}

	/**
	 * The name of the broadcaster where the reward was redeemed.
	 */
	get broadcasterName(): string {
		return this[rawDataSymbol].broadcaster_login;
	}

	/**
	 * The display name of the broadcaster where the reward was redeemed.
	 */
	get broadcasterDisplayName(): string {
		return this[rawDataSymbol].broadcaster_name;
	}

	/**
	 * Gets more information about the broadcaster where the reward was redeemed.
	 */
	async getBroadcaster(): Promise<HelixUser> {
		return checkRelationAssertion(await this._client.users.getUserById(this[rawDataSymbol].broadcaster_id));
	}

	/**
	 * The ID of the user that redeemed the reward.
	 */
	get userId(): string {
		return this[rawDataSymbol].user_id;
	}

	/**
	 * The name of the user that redeemed the reward.
	 */
	get userName(): string {
		return this[rawDataSymbol].user_login;
	}

	/**
	 * The display name of the user that redeemed the reward.
	 */
	get userDisplayName(): string {
		return this[rawDataSymbol].user_name;
	}

	/**
	 * Gets more information about the user that redeemed the reward.
	 */
	async getUser(): Promise<HelixUser> {
		return checkRelationAssertion(await this._client.users.getUserById(this[rawDataSymbol].user_id));
	}

	/**
	 * The text the user wrote when redeeming the reward.
	 */
	get userInput(): string {
		return this[rawDataSymbol].user_input;
	}

	/**
	 * Whether the redemption was fulfilled.
	 */
	get isFulfilled(): boolean {
		return this[rawDataSymbol].status === 'FULFILLED';
	}

	/**
	 * Whether the redemption was canceled.
	 */
	get isCanceled(): boolean {
		return this[rawDataSymbol].status === 'CANCELED';
	}

	/**
	 * The date and time when the reward was redeemed.
	 */
	get redemptionDate(): Date {
		return new Date(this[rawDataSymbol].redeemed_at);
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
	 * The prompt of the reward that was redeemed.
	 */
	get rewardPrompt(): string {
		return this[rawDataSymbol].reward.prompt;
	}

	/**
	 * The cost of the reward that was redeemed.
	 */
	get rewardCost(): number {
		return this[rawDataSymbol].reward.cost;
	}

	/**
	 * Gets more information about the reward that was redeemed.
	 */
	async getReward(): Promise<HelixCustomReward> {
		return checkRelationAssertion(
			await this._client.channelPoints.getCustomRewardById(
				this[rawDataSymbol].broadcaster_id,
				this[rawDataSymbol].reward.id
			)
		);
	}

	/**
	 * Updates the redemption's status.
	 *
	 * @param newStatus The status the redemption should have.
	 */
	async updateStatus(newStatus: HelixCustomRewardRedemptionTargetStatus): Promise<HelixCustomRewardRedemption> {
		const result = await this._client.channelPoints.updateRedemptionStatusByIds(
			this[rawDataSymbol].broadcaster_id,
			this[rawDataSymbol].reward.id,
			[this[rawDataSymbol].id],
			newStatus
		);

		return result[0];
	}
}
