import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import type { ChatBadgeSetData } from './ChatBadgeSet';
import { ChatBadgeSet } from './ChatBadgeSet';

/** @private */
export type ChatBadgeListData = Record<string, ChatBadgeSetData>;

/**
 * A list of badge sets.
 */
@rtfm('api', 'ChatBadgeList')
export class ChatBadgeList extends DataObject<ChatBadgeListData> {
	/**
	 * Names of all badge sets in the list.
	 */
	get badgeSetNames(): string[] {
		return Object.keys(this[rawDataSymbol]);
	}

	/**
	 * Gets a specific badge set by name.
	 *
	 * @param name The name of the badge set.
	 */
	getBadgeSet(name: string): ChatBadgeSet {
		return new ChatBadgeSet(this[rawDataSymbol][name]);
	}

	/** @private */
	_merge(additionalData: ChatBadgeList | ChatBadgeListData): ChatBadgeList {
		if (additionalData instanceof ChatBadgeList) {
			additionalData = additionalData[rawDataSymbol];
		}
		return new ChatBadgeList({ ...this[rawDataSymbol], ...additionalData });
	}
}
