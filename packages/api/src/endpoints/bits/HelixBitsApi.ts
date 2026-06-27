import { mapOptional } from '@d-fischer/shared-utils';
import { createBroadcasterQuery, type HelixResponse } from '@twurple/api-call';
import { extractUserId, rtfm, type UserIdResolvable } from '@twurple/common';
import {
	createBitsLeaderboardQuery,
	type HelixBitsLeaderboardResponse,
	type HelixCheermoteData,
} from '../../interfaces/endpoints/bits.external.js';
import { type HelixBitsLeaderboardQuery } from '../../interfaces/endpoints/bits.input.js';
import { BaseApi } from '../BaseApi.js';
import { HelixBitsLeaderboard } from './HelixBitsLeaderboard.js';
import { HelixCheermoteList } from './HelixCheermoteList.js';
import {
	getAllPowerUpsQuery,
	getPowerUpQuery,
	getPowerUpsQuery,
	type HelixCustomPowerUpData,
} from '../../interfaces/endpoints/powerUps.external.js';
import { HelixCustomPowerUp } from './HelixCustomPowerUp.js';

/**
 * The Helix API methods that deal with bits.
 *
 * Can be accessed using `client.bits` on an {@link ApiClient} instance.
 *
 * ## Example
 * ```ts
 * const api = new ApiClient({ authProvider });
 * const leaderboard = await api.bits.getLeaderboard({ period: 'day' });
 * ```
 *
 * @meta category helix
 * @meta categorizedTitle Bits
 */
@rtfm('api', 'HelixBitsApi')
export class HelixBitsApi extends BaseApi {
	/**
	 * Gets a bits leaderboard of your channel.
	 *
	 * @param broadcaster The user to get the leaderboard of.
	 * @param params
	 * @expandParams
	 */
	async getLeaderboard(
		broadcaster: UserIdResolvable,
		params: HelixBitsLeaderboardQuery = {},
	): Promise<HelixBitsLeaderboard> {
		const result = await this._client.callApi<HelixBitsLeaderboardResponse>({
			type: 'helix',
			url: 'bits/leaderboard',
			userId: extractUserId(broadcaster),
			scopes: ['bits:read'],
			query: createBitsLeaderboardQuery(params),
		});

		return new HelixBitsLeaderboard(result, this._client);
	}

	/**
	 * Gets all available cheermotes.
	 *
	 * @param broadcaster The broadcaster to include custom cheermotes of.
	 *
	 * If not given, only get global cheermotes.
	 */
	async getCheermotes(broadcaster?: UserIdResolvable): Promise<HelixCheermoteList> {
		const result = await this._client.callApi<HelixResponse<HelixCheermoteData>>({
			type: 'helix',
			url: 'bits/cheermotes',
			userId: mapOptional(broadcaster, extractUserId),
			query: mapOptional(broadcaster, createBroadcasterQuery),
		});

		return new HelixCheermoteList(result.data);
	}

	/**
	 * Gets all custom power ups for the given broadcaster.
	 *
	 * @param broadcaster The broadcaster to get the power ups for.
	 */
	async getCustomPowerUps(broadcaster: UserIdResolvable): Promise<HelixCustomPowerUp[]> {
		const result = await this._client.callApi<HelixResponse<HelixCustomPowerUpData>>({
			type: 'helix',
			url: 'bits/custom_power_ups',
			userId: extractUserId(broadcaster),
			scopes: ['bits:read'],
			query: getAllPowerUpsQuery(broadcaster),
		});

		return result.data.map(data => new HelixCustomPowerUp(data, this._client));
	}

	/**
	 * Gets custom power ups by ID.
	 *
	 * @param broadcaster The broadcaster to get the power ups for.
	 * @param powerUpId The ID of the power up.
	 */
	async getCustomPowerUpsById(broadcaster: UserIdResolvable, powerUpId: string): Promise<HelixCustomPowerUp[]> {
		if (!powerUpId) {
			return [];
		}
		const result = await this._client.callApi<HelixResponse<HelixCustomPowerUpData>>({
			type: 'helix',
			url: 'bits/custom_power_ups',
			userId: extractUserId(broadcaster),
			scopes: ['bits:read'],
			query: getPowerUpQuery(broadcaster, powerUpId),
		});

		return result.data.map(data => new HelixCustomPowerUp(data, this._client));
	}

	/**
	 * Gets custom power ups by IDs.
	 *
	 * @param broadcaster The broadcaster to get the power ups for.
	 * @param powerUpIds The IDs of the power ups.
	 */
	async getCustomPowerUpsByIds(broadcaster: UserIdResolvable, powerUpIds: string[]): Promise<HelixCustomPowerUp[]> {
		if (!powerUpIds.length) {
			return [];
		}
		const result = await this._client.callApi<HelixResponse<HelixCustomPowerUpData>>({
			type: 'helix',
			url: 'bits/custom_power_ups',
			userId: extractUserId(broadcaster),
			scopes: ['bits:read'],
			query: getPowerUpsQuery(broadcaster, powerUpIds),
		});

		return result.data.map(data => new HelixCustomPowerUp(data, this._client));
	}

	/**
	 * Gets a custom power up by ID.
	 *
	 * @param broadcaster The broadcaster to get the power up for.
	 * @param powerUpId The ID of the power up.
	 */
	async getCustomPowerUpById(broadcaster: UserIdResolvable, powerUpId: string): Promise<HelixCustomPowerUp | null> {
		const powerUps = await this.getCustomPowerUpsById(broadcaster, powerUpId);
		return powerUps.length ? powerUps[0] : null;
	}
}
