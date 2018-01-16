import Twitch from '../../../';
import { NonEnumerable } from '../../../Toolkit/Decorators';
import HelixPagination from '../HelixPagination';
import { UserIdResolvable } from '../../../Toolkit/UserTools';
import HelixUser from './HelixUser';

export interface HelixFollowFilter extends HelixPagination {
	user?: UserIdResolvable;
	followedUser?: UserIdResolvable;
}

export interface HelixFollowData {
	from_id: string;
	to_id: string;
	followed_at: string;
}

export default class HelixFollow {
	@NonEnumerable protected _client: Twitch;

	constructor(protected _data: HelixFollowData, client: Twitch) {
		this._client = client;
	}

	get followedAt() {
		return new Date(this._data.followed_at);
	}

	get userId() {
		return this._data.from_id;
	}

	async getUser(): Promise<HelixUser> {
		return this._client.helix.users.getUserById(this._data.from_id);
	}

	get followedUserId() {
		return this._data.to_id;
	}

	async getFollowedUser(): Promise<HelixUser> {
		return this._client.helix.users.getUserById(this._data.to_id);
	}
}
