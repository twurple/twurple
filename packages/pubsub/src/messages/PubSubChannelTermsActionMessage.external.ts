/** @private */
export interface PubSubChannelTermsActionMessageContent {
	type: string;
	id: string;
	text: string;
	requester_id: string;
	requester_login: string;
	expires_at: string;
	updated_at: string;
	from_automod: boolean;
}

/** @private */
export interface PubSubChannelTermsActionMessageData {
	type: 'channel_terms_action';
	data: PubSubChannelTermsActionMessageContent;
}
