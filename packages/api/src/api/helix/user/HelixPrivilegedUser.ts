import { rtfm } from '@twurple/common';
import type { HelixUserData } from './HelixUser';
import { HelixUser } from './HelixUser';

/** @private */
export interface HelixPrivilegedUserData extends HelixUserData {
	email?: string;
}

/**
 * A user you have extended privilges for, i.e. yourself.
 *
 * @inheritDoc
 */
@rtfm<HelixPrivilegedUser>('api', 'HelixPrivilegedUser', 'id')
export class HelixPrivilegedUser extends HelixUser {
	/** @private */ protected declare readonly _data: HelixPrivilegedUserData;

	/**
	 * The email address of the user.
	 */
	get email(): string | undefined {
		return this._data.email;
	}

	/**
	 * Changes the description of the user.
	 *
	 * @param description The new description.
	 */
	async setDescription(description: string): Promise<HelixPrivilegedUser> {
		return await this._client.helix.users.updateUser({ description });
	}
}
