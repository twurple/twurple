import { rawDataSymbol, rtfm } from '@twurple/common';
import { type HelixUserEmoteData } from '../../interfaces/endpoints/chat.external.js';
import { HelixEmoteBase } from './HelixEmoteBase.js';
import { Enumerable } from '@d-fischer/shared-utils';
import type { BaseApiClient } from '../../client/BaseApiClient.js';
import type { HelixEmoteFromSet } from './HelixEmoteFromSet.js';
import type { HelixUser } from '../user/HelixUser.js';

/**
 * A Twitch user emote.
 */
@rtfm<HelixUserEmote>('api', 'HelixUserEmote', 'id')
export class HelixUserEmote extends HelixEmoteBase {
	/** @internal */ declare readonly [rawDataSymbol]: HelixUserEmoteData;
	/** @internal */ @Enumerable(false) private readonly _client: BaseApiClient;

	constructor(data: HelixUserEmoteData, client: BaseApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The type of the emote.
	 *
	 * There are many types of emotes that Twitch seems to arbitrarily assign.
	 * Check the relevant values in the official documentation.
	 *
	 * @see https://dev.twitch.tv/docs/api/reference/#get-user-emotes
	 */
	get type(): string {
		return this[rawDataSymbol].emote_type;
	}

	/**
	 * The ID that identifies the emote set that the emote belongs to, or `null` if the emote is not from any set.
	 */
	get emoteSetId(): string | null {
		return this[rawDataSymbol].emote_set_id || null;
	}

	/**
	 * The ID of the broadcaster who owns the emote, or `null` if the emote has no owner, e.g. it's a global emote.
	 */
	get ownerId(): string | null {
		return this[rawDataSymbol].owner_id || null;
	}

	/**
	 * Gets all emotes from the emotes set, or `null` if emote is not from any set.
	 */
	async getAllEmotesFromSet(): Promise<HelixEmoteFromSet[] | null> {
		return this[rawDataSymbol].emote_set_id
			? await this._client.chat.getEmotesFromSets([this[rawDataSymbol].emote_set_id])
			: null;
	}

	/**
	 * Gets more information about the user that owns the emote, or `null` if the emote is not owned by a user.
	 */
	async getOwner(): Promise<HelixUser | null> {
		return this[rawDataSymbol].owner_id ? await this._client.users.getUserById(this[rawDataSymbol].owner_id) : null;
	}
}
