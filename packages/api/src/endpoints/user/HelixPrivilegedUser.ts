import { rawDataSymbol, rtfm } from '@twurple/common';
import { type HelixPrivilegedUserData } from '../../interfaces/endpoints/user.external';
import { HelixUser } from './HelixUser';

/**
 * A user you have extended privilges for, i.e. yourself.
 *
 * @inheritDoc
 */
@rtfm<HelixPrivilegedUser>('api', 'HelixPrivilegedUser', 'id')
export class HelixPrivilegedUser extends HelixUser {
	/** @private */ declare readonly [rawDataSymbol]: HelixPrivilegedUserData;

	/**
	 * The email address of the user.
	 */
	get email(): string | undefined {
		return this[rawDataSymbol].email;
	}

	/**
	 * Changes the description of the user.
	 *
	 * @param description The new description.
	 */
	async setDescription(description: string): Promise<HelixPrivilegedUser> {
		return await this._client.users.updateAuthenticatedUser(this, { description });
	}
}
