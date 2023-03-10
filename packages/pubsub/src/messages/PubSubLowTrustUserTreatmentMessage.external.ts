import { type PubSubLowTrustUserContentBase } from './common/PubSubLowTrustUserContentBase.external';

/** @private */
export interface PubSubLowTrustUserTreatmentMessageContent extends PubSubLowTrustUserContentBase {
	target_user_id: string;
	target_user: string;
}

/** @private */
export interface PubSubLowTrustUserTreatmentMessageData {
	type: 'low_trust_user_treatment_update';
	data: PubSubLowTrustUserTreatmentMessageContent;
}
