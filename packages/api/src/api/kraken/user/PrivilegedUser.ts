import type { UserIdResolvable } from '@twurple/common';
import { rawDataSymbol, rtfm } from '@twurple/common';
import type { UserData } from './User';
import { User } from './User';
import type { UserBlock } from './UserBlock';

/** @private */
export interface UserNotificationFlags {
	email: boolean;
	push: boolean;
}

/** @private */
export interface PrivilegedUserData extends UserData {
	email: string;
	email_verified: boolean;
	notifications: UserNotificationFlags;
	partnered: boolean;
	twitter_connected: boolean;
}

/**
 * A user you have extended privileges for, i.e. the currently authenticated user.
 *
 * @inheritDoc
 */
@rtfm<PrivilegedUser>('api', 'PrivilegedUser', 'id')
export class PrivilegedUser extends User {
	/** @private */ declare readonly [rawDataSymbol]: PrivilegedUserData;

	/**
	 * The user's email address.
	 */
	get email(): string {
		return this[rawDataSymbol].email;
	}

	/**
	 * Whether the user's email address is verified.
	 */
	get isEmailVerified(): boolean {
		return this[rawDataSymbol].email_verified;
	}

	/**
	 * Whether the user has email notifications enabled.
	 */
	get hasEmailNotifications(): boolean {
		return this[rawDataSymbol].notifications.email;
	}

	/**
	 * Whether the user has push notifications enabled.
	 */
	get hasPushNotifications(): boolean {
		return this[rawDataSymbol].notifications.push;
	}

	/**
	 * Whether the user is partnered.
	 */
	get isPartnered(): boolean {
		return this[rawDataSymbol].partnered;
	}

	/**
	 * Whether the user has a Twitter account connected.
	 */
	get hasTwitter(): boolean {
		return this[rawDataSymbol].twitter_connected;
	}

	/**
	 * Blocks a user.
	 *
	 * @param userToBlock The user to block.
	 */
	async blockUser(userToBlock: UserIdResolvable): Promise<UserBlock> {
		return await this._client.kraken.users.blockUser(this, userToBlock);
	}

	/**
	 * Unblocks a user.
	 *
	 * @param userToUnblock The user to unblock.
	 */
	async unblockUser(userToUnblock: UserIdResolvable): Promise<void> {
		await this._client.kraken.users.unblockUser(this, userToUnblock);
	}
}
