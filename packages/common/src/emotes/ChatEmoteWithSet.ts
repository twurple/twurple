import { rtfm } from '../rtfm';
import type { ChatEmoteData } from './ChatEmote';
import { ChatEmote } from './ChatEmote';

/** @private */
export interface ChatEmoteWithSetData extends ChatEmoteData {
	emoticon_set: number;
}

/**
 * A chat emote from an emote set.
 *
 * @inheritDoc
 */
@rtfm<ChatEmoteWithSet>('common', 'ChatEmoteWithSet', 'id')
export class ChatEmoteWithSet extends ChatEmote {
	/** @private */ protected declare readonly _data: ChatEmoteWithSetData;

	/**
	 * The ID of the emote set.
	 */
	get setId(): number {
		return this._data.emoticon_set;
	}
}
