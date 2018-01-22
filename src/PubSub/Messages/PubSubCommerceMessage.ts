import { PubSubBasicMessageInfo, PubSubChatMessage } from './PubSubMessage';
import { NonEnumerable } from '../../Toolkit/Decorators';
import HelixUser from '../../API/Helix/User/HelixUser';
import TwitchClient from '../../TwitchClient';

export interface PubSubCommerceMessageData extends PubSubBasicMessageInfo {
	display_name: string;
	item_image_url: string;
	item_description: string;
	supports_channel: boolean;
	purchase_message: PubSubChatMessage;
}

export default class PubSubCommerceMessage {
	@NonEnumerable private readonly _twitchClient: TwitchClient;

	constructor(private readonly _data: PubSubCommerceMessageData, twitchClient: TwitchClient) {
		this._twitchClient = twitchClient;
	}

	get itemName() {
		return this._data.display_name;
	}

	get itemDescription() {
		return this._data.item_description;
	}

	get itemImageUrl() {
		return this._data.item_image_url;
	}

	get supportsChannel() {
		return this._data.supports_channel;
	}

	get messageText() {
		return this._data.purchase_message.message;
	}

	get userId() {
		return this._data.user_id;
	}

	get userName() {
		return this._data.user_name;
	}

	async getUser(): Promise<HelixUser> {
		return this._twitchClient.helix.users.getUserById(this._data.user_id);
	}
}
