import { mapNullable } from '@d-fischer/shared-utils';
import { PrivateMessage } from '@twurple/chat';
import { randomUUID } from 'crypto';
import { isChannel } from 'ircv3';
import { CommandHandler, type Server, type User } from 'ircv3-server';

export class TwitchPrivmsgHandler extends CommandHandler<PrivateMessage> {
	constructor() {
		super(PrivateMessage);
	}

	handleCommand(cmd: PrivateMessage, user: User, server: Server): void {
		if (isChannel(cmd.params.target)) {
			const channel = server.getChannelByName(cmd.params.target);

			if (channel) {
				const [command, ...args] = cmd.params.content.split(' ');
				switch (command) {
					case 'bits': {
						const amount = mapNullable(args[0], Number) ?? 100;
						channel.broadcastMessage(
							PrivateMessage,
							{
								target: channel.name,
								content: `cheer${amount}`
							},
							{
								nick: 'tmi.twitch.tv'
							},
							{
								customTags: new Map<string, string>([
									['badge-info', ''],
									['badges', ''],
									['bits', amount.toString()],
									['color', ''],
									['display-name', user.nick!],
									['emotes', ''],
									['flags', ''],
									['id', randomUUID()],
									['mod', '0'],
									['room-id', '1'],
									['subscriber', '0'],
									['tmi-sent-ts', Date.now().toString()],
									['turbo', '0'],
									['user-id', '1'],
									['user-type', '']
								])
							}
						);
						break;
					}
					default: {
						channel.broadcastMessage(PrivateMessage, {
							target: channel.name,
							content: `Command unknown: ${command}`
						});
					}
				}
			} else {
				// ignore
			}
		} else {
			// ignore
		}
	}
}
