import { TwitchCommandsCapability, TwitchTagsCapability } from '@twurple/chat';
import { Message, MessageTypes } from 'ircv3';
import {
	ChannelJoinHandler,
	ChannelPartHandler,
	ClientQuitHandler,
	PingHandler,
	PongHandler,
	PrivmsgHandler,
	Server,
	type User
} from 'ircv3-server';
import { RoomStateModule } from './modules/RoomStateModule';
import { TwitchHostOverrideModule } from './modules/TwitchHostOverrideModule';
import { TwitchCapabilityNegotiationHandler } from './nonStandardCommands/TwitchCapabilityNegotiationHandler';
import { TwitchNickChangeHandler } from './nonStandardCommands/TwitchNickChangeHandler';
import { TwitchPrivmsgHandler } from './nonStandardCommands/TwitchPrivmsgHandler';
import { TwitchUserRegistrationHandler } from './nonStandardCommands/TwitchUserRegistrationHandler';

export class ChatMockServer extends Server {
	constructor() {
		super({ serverAddress: 'tmi.twitch.tv', caseMapping: 'ascii', independentUsers: true });

		this.loadModule(new TwitchHostOverrideModule());
		this.loadModule(new RoomStateModule());
	}

	sendServerSupportInfo(user: User): void {
		user.sendNumeric(MessageTypes.Numerics.Reply001Welcome, {
			welcomeText: 'Welcome, GLHF!'
		});
		user.sendNumeric(MessageTypes.Numerics.Reply002YourHost, {
			yourHost: 'Your host is tmi.twitch.tv'
		});
		user.sendNumeric(MessageTypes.Numerics.Reply003Created, {
			createdText: 'This server is rather new'
		});
		// nonstandard message
		user.sendRawMessage(
			new Message(
				'004',
				[
					{ value: user.nick!, trailing: false },
					{ value: '-', trailing: true }
				],
				undefined,
				{ nick: 'tmi.twitch.tv' },
				undefined,
				undefined,
				true,
				false
			).toString(true, true)
		);
	}

	sendMotd(user: User): void {
		user.sendNumeric(MessageTypes.Numerics.Reply375MotdStart, {
			line: '-'
		});
		user.sendNumeric(MessageTypes.Numerics.Reply372Motd, {
			line: 'You are in a maze of twisty passages, all alike.'
		});
		user.sendNumeric(MessageTypes.Numerics.Reply376EndOfMotd, {
			suffix: '>'
		});
	}

	protected addCoreCommands(): void {
		// nonstandard
		this.removeCommand(MessageTypes.Commands.UserRegistration);
		this.addCommandHandler(new TwitchUserRegistrationHandler());

		this.removeCommand(MessageTypes.Commands.PrivateMessage);
		this.addCommandHandler(new TwitchPrivmsgHandler());

		this.addCommandHandler(new TwitchNickChangeHandler());
		this.addCommandHandler(new TwitchCapabilityNegotiationHandler());

		// standard
		this.addCommandHandler(new ClientQuitHandler());
		this.addCommandHandler(new PingHandler());
		this.addCommandHandler(new PongHandler());
		this.addCommandHandler(new PrivmsgHandler());
		this.addCommandHandler(new ChannelJoinHandler());
		this.addCommandHandler(new ChannelPartHandler());
	}

	protected addCoreCapabilities(): void {
		this.addCapability(TwitchCommandsCapability);
		this.addCapability(TwitchTagsCapability);
		// membership intentionally not included
	}
}
