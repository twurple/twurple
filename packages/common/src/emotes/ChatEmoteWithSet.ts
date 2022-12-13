import { rawDataSymbol } from '../DataObject';
import { rtfm } from '../rtfm';
import { ChatEmote } from './ChatEmote';
import { type ChatEmoteWithSetData } from './ChatEmoteWithSet.external';

/**
 * A chat emote from an emote set.
 *
 * @inheritDoc
 */
@rtfm<ChatEmoteWithSet>('common', 'ChatEmoteWithSet', 'id')
export class ChatEmoteWithSet extends ChatEmote {
	/** @private */ declare readonly [rawDataSymbol]: ChatEmoteWithSetData;

	/**
	 * The ID of the emote set.
	 */
	get setId(): number {
		return this[rawDataSymbol].emoticon_set;
	}
}
