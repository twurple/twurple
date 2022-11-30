import { Enumerable } from '@d-fischer/shared-utils';
import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import type { ApiClient } from '../../../ApiClient';
import { type HelixScheduleData } from '../../../interfaces/helix/schedule.external';
import type { HelixUser } from '../user/HelixUser';
import { HelixScheduleSegment } from './HelixScheduleSegment';

/**
 * A schedule of a channel.
 */
@rtfm<HelixSchedule>('api', 'HelixSchedule', 'broadcasterId')
export class HelixSchedule extends DataObject<HelixScheduleData> {
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: HelixScheduleData, client: ApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The segments of the schedule.
	 */
	get segments(): HelixScheduleSegment[] {
		return this[rawDataSymbol].segments.map(data => new HelixScheduleSegment(data, this._client));
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
	 * Retrieves more information about the broadcaster.
	 */
	async getBroadcaster(): Promise<HelixUser> {
		return (await this._client.users.getUserById(this[rawDataSymbol].broadcaster_id))!;
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
