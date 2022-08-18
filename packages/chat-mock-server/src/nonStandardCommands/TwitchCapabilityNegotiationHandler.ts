import { type MessageTypes } from 'ircv3';
import { CapabilityNegotiationHandler, type SendResponseCallback, type Server, type User } from 'ircv3-server';

export class TwitchCapabilityNegotiationHandler extends CapabilityNegotiationHandler {
	handleCommand(
		cmd: MessageTypes.Commands.CapabilityNegotiation,
		user: User,
		server: Server,
		respond: SendResponseCallback
	): void {
		super.handleCommand(cmd, user, server, respond);

		// don't ever wait for CAP END
		user.capabilitiesNegotiating = false;
	}
}
