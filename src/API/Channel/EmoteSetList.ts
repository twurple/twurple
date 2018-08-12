import { Cacheable, Cached } from '../../Toolkit/Decorators';
import { UniformObject } from '../../Toolkit/ObjectTools';

/** @private */
export interface Emote {
	code: string;
	id: number;
}

/** @private */
export type EmoteSetListData = UniformObject<Emote[]>;

/**
 * A list of emotes, grouped into emote sets, that a user can use.
 */
@Cacheable
export default class EmoteSetList {
	/** @private */
	constructor(private readonly _data: EmoteSetListData) {
	}

	/**
	 * Finds the emote ID for the given emote code.
	 *
	 * @param emoteCode The emote code to check for.
	 */
	@Cached(Infinity, true)
	findEmoteId(emoteCode: string): number | undefined {
		for (const emoteSet of Object.values(this._data)) {
			for (const emote of emoteSet) {
				if ((new RegExp(emote.code)).test(emoteCode)) {
					return emote.id;
				}
			}
		}

		return undefined;
	}
}
