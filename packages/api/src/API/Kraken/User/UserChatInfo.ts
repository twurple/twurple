import { Enumerable } from '@d-fischer/shared-utils';
import { rtfm } from '@twurple/common';
import type { ApiClient } from '../../../ApiClient';
import type { User } from './User';

/** @private */
interface UserChatInfoGlobalBadgeData {
	id: string;
	version: string;
}

/** @private */
export interface UserChatInfoData {
	_id: string;
	login: string;
	display_name: string;
	color: string;
	is_verified_bot: boolean;
	is_known_bot: boolean;
	badges: UserChatInfoGlobalBadgeData[];
}

/**
 * Information about a user's chat appearance and privileges.
 */
@rtfm<UserChatInfo>('chat', 'UserChatInfo', 'userId')
export class UserChatInfo {
	@Enumerable(false) private readonly _data: UserChatInfoData;
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: UserChatInfoData, client: ApiClient) {
		this._data = data;
		this._client = client;
	}

	/**
	 * The ID of the user.
	 */
	get userId(): string {
		return this._data._id;
	}

	/**
	 * Retrieves more information about the user.
	 */
	async getUser(): Promise<User> {
		return await this._client.kraken.users.getUser(this._data._id);
	}

	/**
	 * The name of the user.
	 */
	get userName(): string {
		return this._data.login;
	}

	/**
	 * The display name of the user.
	 */
	get displayName(): string {
		return this._data.display_name;
	}

	/**
	 * The color that the user appears in in chat.
	 */
	get color(): string {
		return this._data.color;
	}

	/**
	 * Whether the user is a known bot.
	 */
	get isKnownBot(): boolean {
		return this._data.is_known_bot;
	}

	/**
	 * Whether the user is a verified bot.
	 */
	get isVerifiedBot(): boolean {
		return this._data.is_verified_bot;
	}

	/**
	 * Whether the user is at least a known bot (i.e. known or verified).
	 */
	get isAtLeastKnownBot(): boolean {
		return this._data.is_known_bot || this._data.is_verified_bot;
	}

	/**
	 * Checks whether the user has access to a given global badge.
	 *
	 * @param id The ID of a badge.
	 */
	hasBadge(id: string): boolean {
		return this._data.badges.some(badge => badge.id === id);
	}
}
