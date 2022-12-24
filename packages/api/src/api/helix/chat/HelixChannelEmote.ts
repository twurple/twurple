import { Enumerable } from '@d-fischer/shared-utils';
import { rawDataSymbol, rtfm } from '@twurple/common';
import { type BaseApiClient } from '../../../client/BaseApiClient';
import {
	type HelixChannelEmoteData,
	type HelixChannelEmoteSubscriptionTier
} from '../../../interfaces/helix/chat.external';
import { HelixEmote } from './HelixEmote';
import type { HelixEmoteFromSet } from './HelixEmoteFromSet';

/**
 * A Twitch Channel emote.
 *
 * @inheritDoc
 */
@rtfm<HelixChannelEmote>('api', 'HelixChannelEmote', 'id')
export class HelixChannelEmote extends HelixEmote {
	/** @private */ declare readonly [rawDataSymbol]: HelixChannelEmoteData;
	@Enumerable(false) private readonly _client: BaseApiClient;

	constructor(data: HelixChannelEmoteData, client: BaseApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The subscription tier necessary to unlock the emote, or null if the emote is not a subscription emote.
	 */
	get tier(): HelixChannelEmoteSubscriptionTier | null {
		return this[rawDataSymbol].tier || null;
	}

	/**
	 * The type of the emote.
	 *
	 * There are many types of emotes that Twitch seems to arbitrarily assign. Do not rely on this value.
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
	 * Retrieves all emotes from the emote's set.
	 */
	async getAllEmotesFromSet(): Promise<HelixEmoteFromSet[]> {
		return await this._client.chat.getEmotesFromSets([this[rawDataSymbol].emote_set_id]);
	}
}
