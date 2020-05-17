import HelixUser, { HelixUserData } from './HelixUser';

/** @private */
export interface HelixPrivilegedUserData extends HelixUserData {
	email?: string;
}

/**
 * A user you have extended privilges for, i.e. yourself.
 *
 * @inheritDoc
 */
export default class HelixPrivilegedUser extends HelixUser {
	/** @private */
	protected _data: HelixPrivilegedUserData;

	/**
	 * The email address of the user.
	 */
	get email() {
		return this._data.email;
	}

	/**
	 * Changes the description of the user.
	 *
	 * @param description The new description.
	 */
	async setDescription(description: string) {
		return this._client.helix.users.updateUser({ description });
	}
}
