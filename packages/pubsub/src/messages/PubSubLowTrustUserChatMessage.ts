import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import {
	type PubSubLowTrustUserChatMessageData,
	type PubSubLowTrustUserChatMessageContentFragmentData
} from './PubSubLowTrustUserChatMessage.external';
import {
	type PubSubLowTrustUserBanEvasionEvaluationType,
	type PubSubLowTrustUserTreatmentType,
	type PubSubLowTrustUserType
} from './common/PubSubLowTrustUserContentBase.external';

/**
 * A message that informs about a new chat message from a low-trust user.
 */
@rtfm<PubSubLowTrustUserChatMessage>('pubsub', 'PubSubLowTrustUserChatMessage', 'lowTrustId')
export class PubSubLowTrustUserChatMessage extends DataObject<PubSubLowTrustUserChatMessageData> {
	/**
	 * The ID of the channel where the suspicious user was present.
	 */
	get channelId(): string {
		return this[rawDataSymbol].data.low_trust_user.channel_id;
	}

	/**
	 * Unique ID for this low trust chat message.
	 */
	get lowTrustId(): string {
		return this[rawDataSymbol].data.low_trust_user.low_trust_id;
	}

	/**
	 * The user ID of the moderator.
	 */
	get userId(): string {
		return this[rawDataSymbol].data.low_trust_user.updated_by.id;
	}

	/**
	 * The name of the moderator.
	 */
	get userName(): string {
		return this[rawDataSymbol].data.low_trust_user.updated_by.login;
	}

	/**
	 * The display name of the moderator.
	 */
	get userDisplayName(): string {
		return this[rawDataSymbol].data.low_trust_user.updated_by.display_name;
	}

	/**
	 * The date of when the treatment was updated for the suspicious user.
	 */
	get updateDate(): Date {
		return new Date(this[rawDataSymbol].data.low_trust_user.updated_at);
	}

	/**
	 * The user ID of the suspicious user.
	 */
	get senderUserId(): string {
		return this[rawDataSymbol].data.low_trust_user.sender.user_id;
	}

	/**
	 * The name of the suspicious user.
	 */
	get senderUserName(): string {
		return this[rawDataSymbol].data.low_trust_user.sender.login;
	}

	/**
	 * The display name of the suspicious user.
	 */
	get senderDisplayName(): string {
		return this[rawDataSymbol].data.low_trust_user.sender.display_name;
	}

	/**
	 * The treatment set for the suspicious user.
	 */
	get treatment(): PubSubLowTrustUserTreatmentType {
		return this[rawDataSymbol].data.low_trust_user.treatment;
	}

	/**
	 * User types (if any) that apply to the suspicious user.
	 */
	get types(): PubSubLowTrustUserType[] {
		return this[rawDataSymbol].data.low_trust_user.types;
	}

	/**
	 * The ban evasion likelihood value that as been applied to the user automatically by Twitch.
	 *
	 * Can be an empty string.
	 */
	get banEvasionEvaluation(): PubSubLowTrustUserBanEvasionEvaluationType {
		return this[rawDataSymbol].data.low_trust_user.ban_evasion_evaluation;
	}

	/**
	 * The date for the first time the suspicious user was automatically evaluated by Twitch.
	 *
	 * Will be `null` if {@link PubSubLowTrustUserTreatmentMessage#banEvasionEvaluation} is empty.
	 */
	get evaluationDate(): Date | null {
		// PubSub sends `0001-01-01T00:00:00.000Z` string
		// if the field is not applicable
		const date = this[rawDataSymbol].data.low_trust_user.evaluated_at
			? new Date(this[rawDataSymbol].data.low_trust_user.evaluated_at)
			: undefined;

		return date && date.getTime() > 0 ? date : null;
	}

	/**
	 * A list of channel IDs where the suspicious user is also banned.
	 */
	get sharedBanChannelIds(): string[] | null {
		return this[rawDataSymbol].data.low_trust_user.shared_ban_channel_ids;
	}

	/**
	 * The ID of the chat message.
	 */
	get messageId(): string {
		return this[rawDataSymbol].data.message_id;
	}

	/**
	 * Plain text of the message sent.
	 */
	get content(): string {
		return this[rawDataSymbol].data.message_content.text;
	}

	/**
	 * Fragments contained in the message, including emotes.
	 */
	get fragments(): PubSubLowTrustUserChatMessageContentFragmentData[] {
		return this[rawDataSymbol].data.message_content.fragments;
	}

	/**
	 * Date when the chat message was sent.
	 */
	get sendDate(): Date {
		return new Date(this[rawDataSymbol].data.sent_at);
	}
}
