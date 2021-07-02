import { Enumerable } from '@d-fischer/shared-utils';
import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
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
export class UserChatInfo extends DataObject<UserChatInfoData> {
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: UserChatInfoData, client: ApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The ID of the user.
	 */
	get userId(): string {
		return this[rawDataSymbol]._id;
	}

	/**
	 * Retrieves more information about the user.
	 */
	async getUser(): Promise<User> {
		return await this._client.kraken.users.getUser(this[rawDataSymbol]._id);
	}

	/**
	 * The name of the user.
	 */
	get userName(): string {
		return this[rawDataSymbol].login;
	}

	/**
	 * The display name of the user.
	 */
	get displayName(): string {
		return this[rawDataSymbol].display_name;
	}

	/**
	 * The color that the user appears in in chat.
	 */
	get color(): string {
		return this[rawDataSymbol].color;
	}

	/**
	 * Whether the user is a known bot.
	 */
	get isKnownBot(): boolean {
		return this[rawDataSymbol].is_known_bot;
	}

	/**
	 * Whether the user is a verified bot.
	 */
	get isVerifiedBot(): boolean {
		return this[rawDataSymbol].is_verified_bot;
	}

	/**
	 * Whether the user is at least a known bot (i.e. known or verified).
	 */
	get isAtLeastKnownBot(): boolean {
		return this[rawDataSymbol].is_known_bot || this[rawDataSymbol].is_verified_bot;
	}

	/**
	 * Checks whether the user has access to a given global badge.
	 *
	 * @param id The ID of a badge.
	 */
	hasBadge(id: string): boolean {
		return this[rawDataSymbol].badges.some(badge => badge.id === id);
	}
}
