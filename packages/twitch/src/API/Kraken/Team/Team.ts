import { Enumerable } from '@d-fischer/shared-utils';
import { rtfm } from 'twitch-common';
import type { ApiClient } from '../../../ApiClient';
import type { User } from '../User/User';

/** @private */
export interface TeamData {
	_id: string;
	background: string;
	banner: string;
	created_at: string;
	display_name: string;
	info: string;
	logo: string;
	name: string;
	updated_at: string;
}

/**
 * A Twitch team.
 */
@rtfm<Team>('twitch', 'Team', 'id')
export class Team {
	/** @private */ @Enumerable(false) protected readonly _data: TeamData;
	/** @private */ @Enumerable(false) protected readonly _client: ApiClient;

	/** @private */
	constructor(data: TeamData, client: ApiClient) {
		this._data = data;
		this._client = client;
	}

	/**
	 * The ID of the team.
	 */
	get id(): string {
		return this._data._id;
	}

	/**
	 * The background url of the team.
	 */
	get background(): string {
		return this._data.background;
	}

	/**
	 * The banner url of the team.
	 */
	get banner(): string {
		return this._data.banner;
	}

	/**
	 * The date when the team was created.
	 */
	get creationDate(): Date {
		return new Date(this._data.created_at);
	}

	/**
	 * The last date when the team changed anything.
	 */
	get updateDate(): Date {
		return new Date(this._data.updated_at);
	}

	/**
	 * The name of the team.
	 */
	get name(): string {
		return this._data.name;
	}

	/**
	 * The info of the team.
	 */
	get info(): string {
		return this._data.info;
	}

	/**
	 * The display name of the team.
	 */
	get displayName(): string {
		return this._data.display_name;
	}

	/**
	 * The URL to the profile picture of the team.
	 */
	get logoUrl(): string {
		return this._data.logo;
	}

	async getUsers(): Promise<User[]> {
		const team = await this._client.kraken.teams.getTeamByName(this.name);
		return team.getUsers();
	}
}
