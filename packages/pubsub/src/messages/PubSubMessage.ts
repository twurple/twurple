import { type PubSubAutoModQueueMessage } from './PubSubAutoModQueueMessage';
import { type PubSubAutoModQueueMessageData } from './PubSubAutoModQueueMessage.external';
import { type PubSubBitsBadgeUnlockMessage } from './PubSubBitsBadgeUnlockMessage';
import { type PubSubBitsBadgeUnlockMessageData } from './PubSubBitsBadgeUnlockMessage.external';
import { type PubSubBitsMessage } from './PubSubBitsMessage';
import { type PubSubBitsMessageData } from './PubSubBitsMessage.external';
import { type PubSubChannelRoleChangeMessage } from './PubSubChannelRoleChangeMessage';
import { type PubSubChannelRoleChangeMessageData } from './PubSubChannelRoleChangeMessage.external';
import { type PubSubChannelTermsActionMessage } from './PubSubChannelTermsActionMessage';
import { type PubSubChannelTermsActionMessageData } from './PubSubChannelTermsActionMessage.external';
import { type PubSubChatModActionMessage } from './PubSubChatModActionMessage';
import { type PubSubChatModActionMessageData } from './PubSubChatModActionMessage.external';
import { type PubSubCustomMessage } from './PubSubCustomMessage';
import { type PubSubRedemptionMessage } from './PubSubRedemptionMessage';
import { type PubSubRedemptionMessageData } from './PubSubRedemptionMessage.external';
import { type PubSubSubscriptionMessage } from './PubSubSubscriptionMessage';
import { type PubSubSubscriptionMessageData } from './PubSubSubscriptionMessage.external';
import { type PubSubUserModerationNotificationMessage } from './PubSubUserModerationNotificationMessage';
import { type PubSubUserModerationNotificationMessageData } from './PubSubUserModerationNotificationMessage.external';
import { type PubSubWhisperMessage } from './PubSubWhisperMessage';
import { type PubSubWhisperMessageData } from './PubSubWhisperMessage.external';

/** @private */
export type PubSubModActionMessageData =
	| PubSubChatModActionMessageData
	| PubSubChannelTermsActionMessageData
	| PubSubChannelRoleChangeMessageData;

/** @private */
export type PubSubMessageData =
	| PubSubAutoModQueueMessageData
	| PubSubBitsMessageData
	| PubSubBitsBadgeUnlockMessageData
	| PubSubModActionMessageData
	| PubSubRedemptionMessageData
	| PubSubSubscriptionMessageData
	| PubSubUserModerationNotificationMessageData
	| PubSubWhisperMessageData
	| unknown;

/** @private */
export type PubSubModActionMessage =
	| PubSubChatModActionMessage
	| PubSubChannelTermsActionMessage
	| PubSubChannelRoleChangeMessage;

/** @private */
export type PubSubMessage =
	| PubSubAutoModQueueMessage
	| PubSubBitsMessage
	| PubSubBitsBadgeUnlockMessage
	| PubSubModActionMessage
	| PubSubRedemptionMessage
	| PubSubSubscriptionMessage
	| PubSubUserModerationNotificationMessage
	| PubSubWhisperMessage
	| PubSubCustomMessage;
