import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixUser } from '@twurple/api';
import { checkRelationAssertion, DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import { type EventSubExtensionBitsTransactionCreateEventData } from './EventSubExtensionBitsTransactionCreateEvent.external';

/**
 * An EventSub event representing a bits transaction in an extension.
 */
@rtfm<EventSubExtensionBitsTransactionCreateEvent>('eventsub-base', 'EventSubExtensionBitsTransactionCreateEvent', 'id')
export class EventSubExtensionBitsTransactionCreateEvent extends DataObject<EventSubExtensionBitsTransactionCreateEventData> {
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: EventSubExtensionBitsTransactionCreateEventData, client: ApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The ID of the transaction.
	 */
	get id(): string {
		return this[rawDataSymbol].id;
	}

	/**
	 * The client ID of the extension.
	 */
	get clientId(): string {
		return this[rawDataSymbol].extension_client_id;
	}

	/**
	 * The ID of the subscribing user.
	 */
	get userId(): string {
		return this[rawDataSymbol].user_id;
	}

	/**
	 * The name of the subscribing user.
	 */
	get userName(): string {
		return this[rawDataSymbol].user_login;
	}

	/**
	 * The display name of the subscribing user.
	 */
	get userDisplayName(): string {
		return this[rawDataSymbol].user_name;
	}

	/**
	 * Gets more information about the subscribing user.
	 */
	async getUser(): Promise<HelixUser> {
		return checkRelationAssertion(await this._client.users.getUserById(this[rawDataSymbol].user_id));
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
		return checkRelationAssertion(await this._client.users.getUserById(this[rawDataSymbol].broadcaster_user_id));
	}

	/**
	 * The name of the product the transaction is referring to.
	 */
	get productName(): string {
		return this[rawDataSymbol].product.name;
	}

	/**
	 * The SKU of the product the transaction is referring to.
	 */
	get productSku(): string {
		return this[rawDataSymbol].product.sku;
	}

	/**
	 * The cost of the product the transaction is referring to, in Bits.
	 */
	get productCost(): number {
		return this[rawDataSymbol].product.bits;
	}

	/**
	 * Whether the product the transaction is referring to is in development.
	 */
	get productInDevelopment(): boolean {
		return this[rawDataSymbol].product.in_development;
	}
}
