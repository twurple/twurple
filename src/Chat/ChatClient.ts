import { Client as IRCClient } from 'ircv3';
import TwitchTagsCapability from './Capabilities/TwitchTags/';
import TwitchCommandsCapability from './Capabilities/TwitchCommands/';
import TwitchMembershipCapability from './Capabilities/TwitchMembership';

export default class ChatClient extends IRCClient {
	constructor(username: string, token: string) {
		super({
			connection: {
				hostName: 'irc-ws.chat.twitch.tv',
				nick: username.toLowerCase(),
				password: `oauth:${token}`
			},
			webSocket: true
		});

		this.registerCapability(TwitchTagsCapability);
		this.registerCapability(TwitchCommandsCapability);
		this.registerCapability(TwitchMembershipCapability);
	}
}
