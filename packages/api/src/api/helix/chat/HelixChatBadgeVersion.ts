import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import { type HelixChatBadgeVersionData } from '../../../interfaces/helix/chat.external';
import { type HelixChatBadgeScale } from '../../../interfaces/helix/chat.input';

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
		return this[rawDataSymbol][`image_url_${scale}x` as const];
	}
}
