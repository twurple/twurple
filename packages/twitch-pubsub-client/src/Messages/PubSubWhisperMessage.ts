import { Enumerable } from '@d-fischer/shared-utils';
import { ApiClient, HelixUserType } from 'twitch';
import { PubSubChatMessageBadge, PubSubChatMessageEmote } from './PubSubMessage';

export interface PubSubWhisperTags {
	login: string;
	display_name: string;
	color: string;
	user_type: HelixUserType;
	emotes: PubSubChatMessageEmote[];
	badges: PubSubChatMessageBadge[];
}

export interface PubSubWhisperRecipient {
	id: number; // Twitch pls...
	username: string;
	display_name: string;
	color: string;
	user_type: HelixUserType;
	badges: PubSubChatMessageBadge[];
	profile_image: string | null;
}

export interface PubSubWhisperMessageContent {
	id: number;
	message_id: string;
	thread_id: string;
	body: string;
	sent_ts: number;
	from_id: number; // Twitch pls...
	tags: PubSubWhisperTags;
	recipient: PubSubWhisperRecipient;
}

export interface PubSubWhisperMessageData {
	type: 'whisper_received';
	data: string;
	data_object: PubSubWhisperMessageContent;
}

/**
 * A message informing about a whisper being received from another user.
 */
export class PubSubWhisperMessage {
	@Enumerable(false) private readonly _apiClient: ApiClient;

	/** @private */
	constructor(private readonly _data: PubSubWhisperMessageData, apiClient: ApiClient) {
		this._apiClient = apiClient;
	}

	/**
	 * The message text.
	 */
	get text() {
		return this._data.data_object.body;
	}

	/**
	 * The ID of the user who sent the whisper.
	 */
	get senderId() {
		return this._data.data_object.from_id.toString();
	}

	/**
	 * The name of the user who sent the whisper.
	 */
	get senderName() {
		return this._data.data_object.tags.login;
	}

	/**
	 * The display name of the user who sent the whisper.
	 */
	get senderDisplayName() {
		return this._data.data_object.tags.display_name;
	}

	/**
	 * Retrieves more data about the user who sent the whisper.
	 *
	 * @deprecated Use {@HelixUserAPI#getUserById} instead.
	 */
	async getSender() {
		return this._apiClient.helix.users.getUserById(this._data.data_object.from_id.toString());
	}
}
