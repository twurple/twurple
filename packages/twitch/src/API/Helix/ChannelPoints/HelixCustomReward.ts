import { Enumerable } from '@d-fischer/shared-utils';
import { rtfm } from 'twitch-common';
import type { HelixUser } from '../User/HelixUser';
import type { ApiClient } from '../../../ApiClient';

/** @private */
export interface HelixCustomRewardImageData {
	url_1x: string;
	url_2x: string;
	url_4x: string;
}

/** @private */
export interface HelixCustomRewardMaxPerStreamSettingData {
	is_enabled: boolean;
	max_per_stream: number;
}

/** @private */
export interface HelixCustomRewardMaxPerUserPerStreamSettingData {
	is_enabled: boolean;
	max_per_user_per_stream: number;
}

/** @private */
export interface HelixCustomRewardGlobalCooldownSettingData {
	is_enabled: boolean;
	global_cooldown_seconds: number;
}

/** @private */
export type HelixCustomRewardImageScale = 1 | 2 | 4;

/** @private */
export interface HelixCustomRewardData {
	broadcaster_name: string;
	broadcaster_id: string;
	id: string;
	image: HelixCustomRewardImageData | null;
	background_color: string;
	is_enabled: boolean;
	cost: number;
	title: string;
	prompt: string;
	is_user_input_required: boolean;
	max_per_stream_setting: HelixCustomRewardMaxPerStreamSettingData;
	max_per_user_per_stream_setting: HelixCustomRewardMaxPerUserPerStreamSettingData;
	global_cooldown_setting: HelixCustomRewardGlobalCooldownSettingData;
	is_paused: boolean;
	is_in_stock: boolean;
	default_image: HelixCustomRewardImageData;
	should_redemptions_skip_request_queue: boolean;
	redemptions_redeemed_current_stream: number | null;
	cooldown_expires_at: string;
}

/**
 * A custom Channel Points reward.
 */
@rtfm<HelixCustomReward>('twitch', 'HelixCustomReward', 'id')
export class HelixCustomReward {
	@Enumerable(false) private readonly _data: HelixCustomRewardData;
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: HelixCustomRewardData, client: ApiClient) {
		this._data = data;
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
		return this._data.broadcaster_id;
	}

	/**
	 * The display name of the broadcaster the reward belongs to.
	 */
	get broadcasterDisplayName(): string {
		return this._data.broadcaster_name;
	}

	/**
	 * Retrieves more information about the reward's broadcaster.
	 */
	async getBroadcaster(): Promise<HelixUser | null> {
		return this._client.helix.users.getUserById(this._data.broadcaster_id);
	}

	/**
	 * Gets the URL of the image of the reward in the given scale.
	 *
	 * @param scale The scale of the image.
	 */
	getImageUrl(scale: HelixCustomRewardImageScale): string {
		const urlProp = `url_${scale}x`;
		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return this._data.image?.[urlProp] ?? this._data.default_image[urlProp];
	}

	/**
	 * The background color of the reward.
	 */
	get backgroundColor(): string {
		return this._data.background_color;
	}

	/**
	 * Whether the reward is enabled (shown to users).
	 */
	get isEnabled(): boolean {
		return this._data.is_enabled;
	}

	/**
	 * The channel points cost of the reward.
	 */
	get cost(): number {
		return this._data.cost;
	}

	/**
	 * The title of the reward.
	 */
	get title(): string {
		return this._data.title;
	}

	/**
	 * The prompt shown to users when redeeming the reward.
	 */
	get propmt(): string {
		return this._data.prompt;
	}

	/**
	 * Whether the reward requires user input to be redeemed.
	 */
	get userInputRequired(): boolean {
		return this._data.is_user_input_required;
	}

	/**
	 * The maximum number of redemptions of the reward per stream. `null` means no limit.
	 */
	get maxRedemptionsPerStream(): number | null {
		return this._data.max_per_stream_setting.is_enabled ? this._data.max_per_stream_setting.max_per_stream : null;
	}

	/**
	 * The maximum number of redemptions of the reward per stream for each user. `null` means no limit.
	 */
	get maxRedemptionsPerUserPerStream(): number | null {
		return this._data.max_per_user_per_stream_setting.is_enabled
			? this._data.max_per_user_per_stream_setting.max_per_user_per_stream
			: null;
	}

	/**
	 * The cooldown between two redemptions of the reward, in seconds. `null` means no cooldown.
	 */
	get globalCooldown(): number | null {
		return this._data.global_cooldown_setting.is_enabled
			? this._data.global_cooldown_setting.global_cooldown_seconds
			: null;
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
	 * How often the reward was already redeemed this stream.
	 *
	 * Only available when the stream is live and `maxRedemptionsPerStream` is set. Otherwise, this is `null`.
	 */
	get redemptionsThisStream(): number | null {
		return this._data.redemptions_redeemed_current_stream;
	}

	/**
	 * When the cooldown ends. `null` means there is currently no cooldown.
	 */
	get cooldownExpiryDate(): Date | null {
		return this._data.cooldown_expires_at ? new Date(this._data.cooldown_expires_at) : null;
	}
}
