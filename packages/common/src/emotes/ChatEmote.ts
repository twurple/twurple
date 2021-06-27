import { Enumerable } from '@d-fischer/shared-utils';
import { rtfm } from '../rtfm';

/** @private */
export interface ChatEmoteData {
	code: string;
	id: number;
}

/**
 * The different possible emote size identifiers.
 */
export type EmoteSize = '1.0' | '2.0' | '3.0';

/**
 * A chat emote.
 */
@rtfm<ChatEmote>('common', 'ChatEmote', 'id')
export class ChatEmote {
	/** @private */
	@Enumerable(false) protected readonly _data: ChatEmoteData;

	/** @private */
	constructor(data: ChatEmoteData) {
		this._data = data;
	}

	/**
	 * The emote ID.
	 */
	get id(): number {
		return this._data.id;
	}

	/**
	 * The emote code, i.e. how you write it in chat.
	 */
	get code(): string {
		return this._data.code;
	}

	/**
	 * Build the URL pointing to the emote image.
	 *
	 * @param size The pixel density of the emote image.
	 */
	getUrl(size: EmoteSize): string {
		return `https://static-cdn.jtvnw.net/emoticons/v1/${this.id}/${size}`;
	}
}
