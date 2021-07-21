import { Enumerable } from '@d-fischer/shared-utils';
import { rawDataSymbol, rtfm } from '@twurple/common';
import type { ApiClient } from '../../../ApiClient';
import type { HelixUser } from '../user/HelixUser';
import type { HelixEmoteData } from './HelixEmote';
import { HelixEmote } from './HelixEmote';

/** @private */
export interface HelixEmoteFromSetData extends HelixEmoteData {
	emote_type: string;
	emote_set_id: string;
	owner_id: string;
}

/**
 * A Twitch Channel emote.
 *
 * @inheritDoc
 */
@rtfm<HelixEmoteFromSet>('api', 'HelixEmoteFromSet', 'id')
export class HelixEmoteFromSet extends HelixEmote {
	/** @private */ declare readonly [rawDataSymbol]: HelixEmoteFromSetData;
	@Enumerable(false) private readonly _client: ApiClient;

	constructor(data: HelixEmoteFromSetData, client: ApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The type of the emote.
	 *
	 * Known values are: `subscriptions`, `bitstier`, `follower`, `rewards`, `globals`, `smilies`, `prime`, `limitedtime`.
	 *
	 * This list may be non-exhaustive.
	 */
	get type(): string {
		return this[rawDataSymbol].emote_type;
	}

	/**
	 * The ID of the emote set the emote is part of.
	 */
	get emoteSetId(): string {
		return this[rawDataSymbol].emote_set_id;
	}

	/**
	 * The ID of the user that owns the emote, or null if the emote is not owned by a user.
	 */
	get ownerId(): string | null {
		switch (this[rawDataSymbol].owner_id) {
			case '0':
			case 'twitch': {
				return null;
			}

			default: {
				return this[rawDataSymbol].owner_id;
			}
		}
	}

	/**
	 * Retrieves more info about the user that owns the emote, or null if the emote is not owned by a user.
	 */
	async getOwner(): Promise<HelixUser | null> {
		switch (this[rawDataSymbol].owner_id) {
			case '0':
			case 'twitch': {
				return null;
			}

			default: {
				return await this._client.users.getUserById(this[rawDataSymbol].owner_id);
			}
		}
	}
}
