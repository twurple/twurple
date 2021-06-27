import type { TwitchApiCallOptions } from '@twurple/api-call';
import type { UserIdResolvable } from '@twurple/common';
import { extractUserId } from '@twurple/common';
import type { ApiClient } from '../../../ApiClient';
import { HelixPaginatedRequest } from '../HelixPaginatedRequest';
import type { HelixPaginatedResponse } from '../HelixResponse';
import type { HelixScheduleResponse } from './HelixSchedule';
import type { HelixScheduleFilter } from './HelixScheduleApi';
import type { HelixScheduleSegmentData } from './HelixScheduleSegment';
import { HelixScheduleSegment } from './HelixScheduleSegment';

/**
 * A paginator specifically for schedule segments.
 */
export class HelixPaginatedScheduleSegmentRequest extends HelixPaginatedRequest<
	HelixScheduleSegmentData,
	HelixScheduleSegment
> {
	/** @private */
	constructor(broadcaster: UserIdResolvable, client: ApiClient, filter?: HelixScheduleFilter) {
		super(
			{
				url: 'schedule',
				query: {
					broadcaster_id: extractUserId(broadcaster),
					start_time: filter?.startDate,
					utc_offset: filter?.utcOffset?.toString()
				}
			},
			client,
			data => new HelixScheduleSegment(data, client),
			25
		);
	}

	// sadly, this hack is necessary to work around the weird data model of schedules
	// while still keeping the pagination code as generic as possible
	/** @private */
	protected async _fetchData(
		additionalOptions: Partial<TwitchApiCallOptions> = {}
	): Promise<HelixPaginatedResponse<HelixScheduleSegmentData>> {
		const origData = (await super._fetchData(additionalOptions)) as unknown as HelixScheduleResponse;

		return {
			data: origData.data.segments,
			pagination: origData.pagination
		};
	}
}
