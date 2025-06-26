import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import {
	type EventSubChannelAutomaticRewardData,
	type EventSubChannelAutomaticRewardEmoteData,
	type EventSubChannelAutomaticRewardType,
} from './EventSubChannelAutomaticReward.external';

/**
 * An object that contains the reward information.
 */
@rtfm('eventsub-base', 'EventSubChannelAutomaticReward')
export class EventSubChannelAutomaticReward extends DataObject<EventSubChannelAutomaticRewardData> {
	/**
	 * The type of reward.
	 */
	get type(): EventSubChannelAutomaticRewardType {
		return this[rawDataSymbol].type;
	}

	/**
	 * Number of channel points used.
	 */
	get channelPoints(): number {
		return this[rawDataSymbol].channel_points;
	}

	/**
	 * Emote associated with the reward, or `null` if the reward is not related to emotes.
	 */
	get emote(): EventSubChannelAutomaticRewardEmoteData | null {
		return this[rawDataSymbol].emote;
	}
}
