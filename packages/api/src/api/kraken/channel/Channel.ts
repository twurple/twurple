import type { UserNameResolveableType } from '@twurple/common';
import { rawDataSymbol, rtfm } from '@twurple/common';
import type { Team } from '../team/Team';
import type { ChannelUpdateData } from './ChannelApi';
import type { ChannelPlaceholderData } from './ChannelPlaceholder';
import { ChannelPlaceholder } from './ChannelPlaceholder';

/** @private */
export interface ChannelData extends ChannelPlaceholderData {
	broadcaster_language: string;
	broadcaster_type: string;
	created_at: string;
	description: string;
	display_name: string;
	followers: number;
	game: string;
	language: string;
	logo: string;
	mature: boolean;
	name: string;
	partner: boolean;
	profile_banner: string | null;
	profile_banner_background_color: string | null;
	status: string;
	updated_at: string;
	url: string;
	video_banner: string;
	views: number;
}

/**
 * A Twitch Channel.
 */
@rtfm<Channel>('api', 'Channel', 'id')
export class Channel extends ChannelPlaceholder implements UserNameResolveableType {
	/** @private */ declare readonly [rawDataSymbol]: ChannelData;

	// override parent's method so we avoid the API/cache request here if someone wrongly assumes this is a placeholder
	/** @private */
	async getChannel(): Promise<Channel> {
		return this;
	}

	/**
	 * Retrieves a list of the teams of the channel.
	 */
	async getTeams(): Promise<Team[]> {
		return await this._client.kraken.channels.getChannelTeams(this[rawDataSymbol]._id);
	}

	/**
	 * Updates the game, title or delay of a channel or toggles the channel feed.
	 */
	async update(data: ChannelUpdateData): Promise<void> {
		await this._client.kraken.channels.updateChannel(this, data);
	}

	/**
	 * The name of the channel.
	 */
	get name(): string {
		return this[rawDataSymbol].name;
	}

	/**
	 * The display name of the channel, with proper capitalization or as Asian script.
	 */
	get displayName(): string {
		return this[rawDataSymbol].display_name;
	}

	/**
	 * The broadcaster's language.
	 */
	get broadcasterLanguage(): string {
		return this[rawDataSymbol].broadcaster_language;
	}

	/**
	 * The broadcaster's type, i.e. "partner", "affiliate" or "" (empty string, so neither of them).
	 */
	get broadcasterType(): string {
		return this[rawDataSymbol].broadcaster_type;
	}

	/**
	 * The date when the channel was created.
	 */
	get creationDate(): Date {
		return new Date(this[rawDataSymbol].created_at);
	}

	/**
	 * The description of the channel.
	 */
	get description(): string {
		return this[rawDataSymbol].description;
	}

	/**
	 * The number of people following the channel.
	 */
	get followers(): number {
		return this[rawDataSymbol].followers;
	}

	/**
	 * The game that is currently being played on the channel (or was played when it was last online).
	 */
	get game(): string {
		return this[rawDataSymbol].game;
	}

	/**
	 * The language of the channel.
	 */
	get language(): string {
		return this[rawDataSymbol].language;
	}

	/**
	 * The URL to the logo of the channel.
	 */
	get logo(): string {
		return this[rawDataSymbol].logo;
	}

	/**
	 * Whether the channel is flagged as suitable for mature audiences only.
	 */
	get isMature(): boolean {
		return this[rawDataSymbol].mature;
	}

	/**
	 * Whether the channel is partnered.
	 */
	get isPartner(): boolean {
		return this[rawDataSymbol].partner;
	}

	/**
	 * The URL to the profile's banner image.
	 */
	get profileBanner(): string | null {
		return this[rawDataSymbol].profile_banner;
	}

	/**
	 * The background color of the profile's banner.
	 */
	get profileBannerBackgroundColor(): string | null {
		return this[rawDataSymbol].profile_banner_background_color;
	}

	/**
	 * The current status message (i.e. the title) of the channel.
	 */
	get status(): string {
		return this[rawDataSymbol].status;
	}

	/**
	 * The date when the channel was last updated.
	 */
	get updateDate(): Date {
		return new Date(this[rawDataSymbol].updated_at);
	}

	/**
	 * The URL to the channel.
	 */
	get url(): string {
		return this[rawDataSymbol].url;
	}

	/**
	 * The URL to the channel's video banner, i.e. the offline image.
	 */
	get videoBanner(): string {
		return this[rawDataSymbol].video_banner;
	}

	/**
	 * The total number of views of the channel.
	 */
	get views(): number {
		return this[rawDataSymbol].views;
	}
}
