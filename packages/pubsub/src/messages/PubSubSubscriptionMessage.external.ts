import { type PubSubBasicMessageInfo, type PubSubChatMessage } from './PubSubMessage.external';

/** @private */
export interface PubSubSubscriptionDetail {
	context: 'sub' | 'resub';
	cumulative_months: number;
	streak_months: number;
}

/** @private */
export interface PubSubSubscriptionGiftDetail {
	context: 'subgift' | 'anonsubgift' | 'resubgift' | 'anonresubgift';
	recipient_id: string;
	recipient_user_name: string;
	recipient_display_name: string;
	months: number;
	multi_month_duration: number;
}

/** @private */
export type PubSubSubscriptionMessageData = PubSubBasicMessageInfo & {
	display_name: string;
	sub_plan: 'Prime' | '1000' | '2000' | '3000';
	sub_plan_name: string;
	sub_message: PubSubChatMessage;
} & (PubSubSubscriptionDetail | PubSubSubscriptionGiftDetail);
