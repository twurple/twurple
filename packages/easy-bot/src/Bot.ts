import type { ResolvableValue } from '@d-fischer/shared-utils';
import type { AuthProvider } from '@twurple/auth';
import { getTokenInfo, StaticAuthProvider } from '@twurple/auth';
import type { PrivateMessage } from '@twurple/chat';
import { ChatClient, LogLevel } from '@twurple/chat';
import type { BotCommand, BotCommandMatch } from './BotCommand';
import { BotCommandContext } from './BotCommandContext';

export interface BotConfig {
	auth: string | AuthProvider;
	debug?: boolean;
	channel?: string;
	channels?: ResolvableValue<string[]>;
	commands?: BotCommand[];
	prefix?: string;
}

export class Bot {
	readonly chat: ChatClient;
	private readonly _commands = new Map<string, BotCommand>();
	private readonly _prefix: string;

	static async create(config: BotConfig): Promise<Bot> {
		return new this(await this._createAuthProviderForConfig(config), config);
	}

	constructor(auth: AuthProvider, { channel, channels, debug, commands, prefix }: BotConfig) {
		this._prefix = prefix ?? '!';
		const resolvableChannels = channel ? [channel] : channels;

		if (!resolvableChannels) {
			throw new Error("didn't pass channel nor channels option, exiting");
		}

		this._commands = new Map<string, BotCommand>(commands?.map(cmd => [cmd.name, cmd]));

		this.chat = new ChatClient(auth, {
			logger: { minLevel: debug ? LogLevel.DEBUG : LogLevel.ERROR },
			channels: resolvableChannels
		});

		this.chat.onPrivmsg(async (currentChannel, user, message, msg) => {
			const match = this.findMatch(msg);
			if (match !== null) {
				await match.command.execute(match.params, new BotCommandContext(this.chat, msg));
			}
		});

		void this.chat.connect();
	}

	private static async _createAuthProviderForConfig(config: BotConfig): Promise<AuthProvider> {
		if (typeof config.auth === 'string') {
			const info = await getTokenInfo(config.auth);
			return new StaticAuthProvider(info.clientId, config.auth, info.scopes);
		}
		return config.auth;
	}

	private findMatch(msg: PrivateMessage): BotCommandMatch | null {
		const line = msg.params.content.trim().replace(/  +/g, ' ');
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
