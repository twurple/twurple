import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';

/** @private */
export interface ChatBadgeVersionData {
	click_action: string;
	click_url: string;
	description: string;
	image_url_1x: string;
	image_url_2x: string;
	image_url_4x: string;
	title: string;
}

/** @private */
export type ChatBadgeScale = 1 | 2 | 4;

/**
 * A version of a badge.
 */
@rtfm('api', 'ChatBadgeVersion')
export class ChatBadgeVersion extends DataObject<ChatBadgeVersionData> {
	/**
	 * The action to execute when the badge is clicked.
	 */
	get clickAction(): string {
		return this[rawDataSymbol].click_action;
	}

	/**
	 * The URL to visit when the badge is clicked.
	 *
	 * Only applies if clickAction === 'visit_url'.
	 */
	get clickUrl(): string {
		return this[rawDataSymbol].click_url;
	}

	/**
	 * The description of the badge.
	 */
	get description(): string {
		return this[rawDataSymbol].description;
	}

	/**
	 * Gets an image URL for the given scale.
	 *
	 * @param scale The scale of the badge image.
	 */
	getImageUrl(scale: ChatBadgeScale): string {
		return this[rawDataSymbol][`image_url_${scale}x` as const];
	}

	/**
	 * The title of the badge.
	 */
	get title(): string {
		return this[rawDataSymbol].title;
	}
}
