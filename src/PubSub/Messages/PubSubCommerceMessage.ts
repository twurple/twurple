import { PubSubBasicMessageInfo, PubSubChatMessage } from './PubSubMessage';
import { NonEnumerable } from '../../Toolkit/Decorators';
import HelixUser from '../../API/Helix/User/HelixUser';
import TwitchClient from '../../TwitchClient';

/** @private */
export interface PubSubCommerceMessageData extends PubSubBasicMessageInfo {
	display_name: string;
	item_image_url: string;
	item_description: string;
	supports_channel: boolean;
	purchase_message: PubSubChatMessage;
}

/**
 * A message that informs about something being bought from a channel page.
 */
export default class PubSubCommerceMessage {
	@NonEnumerable private readonly _twitchClient: TwitchClient;

	/** @private */
	constructor(private readonly _data: PubSubCommerceMessageData, twitchClient: TwitchClient) {
		this._twitchClient = twitchClient;
	}

	/**
	 * The name of the bought article.
	 */
	get itemName() {
		return this._data.display_name;
	}

	/**
	 * The description of the bought article.
	 */
	get itemDescription() {
		return this._data.item_description;
	}

	/**
	 * The URL to an image of the bought article.
	 */
	get itemImageUrl() {
		return this._data.item_image_url;
	}

	/**
	 * Whether the purchase supports the channel.
	 */
	get supportsChannel() {
		return this._data.supports_channel;
	}

	/**
	 * The message that was sent with the purchase.
	 */
	get messageText() {
		return this._data.purchase_message.message;
	}

	/**
	 * The ID of the user who bought the item.
	 */
	get userId() {
		return this._data.user_id;
	}

	/**
	 * The name of the user who bought the item.
	 */
	get userName() {
		return this._data.user_name;
	}

	/**
	 * Retrieves more data about the user.
	 */
	async getUser(): Promise<HelixUser> {
		return this._twitchClient.helix.users.getUserById(this._data.user_id);
	}
}
