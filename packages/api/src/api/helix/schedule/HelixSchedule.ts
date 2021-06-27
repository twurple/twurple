import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient } from '../../../ApiClient';
import type { HelixUser } from '../user/HelixUser';
import type { HelixScheduleSegmentData } from './HelixScheduleSegment';
import { HelixScheduleSegment } from './HelixScheduleSegment';

/** @private */
export interface HelixScheduleVacationData {
	start_time: string;
	end_time: string;
}

/** @private */
export interface HelixScheduleData {
	segments: HelixScheduleSegmentData[];
	broadcaster_id: string;
	broadcaster_name: string;
	broadcaster_login: string;
	vacation: HelixScheduleVacationData | null;
}

/** @private */
export interface HelixScheduleResponse {
	data: HelixScheduleData;
	pagination: {
		cursor?: string;
	};
}

/**
 * A schedule of a channel.
 */
export class HelixSchedule {
	@Enumerable(false) private readonly _data: HelixScheduleData;
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: HelixScheduleData, client: ApiClient) {
		this._data = data;
		this._client = client;
	}

	/**
	 * The segments of the schedule.
	 */
	get segments(): HelixScheduleSegment[] {
		return this._data.segments.map(data => new HelixScheduleSegment(data, this._client));
	}

	/**
	 * The ID of the broadcaster.
	 */
	get broadcasterId(): string {
		return this._data.broadcaster_id;
	}

	/**
	 * The name of the broadcaster.
	 */
	get broadcasterName(): string {
		return this._data.broadcaster_login;
	}

	/**
	 * The display name of the broadcaster.
	 */
	get broadcasterDisplayName(): string {
		return this._data.broadcaster_name;
	}

	/**
	 * Retrieves more information about the broadcaster.
	 */
	async getBroadcaster(): Promise<HelixUser> {
		return (await this._client.helix.users.getUserById(this._data.broadcaster_id))!;
	}

	/**
	 * The date when the current vacation started, or null if the schedule is not in vacation mode.
	 */
	get vacationStartDate(): Date | null {
		const timestamp = this._data.vacation?.start_time;

		return timestamp ? new Date(timestamp) : null;
	}

	/**
	 * The date when the current vacation ends, or null if the schedule is not in vacation mode.
	 */
	get vacationEndDate(): Date | null {
		const timestamp = this._data.vacation?.end_time;

		return timestamp ? new Date(timestamp) : null;
	}
}
