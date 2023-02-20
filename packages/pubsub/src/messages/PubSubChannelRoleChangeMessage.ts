import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import {
	type PubSubChannelRoleChangeMessageData,
	type PubSubChannelRoleChangeType
} from './PubSubChannelRoleChangeMessage.external';

/**
 * A message that informs about a role change (i.e. vip/mod status being added/removed) in a channel.
 */
@rtfm<PubSubChannelRoleChangeMessage>('pubsub', 'PubSubChannelRoleChangeMessage', 'userId')
export class PubSubChannelRoleChangeMessage extends DataObject<PubSubChannelRoleChangeMessageData> {
	/** @private */
	constructor(data: PubSubChannelRoleChangeMessageData, private readonly _channelId: string) {
		super(data);
	}

	/**
	 * The ID of the channel where the action was performed.
	 */
	get channelId(): string {
		return this._channelId;
	}

	/**
	 * The type of the role change.
	 */
	get type(): PubSubChannelRoleChangeType {
		return this[rawDataSymbol].type;
	}

	/**
	 * The ID of the user that performed the action.
	 */
	get userId(): string {
		return this[rawDataSymbol].data.created_by_user_id;
	}

	/**
	 * The name of the user that performed the action.
	 */
	get userName(): string {
		return this[rawDataSymbol].data.created_by;
	}

	/**
	 * The ID of the user whose role was changed.
	 */
	get targetUserId(): string {
		return this[rawDataSymbol].data.target_user_id;
	}

	/**
	 * The name of the user whose role was changed.
	 */
	get targetUserName(): string {
		return this[rawDataSymbol].data.target_user_login;
	}
}
