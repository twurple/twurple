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

/** @private */
export interface ChatBadgeSetData {
	versions: Record<string, ChatBadgeVersionData>;
}

/** @private */
export type ChatBadgeListData = Record<string, ChatBadgeSetData>;

/** @private */
export interface ChatBadgeResultData {
	badge_sets: ChatBadgeListData;
}
