import Twitch from '../../';
import { NonEnumerable } from '../../Toolkit/Decorators';
import HelixUser, { HelixUserType } from '../../API/Helix/User/HelixUser';
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

export default class PubSubWhisperMessage {
	@NonEnumerable private readonly _twitchClient: Twitch;

	constructor(private readonly _data: PubSubWhisperMessageData, twitchClient: Twitch) {
		this._twitchClient = twitchClient;
	}

	get text() {
		return this._data.data_object.body;
	}

	get senderId() {
		return this._data.data_object.from_id.toString();
	}

	get senderName() {
		return this._data.data_object.tags.login;
	}

	get senderDisplayName() {
		return this._data.data_object.tags.display_name;
	}

	async getSender(): Promise<HelixUser> {
		return this._twitchClient.helix.users.getUserById(this._data.data_object.from_id.toString());
	}
}
