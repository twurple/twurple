import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import {
	type PubSubRedemptionMessageData,
	type PubSubRedemptionMessageImageData,
	type PubSubRedemptionStatus
} from './PubSubRedemptionMessage.external';

/**
 * A message that informs about a user redeeming a custom channel points reward.
 */
@rtfm<PubSubRedemptionMessage>('pubsub', 'PubSubRedemptionMessage', 'id')
export class PubSubRedemptionMessage extends DataObject<PubSubRedemptionMessageData> {
	/**
	 * The internal redemption ID.
	 */
	get id(): string {
		return this[rawDataSymbol].data.redemption.id;
	}

	/**
	 * The ID of the user that redeemed the reward.
	 */
	get userId(): string {
		return this[rawDataSymbol].data.redemption.user.id;
	}

	/**
	 * The name of the user that redeemed the reward.
	 */
	get userName(): string {
		return this[rawDataSymbol].data.redemption.user.login;
	}

	/**
	 * The display name of the user that redeemed the reward.
	 */
	get userDisplayName(): string {
		return this[rawDataSymbol].data.redemption.user.display_name;
	}

	/**
	 * The ID of the channel where the reward was redeemed.
	 */
	get channelId(): string {
		return this[rawDataSymbol].data.redemption.channel_id;
	}

	/**
	 * The date when the reward was redeemed.
	 */
	get redemptionDate(): Date {
		return new Date(this[rawDataSymbol].data.redemption.redeemed_at);
	}

	/**
	 * The ID of the reward.
	 */
	get rewardId(): string {
		return this[rawDataSymbol].data.redemption.reward.id;
	}

	/**
	 * The title of the reward.
	 */
	get rewardTitle(): string {
		return this[rawDataSymbol].data.redemption.reward.title;
	}

	/**
	 * The prompt of the reward.
	 */
	get rewardPrompt(): string {
		return this[rawDataSymbol].data.redemption.reward.prompt;
	}

	/**
	 * The cost of the reward, in channel points.
	 */
	get rewardCost(): number {
		return this[rawDataSymbol].data.redemption.reward.cost;
	}

	/**
	 * Whether the reward gets added to the request queue.
	 */
	get rewardIsQueued(): boolean {
		return !this[rawDataSymbol].data.redemption.reward.should_redemptions_skip_request_queue;
	}

	/**
	 * The image set associated with the reward.
	 */
	get rewardImage(): PubSubRedemptionMessageImageData {
		return this[rawDataSymbol].data.redemption.reward.image;
	}

	/**
	 * The default image set associated with the reward.
	 */
	get defaultImage(): PubSubRedemptionMessageImageData {
		return this[rawDataSymbol].data.redemption.reward.default_image;
	}

	/**
	 * The full message that was sent with the notification.
	 */
	get message(): string {
		return this[rawDataSymbol].data.redemption.user_input;
	}

	/**
	 * The status of the redemption.
	 */
	get status(): PubSubRedemptionStatus {
		return this[rawDataSymbol].data.redemption.status;
	}
}
