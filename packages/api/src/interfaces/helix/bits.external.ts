import { type HelixResponse } from '@twurple/api-call';
import { type CheermoteBackground, type CheermoteScale, type CheermoteState } from '@twurple/common';
import { type HelixBitsLeaderboardQuery } from './bits.input';
import { type HelixDateRangeData } from './generic.external';

/** @private */
export interface HelixBitsLeaderboardEntryData {
	user_id: string;
	user_login: string;
	user_name: string;
	rank: number;
	score: number;
}

/** @private */
export interface HelixBitsLeaderboardResponse extends HelixResponse<HelixBitsLeaderboardEntryData> {
	date_range: HelixDateRangeData;
	total: number;
}

/** @private */
export type HelixCheermoteActionImageUrlsByScale = Record<CheermoteScale, string>;
/** @private */
export type HelixCheermoteActionImageUrlsByStateAndScale = Record<CheermoteState, HelixCheermoteActionImageUrlsByScale>;
/** @private */
export type HelixCheermoteActionImageUrlsByBackgroundAndStateAndScale = Record<
	CheermoteBackground,
	HelixCheermoteActionImageUrlsByStateAndScale
>;

/** @private */
export interface HelixCheermoteTierData {
	min_bits: number;
	id: string;
	color: string;
	images: HelixCheermoteActionImageUrlsByBackgroundAndStateAndScale;
	can_cheer: boolean;
	show_in_bits_card: boolean;
}

/** @private */
type HelixCheermoteType = 'global_first_party' | 'global_third_party' | 'channel_custom' | 'display_only' | 'sponsored';

/** @private */
export interface HelixCheermoteData {
	prefix: string;
	tiers: HelixCheermoteTierData[];
	type: HelixCheermoteType;
	last_updated: string;
	order: number;
}

/** @private */
export function createBitsLeaderboardQuery(params: HelixBitsLeaderboardQuery = {}) {
	const { count = 10, period = 'all', startDate, contextUserId } = params;
	return {
		count: count.toString(),
		period,
		started_at: startDate?.toISOString(),
		user_id: contextUserId
	};
}
