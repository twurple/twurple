import { PubSubBasicMessageInfo, PubSubChatMessage } from './PubSubMessage';
import { NonEnumerable } from '../Toolkit/Decorators';
import TwitchClient from 'twitch';

export interface PubSubSubscriptionDetail {
	context: 'sub' | 'resub';
}

export interface PubSubSubscriptionGiftDetail {
	context: 'subgift';
	recipient_id: string;
	recipient_user_name: string;
	recipient_display_name: string;
}

export type PubSubSubscriptionMessageData = PubSubBasicMessageInfo & {
	display_name: string;
	sub_plan: 'Prime' | '1000' | '2000' | '3000';
	sub_plan_name: string;
	months: number;
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

	// these following three methods can't use isGift because it messes up type inference
	/**
	 * The ID of the user subscribing to the channel.
	 */
	get userId() {
		return this._data.context === 'subgift' ? this._data.recipient_id : this._data.user_id;
	}

	/**
	 * The name of the user subscribing to the channel.
	 */
	get userName() {
		return this._data.context === 'subgift' ? this._data.recipient_user_name : this._data.user_name;
	}

	/**
	 * The display name of the user subscribing to the channel.
	 */
	get userDisplayName() {
		return this._data.context === 'subgift' ? this._data.recipient_display_name : this._data.display_name;
	}

	/**
	 * Whether the subscription is a gift.
	 */
	get isGift() {
		return this._data.context === 'subgift';
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
			throw new TypeError('Trying to get the gifter of a subscription that\'s not a gift');
		}

		return this._twitchClient.helix.users.getUserById(this.gifterId!);
	}
}
