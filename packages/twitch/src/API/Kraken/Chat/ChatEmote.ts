import { Enumerable } from '@d-fischer/shared-utils';
import { ApiClient } from '../../../ApiClient';

/** @private */
export interface ChatEmoteData {
	code: string;
	emoticon_set: number;
	id: number;
}

/**
 * A chat emote.
 */
export class ChatEmote {
	/** @private */
	@Enumerable(false) protected readonly _client: ApiClient;

	/** @private */
	constructor(private readonly _data: ChatEmoteData, client: ApiClient) {
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
}
