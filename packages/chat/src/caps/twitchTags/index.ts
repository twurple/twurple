import type { Capability } from 'ircv3';
import { ClearMsg } from './messageTypes/ClearMsg.js';
import { GlobalUserState } from './messageTypes/GlobalUserState.js';

/**
 * This capability mostly just adds tags to existing commands.
 *
 * @internal
 */
export const TwitchTagsCapability: Capability = {
	name: 'twitch.tv/tags',
	messageTypes: [GlobalUserState, ClearMsg],
};
