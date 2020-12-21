import { Enumerable } from '@d-fischer/shared-utils';
import { rtfm } from 'twitch-common';

/** @private */
export interface ChatEmoteData {
	code: string;
	emoticon_set: number;
	id: number;
}

/**
 * A chat emote.
 */
@rtfm<ChatEmote>('twitch', 'ChatEmote', 'id')
export class ChatEmote {
	@Enumerable(false) private readonly _data: ChatEmoteData;

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
	 * The ID of the emote set.
	 */
	get setId(): number {
		return this._data.emoticon_set;
	}
}
