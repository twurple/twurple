import { Enumerable } from '@d-fischer/shared-utils';
import { rtfm } from 'twitch-common';

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
@rtfm<PubSubChatModActionMessage>('twitch-pubsub-client', 'PubSubChatModActionMessage', 'userId')
export class PubSubChatModActionMessage {
	@Enumerable(false) private readonly _data: PubSubChatModActionMessageData;

	/** @private */
	constructor(data: PubSubChatModActionMessageData, private readonly _channelId: string) {
		this._data = data;
	}

	/**
	 * The ID of the channel where the action was performed.
	 */
	get channelId(): string {
		return this._channelId;
	}

	/**
	 * The type of the message.
	 */
	get type(): string {
		return this._data.data.type;
	}

	/**
	 * The action that was performed.
	 */
	get action(): string {
		return this._data.data.moderation_action;
	}

	/**
	 * The arguments given to the action.
	 */
	get args(): string[] {
		return this._data.data.args;
	}

	/**
	 * The user ID of the moderator that performed the action.
	 */
	get userId(): string {
		return this._data.data.created_by_user_id;
	}

	/**
	 * The name of the moderator that performed the action.
	 */
	get userName(): string {
		return this._data.data.created_by;
	}
}
