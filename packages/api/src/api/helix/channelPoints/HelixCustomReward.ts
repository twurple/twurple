import { Enumerable } from '@d-fischer/shared-utils';
import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import type { ApiClient } from '../../../ApiClient';
import type { HelixUser } from '../user/HelixUser';

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
	broadcaster_id: string;
	broadcaster_login: string;
	broadcaster_name: string;
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
@rtfm<HelixCustomReward>('api', 'HelixCustomReward', 'id')
export class HelixCustomReward extends DataObject<HelixCustomRewardData> {
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: HelixCustomRewardData, client: ApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The ID of the reward.
	 */
	get id(): string {
		return this[rawDataSymbol].id;
	}

	/**
	 * The ID of the broadcaster the reward belongs to.
	 */
	get broadcasterId(): string {
		return this[rawDataSymbol].broadcaster_id;
	}

	/**
	 * The name of the broadcaster the reward belongs to.
	 */
	get broadcasterName(): string {
		return this[rawDataSymbol].broadcaster_login;
	}

	/**
	 * The display name of the broadcaster the reward belongs to.
	 */
	get broadcasterDisplayName(): string {
		return this[rawDataSymbol].broadcaster_name;
	}

	/**
	 * Retrieves more information about the reward's broadcaster.
	 */
	async getBroadcaster(): Promise<HelixUser> {
		return (await this._client.users.getUserById(this[rawDataSymbol].broadcaster_id))!;
	}

	/**
	 * Gets the URL of the image of the reward in the given scale.
	 *
	 * @param scale The scale of the image.
	 */
	getImageUrl(scale: HelixCustomRewardImageScale): string {
		const urlProp = `url_${scale}x` as const;
		return this[rawDataSymbol].image?.[urlProp] ?? this[rawDataSymbol].default_image[urlProp];
	}

	/**
	 * The background color of the reward.
	 */
	get backgroundColor(): string {
		return this[rawDataSymbol].background_color;
	}

	/**
	 * Whether the reward is enabled (shown to users).
	 */
	get isEnabled(): boolean {
		return this[rawDataSymbol].is_enabled;
	}

	/**
	 * The channel points cost of the reward.
	 */
	get cost(): number {
		return this[rawDataSymbol].cost;
	}

	/**
	 * The title of the reward.
	 */
	get title(): string {
		return this[rawDataSymbol].title;
	}

	/**
	 * The prompt shown to users when redeeming the reward.
	 */
	get prompt(): string {
		return this[rawDataSymbol].prompt;
	}

	/**
	 * Whether the reward requires user input to be redeemed.
	 */
	get userInputRequired(): boolean {
		return this[rawDataSymbol].is_user_input_required;
	}

	/**
	 * The maximum number of redemptions of the reward per stream. `null` means no limit.
	 */
	get maxRedemptionsPerStream(): number | null {
		return this[rawDataSymbol].max_per_stream_setting.is_enabled
			? this[rawDataSymbol].max_per_stream_setting.max_per_stream
			: null;
	}

	/**
	 * The maximum number of redemptions of the reward per stream for each user. `null` means no limit.
	 */
	get maxRedemptionsPerUserPerStream(): number | null {
		return this[rawDataSymbol].max_per_user_per_stream_setting.is_enabled
			? this[rawDataSymbol].max_per_user_per_stream_setting.max_per_user_per_stream
			: null;
	}

	/**
	 * The cooldown between two redemptions of the reward, in seconds. `null` means no cooldown.
	 */
	get globalCooldown(): number | null {
		return this[rawDataSymbol].global_cooldown_setting.is_enabled
			? this[rawDataSymbol].global_cooldown_setting.global_cooldown_seconds
			: null;
	}

	/**
	 * Whether the reward is paused. If true, users can't redeem it.
	 */
	get isPaused(): boolean {
		return this[rawDataSymbol].is_paused;
	}

	/**
	 * Whether the reward is currently in stock.
	 */
	get isInStock(): boolean {
		return this[rawDataSymbol].is_in_stock;
	}

	/**
	 * How often the reward was already redeemed this stream.
	 *
	 * Only available when the stream is live and `maxRedemptionsPerStream` is set. Otherwise, this is `null`.
	 */
	get redemptionsThisStream(): number | null {
		return this[rawDataSymbol].redemptions_redeemed_current_stream;
	}

	/**
	 * Whether redemptions should be automatically approved.
	 */
	get autoApproved(): boolean {
		return this[rawDataSymbol].should_redemptions_skip_request_queue;
	}

	/**
	 * Them time when the cooldown ends. `null` means there is currently no cooldown.
	 */
	get cooldownExpiryDate(): Date | null {
		return this[rawDataSymbol].cooldown_expires_at ? new Date(this[rawDataSymbol].cooldown_expires_at) : null;
	}
}
