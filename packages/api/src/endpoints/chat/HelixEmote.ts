import { rawDataSymbol, rtfm } from '@twurple/common';
import { type HelixEmoteData, type HelixEmoteImageScale } from '../../interfaces/endpoints/chat.external';
import { HelixEmoteBase } from './HelixEmoteBase';

/**
 * A Twitch emote.
 */
@rtfm<HelixEmote>('api', 'HelixEmote', 'id')
export class HelixEmote extends HelixEmoteBase {
	/** @internal */ declare readonly [rawDataSymbol]: HelixEmoteData;

	/**
	 * Gets the URL of the emote image in the given scale.
	 *
	 * @param scale The scale of the image.
	 */
	getImageUrl(scale: HelixEmoteImageScale): string {
		return this[rawDataSymbol].images[`url_${scale}x` as const];
	}
}
