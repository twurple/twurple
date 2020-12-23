import type { ResolvableValue } from '@d-fischer/shared-utils';
import { ApiClient } from 'twitch';
import type { AuthProvider } from 'twitch-auth';
import { getTokenInfo, StaticAuthProvider } from 'twitch-auth';
import type { PrivateMessage } from 'twitch-chat-client';
import { ChatClient, LogLevel } from 'twitch-chat-client';
import type { BotCommand, BotCommandMatch } from './BotCommand';
import { BotCommandContext } from './BotCommandContext';

export interface BotConfig {
	auth?: string | AuthProvider;
	client?: ApiClient;
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
		const { auth } = config;
		let apiClient: ApiClient;
		if (config.client) {
			apiClient = config.client;
		} else if (auth) {
			if (typeof auth === 'string') {
				const info = await getTokenInfo(auth);
				apiClient = new ApiClient({ authProvider: new StaticAuthProvider(info.clientId, auth, info.scopes) });
			} else {
				apiClient = new ApiClient({ authProvider: auth });
			}
		} else {
			throw new Error("didn't pass client nor auth option, exiting");
		}

		return new this(apiClient, config);
	}

	constructor(public readonly api: ApiClient, { channel, channels, debug, commands, prefix }: BotConfig) {
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

		this.chat = new ChatClient(api, { logLevel: debug ? LogLevel.DEBUG : LogLevel.ERROR, channels });

		this.chat.onPrivmsg(async (currentChannel, user, message, msg) => {
			const match = this.findMatch(msg);
			if (match !== null) {
				await match.command.execute(match.params, new BotCommandContext(this.chat, msg));
			}
		});

		void this.chat.connect();
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
