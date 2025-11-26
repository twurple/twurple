import { Enumerable } from '@d-fischer/shared-utils';
import { checkRelationAssertion, DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import { type BaseApiClient } from '../../client/BaseApiClient.js';
import { type HelixScheduleData } from '../../interfaces/endpoints/schedule.external.js';
import type { HelixUser } from '../user/HelixUser.js';
import { HelixScheduleSegment } from './HelixScheduleSegment.js';

/**
 * A schedule of a channel.
 */
@rtfm<HelixSchedule>('api', 'HelixSchedule', 'broadcasterId')
export class HelixSchedule extends DataObject<HelixScheduleData> {
	/** @internal */ @Enumerable(false) private readonly _client: BaseApiClient;

	/** @internal */
	constructor(data: HelixScheduleData, client: BaseApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The segments of the schedule.
	 */
	get segments(): HelixScheduleSegment[] {
		return this[rawDataSymbol].segments?.map(data => new HelixScheduleSegment(data, this._client)) ?? [];
	}

	/**
	 * The ID of the broadcaster.
	 */
	get broadcasterId(): string {
		return this[rawDataSymbol].broadcaster_id;
	}

	/**
	 * The name of the broadcaster.
	 */
	get broadcasterName(): string {
		return this[rawDataSymbol].broadcaster_login;
	}

	/**
	 * The display name of the broadcaster.
	 */
	get broadcasterDisplayName(): string {
		return this[rawDataSymbol].broadcaster_name;
	}

	/**
	 * Gets more information about the broadcaster.
	 */
	async getBroadcaster(): Promise<HelixUser> {
		return checkRelationAssertion(await this._client.users.getUserById(this[rawDataSymbol].broadcaster_id));
	}

	/**
	 * The date when the current vacation started, or null if the schedule is not in vacation mode.
	 */
	get vacationStartDate(): Date | null {
		const timestamp = this[rawDataSymbol].vacation?.start_time;

		return timestamp ? new Date(timestamp) : null;
	}

	/**
	 * The date when the current vacation ends, or null if the schedule is not in vacation mode.
	 */
	get vacationEndDate(): Date | null {
		const timestamp = this[rawDataSymbol].vacation?.end_time;

		return timestamp ? new Date(timestamp) : null;
	}
}
