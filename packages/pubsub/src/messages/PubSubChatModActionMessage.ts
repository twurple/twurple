import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';

/** @private */
export interface PubSubChatModActionMessageContent {
	type: string;
	moderation_action: string;
	args: string[];
	created_by: string;
	created_by_user_id: string;
}

/** @private */
export interface PubSubChatModActionMessageData {
	data: PubSubChatModActionMessageContent;
}

/**
 * A message that informs about a moderation action being performed in a channel.
 */
@rtfm<PubSubChatModActionMessage>('pubsub', 'PubSubChatModActionMessage', 'userId')
export class PubSubChatModActionMessage extends DataObject<PubSubChatModActionMessageData> {
	/** @private */
	constructor(data: PubSubChatModActionMessageData, private readonly _channelId: string) {
		super(data);
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
		return this[rawDataSymbol].data.type;
	}

	/**
	 * The action that was performed.
	 */
	get action(): string {
		return this[rawDataSymbol].data.moderation_action;
	}

	/**
	 * The arguments given to the action.
	 */
	get args(): string[] {
		return this[rawDataSymbol].data.args;
	}

	/**
	 * The user ID of the moderator that performed the action.
	 */
	get userId(): string {
		return this[rawDataSymbol].data.created_by_user_id;
	}

	/**
	 * The name of the moderator that performed the action.
	 */
	get userName(): string {
		return this[rawDataSymbol].data.created_by;
	}
}
