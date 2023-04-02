import { BotCommand } from './BotCommand';
import { type BotCommandContext } from './BotCommandContext';

/**
 * Options for a bot command.
 */
export interface CreateBotCommandOptions {
	/**
	 * The cooldown of the command for everyone, in seconds.
	 */
	globalCooldown?: number;

	/**
	 * The cooldown of the command per user, in seconds.
	 */
	userCooldown?: number;

	/**
	 * The interval in which expired cooldown data should be cleared, in seconds. Defaults to 10 minutes.
	 */
	cooldownCleanupRate?: number;
}

/**
 * Creates a simple bot command.
 *
 * @meta category main
 *
 * @expandParams
 *
 * @param commandName The name of the command.
 * @param handler The execution handler that should be called when the command is sent.
 * @param options
 */
export function createBotCommand(
	commandName: string,
	handler: (params: string[], context: BotCommandContext) => void | Promise<void>,
	options: CreateBotCommandOptions = {}
): BotCommand {
	return new (class extends BotCommand {
		name = commandName;

		private readonly _allowedExecutionPerChannel = new Map<string, number>();
		private readonly _allowedExecutionPerChannelUser = new Map<string, number>();

		constructor(private readonly _options: CreateBotCommandOptions) {
			super();

			setInterval(() => {
				const now = Date.now();
				for (const [key, time] of this._allowedExecutionPerChannel) {
					if (now > time) {
						this._allowedExecutionPerChannel.delete(key);
					}
				}

				for (const [key, time] of this._allowedExecutionPerChannelUser) {
					if (now > time) {
						this._allowedExecutionPerChannelUser.delete(key);
					}
				}
			}, (this._options.cooldownCleanupRate ?? 600) * 1000).unref();
		}

		canExecute(channelId: string, userId: string): boolean {
			const now = Date.now();

			if (options.globalCooldown) {
				const globalAllowedExecutionTime = this._allowedExecutionPerChannel.get(channelId);
				if (globalAllowedExecutionTime !== undefined && now < globalAllowedExecutionTime) {
					return false;
				}
			}

			if (options.userCooldown) {
				const userAllowedExecutionTime = this._allowedExecutionPerChannelUser.get(`${channelId}:${userId}`);
				if (userAllowedExecutionTime !== undefined && now < userAllowedExecutionTime) {
					return false;
				}
			}

			return true;
		}

		async execute(params: string[], context: BotCommandContext) {
			const now = Date.now();

			if (this._options.globalCooldown) {
				this._allowedExecutionPerChannel.set(context.broadcasterId, now + this._options.globalCooldown * 1000);
			}
			if (this._options.userCooldown) {
				this._allowedExecutionPerChannelUser.set(
					`${context.broadcasterId}:${context.userId}`,
					now + this._options.userCooldown * 1000
				);
			}

			await handler(params, context);
		}
	})(options);
}
