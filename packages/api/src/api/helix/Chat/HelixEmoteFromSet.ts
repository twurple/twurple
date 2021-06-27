import { Enumerable } from '@d-fischer/shared-utils';
import { rtfm } from 'twitch-common';
import type { ApiClient } from '../../../ApiClient';
import type { HelixUser } from '../User/HelixUser';
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
@rtfm<HelixEmoteFromSet>('twitch', 'HelixEmoteFromSet', 'id')
export class HelixEmoteFromSet extends HelixEmote {
	/** @private */ protected declare readonly _data: HelixEmoteFromSetData;
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
		return this._data.emote_type;
	}

	/**
	 * The ID of the emote set the emote is part of.
	 */
	get emoteSetId(): string {
		return this._data.emote_set_id;
	}

	/**
	 * The ID of the user that owns the emote, or null if the emote is not owned by a user.
	 */
	get ownerId(): string | null {
		switch (this._data.owner_id) {
			case '0':
			case 'twitch': {
				return null;
			}

			default: {
				return this._data.owner_id;
			}
		}
	}

	/**
	 * Retrieves more info about the user that owns the emote, or null if the emote is not owned by a user.
	 */
	async getOwner(): Promise<HelixUser | null> {
		switch (this._data.owner_id) {
			case '0':
			case 'twitch': {
				return null;
			}

			default: {
				return this._client.helix.users.getUserById(this._data.owner_id);
			}
		}
	}
}
