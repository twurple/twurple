import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import { type HelixEmoteData, type HelixEmoteImageScale } from '../../../interfaces/helix/chat.external';

/**
 * A Twitch emote.
 */
@rtfm<HelixEmote>('api', 'HelixEmote', 'id')
export class HelixEmote extends DataObject<HelixEmoteData> {
	/**
	 * The ID of the emote.
	 */
	get id(): string {
		return this[rawDataSymbol].id;
	}

	/**
	 * The name of the emote.
	 */
	get name(): string {
		return this[rawDataSymbol].name;
	}

	/**
	 * Gets the URL of the emote image in the given scale.
	 *
	 * @param scale The scale of the image.
	 */
	getImageUrl(scale: HelixEmoteImageScale): string {
		return this[rawDataSymbol].images[`url_${scale}x` as const];
	}
}
