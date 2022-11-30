import { type MakeOptional } from '@d-fischer/shared-utils';
import { type PubSubBasicMessageInfo } from './PubSubMessage.external';

/** @private */
export interface PubSubBitsMessageBadgeEntitlement {
	previous_version: number;
	new_version: number;
}

/** @private */
export interface PubSubBitsMessageContent
	extends MakeOptional<PubSubBasicMessageInfo, 'channel_id' | 'channel_name' | 'user_id' | 'user_name'> {
	chat_message: string;
	bits_used: number;
	total_bits_used: number;
	context: 'cheer';
	badge_entitlement: PubSubBitsMessageBadgeEntitlement | null;
	is_anonymous: boolean;
}

/** @private */
export interface PubSubBitsMessageData {
	data: PubSubBitsMessageContent;
	version: string;
	message_type: string;
	message_id: string;
}
