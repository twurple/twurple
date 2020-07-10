import { Enumerable } from '@d-fischer/shared-utils';
import { ApiClient } from 'twitch';

export interface PubSubChatModActionMessageContent {
	type: string;
	moderation_action: string;
	args: string[];
	created_by: string;
	created_by_user_id: string;
}

export interface PubSubChatModActionMessageData {
	data: PubSubChatModActionMessageContent;
}

/**
 * A message that informs about a moderation action being performed in a channel.
 */
export class PubSubChatModActionMessage {
	@Enumerable(false) private readonly _apiClient: ApiClient;

	/** @private */
	constructor(
		private readonly _data: PubSubChatModActionMessageData,
		private readonly _channelId: string,
		apiClient: ApiClient
	) {
		this._apiClient = apiClient;
	}

	/**
	 * The ID of the channel where the action was performed.
	 */
	get channelId() {
		return this._channelId;
	}

	/**
	 * Retrieves more data about the channel where the action was performed.
	 *
	 * @deprecated Use {@HelixUserAPI#getUserById} instead.
	 */
	async getChannel() {
		return this._apiClient.helix.users.getUserById(this._channelId);
	}

	/**
	 * The type of the message.
	 */
	get type() {
		return this._data.data.type;
	}

	/**
	 * The action that was performed.
	 */
	get action() {
		return this._data.data.moderation_action;
	}

	/**
	 * The arguments given to the action.
	 */
	get args() {
		return this._data.data.args;
	}

	/**
	 * The user ID of the moderator that performed the action.
	 */
	get userId() {
		return this._data.data.created_by_user_id;
	}

	/**
	 * The name of the moderator that performed the action.
	 */
	get userName() {
		return this._data.data.created_by;
	}

	/**
	 * Retrieves more data about the user that performed the action.
	 *
	 * @deprecated Use {@HelixUserAPI#getUserById} instead.
	 */
	async getUser() {
		return this._apiClient.helix.users.getUserById(this._data.data.created_by_user_id);
	}
}
