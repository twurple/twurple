import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import { type PubSubChannelTermsActionMessageData } from './PubSubChannelTermsActionMessage.external';

/**
 * A message that informs about an allowed or blocked term being added or removed in a channel.
 */
@rtfm<PubSubChannelTermsActionMessage>('pubsub', 'PubSubChannelTermsActionMessage', 'userId')
export class PubSubChannelTermsActionMessage extends DataObject<PubSubChannelTermsActionMessageData> {
	/** @internal */
	constructor(data: PubSubChannelTermsActionMessageData, private readonly _channelId: string) {
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
	 * The term that was added/removed.
	 */
	get term(): string {
		return this[rawDataSymbol].data.text;
	}

	/**
	 * Whether the addition of the term originated from automod blocking a message.
	 */
	get isFromAutoMod(): boolean {
		return this[rawDataSymbol].data.from_automod;
	}

	/**
	 * The user ID of the moderator that performed the action.
	 */
	get userId(): string {
		return this[rawDataSymbol].data.requester_id;
	}

	/**
	 * The name of the moderator that performed the action.
	 */
	get userName(): string {
		return this[rawDataSymbol].data.requester_login;
	}
}
