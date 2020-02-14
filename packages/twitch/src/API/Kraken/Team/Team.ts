import { NonEnumerable } from '@d-fischer/shared-utils';
import TwitchClient from '../../../TwitchClient';

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
export default class Team {
	/** @private */
	@NonEnumerable protected readonly _client: TwitchClient;

	/** @private */
	constructor(/** @private */ protected _data: TeamData, client: TwitchClient) {
		this._client = client;
	}

	/**
	 * The ID of the team.
	 */
	get id() {
		return this._data._id;
	}

	/**
	 * The background url of the team.
	 */
	get background() {
		return this._data.background;
	}

	/**
	 * The banner url of the team.
	 */
	get banner() {
		return this._data.banner;
	}

	/**
	 * The date when the team was created.
	 */
	get creationDate() {
		return new Date(this._data.created_at);
	}

	/**
	 * The last date when the team changed anything.
	 */
	get updateDate() {
		return new Date(this._data.updated_at);
	}

	/**
	 * The name of the team.
	 */
	get name() {
		return this._data.name;
	}

	/**
	 * The info of the team.
	 */
	get info() {
		return this._data.info;
	}

	/**
	 * The display name of the team.
	 */
	get displayName() {
		return this._data.display_name;
	}

	/**
	 * The URL to the profile picture of the team.
	 */
	get logoUrl() {
		return this._data.logo;
	}

	async getUsers() {
		const team = await this._client.kraken.teams.getTeamByName(this.name);
		return team.getUsers();
	}
}
