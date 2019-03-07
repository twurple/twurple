import { Capability } from 'ircv3';
import GlobalUserState from './MessageTypes/GlobalUserState';

/**
 * This capability mostly just adds tags to existing commands.
 *
 * @private
 */
const TwitchTagsCapability: Capability = {
	name: 'twitch.tv/tags',
	messageTypes: [GlobalUserState]
};

export default TwitchTagsCapability;
