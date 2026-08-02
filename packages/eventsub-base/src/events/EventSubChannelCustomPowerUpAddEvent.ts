import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixUser, HelixCustomPowerUp } from '@twurple/api';
import { checkRelationAssertion, DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import type { EventSubChannelCustomPowerUpAddEventData } from './EventSubChannelCustomPowerUpAddEvent.external.js';

/**
 * An EventSub event representing a Custom Power Up redemption.
 */
@rtfm<EventSubChannelCustomPowerUpAddEvent>('eventsub-base', 'EventSubChannelCustomPowerUpAddEvent', 'id')
export class EventSubChannelCustomPowerUpAddEvent extends DataObject<EventSubChannelCustomPowerUpAddEventData> {
	/** @internal */ @Enumerable(false) private readonly _client?: ApiClient;

	/** @internal */
	constructor(data: EventSubChannelCustomPowerUpAddEventData, client?: ApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The ID of the redemption.
	 */
	get id(): string {
		return this[rawDataSymbol].id;
	}

	/**
	 * The ID of the broadcaster.
	 */
	get broadcasterId(): string {
		return this[rawDataSymbol].broadcaster_user_id;
	}

	/**
	 * The name of the broadcaster.
	 */
	get broadcasterName(): string {
		return this[rawDataSymbol].broadcaster_user_login;
	}

	/**
	 * The display name of the broadcaster.
	 */
	get broadcasterDisplayName(): string {
		return this[rawDataSymbol].broadcaster_user_name;
	}

	/**
	 * Gets more information about the broadcaster.
	 */
	async getBroadcaster(): Promise<HelixUser> {
		if (!this._client) {
			throw new Error('EventSubChannelCustomPowerUpAddEvent#getBroadcaster is not supported in this context');
		}
		return checkRelationAssertion(await this._client.users.getUserById(this[rawDataSymbol].broadcaster_user_id));
	}

	/**
	 * The ID of the user.
	 */
	get userId(): string {
		return this[rawDataSymbol].user_id;
	}

	/**
	 * The name of the user.
	 */
	get userName(): string {
		return this[rawDataSymbol].user_login;
	}

	/**
	 * The display name of the user.
	 */
	get userDisplayName(): string {
		return this[rawDataSymbol].user_name;
	}

	/**
	 * Gets more information about the user.
	 */
	async getUser(): Promise<HelixUser> {
		if (!this._client) {
			throw new Error('EventSubChannelCustomPowerUpAddEvent#getUser is not supported in this context');
		}
		return checkRelationAssertion(await this._client.users.getUserById(this[rawDataSymbol].user_id));
	}

	/**
	 * The input text given by the user.
	 *
	 * If there is no input to be given, this is an empty string.
	 */
	get input(): string {
		return this[rawDataSymbol].user_input;
	}

	/**
	 * The status of the redemption.
	 */
	get status(): string {
		return this[rawDataSymbol].status;
	}

	/**
	 * The ID of the power up that was redeemed.
	 */
	get powerUpId(): string {
		return this[rawDataSymbol].custom_power_up.id;
	}

	/**
	 * The title of the power up that was redeemed.
	 */
	get powerUpTitle(): string {
		return this[rawDataSymbol].custom_power_up.title;
	}

	/**
	 * The cost of the power up that was redeemed.
	 */
	get powerUpCost(): number {
		return this[rawDataSymbol].custom_power_up.bits;
	}

	/**
	 * The description of the power up that was redeemed.
	 */
	get powerUpPrompt(): string {
		return this[rawDataSymbol].custom_power_up.prompt;
	}

	/**
	 * Gets more information about the power up that was redeemed.
	 */
	async getPowerUp(): Promise<HelixCustomPowerUp> {
		if (!this._client) {
			throw new Error('EventSubChannelCustomPowerUpAddEvent#getPowerUp is not supported in this context');
		}
		return checkRelationAssertion(
			await this._client.bits.getCustomPowerUpById(
				this[rawDataSymbol].broadcaster_user_id,
				this[rawDataSymbol].custom_power_up.id,
			),
		);
	}

	/**
	 * The time when the user redeemed the power up.
	 */
	get redemptionDate(): Date {
		return new Date(this[rawDataSymbol].redeemed_at);
	}
}
