import { MessageTypes } from 'ircv3';
import { CommandHandler, type SendResponseCallback, type Server, type User } from 'ircv3-server';

export function assertNever(value: never): never {
	throw new Error(`Unhandled value: ${JSON.stringify(value)}`);
}

export class TwitchNickChangeHandler extends CommandHandler<MessageTypes.Commands.NickChange> {
	constructor() {
		super(MessageTypes.Commands.NickChange);
		this._requiresRegistration = false;
	}

	handleCommand(
		cmd: MessageTypes.Commands.NickChange,
		user: User,
		server: Server,
		respond: SendResponseCallback
	): void {
		if (user.isRegistered) {
			respond(MessageTypes.Commands.Notice, {
				target: '*',
				content: 'NICK already set'
			});
		} else {
			const newNick = cmd.params.nick;
			const result = user.setNick(newNick);
			switch (result.result) {
				case 'invalid': {
					server.quitUser(user, 'Bye');
					break;
				}
				case 'ok': {
					user.setUserRegistration(newNick, newNick);
					break;
				}
				case 'inUse': {
					// should not happen on Twitch since collisions don't occur
					assertNever(result as never);
					break;
				}
				default:
					assertNever(result);
			}
		}
	}
}
