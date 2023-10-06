import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixUser } from '@twurple/api';
import { checkRelationAssertion, DataObject, rawDataSymbol } from '@twurple/common';
import {
	type EventSubChannelHypeTrainContributionData,
	type EventSubChannelHypeTrainContributionType,
} from './EventSubChannelHypeTrainContribution.external';

export class EventSubChannelHypeTrainContribution extends DataObject<EventSubChannelHypeTrainContributionData> {
	/** @internal */ @Enumerable(false) private readonly _client: ApiClient;

	/** @internal */
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
	 * Gets more information about the contributor.
	 */
	async getUser(): Promise<HelixUser> {
		return checkRelationAssertion(await this._client.users.getUserById(this[rawDataSymbol].user_id));
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
