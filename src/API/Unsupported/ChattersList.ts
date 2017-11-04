import { Cacheable, Cached, NonEnumerable } from '../../Toolkit/Decorators';
import Twitch from '../..';
import ArrayTools from '../../Toolkit/ArrayTools';

export interface ChattersListData {
	chatter_count: number;
	chatters: { [status: string]: string[] };
}

@Cacheable
export default class ChattersList {
	@NonEnumerable private _client: Twitch;

	constructor(private _data: ChattersListData, client: Twitch) {
		this._client = client;
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
