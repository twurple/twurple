import { Cacheable, Cached, CachedGetter } from '@d-fischer/cache-decorators';
import { Enumerable } from '@d-fischer/shared-utils';
import type { ChatEmoteWithSetData } from '@twurple/common';
import { ChatEmoteWithSet, rtfm } from '@twurple/common';

/**
 * A list of emotes.
 */
@Cacheable
@rtfm('api', 'ChatEmoteList')
export class ChatEmoteList {
	@Enumerable(false) private readonly _data: ChatEmoteWithSetData[];

	/** @private */
	constructor(data: ChatEmoteWithSetData[]) {
		this._data = data;
	}

	/**
	 * A list of all emotes in the list.
	 */
	@CachedGetter()
	get emotes(): ChatEmoteWithSet[] {
		return this._data.map(emote => new ChatEmoteWithSet(emote));
	}

	/**
	 * Gets all emotes from the list that are from a given emote set.
	 *
	 * @param setId
	 */
	@Cached()
	getAllFromSet(setId: number): ChatEmoteWithSet[] {
		return this._data.filter(emote => emote.emoticon_set === setId).map(emote => new ChatEmoteWithSet(emote));
	}

	/**
	 * Finds a single emote by its ID.
	 *
	 * @param id
	 */
	@Cached()
	getById(id: number): ChatEmoteWithSet | null {
		const data = this._data.find(emote => emote.id === id);

		return data ? new ChatEmoteWithSet(data) : null;
	}
}
