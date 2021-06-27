import { Enumerable } from '@d-fischer/shared-utils';
import { rtfm } from '@twurple/common';
import type { ApiClient } from '../../../ApiClient';
import type { HelixEmoteData } from './HelixEmote';
import { HelixEmote } from './HelixEmote';
import type { HelixEmoteFromSet } from './HelixEmoteFromSet';

/**
 * The subscription tier necessary to unlock an emote. 1000 means tier 1, and so on.
 */
export type HelixChannelEmoteSubscriptionTier = '1000' | '2000' | '3000';

/** @private */
export interface HelixChannelEmoteData extends HelixEmoteData {
	tier: HelixChannelEmoteSubscriptionTier | '';
	emote_type: string;
	emote_set_id: string;
}

/**
 * A Twitch Channel emote.
 *
 * @inheritDoc
 */
@rtfm<HelixChannelEmote>('api', 'HelixChannelEmote', 'id')
export class HelixChannelEmote extends HelixEmote {
	/** @private */ protected declare readonly _data: HelixChannelEmoteData;
	@Enumerable(false) private readonly _client: ApiClient;

	constructor(data: HelixChannelEmoteData, client: ApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The subscription tier necessary to unlock the emote, or null if the emote is not a subscription emote.
	 */
	get tier(): HelixChannelEmoteSubscriptionTier | null {
		return this._data.tier || null;
	}

	/**
	 * The type of the emote.
	 *
	 * There are many types of emotes that Twitch seems to arbitrarily assign. Do not rely on this value.
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
	 * Retrieves all emotes from the emote's set.
	 */
	async getAllEmotesFromSet(): Promise<HelixEmoteFromSet[]> {
		return await this._client.helix.chat.getEmotesFromSets([this._data.emote_set_id]);
	}
}
