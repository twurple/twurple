import { PubSubBasicMessageInfo, PubSubChatMessage } from './PubSubMessage';
import { NonEnumerable } from '../../Toolkit/Decorators';
import HelixUser from '../../API/Helix/User/HelixUser';
import TwitchClient from '../../TwitchClient';

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

export default class PubSubSubscriptionMessage {
	@NonEnumerable private readonly _twitchClient: TwitchClient;

	constructor(private readonly _data: PubSubSubscriptionMessageData, twitchClient: TwitchClient) {
		this._twitchClient = twitchClient;
	}

	// these following three methods can't use isGift because it messes up type inference
	get userId() {
		return this._data.context === 'subgift' ? this._data.recipient_id : this._data.user_id;
	}

	get userName() {
		return this._data.context === 'subgift' ? this._data.recipient_user_name : this._data.user_name;
	}

	get userDisplayName() {
		return this._data.context === 'subgift' ? this._data.recipient_display_name : this._data.display_name;
	}

	get isGift() {
		return this._data.context === 'subgift';
	}

	get gifterId() {
		return this.isGift ? this._data.user_id : null;
	}

	get gifterName() {
		return this.isGift ? this._data.user_name : null;
	}

	get gifterDisplayName() {
		return this.isGift ? this._data.display_name : null;
	}

	async getUser(): Promise<HelixUser> {
		return this._twitchClient.helix.users.getUserById(this.userId);
	}

	async getGifter(): Promise<HelixUser> {
		if (!this.isGift) {
			throw new TypeError('Trying to get the gifter of a subscription that\'s not a gift');
		}

		return this._twitchClient.helix.users.getUserById(this.gifterId!);
	}
}
