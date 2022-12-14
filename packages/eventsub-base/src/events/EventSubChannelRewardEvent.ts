import { Enumerable, mapNullable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixUser } from '@twurple/api';
import { checkRelationAssertion, DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import {
	type EventSubChannelRewardEventData,
	type EventSubChannelRewardImageScale
} from './EventSubChannelRewardEvent.external';

/**
 * An EventSub event representing a broadcaster adding, updating or removing a Channel Points reward for their channel.
 */
@rtfm<EventSubChannelRewardEvent>('eventsub-base', 'EventSubChannelRewardEvent', 'id')
export class EventSubChannelRewardEvent extends DataObject<EventSubChannelRewardEventData> {
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: EventSubChannelRewardEventData, client: ApiClient) {
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
		return this[rawDataSymbol].broadcaster_user_id;
	}

	/**
	 * The name of the broadcaster the reward belongs to.
	 */
	get broadcasterName(): string {
		return this[rawDataSymbol].broadcaster_user_login;
	}

	/**
	 * The display name of the broadcaster the reward belongs to.
	 */
	get broadcasterDisplayName(): string {
		return this[rawDataSymbol].broadcaster_user_name;
	}

	/**
	 * Retrieves more information about the reward's broadcaster.
	 */
	async getBroadcaster(): Promise<HelixUser> {
		return checkRelationAssertion(await this._client.users.getUserById(this[rawDataSymbol].broadcaster_user_id));
	}

	/**
	 * Whether the reward is enabled (shown to users).
	 */
	get isEnabled(): boolean {
		return this[rawDataSymbol].is_enabled;
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
	 * The title of the reward.
	 */
	get title(): string {
		return this[rawDataSymbol].title;
	}

	/**
	 * The channel points cost of the reward.
	 */
	get cost(): number {
		return this[rawDataSymbol].cost;
	}

	/**
	 * The prompt shown to users when redeeming the reward.
	 */
	get prompt(): string {
		return this[rawDataSymbol].prompt;
	}

	/**
	 * Whether users need to enter information when redeeming the reward.
	 */
	get userInputRequired(): boolean {
		return this[rawDataSymbol].is_user_input_required;
	}

	/**
	 * Whether redemptions should be automatically approved.
	 */
	get autoApproved(): boolean {
		return this[rawDataSymbol].should_redemptions_skip_request_queue;
	}

	/**
	 * The time when the cooldown expires.
	 */
	get cooldownExpiryDate(): Date | null {
		return mapNullable(this[rawDataSymbol].cooldown_expires_at, v => new Date(v));
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
	 * The maximum number of redemptions of the reward per stream. `null` means no limit.
	 */
	get maxRedemptionsPerStream(): number | null {
		return this[rawDataSymbol].max_per_stream.is_enabled ? this[rawDataSymbol].max_per_stream.value : null;
	}

	/**
	 * The maximum number of redemptions of the reward per stream for each user. `null` means no limit.
	 */
	get maxRedemptionsPerUserPerStream(): number | null {
		return this[rawDataSymbol].max_per_user_per_stream.is_enabled
			? this[rawDataSymbol].max_per_user_per_stream.value
			: null;
	}

	/**
	 * The cooldown between two redemptions of the reward, in seconds. `null` means no cooldown.
	 */
	get globalCooldown(): number | null {
		return this[rawDataSymbol].global_cooldown.is_enabled ? this[rawDataSymbol].global_cooldown.seconds : null;
	}

	/**
	 * The background color of the reward.
	 */
	get backgroundColor(): string {
		return this[rawDataSymbol].background_color;
	}

	/**
	 * Gets the URL of the image of the reward in the given scale.
	 *
	 * @param scale The scale of the image.
	 */
	getImageUrl(scale: EventSubChannelRewardImageScale): string {
		const urlProp = `url_${scale}x` as const;
		return this[rawDataSymbol].image?.[urlProp] ?? this[rawDataSymbol].default_image[urlProp];
	}
}
