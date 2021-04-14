import type { Capability } from 'ircv3';
import { ClearMsg } from './MessageTypes/ClearMsg';
import { GlobalUserState } from './MessageTypes/GlobalUserState';

/**
 * This capability mostly just adds tags to existing commands.
 *
 * @private
 */
export const TwitchTagsCapability: Capability = {
	name: 'twitch.tv/tags',
	messageTypes: [GlobalUserState, ClearMsg]
};
