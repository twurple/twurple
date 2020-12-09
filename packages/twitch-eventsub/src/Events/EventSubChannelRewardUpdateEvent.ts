import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixUser } from 'twitch';

export interface EventSubChannelRewardUpdateEventData {
	id: string;
	broadcaster_user_id: string;
	broadcaster_user_name: string;
	is_enabled: boolean;
	is_paused: boolean;
	is_in_stock: boolean;
	title: string;
	cost: number;
	prompt: string;
	is_user_input_required: boolean;
	should_redemptions_skip_request_queue: boolean;
	cooldown_expires_at: string | null;
	redemptions_redeemed_current_stream: number | null;
	max_per_stream: EventSubMaxStreamData;
	max_per_user_per_stream: EventSubMaxStreamData;
	global_cooldown: EventSubCooldownData; // eslint-disable-line @typescript-eslint/naming-convention
	background_color: string;
	image: EventSubRewardImageData;
	default_image: EventSubRewardImageData;
}
interface EventSubMaxStreamData {
	is_enabled: boolean;
	value: number | null;
}
interface EventSubCooldownData {
	is_enabled: boolean;
	seconds: number | null;
}
interface EventSubRewardImageData {
	url_1x: string | null;
	url_2x: string | null;
	url_4x: string | null;
}

/**
 * An EventSub event representing a broadcaster updating a Channel Points reward on their channel.
 */
export class EventSubChannelRewardUpdateEvent {
	/** @private */
	@Enumerable(false) protected readonly _client: ApiClient;

	constructor(private readonly _data: EventSubChannelRewardUpdateEventData, client: ApiClient) {
		this._client = client;
	}

	/**
	 * The ID of the Reward added
	 */
	get id(): string {
		return this._data.id;
	}

	/**
	 * The ID of the broadcaster.
	 */
	get broadcasterId(): string {
		return this._data.broadcaster_user_id;
	}

	/**
	 * The display name of the broadcaster.
	 */
	get broadcasterDisplayName(): string {
		return this._data.broadcaster_user_name;
	}

	/**
	 * Retrieves more information about the broadcaster.
	 */
	async getBroadcaster(): Promise<HelixUser> {
		return (await this._client.helix.users.getUserById(this._data.broadcaster_user_id))!;
	}
	/**
	 * Whether the reward is enabled by the broadcaster
	 */
	get isEnabled(): boolean {
		return this._data.is_enabled;
	}

	/**
	 * Whether the reward is paused by the broadcaster or their mods
	 */
	get isPaused(): boolean {
		return this._data.is_paused;
	}

	/**
	 * Whether the reward is listed as "in stock" (for limited rewards)
	 */
	get isInStock(): boolean {
		return this._data.is_in_stock;
	}

	/**
	 * The reward title or display name
	 */
	get title(): string {
		return this._data.title;
	}

	/**
	 * The cost of redeeming the reward
	 */
	get cost(): number {
		return this._data.cost;
	}

	/**
	 * The description of the reward
	 */
	get prompt(): string {
		return this._data.prompt;
	}

	/**
	 * Whether users need to enter information when redeeming the reward
	 */
	get isUserInputRequired(): boolean {
		return this._data.is_user_input_required;
	}

	/**
	 * Should redemptions skip the Request Queue
	 */
	get shouldRedemptionsSkipRequestQueue(): boolean {
		return this._data.should_redemptions_skip_request_queue;
	}

	/**
	 * When the cooldown expires
	 */
	get cooldownExpiresAt(): Date | null {
		if (this._data.cooldown_expires_at === null) return null;
		else return new Date(this._data.cooldown_expires_at);
	}

	/**
	 * The number of redemptions for the current stream
	 */
	get redemptionsRedeemedCurrentStream(): number | null {
		return this._data.redemptions_redeemed_current_stream;
	}

	/**
	 * Whether the maximum per stream is enabled
	 */
	get maxPerStreamEnabled(): boolean {
		return this._data.max_per_stream.is_enabled;
	}

	/**
	 * The maximum redemptions per stream, if enabled
	 */
	get maxPerStream(): number | null {
		return this._data.max_per_stream.value;
	}

	/**
	 * Whether the maxmimum per user per stream is enabled
	 */
	get maxPerUserPerStreamEnabled(): boolean {
		return this._data.max_per_user_per_stream.is_enabled;
	}

	/**
	 * Maximum redemptions per user per stream, if enabled
	 */
	get maxPerUserPerStream(): number | null {
		return this._data.max_per_user_per_stream.value;
	}

	/**
	 * Whether the global cooldown is enabled
	 */
	get globalCooldownEnabled(): boolean {
		return this._data.global_cooldown.is_enabled;
	}

	/**
	 * The global cooldown time, in seconds, if enabled
	 */
	get globalCooldown(): number | null {
		return this._data.global_cooldown.seconds;
	}

	/**
	 * The background color of the Reward icon
	 */
	get backgroundColor(): string {
		return this._data.background_color;
	}

	/**
	 * The 1x version of the reward image
	 */
	get image1x(): string | null {
		return this._data.image.url_1x;
	}

	/**
	 * The 2x version of the reward image
	 */
	get image2x(): string | null {
		return this._data.image.url_2x;
	}

	/**
	 * The 4x version of the reward image
	 */
	get image4x(): string | null {
		return this._data.image.url_4x;
	}

	/**
	 * The 1x version of the default image
	 */
	get defaultImage1x(): string {
		return this._data.default_image.url_1x!;
	}

	/**
	 * The 2x version of the default image
	 */
	get defaultImage2x(): string {
		return this._data.default_image.url_2x!;
	}

	/**
	 * The 4x version of the default image
	 */
	get defaultImage4x(): string {
		return this._data.default_image.url_4x!;
	}
}
