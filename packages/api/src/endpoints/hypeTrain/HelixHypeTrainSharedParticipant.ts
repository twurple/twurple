import { Enumerable } from '@d-fischer/shared-utils';
import { checkRelationAssertion, DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import { type BaseApiClient } from '../../client/BaseApiClient';
import { type HelixHypeTrainSharedParticipantData } from '../../interfaces/endpoints/hypeTrain.external';
import type { HelixUser } from '../user/HelixUser';

/**
 * A participant of a shared Hype Train.
 */
@rtfm<HelixHypeTrainSharedParticipant>('api', 'HelixHypeTrainSharedParticipant', 'userId')
export class HelixHypeTrainSharedParticipant extends DataObject<HelixHypeTrainSharedParticipantData> {
	/** @internal */ @Enumerable(false) private readonly _client: BaseApiClient;

	/** @internal */
	constructor(data: HelixHypeTrainSharedParticipantData, client: BaseApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The ID of the user participating in the shared Hype Train.
	 */
	get userId(): string {
		return this[rawDataSymbol].broadcaster_user_id;
	}

	/**
	 * The name of the user participating in the shared Hype Train.
	 */
	get userName(): string {
		return this[rawDataSymbol].broadcaster_user_login;
	}

	/**
	 * The display name of the user participating in the shared Hype Train.
	 */
	get userDisplayName(): string {
		return this[rawDataSymbol].broadcaster_user_name;
	}

	/**
	 * Gets additional information about the user participating in the shared Hype Train.
	 */
	async getUser(): Promise<HelixUser> {
		return checkRelationAssertion(await this._client.users.getUserById(this[rawDataSymbol].broadcaster_user_id));
	}
}
