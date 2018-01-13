import { Cacheable, Cached } from '../../Toolkit/Decorators';
import ArrayTools from '../../Toolkit/ArrayTools';

export interface ChattersListData {
	chatter_count: number;
	chatters: { [status: string]: string[] };
}

@Cacheable
export default class ChattersList {
	constructor(private _data: ChattersListData) {
	}

	@Cached(Infinity)
	getAllChatters(): string[] {
		return ArrayTools.flatten(Object.values(this._data.chatters));
	}

	@Cached(Infinity)
	getAllChattersWithStatus(): Map<string, string> {
		return new Map(ArrayTools.flatten(Object.entries(this._data.chatters).map(([status, names]) => names.map<[string, string]>(name => [name, status]))));
	}
}
