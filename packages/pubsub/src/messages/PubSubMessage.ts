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
import { type PubSubLowTrustUserTreatmentMessage } from './PubSubLowTrustUserTreatmentMessage';
import { type PubSubLowTrustUserTreatmentMessageData } from './PubSubLowTrustUserTreatmentMessage.external';
import { type PubSubLowTrustUserChatMessage } from './PubSubLowTrustUserChatMessage';
import { type PubSubLowTrustUserChatMessageData } from './PubSubLowTrustUserChatMessage.external';
import { type PubSubRedemptionMessage } from './PubSubRedemptionMessage';
import { type PubSubRedemptionMessageData } from './PubSubRedemptionMessage.external';
import { type PubSubSubscriptionMessage } from './PubSubSubscriptionMessage';
import { type PubSubSubscriptionMessageData } from './PubSubSubscriptionMessage.external';
import { type PubSubUnbanRequestMessage } from './PubSubUnbanRequestMessage';
import { type PubSubUnbanRequestMessageData } from './PubSubUnbanRequestMessage.external';
import { type PubSubUserModerationNotificationMessage } from './PubSubUserModerationNotificationMessage';
import { type PubSubUserModerationNotificationMessageData } from './PubSubUserModerationNotificationMessage.external';
import { type PubSubWhisperMessage } from './PubSubWhisperMessage';
import { type PubSubWhisperMessageData } from './PubSubWhisperMessage.external';

/** @private */
export type PubSubLowTrustUserMessageData = PubSubLowTrustUserTreatmentMessageData | PubSubLowTrustUserChatMessageData;

/** @private */
export type PubSubModActionMessageData =
	| PubSubChatModActionMessageData
	| PubSubChannelTermsActionMessageData
	| PubSubChannelRoleChangeMessageData
	| PubSubUnbanRequestMessageData;

/** @private */
export type PubSubMessageData =
	| PubSubAutoModQueueMessageData
	| PubSubBitsMessageData
	| PubSubBitsBadgeUnlockMessageData
	| PubSubLowTrustUserMessageData
	| PubSubModActionMessageData
	| PubSubRedemptionMessageData
	| PubSubSubscriptionMessageData
	| PubSubUserModerationNotificationMessageData
	| PubSubWhisperMessageData
	| unknown;

export type PubSubLowTrustUserMessage = PubSubLowTrustUserTreatmentMessage | PubSubLowTrustUserChatMessage;

/** @private */
export type PubSubModActionMessage =
	| PubSubChatModActionMessage
	| PubSubChannelTermsActionMessage
	| PubSubChannelRoleChangeMessage
	| PubSubUnbanRequestMessage;

/** @private */
export type PubSubMessage =
	| PubSubAutoModQueueMessage
	| PubSubBitsMessage
	| PubSubBitsBadgeUnlockMessage
	| PubSubLowTrustUserMessage
	| PubSubModActionMessage
	| PubSubRedemptionMessage
	| PubSubSubscriptionMessage
	| PubSubUserModerationNotificationMessage
	| PubSubWhisperMessage
	| PubSubCustomMessage;
