import { NonEnumerable } from '@d-fischer/shared-utils';
import TwitchClient from 'twitch';
import { PubSubBasicMessageInfo, PubSubChatMessage } from './PubSubMessage';

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
		return this._data.context === 'subgift' || this._data.context === 'anonsubgift'
			? this._data.recipient_id
			: this._data.user_id;
	}

	/**
	 * The name of the user subscribing to the channel.
	 */
	get userName() {
		return this._data.context === 'subgift' || this._data.context === 'anonsubgift'
			? this._data.recipient_user_name
			: this._data.user_name;
	}

	/**
	 * The display name of the user subscribing to the channel.
	 */
	get userDisplayName() {
		return this._data.context === 'subgift' || this._data.context === 'anonsubgift'
			? this._data.recipient_display_name
			: this._data.display_name;
	}

	/**
	 * The streak amount of months the user has been subscribed for.
	 *
	 * Returns 0 if a gift sub or the streaks months.
	 */
	get streakMonths() {
		return this._data.context === 'subgift' || this._data.context === 'anonsubgift'
			? 0
			: this._data['streak-months'];
	}

	/**
	 * The cumulative amount of months the user has been subscribed for.
	 *
	 * Returns the months if a gift sub or the cumulative months.
	 */
	get cumulativeMonths() {
		return this._data.context === 'subgift' || this._data.context === 'anonsubgift'
			? this._data.months
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
	 * The time the user subscribed.
	 */
	get time() {
		return new Date(this._data.time);
	}

	/**
	 * The message sent with the subscription.
	 *
	 * Returns null if the subscription is a gift subscription.
	 */
	get message() {
		return this._data.context === 'subgift' || this._data.context === 'anonsubgift' ? null : this._data.sub_message;
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
	 * Returns null if the subscription is not a gift.
	 */
	async getGifter() {
		if (!this.isGift) {
			return null;
		}

		return this._twitchClient.helix.users.getUserById(this.gifterId!);
	}
}
