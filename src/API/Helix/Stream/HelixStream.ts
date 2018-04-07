import { NonEnumerable } from '../../../Toolkit/Decorators';
import HelixUser from '../User/HelixUser';
import TwitchClient from '../../../TwitchClient';

export enum HelixStreamType {
	None = '',
	Live = 'live',
	Vodcast = 'vodcast'
}

export interface HelixStreamData {
	id: string;
	user_id: string;
	game_id: string;
	community_ids: string[];
	type: HelixStreamType;
	title: string;
	viewer_count: number;
	started_at: string;
	language: string;
	thumbnail_url: string;
}

export default class HelixStream {
	@NonEnumerable private readonly _client: TwitchClient;

	constructor(private readonly _data: HelixStreamData, client: TwitchClient) {
		this._client = client;
	}

	async getUser(): Promise<HelixUser> {
		return this._client.helix.users.getUserById(this._data.user_id);
	}

	// TODO implement stream -> game
	// async getGame() {
	// }

	get viewers() {
		return this._data.viewer_count;
	}

	get startDate() {
		return new Date(this._data.started_at);
	}

	get type() {
		return this._data.type;
	}
}
