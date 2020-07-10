import { Enumerable } from '@d-fischer/shared-utils';
import { ApiClient } from '../../ApiClient';

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
export class ChatBadgeVersion {
	/** @private */
	@Enumerable(false) protected readonly _client: ApiClient;

	/** @private */
	constructor(private readonly _data: ChatBadgeVersionData, client: ApiClient) {
		this._client = client;
	}

	/**
	 * The action to execute when the badge is clicked.
	 */
	get clickAction() {
		return this._data.click_action;
	}

	/**
	 * The URL to visit when the badge is clicked.
	 *
	 * Only applies if clickAction === 'visit_url'.
	 */
	get clickUrl() {
		return this._data.click_url;
	}

	/**
	 * The description of the badge.
	 */
	get description() {
		return this._data.description;
	}

	/**
	 * Gets an image URL for the given scale.
	 *
	 * @param scale The scale of the badge image.
	 */
	getImageUrl(scale: ChatBadgeScale): string {
		return this._data[`image_url_${scale}x`];
	}

	/**
	 * The title of the badge.
	 */
	get title() {
		return this._data.title;
	}
}
