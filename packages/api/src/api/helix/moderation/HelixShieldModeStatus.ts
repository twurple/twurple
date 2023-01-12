import { Enumerable } from '@d-fischer/shared-utils';
import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import type { ApiClient } from '../../../ApiClient';
import type { HelixShieldModeStatusData } from '../../../interfaces/helix/moderation.external';
import type { HelixUser } from '../user/HelixUser';

/**
 * Information about the Shield Mode status of a channel.
 */
@rtfm('api', 'HelixShieldModeStatus')
export class HelixShieldModeStatus extends DataObject<HelixShieldModeStatusData> {
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: HelixShieldModeStatusData, client: ApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * Whether Shield Mode is active.
	 */
	get isActive(): boolean {
		return this[rawDataSymbol].is_active;
	}

	/**
	 * The ID of the moderator that last activated Shield Mode.
	 */
	get moderatorId(): string {
		return this[rawDataSymbol].moderator_id;
	}

	/**
	 * The name of the moderator that last activated Shield Mode.
	 */
	get moderatorName(): string {
		return this[rawDataSymbol].moderator_login;
	}

	/**
	 * The display name of the moderator that last activated Shield Mode.
	 */
	get moderatorDisplayName(): string {
		return this[rawDataSymbol].moderator_name;
	}

	/**
	 * Retrieves more information about the moderator that last activated Shield Mode.
	 */
	async getModerator(): Promise<HelixUser> {
		return (await this._client.users.getUserById(this[rawDataSymbol].moderator_id))!;
	}

	/**
	 * The date when Shield Mode was last activated. `null` indicates Shield Mode hasn't been previously activated.
	 */
	get lastActivationDate(): Date | null {
		return this[rawDataSymbol].last_activated_at === '' ? null : new Date(this[rawDataSymbol].last_activated_at);
	}
}
