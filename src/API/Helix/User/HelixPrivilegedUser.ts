import HelixUser, { HelixUserData } from './HelixUser';

/** @private */
export interface HelixPrivilegedUserData extends HelixUserData {
	email?: string;
}

export default class HelixPrivilegedUser extends HelixUser {
	/** @private */
	protected _data: HelixPrivilegedUserData;

	get email() {
		return this._data.email;
	}

	async setDescription(description: string) {
		return this._client.helix.users.updateUser({ description });
	}
}
