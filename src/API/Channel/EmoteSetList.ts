import { Cacheable, Cached } from '../../Toolkit/Decorators';
import { UniformObject } from '../../Toolkit/ObjectTools';

export interface Emote {
	code: string;
	id: number;
}

export type EmoteSetListData = UniformObject<Emote[]>;

@Cacheable
export default class EmoteSetList {
	constructor(private _data: EmoteSetListData) {
	}

	@Cached(Infinity, true)
	findEmoteId(emoteName: string): number | undefined {
		for (const emoteSet of Object.values(this._data)) {
			for (const emote of emoteSet) {
				if ((new RegExp(emote.code)).test(emoteName)) {
					return emote.id;
				}
			}
		}

		return;
	}
}
