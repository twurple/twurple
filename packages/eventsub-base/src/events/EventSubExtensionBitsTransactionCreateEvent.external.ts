/** @private */
export interface EventSubExtensionBitsTransactionCreateEventProductData {
	name: string;
	sku: string;
	bits: number;
	in_development: boolean;
}

/** @private */
export interface EventSubExtensionBitsTransactionCreateEventData {
	id: string;
	extension_client_id: string;
	user_id: string;
	user_login: string;
	user_name: string;
	broadcaster_user_id: string;
	broadcaster_user_login: string;
	broadcaster_user_name: string;
	product: EventSubExtensionBitsTransactionCreateEventProductData;
}
