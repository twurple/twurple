import { createBroadcasterQuery, type HelixPaginatedResponse, type HelixResponse } from '@twurple/api-call';
import { extractUserId, rtfm, type UserIdResolvable } from '@twurple/common';
import {
	type HelixCharityCampaignData,
	type HelixCharityCampaignDonationData
} from '../../interfaces/endpoints/charity.external';
import { createPaginatedResult, type HelixPaginatedResult } from '../../utils/pagination/HelixPaginatedResult';
import { createPaginationQuery, type HelixForwardPagination } from '../../utils/pagination/HelixPagination';
import { BaseApi } from '../BaseApi';
import { HelixCharityCampaign } from './HelixCharityCampaign';
import { HelixCharityCampaignDonation } from './HelixCharityCampaignDonation';

/**
 * The Helix API methods that deal with charity campaigns.
 *
 * Can be accessed using `client.charity` on an {@link ApiClient} instance.
 *
 * ## Example
 * ```ts
 * const api = new ApiClient({ authProvider });
 * const charityCampaign = await api.charity.getCharityCampaign('125328655');
 * ```
 *
 * @meta category helix
 * @meta categorizedTitle Charity Campaigns
 */
@rtfm('api', 'HelixCharityApi')
export class HelixCharityApi extends BaseApi {
	/**
	 * Gets information about the charity campaign that a broadcaster is running.
	 * Returns null if the specified broadcaster has no active charity campaign.
	 *
	 * @param broadcaster The broadcaster to get charity campaign information about.
	 */
	async getCharityCampaign(broadcaster: UserIdResolvable): Promise<HelixCharityCampaign> {
		const response = await this._client.callApi<HelixResponse<HelixCharityCampaignData>>({
			type: 'helix',
			url: 'charity/campaigns',
			method: 'GET',
			userId: extractUserId(broadcaster),
			scopes: ['channel:read:charity'],
			query: createBroadcasterQuery(broadcaster)
		});

		return new HelixCharityCampaign(response.data[0], this._client);
	}

	/**
	 * Gets the list of donations that users have made to the broadcaster’s active charity campaign.
	 *
	 * @param broadcaster The broadcaster to get charity campaign donation information about.
	 * @param pagination
	 *
	 * @expandParams
	 */
	async getCharityCampaignDonations(
		broadcaster: UserIdResolvable,
		pagination?: HelixForwardPagination
	): Promise<HelixPaginatedResult<HelixCharityCampaignDonation>> {
		const response = await this._client.callApi<HelixPaginatedResponse<HelixCharityCampaignDonationData>>({
			type: 'helix',
			url: 'charity/donations',
			userId: extractUserId(broadcaster),
			scopes: ['channel:read:charity'],
			query: {
				...createBroadcasterQuery(broadcaster),
				...createPaginationQuery(pagination)
			}
		});

		return createPaginatedResult(response, HelixCharityCampaignDonation, this._client);
	}
}
