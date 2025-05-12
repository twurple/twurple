/**
 * The type of Power-up.
 */
export type EventSubChannelBitsUsePowerUpType = 'message_effect' | 'celebration' | 'gigantify_an_emote';

/** @private */
export interface EventSubChannelBitsUsePowerUpEmoteData {
	id: string;
	name: string;
}

/** @private */
export interface EventSubChannelBitsUsePowerUpData {
	type: EventSubChannelBitsUsePowerUpType;
	emote: EventSubChannelBitsUsePowerUpEmoteData | null;
	message_effect_id: string | null;
}
