import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixUser } from 'twitch';
import { rtfm } from 'twitch-common';

/** @private */
export interface EventSubChannelRewardMaxPerStreamData {
	is_enabled: boolean;
	value: number | null;
}

/** @private */
export interface EventSubChannelRewardCooldownData {
	is_enabled: boolean;
	seconds: number | null;
}

/** @private */
export interface EventSubChannelRewardImageData {
	url_1x: string;
	url_2x: string;
	url_4x: string;
}

/** @private */
export type EventSubChannelRewardImageScale = 1 | 2 | 4;

/** @private */
export interface EventSubChannelRewardEventData {
	id: string;
	broadcaster_user_id: string;
	broadcaster_user_login: string;
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
	max_per_stream: EventSubChannelRewardMaxPerStreamData;
	max_per_user_per_stream: EventSubChannelRewardMaxPerStreamData;
	global_cooldown: EventSubChannelRewardCooldownData;
	background_color: string;
	image: EventSubChannelRewardImageData | null;
	default_image: EventSubChannelRewardImageData;
}

/**
 * An EventSub event representing a broadcaster adding, updating or removing a Channel Points reward for their channel.
 */
@rtfm<EventSubChannelRewardEvent>('twitch-eventsub', 'EventSubChannelRewardEvent', 'id')
export class EventSubChannelRewardEvent {
	/** @private */
	@Enumerable(false) protected readonly _client: ApiClient;

	/** @private */
	constructor(private readonly _data: EventSubChannelRewardEventData, client: ApiClient) {
		this._client = client;
	}

	/**
	 * The ID of the reward.
	 */
	get id(): string {
		return this._data.id;
	}

	/**
	 * The ID of the broadcaster the reward belongs to.
	 */
	get broadcasterId(): string {
		return this._data.broadcaster_user_id;
	}

	/**
	 * The name of the broadcaster the reward belongs to.
	 */
	get broadcasterName(): string {
		return this._data.broadcaster_user_login;
	}

	/**
	 * The display name of the broadcaster the reward belongs to.
	 */
	get broadcasterDisplayName(): string {
		return this._data.broadcaster_user_name;
	}

	/**
	 * Retrieves more information about the reward's broadcaster.
	 */
	async getBroadcaster(): Promise<HelixUser> {
		return (await this._client.helix.users.getUserById(this._data.broadcaster_user_id))!;
	}

	/**
	 * Whether the reward is enabled (shown to users).
	 */
	get isEnabled(): boolean {
		return this._data.is_enabled;
	}

	/**
	 * Whether the reward is paused. If true, users can't redeem it.
	 */
	get isPaused(): boolean {
		return this._data.is_paused;
	}

	/**
	 * Whether the reward is currently in stock.
	 */
	get isInStock(): boolean {
		return this._data.is_in_stock;
	}

	/**
	 * The title of the reward.
	 */
	get title(): string {
		return this._data.title;
	}

	/**
	 * The channel points cost of the reward.
	 */
	get cost(): number {
		return this._data.cost;
	}

	/**
	 * The prompt shown to users when redeeming the reward.
	 */
	get prompt(): string {
		return this._data.prompt;
	}

	/**
	 * Whether users need to enter information when redeeming the reward.
	 */
	get userInputRequired(): boolean {
		return this._data.is_user_input_required;
	}

	/**
	 * Whether redemptions should be automatically approved.
	 */
	get autoApproved(): boolean {
		return this._data.should_redemptions_skip_request_queue;
	}

	/**
	 * The time when the cooldown expires.
	 */
	get cooldownExpiryDate(): Date | null {
		return this._data.cooldown_expires_at ? new Date(this._data.cooldown_expires_at) : null;
	}

	/**
	 * How often the reward was already redeemed this stream.
	 *
	 * Only available when the stream is live and `maxRedemptionsPerStream` is set. Otherwise, this is `null`.
	 */
	get redemptionsThisStream(): number | null {
		return this._data.redemptions_redeemed_current_stream;
	}

	/**
	 * The maximum number of redemptions of the reward per stream. `null` means no limit.
	 */
	get maxRedemptionsPerStream(): number | null {
		return this._data.max_per_stream.is_enabled ? this._data.max_per_stream.value : null;
	}

	/**
	 * The maximum number of redemptions of the reward per stream for each user. `null` means no limit.
	 */
	get maxRedemptionsPerUserPerStream(): number | null {
		return this._data.max_per_user_per_stream.is_enabled ? this._data.max_per_user_per_stream.value : null;
	}

	/**
	 * The cooldown between two redemptions of the reward, in seconds. `null` means no cooldown.
	 */
	get globalCooldown(): number | null {
		return this._data.global_cooldown.is_enabled ? this._data.global_cooldown.seconds : null;
	}

	/**
	 * The background color of the reward.
	 */
	get backgroundColor(): string {
		return this._data.background_color;
	}

	/**
	 * Gets the URL of the image of the reward in the given scale.
	 *
	 * @param scale The scale of the image.
	 */
	getImageUrl(scale: EventSubChannelRewardImageScale): string {
		// eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
		const urlProp = `url_${scale}x` as const;
		return this._data.image?.[urlProp] ?? this._data.default_image[urlProp];
	}
}
