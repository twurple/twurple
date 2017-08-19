import { MessagePrefix } from 'ircv3';
import ChatClient from './ChatClient';
import { NonEnumerable } from '../Toolkit/Decorators';
import User from '../API/User/';

export default class ChatUser {
	private _userData: Map<string, string>;
	private _userName: string;

	@NonEnumerable private _client: ChatClient;

	constructor(prefix: MessagePrefix, userData: Map<string, string> | undefined, client: ChatClient) {
		this._userName = prefix.nick.toLowerCase();
		this._client = client;
		this._userData = userData ? new Map(userData) : new Map;
	}

	get userName() {
		return this._userName;
	}

	get displayName() {
		return this._userData.get('display-name') || this._userName;
	}

	get color() {
		// no default here - consumers can figure out their own color decision algorithm if the user didn't set a color
		return this._userData.get('color');
	}

	get badges() {
		const badgesStr = this._userData.get('badges');

		if (!badgesStr) {
			return new Map;
		}

		return new Map(badgesStr.split(',').map(badge => badge.split('/', 2) as [string, string]));
	}

	get userId() {
		return this._userData.get('user-id') || undefined;
	}

	get userType() {
		return this._userData.get('user-type') || undefined;
	}

	get isSubscriber() {
		return Boolean(this._userData.get('subscriber'));
	}

	async getUser(): Promise<User> {
		if (this.userId) {
			return this._client._twitchClient.users.getUser(this.userId);
		}

		return this._client._twitchClient.users.getUserByName(this._userName);
	}
}
