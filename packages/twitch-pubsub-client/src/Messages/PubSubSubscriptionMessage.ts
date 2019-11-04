import { PubSubBasicMessageInfo, PubSubChatMessage } from './PubSubMessage';
import { NonEnumerable } from '../Toolkit/Decorators';
import TwitchClient from 'twitch';

export interface PubSubSubscriptionDetail {
	context: 'sub' | 'resub';
	'cumulative-months': number;
	'streak-months': number;
}

export interface PubSubSubscriptionGiftDetail {
	context: 'subgift' | 'anonsubgift';
	recipient_id: string;
	recipient_user_name: string;
	recipient_display_name: string;
	months: number;
}

export type PubSubSubscriptionMessageData = PubSubBasicMessageInfo & {
	display_name: string;
	sub_plan: 'Prime' | '1000' | '2000' | '3000';
	sub_plan_name: string;
	sub_message: PubSubChatMessage;
} & (PubSubSubscriptionDetail | PubSubSubscriptionGiftDetail);

/**
 * A message that informs about a user subscribing to a channel.
 */
export default class PubSubSubscriptionMessage {
	@NonEnumerable private readonly _twitchClient: TwitchClient;

	/** @private */
	constructor(private readonly _data: PubSubSubscriptionMessageData, twitchClient: TwitchClient) {
		this._twitchClient = twitchClient;
	}

	/**
	 * The ID of the user subscribing to the channel.
	 */
	get userId() {
		return this.isGift || this.isAnonymous
			? (this._data as PubSubSubscriptionGiftDetail).recipient_id
			: this._data.user_id;
	}

	/**
	 * The name of the user subscribing to the channel.
	 */
	get userName() {
		return this.isGift || this.isAnonymous
			? (this._data as PubSubSubscriptionGiftDetail).recipient_user_name
			: this._data.user_name;
	}

	/**
	 * The display name of the user subscribing to the channel.
	 */
	get userDisplayName() {
		return this.isGift || this.isAnonymous
			? (this._data as PubSubSubscriptionGiftDetail).recipient_display_name
			: this._data.display_name;
	}

	/**
	 * The streak amount of months the user has been subscribed for.
	 *
	 * Returns 0 if a gift sub or the streaks months.
	 */
	get streakMonths() {
		return this.isGift || this.isAnonymous ? 0 : this._data['streak-months'];
	}

	/**
	 * The cumulative amount of months the user has been subscribed for.
	 *
	 * Returns the months if a gift sub or the cumulative months.
	 */
	get cumulativeMonths() {
		return this.isGift || this.isAnonymous
			? (this._data as PubSubSubscriptionGiftDetail).months
			: this._data['cumulative-months'];
	}

	/**
	 * The cumulative amount of months the user has been subscribed for.
	 *
	 * Returns the months if a gift sub or the cumulative months.
	 */
	get months() {
		return this.cumulativeMonths;
	}

	/**
	 * The time the user subscribed
	 */
	get time() {
		return new Date(this._data.time);
	}

	/**
	 * The message sent with the subscription
	 *
	 * Returns null if the subscription is a gift subscription
	 */
	get message() {
		return this.isGift || this.isAnonymous ? null : this._data.sub_message;
	}

	/**
	 * The plan of the subscription.
	 */
	get subPlan() {
		return this._data.sub_plan;
	}

	/**
	 * Whether the subscription is a resub.
	 */
	get isResub() {
		return this._data.context === 'resub';
	}

	/**
	 * Whether the subscription is a gift.
	 */
	get isGift() {
		return this._data.context === 'subgift';
	}

	/**
	 * Whether the subscription is from an anonymous gifter.
	 */
	get isAnonymous() {
		return this._data.context === 'anonsubgift';
	}

	/**
	 * The ID of the user gifting the subscription.
	 *
	 * Returns null if the subscription is not a gift.
	 */
	get gifterId() {
		return this.isGift ? this._data.user_id : null;
	}

	/**
	 * The name of the user gifting the subscription.
	 *
	 * Returns null if the subscription is not a gift.
	 */
	get gifterName() {
		return this.isGift ? this._data.user_name : null;
	}

	/**
	 * The display name of the user gifting the subscription.
	 *
	 * Returns null if the subscription is not a gift.
	 */
	get gifterDisplayName() {
		return this.isGift ? this._data.display_name : null;
	}

	/**
	 * Retrieves more data about the subscribing user.
	 */
	async getUser() {
		return this._twitchClient.helix.users.getUserById(this.userId);
	}

	/**
	 * Retrieves more data about the gifting user.
	 *
	 * Throws if the subscription is not a gift.
	 */
	async getGifter() {
		if (!this.isGift) {
			throw new TypeError("Trying to get the gifter of a subscription that's not a gift");
		}

		return this._twitchClient.helix.users.getUserById(this.gifterId!);
	}
}
