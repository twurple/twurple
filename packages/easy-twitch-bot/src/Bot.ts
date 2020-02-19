import { ResolvableValue } from '@d-fischer/shared-utils';
import TwitchClient, { AuthProvider } from 'twitch';
import ChatClient, { LogLevel, PrivateMessage } from 'twitch-chat-client';
import BotCommand, { BotCommandMatch } from './BotCommand';
import BotCommandContext from './BotCommandContext';

interface BotConfig {
	auth?: string | AuthProvider;
	client?: TwitchClient;
	debug?: boolean;
	channel?: string;
	channels?: ResolvableValue<string[]>;
	commands?: BotCommand[];
	prefix?: string;
}

export default class Bot {
	readonly chat: ChatClient;
	private readonly _commands = new Map<string, BotCommand>();
	private readonly _prefix: string;

	static async create(config: BotConfig) {
		const { auth } = config;
		let twitchClient: TwitchClient;
		if (config.client) {
			twitchClient = config.client;
		} else if (auth) {
			if (typeof auth === 'string') {
				const info = await TwitchClient.getTokenInfo(auth);
				twitchClient = TwitchClient.withCredentials(info.clientId, auth, info.scopes);
			} else {
				twitchClient = new TwitchClient({ authProvider: auth });
			}
		} else {
			throw new Error("didn't pass client nor auth option, exiting");
		}

		return new this(twitchClient, config);
	}

	private constructor(public readonly api: TwitchClient, { channel, channels, debug, commands, prefix }: BotConfig) {
		this._prefix = prefix ?? '!';
		let resolvableChannels: ResolvableValue<string[]> | undefined;
		if (channel) {
			resolvableChannels = [channel];
		} else if (channels) {
			resolvableChannels = channels;
		}

		if (!resolvableChannels) {
			throw new Error("didn't pass channel nor channels option, exiting");
		}

		this._commands = new Map<string, BotCommand>(commands?.map(cmd => [cmd.name, cmd]));

		this.chat = ChatClient.forTwitchClient(api, { logLevel: debug ? LogLevel.DEBUG2 : LogLevel.ERROR, channels });

		this.chat.onPrivmsg(async (currentChannel, user, message, msg) => {
			const match = this.findMatch(msg);
			if (match !== null) {
				await match.command.execute(match.params, new BotCommandContext(this.chat, msg));
			}
		});

		this.chat.connect();
	}

	private findMatch(msg: PrivateMessage): BotCommandMatch | null {
		const line = msg.params.message.trim().replace(/  +/g, ' ');
		for (const command of this._commands.values()) {
			const params = command.match(line, this._prefix);
			if (params !== null) {
				return {
					command,
					params
				};
			}
		}
		return null;
	}
}
