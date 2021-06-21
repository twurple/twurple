import { TwitchApiCallType } from 'twitch-api-call';
import type { UserIdResolvable } from 'twitch-common';
import { extractUserId } from 'twitch-common';
import { BaseApi } from '../../BaseApi';
import type { HelixForwardPagination } from '../HelixPagination';
import { makePaginationQuery } from '../HelixPagination';
import { HelixPaginatedScheduleSegmentRequest } from './HelixPaginatedScheduleSegmentRequest';
import type { HelixScheduleResponse } from './HelixSchedule';
import { HelixSchedule } from './HelixSchedule';
import { HelixScheduleSegment } from './HelixScheduleSegment';

/**
 * Filters for the schedule request.
 */
export interface HelixScheduleFilter {
	/**
	 * The earliest date to find schedule segments for.
	 */
	startDate?: string;

	/**
	 * The offset from UTC you request for, to ensure everything goes to the correct day.
	 */
	utcOffset?: number;
}

/**
 * @inheritDoc
 */
export interface HelixPaginatedScheduleFilter extends HelixScheduleFilter, HelixForwardPagination {}

/**
 * The result of a schedule request.
 */
export interface HelixPaginatedScheduleResult {
	/**
	 * The actual schedule object.
	 */
	data: HelixSchedule;

	/**
	 * The pagination cursor.
	 */
	cursor?: string;
}

/**
 * The Helix API methods that deal with schedules.
 */
export class HelixScheduleApi extends BaseApi {
	/**
	 * Retrieves the schedule for a given broadcaster.
	 *
	 * @param broadcaster The broadcaster to get the schedule of.
	 * @param filter
	 *
	 * @expandParams
	 */
	async getSchedule(
		broadcaster: UserIdResolvable,
		filter?: HelixPaginatedScheduleFilter
	): Promise<HelixPaginatedScheduleResult> {
		const result = await this._client.callApi<HelixScheduleResponse>({
			type: TwitchApiCallType.Helix,
			url: 'schedule',
			query: {
				broadcaster_id: extractUserId(broadcaster),
				start_time: filter?.startDate,
				utc_offset: filter?.utcOffset?.toString(),
				...makePaginationQuery(filter)
			}
		});

		return {
			data: new HelixSchedule(result.data, this._client),
			cursor: result.pagination.cursor
		};
	}

	/**
	 * Creates a paginator for schedule segments for a given broadcaster.
	 *
	 * @param broadcaster The broadcaster to get the schedule segments of.
	 * @param filter
	 *
	 * @expandParams
	 */
	getScheduleSegmentsPaginated(
		broadcaster: UserIdResolvable,
		filter?: HelixScheduleFilter
	): HelixPaginatedScheduleSegmentRequest {
		return new HelixPaginatedScheduleSegmentRequest(broadcaster, this._client, filter);
	}

	/**
	 * Retrieves a set of schedule segments by IDs.
	 *
	 * @param broadcaster The broadcaster to get schedule segments of.
	 * @param ids The IDs of the schedule segments.
	 */
	async getScheduleSegmentsByIds(broadcaster: UserIdResolvable, ids: string[]): Promise<HelixScheduleSegment[]> {
		const result = await this._client.callApi<HelixScheduleResponse>({
			type: TwitchApiCallType.Helix,
			url: 'schedule',
			query: {
				broadcaster_id: extractUserId(broadcaster),
				id: ids
			}
		});

		return result.data.segments.map(data => new HelixScheduleSegment(data, this._client));
	}

	/**
	 * Retrieves a single schedule segment by ID.
	 *
	 * @param broadcaster The broadcaster to get a schedule segment of.
	 * @param id The ID of the schedule segment.
	 */
	async getScheduleSegmentById(broadcaster: UserIdResolvable, id: string): Promise<HelixScheduleSegment | null> {
		const segments = await this.getScheduleSegmentsByIds(broadcaster, [id]);

		return segments.length ? segments[0] : null;
	}
}
