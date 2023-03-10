import { type PubSubLowTrustUserContentBase } from './common/PubSubLowTrustUserContentBase.external';

/**
 * Emote data of a chat message fragment.
 */
export interface PubSubLowTrustUserTreatmentChatMessageContentFragmentEmoteData {
	emoticonID: string;
	emoticonSetID: string;
}

/**
 * A text fragment of a chat message from a low-trust user.
 *
 * Contains emote data if the fragment is a chat emote.
 */
export interface PubSubLowTrustUserChatMessageContentFragmentData {
	text: string;
	emoticon?: PubSubLowTrustUserTreatmentChatMessageContentFragmentEmoteData;
}

/** @private */
export interface PubSubLowTrustUserChatMessageTreatmentContent extends PubSubLowTrustUserContentBase {
	id: string;
	sender: {
		user_id: string;
		login: string;
		display_name: string;
	};
	shared_ban_channel_ids: string[] | null;
}

/** @private */
export interface PubSubLowTrustUserChatMessageContent {
	low_trust_user: PubSubLowTrustUserChatMessageTreatmentContent;
	message_content: {
		text: string;
		fragments: PubSubLowTrustUserChatMessageContentFragmentData[];
	};
	message_id: string;
	sent_at: string;
}

/** @private */
export interface PubSubLowTrustUserChatMessageData {
	type: 'low_trust_user_new_message';
	data: PubSubLowTrustUserChatMessageContent;
}
