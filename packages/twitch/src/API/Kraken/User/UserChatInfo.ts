import { NonEnumerable } from '@d-fischer/shared-utils';
import TwitchClient from '../../../TwitchClient';

interface UserChatInfoGlobalBadgeData {
	id: string;
	version: string;
}

export interface UserChatInfoData {
	_id: string;
	login: string;
	display_name: string;
	color: string;
	is_verified_bot: boolean;
	is_known_bot: boolean;
	badges: UserChatInfoGlobalBadgeData[];
}

export class UserChatInfo {
	@NonEnumerable private readonly _client: TwitchClient;

	/** @private */
	constructor(private readonly _data: UserChatInfoData, client: TwitchClient) {
		this._client = client;
	}

	get id() {
		return this._data._id;
	}

	async getUser() {
		return this._client.kraken.users.getUser(this._data._id);
	}

	get userName() {
		return this._data.login;
	}

	get displayName() {
		return this._data.display_name;
	}

	get color() {
		return this._data.color;
	}

	get isKnownBot() {
		return this._data.is_known_bot;
	}

	get isVerifiedBot() {
		return this._data.is_verified_bot;
	}

	get isAtLeastKnownBot() {
		return this._data.is_known_bot || this._data.is_verified_bot;
	}

	hasBadge(id: string) {
		return this._data.badges.some(badge => badge.id === id);
	}
}
