import { Enumerable } from '@d-fischer/shared-utils';
import { rtfm } from 'twitch-common';
import type { ChatBadgeSetData } from './ChatBadgeSet';
import { ChatBadgeSet } from './ChatBadgeSet';

/** @private */
export type ChatBadgeListData = Record<string, ChatBadgeSetData>;

/**
 * A list of badge sets.
 */
@rtfm('twitch', 'ChatBadgeList')
export class ChatBadgeList {
	@Enumerable(false) private readonly _data: ChatBadgeListData;

	/** @private */
	constructor(data: ChatBadgeListData) {
		this._data = data;
	}

	/**
	 * Names of all badge sets in the list.
	 */
	get badgeSetNames(): string[] {
		return Object.keys(this._data);
	}

	/**
	 * Gets a specific badge set by name.
	 *
	 * @param name The name of the badge set.
	 */
	getBadgeSet(name: string): ChatBadgeSet {
		return new ChatBadgeSet(this._data[name]);
	}

	/** @private */
	_merge(additionalData: ChatBadgeList | ChatBadgeListData): ChatBadgeList {
		if (additionalData instanceof ChatBadgeList) {
			additionalData = additionalData._data;
		}
		return new ChatBadgeList({ ...this._data, ...additionalData });
	}
}
