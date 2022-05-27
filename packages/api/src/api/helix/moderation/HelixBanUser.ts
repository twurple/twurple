import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';

/** @private */
export interface HelixBanUserData {
	broadcaster_id: string;
	end_time: string;
	moderator_id: string;
	user_id: string;
}

/**
 * Information about a user who has been banned/timed out.
 */
@rtfm<HelixBanUser>('api', 'HelixBanUser', 'userId')
export class HelixBanUser extends DataObject<HelixBanUserData> {
	/**
	 * The ID of the broadcaster whose chat room the user was banned/timed out from chatting in.
	 */
	get broadcasterId(): string {
		return this[rawDataSymbol].broadcaster_id;
	}

	/**
	 * The date and time that the timeout will end. Is `null` if the user was banned instead of put in a timeout.
	 */
	get endDate(): Date | null {
		return this[rawDataSymbol].end_time ? new Date(this[rawDataSymbol].end_time) : null;
	}

	/**
	 * The ID of the moderator that banned or put the user in the timeout.
	 */
	get moderatorId(): string {
		return this[rawDataSymbol].moderator_id;
	}

	/**
	 * The ID of the user that was banned or was put in a timeout.
	 */
	get userId(): string {
		return this[rawDataSymbol].user_id;
	}
}
