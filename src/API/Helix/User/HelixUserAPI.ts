import BaseAPI from '../../BaseAPI';
import { UniformObject } from '../../../Toolkit/ObjectTools';
import HelixResponse from '../HelixResponse';
import HelixUser, { HelixUserData } from './HelixUser';
import HelixPrivilegedUser, { HelixPrivilegedUserData } from './HelixPrivilegedUser';
import { UserIdResolvable, default as UserTools, UserNameResolvable } from '../../../Toolkit/UserTools';

type UserLookupType = 'id' | 'login';

export interface HelixUserUpdate {
	description?: string;
}

export default class HelixUserAPI extends BaseAPI {
	private async getUsers(lookupType: UserLookupType, param: string | string[]) {
		let query: UniformObject<string | string[] | undefined> = {[lookupType]: param};
		const result = await this._client.apiCall<HelixResponse<HelixUserData[]>>({
			type: 'helix',
			url: 'users',
			query
		});

		return result.data.map(userData => new HelixUser(userData, this._client));
	}

	async getUsersByIds(users: UserIdResolvable[]) {
		return this.getUsers('id', users.map(id => UserTools.getUserId(id)));
	}

	async getUsersByNames(users: UserNameResolvable[]) {
		return this.getUsers('login', users.map(name => UserTools.getUserName(name)));
	}

	async getUserById(user: UserIdResolvable) {
		const users = await this.getUsers('id', UserTools.getUserId(user));
		if (!users.length) {
			throw new Error('user not found');
		}
		return users[0];
	}

	async getUserByName(user: UserNameResolvable) {
		const users = await this.getUsers('login', UserTools.getUserName(user));
		if (!users.length) {
			throw new Error('user not found');
		}
		return users[0];
	}

	async getMe(withEmail: boolean = false) {
		const result = await this._client.apiCall<HelixResponse<HelixPrivilegedUserData[]>>({
			type: 'helix',
			url: 'users',
			scope: withEmail ? 'user:read:email' : ''
		});

		if (!result.data || !result.data.length) {
			throw new Error('could not get authenticated user');
		}

		return new HelixPrivilegedUser(result.data[0], this._client);
	}

	async updateUser(data: HelixUserUpdate) {
		const result = await this._client.apiCall<HelixResponse<HelixPrivilegedUserData>>({
			type: 'helix',
			url: 'users',
			method: 'PUT',
			query: {
				description: data.description
			}
		});

		return new HelixPrivilegedUser(result.data[0], this._client);
	}
}
