import type { HelixPaginatedResponse, HelixResponse } from '@twurple/api-call';
import { createBroadcasterQuery } from '@twurple/api-call';
import type { UserIdResolvable } from '@twurple/common';
import { extractUserId, rtfm } from '@twurple/common';
import {
	type HelixCharityCampaignData,
	type HelixCharityCampaignDonationData
} from '../../../interfaces/helix/charity.external';
import { BaseApi } from '../../BaseApi';
import type { HelixPaginatedResult } from '../HelixPaginatedResult';
import { createPaginatedResult } from '../HelixPaginatedResult';
import type { HelixForwardPagination } from '../HelixPagination';
import { createPaginationQuery } from '../HelixPagination';
import { HelixCharityCampaign } from './HelixCharityCampaign';
import { HelixCharityCampaignDonation } from './HelixCharityCampaignDonation';

/**
 * The Helix API methods that deal with charity campaigns.
 *
 * Can be accessed using `client.charity` on an {@link ApiClient} instance.
 *
 * ## Example
 * ```ts
 * const api = new ApiClient(new StaticAuthProvider(clientId, accessToken));
 * const charityCampaign = await api.charity.getCharityCampaign('125328655');
 * ```
 *
 * @beta
 * @meta category helix
 * @meta categorizedTitle Charity Campaigns
 */
@rtfm('api', 'HelixCharityApi')
export class HelixCharityApi extends BaseApi {
	/**
	 * Gets information about the charity campaign that a broadcaster is running.
	 * Returns null if the specified broadcaster has no active charity campaign.
	 *
	 * @beta
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
	 * @beta
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
