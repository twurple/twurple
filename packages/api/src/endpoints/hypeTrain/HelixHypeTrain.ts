import { Enumerable } from '@d-fischer/shared-utils';
import { checkRelationAssertion, DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import { type BaseApiClient } from '../../client/BaseApiClient';
import { type HelixHypeTrainData, type HelixHypeTrainType } from '../../interfaces/endpoints/hypeTrain.external';
import type { HelixUser } from '../user/HelixUser';
import { HelixHypeTrainContribution } from './HelixHypeTrainContribution';

/**
 * Data about the currently running Hype Train.
 */
@rtfm<HelixHypeTrain>('api', 'HelixHypeTrain', 'id')
export class HelixHypeTrain extends DataObject<HelixHypeTrainData> {
	/** @internal */ @Enumerable(false) private readonly _client: BaseApiClient;

	/** @internal */
	constructor(data: HelixHypeTrainData, client: BaseApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The unique ID of the Hype Train event.
	 */
	get eventId(): string {
		return this[rawDataSymbol].id;
	}

	/**
	 * The unique ID of the Hype Train.
	 */
	get id(): string {
		return this[rawDataSymbol].id;
	}

	/**
	 * The user ID of the broadcaster where the Hype Train is happening.
	 */
	get broadcasterId(): string {
		return this[rawDataSymbol].broadcaster_user_id;
	}

	/**
	 * The name of the broadcaster where the Hype Train is happening.
	 */
	get broadcasterName(): string {
		return this[rawDataSymbol].broadcaster_user_login;
	}

	/**
	 * The display name of the broadcaster where the Hype Train is happening.
	 */
	get broadcasterDisplayName(): string {
		return this[rawDataSymbol].broadcaster_user_name;
	}

	/**
	 * Gets more information about the broadcaster where the Hype Train is happening.
	 */
	async getBroadcaster(): Promise<HelixUser> {
		return checkRelationAssertion(await this._client.users.getUserById(this[rawDataSymbol].broadcaster_user_id));
	}

	/**
	 * The level of the Hype Train.
	 */
	get level(): number {
		return this[rawDataSymbol].level;
	}

	/**
	 * The total amount of progress points of the Hype Train.
	 */
	get total(): number {
		return this[rawDataSymbol].total;
	}

	/**
	 * The amount progress points for the current level of the Hype Train.
	 */
	get progress(): number {
		return this[rawDataSymbol].progress;
	}

	/**
	 * The progress points goal to reach the next Hype Train level.
	 */
	get goal(): number {
		return this[rawDataSymbol].goal;
	}

	/**
	 * Array list of the top contributions to the Hype Train event for bits and subs.
	 */
	get topContributions(): HelixHypeTrainContribution[] {
		return this[rawDataSymbol].top_contributions.map(cont => new HelixHypeTrainContribution(cont, this._client));
	}

	/**
	 * The time when the Hype Train started.
	 */
	get startDate(): Date {
		return new Date(this[rawDataSymbol].started_at);
	}

	/**
	 * The time when the Hype Train is set to expire.
	 */
	get expiryDate(): Date {
		return new Date(this[rawDataSymbol].expires_at);
	}

	/**
	 * The type of the Hype Train.
	 */
	get type(): HelixHypeTrainType {
		return this[rawDataSymbol].type;
	}

	/**
	 * Whether the Hype Train is a shared train.
	 */
	get isSharedTrain(): boolean {
		return this[rawDataSymbol].is_shared_train;
	}
}
