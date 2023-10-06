import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import {
	type HelixEmoteData,
	type HelixEmoteFormat,
	type HelixEmoteImageScale,
	type HelixEmoteScale,
	type HelixEmoteThemeMode,
} from '../../interfaces/endpoints/chat.external';

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
	 * The formats that the emote is available in.
	 */
	get formats(): HelixEmoteFormat[] {
		return this[rawDataSymbol].format;
	}

	/**
	 * The scales that the emote is available in.
	 */
	get scales(): HelixEmoteScale[] {
		return this[rawDataSymbol].scale;
	}

	/**
	 * The theme modes that the emote is available in.
	 */
	get themeModes(): HelixEmoteThemeMode[] {
		return this[rawDataSymbol].theme_mode;
	}

	/**
	 * Gets the URL of the emote image in the given scale.
	 *
	 * @param scale The scale of the image.
	 */
	getImageUrl(scale: HelixEmoteImageScale): string {
		return this[rawDataSymbol].images[`url_${scale}x` as const];
	}

	/**
	 * Gets the URL of the emote image in static format at the given scale and theme mode, or null if a static emote image at that scale/theme mode doesn't exist.
	 *
	 * @param scale The scale of the image.
	 * @param themeMode The theme mode of the image, either `light` or `dark`.
	 */
	getStaticImageUrl(scale: HelixEmoteScale = '1.0', themeMode: HelixEmoteThemeMode = 'light'): string | null {
		if (this[rawDataSymbol].format.includes('static') && this[rawDataSymbol].scale.includes(scale)) {
			return this.getFormattedImageUrl(scale, 'static', themeMode);
		}

		return null;
	}

	/**
	 * Gets the URL of the emote image in animated format at the given scale and theme mode, or null if an animated emote image at that scale/theme mode doesn't exist.
	 *
	 * @param scale The scale of the image.
	 * @param themeMode The theme mode of the image, either `light` or `dark`.
	 */
	getAnimatedImageUrl(scale: HelixEmoteScale = '1.0', themeMode: HelixEmoteThemeMode = 'light'): string | null {
		if (this[rawDataSymbol].format.includes('animated') && this[rawDataSymbol].scale.includes(scale)) {
			return this.getFormattedImageUrl(scale, 'animated', themeMode);
		}

		return null;
	}

	/**
	 * Gets the URL of the emote image in the given scale, format, and theme mode.
	 *
	 * @param scale The scale of the image, either `1.0` (small), `2.0` (medium), or `3.0` (large).
	 * @param format The format of the image, either `static` or `animated`.
	 * @param themeMode The theme mode of the image, either `light` or `dark`.
	 */
	getFormattedImageUrl(
		scale: HelixEmoteScale = '1.0',
		format: HelixEmoteFormat = 'static',
		themeMode: HelixEmoteThemeMode = 'light',
	): string {
		return `https://static-cdn.jtvnw.net/emoticons/v2/${this[rawDataSymbol].id}/${format}/${themeMode}/${scale}`;
	}
}
