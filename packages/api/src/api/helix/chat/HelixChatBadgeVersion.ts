import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';

export type HelixChatBadgeScale = 1 | 2 | 4;

/** @private */
export interface HelixChatBadgeVersionData {
	id: string;
	image_url_1x: string;
	image_url_2x: string;
	image_url_4x: string;
}

/**
 * A version of a chat badge.
 */
@rtfm<HelixChatBadgeVersion>('api', 'HelixChatBadgeVersion', 'id')
export class HelixChatBadgeVersion extends DataObject<HelixChatBadgeVersionData> {
	/**
	 * The badge version ID.
	 */
	get id(): string {
		return this[rawDataSymbol].id;
	}

	/**
	 * Gets an image URL for the given scale.
	 *
	 * @param scale The scale of the badge image.
	 */
	getImageUrl(scale: HelixChatBadgeScale): string {
		// eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
		return this[rawDataSymbol][`image_url_${scale}x` as const];
	}
}
