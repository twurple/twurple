import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient } from '../../../ApiClient';
import type { HelixGame } from '../Game/HelixGame';

/** @private */
export interface HelixScheduleSegmentCategoryData {
	id: string;
	name: string;
}

/** @private */
export interface HelixScheduleSegmentData {
	id: string;
	start_time: string;
	end_time: string;
	title: string;
	canceled_until: string | null;
	category: HelixScheduleSegmentCategoryData | null;
	is_recurring: boolean;
}

/**
 * A segment of a schedule.
 */
export class HelixScheduleSegment {
	@Enumerable(false) private readonly _data: HelixScheduleSegmentData;
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: HelixScheduleSegmentData, client: ApiClient) {
		this._data = data;
		this._client = client;
	}

	/**
	 * The ID of the segment.
	 */
	get id(): string {
		return this._data.id;
	}

	/**
	 * The date when the segment starts.
	 */
	get startDate(): Date {
		return new Date(this._data.start_time);
	}

	/**
	 * The date when the segment ends.
	 */
	get endDate(): Date {
		return new Date(this._data.end_time);
	}

	/**
	 * The title of the segment.
	 */
	get title(): string {
		return this._data.title;
	}

	/**
	 * The date up to which the segment is canceled.
	 */
	get cancelEndDate(): Date | null {
		return this._data.canceled_until ? new Date(this._data.canceled_until) : null;
	}

	/**
	 * The ID of the category the segment is scheduled for, or null if no category is specified.
	 */
	get categoryId(): string | null {
		return this._data.category?.id ?? null;
	}

	/**
	 * The name of the category the segment is scheduled for, or null if no category is specified.
	 */
	get categoryName(): string | null {
		return this._data.category?.name ?? null;
	}

	/**
	 * Retrieves more information about the category the segment is scheduled for, or null if no category is specified.
	 */
	async getCategory(): Promise<HelixGame | null> {
		const categoryId = this._data.category?.id;

		return categoryId ? this._client.helix.games.getGameById(categoryId) : null;
	}

	/**
	 * Whether the segment is recurring every week.
	 */
	get isRecurring(): boolean {
		return this._data.is_recurring;
	}
}
