import { mapNullable } from '@d-fischer/shared-utils';
import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import { type HelixBanUserData } from '../../../interfaces/helix/moderation.external';

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
	 * The date and time that the timeout was created.
	 */
	get creationDate(): Date {
		return new Date(this[rawDataSymbol].created_at);
	}

	/**
	 * The date and time that the timeout will end. Is `null` if the user was banned instead of put in a timeout.
	 */
	get endDate(): Date | null {
		return mapNullable(this[rawDataSymbol].end_time, ts => new Date(ts));
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
