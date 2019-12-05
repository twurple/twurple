import BotCommand from './BotCommand';
import BotCommandContext from './BotCommandContext';

export function createBotCommand(
	commandName: string,
	handler: (params: string[], context: BotCommandContext) => void | Promise<void>
) {
	return new (class extends BotCommand {
		name = commandName;

		execute(params: string[], context: BotCommandContext) {
			return handler(params, context);
		}
	})();
}
