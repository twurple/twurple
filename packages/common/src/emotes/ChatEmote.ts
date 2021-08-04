import { DataObject, rawDataSymbol } from '../DataObject';
import { rtfm } from '../rtfm';

/** @private */
export interface ChatEmoteData {
	code: string;
	id: string;
}

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
	animationSettings: EmoteAnimationSettings;

	/**
	 * The background type of the emote.
	 */
	backgroundType: EmoteBackgroundType;

	/**
	 * The size multiplier of the emote.
	 */
	size: EmoteSize;
}

/**
 * A chat emote.
 */
@rtfm<ChatEmote>('common', 'ChatEmote', 'id')
export class ChatEmote extends DataObject<ChatEmoteData> {
	/**
	 * The emote ID.
	 */
	get id(): string {
		return this[rawDataSymbol].id;
	}

	/**
	 * The emote code, i.e. how you write it in chat.
	 */
	get code(): string {
		return this[rawDataSymbol].code;
	}

	/**
	 * Build the URL pointing to the emote image.
	 *
	 * @param settings The display settings of the emote image.
	 */
	getUrl(settings: EmoteSettings): string {
		const { animationSettings = 'default', backgroundType = 'dark', size = '1.0' } = settings;
		return `https://static-cdn.jtvnw.net/emoticons/v2/${this.id}/${animationSettings}/${backgroundType}/${size}`;
	}
}
