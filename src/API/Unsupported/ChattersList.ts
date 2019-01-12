import { Cacheable, CachedGetter } from '../../Toolkit/Decorators';
import ArrayTools from '../../Toolkit/ArrayTools';

/** @private */
export interface ChattersListData {
	chatter_count: number;
	chatters: Record<string, string[]>;
}

/**
 * A list of chatters in a Twitch chat.
 */
@Cacheable
export default class ChattersList {
	/** @private */
	constructor(private readonly _data: ChattersListData) {
	}

	/**
	 * A list of user names of all chatters in the chat.
	 */
	@CachedGetter()
	get allChatters() {
		return ArrayTools.flatten(Object.values(this._data.chatters));
	}

	/**
	 * A map of user names of all chatters in the chat, mapped to their status in the channel.
	 */
	@CachedGetter()
	get allChattersWithStatus() {
		return new Map(ArrayTools.flatten(Object.entries(this._data.chatters).map(([status, names]) => names.map<[string, string]>(name => [name, status]))));
	}
}
