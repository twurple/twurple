import { NonEnumerable } from '../../Toolkit/Decorators/NonEnumerable';
import TwitchClient from '../../TwitchClient';
import ChatBadgeSet, { ChatBadgeSetData } from './ChatBadgeSet';

/** @private */
export interface ChatBadgeListData {
	badge_sets: Record<string, ChatBadgeSetData>;
}

/**
 * A list of badge sets.
 */
export default class ChatBadgeList {
	/** @private */
	@NonEnumerable protected readonly _client: TwitchClient;

	/** @private */
	constructor(private readonly _data: ChatBadgeListData, client: TwitchClient) {
		this._client = client;
	}

	/**
	 * Names of all badge sets in the list.
	 */
	get badgeSetNames() {
		if (!('badge_sets' in this._data)) {
			return [];
		}
		return Object.keys(this._data.badge_sets);
	}

	/**
	 * Gets a specific badge set by name.
	 *
	 * @param name The name of the badge set.
	 */
	getBadgeSet(name: string) {
		return new ChatBadgeSet(this._data.badge_sets[name], this._client);
	}

	/** @private */
	_merge(additionalData: ChatBadgeList | ChatBadgeListData) {
		if (additionalData instanceof ChatBadgeList) {
			additionalData = additionalData._data;
		}
		return new ChatBadgeList({ ...this._data, ...additionalData }, this._client);
	}
}
