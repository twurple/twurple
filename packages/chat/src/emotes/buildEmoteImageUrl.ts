/**
 * The possible animation settings for an emote image.
 */
export type EmoteAnimationSettings = 'default' | 'static' | 'animated';

/**
 * The possible background types to optimize the emote display for.
 */
export type EmoteBackgroundType = 'light' | 'dark';

/**
 * The possible emote size multipliers.
 */
export type EmoteSize = '1.0' | '2.0' | '3.0';

/**
 * The display settings for an emote.
 */
export interface EmoteSettings {
	/**
	 * The animation settings of the emote.
	 */
	animationSettings?: EmoteAnimationSettings;

	/**
	 * The background type of the emote.
	 */
	backgroundType?: EmoteBackgroundType;

	/**
	 * The size multiplier of the emote.
	 */
	size?: EmoteSize;
}

/**
 * Build the image URL of an emote.
 *
 * @param id The ID of the emote.
 * @param settings The display settings for the emote.
 *
 * Defaults to a dark background and regular size.
 */
export function buildEmoteImageUrl(id: string, settings: EmoteSettings = {}): string {
	const { animationSettings = 'default', backgroundType = 'dark', size = '1.0' } = settings;
	return `https://static-cdn.jtvnw.net/emoticons/v2/${id}/${animationSettings}/${backgroundType}/${size}`;
}
