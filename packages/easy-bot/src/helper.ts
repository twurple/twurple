import { BotCommand } from './BotCommand';
import type { BotCommandContext } from './BotCommandContext';

export function createBotCommand(
	commandName: string,
	handler: (params: string[], context: BotCommandContext) => void | Promise<void>
): BotCommand {
	return new (class extends BotCommand {
		name = commandName;

		async execute(params: string[], context: BotCommandContext) {
			await handler(params, context);
		}
	})();
}
