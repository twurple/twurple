import { Enumerable } from '@d-fischer/shared-utils';
import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import type { ApiClient } from '../../../ApiClient';
import type { User } from '../user/User';

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
@rtfm<Team>('api', 'Team', 'id')
export class Team extends DataObject<TeamData> {
	/** @private */ @Enumerable(false) protected readonly _client: ApiClient;

	/** @private */
	constructor(data: TeamData, client: ApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The ID of the team.
	 */
	get id(): string {
		return this[rawDataSymbol]._id;
	}

	/**
	 * The background url of the team.
	 */
	get background(): string {
		return this[rawDataSymbol].background;
	}

	/**
	 * The banner url of the team.
	 */
	get banner(): string {
		return this[rawDataSymbol].banner;
	}

	/**
	 * The date when the team was created.
	 */
	get creationDate(): Date {
		return new Date(this[rawDataSymbol].created_at);
	}

	/**
	 * The last date when the team changed anything.
	 */
	get updateDate(): Date {
		return new Date(this[rawDataSymbol].updated_at);
	}

	/**
	 * The name of the team.
	 */
	get name(): string {
		return this[rawDataSymbol].name;
	}

	/**
	 * The info of the team.
	 */
	get info(): string {
		return this[rawDataSymbol].info;
	}

	/**
	 * The display name of the team.
	 */
	get displayName(): string {
		return this[rawDataSymbol].display_name;
	}

	/**
	 * The URL to the profile picture of the team.
	 */
	get logoUrl(): string {
		return this[rawDataSymbol].logo;
	}

	async getUsers(): Promise<User[]> {
		const team = await this._client.kraken.teams.getTeamByName(this.name);
		return await team.getUsers();
	}
}
