import { Enumerable } from '@d-fischer/shared-utils';
import type { HelixUserType } from '@twurple/common';
import { rtfm } from '@twurple/common';
import type { PubSubChatMessageBadge, PubSubChatMessageEmote } from './PubSubMessage';

/** @private */
export interface PubSubWhisperTags {
	login: string;
	display_name: string;
	color: string;
	user_type: HelixUserType;
	emotes: PubSubChatMessageEmote[];
	badges: PubSubChatMessageBadge[];
}

/** @private */
export interface PubSubWhisperRecipient {
	id: number; // Twitch pls...
	username: string;
	display_name: string;
	color: string;
	user_type: HelixUserType;
	badges: PubSubChatMessageBadge[];
	profile_image: string | null;
}

/** @private */
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

/** @private */
export interface PubSubWhisperMessageData {
	type: 'whisper_received';
	data: string;
	data_object: PubSubWhisperMessageContent;
}

/**
 * A message informing about a whisper being received from another user.
 */
@rtfm<PubSubWhisperMessage>('twitch-pubsub-client', 'PubSubWhisperMessage', 'senderId')
export class PubSubWhisperMessage {
	@Enumerable(false) private readonly _data: PubSubWhisperMessageData;

	/** @private */
	constructor(data: PubSubWhisperMessageData) {
		this._data = data;
	}

	/**
	 * The message text.
	 */
	get text(): string {
		return this._data.data_object.body;
	}

	/**
	 * The ID of the user who sent the whisper.
	 */
	get senderId(): string {
		return this._data.data_object.from_id.toString();
	}

	/**
	 * The name of the user who sent the whisper.
	 */
	get senderName(): string {
		return this._data.data_object.tags.login;
	}

	/**
	 * The display name of the user who sent the whisper.
	 */
	get senderDisplayName(): string {
		return this._data.data_object.tags.display_name;
	}
}
