import { BotCommand } from './BotCommand';
import { type BotCommandContext } from './BotCommandContext';

/**
 * Creates a simple bot command.
 *
 * @meta category main
 *
 * @param commandName The name of the command.
 * @param handler The execution handler that should be called when the command is sent.
 */
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
