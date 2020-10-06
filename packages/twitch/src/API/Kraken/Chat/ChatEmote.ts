import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient } from '../../../ApiClient';

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
