import { Enumerable, mapNullable } from '@d-fischer/shared-utils';
import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import { type BaseApiClient } from '../../../client/BaseApiClient';
import { type HelixScheduleSegmentData } from '../../../interfaces/helix/schedule.external';
import type { HelixGame } from '../game/HelixGame';

/**
 * A segment of a schedule.
 */
@rtfm<HelixScheduleSegment>('api', 'HelixScheduleSegment', 'id')
export class HelixScheduleSegment extends DataObject<HelixScheduleSegmentData> {
	@Enumerable(false) private readonly _client: BaseApiClient;

	/** @private */
	constructor(data: HelixScheduleSegmentData, client: BaseApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The ID of the segment.
	 */
	get id(): string {
		return this[rawDataSymbol].id;
	}

	/**
	 * The date when the segment starts.
	 */
	get startDate(): Date {
		return new Date(this[rawDataSymbol].start_time);
	}

	/**
	 * The date when the segment ends.
	 */
	get endDate(): Date {
		return new Date(this[rawDataSymbol].end_time);
	}

	/**
	 * The title of the segment.
	 */
	get title(): string {
		return this[rawDataSymbol].title;
	}

	/**
	 * The date up to which the segment is canceled.
	 */
	get cancelEndDate(): Date | null {
		return mapNullable(this[rawDataSymbol].canceled_until, v => new Date(v));
	}

	/**
	 * The ID of the category the segment is scheduled for, or null if no category is specified.
	 */
	get categoryId(): string | null {
		return this[rawDataSymbol].category?.id ?? null;
	}

	/**
	 * The name of the category the segment is scheduled for, or null if no category is specified.
	 */
	get categoryName(): string | null {
		return this[rawDataSymbol].category?.name ?? null;
	}

	/**
	 * Retrieves more information about the category the segment is scheduled for, or null if no category is specified.
	 */
	async getCategory(): Promise<HelixGame | null> {
		const categoryId = this[rawDataSymbol].category?.id;

		return categoryId ? await this._client.games.getGameById(categoryId) : null;
	}

	/**
	 * Whether the segment is recurring every week.
	 */
	get isRecurring(): boolean {
		return this[rawDataSymbol].is_recurring;
	}
}
