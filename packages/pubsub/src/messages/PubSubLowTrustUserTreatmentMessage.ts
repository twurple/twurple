import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import { type PubSubLowTrustUserTreatmentMessageData } from './PubSubLowTrustUserTreatmentMessage.external';
import {
	type PubSubLowTrustUserBanEvasionEvaluationType,
	type PubSubLowTrustUserTreatmentType,
	type PubSubLowTrustUserType
} from './common/PubSubLowTrustUserContentBase.external';

/**
 * A message that informs about treatment against a low-trust user.
 */
@rtfm<PubSubLowTrustUserTreatmentMessage>('pubsub', 'PubSubLowTrustUserTreatmentMessage', 'lowTrustId')
export class PubSubLowTrustUserTreatmentMessage extends DataObject<PubSubLowTrustUserTreatmentMessageData> {
	/**
	 * The ID of the channel where the suspicious user was present.
	 */
	get channelId(): string {
		return this[rawDataSymbol].data.channel_id;
	}

	/**
	 * The ID for the suspicious user entry, which is a combination of the channel ID where the treatment was
	 * updated and the user ID of the suspicious user.
	 */
	get lowTrustId(): string {
		return this[rawDataSymbol].data.low_trust_id;
	}

	/**
	 * The user ID of the moderator.
	 */
	get userId(): string {
		return this[rawDataSymbol].data.updated_by.id;
	}

	/**
	 * The name of the moderator.
	 */
	get userName(): string {
		return this[rawDataSymbol].data.updated_by.login;
	}

	/**
	 * The display name of the moderator.
	 */
	get userDisplayName(): string {
		return this[rawDataSymbol].data.updated_by.display_name;
	}

	/**
	 * The date of when the treatment was updated for the suspicious user.
	 */
	get updateDate(): Date {
		return new Date(this[rawDataSymbol].data.updated_at);
	}

	/**
	 * The user ID of the suspicious user
	 */
	get targetUserId(): string {
		return this[rawDataSymbol].data.target_user_id;
	}

	/**
	 * The name of the suspicious user.
	 */
	get targetUserName(): string {
		return this[rawDataSymbol].data.target_user;
	}

	/**
	 * The treatment set for the suspicious user.
	 */
	get treatment(): PubSubLowTrustUserTreatmentType {
		return this[rawDataSymbol].data.treatment;
	}

	/**
	 * User types (if any) that apply to the suspicious user.
	 */
	get types(): PubSubLowTrustUserType[] {
		return this[rawDataSymbol].data.types;
	}

	/**
	 * A ban evasion likelihood value that as been applied to the user automatically by Twitch.
	 *
	 * Can be an empty string if Twitch did not apply any evasion value.
	 */
	get banEvasionEvaluation(): PubSubLowTrustUserBanEvasionEvaluationType {
		return this[rawDataSymbol].data.ban_evasion_evaluation;
	}

	/**
	 * The date for the first time the suspicious user was automatically evaluated by Twitch.
	 *
	 * Will be `null` if {@link PubSubLowTrustUserTreatmentMessage#banEvasionEvaluation} is empty.
	 */
	get evaluationDate(): Date | null {
		// PubSub sends `0001-01-01T00:00:00.000Z` string if the field is not applicable
		const date = this[rawDataSymbol].data.evaluated_at
			? new Date(this[rawDataSymbol].data.evaluated_at)
			: undefined;

		return date && date.getTime() > 0 ? date : null;
	}
}
