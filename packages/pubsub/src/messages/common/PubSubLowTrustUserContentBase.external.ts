/**
 * The treatment set for the suspicious user.
 */
export type PubSubLowTrustUserTreatmentType = 'NO_TREATMENT' | 'ACTIVE_MONITORING' | 'RESTRICTED';

/**
 * A ban evasion likelihood value (if any) that as been applied to the user automatically by Twitch.
 */
export type PubSubLowTrustUserBanEvasionEvaluationType =
	| 'UNKNOWN_EVADER'
	| 'UNLIKELY_EVADER'
	| 'LIKELY_EVADER'
	| 'POSSIBLE_EVADER'
	| '';

/**
 * User types (if any) that apply to the suspicious user.
 */
export type PubSubLowTrustUserType =
	| 'UNKNOWN_TYPE'
	| 'MANUALLY_ADDED'
	| 'DETECTED_BAN_EVADER'
	| 'BANNED_IN_SHARED_CHANNEL';

/** @private */
export interface PubSubLowTrustUserContentBase {
	low_trust_id: string;
	channel_id: string;
	updated_by: {
		id: string;
		login: string;
		display_name: string;
	};
	updated_at: string;
	treatment: PubSubLowTrustUserTreatmentType;
	types: PubSubLowTrustUserType[];
	ban_evasion_evaluation: PubSubLowTrustUserBanEvasionEvaluationType;
	evaluated_at: string;
}
