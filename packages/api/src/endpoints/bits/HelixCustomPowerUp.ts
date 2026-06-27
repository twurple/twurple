import { Enumerable } from '@d-fischer/shared-utils';
import { checkRelationAssertion, DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import { type BaseApiClient } from '../../client/BaseApiClient.js';
import { type HelixCustomRewardImageScale } from '../../interfaces/endpoints/channelPoints.input.js';
import type { HelixUser } from '../user/HelixUser.js';
import type { HelixCustomPowerUpData } from '../../interfaces/endpoints/powerUps.external.js';

/**
 * A custom power up.
 */
@rtfm<HelixCustomPowerUp>('api', 'HelixCustomPowerUp', 'id')
export class HelixCustomPowerUp extends DataObject<HelixCustomPowerUpData> {
	/** @internal */ @Enumerable(false) private readonly _client: BaseApiClient;

	/** @internal */
	constructor(data: HelixCustomPowerUpData, client: BaseApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The ID of the power up.
	 */
	get id(): string {
		return this[rawDataSymbol].id;
	}

	/**
	 * The ID of the broadcaster the power up belongs to.
	 */
	get broadcasterId(): string {
		return this[rawDataSymbol].broadcaster_id;
	}

	/**
	 * The name of the broadcaster the power up belongs to.
	 */
	get broadcasterName(): string {
		return this[rawDataSymbol].broadcaster_login;
	}

	/**
	 * The display name of the broadcaster the power up belongs to.
	 */
	get broadcasterDisplayName(): string {
		return this[rawDataSymbol].broadcaster_name;
	}

	/**
	 * Gets more information about the power up's broadcaster.
	 */
	async getBroadcaster(): Promise<HelixUser> {
		return checkRelationAssertion(await this._client.users.getUserById(this[rawDataSymbol].broadcaster_id));
	}

	/**
	 * Gets the URL of the image of the power up in the given scale.
	 *
	 * @param scale The scale of the image.
	 */
	getImageUrl(scale: HelixCustomRewardImageScale): string {
		const urlProp = `url_${scale}x` as const;
		return this[rawDataSymbol].image?.[urlProp] ?? this[rawDataSymbol].default_image[urlProp];
	}

	/**
	 * The background color of the power up.
	 */
	get backgroundColor(): string {
		return this[rawDataSymbol].background_color;
	}

	/**
	 * Whether the power up is enabled (shown to users).
	 */
	get isEnabled(): boolean {
		return this[rawDataSymbol].is_enabled;
	}

	/**
	 * The bits cost of the power up.
	 */
	get cost(): number {
		return this[rawDataSymbol].bits;
	}

	/**
	 * The title of the power up.
	 */
	get title(): string {
		return this[rawDataSymbol].title;
	}

	/**
	 * The prompt shown to users when redeeming the power up.
	 */
	get prompt(): string {
		return this[rawDataSymbol].prompt;
	}

	/**
	 * Whether the power up requires user input to be redeemed.
	 */
	get userInputRequired(): boolean {
		return this[rawDataSymbol].is_user_input_required;
	}

	/**
	 * The maximum number of redemptions of the power up per stream. `null` means no limit.
	 */
	get maxRedemptionsPerStream(): number | null {
		return this[rawDataSymbol].max_per_stream_setting.is_enabled
			? this[rawDataSymbol].max_per_stream_setting.max_per_stream
			: null;
	}

	/**
	 * The maximum number of redemptions of the power up per stream for each user. `null` means no limit.
	 */
	get maxRedemptionsPerUserPerStream(): number | null {
		return this[rawDataSymbol].max_per_user_per_stream_setting.is_enabled
			? this[rawDataSymbol].max_per_user_per_stream_setting.max_per_user_per_stream
			: null;
	}

	/**
	 * The cooldown between two redemptions of the power up, in seconds. `null` means no cooldown.
	 */
	get globalCooldown(): number | null {
		return this[rawDataSymbol].global_cooldown_setting.is_enabled
			? this[rawDataSymbol].global_cooldown_setting.global_cooldown_seconds
			: null;
	}

	/**
	 * Whether the power up is paused. If true, users can't redeem it.
	 */
	get isPaused(): boolean {
		return this[rawDataSymbol].is_paused;
	}

	/**
	 * Whether the power up is currently in stock.
	 */
	get isInStock(): boolean {
		return this[rawDataSymbol].is_in_stock;
	}

	/**
	 * How often the power up was already redeemed this stream.
	 *
	 * Only available when the stream is live and `maxRedemptionsPerStream` is set. Otherwise, this is `null`.
	 */
	get redemptionsThisStream(): number | null {
		return this[rawDataSymbol].redemptions_redeemed_current_stream;
	}

	/**
	 * The time when the cooldown ends. `null` means there is currently no cooldown.
	 */
	get cooldownExpiryDate(): Date | null {
		return this[rawDataSymbol].cooldown_expires_at ? new Date(this[rawDataSymbol].cooldown_expires_at) : null;
	}
}
