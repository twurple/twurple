import { MessagePrefix } from 'ircv3';
import ChatClient from './ChatClient';
import { NonEnumerable } from '../Toolkit/Decorators';
import User from '../API/User/User';

/**
 * A user in chat.
 */
export default class ChatUser {
	private readonly _userData: Map<string, string>;
	private readonly _userName: string;

	@NonEnumerable private readonly _client: ChatClient;

	/** @private */
	constructor(prefix: MessagePrefix, userData: Map<string, string> | undefined, client: ChatClient) {
		this._userName = prefix.nick.toLowerCase();
		this._client = client;
		this._userData = userData ? new Map(userData) : new Map;
	}

	/**
	 * The name of the user.
	 */
	get userName() {
		return this._userName;
	}

	/**
	 * The display name of the user.
	 */
	get displayName() {
		return this._userData.get('display-name') || this._userName;
	}

	/**
	 * The color the user chose to display in chat.
	 *
	 * Returns null if the user didn't choose a color. In this case, you should generate your own color.
	 */
	get color() {
		return this._userData.get('color');
	}

	/**
	 * The badges of the user. Returned as a map that maps the badge category to the detail.
	 */
	get badges() {
		const badgesStr = this._userData.get('badges');

		if (!badgesStr) {
			return new Map;
		}

		return new Map(badgesStr.split(',').map(badge => badge.split('/', 2) as [string, string]));
	}

	/**
	 * The ID of the user.
	 */
	get userId() {
		return this._userData.get('user-id') || undefined;
	}

	/**
	 * The type of the user.
	 * Possible values are undefined, 'mod', 'global_mod', 'admin' and 'staff'.
	 */
	get userType() {
		return this._userData.get('user-type') || undefined;
	}

	/**
	 * Whether the user is a subscriber.
	 */
	get isSubscriber() {
		return Boolean(this._userData.get('subscriber'));
	}

	/**
	 * Retrieves more data about the user.
	 */
	async getUser(): Promise<User> {
		if (this.userId) {
			return this._client._twitchClient.users.getUser(this.userId);
		}

		return this._client._twitchClient.users.getUserByName(this._userName);
	}
}
