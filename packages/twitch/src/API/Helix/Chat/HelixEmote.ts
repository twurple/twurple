import { Enumerable } from '@d-fischer/shared-utils';
import { rtfm } from 'twitch-common';

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
@rtfm<HelixEmote>('twitch', 'HelixEmote', 'id')
export class HelixEmote {
	/** @private */ @Enumerable(false) protected readonly _data: HelixEmoteData;

	/** @private */
	constructor(data: HelixEmoteData) {
		this._data = data;
	}

	/**
	 * The ID of the emote.
	 */
	get id(): string {
		return this._data.id;
	}

	/**
	 * The name of the emote.
	 */
	get name(): string {
		return this._data.name;
	}

	/**
	 * Gets the URL of the emote image in the given scale.
	 *
	 * @param scale The scale of the image.
	 */
	getImageUrl(scale: HelixEmoteImageScale): string {
		// eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
		return this._data.images[`url_${scale}x` as const];
	}
}
