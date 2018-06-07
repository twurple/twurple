import { NonEnumerable } from '../../../Toolkit/Decorators';
import UserTools, { UserIdResolvable } from '../../../Toolkit/UserTools';
import NotFollowing from '../../NotFollowing';
import UserFollow from '../../User/UserFollow';
import HelixFollow, { HelixFollowFilter } from './HelixFollow';
import HelixPagination from '../HelixPagination';
import TwitchClient from '../../../TwitchClient';

export enum HelixBroadcasterType {
	None = '',
	Affiliate = 'affiliate',
	Partner = 'partner'
}

export enum HelixUserType {
	None = '',
	GlobalMod = 'global_mod',
	Admin = 'admin',
	Staff = 'staff'
}

/** @private */
export interface HelixUserData {
	id: string;
	login: string;
	display_name: string;
	description: string;
	type: HelixUserType;
	broadcaster_type: HelixBroadcasterType;
	profile_image_url: string;
	offline_image_url: string;
	view_count: number;
}

export default class HelixUser {
	/** @private */
	@NonEnumerable protected readonly _client: TwitchClient;

	/** @private */
	constructor(/** @private */ protected _data: HelixUserData, client: TwitchClient) {
		this._client = client;
	}

	/** @private */
	get cacheKey() {
		return this._data.id;
	}

	get id() {
		return this._data.id;
	}

	get name() {
		return this._data.login;
	}

	get displayName() {
		return this._data.display_name;
	}

	get profilePictureUrl() {
		return this._data.profile_image_url;
	}

	async getFollows(paginationParams: HelixPagination) {
		const params: HelixFollowFilter = paginationParams;
		params.user = this;
		return this._client.helix.users.getFollows(params);
	}

	async getFollowTo(channel: UserIdResolvable): Promise<HelixFollow> {
		const params = {
			user: this.id,
			followedUser: channel
		};

		const result = await this._client.helix.users.getFollows(params);

		if (!result.length) {
			throw new NotFollowing(this.id, UserTools.getUserId(channel));
		}

		return result[0];
	}

	async follows(channel: UserIdResolvable): Promise<boolean> {
		try {
			await this.getFollowTo(channel);
			return true;
		} catch (e) {
			if (e instanceof NotFollowing) {
				return false;
			}

			throw e;
		}
	}

	async follow(): Promise<UserFollow> {
		const currentUser = await this._client.users.getMe();
		return currentUser.followChannel(this);
	}

	async unfollow(): Promise<void> {
		const currentUser = await this._client.users.getMe();
		return currentUser.unfollowChannel(this);
	}
}
