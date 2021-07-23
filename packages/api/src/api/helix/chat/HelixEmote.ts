import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';

/** @private */
export interface HelixEmoteImageData {
	url_1x: string;
	url_2x: string;
	url_4x: string;
}

/** @private */
export type HelixEmoteImageScale = 1 | 2 | 4;

/** @private */
export interface HelixEmoteData {
	id: string;
	name: string;
	images: HelixEmoteImageData;
}

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
