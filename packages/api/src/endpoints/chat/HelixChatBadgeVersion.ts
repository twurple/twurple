import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import { type HelixChatBadgeVersionData } from '../../interfaces/endpoints/chat.external.js';
import { type HelixChatBadgeScale } from '../../interfaces/endpoints/chat.input.js';

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

	/**
	 * The title of the badge.
	 */
	get title(): string {
		return this[rawDataSymbol].title;
	}

	/**
	 * The description of the badge.
	 */
	get description(): string {
		return this[rawDataSymbol].description;
	}

	/**
	 * The action to take when clicking on the badge. Set to `null` if no action is specified.
	 */
	get clickAction(): string | null {
		return this[rawDataSymbol].click_action;
	}

	/**
	 * The URL to navigate to when clicking on the badge. Set to `null` if no URL is specified.
	 */
	get clickUrl(): string | null {
		return this[rawDataSymbol].click_url;
	}
}
