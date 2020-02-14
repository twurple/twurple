import { NonEnumerable } from '@d-fischer/shared-utils';
import TwitchClient from '../../../TwitchClient';

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
export default class UserChatInfo {
	@NonEnumerable private readonly _client: TwitchClient;

	/** @private */
	constructor(private readonly _data: UserChatInfoData, client: TwitchClient) {
		this._client = client;
	}

	/**
	 * The ID of the user.
	 */
	get userId() {
		return this._data._id;
	}

	/**
	 * Retrieves more data about the user.
	 */
	async getUser() {
		return this._client.kraken.users.getUser(this._data._id);
	}

	/**
	 * The name of the user.
	 */
	get userName() {
		return this._data.login;
	}

	/**
	 * The display name of the user.
	 */
	get displayName() {
		return this._data.display_name;
	}

	/**
	 * The color that the user appears in in chat.
	 */
	get color() {
		return this._data.color;
	}

	/**
	 * Whether the user is a known bot.
	 */
	get isKnownBot() {
		return this._data.is_known_bot;
	}

	/**
	 * Whether the user is a verified bot.
	 */
	get isVerifiedBot() {
		return this._data.is_verified_bot;
	}

	/**
	 * Whether the user is at least a known bot (i.e. known or verified).
	 */
	get isAtLeastKnownBot() {
		return this._data.is_known_bot || this._data.is_verified_bot;
	}

	/**
	 * Checks whether the user has access to a given global badge.
	 *
	 * @param id The ID of a badge.
	 */
	hasBadge(id: string) {
		return this._data.badges.some(badge => badge.id === id);
	}
}
