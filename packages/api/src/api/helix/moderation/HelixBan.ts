import { rawDataSymbol, rtfm } from '@twurple/common';
import type { ApiClient } from '../../../ApiClient';
import { type HelixBanData } from '../../../interfaces/helix/moderation.external';
import { HelixBanUser } from './HelixBanUser';

/**
 * Information about the ban of a user.
 *
 * @inheritDoc
 */
@rtfm<HelixBan>('api', 'HelixBan', 'userId')
export class HelixBan extends HelixBanUser {
	/** @private */ declare readonly [rawDataSymbol]: HelixBanData;

	/** @private */
	constructor(data: HelixBanData, client: ApiClient) {
		super(data, data.expires_at || null, client);
	}

	/**
	 * The name of the user that was banned or put in a timeout.
	 */
	get userName(): string {
		return this[rawDataSymbol].user_login;
	}

	/**
	 * The display name of the user that was banned or put in a timeout.
	 */
	get userDisplayName(): string {
		return this[rawDataSymbol].user_name;
	}

	/**
	 * The name of the moderator that banned or put the user in the timeout.
	 */
	get moderatorName(): string {
		return this[rawDataSymbol].moderator_login;
	}

	/**
	 * The display name of the moderator that banned or put the user in the timeout.
	 */
	get moderatorDisplayName(): string {
		return this[rawDataSymbol].moderator_name;
	}

	/**
	 * The reason why the user was banned or timed out. Returns `null` if no reason was given.
	 */
	get reason(): string | null {
		return this[rawDataSymbol].reason || null;
	}
}
