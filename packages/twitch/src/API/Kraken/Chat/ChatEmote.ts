import { NonEnumerable } from '@d-fischer/shared-utils';
import TwitchClient from '../../../TwitchClient';

/** @private */
export interface ChatEmoteData {
	code: string;
	emoticon_set: number;
	id: number;
}

export type EmoteSize = '1.0' | '2.0' | '3.0';

/**
 * A chat emote.
 */
export default class ChatEmote {
	/** @private */
	@NonEnumerable protected readonly _client: TwitchClient;

	/** @private */
	constructor(private readonly _data: ChatEmoteData, client: TwitchClient) {
		this._client = client;
	}

	/**
	 * The emote ID.
	 */
	get id() {
		return this._data.id;
	}

	/**
	 * The emote code, i.e. how you write it in chat.
	 */
	get code() {
		return this._data.code;
	}

	/**
	 * The ID of the emote set.
	 */
	get setId() {
		return this._data.emoticon_set;
	}

	/**
	 * Build URL for the emote image.
	 *
	 * @param size pixel density of the emote image
	 */
	getUrl(size: EmoteSize) {
		return `https://static-cdn.jtvnw.net/emoticons/v1/${this.id}/${size}`;
	}
}
