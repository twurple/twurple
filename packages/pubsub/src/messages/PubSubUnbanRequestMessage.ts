import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import { type PubSubUnbanRequestMessageData, type PubSubUnbanRequestType } from './PubSubUnbanRequestMessage.external';

/**
 * A message that informs about an approved or denied unban request in a channel.
 */
@rtfm<PubSubUnbanRequestMessage>('pubsub', 'PubSubUnbanRequestMessage', 'userId')
export class PubSubUnbanRequestMessage extends DataObject<PubSubUnbanRequestMessageData> {
	constructor(data: PubSubUnbanRequestMessageData, private readonly _channelId: string) {
		super(data);
	}

	/**
	 * The ID of the channel where the action was performed.
	 */
	get channelId(): string {
		return this._channelId;
	}

	/**
	 * The type of the unban request action.
	 */
	get type(): PubSubUnbanRequestType {
		return this[rawDataSymbol].data.moderation_action;
	}

	/**
	 * The ID of the moderator that performed the action.
	 */
	get userId(): string {
		return this[rawDataSymbol].data.created_by_id;
	}

	/**
	 * The name of the moderator that performed the action.
	 */
	get userName(): string {
		return this[rawDataSymbol].data.created_by_login;
	}

	/**
	 * The note that the moderator left during the resolution of the request.
	 */
	get moderatorMessage(): string {
		return this[rawDataSymbol].data.moderator_message;
	}

	/**
	 * The ID of the user that requested unban.
	 */
	get targetUserId(): string {
		return this[rawDataSymbol].data.target_user_id;
	}

	/**
	 * The name of the user that requested unban.
	 */
	get targetUserName(): string {
		return this[rawDataSymbol].data.target_user_login;
	}
}
