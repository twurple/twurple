import ChannelPlaceholder, { ChannelPlaceholderData } from './ChannelPlaceholder';
import TwitchClient from '../../../TwitchClient';
import { ChannelUpdateData } from './ChannelAPI';

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
export default class Channel extends ChannelPlaceholder {
	/** @private */
	protected _data: ChannelData;

	/** @private */
	constructor(data: ChannelData, client: TwitchClient) {
		super(data._id, client);
		this._data = data;
	}

	// override parent's method so we avoid the API/cache request here if someone wrongly assumes this is a placeholder
	/** @private */
	async getChannel() {
		return this;
	}

	/**
	 * Updates the game, title or delay of a channel or toggles the channel feed.
	 */
	async update(data: ChannelUpdateData) {
		return this._client.kraken.channels.updateChannel(this, data);
	}

	/**
	 * The name of the channel.
	 */
	get name() {
		return this._data.name;
	}

	/**
	 * The display name of the channel, with proper capitalization or as Asian script.
	 */
	get displayName() {
		return this._data.display_name;
	}

	/**
	 * The broadcaster's language.
	 */
	get broadcasterLanguage() {
		return this._data.broadcaster_language;
	}

	/**
	 * The broadcaster's type, i.e. "partner", "affiliate" or "" (empty string, so neither of them).
	 */
	get broadcasterType() {
		return this._data.broadcaster_type;
	}

	/**
	 * The date when the channel was created.
	 */
	get creationDate() {
		return new Date(this._data.created_at);
	}

	/**
	 * The description of the channel.
	 */
	get description() {
		return this._data.description;
	}

	/**
	 * The number of people following the channel.
	 */
	get followers() {
		return this._data.followers;
	}

	/**
	 * The game that is currently being played on the channel (or was played when it was last online).
	 */
	get game() {
		return this._data.game;
	}

	/**
	 * The language of the channel.
	 */
	get language() {
		return this._data.language;
	}

	/**
	 * The URL to the logo of the channel.
	 */
	get logo() {
		return this._data.logo;
	}

	/**
	 * Whether the channel is flagged as suitable for mature audiences only.
	 */
	get isMature() {
		return this._data.mature;
	}

	/**
	 * Whether the channel is partnered.
	 */
	get isPartner() {
		return this._data.partner;
	}

	/**
	 * The URL to the profile's banner image.
	 */
	get profileBanner() {
		return this._data.profile_banner;
	}

	/**
	 * The background color of the profile's banner.
	 */
	get profileBannerBackgroundColor() {
		return this._data.profile_banner_background_color;
	}

	/**
	 * The current status message (i.e. the title) of the channel.
	 */
	get status() {
		return this._data.status;
	}

	/**
	 * The date when the channel was last updated.
	 */
	get updateDate() {
		return new Date(this._data.updated_at);
	}

	/**
	 * The URL to the channel.
	 */
	get url() {
		return this._data.url;
	}

	/**
	 * The URL to the channel's video banner, i.e. the offline image.
	 */
	get videoBanner() {
		return this._data.video_banner;
	}

	/**
	 * The total number of views of the channel.
	 */
	get views() {
		return this._data.views;
	}
}
