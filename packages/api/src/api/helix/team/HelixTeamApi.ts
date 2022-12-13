import type { HelixResponse } from '@twurple/api-call';
import { createBroadcasterQuery, HttpStatusCodeError } from '@twurple/api-call';
import type { UserIdResolvable } from '@twurple/common';
import { rtfm } from '@twurple/common';
import { type HelixTeamData, type HelixTeamWithUsersData } from '../../../interfaces/helix/team.external';
import { BaseApi } from '../../BaseApi';
import { HelixTeam } from './HelixTeam';
import { HelixTeamWithUsers } from './HelixTeamWithUsers';

/**
 * The Helix API methods that deal with teams.
 *
 * Can be accessed using `client.teams` on an {@link ApiClient} instance.
 *
 * ## Example
 * ```ts
 * const api = new ApiClient(new StaticAuthProvider(clientId, accessToken));
 * const tags = await api.teams.getChannelTeams('125328655');
 * ```
 *
 * @meta category helix
 * @meta categorizedTitle Teams
 */
@rtfm('api', 'HelixTeamApi')
export class HelixTeamApi extends BaseApi {
	/**
	 * Retrieves a list of all teams a broadcaster is a member of.
	 *
	 * @param broadcaster The broadcaster to retrieve the teams of.
	 */
	async getTeamsForBroadcaster(broadcaster: UserIdResolvable): Promise<HelixTeam[]> {
		const result = await this._client.callApi<Partial<HelixResponse<HelixTeamData>>>({
			type: 'helix',
			url: 'teams/channel',
			query: createBroadcasterQuery(broadcaster)
		});

		return result.data?.map(data => new HelixTeam(data, this._client)) ?? [];
	}

	/**
	 * Retrieves a team by ID.
	 *
	 * Returns null if there is no team with the given ID.
	 *
	 * @param id The ID of the team.
	 */
	async getTeamById(id: string): Promise<HelixTeamWithUsers | null> {
		try {
			const result = await this._client.callApi<HelixResponse<HelixTeamWithUsersData>>({
				type: 'helix',
				url: 'teams',
				query: {
					id
				}
			});

			return new HelixTeamWithUsers(result.data[0], this._client);
		} catch (e) {
			// Twitch, please...
			if (e instanceof HttpStatusCodeError && e.statusCode === 500) {
				return null;
			}
			throw e;
		}
	}

	/**
	 * Retrieves a team by name.
	 *
	 * Returns null if there is no team with the given name.
	 *
	 * @param name The name of the team.
	 */
	async getTeamByName(name: string): Promise<HelixTeamWithUsers | null> {
		try {
			const result = await this._client.callApi<HelixResponse<HelixTeamWithUsersData>>({
				type: 'helix',
				url: 'teams',
				query: {
					name
				}
			});

			return new HelixTeamWithUsers(result.data[0], this._client);
		} catch (e) {
			// ...but this one is fine
			if (e instanceof HttpStatusCodeError && e.statusCode === 404) {
				return null;
			}
			throw e;
		}
	}
}
