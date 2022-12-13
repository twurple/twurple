import type { HelixPaginatedResponse, TwitchApiCallOptions } from '@twurple/api-call';
import type { UserIdResolvable } from '@twurple/common';
import { rtfm } from '@twurple/common';
import type { ApiClient } from '../../../ApiClient';
import {
	createScheduleQuery,
	type HelixScheduleResponse,
	type HelixScheduleSegmentData
} from '../../../interfaces/helix/schedule.external';
import { type HelixScheduleFilter } from '../../../interfaces/helix/schedule.input';
import { HelixPaginatedRequest } from '../HelixPaginatedRequest';
import { HelixScheduleSegment } from './HelixScheduleSegment';

/**
 * A paginator specifically for schedule segments.
 */
@rtfm('api', 'HelixPaginatedScheduleSegmentRequest')
export class HelixPaginatedScheduleSegmentRequest extends HelixPaginatedRequest<
	HelixScheduleSegmentData,
	HelixScheduleSegment
> {
	/** @private */
	constructor(broadcaster: UserIdResolvable, client: ApiClient, filter?: HelixScheduleFilter) {
		super(
			{
				url: 'schedule',
				query: createScheduleQuery(broadcaster, filter)
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
