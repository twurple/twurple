import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixUser } from '@twurple/api';
import { DataObject, rawDataSymbol } from '@twurple/common';

/**
 * The type of hype train contribution. Can be "bits" or "subscription".
 */
export type EventSubChannelHypeTrainContributionType = 'bits' | 'subscription';

/** @private */
export interface EventSubChannelHypeTrainContributionData {
	user_id: string;
	user_login: string;
	user_name: string;
	type: EventSubChannelHypeTrainContributionType;
	total: number;
}

export class EventSubChannelHypeTrainContribution extends DataObject<EventSubChannelHypeTrainContributionData> {
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: EventSubChannelHypeTrainContributionData, client: ApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The contributor's ID.
	 */
	get userId(): string {
		return this[rawDataSymbol].user_id;
	}

	/**
	 * The contributor's user name.
	 */
	get userName(): string {
		return this[rawDataSymbol].user_login;
	}

	/**
	 * The contributor's display name.
	 */
	get userDisplayName(): string {
		return this[rawDataSymbol].user_name;
	}

	/**
	 * Retrieves more information about the contributor.
	 */
	async getUser(): Promise<HelixUser> {
		return (await this._client.users.getUserById(this[rawDataSymbol].user_id))!;
	}

	/**
	 * The type of the contribution.
	 */
	get type(): EventSubChannelHypeTrainContributionType {
		return this[rawDataSymbol].type;
	}

	/**
	 * The contributor's total contribution.
	 */
	get total(): number {
		return this[rawDataSymbol].total;
	}
}
